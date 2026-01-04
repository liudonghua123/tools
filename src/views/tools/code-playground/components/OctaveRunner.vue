<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'

const { t } = useI18n()

// Octave code
const octaveCode = ref('')
const selectedExample = ref('')
const manifest = ref(null)

// State
const isLoading = ref(false)
const isReady = ref(false)
const runTime = ref(null)
const statusMessage = ref('')

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('octave')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      octaveCode.value = await fetchExample('octave', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load Octave manifest:', e)
  }
}


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

// Octave
let octaveModule = null

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (window.OCTAVE) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const initOctave = async () => {
  isLoading.value = true
  statusMessage.value = t('tools.code-playground.common.loading') || 'Loading Octave...'
  
  try {
     const baseUrl = import.meta.env.BASE_URL || '/'
     const scriptUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}octave-wasm/octave.js`

     await loadScript(scriptUrl)

     if (!window.OCTAVE) {
         throw new Error('Octave script loaded but OCTAVE global not found.')
     }

     window.Module = {
         locateFile: (path) => `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}octave-wasm/${path}`,
         print: (text) => {
             if (term) term.write(text + '\r\n')
         },
         printErr: (text) => {
             if (term) term.write(`\x1b[31m${text}\x1b[0m\r\n`)
         },
         postRun: () => {
             // Initialize interpreter
             if (window.Module["execute_interp"]) {
                 try {
                     window.Module["execute_interp"]();
                     console.log('Octave interpreter initialized');
                 } catch(e) {
                     console.error('Failed to initialize interpreter:', e);
                 }
             }
             isReady.value = true
             isLoading.value = false
             statusMessage.value = ''
             console.log('Octave Ready')
         }
     }

     octaveModule = await window.OCTAVE(window.Module)
     // Usually OCTAVE(Module) returns a promise or module instance
     // Note: The snippet says OCTAVE(Module); AND Module.postRun handles init.
     // We might catch the module via return value if supported, or rely on Module object mutation.
     // In many Emscripten setups, the factory returns a Promise that resolves to the module.

  } catch (e) {
    statusMessage.value = `Failed to load Octave: ${e.message}`
    isLoading.value = false
    console.error(e)
  }
}

const runCode = async () => {
  if (!isReady.value || !octaveModule) return
  
  isLoading.value = true
  runTime.value = null
  term.clear()
  const startTime = performance.now()

  try {
      // Based on snippet: Module["eval_string"]('strcat("foo", "baz")');
      // We might need to handle stdout buffering if it's synchronous or buffered.
      
      // Attempt to run
      octaveModule.eval_string(octaveCode.value.replace(/\r/g, ''))
      
      const endTime = performance.now()
      runTime.value = (endTime - startTime).toFixed(2)
  } catch (e) {
      term.write(`\x1b[31mError: ${e.message}\x1b[0m\r\n`)
  } finally {
      isLoading.value = false
  }
}

// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  clearOutput()
  try {
    isLoading.value = true
    statusMessage.value = 'Loading example...'
    octaveCode.value = await fetchExample('octave', selectedExample.value)
  } catch (e) {
    if (term) term.write(`\x1b[31mFailed to load example: ${e.message}\x1b[0m\r\n`)
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
  await initOctave()
  loadManifestData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (term) term.dispose()
  window.removeEventListener('resize', handleResize)
  // We can't easily unload the WASM/script from global scope, 
  // but we can perhaps nullify our references.
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
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" viewBox="0 0 128 128" fill="currentColor">
                <path d="M123.965 91.902c-7.246-18.297-13.262-37.058-20.184-55.476-3.054-7.84-6.047-15.746-10.215-23.082-1.656-2.633-3.238-5.528-5.953-7.215a4.013 4.013 0 00-2.222-.606c-1.27.028-2.536.594-3.504 1.415-3.645 2.886-5.805 7.082-8.227 10.949-4.277 7.172-8.789 14.687-15.941 19.347-3.36 2.371-7.762 2.63-11 5.172-4.43 3.34-7.442 8.078-11.074 12.184-.829.988-2.11 1.383-3.227 1.918C21.578 60.93 10.738 65.336 0 69.98c9.09 7.032 18.777 13.29 28.05 20.079 2.544-.504 5.098-1.547 7.72-1.082 4.16 1.3 6.597 5.285 8.503 8.93 3.875 7.94 6.676 16.323 9.813 24.57 5.246-.375 9.969-3.079 14.027-6.258 7.809-6.324 13.758-14.5 20.305-22.047 3.14-3.3 6.34-7.23 11.05-8.149 4.762-1.152 9.864.555 13.395 3.836 4.957 4.43 9.344 9.551 15.137 12.942-.777-3.836-2.645-7.278-4.035-10.899zM42.96 79.012c-4.57 2.703-9.426 4.93-14.176 7.289-7.457-4.996-14.723-10.29-22.05-15.465 9.878-4.328 19.91-8.348 29.917-12.387 4.746 3.703 9.637 7.223 14.383 10.926-2.23 3.563-4.914 6.871-8.074 9.637zm10.168-12.414C48.414 63.058 43.64 59.609 39 55.977c2.977-4.055 6.238-7.977 10.14-11.172 2.587-1.657 5.743-2.117 8.426-3.61 6.368-3.18 10.711-9.011 14.86-14.582-5.317 13.805-10.992 27.664-19.297 39.985zm0 0" />
            </svg>
            <span class="font-bold text-white">Octave</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
            >
              <optgroup v-for="chapter in manifest?.chapters || []" :key="chapter.title" :label="chapter.title">
                <option v-for="ex in chapter.examples || []" :key="ex.path" :value="ex.path">
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
          @click="runCode"
          :disabled="isLoading || !isReady"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            (isLoading || !isReady)
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-500 text-white'
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
          v-model="octaveCode"
          language="matlab"
          theme="vs-dark"
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
/* Custom select styling to remove default arrow and add custom one */
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>
