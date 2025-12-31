<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import PlotCanvas from './PlotCanvas.vue'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// R code examples
const examples = {
  hello: {
    label: 'Hello World',
    code: `# Basic R print
print("Hello from R!")
`
  },
  math: {
    label: 'Basic Math & Vectors',
    code: `# Vector operations
x <- c(1, 2, 3, 4, 5)
print("Vector x:")
print(x)

# Mean and Standard Deviation
print("Mean:")
print(mean(x))
print("SD:")
print(sd(x))
`
  },
  dataframe: {
    label: 'Data Frames',
    code: `# Creating a dataframe
df <- data.frame(
  Name = c("Alice", "Bob", "Charlie"),
  Age = c(25, 30, 35),
  Score = c(90, 85, 95)
)

print("Original DataFrame:")
print(df)

# Subset
print("People over 28:")
print(subset(df, Age > 28))
`
  },
  linear_regression: {
    label: 'Linear Regression',
    code: `# Simple Linear Regression
x <- c(1, 2, 3, 4, 5)
y <- c(2, 4, 5, 4, 5)

model <- lm(y ~ x)
print("Model Summary:")
print(summary(model))
`
  },
  plotting: {
    label: 'Plotting (Histogram)',
    code: `# Basic Histogram
x <- rnorm(1000)
hist(x, col="lightblue", main="Histogram of Normal Distribution")
`
  }
}

const currentExample = ref('hello')
const rCode = ref(examples.hello.code)

// State
const output = ref([])
const plots = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// WebR instance
let webR = null

// Initialize WebR
const initWebR = async () => {
    isLoading.value = true
    loadingProgress.value = 'Initializing WebR...'
    
    try {
        const baseUrl = import.meta.env.BASE_URL || '/'
        const webrBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}webr/`

        // Dynamic import from public folder
        const { WebR } = await import(/* @vite-ignore */ `${webrBase}webr.js`)

        webR = new WebR();

        await webR.init();
        
        isReady.value = true
        emit('ready')
    } catch (e) {
        output.value.push({ 
            type: 'error', 
            message: `Failed to load WebR: ${e.message}` 
        })
        console.error(e)
    } finally {
        isLoading.value = false
        loadingProgress.value = ''
    }
}

// Run R code
const runR = async () => {
    output.value = []
    plots.value = []
    runTime.value = null
    
    if (!webR) {
        await initWebR()
    }

    try {
        const startTime = performance.now()
        
        // Capture output
        const shelter = await new webR.Shelter();
        
        try {
            console.log(`Running R code: ${rCode.value}`)
            const codeToRun = rCode.value.trim()
            
            const result = await shelter.captureR(codeToRun);
            
            // Process output lines
            result.output.forEach(line => {
                if (line.type === 'stdout') {
                    output.value.push({ type: 'log', message: line.data })
                } else if (line.type === 'stderr') {
                    output.value.push({ type: 'error', message: line.data })
                }
            });

            // Process images
            if (result.images && result.images.length > 0) {
                 result.images.forEach(img => {
                     plots.value.push(img);
                 });
            }

        } finally {
            shelter.purge();
        }

        const endTime = performance.now()
        runTime.value = (endTime - startTime).toFixed(2)
        
    } catch (e) {
        console.error("R Execution Error:", e);
        output.value.push({ 
            type: 'error', 
            message: e.message || String(e)
        })
        emit('error', e)
    }
}

// Load example
const loadExample = () => {
    if (examples[currentExample.value]) {
        rCode.value = examples[currentExample.value].code
    }
}

const clearOutput = () => {
    output.value = []
    plots.value = []
    runTime.value = null
}

const getOutputColor = (type) => {
    return type === 'error' ? 'text-red-400' : 'text-emerald-400'
}

onMounted(() => {
    initWebR()
})

onUnmounted(() => {
    if (webR) {
        webR.destroy()
    }
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
            <!-- R Logo placeholder utilizing blue theme -->
            <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
               <path d="M4.5 4.5h15v15h-15z" fill="none" stroke="currentColor" stroke-width="2"/>
               <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">R</text>
            </svg>
            <span class="font-bold text-white">R</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded') }}</span>
          </div>

          <!-- Example Selector -->
          <select 
            v-model="currentExample"
            @change="loadExample"
            class="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-xs focus:outline-none focus:border-blue-500"
          >
            <option v-for="(ex, key) in examples" :key="key" :value="key">
              {{ ex.label }}
            </option>
          </select>
        </div>


        <button 
          @click="runR"
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
          v-model="rCode"
          language="r"
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
          <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-slate-400">{{ loadingProgress }}</div>
          <div class="text-xs text-slate-500">Initializing WebR environment...</div>
        </div>
      </div>

      <!-- Output Content -->
      <div v-else class="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4">
        <!-- Text Log -->
        <div class="space-y-1">
            <div 
            v-for="(line, idx) in output" 
            :key="idx"
            :class="['flex items-start gap-2', getOutputColor(line.type)]"
            >
            <span v-if="line.type === 'error'" class="text-red-400">✗</span>
            <span v-else class="text-emerald-400">›</span>
            <span class="whitespace-pre-wrap">{{ line.message }}</span>
            </div>
             <div v-if="output.length === 0 && plots.length === 0 && !isLoading" class="text-slate-500 italic">
            Click "Run" to execute R code...
            </div>
        </div>

        <!-- Plots -->
        <div v-if="plots.length > 0" class="border-t border-slate-700 pt-4">
            <h3 class="text-xs font-bold text-slate-400 mb-2 uppercase">Plots</h3>
            <div v-for="(img, idx) in plots" :key="idx" class="bg-white rounded p-1 mb-2">
                 <PlotCanvas :image="img" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
