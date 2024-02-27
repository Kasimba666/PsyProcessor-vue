<template>
  <template v-if="!!session">
  <div class="SessionPlayer">
    <div class="main">
      <div class="history">
        История вопросов и ответов
      </div>

      <div class="quest">
        Вопрос и поощрение: {{ quest }}
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
                @click="onClickNext">
          Далее
        </button>
      </div>
      <template v-if="!!session && session.stack[0].maxCount === 0">
        <div class="next">
          <button class="btn btn-outline-primary btn-next btn-sm"
                  @click="onClickFinishCycle">
            Завершить текущий цикл
          </button>
        </div>
      </template>
      <div class="next">
        <button class="btn btn-outline-primary btn-next btn-sm"
                @click="onClickFinishSession">
          Завершить сессию
        </button>
      </div>
      <div class="next">
        <button class="btn btn-outline-primary btn-next btn-sm"
                @click="onClickPauseSession">
          Пауза
        </button>
      </div>
      <div class="next">
        <button class="btn btn-outline-primary btn-next btn-sm"
                @click="onClickRenew">
          Подготовить новую сессию
        </button>
      </div>
      <pre> {{ !!this.session ? this.session.stack : '' }}</pre>
      <pre>Сдвиг: {{ !!this.session ? this.session.positions : '' }}</pre>
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
      stepCounter: 0,
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
    onClickNext() {
      this.quest = this.nextQuest();

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
      console.log('shift', shift);
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
                let sumRates = this.mapKeyNodes[curr.key].list.reduce((s, v)=>{return s += v.attrs.rate.value}, 0);
                let arrProbs = this.mapKeyNodes[curr.key].list.map((v)=>{return v.attrs.rate.value / sumRates});
                result = {
                  q: this.mapKeyNodes[curr.key].list[this.getRandomElementWithProbabilities(arrProbs)].attrs.quest.value,
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
      console.log(result);
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
      width: 100%;
      border: 1px solid gray;
      text-align: center;
      padding: 5px;
    }
    .finishCycle {
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
