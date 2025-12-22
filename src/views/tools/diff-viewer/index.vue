<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoDiffEditor from './components/MonacoDiffEditor.vue'
import { createUnifiedDiff } from './utils/simpleDiff'

const { t } = useI18n()

// State
const originalText = ref('// Original Function\nfunction add(a, b) {\n    return a + b;\n}')
const modifiedText = ref('// Modified Function\nfunction add(a, b) {\n    console.log("Adding numbers");\n    return a + b;\n}')
const language = ref('javascript')
const isSideBySide = ref(true)

const languages = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'json', label: 'JSON' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'python', label: 'Python' },
    { id: 'markdown', label: 'Markdown' },
    { id: 'plaintext', label: 'Plain Text' }
]

const unifiedDiffText = computed(() => {
    return createUnifiedDiff(originalText.value, modifiedText.value)
})

// Actions
const clear = () => {
    originalText.value = ''
    modifiedText.value = ''
}

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

const copyDiff = async () => {
    // Copy Unified Diff
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(unifiedDiffText.value)
        } else {
            // Fallback for non-secure contexts or older browsers
            const textArea = document.createElement("textarea")
            textArea.value = unifiedDiffText.value
            textArea.style.position = "absolute"
            textArea.style.left = "-9999px"
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
        }
        
        showToastMessage('Unified Diff copied!')
    } catch (e) {
        showToastMessage('Failed to copy', true)
    }
}

const showToastMessage = (msg, isError = false) => {
    toastMessage.value = msg
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 2000)
}

const swap = () => {
    const temp = originalText.value
    originalText.value = modifiedText.value
    modifiedText.value = temp
}
</script>

<template>
    <div class="flex flex-col h-[calc(100vh-140px)] p-4 max-w-7xl mx-auto w-full gap-4 relative">
        <!-- Toast -->
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform opacity-0 translate-y-2"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 translate-y-2"
        >
            <div v-if="showToast" class="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg text-sm font-medium border border-slate-700">
                {{ toastMessage }}
            </div>
        </Transition>

        <!-- Toolbar -->
        <div class="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4 flex-wrap w-full md:w-auto">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    <span class="font-bold text-slate-700 dark:text-slate-200 hidden md:inline">{{ t('tools.diff-viewer.title') }}</span>
                </div>

                <!-- Language Selector -->
                <select v-model="language" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none">
                    <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.label }}</option>
                </select>

                <!-- View Toggle -->
                <div class="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                        @click="isSideBySide = false"
                        :class="['px-3 py-1 text-sm rounded transition-all', !isSideBySide ? 'bg-white dark:bg-slate-700 shadow text-fuchsia-600 dark:text-fuchsia-400 font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300']"
                    >
                        {{ t('tools.diff-viewer.controls.inline') }}
                    </button>
                    <button 
                        @click="isSideBySide = true"
                        :class="['px-3 py-1 text-sm rounded transition-all', isSideBySide ? 'bg-white dark:bg-slate-700 shadow text-fuchsia-600 dark:text-fuchsia-400 font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300']"
                    >
                        {{ t('tools.diff-viewer.controls.split') }}
                    </button>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
                <button @click="swap" class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    {{ t('tools.diff-viewer.controls.swap') }}
                </button>
                <button @click="clear" class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {{ t('tools.diff-viewer.controls.clear') }}
                </button>
                <button @click="copyDiff" class="flex items-center gap-2 px-4 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-fuchsia-500/20 active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    {{ t('tools.diff-viewer.controls.copy') }}
                </button>
            </div>
        </div>

        <div class="flex-1 min-h-0 flex flex-col gap-4">
            <!-- Editor -->
            <div class="flex-1 min-h-[300px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
                <MonacoDiffEditor
                    :original="originalText"
                    :modified="modifiedText"
                    :language="language"
                    :renderSideBySide="isSideBySide"
                    theme="vs-dark"
                    @update:original="originalText = $event"
                    @update:modified="modifiedText = $event"
                />
            </div>

            <!-- Unified Diff Output -->
            <div class="h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
                 <div class="px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Unified Diff Result</span>
                </div>
                <div class="flex-1 overflow-auto p-4 custom-scrollbar">
                     <pre class="font-mono text-xs md:text-sm text-slate-300 whitespace-pre">{{ unifiedDiffText }}</pre>
                </div>
            </div>
        </div>

        <!-- Educational Content (Learning) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-xl border border-violet-100 dark:border-slate-700">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {{ t('tools.diff-viewer.info.what_is_diff') }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('tools.diff-viewer.info.what_is_diff_desc') }}
                </p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-slate-800 dark:text-slate-200 mb-2">{{ t('tools.diff-viewer.info.types') }}</h3>
                <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li class="flex items-start gap-2">
                        <span class="inline-block w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex-shrink-0 flex items-center justify-center text-xs font-bold">+</span>
                        <span>{{ t('tools.diff-viewer.info.unified') }}</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="inline-block w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0 flex items-center justify-center text-xs font-bold">||</span>
                        <span>{{ t('tools.diff-viewer.info.split') }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
