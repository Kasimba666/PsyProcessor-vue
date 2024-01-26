<template>
    <div class="ppList">
        <b-table striped small hover
                 selectable
                 select-mode="single"
                 :items="processList"
                 :fields="fields"
                 @row-selected="onRowSelected"
        >

        </b-table>
    </div>
</template>
<script>

export default {
    name: "ppList",
    props: ['processList'],
    emits: ['update:processList', 'setCurrProcess'],
    data() {
        return {
            currProcess: null,
            fields: [
                {key: 'processTitle', label: 'Наименование', sortable: 'true'},
                {key: 'processCategory', label: 'Категория', sortable: 'true'},
                {key: 'createdDt', label: 'Дата создания', sortable: 'true'},
                {key: 'changedDt', label: 'Дата изменения', sortable: 'true'},
                {key: 'description', label: 'Описание', sortable: 'true'},

            ],
        }
    },
    computed: {
        rows() {
            return this.processList.map(v => {
                return {
                    processTitle: v.processTitle,
                    processCategory: v.processCategory,
                    createdDt: v.createdDt,
                    changedDt: v.changedDt,
                    description: v.description
                }
            });
        },


    },
    methods: {
        onRowSelected() {
            this.$emit('setCurrProcess', this.currProcess);
        },
    },
    mounted() {

    },
}

</script>

<style lang="scss">
.ppList {
  width: 100%;
  height: auto;
}

</style>
