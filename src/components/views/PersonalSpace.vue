<template>
  <div class="PersonalSpace">
    <div class="menu-panel">
      <PpUserMenu class="user-menu"/>
      <PpSessionList class="session-list"/>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PersonalSpace",
  components: {},
  props: [],
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
/****  PersonalSpace  ****/
.PersonalSpace {
  width: 100%;
  height: auto;
  min-height: 80dvh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: start;

  .menu-panel {
    width: 400px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    border-right: 1px solid hsl(0, 0%, 70%);

    .user-menu {
      width: 100%;
      height: 200px;
      background-color: hsl(180, 100%, 99%);
      border: 1px solid gray;
    }

    .session-list {
      width: 100%;
      height: 200px;
      margin-top: auto;
      background-color: hsl(180, 100%, 97%);;
      border: 1px solid gray;
    }
  }
}
</style>
