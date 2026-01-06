import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Dynamic tool discovery
const toolModules = import.meta.glob('../views/tools/*/index.vue')
const toolRoutes = Object.keys(toolModules).map((path) => {
    const segments = path.split('/')
    const id = segments[segments.length - 2]

    return {
        path: `/tool/${id}`,
        name: id,
        component: toolModules[path]
    }
})

// Special route for code-playground with mode parameter
const codePlaygroundRoute = {
    path: '/tool/code-playground/:mode?',
    name: 'code-playground',
    component: () => import('../views/tools/code-playground/index.vue')
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    ...toolRoutes.filter(route => route.name !== 'code-playground'), // Exclude the default code-playground route
    codePlaygroundRoute // Add the special code-playground route with mode parameter
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
})

export default router
