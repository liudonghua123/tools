<script setup>
import { ref, onMounted, computed } from 'vue'
import MonacoEditor from './MonacoEditor.vue'

const emit = defineEmits(['ready'])

// SQL Code
const sqlCode = ref(`-- Create a table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (name, email) VALUES 
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

-- Query data
SELECT * FROM users;
`)

const output = ref([])
const dbTables = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

let db = null
let SQL = null

// Load SQLite
const loadSqlite = async () => {
    if (db) return db
    
    isLoading.value = true
    loadingProgress.value = 'Loading SQLite runtime...'
    
    try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const sqlBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}sql-wasm/`;
        
        // Inject script
        if (!window.initSqlJs) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `${sqlBase}sql-wasm.js`;
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load sql-wasm.js'));
                document.head.appendChild(script);
            });
        }
        
        loadingProgress.value = 'Initializing Database...'
        
        if (window.initSqlJs) {
            SQL = await window.initSqlJs({
                locateFile: file => `${sqlBase}${file}`
            });
            db = new SQL.Database();
            await refreshSchema();
        } else {
            throw new Error('initSqlJs not found');
        }

        isReady.value = true
        emit('ready')
        return db
    } catch (e) {
        output.value = [{ error: `Failed to load SQLite: ${e.message}` }]
        console.error(e)
    } finally {
        isLoading.value = false
        loadingProgress.value = ''
    }
}

// Refresh DB Schema (Tables & Columns)
const refreshSchema = async () => {
    if (!db) return
    const tables = []
    
    // Get tables
    const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    if (res.length > 0) {
        for (const row of res[0].values) {
            const tableName = row[0]
            // Get columns
            const colRes = db.exec(`PRAGMA table_info(${tableName})`)
            const columns = []
            if (colRes.length > 0) {
                columns.push(...colRes[0].values.map(c => ({ name: c[1], type: c[2] })))
            }
            tables.push({ name: tableName, columns })
        }
    }
    dbTables.value = tables
}

// Run SQL
const runSql = async () => {
    output.value = [] // Clear previous results
    runTime.value = null
    
    if (!db) await loadSqlite();
    
    try {
        const startTime = performance.now();
        
        const results = db.exec(sqlCode.value);
        
        const endTime = performance.now();
        runTime.value = (endTime - startTime).toFixed(2);
        
        // Refresh schema as queries might create/drop tables
        await refreshSchema();
        
        if (results.length === 0) {
            output.value = [{ message: 'Query executed successfully. No results returned.' }];
        } else {
            output.value = results;
        }
        
    } catch (e) {
        output.value = [{ error: e.message }];
    }
}
</script>

<template>
  <div class="flex h-full">
    <!-- Sidebar: Database Structure -->
    <div class="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div class="px-4 py-3 border-b border-slate-700 font-bold text-slate-300 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Database
        </div>
        <div class="flex-1 overflow-y-auto p-2">
            <div v-if="!isReady" class="text-xs text-slate-500 text-center py-4">
                No database loaded
            </div>
            <div v-else-if="dbTables.length === 0" class="text-xs text-slate-500 text-center py-4">
                No tables found
            </div>
            <div v-else class="space-y-1">
                <div v-for="table in dbTables" :key="table.name" class="text-sm">
                    <div class="flex items-center gap-2 text-slate-300 font-medium px-2 py-1 hover:bg-slate-800 rounded">
                        <svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {{ table.name }}
                    </div>
                    <div class="pl-6 space-y-0.5">
                        <div v-for="col in table.columns" :key="col.name" class="flex justify-between text-xs text-slate-500 px-2 py-0.5 hover:bg-slate-800/50 rounded">
                            <span>{{ col.name }}</span>
                            <span class="text-slate-600">{{ col.type }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Editor -->
        <div class="h-1/2 flex flex-col border-b border-slate-700">
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-white">SQL Query</span>
                </div>
                <button 
                  @click="runSql"
                  class="px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Run
                </button>
            </div>
            <div class="flex-1 min-h-0">
                <MonacoEditor 
                  v-model="sqlCode"
                  language="sql"
                  theme="vs-dark"
                  height="100%"
                />
            </div>
        </div>

        <!-- Output -->
        <div class="h-1/2 flex flex-col bg-slate-900 overflow-hidden">
             <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Results</span>
                  <span v-if="runTime" class="text-xs text-slate-500">{{ runTime }}ms</span>
                </div>
             </div>
             
             <div class="flex-1 overflow-auto p-4">
                <div v-if="output.length === 0" class="text-slate-500 italic text-sm">
                    Run query to see results...
                </div>
                
                <div v-for="(res, idx) in output" :key="idx" class="mb-6 last:mb-0">
                    <div v-if="res.error" class="text-red-400 p-2 bg-red-900/10 rounded border border-red-900/20 text-sm font-mono">
                        Error: {{ res.error }}
                    </div>
                    <div v-else-if="res.message" class="text-emerald-400 p-2 text-sm">
                        {{ res.message }}
                    </div>
                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr>
                                    <th v-for="col in res.columns" :key="col" class="bg-slate-800 p-2 border border-slate-700 text-slate-300 font-medium whitespace-nowrap">
                                        {{ col }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, rIdx) in res.values" :key="rIdx" class="hover:bg-slate-800/30">
                                    <td v-for="(val, cIdx) in row" :key="cIdx" class="p-2 border border-slate-700 text-slate-400 whitespace-nowrap font-mono">
                                        {{ val === null ? 'NULL' : val }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="mt-1 text-xs text-slate-500">
                            {{ res.values.length }} rows returned
                        </div>
                    </div>
                </div>
             </div>
        </div>
    </div>
  </div>
</template>
