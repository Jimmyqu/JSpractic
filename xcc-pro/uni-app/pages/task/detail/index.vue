<template>
    <div class="container">
        <div class="box">
            <h2 class="padding">任务信息</h2>
            <ul class="detail shadow padding remark">
                <li><label>所属组织</label>
                <p>{{detail.companyName}}</p>
                </li>
                <li ><label>任务编号</label>
                <p>{{detail.assignmentNo}}</p>
                </li>
                <li><label>任务时间</label>
                <p>{{detail.assignmentTime}}</p>
                </li>
                <li><label>任务状态</label>
                    <p>{{detail.assignmentStatusText}}</p>
                </li>
                <li><label>任务起点</label>
                <p>{{detail.depAddress}}</p>
                </li>
                <li ><label>任务终点</label>
                    <p>{{detail.desAddress}}</p>
                </li>
                <li><label>备注</label>
                    <p>{{detail.remark || ''}}</p>
                </li>
            </ul>
            <h2 class="padding">乘客信息</h2>
            <ul class="detail shadow padding">
                <li><label>乘车人数</label>
                <p>{{detail.passengerNum}}</p>
                </li>
                <li ><label>联系人</label>
                <p>{{detail.contacterName}}</p>
                </li>
                <li><label>联系电话</label>
                <p>{{detail.contacterPhone}}</p>
                </li>
            </ul>
            <h2 class="padding">服务司机</h2>
            <ul class="detail shadow padding">
                <li><label>司机</label>
                <p>{{detail.driverName || '--'}} | {{detail.sex == 1 ?'男':detail.sex == 0?'女':'--'}} | {{detail.driverPhone || '--'}}</p>
                </li>
                <li ><label>车辆</label>
                <p>{{detail.plate||'--'}} | {{detail.modelName||'--'}} | {{detail.color||'--'}}</p>
                </li>
            </ul>
        </div>
        <div class="operation">
            <button class="edit" v-if="detail.status == 1" type="default" @click="onEdit" >编辑</button>
            <button class="send" v-if="detail.status == 1"  type="default" @click="onSend" >派发</button>
            <button class="cancel" v-if="detail.status == 1 || detail.status == 2" type="default" @click="onCancel" >取消</button>
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
        }
    },
    computed: {

    },
    watch: {
        
    },
    methods: {
        getDetail(){
            this.$ajax.get({
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
            wx.navigateTo({ url:'/pages/task/distribute/index?id='+this.detail.id});
        },
        onCancel(){
            const $this = this
            wx.showModal({
                title: '提示',
                content: '是否确认取消？',
                success (res) {
                    if (res.confirm) {
                        this.$ajax.get({
                            url:"operation_core/assignment/cancel/" + $this.detail.id
                        }).then(res => {
                            if (res.status == 0) {
                                $this.showToast(res.message,'success');
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
