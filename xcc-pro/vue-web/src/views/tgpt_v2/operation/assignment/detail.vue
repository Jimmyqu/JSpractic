<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="任务信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属公司</label>
                        <div class="input-group">
                            <span>{{transfer.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label"> 创建人</label>
                        <div class="input-group">
                            <span>{{transfer.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建时间</label>
                        <div class="input-group">
                            <span>{{transfer.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务编号</label>
                        <div class="input-group">
                            <span>{{transfer.assignmentNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务时间</label>
                        <div class="input-group">
                            <span>{{transfer.assignmentTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">乘车人数</label>
                        <div class="input-group">
                            <span>{{transfer.passengerNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务起点</label>
                        <div class="input-group">
                            <span>{{transfer.depAddress}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务终点</label>
                        <div class="input-group">
                            <span>{{transfer.desAddress}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">任务状态</label>
                        <div class="input-group">
                            <span>{{transfer.assignmentStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人</label>
                        <div class="input-group">
                            <span>{{transfer.contacterName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{transfer.contacterPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{transfer.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="服务司机" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{transfer.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label"> 司机手机号</label>
                        <div class="input-group">
                            <span>{{transfer.driverPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌号</label>
                        <div class="input-group">
                            <span>{{transfer.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{transfer.modelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{transfer.color}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { number_format } from '@/utils'

    export default {
        name: "assignmentManagementDetail",
        data(){
            return {
                activeNames: ['1', '2'],
                transfer:{},
            }
        },
        mounted: function () {
            this.getAssignmentDetail();
        },
        methods: {
            getAssignmentDetail() {
                var id = this.$route.params.id;
                ajax.get("operation_core/assignment/detail/" + id).then(result =>{
                    if(result.status == 0) {
                        this.transfer = result.data;
                    } else {
                        this.showMessage(result.message,"error");
                    }
                });
            }
        },


    }
</script>
