<template>
  <div class="AppLayout">

    <AppHeader/>
    <div class="main">
        <router-view v-slot="{Component}">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from "@/components/Layouts/AppHeader.vue";
import AppFooter from "@/components/Layouts/AppFooter.vue";

const modules = import.meta.glob('@/data/processes/*.json');

export default {
  name: "AppLayout",
  components: {AppFooter, AppHeader},
  props: [],
  data() {
    return {
      defaultProcessList: [],
    }
  },
  computed: {
  },
  methods: {
      async readJsonFolder() {
        return await Promise.all(Object.keys(modules).map(async (file) => {
              const module = await modules[file]();
              return module.default;
          }));
      },

  },
  mounted() {
    this.readJsonFolder().then((result)=>{
      result.forEach((v)=> {
        v.forEach((w) => {
          if (w.type === 'process') {
            this.defaultProcessList.push(w);

          };
        });
      });
    });

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
