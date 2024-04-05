<template>
    <div class="AppTransTable" :class="['mode_'+mode, 'screenType_'+screen.type]"
         :style="colsDefinition"
         :key="renderKey"
    >
        <template v-if="mode==='card'">
            <div class="tt-header">
                <!--        :key="screen.type"-->
                <tt-header :mode="mode">
                    <slot name="default"></slot>
                </tt-header>
            </div>
            <tt-card v-for="(row, idx) of data" :key="idx"
                     :row="row"
                     :titleWidth="cardMode.titleWidth"
            >
                <slot name="default"></slot>
            </tt-card>
        </template>
        <template v-else>
            <div class="tt-header">
                <tt-header :mode="mode" :key="screen.type">
                    <slot name="default"></slot>
                </tt-header>
            </div>
            <div class="tt-rows">
                <tt-row :row="row" :rowIdx="idx" v-for="(row, idx) of data"
                        @click.native="$emit('rowClick', {row, rowIdx: idx})"
                        :key="idx">
                    <slot name="default"></slot>
                </tt-row>
            </div>
        </template>
    </div>
</template>

<script>
import TtRow from './TtRow.vue';
import TtHeader from './TtHeader.vue';
import TtCard from './TtCard.vue';

import {mapState} from "vuex";

let self;
export default {
    name: "AppTransTable",
    components: {TtRow, TtHeader, TtCard},
    // props: ['data', 'cardMode'],
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        cardMode: {
            type: Object,
            default() {
                return null;
            },
            syntax: {
                breakpoint: 'sm',
                titleWidth: '35%', // ширина столбца заголовков
            }
        },
        gridMode: {
            type: Object,
            default() {
                return null;
            },
            description: 'Определет ширину столбцов в гриде для разных сайзов',
            syntax: {
                xxl: '1fr 2fr 100px 30% 2fr',
                xl: '1fr 2fr 100px 30% 2fr',
                lg: '2fr 3fr 100px 30% 4fr',
                md: '2fr 180px 100px 25% 4fr',
            }
        },
    },
    provide() {
        return {
            mode: {
                get value() {
                    return self?.mode;
                }
            }
        };
    },
    data() {
        return {
            screenTypes: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
            GridMode: {},
            renderKey: 0,
        };
    },
    computed: {
        ...mapState(['screen']),
        mode() {
            const st = this.screenTypes;
            // debugger
            return (st.includes(this.screen.type) && !!this?.cardMode?.breakpoint)
                ? 'card'
                : !!this.gridMode
                    ? 'grid'
                    : 'table';
        },
        colsDefinition() {
            if (this.mode !== 'grid') {
                return {};
            } else {
                let st = this.screen.type;
                return {
                    gridTemplateColumns: this.GridMode[st],
                };
            }
        },
    },
    methods: {
        truncScreenTypes() {
            // debugger;
            const i = this.screenTypes.findIndex(v => v === this.cardMode.breakpoint);
            this.screenTypes = this.screenTypes.slice(0, i + 1);
        },
        gridModeSetup() {
            if (!!this.gridMode) {
                let m = Object.values(this.gridMode)[0];
                this.GridMode = this.screenTypes.reduceRight((s, v) => {
                    m = s[v] = this.gridMode[v] || m;
                    return s;
                }, {});
            }
        },
    },
    watch: {
        data: function(v) {
            this.renderKey++;
        }
    },
    mounted() {
        self = this;
        this.gridModeSetup();
        if (!!this?.cardMode?.breakpoint) {
            this.truncScreenTypes();
        }
    },
};
</script>

<style lang="scss">
/****  AppTransTable  ****/
.AppTransTable {
  width: 100%;
  height: auto;
  border: 1px solid var(--border-light);
  border-top: none;

  &.mode_grid {
    display: grid;
    grid-template-rows: [hdr] 50px auto;

    .gHeader {
      grid-area: hdr;
    }

    [hdr] .TtColumn {
      background-color: #6c757d !important;
    }

    .TtColumn.header {
      background-color: hsla(224, 14%, 50%, 0.35);
    }

    .tt-header, .tt-rows, .TtHeader, .TtRow {
      display: contents !important;
    }
  }
}
</style>
