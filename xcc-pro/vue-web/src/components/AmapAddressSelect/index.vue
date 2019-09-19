<template>
    <!--<el-autocomplete-->
        <!--v-model="queryString"-->
        <!--popper-class="inline-input"-->
        <!--:disabled="disabled"-->
        <!--clearable-->
        <!--:fetch-suggestions="querySearch"-->
        <!--:placeholder="placeholder"-->
        <!--:trigger-on-focus="false"-->
        <!--@select="handleSelect"-->
        <!--@clear="clear">-->
        <!--<template slot-scope="{item}">-->
            <!--<p><i class="el-icon-search" ></i><font v-html="renderAddress(item.address)"></font><span>{{item.city}}</span></p>-->
        <!--</template>-->
    <el-select
        v-model="queryString"
        filterable
        remote
        clearable
        reserve-keyword
        popper-class="amap-address-select"
        :placeholder="placeholder"
        :remote-method="querySearch"
        :loading="addressLoading"
        @change="handleSelect"
        @clear="clear">
        <el-option
            v-for="(item,i) in addressList"
            :key="i"
            :value="item">
            <p><i class="el-icon-search" ></i><font v-html="renderAddress(item.value)"></font><span>{{item.city}}</span></p>
        </el-option>
        <div id='amap-container' style="display:none"></div>
    </el-select>
    <!--</el-autocomplete>-->
</template>

<script>
import {tool} from '@/utils/common'
import {isInclude} from '@/utils/index'

export default {
    name:'amap-address-select',
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
        value:String,
        id:null
    },
    watch:{
        value: {
            handler(val, oldVal) {
                this.queryString = val
            },
            deep: true,
            immediate: true
        },
    },
    data(){
        return{
            queryString:'',
            addressList:[],
            map:null,
            addressLoading:false
        }
    },
    mounted(){
        let script = document.createElement("script");
        if(!isInclude("https://webapi.amap.com/maps?v=1.4.15&key=73b8b5e6c588c4e95124269591ff89f0")){
            script.src = "https://webapi.amap.com/maps?v=1.4.15&key=73b8b5e6c588c4e95124269591ff89f0";
            document.body.appendChild(script);
        }
    },
    methods:{
        renderAddress(text,name){
            text = text.replace(this.queryString,"<b style='color:#333'>"+this.queryString+"</b>");
            return text
        },
        querySearch(queryString) {
            const $this = this
            this.addressLoading = true
            AMap.plugin('AMap.Autocomplete', function(){
                // 实例化Autocomplete
                var autoOptions = {
                    city: '全国'
                }
                var autoComplete= new AMap.Autocomplete(autoOptions);
                    autoComplete.search(queryString, function(status, result) {
                        // 搜索成功时，result即是对应的匹配数据
                        $this.searchComplete(result)
                    })
                })
        },
        searchComplete(result) {
            let list = []
            if(JSON.stringify(result) !== '{}' && result && result.tips &&result.tips.length){
                for(let i =0;i<result.tips.length;i++){
                    let _value = result.tips[i];
                    let city = _value.district;
                    let value = _value.name;
                    let address = _value.district+_value.address +_value.name;

                    list.push({
                        value,
                        city,
                        address,
                        location: _value.location
                    })
                }
            }

            this.addressLoading = false
            this.addressList = list;
        },
        handleSelect(item) {
            this.$emit('change',item,this.id)
        },
        clear(){
            this.$emit('change',{},this.id)
        }
    }
    
}
</script>

<style lang="scss">
    .amap-address-select{
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

