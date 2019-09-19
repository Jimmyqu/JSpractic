<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <div class="flex-panel detail-box">
                    <!--基本信息-->
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{projectOrder.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用车城市</label>
                        <div class="input-group">
                            <span>{{projectOrder.useCarCityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{projectOrder.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用车开始日期</label>
                        <div class="input-group">
                            <span>{{projectOrder.startDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">租车月数</label>
                        <div class="input-group">
                            <span>{{projectOrder.contractCycle}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="司机及车辆情况" name="2">
                <div class="flex-panel detail-box">
                    <!--司机及车型情况-->
                    <div class="detail-item">
                        <label class="control-label">是否需要司机</label>
                        <div class="input-group">
                            <span>{{projectOrder.isNeedDriverText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机手机号</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverName}}  {{projectOrder.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{projectOrder.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型名称</label>
                        <div class="input-group">
                            <span>{{projectOrder.modelName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="价格信息" name="3">
                <div class="flex-panel detail-box half-box">
                    <!--价格信息-->
                    <div class="detail-item">
                        <label class="control-label">每月车辆租金（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.carRentMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆租金_执行价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderCarRentMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆油费（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.carOilCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆油费_执行价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderCarOilCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月限制里程（公里）</label>
                        <div class="input-group">
                            <span>{{projectOrder.limitMileageMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月限制里程_执行价（公里）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderLimitMileageMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">超里程单价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.overMileagePrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">超里程单价_执行价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderOverMileagePrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机费用（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机费用_执行价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderDriverCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机通讯费（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverCommunicationCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机通讯费_执行价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderDriverCommunicationCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他补贴费用（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.otherSubsidyCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他补贴费用_执行价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderOtherSubsidyCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机每天工作时长（小时）</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverWorktimeDay}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机每天工作时长_执行（小时）</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderDriverWorktimeDay}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油费支付类型</label>
                        <div class="input-group">
                            <span>{{projectOrder.oilFeePaymentModelText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油费支付类型_执行</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderOilFeePaymentModelText}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="4">
                <approval-flow :id="refundDetail.serviceId"></approval-flow>
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
        name: "projectOrderEdit",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1','2','3','4','5'],
                projectOrder : {},
                refundDetail:{
                    serviceId: this.$route.params.id
                }
            }
        },
        mounted(){
            this.initForm()
        },
        methods:{
            initForm(){
                var id = this.$route.params.id;
                ajax.get("core/projectOrder/detail/"+id).then(res => {
                    this.projectOrder = res.data;
                })
            },
        }

    }
</script>
