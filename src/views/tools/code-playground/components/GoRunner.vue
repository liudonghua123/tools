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
            <svg class="w-5 h-5 text-cyan-400" viewBox="0 0 128 128" fill="currentColor">
              <path d="M108.2 64.8c-.1-.1-.2-.2-.4-.2l-.1-.1c-.1-.1-.2-.1-.2-.2l-.1-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1-.1 0-.1 0-.2-.1l-.3-.1c-.1 0-.1 0-.2-.1l-.3-.1h-.1l-.4-.1h-.2c-.1 0-.2 0-.3-.1h-2.3c-.6-13.3.6-26.8-2.8-39.6 12.9-4.6 2.8-22.3-8.4-14.4-7.4-6.4-17.6-7.8-28.3-7.8-10.5.7-20.4 2.9-27.4 8.4-2.8-1.4-5.5-1.8-7.9-1.1v.1c-.1 0-.3.1-.4.2-.1 0-.3.1-.4.2h-.1c-.1 0-.2.1-.4.2h-.1l-.3.2h-.1l-.3.2h-.1l-.3.2s-.1 0-.1.1l-.3.2s-.1 0-.1.1l-.3.2s-.1 0-.1.1l-.3.2-.1.1c-.1.1-.2.1-.2.2l-.1.1-.2.2-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1-.1.3s0 .1-.1.1l-.1.3s0 .1-.1.1l-.1.3s0 .1-.1.1l-.1.3s0 .1-.1.1c.4.3.4.4.4.4v.1l-.1.3v.1c0 .1 0 .2-.1.3v3.1c0 .1 0 .2.1.3v.1l.1.3v.1l.1.3s0 .1.1.1l.1.3s0 .1.1.1l.1.3s0 .1.1.1l.2.3s0 .1.1.1l.2.3s0 .1.1.1l.2.3.1.1.3.3.3.3h.1c1 .9 2 1.6 4 2.2v-.2C23 37.3 26.5 50 26.7 63c-.6 0-.7.4-1.7.5h-.5c-.1 0-.3 0-.5.1-.1 0-.3 0-.4.1l-.4.1h-.1l-.4.1h-.1l-.3.1h-.1l-.3.1s-.1 0-.1.1l-.3.1-.2.1c-.1 0-.2.1-.2.1l-.2.1-.2.1c-.1 0-.2.1-.2.1l-.2.1-.4.3c-.1.1-.2.2-.3.2l-.4.4-.1.1c-.1.2-.3.4-.4.5l-.2.3-.3.6-.1.3v.3c0 .5.2.9.9 1.2.2 3.7 3.9 2 5.6.8l.1-.1c.2-.2.5-.3.6-.3h.1l.2-.1c.1 0 .1 0 .2-.1.2-.1.4-.1.5-.2.1 0 .1-.1.1-.2l.1-.1c.1-.2.2-.6.2-1.2l.1-1.3v1.8c-.5 13.1-4 30.7 3.3 42.5 1.3 2.1 2.9 3.9 4.7 5.4h-.5c-.2.2-.5.4-.8.6l-.9.6-.3.2-.6.4-.9.7-1.1 1c-.2.2-.3.4-.4.5l-.4.6-.2.3c-.1.2-.2.4-.2.6l-.1.3c-.2.8 0 1.7.6 2.7l.4.4h.2c.1 0 .2 0 .4.1.2.4 1.2 2.5 3.9.9 2.8-1.5 4.7-4.6 8.1-5.1l-.5-.6c5.9 2.8 12.8 4 19 4.2 8.7.3 18.6-.9 26.5-5.2 2.2.7 3.9 3.9 5.8 5.4l.1.1.1.1.1.1.1.1s.1 0 .1.1c0 0 .1 0 .1.1 0 0 .1 0 .1.1h2.1s.1 0 .1-.1h.1s.1 0 .1-.1h.1s.1 0 .1-.1c0 0 .1 0 .1-.1l.1-.1s.1 0 .1-.1l.1-.1h.1l.2-.2.2-.1h.1l.1-.1h.1l.1-.1.1-.1.1-.1.1-.1.1-.1.1-.1.1-.1v-.1s0-.1.1-.1v-.1s0-.1.1-.1v-.1s0-.1.1-.1v-1.4s-.3 0-.3-.1l-.3-.1v-.1l.3-.1s.2 0 .2-.1l.1-.1v-2.1s0-.1-.1-.1v-.1s0-.1-.1-.1v-.1s0-.1-.1-.1c0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1l-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1v-.1l-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1c2-1.9 3.8-4.2 5.1-6.9 5.9-11.8 4.9-26.2 4.1-39.2h.1c.1 0 .2.1.2.1h.3s.1 0 .1.1h.1s.1 0 .1.1l.2.1c1.7 1.2 5.4 2.9 5.6-.8 1.6.6-.3-1.8-1.3-2.5zM36 23C32.8 7 58.4 4 59.3 19.6c.8 13-20 16.3-23.3 3.4zm36.1 15c-1.3 1.4-2.7 1.2-4.1.7 0 1.9.4 3.9.1 5.9-.5.9-1.5 1-2.3 1.4-1.2-.2-2.1-.9-2.6-2l-.2-.1c-3.9 5.2-6.3-1.1-5.2-5-1.2.1-2.2-.2-3-1.5-1.4-2.6.7-5.8 3.4-6.3.7 3 8.7 2.6 10.1-.2 3.1 1.5 6.5 4.3 3.8 7.1zm-7-17.5c-.9-13.8 20.3-17.5 23.4-4 3.5 15-20.8 18.9-23.4 4zM41.7 17c-1.9 0-3.5 1.7-3.5 3.8 0 2.1 1.6 3.8 3.5 3.8s3.5-1.7 3.5-3.8c0-2.1-1.5-3.8-3.5-3.8zm1.6 5.7c-.5 0-.8-.4-.8-1 0-.5.4-1 .8-1 .5 0 .8.4.8 1 0 .5-.3 1-.8 1zm27.8-6.6c-1.9 0-3.4 1.7-3.4 3.8 0 2.1 1.5 3.8 3.4 3.8s3.4-1.7 3.4-3.8c0-2.1-1.5-3.8-3.4-3.8zm1.6 5.6c-.4 0-.8-.4-.8-1 0-.5.4-1 .8-1s.8.4.8 1-.4 1-.8 1z"></path>
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
