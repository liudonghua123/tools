<script setup>
import { ref, defineAsyncComponent, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const activeTab = ref('echarts');

// Initialize from route
onMounted(() => {
    const routeMode = route.params.mode || route.query.mode;
    if (routeMode && tabs.value.some(tab => tab.id === routeMode)) {
        activeTab.value = routeMode;
    }
});

// Watch for route changes
watch(() => route.params.mode, (newMode) => {
    if (newMode && tabs.value.some(tab => tab.id === newMode)) {
        activeTab.value = newMode;
    }
});

// Update URL when tab changes
watch(activeTab, (newTab) => {
    router.replace({
        name: 'graph-runner',
        params: { mode: newTab }
    });
});

const EChartsRunner = defineAsyncComponent(() => import('./components/EChartsRunner.vue'));
const ChartJsRunner = defineAsyncComponent(() => import('./components/ChartJsRunner.vue'));

const tabs = computed(() => [
    { id: 'echarts', label: 'ECharts', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'chartjs', label: 'Chart.js', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' }
]);
</script>

<template>
    <div class="h-[calc(100vh-180px)] flex flex-col animate-fade-in transition-all duration-300">
        <!-- Header -->
        <div class="mb-6 text-center">
            <div class="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-500/20 to-pink-500/20 dark:from-orange-500/10 dark:to-pink-500/10 rounded-3xl mb-4 shadow-2xl ring-4 ring-orange-500/10 backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
                <svg class="w-10 h-10 text-orange-600 dark:text-orange-400 filter drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ t('tools.graph-runner.title') }}</h1>
            <p class="mt-2 text-slate-500 font-medium">{{ t('tools.graph-runner.desc') }}</p>
        </div>

        <!-- Mode Tabs -->
        <div class="flex justify-start gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide px-1">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                    'px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
                    activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                ]"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                </svg>
                {{ tab.label }}
            </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl min-h-0 relative">
            <KeepAlive>
                <component :is="activeTab === 'echarts' ? EChartsRunner : ChartJsRunner" />
            </KeepAlive>
        </div>
    </div>
</template>
