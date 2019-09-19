<template>
    <el-autocomplete
        :id="id"
        :name="id"
        v-model="queryString"
        popper-class="inline-input"
        :disabled="disabled"
        clearable
        :fetch-suggestions="querySearch"
        :placeholder="placeholder"
        :trigger-on-focus="false"
        @select="handleSelect"
        @clear="clear">
        <template slot-scope="{item}">
            <p><i class="el-icon-search" ></i><font v-html="renderAddress(item.address)"></font><span>{{item.city}}</span></p>
        </template>
    </el-autocomplete>
</template>

<script>
import {tool} from '@/utils/common'
export default {
    name:'address-select',
    mixins:[tool],
    props:{
        placeholder:{
            default(){
                return '请输入'
            },
            type:String
        },
        disabled:{
            type:Boolean,
            default(){
                return true
            }
        },
        id:String,
        value:String
    },
    watch:{
        value: {
            handler(val, oldVal) {
                this.queryString = val
            },
            deep: true,
            immediate: true
        },
        queryString(val){
            this.$emit("input", val,this.id);
        }
    },
    data(){
        return{
            queryString:'',
            addressList:[],
            map:null
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.map = new BMap.Map();
            this.initAddress(this.id);
        })
    },
    methods:{
        renderAddress(text,name){
            text = text.replace(this.queryString,"<b style='color:#333'>"+this.queryString+"</b>");
            return text
        },
        querySearch(queryString, cb) {
            this.queryString = queryString
            setTimeout(()=>{
                cb(this.addressList);
            },300)
        },
        initAddress(address) {
            const $this = this;
            let ac; 
            if(address){
                ac= new BMap.Autocomplete({
                        "input": address,
                        "location": $this.map,
                        "onSearchComplete":$this.searchComplete
                    }
                );
            }else{
                return
            }
        },
        searchComplete(result) {
            let list = []
            for(let i =0;i<result.Ar.length;i++){
                const r = result.Ar[i]
                let _value = result.Ar[i]
                let city = _value.province+_value.city+_value.district;
                let address = _value.business+_value.street+_value.streetNumber;
                let value = _value.province+_value.city+_value.district+_value.business+_value.street+_value.streetNumber;
                list.push({
                    value,
                    city,
                    address
                })
            }
            this.addressList = list;
        },
        handleSelect(item) {
            var geo = new BMap.Geocoder();
            geo.getPoint(item.value, function(point){
                if (point) {
                    //经度
                    item.lng = point.lng;
                    //纬度
                    item.lat = point.lat;
                }
            });
            this.$emit('change',item,this.id)
        },
        clear(){
            this.$emit('change',{},this.id)
        }
    }
    
}
</script>

<style lang="scss">
    .inline-input{
        ul li{
            white-space: pre-wrap;
            overflow: visible;
            text-overflow: clip;
            padding: 0 10px;
            p{
                margin: 0;
                font-size: 12px;
                line-height: 30px;
                .el-icon-search{
                    margin-right: 5px;
                }
                span{
                    color: #bbb;
                    margin-left: 5px;
                }
            }
        }
    }
</style>

