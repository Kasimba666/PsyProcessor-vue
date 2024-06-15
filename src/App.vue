<template>

    <div class="App">
        <AppLayout/>
    </div>
</template>
<script>
import AppLayout from "@/components/Layouts/AppLayout.vue";


export default {
    name: 'App',
    components: {AppLayout},
    data() {
        return {

        }
    },
    computed: {
    },
    methods: {}
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

</style>
