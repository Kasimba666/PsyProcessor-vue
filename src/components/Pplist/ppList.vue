<template>
  <div class="ppList">
    <b-table class="table-custom"
        striped
             small
             hover
             selectable
             bordered
             sortable
             select-mode="multi"
             :items="processList"
             :fields="fields"
             @row-selected="onRowSelected"
             @row-clicked="onRowClicked"
    >

    </b-table>
    <div class="process-list-control">
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="createNewProcess">
        Создать
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="changeProcess">
        Изменить
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="removeProcess">
        Удалить
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="loadProcess">
        Загрузить
      </button>
      <button class="btn btn-outline-primary btn-custom btn-sm"
              @click="saveProcess">
        Выгрузить
      </button>
    </div>

  </div>
</template>
<script>

export default {
  name: "ppList",
  props: ['processList'],
  emits: ['update:processList', 'setCurrProcess'],
  data() {
    return {
      currProcess: null,
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
          createdDt: v.createdDt,
          changedDt: v.changedDt,
          description: v.description
        }
      });
    },


  },
  methods: {
    onRowSelected() {

      this.$emit('setCurrProcess', this.currProcess);
    },
    onRowClicked(item, index, event) {
      console.log(index);
    },
  },
  mounted() {

  },
}

</script>

<style lang="scss">
.ppList {
  width: 100%;
  height: auto;

  thead {
    text-align: center;
  }
  .table-custom {
    //color: blue;
  }

  .process-list-control {
    width: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    gap: 10px;
    padding: 5px;
    margin: 10px;

    .btn-custom {
      color: black;
      background-color: transparent;
      border: 1px solid hsl(50, 30%, 75%);

      &:hover {
        background-color: hsl(52, 29%, 90%);
      }
    }
  }

}

</style>
