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
                            v-if="prepareToSave"
                            label=""
                            prop=""
                    >
                        <template  #default="{ row }">
                          <b-form-checkbox
                              v-model="checkedList[row.id]"
                              class="h-75"
                          >
                          </b-form-checkbox>
                        </template>
                    </TtColumn>

                    <TtColumn
                            label="Наименование"
                            prop="processTitle"
                            v-model:sortable="SortMode"
                    >

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
                            v-if="!prepareToSave"
                            label=""
                            prop=""
                            align="center"
                    >
                        <template #default="{row, rowIdx}">
                            <div
                              class="btn btn-outline-primary btn-menu btn-sm"
                              @click="onToggleMenu">
                                <i class="ico ico-menu"></i>
                              <div class="menu-context" v-if="isMenuOpen && rowIdx === currentRow">
                                <ul class="list-group">
                                  <li class="list-group-item">
                                    <a href="#">Начать</a>
                                  </li>
                                  <li class="list-group-item">
                                    <a href="#">Изменить</a>
                                  </li>
                                  <li class="list-group-item">
                                    <a href="#">Удалить</a>
                                  </li>
                                  <li class="list-group-item">
                                    <a href="#"
                                       @click.stop="onToggleMenu">Закрыть</a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                        </template>
                    </TtColumn>
                </AppTransTable>

        </div>
        <div class="process-list-control">
          <button
              v-if="!prepareToSave"
              class="btn btn-outline-primary btn-group-actions btn-sm"
              @click="onSelectProcesses"
          >
            Выбрать процессы для сохранения
          </button>
          <button
              v-if="prepareToSave"
              class="btn btn-outline-primary btn-group-actions btn-sm"
              @click="onCancel"
          >
            Отмена
          </button>
          <button
              v-if="prepareToSave"
              :disabled="selectedIDs.length===sortedSource.length"
              class="btn btn-outline-primary btn-group-actions btn-sm"
              @click="onSelectAll">
            Выбрать все
          </button>
          <button
              v-if="prepareToSave"
              :disabled="selectedIDs.length===0"
              class="btn btn-outline-primary btn-group-actions btn-sm"
              @click="onUnselectAll">
            Развыбрать все
          </button>
          <button
              v-if="prepareToSave"
              :disabled="selectedIDs.length===0"
              class="btn btn-outline-primary btn-group-actions btn-sm"
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
        xxl: `${this.prepareToSave ? '60px ' : ''}4fr 1fr 2fr 2fr${!this.prepareToSave ? ' 60px' : ''}`,
        xl: `${this.prepareToSave ? '60px ' : ''}4fr 1fr 2fr 2fr${!this.prepareToSave ? ' 60px' : ''}`,
        lg: `${this.prepareToSave ? '60px ' : ''}4fr 1fr 2fr 2fr${!this.prepareToSave ? ' 60px' : ''}`,
        md: `${this.prepareToSave ? '60px ' : ''}4fr 1fr 2fr 2fr${!this.prepareToSave ? ' 60px' : ''}`,
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
        console.log(this.isMenuOpen ? 'Открыть меню' : 'Закрыть меню');
      },

      onSelectProcesses() {
        this.prepareToSave = true;
      },
      onCancel() {
        this.prepareToSave = false;
      },
      onSave() {
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
      width: 30px;
      height: 30px;
      border-radius: 15px;
      color: hsl(50, 30%, 75%);
      border: 2px solid hsl(50, 30%, 65%);
      margin: 1px;
      font-size: 18px;
      align-items: center;
      justify-content: center;
      &:hover {
        color: white;
        background-color: hsl(50, 30%, 75%);
      }
    }
    .menu-context {
      position: absolute;
      top: -40px;
      right: 35px;
      width: 100px;
      display: inline-block;
      background-color: hsl(0, 0%, 95%);
      padding: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      z-index: 1;

      .list-group {
        font-size: 14px;
        list-style: none;
        .list-group-item {
          height: 30px;
          padding: 2px;
          a {
            color: black;
            text-decoration: none;
            &:hover {
              background-color: hsl(0, 0%, 87%);
            }
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
    //padding-right: 5px;
    margin: 10px;
  }

  .btn-group-actions {
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
