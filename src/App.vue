<template>
  <AppHeader />
  <div class="App">
    <router-view />
  </div>
  <AppFooter />
</template>
<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
export default {
  components: {AppHeader, AppFooter}
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.App {
  padding: 20px;
}
</style>
