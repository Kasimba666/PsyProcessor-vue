<template>
    <template v-if="!!session">
        <div class="SessionPlayer">
            <div class="main">
                <div class="history">
                    История вопросов и ответов:
                    <pre>{{ session.history }} </pre>
                </div>

                <div class="quest-zone">
                    <div class="confirm" :class="{show: showConfirm}">{{ confirmHTML }}</div>
                    <div class="quest">{{ questHTML }}</div>
                </div>
                <div class="answer">
                    <b-form-textarea
                            v-model="answer"
                            placeholder="Введите ответ"
                            rows="2"
                            max-rows="10"
                    />
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
                <pre> {{ !!this.session ? this.session.stack : '' }}</pre>
                <pre>Сдвиг: {{ !!this.session ? this.session.positions : '' }}</pre>
                <pre>Переменные: {{ !!this.session ? this.session.vars : '' }}</pre>
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
            quest: '',
            answer: '',
            showConfirm: false,
            stepCounter: 0,
            startSubstr: '{{$',
            endSubstr: '}}',
        }
    },
    computed: {
        ...mapState(['session']),
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
            return this.session.q.handledQuest;
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
            this.session.stack = [{
                key: 'root',
                type: this.session.process.rootNode.type,
                counter: -1,
                maxCount: 0,
            }];
            if (!!this.session.positions) for (let key in this.session.positions) this.session.positions[key] = 0;
        },

        getVarsFromStr(str) {
            let varName = '';
            let startPos = str.indexOf(this.startSubstr);
            let endPos = str.indexOf(this.endSubstr);
            if (startPos >= 0 && endPos > startPos) varName = rawQuest.substring(startPos + this.startSubstr.length, endPos);
            return varName;
        },
        getQuestWithVarValues(str, vars) {
            let result = str;
            for (let key in vars) result = result.replace(key, vars[key]);
            return result;
        },
        onClickNext() {
            //обработать ответ пользователя

            //вывести подтверждение
            this.showConfirm = true;
            setTimeout(() => {
                this.showConfirm = false;
            }, 3000);

            //поместить вопрос и ответ в Историю
            this.session.history.push({q: this.session.q.handledQuest, dtQ: this.session.q.dt, a: this.answer, dtA: new Date().toISOString()});

            //положить ответ в переменные, указанные в предыдущем вопросе
            for (let key in this.session.q.vars) this.session.vars[key] =  this.answer;

            //очистить область ответов
            this.answer = '';

            //подготовить следущий вопрос
            this.session.q.rawQuest = this.nextQuest().q;

            //вытащить имена переменных из текста вопроса
            let varNames = this.getVarsFromStr(this.session.q.rawQuest);
            console.log(varNames);


            //подставить значение переменной в вопрос
            this.quest = rawQuest;

            //



            //задать вопрос
            //положить ответы в переменные, указанные  Out
            //
        },
        onClickFinishCycle() {
            if (this.session.stack.length > 0) this.session.stack.shift();
        },
        onClickFinishSession() {
            this.session.stack = [];
        },
        saveHistoryItem() {

        },

        nextQuest() {
            if (this.session.status === 'inProgress') {
                let response = {};
                do
                    response = this.nextElement();
                while (response.q === '');

                return response.q;
            }
        },
        nextElement() {
            if (this.session.stack.length === 0) return {q: 'Стек пуст'}

            let result = {q: ''};
            let curr = this.session.stack[0];

            curr.counter += 1;

            let childrenAmount = this.mapKeyNodes[curr.key].list.length;
            let shift = (curr.type === 'loopList' && curr.maxCount > 0) ? this.session.positions[curr.key] : 0;
            if (curr.counter < curr.maxCount || curr.maxCount === 0) {
                let typeChild = this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].type;
                switch (typeChild) {
                    case 'quest': {
                        switch (curr.type) {
                            case 'loopList': {
                                result = {
                                    q: this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.quest.value,
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
                                let varName = this.mapKeyNodes[curr.key].list[probIdx].attrs.out.value !== '';
                                result = {
                                    q: this.mapKeyNodes[curr.key].list[probIdx].attrs.quest.value, varName: varName
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
                    result = {q: 'Сказочке конец'}
                }
            }
            this.$store.commit('session', this.session);
            return result;
        },

    },
    mounted() {

    },
}
</script>

<style lang="scss">
/****  SessionPlayer  ****/
.SessionPlayer {
  width: 100%;
  height: auto;

  .main {
    width: 500px;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: center;
    gap: 5px;

    .history {
      width: 100%;
      border: 1px solid gray;
      text-align: center;
    }

    .quest {
      width: 100%;
      border: 1px solid gray;
      text-align: center;
    }

    .answer {
      width: 100%;
      height: auto;
      border: 1px solid gray;
      text-align: center;
      padding: 5px;
    }

    .next {
      display: block;
      width: 100%;
      border: 1px solid gray;
      text-align: center;
      padding: 5px;

      &.disabled {
        display: none;
      }
    }

    .finish, .pause, .renew {
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
