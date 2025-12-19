<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
const canvasRef = ref(null)

const handleMouseMove = (e) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 40
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 40
}

let ctx, particles = []
const PARTICLE_COUNT = 30

class Particle {
  constructor() {
    this.reset()
  }
  reset() {
    this.x = Math.random() * window.innerWidth
    this.y = Math.random() * window.innerHeight
    this.size = Math.random() * 2 + 1
    this.speedX = Math.random() * 0.5 - 0.25
    this.speedY = Math.random() * 0.5 - 0.25
    this.opacity = Math.random() * 0.5 + 0.1
  }
  update(mx, my) {
    this.x += this.speedX
    this.y += this.speedY
    
    // Attract to mouse
    const dx = mx - this.x
    const dy = my - this.y
    const dist = Math.sqrt(dx*dx + dy*dy)
    if (dist < 200) {
      this.x += dx * 0.01
      this.y += dy * 0.01
    }

    if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
      this.reset()
    }
  }
  draw() {
    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const animate = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  particles.forEach(p => {
    p.update(mouseX.value * 20 + window.innerWidth/2, mouseY.value * 20 + window.innerHeight/2)
    p.draw()
  })
  requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  for(let i=0; i<PARTICLE_COUNT; i++) particles.push(new Particle())
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="fixed inset-0 -z-50 overflow-hidden bg-slate-50 dark:bg-[#0a0f1d] transition-colors duration-700">
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30"></canvas>
    
    <!-- Panoramic Mesh Grid -->
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none transition-transform duration-1000 ease-out" 
         :style="{ transform: `translate(${mouseX * 0.2}px, ${mouseY * 0.2}px)` }">
      <div class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>

    <!-- Sweeping Light Rays -->
    <div class="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none overflow-hidden">
       <div class="absolute top-0 -left-[100%] w-[100%] h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent skew-x-[-30deg] animate-sweep"></div>
    </div>

    <!-- Dynamic Blobs with Parallax -->
    <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full animate-blob-slow transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${mouseX}px, ${mouseY}px)` }"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-600/10 blur-[120px] rounded-full animate-blob-slow animation-delay-2000 transition-transform duration-1000 ease-out"
         :style="{ transform: `translate(${-mouseX}px, ${-mouseY}px)` }"></div>

    <!-- Panorama Overlay -->
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 pointer-events-none"></div>
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
  100% { transform: translateX(200%) skewX(-30deg); }
}
.animate-blob-slow { animation: blob-slow 15s infinite alternate; }
.animate-sweep { animation: sweep 8s infinite linear; }
.animation-delay-2000 { animation-delay: 2s; }
</style>
