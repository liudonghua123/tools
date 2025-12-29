<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'

const { t } = useI18n()

const emit = defineEmits(['output', 'error', 'ready'])

// Java version mapping to ECJ versions
const versionMap = {
  8: 'ecj-3.26.0.jar',
  11: 'ecj-3.33.0.jar',
  17: 'ecj-3.44.0.jar'
}

// State
const javaVersion = ref(8)
const selectedExample = ref('hello')
const output = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)
const isCompiling = ref(false)
const isRunning = ref(false)

// Current version being initialized
let currentInitVersion = null

// Example code snippets
const examples = {
  hello: {
    name: 'Hello World',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("Java version: " + System.getProperty("java.version"));
    }
}`
  },
  classes: {
    name: 'Classes',
    code: `class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name + ", " + age + " years old.");
    }
}

public class Main {
    public static void main(String[] args) {
        Person alice = new Person("Alice", 25);
        Person bob = new Person("Bob", 30);
        
        alice.introduce();
        bob.introduce();
    }
}`
  },
  collections: {
    name: 'Collections',
    code: `import java.util.ArrayList;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // ArrayList example
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        
        System.out.println("Fruits:");
        for (String fruit : fruits) {
            System.out.println("  - " + fruit);
        }
        
        // HashMap example
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);
        
        System.out.println("\\nScores:");
        for (String name : scores.keySet()) {
            System.out.println("  " + name + ": " + scores.get(name));
        }
    }
}`
  },
  fibonacci: {
    name: 'Fibonacci',
    code: `public class Main {
    public static long fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 15; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();
        
        // Performance test
        long start = System.currentTimeMillis();
        long result = fibonacci(35);
        long end = System.currentTimeMillis();
        
        System.out.println("\\nfibonacci(35) = " + result);
        System.out.println("Time: " + (end - start) + "ms");
    }
}`
  },
  lambda: {
    name: 'Lambda (Java 8+)',
    code: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Filter even numbers and square them
        List<Integer> result = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(Collectors.toList());
        
        System.out.println("Original: " + numbers);
        System.out.println("Even squares: " + result);
        
        // Sum using reduce
        int sum = numbers.stream()
            .reduce(0, (a, b) -> a + b);
        System.out.println("Sum: " + sum);
        
        // ForEach with lambda
        System.out.print("Doubled: ");
        numbers.forEach(n -> System.out.print(n * 2 + " "));
        System.out.println();
    }
}`
  }
}

// Current code
const javaCode = ref(examples.hello.code)

// Load example when selection changes
const loadExample = () => {
  if (examples[selectedExample.value]) {
    javaCode.value = examples[selectedExample.value].code
  }
}

// Watch for example changes
watch(selectedExample, loadExample)

// Log to output
const log = (message, type = 'log') => {
  output.value.push({ type, message })
}

// Initialize CheerpJ
const initCheerpJ = async (version) => {
  // If already initialized, check if it's the same version
  if (isReady.value) {
    if (currentInitVersion !== version) {
      log(`CheerpJ is already initialized with Java ${currentInitVersion}. To use Java ${version}, please refresh the page.`, 'warning')
      return false
    }
    return true
  }

  isLoading.value = true
  loadingProgress.value = `Loading CheerpJ runtime (Java ${version})...`
  
  try {
    // Load CheerpJ script if not present
    if (!window.cheerpjInit) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cjrtnc.leaningtech.com/4.2/loader.js'
        script.onload = resolve
        script.onerror = () => reject(new Error('Failed to load CheerpJ'))
        document.head.appendChild(script)
      })
    }

    loadingProgress.value = `Initializing Java ${version} environment...`
    
    // Initialize CheerpJ with the selected version
    // Note: cheerpjInit can only be called once in the lifetime of the page
    await window.cheerpjInit({ 
      version: version,
      status: 'none'
    })
    
    currentInitVersion = version
    isReady.value = true
    emit('ready')
    return true
  } catch (e) {
    // If it's already initialized (maybe by another session or fast click), handle it
    if (e.message.includes('Already initialized')) {
      isReady.value = true
      return true
    }
    log(`Failed to initialize CheerpJ: ${e.message}`, 'error')
    emit('error', e)
    return false
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

// Helper to infer class name from code
const inferClassName = (code) => {
  // Try to find public class
  const publicClassMatch = code.match(/public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/)
  if (publicClassMatch) return publicClassMatch[1]
  
  // Fallback to any class
  const classMatch = code.match(/class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/)
  if (classMatch) return classMatch[1]
  
  return 'Main'
}

// Compile and run Java code
const runJava = async () => {
  output.value = []
  runTime.value = null
  
  const version = javaVersion.value
  
  try {
    // Initialize CheerpJ if needed
    if (!await initCheerpJ(version)) {
      return
    }
    
    isCompiling.value = true
    log('Compiling...', 'info')
    
    const startTime = performance.now()
    
    // Infer class name and set filename
    const sourceCode = javaCode.value
    const className = inferClassName(sourceCode)
    const fileName = `/str/${className}.java`
    
    // Write source code to virtual filesystem
    window.cheerpOSAddStringFile(fileName, sourceCode)
    
    // Get ECJ jar path
    const baseUrl = import.meta.env.BASE_URL || '/'
    const ecjJar = versionMap[version]
    const ecjPath = `/app${baseUrl}ecj/${ecjJar}`
    
    // Compile with ECJ - output to /files/
    const compileExitCode = await window.cheerpjRunMain(
      'org.eclipse.jdt.internal.compiler.batch.Main',
      ecjPath,
      fileName,
      '-d', '/files/',
      '-source', version,
      '-target', version,
    )
    
    isCompiling.value = false
    
    if (compileExitCode === 0) {
      log('Compilation successful!', 'success')
      isRunning.value = true
      log('Running...', 'info')
      
    // Intercept console output during execution
    const originalLog = console.log
    const originalError = console.error
    
    console.log = (...args) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
      if (message.trim()) {
        log(message)
        originalLog.apply(console, args)
      }
    }
    console.error = (...args) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
      if (message.trim()) {
        log(message, 'error')
        originalError.apply(console, args)
      }
    }

    try {
      // Run the compiled class from /files/
      const runExitCode = await window.cheerpjRunMain(className, '/files/')
      
      isRunning.value = false
      
      const endTime = performance.now()
      runTime.value = (endTime - startTime).toFixed(2)
      
      if (runExitCode !== 0) {
        log(`Program exited with code ${runExitCode}`, 'warning')
      }
    } finally {
      // Restore original console
      console.log = originalLog
      console.error = originalError
    }
    } else {
      log('Compilation failed. Check your code for errors.', 'error')
    }
  } catch (e) {
    log(`Error: ${e.message}`, 'error')
    emit('error', e)
  } finally {
    isCompiling.value = false
    isRunning.value = false
  }
}

// Clear output
const clearOutput = () => {
  output.value = []
  runTime.value = null
}

// Get output color based on type
const getOutputColor = (type) => {
  switch (type) {
    case 'error': return 'text-red-400'
    case 'success': return 'text-emerald-400'
    case 'warning': return 'text-yellow-400'
    case 'info': return 'text-blue-400'
    default: return 'text-orange-300'
  }
}

// Get output icon based on type
const getOutputIcon = (type) => {
  switch (type) {
    case 'error': return '✗'
    case 'success': return '✓'
    case 'warning': return '⚠'
    case 'info': return 'ℹ'
    default: return '›'
  }
}

// Button state
const isDisabled = computed(() => isLoading.value || isCompiling.value || isRunning.value)
const buttonText = computed(() => {
  if (isLoading.value) return t('tools.code-playground.java.loading').split(' ')[0] + '...'
  if (isCompiling.value) return t('tools.code-playground.java.compiling')
  if (isRunning.value) return t('tools.code-playground.java.running')
  return t('tools.code-playground.common.run')
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50">
        <div class="flex items-center gap-2">
          <!-- Java Icon (Coffee cup) -->
          <svg class="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 16c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4H8v4zm-2 0v-4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2h-2c-1.1 0-2-.9-2-2zm10-8c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v2h8V8z"/>
            <path d="M7 3v2h10V3H7zm0 14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2H7z" opacity=".3"/>
          </svg>
          <span class="font-bold text-white">Java</span>
          <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
          <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded', 'Not loaded') }}</span>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Version Selector -->
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-400">{{ t('tools.code-playground.java.version') }}:</label>
            <select 
              v-model="javaVersion"
              :disabled="isDisabled || isReady"
              class="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"
            >
              <option :value="8">Java 8</option>
              <option :value="11">Java 11</option>
              <option :value="17">Java 17</option>
            </select>
          </div>
          
          <!-- Example Selector -->
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-400">{{ t('tools.code-playground.java.example') }}:</label>
            <select 
              v-model="selectedExample"
              class="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500 min-w-[120px]"
            >
              <option v-for="(example, key) in examples" :key="key" :value="key">
                {{ example.name }}
              </option>
            </select>
          </div>
          
          <!-- Run Button -->
          <button 
            @click="runJava"
            :disabled="isDisabled"
            :class="[
              'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
              isDisabled 
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-500 text-white'
            ]"
          >
            <svg v-if="isDisabled" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            {{ buttonText }}
          </button>
        </div>
      </div>

      <!-- Editor -->
      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="javaCode"
          language="java"
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
          <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div class="text-slate-400">{{ loadingProgress }}</div>
          <div class="text-xs text-slate-500">First load may take 10-20 seconds...</div>
        </div>
      </div>

      <!-- Output Content -->
      <div v-else class="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
        <div 
          v-for="(line, idx) in output" 
          :key="idx"
          :class="['flex items-start gap-2', getOutputColor(line.type)]"
        >
          <span :class="getOutputColor(line.type)">{{ getOutputIcon(line.type) }}</span>
          <span class="whitespace-pre-wrap">{{ line.message }}</span>
        </div>
        <div v-if="output.length === 0 && !isLoading" class="text-slate-500 italic">
          Click "Run" to compile and execute Java code...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
