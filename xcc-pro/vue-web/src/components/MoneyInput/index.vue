<template>
    <el-input v-model="data" :placeholder="placeholder" :disabled="disabled" :clearable="clearable"
              @blur="toMoney" @focus="toNum" @clear="clear" >
        <template slot="append" v-if="unit">{{unit}}</template>
    </el-input>
</template>

<script>
    import { formatAmount } from '@/utils'
    export default {
        name: 'city-select',
        props:{
            clearable:null,
            placeholder:String,
            disabled:Boolean,
            value:[String,Number],
            unit:String,
        },
        watch:{
            value:{
                handler: function(val='',oldVal) {
                    if(val == null){
                        val = ''
                    }
                    if(val === ''){
                        this.set('');
                        this.data = val;
                        return;
                    }
                    val = val.toString();
                    if(val !== this.data.toString().replace(/,/g,"") && val) {
                        this.data = val;
                        this.toMoney();
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                data:"",
            };
        },

        methods: {
            toMoney(e){
                if(!isNaN(this.data)) {
                    this.data = formatAmount(this.data,2);
                    this.set(this.data.replace(/,/g,""));
                }
            },
            toNum(){
                if(this.data) {
                    this.data = this.data.replace(/,/g,"");
                    this.set(this.data);
                }
            },
            clear(){
                this.data = '';
                this.set(this.data);
            },
            set(data){
                this.$emit("input", data);
                this.$emit("blur", data);
            },
        },
        mounted(){

        },
    }
</script>
