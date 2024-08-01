<template>
  <div class="newProcessesHandler">

    <el-table
        v-if="!!processes"
        :data="processes"
        border
        style="width: 100%"
    >
      <el-table-column prop="header.processTitle" label="Имя" width="200" />
      <el-table-column prop="status" label="Статус" width="60" />
      <el-table-column label="Версия" width="60">
        <template #default="scope">
          <div :class="{'notLastVersion': !isLastVersion(scope.row.header.version)}">
            {{ scope.row.header.version }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="200">
        <template #default="scope">
          <div :class="{'notUniqueID': isIDExist(scope.row.id)}">
            {{ scope.row.id }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Обработка"  width="200"/>
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
import {mapGetters, mapState} from "vuex";

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
    ...mapGetters(['processesByID']),

  },

  methods: {
    isIDExist(v) {
      return !!this.processesByID[v];
    },
    isLastVersion(v) {
      return v === this.version;
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
