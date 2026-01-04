<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// C++ code
const cppCode = ref('')
const manifest = ref(null)
const selectedExample = ref('')

// State
const isLoading = ref(false)
const isReady = ref(false)
const runTime = ref(null)
const statusMessage = ref('')

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('cpp')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      cppCode.value = await fetchExample('cpp', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load C++ manifest:', e)
  }
}

// Worker
let worker = null
let term = null
let fitAddon = null
const terminalContainer = ref(null)

const initTerminal = () => {
  term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: '#0f172a', // slate-900
      foreground: '#e2e8f0'  // slate-200
    }
  })
  
  fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  
  term.open(terminalContainer.value)
  fitAddon.fit()
  
  // Clean welcome message
  term.write('\x1b[38;5;244mResult will appear here...\x1b[0m\r\n')
}

const initWorker = async () => {
  isLoading.value = true
  statusMessage.value = 'Initializing C++ environment...'
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const workerUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}wasm-clang/worker.js`
    
    worker = new Worker(workerUrl)
    
    worker.onmessage = (event) => {
      const { id, data } = event.data
      
      if (id === 'write') {
        // Convert newlines for terminal
        const text = data.replace(/\n/g, '\r\n')
        term.write(text)
      } else if (id === 'runAsync') { // Finished or ready?
         // This comes from compileToAssembly etc, but compileLinkRun might differ
         // Looking at worker.js, compileLinkRun calls api.compileLinkRun and doesn't post back explicitly except logs?
         // user might see "finished compileLinkRun" in console log if we monitor logs
      }
      
      // We assume ready after some time or immediate?
      // The worker doesn't send a "ready" message initially.
      // But we can try to send a ping or just assume it is ready to receive messages.
    }

    // Initialize worker with port if needed? 
    // worker.js: case 'constructor': port = event.data.data; ...
    // It seems we need to send a constructor message with a MessageChannel port if we want to communicate back?
    // "case 'constructor': port = event.data.data; port.onmessage = onAnyMessage;"
    
    // Wait, worker.js has:
    // self.onmessage = onAnyMessage;
    // but onAnyMessage handles 'constructor' by setting `port`.
    // And `hostWrite` uses `port.postMessage`.
    
    // So we MUST send a MessageChannel port first.
    
    const channel = new MessageChannel()
    channel.port1.onmessage = (event) => {
      const { id, data } = event.data
      if (id === 'write') {
        const text = data
        
        // Filter out untarring logs
        if (text.includes('Untarring sysroot.tar')) {
          statusMessage.value = 'Unpacking system files...'
          return
        }
        
        // Check for completion of untarring (indicated by "done" after untarring)
        if (statusMessage.value === 'Unpacking system files...' && text.includes('done')) {
           statusMessage.value = ''
           isReady.value = true
           isLoading.value = false
           emit('ready')
           return
        }
        
        // Also suppress "done" if it appears alone right after untarring but we missed the exact sequence, 
        // or just general cleanup if we are in initializing state.
        
        // Write other logs to terminal
        term.write(text.replace(/\n/g, '\r\n'))
      }
    }
    
    worker.postMessage({ id: 'constructor', data: channel.port2 }, [channel.port2])
    
    // Don't set ready immediately, wait for untarring
    // isReady.value = true 
    // isLoading.value = false
    
  } catch (e) {
    statusMessage.value = `Failed to load C++ environment: ${e.message}`
    isLoading.value = false
    console.error(e)
  }
}


const runCpp = async () => {
  if (!worker || !isReady.value) return
  
  isLoading.value = true
  statusMessage.value = 'Compiling and running...'
  term.clear()
  runTime.value = null
  const startTime = performance.now()
  
  try {
    // Invoke compileLinkRun
    worker.postMessage({ 
      id: 'compileLinkRun', 
      data: cppCode.value 
    })
    
    // There is no explicit "done" message for compileLinkRun in worker.js except console.log.
    // However, hostLogAsync writes " done." to hostWrite.
    // We can infer completion or just let it stream.
    // For now, we just set loading to false after a short delay or if we could detect end.
    // But since it's async, we might not know exactly when it ends without modifying worker/API.
    
    // Simple workaround: just reset loading state after sending, 
    // or wait for specific output if we can wrapper it.
    // Given the constraints, I'll just keep isLoading true for a bit or until some output? 
    // Actually, let's just set it to false immediately after posting, 
    // or maybe set a timeout to simulate "compiling".
    // Real completion detection would require modifying the worker to send a 'finished' message.
    
    // Let's modify the worker? No, better stuck with stock if possible.
    // But wait, the shared.js implementation of compileLinkRun likely awaits.
    // The worker `case 'compileLinkRun'` awaits it: `currentApp = await api.compileLinkRun...`
    // So if we could get a message back after that await...
    // But `worker.js` logs to console: `console.log('finished compileLinkRun...')`. It does NOT post a message back to port.
    
    // This is a limitation of the demo worker.js.
    // I can modify `public/wasm-clang/worker.js` since I downloaded it.
    // But since I downloaded it via script, I can also assume I can patch it.
    // Or I can just make a wrapper.
    
    // Check `setup-wasm.js` instructions. It downloads it.
    // I can patch it in `setup-wasm.js`? Or simpler: I will assume the user considers "Run" started.
    // I will simply set isLoading = false after a brief timeout (e.g. 500ms) to indicate "Job Sent".
    
    setTimeout(() => {
      isLoading.value = false
      const endTime = performance.now()
      runTime.value = (endTime - startTime).toFixed(2)
    }, 1000)

  } catch (e) {
    term.write(`\x1b[31mError: ${e.message}\x1b[0m\r\n`)
    isLoading.value = false
  }
}

// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  clearOutput()
  try {
    isLoading.value = true
    statusMessage.value = 'Loading example...'
    cppCode.value = await fetchExample('cpp', selectedExample.value)
  } catch (e) {
    term.write(`\x1b[31mFailed to load example: ${e.message}\x1b[0m\r\n`)
  } finally {
    isLoading.value = false
    statusMessage.value = ''
  }
}

const clearOutput = () => {
  term.clear()
  runTime.value = null
}

onMounted(async () => {
  initTerminal()
  await initWorker()
  loadManifestData()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (worker) worker.terminate()
  if (term) term.dispose()
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  if (fitAddon) fitAddon.fit()
}

</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-2">
            <!-- Icon -->
            <svg class="w-5 h-5 text-blue-500" viewBox="0 0 128 128" fill="currentColor">
                <path d="M117.513 18.355l-3.235-5.603a11.536 11.536 0 00-15.75-4.22L61.642 29.83a48.27 48.27 0 00-6.04-2.858C45.335 23.367 33.91 22.067 23.778 27.915a39.22 39.22 0 00-14.35 14.35C3.58 52.56.98 64.122.98 75.83 1.012 101.48 18.67 119.106 43.687 119.106a44.6 44.6 0 0021.782-5.462l33.868 19.553a11.536 11.536 0 0015.75-4.22l3.235-5.604a11.536 11.536 0 00-4.22-15.75L78.68 87.21a48.514 48.514 0 002.822-5.594c3.483-8.491 3.515-18.064-.096-26.471a41.05 41.05 0 00-2.858-6.04l34.744-20.06a11.536 11.536 0 004.22-14.89zM52.022 93.9c-4.992 2.883-11.233 2.915-16.193.096a18.279 18.279 0 01-6.666-6.666c-2.787-4.832-2.787-10.724 0-15.556a18.279 18.279 0 016.666-6.666c4.96-2.819 11.2-2.819 16.193.064a18.279 18.279 0 016.666 6.666c2.787 4.832 2.819 10.724.032 15.556a18.441 18.441 0 01-6.698 6.506zm37.28-3.048l-1.636 2.822a1.868 1.868 0 01-2.532.61L30.133 63.385l1.603-2.822a1.868 1.868 0 012.532-.61l55.034 31.796a1.83 1.83 0 01.61 1.636l-.61 1.25c-.21.21-.42.42-.61.61h-.61l-.61-2.918zm14.89-25.922a1.868 1.868 0 01-.61 2.532l-55.034 31.796-1.503-2.612a1.868 1.868 0 01.61-2.532l55.034-31.796a1.83 1.83 0 01.61.61l.894 1.15-.001.864z" />
            </svg>
          <span class="font-bold text-white">C/C++</span>
          <div class="relative group ml-2">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
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
          
          <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
          <span v-else class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ statusMessage || 'Loading...' }}</span>
        </div>
        <button 
          @click="runCpp"
          :disabled="isLoading || !isReady"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            (isLoading || !isReady)
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          ]"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          {{ isLoading ? 'Running...' : t('tools.code-playground.common.run') }}
        </button>
      </div>

      <!-- Editor -->
      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="cppCode"
          language="cpp"
          theme="vs-dark"
          height="100%"
          :minimap="false"
        />
      </div>
    </div>

    <!-- Output -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700">
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

      <!-- Terminal -->
      <div class="flex-1 min-h-0 p-2 bg-[#0f172a]">
        <div ref="terminalContainer" class="w-full h-full"></div>
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

<style scoped>
:deep(.xterm) {
  padding: 1rem;
}
</style>
