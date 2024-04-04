<template>
  <div class="PersonalSpace">

    <div class="side-panel" :class="{'active': isOpenedSidePanel}">
      <div class="menu-panel">
        <ppUserMenu class="user-menu"/>
        <ppSessionList class="session-list"
                       :rows="rows"
                       :fields="fields"
                       @doAction="onDoAction"
        />
      </div>
      <div class="toggle-side-panel" :class="{'active': isOpenedSidePanel}"
           @click="onToggleSidePanel()">
        <i
            v-if="isOpenedSidePanel"
            class="ico ico-circle-left"
        ></i>
        <i
            v-else
            class="ico  ico-circle-right"
        ></i>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-view
              :sessionID=currentID
          />
        </div>
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
import {mapState} from "vuex";
import SessionPlayer from "@/components/SessionPlayer/ppSessionPlayer.vue";
const widthSidePanel = 400;
export default {
  name: "PgPersonalSpace",
  components: {SessionPlayer, ppUserMenu, ppSessionList},
  props: [],
  data() {
    return {
      file: null,
      newSessionName: '',
      showModalName: false,
      currentIdx: null,
      currentID: null,
      currentSession: null,
      fields: [
        {key: 'sessionTitle', label: 'Наименование'},
        {key: 'processTitle', label: 'Процесс'},
        {key: 'createdDt', label: 'Дата создания'},
        {key: 'status', label: 'Состояние'},
      ],
      isOpenedSidePanel: false,
    }
  },
  computed: {
    ...mapState(['sessionList']),

    rows() {
      if (this.sessionList === null || this.sessionList.length === 0) return [];
      return this.sessionList.map(v => {
        return {
          sessionTitle: v.header.sessionTitle,
          processTitle: v.process.header.processTitle,
          createdDt: this.dtFormatCustom(v.header.createdDt),
          status: v.status,

        }
      });
    },
    leftSidePanel() {
      return (0 + this.isOpenedSidePanel ? 0 : widthSidePanel).toString();
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
    dtFormatCustom(dtISO) {
      let result = dtISO.substring(0, 19).split('');
      result[10] = '-';
      result[13] = '-';
      result[16] = '-';
      return result.join('');
    },
    allInProgressToPausedExceptThis(id) {
      this.sessionList.forEach((v) => {
        if (v.id !== id && v.status === 'inProgress') v.status = 'paused'
      })
    },
    onDoAction(action, idxs, file) {
      if (idxs !== null) {
        console.log('idxs !== null')
        this.currentIdx = idxs[0];
        this.currentID = this.sessionList[this.currentIdx].id;
      }
      switch (action) {
        case 'changeStatus': {
          let oldStatus = this.sessionList[this.currentIdx].status;
          switch (oldStatus) {
            case 'new':
            case 'paused': {
              this.onToggleSidePanel();
              this.allInProgressToPausedExceptThis(this.currentID);
              this.$router.push({name: 'PgSession', params: {id: this.currentID}});
            }
              break;
            case 'inProgress': {
              this.sessionList[this.currentIdx].status = 'paused';

            }
              break;
            default: {
            }
          }
        }
          return
        case 'remove': {
          if (this.currentIdx !== -1 && !!this.currentID) this.$store.commit('removeSessionInListByID', this.currentID);

        }
          return
        case 'changeName': {
          if (this.currentIdx !== -1 && !!this.currentID) {
            this.newSessionName = this.sessionList[this.currentIdx].header.sessionTitle;
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
          let session = this.sessionList[this.currentIdx];
          this.saveJSONFile(session, session.header.sessionTitle + ' ' + this.dtFormatCustom(session.header.changedDt));
        }
          return
        default: {
        }
      }
    },
    onOkChangeName() {
      this.$store.commit('changeSessionNameByID', {id: this.currentID, name: this.newSessionName});
    },
    onToggleSidePanel() {
      this.isOpenedSidePanel = !this.isOpenedSidePanel
    }
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

  .side-panel {
    position: fixed;
    top: 40px;
    left: -400px;
    width: auto;
    height: 80vh;
    display: flex;
    flex-flow: row nowrap;
    justify-content: start;
    align-items: center;
    gap: 3px;
    transition: all 0.5s ease;
    z-index: 10;

    &.active {
      transform: translate(400px, 0px);
    }

  }
  .toggle-side-panel {
    //position: fixed;
    //top: 300px;
    //left: 3px;
    height: 60px;
    width: 25px;
    color: black;
    background-color: hsl(84, 80%, 80%, 0.9);
    border: 1px solid hsla(0, 0%, 50%, 1);
    align-content: center;
    text-align: center;
    border-radius: 10px;
    overflow-x: hidden;
    box-shadow: 2px 2px 2px 1px hsla(0, 0%, 50%, 0.7);
    transition: all 0.3s ease;
    &:hover {
      color: black;
      background-color: hsla(84, 80%, 70%, 0.9);
      box-shadow: 1px 1px 2px 1px hsla(0, 0%, 50%, 0.7);
      transform: translate(1px, 1px);
    }
  }


  .menu-panel {
    width: 400px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    padding: 15px;
    background-color: hsla(0, 0%, 95%, 0.8);
    border-radius: 5px;
    box-shadow: 2px 2px 2px 1px hsla(0, 0%, 50%, 0.7);


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
