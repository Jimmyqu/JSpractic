<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames" >
            <el-collapse-item title="合同退出信息" v-if="projectContractModel.contractStatus==70 || projectContractModel.contractStatus==90" name="0">
                <div class="flex-panel detail-box">
                    <!--合同条款-->
                    <div class="detail-item big">
                        <label class="control-label">合同退出日期</label>
                        <div class="input-group">
                            <span>{{projectContractModel.contractOutDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">是否提前退出</label>
                        <div class="input-group">
                            <span>{{projectContractModel.isAdvanceExitText}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">退出方式</label>
                        <div class="input-group">
                            <span>{{projectContractModel.exitModeText}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">违约金</label>
                        <div class="input-group">
                            <span>{{projectContractModel.breakAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">违约原因</label>
                        <div class="input-group">
                            <span>{{projectContractModel.breakReason}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
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
                    <!--<div class="detail-item ">
                        <label class="control-label">交车日期</label>
                        <div class="input-group">
                            <span>{{projectContractModel.deliveryDate}}</span>
                        </div>
                    </div>-->
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
                    <div class="detail-item big">
                        <label class="control-label">合同附件</label>
                        <upload-panel :size="1"  disabled :file-list.sync="imgs"></upload-panel>
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
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同车辆信息" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车辆总数</label>
                        <div class="input-group">
                            <span>{{projectContractModel.vehicleTotalQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月车辆总租金</label>
                        <div class="input-group">
                            <span>{{projectContractModel.vehicleTotalCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机总数</label>
                        <div class="input-group">
                            <span>{{projectContractModel.driverTotalQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">每月司机总费用</label>
                        <div class="input-group">
                            <span>{{projectContractModel.driverTotalCost}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="合同明细" name="5">
                <el-table class="left" border :data="projectContractDetailList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="settlementOrganizationName" label="结算组织" min-width="150"></el-table-column>
                    <el-table-column prop="useCarStartDate" label="用车开始时间" min-width="150"></el-table-column>
                    <el-table-column prop="useCarEndDate" label="用车结束时间" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleQuantity" label="车辆数（台）" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleCost" label="车辆每月费用(元)" min-width="150" ></el-table-column>
                    <el-table-column prop="driverQuantity" label="司机人数（名）" min-width="150" label-class-name="required"></el-table-column>
                    <el-table-column prop="driverCost" label="司机每月费用(元)" min-width="150" label-class-name="required"></el-table-column>
                </el-table>
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
    import UploadPanel from '@/components/UploadPanel/index'
    import { number_format } from '@/utils'
    import {tool} from '@/utils/common'

    export default {
        name: "serviceHostingContractDetail",
        components:{ ApprovalFlow, FileDetail ,UploadPanel},
        mixins:[tool],
        data(){
            return {
                activeNames: ['0', '1','2', '3', '4','5', '6', '7'],
                projectContractModel:{},
                projectContractConfirmModel:{},
                projectContractDetailList:[],
                id: this.$route.params.id,
                confirmType: this.$route.query.confirmType,
                imgs:[],
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
                ajax.get("core/serviceHostingContract/detail/" + this.id).then(result =>{
                    if (this.checkResponse(result)) {
                        this.projectContractModel=result.data;
                        if(result.data.attachment){
                            this.imgs=JSON.parse(result.data.attachment);
                        }
                        this.projectContractDetailList=result.data.contractDetailList;
                    }
                });
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
        },

    }
</script>
