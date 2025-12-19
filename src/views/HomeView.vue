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
]

const tools = [
  {
    id: 'id-card',
    cat: 'identity',
    icon: 'card', 
    path: '/tool/id-card',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'port-query',
    cat: 'network',
    icon: 'network',
    path: '/tool/port-query',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'whois-domain',
    cat: 'network',
    icon: 'whois',
    path: '/tool/whois-domain',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'whois-ip',
    cat: 'network',
    icon: 'whois',
    path: '/tool/whois-ip',
    color: 'from-indigo-500 to-blue-500'
  }
]

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
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="text-center space-y-6 pt-10 pb-6">
      <h1 class="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-fade-in">
        {{ t('home.search_placeholder') }}
      </h1>
      <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.1s">
        {{ t('subtitle') }}
      </p>
      
      <!-- Search Bar -->
      <div class="max-w-xl mx-auto relative animate-slide-up" style="animation-delay: 0.2s">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          class="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-lg" 
          :placeholder="t('home.search_placeholder')"
        >
      </div>
    </section>

    <!-- Categories -->
    <section class="flex justify-center flex-wrap gap-4 animate-slide-up" style="animation-delay: 0.3s">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          'px-6 py-2 rounded-full font-medium transition-all duration-300 transform',
          activeCategory === cat.id 
            ? 'bg-blue-600 text-white translate-y-[-2px] shadow-lg shadow-blue-500/30' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        ]"
      >
        {{ t(`home.category.${cat.id}`) }}
      </button>
    </section>

    <!-- Tools Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style="animation-delay: 0.4s">
      <div 
        v-for="(tool, index) in filteredTools" 
        :key="tool.id"
        @click="navigate(tool.path)"
        class="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        :style="{ animationDelay: `${0.4 + index * 0.1}s` }"
      >
        <div :class="`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`"></div>
        
        <div class="relative z-10 flex items-start space-x-4">
          <div :class="`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`">
             <!-- ID Card Icon -->
             <svg v-if="tool.icon === 'card'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
             </svg>
             <!-- Network Icon -->
             <svg v-else-if="tool.icon === 'network'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
             </svg>
             <!-- WHOIS Icon -->
             <svg v-else-if="tool.icon === 'whois'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
             </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ t(`tools.${tool.id}.title`) }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ t(`tools.${tool.id}.desc`) }}
            </p>
          </div>
        </div>
        
        <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
           <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
           </svg>
        </div>
      </div>
    </section>
  </div>
</template>
