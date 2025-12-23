<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

// Worker setup (Duplicate of code-playground's setup to ensure it works standalone)
// Check if already defined to avoid overwriting if unnecessary, though valid assignment is fine.
if (!self.MonacoEnvironment) {
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
}

const props = defineProps({
    original: { type: String, default: '' },
    modified: { type: String, default: '' },
    language: { type: String, default: 'plaintext' },
    theme: { type: String, default: 'vs-dark' },
    renderSideBySide: { type: Boolean, default: true },
    readOnly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:original', 'update:modified', 'ready'])

const containerRef = ref(null)
let diffEditor = null
let originalModel = null
let modifiedModel = null

const initEditor = () => {
    if (!containerRef.value) return

    diffEditor = monaco.editor.createDiffEditor(containerRef.value, {
        theme: props.theme,
        readOnly: props.readOnly,
        originalEditable: true,
        automaticLayout: true,
        renderSideBySide: props.renderSideBySide,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true
    })

    originalModel = monaco.editor.createModel(props.original, props.language)
    modifiedModel = monaco.editor.createModel(props.modified, props.language)

    diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel
    })

    // Listeners
    originalModel.onDidChangeContent(() => {
        emit('update:original', originalModel.getValue())
    })
    modifiedModel.onDidChangeContent(() => {
        emit('update:modified', modifiedModel.getValue())
    })

    emit('ready', diffEditor)
}

// Watchers
watch(() => props.original, (newVal) => {
    if (originalModel && originalModel.getValue() !== newVal) {
        originalModel.setValue(newVal)
    }
})

watch(() => props.modified, (newVal) => {
    if (modifiedModel && modifiedModel.getValue() !== newVal) {
        modifiedModel.setValue(newVal)
    }
})

watch(() => props.language, (newVal) => {
    if (originalModel && modifiedModel) {
        monaco.editor.setModelLanguage(originalModel, newVal)
        monaco.editor.setModelLanguage(modifiedModel, newVal)
    }
})

watch(() => props.theme, (newVal) => {
    monaco.editor.setTheme(newVal)
})

watch(() => props.renderSideBySide, (newVal) => {
    if (diffEditor) {
        diffEditor.updateOptions({ 
            renderSideBySide: newVal,
            wordWrap: 'on',
            wordWrapOverride1: 'on',
            wordWrapOverride2: 'on'
        });
        diffEditor.layout();
    }
})

onMounted(() => {
    nextTick(() => {
        initEditor()
    })
})

onUnmounted(() => {
    if (diffEditor) {
        diffEditor.dispose()
    }
    if (originalModel) originalModel.dispose()
    if (modifiedModel) modifiedModel.dispose()
})
</script>

<template>
    <div ref="containerRef" class="w-full h-full rounded-lg overflow-hidden"></div>
</template>

<style scoped>
</style>
