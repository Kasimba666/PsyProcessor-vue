<template>
    <div class="ppcEditorInput v-if=!!value">
        <label class="title" :for="value.key">{{value.inpLabel}}</label>
        <div v-if="value.inpType==='number'">
            <input type="number" :id="value.inpLabel" min="0"
                   v-model="model"/>
        </div>
        <div v-else-if="value.inpType==='select'">
            <select v-model="model" v-if="Array.isArray(value.options)"
                    :id="value.inpLabel"
                    >
                <option :value="opt.value" v-for="opt in value.options">{{opt.title}}</option>
            </select>
            <select v-model="model" v-else-if="typeof(value.options)==='string' && !![value.options]"
                    :id="value.inpLabel+'--str'"
                    >
                <option :value="opt.value" v-for="opt in this[value.options]">{{opt.title}}</option>
            </select>
            <div class="error" v-else>Bad select ('options' undefined)</div>
        </div>
        <div v-else>
            <input type="text" :id="value.inpLabel"
                   v-model="model"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ppcEditorInput",
        components: {},
        props: ['value', 'process'],
        data() {
            return {}
        },
        computed: {
            model:{
                get(){return this.value.value},
                set(v){
                    this.$emit('input', {...this.value, value: v});
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
