<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
  modelValue: { type: String, default: '' },
  language: { type: String, default: 'plaintext' },
  theme: { type: String, default: 'vs-dark' },
  readOnly: { type: Boolean, default: false },
  height: { type: String, default: '100%' },
  minimap: { type: Boolean, default: false },
  wordWrap: { type: String, default: 'on' }
})

const emit = defineEmits(['update:modelValue', 'ready'])

const containerRef = ref(null)
let editor = null

const initEditor = () => {
  if (!containerRef.value) return
  
  editor = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readOnly,
    automaticLayout: true,
    minimap: { enabled: props.minimap },
    wordWrap: props.wordWrap,
    scrollBeyondLastLine: false,
    padding: { top: 12, bottom: 12 },
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace",
    fontLigatures: true
  })
  
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })
  
  emit('ready', editor)
}

watch(() => props.modelValue, (newVal) => {
  if (editor && editor.getValue() !== newVal) {
    editor.setValue(newVal)
  }
})

watch(() => props.language, (newVal) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newVal)
  }
})

onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<template>
  <div ref="containerRef" class="w-full" :style="{ height }"></div>
</template>

<style scoped>
</style>
