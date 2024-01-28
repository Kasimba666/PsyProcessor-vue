<template>
  <div class="ProcessList">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-40">
          <pp-list
              :rows="rows"
              :fields="fields"
          ></pp-list>
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
  descripton: 'Описание',
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


    dtFormatCustom(dtISO) {
      let result = dtISO.substring(0, 19).split('');
      result[10] = '-';
      result[13] = '-';
      result[16] = '-';
      return result.join('');
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

}
</style>
