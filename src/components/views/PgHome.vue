<template>
    <div class="Home">
        <div class="home-container">
            <div>
                <logo/>
                <h1 class="title">
                    {{"psy-processor"}}
                </h1>
                <h2 class="subtitle">
                    {{"vue 3 version"}}
                </h2>
<!--                <div class="links">-->
<!--                    <a-->
<!--                        href="https://nuxtjs.org/"-->
<!--                        target="_blank"-->
<!--                        class="button&#45;&#45;green"-->
<!--                    >-->
<!--                        {{"Documentation"}}-->
<!--                    </a>-->
<!--                    <a-->
<!--                        href="https://github.com/nuxt/nuxt.js"-->
<!--                        target="_blank"-->
<!--                        class="button&#45;&#45;grey"-->
<!--                    >-->
<!--                        {{"GitHub"}}-->
<!--                    </a>-->
<!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
    import Logo from '@/components/Logo.vue'


    export default {
        head: {
            title: 'PsyProcessor : Домашнаяя страница'
        },
        components: {
            Logo,
//            AppHeader,
//            AppFooter,
        }
    }
</script>

<style lang="scss">
    .Home {
        .home-container {
            margin: 0 auto;
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .title {
            font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: block;
            font-weight: 300;
            font-size: 100px;
            color: #35495e;
            letter-spacing: 1px;
        }

        .subtitle {
            font-weight: 300;
            font-size: 42px;
            color: #526488;
            word-spacing: 5px;
            padding-bottom: 15px;
        }

        .links {
            padding-top: 15px;
        }

    }
</style>
