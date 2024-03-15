<template>
    <div class="SessionPlayer">
        <div class="main">
            <div class="history">
                <div
                        v-for="(v, i) in session.history"
                        :key="i"
                >
                    {{ session.history[i].handledQuest }} - {{ session.history[i].answer }}
                </div>
            </div>

            <div class="quest-zone">
                <div class="confirm" :class="{show: showConfirm}">{{ confirmHTML }}</div>
                <div class="quest" v-html="questHTML"/>
            </div>
            <div class="answer">
                <textarea
                        class="w-100"
                        v-model="answer"
                        placeholder="Введите ответ"
                        @keyup.enter="onClickNext()"
                />
            </div>
            <div class="next">
              <button class="btn btn-outline-primary btn-next btn-sm"
                      @click="onClickPauseSession">
                Пауза
              </button>
              <button class="btn btn-outline-primary btn-next btn-sm"
                        :disabled="answer===''"
                        @click="onClickNext()">
                    Далее
                </button>

            </div>
            <div class="finish">
                <button
                        v-if="!!session && session.stack.length > 0 && session.stack[0].maxCount === 0"
                        class="btn btn-outline-primary btn-next btn-sm"
                        @click="onClickFinishCycle">
                    Завершить текущий цикл
                </button>
                <button class="btn btn-outline-primary btn-next btn-sm"
                        @click="onClickFinishSession">
                    Завершить сессию
                </button>
            </div>
            <!--{{!!session ? session : ''}}-->
            <!--{{!!sessionID ? sessionID : ''}}-->

            <pre>Вопрос и ответ: {{ !!this.session ? this.session.questInfo : '' }} </pre>
            <!--            <pre>Стек: {{ !!this.session ? this.session.stack : '' }}</pre>-->
            <!--            <pre>Сдвиг: {{ !!this.session ? this.session.positions : '' }}</pre>-->
            <!--            <pre>Переменные: {{ !!this.session ? this.session.varsByName : '' }}</pre>-->
        </div>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";

const startSubstr = '{{';
const endSubstr = '}}';
export default {
    name: "SessionPlayer",
    components: {},
    props: ['sessionID'],

    data() {
        return {
            questComplete: false,
            answer: '',
            showConfirm: false,

        }
    },
    computed: {
        ...mapGetters(['sessionsByID']),
        session() {
            return this.sessionsByID[this.sessionID];
            // return this.$store.getters.sessionsByID[this.sessionID];
        },

        mapKeyNodes() {
            if (this.session === null) return null;
            let result = {};
            const getNode = (node) => {
                result[node.forKey] = node;
                if (node.list.length > 0) node.list.forEach((v) => {
                    getNode(v)
                });
            }
            getNode(this.session.process.rootNode);
            return result;
        },
        questHTML() {
            let result = this.session.questInfo.handledQuest
                .replaceAll(startSubstr, '<span class="inserted-text">')
                .replaceAll(endSubstr, '</span>');


            return result;
        },
        confirmHTML() {
            return 'Ок, отлично!'
        }
    },
    methods: {
        getRandomElementWithProbabilities(probabilitiesArray) {
            const totalProbability = probabilitiesArray.reduce((accumulator, probability) => accumulator + parseFloat(probability), 0); // Суммируем вероятности

            if (totalProbability !== 1) throw new Error("Total probability must be equal to 1"); // Проверяем корректность данных

            let randomNumber = Math.random() * totalProbability; // Генерируем случайное число от 0 до общих вероятностей
            let cumulativeProbability = 0;

            for (let i = 0; i < probabilitiesArray.length; ++i) {
                cumulativeProbability += parseFloat(probabilitiesArray[i]);

                if (cumulativeProbability >= randomNumber) return i; // Возвращаем индекс первого элемента с превышением случайной величины
            }
        },

        handleQuest() {
            let response = this.nextQuest();

            this.session.questInfo.rawQuest = response.rawQuest;

            let result = this.session.questInfo.rawQuest;
            for (let key in this.session.varsByName) result = result.replace(key, this.session.varsByName[key]);
            this.session.questInfo.handledQuest = result;
            //Положить дату и время формирования вопроса в qshowConfirmation
            this.session.questInfo.questDt = new Date().toISOString();
            //положить переменные, указанные в Out, в объект q
            this.session.questInfo.outVarNames = response.outVarNames;

        },
        saveHistoryItem() {
            this.session.history.push({
                // rawQuest: '',
                handledQuest: this.session.questInfo.handledQuest,
                answer: this.answer,
                questDt: this.session.questInfo.questDt,
                answerDt: new Date().toISOString(),
                diffDt: 0,
                outVarNames: this.session.questInfo.outVarNames,
            });
        },
        showConfirmation() {
            this.showConfirm = true;
            setTimeout(() => {
                this.showConfirm = false;
            }, 3000);
        },

        setCurrSessionInList() {
            this.$store.commit('changeSessionInListByID', {id: this.sessionID, session: this.session});
        },

        onClickNext(newSession = false, incrementCursor = true) {
            console.log('newSession', newSession);
            if (!newSession) {
                //обработать ответ пользователя
                this.answer = this.answer.trim();

                if (!this.session.questInfo.handledQuest || !this.answer) {
                    return;
                }
                this.showConfirmation();
                this.questComplete = false;

                //положить ответ в переменные, указанные в предыдущем вопросе
                this.session.varsByName['$last'] = this.answer;
                this.session.questInfo.outVarNames.forEach((v) => {
                        if (!!v) this.session.varsByName[v] = this.answer
                    }
                );

                this.saveHistoryItem();

                //очистить область ответов
                this.answer = '';
            }
            //подготовить следущий вопрос
            this.handleQuest();

            this.questComplete = true;
            //сохранить текущую сессию в общем списке
            this.setCurrSessionInList();
            // this.$store.commit('answer', '');

        },
        onClickFinishCycle() {
            if (this.session.stack.length > 0) this.session.stack.shift();
        },
        onClickPauseSession() {
            this.session.status = 'paused';
            this.setCurrSessionInList();
        },
        onClickFinishSession() {
            this.session.stack = [];
            this.session.status = 'finished';
            this.setCurrSessionInList();
        },

        nextQuest() {
            if (true || this.session.status === 'inProgress') {
                let response = {};
                do
                    response = this.nextElement();
                while (response.rawQuest === '');
                return response;
            }
        },
        nextElement() {
            if (this.session.stack.length === 0) return {rawQuest: 'Стек пуст'}

            let result = {rawQuest: ''};
            let curr = this.session.stack[0];

            curr.counter++;

            let childrenAmount = this.mapKeyNodes[curr.key].list.length;
            let shift = (curr.type === 'loopList' && curr.maxCount > 0) ? this.session.positions[curr.key] : 0;
            if (curr.counter < curr.maxCount || curr.maxCount === 0) {
                let typeChild = this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].type;
                switch (typeChild) {
                    case 'quest': {
                        switch (curr.type) {
                            case 'loopList': {
                                //проверить, надо ли сохранять ответ в переменной, если да, то послать имя переменной
                                let varNames = [];
                                if (this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.out.value !== null && this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.out.value !== '') {
                                    varNames = [this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.out.value]
                                }
                                result = {
                                    rawQuest: this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.quest.value,
                                    outVarNames: varNames
                                };
                            }
                                break;
                            case 'randList': {
                                let sumRates = this.mapKeyNodes[curr.key].list.reduce((s, v) => {
                                    return s += v.attrs.rate.value
                                }, 0);
                                let arrProbs = this.mapKeyNodes[curr.key].list.map((v) => {
                                    return v.attrs.rate.value / sumRates
                                });
                                let probIdx = this.getRandomElementWithProbabilities(arrProbs);
                                //проверить, надо ли сохранять ответ в переменной, если да, то послать имя переменной
                                let varNames = [];
                                if (this.mapKeyNodes[curr.key].list[probIdx].attrs.out.value !== null && this.mapKeyNodes[curr.key].list[probIdx].attrs.out.value !== '') {
                                    varNames = [this.mapKeyNodes[curr.key].list[probIdx].attrs.out.value]
                                }
                                result = {
                                    rawQuest: this.mapKeyNodes[curr.key].list[probIdx].attrs.quest.value,
                                    outVarNames: varNames
                                };
                            }
                                break;
                            default: {
                            }
                        }
                    }
                        break;
                    case 'randList':
                    case 'loopList': {
                        let childrenOfChildAmount = this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].list.length;
                        if (childrenOfChildAmount > 0) {
                            let maxCount = this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.loopCount.value;
                            this.session.stack.unshift({
                                key: this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].forKey,
                                type: typeChild,
                                counter: -1,
                                maxCount: maxCount,
                            });
                        }
                    }
                        break;
                    default: {
                    }
                }
            } else {
                if (this.session.stack.length > 0) {
                    if (curr.type === 'loopList' && curr.maxCount > 0) {
                        this.session.positions[curr.key] = (this.session.positions[curr.key] + curr.maxCount) % childrenAmount;
                    }
                    this.session.stack.shift();
                }
                if (this.session.stack.length === 0) {
                    this.session.status = 'finished';
                    result = {rawQuest: 'Сказочке конец'}
                }
            }
            return result;
        },

    },
    mounted() {
        console.log('mounted');
        if (this.session.status === 'new') {
            this.onClickNext(true);
            this.session.status = 'inProgress';
        }
        if (this.session.status === 'paused') {
            this.session.status = 'inProgress';
        }

    },
    // watch: {
    //     sessionFirstQuest: {
    //         handler(v) {
    //             if (v) {
    //
    //             }
    //         },
    //         deep: false,
    //         immediate: true,
    //     }
    // },
}
</script>

<style lang="scss">
/****  SessionPlayer  ****/
.SessionPlayer {
  width: 100%;
  height: auto;
  font-size: 13px;

  .inserted-text {
    color: hsl(199, 94%, 20%);
    text-shadow: 0 0 hsl(199, 94%, 20%);

  }

  .main {
    width: 500px;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    gap: 5px;

    .history {
      width: 100%;
      height: 200px;
      padding: 5px;
      border: 1px solid gray;
      overflow: scroll;
    }

    .quest-zone {
      width: 100%;
      border: 1px solid gray;
      display: flex;
      flex-flow: column nowrap;
      justify-content: start;
      align-items: start;
      gap: 5px;
      padding: 5px;

      .confirm {
        width: 100%;
        padding: 5px;
        border: 1px solid gray;
        display: none;

        &.show {
          display: block;
        }
      }

      .quest {
        width: 100%;
        padding: 5px;
        border: 1px solid gray;
      }

    }

    .answer {
      width: 100%;
      height: auto;
      border: 1px solid gray;
      padding: 5px;
    }


    .next {
      display: block;
      width: 100%;
      border: 1px solid gray;
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 10px;
      padding: 5px;
      margin-top: 20px;

      &.disabled {
        display: none;
      }
    }

    .finish {
      width: 100%;
      border: 1px solid gray;
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 10px;
      padding: 5px;
    }
  }

  .btn-next {
    height: auto;
    width: 200px;
    color: black;
    background-color: transparent;
    border: 1px solid hsl(50, 30%, 75%);

    &:hover {
      color: black;
      background-color: hsl(52, 29%, 90%);
    }
  }
}
</style>
