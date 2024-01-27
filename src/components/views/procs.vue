<template>
    <div class="ProcessList">
        <div class="container">
            <div class="row">
                <div class="col-12 mt-40">
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
                    <b-table class=""
                             striped
                             small
                             hover
                             selectable
                             bordered
                             sortable
                             select-mode="multi"
                             :items="processList"
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
                        <button class="btn btn-outline-primary btn-custom btn-sm"
                                @click="loadProcesses">
                            Загрузить
                        </button>
                        <button class="btn btn-outline-primary btn-custom btn-sm"
                                @click="saveProcesses">
                            Выгрузить
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ppList from "@/components/Pplist/ppList.vue";

const emptyProcess = {
    processTitle: "Новый процесс",
    processCategory: "common",
    type: 'process',
    createdDt: (new Date()).toISOString(),
    changedDt: (new Date()).toISOString(),
    descripton: '',
    toSave: false,
    toAdd: false,
    rootNode: {
        type: 'loopList',
        attrs: {
            nodeName: {
                inpType: 'text',
                inpLabel: 'Название узла (optional)',
                value: 'root',
            },
            loopCount: {
                inpType: 'number',
                inpLabel: 'Количество циклов',
                value: 0, // ноль означает бесконечный цикл
            },
        },
        list: [],
    }
}
export default {
    head: {
        title: 'PsyProcessor : Процессы'
    },
    name: "ProcessList",
    components: {ppList},
    props: [],
    data() {
        return {
            file: null,
            typeFile: 'json',
            processList: [],
            currProcess: null,
            selectedProcessesIdxs: [],
            fields: [
                {key: 'processTitle', label: 'Наименование', sortable: true},
                {key: 'processCategory', label: 'Категория', sortable: true},
                {key: 'createdDt', label: 'Дата создания', sortable: true},
                {key: 'changedDt', label: 'Дата изменения', sortable: true},
                {key: 'description', label: 'Описание', sortable: true},

            ],

        }
    },
    computed: {
        rows() {
            return this.processList.map(v => {
                return {
                    processTitle: v.processTitle,
                    processCategory: v.processCategory,
                    createdDt: this.dtFormatCustom(v.createdDt),
                    changedDt: this.dtFormatCustom(v.changedDt),
                    description: v.description
                }
            });
        },

    },
    methods: {
        createProcess() {
            this.processList.push({
                ...emptyProcess,
                createdDt: (new Date()).toISOString(),
                changedDt: (new Date()).toISOString(),
            });

        },
        changeProcess() {

        },
        cloneProcess() {

        },
        removeProcess() {
//удалить все выбранные массивы
        },
        loadProcesses() {


        },
        saveProcesses() {
//собрать массив процессов для выгрузки
            let arr = [];
            for (let i; i < this.selectedProcessesIdxs.length; i++) {
                arr.push(this.processList[this.selectedProcessesIdxs[i]]);
            }
//получить имя для набора процессов
        },

        onRowClicked(item, index, event) {
            this.currProcess = this.processList[index];

        },

        onCheckBoxClick(idx) {
        },
        initProcessListMock() {
            this.processList = [
                {
                    processTitle: 'Процесс 1',
                    processCategory: 'Общие',
                    createdDt: '2024-01-23T15:11:37',
                    changedDt: '2024-01-24T15:11:37',
                    description: 'Описание 1'
                },
                {
                    processTitle: 'Процесс 2',
                    processCategory: 'Креативность',
                    createdDt: '2024-02-23T15:11:37',
                    changedDt: '2024-02-24T15:11:37',
                    description: 'Описание 2'
                },
                {
                    processTitle: 'Процесс 3',
                    processCategory: 'Осознавание',
                    createdDt: '2024-03-23T15:11:37',
                    changedDt: '2024-03-24T15:11:37',
                    description: 'Описание 3'
                },
                {
                    processTitle: 'Процесс 4',
                    processCategory: 'Пространство',
                    createdDt: '2024-04-23T15:11:37',
                    changedDt: '2024-04-24T15:11:37',
                    description: 'Описание 4'
                },
            ];
        },


        dtFormatCustom(dtISO) {
            let result = dtISO.substring(0, 19).split('');
            result[10] = '-';
            result[13] = '-';
            result[16] = '-';
            return result.join('');
        }
    },
    mounted() {
        this.initProcessListMock();
    },
}
</script>

<style lang="scss">
.ProcessList {
  width: 100%;
  height: auto;

  width: 100%;
  height: auto;

  thead {
    text-align: center;
  }

  .table-custom {
    position: relative;
    width: 100%;
    min-width: 500px;
    height: auto;
    font-size: 0.8rem;
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

      //&.table-title {
      //    font-weight: normal;
      //    background-color: hsl(0, 0%, 83%, 0.3);
      //}

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
