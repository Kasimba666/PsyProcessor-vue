import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/components/views/Home.vue";
import PersonalSpace from "@/components/views/PersonalSpace.vue";
import ProcessList from "@/components/views/ProcessList.vue";
import Constructor from "@/components/views/Constructor.vue";
import Session from "@/components/views/Session.vue";

const routes = [
    {
        name: 'Home',
        path: '/home',
        component: Home,
    },
    {
        path: '/',
        redirect: {name: 'Home'},
    },
    {
        name: 'PersonalSpace',
        path: '/user-space',
        component: PersonalSpace,
        // redirect: {name: 'Session'},
        children: [
            {
                name: 'Session',
                path: 'session',
                component: Session,
            },
        ],
    },
    {
        name: 'ProcessList',
        path: '/procs',
        component: ProcessList,
    },
    {
        name: 'Constructor',
        path: '/constructor',
        component: Constructor,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
