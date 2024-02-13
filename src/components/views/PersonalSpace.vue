<template>
    <div class="PersonalSpace">
        <div class="menu-panel">
            <ppUserMenu class="user-menu"/>
            <ppSessionList class="session-list"
                           :rows="rows"
                           :fields="fields"
                           @doAction="onDoAction"
            />
            *
        </div>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <router-view
                        :session="currentSession"
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
import SessionPlayer from "@/components/SessionPlayer/SessionPlayer.vue";

export default {
    name: "PersonalSpace",
    components: {SessionPlayer, ppUserMenu, ppSessionList},
    props: [],
    data() {
        return {
            newSessionName: '',
            showModalName: false,
            currentIdx: null,
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
        ...mapState(['sessionList']),
        ...mapState(['isNewSession']),

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
        onDoAction(action, idxs) {
            console.log(action, idxs);
            switch (action) {
                case 'changeStatus': {
                    let newStatus = '';
                    this.currentIdx = idxs[0];
                    if (this.sessionList[this.currentIdx].status === 'paused') {
                        newStatus = 'inProgress';
                        this.currentSession = this.sessionList[idxs[0]];
                        // this.createTableKeys(this.sessionList[this.currentIdx].process);
                    }
                    if (this.sessionList[this.currentIdx].status === 'inProgress') {
                        newStatus = 'paused';
                        this.$store.commit('sessionList', this.sessionList);
                    }
                    // this.$store.commit('sessionStatus', {idx: idxs[0], status: newStatus});
                }
                    return
                case 'remove': {
                    if (idxs.length > 0) {
                        idxs.reverse().forEach(v => {
                            this.sessionList.splice(v, 1)
                        });
                        this.$store.commit('sessionList', this.sessionList);
                    }
                }
                    return
                case 'changeName': {
                    if (idxs.length > 0) {
                        this.newSessionName = this.sessionList[idxs[0]].header.sessionTitle;
                        this.currentIdx = idxs[0];
                        this.showModalName = true;
                    }
                }
                    return
                default: {
                }
            }
        },
        onOkChangeName() {
            this.sessionList[!!this.currentIdx ? this.currentIdx : 0].header.sessionTitle = this.newSessionName;
            this.$store.commit('sessionList', this.sessionList);
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
  height: 90dvh;
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
    border-right: 1px solid hsl(0, 0%, 70%);

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
