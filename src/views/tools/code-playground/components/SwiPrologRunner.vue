<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// SWI-Prolog code
const prologCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// Chat/Query state
const chatMessages = ref([])
const currentQuery = ref('')
const isQuerying = ref(false)

// SWI-Prolog runtime instance
let swipl = null

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('swipl')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      prologCode.value = await fetchExample('swipl', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load SWI-Prolog manifest:', e)
  }
}

// Load SWI-Prolog WASM
const loadPrologRuntime = async () => {
  if (isReady.value) return;

  isLoading.value = true
  loadingProgress.value = 'Loading SWI-Prolog runtime...'

  try {
    // Dynamically import the swipl-wasm package
    const { default: initSwipl } = await import('swipl-wasm')
    
    loadingProgress.value = 'Initializing SWI-Prolog interpreter...'

    // Initialize SWI-Prolog with the public path
    const baseUrl = import.meta.env.BASE_URL || '/'
    const swiplBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}swipl-wasm/`
    
    swipl = await initSwipl({
      locateFile: (file) => `${swiplBase}${file}`
    })

    isReady.value = true
    emit('ready')
  } catch (e) {
    output.value.push({
      type: 'error',
      message: `Failed to load SWI-Prolog runtime: ${e.message}`
    })
    console.error(e)
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run SWI-Prolog code
const runProlog = async () => {
  if (!isReady.value) {
    await loadPrologRuntime();
  }

  if (!swipl) {
    output.value.push({ type: 'error', message: 'SWI-Prolog interpreter not ready' });
    chatMessages.value.push({
      sender: 'prolog',
      content: 'SWI-Prolog interpreter not ready',
      timestamp: Date.now()
    });
    return;
  }

  output.value = []
  chatMessages.value = [] // Clear chat when running new code
  runTime.value = null

  try {
    const startTime = performance.now()

    // Write the Prolog code to a temporary scratch.pl file
    const fileName = 'scratch.pl'
    swipl.FS.writeFile(fileName, prologCode.value)

    // Consult the file
    const consultResult = swipl.prolog.query(`['${fileName}'].`).once()

    if (consultResult) {
      // If there are any queries in the code, execute them
      output.value.push({ type: 'log', message: 'Prolog code loaded successfully' })
      chatMessages.value.push({
        sender: 'prolog',
        content: 'Prolog code loaded successfully',
        timestamp: Date.now()
      })

      // Try to execute any queries in the code
      const lines = prologCode.value.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('?-')) {
          // This is a query line
          const query = trimmed.substring(2).trim() // Remove '?-' prefix
          if (query && query.endsWith('.')) {
            // Remove the trailing period
            const cleanQuery = query.slice(0, -1)
            try {
              output.value.push({ type: 'log', message: `Query: ${cleanQuery}` })
              chatMessages.value.push({
                sender: 'prolog',
                content: `Query: ${cleanQuery}`,
                timestamp: Date.now()
              })

              const queryResult = swipl.prolog.query(cleanQuery)
              if (queryResult) {
                try {
                  const results = []

                  // Use for-of loop to iterate through solutions
                  for (const solution of queryResult) {
                    // Process the solution
                    if (solution && solution['$tag'] === 'bindings') {
                      // Remove the tag and check if it's empty (boolean result)
                      const processedSolution = { ...solution }
                      delete processedSolution['$tag']

                      if (Object.keys(processedSolution).length === 0) {
                        // Empty bindings means true (for boolean queries)
                        results.push(true)
                      } else {
                        // Non-empty bindings means variable bindings
                        results.push({ ...processedSolution })
                      }
                    }
                  }

                  if (results.length === 0) {
                    // No solutions found
                    const noSolutionsText = 'No solutions found'
                    output.value.push({ type: 'log', message: noSolutionsText })
                    chatMessages.value.push({
                      sender: 'prolog',
                      content: noSolutionsText,
                      timestamp: Date.now()
                    })
                  } else {
                    // Add all solutions to output and chat
                    results.forEach((result, index) => {
                      let formattedResult
                      if (typeof result === 'object' && result !== null) {
                        // Convert object to simple string format like "X=1, Y=2"
                        const entries = Object.entries(result)
                        if (entries.length > 0) {
                          formattedResult = entries.map(([key, value]) => `${key}=${value}`).join(', ')
                        } else {
                          formattedResult = 'true' // For empty objects, treat as true
                        }
                      } else {
                        formattedResult = String(result)
                      }
                      const solutionText = `Solution ${index + 1}: ${formattedResult}`
                      output.value.push({ type: 'log', message: solutionText })
                      chatMessages.value.push({
                        sender: 'prolog',
                        content: solutionText,
                        timestamp: Date.now()
                      })
                    })
                  }
                } catch (e) {
                  // Handle any exceptions during query execution
                  const errorText = `Query execution error: ${e.message}`
                  output.value.push({ type: 'log', message: errorText })
                  chatMessages.value.push({
                    sender: 'prolog',
                    content: errorText,
                    timestamp: Date.now()
                  })
                }
              } else {
                const noSolutionsText = 'Query failed or has no solutions'
                output.value.push({ type: 'log', message: noSolutionsText })
                chatMessages.value.push({
                  sender: 'prolog',
                  content: noSolutionsText,
                  timestamp: Date.now()
                })
              }
            } catch (qe) {
              const errorText = `Query error: ${qe.message}`
              output.value.push({ type: 'error', message: errorText })
              chatMessages.value.push({
                sender: 'prolog',
                content: errorText,
                timestamp: Date.now()
              })
            }
          }
        }
      }
    } else {
      const errorText = 'Failed to load Prolog code'
      output.value.push({ type: 'error', message: errorText })
      chatMessages.value.push({
        sender: 'prolog',
        content: errorText,
        timestamp: Date.now()
      })
    }

    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)

  } catch (e) {
    const errorText = e.message
    output.value.push({
      type: 'error',
      message: errorText
    })
    chatMessages.value.push({
      sender: 'prolog',
      content: errorText,
      timestamp: Date.now()
    })
    emit('error', e)
  }
}

// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  clearOutput()
  try {
    isLoading.value = true
    loadingProgress.value = 'Loading example...'
    prologCode.value = await fetchExample('swipl', selectedExample.value)
  } catch (e) {
    output.value.push({ type: 'error', message: `Failed to load example: ${e.message}` })
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Execute a query against the loaded Prolog code
const executeQuery = async () => {
  if (!isReady.value || isQuerying.value || !currentQuery.value.trim()) return

  const query = currentQuery.value.trim()

  // Add user query to chat
  chatMessages.value.push({
    sender: 'user',
    content: query,
    timestamp: Date.now()
  })

  // Clear input
  currentQuery.value = ''

  // Show loading state
  isQuerying.value = true

  try {
    if (!swipl) {
      throw new Error('SWI-Prolog interpreter not ready')
    }

    const startTime = performance.now()

    // Execute the query
    let cleanQuery = query
    if (cleanQuery.endsWith('.')) {
      cleanQuery = cleanQuery.slice(0, -1) // Remove trailing period if present
    }

    const queryResult = swipl.prolog.query(cleanQuery)

    if (queryResult) {
      try {
        const results = []

        // Use for-of loop to iterate through solutions
        for (const solution of queryResult) {
          // Process the solution
          if (solution && solution['$tag'] === 'bindings') {
            // Remove the tag and check if it's empty (boolean result)
            const processedSolution = { ...solution }
            delete processedSolution['$tag']

            if (Object.keys(processedSolution).length === 0) {
              // Empty bindings means true (for boolean queries)
              results.push(true)
            } else {
              // Non-empty bindings means variable bindings
              results.push({ ...processedSolution })
            }
          }
        }

        if (results.length === 0) {
          // No solutions found
          chatMessages.value.push({
            sender: 'prolog',
            content: 'No solutions found',
            timestamp: Date.now()
          })
        } else {
          // Add all solutions to chat
          results.forEach((result, index) => {
            let formattedResult
            if (typeof result === 'object' && result !== null) {
              // Convert object to simple string format like "X=1, Y=2"
              const entries = Object.entries(result)
              if (entries.length > 0) {
                formattedResult = entries.map(([key, value]) => `${key}=${value}`).join(', ')
              } else {
                formattedResult = 'true' // For empty objects, treat as true
              }
            } else {
              formattedResult = String(result)
            }
            chatMessages.value.push({
              sender: 'prolog',
              content: `Solution ${index + 1}: ${formattedResult}`,
              timestamp: Date.now()
            })
          })
        }
      } catch (e) {
        // Handle any exceptions during query execution
        chatMessages.value.push({
          sender: 'prolog',
          content: `Query execution error: ${e.message}`,
          timestamp: Date.now()
        })
      }
    } else {
      chatMessages.value.push({
        sender: 'prolog',
        content: 'Query failed or has no solutions',
        timestamp: Date.now()
      })
    }

    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)

  } catch (e) {
    chatMessages.value.push({
      sender: 'prolog',
      content: `Error: ${e.message}`,
      timestamp: Date.now()
    })
    console.error(e)
  } finally {
    isQuerying.value = false
  }
}

// Clear output and chat
const clearOutput = () => {
  output.value = []
  chatMessages.value = []
  runTime.value = null
}

// Get output color
const getOutputColor = (type) => {
  return type === 'error' ? 'text-red-400' : 'text-emerald-400'
}

onMounted(() => {
  // Pre-load SWI-Prolog runtime
  loadPrologRuntime()
  loadManifestData()
})

onUnmounted(() => {
  // Cleanup if needed
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
            <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5v6.5l5.25 3.28.75-1.22-4.5-2.78v-5.5z"/>
            </svg>
            <span class="font-bold text-white">SWI-Prolog</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
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
          @click="runProlog"
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
          v-model="prologCode"
          language="prolog"
          height="100%"
          :minimap="false"
        />
      </div>
    </div>

    <!-- Chat/Query Panel -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900">
      <!-- Chat Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('tools.code-playground.common.chat') }}</span>
          <span v-if="runTime" class="text-xs text-slate-500">{{ runTime }}ms</span>
        </div>
        <button
          @click="clearOutput"
          class="text-xs text-slate-500 hover:text-white transition-colors"
        >
          {{ t('tools.code-playground.common.clear') }}
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="(msg, idx) in chatMessages"
          :key="idx"
          :class="['p-3 rounded-lg max-w-[80%]', msg.sender === 'user' ? 'ml-auto bg-slate-800' : 'mr-auto bg-slate-700/50']"
        >
          <div class="font-medium text-xs text-slate-400 mb-1">
            {{ msg.sender === 'user' ? 'You' : 'Prolog' }}
          </div>
          <div class="text-sm text-slate-200 whitespace-pre-wrap">
            {{ msg.content }}
          </div>
        </div>

        <!-- Loading indicator when querying -->
        <div v-if="isQuerying" class="flex items-center gap-2 p-3 rounded-lg mr-auto bg-slate-700/50">
          <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
          <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <!-- Query Input -->
      <div class="border-t border-slate-700 p-4">
        <div class="flex gap-2">
          <input
            v-model="currentQuery"
            @keyup.enter="executeQuery"
            :placeholder="t('tools.code-playground.swipl.query_placeholder')"
            class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            :disabled="!isReady || isQuerying"
          />
          <button
            @click="executeQuery"
            :disabled="!isReady || isQuerying || !currentQuery.trim()"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <span v-if="isQuerying">...</span>
            <span v-else>{{ t('tools.code-playground.common.send') }}</span>
          </button>
        </div>
        <div class="mt-2 text-xs text-slate-500">
          {{ t('tools.code-playground.swipl.query_help') }}
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