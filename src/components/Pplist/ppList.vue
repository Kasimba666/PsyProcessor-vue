<template>
  <div class="ppList">
    <div class="table-custom">
      <div class="table-head">
        <div class="table-checkbox">
        </div>
        <div class="table-cell cell-title" :class="{right: (i === fields.length-1)}"
             v-for="(field, i) of fields" :key="i">
          {{ field.label }}
        </div>
      </div>
      <div class="table-row"
           :class="{last: (r === rows.length-1)}"
           v-if="!!rows && rows.length  >0"
           v-for="(row, r) of rows" :key="r"
           :style="{backgroundColor: (r%2 === 1) ? 'hsl(0, 0%, 83%, 0.3)' : 'none'}"
           @click="">
        <div class="table-checkbox">
          <input class="form-check-input" type="checkbox"
                 @click="onCheckBoxClick(r)"
          />
        </div>
        <div class="table-cell cell-row" :class="{right: (f === fields.length-1)}"
             v-if="!!fields && fields.length>0"
             v-for="(field, f) of fields" :key="f"
        >
          {{ row[field.key] }}
        </div>

      </div>
    </div>
    <hr>
    <b-table
        striped
        small
        hover
        selectable
        bordered
        sortable
        select-mode="multi"
        :items="rows"
        :fields="fields"
        @row-clicked="onRowClicked"
    >

    </b-table>

    <div class="process-list-control">
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="createProcess">
        Создать
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="changeProcess">
        Изменить
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="removeProcess">
        Удалить
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="cloneProcess">
        Дублировать
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm">
        <label class="add-item" for="id-input-file-2" style="margin-bottom: 0">
          <input type="file" class="d-none" id="id-input-file-2"
                 value=""
                 :accept="'.'+'json'"
                 @change.prevent="loadProcesses($event)">
          Загрузить
        </label>
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="saveProcesses">
        Выгрузить
      </button>
    </div>


  </div>
</template>
<script>

export default {
  name: "ppList",
  props: ['rows', 'fields'],
  // emits: ['action', 'idxs', 'file'],
  data() {
    return {
      selectedIdxs: [],

    }
  },
  computed: {},

  methods: {
    createProcess() {
      this.$emit('doAction', 'create', [], null);
    },
    changeProcess() {
      this.$emit('doAction', 'change', this.selectedIdxs, null);
    },
    cloneProcess() {
      this.$emit('doAction', 'clone', this.selectedIdxs, null);
    },
    removeProcess() {
      this.$emit('doAction', 'remove', this.selectedIdxs, null);
    },
    loadProcesses(e) {
      this.$emit('doAction', 'load', this.selectedIdxs, e);

    },
    saveProcesses() {

      this.$emit('doAction', 'save', this.selectedIdxs, null);
    },

    onRowClicked(item, index, event) {

    },

    onCheckBoxClick(idx) {
      if (!this.selectedIdxs.includes(idx)) {
        this.selectedIdxs.push(idx)
      } else {
        let index = this.selectedIdxs.indexOf(idx);
        this.selectedIdxs.splice(index, 1);
      }
    },
  },
  mounted() {

  },
}

</script>

<style lang="scss">
.ppList {
  width: 100%;
  height: auto;
  font-size: 13px;

  thead {
    text-align: center;
  }

  .table-custom {
    position: relative;
    width: 100%;
    min-width: 500px;
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
      }


    }

    .table-checkbox {
      width: 25px;
      min-width: 25px;;
      display: flex;
      flex-flow: column nowrap;
      justify-content: start;
      align-items: center;
      padding: 5px;
      border-right: 1px solid hsla(0, 0%, 50%, 0.8);

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
        border-right: none;
      }
    }

  }


  .process-list-control {
    width: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    gap: 10px;
    padding: 5px;
    margin: 10px;

    .btn-custom {
      color: black;
      background-color: transparent;
      border: 1px solid hsl(50, 30%, 75%);

      &:hover {
        background-color: hsl(52, 29%, 90%);
      }
    }
  }
}

</style>
