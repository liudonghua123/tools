<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MonacoEditor from './MonacoEditor.vue'

const props = defineProps({
  autoRun: { type: Boolean, default: true },
  debounceMs: { type: Number, default: 500 }
})

const emit = defineEmits(['run', 'console'])

// Editor content
const htmlCode = ref(`<div class="container">
  <h1>Hello World!</h1>
  <p>Edit the code and see the result.</p>
  <button id="btn">Click Me</button>
</div>`)

const cssCode = ref(`.container {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #6366f1;
  margin-bottom: 1rem;
}

button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}`)

const jsCode = ref(`// JavaScript code here
document.getElementById('btn').addEventListener('click', function() {
  console.log('Button clicked!');
  alert('Hello from JavaScript!');
});

console.log('Page loaded!');`)

// Console output
const consoleOutput = ref([])
const iframeRef = ref(null)
const activeTab = ref('html')

// Build full HTML document
const buildHtml = () => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssCode.value}</style>
</head>
<body>
  ${htmlCode.value}
  <script>
    // Override console methods to send to parent
    (function() {
      const originalConsole = {};
      ['log', 'warn', 'error', 'info'].forEach(method => {
        originalConsole[method] = console[method];
        console[method] = function(...args) {
          originalConsole[method].apply(console, args);
          window.parent.postMessage({
            type: 'console',
            method: method,
            args: args.map(arg => {
              try {
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
              } catch (e) {
                return String(arg);
              }
            })
          }, '*');
        };
      });
      
      // Capture errors
      window.onerror = function(msg, url, line, col, error) {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          args: [msg + ' (line ' + line + ')']
        }, '*');
      };
    })();
  <\/script>
  <script>${jsCode.value}<\/script>
</body>
</html>`
}

// Run code
const runCode = () => {
  consoleOutput.value = []
  if (iframeRef.value) {
    iframeRef.value.srcdoc = buildHtml()
  }
  emit('run')
}

// Handle console messages from iframe
const handleMessage = (event) => {
  if (event.data && event.data.type === 'console') {
    const { method, args } = event.data
    consoleOutput.value.push({
      type: method,
      message: args.join(' '),
      time: new Date().toLocaleTimeString()
    })
    emit('console', { method, args })
  }
}

// Clear console
const clearConsole = () => {
  consoleOutput.value = []
}

// Debounced auto-run
let debounceTimer = null
const scheduleRun = () => {
  if (!props.autoRun) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runCode, props.debounceMs)
}

watch([htmlCode, cssCode, jsCode], scheduleRun)

onMounted(() => {
  window.addEventListener('message', handleMessage)
  runCode()
})

// Get console type color
const getConsoleColor = (type) => {
  switch (type) {
    case 'error': return 'text-red-400'
    case 'warn': return 'text-yellow-400'
    case 'info': return 'text-blue-400'
    default: return 'text-slate-300'
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
      <div class="flex items-center gap-2">
        <button 
          v-for="tab in ['html', 'css', 'js']" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-all uppercase',
            activeTab === tab 
              ? 'bg-violet-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          ]"
        >
          {{ tab }}
        </button>
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-slate-400">
          <input type="checkbox" v-model="props.autoRun" class="rounded">
          Auto Run
        </label>
        <button 
          @click="runCode"
          class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Run
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:flex-row min-h-0">
      <!-- Editor Panel -->
      <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
        <MonacoEditor 
          v-show="activeTab === 'html'"
          v-model="htmlCode"
          language="html"
          theme="vs-dark"
          height="100%"
          :minimap="false"
        />
        <MonacoEditor 
          v-show="activeTab === 'css'"
          v-model="cssCode"
          language="css"
          theme="vs-dark"
          height="100%"
          :minimap="false"
        />
        <MonacoEditor 
          v-show="activeTab === 'js'"
          v-model="jsCode"
          language="javascript"
          theme="vs-dark"
          height="100%"
          :minimap="false"
        />
      </div>

      <!-- Preview Panel -->
      <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
        <!-- Preview -->
        <div class="flex-1 bg-white relative">
          <iframe 
            ref="iframeRef"
            class="w-full h-full border-0"
            sandbox="allow-scripts allow-modals"
            title="Preview"
          ></iframe>
        </div>

        <!-- Console -->
        <div class="h-40 bg-slate-900 border-t border-slate-700 flex flex-col">
          <div class="flex items-center justify-between px-3 py-2 border-b border-slate-700">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Console</span>
            <button 
              @click="clearConsole"
              class="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-2 font-mono text-sm space-y-1">
            <div 
              v-for="(log, idx) in consoleOutput" 
              :key="idx"
              :class="['flex items-start gap-2', getConsoleColor(log.type)]"
            >
              <span class="text-slate-500 text-xs">{{ log.time }}</span>
              <span v-if="log.type === 'error'" class="text-red-400">✗</span>
              <span v-else-if="log.type === 'warn'" class="text-yellow-400">⚠</span>
              <span v-else class="text-slate-500">›</span>
              <span class="flex-1">{{ log.message }}</span>
            </div>
            <div v-if="consoleOutput.length === 0" class="text-slate-500 italic">
              Console output will appear here...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
