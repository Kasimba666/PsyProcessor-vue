<template>
  <div class="session">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h4>Session:</h4>
          {{ !!session ? session.header.sessionTitle : '' }}
          <hr/>
          <button
              @click="$store.commit('sessionID', null)">
            Удалить сессию
          </button>
          <hr/>
          <SessionPlayer
              v-if="!!session" :key="session.id"
              :sessionID = sessionID
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
  props: ['sessionID'],

  data() {
    return {}
  },
  computed: {
    ...mapState(['sessionID']),
    ...mapState({session: state => state.sessionList.filter((v) => v.id === state.sessionID)[0]}),

  },
  methods: {},
  mounted() {
  },
}
</script>

<style lang="scss">
.session {
  width: 100%;
  height: auto;
}
</style>
