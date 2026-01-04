<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from './MonacoEditor.vue'
import { fetchManifest, fetchExample } from '../utils/ExampleLoader'

const { t } = useI18n()

const emit = defineEmits(['ready'])

// SQL Code
const sqlCode = ref('')
const selectedExample = ref('')
const manifest = ref(null)
const output = ref([])
const dbTables = ref([])
const isLoading = ref(false)
const isReady = ref(false)
const loadingProgress = ref('')
const runTime = ref(null)

// Load Manifest and Initial Example
const loadManifestData = async () => {
  try {
    const data = await fetchManifest('sqlite')
    manifest.value = data
    if (data.chapters && data.chapters.length > 0 && data.chapters[0].examples.length > 0) {
      const firstExample = data.chapters[0].examples[0]
      selectedExample.value = firstExample.path
      sqlCode.value = await fetchExample('sqlite', firstExample.path)
    }
  } catch (e) {
    console.error('Failed to load SQLite manifest:', e)
  }
}




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

// Handle example change
const onExampleChange = async () => {
  if (!selectedExample.value) return
  clearOutput()
  try {
    isLoading.value = true
    loadingProgress.value = 'Loading example...'
    sqlCode.value = await fetchExample('sqlite', selectedExample.value)
  } catch (e) {
    output.value = [{ error: `Failed to load example: ${e.message}` }]
  } finally {
    isLoading.value = false
    loadingProgress.value = ''
  }
}

const clearOutput = () => {
  output.value = []
  runTime.value = null
}

onMounted(() => {
  loadManifestData()
})



</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Sidebar: Database Structure -->
    <div class="w-full md:w-64 h-48 md:h-full bg-slate-900 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col">
        <div class="px-4 py-3 border-b border-slate-700 font-bold text-slate-300 flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 128 128" fill="currentColor">
                <path d="M115.95 2.781c-5.504-4.906-12.16-2.933-18.738 2.902a47.9 47.9 0 00-2.918 2.856c-11.246 11.93-21.684 34.02-24.926 50.895 1.262 2.563 2.25 5.832 2.902 8.328.325 1.238.617 2.488.875 3.746 0 0-.101-.379-.515-1.578l-.266-.777a8.12 8.12 0 00-.176-.426c-.734-1.707-2.761-5.309-3.656-6.875a172.299 172.299 0 00-2.008 6.27c2.582 4.714 4.149 12.8 4.149 12.8s-.133-.527-.782-2.355c-.57-1.617-3.437-6.637-4.117-7.809-1.16 4.29-1.62 7.18-1.207 7.883.813 1.363 1.578 3.723 2.25 6.324 1.528 5.868 2.586 13.016 2.586 13.016l.094 1.192c-.203 4.886-.102 9.781.297 14.656.508 6.113 1.457 11.359 2.668 14.172l.824-.45c-1.781-5.535-2.504-12.792-2.184-21.155.477-12.79 3.422-28.215 8.856-44.29 9.191-24.261 21.938-43.733 33.602-53.034-10.63 9.601-25.023 40.695-29.332 52.203C79.404 74.162 75.99 86.252 73.93 97.84c3.555-10.863 15.043-15.527 15.043-15.527s5.637-6.954 12.223-16.883c-3.945.898-10.426 2.441-12.598 3.351-3.2 1.34-4.063 1.797-4.063 1.797s10.371-6.312 19.27-9.172c12.234-19.27 25.566-46.645 12.145-58.625M16.896 5.681c-5.398.02-9.77 4.39-9.785 9.789v88.574c.016 5.398 4.39 9.765 9.785 9.785h50.227a122.816 122.816 0 01-.277-14.438c-.031-.332-.059-.754-.086-1.067a143.095 143.095 0 00-2.523-12.684c-.645-2.507-1.465-4.789-1.965-5.636-.621-1.051-.524-1.653-.52-2.305 0-.64.082-1.305.2-2.059.316-1.878.73-3.738 1.246-5.574l1.156-.148c-.09-.188-.074-.348-.164-.516l-.219-2.031c.64-2.137 1.316-4.262 2.04-6.371l1.066-.102c-.043-.082-.055-.203-.098-.28l-.23-1.685c3.363-17.496 13.8-39.699 25.601-52.219.352-.37.711-.683 1.055-1.035z" />
            </svg>
            {{ t('tools.code-playground.sqlite.database') }}
        </div>
        <div class="flex-1 overflow-y-auto p-2">
            <div v-if="!isReady" class="text-xs text-slate-500 text-center py-4">
                {{ t('tools.code-playground.sqlite.no_db') }}
            </div>
            <div v-else-if="dbTables.length === 0" class="text-xs text-slate-500 text-center py-4">
                {{ t('tools.code-playground.sqlite.no_tables') }}
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
    <div class="flex-1 flex flex-col min-w-0 h-full md:h-auto">
        <!-- Editor -->
        <div class="h-1/2 flex flex-col border-b border-slate-700">
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                <div class="flex items-center gap-4">
                    <span class="font-bold text-white">{{ t('tools.code-playground.sqlite.query') }}</span>
                    
                    <!-- Examples Dropdown -->
                    <div class="relative group">
                      <select 
                        v-model="selectedExample"
                        @change="onExampleChange"
                        class="appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                      >
                        <optgroup v-for="chapter in manifest?.chapters || []" :key="chapter.title" :label="chapter.title">
                          <option v-for="ex in chapter.examples || []" :key="ex.path" :value="ex.path">
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
                </div>
                <button 
                  @click="runSql"
                  class="px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  {{ t('tools.code-playground.common.run') }}
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
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('tools.code-playground.sqlite.results') }}</span>
                  <span v-if="runTime" class="text-xs text-slate-500">{{ runTime }}ms</span>
                </div>
                <button 
                  @click="clearOutput"
                  class="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  {{ t('tools.code-playground.common.clear') }}
                </button>
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
                            {{ t('tools.code-playground.sqlite.row_count', [res.values.length]) }}
                        </div>
                    </div>
                </div>
             </div>
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
