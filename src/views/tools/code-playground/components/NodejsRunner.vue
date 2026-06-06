<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

// Dynamic imports variables
let Wasmer, init, Directory, WasmerClass;

const { t } = useI18n()
const emit = defineEmits(['ready'])

// Node.js code
const nodejsCode = ref('')
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
let edgejsWasm = null;

const initNodejs = async () => {
    isLoading.value = true
    statusMessage.value = 'Initializing Wasmer...'
    try {
        // 1. Dynamic import Wasmer SDK
        const wasmerSDK = await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}nodejs-wasm/wasmer-sdk/index.mjs`);
        Wasmer = wasmerSDK.Wasmer;
        init = wasmerSDK.init;
        Directory = wasmerSDK.Directory;

        // Initialize Wasmer with the WASM JS bindings
        await init({ module: `${import.meta.env.BASE_URL}nodejs-wasm/wasmer-sdk/wasmer_js_bg.wasm` });

        statusMessage.value = 'Loading Node.js WASM...'

        // Fetch edgejs.wasm
        const edgejsRes = await fetch(`${import.meta.env.BASE_URL}nodejs-wasm/edgejs.wasm`);
        const edgejsBuffer = await edgejsRes.arrayBuffer();
        edgejsWasm = new Uint8Array(edgejsBuffer);

        isReady.value = true
        statusMessage.value = ''
        emit('ready')
        term.write('\x1b[32mNode.js runtime ready!\x1b[0m\r\n')

    } catch (e) {
        console.error("Wasmer Init Error", e);
        statusMessage.value = 'Failed to initialize: ' + e.message;
        term.write(`\r\n\x1b[31mError initializing: ${e.message}\x1b[0m\r\n`)
    } finally {
        isLoading.value = false
    }
}

const runNodejs = async () => {
    if (!edgejsWasm || !isReady.value) return;

    isLoading.value = true;
    statusMessage.value = 'Running...';
    term.clear();
    const startTime = performance.now();

    try {
        // Create directory with the JS code
        const srcDir = new Directory();
        await srcDir.writeFile("test.js", new TextEncoder().encode(nodejsCode.value));

        // Load the edgejs.wasm module
        const edgejsPkg = await Wasmer.fromFile(edgejsWasm);

        // Run Node.js with the test.js file
        term.write("Running Node.js code...\r\n");

        const instance = await edgejsPkg.entrypoint.run({
            args: ["node", "/test.js"],
            mount: {
                "/": srcDir,
            },
            // stdin via env to pass code directly if supported
        });

        const result = await instance.wait();

        if (result.stdout) {
            term.write(result.stdout);
        }
        if (result.stderr) {
            term.write(`\x1b[31m${result.stderr}\x1b[0m`);
        }

        if (result.code !== 0) {
            term.write(`\r\n\x1b[33mProgram exited with code ${result.code}\x1b[0m\r\n`);
        }

        const endTime = performance.now();
        runTime.value = (endTime - startTime).toFixed(2);
        term.write(`\r\n\x1b[38;5;244mCompleted in ${runTime.value}ms\x1b[0m\r\n`);

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
    const data = await fetchManifest('nodejs')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      nodejsCode.value = await fetchExample('nodejs', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load Node.js manifest:', e)
  }
}

const onExampleChange = async () => {
  if (!selectedExample.value) return
  term.clear()
  try {
    isLoading.value = true
    statusMessage.value = 'Loading example...'
    nodejsCode.value = await fetchExample('nodejs', selectedExample.value)
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
  await initNodejs()
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
            <!-- Node.js Icon -->
            <svg class="w-5 h-5 text-green-500" viewBox="0 0 256 256" fill="currentColor">
                <path d="M212.553 169.054l-71.204-40.807a15.998 15.998 0 0 0-15.698 0l-71.205 40.807a15.995 15.995 0 0 0-7.927 14.09v81.626a15.995 15.995 0 0 0 7.927 14.09l71.205 40.807a15.998 15.998 0 0 0 15.698 0l71.204-40.807a15.995 15.995 0 0 0 7.927-14.09v-81.626a15.995 15.995 0 0 0-7.927-14.09zm-80.446-5.936a4.002 4.002 0 0 1 3.918 0l71.204 40.807a4.998 4.998 0 0 1 2.479 4.406v81.626a4.998 4.998 0 0 1-2.479 4.406l-71.204 40.807a3.999 3.999 0 0 1-3.918 0l-71.204-40.807a4.998 4.998 0 0 1-2.479-4.406v-81.626a4.998 4.998 0 0 1 2.479-4.406l71.204-40.807z"/>
                <path d="M140.102 184.868c26.301 0 42.255-12.173 42.255-32.446 0-15.021-11.033-24.803-34.15-27.49l-8.588-.992c-10.747-1.26-12.842-4.448-12.842-8.342 0-4.2 3.15-7.35 11.032-7.35 8.636 0 13.353 3.15 14.353 10.497h15.023c-.849-17.851-13.203-28.132-30.377-28.132-16.921 0-29.526 9.453-29.526 24.807 0 19.273 14.105 24.305 30.626 26.244l8.588.994c9.447 1.106 13.1 4.153 13.1 8.347 0 4.994-4.353 8.489-12.23 8.489-10.252 0-15.771-4.348-17.271-11.54H111.62c1.501 19.576 15.024 26.914 28.482 26.914zm-44.254-43.83v-36.71l-15.023 8.489v28.221h-14.605v18.742h14.605v20.241c0 11.033 4.353 16.918 18.242 16.918 5.253 0 9.95-.5 13.85-1.254v-16.424c-2.9.5-5.251.75-7.098.75-4.353 0-5.753-1.752-5.753-6.504v-31.727h16.674l2.398-18.742H95.848z"/>
            </svg>
          <span class="font-bold text-white">Node.js (WASM)</span>
          <div class="relative group ml-2">
            <select
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all cursor-pointer"
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
          @click="runNodejs"
          :disabled="isLoading || !isReady"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            (isLoading || !isReady)
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white'
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
          v-model="nodejsCode"
          language="javascript"
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