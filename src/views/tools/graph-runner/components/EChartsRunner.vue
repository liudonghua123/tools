<script setup>
import { ref, onMounted, watch, shallowRef, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';
import { useDark } from '@vueuse/core';
import { echartsExamples } from '../data/echarts-examples';

// Monaco Editor setup
import * as monaco from 'monaco-editor';
// Workers configuration assumed active from index/App

const chartContainer = ref(null);
const editorContainer = ref(null);
const chartInstance = shallowRef(null);
const editorInstance = shallowRef(null);
const isDark = useDark();

const selectedCategory = ref(Object.keys(echartsExamples)[0]);
const selectedExampleKey = ref(Object.keys(echartsExamples[Object.keys(echartsExamples)[0]])[0]);

const categories = computed(() => Object.keys(echartsExamples));
const currentExamples = computed(() => echartsExamples[selectedCategory.value] || {});
const exampleKeys = computed(() => Object.keys(currentExamples.value));

const code = ref(currentExamples.value[selectedExampleKey.value]);

const renderer = ref('canvas'); // Default to canvas, SVG can be selected
const darkMode = ref(false);
const useDecal = ref(false);

const initChart = () => {
    if (chartInstance.value) {
        chartInstance.value.dispose();
    }
    const theme = darkMode.value ? 'dark' : undefined;
    chartInstance.value = echarts.init(chartContainer.value, theme, {
        renderer: renderer.value
    });
    runCode();
};

const runCode = () => {
    if (!chartInstance.value) return;
    try {
        const option = new Function(`${code.value}; return option;`)();
        
        // Handle aria/decal if needed
         if (option && useDecal.value) {
            if (!option.aria) option.aria = {};
            option.aria.enabled = true;
            option.aria.decal = { show: true };
        }

        chartInstance.value.setOption(option, true); // true = notMerge (reset)
    } catch (e) {
        console.error('Chart update failed:', e);
    }
};

const handleCategoryChange = () => {
    // Select first example of new category
    const firstKey = Object.keys(currentExamples.value)[0];
    selectedExampleKey.value = firstKey;
    loadExample();
};

const loadExample = () => {
    const newVal = currentExamples.value[selectedExampleKey.value];
    if (newVal) {
        code.value = newVal;
        editorInstance.value?.setValue(newVal);
        runCode();
    }
};

const downloadSvg = () => {
    if (!chartInstance.value) return;
    
    // ECharts getDataURL works for both Canvas and SVG, but SVG renderer produces SVG source
    // If Canvas renderer, we can get PNG. 
    // If strict SVG is required and renderer is Canvas, we might need to warn or temporarily re-render?
    // Let's rely on native getDataURL.
    
    // Note: getDataURL options
    const url = chartInstance.value.getDataURL({
        type: renderer.value === 'svg' ? 'svg' : 'png', // ECharts returns base64 PNG for canvas, SVG string for SVG
        pixelRatio: 2,
        backgroundColor: darkMode.value ? '#100c2a' : '#fff'
    });
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart.${renderer.value === 'svg' ? 'svg' : 'png'}`;
    link.click();
};

onMounted(() => {
    editorInstance.value = monaco.editor.create(editorContainer.value, {
        value: code.value,
        language: 'javascript',
        theme: isDark.value ? 'vs-dark' : 'vs',
        automaticLayout: true,
        minimap: { enabled: false }
    });

    editorInstance.value.onDidChangeModelContent(() => {
        code.value = editorInstance.value.getValue();
        runCode();
    });

    initChart();
    
    window.addEventListener('resize', () => chartInstance.value?.resize());
});

onUnmounted(() => {
    chartInstance.value?.dispose();
    editorInstance.value?.dispose();
    window.removeEventListener('resize', () => chartInstance.value?.resize());
});

watch([darkMode, renderer, useDecal], () => {
    initChart();
});

watch(isDark, (newVal) => {
    monaco.editor.setTheme(newVal ? 'vs-dark' : 'vs');
});

const updateDecal = () => {
    // We re-run code to apply decal since option needs simpler mutation
    runCode();
};

watch(useDecal, () => {
    updateDecal();
});

</script>

<template>
    <div class="h-full flex flex-col md:flex-row">
        <!-- Editor Pane -->
        <div class="w-full md:w-1/2 flex flex-col border-r border-slate-700">
            <!-- Toolbar -->
            <div class="flex items-center gap-4 px-4 py-3 border-b border-slate-700 bg-slate-800/50 flex-wrap">
                 <!-- Category Select -->
                 <div class="flex items-center gap-2">
                    <label class="text-xs text-slate-400 font-medium uppercase tracking-wider">Cat:</label>
                    <select 
                        v-model="selectedCategory" 
                        @change="handleCategoryChange"
                        class="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm focus:outline-none focus:border-orange-500"
                    >
                        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                 </div>

                 <!-- Example Select -->
                 <div class="flex items-center gap-2">
                    <label class="text-xs text-slate-400 font-medium uppercase tracking-wider">Ex:</label>
                    <select 
                        v-model="selectedExampleKey" 
                        @change="loadExample"
                        class="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm focus:outline-none focus:border-orange-500 max-w-[150px]"
                    >
                        <option v-for="key in exampleKeys" :key="key" :value="key">{{ key }}</option>
                    </select>
                 </div>
                
                <!-- Renderer -->
                <div class="flex items-center gap-2">
                     <label class="text-xs text-slate-400 font-medium uppercase tracking-wider">Render:</label>
                    <select v-model="renderer" class="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm focus:outline-none focus:border-orange-500">
                        <option value="canvas">Canvas</option>
                        <option value="svg">SVG</option>
                    </select>
                </div>

                <!-- Toggles -->
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" v-model="darkMode" class="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500/50">
                    <span class="text-sm text-slate-300">Dark</span>
                </label>

                 <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" v-model="useDecal" class="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500/50">
                    <span class="text-sm text-slate-300">Decal</span>
                </label>

                <!-- Download -->
                <button 
                    @click="downloadSvg"
                    class="ml-auto p-1.5 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    :title="'Download ' + (renderer === 'svg' ? 'SVG' : 'Image')"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>
            <div ref="editorContainer" class="flex-1 min-h-[300px] w-full"></div>
        </div>

        <!-- Preview Pane -->
        <div class="w-full md:w-1/2 bg-white dark:bg-slate-900 flex flex-col relative">
             <div ref="chartContainer" class="flex-1 w-full h-full min-h-[300px]"></div>
        </div>
    </div>
</template>
