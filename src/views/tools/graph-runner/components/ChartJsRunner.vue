<script setup>
import { ref, onMounted, shallowRef, onUnmounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';
import { useDark } from '@vueuse/core';
import { chartJsExamples } from '../data/chartjs-examples';

// Monaco Editor setup
import * as monaco from 'monaco-editor';

const canvasRef = ref(null);
const editorContainer = ref(null);
const chartInstance = shallowRef(null);
const editorInstance = shallowRef(null);
const isDark = useDark();

const selectedCategory = ref(Object.keys(chartJsExamples)[0]);
const selectedExampleKey = ref(Object.keys(chartJsExamples[Object.keys(chartJsExamples)[0]])[0]);

const categories = computed(() => Object.keys(chartJsExamples));
const currentExamples = computed(() => chartJsExamples[selectedCategory.value] || {});
const exampleKeys = computed(() => Object.keys(currentExamples.value));

const code = ref(currentExamples.value[selectedExampleKey.value]);

const runCode = () => {
    if (!canvasRef.value) return;

    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }

    try {
        const config = new Function(`${code.value}; return config;`)();
        chartInstance.value = new Chart(canvasRef.value, config);
    } catch (e) {
        console.error('Chart.js update failed:', e);
    }
};

const handleCategoryChange = () => {
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

const downloadImage = () => {
    if (!canvasRef.value) return;
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = canvasRef.value.toDataURL('image/png');
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

    setTimeout(runCode, 100);
});

onUnmounted(() => {
    chartInstance.value?.destroy();
    editorInstance.value?.dispose();
});

watch(isDark, (newVal) => {
    monaco.editor.setTheme(newVal ? 'vs-dark' : 'vs');
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

                <!-- Download -->
                <button 
                    @click="downloadImage"
                    class="ml-auto p-1.5 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Download Image"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>
            <div ref="editorContainer" class="flex-1 min-h-[300px]"></div>
        </div>

        <!-- Preview Pane -->
        <div class="w-full md:w-1/2 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4">
             <div class="w-full h-full relative flex items-center justify-center">
                 <canvas ref="canvasRef"></canvas>
             </div>
        </div>
    </div>
</template>
