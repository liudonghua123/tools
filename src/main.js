import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import router from './router'
import en from './locales/en.json'
import zh from './locales/zh.json'

// Discover tool translations
const enModules = import.meta.glob('./views/tools/*/locales/en.json', { eager: true })
const zhModules = import.meta.glob('./views/tools/*/locales/zh.json', { eager: true })

const messages = {
    en: { ...en, tools: {} },
    zh: { ...zh, tools: {} }
}

// Merge tool translations
Object.keys(enModules).forEach(path => {
    const id = path.split('/')[3]
    messages.en.tools[id] = enModules[path].default
})
Object.keys(zhModules).forEach(path => {
    const id = path.split('/')[3]
    messages.zh.tools[id] = zhModules[path].default
})

// i18n Setup
const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    fallbackLocale: 'en',
    messages
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
