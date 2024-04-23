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
      // async readJsonFolder () {
      //     const jsonFiles = Object.keys(modules);
      //     const data = await Promise.all(jsonFiles.map(async (file) => {
      //         const module = await modules[file]();
      //         return module.default;
      //     }));
      //     return data;
      // },
      readJsonFolder() {
          const jsonFiles = Object.keys(modules);
          const data = (jsonFiles.map(async (file) => {
              const module = await modules[file]();
              return module.default;
          }));
          return data;
      },

  },
  mounted() {
      for (const path in modules) {
          modules[path]().then((mod) => {
                      mod.default.forEach((v)=>{
                          // console.log(v);
                          if (v.type === 'process') this.defaultProcessList.push(v);
                      });

          })
      }
      console.log(this.defaultProcessList);
      // this.defaultProcessList.forEach((v)=>console.log(v.header.processTitle));
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
