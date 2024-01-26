<template>
    <div class="ProcessList">
        <div class="container">
            <div class="row">
                <div class="col-12 mt-40">
                    <h5>ProcessList</h5>
                    <section>
                        <button class="btn button--green btn-custom"
                                @click="saves(process, file && file.name?file.name:'process', typeFile)">
                            Сохранить
                        </button>
                        <button class="btn button--green btn-custom">
                            <label class="add-item" for="id-input-file-2" style="margin-bottom: 0">
                                <input type="file" class="d-none" id="id-input-file-2"
                                       value=""
                                       :accept="'.'+typeFile"
                                       @change.prevent="loadFile($event)">
                                Загрузить
                            </label>
                        </button>
                        <div v-if="file && file.content">{{file.content}}</div>
                    </section>
                    <hr>
                    <section>
                        <div v-for="(v,k,i) in process">
                            <pre>{{i}} {{k}} {{v}}</pre>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        head: {
            title: 'PsyProcessor : Процессы'
        },
        name: "ProcessList",
        components: {},
        props: [],
        data() {
            return {
                file: null,
                typeFile: 'json',
                process: {
                    processTitle: "Новый процесс",
                    processCategory: "common",
                    type: 'process',
                    toSave: false,
                    toAdd: false,
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
                }
            }
        },
        computed: {},
        methods: {
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
                    let content = JSON.parse(reader.result);
                    this.file = {content, name: file.name};
                };
                reader.readAsText(file);
            },
        },
        mounted() {
        },
    }
</script>

<style lang="scss">
    .ProcessList {
        width: 100%;
        height: auto;

        .btn-custom {
            padding: 0.375rem 0.75rem;
            line-height: 1rem;
        }
        section {
            margin: 30px 0;
        }
    }
</style>
