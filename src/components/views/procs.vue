<template>
  <div class="ProcessList">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-40">
          <pp-list
              :rows="rows"
              :fields="fields"
              @doAction="onDoAction"
          ></pp-list>
          {{ !!this.file ? this.file.content : 'нет' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ppList from "@/components/Pplist/ppList.vue";
import {mapState} from "vuex";

export default {
  head: {
    title: 'PsyProcessor : Процессы'
  },
  name: "ProcessList",
  components: {ppList},
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
    ...mapState(['currentList']),
    rows() {
      if (this.processList === null || this.processList.length === 0) return [];
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
    onDoAction(action, idxs, file) {
      // console.log(action, idxs, file);
      switch (action) {
        case 'create': {
          this.$store.commit('currentEditableProcessIdx', -1);
          this.$router.push({path: 'constructor'});
        }
          break;
        case 'change': {
          if (idxs.length > 0) {
            let forEdit = JSON.parse(JSON.stringify(this.processList[idxs[0]]));
            this.$store.commit('currentEditableProcess', forEdit);
            this.$store.commit('currentEditableProcessIdx', idxs[0]);
            this.$router.push({path: 'constructor'});
          }
        }
          break;
        case 'duplicate': {
          let forSave = [];
          for (let i = 0; i < idxs.length; i++) {
            forSave.push(JSON.parse(JSON.stringify(this.processList[idxs[i]])));

          }
          this.$store.commit('addProcessesInList', forSave);
        }
          break;
        case 'remove': {
          if (idxs.length > 0) {
            idxs.reverse().forEach(v => {
              this.processList.splice(v, 1)
            });
          }
        }
          break;
        case 'load': {
          let arr = this.loadJSONFile(file);
          console.log(arr);
          this.$store.commit('addProcessesInList', arr);
        }
          break;
        case 'save': {
          let arr = [];
          idxs.forEach((v) => {
            arr.push(this.processList[v]);
          });
          this.saveJSONFile(arr, arr[0].processTitle + ' ' + this.dtFormatCustom(arr[0].changedDt))
        }
          break;
        default: {
        }
      }

      this.$store.commit('currentList', this.processList);
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

    saveJSONFile: function (object, filename) {
      const json = JSON.stringify(object, null, 2); // Преобразуем объект в строку JSON
      const blob = new Blob([json], {type: "application/json"}); // Создаем Blob из строки JSON
      const url = URL.createObjectURL(blob); // Создаем URL для Blob

      const a = document.createElement("a"); // Создаем элемент <a>
      a.href = url;
      a.download = filename + ".json"; // Устанавливаем имя файла
      a.click();// "Жмем" на <a>, чтобы начать скачивание

      URL.revokeObjectURL(url); // Очищаем URL после скачивания
    },
    loadJSONFile(file) {
      let reader = new FileReader();
      reader.onload = () => {
        try {
          let content = JSON.parse(reader.result);
          this.file = {content: content, name: file.name};
        } catch {
          alert('Ошибка загрузки файла');
        }
      };
      reader.readAsText(file);
      return JSON.parse(file.content);

    },
  },
  mounted() {
    if (!!this.currentList) {
      this.processList = this.currentList;
    } else {
      this.initProcessListMock();
    }
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
