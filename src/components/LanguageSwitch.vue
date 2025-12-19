<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <button 
    @click="toggleLanguage" 
    class="group relative inline-flex h-9 w-20 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner overflow-hidden"
  >
    <span class="sr-only">Toggle language</span>
    <span
      class="z-0 absolute inset-0 flex items-center justify-between px-3 text-[11px] font-[900] tracking-tighter"
    >
      <span :class="locale === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'">EN</span>
      <span :class="locale === 'zh' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'">中</span>
    </span>
    <span
      class="z-10 pointer-events-none inline-block h-7 w-[2.6rem] transform rounded-full bg-white dark:bg-slate-300 transition-all duration-500 shadow-xl ring-4 ring-black/5 dark:ring-white/10 relative"
      :class="locale === 'zh' ? 'translate-x-[2.1rem]' : 'translate-x-1'"
    >
      <div class="absolute inset-0 grid place-items-center">
        <span class="text-[10px] font-bold text-blue-700 dark:text-blue-900 leading-none select-none">
          {{ locale === 'en' ? 'EN' : '中' }}
        </span>
      </div>
    </span>
  </button>
</template>
