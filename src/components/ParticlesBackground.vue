<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const canvasRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isMouseInCanvas = ref(false)

// Props with defaults
const props = defineProps({
  particleCount: { type: Number, default: 80 },
  particleColor: { type: String, default: '59, 130, 246' }, // RGB format
  lineColor: { type: String, default: '59, 130, 246' },
  particleRadius: { type: Number, default: 2 },
  lineWidth: { type: Number, default: 1 },
  connectionDistance: { type: Number, default: 150 },
  moveSpeed: { type: Number, default: 0.5 },
  mouseRadius: { type: Number, default: 200 },
  mouseForce: { type: Number, default: 0.02 }
})

let ctx = null
let particles = []
let animationId = null
let width = 0
let height = 0

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * props.moveSpeed
    this.vy = (Math.random() - 0.5) * props.moveSpeed
    this.radius = Math.random() * props.particleRadius + 1
    this.originalRadius = this.radius
    this.opacity = Math.random() * 0.5 + 0.3
  }

  update(mx, my, isMouseIn) {
    // Mouse interaction
    if (isMouseIn) {
      const dx = mx - this.x
      const dy = my - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < props.mouseRadius) {
        const force = (props.mouseRadius - dist) / props.mouseRadius
        this.vx += dx * force * props.mouseForce
        this.vy += dy * force * props.mouseForce
        this.radius = this.originalRadius + force * 2
      } else {
        this.radius = this.originalRadius
      }
    } else {
      this.radius = this.originalRadius
    }

    // Apply velocity with damping
    this.vx *= 0.99
    this.vy *= 0.99
    
    this.x += this.vx
    this.y += this.vy

    // Bounce off walls
    if (this.x < 0 || this.x > this.canvas.width) {
      this.vx = -this.vx
      this.x = Math.max(0, Math.min(this.canvas.width, this.x))
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.vy = -this.vy
      this.y = Math.max(0, Math.min(this.canvas.height, this.y))
    }
  }

  draw(ctx, color) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${color}, ${this.opacity})`
    ctx.fill()
    
    // Add glow effect
    ctx.shadowBlur = 15
    ctx.shadowColor = `rgba(${color}, 0.5)`
  }
}

const handleMouseMove = (e) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const handleMouseEnter = () => {
  isMouseInCanvas.value = true
}

const handleMouseLeave = () => {
  isMouseInCanvas.value = false
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const dpr = window.devicePixelRatio || 1
  width = window.innerWidth
  height = window.innerHeight
  
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  
  ctx.scale(dpr, dpr)
  
  // Reinitialize particles on resize
  initParticles()
}

const initParticles = () => {
  const canvas = canvasRef.value
  particles = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.push(new Particle({ width, height }))
  }
}

const drawConnections = (ctx, color) => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < props.connectionDistance) {
        const opacity = 1 - dist / props.connectionDistance
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.4})`
        ctx.lineWidth = props.lineWidth
        ctx.stroke()
      }
    }
  }
  
  // Draw connections to mouse
  if (isMouseInCanvas.value) {
    for (let i = 0; i < particles.length; i++) {
      const dx = particles[i].x - mouseX.value
      const dy = particles[i].y - mouseY.value
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < props.mouseRadius) {
        const opacity = 1 - dist / props.mouseRadius
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(mouseX.value, mouseY.value)
        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.6})`
        ctx.lineWidth = props.lineWidth * 1.5
        ctx.stroke()
      }
    }
  }
}

const animate = () => {
  if (!ctx) return
  
  ctx.clearRect(0, 0, width, height)
  ctx.shadowBlur = 0
  
  // Draw connections first (behind particles)
  drawConnections(ctx, props.lineColor)
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.update(mouseX.value, mouseY.value, isMouseInCanvas.value)
    particle.draw(ctx, props.particleColor)
  })
  
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  handleResize()
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="absolute inset-0 pointer-events-auto"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  />
</template>

<style scoped>
canvas {
  display: block;
}
</style>
