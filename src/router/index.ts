import { createRouter, createWebHashHistory } from 'vue-router';

import home from '../views/home.vue'
import demo from '../views/demo.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/demo',
            name: 'demo',
            component: demo
        },
    ]
})

export default router;