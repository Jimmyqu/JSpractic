<template>
    <div class="detail-panel">
        <el-form label-position="top" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{scheduleForm.organizationName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">调度单号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">状态</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleStatusText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">客户类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.customerType==1?'企业客户':(scheduleForm.customerType==2?'个人客户':'/')}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <span>{{scheduleForm.enterpriseName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.contractNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">散租类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleTypeText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.user}}&nbsp;{{scheduleForm.phone}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人数</label>
                            <div class="input-group">
                                <span>{{scheduleForm.userNum}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车事由</label>
                            <div class="input-group">
                                <span>{{scheduleForm.reason}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出发地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">抵达地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">订单金额</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderAmount}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">创建人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.creater}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">创建时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.createTime}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务车辆" name="2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <span>{{scheduleForm.plate}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">驾驶员</label>
                            <div class="input-group">
                                <span>{{scheduleForm.driverName}}&nbsp;{{scheduleForm.driverPhone}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">备注</label>
                            <div class="input-group">
                                <span>{{scheduleForm.remake}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务信息" name="4" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">出车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">还车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">本次服务时长</label>
                            <div class="input-group">
                                <span>{{scheduleForm.duration}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出车里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depMile}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">还车里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrMile}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">本次服务里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrMile - scheduleForm.depMile}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="费用信息" name="4" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">总费用</label>
                            <div class="input-group">
                                <span>{{scheduleForm.totalMoney}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">租金</label>
                            <div class="input-group">
                                <span>{{scheduleForm.rentMoney}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">停车费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.parkingFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">路桥费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.tollCharge}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.oilFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">超时费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.outtimeFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">超公里费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.outmileFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他费用</label>
                            <div class="input-group">
                                <span>{{scheduleForm.otherFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他费用说明</label>
                            <div class="input-group">
                                <span>{{scheduleForm.otherFeeRemark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="我司承担费用" name="5" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">路桥费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.myTollCharge}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">停车费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.myParkingCharge}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油费</label>
                            <div class="input-group">
                                <span>{{scheduleForm.myOilFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他费用说明</label>
                            <div class="input-group">
                                <span>{{scheduleForm.myFeeRemark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

            </el-collapse>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name:'trafficVehicleScheduleDetail',
        components:{ ApprovalFlow, FileDetail },
        data: function () {
            return {
                id: this.$route.params.id,
                activeNames: ['1','2','3','4','5'],
                scheduleForm : {},
            }

        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
            this.open();
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            open(){
                var $this = this;
                if(this.$route.params.id){
                    ajax.get('/core/vehicleschedule/detail/' + this.$route.params.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                $this.scheduleForm = res.data;
                            }
                        }
                    )
                }
            },
        }
    }
</script>
