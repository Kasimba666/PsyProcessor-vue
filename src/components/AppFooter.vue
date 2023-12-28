<template>
    <div class="AppFooter">
        <div class="copyright">
            (c) MD Lab 2020
        </div>
    </div>
</template>

<script>
    export default {
        name: "AppFooter",
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
    .AppFooter {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        background-color: hsl(50, 80%, 10%);
        .copyright {
            font-family: 'Arial';
            font-size: 9px;
            color: hsl(50, 50%, 90%);
        }
    }
</style>
