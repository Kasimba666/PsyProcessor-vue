<template>
    <div class="PgSession">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h4>Сессия:</h4>
                    {{ sessionsByID?.[sessionID]?.header.sessionTitle ?? '' }}
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
        ...mapState(['currentSessionID']),
        sessionID() {
            return this.$route.params.id;
        },
    },
    methods: {},
    mounted() {
       // if (!!this.currentSessionID)  this.$router.push({name: 'PgSession', params: {id: this.currentSessionID}});

    },
}
</script>

<style lang="scss">
.PgSession {
  width: 100%;
  height: auto;
  padding: 30px 0 50px;
}
</style>
