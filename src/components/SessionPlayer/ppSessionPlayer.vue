<template>
  <div class="SessionPlayer">
    <div class="sp-main">
      <div class="history" ref="history">
        <div
            class="history-item"
            v-for="(v, i) in session.history"
            :key="i"
            v-html="v.handledQuest +' : '+ v.answer"
        >
        </div>
      </div>

      <div class="quest-zone mt-3">
        <div class="confirm" :class="{show: showConfirm}">{{ confirmHTML }}</div>
        <div class="quest" v-html="questHTML" @dblclick="onClickQuest"/>
      </div>
      <div class="answer mt-2">
                <textarea
                    class="w-100"
                    v-model="answer"
                    placeholder="Введите ответ"
                    @keyup.enter="onClickNext()"
                />
      </div>
      <div class="next">
        <button class="btn btn-outline-primary btn-control btn-sm"
                @click="onPauseSession">
          Пауза
        </button>
        <button class="btn btn-outline-primary btn-control btn-sm"
                :disabled="answer===''"
                @click="onClickNext()">
          Далее
        </button>

      </div>
      <div class="finish">
        <button
            v-if="!!session && session.stack.length > 0 && session.stack[0].maxCount === 0"
            class="btn btn-outline-primary btn-control btn-sm"
            @click="onFinishCycle">
          Завершить текущий цикл
        </button>
        <button class="btn btn-outline-primary btn-control btn-sm"
                @click="onFinishSession">
          Завершить сессию
        </button>
      </div>

      <button
          class="btn btn-outline-primary btn-continue btn-sm"
          :class="{'show': session.status === 'paused'}"
          @click="onContinueSession"
      >
        Продолжить
      </button>
<!--      <pre>Вопрос и ответ: {{ !!session ? session.questInfo : '' }} </pre>-->
<!--      <pre>Стек: {{ !!this.session ? this.session.stack : '' }}</pre>-->
<!--      <pre>Сдвиг: {{ !!this.session ? this.session.positions : '' }}</pre>-->
<!--      <pre>Переменные: {{ !!this.session ? this.session.varsByName : '' }}</pre>-->
    </div>
    <div
        class="menu-overlay"
        :class="{'opened': session.status !== 'inProgress'}">

    </div>

  </div>
</template>

<script>

import {mapGetters} from "vuex";

const startSubstr = /\{\{\s*/g;
const endSubstr = /\s*\}\}/g;
export default {
  name: "SessionPlayer",
  components: {},
  props: ['sessionID'],

  data() {
    return {
      questComplete: false,
      answer: '',
      showConfirm: false,

    };
  },
  computed: {
    ...mapGetters(['sessionsByID']),
    session() {
      return this.sessionsByID[this.sessionID];
    },

    mapKeyNodes() {
      if (this.session === null) return null;
      let result = {};
      const getNode = (node) => {
        result[node.forKey] = node;
        if (node.list.length > 0) node.list.forEach((v) => {
          getNode(v);
        });
      };
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
      return 'Ок, отлично!';
    }
  },
  methods: {
    onClickQuest(e) {
      console.log('onClickQuest::e=>>', e);
      if (e.target.className === "inserted-text") {
        console.log('inserted-text clicked !!!');
        const oldText = e.target.outerText;
        let newText = prompt("Редактирование текста", oldText);
        console.log('newText =>>', newText);
        if (!!newText) {
          console.log('oldText =>>', oldText);
          for (let key in this.session.varsByName) {
            console.log('###0 key=>>', key, this.session.varsByName[key]);
            if (this.session.varsByName[key] === oldText) {
              console.log('###1');
              this.session.varsByName[key] = newText;
            }
            this.handleQuest(false);

            this.$store.commit('answer', 'save test');
          }
        }
      }
    },
    // onClickQuest(e) {
    //   console.log('onClickQuest::e=>>', e);
    //   if (e.target.className === "inserted-text") {
    //     console.log('inserted-text clicked !!!');
    //     let newText = prompt("Редактирование текста", 'что-то');
    //     console.log('newText =>>', newText);
    //     if (!!newText) {
    //       const oldText = e.target.outerText;
    //       console.log('oldText =>>', oldText);
    //       for (let key in this.session.varsByName) {
    //         console.log('###0 key=>>', key, this.session.varsByName[key]);
    //         if (this.session.varsByName[key] === oldText) {
    //           console.log('###1');
    //           this.session.varsByName[key] = newText;
    //         }
    //         this.handleQuest(false);
    //
    //         this.$store.commit('answer', 'save test');
    //       }
    //     }
    //   }
    // },
    getRandomItem(probabilitiesArray, againProbsArray,  prevProbIdx) {
      console.log('probabilitiesArray =>>', probabilitiesArray);
      // console.log('againProbsArray =>>', againProbsArray);
      // console.log('prevProbIdx =>>', prevProbIdx);

      const totalProbability = probabilitiesArray.reduce((accumulator, probability) => accumulator + parseFloat(probability), 0); // Суммируем вероятности

      // if (totalProbability !== 1) throw new Error("Total probability must be equal to 1"); // Проверяем корректность данных

      let randomNumber = Math.random() * totalProbability; // Генерируем случайное число от 0 до общих вероятностей
      let cumulativeProbability = 0;

      for (let i = 0; i < probabilitiesArray.length; ++i) {
        cumulativeProbability += parseFloat(probabilitiesArray[i]);

        if (cumulativeProbability >= randomNumber) return i; // Возвращаем индекс первого элемента с превышением случайной величины
      }
    },

    handleQuest(goNext = true) {
      let response = this.session.questInfo;
      if (goNext) {
        response = this.nextQuest();
        this.session.questInfo.rawQuest = response.rawQuest;
      }
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
        handledQuest: this.questHTML, //  this.session.questInfo.handledQuest,
        answer: this.answer,
        questDt: this.session.questInfo.questDt,
        answerDt: new Date().toISOString(),
        diffDt: 0,
        outVarNames: this.session.questInfo.outVarNames,
      });
      this.session.header.changedDt = new Date().toISOString();
      let hist = this.$refs['history'];
      this.$nextTick(
          () => hist.scrollTo({left: 0, top: hist.scrollHeight, behavior: "smooth"})
      );
    },
    showConfirmation() {
      this.showConfirm = true;
      setTimeout(() => {
        this.showConfirm = false;
      }, 1200);
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
              if (!!v) this.session.varsByName[v] = this.answer;
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
      // this.setCurrSessionInList();
      this.$store.commit('answer', 'save test');

    },
    onFinishCycle() {
      if (this.session.stack.length > 0) this.session.stack.shift();
    },
    onPauseSession() {
      this.session.status = 'paused';
      this.setCurrSessionInList();
    },
    onFinishSession() {
      this.session.stack = [];
      this.session.status = 'finished';
      this.setCurrSessionInList();
    },
    onContinueSession() {
      this.session.status = 'inProgress';
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
      if (this.session.stack.length === 0) return {rawQuest: 'Стек пуст'};

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
                  varNames = [this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.out.value];
                }
                result = {
                  rawQuest: this.mapKeyNodes[curr.key].list[(curr.counter + shift) % childrenAmount].attrs.quest.value,
                  outVarNames: varNames
                };
              }
                break;
              case 'randList': {
                const node = this.mapKeyNodes[curr.key];
                let arrProbs = node.list.map((v) => {
                  return +v.attrs.rate.value;
                });
                // let arrAgainProbs = null;
                // TODO:  сделать нормальное версионирование
                // if(this.session.process.header.version !=='0.0.1') {
                //   let arrAgainProbs = node.list.map((v) => {
                //     return +v.attrs.againRate.value;
                //   });
                //   arrProbs[curr.prevProbIdx] = arrAgainProbs[curr.prevProbIdx];
                //   if('againRate' in node.list[curr.prevProbIdx]) {
                //     arrProbs[curr.prevProbIdx] = +node.list[curr.prevProbIdx].attrs.againRate.value;
                //   }
                // }

                if('againRate' in (node.list?.[curr.prevProbIdx]?.attrs ?? {})) {
                  console.log('againRate =>>', +node.list[curr.prevProbIdx].attrs.againRate.value);
                  arrProbs[curr.prevProbIdx] = +node.list[curr.prevProbIdx].attrs.againRate.value;
                }
                let probIdx = this.getRandomItem(arrProbs,
                  // arrAgainProbs, curr.prevProbIdx
                );
                curr.prevProbIdx = probIdx;
                //проверить, надо ли сохранять ответ в переменной, если да, то послать имя переменной
                let varNames = [], varName = node.list[probIdx].attrs.out.value;
                if (!!varName) {
                  varNames.push(varName);
                }
                result = {
                  rawQuest: node.list[probIdx].attrs.quest.value,
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
          result = {rawQuest: 'Сессия завершена'};
        }
      }
      return result;
    },

  },
  mounted() {
    if (this.session.status === 'new' || this.session.questInfo.rawQuest === '') {
      this.onClickNext(true);
      this.session.status = 'inProgress';
    }
    if (this.session.status === 'paused') {
      this.session.status = 'inProgress';
    }
    // window.onbeforeunload = () => {
    //   this.onPauseSession()
    // };
    // window.addEventListener('beforeunload', () => {
    //   this.onPauseSession();
    // })
  },
  beforeUnmount() {
    // this.onPauseSession();
  },

};
</script>

<style lang="scss">
/****  SessionPlayer  ****/
.SessionPlayer {
  position: relative;
  width: 100%;
  height: auto;
  font-size: 14px;

  .inserted-text {
    color: hsl(200, 55%, 25%);
    //text-shadow: 0 0 hsl(199, 94%, 10%);
    font-weight: 500;
  }

  .sp-main {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    align-items: start;
    gap: 5px;

    .history {
      width: 100%;
      height: 200px;
      padding: 5px 0;
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 6px;
      overflow-y: scroll;

      .history-item {
        padding: 1px 8px 3px;
        border-bottom: 1px solid hsl(0, 0%, 90%);

        &:nth-child(2n) {
          background-color: hsla(180, 30%, 50%, .12);
        }
      }
    }

    .quest-zone {
      width: 100%;
      height: 46px;
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 6px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: start;
      align-items: start;
      gap: 5px;
      padding: 3px;
      font-size: 17px;
      background-color: hsl(194, 80%, 89%);

      .confirm {
        width: 100%;
        padding: 5px;
        border: 1px solid hsl(0, 0%, 80%);
        border-radius: 6px;
        display: none;
        background-color: hsl(84, 80%, 89%);

        &.show {
          display: block;
        }
      }

      .quest {
        width: 100%;
        padding: 5px;
        border: 1px solid hsl(0, 0%, 80%);
        border-radius: 6px;
        background-color: hsl(194, 80%, 95%);
      }
    }

    .answer {
      width: 100%;
      height: auto;
      padding: 3px;
      font-size: 16px;
      background-color: hsl(84, 80%, 90%);
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 6px;

      &:focus-within {
        outline: hsl(84, 60%, 55%) auto 1px;
        outline-offset: 1px;
      }

      textarea {
        margin: 0 !important;
        display: block;
        background-color: hsl(84, 80%, 95%);
        font-size: 15px;
        border: 1px solid hsl(0, 0%, 80%);
        border-radius: 6px;

        &:focus-visible {
          //outline: hsl(84, 60%, 55%) auto 1px;
          //outline-offset: 1px;
          outline: none;
        }
      }
    }


    .next {
      width: 100%;
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 6px;
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
      border: 1px solid hsl(0, 0%, 80%);
      border-radius: 6px;
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 10px;
      padding: 5px;
    }
  }

  .btn-control {
    height: auto;
    width: 200px;
    color: black;
    //background-color: transparent;
    border: 1px solid hsl(50, 30%, 75%);

    &:hover {
      color: black;
      background-color: hsl(52, 29%, 90%);
    }
  }


  .menu-overlay {
    position: fixed;
    right: 100%;
    top: var(--header-height);
    height: 100dvh;
    //height: 600px;
    width: 100%;
    z-index: 5;
    transition: all 0.3s ease;
    pointer-events: none;

    &.opened {
      background-color: hsla(0, 0%, 0%, 0.2);
      backdrop-filter: blur(4px);
      pointer-events: all;
      transform: translateX(100%);
    }
  }

  .btn-continue {
    //position: absolute;
    position: fixed;
    top: calc(100dvh / 2.5 - 15px);
    right: 100%;
    height: auto;
    width: 200px;
    transition: all 0.8s ease;
    z-index: 10;

    &.show {
      transform: translateX(calc(100% + 100%));
    }

  }
}
</style>
