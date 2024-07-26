<template>
  <div class="ppSessionList">
    <div class="table-custom-short"
      v-if="isShortMenu"
    >
      <div class="table-row-short"
           v-if="!!rowsShort && rowsShort.length >0"
           v-for="(rowShort, r) of rowsShort" :key="r"
           :style="statusShort(rowShort.status)"
           @click="onRowClicked(rowShort.id)"
           v-b-tooltip.hover = tooltipOnRow(rowShort.createdDt,rowShort.changedDt)

      >
        <div class="table-cell-short info-short">
            {{rowShort.sessionInfo}}
        </div>
        <div class="table-cell-short row-button-place-short">
          <button
              v-if="rowShort.status === 'inProgress' || rowShort.status === 'paused'"
              class="btn btn-outline-primary btn-sm my-btn-short"
              style="backgroundColor: white"
              @click="changeStatus(rowShort.id)"
          >
              <i class="ico" :class="icoControl(rowShort.status)"
                  style="font-size: 30px; color: hsl(0,0%,50%)"></i>
        </button>
          <div v-else>Сессия завершена</div>
        </div>
        <div :class="{currentShort: rowShort.id===currentID}">
        </div>

      </div>
    </div>
    <div class="table-custom" v-if="!isShortMenu">
      <div class="table-head">
        <div class="table-cell cell-title" :class="{name: (field.key === 'name')}"
             v-for="(field, i) of fields" :key="i">
          {{ field.label }}
        </div>
        <div class="table-cell right">
        </div>
      </div>
      <div class="table-row"
           :class="{last: (r === rows.length-1)}"
           v-if="!!rows && rows.length  >0"
           v-for="(row, r) of rows" :key="r"
           :style="{backgroundColor: (r%2 === 1) ? 'hsl(0, 0%, 83%, 0.3)' : 'none'}"
           @click="onRowClicked(row.id)">
        <div :class="{current: row.id===currentID}">
        </div>
        <div class="table-cell cell-row" :class="{name: (field.key === 'name')}"
             v-if="!!fields && fields.length>0"
             v-for="(field, f) of fields" :key="f"
        >
         {{field.key !== 'status' ? row[field.key] : statusList[row[field.key]] }}
        </div>

        <div class="table-cell row-button-place right">
          <button
              v-if="row.status === 'inProgress' || row.status === 'paused'"
              class="btn btn-outline-primary my-btn btn-sm"
              @click="changeStatus(row.id)"
          >
            {{ showStatus(row.status) }}
          </button>
          <div v-else>Сессия завершена</div>
        </div>
      </div>
    </div>
    <div class="session-list-control">
        <button class="btn btn-outline-primary btn-control btn-sm"
                @click="changeName(currentID)">
          Изменить название
        </button>
        <button class="btn btn-outline-primary btn-control btn-sm"
                @click="remove(currentID)">
          Удалить
        </button>
        <button class="btn btn-outline-primary btn-control btn-sm">
          <label class="add-item" for="id-input-file" style="margin-bottom: 0">
            <input type="file" class="d-none" id="id-input-file"
                   value=""
                   :accept="'.'+'json'"
                   @change.prevent="loadSession($event)">
            Загрузить
          </label>
        </button>
        <button class="btn btn-outline-primary btn-control btn-sm"
                @click="saveSession(currentID)">
          Выгрузить
        </button>
    </div>

  </div>
</template>

<script>

export default {
  name: "ppSessionList",
  components: {},
  props: ['rows', 'fields', 'rowsShort', 'isShortMenu'],
  data() {
    return {
      // currentIdx: null,
      currentID: null,
    }
  },
  setup() {
    const statusList = {
      'new': 'новый',
      'inProgress': 'выполняется',
      'paused': 'на паузе',
      'finished': 'завершён'

    };

    return {
      statusList,
    }

  },

  computed: {

  },
  methods: {
    tooltipOnRow(v1, v2) {
      return 'Создан: '+v1+' Изменён: '+v2 ;
    },
    icoControl(v) {
      if (v === 'inProgress') return 'ico-pause';
      if (v === 'paused' || 'new') return 'ico-play2';
    },
    statusShort(v) {
      let color='';
      switch (v) {
        case 'inProgress': color='hsla(84, 80%, 90%)';
        break;
        case 'paused': color='hsla(58, 80%, 90%)'
        break;
        case 'finished': color='hsl(0,0%,85%)'
        break;
        default: {}
      }
      return {backgroundColor: color}
    },
    onRowClicked(v) {
      this.currentID = v;
    },
    changeStatus(v) {
      this.$emit('doAction', 'changeStatus', [v]);
    },
    changeName(v) {
      if (!!v || v === 0) this.$emit('doAction', 'changeName', [v]);
    },
    remove(v) {
      if (!!v || v === 0) this.$emit('doAction', 'remove', [v]);
    },
    saveSession(v) {
      if (!!v || v === 0) this.$emit('doAction', 'save', [v]);
    },
    loadSession(e) {
      let file = e.target.files[0];
      this.$emit('doAction', 'load', null, file);
    },
    showStatus(v) {
      switch (v) {
        case 'new':
          return 'Запустить';
        case 'paused':
          return 'Запустить';
        case 'inProgress':
          return 'Пауза';
        default: {
        }
      }
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

  .table-custom-short {
    position: relative;
    width: 100%;
    flex: 0 0 auto;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    border: 1px solid hsla(0, 0%, 50%, 0.8);
    user-select: none;


    .table-row-short {
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
      &:last-child {
        border-bottom: none;
      }


      .table-cell-short {
        //position: relative;
        //width: 100px;
        //height: auto;
        padding: 5px;
        flex: 1 1 auto;
        //min-width: 50px;
        //border-right: 1px solid hsla(0, 0%, 50%, 0.8);
        //text-align: left;

        &.info-short {
          width: 150px;
          justify-content: flex-start;
          align-items: flex-start;
          text-align: left;
          word-break: break-all;
          word-break: break-word;
          //font-weight: bold;
        }

        &.row-button-place-short {
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin-right: 5px;

          .my-btn-short {
            height: 40px;
            width: 40px;
            color: black;
            background-color: transparent;
            border: 1px solid hsl(50, 30%, 75%);
            display: flex;
            align-items: center;
            justify-content: center;


            &:hover {
              color: black;
              background-color: hsl(52, 29%, 90%);
            }
          }
        }
        &:last-child {
          border-right: none;
        }
      }

    }
    .currentShort {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid rgba(0, 140, 186, 0.5);
      pointer-events: none;
      //background-color: hsla(195, 100%, 36%, 0.05);
    }
  }
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
        .my-btn {
          height: 25px;
          width: 80px;
          color: black;
          background-color: transparent;
          border: 1px solid hsl(50, 30%, 75%);
          margin: 0px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            color: black;
            background-color: hsl(52, 29%, 90%);
          }
        }

    .table-cell {
      position: relative;
      width: 85px;
      height: auto;
      padding: 2px;
      flex: 1 1 auto;
      min-width: 50px;
      border-right: 1px solid hsla(0, 0%, 50%, 0.8);
      text-align: left;
      word-break: keep-all;

      &.cell-title {
        justify-content: center;
        align-items: center;
        text-align: center;
        //word-break: break-word;
        font-weight: bold;
      }
        &.row-button-place {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          padding: 0px;
        }

      &.cell-row {
        justify-content: flex-start;
        align-items: flex-start;
        text-align: left;
        //word-break: break-all;
      }
        &.name {
          width: 200px;
        }

      &.right {
        border-right: none;
      }
    }

  }

  .session-list-control {
    width: auto;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 10px;

  .btn-control {
    height: 50px;
    width: 80px;
    color: black;
    background-color: transparent;
    border: 1px solid hsl(50, 30%, 75%);
    margin: 0px;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;

    &:hover {
      color: black;
      background-color: hsl(52, 29%, 90%);
    }
  }
}

}
</style>
