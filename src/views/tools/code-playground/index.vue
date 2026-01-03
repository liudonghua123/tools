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
const RubyRunner = defineAsyncComponent(() => import('./components/RubyRunner.vue'))
const PerlRunner = defineAsyncComponent(() => import('./components/PerlRunner.vue'))
const RRunner = defineAsyncComponent(() => import('./components/RRunner.vue'))
const CppRunner = defineAsyncComponent(() => import('./components/CppRunner.vue'))
const OctaveRunner = defineAsyncComponent(() => import('./components/OctaveRunner.vue'))
const GoRunner = defineAsyncComponent(() => import('./components/GoRunner.vue'))
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
  { id: 'ruby', icon: 'ruby', label: t('tools.code-playground.modes.ruby') },
  { id: 'php', icon: 'php', label: t('tools.code-playground.modes.php') },
  { id: 'java', icon: 'java', label: t('tools.code-playground.modes.java') },
  { id: 'cpp', icon: 'cpp', label: t('tools.code-playground.modes.cpp') },
  { id: 'r', icon: 'r', label: t('tools.code-playground.modes.r') },
  { id: 'perl', icon: 'perl', label: t('tools.code-playground.modes.perl') },
  { id: 'go', icon: 'go', label: t('tools.code-playground.modes.go', 'Go') },
  { id: 'octave', icon: 'octave', label: t('tools.code-playground.modes.octave') },
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
  { id: 'python', label: 'Python' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'perl', label: 'Perl' }
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
  },
  ruby: {
    basics: `# Ruby basics
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")`,
    blocks: `# Iterators and Blocks
[1, 2, 3, 4, 5].each do |n|
  puts "Number: #{n}" if n.odd?
end`,
    class: `# Classes
class Animal
  attr_reader :name
  def initialize(name)
    @name = name
  end
  def speak
    "#{@name} says generic sound"
  end
end

puts Animal.new("Leo").speak`
  },
  perl: {
    basics: `# Perl basics
sub greet {
    my $name = shift;
    "Hello, $name!";
}
print greet("World"), "\\n";`,
    regex: `# Regular Expressions
my $str = "The quick brown fox jumps over the lazy dog";
if ($str =~ /(fox)/) {
    print "Found: $1\\n";
}`,
    map: `# Map and Join
my @nums = (1..5);
my @doubled = map { $_ * 2 } @nums;
print "Doubled: ", join(", ", @doubled), "\\n";`
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
      <div class="inline-flex items-center justify-center p-4 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/10 dark:to-fuchsia-500/10 rounded-3xl mb-4 shadow-2xl ring-4 ring-violet-500/10 backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
        <svg class="w-10 h-10 text-violet-600 dark:text-violet-400 filter drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ t('tools.code-playground.title') }}</h1>
      <p class="mt-2 text-slate-500 font-medium">{{ t('tools.code-playground.desc') }}</p>
    </div>

    <!-- Mode Tabs -->
    <div class="flex justify-start gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide px-1">
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
        <svg v-if="mode.icon === 'web'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M9.032 2l10.005 112.093 44.896 12.401 45.02-12.387L118.968 2H9.032zm89.126 26.539l-.627 7.172L97.255 39H44.59l1.257 14h50.156l-.336 3.471-3.233 36.119-.238 2.27L64 102.609v.002l-.034.018-28.177-7.423L33.876 74h13.815l.979 10.919L63.957 89H64v-.546l15.355-3.875L80.959 67H33.261l-3.383-38.117L29.549 25h68.939l-.33 3.539z" />
        </svg>
        <svg v-else-if="mode.icon === 'markdown'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M11.95 24.348c-5.836 0-10.618 4.867-10.618 10.681v57.942c0 5.814 4.782 10.681 10.617 10.681h104.102c5.835 0 10.617-4.867 10.617-10.681V35.03c0-5.814-4.783-10.681-10.617-10.681H14.898l-.002-.002H11.95zm-.007 9.543h104.108c.625 0 1.076.423 1.076 1.14v57.94c0 .717-.453 1.14-1.076 1.14H11.949c-.623 0-1.076-.423-1.076-1.14V35.029c0-.715.451-1.135 1.07-1.138z" />
          <path d="M20.721 84.1V43.9H32.42l11.697 14.78L55.81 43.9h11.696v40.2H55.81V61.044l-11.694 14.78-11.698-14.78V84.1H20.722zm73.104 0L76.28 64.591h11.697V43.9h11.698v20.69h11.698zm0 0" />
        </svg>
        <svg v-else-if="mode.icon === 'python'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M49.33 62h29.159C86.606 62 93 55.132 93 46.981V19.183c0-7.912-6.632-13.856-14.555-15.176-5.014-.835-10.195-1.215-15.187-1.191-4.99.023-9.612.448-13.805 1.191C37.098 6.188 35 10.758 35 19.183V30h29v4H23.776c-8.484 0-15.914 5.108-18.237 14.811-2.681 11.12-2.8 17.919 0 29.53C7.614 86.983 12.569 93 21.054 93H31V79.952C31 70.315 39.428 62 49.33 62zm-1.838-39.11c-3.026 0-5.478-2.479-5.478-5.545 0-3.079 2.451-5.581 5.478-5.581 3.015 0 5.479 2.502 5.479 5.581-.001 3.066-2.465 5.545-5.479 5.545zm74.789 25.921C120.183 40.363 116.178 34 107.682 34H97v12.981C97 57.031 88.206 65 78.489 65H49.33C41.342 65 35 72.326 35 80.326v27.8c0 7.91 6.745 12.564 14.462 14.834 9.242 2.717 17.994 3.208 29.051 0C85.862 120.831 93 116.549 93 108.126V97H64v-4h43.682c8.484 0 11.647-5.776 14.599-14.66 3.047-9.145 2.916-17.799 0-29.529zm-41.955 55.606c3.027 0 5.479 2.479 5.479 5.547 0 3.076-2.451 5.579-5.479 5.579-3.015 0-5.478-2.502-5.478-5.579 0-3.068 2.463-5.547 5.478-5.547z" />
        </svg>
        <svg v-else-if="mode.icon === 'ruby'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M3.802 99.828c.656 23.608 17.689 23.959 24.945 24.167l-16.759-39.14-8.186 14.973z" />
          <path d="M4.981 65.131l6.987 19.821 30.365-6.812L77 45.922l9.783-31.075L71.38 3.969l-26.19 9.802c-8.252 7.675-24.263 22.86-24.84 23.146-.573.291-10.575 19.195-15.369 28.214z" />
        </svg>
        <svg v-else-if="mode.icon === 'php'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M64 30.332C28.654 30.332 0 45.407 0 64s28.654 33.668 64 33.668c35.345 0 64-15.075 64-33.668S99.346 30.332 64 30.332zm-5.982 9.81h7.293v.003l-1.745 8.968h6.496c4.087 0 6.908.714 8.458 2.139 1.553 1.427 2.017 3.737 1.398 6.93l-3.053 15.7h-7.408l2.902-14.929c.33-1.698.208-2.855-.365-3.473-.573-.617-1.793-.925-3.658-.925h-5.828L58.752 73.88h-7.291l6.557-33.738zM26.73 49.114h14.133c4.252 0 7.355 1.116 9.305 3.348 1.95 2.232 2.536 5.346 1.758 9.346-.32 1.649-.863 3.154-1.625 4.52-.763 1.364-1.76 2.613-2.99 3.745-1.468 1.373-3.098 2.353-4.891 2.936-1.794.585-4.08.875-6.858.875h-6.294l-1.745 8.97h-7.35l6.557-33.74zm57.366 0h14.13c4.252 0 7.353 1.116 9.303 3.348h.002c1.95 2.232 2.538 5.346 1.76 9.346-.32 1.649-.861 3.154-1.623 4.52-.763 1.364-1.76 2.613-2.992 3.745-1.467 1.373-3.098 2.353-4.893 2.936-1.794.585-4.077.875-6.855.875h-6.295l-1.744 8.97h-7.35l6.557-33.74zm-51.051 5.325-2.742 14.12h4.468c2.963 0 5.172-.556 6.622-1.673 1.45-1.116 2.428-2.981 2.937-5.592.485-2.507.264-4.279-.666-5.309-.93-1.032-2.79-1.547-5.584-1.547h-5.035zm57.363 0-2.744 14.12h4.47c2.965 0 5.17-.556 6.622-1.673 1.449-1.116 2.427-2.981 2.935-5.592.487-2.507.266-4.279-.664-5.309-.93-1.032-2.792-1.547-5.584-1.547h-5.035z" />
        </svg>
        <svg v-else-if="mode.icon === 'java'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z" />
        </svg>
         <svg v-else-if="mode.icon === 'cpp'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
           <path d="M63.443 0c-1.782 0-3.564.39-4.916 1.172L11.594 28.27C8.89 29.828 6.68 33.66 6.68 36.78v54.197c0 1.562.55 3.298 1.441 4.841l-.002.002c.89 1.543 2.123 2.89 3.475 3.672l46.931 27.094c2.703 1.562 7.13 1.562 9.832 0h.002l46.934-27.094c1.352-.78 2.582-2.129 3.473-3.672.89-1.543 1.441-3.28 1.441-4.843V36.779c0-1.557-.55-3.295-1.441-4.838v-.002c-.891-1.545-2.121-2.893-3.473-3.67L68.359 1.173C67.008.39 65.226 0 63.443 0zm.002 26.033c13.465 0 26.02 7.246 32.77 18.91l-16.38 9.479c-3.372-5.836-9.66-9.467-16.39-9.467-10.432 0-18.922 8.49-18.922 18.924S53.013 82.8 63.445 82.8c6.735 0 13.015-3.625 16.395-9.465l16.375 9.477c-6.746 11.662-19.305 18.91-32.77 18.91-20.867 0-37.843-16.977-37.843-37.844s16.976-37.844 37.843-37.844v-.002zM92.881 57.57h4.201v4.207h4.203v4.203h-4.203v4.207h-4.201V65.98h-4.207v-4.203h4.207V57.57zm15.765 0h4.208v4.207h4.203v4.203h-4.203v4.207h-4.208V65.98h-4.205v-4.203h4.205V57.57z" />
         </svg>
         <svg v-else-if="mode.icon === 'r'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
           <path d="M64 14.6465v.002c-35.346 0-64 19.1902-64 42.8632 0 20.764 22.0464 38.0766 51.3164 42.0176v-12.83c-15.55-4.89-26.166-14.6943-26.166-25.9923 0-16.183 21.7795-29.3027 48.6465-29.3027 26.866 0 46.6914 8.9748 46.6914 29.3027 0 10.486-5.2715 17.9507-14.0645 22.7207 1.204.908 2.2184 2.073 2.9024 3.42l.3886.6543C121.0248 79.772 128 69.1888 128 57.5098c0-23.672-28.654-42.8633-64-42.8633zM52.7363 41.2637v72.084l21.834-.0098-.0039-28.2188h5.8613c1.199 0 1.7167.3481 2.9297 1.3301 1.454 1.177 3.8164 5.2383 3.8164 5.2383l11.5371 21.666 24.6739-.0097-15.2657-25.7403a8.388 8.388 0 0 0-1.4199-2.041c-.974-1.036-2.3255-1.8227-3.1055-2.2188-2.249-1.1375-6.12-2.3076-6.123-2.3085 0 0 19.08-1.4151 19.08-20.4141 0-18.999-19.9706-19.3574-19.9706-19.3574H52.7363zm22.0176 15.627 13.2188.0077s6.123-.3302 6.123 6.0098c0 6.216-6.123 6.2344-6.123 6.2344l-13.2247.0039.006-12.2559zm9.3457 32.6366c-2.612.257-5.3213.411-8.1133.463l.002 9.6288a88.362 88.362 0 0 0 12.4746-2.4902l-.502-.9414c-.68-1.268-1.3472-2.5426-2.0332-3.8066a41.01 41.01 0 0 0-1.828-2.8516v-.002z" />
         </svg>
         <svg v-else-if="mode.icon === 'perl'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
           <path d="M21,11V13H19.78C19.7,13.39 19.58,13.77 19.43,14.13L20.8,15.5L19.39,16.91L18,15.51C17.65,15.66 17.27,15.79 16.89,15.87V17.08H14.89V15.87C14.5,15.79 14.12,15.66 13.77,15.51L12.37,16.91L10.96,15.5L12.33,14.13C12.18,13.77 12.06,13.39 11.98,13H11V11H11.98C12.06,10.61 12.18,10.23 12.33,9.87L10.96,8.5L12.37,7.09L13.77,8.49C14.12,8.34 14.5,8.21 14.89,8.13V7.08H16.89V8.13C17.27,8.21 17.65,8.34 18,8.49L19.39,7.09L20.8,8.5L19.43,9.87C19.58,10.23 19.7,10.61 19.78,11H21M17.5,12A1.5,1.5 0 0,0 16,10.5A1.5,1.5 0 0,0 14.5,12A1.5,1.5 0 0,0 16,13.5A1.5,1.5 0 0,0 17.5,12M6.5,7C6.04,8.44 5.79,9.96 5.79,11.53C5.79,13.1 6.04,14.62 6.5,16.06H3.64C3.1,14.65 2.79,13.11 2.79,11.53C2.79,9.95 3.1,8.41 3.64,7H6.5Z" />
         </svg>
        <svg v-else-if="mode.icon === 'octave'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M123.965 91.902c-7.246-18.297-13.262-37.058-20.184-55.476-3.054-7.84-6.047-15.746-10.215-23.082-1.656-2.633-3.238-5.528-5.953-7.215a4.013 4.013 0 00-2.222-.606c-1.27.028-2.536.594-3.504 1.415-3.645 2.886-5.805 7.082-8.227 10.949-4.277 7.172-8.789 14.687-15.941 19.347-3.36 2.371-7.762 2.63-11 5.172-4.43 3.34-7.442 8.078-11.074 12.184-.829.988-2.11 1.383-3.227 1.918C21.578 60.93 10.738 65.336 0 69.98c9.09 7.032 18.777 13.29 28.05 20.079 2.544-.504 5.098-1.547 7.72-1.082 4.16 1.3 6.597 5.285 8.503 8.93 3.875 7.94 6.676 16.323 9.813 24.57 5.246-.375 9.969-3.079 14.027-6.258 7.809-6.324 13.758-14.5 20.305-22.047 3.14-3.3 6.34-7.23 11.05-8.149 4.762-1.152 9.864.555 13.395 3.836 4.957 4.43 9.344 9.551 15.137 12.942-.777-3.836-2.645-7.278-4.035-10.899zM42.96 79.012c-4.57 2.703-9.426 4.93-14.176 7.289-7.457-4.996-14.723-10.29-22.05-15.465 9.878-4.328 19.91-8.348 29.917-12.387 4.746 3.703 9.637 7.223 14.383 10.926-2.23 3.563-4.914 6.871-8.074 9.637zm10.168-12.414C48.414 63.058 43.64 59.609 39 55.977c2.977-4.055 6.238-7.977 10.14-11.172 2.587-1.657 5.743-2.117 8.426-3.61 6.368-3.18 10.711-9.011 14.86-14.582-5.317 13.805-10.992 27.664-19.297 39.985zm0 0" />
        </svg>
        <svg v-else-if="mode.icon === 'go'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M128 54.4c.1 4.5-.6 9.1-2 13.4-2.6 7.6-7.8 13.5-15 17-6.2 3.1-13 4.5-19.9 4.3-10.4-.2-20-4.2-27.7-11.4l-11.2 11c5.2 4.9 11.2 8.7 17.8 11.1 9.8 3.5 20.3 4.9 30.7 4.1 11.1-.9 21.6-5.4 29.8-12.9 6.5-5.9 11-13.6 13-22.1 2.3-10.3 2.1-21-.8-31.2-3.1-11.2-9.4-21.2-18.1-28.7-10.3-8.8-23.3-13.7-36.8-13.8-14.8-.1-29.2 5.3-40.4 15.3-9.5 8.5-16.1 19.8-18.8 32-2.5 11.2-2 22.8 1.4 33.7 4 12.8 12.1 23.9 22.8 31.5 12.2 8.7 27 13.3 42 13 13.5-.3 26.6-4.6 37.4-12.5l-9.8-13.7c-7.2 5.1-15.8 7.9-24.6 8.1-10.4.3-20.6-2.9-28.6-9.5-6.5-5.3-11.2-12.7-13.2-20.8-2.3-9.3-2-19.1 1-28.1 3.5-10.1 10.6-18.3 19.9-23.2 8.2-4.3 17.5-6.4 26.9-6.1 12.1.4 23.6 5.8 31.8 14.8 6 6.5 9.7 14.8 10.6 23.6 1.1 9.4-.5 18.9-4.5 27.5-3.8 8.1-10 14.9-17.7 19.3-6 3.4-12.7 5.2-19.5 5.1-1.3 0-2.6-.1-3.9-.2l-2.4 16.4c2.1.2 4.2.4 6.3.4 10.5.1 20.9-2.7 29.9-8.1 11.1-6.6 19.7-16.7 24.3-28.8 3.9-10.3 5-21.4 3.2-32.2s-6.3-21.1-13.4-29.6c-10.5-11.8-25.5-18.8-41.2-19.3-17.1-.5-33.8 6.4-45.7 18.7-10.8 11.1-17.2 25.5-18.3 40.8-1.1 15.6 2.8 31.1 11 44.1 10 15.9 25.8 26.9 44 30.5 18.2 3.6 37.1.5 52.8-8.8 12.1-7.2 21.8-18 27.6-30.8 4.2-9.3 6.3-19.4 6-29.6l-16.4-.3z" />
        </svg>
        <svg v-else-if="mode.icon === 'sqlite'" class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
          <path d="M115.95 2.781c-5.504-4.906-12.16-2.933-18.738 2.902a47.9 47.9 0 00-2.918 2.856c-11.246 11.93-21.684 34.02-24.926 50.895 1.262 2.563 2.25 5.832 2.902 8.328.325 1.238.617 2.488.875 3.746 0 0-.101-.379-.515-1.578l-.266-.777a8.12 8.12 0 00-.176-.426c-.734-1.707-2.761-5.309-3.656-6.875a172.299 172.299 0 00-2.008 6.27c2.582 4.714 4.149 12.8 4.149 12.8s-.133-.527-.782-2.355c-.57-1.617-3.437-6.637-4.117-7.809-1.16 4.29-1.62 7.18-1.207 7.883.813 1.363 1.578 3.723 2.25 6.324 1.528 5.868 2.586 13.016 2.586 13.016l.094 1.192c-.203 4.886-.102 9.781.297 14.656.508 6.113 1.457 11.359 2.668 14.172l.824-.45c-1.781-5.535-2.504-12.792-2.184-21.155.477-12.79 3.422-28.215 8.856-44.29 9.191-24.261 21.938-43.733 33.602-53.034-10.63 9.601-25.023 40.695-29.332 52.203C79.404 74.162 75.99 86.252 73.93 97.84c3.555-10.863 15.043-15.527 15.043-15.527s5.637-6.954 12.223-16.883c-3.945.898-10.426 2.441-12.598 3.351-3.2 1.34-4.063 1.797-4.063 1.797s10.371-6.312 19.27-9.172c12.234-19.27 25.566-46.645 12.145-58.625M16.896 5.681c-5.398.02-9.77 4.39-9.785 9.789v88.574c.016 5.398 4.39 9.765 9.785 9.785h50.227a122.816 122.816 0 01-.277-14.438c-.031-.332-.059-.754-.086-1.067a143.095 143.095 0 00-2.523-12.684c-.645-2.507-1.465-4.789-1.965-5.636-.621-1.051-.524-1.653-.52-2.305 0-.64.082-1.305.2-2.059.316-1.878.73-3.738 1.246-5.574l1.156-.148c-.09-.188-.074-.348-.164-.516l-.219-2.031c.64-2.137 1.316-4.262 2.04-6.371l1.066-.102c-.043-.082-.055-.203-.098-.28l-.23-1.685c3.363-17.496 13.8-39.699 25.601-52.219.352-.37.711-.683 1.055-1.035z" />
        </svg>
        <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

      <!-- Ruby Runner -->
      <Suspense v-else-if="activeMode === 'ruby'">
        <template #default>
          <RubyRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
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

      <!-- C/C++ Runner -->
      <Suspense v-else-if="activeMode === 'cpp'">
        <template #default>
          <CppRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- R Runner -->
      <Suspense v-else-if="activeMode === 'r'">
        <template #default>
          <RRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- Perl Runner -->
      <Suspense v-else-if="activeMode === 'perl'">
        <template #default>
          <PerlRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- Octave Runner -->
      <Suspense v-else-if="activeMode === 'octave'">
        <template #default>
          <OctaveRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
      </Suspense>

      <!-- Go Runner -->
      <Suspense v-else-if="activeMode === 'go'">
        <template #default>
          <GoRunner />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
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
