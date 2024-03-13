<template>
    <div class="PersonalSpace">
        <div class="menu-panel">
            <ppUserMenu class="user-menu"/>
            <ppSessionList class="session-list"
                           :rows="rows"
                           :fields="fields"
                           @doAction="onDoAction"
            />
        </div>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <router-view
                        :sessionID = currentID
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
        }
    },
    computed: {
        ...mapState(['sessionList', 'session', 'sessionIdx', 'sessionID']),

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
        dtFormatCustom(dtISO) {
            let result = dtISO.substring(0, 19).split('');
            result[10] = '-';
            result[13] = '-';
            result[16] = '-';
            return result.join('');
        },
        allInProgressToPausedExceptThis(id) {
            this.sessionList.forEach((v)=>{if (v.id !== id && v.status === 'inProgress') v.status = 'paused'})
        },
        onDoAction(action, idxs) {
            console.log(action, idxs);
            this.currentIdx = idxs[0];
            this.currentID = this.sessionList[this.currentIdx].id;
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

  .menu-panel {
    width: 400px;
    height: 80dvh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    //border-right: 1px solid hsl(0, 0%, 70%);

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
