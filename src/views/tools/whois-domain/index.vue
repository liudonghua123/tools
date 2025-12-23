<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BackButton from '../../../components/BackButton.vue'

const { t } = useI18n()
const domainInput = ref('')
const loading = ref(false)
const result = ref(null)
const error = ref('')

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const getEntityByRole = (entities, role) => {
  if (!entities) return null
  return entities.find(e => e.roles && e.roles.includes(role))
}

const getVcardValue = (vcardArray, key) => {
  if (!vcardArray) return 'N/A'
  const item = vcardArray[1].find(v => v[0] === key)
  return item ? (Array.isArray(item[3]) ? item[3].join(', ') : item[3]) : 'N/A'
}

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
    
    // Helper to find event date
    const getEventDate = (action) => {
      const event = data.events?.find(e => e.eventAction === action)
      return event ? event.eventDate : null
    }

    // Process Entities
    const registrar = getEntityByRole(data.entities, 'registrar')
    const registrant = getEntityByRole(data.entities, 'registrant')
    const technical = getEntityByRole(data.entities, 'technical')
    const administrative = getEntityByRole(data.entities, 'administrative')

    result.value = {
      domainName: data.ldhName || domain,
      handle: data.handle,
      status: data.status || [],
      port43: data.port43,
      secureDNS: data.secureDNS?.delegationSigned ? 'Signed' : 'Unsigned',
      
      dates: {
        registration: getEventDate('registration'),
        expiration: getEventDate('expiration'),
        updated: getEventDate('last changed'),
        lastUpdate: getEventDate('last update of RDAP database')
      },
      
      nameservers: data.nameservers?.map(ns => ns.ldhName) || [],
      
      contacts: {
        registrar: registrar ? {
          name: getVcardValue(registrar.vcardArray, 'fn'),
          email: getVcardValue(registrar.vcardArray, 'email'),
          phone: getVcardValue(registrar.vcardArray, 'tel')
        } : null,
        registrant: registrant ? {
          name: getVcardValue(registrant.vcardArray, 'fn'),
          email: getVcardValue(registrant.vcardArray, 'email'),
          organization: getVcardValue(registrant.vcardArray, 'org')
        } : null,
        tech: technical ? {
          name: getVcardValue(technical.vcardArray, 'fn'),
          email: getVcardValue(technical.vcardArray, 'email')
        } : null
      },
      
      notices: data.notices?.map(n => ({
        title: n.title,
        description: n.description
      })) || []
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
              class="block w-full px-6 py-4 text-xl rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all shadow-inner"
              @keyup.enter="queryWhois"
            >
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
          <!-- Main Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="md:col-span-2 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <p class="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">{{ t('tools.whois-domain.result.domain') }}</p>
                   <p class="text-3xl font-black text-slate-800 dark:text-white break-all">{{ result.domainName }}</p>
                 </div>
                 <div class="flex flex-wrap gap-2">
                    <span v-for="s in result.status" :key="s" class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
                      {{ s }}
                    </span>
                 </div>
               </div>
               <div class="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                 <span v-if="result.handle">ID: {{ result.handle }}</span>
                 <span v-if="result.port43">Server: {{ result.port43 }}</span>
                 <span>DNSSEC: {{ result.secureDNS }}</span>
               </div>
             </div>

            <!-- Dates -->
            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {{ t('tools.whois-domain.result.dates') }}
              </h3>
              <div class="space-y-3">
                <div v-for="(date, name) in result.dates" :key="name" class="flex justify-between items-center group">
                  <span class="text-slate-500 capitalize">{{ name }}</span>
                  <span class="font-mono font-medium dark:text-slate-200">{{ formatDate(date) }}</span>
                </div>
              </div>
            </div>

            <!-- Contacts -->
            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {{ t('tools.whois-domain.result.contacts') }}
              </h3>
              <div class="space-y-4">
                <div v-if="result.contacts.registrar" class="pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                  <p class="text-xs font-bold text-slate-400 uppercase mb-1">{{ t('tools.whois-domain.result.registrar') }}</p>
                  <p class="font-bold text-slate-700 dark:text-slate-200">{{ result.contacts.registrar.name }}</p>
                  <p class="text-sm text-slate-500">{{ result.contacts.registrar.email }}</p>
                </div>
                 <div v-if="result.contacts.registrant" class="pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                  <p class="text-xs font-bold text-slate-400 uppercase mb-1">Registrant</p>
                  <p class="font-bold text-slate-700 dark:text-slate-200">{{ result.contacts.registrant.name || 'Redacted' }}</p>
                </div>
              </div>
            </div>

            <!-- Name Servers -->
            <div class="md:col-span-2 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                {{ t('tools.whois-domain.result.nameservers') }}
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="ns in result.nameservers" :key="ns" class="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-600 dark:text-slate-300">
                  {{ ns }}
                </div>
              </div>
            </div>

            <!-- Notices -->
            <div class="md:col-span-2 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">{{ t('tools.whois-domain.result.notices') }}</h3>
              <div class="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="(notice, idx) in result.notices" :key="idx" class="text-sm">
                  <p class="font-bold text-slate-700 dark:text-slate-300">{{ notice.title }}</p>
                  <p v-for="(desc, i) in notice.description" :key="i" class="text-slate-500 mt-1 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    {{ desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
