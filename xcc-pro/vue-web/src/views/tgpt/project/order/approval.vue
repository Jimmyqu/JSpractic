<template>
    <!--提交审批-->
    <div class="form-panel">
        <el-form :model="approvalForm" label-position="top" :rules="rules" ref="approvalForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--调度-->
                <el-collapse-item title="基本信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="合同编号">
                            <el-input v-model="approvalForm.contractNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用车城市">
                            <el-input v-model="approvalForm.enterpriseName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务客户">
                            <el-input v-model="approvalForm.orderNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用车开始日期">
                            <el-input v-model="approvalForm.startDate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="租车月数">
                            <el-input v-model="approvalForm.contractCycle" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <!--司机及车型情况-->
                <el-collapse-item title="司机及车型情况" name="2">
                    <div class="flex-panel">
                        <el-form-item label="是否需司机">
                            <el-select placeholder="请选择" clearable v-model="approvalForm.isNeedDriver" :disabled="true">
                                <el-option label="是" :value="1"> </el-option>
                                <el-option label="否" :value="0"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="司机姓名">
                            <el-input v-model="approvalForm.driverName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机手机号">
                            <el-input v-model="approvalForm.phone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车型名称">
                            <el-input v-model="approvalForm.modelName" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="价格信息" name="3">
                    <div class="flex-panel" >
                        <el-form-item label="每月车辆租金（元）">
                            <el-input v-model="approvalForm.carRentMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="每月车辆租金_执行价（元）" prop="orderCarRentMonth">
                            <el-input v-model="approvalForm.orderCarRentMonth"></el-input>
                        </el-form-item>
                        <el-form-item label="每月车辆油费（元）" >
                            <el-input v-model="approvalForm.carOilCostMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="每月车辆油费_执行价（元）" prop="orderCarOilCostMonth">
                            <el-input v-model="approvalForm.orderCarOilCostMonth"></el-input>
                        </el-form-item>
                        <el-form-item label="每月限制里程（公里）">
                            <el-input v-model="approvalForm.limitMileageMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="每月限制里程_执行价（公里）" prop="orderLimitMileageMonth">
                            <el-input v-model="approvalForm.orderLimitMileageMonth"></el-input>
                        </el-form-item>
                        <el-form-item label="超里程单价（元）">
                            <el-input v-model="approvalForm.overMileagePrice" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="超里程单价_执行价（元）" prop="orderOverMileagePrice">
                            <el-input v-model="approvalForm.orderOverMileagePrice" ></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机费用（元）">
                            <el-input v-model="approvalForm.driverCostMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机费用_执行价（元）" prop="orderDriverCostMonth">
                            <el-input v-model="approvalForm.orderDriverCostMonth"></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机通讯费（元）">
                            <el-input v-model="approvalForm.driverCommunicationCostMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机通讯费_执行价（元）" prop="orderDriverCommunicationCostMonth">
                            <el-input v-model="approvalForm.orderDriverCommunicationCostMonth"></el-input>
                        </el-form-item>
                        <el-form-item label="其他补贴费用（元）">
                            <el-input v-model="approvalForm.otherSubsidyCost" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="其他补贴费用_执行价（元）" prop="orderOtherSubsidyCost">
                            <el-input v-model="approvalForm.orderOtherSubsidyCost"></el-input>
                        </el-form-item>
                        <el-form-item label="司机每天工作时长（小时）">
                            <el-input v-model="approvalForm.driverWorktimeDay" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机每天工作时长_执行（小时）" prop="orderDriverWorktimeDay">
                            <el-input v-model="approvalForm.orderDriverWorktimeDay"></el-input>
                        </el-form-item>
                        <el-form-item label="油费支付类型">
                            <el-select v-model="approvalForm.oilFeePaymentModel" :disabled="true" placeholder="请选择">
                                <el-option label="全包" :value="1"></el-option>
                                <el-option label="里程内包" :value="2"></el-option>
                                <el-option label="不包" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="油费支付类型_执行" prop="orderOilFeePaymentModel">
                            <el-select v-model="approvalForm.orderOilFeePaymentModel" placeholder="请选择">
                                <el-option label="全包" :value="1"></el-option>
                                <el-option label="里程内包" :value="2"></el-option>
                                <el-option label="不包" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('approvalForm')">保存</el-button>
                    <el-button @click="close()">返回</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>
    </div>
</template>

<script>
    import {startProcess} from '@/utils'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "projectOrderApproval",
        data(){
            return {
                openCollapse:["1","2","3"],
                organizationList:[],
                approvalForm : {},
                rules: {
                    orderCarRentMonth: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    orderCarOilCostMonth: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    orderLimitMileageMonth: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    orderOverMileagePrice: [
                        { validator: formRule.threeDecimalMoney, message: "请输入最大11位整数，3位小数", trigger: "change"}
                    ],
                    orderDriverCostMonth: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    orderDriverCommunicationCostMonth: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    orderOtherSubsidyCost: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    orderDriverWorktimeDay: [
                        { validator: formRule.money, message: "请输入正确小时数，2位小数", trigger: "change"}
                    ],
                }
            }
        },
        methods:{
            open(){
                this.approvalForm = {};
                if (this.$route.query.id){
                    this.initForm(this.$route.query.id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2","3"];
            },
            clearValidate(){
                if(this.$refs['approvalForm'])
                    this.$nextTick(_ =>{
                        this.$refs['approvalForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("core/projectOrder/detail/" + id).then(res => {
                    if(this.checkResponse(res)) {
                        this.approvalForm = res.data;
                        // 初始化执行价与价格一样
                        this.approvalForm.orderCarRentMonth = res.data.carRentMonth;
                        this.approvalForm.orderCarOilCostMonth = res.data.carOilCostMonth;
                        this.approvalForm.orderLimitMileageMonth = res.data.limitMileageMonth;
                        this.approvalForm.orderOverMileagePrice = res.data.overMileagePrice;
                        this.approvalForm.orderDriverCostMonth = res.data.driverCostMonth;
                        this.approvalForm.orderDriverCommunicationCostMonth = res.data.driverCommunicationCostMonth;
                        this.approvalForm.orderOtherSubsidyCost = res.data.otherSubsidyCost;
                        this.approvalForm.orderDriverWorktimeDay = res.data.driverWorktimeDay;
                        this.approvalForm.orderOilFeePaymentModel = res.data.oilFeePaymentModel;
                        this.clearValidate();
                    }

                })
            },
            getOrganzationList(){
                const userInfo = this.getCurrentUserInfo();
                this.organizationList=userInfo.organizationList;
            },
            submitForm(approvalForm) {
                this.$refs[approvalForm].validate((valid) => {
                    if (valid) {
                        ajax.post("core/projectOrder/approval", this.approvalForm).then((res) => {
                            if(this.checkResponse(res)) {
                                // 先提交保单数据，数据保存成功发起审批
                                this.approvalData();
                            }else {
                                this.$message.error(res.message);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            approvalData(){
                startProcess(this.approvalForm.id, "XMDD", (result) => {
                    if(this.checkResponse(result)){
                        this.$message.success('提交成功');
                        this.close();
                    }
                });
            },
        },
        mounted(){
            this.getOrganzationList();
            this.open();
        }
    }
</script>
<style scoped lang="scss">
    .flex-panel {
        .el-form-item {
            width: calc(25% - 20px);
        }
    }
</style>

