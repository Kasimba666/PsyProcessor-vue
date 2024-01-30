<template>
    <div class="Constructor">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <PpConstructor v-model:process="process" @changed="processChanged"/>

                </div>
                <div class="files-control">
                    <button class="btn btn-outline-primary btn-custom btn-sm"
                            @click="saveJSONFile(process, process.processTitle + ' ' + dateTime(process.changedDt))">
                        Выгрузить
                    </button>
                    <button class="btn btn-outline-primary btn-custom btn-sm">
                        <label class="add-item" for="id-input-file-2" style="margin-bottom: 0">
                            <input type="file" class="d-none" id="id-input-file-2"
                                   value=""
                                   :accept="'.'+'json'"
                                   @change.prevent="loadJSONFile($event)">
                            Загрузить
                        </label>
                    </button>
                  <button class="btn btn-outline-primary btn-custom btn-sm"
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

            process: reactive({
                processTitle: "Новый процесс",
                version: "0.0.1",
                processCategory: ["common"],
                type: 'process',
                createdDt: (new Date()).toISOString(),
                changedDt: (new Date()).toISOString(),
                descripton: 'Описание',
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
            clearTimeout(this.debounceHandle);
            this.debounceHandle = setTimeout(() => {
                this.$store.commit('currentEditableProcess', newValue);
            }, this.debounceTime);
        },
      onSaveInList(){

      },
        dateTime(dtISO) {
            let result = dtISO.substring(0, 20).split('');
            result[10] = '-';
            result[13] = '-';
            result[16] = '-';
            result[19] = '-';
            return result.join('');
        }
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
  min-height: 100dvh;

  .files-control {
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
