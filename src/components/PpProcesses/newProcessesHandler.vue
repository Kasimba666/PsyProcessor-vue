<template>
  <div class="newProcessesHandler">

    <el-table
        v-if="!!processes"
        :data="processes"
        border
        style="width: 100%"
    >
      <el-table-column label="Имя" width="200" align="center">
        <template #default="scope">
          <div :class="{'notUniqueName': isNameExist(scope.row.header.processTitle)}">
            {{ scope.row.header.processTitle }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Версия" width="80" align="center">
        <template #default="scope">
          <div :class="{'notLastVersion': !isLastVersion(scope.row.header.version)}">
            {{ scope.row.header.version }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="200" align="center">
        <template #default="scope">
          <div :class="{'notUniqueID': isIDExist(scope.row.id)}">
            {{ scope.row.id }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Обработка" align="center">
        <template #default="scope">
          <div class="row-controls">
            <el-button v-if="isNameExist(scope.row.header.processTitle)">
              Переименовать
            </el-button>
            <el-button v-if="!isLastVersion(scope.row.header.version)">
              Обновить версию
            </el-button>
            <el-button v-if="isIDExist(scope.row.id)">
              Изменить ID
            </el-button>
            <el-button
              v-if="!isNameExist(scope.row.header.processTitle) && isLastVersion(scope.row.header.version) && !isIDExist(scope.row.id)"
              @click="onClickLoad(scope.row)"
            >
              Загрузить
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <button
          class="btn btn-outline-primary btn-sm"
          @click="onClose"
      >
        Закрыть
      </button>
    </div>

  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: 'newProcessesHandler',
  components: {},
  props: ['newProcesses', 'visibleNewProcesses'],
  emits: ['update:visibleNewProcesses'],
  data() {
    return {
      processes: null,
    }
  },
  computed: {
    ...mapState(['version']),
    ...mapGetters(['processesByID', 'processesByName']),
    ...mapMutations(['addProcessesInList']),

  },

  methods: {
    isIDExist(v) {
      return !!this.processesByID[v];
    },
    isNameExist(v) {
      return !!this.processesByName[v];
    },
    isLastVersion(v) {
      return v === this.version;
    },
    onClickLoad(v) {
      this.$store.commit('addProcessesInList', v);
    },

    onClose() {

      this.$emit('update:visibleNewProcesses', false);
    }

  },
  mounted() {
    this.processes = this.newProcesses;
  },
}
</script>

<style lang="scss">
  .newProcessesHandler {
    position: fixed;
    top: 10%;
    left: 10%;
    width: 80%;
    height: auto;
    border: 1px solid blue;
    background-color: white;
    overflow: auto;
    .notLastVersion {
      background-color: hsl(0, 61%, 86%);
    }
    .notUniqueID {
      background-color: hsl(0, 61%, 86%);
    }
    .notUniqueName {
      background-color: hsl(0, 61%, 86%);
    }
    .row-controls {
      display: flex;
      justify-content: start;
      align-items: center;
    }
    .footer {
     width: 100%;
     height: 40px;
     display: flex;
     flex-flow: row;
     justify-content: center;
     align-items: center;
    }
  }
</style>
