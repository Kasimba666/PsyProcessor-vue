<template>
    <div class="screen-monitor" v-if="DEBUG">
        {{ screen.type }}<br/>
        {{ screen.width }}px
    </div>
    <div class="App">
        <AppLayout/>
    </div>
</template>
<script>
import AppLayout from "@/components/Layouts/AppLayout.vue";
import {mapState} from "vuex";

export default {
    name: 'App',
    components: {AppLayout},
    data() {
        return {
            DEBUG: import.meta.env.MODE === 'development',
        }
    },
    computed: {
        ...mapState(['screen', 'screenBreakpoints']),
    },
    methods: {
        onResize() {
            let screen = {};
            screen['width'] = window.innerWidth;
            screen['height'] = window.innerHeight;
            let t = "";
            switch (true) {
                case screen.width <= this.screenBreakpoints.sm:
                    t = "xs";
                    break;
                case screen.width <= this.screenBreakpoints.md:
                    t = "sm";
                    break;
                case screen.width <= this.screenBreakpoints.lg:
                    t = "md";
                    break;
                case screen.width <= this.screenBreakpoints.xl:
                    t = "lg";
                    break;
                default:
                    t = "xl";
                    break;
            }
            screen['type'] = t;
            this.$store.commit("screen", screen);
        }
    },
    mounted() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    },
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.App {
    padding: 0px;
}
.screen-monitor {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 12px;
    color: black;
    z-index: 10;
}
</style>
