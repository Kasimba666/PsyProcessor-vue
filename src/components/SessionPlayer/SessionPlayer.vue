<template>
    <template v-if="!!session">
        <div class="SessionPlayer">
            <div class="main">
                <div class="history">
<!--                    История вопросов и ответов:-->
                    <div>{{ session.history }}</div>
                </div>

                <div class="quest-zone">
                    <div class="confirm" :class="{show: showConfirm}">{{ confirmHTML }}</div>
                    <div class="quest">{{ questHTML }}</div>
                </div>
                <div class="answer">
                    <b-form-textarea
                            size="sm"
                            v-model="answer"
                            placeholder="Введите ответ"
                            rows="2"
                            max-rows="10"
                    />
                    <!--                    <textarea-->
                    <!--                            v-model="answer"-->
                    <!--                            placeholder="Введите ответ"-->
                    <!--                    />-->
                </div>
                <div class="next">
                    <button class="btn btn-outline-primary btn-next btn-sm"
                            :disabled="answer===''"
                            @click="onClickNext">
                        Далее
                    </button>
                </div>
                <template v-if="!!session && session.stack[0].maxCount === 0">
                    <div class="finish">
                        <button class="btn btn-outline-primary btn-next btn-sm"
                                @click="onClickFinishCycle">
                            Завершить текущий цикл
                        </button>
                    </div>
                </template>
                <div class="finish">
                    <button class="btn btn-outline-primary btn-next btn-sm"
                            @click="onClickFinishSession">
                        Завершить сессию
                    </button>
                </div>
                <div class="pause">
                    <button class="btn btn-outline-primary btn-next btn-sm"
                            @click="onClickPauseSession">
                        Пауза
                    </button>
                </div>
                <div class="renew">
                    <button class="btn btn-outline-primary btn-next btn-sm"
                            @click="onClickRenew">
                        Подготовить новую сессию
                    </button>
                </div>
                <pre>Вопрос и ответ: {{ !!this.session ? this.session.q : '' }} </pre>
                <pre>Стек: {{ !!this.session ? this.session.stack : '' }}</pre>
                <pre>Сдвиг: {{ !!this.session ? this.session.positions : '' }}</pre>
                <pre>Переменные: {{ !!this.session ? this.session.varsByName : '' }}</pre>
            </div>
        </div>
    </template>
</template>

<script>

import {mapState} from "vuex";

export default {
    name: "SessionPlayer",
    components: {},

    data() {
        return {
            questComplete: false,
            quest: '',
            answer: '',
            showConfirm: false,
            stepCounter: 0,
            startSubstr: '{{',
            endSubstr: '}}',
        }
    },
    computed: {
        // ...mapState(['session', 'sessionFirstQuest']),
        ...mapState(['session']),
        ...mapState(['sessionFirstQuest']),
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
            return this.session.questInfo.handledQuest;
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

        onClickRenew() {
            this.session.status = 'inProgress';
            //очистить стек
            this.session.stack = [{
                key: 'root',
                type: this.session.process.rootNode.type,
                counter: -1,
                maxCount: 0,
            }];
            //очистить позиции в циклах
            if (!!this.session.positions) for (let key in this.session.positions) this.session.positions[key] = 0;
            //очистить текущее состояние вопроса и ответа
            // this.session.q = {
            //     rawQuest: 'Начало процесса',
            //     varsCurrentQuest: [],
            //     varsPreviousQuest: ['$last'],
            //     handledQuest: '',
            //     aiHandledQuest: '',
            //     dt: ''
            // },

                //очистить историю
                this.session.history = [];
            //очистить значения переменных
            for (let key in this.session.varsByName) this.session.varsByName[key] = '';
        },

        getVarsFromStr(str) {
            if (str === '') return '';
            let varName = '';
            let startPos = str.indexOf(this.startSubstr);
            let endPos = str.indexOf(this.endSubstr);
            if (startPos >= 0 && endPos > startPos) varName = str.substring(startPos + this.startSubstr.length, endPos);
            return [varName];
        },
        handleQuest() {
            let result = this.session.questInfo.rawQuest;
            for (let key in this.session.varsByName) result = result.replace(key, this.session.varsByName[key]);
            this.session.questInfo.handledQuest = result;
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
        onClickNext() {
            //обработать ответ пользователя
           if (!!this.session.questInfo.handledQuest && !!this.answer) {
              this.showConfirm = true;
              setTimeout(() => {
                this.showConfirm = false;
              }, 3000);
              this.saveHistoryItem();
            };
            this.questComplete = false;


            //положить ответ в переменные, указанные в предыдущем вопросе
            this.session.varsByName['$last'] = this.answer;
            this.session.questInfo.outVarNames.forEach((v) => this.session.varsByName[v] = this.answer);

            //очистить область ответов
            this.answer = '';

            //подготовить следущий вопрос
            let response = this.nextQuest();
            this.session.questInfo.rawQuest = response.rawQuest;
            this.handleQuest();

            //Положить дату и время формирования вопроса в q
            this.session.questInfo.questDt = new Date().toISOString();
            //положить переменные, указанные в Out, в объект q
            console.log('response.outVarNames: ', response.outVarNames);
            this.session.questInfo.outVarNames = response.outVarNames;

            //
        },
        onClickFinishCycle() {
            if (this.session.stack.length > 0) this.session.stack.shift();
        },
        onClickFinishSession() {
            this.session.stack = [];
        },

        nextQuest() {
            if (this.session.status === 'inProgress') {
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
                                    outVarNames: [varNames]
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
                                    outVarNames: [varNames]
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
            this.$store.commit('session', this.session);
            return result;
        },

    },
    mounted() {

    },
  watch: {
    session: {
      handler(v, old) {
        if (!old && !!v) this.onClickNext();
      },
      deep: true,
      immediate: true,
    },
    // sessionFirstQuest: {
    //   handler(v, old) {
    //     if (v && !old) {
    //       this.onClickNext();
    //       this.$store.commit('sessionFirstQuest', false);
    //     };
    //   },
    //   deep: false,
    //   immediate: true,
    // }
  },
}
</script>

<style lang="scss">
/****  SessionPlayer  ****/
.SessionPlayer {
  width: 100%;
  height: auto;
  font-size: 13px;

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
      border: 1px solid gray;
    }
    .quest-zone {
      .confirm {
        display: none;
        &.show {
          display: block;
        }
      }
      .quest {
        width: 100%;
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
      //text-align: center;
      padding: 5px;

      &.disabled {
        display: none;
      }
    }

    .finish, .pause, .renew, .quest-zone {
      width: 100%;
      border: 1px solid gray;
      text-align: center;
      padding: 5px;
    }


  }

  .btn-next {
    height: auto;

    width: 100%;
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
