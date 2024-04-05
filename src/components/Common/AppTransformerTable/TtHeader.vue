<template>
  <div class="TtHeader" :class="mode">
    <div class="sort-by mr-2" v-if="mode === 'card' && sortable">Sort by:</div>
    <slot></slot>
  </div>
</template>

<script>
let self;
export default {
  name: 'TtHeader',
  props: ['mode', 'sortable'],
  provide() {
    return {
      rowData: this.row,
      rowIdx: -1,
      context: 'header',
      mode: this.Mode,
    };
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    Mode() {
      return {value: this?.mode};
    },
  },
  methods: {},
  mounted() {
    self = this;
  },
};
</script>

<style lang="scss">
/****  TtHeader  ****/
.TtHeader {
  width: 100%;
  height: 40px;
  background-color: hsla(224, 14%, 50%, 0.35);
  color: var(--text-contrast-1);
  border: 1px solid var(--border-light);
  padding: 1px 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  &.card {
    justify-content: flex-start;
  }
  .sort-by {
    white-space: nowrap;
  }
}
</style>
