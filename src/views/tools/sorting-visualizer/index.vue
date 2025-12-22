<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { algorithms, sourceCode } from './algorithms'

const { t } = useI18n()

// State
const algorithm = ref('bubble')
const size = ref(20) 
const speed = ref(50) 
const isPlaying = ref(false)
const currentStep = ref(0)
const totalSteps = ref(0)
const frames = ref([]) 
const codeLanguage = ref('js') // 'js' or 'python'

// Display State
const array = computed(() => frames.value[currentStep.value]?.array || [])
const activeIndices = computed(() => frames.value[currentStep.value]?.activeIndices || [])
const compareIndices = computed(() => frames.value[currentStep.value]?.compareIndices || [])
// Get line map for current step, then pick language
const currentLinesMap = computed(() => frames.value[currentStep.value]?.lines || {})
const currentLine = computed(() => currentLinesMap.value[codeLanguage.value] || -1)

const metrics = computed(() => frames.value[currentStep.value]?.metrics || { comparisons: 0, swaps: 0, access: 0 })

let timer = null

// Options
const algorithmOptions = computed(() => [
    { value: 'bubble', label: t('tools.sorting-visualizer.algorithms.bubble') },
    { value: 'selection', label: t('tools.sorting-visualizer.algorithms.selection') },
    { value: 'insertion', label: t('tools.sorting-visualizer.algorithms.insertion') },
    { value: 'quick', label: t('tools.sorting-visualizer.algorithms.quick') },
    { value: 'merge', label: t('tools.sorting-visualizer.algorithms.merge') }
])

const currentSourceCode = computed(() => {
    return sourceCode[codeLanguage.value][algorithm.value] || []
})

// Core Logic: Generate all frames upfront
const generateFrames = () => {
    // 1. Initialize
    const newArr = []
    for (let i = 0; i < size.value; i++) {
        newArr.push(Math.floor(Math.random() * 95) + 5)
    }
    
    const _frames = []
    const _metrics = { comparisons: 0, swaps: 0, access: 0 }
    
    // Initial Frame
    _frames.push({
        array: [...newArr],
        activeIndices: [],
        compareIndices: [],
        lines: {},
        metrics: { ..._metrics }
    })
    
    // 2. Run Algorithm
    const generator = algorithms[algorithm.value]([...newArr]) 
    let result = generator.next()
    let currentArr = [...newArr] 
    
    while (!result.done) {
        const event = result.value
        let active = []
        let compare = []
        let lines = {}
        
        if (event) {
            if (event.lines) lines = event.lines
            
            if (event.type === 'compare') {
                _metrics.comparisons++
                _metrics.access += 2
                compare = event.indices
            } else if (event.type === 'swap') {
                _metrics.swaps++
                _metrics.access += 4
                active = event.indices
                // Perform swap
                const [i, j] = event.indices
                const temp = currentArr[i]
                currentArr[i] = currentArr[j]
                currentArr[j] = temp
            } else if (event.type === 'overwrite') {
                _metrics.access++
                _metrics.swaps++
                active = event.indices
                // Perform overwrite
                const [i] = event.indices
                currentArr[i] = event.value
            }
        }
        
        // Snapshot
        _frames.push({
            array: [...currentArr],
            activeIndices: active,
            compareIndices: compare,
            lines: lines,
            metrics: { ..._metrics }
        })
        
        result = generator.next()
    }
    
    // Final sorted frame
    _frames.push({
        array: [...currentArr],
        activeIndices: [],
        compareIndices: [],
        lines: {},
        metrics: { ..._metrics }
    })
    
    frames.value = _frames
    totalSteps.value = _frames.length - 1
    currentStep.value = 0
}

const reset = () => {
    pause()
    generateFrames()
}

// Controls
const play = () => {
    if (currentStep.value >= totalSteps.value) currentStep.value = 0
    isPlaying.value = true
    runLoop()
}

const pause = () => {
    isPlaying.value = false
    clearTimeout(timer)
}

const stepForward = () => {
    pause()
    if (currentStep.value < totalSteps.value) {
        currentStep.value++
        scrollToLine()
    }
}

const stepBackward = () => {
    pause()
    if (currentStep.value > 0) {
        currentStep.value--
        scrollToLine()
    }
}

const seek = (e) => {
    pause()
    scrollToLine()
}

const runLoop = () => {
    if (!isPlaying.value) return
    
    if (currentStep.value < totalSteps.value) {
        currentStep.value++
        scrollToLine()
        
        const delay = Math.max(1, (101 - speed.value) * 3)
        timer = setTimeout(runLoop, delay)
    } else {
        isPlaying.value = false
    }
}

const scrollToLine = () => {
    // Small delay to ensure render
    nextTick(() => {
        const line = currentLine.value
        if (line > 0) {
            const lineEl = document.getElementById(`code-line-${line}`)
            if (lineEl) {
                lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            }
        }
    })
}

// Watchers
watch([size, algorithm], () => {
    reset()
})

onMounted(() => {
    reset()
})

// Visual helpers
const getBarColor = (index, val) => {
    if (currentStep.value === totalSteps.value) return 'bg-emerald-500'
    
    if (compareIndices.value.includes(index)) return 'bg-yellow-400'
    if (activeIndices.value.includes(index)) return 'bg-fuchsia-500' 
    return 'bg-blue-500'
}

const getBarHeight = (val) => {
    return `${val}%`
}
</script>

<template>
    <div class="flex flex-col h-[calc(100vh-140px)] p-4 max-w-7xl mx-auto w-full gap-4">
        <!-- Header / Controls -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                <!-- Algorithm Select -->
                <div class="flex items-center gap-2">
                     <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <select v-model="algorithm" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option v-for="opt in algorithmOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                </div>

                <!-- Size Slider -->
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-500 uppercase">{{ t('tools.sorting-visualizer.controls.size') }}</span>
                    <input type="range" v-model.number="size" min="10" max="50" class="w-24 accent-blue-500">
                </div>

                <!-- Speed Slider -->
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-500 uppercase">{{ t('tools.sorting-visualizer.controls.speed') }}</span>
                    <input type="range" v-model.number="speed" min="1" max="100" class="w-24 accent-cyan-500">
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
                <button @click="reset" class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" :title="t('tools.sorting-visualizer.controls.reset')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
            </div>
        </div>
        
        <!-- Timeline Control Bar -->
        <div class="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
             <!-- Playback Controls -->
             <div class="flex items-center gap-2">
                 <button @click="stepBackward" class="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50" :disabled="currentStep <= 0">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 19V5l-7 7 7 7zm8-14h-2v14h2V5z"/></svg> 
                 </button>
                 
                 <button 
                    @click="isPlaying ? pause() : play()" 
                    :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95',
                        isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-500'
                    ]"
                >
                    <svg v-if="!isPlaying" class="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                </button>

                <button @click="stepForward" class="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50" :disabled="currentStep >= totalSteps">
                   <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5v14l7-7-7-7zM5 5h2v14H5V5z"/></svg>
                </button>
             </div>

             <!-- Slider -->
             <div class="flex-1 w-full flex items-center gap-3">
                 <span class="text-xs font-mono text-slate-500 min-w-[3ch] text-right">{{ currentStep }}</span>
                 <input 
                    type="range" 
                    v-model.number="currentStep" 
                    :max="totalSteps" 
                    min="0"
                    @input="seek"
                    class="flex-1 accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                >
                 <span class="text-xs font-mono text-slate-500 min-w-[3ch]">{{ totalSteps }}</span>
             </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            <!-- Visualizer -->
            <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-end justify-center gap-[1px] relative overflow-hidden min-h-[300px] lg:min-h-0">
                <div 
                    v-for="(val, idx) in array" 
                    :key="idx"
                    :style="{ height: getBarHeight(val) }"
                    :class="['flex-1 rounded-t-sm transition-colors duration-75', getBarColor(idx, val)]"
                ></div>
                
                <!-- Empty State -->
                <div v-if="array.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-400">
                    Loading...
                </div>
            </div>

            <!-- Stats & Info -->
            <div class="w-full lg:w-96 flex flex-col gap-4">
                <!-- Metrics Card -->
                <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{{ t('tools.sorting-visualizer.title') }} Stats</h3>
                    
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-slate-600 dark:text-slate-400 text-sm">{{ t('tools.sorting-visualizer.metrics.time') }}</span>
                            <span class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ metrics.elapsedTime }}ms</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-slate-600 dark:text-slate-400 text-sm">{{ t('tools.sorting-visualizer.metrics.comparisons') }}</span>
                            <span class="font-mono font-bold">{{ metrics.comparisons }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-slate-600 dark:text-slate-400 text-sm">{{ t('tools.sorting-visualizer.metrics.swaps') }}</span>
                            <span class="font-mono font-bold">{{ metrics.swaps }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-slate-600 dark:text-slate-400 text-sm">{{ t('tools.sorting-visualizer.metrics.access') }}</span>
                            <span class="font-mono font-bold">{{ metrics.access }}</span>
                        </div>
                    </div>
                </div>

                <!-- Code View -->
                <div class="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col min-h-[300px] lg:h-[400px]">
                    <div class="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                         <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Algorithm Code</span>
                         <!-- Language Tabs -->
                         <div class="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                             <button 
                                @click="codeLanguage = 'js'; scrollToLine()" 
                                :class="['px-2 py-0.5 text-xs rounded transition-colors', codeLanguage === 'js' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300']"
                             >JS</button>
                             <button 
                                @click="codeLanguage = 'python'; scrollToLine()" 
                                :class="['px-2 py-0.5 text-xs rounded transition-colors', codeLanguage === 'python' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300']"
                             >Python</button>
                         </div>
                    </div>
                    
                    <div class="flex-1 overflow-auto p-4 custom-scrollbar font-mono text-xs md:text-sm">
                        <div 
                            v-for="(line, idx) in currentSourceCode" 
                            :key="idx" 
                            :id="`code-line-${idx + 1}`"
                            :class="[
                                'px-2 py-0.5 rounded transition-colors duration-100 flex',
                                currentLine === idx + 1 ? 'bg-yellow-500/20 text-yellow-300 font-bold' : 'text-slate-400'
                            ]"
                        >
                            <span class="w-6 text-slate-600 select-none text-right mr-3">{{ idx + 1 }}</span>
                            <span class="whitespace-pre">{{ line }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
