<template>
  <div class="ProcessListByIdx">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-40">
          <ppProcessListByIdx
              :rows="rows"
              :fields="fields"
              @doActionByIdx="onDoActionByIdx"
          ></ppProcessListByIdx>
            <ppProcessList
                :source="rows"
                @doAction="onDoAction"
            >
            </ppProcessList>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ppProcessListByIdx from "@/components/PpProcesses/ppProcessListByIdx.vue";
import ppProcessList from "@/components/PpProcesses/ppProcessList.vue";
import {mapGetters, mapState} from "vuex";
import {v4, v4 as createUuid} from "uuid";
import {useDtFilters} from "@/composables/useDtFilters.js";

const generateID = () => {
  return v4();
};

const newProcess = {
  id: null,
      header: {
    processTitle: "Новый процесс",
        version: "0.0.1",
        processCategory: ["common"],
        createdDt: (new Date()).toISOString(),
        changedDt: (new Date()).toISOString(),
        description: 'Описание',
        toSave: false,
        toAdd: false,
  },
  type: 'process',
      vars: [
    {name: '$topic', value: '',},
    {name: '$last', value: '',},
  ],
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
        forKey: 'root',
  }
};

export default {
  name: "ProcessList",
  components: {ppProcessListByIdx, ppProcessList},
  props: [],
  data() {
    return {
      file: null,
      typeFile: 'json',
      fields: [
        {key: 'processTitle', label: 'Наименование', sortable: true},
        {key: 'processCategory', label: 'Категория', sortable: true},
        {key: 'createdDt', label: 'Дата создания', sortable: true},
        {key: 'changedDt', label: 'Дата изменения', sortable: true},
        {key: 'description', label: 'Описание', sortable: true},
      ],
    }
  },
    setup() {
        const {dtIsoShort, dtIsoFileName} = useDtFilters();
        return {
            dtIsoShort,
            dtIsoFileName,
        };
    },
    computed: {
    ...mapState(['processList', 'currentEditableProcess', 'currentEditableProcessID', 'currentEditableProcessIdx']),
    ...mapGetters(['processesByID']),

    rows() {
      if (this.processList === null || this.processList.length === 0) return [];
      return this.processList.map(v => {
        return {
          id: v.id,
          processTitle: v.header.processTitle,
          processCategory: v.header.processCategory,
          createdDt: this.dtIsoShort(v.header.createdDt),
          changedDt: this.dtIsoShort(v.header.changedDt),
          description: v.header.description,
        }
      });
    },

  },
  methods: {
    onDoActionByIdx(action, idxs, file) {
      switch (action) {
        case 'create': {
          this.$store.commit('currentEditableProcessIdx', -1);
          this.$router.push({name: 'PgConstructor'});
        }
          return;
        case 'change': {
          if (idxs.length > 0) {
            let forEdit = JSON.parse(JSON.stringify(this.processList[idxs[0]]));
            this.$store.commit('currentEditableProcess', forEdit);
            this.$store.commit('currentEditableProcessIdx', idxs[0]);
            this.$router.push({name: 'PgConstructor'});
          }
        }
          return;
        case 'duplicate': {
          // console.log(idxs);
          let forSave = [];
          for (let i = 0; i < idxs.length; i++) {
            forSave.push(JSON.parse(JSON.stringify(this.processList[idxs[i]])));
          }
          forSave.forEach(v => v.id = createUuid()); // обновляем IDs
          this.$store.commit('addProcessesInList', forSave);
        }
          return;
        case 'remove': {
          if (idxs.length > 0) {
            idxs.reverse().forEach(v => {
              this.processList.splice(v, 1)
            });
            this.$store.commit('processList', this.processList);
          }
        }
          return;

        case 'load': {
          let reader = new FileReader();
          const promise = new Promise((resolve, reject) => {
            reader.onload = () => {
              try {
                let content = JSON.parse(reader.result);
                this.file = {content: content, name: file.name};
                resolve({content: content, name: file.name});

              } catch (e) {
                reject(e);
              }
            };
          });
          reader.readAsText(file);
          promise.then((data) => {
            this.$store.commit('addProcessesInList', data.content);
          }).catch(e => {
            console.log('onload error:', e);
          });
        }
          return;

        case 'save': {
          let arr = [];
          idxs.forEach((v) => {
            arr.push(this.processList[v]);
          });
          this.saveJSONFile(arr, arr[0].header.processTitle + ' ' + this.dtIsoFileName(arr[0].header.changedDt));
        }
          return;

        case 'start': {
          this.$store.dispatch('createNewSession', this.processList[idxs[0]]);
          this.$router.push({name: 'PgSession'});
        }
          return;
        default: {
        }
      }
    },
    onDoAction(action, IDs, file) {
      console.log('action', action, IDs);
      switch (action) {
        case 'create': {
          this.$store.commit('isNewProcess', true);
          let process = newProcess;
          process.id = generateID();
          this.$store.commit('currentEditableProcess', process);
          this.$store.commit('currentEditableProcessID', this.currentEditableProcess.id);
          this.$router.push({name: 'PgConstructor'});
        }
          return;
        case 'change': {
          if (IDs.length > 0) {
            let forEdit = JSON.parse(JSON.stringify(this.processesByID[IDs[0]]));
            this.$store.commit('isNewProcess', false);
            this.$store.commit('currentEditableProcess', forEdit);
            this.$store.commit('currentEditableProcessID', IDs[0]);
            this.$router.push({name: 'PgConstructor'});
          }
        }
          return;
        case 'duplicate': {
          let forSave = [];
          for (let i = 0; i < IDs.length; i++) {
            forSave.push(JSON.parse(JSON.stringify(this.processesByID[IDs[i]])));
          }
          forSave.forEach(v => {
            v.id = createUuid();
            v.header.processTitle += ' - дубликат';
          }); // обновляем IDs
          this.$store.commit('addProcessesInList', forSave);
        }
          return;
        case 'remove': {
          if (IDs.length > 0) {
            IDs.forEach(v => {
              if (confirm(`Удалить процесс ${v} ?`)) this.$store.commit('removeProcessInListByID', v);
            });
          }
        }
          return;

        case 'load': {
          let reader = new FileReader();
          const promise = new Promise((resolve, reject) => {
            reader.onload = () => {
              try {
                let content = JSON.parse(reader.result);
                this.file = {content: content, name: file.name};
                resolve({content: content, name: file.name});

              } catch (e) {
                reject(e);
              }
            };
          });
          reader.readAsText(file);
          promise.then((data) => {
            this.$store.commit('addProcessesInList', data.content);
          }).catch(e => {
            console.log('onload error:', e);
          });
        }
          return;

        case 'save': {
          let arr = [];
          IDs.forEach((v) => {
            arr.push(this.processesByID[v]);
          });
          this.saveJSONFile(arr, arr[0].header.processTitle + ' ' + this.dtIsoFileName(arr[0].header.changedDt));
        }
          return;

        case 'start': {
          this.$store.dispatch('createNewSession', this.processList[idxs[0]]);
          this.$router.push({name: 'PgSession'});
        }
          return;
        default: {
        }
      }

    },

    saveJSONFile: function (object, filename) {
      const json = JSON.stringify(object, null, 2); // Преобразуем объект в строку JSON
      const blob = new Blob([json], {type: "application/json"}); // Создаем Blob из строки JSON
      const url = URL.createObjectURL(blob); // Создаем URL для Blob

      const a = document.createElement("a"); // Создаем элемент <a>
      a.href = url;
      a.download = filename + ".json"; // Устанавливаем имя файла
      a.click();// "Жмем" на <a>, чтобы начать скачивание

      URL.revokeObjectURL(url); // Очищаем URL после скачивания
    },


    //функция возвращает Promise
    loadJSON(file) {
      let reader = new FileReader();
      const result = new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            let content = JSON.parse(reader.result);
            this.file = {content: content, name: file.name};
            resolve({content: content, name: file.name});

          } catch (e) {
            console.log('onload error:', e);
            reject(e);
          }
        };
      });
      reader.readAsText(file);
      return result;

    },
  },
  mounted() {

  },
}
</script>

<style lang="scss">
.ProcessListIdx {
  width: 100%;
  height: auto;

}
</style>
