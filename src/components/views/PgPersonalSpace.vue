<template>
  <div class="PersonalSpace"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd"
  >
<!--     <div-->
<!--       class="for-touch"-->
<!--       v-if="isTouchDevice"-->
<!--       @touchstart="handleTouchStart"-->
<!--       @touchmove="handleTouchMove"-->
<!--       @touchend="handleTouchEnd"-->
<!--     >-->
<!--     </div>-->
    <ppSidePanel
        :isOpened=isOpenedSidePanel
        @onToggleClick="onToggleSidePanel">
      <div class="menu-panel">
        <ppUserMenu class="user-menu"/>
        <ppSessionList class="session-list"
                       :rows="rows"
                       :rowsShort="rowsShort"
                       :fields="fields"
                       :isShortMenu="isTouchDevice"
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
        {key: 'name', label: 'Имя'},
        // {key: 'processTitle', label: 'Процесс'},
        {key: 'createdDt', label: 'Создан'},
        {key: 'changedDt', label: 'Изменён'},
        {key: 'status', label: 'Состояние'},
      ],
      isOpenedSidePanel: false,
      touchStartX: 0,
      touchEndX: 0
    }
  },
  setup() {
    const {dtIsoShort} = useDtFilters();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return {
        dtIsoShort,
        isTouchDevice,
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
          name: v.header.sessionTitle,
          // processTitle: v.process.header.processTitle,
          createdDt: this.dtIsoShort(v.header.createdDt),
          changedDt: this.dtIsoShort(v.header.changedDt),
          status: v.status

        }
      });
    },
    rowsShort() {
      if (this.sessionList === null || this.sessionList.length === 0) return [];
      return this.sessionList.map(v => {
        return {
          id: v.id,
          sessionInfo: v.header.sessionTitle,
          // processTitle: v.process.header.processTitle,
          createdDt: this.dtIsoShort(v.header.createdDt),
          changedDt: this.dtIsoShort(v.header.changedDt),
          status: v.status,

        }
      });
    },

  },
  methods: {
    handleTouchStart(event) {
      this.touchStartX = event.changedTouches[0].screenX;
    },

    handleTouchMove(event) {
      this.touchEndX = event.changedTouches[0].screenX;

    },

    handleTouchEnd() {
      if (this.touchStartX - this.touchEndX > 50) {
        this.isOpenedSidePanel = false;
      } else if (this.touchEndX - this.touchStartX > 50) {
        this.isOpenedSidePanel = true;
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
              // console.log('currentInListID:', this.currentInListID);
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
  .for-touch {
    position: fixed;
    top: var(--header-height);
    width: 100%;
    height: 95dvh;
    background-color: hsl(152, 69%, 19%, 0.75);
    z-index: 30;

  }
  .menu-panel {
    //width: 400px;
    width: auto;
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
