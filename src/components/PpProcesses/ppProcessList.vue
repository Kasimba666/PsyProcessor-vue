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
                  v-model:gridMode="readyProcessesGridMode"
                  @rowClick="onRowClick"
                  :key="renderKeyReadyProcesses"
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
                </TtColumn>
                <TtColumn
                    label="Тип"
                    prop="type"
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
                      v-if="prepareToSave"
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
                        <div class="menu-item d-flex align-items-center" @click.stop="onStartProcess(row.id)">Начать</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onChangeProcess(row.id)">Изменить</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onDuplicateProcess(row.id)">Дублировать</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateDraftFromTemplate(row.id)">Создать черновик из этого</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateTemplateFromDraftOrReady(row.id)">Создать шаблон из этого</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onToDraft(row.id)">В черновики</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToReady(row.id)">В готовые</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToTemplate(row.id)">В шаблоны</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onRemoveProcess(row.id)">Удалить</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToTrash(row.id)">В мусарню</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onFromTrash(row.id)">На волю</div>-->
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
            <el-tab-pane label="Черновики">
              <AppTransTable
                  class="trans-table"
                  :data="draftProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="draftProcessesGridMode"
                  @rowClick="onRowClick"
                  :key="renderKeyDraftProcesses"
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
                </TtColumn>
                <TtColumn
                    label="Тип"
                    prop="type"
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
                      v-if="prepareToSave"
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
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onStartProcess(row.id)">Начать</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onChangeProcess(row.id)">Изменить</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onDuplicateProcess(row.id)">Дублировать</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateDraftFromTemplate(row.id)">Создать черновик из этого</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateTemplateFromDraftOrReady(row.id)">Создать шаблон из этого</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToDraft(row.id)">В черновики</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToReady(row.id)">В готовые</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onToTemplate(row.id)">В шаблоны</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onRemoveProcess(row.id)">Удалить</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToTrash(row.id)">В мусарню</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onFromTrash(row.id)">На волю</div>-->
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
            <el-tab-pane label="Шаблоны">
              <AppTransTable
                  class="trans-table"
                  :data="templateProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="templateProcessesGridMode"
                  @rowClick="onRowClick"
                  :key="renderKeyTemplateProcesses"
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
                </TtColumn>
                <TtColumn
                    label="Тип"
                    prop="type"
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
                      v-if="prepareToSave"
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
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onStartProcess(row.id)">Начать</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onChangeProcess(row.id)">Изменить</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onDuplicateProcess(row.id)">Дублировать</div>
                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateDraftFromTemplate(row.id)">Создать черновик из этого</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateTemplateFromDraftOrReady(row.id)">Создать шаблон из этого</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToDraft(row.id)">В черновики</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToReady(row.id)">В готовые</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToTemplate(row.id)">В шаблоны</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onRemoveProcess(row.id)">Удалить</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToTrash(row.id)">В мусарню</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onFromTrash(row.id)">На волю</div>-->
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
            <el-tab-pane label="Корзинка">
              <AppTransTable
                  class="trans-table"
                  :data="deletedProcessesSortedSource"
                  :cardMode="{
                          breakpoint: 'sm',
                          titleWidth: 'calc(15% + 100px)', // ширина столбца заголовков
                        }"
                  v-model:gridMode="deletedProcessesGridMode"
                  @rowClick="onRowClick"
                  :key="renderKeyDeletedProcesses"
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
                </TtColumn>
                <TtColumn
                    label="Тип"
                    prop="type"
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
                      v-if="prepareToSave"
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
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onStartProcess(row.id)">Начать</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onChangeProcess(row.id)">Изменить</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onDuplicateProcess(row.id)">Дублировать</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateDraftFromTemplate(row.id)">Создать черновик из этого</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateTemplateFromDraftOrReady(row.id)">Создать шаблон из этого</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToDraft(row.id)">В черновики</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToReady(row.id)">В готовые</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToTemplate(row.id)">В шаблоны</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onRemoveProcess(row.id)">Удалить</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToTrash(row.id)">В мусарню</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onFromTrash(row.id)">На волю</div>
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
                  v-model:gridMode="allProcessesGridMode"
                  @rowClick="onRowClick"
                  :key="renderKeyAllProcesses"
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
                </TtColumn>
                <TtColumn
                    label="Тип"
                    prop="type"
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
                      v-if="prepareToSave"
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
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onStartProcess(row.id)">Начать</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onChangeProcess(row.id)">Изменить</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onDuplicateProcess(row.id)">Дублировать</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateDraftFromTemplate(row.id)">Создать черновик из этого</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onCreateTemplateFromDraftOrReady(row.id)">Создать шаблон из этого</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToDraft(row.id)">В черновики</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToReady(row.id)">В готовые</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onToTemplate(row.id)">В шаблоны</div>-->
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onRemoveProcess(row.id)">Удалить</div>-->
                        <div class="menu-item d-flex align-items-center" @click.stop="onToTrash(row.id)">В мусарню</div>
<!--                        <div class="menu-item d-flex align-items-center" @click.stop="onFromTrash(row.id)">На волю</div>-->
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
              v-if="!prepareToSave"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onCreateProcess"
          >
            Создать пустой черновик
          </button>
          <button
              v-if="!prepareToSave"
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
              v-if="!prepareToSave"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onSelectProcesses"
          >
            Выбрать процессы для сохранения
          </button>
          <button
              v-if="prepareToSave"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onCancel"
          >
            Отмена
          </button>
          <button
              v-if="prepareToSave"
              :disabled="selectedIDs.length===sortedSource.length"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onSelectAll">
            Выбрать все
          </button>
          <button
              v-if="prepareToSave"
              :disabled="selectedIDs.length===0"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onUnselectAll">
            Развыбрать все
          </button>
          <button
              v-if="prepareToSave"
              :disabled="selectedIDs.length===0"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onSave"
          >
            Сохранить выбранные
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
      sortMode: {...defaultSortOrder},
      prepareToSave: false,
      checkedList: {},
      currentRow: null,
      openedMenus: {},

    }
  },

  computed: {
    renderKeyAllProcesses() {
      return 'all'+this.prepareToSave.toString();
    },
    allProcessesGridMode() {
      return {
        xxl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        xl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        lg: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        md: '20px 2fr 2fr 1fr 1fr 1fr 40px',
      }
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

    renderKeyReadyProcesses() {
      return 'draft'+this.prepareToSave.toString();
    },
    readyProcesses() {
      return this.source.filter((v)=>(v.type === 'ready' && v.deleted === false));
    },
    readyProcessesGridMode() {
      return {
        xxl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        xl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        lg: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        md: '20px 2fr 2fr 1fr 1fr 1fr 40px',
      }
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

    renderKeyDraftProcesses() {
      return 'draft'+this.prepareToSave.toString();
    },
    draftProcesses() {
      return this.source.filter((v)=>v.type === 'draft' && v.deleted === false);
    },
    draftProcessesGridMode() {
      return {
        xxl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        xl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        lg: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        md: '20px 2fr 2fr 1fr 1fr 1fr 40px',
      }
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

    renderKeyTemplateProcesses() {
      return 'template'+this.prepareToSave.toString();
    },
    templateProcesses() {
      return this.source.filter((v)=>v.type === 'template' && v.deleted === false);
    },
    templateProcessesGridMode() {
      return {
        xxl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        xl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        lg: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        md: '20px 2fr 2fr 1fr 1fr 1fr 40px',
      }
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

    renderKeyDeletedProcesses() {
      return 'deleted'+this.prepareToSave.toString();
    },
    deletedProcesses() {
      return this.source.filter((v)=>v.deleted === true);
    },
    deletedProcessesGridMode() {
      return {
        xxl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        xl: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        lg: '20px 2fr 2fr 1fr 1fr 1fr 40px',
        md: '20px 2fr 2fr 1fr 1fr 1fr 40px',
      }
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

    selectedIDs() {
      return Object.keys(this.checkedList).filter((v) => {
        if (this.checkedList[v] === true) return v
      });
    },
  },
  methods: {
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
      this.prepareToSave = true;
    },
    onCancel() {
      this.prepareToSave = false;
    },
    onSave() {
      this.$emit('doAction', 'save', this.selectedIDs, null);
      this.prepareToSave = false;
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
    onChangeProcess(v) {
      this.$emit('doAction', 'change', [v], null);
      this.openedMenus = {};
    },
    onDuplicateProcess(v) {
      this.$emit('doAction', 'duplicate', [v], null);
      console.log(v);
      this.openedMenus = {};
    },
    onRemoveProcess(v) {
      this.$emit('doAction', 'remove', [v], null);
      this.openedMenus = {};
    },
    onToDraft(v) {
      this.$emit('doAction', 'toDraft', [v], null);
      this.openedMenus = {};
    },
    onToReady(v) {
      this.$emit('doAction', 'toReady', [v], null);
      this.openedMenus = {};
    },
    onToTemplate(v) {
      this.$emit('doAction', 'toTemplate', [v], null);
      this.openedMenus = {};
    },
    onCreateDraftFromTemplate(v) {
      this.$emit('doAction', 'fromTemplate', [v], null);
      this.openedMenus = {};
    },
    onCreateTemplateFromDraftOrReady(v) {
      this.$emit('doAction', 'fromDraftOrReady', [v], null);
      this.openedMenus = {};
    },
    onToTrash(v) {
      this.$emit('doAction', 'toTrash', [v], null);
      this.openedMenus = {};
    },
    onFromTrash(v) {
      this.$emit('doAction', 'fromTrash', [v], null);
      this.openedMenus = {};
    },


    onStartProcess(v) {
      this.$emit('doAction', 'start', [v], null);
      this.openedMenus = {};
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
        top: -44px;
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

}
</style>
