<template>
  <div class="Constructor">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <el-dialog v-model="dialogVisible" title="Укажите тип нового процесса:">
            <el-radio-group v-model="selectedType">
              <el-radio :value="'draft'">Черновик</el-radio>
              <el-radio :value="'template'">Шаблон</el-radio>
            </el-radio-group>
            <div slot="footer" class="dialog-footer">
              <el-button @click="onDialogCancel">Отмена</el-button>
              <el-button type="primary" @click="onDialogConfirm">Подтвердить</el-button>
            </div>
          </el-dialog>
          <PpConstructor
              v-if="!!currentEditableProcess"
              v-model:process="currentEditableProcess"
              @changed="processChanged"
              :key="currentEditableProcess.id"
          />
          <button
              class="btn btn-outline-primary btn-control btn-sm"
              @click="createProcess"
              v-else
          >
            Создать
          </button>

        </div>
        <div
            class="files-control"
            v-if="!!currentEditableProcess"
        >
          <button class="btn btn-outline-primary btn-control btn-sm"
                  @click="onSaveInList">
            Сохранить
          </button>
          <button class="btn btn-outline-primary btn-control btn-sm"
                  v-if="this.currentEditableProcess.status==='template'"
                  @click="onSaveAsDraft">
            Сохранить как черновик
          </button>
          <button class="btn btn-outline-primary btn-control btn-sm"
                  v-if="this.currentEditableProcess.status==='draft' || this.currentEditableProcess.status==='ready'"
                  @click="onSaveAsTemplate">
            Сохранить как шаблон
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PpConstructor from "@/components/PpConstructor/PpConstructor.vue";
import {mapGetters, mapState} from "vuex";
import {v4 as createUuid, v4} from "uuid";
import { ElButton, ElDialog, ElRadioGroup, ElRadio } from 'element-plus';

export default {
  name: "PgConstructor",
  components: {PpConstructor, ElButton, ElDialog, ElRadioGroup, ElRadio},
  props: [],
  data() {
    return {
      debounceTime: 800,
      debounceHandle: null,
      dialogVisible: false,
      selectedType: 'draft',
    }
  },

  computed: {
    ...mapState(['currentEditableProcess', 'currentEditableProcessID']),
    ...mapGetters(['processesByID']),
      routeConstructor() {
        return this.$route.params.id;
      },
  },
  methods: {
    processChanged() {
      this.currentEditableProcess.header.changedDt = (new Date()).toISOString();
      clearTimeout(this.debounceHandle);
      this.debounceHandle = setTimeout(() => {
        this.$store.commit('currentEditableProcess', this.currentEditableProcess);
      }, this.debounceTime);
    },
    onSaveInList() {
      let forSave = JSON.parse(JSON.stringify(this.currentEditableProcess));

      //если процесс с таким id есть в списке, то обновляем его, если нет, то добавляем новый
      if (!!this.processesByID[this.currentEditableProcessID]) {
        // console.log('есть такой процесс');
        this.$store.commit('changeProcessInListByID', {id: this.currentEditableProcessID, process: forSave});
      } else {
        // console.log('нет такого процесса и сейчас мы его добавим в список');
        this.$store.commit('addProcessesInList', [forSave]);

      };

      // this.$router.push({name: 'PgProcessList', params:{id: forSave.id}});
      this.$router.push({name: 'PgProcessList'});
    },
    createProcess() {
      console.log('создание нового процесса');
      this.openDialogCreateProcess();

    },

    openDialogCreateProcess(){
      this.dialogVisible = true;
    },

    onDialogConfirm(){
      this.dialogVisible = false;
      this.$store.dispatch('createNewProcess', this.selectedType).then((v)=>
      {
        this.$store.commit('currentEditableProcessID', v);
        this.$store.commit('currentEditableProcess', this.processesByID[v]);
        this.$router.push({name: 'PgConstructor', params: {id: v}});
      });
    },

    onDialogCancel(){
      this.dialogVisible = false;
    },

    onSaveAsDraft(){
      let forSave = JSON.parse(JSON.stringify(this.currentEditableProcess));
      forSave.id = createUuid();
      forSave.header.processTitle += ' - черновик';
      forSave.status = 'draft';

      this.$store.commit('addProcessesInList', [forSave]);

      this.$store.commit('currentTabProcessList', 'tabDrafts');
      this.$router.push({name: 'PgProcessList'});
    },
    onSaveAsTemplate(){
      let forSave = JSON.parse(JSON.stringify(this.currentEditableProcess));
      forSave.id = createUuid();
      forSave.header.processTitle += ' - шаблон';
      forSave.status = 'template';
      this.$store.commit('addProcessesInList', [forSave]);

      this.$store.commit('currentTabProcessList', 'tabTemplates');
      this.$router.push({name: 'PgProcessList'});
    },
  },
  mounted() {
    console.log('currentEditableProcess: ', this.currentEditableProcess);
    if (this.routeConstructor === undefined) {
      console.log('routeConstructor is Undefined, вы попали сюда через ссылку в Хедере');
      //проверяем, существует ли CurrentProcess
      if (!!this.currentEditableProcess) {
        console.log('текущий процесс существует');
      } else {
        console.log('текущий процесс не существует и будет создан');
        this.createProcess();
      };
      return
    }

    if (this.routeConstructor === '') {
      console.log('routeConstructor = пустаяСтрока, вы попали сюда через адресную строку без указания id');
      //проверяем, существует ли CurrentProcess
      if (!!this.currentEditableProcess) {
        console.log('процесс существует');
      } else {
        console.log('текущий процесс не существует и будет создан');
        this.createProcess()
      };
      return
    }

    if (!!this.routeConstructor) {
      console.log('routeConstructor:', this.routeConstructor);
      const procByID = this.processesByID[this.routeConstructor];
      console.log('procByID', procByID);
      //проверить вхождение в список существующих процессов
      if (!procByID) {
        console.log('процесс не найден');
        const msgError = 'Ошибка в адресной строке.';
        let msgErrorDetail = '';
        if (this.routeConstructor.length<36) {
          msgErrorDetail = 'Слишком короткий идентификатор.'
        } else {
          msgErrorDetail = 'Процесс с таким идентификатором не найден.'
        };
        const msgErrorFullText = msgError+' '+msgErrorDetail+' Проверьте правильность ссылки.'
        alert(msgErrorFullText);
        if (!this.currentEditableProcess) this.createProcess();
        return;
      } else {
        //Загрузить процесс для редактирования
        this.$store.commit('currentEditableProcessID', procByID.id);
        this.$store.commit('currentEditableProcess', procByID);
      };

    } else {
      //проверить, есть ли какой-либо текущий процесс
      //если нет, то:
      if (!this.currentEditableProcess) this.createProcess();
      return;

    };

    //



  },
  watch: {
      routeConstructor: {
          handler(v, old) {
              // console.log('Сработал вотчер', v, old);
              // if (v === 'new') console.log('Новый процесс');
              // if (v !== null && v !== old) {
              //     console.log('Проверка процесса на существование');
              //     console.log('Загрузка процесса для редактирования:', v);
              // }
          }
      }
  },
}
</script>

<style lang="scss">
.Constructor {
  width: 100%;
  height: auto;
  min-height: 100dvh;

  .files-control {
    width: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    gap: 10px;
    padding: 5px;
    margin: 10px;

    .btn-control {
      color: black;
      border: 1px solid hsl(50, 30%, 75%);

      &:hover {
        background-color: hsl(52, 29%, 90%);
      }
    }
  }
}
</style>

"
*
