<template>
  <div class="Constructor">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <PpConstructor v-model:process="process" @changed="processChanged"/>

        </div>
        <div class="btn-files-control">
          <button class="btn btn-outline-primary btn-custom btn-sm"
                  @click="saves(process, process.processTitle + ' ' + process.changedDt, typeFile)">
            Сохранить
          </button>
          <button class="btn btn-outline-primary btn-custom btn-sm">
            <label class="add-item" for="id-input-file-2" style="margin-bottom: 0">
              <input type="file" class="d-none" id="id-input-file-2"
                     value=""
                     :accept="'.'+typeFile"
                     @change.prevent="loadFile($event)">
              Загрузить
            </label>
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
      file: null,
      jsonObj: '',
      content: '',
      typeFile: 'json',
      process: reactive({
        processTitle: "Новый процесс",
        processCategory: "common",
        type: 'process',
        createdDt: (new Date()).toISOString(),
        changedDt: (new Date()).toISOString(),
        descripton: '',
        toSave: false,
        toAdd: false,
        vars: [
          {name: '$topic', value: '',},
          {name: '$last', value: [null],},
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
        }
      }),
      debounceTime: 800,
      debounceHandle: null,

    }
  },
  computed: {
    ...mapState(['currentEditableProcess']),
  },
  methods: {
    processChanged(newValue) {
      this.process.changedDt = (new Date()).toISOString();
      if (this.debounceHandle) {
        clearTimeout(this.debounceHandle);
      }
      this.debounceHandle = setTimeout(() => {
        this.$store.commit('currentEditableProcess', newValue);
        this.debounceHandle = null;
      }, this.debounceTime);
    },
    saves(dataJS, filename, type) {
      let data = JSON.stringify(dataJS);
      let file = new Blob([data], {type: 'application/' + type});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    },
    loadFile(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        try {
          this.process = JSON.parse(reader.result);
        } catch {
          alert('Ошибка загрузки файла')
        }
      };
      reader.readAsText(file);
      this.processChanged(this.process);
    },
  },
  mounted() {
    if (!!this.currentEditableProcess) {
      this.process = this.currentEditableProcess;
    }
  },
}
</script>

<style lang="scss">
.Constructor {
  width: 100%;
  height: auto;
  min-height: 100 dvh;
  .btn-files-control {
    width: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    gap: 10px;
    padding: 5px;
    margin: 10px;
    .btn-custom {
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
