<template>
    <div class="PgSession">
        <div class="container">
            <div class="row">
                <div class="col-12" v-if="sessionsByID[this.sessionID]">
                    <h4>Сессия:</h4>
                    {{ sessionsByID?.[sessionID]?.header.sessionTitle ?? '' }}
                    <hr/>

                    <SessionPlayer
                            v-if="!!sessionID"
                            :key="sessionID"
                            :sessionID="sessionID"
                    />
                </div>
              <div v-else>Выберите сессию</div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import SessionPlayer from "@/components/SessionPlayer/ppSessionPlayer.vue";

export default {
    head: {
        title: 'PsyProcessor : Сессия'
    },
    layout: 'default',
    name: "PgSession",
    components: {SessionPlayer},

    data() {
        return {}
    },
    computed: {
        ...mapState(['currentSessionID']),
        ...mapGetters(['sessionsByID']),
        ...mapMutations(['sessionsToPausedExceptThis']),
        sessionID() {
            return this.$route.params.id;
        },
    },
    methods: {},
    mounted() {
      console.log('sessionID', this.sessionID);
      setTimeout(()=>{
        console.log('sessionID', this.sessionID);
        if (!!this.sessionsByID[this.sessionID]) {
          //деактивировать другие сессии
          this.$store.commit('sessionsToPausedExceptThis', this.sessionID);
        }else{
          alert('Адрес указан неверно, проверьте правильность');
        }


      }, 500);

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
