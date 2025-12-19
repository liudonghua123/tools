<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const goBack = () => router.push('/')
</script>

<template>
  <button 
    @click="goBack" 
    class="group fixed top-6 left-6 lg:top-24 lg:left-8 z-50 flex items-center gap-3 px-5 py-2.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform active:scale-95"
  >
    <div class="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
      <svg class="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
    <span class="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {{ t('common.back') }}
    </span>
  </button>
</template>

<style scoped>
/* Simplified layout to prevent jumping */
</style>
