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
                        <label class="control-label">订单编号</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">订单状态</label>
                        <div class="input-group">
                            <span>{{projectOrder.orderStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">供车单位</label>
                        <div class="input-group">
                            <span>{{projectOrder.providerCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用车城市</label>
                        <div class="input-group">
                            <span>{{projectOrder.useCarCityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用车类型</label>
                        <div class="input-group">
                            <span>{{projectOrder.isNeedDriverText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用车开始日期</label>
                        <div class="input-group">
                            <span>{{projectOrder.useCarStartDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用车结束日期</label>
                        <div class="input-group">
                            <span>{{projectOrder.useCarEndDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{projectOrder.vehicleModelInfoName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="司机及车辆情况" name="2">
                <div class="flex-panel detail-box">
                    <!--司机及车型情况-->
                    <div class="detail-item">
                        <label class="control-label">车牌号</label>
                        <div class="input-group">
                            <span>{{projectOrder.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机</label>
                        <div class="input-group">
                            <span>{{projectOrder.driver}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出车时间</label>
                        <div class="input-group">
                            <span>{{projectOrder.departureDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">退车时间</label>
                        <div class="input-group">
                            <span>{{projectOrder.finishTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="费用信息" name="3">
                <div class="flex-panel detail-box half-box">
                    <!--价格信息-->
                    <div class="detail-item">
                        <label class="control-label">每月车辆租金（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.carRentMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆油费（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.carOilCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月限制里程（公里）</label>
                        <div class="input-group">
                            <span>{{projectOrder.limitMileageMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">超里程单价（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.overMileagePrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机费用（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机通讯费（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverCommunicationCostMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他补贴费用（元）</label>
                        <div class="input-group">
                            <span>{{projectOrder.otherSubsidyCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机每天工作时长（小时）</label>
                        <div class="input-group">
                            <span>{{projectOrder.driverWorktimeDay}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油费支付类型</label>
                        <div class="input-group">
                            <span>{{projectOrder.oilFeePaymentModelText}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "leaseOrderDetail",
        components:{ FileDetail },
        data(){
            return {
                activeNames: ['1','2','3','4','5'],
                projectOrder : {},
            }
        },
        mounted(){
            this.initForm()
        },
        methods:{
            initForm(){
                var id = this.$route.params.id;
                ajax.get("core/leaseOrder/detail/"+id).then(res => {
                    if(res.data.orderStatus==60 || res.data.orderStatus==70 || res.data.orderStatus==80){
                        res.data.carRentMonth=res.data.orderCarRentMonth;
                        res.data.carOilCostMonth=res.data.orderCarOilCostMonth;
                        res.data.limitMileageMonth=res.data.orderLimitMileageMonth;
                        res.data.overMileagePrice=res.data.orderOverMileagePrice;
                        res.data.driverCostMonth=res.data.orderDriverCostMonth;
                        res.data.driverCommunicationCostMonth=res.data.orderDriverCommunicationCostMonth;
                        res.data.otherSubsidyCost=res.data.orderOtherSubsidyCost;
                        res.data.driverWorktimeDay=res.data.orderDriverWorktimeDay;
                        res.data.oilFeePaymentModelText=res.data.orderOilFeePaymentModelText;
                    }

                    this.projectOrder = res.data;
                })
            },
        }

    }
</script>
