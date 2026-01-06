<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

// Create a local theme state
const isDark = ref(false)

// Initialize theme from localStorage or system preference
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

// Initialize on component setup
initTheme()

// Watch for system theme changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Only update if user hasn't manually set a theme
      isDark.value = e.matches
    }
  })
}

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url), { type: 'module' })
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url), { type: 'module' })
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url), { type: 'module' })
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url), { type: 'module' })
    }
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' })
  }
}

const props = defineProps({
  modelValue: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  theme: { type: String, default: null }, // Use null to indicate we want to use global theme
  readOnly: { type: Boolean, default: false },
  height: { type: String, default: '300px' },
  minimap: { type: Boolean, default: true },
  lineNumbers: { type: Boolean, default: true },
  wordWrap: { type: String, default: 'on' },
  fontSize: { type: Number, default: 14 },
  tabSize: { type: Number, default: 2 }
})

const emit = defineEmits(['update:modelValue', 'format', 'ready'])

const containerRef = ref(null)
let editor = null

const initEditor = () => {
  if (!containerRef.value) return

  // Use global theme if no specific theme is provided
  const editorTheme = props.theme || (isDark.value ? 'vs-dark' : 'vs')

  editor = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: editorTheme,
    readOnly: props.readOnly,
    automaticLayout: true,
    minimap: { enabled: props.minimap },
    lineNumbers: props.lineNumbers ? 'on' : 'off',
    wordWrap: props.wordWrap,
    fontSize: props.fontSize,
    tabSize: props.tabSize,
    scrollBeyondLastLine: false,
    padding: { top: 12, bottom: 12 },
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    renderWhitespace: 'selection',
    bracketPairColorization: { enabled: true },
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace",
    fontLigatures: true
  })
  
  // Listen to content changes
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })
  
  // Format action
  editor.addAction({
    id: 'format-document',
    label: 'Format Document',
    keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
    run: () => {
      editor.getAction('editor.action.formatDocument').run()
      emit('format')
    }
  })
  
  emit('ready', editor)
}

// Public methods
const format = async () => {
  if (editor) {
    await editor.getAction('editor.action.formatDocument')?.run()
    emit('format')
  }
}

const setValue = (value) => {
  if (editor && editor.getValue() !== value) {
    editor.setValue(value)
  }
}

const getValue = () => {
  return editor ? editor.getValue() : ''
}

const focus = () => {
  editor?.focus()
}

defineExpose({ format, setValue, getValue, focus, getEditor: () => editor })

// Watch props
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

watch(() => props.theme, (newVal) => {
  const editorTheme = newVal || (isDark.value ? 'vs-dark' : 'vs')
  monaco.editor.setTheme(editorTheme)
})

// Watch for global theme changes
watch(isDark, (newDarkValue) => {
  if (!props.theme) { // Only update if no specific theme is provided
    const editorTheme = newDarkValue ? 'vs-dark' : 'vs'
    if (editor) {
      monaco.editor.setTheme(editorTheme)
    }
  }
}, { immediate: true })

// Watch for localStorage theme changes from other components
const handleStorageChange = (e) => {
  if (e.key === 'theme') {
    const newTheme = e.newValue
    if (newTheme) {
      isDark.value = newTheme === 'dark'
      // Also update the theme immediately if editor exists
      if (editor && !props.theme) {
        const editorTheme = isDark.value ? 'vs-dark' : 'vs'
        monaco.editor.setTheme(editorTheme)
      }
    }
  }
}

// Add storage event listener
window.addEventListener('storage', handleStorageChange)

watch(() => props.readOnly, (newVal) => {
  if (editor) {
    editor.updateOptions({ readOnly: newVal })
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
  // Remove storage event listener
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<template>
  <div ref="containerRef" class="monaco-editor-container" :style="{ height }"></div>
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
}
</style>
