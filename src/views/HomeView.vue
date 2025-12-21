<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('all')
const isLoaded = ref(false)

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

// Card 3D tilt effect
const cardStates = ref({})

const handleCardMouseMove = (e, toolId) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10
  
  cardStates.value[toolId] = {
    rotateX,
    rotateY,
    mouseX: x,
    mouseY: y,
    isHovered: true
  }
}

const handleCardMouseLeave = (toolId) => {
  cardStates.value[toolId] = {
    rotateX: 0,
    rotateY: 0,
    mouseX: 0,
    mouseY: 0,
    isHovered: false
  }
}

const getCardStyle = (toolId) => {
  const state = cardStates.value[toolId] || { rotateX: 0, rotateY: 0 }
  return {
    transform: `perspective(1000px) rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg)`,
    '--mouse-x': `${state.mouseX || 0}px`,
    '--mouse-y': `${state.mouseY || 0}px`
  }
}

// Ripple effect
const ripples = ref({})

const createRipple = (e, toolId) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  ripples.value[toolId] = { x, y, active: true }
  
  setTimeout(() => {
    ripples.value[toolId] = { ...ripples.value[toolId], active: false }
  }, 600)
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Hero Section -->
    <section class="text-center space-y-6 pt-16 pb-12 relative overflow-hidden">
      <!-- Floating decorative elements -->
      <div class="absolute top-10 left-[10%] w-20 h-20 border border-blue-500/20 rounded-2xl rotate-12 animate-float"></div>
      <div class="absolute top-20 right-[15%] w-16 h-16 border border-purple-500/20 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-10 left-[20%] w-12 h-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl rotate-45 animate-float animation-delay-2000"></div>
      <div class="absolute bottom-5 right-[25%] w-14 h-14 border border-indigo-500/20 rounded-lg -rotate-12 animate-float animation-delay-3000"></div>
      
      <!-- Glowing orb behind title -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/15 blur-[120px] rounded-full -z-10 animate-pulse-slow"></div>
      
      <h1 class="text-5xl md:text-7xl font-[1000] tracking-tight animate-fade-in py-2 relative">
        <span class="bg-clip-text text-transparent bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-shift bg-[length:200%_200%]">
          {{ t('title') }}
        </span>
      </h1>
      <p class="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium animate-slide-up" style="animation-delay: 0.1s">
        {{ t('subtitle') }}
      </p>
      
      <!-- Search Bar -->
      <div class="max-w-xl mx-auto mt-10 relative animate-slide-up group" style="animation-delay: 0.2s">
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-60 transition duration-500 animate-border-glow"></div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg class="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-14 pr-6 py-5 border-0 rounded-[1.5rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 shadow-2xl transition-all text-lg font-medium outline-none" 
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
          'relative px-8 py-3 rounded-full font-bold transition-all duration-500 transform border overflow-hidden group/btn',
          activeCategory === cat.id 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white border-transparent translate-y-[-2px] shadow-xl shadow-blue-500/25' 
            : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-600 dark:text-slate-300 border-white/30 dark:border-slate-700/30 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg hover:-translate-y-0.5'
        ]"
      >
        <!-- Button glow effect -->
        <div 
          v-if="activeCategory === cat.id"
          class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 blur-xl opacity-50 animate-pulse"
        ></div>
        
        <!-- Hover shimmer -->
        <div class="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <span class="relative flex items-center gap-2">
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
        @click="(e) => { createRipple(e, tool.id); navigate(tool.path) }"
        @mousemove="(e) => handleCardMouseMove(e, tool.id)"
        @mouseleave="handleCardMouseLeave(tool.id)"
        :style="[getCardStyle(tool.id), { animationDelay: `${0.4 + index * 0.1}s` }]"
        class="tool-card group relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 dark:border-slate-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform-gpu will-change-transform"
      >
        <!-- Animated border gradient -->
        <div class="absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/50 group-hover:via-purple-500/50 group-hover:to-pink-500/50 transition-all duration-500 opacity-0 group-hover:opacity-100">
          <div class="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-white/90 dark:bg-slate-800/90"></div>
        </div>
        
        <!-- Spotlight Gradient -->
        <div class="pointer-events-none absolute -inset-px rounded-[2rem] transition duration-300 opacity-0 group-hover:opacity-100"
             :style="{
               background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)`
             }">
        </div>
        
        <!-- Glow effect on hover -->
        <div class="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

        <!-- Ripple effect -->
        <div 
          v-if="ripples[tool.id]?.active"
          class="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          :style="{
            left: `${ripples[tool.id]?.x}px`,
            top: `${ripples[tool.id]?.y}px`
          }"
        ></div>

        <div class="relative z-10 flex flex-col h-full">
          <!-- Icon with enhanced animation -->
          <div :class="`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 ring-4 ring-white/50 dark:ring-slate-700/50 group-hover:ring-white/70 dark:group-hover:ring-slate-600/70 group-hover:shadow-2xl`">
             <!-- Icon mapping -->
             <svg v-if="tool.icon === 'card'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
             </svg>
             <svg v-else-if="tool.icon === 'network'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
             </svg>
             <svg v-else-if="tool.icon === 'whois'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
             </svg>
             <svg v-else-if="tool.icon === 'image'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
             <!-- Default icon for other tools -->
             <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          
          <div class="flex-1">
            <h3 class="text-2xl font-[900] text-slate-800 dark:text-white transition-colors tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {{ t(`tools.${tool.id}.title`) }}
            </h3>
            <p class="mt-3 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {{ t(`tools.${tool.id}.desc`) }}
            </p>
          </div>
          
          <!-- Enhanced CTA -->
          <div class="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <span class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{{ t('home.open_tool') || 'Open Tool' }}</span>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 3D Card perspective */
.tool-card {
  --mouse-x: 0px;
  --mouse-y: 0px;
  transform-style: preserve-3d;
}

/* Gradient animation for title */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-shift {
  animation: gradient-shift 6s ease infinite;
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(12deg); }
  50% { transform: translateY(-15px) rotate(12deg); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Pulse slow */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.15; transform: scale(1) translate(-50%, -50%); }
  50% { opacity: 0.25; transform: scale(1.1) translate(-50%, -50%); }
}
.animate-pulse-slow {
  animation: pulse-slow 8s infinite;
}

/* Border glow */
@keyframes border-glow {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.4; }
}
.animate-border-glow {
  animation: border-glow 3s ease-in-out infinite;
}

/* Ripple effect */
@keyframes ripple {
  0% { width: 0; height: 0; opacity: 0.5; transform: translate(-50%, -50%); }
  100% { width: 400px; height: 400px; opacity: 0; transform: translate(-50%, -50%); }
}
.animate-ripple {
  animation: ripple 0.6s ease-out forwards;
}

/* Bounce X for arrow */
@keyframes bounce-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}
.animate-bounce-x {
  animation: bounce-x 1s ease-in-out infinite;
}

/* Animation delays */
.animation-delay-1000 { animation-delay: 1s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-3000 { animation-delay: 3s; }
</style>
