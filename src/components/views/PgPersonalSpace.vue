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

        <div class="markers-panel">
            <div
                    class="marker"
                    :class="{
                'in-progress': session.status === 'inProgress',
                'active': session.id === currentID,
                'stacked': markersStacked
            }"
                    :style="{top: markersStacked ? idx*40+'px': 0, zIndex: 1000-idx}"
                    v-for="(session, idx) in sessionList"
                    @click="onMarker(session)"
                    v-b-tooltip.hover.leftbottom=session.header.sessionTitle

            >
                {{ dtFormatCustom(session.header.changedDt) }}
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
import ppSidePanel from "@/components/Common/ppSidePanel.vue";
import {mapState} from "vuex";
import SessionPlayer from "@/components/SessionPlayer/ppSessionPlayer.vue";

export default {
    name: "PgPersonalSpace",
    components: {SessionPlayer, ppUserMenu, ppSessionList, ppSidePanel},
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
        markersStacked() {
            return true;
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
            result[10] = ' ';
            result[13] = ':';
            result[16] = ':';
            return result.join('');
        },
        allInProgressToPausedExceptThis(id) {
            this.sessionList.forEach((v) => {
                if (v.id !== id && v.status === 'inProgress') v.status = 'paused'
            })
        },
        onDoAction(action, idxs, file) {
            if (idxs !== null) {
                this.currentIdx = idxs[0];
                this.currentID = this.sessionList[this.currentIdx].id;
                console.log('idxs = ', idxs, 'currentID = ', this.currentID);
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
        onMarker(v) {
            // console.log('currentID ', this.currentID);
            // console.log('v.id ', v.id);
            if (v.id !== this.currentID) {
                if (!!this.currentID) this.$store.commit('changeSessionStatusByID', {
                    id: this.currentID,
                    status: 'paused'
                });
                v.status = 'inProgress';
                this.$router.push({name: 'PgSession', params: {id: v.id}});
                this.currentID = v.id;
            }


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

  .markers-panel {
    position: fixed;
    top: var(--header-height);
    left: 0px;
    width: 100%;
    height: 30px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 10px;
    flex: 1 1 auto;


    .marker {
      position: relative;
      font-size: 10px;
      height: auto;
      width: auto;
      color: black;
      background-color: hsla(58, 80%, 80%, 0.9);
      border-top: none;
      padding: 3px;
      user-select: none;
      border-radius: 0 0px 0px 10px;
      box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
      transition: all 0.4s ease;
      cursor: pointer;
      flex-shrink: 0;
      z-index: 10;

      &.in-progress {
        background-color: hsla(84, 80%, 80%, 0.9);
      }

      &:hover {
        color: black;
        //background-color: hsla(44, 80%, 70%, 0.9);
        transition: all 0.2s ease;
      }

      &:active {
        box-shadow: 1px 0px 12px 0px hsla(0, 0%, 50%, 0.7);
        transform: translate(1px, 1px);
      }

      &.active {
        border: 1px solid gray;
        border-top: none;
        //box-shadow: 2px 1px 12px 0px hsla(60, 80%, 40%, 0.7);
      }

      &.stacked {
        position: absolute;
        right: 0px;

      }
    }
  }

}
</style>
