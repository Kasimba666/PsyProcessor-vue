<template>
  <div class="TtRow">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TtRow",
  props: ['row', 'rowIdx'],
  provide() {
    return {
      rowData: this.row,
      rowIdx: this.rowIdx,
      context: 'body'
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {

  },
  methods: {},
  mounted() {
  },
};
</script>

<style lang="scss">
/****  ttRow  ****/
.TtRow {
  width: 100%;
  min-height: 30px;
  height: auto;
  color: var(--text-contrast-1);
  padding: 1px 5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  column-gap: 10px;
  &:nth-child(2n) > .TtColumn{
    box-shadow: inset 0 0 500px 0 hsla(225, 15%, 59%, 0.15);
  }
}
</style>
