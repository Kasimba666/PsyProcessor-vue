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
                @click="onClickBtnNext">
          Далее
        </button>
      </div>
      <div class="next">
        <button class="btn btn-outline-primary btn-next btn-sm"
                @click="onClickBtnNew">
          Подготовить новую сессию
        </button>
      </div>
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
    initSession() {
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
      this.session.stack = [{
        key: 'root',
        counter: -1,
        totalCount: 1000000,
        // maxCount: this.session.process.rootNode.attrs.loopCount.value
      }];
      console.log(this.session.stack[0]);
    },
    onClickBtnNext() {
      this.quest = this.nextQuest();

    },
    onClickBtnNew() {
      this.initSession();
    },
    saveHistoryItem() {

    },
    nextQuest() {
      let response = {};
      do
        response = this.nextElement();
      while (response.q === '');

      return response.q;
    },
    nextElement() {
      let result = {q: ''};
      let curr = this.session.stack[0];
      curr.counter += 1;
      let childrenAmount = this.mapKeyNodes[curr.key].list.length;
      if (curr.counter < curr.totalCount) {
        switch (this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].type) {
          case 'quest': {
            console.log('Формируется вопрос:', this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.quest.value);
            result = {
              q: this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.quest.value
            };
          }
            break;
          case 'loopList': {
            let childrenOfChildAmount = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].list.length;
            if (childrenOfChildAmount > 0) {
              let totalCount = this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].attrs.loopCount.value * childrenOfChildAmount;
              this.session.stack.unshift({
                key: this.mapKeyNodes[curr.key].list[curr.counter % childrenAmount].forKey,
                counter: -1,
                totalCount: totalCount,
              });
            }
          }
          case 'randList': {

          }
            break;
          default: {
          }
        }
      } else {
        if (this.session.stack.length > 1) {
          this.session.stack.shift();
        } else result = {q: 'Сказочке конец'}
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
