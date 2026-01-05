<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'
// [vite] Internal server error: Cannot import non-asset file /csharp-wasm/WasmCompiler.js which is inside /public. JS/CSS files inside /public are copied as-is on build and can only be referenced via <script src> or <link href> in html. If you want to get the URL of that file, use /csharp-wasm/WasmCompiler.js?url instead.
// import WasmSharpModule from '/csharp-wasm/WasmCompiler.js';
import { WasmSharpModule } from "@wasmsharp/core";

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// C# code
const csharpCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// WasmSharp module instance
let wasmSharpModule = null

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('csharp')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      csharpCode.value = await fetchExample('csharp', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load C# manifest:', e)
  }
}

// Load WasmSharp runtime
const loadWasmSharpRuntime = async () => {
  if (isReady.value) return;
  
  isLoading.value = true
  loadingProgress.value = 'Loading C# runtime...'
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const csharpBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}csharp-wasm/`;
    
    // Dynamically import WasmSharp
    loadingProgress.value = 'Initializing WasmSharp...'
    // When load dlls, Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec. 
    // const { WasmSharpModule } = await import(/* @vite-ignore */ `${csharpBase}WasmCompiler.js`);
    
    loadingProgress.value = 'Loading .NET runtime...'
    wasmSharpModule = await WasmSharpModule.initializeAsync({
      // Use the copied files from public directory
      basePath: csharpBase
    })
    
    isReady.value = true
    emit('ready')
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load C# runtime: ${e.message}` 
    })
    console.error(e)
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run C# code
const runCSharp = async () => {
  if (!isReady.value) {
    await loadWasmSharpRuntime();
  }
  
  if (!wasmSharpModule) {
    output.value.push({ type: 'error', message: 'C# runtime not ready' });
    return;
  }

  output.value = []
  runTime.value = null
  isLoading.value = true
  
  try {
    const startTime = performance.now()
    
    // Create compilation
    const compilation = await wasmSharpModule.createCompilationAsync(csharpCode.value)
    
    // Run the code
    const result = await compilation.run()
    
    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)
    
    // Handle output
    if (result.success) {
      if (result.stdOut) {
        output.value.push({ type: 'log', message: result.stdOut })
      }
      if (!result.stdOut && !result.stdErr) {
        output.value.push({ type: 'log', message: 'Program executed successfully (no output)' })
      }
    } else {
      // Handle compilation errors
      if (result.diagnostics && result.diagnostics.length > 0) {
        result.diagnostics.forEach(diag => {
          const message = `${diag.severity}: ${diag.message} (${diag.id})`
          output.value.push({ 
            type: diag.severity === 'Error' ? 'error' : 'warning', 
            message 
          })
        })
      } else {
        output.value.push({ type: 'error', message: 'Compilation failed' })
      }
    }
    
    // Handle stderr
    if (result.stdErr) {
      output.value.push({ type: 'error', message: result.stdErr })
    }
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: e.message 
    })
    emit('error', e)
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
    loadingProgress.value = 'Loading example...'
    csharpCode.value = await fetchExample('csharp', selectedExample.value)
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
  if (type === 'error') return 'text-red-400'
  if (type === 'warning') return 'text-yellow-400'
  return 'text-emerald-400'
}

onMounted(() => {
  // Pre-load C# runtime
  loadWasmSharpRuntime()
  loadManifestData()
})

onUnmounted(() => {
  // Cleanup if necessary
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
            <svg class="w-5 h-5 text-purple-400" viewBox="0 0 128 128" fill="currentColor">
              <path d="M117.5 33.5l.3-.2c-.6-1.1-1.5-2.1-2.4-2.6L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4.9 3.4l-.2.1c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c.1-.8 0-1.7-.4-2.6zM82.3 99.8c-8.6 0-15.6-7-15.6-15.6s7-15.6 15.6-15.6c8.6 0 15.6 7 15.6 15.6s-7 15.6-15.6 15.6zm0-27.7c-6.7 0-12.1 5.4-12.1 12.1s5.4 12.1 12.1 12.1 12.1-5.4 12.1-12.1-5.4-12.1-12.1-12.1zM45.7 99.8c-8.6 0-15.6-7-15.6-15.6s7-15.6 15.6-15.6c8.6 0 15.6 7 15.6 15.6s-7 15.6-15.6 15.6zm0-27.7c-6.7 0-12.1 5.4-12.1 12.1s5.4 12.1 12.1 12.1 12.1-5.4 12.1-12.1-5.4-12.1-12.1-12.1z"/>
            </svg>
            <span class="font-bold text-white">C#</span>
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
          @click="runCSharp"
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
          v-model="csharpCode"
          language="csharp"
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
      <div v-if="isLoading && loadingProgress" class="flex-1 flex items-center justify-center">
        <div class="text-center space-y-4">
          <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
          <span v-else-if="line.type === 'warning'" class="text-yellow-400">⚠</span>
          <span v-else class="text-emerald-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to execute C# code...
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
