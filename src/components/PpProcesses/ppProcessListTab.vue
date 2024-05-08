<template>
  <div class="ppProcessListTab">
    <AppTransTable
        class="trans-table"
        :data="sortedSource"
        :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
        :gridMode="gridMode"
        @rowClick="onRowClick"
    >
      <TtColumn
          label=""
          prop="deleted"
          v-model:sortable="SortMode"
      >
        <template
            #default="{ row }"
        > {{!!row.deleted ? '-' : '+'}}
        </template>
      </TtColumn>

      <TtColumn
          label="Имя"
          prop="processTitle"
          v-model:sortable="SortMode"
      >
      </TtColumn>
      <TtColumn
          label="ID"
          prop="id"
      >
        <template #default={row}>
          {{ ((v)=>{let shortV = JSON.parse(JSON.stringify(v.split(''))); shortV.splice(4,28, '...'); return shortV.join('')})(row.id) }}
        </template>

      </TtColumn>
      <TtColumn
          label="Статус"
          prop="status"
          v-model:sortable="SortMode"
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
      >
        <template
            v-if="showCheckboxes"
            #default="{ row }"
        >
          <div class="d-flex align-content-center p-10">
            <input
                type="checkbox"
            />
<!--                v-model="checkedList[row.id]"-->
          </div>
        </template>
        <template
            v-else
            #default="{row, rowIdx}"
        >
          <div
              class="btn-menu d-flex align-items-center"
              @click.stop="onToggleMenu(rowIdx)"
          >
            <i class="ico ico-menu" style="font-size: 20px"></i>
              <ppProcessMenu
                  class="menu-container"
                  v-if="openedMenus[rowIdx]"
                  v-click-outside="hideMenu"
                  :items="menuItems"
                  @onClickMenuItem="(action)=>$emit('doAction', action, [row.id])"
              />
          </div>
          <!--                <div class="menu-overlay"-->
          <!--                     @click="hideMenu"-->
          <!--                     v-if="openedMenus[rowIdx]"-->
          <!--                />-->

        </template>

      </TtColumn>

    </AppTransTable>
  </div>
</template>

<script>
import ppProcessMenu from "@/components/PpProcesses/ppProcessMenu.vue";
import TableMixin from "@/components/Common/AppTransformerTable/TableMixin.vue";
import AppTransTable from '@/components/Common/AppTransformerTable/AppTransTable.vue';
import TtColumn from '@/components/Common/AppTransformerTable/TtColumn.vue';

const defaultSortOrder = {
  field: 'changedDt',
  order: 'ASC'
};

export default {
  name: 'ppProcessListTab',
  components: {AppTransTable, TtColumn, ppProcessMenu},
  props: ['menuItems', 'source', 'gridMode', 'showCheckboxes'],
  mixins: [TableMixin],
  data() {
    return {
      openedMenus: {},
      currentRow: null,
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
    onToggleMenu(v) {
      this.openedMenus = {[v]: !this.openedMenus[v]};
    },
    hideMenu() {
      this.openedMenus = {};
    },

    onRowClick(v) {
      this.currentRow = v.rowIdx;
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.ppProcessListTab {

}
</style>
