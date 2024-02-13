<template>
    <div class="SessionPlayer">
        <div class="main">
            <div class="history">
                История вопросов и ответов
            </div>

            <div class="quest">
                Вопрос и поощрение
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
        </div>
    </div>
</template>

<script>

export default {
    name: "SessionPlayer",
    components: {},
    props: ['session'],
    emits: ['action', 'status'],
    data() {
        return {
            answer: '',
        }
    },
    computed: {
        mapKeysNodes() {
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
            switch (this.session.status) {
                case 'new': {

                }
                    break;
                case 'inPause': {

                }
                    break;
                default: {
                }
            }
        },
        onClickBtnNext() {

        },
        nextStep() {

        },
        saveHistoryItem() {

        },
        getResponse() {
            return 'Ok';
        },
    },
    mounted() {
        this.initSession();
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
