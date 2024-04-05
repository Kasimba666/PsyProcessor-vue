<template>
    <div class="TtColumn" v-show="!hideMe"
         :class="[context, mode.v, {'sortable-header-cell':context==='header'&&!!sortable}]"
         :style="{justifyContent: Align}"
         @click="context==='header'&&!!sortable && $emit('update:sortable', prop)">
        <template v-if="context==='header'">
            <div class="d-contents" v-if="!!sortable"
            >
                <TtSortButton :field="prop" :cur-state="sortable" />
                <slot name="header">
                    <span v-html="label"></span>
                </slot>
            </div>
            <template v-else>
                <slot name="header">
                    <span class="default-header-label" v-html="label"></span>
                </slot>
            </template>
        </template>

        <slot name="default" :row="rowData" :rowIdx="rowIdx" v-else-if="context==='body'">
            <span class="default-cell" v-html="rowData[prop]"></span>
        </slot>
        <template  v-else>
            <div class="tt-title"><span v-html="label" /></div>
            <div class="tt-content">
                <slot name="default" :row="rowData" :rowIdx="rowIdx">
                    <span class="default-cell" v-html="rowData[prop]"></span>
                </slot>
            </div>
        </template>
    </div>
</template>

<script>
import TtSortButton from "./TtSortButton.vue";
import { mapState } from "vuex";
export default {
    name: "TtColumn",
    components: {TtSortButton},
    inject: ['rowData', 'rowIdx', 'context', 'mode'],
    props: ['prop', 'label', 'align', 'sortable'],
    data() {
        return {};
    },
    computed: {
        ...mapState(['screen']),
        Align(){
            let out = {justifyContent: 'start', textAlign: 'left'};
            if(this.mode === 'card') {
                return out;
            }
            switch (this.align) {
                case 'right' : {
                    out = {justifyContent: 'end', textAlign: 'right'};
                } break;
                case 'center' : {
                    out = {justifyContent: 'center', textAlign: 'center'};
                } break;
                default : {;}
            }
            return out;
        },
        hideMe(){
            return  !!this.screen.type && this.context === 'header' && !this.sortable && this.mode.v==='card';
        },
    },
    methods: {
    },
    mounted() {
    },
};
</script>

<style lang="scss">
/****  TtColumn  ****/
.TtColumn {
    //--ttc-align: v-bind(Align);
    width: 100%;
    min-height: 100%;
    height: auto;
    padding: 0px 5px;
    &:first-child, &.card {
        padding-left: 10px;
    }
    &:last-child {
        padding-right: 10px;
    }
    display: flex;
    align-items: center;
    &.header.card {
        width: auto;
        min-width: unset;

    }
    &.sortable-header-cell {
        cursor: pointer;
        padding: 0 10px 0 0;
        &:hover {
            box-shadow: inset 0 0 500px 0 hsla(0, 0%, 50%, 0.1);
            color: var(--link-hover-cl);
            text-shadow: 0 0 0 var(--link-hover-cl), 0 0 10px var(--text-contrast-8);
            i {
                text-shadow: 0 0 1px var(--link-hover-cl);
            }
        }
    }
}
</style>
