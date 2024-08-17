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
          label="Имя"
          prop="processTitle"
          v-model:sortable="SortMode"
      >
        <template
            #default="{ row }"
        >
          <div
              :style="{backgroundColor: row.deleted ? 'hsl(0,94%,90%)' : 'none'}" style="width: 100%"
          >
            {{row.processTitle}}
          </div>
        </template>
      </TtColumn>
      <TtColumn
          label="ID"
          prop="id"
      >
        <template #default={row}>
          <div
              :style="{backgroundColor: row.deleted ? 'hsl(0,94%,90%)' : 'none'}" style="width: 100%"
          >
            {{ idShort(row.id) }}
          </div>
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
          <div class="d-flex align-content-center p-10"
               @click.stop=""
          >
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
              @click.stop=""
          >
<!--              @click.stop="onToggleMenu(rowIdx)-->
              <el-dropdown
                  trigger='hover'
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

    <el-dialog
            v-model="dialogVisible"
            style="top: -40px"
            width="95%"

    >
      <template #header>
        <span>{{ processesByID[sortedSource[currentRow].id].header.processTitle }}</span>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Описание" name='description'>
          {{processesByID[sortedSource[currentRow].id].header.description}}
        </el-tab-pane >
        <el-tab-pane label="Структура" name='structure'>
          <el-tree
              :data="[formatted]"
              default-expand-all
          />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Закрыть</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ppProcessMenu from "@/components/PpProcesses/ppProcessMenu.vue";
import TableMixin from "@/components/Common/AppTransformerTable/TableMixin.vue";
import AppTransTable from '@/components/Common/AppTransformerTable/AppTransTable.vue';
import TtColumn from '@/components/Common/AppTransformerTable/TtColumn.vue';
import {useIdFilters} from "@/composables/useIdFilters.js";
import {mapGetters, mapState} from "vuex";

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
      dialogVisible: false,
      activeName: 'description',

    }
  },
   setup() {
        const {idShort} = useIdFilters();
        const propsDialog = {label: 'type', children: 'list', id: 'forKey'}
        return {
            propsDialog,
            idShort,
        }
    },
  computed: {
    ...mapGetters(['processesByID']),
    formatted(){
        const transformNode = (node) => {
            return {
                id: node.forKey,
                label: this.nodeLabel(node),
                children: node.list.map(transformNode)
            }
        }

        return transformNode(this.processesByID[this.sortedSource[this.currentRow].id].rootNode)

    },
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
    nodeLabel(node) {
      let result='';
      if (node.type==='loopList') {
          result='Линейный список, число повторов: ' + node.attrs.loopCount.value;
          if (node.attrs.loopCount.value===0) result += ' (бесконечно)';
      }
      if (node.type==='randList'){
          result='Вероятностный список, число повторов: ' + node.attrs.loopCount.value;
      }
      if (node.type==='quest'){
          result='Вопрос: ' + node.attrs.quest?.value
      }
      return result;
    },
    // onToggleMenu(v) {
    //   this.openedMenus = {[v]: !this.openedMenus[v]};
    // },

    hideMenu() {
      this.openedMenus = {};
    },
    onCheckBox() {
      this.$emit('setChecked', this.tabCheckedList);
    },
    onRowClick(v) {
      this.dialogVisible = true;
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
  width: 100%;

  .dialog-content {

  }

}
</style>
