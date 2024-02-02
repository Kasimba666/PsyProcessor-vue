<template>
  <div class="ProcessList">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-40">
<!--            <SplittedBalance-->
<!--            :val="'0123456789354562.123456712341235'"-->
<!--            :rel="0.8"-->
<!--            locale="ru"-->
<!--            />-->
          <pp-list
              :rows="rows"
              :fields="fields"
              @doAction="onDoAction"
          ></pp-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ppList from "@/components/Pplist/ppList.vue";
import SplittedBalance from "@/components/SplittedBalance.vue";


export default {
  head: {
    title: 'PsyProcessor : Процессы'
  },
  name: "ProcessList",
  components: {SplittedBalance, ppList},
  props: [],
  data() {
    return {
      file: null,
      typeFile: 'json',
      processList: [],
      fields: [
        {key: 'processTitle', label: 'Наименование', sortable: true},
        {key: 'processCategory', label: 'Категория', sortable: true},
        {key: 'createdDt', label: 'Дата создания', sortable: true},
        {key: 'changedDt', label: 'Дата изменения', sortable: true},
        {key: 'description', label: 'Описание', sortable: true},

      ],

    }
  },
  computed: {
    rows() {
      return this.processList.map(v => {
        return {
          processTitle: v.processTitle,
          processCategory: v.processCategory,
          createdDt: this.dtFormatCustom(v.createdDt),
          changedDt: this.dtFormatCustom(v.changedDt),
          description: v.description,
        }
      });
    },

  },
  methods: {
    onDoAction(action, idxs, e) {
      console.log(action, idxs, e);
      switch (action) {
        case 'create': {
          this.$store.commit('currentEditableProcess', null);
          this.$router.push({path: 'constructor'});
        }
          break;
        case 'change': {
          console.log('onDoAction:',idxs);
          if (idxs.length > 0) {
            this.$store.commit('currentEditableProcess', this.processList[idxs[0]]);
            this.$router.push({path: 'constructor'});
          }
        }
          break;
        case 'clone': {

        }
          break;
        case 'remove': {

        }
          break;
        case 'load': {

        }
          break;
        case 'save': {

        }
          break;
        default: {
        }
      }

      this.$store.commit('currentList', this.processList);
    },

    saveProcesses() {
//собрать массив процессов для выгрузки
      let arr = [];
      for (let i; i < this.selectedProcessesIdxs.length; i++) {
        arr.push(this.processList[this.selectedProcessesIdxs[i]]);
      }
//получить имя для набора процессов
    },


    dtFormatCustom(dtISO) {
      let result = dtISO.substring(0, 19).split('');
      result[10] = '-';
      result[13] = '-';
      result[16] = '-';
      return result.join('');
    },

    initProcessListMock() {
      this.processList = [
        {
          processTitle: 'Процесс 1',
          key: (~~(Math.random() * 32767) * (1 << 19 - 1) % 3047777777).toString(16),
          version: "0.0.1",
          processCategory: 'Общие',
          createdDt: '2024-01-23T15:11:37',
          changedDt: '2024-01-24T15:11:37',
          description: 'Описание 1',
          vars: [
            {name: '$topic', value: '',},
            {name: '$last', value: [null],},
          ],
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
        },
        {
          processTitle: 'Процесс 2',
          key: (~~(Math.random() * 32767) * (1 << 19 - 1) % 3047777777).toString(16),
          version: "0.0.1",
          processCategory: 'Общие',
          createdDt: '2024-01-23T15:11:37',
          changedDt: '2024-01-24T15:11:37',
          description: 'Описание 2',
          vars: [
            {name: '$topic', value: '',},
            {name: '$last', value: [null],},
          ],
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
        },
        {
          processTitle: 'Процесс 3',
          key: (~~(Math.random() * 32767) * (1 << 19 - 1) % 3047777777).toString(16),
          version: "0.0.1",
          processCategory: 'Общие',
          createdDt: '2024-01-23T15:11:37',
          changedDt: '2024-01-24T15:11:37',
          description: 'Описание 3',
          vars: [
            {name: '$topic', value: '',},
            {name: '$last', value: [null],},
          ],
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
        },

      ];
    },

    saveJSONFile(object, filename) {
      const json = JSON.stringify(object, null, 2); // Преобразуем объект в строку JSON
      const blob = new Blob([json], {type: "application/json"}); // Создаем Blob из строки JSON
      const url = URL.createObjectURL(blob); // Создаем URL для Blob

      const a = document.createElement("a"); // Создаем элемент <a>
      a.href = url;
      a.download = filename + ".json"; // Устанавливаем имя файла
      a.click(); // "Жмем" на <a>, чтобы начать скачивание

      URL.revokeObjectURL(url); // Очищаем URL после скачивания
    },
    loadJSONFile(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        try {
          let content = JSON.parse(reader.result);
          this.file = {content, name: file.name};
        } catch {
          alert('Ошибка загрузки файла');
        }
      };
      reader.readAsText(file);
      this.process = JSON.parse(file.content);
      this.processChanged(this.process);
    },
  },
  mounted() {
    this.initProcessListMock();
  },
}
</script>

<style lang="scss">
.ProcessList {
  width: 100%;
  height: auto;

}
</style>
,/*
