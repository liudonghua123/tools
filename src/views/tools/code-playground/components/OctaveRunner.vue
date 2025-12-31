<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const { t } = useI18n()

// Examples
const examples = {
  hello: {
    name: 'Hello World',
    code: `disp("Hello, World!");
x = 1:10;
y = x.^2;
disp("Squares:");
disp(y);
`
  },
  matrix: {
    name: 'Matrix Operations',
    code: `A = [1 2; 3 4];
B = [5 6; 7 8];
disp("A + B =");
disp(A + B);
disp("A * B =");
disp(A * B);
disp("inv(A) =");
disp(inv(A));
`
  },
  linalg: {
    name: 'Linear Algebra',
    code: `# Solving Linear Equations System
# 3x + 2y - z = 1
# 2x - 2y + 4z = -2
# -x + 0.5y - z = 0

A = [3, 2, -1; 2, -2, 4; -1, 0.5, -1];
b = [1; -2; 0];

disp("Matrix A:");
disp(A);
disp("Vector b:");
disp(b);

x = A \\ b;
disp("Solution x:");
disp(x);

disp("Check solution (A*x):");
disp(A*x);

disp("Eigenvalues of A:");
disp(eig(A));
`
  }
}

const selectedExample = ref('hello')
const octaveCode = ref(examples.hello.code)

watch(selectedExample, (newVal) => {
  if (examples[newVal]) {
    octaveCode.value = examples[newVal].code
  }
})

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
      octaveModule.eval_string(octaveCode.value)
      
      const endTime = performance.now()
      runTime.value = (endTime - startTime).toFixed(2)
  } catch (e) {
      term.write(`\x1b[31mError: ${e.message}\x1b[0m\r\n`)
  } finally {
      isLoading.value = false
  }
}

const clearOutput = () => {
  term.clear()
  runTime.value = null
}

onMounted(async () => {
  initTerminal()
  await initOctave()
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
        <div class="flex items-center gap-2">
            <!-- Icon (Generic Code or letter O) -->
            <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">O</text>
            </svg>
          <span class="font-bold text-white">Octave</span>
          <select 
            v-model="selectedExample"
            class="ml-2 bg-slate-700 text-xs text-white border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option v-for="(ex, key) in examples" :key="key" :value="key">
              {{ ex.name }}
            </option>
          </select>
          
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
