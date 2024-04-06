<template>
  <div class="ppProcessList">
    <b-container>
      <b-row>
        <div class="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-9">
          <AppTransTable :data="sortedSource"
                         :cardMode="{
                                        breakpoint: 'sm',
                                        titleWidth: '35%', // ширина столбца заголовков
                                      }"
                         :gridMode="{
                                        xxl: '25px 4fr 2fr 2fr 4fr 100px 100px',
                                        xl: '25px 4fr 2fr 2fr 4fr 100px 100px',
                                        lg: '25px 4fr 2fr 2fr 4fr 100px 100px',
                                        md: '25px 4fr 2fr 2fr 4fr 100px 100px',
                                        }"
                         @rowClick="onRowClick"
          >
            <TtColumn
                label="Чекбокс"
                prop=""
            >
              <template>

              </template>
            </TtColumn>

            <TtColumn
                label="Наименование"
                prop="processTitle"
                :sortable.sync="SortMode"
            >
            </TtColumn>
            <TtColumn
                label="Категория"
                prop="processCategory"
                :sortable.sync="SortMode"
            >
            </TtColumn>
            <TtColumn
                label="Дата создания"
                prop="createdDt"
                :sortable.sync="SortMode"
            >
            </TtColumn>
            <TtColumn
                label="Дата изменения"
                prop="changedDt"
                :sortable.sync="SortMode"
            >
            </TtColumn>
            <TtColumn
                label="Изменить"
                prop=""
            >
              <template>

              </template>

            </TtColumn>
            <TtColumn
                label="Запуск"
                prop=""
            >
              <template>

              </template>

            </TtColumn>
          </AppTransTable>

        </div>
      </b-row>
    </b-container>

  </div>
</template>

<script>

import AppTransTable from '@/components/Common/AppTransformerTable/AppTransTable.vue';
import TtColumn from '@/components/Common/AppTransformerTable/TtColumn.vue';
import TableMixin from "@/components/Common/AppTransformerTable/TableMixin.vue";

const defaultSortOrder = {
  field: 'processTitle',
  order: 'ASC'
};

export default {
  name: 'ppProcessList',
  components: {AppTransTable, TtColumn},
  props: ['source'],
  mixins: [TableMixin],
  data() {
    return {
      defaultSortOrder: {...defaultSortOrder},
      sortMode: {...defaultSortOrder},
    }
  },
  computed: {
    sortedSource() {
      let orderDESC = this.sortMode.order === 'DESC';
      return [...this.source].sort((a, b) => {
        if (a[this.sortMode.field] < b[this.sortMode.field]) {
          return orderDESC ? 1 : -1
        } else {
          return orderDESC ? -1 : 1
        }
      });
    },
  },
    methods: {
      onRowClick(v) {
        console.log(v);
      }
    },
    mounted() {
    },

}
</script>

<style lang="scss">
.ppProcessList {

}
</style>
