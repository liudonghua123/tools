import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/tool/id-card',
        name: 'id-card',
        component: () => import('../views/tools/IdCardTool.vue')
    },
    {
        path: '/tool/port-query',
        name: 'port-query',
        component: () => import('../views/tools/PortQueryTool.vue')
    },
    {
        path: '/tool/whois-domain',
        name: 'whois-domain',
        component: () => import('../views/tools/WhoisDomainTool.vue')
    },
    {
        path: '/tool/whois-ip',
        name: 'whois-ip',
        component: () => import('../views/tools/WhoisIpTool.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
})

export default router
