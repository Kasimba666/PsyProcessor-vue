<template>
    <div class="PgSession">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h4>Session:</h4>
                    {{ sessionsByID?.[sessionID]?.header.sessionTitle ?? '' }}
                    <hr/>
                    <button
                            @click="$store.commit('sessionID', null)">
                        Удалить сессию
                    </button>
                    <hr/>
                    <SessionPlayer
                            v-if="!!sessionID"
                            :key="sessionID"
                            :sessionID="sessionID"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import SessionPlayer from "@/components/SessionPlayer/ppSessionPlayer.vue";

export default {
    head: {
        title: 'PsyProcessor : Сессия'
    },
    layout: 'default',
    name: "PgSession",
    components: {SessionPlayer},
    // props: ['sessionID'],

    data() {
        return {}
    },
    computed: {
        ...mapGetters(['sessionsByID']),
        sessionID() {
            return this.$route.params.id;
        },
    },
    methods: {},
    mounted() {
        // console.log(this.$route);
        // console.log(this.$router);
    },
}
</script>

<style lang="scss">
.PgSession {
  width: 100%;
  height: auto;
}
</style>
