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
    :title="t('common.back')"
    class="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:border-blue-500/50 transition-all duration-300 transform active:scale-90"
  >
    <div class="p-2 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
      <svg class="w-6 h-6 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  </button>
</template>

<style scoped>
/* Simplified layout to prevent jumping */
</style>
