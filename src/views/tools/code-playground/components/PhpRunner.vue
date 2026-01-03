<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// Default PHP Code
const phpCode = ref(`<?php
$version = phpversion();
echo "Hello from PHP $version!\\n";

// Array example
$fruits = ["Apple", "Banana", "Cherry"];
echo "Fruits:\\n";
foreach ($fruits as $fruit) {
    echo "- $fruit\\n";
}

// Math
echo "\\nSqrt(16) = " . sqrt(16) . "\\n";
?>`)

const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

let php = null

// Load PHP
const loadPhp = async () => {
  if (php) return php;
  console.log('Loading PHP runtime...');
  
  isLoading.value = true
  loadingProgress.value = 'Loading PHP runtime...'
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const phpBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}php-wasm/`;
    
    // Load PHP WASM
    // Using import() as per documentation
    const { PhpWeb } = await import(/* @vite-ignore */ `${phpBase}PhpWeb.mjs`);
    php = new PhpWeb;
    
    // Add event listener for output
    php.addEventListener('output', (event) => {
        const text = event.detail;
        // Check if detail is an array or string, safe conversion
        const message = Array.isArray(text) ? text.join('') : String(text);
        output.value.push({ type: 'log', message });
    });
    
    php.addEventListener('error', (event) => {
         const text = event.detail;
         const message = Array.isArray(text) ? text.join('') : String(text);
         output.value.push({ type: 'error', message });
    });

    return new Promise((resolve, reject) => {
      php.addEventListener('ready', () => {
        isReady.value = true
        emit('ready')
        resolve(php)
      });
    });
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load PHP: ${e.message}` 
    })
    
    return Promise.reject(e);
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

const runPhp = async () => {
    output.value = []
    runTime.value = null
    
    try {
        const p = await loadPhp();
        const startTime = performance.now();
        
        // Clean code: remove <?php if present, php-wasm might handle it or not
        // Usually handles raw code.
        let code = phpCode.value;
        // if (code.startsWith('<?php')) code = code.substring(5);
        // if (code.endsWith('?>')) code = code.substring(0, code.length - 2);

        // Run
        // php-wasm API: .run(code) -> Promise<exitCode>
        const exitCode = await p.run(code);
        
        const endTime = performance.now();
        runTime.value = (endTime - startTime).toFixed(2);
        
        output.value.push({ type: 'info', message: `Program exited with code ${exitCode}` });
        
    } catch(e) {
        output.value.push({ type: 'error', message: e.message });
    }
}

const clearOutput = () => {
  output.value = []
  runTime.value = null
}

const getOutputColor = (type) => {
  if (type === 'error') return 'text-red-400';
  if (type === 'info') return 'text-slate-500 italic';
  return 'text-blue-400';
}

</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-2">
            <!-- PHP Icon -->
            <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 128 128" fill="currentColor">
                <path d="M64 30.332C28.654 30.332 0 45.407 0 64s28.654 33.668 64 33.668c35.345 0 64-15.075 64-33.668S99.346 30.332 64 30.332zm-5.982 9.81h7.293v.003l-1.745 8.968h6.496c4.087 0 6.908.714 8.458 2.139 1.553 1.427 2.017 3.737 1.398 6.93l-3.053 15.7h-7.408l2.902-14.929c.33-1.698.208-2.855-.365-3.473-.573-.617-1.793-.925-3.658-.925h-5.828L58.752 73.88h-7.291l6.557-33.738zM26.73 49.114h14.133c4.252 0 7.355 1.116 9.305 3.348 1.95 2.232 2.536 5.346 1.758 9.346-.32 1.649-.863 3.154-1.625 4.52-.763 1.364-1.76 2.613-2.99 3.745-1.468 1.373-3.098 2.353-4.891 2.936-1.794.585-4.08.875-6.858.875h-6.294l-1.745 8.97h-7.35l6.557-33.74zm57.366 0h14.13c4.252 0 7.353 1.116 9.303 3.348h.002c1.95 2.232 2.538 5.346 1.76 9.346-.32 1.649-.861 3.154-1.623 4.52-.763 1.364-1.76 2.613-2.992 3.745-1.467 1.373-3.098 2.353-4.893 2.936-1.794.585-4.077.875-6.855.875h-6.295l-1.744 8.97h-7.35l6.557-33.74zm-51.051 5.325-2.742 14.12h4.468c2.963 0 5.172-.556 6.622-1.673 1.45-1.116 2.428-2.981 2.937-5.592.485-2.507.264-4.279-.666-5.309-.93-1.032-2.79-1.547-5.584-1.547h-5.035zm57.363 0-2.744 14.12h4.47c2.965 0 5.17-.556 6.622-1.673 1.449-1.116 2.427-2.981 2.935-5.592.487-2.507.266-4.279-.664-5.309-.93-1.032-2.792-1.547-5.584-1.547h-5.035z" />
            </svg>
          <span class="font-bold text-white">PHP (WASM)</span>
          <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
        </div>
        <button 
          @click="runPhp"
          :disabled="isLoading"
          class="px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-600 disabled:text-slate-400"
        >
          {{ isLoading ? 'Loading...' : t('tools.code-playground.common.run') }}
        </button>
      </div>

      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="phpCode"
          language="php"
          theme="vs-dark"
          height="100%"
        />
      </div>
    </div>

    <!-- Output -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900">
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('tools.code-playground.common.output') }}</span>
          <span v-if="runTime" class="text-xs text-slate-500">{{ runTime }}ms</span>
        </div>
        <button @click="clearOutput" class="text-xs text-slate-500 hover:text-white">{{ t('tools.code-playground.common.clear') }}</button>
      </div>

      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-center space-y-4">
            <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div class="text-slate-400">{{ loadingProgress }}</div>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
        <div 
          v-for="(line, idx) in output" 
          :key="idx"
          :class="['flex items-start gap-2', getOutputColor(line.type)]"
        >
          <span v-if="line.type === 'error'" class="text-red-400">✗</span>
          <span v-else-if="line.type === 'info'" class="text-slate-500">ℹ</span>
          <span v-else class="text-blue-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
