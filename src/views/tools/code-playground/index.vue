<script setup>
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Lazy load heavy components
const HtmlSandbox = defineAsyncComponent(() => import('./components/HtmlSandbox.vue'))
const MarkdownPreview = defineAsyncComponent(() => import('./components/MarkdownPreview.vue'))
const PythonRunner = defineAsyncComponent(() => import('./components/PythonRunner.vue'))
const PhpRunner = defineAsyncComponent(() => import('./components/PhpRunner.vue'))
const SqliteRunner = defineAsyncComponent(() => import('./components/SqliteRunner.vue'))
const JavaRunner = defineAsyncComponent(() => import('./components/JavaRunner.vue'))
const MonacoEditor = defineAsyncComponent(() => import('./components/MonacoEditor.vue'))

const activeMode = ref('sandbox')
const isFullScreen = ref(false)
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}

const modes = computed(() => [
  { id: 'sandbox', icon: 'web', label: t('tools.code-playground.modes.sandbox') },
  { id: 'markdown', icon: 'markdown', label: t('tools.code-playground.modes.markdown') },
  { id: 'python', icon: 'python', label: t('tools.code-playground.modes.python') },
  { id: 'php', icon: 'php', label: t('tools.code-playground.modes.php') },
  { id: 'java', icon: 'java', label: t('tools.code-playground.modes.java') },
  { id: 'sqlite', icon: 'sqlite', label: t('tools.code-playground.modes.sqlite') },
  { id: 'editor', icon: 'code', label: t('tools.code-playground.modes.editor') }
])

// Single file editor state
const singleFileLanguage = ref('javascript')
const singleFileCode = ref(`// Write your code here
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
`)

const languages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'json', label: 'JSON' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'python', label: 'Python' }
]

const exampleSnippets = {
  javascript: {
    hello: `// Hello World
function sayHello() {
  console.log("Hello, World!");
}
sayHello();`,
    array: `// Array Operations
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x * x);
console.log('Squared:', squared);

const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('Sum:', sum);`,
    async: `// Async/Await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}`,
    class: `// Classes
class Calculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }
  
  add(n) {
    this.value += n;
    return this;
  }
  
  getResult() {
    return this.value;
  }
}

const result = new Calculator(10).add(5).getResult(); // 15`
  },
  typescript: {
    interface: `// Interface
interface User {
  id: number;
  name: string;
  email?: string;
}

const user: User = {
  id: 1,
  name: "John Doe"
};

function printUser(u: User) {
  console.log(u.name);
}`,
    generics: `// Generics
function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrappedNumber = wrap(42);
const wrappedString = wrap("Hello");`,
    enum: `// Enums
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

const currentStatus: Status = Status.Active;`
  },
  json: {
    config: `{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.0.0"
  }
}`,
    data: `[
  {
    "id": 1,
    "name": "Item 1",
    "active": true
  },
  {
    "id": 2,
    "name": "Item 2",
    "active": false
  }
]`
  },
  html: {
    basic: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>This is a paragraph.</p>
  </main>
</body>
</html>`,
    form: `<form action="/submit" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
  
  <button type="submit">Submit</button>
</form>`
  },
  css: {
    flexbox: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
}

.item {
  flex: 1;
  padding: 1rem;
}`,
    grid: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}`,
    animation: `@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.card {
  animation: slideIn 0.3s ease-out;
}`
  },
  python: {
    basics: `# Function basics
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("World"))`,
    list_comp: `# List Comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 != 0]
print(squares) # [1, 9, 25]`,
    class: `# Classes
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says Woof!"

my_dog = Dog("Rex")
print(my_dog.bark())`
  }
}

const selectedExample = ref('')

// Initialize example when language changes
const handleLanguageChange = () => {
    selectFirstExample()
}

const selectFirstExample = () => {
    const examples = exampleSnippets[singleFileLanguage.value];
    if (examples) {
        const firstKey = Object.keys(examples)[0];
        if (firstKey) {
            selectedExample.value = firstKey;
            loadExample();
        }
    } else {
        selectedExample.value = '';
    }
}

const loadExample = () => {
  if (selectedExample.value && exampleSnippets[singleFileLanguage.value]?.[selectedExample.value]) {
    singleFileCode.value = exampleSnippets[singleFileLanguage.value][selectedExample.value]
  }
}

// Initial selection
onMounted(() => {
    if (activeMode.value === 'editor') {
       selectFirstExample()
    }
})

// Watch for mode changes to auto-select example when entering editor mode
// Watch for mode changes to auto-select example when entering editor mode 
// Wait, imports are at top. Need to check if watch is imported.
// It was not in the original file imports: "import { ref, computed, onMounted, defineAsyncComponent } from 'vue'"
// So I need to add it to imports first? 
// Or I can just standardise the imports in a separate edit if needed, but let's check top of file.
// Code snippet shows: `import { ref, computed, onMounted, defineAsyncComponent } from 'vue'`
// So I need to add `watch` to imports. 

watch(activeMode, (newMode) => {
    if (newMode === 'editor' && !selectedExample.value) {
        selectFirstExample()
    }
})
</script>

<template>
  <div 
    :class="[
      'flex flex-col animate-fade-in transition-all duration-300',
      isFullScreen 
        ? 'fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 p-4 h-screen' 
        : 'h-[calc(100vh-180px)]'
    ]"
  >
    <!-- Header (Hide in fullscreen if desired, or keep minimal) -->
    <div v-if="!isFullScreen" class="mb-6 text-center">
      <div class="inline-flex items-center justify-center p-4 bg-violet-100/50 dark:bg-violet-900/30 rounded-3xl mb-4 shadow-xl ring-4 ring-violet-50 dark:ring-violet-900/10">
        <svg class="w-10 h-10 text-violet-600 dark:text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ t('tools.code-playground.title') }}</h1>
      <p class="mt-2 text-slate-500 font-medium">{{ t('tools.code-playground.desc') }}</p>
    </div>

    <!-- Mode Tabs -->
    <div class="flex justify-start md:justify-center gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide px-1">
      <button 
        v-for="mode in modes" 
        :key="mode.id"
        @click="activeMode = mode.id"
        :class="[
          'px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
          activeMode === mode.id 
            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25' 
            : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
        ]"
      >
        <!-- Icons -->
        <svg v-if="mode.icon === 'web'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <svg v-else-if="mode.icon === 'markdown'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <svg v-else-if="mode.icon === 'python'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93V4.07z"/>
        </svg>
        <svg v-else-if="mode.icon === 'php'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 15h-9v-2h9v2zm0-4h-9V9h9v4z" />
        </svg>
        <svg v-else-if="mode.icon === 'sqlite'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
           <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <svg v-else-if="mode.icon === 'java'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
           <path d="M8 16c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4H8v4zm-2 0v-4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2h-2c-1.1 0-2-.9-2-2zm10-8c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v2h8V8z"/>
           <path d="M7 3v2h10V3H7zm0 14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2H7z" opacity=".3"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {{ mode.label }}
      </button>

      <!-- Fullscreen Toggle -->
      <button 
        @click="toggleFullScreen"
        class="ml-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
        :title="isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
      >
        <svg v-if="!isFullScreen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0v4m0-4h4m12 0l-5 5m5-5v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m11 0l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    </div>

    <!-- Content Area -->
    <div class="flex-1 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl min-h-0">
      <!-- HTML/CSS/JS Sandbox -->
      <Suspense v-if="activeMode === 'sandbox'">
        <template #default>
          <HtmlSandbox />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- Markdown Preview -->
      <Suspense v-else-if="activeMode === 'markdown'">
        <template #default>
          <MarkdownPreview />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- Python Runner -->
      <Suspense v-else-if="activeMode === 'python'">
        <template #default>
          <PythonRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- PHP Runner -->
      <Suspense v-else-if="activeMode === 'php'">
        <template #default>
          <PhpRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- SQLite Runner -->
      <Suspense v-else-if="activeMode === 'sqlite'">
        <template #default>
          <SqliteRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>
      
      <!-- Java Runner -->
      <Suspense v-else-if="activeMode === 'java'">
        <template #default>
          <JavaRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- Single File Editor -->
      <div v-else-if="activeMode === 'editor'" class="flex flex-col h-full">
        <!-- Language & Example Selectors -->
        <div class="flex items-center gap-6 px-4 py-3 border-b border-slate-700 bg-slate-800/50">
          <div class="flex items-center gap-3">
            <label class="text-sm text-slate-400 font-medium">{{ t('editor.language') }}:</label>
            <select 
              v-model="singleFileLanguage"
              @change="handleLanguageChange"
              class="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
            >
              <option v-for="lang in languages" :key="lang.id" :value="lang.id">
                {{ lang.label }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm text-slate-400 font-medium">Example:</label>
            <select 
              v-model="selectedExample"
              @change="loadExample"
              class="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500 min-w-[120px]"
            >
              <template v-if="exampleSnippets[singleFileLanguage]">
                <option v-for="(code, key) in exampleSnippets[singleFileLanguage]" :key="key" :value="key">
                  {{ key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ') }}
                </option>
              </template>
            </select>
          </div>
        </div>
        
        <!-- Editor -->
        <div class="flex-1 min-h-0">
          <Suspense>
            <template #default>
              <MonacoEditor 
                v-model="singleFileCode"
                :language="singleFileLanguage"
                theme="vs-dark"
                height="100%"
              />
            </template>
            <template #fallback>
              <div class="flex items-center justify-center h-full">
                <div class="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
