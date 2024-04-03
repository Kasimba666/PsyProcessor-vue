<template>
    <div class="PersonalSpace">

        <div class="side-panel">
            <div class="menu-panel" :class="{'active': isOpenedSidePanel}">
                <ppUserMenu class="user-menu"/>
                <ppSessionList class="session-list"
                               :rows="rows"
                               :fields="fields"
                               @doAction="onDoAction"
                />
            </div>
            <button class="btn-toggle-side-panel"
                    @click="isOpenedSidePanel=!isOpenedSidePanel">
                <i
                v-if="isOpenedSidePanel"
                class="ico ico-circle-right"
                ></i>
                <i
                v-else
                class="ico  ico-circle-left"
                ></i>
<!--                {{isOpenedSidePanel ? '<<' : '>>'}}-->
            </button>
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
      left: 0px;
      width: auto;
      height: 600px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: start;
      align-items: center;

      z-index: 10;

  }
    .btn-toggle-side-panel {
        height: auto;
        width: 30px;
        color: black;
        background-color: hsla(0, 100%, 50%, 80%);
        border: 1px solid hsl(50, 30%, 75%);

        &:hover {
            color: black;
            background-color: hsl(52, 29%, 90%);
        }
    }
  .menu-panel {
    width: 400px;
    height: 100%;
    display: none;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    padding: 15px;
    transition: all 0.5s ease;
    background-color: hsla(60, 100%, 80%, 0.9);
    &.active {
        display: flex;
    }

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
