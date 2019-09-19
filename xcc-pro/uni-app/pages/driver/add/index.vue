<template>
    <div class="container">
        <h2 class="padding">基本资料</h2>
        <ul class="from padding">
            <li :class="{'err':err.organizationName}">
                <p class="required">所属组织</p>
                <div class="picker" @click="toDetail('/pages/components/organizationsPicker/index',addForm.companyId)">
                    <p><span v-show="addForm.organizationName">{{addForm.organizationName}}</span><span v-show="!addForm.organizationName" class="placeholder">请选择乘所属组织</span></p>
                </div>
            </li>
            <li :class="{'err':err.name}">
                <p class="required">司机姓名</p>
                <input placeholder-style="color:#C7C7CC" maxlength="20" v-model="addForm.name" type="text" placeholder="请输入司机姓名">
            </li>
            <li :class="{'err':err.sex}">
                <p class="required">性别</p>
                <picker mode="selector" v-model="sex" :range="['男','女']" @change="event=>changeType(event,'sex')">
                    <view class="tui-picker-detail">
                        <p><span v-show="addForm.sex">{{sex == '0'?'男':'女'}}</span><span v-show="!addForm.sex" class="placeholder">请选择性别</span></p>
                    </view>
                </picker>
            </li>
            <li :class="{'err':err.phone}">
                <p class="required">手机号</p>
                <input placeholder-style="color:#C7C7CC" v-model="addForm.phone" maxlength="11" type="number" placeholder="请输入司机手机号">
            </li>
            <li :class="{'err':err.idCard}">
                <p class="required">身份证号</p>
                <input placeholder-style="color:#C7C7CC" v-model="addForm.idCard" maxlength="18" @blur="blurIdCard" placeholder="请输入身份证号">
            </li>
            <li :class="{'err':err.birthday}">
                <p class="required">出生日期</p>
                <input placeholder-style="color:#C7C7CC" :disabled="true" v-model="addForm.birthday" placeholder="出生日期">
            </li>
            <li>
                <p >年龄</p>
                <input placeholder-style="color:#C7C7CC" :disabled="true" v-model="addForm.age" placeholder="年龄">
            </li>
        </ul>
        <h2 class="padding">驾驶信息</h2>
        <ul class="from padding">
            <li :class="{'err':err.driverNo}">
                <p class="required">驾驶证号</p>
                <input placeholder-style="color:#C7C7CC" maxlength="18" v-model="addForm.driverNo" placeholder="请输入驾驶证号">
            </li>
            <li :class="{'err':err.driveDate}">
                <p class="required">申领日期</p>
                <picker mode="date" v-model="addForm.driveDate" @change="changeDriveDate">
                    <view class="tui-picker-detail">
                        <p><span v-show="addForm.driveDate">{{addForm.driveDate}}</span><span v-show="!addForm.driveDate" class="placeholder">申领日期</span></p>
                    </view>
                </picker>
            </li>
            <li>
                <p >准驾车型</p>
                <picker mode="selector" v-model="driveType" @change="event=>changeType(event,'driveType')" :range="['A1','A2','A3','B1','B2','C1','C2','C3']">
                    <view class="tui-picker-detail">
                        <p><span v-show="addForm.driveType">{{driveTypeStatus[driveType]}}</span><span v-show="!addForm.driveType" class="placeholder">请选择准驾车型</span></p>
                    </view>
                </picker>
            </li>
            <li >
                <p >驾龄</p>
                <input placeholder-style="color:#C7C7CC" maxlength="3" v-model="addForm.driveAge" type="number" placeholder="请输入驾龄">
            </li>
        </ul>
        <h2 class="padding">服务信息</h2>
        <ul class="from padding">
            <li :class="{'err':err.workStatus}">
                <p class="required">在职状态</p>
                <picker mode="selector" v-model="workStatus" @change="event=>changeType(event,'workStatus')" :range="['在职','离职']">
                    <view class="tui-picker-detail">
                        <p><span v-show="addForm.workStatus">{{workStatus == '0'?'在职':'离职'}}</span><span v-show="!addForm.workStatus" class="placeholder">请选择在职状态</span></p>
                    </view>
                </picker>
            </li>
            <li :class="{'err':err.serviceCityId}">
                <p class="required">服务城市</p>
                <div class="picker" @click="toDetail('/pages/components/cityIndexPicker/index',addForm.serviceCityId)">
                    <p><span v-show="addForm.serviceCity">{{addForm.serviceCity}}</span><span v-show="!addForm.serviceCity" class="placeholder">请选择乘服务城市</span></p>
                </div>
            </li>
            <li :class="{'err':err.taskStatus}">
                <p class="required">任务状态</p>
                <picker mode="selector" v-model="taskStatus" :range="['空闲','任务中','休假']" @change="event=>changeType(event,'taskStatus')">
                    <view class="tui-picker-detail">
                        <p><span v-show="addForm.taskStatus">{{taskStatusType[taskStatus]}}</span><span v-show="!addForm.taskStatus" class="placeholder">请选择在职状态</span></p>
                    </view>
                </picker>
            </li>
        </ul>
        <h2 class="padding">证照</h2>
        <ul class="from padding other">
            <li>
                <p>身份证正面</p>
                <upLoad :size="1" :fileList.sync="idCardFrontPhoto"></upLoad>
            </li>
            <li>
                <p >身份证反面</p>
                <upLoad :size="1" :fileList.sync="idCardBackPhoto"></upLoad>
            </li>
            <li>
                <p>驾驶证照片</p>
                <upLoad :size="1" :fileList.sync="driverCardPhoto"></upLoad>
            </li>
            <li>
                <p>其他照片</p>
                <upLoad :size="2" :fileList.sync="otherPhoto"></upLoad>
            </li>
        </ul>
        <div class="padding onSubmit">
            <button type="primary" @click="onSubmit" >确定</button>
       </div>
    </div>
</template>

<script>
import { tool } from '../../../utils/common'
import upLoad from '@/components/upLoad'

export default {
    mixins:[tool],
    components: {upLoad },
    data(){
        return {
            addForm:{},
            err:{
                organizationName:'',
                name:'',
                sex:'',
                phone:'',
                idCard:'',
                birthday:'',
                driverNo:'',
                driveDate:'',
                workStatus:'',
                serviceCityId:'',
                taskStatus:''
            },
            taskStatusType:{
                '0':'空闲',
                '1':'任务中',
                '2':'休假',
            },
            driveTypeStatus:{
                '0':'A1',
                '1':'A2',
                '2':'A3',
                '3':'B1',
                '4':'B2',
                '5':'C1',
                '6':'C2',
                '7':'C3',
            },
            driveTypeStatusBack:{
                'A1':'0',
                'A2':'1',
                'A3':'2',
                'B1':'3',
                'B2':'4',
                'C1':'5',
                'C2':'6',
                'C3':'7',
            },
            workStatus:'0',
            driveType:'0',
            sex:'0',
            taskStatus:'0',
            idCardFrontPhoto: [],
            idCardBackPhoto: [],
            driverCardPhoto: [],
            otherPhoto: [],
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
        changeType(e,name){
            if(name == 'taskStatus' && e.target.value == 1){
                this.showToast('不可选！')
                return;
            }
            this[name] = e.target.value;
            if(name == 'driveType'){
                this.$set(this.addForm,name,this.driveTypeStatus[e.target.value]);
            }else{
                this.$set(this.addForm,name,e.target.value*1+1+'');
            }
        },
        blurIdCard(e){
            const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            if (reg.test(e.target.value)) {
                /*计算出生日期和年龄*/
                let birthday = this.getBirthdayFromIdCard(e.target.value);
                /*初始化出生日期和年龄*/
                const data = new Date(Date.parse(birthday.replace(/-/g, "/"))).format('yyyy-MM-dd');
                this.$set(this.addForm, 'birthday', data);
                const age = this.getAges(birthday);
                this.$set(this.addForm, 'age' + '', age);
            }
        },
        /*根据身份证号获取出生年龄*/
        getBirthdayFromIdCard(idCard) {
            var birthday = "";
            if (idCard != null && idCard != "") {
                if (idCard.length == 15) {
                    birthday = "19" + idCard.substr(6, 6);
                } else if (idCard.length == 18) {
                    birthday = idCard.substr(6, 8);
                }
                birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
            }
            return birthday;
        },
        getAges(str) {
            var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                var Y = new Date().getFullYear();
                return Y - r[1];
            }
        },
        changeDriveDate(e){
            if(new Date().getTime() < new Date(e.target.value).getTime()){
                this.showToast('申领日期不能大于当前时间！')
                return;
            }
            this.$set(this.addForm,'driveDate',e.target.value)
        },
        formRule(){
            return new Promise((resolve,reject)=>{
                let err = false;
                for(let key in this.err){
                    if(this.addForm[key]){
                        if(key == 'phone'){
                            if(/^((1[3-9][0-9])+\d{8})$/.test(this.addForm[key])){
                                this.err[key] = ''
                            }else{
                                this.err[key] = 'err';
                                err = true;
                            }
                        }else if(key == 'idCard'){
                            if((/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/).test(this.addForm[key])){
                                this.err[key] = ''
                            }else{
                                this.err[key] = 'err';
                                err = true;
                            }
                        }else{
                            this.err[key] = ''
                        }
                    }else if(!this.addForm[key]){
                        this.err[key] = 'err';
                        err = true;
                    }
                }
                resolve(err)
            })
        },
        onSubmit(){
            let err = false
            this.formRule().then(err=>{
                if(err){
                    this.showToast('请填写完整！')
                    return;
                }else{
                    if (this.idCardFrontPhoto.length > 0) {
                        this.addForm.idCardFrontPhoto=JSON.stringify(this.idCardFrontPhoto);
                    }
                    if (this.idCardBackPhoto.length > 0) {
                        this.addForm.idCardBackPhoto=JSON.stringify(this.idCardBackPhoto);
                    }
                    if (this.driverCardPhoto.length > 0) {
                        this.addForm.driverCardPhoto=JSON.stringify(this.driverCardPhoto);
                    }
                    if (this.otherPhoto.length > 0) {
                        this.addForm.otherPhoto=JSON.stringify(this.otherPhoto);
                    }
                    this.$ajax.post({
                        url:'operation_app/driverManagement/save',
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
            this.$ajax.get({
                url:'operation_base/driver/detail/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.addForm = res.data;
                    this.$set(this.addForm,'age',this.getAges(res.data.birthday));
                    this.workStatus = this.addForm.workStatus*1-1 + '';
                    this.driveType = this.driveTypeStatusBack[this.addForm.driveType];
                    this.sex = this.addForm.sex*1-1 + '';
                    this.taskStatus= this.addForm.taskStatus*1-1 + '';
                    if (this.addForm.idCardFrontPhoto) {
                        this.idCardFrontPhoto=JSON.parse(this.addForm.idCardFrontPhoto);
                    }
                    if (this.addForm.idCardBackPhoto) {
                        this.idCardBackPhoto=JSON.parse(this.addForm.idCardBackPhoto);
                    }
                    if (this.addForm.driverCardPhoto) {
                        this.driverCardPhoto=JSON.parse(this.addForm.driverCardPhoto);
                    }
                    if (this.addForm.otherPhoto) {
                        this.otherPhoto=JSON.parse(this.addForm.otherPhoto);
                    }
                }
            })
        },
    },
    onLoad(){
        if(!this.$root.$mp.query.id) return;
        wx.setNavigationBarTitle({
            title: '编辑司机' 
        })
    },
    mounted(){
        this.getDetail();
        this.$bus.$on('changeOrganization', res => {
            this.$set(this.addForm,"organizationName",res.name);
            this.$set(this.addForm,"companyId",res.id);
        })
        this.$bus.$on('changeCity', res => {
            this.$set(this.addForm,"serviceCity",res.name);
            this.$set(this.addForm,"serviceCityId",res.id);
        })
    },
    onUnload(){
        Object.assign(this, this.$options.data())
    }
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>
