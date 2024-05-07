<template>
  <div class="ppProcessMenu">
    <div class="menu-item d-flex align-items-center"
         v-for="item of Object.entries(items)"
         @click.stop="onClickMenuItem(item[0])"
    >
      {{ item[1] }}
    </div>

  </div>
</template>

<script>

export default {
  name: 'ppProcessMenu',
  components: {},
  props: ['items'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    onClickMenuItem(v) {
      this.$emit('onClickMenuItem', v);
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.ppProcessMenu {
  .menu-item {
    width: 100%;
    height: 30px;
    padding-left: 20px;
    padding-right: 20px;
    white-space: nowrap;
    cursor: pointer;
    color: black;
    border-bottom: 1px solid hsl(50, 30%, 65%);
    font-size: 12px;
    z-index: 15;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: hsl(50, 30%, 75%);
    }
  }
}
</style>
