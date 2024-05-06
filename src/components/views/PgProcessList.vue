<template>
  <div class="ProcessList">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-40">
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
import ppProcessList from "@/components/PpProcesses/ppProcessList.vue";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {v4, v4 as createUuid} from "uuid";
import {useDtFilters} from "@/composables/useDtFilters.js";
import {useFiles} from "@/composables/useFiles.js";


export default {
  name: "ProcessList",
  components: {ppProcessList},
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
        const {saveJSONFile, loadJSON} = useDtFilters();
        return {
            dtIsoShort,
            dtIsoFileName,
            saveJSONFile,
            loadJSON
        };
    },
    computed: {
    ...mapState(['processList', 'currentEditableProcess', 'currentEditableProcessID', 'currentSessionID']),
    ...mapGetters(['processesByID', 'sessionsByID']),
    ...mapMutations(['changeSessionStatusByID','changeProcessTypeByID', 'trashProcessInListByID', 'sessionsToPausedExceptThis']),
    ...mapActions(['createNewProcess']),

    rows() {
      if (this.processList === null || this.processList.length === 0) return [];
      return this.processList.map(v => {
        return {
          id: v.id,
          type: v.type,
          deleted: v.deleted,
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
    onDoAction(action, IDs, file) {
      console.log(action, IDs);
      switch (action) {
        case 'create': {
          this.$store.dispatch('createNewProcess').then((v)=>
          {
            this.$store.commit('currentEditableProcessID', v);
            this.$store.commit('currentEditableProcess', this.processesByID[v]);
            this.$router.push({name: 'PgConstructor'});
            alert(v);
          });
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
        case 'toDraft': {
          if (this.processesByID[IDs[0]].type !== 'draft') {
            this.$store.commit('changeProcessTypeByID', {id: IDs[0], type: 'draft'});
          }
        }
          return;
        case 'toReady': {
          if (this.processesByID[IDs[0]].type !== 'ready') {
            this.$store.commit('changeProcessTypeByID', {id: IDs[0], type: 'ready'});
          }
        }
          return;
        case 'toTemplate': {
          if (this.processesByID[IDs[0]].type !== 'template') {
            this.$store.commit('changeProcessTypeByID', {id: IDs[0], type: 'template'});
          }
        }
          return;

        case 'fromTemplate': {
          //дублировать и сделать тип 'Черновик'
          let forSave = [];
          for (let i = 0; i < IDs.length; i++) {
            if (this.processesByID[IDs[i]].type === 'template') forSave.push(JSON.parse(JSON.stringify(this.processesByID[IDs[i]])));
          }
          forSave.forEach(v => {
            v.id = createUuid();
            v.header.processTitle += ' - дубликат';
            v.type = 'draft'
          }); // обновляем IDs
          this.$store.commit('addProcessesInList', forSave);
        }
          return;

        case 'fromDraftOrReady': {
          //дублировать и сделать тип 'Шаблон'
          let forSave = [];
          for (let i = 0; i < IDs.length; i++) {
            if (this.processesByID[IDs[i]].type === 'draft' || this.processesByID[IDs[i]].type === 'ready') forSave.push(JSON.parse(JSON.stringify(this.processesByID[IDs[i]])));
          }
          forSave.forEach(v => {
            v.id = createUuid();
            v.header.processTitle += ' - дубликат';
            v.type = 'template'
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
          return

        case 'toTrash': {
          if (IDs.length > 0) {
            IDs.forEach(v => {
              if (confirm(`Переместить в корзину процесс ${v} ?`)) this.$store.commit('trashProcessInListByID', {id: v, deleted: true});
            });
          }
        }
          return;
        case 'fromTrash': {
          if (IDs.length > 0) {
            IDs.forEach(v => {
              if (confirm(`Достать из корзины процесс ${v} ?`)) this.$store.commit('trashProcessInListByID', {id: v, deleted: false});
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
          let result = prompt('Введите название файла выгрузки', arr.map((v)=>v.header.processTitle).join(' ') + ' ' + this.dtIsoFileName(new Date()).toISOString())
          if (!!result) this.saveJSONFile(arr, result);
        }
          return;

        case 'start': {
          this.$store.dispatch('createNewSession', this.processesByID[IDs[0]]).then((v)=>
            {
              this.$store.commit('currentSessionID', v);
              this.$store.commit('changeSessionStatusByID', {
                id: v,
                status: 'inProgress'
              });
              this.$store.commit('sessionsToPausedExceptThis', this.currentSessionID);
              this.$router.push({name: 'PgSession', params: {id: v}});
            });
        }
          return;
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
.ProcessList {
  width: 100%;
  height: auto;

}
</style>
