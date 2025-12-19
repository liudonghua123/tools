<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BackButton from '../../../components/BackButton.vue'

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
      registrar: data.entities ? data.entities.find(e => e.roles.includes('registrar'))?.vcardArray[1].find(v => v[0] === 'fn')[3] : 'N/A',
      status: data.status || [],
      creationDate: data.events ? data.events.find(e => e.eventAction === 'registration')?.eventDate : 'N/A',
      expirationDate: data.events ? data.events.find(e => e.eventAction === 'expiration')?.eventDate : 'N/A'
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
    <BackButton />
    
    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden transition-all duration-500 mt-8">
      <div class="p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10">
        <h2 class="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">{{ t('tools.whois-domain.title') }}</h2>
        <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.whois-domain.desc') }}</p>
      </div>

      <!-- Query Card -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/40 dark:border-gray-700/50">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative group">
            <input 
              v-model="domainInput" 
              type="text" 
              :placeholder="t('tools.whois-domain.placeholder')"
              class="block w-full px-6 py-4 text-xl rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all shadow-inner"
              @keyup.enter="queryWhois"
            >
            <div class="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
          </div>
          <button 
            @click="queryWhois"
            :disabled="loading"
            class="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
          >
            <svg v-if="loading" class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ t('tools.whois-domain.btn') }}
          </button>
        </div>

        <!-- Result Section -->
        <div v-if="error" class="mt-8 p-6 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 font-medium">
          {{ error }}
        </div>

        <div v-if="result" class="mt-12 space-y-8 animate-fade-in">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{{ t('tools.whois-domain.result.registrar') }}</p>
              <p class="text-xl font-bold dark:text-white">{{ result.registrar }}</p>
            </div>
            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{{ t('tools.whois-domain.result.status') }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="s in result.status" :key="s" class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
                  {{ s }}
                </span>
              </div>
            </div>
            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{{ t('tools.whois-domain.result.created') }}</p>
              <p class="text-xl font-bold dark:text-white">{{ result.creationDate }}</p>
            </div>
            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{{ t('tools.whois-domain.result.expires') }}</p>
              <p class="text-xl font-bold dark:text-white">{{ result.expirationDate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
