<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames" >
            <el-collapse-item title="合同信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同状态</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">供车单位</label>
                        <div class="input-group">
                            <span>{{leaseContract.providerCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同开始日期</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractStartDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同结束日期</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractEndDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">合同附件</label>
                        <upload-panel :size="1"  disabled :file-list.sync="imgs"></upload-panel>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="费用信息" name="2">
                <div class="flex-panel detail-box">
                    <!--合同费用信息-->
                    <div class="detail-item">
                        <label class="control-label">是否含税</label>
                        <div class="input-group">
                            <span>{{leaseContract.isContainTaxText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否开票</label>
                        <div class="input-group">
                            <span>{{leaseContract.isOpenTicketText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率（车）</label>
                        <div class="input-group">
                            <span>{{leaseContract.invoiceTaxRateVehicle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票税率(司机)</label>
                        <div class="input-group">
                            <span>{{leaseContract.invoiceTaxRateDriver}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算方式</label>
                        <div class="input-group">
                            <span>{{leaseContract.settlementModelText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算日</label>
                        <div class="input-group">
                            <span>{{leaseContract.settlementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款方式</label>
                        <div class="input-group">
                            <span>{{leaseContract.paymentModelText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款周期（日）</label>
                        <div class="input-group">
                            <span>{{leaseContract.paymentCycle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同金额(元)</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractAmount==null?'':numberFormat(leaseContract.contractAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同期（月）</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractCycle}}</span>
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
                            <span>{{leaseContract.contractMainTerm}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">争议解决方式</label>
                        <div class="input-group">
                            <span>{{leaseContract.disputeSolveMode}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{leaseContract.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="合同明细" name="5">
                <el-table class="left" border :data="projectContractDetailList" style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="useCarCityName" label="用车城市" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleModelInfoName" label="车型" min-width="150"></el-table-column>
                    <el-table-column prop="useCarStartDate" label="用车开始时间" min-width="150"></el-table-column>
                    <el-table-column prop="useCarEndDate" label="用车结束时间" min-width="150"></el-table-column>
                    <el-table-column prop="carColorText" label="颜色" min-width="150"></el-table-column>
                    <el-table-column prop="carAge" label="车龄" min-width="150"></el-table-column>
                    <el-table-column prop="newOrOldCarText" label="车辆新旧" min-width="150"></el-table-column>
                    <el-table-column prop="carRentMonth" label="每月车辆租金(元)" min-width="150" ></el-table-column>
                    <el-table-column prop="vehicleQty" label="车辆台数（台）" min-width="150"></el-table-column>
                    <el-table-column prop="oilFeePaymenModelText" label="油费支付类型" min-width="150"></el-table-column>
                    <el-table-column prop="carOilCostMonth"label="每月车辆油费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="limitMileageMonth" label="每月限制里程公里" min-width="150"></el-table-column>
                    <el-table-column prop="overMileagePrice" label="超里程单价(元)" min-width="150"></el-table-column>
                    <el-table-column prop="etcCost" label="ETC费(元)" min-width="150"></el-table-column>
                    <el-table-column prop="retrofitRequirement" label="加装要求" min-width="150"></el-table-column>
                    <el-table-column prop="procurementExplanation" label="采购说明" min-width="150"></el-table-column>
                    <el-table-column prop="retrofitRequirementOptionsText" label="加装要求选项" min-width="150"></el-table-column>
                    <el-table-column prop="isNeedDriverText"  label="是否需要司机" min-width="150"></el-table-column>
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
            <el-collapse-item title="合同退出信息" name="0" v-show="leaseContract.contractStatusText=='已退出'">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">合同退出日期</label>
                        <div class="input-group">
                            <span>{{leaseContract.contractOutDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否提前退出</label>
                        <div class="input-group">
                            <span v-if="leaseContract.isAdvanceExit == 1">是</span>
                            <span v-else>否</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">退出方式</label>
                        <div class="input-group">
                            <span>{{leaseContract.exitModeText}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="leaseContract.exitMode == 1">
                        <label class="control-label">违约金</label>
                        <div class="input-group">
                            <span>{{leaseContract.breakAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="leaseContract.exitMode == 1">
                        <label class="control-label">违约原因</label>
                        <div class="input-group">
                            <span>{{leaseContract.breakReason}}</span>
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
    import UploadPanel from '@/components/UploadPanel/index'
    import { number_format } from '@/utils'
    import {tool} from '@/utils/common'

    export default {
        name: "leaseContractDetail",
        components:{FileDetail ,UploadPanel},
        mixins:[tool],
        data(){
            return {
                activeNames: ['0', '1','2', '3', '4','5', '6', '7'],
                leaseContract:{},
                projectContractConfirmModel:{},
                projectContractDetailList:[],
                id: this.$route.params.id,
                confirmType: this.$route.query.confirmType,
                imgs:[],
            }
        },
        mounted: function () {
            this.detail();
        },
        methods: {
            detail:function () {
                ajax.get("core/leaseContract/detail/"+this.id).then(result =>{
                    if (this.checkResponse(result)) {
                        this.leaseContract=result.data;
                        if(result.data.attachment){
                            this.imgs=JSON.parse(result.data.attachment);
                        }
                        this.projectContractDetailList=result.data.detailList;
                       // this.projectContractConfirmModel=result.data[2];
                    }
                });
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
        },

    }
</script>
