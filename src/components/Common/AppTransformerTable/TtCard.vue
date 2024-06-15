<template>
  <div class="TtCard" :style="{'--titleWidth': titleWidth}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TtCard",
  props: ['titleWidth', 'row', 'rowIdx'],
  provide() {
    return {
      rowData: this.row,
      rowIdx: this.rowIdx,
      context: 'card'
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {
  },
};
</script>

<style lang="scss">
/****  TtCard  ****/
.TtCard {
  //--titleWidth: v-bind(titleWidth);
  width: 100%;
  height: auto;
  padding: 10px 15px 10px calc(2% - 15px);
  &:nth-child(2n) {
    box-shadow: inset 0 0 500px 0 hsla(284, 10%, 59%, 0.2);
  }
  .TtColumn {
    flex-direction: row;
    gap: 3px;
  }
  .tt-title {
    width: var(--titleWidth);
    font-weight: bold;
    line-height: 1.25;
    letter-spacing: 0.15px;
    text-align: left;
    color: var(--text-contrast-2);
  }
  .tt-content {
    width: calc(100% - var(--titleWidth));
  }
}
</style>
