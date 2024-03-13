import {createRouter, createWebHistory} from 'vue-router'
import PgHome from "@/components/views/PgHome.vue";
import PgPersonalSpace from "@/components/views/PgPersonalSpace.vue";
import PgProcessList from "@/components/views/PgProcessList.vue";
import PgConstructor from "@/components/views/PgConstructor.vue";
import PgSession from "@/components/views/PgSession.vue";

const routes = [
    {
        name: 'PgHome',
        path: '/home',
        component: PgHome,
    },
    {
        path: '/',
        redirect: {name: 'PgHome'},
    },
    {
        name: 'PgPersonalSpace',
        path: '/user-space',
        component: PgPersonalSpace,
        // redirect: {name: 'Session'},
        children: [
            {
                name: 'PgSession',
                path: 'session/:id?',
                component: PgSession,
            },
        ],
    },
    {
        name: 'PgProcessList',
        path: '/procs',
        component: PgProcessList,
    },
    {
        name: 'PgConstructor',
        path: '/constructor',
        component: PgConstructor,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
