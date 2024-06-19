<template>
  <div class="PgProcessList">
    <div class="container">
      <div class="row">
        <div class="col-12">
            <ppProcessList
                :source="rows"
                @doAction="onDoAction"
            >
            </ppProcessList>

        </div>
      </div>
    </div>
  </div>
<!--  <el-dialog-->
<!--      v-model="dialogVisible"-->
<!--  >-->
<!--    <span>Процесс {{dialogProcessName}} с таким id существует</span>-->
<!--    <br/>-->
<!--    <br/>-->
<!--    <span slot="footer" class="dialog-footer">-->
<!--      <el-button type="primary" @click="onClickDialogChoice('skip')">Пропустить</el-button>-->
<!--      <el-button @click="onClickDialogChoice('overwrite')">Перезаписать</el-button>-->
<!--    </span>-->
<!--  </el-dialog>-->
</template>

<script>
import ppProcessList from "@/components/PpProcesses/ppProcessList.vue";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {v4 as createUuid} from "uuid";
import {useDtFilters} from "@/composables/useDtFilters.js";
import {useFiles} from "@/composables/useFiles.js";


export default {
  name: "PgProcessList",
  components: {ppProcessList},
  props: [],
  data() {
    return {
      file: null,
      typeFile: 'json',
    }
  },
    setup() {
        const {dtIsoShort, dtIsoFileName} = useDtFilters();
        const {saveJSONFile, loadJSON} = useFiles();
        return {
            dtIsoShort,
            dtIsoFileName,
            saveJSONFile,
            loadJSON
        };
    },
    computed: {
    ...mapState(['processList', 'currentEditableProcess', 'currentEditableProcessID', 'currentSessionID', 'defaultProcessList']),
    ...mapGetters(['processesByID', 'sessionsByID']),
    ...mapMutations(['changeSessionStatusByID','changeProcessStatusByID', 'trashProcessInListByID', 'sessionsToPausedExceptThis', 'addProcessesInList']),
    ...mapActions(['createNewProcess']),

    rows() {
      if (this.processList === null || this.processList.length === 0) return [];
      return this.processList.map(v => {
        return {
          id: v.id,
          status: v.status,
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
      // console.log(action, IDs);
      switch (action) {
        case 'createDraft': {
          this.$store.dispatch('createNewProcess', 'draft').then((v)=>
          {
            this.$store.commit('currentEditableProcessID', v);
            this.$store.commit('currentEditableProcess', this.processesByID[v]);
            this.$router.push({name: 'PgConstructor', params: {id: v}});
          });
        }
          return;
        case 'createTemplate': {
          this.$store.dispatch('createNewProcess', 'template').then((v)=>
          {
            this.$store.commit('currentEditableProcessID', v);
            this.$store.commit('currentEditableProcess', this.processesByID[v]);
            this.$router.push({name: 'PgConstructor', params: {id: v}});
          });
        }
          return;
        case 'change': {
          if (IDs.length > 0) {
            let forEdit = JSON.parse(JSON.stringify(this.processesByID[IDs[0]]));
            this.$store.commit('isNewProcess', false);
            this.$store.commit('currentEditableProcess', forEdit);
            this.$store.commit('currentEditableProcessID', IDs[0])
            this.$router.push({name: 'PgConstructor', params: {id: IDs[0]}});
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
          if (this.processesByID[IDs[0]].status !== 'draft') {
            this.$store.commit('changeProcessStatusByID', {id: IDs[0], status: 'draft'});
          }
        }
          return;
        case 'toReady': {
          if (this.processesByID[IDs[0]].status !== 'ready') {
            this.$store.commit('changeProcessStatusByID', {id: IDs[0], status: 'ready'});
          }
        }
          return;
        case 'toTemplate': {
          if (this.processesByID[IDs[0]].status !== 'template') {
            this.$store.commit('changeProcessStatusByID', {id: IDs[0], status: 'template'});
          }
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
        case 'restore': {
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
          let result = prompt('Введите название файла выгрузки', arr.map((v)=>v.header.processTitle).join(' ') + ' ' + this.dtIsoFileName((new Date()).toISOString()));
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

        case 'loadDefault': {
          console.log('зашли в действие loadDefault');
          if (!!this.defaultProcessList && this.defaultProcessList.length>0) {
            this.defaultProcessList.forEach((v)=>{
              if (!!this.processesByID[v.id]) {

                if (confirm(`Процесс "${v.header.processTitle}" с таким id уже существует, перезаписать?`)) {

                  //удалить существующий с таким id
                  this.$store.commit('removeProcessInListByID', v.id);
                  //записать новый
                  this.$store.commit('addProcessesInList', [v]);
                }
              }else{
                this.$store.commit('addProcessesInList', [v]);
              }
            });
          }
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
.PgProcessList {
  width: 100%;
  height: auto;
  z-index: 30;

}
</style>
