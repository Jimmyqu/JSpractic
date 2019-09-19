<template>
    <div class="container">
        <h2 class="padding">基本资料</h2>
        <ul class="from padding">
            <li :class="{'err':err.companyName}">
                <p class="required">所属组织</p>
                <div class="picker" @click="toDetail('/pages/components/organizationsPicker/index',addForm.companyId)">
                    <p><span v-if="addForm.companyName">{{addForm.companyName}}</span><span v-if="!addForm.companyName" class="placeholder">请选择所属组织</span></p>
                </div>
            </li>
            <li :class="{'err':err.plate}">
                <p class="required">车牌号</p>
                <input placeholder-style="color:#C7C7CC" maxlength="8" v-model="addForm.plate" type="text" placeholder="请输入车牌号">
            </li>
            <li :class="{'err':err.modelName}">
                <p class="required">车型</p>
				<div class="picker" @click="toDetail('/pages/components/vehicleTypePicker/index')">
				    <p><span v-if="addForm.modelName">{{addForm.modelName}}</span><span v-if="!addForm.modelName" class="placeholder">请选择车型</span></p>
				</div>
            </li>
            <li :class="{'err':err.colorName}">
                <p class="required">颜色</p>
                <div class="picker" @click="changSelectColorVisible">
                   <p><span v-if="addForm.colorName">{{addForm.colorName}}</span><span v-if="!addForm.colorName" class="placeholder">请选择颜色</span></p>
                </div>
            </li>
			<li :class="{'err':err.registerCity}">
				<p class="required">注册城市</p>
				<div class="picker" @click="toDetail('/pages/components/cityIndexPicker/index',addForm.registerCityId)">
				   <p><span v-if="addForm.registerCity">{{addForm.registerCity}}</span><span v-if="!addForm.registerCity" class="placeholder">请选择注册城市</span></p>
				</div>
			</li>
        </ul>
        <h2 class="padding">车辆信息</h2>
        <ul class="from padding">
            <li>
                <p>车架号</p>
                <input placeholder-style="color:#C7C7CC" maxlength="18" v-model="addForm.vin" placeholder="请输入车架号">
            </li>
            <li>
                <p>发动机号</p>
                <input placeholder-style="color:#C7C7CC" maxlength="18" v-model="addForm.engineNo" placeholder="请输入发动机号">
            </li>
            <li>
                <p>机动车登记证</p>
                <input placeholder-style="color:#C7C7CC" maxlength="18" v-model="addForm.certificate" placeholder="请输入机动车登记证">
            </li>
            <li >
                <p>行驶证号</p>
                <input placeholder-style="color:#C7C7CC" maxlength="18" v-model="addForm.licenseNumber" type="number" placeholder="请输入行驶证号">
            </li>
        </ul>
        <h2 class="padding">证照</h2>
        <ul class="from padding other">
            <li :class="{'err':err.licensePic}">
                <p class="required">行驶证图片</p>
                <upLoad :size="1" :fileList.sync="licensePic"></upLoad>
            </li>
            <li :class="{'err':err.certificatePic}">
                <p class="required">登记证图片</p>
                <upLoad :size="1" :fileList.sync="certificatePic"></upLoad>
            </li>
        </ul>
        <div class="padding onSubmit">
            <button type="primary" @click="onSubmit" >确定</button>
       </div>

		<!-- 颜色选择 -->	   
	   <div class="select-color" v-if="selectColorVisible" @click="changSelectColorVisible">
		   <ul class="wrap padding">
			   <li v-for="(color,i) in vehicleColorList" :key="i" @click="changeColor(color)">{{color.text}}
					<uni-icon v-if="color.value == addForm.color" type="checkmarkempty" color='#0091FF' size="30"></uni-icon>
			   </li>
		   </ul>
	   </div>
    </div>
</template>

<script>
import { get, post } from '../../../utils/request'
import { tool } from '../../../utils/common'
import { mapState, mapActions } from "vuex";
import bus from '../../../utils/bus'
import upLoad from '@/components/upLoad'
import uniIcon from "@/components/uni-icon/uni-icon.vue"

export default {
    mixins:[tool],
    components: {upLoad ,uniIcon},
    data(){
        return {
            addForm:{
				licensePic:'',
				certificatePic:''
			},
            err:{
                companyName:'',
				modelName:'',
                plate:'',
                colorName:'',
				registerCity:'',
				licensePic:'',
				certificatePic:''
            },
			vehicleColorList:[],
            licensePic: [],
            certificatePic: [],
			selectColorVisible: false
        }
    },
    watch: {
        addForm:{
            handler(val, oldVal){
                // this.formRule();
                // for(let key in this.err){
                //     if(this.addForm.hasOwnProperty(key) == true){
                //         if(this.addForm[key]){
                //             this.err[key] = ''
                //         }else{
                //             this.err[key] = 'err'
                //         }
                //     }
                // }
            },
            deep: true
        },
    },
    methods: {
        formRule(){
            return new Promise((resolve,reject)=>{
                let err = false;
                for(let key in this.err){
                    if(this.addForm[key]){
						this.err[key] = ''
                    }else if(key == 'licensePic' || key == 'certificatePic'){
						if((key == 'licensePic' && this.licensePic.length) || (key == 'certificatePic' && this.certificatePic.length)){
						    this.err[key] = ''
						}else{
						    this.err[key] = 'err';
						    err = true;
						}
					}else if(!this.addForm[key]){
                        this.err[key] = 'err';
                        err = true;
                    }
                }
                resolve(err)
            })
        },
		changSelectColorVisible(){
			this.selectColorVisible = !this.selectColorVisible
		},
		changeColor(color){
			this.$set(this.addForm,'color',color.value);
			this.$set(this.addForm,'colorName',color.text);
		},
        onSubmit(){
            let err = false
            this.formRule().then(err=>{
                if(err){
                    this.showToast('请填写完整！')
                    return;
                }else{
                    if (this.licensePic.length > 0) {
                        this.addForm.licensePic=JSON.stringify(this.licensePic);
                    }
                    if (this.certificatePic.length > 0) {
                        this.addForm.certificatePic=JSON.stringify(this.certificatePic);
                    }
                    post({
                        url:'operation_app/appVehicle/saveOrUpdate',
                        data:this.addForm
                    }).then(res=>{
                        if(res.status == 0){
                            this.showToast('提交成功','success')
                            setTimeout(()=>{
                                this.goback();
                            },1000)
                        }else{
                            this.showToast(res.message)
                        }
                    })
                }
            })
        },
        getDetail(){
            if(!this.$root.$mp.query.id) return;
            get({
                url:'operation_app/appVehicle/detail/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.addForm = res.data;
					this.addForm.registerCityId = res.data.registerCityId.split(',')[1]
					if (this.addForm.licensePic) {
					    this.licensePic=JSON.parse(this.addForm.licensePic);
					}
					if (this.addForm.certificatePic) {
					    this.certificatePic=JSON.parse(this.addForm.certificatePic);
					}
                }
            })
        },
		getVehicleColor(){
			this.$ajax.get({
			    url:'admin/dict/type/车辆颜色'
			}).then(res=>{
			    if(res.length > 0){
			        this.vehicleColorList = res;
			    }
			})
		}
    },
    onLoad(){
        if(!this.$root.$mp.query.id) return;
        wx.setNavigationBarTitle({
            title: '编辑司机' 
        })
    },
    mounted(){
        this.getDetail();
		this.getVehicleColor();
        this.$bus.$on('changeOrganization', res => {
            this.$set(this.addForm,"companyName",res.name);
            this.$set(this.addForm,"companyId",res.id);
        })
        this.$bus.$on('changeCity', res => {
            this.$set(this.addForm,"registerCity",res.name);
            this.$set(this.addForm,"registerCityId",res.id);
        })
        this.$bus.$on('vehicleModel', res => {
            this.$set(this.addForm,"modelName",res.modelInfo);
            this.$set(this.addForm,"vehicleModelInfoId",res.id);
        })
    },
    onUnload(){
        Object.assign(this, this.$options.data())
    }
}
</script>

<style lang="scss" scoped>
    @import './index.scss';
	.select-color{
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.3);
		overflow: hidden;
		z-index: 99;
		top: 0;
		right: 0;
		.wrap{
			position: absolute;
			width: 70%;
			height: 100%;
			background: #FFFFFF;
			overflow: auto;
			right: 0;
			top: 0;
			li{
				width: 100%;
				line-height: 38px;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #ececec;
			}
		}
	}
</style>
