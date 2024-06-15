import {createRouter, createWebHistory} from 'vue-router'
import PgHome from "@/components/views/PgHome.vue";
import PgPersonalSpace from "@/components/views/PgPersonalSpace.vue";
import PgProcessList from "@/components/views/PgProcessList.vue";
import PgConstructor from "@/components/views/PgConstructor.vue";
import PgSession from "@/components/views/PgSession.vue";
import Pg404 from "@/components/views/Pg404.vue";

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
        path: '/constructor/:id?',
        component: PgConstructor,
    },
    {
        name: 'Pg404',
        path: '/:pathMatch(.*)*',
        component: Pg404,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach((to, from) => {
    // console.log('to', from.path.toString());
    // console.log('from', to.path.toString());

    // if (true) {
    //     return ({name: 'Pg404'});
    // }
});

export default router;
