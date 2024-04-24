<template>
  <div class="ppProcessList">
    <b-container>
      <b-row>
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">

                <AppTransTable
                        class="trans-table"
                        :data="sortedSource"
                        :cardMode="{
                            breakpoint: 'sm',
                            titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                          }"
                        :gridMode="{
              xxl: '30px 4fr 2fr 2fr 2fr 30px',
              xl: '30px 4fr 2fr 2fr 2fr 30px',
              lg: '30px 4fr 2fr 2fr 2fr 30px',
              md: '30px 4fr 2fr 2fr 2fr 30px',
              }"
                        @rowClick="onRowClick"
                >
                    <TtColumn
                            label=""
                            prop=""
                    >
                        <template>

                        </template>
                    </TtColumn>

                    <!--            <TtColumn-->
                    <!--                label="Наименование"-->
                    <!--                prop="processTitle"-->
                    <!--                v-model:sortable="SortMode"-->
                    <!--                align="center"-->
                    <!--            >-->
                    <!--            </TtColumn>-->
                    <TtColumn
                            label="Наименование"
                            prop="processTitle"
                    >
                        <template #default="{ row }">
                            {{ row.test.test1 }}
                        </template>
                    </TtColumn>
                    <TtColumn
                            label="Категория"
                            prop="processCategory"
                    >
                    </TtColumn>
                    <TtColumn
                            label="Дата создания"
                            prop="createdDt"
                            v-model:sortable="SortMode"
                            align="center"
                    >
                    </TtColumn>
                    <TtColumn
                            label="Дата изменения"
                            prop="changedDt"
                            v-model:sortable="SortMode"
                            align="center"
                    >
                    </TtColumn>
                    <TtColumn
                            label=""
                            prop=""
                            align="center"
                    >
                        <template #default="{row, rowIdx }">
                            <div>
                                <i class="ico ico-menu">{{ rowIdx }}</i>
                            </div>
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
import {mapMutations, mapState} from "vuex";

const defaultSortOrder = {
  field: 'changedDt',
  order: 'ASC'
};

export default {
  name: 'ppProcessList',
  components: {AppTransTable, TtColumn},
  props: ['source'],
  mixins: [TableMixin],
  data() {
    return {
      // sortMode: {...defaultSortOrder},
    }
  },
  computed: {
    ...mapState({sortMode: state => state.processListSortMode}),

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
      ...mapMutations({sortMode: 'processListSortMode'}),
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
  .trans-table {
    user-select: none;
    font-size: 12px;
  }

}
</style>
