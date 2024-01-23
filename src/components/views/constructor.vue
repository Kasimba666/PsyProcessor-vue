<template>
    <div class="Constructor">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <PpConstructor v-model:process="process" @changed="processChanged"/>

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
            if (this.debounceHandle) {
                clearTimeout(this.debounceHandle);
            }
            this.debounceHandle = setTimeout(() => {
                this.$store.commit('currentEditableProcess', newValue);
                this.debounceHandle = null;
            }, this.debounceTime);
        },
        createNewProcess() {

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
  min-height: 100dvh;
}
</style>

"
