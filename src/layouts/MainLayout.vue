<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppBackground from '../components/AppBackground.vue'
import BackButton from '../components/BackButton.vue'
const { t, locale } = useI18n()
const route = useRoute()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <AppBackground />
    <BackButton v-if="route.name !== 'home'" />
    <!-- Header -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-3 group outline-none">
          <div class="relative w-8 h-8">
             <div class="absolute inset-0 bg-blue-500 rounded-lg rotate-0 group-hover:rotate-12 transition-transform duration-300 opacity-20 group-hover:opacity-40"></div>
             <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg select-none">
               T
             </div>
          </div>
          <span class="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">{{ t('title') }}</span>
        </router-link>
        
        <div class="flex items-center space-x-2 sm:space-x-4">
          <button @click="toggleLanguage" class="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
            {{ locale === 'en' ? '中文' : 'EN' }}
          </button>
          <a href="https://github.com/liudonghua123/tools" target="_blank" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-grow container mx-auto px-4 py-8 md:py-12">
       <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 py-8 mt-auto bg-white dark:bg-slate-900">
      <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
        <p>&copy; {{ new Date().getFullYear() }} Online Tools. Released under MIT License.</p>
        <p class="mt-2 md:mt-0 flex space-x-4">
           <span>Start a project like this?</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
