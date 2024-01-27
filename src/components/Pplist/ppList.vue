<template>
    <div class="ppList">
        <b-table class="table-custom"
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
                    @click="createNewProcess">
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
</template>
<script>

export default {
    name: "ppList",
    props: ['processList'],
    emits: ['idx', 'action'],
    data() {
        return {
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
    },

    methods: {
        createProcess() {

        },
        changeProcess() {

        },
        cloneProcess() {

        },
        removeProcess() {

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
    },
    mounted() {

    },
}

</script>

<style lang="scss">
.ppList {
  width: 100%;
  height: auto;

  thead {
    text-align: center;
  }

  .table-custom {
    //color: blue;
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
