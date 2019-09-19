<template>
    <el-dialog
    custom-class='address-picker'
    title="位置搜索"
    :visible.sync="visible"
    @opened="opened"
    :before-close="handleClose">
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
                <p><i class="el-icon-search" ></i><font v-html="renderAddress(item.address)"></font><span>{{item.city}}</span></p>
            </el-option>
        </el-select>
        <div id="aMap-container" style="height:50vh;margin:10px 0"></div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="onOk">确 定</el-button>
        </span>
    </el-dialog>
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
        value:null,
        id:null,
        visible:Boolean,
    },
    watch:{
        visible(val){
            if(val){
                this.reset();
                this.queryString = this.value;
            }
        },
        id(val){
            this.key = val;
        }
    },
    data(){
        return{
            queryString:'',
            addressList:[],
            map:null,
            addressLoading:false,
            marker:null,
            data:{},
            key:'',
            hasClick:false
        }
    },
    async created () {
        // 已载入高德地图API，则直接初始化地图
        if (!window.AMap) {
            await this.remoteLoad();
        }
    },
    mounted(){

    },
    methods:{
        reset(){
            this.hasClick = false;
            this.data = {};
            this.queryString = '';
            this.addressList = [];
            if(this.aMap){
                this.aMap.remove(this.marker);
            }
        },
        async opened(){
            if(!this.aMap){
                await this.initMap();
                if(this.value){
                    this.showPosition();
                }
            }else{
                if(this.value){
                    this.showPosition();
                }
            }
        },
        remoteLoad(){
            let script = document.createElement('script');
            script.src="https://webapi.amap.com/maps?v=1.4.15&key=73b8b5e6c588c4e95124269591ff89f0";
            document.body.appendChild(script);
        },
        initMap(){
            const $this = this;
            this.aMap = new AMap.Map('aMap-container', {
                resizeEnable: true,
                zoom: 13//初始视窗
            });
            this.marker = new AMap.Marker({
                position: $this.aMap.getCenter(),
                //draggable: true,
                cursor: 'move',
                raiseOnDrag: true
            });
            AMap.service('AMap.Geocoder',function(){
                //实例化Geocoder
                $this.geocoder = new AMap.Geocoder({
                    city: "全国"//城市，默认：“全国”
                });
            });

            AMap.plugin('AMap.Geolocation', function () {
                var geolocation = new AMap.Geolocation({
                    showMarker: false,
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：5s
                    zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
                });
                $this.aMap.addControl(geolocation);
                geolocation.getCurrentPosition(function (status, result) {
                    console.info(result);
                });
            });


            this.aMap.on('click', this.showInfoClick);
        },
        showInfoClick(e){
            this.hasClick = true;
            this.writeAddress([e.lnglat.getLng(), e.lnglat.getLat()]);
            this.marker.setMap(this.aMap);
            this.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()]);
        },
        writeAddress(lnglatXY){
            const $this = this
            this.geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    const addressComponent = result.regeocode.addressComponent
                    const data = {
                        city:addressComponent.city,
                        address:result.regeocode.formattedAddress,
                        // value:addressComponent.street + addressComponent.streetNumber + addressComponent.neighborhood + addressComponent.building,
                        value:result.regeocode.formattedAddress,
                        location:{
                            lat: lnglatXY[1],
                            lng: lnglatXY[0]
                        }
                    }
                    $this.data = data;
                    $this.queryString = data.value;
                }
            }); 
        },
        addMarker(lnglatXY) {
            this.marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: lnglatXY
            });
            this.marker.setMap(map);
            this.aMapmap.setFitView();// 执行定位
        },
        handleClose(){
            this.$emit("update:visible", false);
        },
        renderAddress(text,name){
            text = text.replace(this.queryString,"<b style='color:#333'>"+this.queryString+"</b>");
            return text
        },
        querySearch(queryString) {
            const $this = this;
            this.addressLoading = true;
            $this.aMap.getCity( function(info){
                AMap.plugin('AMap.Autocomplete', function(){
                // 实例化Autocomplete
                var autoOptions = {
                    city: info.city
                }
                var autoComplete= new AMap.Autocomplete(autoOptions);
                    autoComplete.search(queryString, function(status, result) {
                        // 搜索成功时，result即是对应的匹配数据
                        let res = [];
                        if(result && JSON.stringify(result) != '{}' && result.tips && result.tips.length){
                            res = result.tips.filter(item=>item.id)
                            $this.searchComplete(res)
                        }else{
                            $this.searchComplete(res)
                        }
                    })
                })
            });
        },
        showPosition(){
            const $this = this;
            $this.geocoder.getLocation(this.value, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    const geocodes = result.geocodes[0]
                    const addressComponent = geocodes.addressComponent
                    const location = geocodes.location
                    const data = {
                        city:addressComponent.city,
                        address:$this.hasClick?geocodes.formattedAddress:$this.queryString,
                        value:geocodes.formattedAddress,
                        location:location
                    }
                    $this.data = data;
                    $this.marker.setMap($this.aMap);
                    $this.marker.setPosition([$this.data.location.lng,$this.data.location.lat]);
                    $this.aMap.panTo([$this.data.location.lng,$this.data.location.lat]);
                }
            })
        },
        searchComplete(result) {
            let list = []
            if(result && result.length){
                for(let i =0;i<result.length;i++){
                    let _value = result[i];
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
            if(item){
                this.queryString = item.address;
                this.data = item;
                this.marker.setMap(this.aMap);
                this.marker.setPosition([item.location.lng,item.location.lat]);
                this.aMap.panTo([item.location.lng,item.location.lat]);
            }
        },
        cancel(){
            if(!this.value){
                this.reset();
            }
            this.handleClose();
        },
        onOk(){
            this.$emit('change',this.data,this.key);
            this.handleClose();
        },
        clear(){
            this.reset();
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
    .address-picker{
        .el-dialog__body{
            padding:20px 20px 0;
        }
    }
</style>

