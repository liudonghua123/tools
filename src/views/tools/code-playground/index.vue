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
        <svg v-if="mode.icon === 'web'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <svg v-else-if="mode.icon === 'markdown'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 3H22C23.1 3 24 3.9 24 5V19C24 20.1 23.1 21 22 21H2C0.9 21 0 20.1 0 19V5C0 3.9 0.9 3 2 3M2 5V19H22V5H2M5 7H11V10H13V7H19V17H17V12H15V17H13V12H11V17H5V7Z" />
        </svg>
        <svg v-else-if="mode.icon === 'python'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.97,1C5.82,1,6.13,3.67,6.13,3.67L6.14,6.43H12.06V7.26H3.68C3.68,7.26,1,7.2,1,13.33C1,19.46,3.35,19.2,3.35,19.2H5.43V16.32C5.43,16.32,5.32,12.79,9.01,12.79H15.01C15.01,12.79,18.4,12.77,18.4,9.39V4.65C18.4,4.65,18.89,1,11.97,1M9.04,2.94A1.02,1.02,0,1,1,8,3.96,1.02,1.02,0,0,1,9.04,2.94M12,23c6.15,0,5.84-2.67,5.84-2.67L17.83,17.57H11.91V16.74H20.29C20.29,16.74,23,16.8,23,10.67C23,4.54,20.65,4.8,20.65,4.8H18.57V7.68C18.57,7.68,18.68,11.21,14.99,11.21H8.99C8.99,11.21,5.6,11.23,5.6,14.61V19.35C5.6,19.35,5.11,23,12,23M14.96,21.06A1.02,1.02,0,1,1,16,20.04,1.02,1.02,0,0,1,14.96,21.06Z" />
        </svg>
        <svg v-else-if="mode.icon === 'ruby'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L5.8,7.5L3,12L5.8,16.5L12,22L18.2,16.5L21,12L18.2,7.5L12,2M12,4.5L14,5.5L14,5.6L12,7.2L10,5.6L10,5.5L12,4.5M6,8L9,7L11,8.5L10,12H6L6,8M18,8L18,12H14L13,8.5L15,7L18,8M7.5,13H11L12,17L13,13H16.5L12,20.5L7.5,13Z" />
        </svg>
        <svg v-else-if="mode.icon === 'php'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5,11.72C16.5,13.78 14.82,15.45 12.75,15.45C10.68,15.45 9,13.78 9,11.72C9,9.65 10.68,7.98 12.75,7.98C14.82,7.98 16.5,9.65 16.5,11.72M22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2C17.52,2 22,6.48 22,12M18,11.72C18,8.82 15.65,6.47 12.75,6.47C9.85,6.47 7.5,8.82 7.5,11.72C7.5,14.62 9.85,16.97 12.75,16.97C15.65,16.97 18,14.62 18,11.72M20.14,7H17.29C17.75,8.44 18,9.96 18,11.53C18,13.1 17.75,14.62 17.29,16.06H20.14C20.69,14.65 21,13.11 21,11.53C21,9.95 20.69,8.41 20.14,7M6.71,7C6.25,8.44 6,9.96 6,11.53C6,13.1 6.25,14.62 6.71,16.06H3.86C3.31,14.65 3,13.11 3,11.53C3,9.95 3.31,8.41 3.86,7H6.71Z" />
        </svg>
        <svg v-else-if="mode.icon === 'java'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2,18.52C2,19.34 2.66,20 3.48,20H7V18.52H3.48V13H1.36V18.52C1.36,19.34 2.02,20 2.84,20M22.64,13H20.52V18.52H17V20H20.52C21.34,20 22,19.34 22,18.52V13M12,2C9,2 6,4 6,7C6,8.5 7,10 8,10.5V11H12V10.5C13,10 14,8.5 14,7C14,4 11,2 12,2M12,4C13,4 12.5,5.5 12,5.5C11.5,5.5 11,4 12,4M10,8.5V7C10,6.5 10.5,6 11,6C11.5,6 12,6.5 12,7V8.5H10M8.5,13C8.5,12.5 9,12 9.5,12H14.5C15,12 15.5,12.5 15.5,13V18C15.5,18.5 15,19 14.5,19H9.5C9,19 8.5,18.5 8.5,18V13M10,14V17H14V14H10Z" />
        </svg>
        <svg v-else-if="mode.icon === 'cpp'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.24 7.03h-2.14l-.32-.94c-.26-.74-.53-1.42-.8-2.03-.55-1.25-1.52-1.92-2.9-2.01l-10-2.33-.2-.03c-2.32-.23-3.69 1.14-4.08 4.09l-.49 3.19H5.03C2.26 6.97 0 9.23 0 12c0 2.75 2.24 4.97 5 5h.06l-.42 2.76c-.41 2.94.94 4.3 3.25 4.07l.2-.03 10-2.33c1.37-.08 2.34-.76 2.89-2.01.27-.61.54-1.29.8-2.03l.32-.94h2.14c.97 0 1.76-.79 1.76-1.76v-5.98c0-.96-.79-1.75-1.76-1.75zM5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13.43 3.84c-.2.43-.59.66-1.07.72l-10 2.33c-.76.07-1.21-.39-1.07-1.36l1.53-10.03c.14-.94.88-1.52 1.63-1.45l10 2.33c.47.05.8.35 1.01.78.22.42.23.97-.03 1.69l-2 5.3c-.26.73-.25 1.28-.03 1.69z"/>
        </svg>
        <svg v-else-if="mode.icon === 'r'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.9,18.9L16,13.1c1.2-1,2-2.5,2-4.1c0-3.3-2.7-6-6-6H4v18h3V16h4.5l5.5,5.5H21.9z M7,8.5h5c1.7,0,3,1.3,3,3s-1.3,3-3,3H7V8.5z" />
        </svg>
        <svg v-else-if="mode.icon === 'perl'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,11V13H19.78C19.7,13.39 19.58,13.77 19.43,14.13L20.8,15.5L19.39,16.91L18,15.51C17.65,15.66 17.27,15.79 16.89,15.87V17.08H14.89V15.87C14.5,15.79 14.12,15.66 13.77,15.51L12.37,16.91L10.96,15.5L12.33,14.13C12.18,13.77 12.06,13.39 11.98,13H11V11H11.98C12.06,10.61 12.18,10.23 12.33,9.87L10.96,8.5L12.37,7.09L13.77,8.49C14.12,8.34 14.5,8.21 14.89,8.13V7.08H16.89V8.13C17.27,8.21 17.65,8.34 18,8.49L19.39,7.09L20.8,8.5L19.43,9.87C19.58,10.23 19.7,10.61 19.78,11H21M17.5,12A1.5,1.5 0 0,0 16,10.5A1.5,1.5 0 0,0 14.5,12A1.5,1.5 0 0,0 16,13.5A1.5,1.5 0 0,0 17.5,12M6.5,7C6.04,8.44 5.79,9.96 5.79,11.53C5.79,13.1 6.04,14.62 6.5,16.06H3.64C3.1,14.65 2.79,13.11 2.79,11.53C2.79,9.95 3.1,8.41 3.64,7H6.5Z" />
        </svg>
        <svg v-else-if="mode.icon === 'octave'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
        <svg v-else-if="mode.icon === 'sqlite'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3C17.5,3 22,4.8 22,7V17C22,19.2 17.5,21 12,21C6.5,21 2,19.2 2,17V7C2,4.8 6.5,3 12,3M12,5C7,5 4,6.3 4,7C4,7.7 7,9 12,9C17,9 20,7.7 20,7C20,6.3 17,5 12,5M4,9.1V12C4,12.7 7,14 12,14C17,14 20,12.7 20,12V9.1C18.4,10.2 15.4,11 12,11C8.6,11 5.6,10.2 4,9.1M4,14.1V17C4,17.7 7,19 12,19C17,19 20,17.7 20,17V14.1C18.4,15.2 15.4,16 12,16C8.6,16 5.6,15.2 4,14.1Z" />
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
