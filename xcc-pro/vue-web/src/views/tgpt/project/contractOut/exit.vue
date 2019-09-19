<template>
    <div class="form-panel detail-panel">
        <el-form label-position="top" label-width="100px" ref="contractOutForm" :model="contractOutForm" :rules="rules">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="合同退出信息" name="0">
                    <div class="flex-panel">
                        <el-form-item label="是否提前退出" prop="isAdvanceExit">
                            <el-select v-model="contractOutForm.isAdvanceExit" placeholder="请选择" clearable>
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="退出方式" prop="exitMode">
                            <el-select v-model="contractOutForm.exitMode" placeholder="请选择" clearable
                                      >
                                <el-option label="违约退出" :value="1"></el-option>
                                <el-option label="正常退出" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="违约金" v-if="contractOutForm.exitMode == 1" prop="breakAmount" :rules="[
                                  {pattern: /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/,required: true,  message: '金额最长11位，保留2位小数', trigger: 'blur'}
                                ]">
                            <el-input v-model="contractOutForm.breakAmount"></el-input>
                        </el-form-item>

                        <el-form-item label="违约原因" v-if="contractOutForm.exitMode == 1" prop="breakReason" :rules="[
                                  {max: 200, message: '违约原因最长200字符', trigger: 'blur'}
                                ]">
                            <el-input type="textarea" v-model="contractOutForm.breakReason"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="合同基本信息" name="1">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">发起人</label>
                            <div class="input-group">
                                <span>{{contractOutForm.originatorName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">发起部门</label>
                            <div class="input-group">
                                <span>{{contractOutForm.originateDeptName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">业务员</label>
                            <div class="input-group">
                                <span>{{contractOutForm.originatorName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">申请日期</label>
                            <div class="input-group">
                                <span>{{contractOutForm.applicationDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同开始日期</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractStartDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同结束日期</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractEndDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">交车日期</label>
                            <div class="input-group">
                                <span>{{contractOutForm.deliveryDate}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">客户类型</label>
                            <div class="input-group">
                                <span>{{contractOutForm.customerType==1?'企业客户':(contractOutForm.customerType==2?'个人客户':'/')}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <span>{{contractOutForm.originatorName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">项目评审</label>
                            <div class="input-group">
                                <span>{{contractOutForm.projectName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">项目编号</label>
                            <div class="input-group">
                                <span>{{contractOutForm.reviewNumber}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">项目总金额</label>
                            <div class="input-group">
                                <span>{{contractOutForm.projectTotalAmount}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">报价模板</label>
                            <div class="input-group">
                                <span>{{contractOutForm.quotationTemplateName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">报价范围</label>
                            <div class="input-group">
                                <span>{{contractOutForm.quotationRangeName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">保险购买方式</label>
                            <div class="input-group">
                                <span>{{contractOutForm.insurancePurchaseModeName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">违章代办方式</label>
                            <div class="input-group">
                                <span>{{contractOutForm.peccancyHandleModeName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">我方签约主体</label>
                            <div class="input-group">
                                <span>{{contractOutForm.ourContractSubjectName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">对方签约主体</label>
                            <div class="input-group">
                                <span>{{contractOutForm.otherContractSubject}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同议定方</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractAgreedPartyName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同文本类型</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractTextTypeName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">押金条件</label>
                            <div class="input-group">
                                <span>{{contractOutForm.depositCondition}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">用印地点</label>
                            <div class="input-group">
                                <span>{{contractOutForm.useSealPlaceName}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="合同费用信息" name="2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">是否含税</label>
                            <div class="input-group">
                                <span v-if="contractOutForm.isContainTax == 1">是</span>
                                <span v-else>否</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">是否开票</label>
                            <div class="input-group">
                                <span v-if="contractOutForm.isOpenTicket == 1">是</span>
                                <span v-else>否</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">发票税率（车）</label>
                            <div class="input-group">
                                <span>{{contractOutForm.invoiceTaxRateVehicle}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">发票税率（司机）</label>
                            <div class="input-group">
                                <span>{{contractOutForm.invoiceTaxRateDriver}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">结算方式</label>
                            <div class="input-group">
                                <span>{{contractOutForm.settlementModelName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">结算日</label>
                            <div class="input-group">
                                <span>{{contractOutForm.settlementDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">付款方式</label>
                            <div class="input-group">
                                <span>{{contractOutForm.paymentModelName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">付款周期（日）</label>
                            <div class="input-group">
                                <span>{{contractOutForm.paymentCycle}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同金额</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractAmount}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同期（月）</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractCycle}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="合同条款" name="3">
                    <div class="flex-panel detail-box">
                        <div class="detail-item big">
                            <label class="control-label">合同主要条款</label>
                            <div class="input-group">
                                <span>{{contractOutForm.contractMainTerm}}</span>
                            </div>
                        </div>

                        <div class="detail-item big">
                            <label class="control-label">争议解决方式</label>
                            <div class="input-group">
                                <span>{{contractOutForm.disputeSolveMode}}</span>
                            </div>
                        </div>

                        <div class="detail-item big">
                            <label class="control-label">备注</label>
                            <div class="input-group">
                                <span>{{contractOutForm.remark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="合同明细" name="4">
                    <el-table border style="width: 100%" :data="contractOutForm.contractDetailList">
                        <!--<el-table-column prop="zip" label="流水号" width="120"></el-table-column>
                        <el-table-column prop="date" label="合同编号" width="150"></el-table-column>
                        <el-table-column prop="name" label="项目评审" width="120"></el-table-column>
                        <el-table-column prop="province" label="服务客户" width="120"></el-table-column>
                        <el-table-column prop="city" label="招标编号" width="120"></el-table-column>
                        <el-table-column prop="date" label="合同开始日期" width="300"></el-table-column>
                        <el-table-column prop="zip" label="合同金额" width="120"></el-table-column>
                        <el-table-column prop="date" label="合同结束日期" width="300"></el-table-column>
                        <el-table-column prop="city" label="合同状态" width="120"></el-table-column>
                        <el-table-column prop="city" label="合同退出状态" width="120"></el-table-column>
                        <el-table-column prop="date" label="申请日期" width="300"></el-table-column>
                        <el-table-column prop="city" label="合同期（月）" width="120"></el-table-column>
                        <el-table-column prop="city" label="车辆新旧" width="120"></el-table-column>
                        <el-table-column prop="province" label="发起人" width="120"></el-table-column>
                        <el-table-column prop="province" label="发起部门" width="120"></el-table-column>
                        <el-table-column prop="province" label="业务员" width="120"></el-table-column>
                        <el-table-column prop="province" label="信息完整性" width="120"></el-table-column>
                        <el-table-column prop="province" label="资金安排" width="120"></el-table-column>
                        <el-table-column prop="province" label="服务信息确认" width="120"></el-table-column>
                        <el-table-column prop="province" label="车务信息确认" width="120"></el-table-column>
                        <el-table-column prop="province" label="人员招聘确认" width="120"></el-table-column>
                        <el-table-column prop="province" label="人员成本报价确认" width="150"></el-table-column>
                        <el-table-column prop="province" label="分公司筹备确认" width="120"></el-table-column>-->
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
            </el-collapse>
            <!--按钮-->
            <el-form-item class="left-row">
                <el-button type="primary" @click="save('contractOutForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"projectContractOutExit",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data: function () {
            return {
                activeNames: ["0", "1", "2", "3", "4", "5"],
                breakItemShow: false,
                contractId: "",
                contractOutForm: {
                    id: "",
                    isAdvanceExit: null,
                    exitMode: null,
                    breakAmount: null,
                    breakReason: null,
                    assetAllocationDisposalConfirm: null,
                    driverArrangementConfirm: null,
                    carConditionExplainConfirm: null,
                    insuranceConfirm: null,
                    peccancyConfirm: null,
                    chargedConfirm: null,
                    contractDetailList: []
                },
                rules: {
                    isAdvanceExit: [
                        {required: true, message: '退出状态不能为空', trigger: 'blur'},
                    ],
                    exitMode: [
                        {required: true, message: '退出方式不能为空', trigger: 'blur'},
                    ],
                },
            }
        },
        methods: {
            open: function () {
                //初始化页面参数
                this.contractOutForm.id = this.$route.query.id;
                //初始化页面数据
                this.initFormData(this.$route.query.id);
                //清空表单验证
                if (this.$refs["contractOutForm"]) {
                    this.$refs["contractOutForm"].clearValidate();
                }
            },
            initFormData: function (id) {
                //初始化当前用户和当前时间
                // this.currentUserName = this.getCurrentUserInfo().name;
                // this.currentTime = new Date().format('yyyy-MM-dd');
                ajax.get("core/projectContractOut/detail/" + id).then(res => {
                    this.contractOutForm = res.data;
                });
            },
            save: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {//校验通过
                        let postData = {
                            id: this.contractOutForm.id,
                            confirmType: 0,
                            isAdvanceExit: this.contractOutForm.isAdvanceExit,
                            exitMode: this.contractOutForm.exitMode,
                            breakAmount: this.contractOutForm.breakAmount,
                            breakReason: this.contractOutForm.breakReason,
                        };
                        ajax.post("core/projectContractOut/applyContractOut", postData).then((result) => {
                            this.$message.success('退出申请成功');
                            //关闭当前页
                            this.close();
                        });
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });
            },
            exitModeChange: function () {
                //退出方式改变，显示和隐藏违约金和违约原因
                if (this.contractOutForm.exitMode == 1) {//1-违约退出
                    this.breakItemShow = true;
                } else {
                    this.breakItemShow = false;
                }
            },
        },
        mounted(){
            this.open();
        }
    }
</script>

