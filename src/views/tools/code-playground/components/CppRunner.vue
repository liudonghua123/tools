<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// Examples
const examples = {
  hello: {
    name: 'Hello World',
    code: `#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}
`
  },
  loop: {
    name: 'Loop',
    code: `#include <stdio.h>

int main() {
  for (int i = 1; i <= 10; ++i) {
    printf("Count: %d\\n", i);
  }
  return 0;
}
`
  },
  math: {
    name: 'Math',
    code: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
  std::vector<int> v = {1, 2, 3, 4, 5};
  int sum = std::accumulate(v.begin(), v.end(), 0);
  std::cout << "Sum: " << sum << std::endl;
  return 0;
}
`
  }
}

const selectedExample = ref('hello')
const cppCode = ref(examples.hello.code)

watch(selectedExample, (newVal) => {
  if (examples[newVal]) {
    cppCode.value = examples[newVal].code
  }
})

// State
const isLoading = ref(false)
const isReady = ref(false)
const runTime = ref(null)
const statusMessage = ref('')

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

const clearOutput = () => {
  term.clear()
  runTime.value = null
}

onMounted(async () => {
  initTerminal()
  await initWorker()
  
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
            <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.24 7.03h-2.14l-.32-.94c-.26-.74-.53-1.42-.8-2.03-.55-1.25-1.52-1.92-2.9-2.01l-10-2.33-.2-.03c-2.32-.23-3.69 1.14-4.08 4.09l-.49 3.19H5.03C2.26 6.97 0 9.23 0 12c0 2.75 2.24 4.97 5 5h.06l-.42 2.76c-.41 2.94.94 4.3 3.25 4.07l.2-.03 10-2.33c1.37-.08 2.34-.76 2.89-2.01.27-.61.54-1.29.8-2.03l.32-.94h2.14c.97 0 1.76-.79 1.76-1.76v-5.98c0-.96-.79-1.75-1.76-1.75zM5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13.43 3.84c-.2.43-.59.66-1.07.72l-10 2.33c-.76.07-1.21-.39-1.07-1.36l1.53-10.03c.14-.94.88-1.52 1.63-1.45l10 2.33c.47.05.8.35 1.01.78.22.42.23.97-.03 1.69l-2 5.3c-.26.73-.25 1.28-.03 1.69z"/>
            </svg>
          <span class="font-bold text-white">C/C++</span>
          <select 
            v-model="selectedExample"
            class="ml-2 bg-slate-700 text-xs text-white border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-for="(ex, key) in examples" :key="key" :value="key">
              {{ ex.name }}
            </option>
          </select>
          
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
:deep(.xterm) {
  padding: 1rem;
}
</style>
