<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 40
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 40
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="fixed inset-0 -z-50 overflow-hidden bg-slate-50 dark:bg-[#0a0f1d] transition-colors duration-700">
    <!-- Panoramic Mesh Grid -->
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none transition-transform duration-1000 ease-out" 
         :style="{ transform: `translate(${mouseX * 0.2}px, ${mouseY * 0.2}px)` }">
      <div class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40"
         :style="{ transform: `translate(${mouseX * 0.15}px, ${mouseY * 0.15}px)` }">
      <div v-for="i in 15" :key="i" 
           class="absolute rounded-full bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-float"
           :style="{
             width: Math.random() * 4 + 2 + 'px',
             height: Math.random() * 4 + 2 + 'px',
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
             animationDuration: Math.random() * 20 + 10 + 's',
             animationDelay: Math.random() * -20 + 's'
           }"></div>
    </div>

    <!-- Sweeping Light Rays -->
    <div class="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
       <div class="absolute top-0 -left-[100%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] animate-sweep"></div>
       <div class="absolute top-0 -left-[100%] w-[100%] h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent skew-x-[-30deg] animate-sweep animation-delay-4000"></div>
    </div>

    <!-- Dynamic Blobs with Parallax -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] rounded-full animate-blob transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${mouseX}px, ${mouseY}px)` }"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/10 blur-[120px] rounded-full animate-blob animation-delay-2000 transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${-mouseX}px, ${-mouseY}px)` }"></div>
    <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-400/10 dark:bg-pink-600/5 blur-[100px] rounded-full animate-blob animation-delay-4000 transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)` }"></div>

    <!-- Panorama Overlay -->
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 pointer-events-none"></div>
  </div>
</template>

<style>
@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
.animate-blob {
  animation: blob 10s infinite alternate;
}
</style>
