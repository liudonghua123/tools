<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BackButton from '../../components/BackButton.vue'

const { t, locale } = useI18n()

const activeTab = ref('check') 
const idNumberInput = ref('')
const generatedIds = ref([])
const regionData = ref({})

onMounted(async () => {
  try {
    const res = await fetch('/tools/data/regions.json')
    if (res.ok) {
      regionData.value = await res.json()
    }
  } catch (e) {
    console.error('Failed to load regions', e)
  }
})

const getRegionName = (code) => {
  return regionData.value[code] || `Region Code: ${code}`
}

const validateIdCard = (id) => {
  if (!id) return null
  const cleanId = id.trim().toUpperCase()
  if (cleanId.length !== 18) return { valid: false, msg: 'Length must be 18' }
  
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checksums = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  
  let sum = 0
  let first17Valid = true
  for (let i = 0; i < 17; i++) {
    if (isNaN(cleanId[i])) {
      first17Valid = false
      break
    }
    sum += parseInt(cleanId[i]) * factors[i]
  }
  
  if (!first17Valid) return { valid: false, msg: 'First 17 must be digits' }
  
  const expectedCheck = checksums[sum % 11]
  const actualCheck = cleanId[17]
  const checksumMatch = actualCheck === expectedCheck
  
  const year = cleanId.substring(6, 10)
  const month = cleanId.substring(10, 12)
  const day = cleanId.substring(12, 14)
  const genderCode = parseInt(cleanId.substring(16, 17))
  const gender = genderCode % 2 === 0 ? 'female' : 'male'
  
  return {
    valid: checksumMatch,
    checksum_error: !checksumMatch,
    expectedCheck,
    birth: `${year}-${month}-${day}`,
    gender,
    place: getRegionName(cleanId.substring(0, 6))
  }
}

const checkResult = computed(() => {
  if (idNumberInput.value.length < 17) return null
  return validateIdCard(idNumberInput.value)
})

const generateRandomId = () => {
  const regions = ['110101', '310101', '440101', '440301']
  const region = regions[Math.floor(Math.random() * regions.length)]
  const year = 1970 + Math.floor(Math.random() * 40)
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 999)).padStart(3, '0')
  const base = `${region}${year}${month}${day}${seq}`
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checksums = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(base[i]) * factors[i]
  }
  const check = checksums[sum % 11]
  const newId = base + check
  const details = validateIdCard(newId)
  
  generatedIds.value.unshift({
    id: newId,
    expanded: false,
    details
  })
  if (generatedIds.value.length > 5) generatedIds.value.pop()
}

// Visualized ID Structure
const idParts = computed(() => {
  const input = idNumberInput.value.replace(/\s/g, '').toUpperCase().padEnd(18, '_')
  return [
    { label: t('tools.id-card.structure.region'), val: input.substring(0, 6), color: 'text-blue-500' },
    { label: t('tools.id-card.structure.birth'), val: input.substring(6, 14), color: 'text-purple-500' },
    { label: t('tools.id-card.structure.seq'), val: input.substring(14, 17), color: 'text-indigo-500' },
    { label: t('tools.id-card.structure.check'), val: input.substring(17, 18), color: 'text-pink-500' }
  ]
})

const selectGeneratedId = (id) => {
  idNumberInput.value = id
  activeTab.value = 'check'
}

const toggleExpand = (idx) => {
  generatedIds.value[idx].expanded = !generatedIds.value[idx].expanded
}
</script>

<template>
  <div class="max-w-4xl mx-auto animate-fade-in relative px-4 sm:px-0 pt-4">
    <BackButton />

    <!-- Header -->
    <div class="mb-8 text-center pt-8">
      <div class="inline-flex items-center justify-center p-4 bg-blue-100/50 dark:bg-blue-900/30 rounded-3xl mb-6 shadow-xl ring-4 ring-blue-50 dark:ring-blue-900/10">
        <svg class="w-10 h-10 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      </div>
      <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{{ t('tools.id-card.title') }}</h1>
      <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.id-card.desc') }}</p>
    </div>

    <!-- Tabs -->
    <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-gray-700/50">
      <div class="flex border-b border-gray-100 dark:border-gray-700">
        <button 
          v-for="tab in ['check', 'gen']" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'flex-1 py-5 text-center font-bold transition-all duration-300 relative',
            activeTab === tab 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          ]"
        >
          {{ t(`tools.id-card.${tab}_tab`) }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-8 animate-fade-in"></div>
        </button>
      </div>

      <div class="p-6 sm:p-10">
        <!-- Check Tab -->
        <div v-if="activeTab === 'check'" class="space-y-10">
          <div class="space-y-6">
            <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest">{{ t('tools.id-card.input_label') }}</label>
            
            <div class="relative group">
              <input 
                v-model="idNumberInput" 
                type="text" 
                maxlength="18"
                placeholder="110101199003078888"
                class="block w-full px-6 py-5 text-3xl font-mono tracking-[0.2em] rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all shadow-inner text-center"
              >
              <div class="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full"></div>
            </div>
            
            <!-- Structure Visualization -->
            <div class="grid grid-cols-4 gap-2 sm:gap-4">
              <div v-for="part in idParts" :key="part.label" class="flex flex-col items-center">
                 <div :class="['font-mono text-xl sm:text-2xl bg-white/50 dark:bg-slate-800/50 w-full text-center py-3 rounded-xl mb-2 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors', part.color]">
                   {{ part.val }}
                 </div>
                 <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">{{ part.label }}</span>
              </div>
            </div>
          </div>

          <div v-if="checkResult" class="p-8 rounded-3xl border-2 transition-all duration-500" :class="checkResult.valid ? 'bg-green-50/30 border-green-200/50 dark:border-green-900/30 text-green-900 dark:text-green-300 shadow-lg shadow-green-500/5' : 'bg-red-50/30 border-red-200/50 dark:border-red-900/30 text-red-900 dark:text-red-300 shadow-lg shadow-red-500/5'">
             <div class="flex items-center space-x-3 font-black text-xl mb-8">
               <div v-if="checkResult.valid" class="p-2 bg-green-500 rounded-full text-white">
                 <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
               </div>
               <div v-else class="p-2 bg-red-500 rounded-full text-white">
                 <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
               </div>
               <span>
                 {{ checkResult.valid ? t('tools.id-card.result.valid') : (checkResult.checksum_error ? t('tools.id-card.result.checksum_error') : t('tools.id-card.result.invalid')) }}
                 <span v-if="!checkResult.valid && checkResult.msg" class="text-sm font-bold opacity-60 block mt-1">{{ checkResult.msg }}</span>
               </span>
             </div>
             
             <!-- Always show info if first 17 digits were available -->
             <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div class="p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/50 dark:border-white/5">
                 <span class="block text-[10px] font-black uppercase text-slate-400 mb-2">{{ t('tools.id-card.result.birth') }}</span>
                 <span class="text-xl font-bold">{{ checkResult.birth }}</span>
               </div>
               <div class="p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/50 dark:border-white/5">
                  <span class="block text-[10px] font-black uppercase text-slate-400 mb-2">{{ t('tools.id-card.result.gender') }}</span>
                  <span class="text-xl font-bold">{{ t('common.gender.' + checkResult.gender) }}</span>
               </div>
               <div class="p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/50 dark:border-white/5">
                  <span class="block text-[10px] font-black uppercase text-slate-400 mb-2">{{ t('tools.id-card.result.place') }}</span>
                  <span class="text-lg font-bold leading-tight">{{ checkResult.place }}</span>
               </div>
               
               <!-- Suggested Checksum -->
               <div v-if="checkResult.checksum_error" class="sm:col-span-3 p-4 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl border border-blue-200/50 dark:border-blue-900/30 flex items-center justify-between">
                  <span class="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">{{ t('tools.id-card.result.correct_checksum') }}</span>
                  <span class="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">{{ checkResult.expectedCheck }}</span>
               </div>
             </div>
          </div>
        </div>

        <!-- Generate Tab -->
        <div v-else class="text-center space-y-8">
          <div class="py-12 flex flex-col items-center">
            <button 
              @click="generateRandomId"
              class="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <svg class="w-6 h-6 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ t('tools.id-card.gen_btn') }}
            </button>
          </div>
          
          <div v-if="generatedIds.length > 0" class="mt-8 space-y-4 text-left">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">{{ locale === 'zh' ? '最近生成' : 'Recent' }}</h3>
            <div 
              v-for="(item, idx) in generatedIds" 
              :key="item.id" 
              class="group bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div 
                class="p-5 flex items-center justify-between transition-colors"
                :class="{'border-b border-slate-50 dark:border-slate-700': item.expanded}"
              >
                <div @click="toggleExpand(idx)" class="flex-1 cursor-pointer flex items-center gap-4">
                  <span class="font-mono text-xl tracking-widest text-slate-700 dark:text-slate-200">{{ item.id }}</span>
                  <div class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-black uppercase rounded-full tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ item.expanded ? (locale === 'zh' ? '折叠' : 'Fold') : (locale === 'zh' ? '展开' : 'Expand') }}
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <button 
                    @click.stop="copyToClipboard(item.id, item.id)"
                    class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors relative group/btn"
                    :title="locale === 'zh' ? '复制' : 'Copy'"
                  >
                    <svg v-if="copiedId !== item.id" class="w-5 h-5 text-slate-400 group-hover/btn:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h3m-3 4h3" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-if="copiedId === item.id" class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-[10px] rounded font-bold whitespace-nowrap animate-bounce-short">
                      {{ locale === 'zh' ? '已复制' : 'Copied!' }}
                    </span>
                  </button>
                  <button @click="toggleExpand(idx)" class="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg 
                      class="w-5 h-5 transition-transform duration-300" 
                      :class="{'rotate-180': item.expanded}"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <transition name="expand">
                <div v-show="item.expanded" class="p-5 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-2 gap-4 text-sm border-t border-slate-50 dark:border-slate-700">
                  <div class="space-y-1">
                    <p class="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{{ t('tools.id-card.result.birth') }}</p>
                    <p class="text-slate-700 dark:text-slate-200 font-mono">{{ item.details.birth }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{{ t('tools.id-card.result.gender') }}</p>
                    <p class="text-slate-700 dark:text-slate-200 font-bold">{{ t(`common.gender.${item.details.gender}`) }}</p>
                  </div>
                  <div class="col-span-2 space-y-1">
                    <p class="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{{ t('tools.id-card.result.place') }}</p>
                    <p class="text-slate-700 dark:text-slate-200 font-medium">{{ item.details.place }}</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
