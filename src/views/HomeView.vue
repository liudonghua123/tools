<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', icon: 'M4 6h16M4 12h16M4 18h16' },
  { id: 'identity', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
  { id: 'network', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
  { id: 'dev', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
]

// Dynamic tool discovery
const toolConfigs = import.meta.glob('../views/tools/*/config.js', { eager: true })
const tools = Object.keys(toolConfigs).map((path) => {
  const config = toolConfigs[path].default
  return {
    ...config,
    path: `/tool/${config.id}`
  }
})

const filteredTools = computed(() => {
  return tools.filter(tool => {
    const matchCat = activeCategory.value === 'all' || tool.cat === activeCategory.value
    const matchSearch = t(`tools.${tool.id}.title`).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        t(`tools.${tool.id}.desc`).toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
  })
})

const navigate = (path) => {
  router.push(path)
}

const cardRefs = ref([])
const setCardRef = (el) => {
  if (el) cardRefs.value.push(el)
}

const handleCardMouseMove = (e, index) => {
  const card = cardRefs.value[index]
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Hero Section -->
    <section class="text-center space-y-6 pt-16 pb-12 relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
      <h1 class="text-5xl md:text-7xl font-[1000] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 animate-fade-in py-2">
        {{ t('title') }}
      </h1>
      <p class="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium animate-slide-up" style="animation-delay: 0.1s">
        {{ t('subtitle') }}
      </p>
      
      <!-- Search Bar -->
      <div class="max-w-xl mx-auto mt-10 relative animate-slide-up group" style="animation-delay: 0.2s">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg class="h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-14 pr-6 py-5 border-0 rounded-[1.5rem] bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 shadow-2xl transition-all text-lg font-medium outline-none" 
            :placeholder="t('home.search_placeholder')"
          >
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="flex justify-center flex-wrap gap-3 animate-slide-up" style="animation-delay: 0.3s">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          'px-8 py-3 rounded-full font-bold transition-all duration-500 transform border shadow-sm',
          activeCategory === cat.id 
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent translate-y-[-2px] shadow-xl' 
            : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-500 dark:text-slate-400 border-white/20 hover:bg-white dark:hover:bg-slate-700'
        ]"
      >
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="cat.icon" />
          </svg>
          {{ t(`home.category.${cat.id}`) }}
        </span>
      </button>
    </section>

    <!-- Tools Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style="animation-delay: 0.4s">
      <div 
        v-for="(tool, index) in filteredTools" 
        :key="tool.id"
        :ref="setCardRef"
        @click="navigate(tool.path)"
        @mousemove="(e) => handleCardMouseMove(e, index)"
        class="group relative bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/5 spotlight-card"
        :style="{ animationDelay: `${0.4 + index * 0.1}s` }"
      >
        <!-- Spotlight Gradient -->
        <div class="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
             :style="{
               background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)`
             }">
        </div>

        <div class="relative z-10 flex flex-col h-full">
          <div :class="`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-500 ring-4 ring-white/50 dark:ring-slate-700/50`">
             <!-- Icon mapping -->
             <svg v-if="tool.icon === 'card'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
             </svg>
             <svg v-else-if="tool.icon === 'network'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
             </svg>
             <svg v-else-if="tool.icon === 'whois'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
             </svg>
             <svg v-else-if="tool.icon === 'image'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </div>
          
          <div class="flex-1">
            <h3 class="text-2xl font-[900] text-slate-800 dark:text-white transition-colors tracking-tight">
              {{ t(`tools.${tool.id}.title`) }}
            </h3>
            <p class="mt-3 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {{ t(`tools.${tool.id}.desc`) }}
            </p>
          </div>
          
          <div class="mt-8 flex items-center text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
             <span>Open Tool</span>
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
             </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.spotlight-card {
  --mouse-x: 0px;
  --mouse-y: 0px;
}
.animate-pulse-slow {
  animation: pulse-slow 10s infinite;
}
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1) translate(-50%, -50%); }
  50% { opacity: 0.3; transform: scale(1.2) translate(-50%, -50%); }
}
</style>
