<template>
    <div class="AppHeader">
        <div class="logo">
            PsyProcessor
        </div>
        <div class="top-nav">
            <my-button class="menu-item home" @click="$router.push('/index')">Главная</my-button>
            <my-button class="menu-item" @click="$router.push('/session')">Сессия</my-button>
            <my-button class="menu-item" @click="$router.push('/procs')">Процессы</my-button>
            <my-button class="menu-item" @click="$router.push('/constructor')">Конструктор</my-button>
        </div>
<!--        <div class="top-nav">-->
<!--            <nuxt-link class="menu-item home" :to="{name:'index'}">Главная</nuxt-link>-->
<!--            <nuxt-link class="menu-item" :to="{name:'session'}">Сессия</nuxt-link>-->
<!--            <nuxt-link class="menu-item" :to="{name:'procs'}">Процессы</nuxt-link>-->
<!--            <nuxt-link class="menu-item" :to="{name:'constructor'}">Конструктор</nuxt-link>-->
<!--        </div>-->
    </div>
</template>

<script>
    export default {
        name: "AppHeader",
        components: {},
        props: [],
        data() {
            return {}
        },
        computed: {},
        methods: {},
        mounted(){
        },
    }
</script>

<style lang="scss">
    .AppHeader {
        position: fixed;
        left: 0;
        top: 0;
        padding: 0 20px;
        width: 100%;
        height: 38px;
        background-color: hsl(50, 30%, 95%);
        border-bottom: 1px solid hsl(50, 30%, 75%);
        display: flex;
        align-items: center;
        a {
            color: hsl(180, 100%, 30%);
        }

        &>* {
            flex: 0 0 auto;
        }

        .logo {
            width: 110px;
            padding: 0 0 0 0px;
            font-family: 'Arial';
            font-size: 30px;
            font-weight: bold;
            color: hsl(180, 99%, 22%);
            transform-origin: left bottom;
            transform: scaleX(.333);
        }

        .top-nav {
            display: flex;
            align-self: stretch;
            align-items: stretch;
            perspective: 500px;
            &>* {
                flex: 0 0 auto;
                display: block;
            }
            .menu-item {
                display: flex;
                align-items: center;
                width: auto;
                padding: 3px 10px 0;
                font-size:13px;
                cursor: pointer;
                &:hover {
                     background-color: hsl(50, 50%, 98%);
                    &.nuxt-link-active {
                        text-decoration: none;
                     }
                 }
                &.nuxt-link-active:not(.home), &.nuxt-link-exact-active.home {
                    cursor: default;
                    /*color: black;*/
                    color:  hsl(50, 99%, 20%);
                    text-shadow: 0 0 0  hsl(50, 99%, 10%);
                    background-color: white;
                    box-shadow: inset 0 -3px 1px -2px hsl(50, 99%, 22%);
                    transform: translate3d(0,2px,20px);
                 }
            }
        }

    }
</style>
