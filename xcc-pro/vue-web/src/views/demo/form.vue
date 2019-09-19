<template>
    <div class="form-panel">
        <el-form :model="addForm" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="确认信息" name="0">
                    <el-checkbox-group v-model="addForm.confirmType">
                        <el-checkbox label="1">信息完整性确认</el-checkbox>
                        <el-checkbox label="2">资金安排确认</el-checkbox>
                        <el-checkbox label="3">服务信息确认</el-checkbox>
                        <el-checkbox label="4">车务信息确认</el-checkbox>
                        <el-checkbox label="5">人员招聘信息确认</el-checkbox>
                        <el-checkbox label="6">人员成本报价确认</el-checkbox>
                        <el-checkbox label="7">分公司筹备确认</el-checkbox>
                    </el-checkbox-group>
                </el-collapse-item>
                <el-collapse-item title="项目评审" name="1">
                    <div class="flex-panel">
                        <el-form-item label="项目评审编号" prop="reviewNumber"
                                      :rules="[rules.required('请输入'),rules.int('请输入')]">
                            <el-input v-model="addForm.reviewNumber" placeholder="请输入"
                                      clearable maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="时间" prop="date">
                            <el-date-picker type="date" placeholder="请选择" v-model="addForm.date"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="地点" prop="address1">
                            <el-select v-model="addForm.address1" placeholder="请选择">
                                <el-option label="总部" :value="1"></el-option>
                                <el-option label="广州" :value="2"></el-option>
                                <el-option label="其他" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地点2" prop="address2">
                            <el-select v-model="addForm.address2" placeholder="请选择">
                                <el-option
                                    v-for="(item,index) in addressList"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文本" prop="text">
                            <el-input type="textarea" v-model="addForm.text" placeholder="请输入"
                                      maxlength="2000"></el-input>
                        </el-form-item>
                        <el-form-item label="金额" prop="money">
                            <money-input v-model="addForm.money" clearable placeholder="请输入" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="发起人" prop="originatorId">
                            <el-input v-model="addForm.originatorId" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="发起部门" prop="originateDeptId">
                            <el-input v-model="addForm.originateDeptId" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="addForm.projectName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="申请日期" prop="applicationDate">
                            <el-input v-model="addForm.applicationDate" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="服务客户id" prop="enterpriseId">
                            <el-input v-model="addForm.enterpriseId" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="服务城市说明" prop="serviceCityExplain">
                            <el-input v-model="addForm.serviceCityExplain" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="交期" prop="deliveryDate">
                            <el-input v-model="addForm.deliveryDate" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="合同期" prop="contractMonth">
                            <el-input v-model="addForm.contractMonth" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="结算日" prop="settlementDate">
                            <el-input v-model="addForm.settlementDate" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="结算方式" prop="settlementModel">
                            <el-input v-model="addForm.settlementModel" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="结算周期" prop="settlementCycle">
                            <el-input v-model="addForm.settlementCycle" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="付款方式" prop="paymentModel">
                            <el-input v-model="addForm.paymentModel" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="押金" prop="deposit">
                            <el-input v-model="addForm.deposit" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="保证金金额" prop="depositAmount">
                            <el-input v-model="addForm.depositAmount" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="服务费" prop="serviceCost">
                            <el-input v-model="addForm.serviceCost" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="发票税率" prop="invoiceTaxRateDriver">
                            <el-input v-model="addForm.invoiceTaxRateDriver" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="发票税率" prop="invoiceTaxRateVehicle">
                            <el-input v-model="addForm.invoiceTaxRateVehicle" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="是否框架合同" prop="frameContract">
                            <el-input v-model="addForm.frameContract" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="招标供应商" prop="supplierId">
                            <el-input v-model="addForm.supplierId" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="招标编号" prop="tenderNumber">
                            <el-input v-model="addForm.tenderNumber" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="发布公布日期" prop="releaseDate">
                            <el-input v-model="addForm.releaseDate" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="标包划分" prop="standardPackageDivided">
                            <el-input v-model="addForm.standardPackageDivided" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="投标日期" prop="bidDate">
                            <el-input v-model="addForm.bidDate" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="项目负责人" prop="projectLeaderId">
                            <el-input v-model="addForm.projectLeaderId" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="项目类型" prop="projectType">
                            <el-input v-model="addForm.projectType" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="招标信息链接" prop="bidInfoLink">
                            <el-input v-model="addForm.bidInfoLink" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="项目介绍内容" prop="introduceContent">
                            <el-input v-model="addForm.introduceContent" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="违约责任" prop="breakResponsibility">
                            <el-input v-model="addForm.breakResponsibility" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="评分标准" prop="gradeStandard">
                            <el-input v-model="addForm.gradeStandard" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="其他要求" prop="otherRequirement">
                            <el-input v-model="addForm.otherRequirement" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="项目总金额" prop="totalAmount">
                            <el-input v-model="addForm.totalAmount" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="是否需要询价" prop="inquiryRequire">
                            <el-input v-model="addForm.inquiryRequire" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="车辆采购确认" prop="purchaseConfirm">
                            <el-input v-model="addForm.purchaseConfirm" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="车辆维保确认" prop="maintenanceConfirm">
                            <el-input v-model="addForm.maintenanceConfirm" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="人力询价确认" prop="enquiryConfirm">
                            <el-input v-model="addForm.enquiryConfirm" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="评审状态" prop="reviewStatus">
                            <el-input v-model="addForm.reviewStatus" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="评审状态文本" prop="reviewStatusText">
                            <el-input v-model="addForm.reviewStatusText" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="访问人" prop="accessUser">
                            <el-input v-model="addForm.accessUser" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'

    export default {
        mixins: [tool,ruleTool],
        name: "coreProjectReviewForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['0','1'],
                addressList:[{id:1,name:1},{id:2,name:2}],
                addForm: {}
            }
        },
        mounted() {
            this.open();
        }
        ,
        methods: {
            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('core/coreProjectReview/' + this.$route.query.id).then(rs => {
                        this.addForm = rs;
                    });
                }
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('core/coreProjectReview/', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }
                    });
                });
            }
        }
    }
</script>

