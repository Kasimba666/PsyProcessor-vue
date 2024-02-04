<template>
    <div class="PersonalSpace">
        <div class="menu-panel">
            <PsUserMenu/>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-12">

                </div>
            </div>
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
  padding: 0px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: start;

  .menu-panel {
    width: 400px;
    height: 100%;
    border-right: 1px solid hsl(0, 0%, 70%);
  }
}
</style>
