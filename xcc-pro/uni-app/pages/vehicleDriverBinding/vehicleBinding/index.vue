<template>
    <div class="container">
		<ul class="from shadow padding">
			<li><p>姓名</p>
				<input v-model="detail.name" disabled="true"/>
			</li>
			<li ><p>手机号</p>
				<input v-model="detail.phone" disabled="true"/>
			</li>
			<li><p>性别</p>
				<input v-model="detail.sexText" disabled="true"/>
			</li>
		</ul>
		<ul class="from shadow padding margin">
			<li>
				<p class="required">绑定车辆</p>
				<div class="picker" @click="toDetail('/pages/components/vehiclePicker/index',detail.companyID)">
				   <p><span v-if="detail.plate">{{detail.plate}}</span><span v-if="!detail.plate" class="placeholder">请选择绑定车辆</span></p>
				</div>
			</li>
		</ul>
        <div class="operation">
            <button class="edit" type="primary" @click="onSubmit" >保存</button>
       </div>
    </div>
</template>

<script>
import { get, post } from '../../../utils/request'
import { tool } from '../../../utils/common'

export default {
    mixins:[tool],
    data(){
        return {
            detail:{},
			vehicleId:''
        }
    },
    methods: {
        onSubmit(){
			if(!this.vehicleId){
				this.showToast('请选择绑定车辆！');
				return;
			}
           this.$ajax.post({
			   url:'operation_app/driverVehicleBinding/bind',
			   data:{
					"driverId": this.detail.id,
					"vehicleId": this.vehicleId
			   }
		   }).then(res=>{
			   if(res.status == 0){
			       this.showToast('绑定成功','success')
			       setTimeout(()=>{
			           this.goback();
			       },1000)
			   }else{
			       this.showToast(res.message)
			   }
		   })
        },
    },
	mounted(){
	    this.$bus.$on('vehicleInfo', res => {
	        this.$set(this.detail,"plate",res.plate);
	        this.vehicleId = res.id;
	    })
	},
    onShow(){
		this.detail = this.$root.$mp.query;
    },
    onUnload(){
        Object.assign(this, this.$options.data());
    }
}
</script>

<style lang="scss" scoped>
    @import './index.css';
	.margin{
		margin-top: 16px;
	}
</style>
