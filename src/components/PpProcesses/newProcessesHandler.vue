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
            {{ scope.row.header.version ?? 'нет'}}
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

      <el-table-column label="Валидация" width="200" align="center">
        <template #default="scope">
          <button
              class="btn btn-outline-primary btn-sm"
              @click="onCheck(scope.row)"
          >
            Проверить
          </button>
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
              @click="onClickLoad(scope.row)"
            >
<!--              v-if="!isNameExist(scope.row.header.processTitle) && isLastVersion(scope.row.header.version) && !isIDExist(scope.row.id)"-->
              Загрузить
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="logs">
        {{logs}}
    </div>
    <div class="footer">
      <button
          class="btn btn-outline-primary btn-sm"
          @click="onClose()"
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
      logs: '',
      processes: null,
    }
  },
  computed: {
    ...mapState(['version']),
    ...mapGetters(['processesByID', 'processesByName']),
    ...mapMutations(['addProcessesInList']),

  },
  setup() {
    const processVersions = {
      '0.0.0': {

      },
      '0.0.1': {
        'id': {type: 'string', required: true},
        'header': {type: 'object', required: true, children: {
            'processTitle': {type: 'string', required: true},
            'version': {type: 'string', required: true},
            'processCategory': {type: 'string',required: true},
            'createdDt': {type: 'dateTime', required: true},
            'changedDt': {type: 'dateTime', required: true},
            'description': {type: 'string', required: true}}
        },
        'type': {type: 'string', required: true},
        'vars': {type: 'array', required: true, children: [

          ],
        }
      },
      '0.0.2': {
        'id': {
          default: 'function',
          required: true,
          type: 'string'
        },
        'type': {
          default: 'process',
          required: true,
          type: 'string'
        },
      },

     }
    ;
    return {
      processVersions
    }
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

    isValid(v) {

    },

    onClickLoad(v) {
      this.$store.commit('addProcessesInList', v);
    },
    checkField(v, field, type, required) {
      let isValid = true;
      let report = field + ': ';
      if (v.hasOwnProperty(field)) {
        report += ' существует; ';
        if (typeof(v[field]) === type) {
          report += typeof(v[field]) + ' тип верный; ';
          if (required && (!!v[field])) {
            report += 'значение верно.';
          } else {
            report += 'значения нет.';
            isValid = false;
          }
        } else {
          report += 'тип неверный; ';
          isValid = false;
        }
      } else {
        report += 'не существует; ';
        isValid = false;
      }
      return {isValid, report}
    },
    onCheck(v) {
      this.logs=[];
      if (!v.header.hasOwnProperty('version') && !v.hasOwnProperty('version') ) {
        this.logs='Нет поля "версия"';
        return;
      }
      if (v.header.version === '0.0.1') {
        this.logs.push(this.checkField(v, 'id', 'string', true).report);
        this.logs.push(this.checkField(v, 'header', 'object', true).report);
        this.logs.push(this.checkField(v.header, 'processTitle', 'string', true).report);
        this.logs.push(this.checkField(v.header, 'createdDt', 'string', true).report);

      }; //'0.0.1'
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
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
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
    .logs {
      width: 95%;
      height: auto;
      padding: 5px;
      margin-top: 5px;
      border: 1px solid hsl(0, 0%, 50%);
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
