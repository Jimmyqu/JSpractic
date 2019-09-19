<template>
    <div class="form-panel detail-panel">
        <el-form label-position="top" label-width="100px" ref="contractOutForm" :model="contractOutForm" :rules="rules">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="合同退出信息" name="0">
                    <div class="flex-panel">

                        <el-form-item label="合同退出日期" prop="contractOutDate">
                            <el-date-picker type="date" placeholder="请选择" v-model="contractOutForm.contractOutDate"
                                            value-format="yyyy-MM-dd" :picker-options="outOption"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="是否提前退出" prop="isAdvanceExit">
                            <el-select v-model="contractOutForm.isAdvanceExit" placeholder="请选择" clearable>
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="退出方式" prop="exitMode">
                            <el-select v-model="contractOutForm.exitMode" placeholder="请选择" clearable>
                                <el-option label="违约退出" :value="1"></el-option>
                                <el-option label="正常退出" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="违约金" v-if="contractOutForm.exitMode == 1" prop="breakAmount"
                                      :rules="[{pattern: /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/,required: true,  message: '金额最长11位，保留2位小数', trigger: 'blur'}]">
                            <el-input v-model="contractOutForm.breakAmount"></el-input>
                        </el-form-item>

                        <el-form-item label="违约原因" v-if="contractOutForm.exitMode == 1" prop="breakReason"
                                      :rules="[{max: 200, message: '违约原因最长200字符', trigger: 'blur'}]">
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

                        <!--<div class="detail-item">
                            <label class="control-label">交车日期</label>
                            <div class="input-group">
                                <span>{{contractOutForm.deliveryDate}}</span>
                            </div>
                        </div>-->
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
                    <el-table class="left" border :data="contractOutForm.contractDetailList" style="width: 100%">
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="settlementOrganizationName" label="结算组织" min-width="150"></el-table-column>
                        <el-table-column prop="vehicleQuantity" label="车辆数（台）" min-width="150"></el-table-column>
                        <el-table-column prop="vehicleCost" label="车辆每月费用(元)" min-width="150" ></el-table-column>
                        <el-table-column prop="driverQuantity" label="司机人数（名）" min-width="150" label-class-name="required"></el-table-column>
                        <el-table-column prop="driverCost" label="司机每月费用(元)" min-width="150" label-class-name="required"></el-table-column>
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
        name:"serviceHostingContractExit",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data: function () {
            return {
                activeNames: ["0", "1", "2", "3", "4", "5"],
                breakItemShow: false,
                contractId: "",
                contractOutForm: {
                },
                outOption:{
                    disabledDate(e){
                        return e<new Date();
                    }
                },
                rules: {
                    contractOutDate: [
                        {required: true, message: '合同退出日期不能为空', trigger: 'blur'},
                    ],
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
                ajax.get("core/serviceHostingContract/detail/" + id).then(res => {
                    this.contractOutForm = res.data;
                });
            },
            save: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {//校验通过
                        let postData = {
                            id: this.contractOutForm.id,
                            isAdvanceExit: this.contractOutForm.isAdvanceExit,
                            exitMode: this.contractOutForm.exitMode,
                            breakAmount: this.contractOutForm.breakAmount,
                            breakReason: this.contractOutForm.breakReason,
                            contractOutDate: this.contractOutForm.contractOutDate
                        };
                        ajax.post("core/serviceHostingContract/applyContractOut", postData).then((result) => {
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

