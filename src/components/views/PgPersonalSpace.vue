<template>
    <div class="PersonalSpace">

        <div class="side-panel" :class="{'opened': isOpenedSidePanel}"

        >
            <div class="menu-panel">
                <ppUserMenu class="user-menu"/>
                <ppSessionList class="session-list"
                               :rows="rows"
                               :fields="fields"
                               @doAction="onDoAction"
                />
            </div>

            <div class="toggle-side-panel" :class="{'opened': isOpenedSidePanel}"
                 @click.stop="onToggleSidePanel()">
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


        <div class="overlay-side-panel" :class="{'opened': isOpenedSidePanel}"
             @click.stop="onOverlaySidePanelClick"
        >

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
        },
        onOverlaySidePanelClick() {
            if (this.isOpenedSidePanel) this.onToggleSidePanel();
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

  .side-panel {
    position: fixed;
    right: 100%;
    top: 0px;
    width: auto;
    height: 100dvh;
    display: flex;
    flex-flow: row nowrap;
    justify-content: start;
    align-items: center;
    gap: 0px;
    transition: all 0.5s ease-in;
    box-shadow: 2px 0px 12px 0px hsla(0, 0%, 50%, 0.7);
    z-index: 10;

    &.opened {
      transform: translateX(100%);
    }

    .toggle-side-panel {
      position: absolute;
      left: 100%;
      top: calc(100dvh/2.5 - 30px);
      height: 60px;
      width: 25px;
      color: black;
      //background-color: hsl(84, 80%, 80%, 0.9);
      background-color: hsla(0, 0%, 95%, 0.85);
      //border: 1px solid hsla(0, 0%, 50%, 1);
      border-left: none;
      display: flex;
      align-items: center;
        justify-content: center;
      user-select: none;
      border-radius: 0 10px 10px 0px;
      overflow-x: hidden;
      box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
      transition: all 0.8s ease;
      cursor: pointer;
      z-index: 10;


      &:hover {
        color: black;
        background-color: hsla(84, 80%, 70%, 0.9);
          transition: all 0.2s ease;

      }

      &:active {
        background-color: hsla(84, 80%, 60%, 0.9);
        box-shadow: 1px 1px 2px 1px hsla(0, 0%, 50%, 0.7);
        transform: translate(1px, 1px);
      }
    }

  }


  .overlay-side-panel {
    position: fixed;
    right: 100%;
    top: 0px;
    height: 100dvh;
    width: 100%;
    z-index: 5;
    transition: all 0.8s ease-out;
    pointer-events: none;

    &.opened {
      background-color: hsla(0, 0%, 0%, 0.2);
      backdrop-filter: blur(2px);
      pointer-events: all;
        transform: translateX(100%);
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
