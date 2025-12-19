<script setup>
import { useI18n } from 'vue-i18n'
import BackButton from '../../../components/BackButton.vue'
const { t } = useI18n()
</script>

<template>
  <div class="max-w-4xl mx-auto animate-fade-in relative px-4 sm:px-0 pt-4 pb-20">
    <BackButton />
    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden mt-8 p-12 text-center">
      <h2 class="text-4xl font-black text-slate-800 dark:text-white mb-6">{{ t('tools.dummy-tool.title') }}</h2>
      <p class="text-xl text-slate-500 dark:text-slate-400 mb-8">{{ t('tools.dummy-tool.desc') }}</p>
      <div class="p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-200 dark:border-emerald-800">
        <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ t('tools.dummy-tool.content') }}</span>
      </div>
    </div>
  </div>
</template>
