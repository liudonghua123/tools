<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  image: {
    type: Object, // ImageBitmap
    required: true
  }
})

const canvasRef = ref(null)

const draw = () => {
    const canvas = canvasRef.value
    if (!canvas || !props.image) return
    
    canvas.width = props.image.width
    canvas.height = props.image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(props.image, 0, 0)
}

onMounted(() => {
    draw()
})

watch(() => props.image, () => {
    draw()
})
</script>

<template>
  <canvas ref="canvasRef" class="max-w-full h-auto mx-auto"></canvas>
</template>
