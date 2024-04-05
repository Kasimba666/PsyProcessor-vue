<template>
    <div class="TtSortButton" @click="$emit('click', field)">
        <i :class="icon">{{ iconSymbol }}</i>
    </div>
</template>

<script>
const movingCardScreenarrowtwo = '◊';
const movingCardScreenarrowsortup = '▲';
const movingCardScreenarrowsortdown = '▼';
export default {
    name: "TtSortButton",
    components: {},
    props: ['field', 'cur-state'],
    data() {
        return {};
    },
    computed: {
        iconSymbol() {
            return (this.curState.field === this.field)
                ? ((this.curState.order === 'DESC') ? movingCardScreenarrowsortdown : movingCardScreenarrowsortup)
                : movingCardScreenarrowtwo
        },
          icon(){
          return (this.curState.field===this.field)
            ? ((this.curState.order==='ASC') ? 'movingCardScreen-arrow-sort-down' : 'movingCardScreen-arrow-sort-up')
            : 'movingCardScreen-arrow-two'
        },
    },
    methods: {},
    mounted() {
    },
};
</script>

<style lang="scss">
/****  TtSortButton  ****/
.TtSortButton {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .icon {
    &-arrow-two {
      font-size: 13px;
    }

    &-arrow-sort-down, &-arrow-sort-up {
      color: var(--primary-100-55);
      font-size: 25px;
    }
  }
}
</style>
