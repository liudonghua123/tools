<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BackButton from '../../../components/BackButton.vue'

const { t, locale } = useI18n()

const searchQuery = ref('')
const ports = ref([])
const loading = ref(true)

const fetchPorts = async () => {
  try {
    loading.value = true
    const response = await fetch(`${import.meta.env.BASE_URL}data/ports.json`)
    if (response.ok) {
      ports.value = await response.json()
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPorts)

const filteredPorts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return ports.value.slice(0, 50)
  return ports.value.filter(p => 
    String(p.port).includes(q) || 
    p.service?.toLowerCase().includes(q) ||
    p.desc?.toLowerCase().includes(q) ||
    p.desc_zh?.toLowerCase().includes(q)
  ).slice(0, 100)
})

const getStatusClass = (status) => {
  const s = status.toLowerCase()
  if (s.includes('yes')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  if (s.includes('assigned')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  if (s.includes('unofficial')) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
  if (s.includes('reserved')) return 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-400'
  return 'hidden'
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-fade-in relative pt-4">
    <BackButton />

    <header class="text-center pt-8">
      <div class="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/40 rounded-3xl mb-6 shadow-xl ring-4 ring-purple-50 dark:ring-purple-900/10">
        <svg class="w-10 h-10 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </div>
      <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{{ t('tools.port-query.title') }}</h1>
      <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.port-query.desc') }}</p>
    </header>

    <div class="relative max-w-2xl mx-auto">
      <input 
        v-model="searchQuery" 
        type="text" 
        :placeholder="t('tools.port-query.search_placeholder')"
        class="block w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl text-slate-900 dark:text-white shadow-2xl outline-none transition-all text-xl font-medium"
      >
      <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
          <thead>
             <tr class="bg-slate-50/50 dark:bg-slate-900/50">
               <th v-for="h in ['port', 'proto', 'service', 'desc']" :key="h" class="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 {{ t(`tools.port-query.table.${h}`) }}
               </th>
             </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-if="loading">
              <td colspan="4" class="px-8 py-20 text-center">
                <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-purple-600"></div>
              </td>
            </tr>
            <tr v-else-if="filteredPorts.length === 0">
              <td colspan="4" class="px-8 py-20 text-center text-slate-500 text-lg font-medium">
                {{ t('common.no_results') }}
              </td>
            </tr>
            <tr v-for="(port, idx) in filteredPorts" :key="idx" class="hover:bg-purple-50/20 dark:hover:bg-purple-900/5 transition-colors group">
              <td class="px-8 py-6 text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {{ port.port }}
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-wrap gap-1.5 max-w-[120px]">
                  <span v-if="port.tcp" :class="getStatusClass(port.tcp)" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase">TCP</span>
                  <span v-if="port.udp" :class="getStatusClass(port.udp)" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase">UDP</span>
                  <span v-if="port.sctp" :class="getStatusClass(port.sctp)" class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase">SCTP</span>
                </div>
              </td>
              <td class="px-8 py-6 font-bold text-slate-900 dark:text-slate-100">
                <div class="text-sm">{{ port.service }}</div>
                <div v-if="port.service_zh" class="text-xs text-slate-400 mt-1">{{ port.service_zh }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="max-w-md">
                  <div v-if="locale === 'zh' && port.desc_zh" class="text-slate-900 dark:text-slate-200 font-bold text-sm mb-1 line-clamp-2">{{ port.desc_zh }}</div>
                  <div :class="{'text-xs text-slate-400 font-medium': locale === 'zh' && port.desc_zh}" class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ port.desc }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-8 py-6 bg-slate-50/30 dark:bg-black/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4">
        <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Data Source: Wikipedia</span>
        <div class="flex gap-2">
           <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span><span class="text-[9px] text-slate-400 font-bold">YES</span></span>
           <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span><span class="text-[9px] text-slate-400 font-bold">ASSIGNED</span></span>
           <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-500"></span><span class="text-[9px] text-slate-400 font-bold">UNOFFICIAL</span></span>
        </div>
      </div>
    </div>
  </div>
</template>
