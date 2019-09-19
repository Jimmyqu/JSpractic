<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <div class="flex-panel detail-box">
                    <!--基本信息-->
                    <div class="detail-item">
                        <label class="control-label">用车单编号</label>
                        <div class="input-group">
                            <span>{{settlementDetail.projectVehicleSettlementNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否需要司机</label>
                        <div class="input-group">
                            <span v-if="settlementDetail.isNeedDriver == 1">是</span>
                            <span v-if="settlementDetail.isNeedDriver == 0">否</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="settlementDetail.isNeedDriver">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{settlementDetail.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌号</label>
                        <div class="input-group">
                            <span>{{settlementDetail.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">月份</label>
                        <div class="input-group">
                            <span>{{settlementDetail.carUseMonth}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算操作人</label>
                        <div class="input-group">
                            <span>{{settlementDetail.settlementOperator}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">结算组织</label>
                        <div class="input-group">
                            <span>{{settlementDetail.companyName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="结算前收费价格" name="2">
                <div class="flex-panel detail-box">
                    <!--收费价格-->
                    <div class="detail-item">
                        <label class="control-label">每月车辆租金(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.vehicleRentalPre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">ETC费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.etcFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆油费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.oilFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机通讯费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverCommunicationFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">代驾费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.drivingFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">住宿费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.stayFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">餐费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.mealFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">福利费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.welfareFeePre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">高温补贴费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.heatSubsidyPre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">生日补贴费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.birthdaySubsidyPre}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他补贴费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.otherSubsidyPre}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="结算后收费价格" name="3">
                <div class="flex-panel detail-box">
                    <!--收费价格-->
                    <div class="detail-item">
                        <label class="control-label">每月车辆租金(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.vehicleRental}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">ETC费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.etcFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆油费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.oilFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机通讯费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverCommunicationFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">代驾费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.drivingFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">住宿费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.stayFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">餐费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.mealFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">福利费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.welfareFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">高温补贴费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.heatSubsidy}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">生日补贴费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.birthdaySubsidy}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他补贴费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.otherSubsidy}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="本月使用情况" name="4">
                <div class="flex-panel detail-box">
                    <!--本月使用情况-->
                    <div class="detail-item">
                        <label class="control-label">超里程费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.overMileageFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月使用里程(公里)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.usedMileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">超里程(公里)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.overMileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月限制里程(公里)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.limitMileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月支付油费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.payedOilFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油费支付类型</label>
                        <div class="input-group">
                            <span>{{settlementDetail.oilFeePaymentModel}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">超里程单价(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.overMileageUnitPrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月路桥费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.tollFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">停车费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.parkingFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">洗车费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.washFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机加班费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.overworkFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机工作时长(小时)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.workHour}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">附加费(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.extraFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.totalAmount}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="5">
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{settlementDetail.remark}}</span>
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
        name: "projectCheckDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames:["1","2","3","4","5"],
                settlementDetail: {}
            }
        },
        mounted(){
            this.initData();
        },
        methods:{
            initData() {
                var id = this.$route.params.id;
                ajax.get("core/settlement/detail/" + id).then(res =>{
                    this.settlementDetail = res;
                    if(!this.settlementDetail.isNeedDriver){
                        this.settlementDetail.isNeedDriver = 0;
                    }
                });
            }
        }

    }
</script>
