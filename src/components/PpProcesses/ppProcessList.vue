<template>
  <div class="ppProcessList">
    <b-container>
      <b-row>
        <div class="tabs-container">
          <AppTabs
              :currentTab="currentTab"
              v-model:tabsList="tabsList"
              @selectTab="onSelectTab"
          />
          <div
              v-for="tab in arrTabs"
          >
            <ppProcessListTab
                v-if="tab.name===this.currentTab"
                :menuItems="tab.menuItems"
                :source="tab.source"
                :gridMode="tab.gridMode"
                :showCheckboxes="showCheckboxes"
                v-model:tabCheckedList="checkedList[currentTab]"
                @doAction="((v1, v2)=>{$emit('doAction', v1, v2)})"
            />
          </div>
        </div>
        <div class="process-list-control">
          <button
              v-if="!showCheckboxes"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onCreateProcess"
          >
            Создать черновик
          </button>
          <button
              v-if="!showCheckboxes"
              class="btn btn-outline-primary btn-actions btn-sm"
          >
            <label class="add-item" for="id-input-file" style="margin-bottom: 0">
              <input type="file" class="d-none" id="id-input-file"
                     value=""
                     :accept="'.'+'json'"
                     @change.prevent="onLoadProcesses($event)">
              Загрузить
            </label>
          </button>

          <button
              v-if="!showCheckboxes"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onSelectProcesses"
          >
            Выбрать для выгрузки
          </button>
          <button
              v-if="showCheckboxes"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onCancel"
          >
            Отмена
          </button>
          <button
              v-if="showCheckboxes"
              :disabled="selectedIDs.length===sortedSource.length"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onSelectAll">
            Выбрать все
          </button>
          <button
              v-if="showCheckboxes"
              :disabled="selectedIDs.length===0"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onUnselectAll">
            Развыбрать все
          </button>
          <button
              v-if="showCheckboxes"
              :disabled="selectedIDs.length===0"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onSave"
          >
            Выгрузить выбранные
          </button>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>

import AppTransTable from '@/components/Common/AppTransformerTable/AppTransTable.vue';
import TtColumn from '@/components/Common/AppTransformerTable/TtColumn.vue';
import TableMixin from "@/components/Common/AppTransformerTable/TableMixin.vue";
import ppProcessMenu from "@/components/PpProcesses/ppProcessMenu.vue";
import AppTabs from "@/components/PpProcesses/AppTabs.vue";
import ppProcessListTab from "@/components/PpProcesses/ppProcessListTab.vue";
import {useIdFilters} from "@/composables/useIdFilters.js";
import {useDtFilters} from "@/composables/useDtFilters.js";

const defaultSortOrder = {
  field: 'changedDt',
  order: 'ASC'
};

export default {
  name: 'ppProcessList',
  components: {AppTransTable, TtColumn, AppTabs, ppProcessMenu, ppProcessListTab},
  props: ['source'],
  mixins: [TableMixin],
  data() {
    return {
      sortMode: {...defaultSortOrder},
      showCheckboxes: false,
      currentRow: null,
      openedMenus: {},
      currentTab: 'tabAll',
      previousTab: '',
      checkedList: {}

    }
  },
  setup() {
    const limitRows = 20;
    const allMenuItems = {'start': 'Начать сессию', 'change': 'Редактировать', 'duplicate': 'Дублировать', 'toDraft': 'В черновики', 'toReady': 'В готовые', 'toTemplate': 'В шаблоны', 'toTrash': 'В корзину', 'restore': 'Восстановить', 'remove': 'Удалить насовсем'};
    const gridMode = {
        xxl: '20px 2fr 100px 80px 1fr 1fr 40px',
        xl: '20px 2fr 100px 80px 1fr 1fr 40px',
        lg: '20px 2fr 100px 80px 1fr 1fr 40px',
        md: '20px 2fr 100px 80px 1fr 1fr 40px',
      };
    const {idShort} = useIdFilters();
    const {dtIsoShort, dtIsoFileName} = useDtFilters();
    return {
      allMenuItems,
      gridMode,
      dtIsoShort,
      dtIsoFileName,
      idShort,
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
    tabsList() {
      return Object.entries(this.tabs).map((v)=>{return {value: v[0], name: v[1].title}});
    },
    tabs() {
      return {
        'tabReady': {
          title: 'Готовые',
          menuItems: this.menuItems(['start', 'change', 'duplicate', 'toDraft', 'toTemplate', 'toTrash']),
          gridMode: this.gridMode,
          source: this.source.filter((v)=>(v.status === 'ready' && v.deleted === false))
        },
        'tabDrafts': {
          title: 'Черновики',
          menuItems: this.menuItems(['start', 'change', 'duplicate', 'toReady', 'toTemplate', 'toTrash']),
          gridMode: this.gridMode,
          source: this.source.filter((v)=>v.status === 'draft' && v.deleted === false)
        },
        'tabTemplates': {
          title: 'Шаблоны',
          menuItems: this.menuItems(['start', 'change', 'duplicate', 'toReady', 'toDraft', 'toTrash']),
          gridMode: this.gridMode,
          source: this.source.filter((v)=>v.status === 'template' && v.deleted === false)
        },
        'tabTrash': {
          title: 'Корзина',
          menuItems: this.menuItems(['restore', 'remove']),
          gridMode: this.gridMode,
          source: this.source.filter((v)=>v.deleted === true)
        },
        'tabAll': {
          title: 'Все',
          menuItems: this.menuItems(['toTrash']),
          gridMode: this.gridMode,
          source: this.source
        }
      }
    },
    arrTabs() {
      return Object.entries(this.tabs).map((v)=> {
        let newValue = v[1];
        newValue['name'] = v[0];
        return newValue;
      });
    },

    selectedIDs() {
      if (!!this.checkedList[this.currentTab]) {
        return Object.entries(this.checkedList[this.currentTab]).map((v) => {
          if (v[1] === true) return v[0]
        });
      }
      else return [];
    },
  },
  methods: {
    menuItems(v) {
      return v.reduce((s, w)=>{
        s[w]=this.allMenuItems[w];
        return s;
      }, {});
    },

    doAction(v1, v2) {
      // this.$emit('doAction', v1, v2);
    },
    onRowClick(v) {
      this.currentRow = v.rowIdx;
    },
    onToggleMenu(v) {
        this.openedMenus = {[v]: !this.openedMenus[v]};
    },
    hideMenu() {
      this.openedMenus = {};
    },

    onSelectProcesses() {
      this.showCheckboxes = true;
    },
    onCancel() {
      this.showCheckboxes = false;
    },
    onSave() {
      this.$emit('doAction', 'save', this.selectedIDs, null);
      // this.showCheckboxes = false;
    },
    onSelectAll() {
      this.tabs[this.currentTab].source.forEach((v) => {
        this.checkedList[this.currentTab][v.id] = true;
      });
    },
    onUnselectAll() {
      this.checkedList[this.currentTab] = {};
    },
    onCreateProcess() {
      this.$emit('doAction', 'create', [], null);
      this.openedMenus = {};
    },
    onLoadProcesses(e) {
      let file = e.target.files[0];
      this.$emit('doAction', 'load', null, file);
    },
    onSelectTab(v) {
      if (this.currentTab !== v) {
        this.checkedList[this.currentTab] = {};
        this.currentTab = v;
      }

    },
  },

  mounted() {
  },

}
</script>

<style lang="scss">
.ppProcessList {
  position: relative;

  .trans-table {
    user-select: none;
    font-size: 12px;

    .btn-menu {
      position: relative;
      padding: 6px;

      &:hover {
        color: white;
        background-color: hsl(50, 30%, 75%);
      }

      .menu-container {
        position: absolute;
        //top: -44px;
        bottom: -10px;
        right: 15px;
        width: auto;
        height: auto;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: start;
        //border-radius: 5px 0px 5px 5px;
        border: 1px solid hsl(50, 30%, 65%);
        box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
        background-color: white;
        overflow: visible;
        z-index: 10;

        .menu-item {
          width: 100%;
          height: 30px;
          padding-left: 20px;
          padding-right: 20px;
          white-space: nowrap;
          cursor: pointer;
          color: black;
          border-bottom: 1px solid hsl(50, 30%, 65%);
          font-size: 12px;
          z-index: 15;
          &:last-child {
            border-bottom: none;
          }
          &:hover {
            background-color: hsl(50, 30%, 75%);
          }
        }
      }
    }

    .menu-overlay {
      position: fixed;
      left: 0px;
      height: 0px;
      width: 100dvw;
      height: 100dvh;
      z-index: 5;
    }
  }

  .process-list-control {
    width: auto;
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 10px;
    margin: 10px;
  }

  .btn-actions {
    height: auto;
    width: auto;
    color: black;
    border: 1px solid hsl(50, 30%, 75%);
    margin: 5px;

    &:hover {
      color: black;
      background-color: hsl(52, 29%, 90%);
    }
  }

  .tabs-container {
    position: relative;
    width: 100%;
    height: auto;
    border: 1px solid #dcdfe6;
  }
}
</style>
