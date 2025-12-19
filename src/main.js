import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import router from './router'
import en from './locales/en.json'
import zh from './locales/zh.json'

// i18n Setup
const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    fallbackLocale: 'en',
    messages: {
        en,
        zh
    }
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
