<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { Wasmer, init, Directory } from "@wasmer/sdk";
import wasmerSDKModule from "@wasmer/sdk/wasm?url";
import { untar } from "@andrewbranch/untar.js";

const { t } = useI18n()
const emit = defineEmits(['ready'])

// COBOL code
const cobolCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const isLoading = ref(false)
const isReady = ref(false)
const runTime = ref(null)
const statusMessage = ref('')

// Terminal
let term = null
let fitAddon = null
const terminalContainer = ref(null)

const initTerminal = () => {
    term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
            background: '#0f172a',
            foreground: '#e2e8f0'
        }
    })
    fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(terminalContainer.value)
    fitAddon.fit()
    term.write('\x1b[38;5;244mResult will appear here...\x1b[0m\r\n')
}

// Wasmer State
let pkg = null; // Container for WASM modules

const initCobol = async () => {
    isLoading.value = true
    statusMessage.value = 'Initializing Wasmer...'
    try {
        await init({ module: wasmerSDKModule });
        
        statusMessage.value = 'Downloading System Root...'
        // Download sysroot
        const sysrootRes = await fetch(`${import.meta.env.BASE_URL}cobol-wasm/sysroot.tar`);
        const sysrootBuffer = await sysrootRes.arrayBuffer();
        
        statusMessage.value = 'Extracting System Root...'
        const sysrootFiles = await untar(sysrootBuffer);
        
        // Partition files
        const sysrootFilesMap = {};
        const libFilesMap = {};
        const rootFilesMap = {};

        for (const file of sysrootFiles) {
            // sysroot.tar structure: 
            // sysroot32/... -> /sysroot/...
            // lib-small/... -> /lib/...
            if (file.filename.startsWith('sysroot32/')) {
                 const relPath = file.filename.replace('sysroot32/', '');
                 if (file.fileData && file.fileData.byteLength > 0) {
                      sysrootFilesMap[relPath] = new Uint8Array(file.fileData);
                 }
            } else if (file.filename.startsWith('lib-small/')) {
                 const relPath = file.filename.replace('lib-small/', '');
                 if (file.fileData && file.fileData.byteLength > 0) {
                      libFilesMap[relPath] = new Uint8Array(file.fileData);
                 }
            } else {
                 if (file.fileData && file.fileData.byteLength > 0) {
                     rootFilesMap[file.filename] = new Uint8Array(file.fileData);
                 }
            }
        }

        // Fetch binaries
        statusMessage.value = 'Downloading Compilers...'
        const [cobcWasm, clangWasm, wasmLdWasm] = await Promise.all([
             fetch(`${import.meta.env.BASE_URL}cobol-wasm/cobc`).then(r => r.arrayBuffer()),
             fetch(`${import.meta.env.BASE_URL}cobol-wasm/clang`).then(r => r.arrayBuffer()),
             fetch(`${import.meta.env.BASE_URL}cobol-wasm/wasm-ld`).then(r => r.arrayBuffer())
        ]);
        
        // We store modules and filesystem maps for run time
        pkg = {
             cobc: new Uint8Array(cobcWasm),
             clang: new Uint8Array(clangWasm),
             wasmld: new Uint8Array(wasmLdWasm),
             sysrootFiles: sysrootFilesMap,
             libFiles: libFilesMap,
             rootFiles: rootFilesMap
        };

        isReady.value = true
        statusMessage.value = ''
        emit('ready')
        
    } catch (e) {
        console.error("Wasmer Init Error", e);
        statusMessage.value = 'Failed to initialize: ' + e.message;
        term.write(`\r\n\x1b[31mError initializing: ${e.message}\x1b[0m\r\n`)
    } finally {
        isLoading.value = false
    }
}

const runCobol = async () => {
    if (!pkg || !isReady.value) return;

    isLoading.value = true;
    statusMessage.value = 'Compiling...';
    term.clear();
    const startTime = performance.now();

    try {
        // Construct directories based on partitioned data
        const sysrootDir = new Directory(pkg.sysrootFiles);
        const libDir = new Directory(pkg.libFiles);
        const rootDir = new Directory(pkg.rootFiles); // "."
        
        // Write main.cob to root
        await rootDir.writeFile("test.cob", new TextEncoder().encode(cobolCode.value));
        
        // 1. Run COBC
        // cobc -C -x test.cob -o test.c (Relative to mounted root)
        term.write("Running cobc...\r\n");
        const cobcPkg = await Wasmer.fromFile(pkg.cobc);
        const cobcInstance = await cobcPkg.entrypoint.run({
            args: ["-C", "-x", "/test.cob", "-o", "/test.c"],
            mount: {
                "/": rootDir,
                "/sysroot": sysrootDir, // For COB_CONFIG_DIR
                "/lib": libDir
            },
            env: {
                "COB_CONFIG_DIR": "/sysroot/share/gnucobol/config"
            },
            cwd: '/',
        });
        
        const cobcResult = await cobcInstance.wait();
        
        // Check for cobc failure
        if (cobcResult.code !== 0) {
            term.write(cobcResult.stderr); 
            throw new Error(`cobc failed with code ${cobcResult.code}`);
        }
        term.write("cobc done.\r\n");

        // 2. Run Clang
        // clang ... -o test.o -x c test.c
        term.write("Running clang...\r\n");
        const clangPkg = await Wasmer.fromFile(pkg.clang);
        const clangInstance = await clangPkg.entrypoint.run({
            args: [
                "-cc1", "-triple", "wasm32-unknown-wasi", "-emit-obj", "-disable-free",
                "-isysroot", "/sysroot",
                "-internal-isystem", "/lib/clang/16/include",
                "-internal-isystem", "/sysroot/include/wasm32-wasi",
                "-internal-isystem", "/sysroot/include",
                "-ferror-limit", "19", 
                "-o", "/test.o", "-x", "c", "/test.c"
            ],
            mount: {
                "/": rootDir,
                "/sysroot": sysrootDir,
                "/lib": libDir
            },
            cwd: '/',
        });
        
        const clangResult = await clangInstance.wait();
        
        if (clangResult.code !== 0) {
             term.write(clangResult.stderr);
             throw new Error(`clang failed with code ${clangResult.code}`);
        }
        term.write("clang done.\r\n");
        
        // 3. Run Wasm-ld
        term.write("Running wasm-ld...\r\n");
        const wasmldPkg = await Wasmer.fromFile(pkg.wasmld);
        const wasmldInstance = await wasmldPkg.entrypoint.run({
            args: [
                 "-m", "wasm32", 
                 "-L/sysroot/lib", "-L/sysroot/lib/wasm32-wasi", "/sysroot/lib/wasm32-wasi/crt1-command.o",
                 "--export-dynamic", "--export=__heap_base", "--export=__stack_pointer", "--export=__data_end",
                 "-lpthread", "-lc", "/lib/clang/16/lib/wasi/libclang_rt.builtins-wasm32.a",
                 "/test.o",
                 "-lc", "-lcob", "-lgmp", "-lm", 
                 "-o", "/test.wasm"
            ],
            mount: {
                "/": rootDir,
                "/sysroot": sysrootDir,
                "/lib": libDir
            },
            cwd: '/',
        });

        const ldResult = await wasmldInstance.wait();

         if (ldResult.code !== 0) {
             term.write(ldResult.stderr);
             throw new Error(`wasm-ld failed with code ${ldResult.code}`);
        }
        term.write("Linking done.\r\n");
        
        // 4. Run Result
        const testWasm = await rootDir.readFile("test.wasm");
        term.write("Running program...\r\n");
        
        const appInstance = await Wasmer.fromFile(testWasm);
        const appRun = await appInstance.entrypoint.run({
             mount: {
                 // Runtime might need files? Usually not for simple hello world unless input/output involved
                 // But let's keep consistency? Or strict containment?
                 // Minimal mount for app
             }
        });
        
        const appResult = await appRun.wait();
        term.write(appResult.stdout);
        
        const endTime = performance.now();
        runTime.value = (endTime - startTime).toFixed(2);
        
    } catch (e) {
        console.error(e);
        term.write(`\r\n\x1b[31mError: ${e.message}\x1b[0m\r\n`);
    } finally {
        isLoading.value = false;
        statusMessage.value = '';
    }
}


// Example Loading
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('cobol')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      cobolCode.value = await fetchExample('cobol', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load COBOL manifest:', e)
  }
}

const onExampleChange = async () => {
  if (!selectedExample.value) return
  term.clear()
  try {
    isLoading.value = true
    statusMessage.value = 'Loading example...'
    cobolCode.value = await fetchExample('cobol', selectedExample.value)
  } catch (e) {
    term.write(`\x1b[31mFailed to load example: ${e.message}\x1b[0m\r\n`)
  } finally {
    isLoading.value = false
    statusMessage.value = ''
  }
}

const clearOutput = () => {
    term.clear()
    runTime.value = null
}

onMounted(async () => {
  initTerminal()
  loadManifestData()
  await initCobol()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (term) term.dispose()
})

const handleResize = () => {
  if (fitAddon) fitAddon.fit()
}

</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-2">
            <!-- Icon -->
            <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          <span class="font-bold text-white">COBOL</span>
          <div class="relative group ml-2">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <optgroup v-for="chapter in manifest?.chapters" :key="chapter.title" :label="chapter.title">
                <option v-for="ex in chapter.examples" :key="ex.path" :value="ex.path">
                  {{ ex.name }}
                </option>
              </optgroup>
            </select>
            <div class="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
          <span v-else class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ statusMessage || 'Loading...' }}</span>
        </div>
        <button 
          @click="runCobol"
          :disabled="isLoading || !isReady"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            (isLoading || !isReady)
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          ]"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          {{ isLoading ? 'Running...' : t('tools.code-playground.common.run') }}
        </button>
      </div>

      <!-- Editor -->
      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="cobolCode"
          language="cobol"
          height="100%"
          :minimap="false"
        />
      </div>
    </div>

    <!-- Output -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700">
      <!-- Output Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('tools.code-playground.common.output') }}</span>
          <span v-if="runTime" class="text-xs text-slate-500">{{ runTime }}ms</span>
        </div>
        <button 
          @click="clearOutput"
          class="text-xs text-slate-500 hover:text-white transition-colors"
        >
          {{ t('tools.code-playground.common.clear') }}
        </button>
      </div>

      <!-- Terminal -->
      <div class="flex-1 min-h-0 p-2 bg-[#0f172a]">
        <div ref="terminalContainer" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>

<style scoped>
:deep(.xterm) {
  padding: 1rem;
}
</style>
