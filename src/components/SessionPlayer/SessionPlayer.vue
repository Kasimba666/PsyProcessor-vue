<template>
  <div class="SessionPlayer">
    <div class="history">

    </div>
    <h4>Сессия:
      {{}}
    </h4>
  </div>
</template>

<script>
export default {
  name: "SessionPlayer",
  components: {},
  props: ['session', 'tableKeys'],
  emits: ['action'],
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
}
</script>

<style lang="scss">
/****  SessionPlayer  ****/
.SessionPlayer {
  width: 100%;
  height: auto;
}
</style>
