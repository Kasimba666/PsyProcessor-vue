<script>
const defaultSortOrder = {
    field: 'name',
    order: 'DESC'
};
export default {
    name: "TableMixin",
    components: {},
    props: [],
    data() {
        return {
            defaultSortOrder: {...defaultSortOrder},
            sortMode: {...defaultSortOrder},
        };
    },
    computed: {
        SortMode: {
            get() {
                console.log('>> ', this.sortMode);
                return this.sortMode;
            },
            set(v) {
                if (v === this.defaultSortOrder.field && v === this.sortMode.field) {//если поле не поменялось и равно дефолтному
                    this.sortMode.order = (this.sortMode.order === 'ASC') ? 'DESC' : 'ASC';
                } else if (v === this.sortMode.field && this.sortMode.order === 'ASC') {//если поле не поменялось, и порядок был ASC
                    this.sortMode = {...this.defaultSortOrder};//порядок ставим по дефолту, т.е. DESC
                } else {
                    if (v === this.sortMode.field) {//поле не поменялось, но порядок не ASC
                        this.sortMode.order = 'ASC';
                    } else {//поле поменялось
                        this.sortMode = {
                            field: v,
                            order: 'DESC'
                        };
                    }
                }
            }
        },
    },
    methods: {},
    mounted() {
        console.log('mixin activated!!!');
    },
};
</script>

