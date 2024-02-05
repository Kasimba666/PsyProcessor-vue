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
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ppSessionList from "@/components/PpUserSpace/ppSessionList.vue";
import {mapState} from "vuex";
import ppUserMenu from "@/components/PpUserSpace/ppUserMenu.vue";

export default {
  name: "PersonalSpace",
  components: {ppUserMenu, ppSessionList},
  props: [],
  data() {
    return {
        fields: [
            {key: 'sessionTitle', label: 'Наименование'},
            {key: 'createdDt', label: 'Дата создания'},
            {key: 'status', label: 'Статус'},

            // {key: 'changedDt', label: 'Дата изменения'},
            // {key: 'description', label: 'Описание'},

        ],
    }
  },
  computed: {
    ...mapState(['sessionList']),
      rows() {
          if (this.sessionList === null || this.sessionList.length === 0) return [];
          return this.sessionList.map(v => {
              return {
                  sessionTitle: v.header.sessionTitle,
                  createdDt: this.dtFormatCustom(v.header.createdDt),
                  status: v.status,
                  // changedDt: this.dtFormatCustom(v.header.changedDt),
                  // description: v.header.description,
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
      onDoAction() {

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
  min-height: 80dvh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: start;

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
