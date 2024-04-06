<template>
  <div class="AppLayout">
    <AppHeader/>
    <div class="main">
      <router-view/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from "@/components/Layouts/AppHeader.vue";
import AppFooter from "@/components/Layouts/AppFooter.vue";

export default {
  name: "AppLayout",
  components: {AppFooter, AppHeader},
  props: [],
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  mounted() {

  },
}
</script>

<style lang="scss">
/****  AppLayout  ****/
.AppLayout {
  width: 100%;
  height: auto;

  .main {
    padding: 40px 0px 80px;

  }

}
</style>
