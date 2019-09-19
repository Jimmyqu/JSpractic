<template>
    <div class="container">
        <div class="distribute shadow">
            <h1 class="padding">{{detail.assignmentTime}}<span>{{detail.passengerNum}}人</span></h1>
            <div class="body padding">
                <div class="address">
                    <img class="icon" src="/static/images/task/start.png" alt="start">
                    <p>{{detail.depAddress}}</p>
                </div>
                <div class="address">
                    <img class="icon" src="/static/images/task/end.png" alt="end">
                    <p>{{detail.desAddress}}</p>
                </div>
            </div>
        </div>
        <ul class="from padding shadow">
            <li>
                <p>服务司机</p>
                <div class="picker" @click="onPickDriver">
                    <p><span v-if="detail.newDriverName">{{detail.newDriverName}}</span><span v-if="!detail.newDriverName" class="placeholder">请选择服务司机</span><img class="more" src="/static/images/more.png" alt=""></p>
                </div>
            </li>
            <li>
                <p>服务车辆</p>
                <div class="picker">
                    <p><span v-if="detail.plate">{{detail.plate}}</span></p>
                </div>
            </li>
        </ul>
        <div class="operation">
            <button class="send" type="default" @click="onSend" >确认派发</button>
       </div>
    </div>
</template>

<script>
import { get, post } from '../../../utils/request'
import { tool } from '../../../utils/common'
import bus from '../../../utils/bus'

export default {
    mixins:[tool],
    data(){
        return {
            detail:{},
            driver:{},
        }
    },
    computed: {

    },
    watch: {
        
    },
    methods: {
        getDetail(){
            get({
                url:'operation_core/assignment/detail/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.detail = res.data;
                }
            })
        },
        onEdit(){
            wx.navigateTo({ url:'/pages/task/add/index?id='+this.detail.id});
        },
        onSend(){
            if(this.driver.driverId && this.driver.vehicleId && this.driver.id){
                post({
                    url:'operation_core/assignment/allocate',
                    data: this.driver
                }).then(res => {
                        if(res.status == 0){
                            this.showToast('派发成功','success');
                            setTimeout(()=>{
			                    this.goback();
                            },2000)
                        }else {
                            this.showToast(err.message);
                        }
                    })
            }else{
                this.showToast('请选择司机');
            }
        },
        onPickDriver(){
            wx.navigateTo({ url:'/pages/components/distributePicker/index?id='+this.detail.id});
        },
    },
    mounted(){
        this.getDetail();
        bus.$on('changeDriver', res => {
            this.$set(this.detail,'plate',res.plate);
            this.$set(this.detail,'newDriverName',res.driverName);

            this.$set(this.driver,'driverId',res.driverId);
            this.$set(this.driver,'vehicleId',res.vehicleId);
            this.$set(this.driver,'id',this.detail.id);
        })
    },
    onUnload(){
        Object.assign(this, this.$options.data());
    }
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>
