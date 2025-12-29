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
            <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 15h-9v-2h9v2zm0-4h-9V9h9v4z" />
                <path d="M7 9h10v4H7z" opacity=".3"/> <!-- simplified icon -->
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
