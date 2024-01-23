<template>
    <div class="PpConstructor">

        <div class="pp-panel mt-4" v-if="!!currentNode">
            <div class="attr-panel">
                <div class="head">{{'Редактор атрибутов'}}</div>
               <div class="body">
                    <div class="ppcEditorInput mt-1">
                        <!--<div class="type-select">-->
                        <label for="type">Тип узла</label>
                        <select name="type" id="type"
                                v-model="currentNode.type"
                                @change="changeNodeType">
                            <option :value="item.value"
                                    v-for="item in types"
                                    :disabled="currentNode.attrs.nodeName.value==='root' && item.value==='quest'"
                            >{{item.title}}
                            </option>
                        </select>
                    </div>
                    <div v-for="(attr, i) in attrs">
                        <ppcEditorInput
                            v-model:attr="attr.val"
                            @update:attr="v=>{updateAttrs(attr.key, v)}"
                            :process="process"
                        />
                    </div>
                </div>
            </div>

            <div class="struct-panel">
                <!--<div class="head">{{'Процесс:'}} {{process.processTitle}}</div>-->
                <div class="head">
                    <span>{{'Процесс:'}}</span>
                    <input class="head-input"
                           type="text"
                           v-model="process.processTitle"
                           @change="processChanged"
                    />
                    <!--{{process.processTitle}}-->
                    <div class="pp-tabs head-tabs">
                        <div class="pp-tab" @click="activeTab=0"
                             :class="{active:activeTab===0}">
                            Структура
                        </div>
                        <div class="pp-tab" @click="activeTab=1"
                             :class="{active: activeTab===1}">
                            Переменные
                        </div>
                        <div class="pp-tab" @click="activeTab=2"
                             :class="{active: activeTab===2}">
                            Код
                        </div>
                    </div>

                </div>
                <div class="body pt-3 selected">
                    <ppcNode class="selected"     v-if="activeTab===0"
                             :node="process.rootNode"
                             :owner="process"
                             :createNodeFunc="createNewNode"
                             @selectNode="selectNode"
                             @changed="processChanged"
                             :index="0"
                             ref="rootNode"
                             :key="'root_'+process.rootNode.list.length"

                    />
                    <div class="variables-wrap"  v-else-if="activeTab===1">
                        Переменные процесса
                        <div class="var-item" v-for="(v, i) in process.vars">
                            <input class="head-input"
                                   type="text"
                                   v-model="v.name"
                                   @change="processChanged"
                            />
                            &nbsp;({{v.value}})
                        </div>
                        <div class="add-button" @click="createNewVar" >
                            <i class="ico ico-plus"></i>
                        </div>
                    </div>
                    <div class="code-wrap"  v-else>
                        <h4>Код процесса</h4>
                        <pre class="code-view">{{process}}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ppcEditorInput from "./ppcEditorInput.vue";
    import ppcNode from "./ppcNode.vue"
    import {nodeTypes} from "/src/assets/js/const.js"
    import {reactive} from "vue";

//    let vm = null;
    export default  {
        name: "PpConstructor",
        components: {ppcEditorInput, ppcNode},
        props: ['process'],
        data() {
            return {
                currentNode: null,
                currentNodeLastType: 'loopList',
                types: nodeTypes.arr,
                activeTab: 0,

            }
        },
        computed: {
            attrs() {
                return Object.keys(this.currentNode.attrs).map(key => {
                    return {key: key, val: this.currentNode.attrs[key]};
                });
            },
            // processTitle: {
            //     get() {
            //         return this.process.processTitle;
            //     },
            //     set(v) {
            //         this.$emit('input', {...this.process, processTitle: v});
            //     }
            // },
        },
        methods: {
            processChanged(){
                // console.log('ppConstructor: ppcNode changed value >>', v);
                this.$emit('changed', this.process);
            },
            updateAttrs(key, value) {
                console.log("updateAttrs::", arguments);
                this.currentNode.attrs = {...this.currentNode.attrs, [key]: value};

                this.$emit('changed', this.process);
            },
            createNewNode(type) {
              let forKey = ( ~~(Math.random()*32767)*(1<<19 - 1) % 3047777777 ).toString(16);
              return {
                    type: type,
                    attrs: this.createAttrs(type),
                    list: [],
                    forKey: forKey,
                };
            },
            changeNodeType() {
                console.log("! changeNodeType");
            },
            changeAttrs(type) {
                this.currentNode.attrs = {
                    ...createAttrs(this.currentNode.type),
                    ...this.currentNode.attrs,
                };

                this.$emit('changed', this.process);
            },
            /**
             *
             * @param type String
             */
            createAttrs(type) {
                let a = reactive({
                    nodeName: {
                        inpType: 'text',
                        inpLabel: 'Название узла (optional)',
                        value: 'new node',
                    },
                    rate: {
                        inpType: 'number',
                        inpLabel: 'Доля',
                        value: 1,
                        min: 1,
                    },
                });
                switch (type) {
                    case 'quest': {
                        // this.$set(a, 'quest', {
                        a.quest = {
                            inpType: 'text',
                            inpLabel: 'Вопрос',
                            value: '',
                        };
                        // this.$set(a, 'out', {
                        a.out = {
                            inpType: 'select',
                            inpLabel: 'Output vars',
                            value: null,
                            options: 'userVars'
                        };
                        break;
                    }
                    case 'loopList': {
                        // this.$set(a, 'loopCount', {
                        a.loopCount = {
                            inpType: 'number',
                            inpLabel: 'Количество циклов',
                            value: 0, // ноль означает бесконечный цикл
                            min: 0,
                        };
                        break;
                    }
                    case 'randList': {
                        a.loopCount = {
                            inpType: 'number',
                            inpLabel: 'Количество циклов',
                            value: 1,  // ноль означает бесконечный цикл
                        };
                        break;
                    }
                    default: {
                        alert(`PpConstructor::createAttrs::  Неизвестный тип ("${type})"`);
                    }
                }
                return a;
            },
            createNewVar(){
                this.process.vars.push({
                    name: '$newVar',
                    value: '',
                });

                this.$emit('changed', this.process);
            },
            selectNode({i, selected}) {
                this.currentNode = selected;
            },
            unselectAllChildren(){
                console.log('!! unselectAllChildren  fired !!');
                this.$refs.rootNode.unselectNode();
            },
        },
        watch: {
//            attrs
        },
        mounted() {
//            vm = this;
            console.log('process >> ',this.process);
            this.currentNode = this.process.rootNode;
            this.$el.addEventListener('unselectAllNodes', this.unselectAllChildren);
            console.log('PpConstructor::this =', this);
        },
    }
</script>

<style lang="scss">
    .PpConstructor {
        width: 100%;
        height: auto;

        input, select, textarea {
            &:focus {
                outline-color: hsl(150, 40%, 60%);
            }
        }

        .pp-panel {
            padding: 1px;
            display: flex;
            height: auto;
            min-height: 50vh;
            font-size: 13px;
            background-color: hsl(50, 30%, 98%);
            text-align: start;

            & > * {
                min-height: 100%;
                height: auto;
                padding: 0px 0px 20px;
                box-shadow: inset 0 0 2px 0 hsl(0, 0%, 80%);
                border: 1px solid hsl(50, 30%, 80%);
            }

            .head {
                width: 100%;
                height: 35px;
                display: flex;
                align-items: center;
                /*border-bottom: 1px solid grey;*/
                background-color: hsl(50, 30%, 95%);
                padding: 0 15px;
                border-bottom: 1px solid hsl(50, 30%, 75%);
                color: hsl(50, 30%, 45%);
                font-weight: bold;

                span {
                    flex: 0 0 auto;
                }

                .head-input {
                    flex: 1 1 auto;
                    height: 28px;
                    margin-left: 5px;
                    padding-left: 5px;
                    background-color: transparent;
                    border: none;

                    &:focus {
                        background-color: white;
                        border-color: hsl(50, 30%, 75%);
                    }
                }
            }

            .body {
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: column nowrap;
                /*border-bottom: 1px solid grey;*/
                padding: 0 15px;
            }

        }

        .pp-tabs {
            height: 28px;
            width: 100%;
            padding: 0px 1px;
            border-bottom: 1px solid  hsl(50, 30%, 70%);
            margin-bottom: 3px;
            display: flex;
            align-items: center;
            .pp-tab {
                width: auto;
                height: 100%;
                border: 1px solid  hsl(50, 30%, 70%);
                border-bottom-color: transparent;
                border-top-color: transparent;
                margin-right: -2px;
                display: flex;
                align-items: center;
                padding: 0 8px;
                /*background-color:  hsl(50, 40%, 98%);*/
                cursor: pointer;
                &:first-child {
                     border-left: 1px solid hsl(50, 30%, 70%);
                 }
                &:hover {
                    background-color:  hsl(150, 40%, 90%);
                }
                &.active {
                    background-color:  hsl(150, 40%, 99%);
                    color: hsl(150, 20%, 45%);
                    text-shadow: 0 0 0 hsl(150, 20%, 19%);
                    border-radius: 8px 8px 0 0 / 1px 1px 0 0;
                    z-index: 5;
                    height: calc(100% + 4px);
                    border-bottom-color: hsl(50, 40%, 98%) !important;
                }
            }
            &.head-tabs {
                order: 10;
                align-self: flex-end;
                margin-bottom: -1px;
                margin-left: auto;
                width: auto;
                .pp-tab {
                    &.active {
                        border: 1px solid hsl(50, 30%, 70%);
                        background-color: transparent;
                        background-image: linear-gradient(to bottom,
                            hsla(60, 27%, 98%, 0), hsl(60, 27%, 99%) 30%, hsl(60, 27%, 98%));
                     }
                }
             }
        }

        .attr-panel {
            flex: 0 0 auto;
            width: 190px;
            border-radius: 10px 0 0 10px;
            margin-right: 1px;

            .head {
                border-radius: 10px 0 0 0;
            }

            .body {
                padding: 0;

                .type-select {
                    height: 28px;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;

                    label {
                        display: block;
                        height: 100%;
                        width: 30px;
                        padding-left: 8px;
                        color: black;
                        line-height: 28px;
                        white-space: nowrap;
                        margin-bottom: 0;
                    }

                    select {
                        height: 28px;
                        width: calc(100% - 30px);
                        margin: 2px 0 3px 10px;
                        padding: 0 0 0 2px;
                        line-height: 28px;
                        border: 1px solid hsl(0, 0%, 90%);
                    }
                }
                .var-item {
                    height: 32px;
                    width: auto;
                    padding: 2px 10px;
                    display: flex;
                    align-items: center;
                    background-color: hsla(60, 27%, 98%, 0);
                }
            }
        }

        .struct-panel {
            flex: 1 1 auto;
            border-radius: 0 10px 10px 0;

            .head {
                border-radius: 0 10px 0 0;
            }
        }

        .add-button {
            width: 25px;
            height: 25px;
            margin: 2px auto 0 0;
            background-color: hsl(120, 10%, 70%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: white;
            border: 1px solid currentColor;
            border-radius: 50%;
            cursor: pointer;
            transform: scale3d(0.9, 0.9, .1);
            transition: all ease 0.8s;

            &:hover {
                 background-color: hsl(120, 80%, 50%);
                 transform: scale3d(1, 1, .1);
                 transition: all ease 0.1s;
            & + .add-list {
                    display: flex;
                }
            }

        }
        .delete-button {
            flex: 0 0 auto;
            order: 10;
            cursor: pointer;
            width: 18px;
            height: 18px;
            margin-top: 12px;
            border-radius: 50%;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: hsl(0, 100%, 97%);
            color: hsl(348, 33%, 67%);
            &:hover {
                 font-size: 12px;
                 /*background-color: hsl(0, 100%, 97%);*/
                 background-color: hsl(348, 70%, 57%);
                 /*color: hsl(348, 33%, 67%);*/
                color: white;
                & + .ppcNode {
                    border-color: crimson;
                    box-shadow: inset 0 0 1px 2px white, inset  0 0 250px 4px crimson;
                    & > *,  & > * > * {
                          box-shadow: inset 0 0 1px 1px white, inset  0 0 250px 3px crimson;
                      }
                }
            }
        }
    }
</style>
