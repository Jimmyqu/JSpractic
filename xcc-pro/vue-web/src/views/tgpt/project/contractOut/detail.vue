<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="合同退出信息" name="0">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">是否提前退出</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.isAdvanceExit == 1">是</span>
                            <span v-else>否</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">退出方式</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.exitModeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="contractOutDetail.exitMode == 1">
                        <label class="control-label">违约金</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.breakAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="contractOutDetail.exitMode == 1">
                        <label class="control-label">违约原因</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.breakReason}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同基本信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">发起人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.originatorName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发起部门</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.originateDeptName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">业务员</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.originatorName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请日期</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.applicationDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同开始日期</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractStartDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同结束日期</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractEndDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">交车日期</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.deliveryDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">客户类型</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.customerType==1?'企业客户':(contractOutDetail.customerType==2?'个人客户':'/')}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.originatorName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目评审</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.projectName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目编号</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.reviewNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目总金额</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.projectTotalAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报价模板</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.quotationTemplateName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">报价范围</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.quotationRangeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">保险购买方式</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.insurancePurchaseModeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">违章代办方式</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.peccancyHandleModeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">我方签约主体</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.ourContractSubjectName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">对方签约主体</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.otherContractSubject}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">合同议定方</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractAgreedPartyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">合同文本类型</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractTextTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">押金条件</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.depositCondition}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用印地点</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.useSealPlaceName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同费用信息" name="2">
                <div class="flex-panel detail-box">
                    <!--合同费用信息-->
                    <div class="detail-item">
                        <label class="control-label">是否含税</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.isContainTax == 1">是</span>
                            <span v-else>否</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否开票</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.isOpenTicket == 1">是</span>
                            <span v-else>否</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率（车）</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.invoiceTaxRateVehicle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率(司机)</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.invoiceTaxRateDriver}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算方式</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.settlementModelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算日</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.settlementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款方式</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.paymentModelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款周期（日）</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.paymentCycle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同金额</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同期（月）</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractCycle}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同条款" name="3">
                <div class="flex-panel detail-box">
                    <!--合同条款-->
                    <div class="detail-item big">
                        <label class="control-label">合同主要条款</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.contractMainTerm}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">争议解决方式</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.disputeSolveMode}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同明细" name="5">
                <el-table class="left" border :data="contractOutDetail.contractDetailList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="useCarCityName" label="用车城市" min-width="150"></el-table-column>
                    <el-table-column prop="useCarCityName" label="车牌要求城市" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleModelInfoName" label="车型" min-width="150"></el-table-column>
                    <el-table-column prop="carColorName" label="颜色" min-width="150"></el-table-column>
                    <el-table-column prop="carAge" label="车龄" min-width="150"></el-table-column>
                    <el-table-column prop="newOrOldCarName" label="车辆新旧" min-width="150"></el-table-column>
                    <el-table-column prop="carRentMonth" label="每月车辆租金" min-width="150" ></el-table-column>
                    <el-table-column prop="calculatePrice" label="测算租金" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleQty" label="车辆台数（台）" min-width="150"></el-table-column>
                    <el-table-column prop="oilFeePaymenModelName" label="油费支付类型" min-width="150"></el-table-column>
                    <el-table-column prop="carOilCostMonth"label="每月车辆油费" min-width="150"></el-table-column>
                    <el-table-column prop="limitMileageMonth" label="每月限制里程公里" min-width="150"></el-table-column>
                    <el-table-column prop="overMileagePrice" label="超里程单价" min-width="150"></el-table-column>
                    <el-table-column prop="etcCost" label="ETC费" min-width="150"></el-table-column>
                    <el-table-column prop="retrofitRequirement" label="加装要求" min-width="150"></el-table-column>
                    <el-table-column prop="procurementExplanation" label="采购说明" min-width="150"></el-table-column>
                    <el-table-column prop="retrofitRequirementOptions" label="加装要求选项" min-width="150"></el-table-column>
                    <el-table-column prop="isNeedDriverName"  label="是否需要司机" min-width="150"></el-table-column>
                    <el-table-column prop="driverWorktimeDay" label="司机每天工作时长(小时)" min-width="170"></el-table-column>
                    <el-table-column prop="driverCount" label="司机数（名）" min-width="150" label-class-name="required"></el-table-column>
                    <el-table-column prop="driverCostMonth" label="每月司机费用" min-width="150" label-class-name="required"></el-table-column>
                    <el-table-column prop="driverCommunicationCostMonth" label="每月司机通讯费" min-width="150"></el-table-column>
                    <el-table-column prop="drivingCost" label="代驾费" min-width="150"></el-table-column>
                    <el-table-column prop="overtimeCost" label="加班费（小时）" min-width="150"></el-table-column>
                    <el-table-column prop="stayCost" label="每晚住宿费" min-width="150"></el-table-column>
                    <el-table-column prop="mealCost" label="餐费（次）" min-width="150"></el-table-column>
                    <el-table-column prop="welfareFee" label="福利费" min-width="150"></el-table-column>
                    <el-table-column prop="highTemperatureFee" label="年高温补贴费" min-width="150"></el-table-column>
                    <el-table-column prop="birthdayFee" label="年生日补贴费" min-width="150"></el-table-column>
                    <el-table-column prop="otherSubsidyCost" label="其他补贴费" min-width="150"></el-table-column>
                    <el-table-column prop="otherCostExplanation" label="其他费用说明" min-width="150"></el-table-column>
                </el-table>
            </el-collapse-item>
            <el-collapse-item title="信息确认" name="6">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">资产调拨处置确认</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.assetAllocationDisposalConfirm == 1">已确认</span>
                            <span v-else>未确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资产调拨处置确认人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.assetAllocationDisposalConfirmUserName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资产调拨处置确认时间</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.assetAllocationDisposalConfirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶人员安排确认</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.driverArrangementConfirm == 1">已确认</span>
                            <span v-else>未确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶人员安排确认人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.driverArrangementConfirmUserName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶人员安排确认时间</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.driverArrangementConfirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车况说明确认</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.carConditionExplainConfirm == 1">已确认</span>
                            <span v-else>未确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车况说明确认人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.carConditionExplainConfirmUserName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车况说明确认时间</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.carConditionExplainConfirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保险确认</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.insuranceConfirm == 1">已确认</span>
                            <span v-else>未确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保险确认人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.insuranceConfirmUserName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保险确认时间</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.insuranceConfirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">违章情况确认</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.peccancyConfirm == 1">已确认</span>
                            <span v-else>未确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">违章情况确认人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.peccancyConfirmUserName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">违章情况确认时间</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.peccancyConfirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">费用收取确认</label>
                        <div class="input-group">
                            <span v-if="contractOutDetail.chargedConfirm == 1">已确认</span>
                            <span v-else>未确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">费用收取确认人</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.chargedConfirmUserName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">费用收取确认时间</label>
                        <div class="input-group">
                            <span>{{contractOutDetail.chargedConfirmTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="7">
                <approval-flow :id="contractOutDetail.contractOutId"></approval-flow>
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
        name: "projectContractOutDetail",
        components:{ ApprovalFlow, FileDetail },
        data() {
            return {
                activeNames: ['0', '1', '2', '3', '5', '6', '7'],
                contractOutDetail: {
                    contractDetailList: []
                }
            }
        },
        mounted() {
            this.getContractDetail();
        },
        methods: {
            getContractDetail: function () {
                let $this = this;
                let contractId = this.$route.params.id;
                ajax.get("core/projectContractOut/detail/" + contractId).then((result) => {
                    if (result.status == 0) {
                        $this.contractOutDetail = result.data;
                    } else {
                        $this.$message.error(result.message);
                    }
                });
            },
        }

    }
</script>
