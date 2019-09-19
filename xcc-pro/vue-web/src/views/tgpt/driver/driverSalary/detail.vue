<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="司机工资" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">司机</label>
                        <div class="input-group">
                            <span>{{form.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">项目月结单号</label>
                        <div class="input-group">
                            <span>{{form.projectVehicleSettlementNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">订单编号</label>
                        <div class="input-group">
                            <span>{{form.orderNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{form.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">月份</label>
                        <div class="input-group">
                            <span>{{form.carUseMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{form.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="费用" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">每月司机费用</label>
                        <div class="input-group">
                            <span>{{form.driverFee}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">司机每天工作时长</label>
                        <div class="input-group">
                            <span>{{form.workHour}}小时</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">每月司机通讯费</label>
                        <div class="input-group">
                            <span>{{form.driverCommunicationFee}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">司机加班费</label>
                        <div class="input-group">
                            <span>{{form.overworkFee}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">住宿费</label>
                        <div class="input-group">
                            <span>{{form.stayFee}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">餐费</label>
                        <div class="input-group">
                            <span>{{form.mealFee}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">福利费</label>
                        <div class="input-group">
                            <span>{{form.welfareFee}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">高温补贴费</label>
                        <div class="input-group">
                            <span>{{form.heatSubsidy}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">生日补贴费</label>
                        <div class="input-group">
                            <span>{{form.birthdaySubsidy}}￥</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">其他补贴费用</label>
                        <div class="input-group">
                            <span>{{form.otherSubsidy}}￥</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "driverSalaryDetail",
        components:{ ApprovalFlow, FileDetail },
        data() {
            return {
                activeNames:["1","2"],
                form : {}
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.detail(id);
        },
        methods: {
            detail(id){
                let $this = this;
                ajax.get("base/driverSalary/detail?id="+id).then(result =>{
                    if(result.status == 0){
                        $this.form = result.data;
                    }
                });
            }
        }
    }
</script>
