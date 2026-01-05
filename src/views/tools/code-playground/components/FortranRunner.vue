<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// Code
const fortranCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// LFortran runtime
let lfortranModule = null
let emitWasm = null

// WASM Memory for simulation
let wasmMemory = null

// ANSI escape code stripper
const stripAnsi = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('fortran')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      fortranCode.value = await fetchExample('fortran', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load Fortran manifest:', e)
  }
}

// Load LFortran Runtime
const loadRuntime = async () => {
  if (isReady.value) return;
  
  isLoading.value = true
  loadingProgress.value = 'Loading LFortran compiler...'
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const fortranBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}fortran-wasm/`;
    
    // Setup Module for Emscripten
    window.Module = {
      print: (text) => {
        console.log('LFortran log:', text);
        output.value.push({ type: 'log', message: stripAnsi(text) });
      },
      printErr: (text) => {
        console.error('LFortran error:', text);
        output.value.push({ type: 'error', message: stripAnsi(text) });
      },
      locateFile: (path) => {
        if (path.endsWith('.wasm')) return `${fortranBase}lfortran.wasm`;
        if (path.endsWith('.data')) return `${fortranBase}lfortran.data`;
        return path;
      },
      onRuntimeInitialized: () => {
        try {
          emitWasm = window.Module.cwrap('emit_wasm_from_source', 'string', ['string']);
          isReady.value = true
          emit('ready')
          isLoading.value = false
          loadingProgress.value = ''
        } catch (err) {
          console.error('Failed to wrap LFortran functions:', err);
          output.value.push({ type: 'error', message: `Initialization error: ${err.message}` });
        }
      }
    };

    // Load lfortran.js
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${fortranBase}lfortran.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load lfortran.js'));
      document.head.appendChild(script);
    });

  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load LFortran runtime: ${e.message}` 
    })
    console.error(e)
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run Fortran code
const runFortran = async () => {
  if (!isReady.value) {
    await loadRuntime();
  }
  
  if (!emitWasm) {
    output.value.push({ type: 'error', message: 'LFortran compiler not ready' });
    return;
  }

  output.value = []
  runTime.value = null
  isLoading.value = true
  loadingProgress.value = 'Compiling...'
  
  try {
    const startTime = performance.now()
    
    // 1. Compile to WASM string (comma separated bytes)
    // The format is: exit_code,byte1,byte2,...
    const wasmStr = emitWasm(fortranCode.value.replace(/\r/g, ''))
    const compileEndTime = performance.now()
    const durationCompile = (compileEndTime - startTime).toFixed(2)

    if (!wasmStr) {
       throw new Error('Compilation failed: no response from compiler');
    }
    
    const parts = wasmStr.split(',');
    const exitCode = parts[0];
    
    if (exitCode !== '0') {
       const compileResult = parts.slice(1);
       let errorMessage = '';
       
       // If the result contains byte values, decode them
       const isBytes = compileResult.length > 0 && compileResult.every(p => /^\d+$/.test(p.trim()));
       if (isBytes) {
         try {
           const errorBytes = new Uint8Array(compileResult.map(Number));
           errorMessage = new TextDecoder().decode(errorBytes);
         } catch (e) {
           errorMessage = compileResult.join(',');
         }
       } else {
         errorMessage = compileResult.join(',');
       }
       
       throw new Error(`${stripAnsi(errorMessage)}\nCompilation Time: ${durationCompile} ms`);
    }
    
    // 2. Convert to Uint8Array (skip the exit code at index 0)
    const wasmBytes = new Uint8Array(
      parts.slice(1).map(Number)
    );
    
    if (wasmBytes.length < 4 || (wasmBytes[0] !== 0 && wasmBytes[0] !== 0x00) || wasmBytes[1] !== 97 || wasmBytes[2] !== 115 || wasmBytes[3] !== 109) {
      console.error('Invalid WASM binary generated (magic word mismatch)', wasmBytes.slice(0, 8));
      throw new Error('Invalid WASM binary generated by compiler');
    }
    
    loadingProgress.value = 'Executing...'

    // 3. Prepare Import Object for WASM execution
    let stdoutBuffer = "";
    
    const printBuffer = () => {
      if (stdoutBuffer) {
        output.value.push({ type: 'log', message: stripAnsi(stdoutBuffer) });
        stdoutBuffer = "";
      }
    };

    const importObject = {
      wasi_snapshot_preview1: {
        fd_write: (fd, iovs, iovsLen, nwritten) => {
          const view = new DataView(wasmMemory.buffer);
          let written = 0;
          for (let i = 0; i < iovsLen; i++) {
            const ptr = view.getUint32(iovs + i * 8, true);
            const len = view.getUint32(iovs + i * 8 + 4, true);
            const bytes = new Uint8Array(wasmMemory.buffer, ptr, len);
            stdoutBuffer += new TextDecoder().decode(bytes);
            written += len;
          }
          view.setUint32(nwritten, written, true);
          return 0;
        },
        fd_close: () => 0,
        fd_seek: () => 0,
        proc_exit: (code) => { 
          printBuffer();
          if (code !== 0) {
            throw new Error(`Exit with code ${code}`);
          }
          // Just a marker to stop execution if necessary, 
          // but we'll catch it or let it return.
          console.log(`Program exited with code ${code}`);
        }
      },
      js: {
        cpu_time: () => Date.now() / 1000,
        show_img: (w, h, arr) => { console.log("show_img", w, h, arr) },
        show_img_color: (w, h, arr) => { console.log("show_img_color", w, h, arr) },
        // Math functions that LFortran expects in the 'js' namespace
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        atan2: Math.atan2,
        exp: Math.exp,
        log: Math.log,
        sqrt: Math.sqrt,
        abs: Math.abs,
        pow: Math.pow,
        // LFortran internal names for intrinsics occasionally mapped to JS
        _lfortran_ssin: Math.sin,
        _lfortran_sdsin: Math.sin,
        _lfortran_scos: Math.cos,
        _lfortran_sdcos: Math.cos,
        _lfortran_stex: Math.exp,
        _lfortran_sdexp: Math.exp,
        _lfortran_slon: Math.log,
        _lfortran_sdlog: Math.log,
        _lfortran_ssqrt: Math.sqrt,
        _lfortran_sdsqrt: Math.sqrt
      }
    };

    // 4. Instantiate and Run
    const { instance } = await WebAssembly.instantiate(wasmBytes, importObject);
    wasmMemory = instance.exports.memory;
    
    try {
      if (instance.exports._start) {
        instance.exports._start();
      } else if (instance.exports.main) {
        instance.exports.main();
      }
    } catch (err) {
      // If it's our own proc_exit error, handle it
      if (err.message && err.message.startsWith('Exit with code')) {
        if (err.message !== 'Exit with code 0') {
           throw err;
        }
      } else {
        throw err;
      }
    }

    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)
    
    printBuffer();
    if (output.value.length === 0) {
      output.value.push({ type: 'log', message: 'Program finished with no output.' })
    }

  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: e.message 
    })
    emit('error', e)
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  clearOutput()
  try {
    isLoading.value = true
    loadingProgress.value = 'Loading example...'
    fortranCode.value = await fetchExample('fortran', selectedExample.value)
  } catch (e) {
    output.value.push({ type: 'error', message: `Failed to load example: ${e.message}` })
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Clear output
const clearOutput = () => {
  output.value = []
  runTime.value = null
}

// Get output color
const getOutputColor = (type) => {
  return type === 'error' ? 'text-red-400' : 'text-emerald-400'
}

onMounted(() => {
  loadRuntime()
  loadManifestData()
})

onUnmounted(() => {
  // Cleanup
  if (window.Module) {
    delete window.Module;
  }
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
            </svg>
            <span class="font-bold text-white">Fortran</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
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
        </div>

        <button 
          @click="runFortran"
          :disabled="isLoading"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            isLoading 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          ]"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          {{ isLoading ? 'Loading...' : t('tools.code-playground.common.run') }}
        </button>
      </div>

      <!-- Editor -->
      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="fortranCode"
          language="fortran"
          theme="vs-dark"
          height="100%"
          :minimap="false"
        />
      </div>
    </div>

    <!-- Output -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900">
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

      <!-- Loading State -->
      <div v-if="isLoading && loadingProgress !== 'Executing...' && loadingProgress !== 'Compiling...'" class="flex-1 flex items-center justify-center">
        <div class="text-center space-y-4">
          <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-slate-400">{{ loadingProgress }}</div>
          <div class="text-xs text-slate-500">First load may take a few seconds...</div>
        </div>
      </div>

      <!-- Output Content -->
      <div v-else class="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
        <div v-if="isLoading" class="flex items-center gap-2 text-slate-400 italic animate-pulse">
           <div class="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
           {{ loadingProgress }}
        </div>
        <div 
          v-for="(line, idx) in output" 
          :key="idx"
          :class="['flex items-start gap-2', getOutputColor(line.type)]"
        >
          <span v-if="line.type === 'error'" class="text-red-400">✗</span>
          <span v-else class="text-emerald-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to execute Fortran code...
        </div>
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
