<template>
  <div class="ppProcessList">
    <div class="table-custom">
      <div class="table-head">
        <div class="table-checkbox">
        </div>
        <div class="table-cell cell-title" :class="{right: (i === fields.length-1)}"
             v-for="(field, i) of fields" :key="i">
          {{ field.label }}
        </div>
        <div class="table-button border-right">
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
        <div class="table-checkbox"

        >
          <input class="form-check-input" type="checkbox"
                 v-model="arrayCheckboxes[r]"
                 value="true"
                 unchecked-value="false"
                 @click.stop="onCheckBoxClick(r)"
          />
        </div>
        <div class="table-cell cell-row" :class="{right: (f === fields.length-1)}"
             v-if="!!fields && fields.length>0"
             v-for="(field, f) of fields" :key="f"
        >
          {{ Array.isArray(row[field.key]) ? row[field.key].join(', ') : row[field.key] }}
        </div>
        <div class="table-button border-right">
          <button class="btn btn-outline-primary btn-next btn-sm"
                  @click.stop="changeProcess(r)">
            Изменить
          </button>
        </div>
        <div class="table-button">
          <button class="btn btn-outline-primary btn-next btn-sm"
                  @click.stop="startProcess(r)">
            Начать
          </button>
        </div>
      </div>
    </div>

    <div class="process-list-control">
      <button class="btn btn-outline-primary btn-next btn-sm"
              @click="selectAll">
        Выбрать все
      </button>
      <button class="btn btn-outline-primary btn-next btn-sm"
              @click="unselectAll">
        Развыбрать все
      </button>
      <button class="btn btn-outline-primary btn-next btn-sm"
              @click="createProcess">
        Создать
      </button>
      <button class="btn btn-outline-primary btn-next btn-sm"
              @click="removeProcess">
        Удалить
      </button>
      <button class="btn btn-outline-primary btn-next btn-sm"
              @click="duplicateProcess">
        Дублировать
      </button>
      <button class="btn btn-outline-primary btn-next btn-sm">
        <label class="add-item" for="id-input-file" style="margin-bottom: 0">
          <input type="file" class="d-none" id="id-input-file"
                 value=""
                 :accept="'.'+'json'"
                 @change.prevent="loadProcesses($event)">
          Загрузить
        </label>
      </button>
      <button class="btn btn-outline-primary btn-next btn-sm"
              @click="saveProcesses">
        Выгрузить
      </button>
    </div>


  </div>
</template>
<script>

export default {
  name: "ppProcessList",
  props: ['rows', 'fields'],
  data() {
    return {
      currentIdx: -1,
      arrayCheckboxes: [],
    }
  },
  computed: {
    selectedIdxs() {
      let s = [];
      for (let i = 0; i < this.arrayCheckboxes.length; i++) if (this.arrayCheckboxes[i] === true) s.push(i);
      return s;
    },
  },

  methods: {
    setCheckboxesValues() {
      for (let i = 0; i < this.rows.length; i++) this.arrayCheckboxes[i] = false;
    },
    selectAll() {
      for (let i = 0; i < this.arrayCheckboxes.length; i++) this.arrayCheckboxes[i] = true;
    },
    unselectAll() {
      for (let i = 0; i < this.arrayCheckboxes.length; i++) this.arrayCheckboxes[i] = false;
    },

    createProcess() {
      this.$emit('doAction', 'create', [], null);
    },
    changeProcess(v) {
      this.$emit('doAction', 'change', [v], null);
    },
    duplicateProcess() {
      this.$emit('doAction', 'duplicate', this.selectedIdxs, null);
    },
    removeProcess() {
      if (this.selectedIdxs.length > 0) this.$emit('doAction', 'remove', this.selectedIdxs, null);
    },
    loadProcesses(e) {
      let file = e.target.files[0];
      this.$emit('doAction', 'load', null, file);
    },
    saveProcesses() {
      if (this.selectedIdxs.length > 0) this.$emit('doAction', 'save', this.selectedIdxs, null);
    },
    startProcess(v) {
      this.$emit('doAction', 'start', [v], null);
    },

    onRowClicked(v) {
      this.currentIdx = v;
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
  watch: {
    rows: {
      handler(v, old) {
        this.setCheckboxesValues();
      },
      deep: true,
      immediate: true,
    }
  },
}

</script>
<style lang="scss">
.ppProcessList {
  width: 100%;
  height: auto;
  font-size: 13px;


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
        box-shadow: 0 0 10px 3px hsla(195, 100%, 36%, 0.5);
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
        background-color: hsla(195, 100%, 36%, 0.05);
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


  .process-list-control {
    width: auto;
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 10px;
    //padding-right: 5px;
    margin: 10px;

  }

  .btn-next {
    height: auto;
    width: auto;
    color: black;
    background-color: transparent;
    border: 1px solid hsl(50, 30%, 75%);
    margin: 5px;

    &:hover {
      color: black;
      background-color: hsl(52, 29%, 90%);
    }
  }

}

</style>
