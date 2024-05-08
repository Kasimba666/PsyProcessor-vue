<template>
  <div class="ppProcessList">
    <b-container>
      <b-row>
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <el-tabs type="border-card">
            <el-tab-pane label="Готовые">
              <AppTransTable
                  class="trans-table"
                  :data="readyProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="gridMode"
                  @rowClick="onRowClick"
                  :key="readyProcessesRenderKey"
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
                          v-model="checkedList[row.id]"
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
                      <i class="ico ico-menu" style="font-size: 20px"></i>
                      <ppProcessMenu
                          class="menu-container"
                          v-if="openedMenus[rowIdx]"
                          v-click-outside="hideMenu"
                          :items="readyProcessesMenuItems"
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
            </el-tab-pane>
            <el-tab-pane label="Черновики">
              <AppTransTable
                  class="trans-table"
                  :data="draftProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="gridMode"
                  @rowClick="onRowClick"
                  :key="draftProcessesRenderKey"
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
                          v-model="checkedList[row.id]"
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
                      <i class="ico ico-menu" style="font-size: 20px"></i>
                      <ppProcessMenu
                          class="menu-container"
                          v-if="openedMenus[rowIdx]"
                          v-click-outside="hideMenu"
                          :items="draftProcessesMenuItems"
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
            </el-tab-pane>
            <el-tab-pane label="Шаблоны">
              <AppTransTable
                  class="trans-table"
                  :data="templateProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="gridMode"
                  @rowClick="onRowClick"
                  :key="templateProcessesRenderKey"
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
                          v-model="checkedList[row.id]"
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
                      <i class="ico ico-menu" style="font-size: 20px"></i>
                      <div
                          class="menu-container"
                          v-if="openedMenus[rowIdx]"
                          v-click-outside="hideMenu"
                      >
                        <ppProcessMenu
                            class="menu-container"
                            v-if="openedMenus[rowIdx]"
                            v-click-outside="hideMenu"
                            :items="templateProcessesMenuItems"
                            @onClickMenuItem="(action)=>$emit('doAction', action, [row.id])"
                        />
                      </div>
                    </div>
                    <!--                <div class="menu-overlay"-->
                    <!--                     @click="hideMenu"-->
                    <!--                     v-if="openedMenus[rowIdx]"-->
                    <!--                />-->

                  </template>

                </TtColumn>

              </AppTransTable>
            </el-tab-pane>
            <el-tab-pane label="Корзина">
              <AppTransTable
                  class="trans-table"
                  :data="deletedProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="gridMode"
                  @rowClick="onRowClick"
                  :key="deletedProcessesRenderKey"
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
                          v-model="checkedList[row.id]"
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
                      <i class="ico ico-menu" style="font-size: 20px"></i>
                      <div
                          class="menu-container"
                          v-if="openedMenus[rowIdx]"
                          v-click-outside="hideMenu"
                      >
                        <ppProcessMenu
                            class="menu-container"
                            v-if="openedMenus[rowIdx]"
                            v-click-outside="hideMenu"
                            :items="deletedProcessesMenuItems"
                            @onClickMenuItem="(action)=>$emit('doAction', action, [row.id])"
                        />
                      </div>
                    </div>
                    <!--                <div class="menu-overlay"-->
                    <!--                     @click="hideMenu"-->
                    <!--                     v-if="openedMenus[rowIdx]"-->
                    <!--                />-->

                  </template>

                </TtColumn>

              </AppTransTable>
            </el-tab-pane>
            <el-tab-pane label="Все">
              <AppTransTable
                  class="trans-table"
                  :data="allProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="gridMode"
                  @rowClick="onRowClick"
                  :key="allProcessesRenderKey"
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
                          v-model="checkedList[row.id]"
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
                      <i class="ico ico-menu" style="font-size: 20px"></i>
                      <div
                          class="menu-container"
                          v-if="openedMenus[rowIdx]"
                          v-click-outside="hideMenu"
                      >
                        <ppProcessMenu
                            class="menu-container"
                            v-if="openedMenus[rowIdx]"
                            v-click-outside="hideMenu"
                            :items="allProcessesMenuItems"
                            @onClickMenuItem="(action)=>$emit('doAction', action, [row.id])"
                        />
                      </div>
                    </div>
                    <!--                <div class="menu-overlay"-->
                    <!--                     @click="hideMenu"-->
                    <!--                     v-if="openedMenus[rowIdx]"-->
                    <!--                />-->

                  </template>

                </TtColumn>

              </AppTransTable>
            </el-tab-pane>

          </el-tabs>
        </div>
        <div class="process-list-control">
          <button
              v-if="!showCheckboxes"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onCreateProcess"
          >
            Создать пустой черновик
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
            Выбрать процессы для сохранения
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
            Сохранить выбранные
          </button>
        </div>
<!--        <el-tabs type="border-card">-->
<!--          <el-tab-pane-->
<!--              v-for="tab in Object.entries(tabs).map((v)=>v[1])"-->
<!--              :label="tab.title"-->
<!--          >-->
<!--            <ppProcessListTab-->
<!--              :menuItems="tab.menuItems"-->
<!--              :source="tab.source"-->
<!--              :gridMode="tab.gridMode"-->
<!--              :showCheckboxes="showCheckboxes"-->
<!--              @doAction="((v1, v2)=>{$emit('doAction', v1, v2)})"-->
<!--            />-->
<!--          </el-tab-pane>-->
<!--        </el-tabs>-->
        <div class="tabs-container">
          <AppTabs
              :currentTab="currentTab"
              v-model:tabsList="tabsList"
              @selectTab="(v)=>{this.currentTab = v}"
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
                @doAction="((v1, v2)=>{$emit('doAction', v1, v2)})"
            />
          </div>
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
      checkedList: {},
      currentRow: null,
      openedMenus: {},
      currentTab: ''
    }
  },
  setup() {
    const allMenuItems = {'start': 'Начать сессию', 'change': 'Редактировать', 'duplicate': 'Дублировать', 'toDraft': 'В черновики', 'toReady': 'В готовые', 'toTemplate': 'В шаблоны', 'toTrash': 'В корзину', 'restore': 'Восстановить', 'remove': 'Удалить насовсем'};
    const gridMode = {
        xxl: '20px 2fr 100px 80px 1fr 1fr 40px',
        xl: '20px 2fr 100px 80px 1fr 1fr 40px',
        lg: '20px 2fr 100px 80px 1fr 1fr 40px',
        md: '20px 2fr 100px 80px 1fr 1fr 40px',
      }
    return {
      allMenuItems,
      gridMode
    }
  },

  computed: {
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
    readyProcessesRenderKey() {
      return 'draft'+this.showCheckboxes.toString();
    },
    readyProcesses() {
      return this.source.filter((v)=>(v.status === 'ready' && v.deleted === false));
    },
    readyProcessesSortedSource() {
      let orderDESC = this.sortMode.order === 'DESC';
      return [...this.readyProcesses].sort((a, b) => {
        if (a[this.sortMode.field] < b[this.sortMode.field]) {
          return orderDESC ? 1 : -1
        } else {
          return orderDESC ? -1 : 1
        }
      });
    },

    draftProcessesRenderKey() {
      return 'draft'+this.showCheckboxes.toString();
    },
    draftProcesses() {
      return this.source.filter((v)=>v.status === 'draft' && v.deleted === false);
    },

    draftProcessesSortedSource() {
      let orderDESC = this.sortMode.order === 'DESC';
      return [...this.draftProcesses].sort((a, b) => {
        if (a[this.sortMode.field] < b[this.sortMode.field]) {
          return orderDESC ? 1 : -1
        } else {
          return orderDESC ? -1 : 1
        }
      });
    },

    templateProcessesRenderKey() {
      return 'template'+this.showCheckboxes.toString();
    },
    templateProcesses() {
      return this.source.filter((v)=>v.status === 'template' && v.deleted === false);
    },
    templateProcessesSortedSource() {
      let orderDESC = this.sortMode.order === 'DESC';
      return [...this.templateProcesses].sort((a, b) => {
        if (a[this.sortMode.field] < b[this.sortMode.field]) {
          return orderDESC ? 1 : -1
        } else {
          return orderDESC ? -1 : 1
        }
      });
    },

    deletedProcessesRenderKey() {
      return 'deleted'+this.showCheckboxes.toString();
    },
    deletedProcesses() {
      return this.source.filter((v)=>v.deleted === true);
    },
    deletedProcessesSortedSource() {
      let orderDESC = this.sortMode.order === 'DESC';
      return [...this.deletedProcesses].sort((a, b) => {
        if (a[this.sortMode.field] < b[this.sortMode.field]) {
          return orderDESC ? 1 : -1
        } else {
          return orderDESC ? -1 : 1
        }
      });
    },

    allProcessesRenderKey() {
      return 'all'+this.showCheckboxes.toString();
    },
    allProcessesSortedSource() {
      let orderDESC = this.sortMode.order === 'DESC';
      return [...this.source].sort((a, b) => {
        if (a[this.sortMode.field] < b[this.sortMode.field]) {
          return orderDESC ? 1 : -1
        } else {
          return orderDESC ? -1 : 1
        }
      });
    },

    selectedIDs() {
      return Object.keys(this.checkedList).filter((v) => {
        if (this.checkedList[v] === true) return v
      });
    },
  },
  methods: {
    menuItems(v) {
      return v.reduce((s, w)=>{
        s[w]=this.allMenuItems[w];
        return s;
      }, {});
    },
    // tabMenuItems(tabName) {
    //   return this.tabs(tabName).menuItems.reduce((s, w)=>{
    //     s[w]=this.allMenuItems[w];
    //     return s;
    //   }, {});
    // },
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
      this.showCheckboxes = false;
    },
    onSelectAll() {
      this.source.forEach((v) => {
        this.checkedList[v.id] = true;
      });
    },
    onUnselectAll() {
      this.source.forEach((v) => {
        this.checkedList[v.id] = false;
      });
    },
    onCreateProcess() {
      this.$emit('doAction', 'create', [], null);
      this.openedMenus = {};
    },
    onLoadProcesses(e) {
      let file = e.target.files[0];
      this.$emit('doAction', 'load', null, file);
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
