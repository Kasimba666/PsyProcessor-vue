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
          {{ idShort(row.id) }}
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
                v-model="tabCheckedList[row.id]"
                @input="onCheckBox"
            />
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
<!--            <i class="ico ico-menu" style="font-size: 20px"></i>-->
<!--                  <ppProcessMenu-->
<!--                          class="menu-container"-->
<!--                          v-if="openedMenus[rowIdx]"-->
<!--                          v-click-outside="hideMenu"-->
<!--                          :items="menuItems"-->
<!--                          @onClickMenuItem="(action)=>$emit('doActionOnMenu', action, [row.id])"-->
<!--                  />-->

<!--              <el-dropdown-->
<!--                  trigger='click'-->
<!--                  placement="top"-->
<!--              >-->
<!--                  <i class="ico ico-menu" style="font-size: 20px"></i>-->
<!--                  <template #dropdown>-->
<!--                              <ppProcessMenu-->
<!--                                  class="menu-container"-->
<!--                                  v-if="openedMenus[rowIdx]"-->
<!--                                  v-click-outside="hideMenu"-->
<!--                                  :items="menuItems"-->
<!--                                  @onClickMenuItem="(action)=>$emit('doActionOnMenu', action, [row.id])"-->
<!--                              />-->
<!--                  </template>-->
<!--              </el-dropdown>-->
              <el-dropdown
                  trigger='click'
                  placement="top"
              >
                  <i class="ico ico-menu" style="font-size: 20px"></i>
                  <template #dropdown>
                              <ppProcessMenu
                                  class="menu-container"
                                  v-click-outside="hideMenu"
                                  :items="menuItems"
                                  @onClickMenuItem="(action)=>$emit('doActionOnMenu', action, [row.id])"
                              />
                  </template>
              </el-dropdown>
          </div>

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
import {useIdFilters} from "@/composables/useIdFilters.js";

const defaultSortOrder = {
  field: 'changedDt',
  order: 'ASC'

};

export default {
  name: 'ppProcessListTab',
  components: {AppTransTable, TtColumn, ppProcessMenu},
  props: ['menuItems', 'source', 'gridMode', 'showCheckboxes', 'tabCheckedList'],
  mixins: [TableMixin],
  data() {
    return {
      openedMenus: {},
      currentRow: null,
    }
  },
    setup() {
        const {idShort} = useIdFilters();
        return {
            idShort
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
    onCheckBox() {
      this.$emit('setChecked', this.tabCheckedList);
    },
    onRowClick(v) {
      this.currentRow = v.rowIdx;
    },
  },
  watch: {
    // tabCheckedList: {handler(v, old) {
    //     console.log(v);
    //     if (v !== old) this.$emit('setChecked', this.tabCheckedList);
    // }, deep: true
    // }
  },
  mounted() {
    this.$emit('setChecked', {});
  },
}
</script>

<style lang="scss">
.ppProcessListTab {

}
</style>
