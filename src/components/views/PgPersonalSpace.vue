<template>
  <div class="PersonalSpace">
    <ppSidePanel
        :isOpened=isOpenedSidePanel
        @onToggleClick="onToggleSidePanel">
      <div class="menu-panel">
        <ppUserMenu class="user-menu"/>
        <ppSessionList class="session-list"
                       :rows="rows"
                       :fields="fields"
                       @doAction="onDoAction"
        />
      </div>
    </ppSidePanel>

    <div class="container">
      <div class="row">
        <div class="col-12" v-if="!!currentSessionID">
          <router-view
          />
        </div>
        <div v-else>Нет открытых сессий</div>
      </div>
    </div>
  </div>
  <b-modal v-model="showModalName"
           @ok="onOkChangeName"
  >
    <b-form-group
        label="Введите название сессии:"
        label-for="input-name"
    >
      <b-form-input
          id="input-name"
          v-model="newSessionName"
          required
      ></b-form-input>
    </b-form-group>
  </b-modal>
</template>

<script>
import ppSessionList from "@/components/PpUserSpace/ppSessionList.vue";
import ppUserMenu from "@/components/PpUserSpace/ppUserMenu.vue";
import ppSidePanel from "@/components/Common/ppSidePanel.vue";
import {mapGetters, mapMutations, mapState} from "vuex";
import SessionPlayer from "@/components/SessionPlayer/ppSessionPlayer.vue";
import {useDtFilters} from "@/composables/useDtFilters.js";

export default {
  name: "PgPersonalSpace",
  components: {SessionPlayer, ppUserMenu, ppSessionList, ppSidePanel},
  props: [],
  data() {
    return {
      file: null,
      newSessionName: '',
      showModalName: false,
      currentInListID: null,
      fields: [
        {key: 'sessionTitle', label: 'Наименование'},
        // {key: 'processTitle', label: 'Процесс'},
        {key: 'createdDt', label: 'Дата создания'},
        {key: 'status', label: 'Состояние'},
      ],
      isOpenedSidePanel: false,
    }
  },
  setup() {
      const {dtIsoShort} = useDtFilters();
      return {
        dtIsoShort
      }
  },
  computed: {
    ...mapState(['sessionList', 'currentSessionID']),
    ...mapGetters(['sessionsByID']),
    ...mapMutations(['sessionsToPausedExceptThis']),

    rows() {
      if (this.sessionList === null || this.sessionList.length === 0) return [];
      return this.sessionList.map(v => {
        return {
          id: v.id,
          sessionTitle: v.header.sessionTitle,
          // processTitle: v.process.header.processTitle,
          createdDt: this.dtIsoShort(v.header.createdDt),
          status: v.status,

        }
      });
    },

  },
  methods: {
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

    onDoAction(action, IDs, file) {
      if (IDs !== null) {
        this.currentInListID = IDs[0];
        // this.$store.commit('currentSessionID', this.currentInListID);
      }
      switch (action) {
        case 'changeStatus': {
          let oldStatus = this.sessionsByID[this.currentInListID].status;
          switch (oldStatus) {
            case 'new':
            case 'paused': {
              this.onToggleSidePanel();
              this.$store.commit('changeSessionStatusByID', {id: this.currentInListID, status: 'inProgress'});
              this.$store.commit('sessionsToPausedExceptThis', this.currentInListID);
              this.$router.push({name: 'PgSession', params: {id: this.currentInListID}});
              this.$store.commit('currentSessionID', this.currentInListID);
            }
              break;
            case 'inProgress': {
              this.sessionsByID[this.currentInListID].status = 'paused';
              this.onToggleSidePanel();
            }
              break;
            default: {
            }
          }
        }
          return
        case 'remove': {
          if (this.currentInListID !== -1) this.$store.commit('removeSessionInListByID', this.currentInListID);
          if (this.currentInListID === this.currentSessionID) {
            this.$store.commit('currentSessionID', null);
            this.$router.push({name: 'PgSession', params: {id: ''}});
          }
        }
          return
        case 'changeName': {
          if (this.currentInListID !== -1 && !!this.currentSessionID) {
            this.newSessionName = this.sessionsByID[this.currentInListID].header.sessionTitle;
            this.showModalName = true;
          }
        }
          return
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
            this.$store.commit('addSessionInList', data.content);
          }).catch(e => {
            console.log('onload error:', e);
          });
        }
          return
        case 'save': {
          let session = this.sessionsByID[this.currentInListID];
          this.saveJSONFile(session, session.header.sessionTitle + ' ' + this.dtIsoShort(session.header.changedDt));
        }
          return
        default: {
        }
      }
    },


    onOkChangeName() {
      this.$store.commit('changeSessionNameByID', {id: this.currentInListID, name: this.newSessionName});
      // this.$store.commit('changeSessionNameByID', {id: this.currentSessionID, name: this.newSessionName});
    },
    onToggleSidePanel() {
      this.isOpenedSidePanel = !this.isOpenedSidePanel
    },

  },
  mounted() {
  },
}
</script>

<style lang="scss">
/****  PersonalSpace  ****/
.PersonalSpace {
  width: 100%;
  height: auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: start;
  padding: 0px;

  .menu-panel {
    width: 400px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    padding: 15px;
    background-color: hsla(0, 0%, 95%, 0.85);
    border-radius: 0px;
    z-index: 20;

    .user-menu {
      width: 100%;
      height: auto;
    }

    .session-list {
      width: 100%;
      height: auto;
      margin-top: auto;
    }
  }

}
</style>
