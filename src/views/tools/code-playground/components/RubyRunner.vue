<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'

const { t } = useI18n()
const emit = defineEmits(['output', 'error', 'ready'])

// Ruby code
const rubyCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// Ruby VM instance
let rubyVM = null

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('ruby')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      rubyCode.value = await fetchExample('ruby', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load Ruby manifest:', e)
  }
}

// Load Ruby
const loadRuby = async () => {
  if (rubyVM) return rubyVM;
  
  if (window.rubyVM) {
    rubyVM = window.rubyVM;
    isReady.value = true;
    return rubyVM;
  }

  isLoading.value = true
  loadingProgress.value = t('tools.code-playground.ruby.loading')
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const rubyBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}ruby-wasm/`;
    
    // Inject browser.umd.js
    await new Promise((resolve, reject) => {
      // Check if already exists in window
      if (window["ruby-wasm-wasi"]) return resolve();
      
      const script = document.createElement('script');
      script.src = `${rubyBase}browser.umd.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load browser.umd.js'));
      document.head.appendChild(script);
    });

    if (!window["ruby-wasm-wasi"]) {
      throw new Error('Ruby WASM script loaded but window["ruby-wasm-wasi"] not found');
    }

    loadingProgress.value = 'Initializing Ruby environment...'
    
    const { DefaultRubyVM } = window["ruby-wasm-wasi"];
    
    // Fetch and compile WASM
    const response = await fetch(`${rubyBase}ruby+stdlib.wasm`);
    if (!response.ok) throw new Error(`Failed to fetch ruby+stdlib.wasm: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    // Use WebAssembly.compile instead of instantiate for more control if needed
    const module = await WebAssembly.compile(buffer);
    
    // Initialize the VM
    const { vm } = await DefaultRubyVM(module);
    
    rubyVM = vm;
    window.rubyVM = vm;
    
    isReady.value = true
    emit('ready')
    return rubyVM
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load Ruby: ${e.message}` 
    })
    console.error(e);
    throw e
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  try {
    isLoading.value = true
    loadingProgress.value = 'Loading example...'
    rubyCode.value = await fetchExample('ruby', selectedExample.value)
  } catch (e) {
    output.value.push({ type: 'error', message: `Failed to load example: ${e.message}` })
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run Ruby code
const runRuby = async () => {
  output.value = []
  runTime.value = null
  
  try {
    // Store original console.log/err if ruby-wasm prints there
    // In many ruby-wasm versions, DefaultRubyVM.install sets up WASI to print to console
    const originalLog = console.log;
    const originalError = console.error;
    
    // Intercept console.log during execution
    console.log = (...args) => {
      originalLog(...args);
      const msg = args.join(' ');
      output.value.push({ type: 'log', message: msg });
    };
    
    console.error = (...args) => {
      originalError(...args);
      const msg = args.join(' ');
      output.value.push({ type: 'error', message: msg });
    };

    const startTime = performance.now()
    
    try {
      const vm = await loadRuby()
      // ruby-wasm vm.eval returns the result of the last expression
      vm.eval(rubyCode.value.replace(/\r/g, ''));
    } catch (evalError) {
      output.value.push({ type: 'error', message: evalError.toString() });
    } finally {
      // Restore console
      console.log = originalLog;
      console.error = originalError;
    }
    
    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)
    
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: e.message 
    })
    emit('error', e)
  }
}

// Clear output
const clearOutput = () => {
  output.value = []
  runTime.value = null
}

const getOutputColor = (type) => {
  return type === 'error' ? 'text-red-400' : 'text-blue-400'
}

onMounted(() => {
  loadManifestData()
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
            <svg class="w-5 h-5 text-red-500" viewBox="0 0 128 128" fill="currentColor">
               <path d="M3.802 99.828c.656 23.608 17.689 23.959 24.945 24.167l-16.759-39.14-8.186 14.973z" />
               <path d="M4.981 65.131l6.987 19.821 30.365-6.812L77 45.922l9.783-31.075L71.38 3.969l-26.19 9.802c-8.252 7.675-24.263 22.86-24.84 23.146-.573.291-10.575 19.195-15.369 28.214z" />
            </svg>
            <span class="font-bold text-white">Ruby 3.4</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded', 'Not loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer"
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
          @click="runRuby"
          :disabled="isLoading"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            isLoading 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
          v-model="rubyCode"
          language="ruby"
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
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center space-y-4">
          <div class="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-slate-400">{{ loadingProgress }}</div>
          <div class="text-xs text-slate-500">Initializing Ruby WASM...</div>
        </div>
      </div>

      <!-- Output Content -->
      <div v-else class="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
        <div 
          v-for="(line, idx) in output" 
          :key="idx"
          :class="['flex items-start gap-2', getOutputColor(line.type)]"
        >
          <span v-if="line.type === 'error'" class="text-red-400">✗</span>
          <span v-else class="text-green-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to execute Ruby code...
        </div>
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
