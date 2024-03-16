import {createRouter, createWebHistory} from 'vue-router'
import PgHome from "@/components/views/PgHome.vue";
import PgPersonalSpace from "@/components/views/PgPersonalSpace.vue";
import PgProcessList from "@/components/views/PgProcessList.vue";
import PgConstructor from "@/components/views/PgConstructor.vue";
import PgSession from "@/components/views/PgSession.vue";
import Pg404 from "../components/views/Pg404.vue";

const routes = [
    {
        name: 'PgHome',
        path: '/PsyProcessor-vue/home',
        component: PgHome,
    },
    {
        path: '/PsyProcessor-vue/',
        redirect: {name: 'PgHome'},
    },
    {
        name: 'PgPersonalSpace',
        path: '/PsyProcessor-vue/user-space',
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
        path: '/PsyProcessor-vue/procs',
        component: PgProcessList,
    },
    {
        name: 'PgConstructor',
        path: '/PsyProcessor-vue/constructor',
        component: PgConstructor,
    },
    {
        name: 'Pg404',
        path: '/PsyProcessor-vue/:pathMatch(.*)*',
        component: Pg404,
    },
]

const router = createRouter({
    routes,

    // history: createWebHistory(),
    history: createWebHistory(),
});

router.beforeEach((to, from) => {
    console.log('to', from.path.toString());
    console.log('from', to.path.toString());

    // if (true) {
    //     return ({name: 'Pg404'});
    // }
});

export default router;
