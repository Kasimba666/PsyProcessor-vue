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
                        v-model:gridMode="gridMode"
                        @rowClick="onRowClick"
                        :key="prepareToSave"
                >

                    <TtColumn
                            label="Наименование"
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
                          @click="onToggleMenu">
                        <i class="ico ico-menu" style="font-size: 20px"></i>
                        <div
                            class="menu-container"
                            v-if="isMenuOpen && rowIdx === currentRow"
                        >
                          <div class="menu-item d-flex align-items-center" @click.stop="onStartProcess(row.id)">Начать</div>
                          <div class="menu-item d-flex align-items-center" @click.stop="onChangeProcess(row.id)">Изменить</div>
                          <div class="menu-item d-flex align-items-center" @click.stop="onDuplicateProcess(row.id)">Дублировать</div>
                          <div class="menu-item d-flex align-items-center" @click.stop="onRemoveProcess(row.id)">Удалить</div>
                          <div class="menu-item d-flex align-items-center" @click.stop="onCloseMenu">Отмена</div>
                        </div>

                      </div>
                    </template>

                  </TtColumn>

                </AppTransTable>

        </div>
        <div class="process-list-control">
          <button
              v-if="!prepareToSave"
              class="btn btn-outline-primary btn-actions btn-sm"
              @click="onCreateProcess"
          >
            Создать
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
import {mapState} from "vuex";

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
      isMenuOpen: false,

    }
  },

  computed: {
    selectedIDs() {
      return Object.keys(this.checkedList).filter((v)=>{if (this.checkedList[v]===true) return v});
    },
    gridMode() {
      return {
        xxl: '2fr 3fr 2fr 2fr 40px',
        xl: '2fr 3fr 2fr 2fr 40px',
        lg: '2fr 3fr 2fr 2fr 40px',
        md: '2fr 3fr 2fr 2fr 40px',
      }
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
      onRowClick(v) {
        this.currentRow = v.rowIdx;
      },
      onToggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      onCloseMenu() {
        this.isMenuOpen = false;
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
        this.source.forEach((v)=>{
          this.checkedList[v.id] = true;
        });
      },
      onUnselectAll() {
        this.source.forEach((v)=>{
          this.checkedList[v.id] = false;
        });
      },
      onCreateProcess() {
        this.$emit('doAction', 'create', [], null);
        this.isMenuOpen = false;
      },
      onChangeProcess(v) {
        this.$emit('doAction', 'change', [v], null);
        this.isMenuOpen = false;
      },
      onDuplicateProcess(v) {
        this.$emit('doAction', 'duplicate', [v], null);
        this.isMenuOpen = false;
      },
      onRemoveProcess(v) {
        this.$emit('doAction', 'remove', [v], null);
        this.isMenuOpen = false;
      },

      onStartProcess(v) {
        this.$emit('doAction', 'start', [v], null);
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
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: start;
        //border-radius: 5px 0px 5px 5px;
        border: 1px solid hsl(50, 30%, 65%);
        box-shadow: 2px 1px 12px 0px hsla(0, 0%, 50%, 0.7);
        background-color: white;
        z-index: 10;

        .menu-item {
          width: 100%;
          height: 30px;
          padding-left: 20px;
          padding-right: 20px;
          cursor: pointer;
          color: black;
          border-bottom: 1px solid hsl(50, 30%, 65%);
          font-size: 12px;
          &:last-child {
            border-bottom: none;
          }
          &:hover {
            background-color: hsl(50, 30%, 75%);
          }
        }
      }
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
