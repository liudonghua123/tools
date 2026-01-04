<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { WASI, File, OpenFile, ConsoleStdout, PreopenDirectory, Directory } from "@bjorn3/browser_wasi_shim";
import { untar } from "@andrewbranch/untar.js";

const { t } = useI18n()

// Zig examples
const examples = {
  hello: `const std = @import("std");

pub fn main() !void {
    try std.fs.File.stdout().writeAll("Hello, World!\\n");
}`,
  loops: `const std = @import("std");

pub fn main() !void {
    var sum: u32 = 0;
    var i: u32 = 0;
    while (i <= 10) : (i += 1) {
        sum += i;
    }
    std.debug.print("Sum 0..10 is {d}\\n", .{sum});
}`,
  fizzbuzz: `const std = @import("std");

pub fn main() !void {
    const stdout = std.fs.File.stdout();
    var i: u8 = 1;
    while (i <= 20) : (i += 1) {
        if (i % 15 == 0) {
            try stdout.writeAll("FizzBuzz\\n");
        } else if (i % 3 == 0) {
            try stdout.writeAll("Fizz\\n");
        } else if (i % 5 == 0) {
            try stdout.writeAll("Buzz\\n");
        } else {
            // Convert i to string and write it
            var buffer: [3]u8 = undefined; // enough for numbers 1-20
            const num_str = try std.fmt.bufPrint(&buffer, "{d}", .{i});
            try stdout.writeAll(num_str);
            try stdout.writeAll("\\n");
        }
    }
}`
}

const zigCode = ref(examples.hello)
const output = ref([])
const isLoading = ref(false)
const isRunning = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)
const selectedExample = ref('hello')

let wasmBinary = null;
let zigLibDirectory = null; // This will be the Directory object for /lib

// Helper to convert tree to Directory
function convert(node) {
    return new Directory(
        new Map([...node.entries()].map(([key, value]) => {
            if (value instanceof Map) {
                return [key, convert(value)];
            } else {
                return [key, new File(value)];
            }
        }))
    )
}

// Load Zig Compiler and Standard Library
const loadZigAssets = async () => {
    if (isReady.value) return;

    isLoading.value = true
    output.value = []

    try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const zigBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}zig-wasm/`;
        
        // 1. Load Zig Compiler WASM
        loadingProgress.value = 'Loading Zig Compiler...';
        const wasmResp = await fetch(`${zigBase}zig.wasm`);
        if (!wasmResp.ok) throw new Error(`Failed to fetch zig.wasm: ${wasmResp.statusText}`);
        wasmBinary = await wasmResp.arrayBuffer();

        // 2. Load and Extract Zig Lib (std)
        loadingProgress.value = 'Loading Standard Library...';
        const tarResp = await fetch(`${zigBase}zig.tar.gz`);
        if (!tarResp.ok) throw new Error(`Failed to fetch zig.tar.gz: ${tarResp.statusText}`);
        let arrayBuffer = await tarResp.arrayBuffer();

        loadingProgress.value = 'Extracting Standard Library...';
        
        // Handle GZIP
        const magicNumber = new Uint8Array(arrayBuffer).slice(0, 2);
        if (magicNumber[0] === 0x1F && magicNumber[1] === 0x8B) {
             const ds = new DecompressionStream("gzip");
             const decompressedStream = new Response(arrayBuffer).body.pipeThrough(ds);
             arrayBuffer = await new Response(decompressedStream).arrayBuffer();
        }

        // Untar using @andrewbranch/untar.js
        const entries = untar(arrayBuffer);
        const root = new Map();

        for (const e of entries) {
            let filename = e.filename;
            
            // Normalize path: handle optional zig-out/lib or just lib
            if (filename.startsWith("zig-out/lib/")) {
                filename = filename.slice("zig-out/".length);
            }
            
            if (!filename.startsWith("lib/")) continue;
            
            const path = filename.slice("lib/".length);
            if (!path) continue; // Skip the lib dir itself

            const splitPath = path.split("/");
            let c = root;
            
            // Build tree
            for (const segment of splitPath.slice(0, -1)) {
                if (!c.has(segment)) {
                    c.set(segment, new Map());
                }
                c = c.get(segment);
            }
            // Add file
            c.set(splitPath[splitPath.length - 1], e.fileData);
        }

        zigLibDirectory = convert(root); // Create Directory object for /lib

        isReady.value = true
        loadingProgress.value = ''
    } catch (e) {
        console.error("Zig load failed", e);
        output.value.push({ type: 'error', message: 'Failed to load Zig runtime: ' + e.message });
    } finally {
        isLoading.value = false
    }
}

const runZig = async () => {
    if (!isReady.value) await loadZigAssets();
    if (!wasmBinary || !zigLibDirectory) return;

    isRunning.value = true;
    output.value = [];
    runTime.value = null;

    try {
        const startTime = performance.now();

        // --- STAGE 1: COMPILATION ---
        
        // Setup FDs for Compiler
        // 0: stdin, 1: stdout, 2: stderr, 3: ., 4: /lib, 5: /cache
        const cwdMap = new Map();
        cwdMap.set("main.zig", new File(new TextEncoder().encode(zigCode.value)));
        
        const compilerFds = [
            new OpenFile(new File([])), // 0: stdin
            ConsoleStdout.lineBuffered((msg) => output.value.push({ type: 'log', message: msg })), // 1: stdout
            ConsoleStdout.lineBuffered((msg) => output.value.push({ type: 'error', message: msg })), // 2: stderr
            new PreopenDirectory(".", cwdMap), // 3: .
            new PreopenDirectory("/lib", zigLibDirectory.contents), // 4: /lib
            new PreopenDirectory("/cache", new Map()) // 5: /cache
        ];

        const args = [
            "zig.wasm", 
            "build-exe", 
            "main.zig", 
            "-fno-llvm", 
            "-fno-lld", 
            "-fno-ubsan-rt", 
            "-fno-entry" 
        ];
        const env = []; // Empty environment

        const wasi = new WASI(args, env, compilerFds);

        // Instantiate Compiler
        const { instance: compilerInstance } = await WebAssembly.instantiate(wasmBinary, {
            "wasi_snapshot_preview1": wasi.wasiImport
        });

        // Run Compiler
        const exitCode = wasi.start(compilerInstance);

        if (exitCode !== 0) {
            throw new Error(`Compilation failed (Exit Code: ${exitCode})`);
        }

        // --- STAGE 2: EXECUTION ---
        
        // Retrieve the compiled binary "main.wasm" from cwdMap
        // Note: cwdMap keys are strings, values are File or Directory objects
        // The compiler writes "main.wasm" to the CWD
        
        const compiledFile = cwdMap.get("main.wasm");
        if (!compiledFile || !(compiledFile instanceof File)) {
            // Debug: list files
            console.log("Files in CWD:", Array.from(cwdMap.keys()));
            throw new Error("Compilation successful but 'main.wasm' not found.");
        }

        output.value.push({ type: 'log', message: "Compilation successful. Running..." });

        // Setup FDs for User Program
        // Reference: https://github.com/zigtools/playground/blob/main/src/workers/runner.ts
        const userFds = [
            new OpenFile(new File([])), // stdin
            ConsoleStdout.lineBuffered((msg) => output.value.push({ type: 'log', message: msg })), // stdout
            ConsoleStdout.lineBuffered((msg) => output.value.push({ type: 'error', message: msg })), // stderr
            new PreopenDirectory(".", new Map()), // Preopen .
        ];

        // Args: ["main.wasm"]
        const userWasi = new WASI(["main.wasm"], [], userFds);
        
        const { instance: userInstance } = await WebAssembly.instantiate(compiledFile.data, {
            "wasi_snapshot_preview1": userWasi.wasiImport
        });
        
        userWasi.start(userInstance);

        const endTime = performance.now();
        runTime.value = (endTime - startTime).toFixed(2);

    } catch (e) {
        output.value.push({ type: 'error', message: e.message });
        console.error(e);
    } finally {
        isRunning.value = false;
    }
}

const onExampleChange = () => {
    if (examples[selectedExample.value]) {
        zigCode.value = examples[selectedExample.value];
    }
}

const clearOutput = () => {
    output.value = [];
    runTime.value = null;
}

const getOutputColor = (type) => {
    return type === 'error' ? 'text-red-400' : 'text-emerald-400';
}

onMounted(() => {
    loadZigAssets();
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
            <!-- Zig Icon -->
           <svg class="w-5 h-5 text-orange-400" viewBox="0 0 128 128" fill="currentColor">
             <path d="M12.94 13.916 2.08 26.657h111.45L128 13.916H12.94zm-1.89 12.74L0 39.398l112.52.09L124.96 26.657H11.05zm-.1 38.648-9.98 12.74 125.86.095L115.82 65.304H10.95zm-1.63 12.74L0 90.785l114.73.09 11.23-12.83H9.32zm9.15 12.74L7.54 116.265h111.45l1.43-12.74H18.47z"/>
           </svg>
            <span class="font-bold text-white">Zig</span>
            <span v-if="isReady" class="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full">{{ t('tools.code-playground.common.ready') }}</span>
            <span v-else-if="!isLoading" class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full">{{ t('tools.code-playground.common.not_loaded') }}</span>
          </div>

          <!-- Examples Dropdown -->
          <div class="relative group">
            <select 
              v-model="selectedExample"
              @change="onExampleChange"
              class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
            >
              <option value="hello">Hello World</option>
              <option value="loops">Loops & Vars</option>
              <option value="fizzbuzz">FizzBuzz</option>
            </select>
            <div class="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button 
          @click="runZig"
          :disabled="isLoading || isRunning"
          :class="[
            'px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2',
            isLoading || isRunning 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          ]"
        >
          <svg v-if="isLoading || isRunning" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          {{ isLoading ? 'Loading...' : isRunning ? 'Running...' : t('tools.code-playground.common.run') }}
        </button>
      </div>

      <!-- Editor -->
      <div class="flex-1 min-h-0">
        <MonacoEditor 
          v-model="zigCode"
          language="zig"
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
        <div v-if="output.length === 0 && !isLoading && !isRunning" class="text-slate-500 italic">
          Click "Run" to execute Zig code...
        </div>
      </div>
    </div>
  </div>
</template>
