<template>
    <div class="ppcEditorInput v-if=!!attr">
        <label class="title" :for="attr.key">{{attr.inpLabel}}</label>
        <div v-if="attr.inpType==='number'">
            <input type="number" :id="attr.inpLabel" min="0"
                   v-model="model"/>
        </div>
        <div v-else-if="attr.inpType==='select'">
            <select v-model="model" v-if="Array.isArray(attr.options)"
                    :id="attr.inpLabel"
                    >
                <option :value="opt.value" v-for="opt in attr.options">{{opt.title}}</option>
            </select>
            <select v-model="model" v-else-if="typeof(attr.options)==='string' && !![attr.options]"
                    :id="attr.inpLabel+'--str'"
                    >
                <option :value="opt.value" v-for="opt in this[attr.options]">{{opt.title}}</option>
            </select>
            <div class="error" v-else>Bad select ('options' undefined)</div>
        </div>
        <div v-else>
            <input type="text" :id="attr.inpLabel"
                   v-model="model"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ppcEditorInput",
        components: {},
        props: ['attr', 'process'],
        emits: ['update:attr'],
        data() {
            return {}
        },
        computed: {
            model:{
                get(){return this.attr.value},
                set(v){
                    console.log("set model >>", v);
                    this.$emit('update:attr', {...this.attr, value: v});
                },
            },
            userVars(){
                let opts = [...this.process.vars];
                opts.shift();
                opts.shift();
                return opts.map(v=>({
                        title: v.name,
                        value: v.name,
                    }));
            },
        },
        methods: {},
        mounted(){
        },
    }
</script>

<style lang="scss">
    .ppcEditorInput {
        width: 100%;
        /*border-bottom: 1px solid gray;*/
        height: auto;
        position: relative;
        label {
            position: absolute;
            top: 1px;
            left: 0;
            height: 16px;
            z-index: 1;
            display: block;
            background-color: hsl(180, 6%, 93%);
            border-radius: 0px 5px 0 0;
            border: 1px solid hsl(180, 20%, 88%);
            color: hsl(180, 30%, 30%);
            line-height: 13px;
            font-family: 'Arial',serif;
            font-size: 11px;
            text-shadow: 0 0 0 black;
            padding: 0 8px;
        }
        input, select {
            height: 28px;
            width: calc(100% - 10px);
            margin: 13px 0 3px 10px;
            padding: 0 0 0 5px;
            line-height: 28px;
            border: 1px solid hsl(0, 0%, 90%);
        }
        input {
            padding: 0 0 0 8px;
        }
    }
</style>
