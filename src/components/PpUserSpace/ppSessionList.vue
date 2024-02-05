<template>
    <div class="ppSessionList">
        <div class="table-custom">
            <div class="table-head">
                <div class="table-cell cell-title" :class="{right: (i === fields.length-1)}"
                     v-for="(field, i) of fields" :key="i">
                    {{ field.label }}
                </div>
                <div class="table-button">
                </div>
            </div>
            <div class="table-row"
                 :class="{last: (r === rows.length-1)}"
                 v-if="!!rows && rows.length  >0"
                 v-for="(row, r) of rows" :key="r"
                 :style="{backgroundColor: (r%2 === 1) ? 'hsl(0, 0%, 83%, 0.3)' : 'none'}"
                 @click="onRowClicked(r)">
                <div :class="{current: r===currentIdx}">
                </div>
                <div class="table-cell cell-row" :class="{right: (f === fields.length-1)}"
                     v-if="!!fields && fields.length>0"
                     v-for="(field, f) of fields" :key="f"
                >
                    {{ Array.isArray(row[field.key]) ? row[field.key].join(', ') : row[field.key] }}
                </div>
                <div class="table-button border-right">
                    <button class="btn btn-outline-primary btn-custom btn-sm"
                            @click.stop="doSomething(r)">
                        Сделать
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    name: "ppSessionList",
    components: {},
    props: ['rows', 'fields'],
    data() {
        return {
            currentIdx: [],
        }
    },
    computed: {},
    methods: {
        onRowClicked(v) {
            this.currentIdx = v;
        },
        doSomething(v) {
            console.log('Сделать с:', v);
            this.$emit('doAction', 'something', [this.currentIdx])
        },
    },
    mounted() {

    },
}
</script>

<style lang="scss">
.ppSessionList {
  width: 100%;
  height: auto;
  font-size: 13px;

  .table-custom {
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    border: 1px solid hsla(0, 0%, 50%, 0.8);
    user-select: none;

    .table-head {
      position: relative;
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      border-bottom: 1px solid hsla(0, 0%, 50%, 0.6);
      background-color: hsl(0, 0%, 83%, 0.3);

    }

    .table-row {
      position: relative;
      width: 100%;
      height: auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      border-bottom: 1px solid hsla(0, 0%, 50%, 0.6);
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
      }

      &.chosen {
        background-color: rgba(0, 140, 186, 0.5);
      }

      &.last {
        border-bottom: none;
      }

      .current {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(0, 140, 186, 0.5);
        pointer-events: none;
      }


    }

    .table-button {
      width: 100px;
      min-width: 100px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: start;
      align-items: center;
      padding: 0px;

      &.border-right {
        border-right: 1px solid hsla(0, 0%, 50%, 0.8);
      }
    }

    .table-cell {
      position: relative;
      width: 100px;
      height: auto;
      padding: 2px;
      flex: 1 1 auto;
      min-width: 50px;
      border-right: 1px solid hsla(0, 0%, 50%, 0.8);
      text-align: left;

      &.cell-title {
        justify-content: center;
        align-items: center;
        text-align: center;
        word-break: break-word;
        font-weight: bold;
      }

      &.cell-row {
        justify-content: flex-start;
        align-items: flex-start;
        text-align: left;
        word-break: break-all;
      }

      &.right {
        //border-right: none;
      }
    }

  }
}
</style>
