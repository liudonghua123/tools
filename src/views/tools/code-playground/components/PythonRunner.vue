<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MonacoEditor from './MonacoEditor.vue'

const emit = defineEmits(['output', 'error', 'ready'])

// Python code
const pythonCode = ref(`# Python code runs in your browser with Pyodide
# No server required!

print("Hello from Python!")

# Basic math
result = sum(range(1, 101))
print(f"Sum of 1 to 100: {result}")

# List comprehension
squares = [x**2 for x in range(1, 11)]
print(f"Squares: {squares}")

# Dictionary example
person = {
    "name": "Alice",
    "age": 30,
    "city": "Wonderland"
}

for key, value in person.items():
    print(f"{key}: {value}")
`)

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// Pyodide instance
let pyodide = null

// Load Pyodide
const loadPyodide = async () => {
  if (pyodide) return pyodide;
  console.log('Loading Pyodide runtime...');
  
  // Check if global loadPyodide exists
  if (window.loadPyodide) {
    return await initPyodideInstance(window.loadPyodide)
  }

  isLoading.value = true
  loadingProgress.value = 'Loading Pyodide runtime...'
  
  try {
    // Get base URL for local assets
    const baseUrl = import.meta.env.BASE_URL || '/';
    const pyodideBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}pyodide/`;
    
    // Inject script tag
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${pyodideBase}pyodide.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load pyodide.js script'));
      document.head.appendChild(script);
    });

    loadingProgress.value = 'Initializing Python environment...'
    
    if (!window.loadPyodide) {
      throw new Error('Pyodide script loaded but loadPyodide not found in window');
    }

    return await initPyodideInstance(window.loadPyodide, pyodideBase)
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load Pyodide: ${e.message}` 
    })
    throw e
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Helper to initialize instance
const initPyodideInstance = async (loader, pyodidePath) => {
  pyodide = await loader({
    indexURL: pyodidePath
  })
  
  // Redirect stdout/stderr
  pyodide.setStdout({
    batched: (msg) => {
      output.value.push({ type: 'log', message: msg })
    }
  })
  
  pyodide.setStderr({
    batched: (msg) => {
      output.value.push({ type: 'error', message: msg })
    }
  })
  
  isReady.value = true
  emit('ready')
  return pyodide
}

// Run Python code
const runPython = async () => {
  output.value = []
  runTime.value = null
  
  try {
    const py = await loadPyodide()
    
    const startTime = performance.now()
    
    // Run the code
    await py.runPythonAsync(pythonCode.value)
    
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

// Get output color
const getOutputColor = (type) => {
  return type === 'error' ? 'text-red-400' : 'text-emerald-400'
}
</script>

<template>
  <div class="flex h-full">
    <!-- Editor -->
    <div class="w-1/2 flex flex-col border-r border-slate-700">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93V4.07z"/>
          </svg>
          <span class="font-bold text-white">Python</span>
          <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">Ready</span>
          <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">Not loaded</span>
        </div>
        <button 
          @click="runPython"
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
          {{ isLoading ? 'Loading...' : 'Run' }}
        </button>
      </div>

      <!-- Editor -->
      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="pythonCode"
          language="python"
          theme="vs-dark"
          height="100%"
          :minimap="false"
        />
      </div>
    </div>

    <!-- Output -->
    <div class="w-1/2 flex flex-col bg-slate-900">
      <!-- Output Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Output</span>
          <span v-if="runTime" class="text-xs text-slate-500">{{ runTime }}ms</span>
        </div>
        <button 
          @click="clearOutput"
          class="text-xs text-slate-500 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center space-y-4">
          <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-slate-400">{{ loadingProgress }}</div>
          <div class="text-xs text-slate-500">First load may take a few seconds...</div>
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
          <span v-else class="text-emerald-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to execute Python code...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
