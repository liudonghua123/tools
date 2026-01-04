<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { LuaFactory } from 'wasmoon'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// Lua examples
const examples = {
  hello: `-- Hello World
print("Hello, Lua World!")
`,
  factorial: `-- Factorial using recursion
function factorial(n)
    if n == 0 then
        return 1
    else
        return n * factorial(n - 1)
    end
end

print("Factorial of 5 is: " .. factorial(5))
`,
  tables: `-- Table manipulation
local fruits = {"apple", "banana", "cherry"}
table.insert(fruits, "date")

print("Fruits list:")
for i, v in ipairs(fruits) do
    print(i .. ": " .. v)
end

local scores = {Alice = 95, Bob = 88}
print("\\nScores:")
for k, v in pairs(scores) do
    print(k .. ": " .. v)
end
`,
  loops: `-- Loops example
print("Counting with while loop:")
local i = 1
while i <= 5 do
    print(i)
    i = i + 1
end

print("\\nCounting with for loop:")
for j = 1, 5 do
    print(j)
end
`
}

// Lua code
const luaCode = ref(examples.hello)

// State
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)
const selectedExample = ref('hello')

// Lua runtime instance
let lua = null

// Load Lua Runtime
const loadLuaRuntime = async () => {
  if (isReady.value) return;
  
  isLoading.value = true
  loadingProgress.value = 'Loading Lua runtime...'
  
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const luaBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}lua-wasm/`;

    // Initialize factory with custom wasm location
    const factory = new LuaFactory(undefined, {
        injectWasm: async (mod, importObject) => {
            const response = await fetch(`${luaBase}glue.wasm`);
            const buffer = await response.arrayBuffer();
            return WebAssembly.instantiate(buffer, importObject);
        }
    });

    lua = await factory.createEngine();
    
    // Redirect print to our output
    lua.global.set('print', (...args) => {
        output.value.push({ type: 'log', message: args.join('\t') });
    });

    isReady.value = true
    emit('ready')
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: `Failed to load Lua runtime: ${e.message}` 
    })
    console.error(e)
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Run Lua code
const runLua = async () => {
  if (!isReady.value) {
    await loadLuaRuntime();
  }
  
  if (!lua) return;

  output.value = []
  runTime.value = null
  
  try {
    const startTime = performance.now()
    
    // Execute the code
    await lua.doString(luaCode.value)
    
    const endTime = performance.now()
    runTime.value = (endTime - startTime).toFixed(2)
  } catch (e) {
    output.value.push({ 
      type: 'error', 
      message: e.message 
    })
    emit('error', e)
  }
}

// Handle example change
const onExampleChange = () => {
  if (examples[selectedExample.value]) {
    luaCode.value = examples[selectedExample.value]
  }
}

// Clear output
const clearOutput = () => {
  output.value = []
  runTime.value = null
}

// Get output color
const getOutputColor = (type) => {
  return type === 'error' ? 'text-red-400' : 'text-emerald-400'
}

onMounted(() => {
  loadLuaRuntime()
})

onUnmounted(() => {
  if (lua) {
    // Cleanup if possible, though wasmoon engine doesn't have explicit destroy in this usage context easily accessible or necessary for simple page switch
    // lua.global.close() // if supported
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
            <!-- Simple Lua Icon or Placeholder -->
            <svg class="w-5 h-5 text-blue-400" viewBox="0 0 128 128" fill="currentColor">
                <path d="M64 12C35.2 12 12 35.2 12 64s23.2 52 52 52 52-23.2 52-52S92.8 12 64 12zm0 94c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zm18-42c0 10-8 18-18 18s-18-8-18-18 8-18 18-18 18 8 18 18z"/>
            </svg>
            <span class="font-bold text-white">Lua</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="hello">Hello World</option>
              <option value="factorial">Factorial</option>
              <option value="tables">Tables</option>
              <option value="loops">Loops</option>
            </select>
            <div class="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button 
          @click="runLua"
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
          v-model="luaCode"
          language="lua"
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
          <div class="text-xs text-slate-500">Initializing environment...</div>
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
          <span v-else class="text-emerald-400">›</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to execute Lua code...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>
