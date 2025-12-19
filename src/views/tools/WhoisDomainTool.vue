<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const domainInput = ref('')
const loading = ref(false)
const result = ref(null)
const error = ref('')

const queryWhois = async () => {
  if (!domainInput.value) return
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const domain = domainInput.value.trim().toLowerCase()
    const res = await fetch(`https://rdap.snapnames.com/rdap/domain/${domain}`)
    if (!res.ok) throw new Error('Query failed or domain not found')
    const data = await res.json()
    
    // Extract key info from RDAP
    result.value = {
      name: data.ldhName,
      status: data.status ? data.status.join(', ') : 'N/A',
      registrar: data.entities ? data.entities.find(e => e.roles.includes('registrar'))?.vcardArray[1].find(v => v[0] === 'fn')[3] : 'N/A',
      creation: data.events ? data.events.find(e => e.eventAction === 'registration')?.eventDate : 'N/A',
      expiry: data.events ? data.events.find(e => e.eventAction === 'expiration')?.eventDate : 'N/A'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto animate-fade-in relative px-4 sm:px-0 pt-4 pb-20">
    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden transition-all duration-500">
      <div class="p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10">
        <h2 class="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">{{ t('tools.whois-domain.title') }}</h2>
        <p class="text-slate-500 dark:text-slate-400 font-medium">{{ t('tools.whois-domain.desc') }}</p>
      </div>

      <div class="p-8 sm:p-12 space-y-8">
        <div class="relative group">
          <input 
            v-model="domainInput" 
            @keyup.enter="queryWhois"
            type="text" 
            :placeholder="t('tools.whois-domain.placeholder')"
            class="block w-full px-6 py-5 text-xl font-mono rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all shadow-inner"
          >
          <button 
            @click="queryWhois"
            :disabled="loading"
            class="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ t('tools.whois-domain.btn') }}
          </button>
        </div>

        <div v-if="error" class="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/30 font-bold flex items-center gap-3 animate-shake">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>

        <div v-if="result" class="space-y-6 animate-fade-in">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
              <p class="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{{ t('tools.whois-domain.info.registrar') }}</p>
              <p class="text-xl font-bold text-slate-800 dark:text-white">{{ result.registrar }}</p>
            </div>
            <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
              <p class="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{{ t('tools.whois-domain.info.status') }}</p>
              <p class="text-lg font-bold text-slate-700 dark:text-slate-300">{{ result.status }}</p>
            </div>
            <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
              <p class="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{{ t('tools.whois-domain.info.creation') }}</p>
              <p class="text-xl font-mono text-slate-800 dark:text-white">{{ result.creation }}</p>
            </div>
            <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
              <p class="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{{ t('tools.whois-domain.info.expiry') }}</p>
              <p class="text-xl font-mono text-slate-800 dark:text-white">{{ result.expiry }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
