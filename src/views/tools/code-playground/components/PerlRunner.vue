<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'

const { t } = useI18n()
const emit = defineEmits(['output', 'error', 'ready'])

// Default Perl code
const perlCode = ref(`# Perl code runs in your browser with WebPerl
# No server required!

print "Hello from Perl $^V!\\n";

# Basic math
my $sum = 0;
$sum += $_ for (1..100);
print "Sum of 1 to 100: $sum\\n";

# Array operations
my @fruits = ("Apple", "Banana", "Cherry");
print "Fruits: ", join(", ", @fruits), "\\n";

# Map example
my @squares = map { $_ * $_ } (1..10);
print "Squares: @squares\\n";

# Subroutine example
sub greet {
    my $name = shift;
    return "Greetings, $name!";
}

print greet("Developer"), "\\n";
`)

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

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

    perlRunner.eval(`$|=1;${perlCode.value}`);
    
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
    // We could pre-load here if desired
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 128 128" fill="currentColor">
            <path d="M64 14.6465v.002c-35.346 0-64 19.1902-64 42.8632 0 20.764 22.0464 38.0766 51.3164 42.0176v-12.83c-15.55-4.89-26.166-14.6943-26.166-25.9923 0-16.183 21.7795-29.3027 48.6465-29.3027 26.866 0 46.6914 8.9748 46.6914 29.3027 0 10.486-5.2715 17.9507-14.0645 22.7207 1.204.908 2.2184 2.073 2.9024 3.42l.3886.6543C121.0248 79.772 128 69.1888 128 57.5098c0-23.672-28.654-42.8633-64-42.8633zM52.7363 41.2637v72.084l21.834-.0098-.0039-28.2188h5.8613c1.199 0 1.7167.3481 2.9297 1.3301 1.454 1.177 3.8164 5.2383 3.8164 5.2383l11.5371 21.666 24.6739-.0097-15.2657-25.7403a8.388 8.388 0 0 0-1.4199-2.041c-.974-1.036-2.3255-1.8227-3.1055-2.2188-2.249-1.1375-6.12-2.3076-6.123-2.3085 0 0 19.08-1.4151 19.08-20.4141 0-18.999-19.9706-19.3574-19.9706-19.3574H52.7363zm22.0176 15.627 13.2188.0077s6.123-.3302 6.123 6.0098c0 6.216-6.123 6.2344-6.123 6.2344l-13.2247.0039.006-12.2559zm9.3457 32.6366c-2.612.257-5.3213.411-8.1133.463l.002 9.6288a88.362 88.362 0 0 0 12.4746-2.4902l-.502-.9414c-.68-1.268-1.3472-2.5426-2.0332-3.8066a41.01 41.01 0 0 0-1.828-2.8516v-.002z" />
          </svg>
          <span class="font-bold text-white">Perl 5</span>
          <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
          <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded', 'Not loaded') }}</span>
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
</style>
