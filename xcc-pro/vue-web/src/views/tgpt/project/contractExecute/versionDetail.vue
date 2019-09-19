<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames" >
            <el-collapse-item title="合同基本信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">发起人</label>
                        <div class="input-group">
                            <span>{{projectContractModel.originatorName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发起部门</label>
                        <div class="input-group">
                            <span>{{projectContractModel.originateDeptName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">业务员</label>
                        <div class="input-group">
                            <span>{{projectContractModel.originatorName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请日期</label>
                        <div class="input-group">
                            <span>{{projectContractModel.applicationDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同开始日期</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractStartDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同结束日期</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractEndDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">交车日期</label>
                        <div class="input-group">
                            <span>{{projectContractModel.deliveryDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">客户类型</label>
                        <div class="input-group">
                            <span>{{projectContractModel.customerType==1?'企业客户':(projectContractModel.customerType==2?'个人客户':'/')}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{projectContractModel.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目评审</label>
                        <div class="input-group">
                            <span>{{projectContractModel.projectName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目编号</label>
                        <div class="input-group">
                            <span>{{projectContractModel.projectNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">项目总金额(元)</label>
                        <div class="input-group">
                            <span>{{projectContractModel.projectTotalAmount==null?'':numberFormat(projectContractModel.projectTotalAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报价模板</label>
                        <div class="input-group">
                            <span>{{projectContractModel.quotationTemplateName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">报价范围</label>
                        <div class="input-group">
                            <span>{{projectContractModel.quotationRangeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">保险购买方式</label>
                        <div class="input-group">
                            <span>{{projectContractModel.insurancePurchaseModeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">违章代办方式</label>
                        <div class="input-group">
                            <span>{{projectContractModel.peccancyHandleModeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">我方签约主体</label>
                        <div class="input-group">
                            <span>{{projectContractModel.ourContractSubjectName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">对方签约主体</label>
                        <div class="input-group">
                            <span>{{projectContractModel.otherContractSubject}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">合同议定方</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractAgreedPartyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">合同文本类型</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractTextTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item ">
                        <label class="control-label">押金条件</label>
                        <div class="input-group">
                            <span>{{projectContractModel.depositCondition}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用印地点</label>
                        <div class="input-group">
                            <span>{{projectContractModel.useSealPlaceName}}</span>
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
                            <span>{{projectContractModel.isContainTaxName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否开票</label>
                        <div class="input-group">
                            <span>{{projectContractModel.isOpenTicketName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率（车）</label>
                        <div class="input-group">
                            <span>{{projectContractModel.invoiceTaxRateVehicle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率(司机)</label>
                        <div class="input-group">
                            <span>{{projectContractModel.invoiceTaxRateDriver}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算方式</label>
                        <div class="input-group">
                            <span>{{projectContractModel.settlementModelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算日</label>
                        <div class="input-group">
                            <span>{{projectContractModel.settlementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款方式</label>
                        <div class="input-group">
                            <span>{{projectContractModel.paymentModelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款周期（日）</label>
                        <div class="input-group">
                            <span>{{projectContractModel.paymentCycle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同金额(元)</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractAmount==null?'':numberFormat(projectContractModel.contractAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同期（月）</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractCycle}}</span>
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
                            <span>{{projectContractModel.contractMainTerm}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">争议解决方式</label>
                        <div class="input-group">
                            <span>{{projectContractModel.disputeSolveMode}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{projectContractModel.remark}}</span>
                        </div>
                    </div>
                    <!--<div class="detail-item big">
                        <label class="control-label">附件</label>
                        <div class="input-group">
                            <file-detail :file-name="projectContractModel.fileName" :file-url="projectContractModel.filePath"
                                         :show-download="true" :show-del="false"></file-detail>
                        </div>
                    </div>-->
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同车辆信息" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车辆总台数</label>
                        <div class="input-group">
                            <span>{{projectContractModel.vehicleTotalCount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆每月总租金</label>
                        <div class="input-group">
                            <span>{{projectContractModel.vehicleMonthlyTotalRent}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机每月总费用</label>
                        <div class="input-group">
                            <span>{{projectContractModel.driverMonthlyTotalCost}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同明细" name="5">
                <el-table class="left" border :data="projectContractDetailList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="serviceOrganizationName" label="服务组织" min-width="150"></el-table-column>
                    <el-table-column prop="settlementOrganizationName" label="结算组织" min-width="150"></el-table-column>
                    <el-table-column prop="useCarCityName" label="用车城市" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleModelInfoName" label="车型" min-width="150"></el-table-column>
                    <el-table-column prop="useCarStartDate" label="用车开始时间" min-width="150"></el-table-column>
                    <el-table-column prop="useCarEndDate" label="用车结束时间" min-width="150"></el-table-column>
                    <el-table-column prop="carColorName" label="颜色" min-width="150"></el-table-column>
                    <el-table-column prop="carAge" label="车龄" min-width="150"></el-table-column>
                    <el-table-column prop="newOrOldCarName" label="车辆新旧" min-width="150"></el-table-column>
                    <el-table-column prop="carRentMonth" label="每月车辆租金(元)" min-width="150" ></el-table-column>
                    <el-table-column prop="calculatePrice" label="测算租金(元)" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleQty" label="车辆台数（台）" min-width="150"></el-table-column>
                    <el-table-column prop="oilFeePaymenModelName" label="油费支付类型" min-width="150"></el-table-column>
                    <el-table-column prop="carOilCostMonth"label="每月车辆油费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="limitMileageMonth" label="每月限制里程公里" min-width="150"></el-table-column>
                    <el-table-column prop="overMileagePrice" label="超里程单价(元)" min-width="150"></el-table-column>
                    <el-table-column prop="etcCost" label="ETC费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="retrofitRequirement" label="加装要求" min-width="150"></el-table-column>
                    <el-table-column prop="procurementExplanation" label="采购说明" min-width="150"></el-table-column>
                    <el-table-column prop="retrofitRequirementOptionsText" label="加装要求选项" min-width="150"></el-table-column>
                    <el-table-column prop="isNeedDriverName"  label="是否需要司机" min-width="150"></el-table-column>
                    <el-table-column prop="driverWorktimeDay" label="司机每天工作时长(小时)" min-width="170"></el-table-column>
                    <el-table-column prop="driverCount" label="司机数（名）" min-width="150" label-class-name="required"></el-table-column>
                    <el-table-column prop="driverCostMonth" label="每月司机费用(元)" min-width="150" label-class-name="required"></el-table-column>
                    <el-table-column prop="driverCommunicationCostMonth" label="每月司机通讯费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="drivingCost" label="代驾费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="overtimeCost" label="加班费（小时）" min-width="150"></el-table-column>
                    <el-table-column prop="stayCost" label="每晚住宿费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="mealCost" label="餐费（次）" min-width="150"></el-table-column>
                    <el-table-column prop="welfareFee" label="福利费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="highTemperatureFee" label="年高温补贴费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="birthdayFee" label="年生日补贴费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="otherSubsidyCost" label="其他补贴费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="otherCostExplanation" label="其他费用说明" min-width="150"></el-table-column>
                </el-table>
            </el-collapse-item>
            <el-collapse-item title="其它信息" name="6"  v-if="confirmType==0">
                <div class="flex-panel detail-box">
                    <!--其它信息-->
                    <div class="detail-item">
                        <label class="control-label">信息完整性</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.informationIntegrityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">信息完整性确认操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.informationIntegrityUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">信息完整性确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.informationIntegrityDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资金安排</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.fundingArrangementName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资金安排操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.fundingArrangementUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资金安排确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.fundingArrangementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务信息确认</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.serviceInformationConfirmName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务信息确认操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.serviceInformationConfirmUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务信息确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.serviceInformationConfirmDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车务信息确认</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.trafficInformationConfirmName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车务信息确认操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.trafficInformationConfirmUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车务信息确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.trafficInformationConfirmDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">人员招聘确认</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.recruitmentConfirmName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">人员招聘确认操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.recruitmentConfirmUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">人员招聘确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.recruitmentConfirmDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">人员成本报价确认</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.personnelCostQuotationConfirmName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">人员成本报价确认操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.personnelCostQuotationConfirmUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">人员成本报价确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.personnelCostQuotationConfirmDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">分公司筹备确认</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.branchCompanyPreparationConfirmName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">分公司筹备确认操作人</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.branchCompanyPreparationConfirmUser}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">分公司筹备确认时间</label>
                        <div class="input-group">
                            <span>{{projectContractConfirmModel.branchCompanyPreparationConfirmDate}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="7" >
                <approval-flow :id="id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'
    import {tool} from '@/utils/common'

    export default {
        name: "projectContractExecuteVersionDetail",
        components:{ ApprovalFlow, FileDetail },
        mixins:[tool],
        data(){
            return {
                activeNames: ['0', '1','2', '3', '4','5', '6', '7'],
                projectContractModel:{},
                projectContractConfirmModel:{},
                projectContractDetailList:[],
                id: this.$route.query.id,
                confirmForm:{
                    id:"",
                    confirmType:"",
                },

            }
        },
        mounted: function () {
            this.detail();
        },
        methods: {
            detail:function () {
                let id = this.$route.query.id;
                let version = this.$route.query.version;
                ajax.get("core/coreProjectContractExecute/getDetail?id=" + id +"&version="+version).then(result =>{
                    if (this.checkResponse(result)) {
                        this.projectContractModel=result.data[0];
                        if(result.data[0].attachment){
                            var objFile = JSON.parse(result.data[0].attachment);
                            this.projectContractModel.filePath = objFile.path;
                            this.projectContractModel.fileName = objFile.name;
                        }
                        this.projectContractDetailList=result.data[1];
                        this.projectContractConfirmModel=result.data[2];
                    }
                });
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
        },

    }
</script>
