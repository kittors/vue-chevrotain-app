import { createRouter, createWebHashHistory } from 'vue-router';

import home from '../views/home.vue'
import demo from '../views/demo.vue'
import test from '../views/operations.vue'
import funParse from '../views/funParse.vue'

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
        {
            path: '/test',
            name: 'test',
            component: test
        },
        {
            path: '/funParse',
            name: 'funParse',
            component: funParse
        }
    ]
})

export default router;