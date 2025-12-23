<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BackButton from '../../../components/BackButton.vue'

const { t } = useI18n()
const ipInput = ref('')
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
  if (!ipInput.value) return
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const ip = ipInput.value.trim()
    const res = await fetch(`https://rdap.apnic.net/ip/${ip}`)
    if (!res.ok) throw new Error('Query failed or IP not found')
    const data = await res.json()
    
    // Helper to find event date
    const getEventDate = (entity, action) => {
      // Check top level events first, then entity events
      let events = entity.events || data.events
      const event = events?.find(e => e.eventAction === action)
      return event ? event.eventDate : null
    }

    // Process Entities
    // IP RDAP often has entities nested differently or fewer roles than domains
    const abuse = getEntityByRole(data.entities, 'abuse')
    const admin = getEntityByRole(data.entities, 'administrative')
    const tech = getEntityByRole(data.entities, 'technical')

    result.value = {
      range: `${data.startAddress} - ${data.endAddress}`,
      netname: data.name || 'N/A',
      country: data.country || 'N/A',
      type: data.type || 'N/A',
      ipVersion: data.ipVersion || 'N/A',
      status: data.status || [],
      
      dates: {
        registration: getEventDate(data, 'registration'),
        lastChanged: getEventDate(data, 'last changed')
      },
      
      cidrs: data.cidr0_cidrs ? data.cidr0_cidrs.map(c => `${c.v4prefix}/${c.length}`) : [],
      
      contacts: {
        abuse: abuse ? {
           name: getVcardValue(abuse.vcardArray, 'fn'),
           email: getVcardValue(abuse.vcardArray, 'email'),
           phone: getVcardValue(abuse.vcardArray, 'tel')
        } : null,
        admin: admin ? {
           name: getVcardValue(admin.vcardArray, 'fn'),
           email: getVcardValue(admin.vcardArray, 'email')
        } : null,
        tech: tech ? {
           name: getVcardValue(tech.vcardArray, 'fn'),
           email: getVcardValue(tech.vcardArray, 'email')
        } : null
      },

      remarks: data.remarks?.map(r => ({
        title: r.title,
        description: r.description
      })) || [],
      
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
      <div class="p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10">
        <h2 class="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">{{ t('tools.whois-ip.title') }}</h2>
        <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.whois-ip.desc') }}</p>
      </div>

      <!-- Query Card -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/40 dark:border-gray-700/50">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative group">
            <input 
              v-model="ipInput" 
              type="text" 
              :placeholder="t('tools.whois-ip.placeholder')"
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
            {{ t('tools.whois-ip.btn') }}
          </button>
        </div>

        <!-- Result Section -->
        <div v-if="error" class="mt-8 p-6 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 font-medium">
          {{ error }}
        </div>

        <div v-if="result" class="mt-12 space-y-8 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Network Info -->
            <div class="md:col-span-2 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <p class="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">{{ t('tools.whois-ip.result.netname') }}</p>
                   <p class="text-3xl font-black text-slate-800 dark:text-white">{{ result.netname }}</p>
                 </div>
                 <div class="flex flex-wrap gap-2">
                    <span v-for="s in result.status" :key="s" class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-full">
                      {{ s }}
                    </span>
                 </div>
               </div>
               <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p class="text-xs text-slate-400 uppercase font-bold">Range</p>
                    <p class="text-slate-700 dark:text-slate-200 font-mono">{{ result.range }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400 uppercase font-bold">CIDR</p>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="cidr in result.cidrs" :key="cidr" class="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-mono">
                        {{ cidr }}
                      </span>
                    </div>
                  </div>
                   <div>
                    <p class="text-xs text-slate-400 uppercase font-bold">Country</p>
                    <p class="text-slate-700 dark:text-slate-200">{{ result.country }}</p>
                  </div>
               </div>
            </div>

            <!-- Important Dates -->
             <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                 <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {{ t('tools.whois-ip.result.dates') }}
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
                {{ t('tools.whois-ip.result.contacts') }}
              </h3>
               <div class="space-y-4">
                <div v-if="result.contacts.abuse" class="pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                  <p class="text-xs font-bold text-red-500 uppercase mb-1">Abuse Contact</p>
                  <p class="font-bold text-slate-700 dark:text-slate-200">{{ result.contacts.abuse.name }}</p>
                  <p class="text-sm text-slate-500">{{ result.contacts.abuse.email }}</p>
                </div>
                 <div v-if="result.contacts.admin" class="pb-3 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                  <p class="text-xs font-bold text-slate-400 uppercase mb-1">Administrative</p>
                  <p class="font-bold text-slate-700 dark:text-slate-200">{{ result.contacts.admin.name }}</p>
                   <p class="text-sm text-slate-500">{{ result.contacts.admin.email }}</p>
                </div>
              </div>
            </div>

            <!-- Description / Notices -->
            <div class="md:col-span-2 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">{{ t('tools.whois-ip.result.remarks') }}</h3>
               <div class="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 <div v-for="(rem, idx) in result.remarks" :key="'rem'+idx" class="text-sm">
                   <p class="font-bold text-slate-700 dark:text-slate-300" v-if="rem.title && rem.title !== 'description' && rem.title !== 'remarks'">{{ rem.title }}</p>
                   <div class="space-y-1 mt-1">
                      <p v-for="(desc, i) in rem.description" :key="i" class="text-slate-500 font-mono text-xs">
                        {{ desc }}
                      </p>
                   </div>
                 </div>
                 
                  <div v-for="(notice, idx) in result.notices" :key="'not'+idx" class="text-sm mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
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
