<template>
  <div class="Constructor">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <PpConstructor
              v-model:process="currentEditableProcess"
              @changed="processChanged"
              :key="currentEditableProcess.id"
          />
        </div>
        <div class="files-control">
          <button class="btn btn-outline-primary btn-next btn-sm"
                  @click="onSaveInList">
            Сохранить в списке
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PpConstructor from "@/components/PpConstructor/PpConstructor.vue";
import {mapState} from "vuex";
import {v4} from "uuid";
let generateID = () => {
    return v4();
};
export default {
  name: "PgConstructor",
  components: {PpConstructor},
  props: [],
  data() {
    return {

      debounceTime: 800,
      debounceHandle: null,
    }
  },

  computed: {
    ...mapState(['currentEditableProcess', 'currentEditableProcessID', 'isNewProcess']),
      routeConstructor() {
        return this.$route.params.id;
      },
  },
  methods: {
    processChanged() {
      this.currentEditableProcess.header.changedDt = (new Date()).toISOString();
      clearTimeout(this.debounceHandle);
      this.debounceHandle = setTimeout(() => {
        this.$store.commit('currentEditableProcess', this.currentEditableProcess);
      }, this.debounceTime);
    },
    onSaveInList() {
      let forSave = JSON.parse(JSON.stringify(this.currentEditableProcess));
      if (!this.isNewProcess) {
        this.$store.commit('changeProcessInListByID', {id: this.currentEditableProcessID, process: forSave});
      } else {
        this.$store.commit('addProcessesInList', [forSave]);
        //убрать флаг нового процесса
        this.$store.commit('isNewProcess', false);
      };

      this.$router.push({name: 'PgProcessList'});
    },
  },
  mounted() {

  },
  watch: {
      routeConstructor: {
          handler(v, old) {
              console.log('Сработал вотчер', v);
              // if (v === 'new') console.log('Новый процесс');
              // if (v !== null && v !== old) {
              //     console.log('Проверка процесса на существование');
              //     console.log('Загрузка процесса для редактирования:', v);
              //     // this.currentEditableProcess = this.currentEditableProcess;
              // }
          }
      }
  },
}
</script>

<style lang="scss">
.Constructor {
  width: 100%;
  height: auto;
  min-height: 100dvh;

  .files-control {
    width: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    gap: 10px;
    padding: 5px;
    margin: 10px;

    .btn-next {
      color: black;
      border: 1px solid hsl(50, 30%, 75%);

      &:hover {
        background-color: hsl(52, 29%, 90%);
      }
    }
  }
}
</style>

"
*
