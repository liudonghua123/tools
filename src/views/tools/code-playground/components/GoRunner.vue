<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// Go examples
const examples = {
  hello: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go Playground!")
}`,
  fibonacci: `package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Fibonacci sequence (first 10):")
    for i := 0; i < 10; i++ {
        fmt.Printf("%d ", fibonacci(i))
    }
    fmt.Println()
}`,
  data_structures: `package main

import "fmt"

func main() {
    // Slices
    fruits := []string{"apple", "banana", "cherry"}
    fruits = append(fruits, "date")
    
    // Maps
    scores := map[string]int{
        "Alice": 95,
        "Bob":   88,
    }
    
    fmt.Println("Fruits:", fruits)
    fmt.Println("Scores:", scores)
    
    for name, score := range scores {
        fmt.Printf("%s scored %d\\n", name, score)
    }
}`,
  concurrency: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    fmt.Println("Starting goroutines...")
    go say("world")
    say("hello")
    time.Sleep(500 * time.Millisecond)
    fmt.Println("Done.")
}`
}

// Go code
const goCode = ref(examples.hello)

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)
const selectedExample = ref('hello')

// Go runtime instance
let go = null

// Load Go WASM
const loadGoRuntime = async () => {
  if (isReady.value) return;
  
  isLoading.value = true
  loadingProgress.value = 'Loading Go runtime...'
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const goBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}go-wasm/`;
    
    // Inject wasm_exec.js
    await new Promise((resolve, reject) => {
      if (window.Go) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `${goBase}wasm_exec.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load wasm_exec.js'));
      document.head.appendChild(script);
    });

    if (!window.Go) {
      throw new Error('Go class not found after loading wasm_exec.js');
    }

    go = new window.Go();
    
    loadingProgress.value = 'Initializing Go interpreter...'
    
    const response = await fetch(`${goBase}main.wasm`);
    const buffer = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(buffer, go.importObject);
    
    // Run the Go instance (it registers global functions like runGoCode)
    go.run(result.instance);
    
    isReady.value = true
    emit('ready')
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load Go runtime: ${e.message}` 
    })
    console.error(e)
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run Go code
const runGo = async () => {
  if (!isReady.value) {
    await loadGoRuntime();
  }
  
  if (!window.runGoCode) {
    output.value.push({ type: 'error', message: 'Go interpreter not ready (runGoCode not found)' });
    return;
  }

  output.value = []
  runTime.value = null
  
  try {
    const startTime = performance.now()
    
    // The runGoCode function returns the output as a string
    const result = window.runGoCode(goCode.value)
    
    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)
    
    if (result) {
      output.value.push({ type: 'log', message: result })
    }
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: e.message 
    })
    emit('error', e)
  }
}

// Handle example change
const onExampleChange = () => {
  if (examples[selectedExample.value]) {
    goCode.value = examples[selectedExample.value]
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
  // Pre-load Go runtime
  loadGoRuntime()
})

onUnmounted(() => {
  // Global cleanup if necessary
  // No explicit cleanup needed for wasm_exec.js/Go instance in this scope
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
            <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10,10-4.47,10-10S17.53,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M11,7h2v2h-2V7z M11,11h2v6h-2V11z"/>
            </svg>
            <span class="font-bold text-white">Go</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
            >
              <option value="hello">Hello World</option>
              <option value="fibonacci">Fibonacci</option>
              <option value="data_structures">Slices & Maps</option>
              <option value="concurrency">Concurrency</option>
            </select>
            <div class="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button 
          @click="runGo"
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
          v-model="goCode"
          language="go"
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
          <div class="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
          Click "Run" to execute Go code...
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
