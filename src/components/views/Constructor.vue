-++++++++++++++++++++++++++++++++++++<template>
  <div class="Constructor">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <PpConstructor v-model:process="process" @changed="processChanged"/>

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
import {reactive} from "vue";

export default {
  name: "Constructor",
  components: {PpConstructor},
  props: [],
  data() {
    return {
      isNew: Boolean,
      process: reactive({
        header: {
          processTitle: "Новый процесс",
          version: "0.0.1",
          processCategory: ["common"],
          createdDt: (new Date()).toISOString(),
          changedDt: (new Date()).toISOString(),
          description: 'Описание',
          toSave: false,
          toAdd: false,

        },
        type: 'process',
        vars: [
          {name: '$topic', value: '',},
          {name: '$last', value: '',},
        ],
        rootNode: {
          type: 'loopList',
          attrs: {
            nodeName: {
              inpType: 'text',
              inpLabel: 'Название узла (optional)',
              value: 'root',
            },
            loopCount: {
              inpType: 'number',
              inpLabel: 'Количество циклов',
              value: 0, // ноль означает бесконечный цикл
            },
          },
          list: [],
          forKey: 'root',
        }
      }),
      debounceTime: 800,
      debounceHandle: null,

    }
  },
  computed: {
    ...mapState(['currentEditableProcess', 'currentEditableProcessIdx']),
  },
  methods: {
    processChanged() {
      this.process.header.changedDt = (new Date()).toISOString();
      clearTimeout(this.debounceHandle);
      this.debounceHandle = setTimeout(() => {
        this.$store.commit('currentEditableProcess', this.process);
      }, this.debounceTime);
    },
    onSaveInList() {
      let forSave = JSON.parse(JSON.stringify(this.process));
      if (this.currentEditableProcessIdx !== -1) {
        //изменить в списке по индексу
        this.$store.commit('changeProcessInListByIdx', {idx: this.currentEditableProcessIdx, process: forSave});
      } else {
        //добавить в список
        this.$store.commit('addProcessesInList', [forSave]);
      }
      this.$router.push({name: 'ProcessList'});
    },
  },
  mounted() {
    if (this.currentEditableProcessIdx !== -1) {
      if (!!this.currentEditableProcess) {
        this.process = this.currentEditableProcess;
      }
    }
    // if (!!this.currentEditableProcess) {
    //   this.process = this.currentEditableProcess;
    // }
  },
}
</script>

<style lang="scss">
.Constructor {
  width: 100%;
  height: auto;
  min-height: 100 dvh;

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
