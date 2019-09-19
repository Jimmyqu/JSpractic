<template>
    <div class="container">
        <div class="box">
            <h2 class="padding">基本资料</h2>
            <ul class="detail shadow padding">
                <li><label class="required">所属组织</label>
                <p>{{detail.organizationName}}</p>
                </li>
                <li ><label>司机姓名</label>
                <p>{{detail.name}}</p>
                </li>
                <li><label>性别</label>
                <p>{{detail.sexText}}</p>
                </li>
                <li><label>手机号</label>
                    <p>{{detail.phone}}</p>
                </li>
                <li><label>身份证号</label>
                <p>{{detail.idCard}}</p>
                </li>
                <li ><label>出生日期</label>
                    <p>{{detail.birthday}}</p>
                </li>
                <li><label>年龄</label>
                    <p>{{detail.age}}</p>
                </li>
            </ul>
            <h2 class="padding">驾驶信息</h2>
            <ul class="detail shadow padding">
                <li><label>驾驶证号</label>
                <p>{{detail.driverNo}}</p>
                </li>
                <li ><label>申领日期</label>
                <p>{{detail.driveDate}}</p>
                </li>
                <li><label>准驾车型</label>
                <p>{{detail.driveType || '--'}}</p>
                </li>
                <li><label>驾龄</label>
                <p>{{detail.driveAge || '--'}}</p>
                </li>
            </ul>
            <h2 class="padding">服务信息</h2>
            <ul class="detail shadow padding">
                <li><label>在职状态</label>
                <p>{{detail.workStatusText}}</p>
                </li>
                <li ><label>服务城市</label>
                <p>{{detail.serviceCity}}</p>
                </li>
                <li ><label>任务状态</label>
                <p>{{detail.taskStatusText}}</p>
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
            <button class="del" type="warn" @click="onDel" >删除</button>
       </div>
    </div>
</template>

<script>
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
                url:'operation_app/driverManagement/detail/' + this.$root.$mp.query.id
            }).then(res=>{
                if(res.status == 0){
                    this.detail = res.data;
                    this.$set(this.detail,'age',this.getAges(res.data.birthday));
                    if(res.data.idCardFrontPhoto){
                        this.fileList = this.fileList.concat(JSON.parse(res.data.idCardFrontPhoto))
                    }
                    if(res.data.idCardBackPhoto){
                        this.fileList = this.fileList.concat(JSON.parse(res.data.idCardBackPhoto))
                    }
                    if(res.data.driverCardPhoto){
                        this.fileList = this.fileList.concat(JSON.parse(res.data.driverCardPhoto))
                    }
                    if(res.data.otherPhoto){
                        this.fileList = this.fileList.concat(JSON.parse(res.data.otherPhoto))
                    }
                }
            })
        },
        onEdit(){
            wx.navigateTo({ url:'/pages/driver/add/index?id='+this.detail.id});
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
        onDel(){
            const $this = this
            wx.showModal({
                title: '提示',
                content: '是否确认删除？',
                success (res) {
                    if (res.confirm) {
                        get({
                            url:"operation_app/driverManagement/delete/" + $this.detail.id
                        }).then(res => {
                            if (res.status == 0) {
                                $this.showToast('删除成功','success');
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
            
        }
    },
	onLoad(options) {
		console.log(options)
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
