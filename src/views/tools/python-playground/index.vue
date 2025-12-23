<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed, shallowRef } from 'vue'

import { useI18n } from 'vue-i18n'
import * as monaco from 'monaco-editor'
import { initPyodide, runPythonCode, getPyodideStatus } from './utils/pyodide-runner.js'
import { renderTextWithMath } from './utils/math-renderer.js'
import 'katex/dist/katex.min.css'
import BackButton from '../../../components/BackButton.vue'

// Import knowledge bases
import numpyKnowledge from './knowledge/numpy-knowledge.js'
import matplotlibKnowledge from './knowledge/matplotlib-knowledge.js'
import sympyKnowledge from './knowledge/sympy-knowledge.js'
import scipyKnowledge from './knowledge/scipy-knowledge.js'
import pandasKnowledge from './knowledge/pandas-knowledge.js'

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url), { type: 'module' })
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url), { type: 'module' })
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url), { type: 'module' })
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url), { type: 'module' })
    }
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' })
  }
}

const { t, locale } = useI18n()

// State
const activeTab = ref('numpy')
const editorContainer = ref(null)
const editor = shallowRef(null)
const pyodideStatus = ref('not-loaded')
const loadingProgress = ref('')
const isRunning = ref(false)
const output = ref('')
const plots = ref([])
const errorMessage = ref('')
const selectedSection = ref(null)
const selectedExample = ref(null)
const copied = ref(false)

// Knowledge bases
const knowledgeBases = {
  numpy: numpyKnowledge,
  matplotlib: matplotlibKnowledge,
  sympy: sympyKnowledge,
  scipy: scipyKnowledge,
  pandas: pandasKnowledge
}

// Computed
const currentKnowledge = computed(() => {
  const base = knowledgeBases[activeTab.value]
  if (!base) return {}
  
  // If base has locale variants (new structure)
  if (base.zh || base.en) {
    return base[locale.value] || base.en || base.zh
  }
  
  // Legacy structure
  return base
})
const currentSections = computed(() => currentKnowledge.value?.sections || [])

// Default code templates
const defaultCode = {
    numpy: numpyKnowledge[locale.value].sections[0].examples[0].code,
    matplotlib: matplotlibKnowledge[locale.value].sections[0].examples[0].code,
    sympy: sympyKnowledge[locale.value].sections[0].examples[0].code,
    scipy: scipyKnowledge[locale.value].sections[0].examples[0].code,
    pandas: pandasKnowledge[locale.value].sections[0].examples[0].code
};

// Initialize Monaco Editor
const initEditor = () => {
  if (!editorContainer.value) return

  editor.value = monaco.editor.create(editorContainer.value, {
    value: defaultCode[activeTab.value],
    language: 'python',
    theme: 'vs-dark',
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    wordWrap: 'on'
  })
}

// Initialize Pyodide
const initPython = async () => {
  try {
    pyodideStatus.value = 'loading'
    await initPyodide((progress) => {
      loadingProgress.value = progress
    })
    pyodideStatus.value = 'ready'
    loadingProgress.value = ''
  } catch (error) {
    pyodideStatus.value = 'error'
    errorMessage.value = `加载 Python 失败: ${error.message}`
    loadingProgress.value = ''
  }
}

// Run code
const runCode = async () => {
  if (!editor.value || pyodideStatus.value !== 'ready') return

  isRunning.value = true
  output.value = ''
  plots.value = []
  errorMessage.value = ''

  try {
    console.log('Fetching code from editor...')
    const code = editor.value.getValue()
    console.log('Code fetched:', code.substring(0, 50) + '...')
    console.log('Calling runPythonCode...')
    const result = await runPythonCode(code)
    console.log('runPythonCode returned')

    if (result.error) {
      errorMessage.value = result.error
    } else {
      output.value = result.output || 'Code executed successfully (no output)'
      plots.value = result.plots || []
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isRunning.value = false
  }
}

// Clear output
const clearOutput = () => {
  output.value = ''
  plots.value = []
  errorMessage.value = ''
}

// Clear editor
const clearEditor = () => {
  if (editor.value) {
    editor.value.setValue(defaultCode[activeTab.value])
  }
  clearOutput()
}

// Copy code
const copyCode = async () => {
  if (!editor.value) return

  try {
    await navigator.clipboard.writeText(editor.value.getValue())
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Load example
const loadExample = (example) => {
  if (editor.value && example.code) {
    editor.value.setValue(example.code)
    selectedExample.value = example
    clearOutput()
  }
}

// Select section
const selectSection = (section) => {
  if (selectedSection.value?.id === section.id) {
    selectedSection.value = null
  } else {
    selectedSection.value = section
    // Clear plots when switching topics
    plots.value = []
    errorMessage.value = ''
  }
}

// Watch tab changes
watch(activeTab, (newTab) => {
  if (editor.value) {
    editor.value.setValue(defaultCode[newTab])
  }
  selectedSection.value = null
  selectedExample.value = null
  clearOutput()
})

// Lifecycle
onMounted(() => {
  initEditor()
  initPython()
  
  // Select first section by default
  if (currentSections.value.length > 0) {
    selectedSection.value = currentSections.value[0]
  }
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.dispose()
  }
})

// Render math in text
const renderMath = (text) => {
  // If text starts with common LaTeX commands or looks like a formula but has no delimiters, try rendering as block math
  if (text && !text.includes('$') && (text.includes('\\') || text.includes('='))) {
    return renderTextWithMath(`$$${text}$$`)
  }
  return renderTextWithMath(text)
}
</script>

<template>
  <div class="max-w-[1800px] mx-auto animate-fade-in px-4 sm:px-6 pt-4 pb-20 relative">
    <BackButton />

    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden mt-8">
      <!-- Header -->
      <div class="p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10">
        <h2 class="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">
          {{ t('tools.python-playground.title') }}
        </h2>
        <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.python-playground.desc') }}</p>
        
        <!-- Status indicator -->
        <div class="mt-4 flex items-center gap-3">
          <div :class="[
            'w-3 h-3 rounded-full',
            pyodideStatus === 'ready' ? 'bg-green-500 animate-pulse' :
            pyodideStatus === 'loading' ? 'bg-yellow-500 animate-pulse' :
            pyodideStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
          ]"></div>
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300">
            {{ t(`tools.python-playground.status.${pyodideStatus}`) }}
          </span>
        </div>
      </div>

      <!-- Library Tabs -->
      <div class="flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto">
        <button
          v-for="lib in ['numpy', 'matplotlib', 'sympy', 'scipy', 'pandas']"
          :key="lib"
          @click="activeTab = lib"
          :class="[
            'flex-1 min-w-[120px] py-4 px-6 font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap',
            activeTab === lib
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/10'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          ]"
        >
          <span class="text-xl mr-2">{{ knowledgeBases[lib].icon }}</span>
          {{ t(`tools.python-playground.tabs.${lib}`) }}
          <div v-if="activeTab === lib" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
        </button>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <!-- Left: Knowledge Panel -->
        <div class="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto">
          <h3 class="text-xl font-black text-slate-700 dark:text-slate-200 sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur py-2 z-10">
            {{ t('tools.python-playground.knowledge.title') }}
          </h3>
          
          <!-- Sections -->
          <div class="space-y-2">
            <div
              v-for="section in currentSections"
              :key="section.id"
              class="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <button
                @click="selectSection(section)"
                :class="[
                  'w-full p-4 text-left font-bold transition-all',
                  selectedSection?.id === section.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                ]"
              >
                {{ section.title }}
              </button>
              
              <!-- Section Details -->
              <div v-if="selectedSection?.id === section.id" class="p-4 bg-white dark:bg-slate-800 space-y-4">
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ section.description }}</p>
                
                <!-- Concepts -->
                <div v-if="section.concepts" class="space-y-3">
                  <h4 class="text-xs font-black uppercase text-slate-500">{{ t('tools.python-playground.knowledge.concepts') || '核心概念' }}</h4>
                  <div v-for="concept in section.concepts" :key="concept.name" class="space-y-2">
                    <p class="font-bold text-sm text-slate-700 dark:text-slate-200">{{ concept.name }}</p>
                    <p class="text-xs text-slate-600 dark:text-slate-400">{{ concept.explanation }}</p>
                    <div v-if="concept.math" class="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl overflow-x-auto">
                      <div v-html="renderMath(concept.math)" class="text-center"></div>
                    </div>
                  </div>
                </div>
                
                <!-- Examples -->
                <div v-if="section.examples" class="space-y-2">
                  <h4 class="text-xs font-black uppercase text-slate-500">{{ t('tools.python-playground.knowledge.examples') || '示例代码' }}</h4>
                  <div
                    v-for="example in section.examples"
                    :key="example.title"
                    class="border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer"
                    @click="loadExample(example)"
                  >
                    <div class="flex items-center justify-between">
                      <p class="font-bold text-sm text-slate-700 dark:text-slate-200">{{ example.title }}</p>
                      <button class="text-xs text-blue-600 dark:text-blue-400 font-bold">
                        {{ t('tools.python-playground.buttons.load_example') }}
                      </button>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">{{ example.explanation }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Editor and Output -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Editor -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-black text-slate-700 dark:text-slate-200">代码编辑器</h3>
              <div class="flex gap-2">
                <button
                  @click="copyCode"
                  :class="[
                    'px-4 py-2 rounded-xl font-bold text-xs transition-all',
                    copied ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                  ]"
                >
                  {{ copied ? t('tools.python-playground.buttons.copied') : t('tools.python-playground.buttons.copy') }}
                </button>
                <button
                  @click="clearEditor"
                  class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                >
                  {{ t('tools.python-playground.buttons.clear') }}
                </button>
                <button
                  @click="runCode"
                  :disabled="pyodideStatus !== 'ready' || isRunning"
                  :class="[
                    'px-6 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2',
                    pyodideStatus === 'ready' && !isRunning
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed'
                  ]"
                >
                  <svg v-if="isRunning" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isRunning ? t('tools.python-playground.status.running') : t('tools.python-playground.buttons.run') }}
                </button>
              </div>
            </div>
            
            <div ref="editorContainer" class="h-[400px] border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"></div>
          </div>

          <!-- Output -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-black text-slate-700 dark:text-slate-200">{{ t('tools.python-playground.output.console') }}</h3>
              <button
                v-if="output || plots.length > 0 || errorMessage"
                @click="clearOutput"
                class="text-xs text-red-500 hover:text-red-600 font-bold"
              >
                清空输出
              </button>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6">
              <h4 class="font-bold text-red-700 dark:text-red-400 mb-2">{{ t('tools.python-playground.output.error_title') }}</h4>
              <pre class="text-xs text-red-600 dark:text-red-300 font-mono whitespace-pre-wrap">{{ errorMessage }}</pre>
            </div>

            <!-- Console Output -->
            <div v-if="output" class="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 min-h-[150px]">
              <pre class="text-sm text-green-400 font-mono whitespace-pre-wrap">{{ output }}</pre>
            </div>

            <!-- Plots -->
            <div v-if="plots.length > 0" class="space-y-4">
              <h4 class="text-sm font-black uppercase text-slate-500">{{ t('tools.python-playground.output.plots') }}</h4>
              <div class="grid grid-cols-1 gap-4">
                <div
                  v-for="(plot, index) in plots"
                  :key="index"
                  class="bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 flex items-center justify-center"
                >
                  <img :src="`data:image/png;base64,${plot}`" class="max-w-full rounded-lg" :alt="`Plot ${index + 1}`">
                </div>
              </div>
            </div>

            <!-- No output message -->
            <div v-if="!output && plots.length === 0 && !errorMessage" class="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
              <p class="text-slate-400 font-medium">{{ t('tools.python-playground.output.no_output') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
