import { createRouter, createWebHistory } from 'vue-router'
import Index from "../components/views/index.vue";
import Session from "../components/views/session.vue";
import Procs from "../components/views/procs.vue";
import Constructor from "../components/views/constructor.vue";

const routes = [
    {
        path: '/index',
        component: Index,
    },
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/session',
        component: Session,
    },
    {
        path: '/procs',
        component: Procs,
    },
    {
        path: '/constructor',
        component: Constructor,
    },
]

const router = createRouter({
    routes,
    // history: createWebHistory(process.env.BASE_URL),
});

export default router;
