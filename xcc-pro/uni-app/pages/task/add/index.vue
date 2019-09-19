<template>
    <div class="container">
        <ul class="from padding remark">
            <li :class="{'err':err.companyName}">
                <p class="required">所属组织</p>
                <div class="picker" @click="toDetail('/pages/components/organizationsPicker/index',searchParam.companyId)">
                    <p><span v-if="searchParam.companyName">{{searchParam.companyName}}</span><span v-if="!searchParam.companyName" class="placeholder">请选择乘所属组织</span></p>
                </div>
            </li>
            <li :class="{'err':err.assignmentTime}">
                <p class="required">任务时间</p>
                <picker mode="multiSelector" v-model="dateTime" @change="changeDateTime" @columnchange="changeDateTimeColumn" :range="dateTimeArray">
                    <view class="tui-picker-detail">
                        <p><span v-if="searchParam.assignmentTime">{{searchParam.assignmentTime}}</span><span v-if="!searchParam.assignmentTime" class="placeholder">请选择乘客预约的上车时间</span></p>
                    </view>
                </picker>
            </li>
            <li :class="{'err':err.depAddress}">
                <p class="required">任务起点</p>
                <div class="picker" @click="getSetting('depAddress','dep')">
                    <p><span v-if="searchParam.depAddress">{{searchParam.depAddress}}</span><span v-if="!searchParam.depAddress" class="placeholder">请输入乘客上车地</span></p>
                </div>
            </li>
            <li :class="{'err':err.desAddress}">
                <p class="required">任务终点</p>
                <div class="picker" @click="getSetting('desAddress','des')">
                    <p><span v-if="searchParam.desAddress">{{searchParam.desAddress}}</span><span v-if="!searchParam.desAddress" class="placeholder">请输入乘客下车地</span></p>
                </div>
            </li>
            <li :class="{'err':err.passengerNum}">
                <p class="required">乘车人数</p>
                <input placeholder-style="color:#C7C7CC" v-model="searchParam.passengerNum" type="number" placeholder="请选择乘客人数">
            </li>
            <li :class="{'err':err.contacterName}">
                <p class="required">联系人</p>
                <input placeholder-style="color:#C7C7CC" v-model="searchParam.contacterName" type="text" placeholder="请输入联系人姓名">
            </li>
            <li :class="{'err':err.contacterPhone}">
                <p class="required">联系电话</p>
                <input placeholder-style="color:#C7C7CC" v-model="searchParam.contacterPhone" maxlength="11" type="number" placeholder="请输入联系人电话">
            </li>
            <li>
                <p>备注</p>
                <textarea v-model="searchParam.remark" placeholder-style="color:#C7C7CC" maxlength="300" auto-height placeholder="文字不能超过300字" />
            </li>
        </ul>
        <div class="padding onSubmit">
            <button type="primary" @click="onSubmit" >确定</button>
       </div>
    </div>
</template>

<script>
import { tool } from '../../../utils/common'
import dateTimePicker from '../../../utils/dateTimePicker';

export default {
    mixins:[tool],
    data(){
        return {
            searchParam:{
                passengerNum:'',
                contacterName:'',
                contacterPhone:'',
            },
            err:{
                companyName:'',
                depAddress:'',
                desAddress:'',
                passengerNum:'',
                contacterName:'',
                contacterPhone:'',
                remark:'',
                assignmentTime:''
            },
            dateTimeArray:[],
            dateTime:null
        }
    },
    watch: {
        searchParam:{
            handler(val, oldVal){
                for(let key in this.err){
                    if(key != 'remark' && this.searchParam[key]){
                        if(key == 'contacterPhone'){
                            if(/^((1[3-9][0-9])+\d{8})$/.test(this.searchParam[key])){
                                this.err[key] = ''
                            }else{
                                this.err[key] = 'err'
                            }
                        }else{
                            this.err[key] = ''
                        }
                    }else if(key != 'remark' && !this.searchParam[key]){
                        this.err[key] = 'err'
                    }
                }
            },
            deep: true
        },
    },
    methods: {
        changeDateTime(e){
            const year = this.dateTimeArray[0][this.dateTime[0]];
            const month = this.dateTimeArray[1][this.dateTime[1]];
            const day = this.dateTimeArray[2][this.dateTime[2]];
            const hour = this.dateTimeArray[3][this.dateTime[3]];
            const min = this.dateTimeArray[4][this.dateTime[4]];
            const str = year +'-' + month +'-' + day +' ' + hour +':' + min;
            if(new Date().getTime() > new Date(str).getTime()){
                this.showToast('任务时间不能小于当前时间！')
                return;
            }
            this.$set(this.searchParam,'assignmentTime',str)
        },
        changeDateTimeColumn(e) {
            var arr = this.dateTime, dateArr = this.dateTimeArray;
            arr[e.target.column] = e.target.value;
            dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
            this.dateTimeArray = dateArr;
            this.dateTime = arr;
        },
        getSetting(type,name){
            const $this = this
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                        wx.authorize({
                            scope: 'scope.userLocation',
                            success () {
                                $this.getLocation(type,name)
                            },
                            fail(){
                                wx.openSetting({
                                   
                                })
                            }
                        })
                    }else{
                        $this.getLocation(type,name)
                    }
                },
            })
        },
        getLocation(type,name){
            const $this = this
            wx.chooseLocation({
                success(res){
                    $this.$set($this.searchParam,type,res.address+res.name)
                    $this.$set($this.searchParam,name+'Lat',res.latitude)
                    $this.$set($this.searchParam,name+'Lon',res.longitude)
                }
            })
        },
        onSubmit(){
            let err = false
            for(let key in this.err){
                if(key != 'remark' && !this.searchParam[key]){
                    this.err[key] = 'err';
                    err = true;
                }else if(key == 'contacterPhone'){
                    if(!/^((1[3-9][0-9])+\d{8})$/.test(this.searchParam[key])){
                        this.err[key] = 'err';
                        err = true;
                    }
                }else{
                    this.err[key] = '';
                }
            }
            if(err){
                this.showToast('请填写完整！')
                return;
            }
            this.$ajax.post({
                url:'operation_core/assignment/save',
                data:this.searchParam
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
        },
        getDetail(){
            if(!this.$root.$mp.query.id) return;
            this.$ajax.get({
                url:'operation_core/assignment/detail/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.searchParam = res.data;
                }
            })
        },
    },
    onLoad(){
        var obj = dateTimePicker.dateTimePicker(new Date().getFullYear()-20, new Date().getFullYear()+50);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj.dateTimeArray.pop();
        var lastTime = obj.dateTime.pop();
        this.dateTimeArray = obj.dateTimeArray;
        this.dateTime = obj.dateTime;
        if(!this.$root.$mp.query.id) return;
        wx.setNavigationBarTitle({
            title: '编辑任务' 
        })
    },
    mounted(){
        this.getDetail();
        this.$bus.$on('changeOrganization', res => {
            this.$set(this.searchParam,"companyName",res.name);
            this.$set(this.searchParam,"companyId",res.id);
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
