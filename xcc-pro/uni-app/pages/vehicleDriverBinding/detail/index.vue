<template>
    <div class="container">
        <div class="box">
            <ul class="detail shadow padding">
                <li><label>姓名</label>
					<p>{{detail.name}}</p>
                </li>
                <li ><label>手机号</label>
					<p>{{detail.phone}}</p>
                </li>
                <li><label>性别</label>
					<p>{{detail.sexText}}</p>
                </li>
                <li><label>绑定车辆</label>
                    <p>{{detail.plate || '--'}}</p>
                </li>
                <li><label>车型</label>
					<p>{{detail.vehicleModelInfoName || '--'}}</p>
                </li>
				<li><label>颜色</label>
					<p>{{detail.colorText || '--'}}</p>
                </li>
            </ul>
		</div>
        <div class="operation">
            <button class="edit" @click="onBindor">{{detail.plate?'解绑车辆':'绑定车辆'}}</button>
            <button class="edit" type="primary" @click="onRecord" >绑定记录</button>
       </div>
    </div>
</template>

<script>
import { tool } from '../../../utils/common'

export default {
    mixins:[tool],
    data(){
        return {
            detail:{
            },
			vehicleId:''
        }
    },
    methods: {
		onBindor(){
			if(!this.vehicleId || this.vehicleId == 'null'){
				wx.navigateTo({url:`/pages/vehicleDriverBinding/vehicleBinding/index?id=${this.detail.id}&name=${this.detail.name}&phone=${this.detail.phone}&sexText=${this.detail.sexText}&companyID=${this.detail.companyID}`});
				return;
			}
			const $this = this;
			wx.showModal({
			    title: '提示',
			    content: '是否确认解绑？',
			    success (res) {
			        if (res.confirm) {
			            $this.$ajax.post({
							url:"operation_app/driverVehicleBinding/unbind",
							data:{
								"driverId": $this.detail.id,
								"vehicleId": $this.vehicleId
							}}).then(res => {
			                if (res.status == 0) {
			                    $this.showToast('解绑成功','success');
			                    setTimeout(()=>{
			                        $this.goback();
			                    },2000)
			                }
			            });
			        } else if (res.cancel) {
			            console.log('用户点击取消')
			        }
			    }
			})
		},
        getDetail(){
            this.$ajax.get({
                url:'operation_app/driverVehicleBinding/driverInfo/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.detail = res.data;
                }
            })
        },
        onRecord(){
            wx.navigateTo({ url:'/pages/vehicleDriverBinding/bindingRecords/index?id='+this.detail.id});
        },
    },
    onShow(){
		this.vehicleId = this.$root.$mp.query.vehicleId
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
