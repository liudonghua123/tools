<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'

const { t } = useI18n()
const emit = defineEmits(['output', 'error', 'ready'])

// Perl code
const perlCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('perl')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      perlCode.value = await fetchExample('perl', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load Perl manifest:', e)
  }
}

// Load Perl

// Load Perl
const loadPerl = async () => {
  if (window.Perl && window.Perl.state === "Ready") {
    isReady.value = true;
    return window.Perl;
  }
  
  if (window.Perl && window.Perl.state === "Initializing") {
    return new Promise((resolve) => {
        const checkReady = () => {
            if (window.Perl.state === "Ready") {
                isReady.value = true;
                resolve(window.Perl);
            } else {
                setTimeout(checkReady, 100);
            }
        };
        checkReady();
    });
  }

  isLoading.value = true
  loadingProgress.value = t('tools.code-playground.perl.loading')
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const perlBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}webperl/`;
    
    // Inject webperl.js
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${perlBase}webperl.js`;
      script.onload = () => {
        // Runtime patch for getScriptURL to handle Vite dynamic base paths
        if (typeof window !== 'undefined') {
          window.getScriptURL = (function() { 
            var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length - 1; i >= 0; i--) {
              if (scripts[i].src && scripts[i].src.indexOf('webperl.js') !== -1) {
                return function() { return scripts[i].src; };
              }
            }
            var myScript = scripts[scripts.length - 1];
            return function() { return myScript.src; };
          })();
        }
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load webperl.js'));
      document.head.appendChild(script);
    });

    if (!window.Perl) {
      throw new Error('WebPerl script loaded but window.Perl not found');
    }

    // Enable tracing for debugging
    window.Perl.trace = true;

    // Override Perl.output to catch prints
    const originalOutput = window.Perl.output;
    window.Perl.output = (str, chan) => {
        // Also call original output for console logging (default behavior)
        if (typeof originalOutput === 'function') {
            originalOutput.call(window.Perl, str, chan);
        }
        
        const type = chan === 2 ? 'error' : 'log';
        // WebPerl often sends output character by character or in chunks
        if (output.value.length > 0 && output.value[output.value.length - 1].type === type) {
            output.value[output.value.length - 1].message += str;
        } else {
            output.value.push({ type, message: str });
        }
    };

    return new Promise((resolve, reject) => {
        console.log('Initializing WebPerl...');
        window.Perl.init(() => {
            console.log('WebPerl is Ready!');
            isReady.value = true;
            isLoading.value = false;
            loadingProgress.value = '';
            emit('ready');
            resolve(window.Perl);
        });
        
        // Timeout for safety
        setTimeout(() => {
            if (!isReady.value) {
                reject(new Error('WebPerl initialization timed out'));
            }
        }, 30000);
    });
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load Perl: ${e.message}` 
    })
    console.error(e);
    isLoading.value = false;
    loadingProgress.value = '';
    throw e
  }
}

// Handle example change
// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  clearOutput()
  try {
    isLoading.value = true
    loadingProgress.value = 'Loading example...'
    perlCode.value = await fetchExample('perl', selectedExample.value)
  } catch (e) {
    output.value.push({ type: 'error', message: `Failed to load example: ${e.message}` })
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run Perl code
const runPerl = async () => {
  output.value = []
  runTime.value = null
  
  try {
    const perlRunner = await loadPerl();
    const startTime = performance.now();
    
    // WebPerl eval
    // Note: WebPerl state must be "Ready" or "Running"
    if (perlRunner.state !== "Ready" && perlRunner.state !== "Running") {
         throw new Error(`Perl is in state ${perlRunner.state}, cannot run code.`);
    }
    
    // Transition to Running if needed (WebPerl might handle this in start/eval)
    // Looking at webperl.js, Perl.eval requires state "Running"
    if (perlRunner.state === "Ready") {
        perlRunner.start([]); // Start with empty argv to transition to Running
    }

    perlRunner.eval(`$|=1;${perlCode.value.replace(/\r/g, '')}`);
    
    const endTime = performance.now();
    runTime.value = (endTime - startTime).toFixed(2);
    
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
  return type === 'error' ? 'text-red-400' : 'text-indigo-400'
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
            <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 128 128" fill="currentColor">
              <path d="M121.172 62.878c0-34.048-26.473-61.648-59.135-61.648C29.379 1.23 2.9 28.83 2.9 62.878s26.478 61.651 59.136 61.651c32.662 0 59.135-27.603 59.135-61.651z M53.34 127.516c-13.91-2.461-25.842-8.812-35.703-19.006C9.25 99.842 3.477 88.928.853 76.763c-1.137-5.256-1.137-20.287 0-25.54C2.629 43 6.075 34.835 10.776 27.714 13.89 23 23.004 13.888 27.716 10.773c7.123-4.7 15.293-8.15 23.514-9.921 5.253-1.137 20.286-1.137 25.543 0C89.58 3.617 100.225 9.4 109.41 18.585c9.187 9.186 14.97 19.828 17.739 32.639 1.133 5.252 1.133 20.283 0 25.54-2.769 12.806-8.552 23.448-17.739 32.634-9.038 9.041-19.55 14.812-32.147 17.65-4.467 1.009-19.238 1.297-23.923.468zm11.567-12.772c0-4.194-.062-4.497-.907-4.497-.838 0-.904.288-.869 3.897.043 4.264.343 5.572 1.211 5.284.401-.132.565-1.491.565-4.684zm-6.757 1.445c1.192-1.196 1.542-1.92 1.542-3.209 0-1.316-.16-1.635-.763-1.519-.417.078-.919.76-1.114 1.507-.194.748-1 1.904-1.783 2.57-1.418 1.196-1.472 2.192-.125 2.192.386 0 1.394-.697 2.243-1.541zm14.943 1.047c.167-.269-.339-1.036-1.122-1.698-.786-.666-1.589-1.822-1.783-2.57-.199-.747-.701-1.429-1.118-1.507-.6-.116-.76.203-.76 1.519 0 2.609 3.743 5.942 4.783 4.256zm-20.66-8.146c0-.261-.634-.822-1.41-1.246-5.054-2.769-10.985-7.176-14.28-10.61-6.433-6.71-9.33-13.388-9.4-21.678-.048-5.54.665-8.43 3.364-13.605 2.609-5.004 5.631-8.78 13.95-17.421 9.287-9.653 11.425-12.2 13.038-15.533 1.148-2.367 1.3-3.231 1.46-8.235.199-6.215-.18-10.506-.927-10.506-.339 0-.401 1.612-.21 5.234.623 11.592-1.53 15.19-14.892 24.881-9.202 6.674-13.424 10.3-16.613 14.264-4.518 5.61-6.52 10.466-7.018 17.05-1.207 15.868 8.848 29.629 26.59 36.385 3.914 1.487 6.348 1.881 6.348 1.02zm30.7-1.285c6.098-2.543 10.736-5.615 15.11-10.007 6.667-6.701 9.439-12.967 9.856-22.242.362-8.134-1.402-13.515-6.437-19.61-3.45-4.173-7.162-7.16-17.174-13.81-13.47-8.953-16.633-12.516-16.633-18.746 0-1.658.3-4.006.662-5.217.623-2.068.608-3.493-.02-1.862-.591 1.546-1.947.837-2.675-1.41l-.7-2.152.264 2.04c.942 7.242 1.06 10.276.642 16.615-.564 8.57-1.616 14.427-4.51 25.076-2.87 10.572-3.387 14.404-3.029 22.476.3 6.825 1.254 11.93 3.474 18.593 2.06 6.183 2.445 6.654 6.235 7.624 2.083.533 4.058 1.433 5.627 2.566 1.476 1.067 2.952 1.76 3.781 1.775.748.012 3.237-.755 5.526-1.709zm-1.371-3.076c-.565-.565-.3-1.048 1.912-3.493 6.97-7.694 10.094-15.641 10.183-25.906.063-6.993-1.483-11.627-6.2-18.593-2.13-3.15-9.634-11.008-13.263-13.893-2.66-2.114-5.398-5.72-5.885-7.76-.494-2.068.892-1.523 2.496.98.787 1.227 2.493 3.03 3.79 4.004 1.296.977 5.132 3.835 8.524 6.355 11.664 8.671 16.859 16.066 18.023 25.672.678 5.556-.397 11.3-3.107 16.634-2.812 5.525-7.937 11.545-12.326 14.477-2.703 1.803-3.556 2.115-4.147 1.523zm-22.837.584c.133-.343-1.036-2.535-2.593-4.875-4.128-6.191-5.924-9.606-7.598-14.454-1.414-4.085-1.492-4.641-1.504-10.883-.015-9.431 1.005-12.422 8.49-24.85 7.057-11.718 8.015-16.258 7.22-34.286-.288-6.46-.611-11.838-.72-11.95-.744-.744-.904 1.172-.627 7.67.545 12.94-.292 20.147-3.018 26.062-1.858 4.026-3.938 7.075-9.53 14.002-7.788 9.637-9.985 14.75-9.946 23.126.031 5.743.806 9.275 3.127 14.185 2.512 5.32 7.135 10.689 12.93 15.011 2.667 1.994 3.391 2.231 3.77 1.242z" />
            </svg>
            <span class="font-bold text-white">Perl 5</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded', 'Not loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
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
          @click="runPerl"
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
          v-model="perlCode"
          language="perl"
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
          <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-slate-400">{{ loadingProgress }}</div>
          <div class="text-xs text-slate-500">Initializing WebPerl...</div>
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
          <span v-else class="text-indigo-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to execute Perl code...
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
