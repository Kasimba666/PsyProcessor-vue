<template>
    <div class="session">
        <div class="container">
            <div class="row">
                <div class="col-12 mt-40">


                    <h2>Session</h2>
                    <hr/>
                    <input type="text" v-model="model"/>
                    <SessionPlayer
                        :session="session"

                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import SessionPlayer from "@/components/SessionPlayer/SessionPlayer.vue";
    export default {
        head: {
            title: 'PsyProcessor : Сессия'
        },
        layout: 'default',
        name: "session",
        components: {SessionPlayer},
        props: ['session'],
        data() {
            return {
                historyItem: {q: '', a: '', qDt: null, aDt: null, qKey: null},
            }
        },
        computed: {
            ...mapState(['testData']),
            model:{
                get(){
                    return this.testData;
                },
                set(v){
                    this.$store.commit('testData',v);
                },
            },
        },
        methods: {
           createHistoryItem() {
               return {q: '', a: '', qDt: null, aDt: null, qKey: null};
           },
           addHistoryItem() {

           },
        },
        mounted(){
        },
    }
</script>

<style lang="scss">
    .session {
        width: 100%;
        height: auto;
    }
</style>
