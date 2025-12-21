<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ParticlesBackground from './ParticlesBackground.vue'

const mouseX = ref(0)
const mouseY = ref(0)

// Detect dark mode
const isDark = ref(false)

const updateDarkMode = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

const handleMouseMove = (e) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 40
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 40
}

// Particle colors based on theme
const particleColor = computed(() => isDark.value ? '147, 197, 253' : '59, 130, 246')
const lineColor = computed(() => isDark.value ? '99, 102, 241' : '79, 70, 229')

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  updateDarkMode()
  
  // Watch for theme changes
  const observer = new MutationObserver(updateDarkMode)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="fixed inset-0 -z-50 overflow-hidden bg-slate-50 dark:bg-[#0a0f1d] transition-colors duration-700">
    <!-- Advanced Particles System -->
    <div class="absolute inset-0 opacity-60 dark:opacity-40">
      <ParticlesBackground 
        :particleCount="100" 
        :particleColor="particleColor"
        :lineColor="lineColor"
        :connectionDistance="180"
        :moveSpeed="0.4"
        :mouseRadius="250"
      />
    </div>
    
    <!-- Panoramic Mesh Grid -->
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-transform duration-1000 ease-out" 
         :style="{ transform: `translate(${mouseX * 0.2}px, ${mouseY * 0.2}px)` }">
      <div class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>

    <!-- Sweeping Light Rays -->
    <div class="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none overflow-hidden">
       <div class="absolute top-0 -left-[100%] w-[100%] h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent skew-x-[-30deg] animate-sweep"></div>
    </div>

    <!-- Dynamic Blobs with Parallax -->
    <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-transparent dark:from-blue-600/10 dark:via-cyan-600/10 blur-[120px] rounded-full animate-blob-slow transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${mouseX}px, ${mouseY}px)` }"></div>
    <div class="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-bl from-indigo-500/15 via-violet-500/10 to-transparent dark:from-indigo-600/10 dark:via-violet-600/10 blur-[100px] rounded-full animate-blob-slow animation-delay-1000 transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${-mouseX * 0.5}px, ${-mouseY * 0.5}px)` }"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-purple-500/15 via-pink-500/10 to-transparent dark:from-purple-600/10 dark:via-pink-600/10 blur-[120px] rounded-full animate-blob-slow animation-delay-2000 transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${-mouseX}px, ${-mouseY}px)` }"></div>
    <div class="absolute bottom-[10%] left-[10%] w-[35%] h-[35%] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-600/10 dark:via-teal-600/10 blur-[80px] rounded-full animate-blob-slow animation-delay-3000 transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${mouseX * 0.7}px, ${mouseY * 0.7}px)` }"></div>

    <!-- Aurora Effect -->
    <div class="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-b from-blue-400/20 via-purple-500/10 to-transparent blur-[60px] animate-aurora"></div>
    </div>

    <!-- Noise Overlay -->
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] brightness-100 contrast-150 pointer-events-none"></div>
  </div>
</template>

<style>
@keyframes blob-slow {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -30px) scale(1.05); }
  66% { transform: translate(-10px, 10px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes sweep {
  0% { transform: translateX(-100%) skewX(-30deg); }
  100% { transform: translateX(300%) skewX(-30deg); }
}
@keyframes aurora {
  0%, 100% { transform: translateX(-10%) skewX(-5deg); opacity: 0.3; }
  50% { transform: translateX(10%) skewX(5deg); opacity: 0.5; }
}
.animate-blob-slow { animation: blob-slow 20s infinite alternate ease-in-out; }
.animate-sweep { animation: sweep 12s infinite linear; }
.animate-aurora { animation: aurora 8s infinite ease-in-out; }
.animation-delay-1000 { animation-delay: 1s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-3000 { animation-delay: 3s; }
</style>
