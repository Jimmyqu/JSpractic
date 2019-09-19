<template>
    <div class="container">
        <div class="box">
            <h2 class="padding">基本资料</h2>
            <ul class="detail shadow padding">
                <li><label class="required">所属组织</label>
                <p>{{detail.companyName}}</p>
                </li>
                <li ><label class="required">车牌号</label>
                <p>{{detail.plate}}</p>
                </li>
                <li><label class="required">车型</label>
                <p>{{detail.modelName}}</p>
                </li>
                <li><label class="required">颜色</label>
                    <p>{{detail.colorName}}</p>
                </li>
                <li><label class="required">注册城市</label>
                <p>{{detail.registerCity}}</p>
                </li>
            </ul>
            <h2 class="padding">车辆信息</h2>
            <ul class="detail shadow padding">
                <li><label>车架号</label>
                <p>{{detail.vin || '--'}}</p>
                </li>
                <li ><label>发动机号</label>
                <p>{{detail.engineNo || '--'}}</p>
                </li>
                <li><label>机动车登记证</label>
                <p>{{detail.certificate || '--'}}</p>
                </li>
                <li><label>行驶证号</label>
                <p>{{detail.licenseNumber || '--'}}</p>
                </li>
                <li><label>车辆状态</label>
                <p>{{detail.taskStatusText || '--'}}</p>
                </li>
            </ul>
            <h2 class="padding">证照</h2>
            <ul class="detail shadow padding other">
                <li>
                    <fileDetail :fileList="fileList"></fileDetail>
                </li>
            </ul>
        </div>
        <div class="operation">
            <button class="edit" type="primary" @click="onEdit" >编辑</button>
       </div>
    </div>
</template>

<script>
import { get, post } from '../../../utils/request'
import { tool } from '../../../utils/common'
import fileDetail from '@/components/fileDetail'

export default {
    mixins:[tool],
    components:{ fileDetail },
    data(){
        return {
            detail:{
            },
            fileList:[]
        }
    },
    computed: {

    },
    watch: {
        
    },
    methods: {
        getDetail(){
            this.fileList = [];
            this.$ajax.get({
                url:'operation_app/appVehicle/detail/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.detail = res.data;
                    console.log(this.detail)
					if(res.data.licensePic){
					    this.fileList = this.fileList.concat(JSON.parse(res.data.licensePic))
					}
                    if(res.data.certificatePic){
                        this.fileList = this.fileList.concat(JSON.parse(res.data.certificatePic))
                    }
                }
            })
        },
        onEdit(){
            wx.navigateTo({ url:'/pages/vehicle/add/index?id='+this.detail.id});
        },
    },
    onShow(){
        this.getDetail();
    },
    onUnload(){
        Object.assign(this, this.$options.data());
    }
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>
