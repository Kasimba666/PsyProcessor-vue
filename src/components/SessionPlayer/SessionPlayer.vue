<template>
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
      <div class="next">
        <button class="btn btn-outline-primary btn-next btn-sm"
                @click="onClickFinishCycle">
          Завершить текущий цикл
        </button>
      </div>
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
      Стек: {{ !!this.session ? this.session.stack : '' }}
    </div>
  </div>
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
    onClickRenew() {
      // switch (this.currentSession.status) {
      //   case 'new': {
      //
      //   }
      //     break;
      //   case 'inPause': {
      //
      //   }
      //     break;
      //   default: {
      //   }
      // }
      this.session.status = 'inProgress';
      this.session.stack = [{
        key: 'root',
        type: this.session.process.rootNode.type,
        counter: -1,
        maxCount: 0,
        // maxCount: this.session.process.rootNode.attrs.loopCount.value
      }];
      console.log(this.session.stack[0]);
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
      if (curr.counter < curr.maxCount || curr.maxCount === 0) {
        let typeChild = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].type;
        switch (typeChild) {
          case 'quest': {
            // console.log('Формируется вопрос:', this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.quest.value);
            switch (curr.type) {
              case 'loopList': {
                result = {
                  q: this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.quest.value,
                };
              }
                break;
              case 'randList': {
                result = {
                  q: 'Случайно:' + this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.quest.value,
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
            let childrenOfChildAmount = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].list.length;
            if (childrenOfChildAmount > 0) {
              let maxCount = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.loopCount.value;
              // if (typeChild === 'loopList') maxCount *= childrenOfChildAmount;
              this.session.stack.unshift({
                key: this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].forKey,
                type: typeChild,
                counter: -1,
                maxCount: maxCount,
              });
            }
          }
            // case 'randList': {
            //     let childrenOfChildAmount = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].list.length;
            //     if (childrenOfChildAmount > 0) {
            //         let  maxCount = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.loopCount.value;
            //         this.session.stack.unshift({
            //             key: this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].forKey,
            //             type: typeChild,
            //             counter: -1,
            //             maxCount: maxCount,
            //         });
            //     }
            // }
            break;
          default: {
          }
        }
      } else {
        if (this.session.stack.length > 0) {
          this.session.stack.shift();
        }
        if (this.session.stack.length === 0) {
          this.session.status = 'finished';
          result = {q: 'Сказочке конец'}
        }
      }
      console.log(result);
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
