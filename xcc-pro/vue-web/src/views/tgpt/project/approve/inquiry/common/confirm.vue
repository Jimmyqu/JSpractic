<template>
    <div class="form-panel">
        <el-form :model="inquiryForm" ref="inquiryForm" label-position="top" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="消息确认" name="1">
                    <div class="flex-panel" v-if="type == 3">
                        <el-form-item label="人力询价确认">
                            <el-select v-model="inquiryForm.project.humanConfirm">
                                <el-option label="未确认" :value="0"></el-option>
                                <el-option label="已确认" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人力询价确认人">
                            <el-input :value="inquiryForm.confirmInfo.name" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="人力询价确认时间">
                            <el-input :value="inquiryForm.confirmInfo.date" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="flex-panel" v-if="type == 2">
                        <el-form-item label="维保询价确认" class="font_stress" required>
                            <el-select v-model="inquiryForm.project.maintenanceConfirm">
                                <el-option label="未确认" :value="0"></el-option>
                                <el-option label="已确认" :value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="维保询价确认人">
                            <el-input :value="inquiryForm.confirmInfo.name" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="维保询价确认时间">
                            <el-input :value="inquiryForm.confirmInfo.date" disabled></el-input>
                        </el-form-item>
                    </div>
                    <div class="flex-panel" v-if="type == 1">
                        <el-form-item label="采购询价确认" class="font_stress" required>
                            <el-select v-model="inquiryForm.project.purchaseConfirm">
                                <el-option label="未确认" :value="0"></el-option>
                                <el-option label="已确认" :value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="采购询价确认人">
                            <el-input :value="inquiryForm.confirmInfo.name" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="采购询价确认时间">
                            <el-input :value="inquiryForm.confirmInfo.date" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="项目评审" name="2">

                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="region">
                            <el-input :value="inquiryForm.project.originateDeptName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="inquiryForm.project.projectName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="客户类型" prop="customerType">
                            <el-select v-model="inquiryForm.project.customerType"  disabled>
                                <el-option label="企业客户" value="1" key="1"> </el-option>
                                <el-option label="个人客户" value="2" key="2"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务客户" prop="enterpriseId">
                            <el-input v-model="inquiryForm.project.enterpriseName" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="项目类型">
                            <el-select v-model="inquiryForm.project.projectType" disabled>
                                <el-option label="自驾" value="自驾"></el-option>
                                <el-option label="配驾" value="配驾"></el-option>
                                <el-option label="司机托管" value="司机托管"></el-option>
                                <el-option label="车辆托管" value="车辆托管"></el-option>
                                <el-option label="司机与车辆托管" value="司机与车辆托管"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目负责人">
                            <el-input v-model="inquiryForm.project.projectLeaderName" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="油费类型" prop="">
                            <el-select v-model="inquiryForm.project.oilFeePaymenModel" disabled>
                                <el-option label="全包" value="1"></el-option>
                                <el-option label="里程内包" value="2"></el-option>
                                <el-option label="不包" value="3"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目周期（月）" prop="contractMonth">
                            <el-input v-model.number="inquiryForm.project.contractMonth" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请日期">
                            <el-date-picker type="date" disabled v-model="inquiryForm.project.applicationDateStr"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="交付日期">
                            <el-date-picker type="date" disabled v-model="inquiryForm.project.deliveryDate"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="招标编号" prop="tenderId">
                            <template>
                                <el-select
                                    disabled
                                    v-model="inquiryForm.project.tenderId"
                                    placeholder="请输入">
                                    <el-option
                                        v-for="item in tenderNumberArray"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>

                        <el-form-item label="是否框架合同">
                            <el-select v-model="inquiryForm.project.frameContract" disabled>
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="费用信息" name="3">
                    <div class="flex-panel">
                        <el-form-item label="结算方式" prop="settlementModel">
                            <el-select placeholder="请选择结算方式" v-model="inquiryForm.project.settlementModel" disabled>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日（日）" prop="settlementDate" >
                            <el-input v-model.number="inquiryForm.project.settlementDate" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="结算周期（天）" prop="settlementCycle">
                            <el-input v-model.number="inquiryForm.project.settlementCycle" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel">
                            <el-select placeholder="请选择付款方式" v-model="inquiryForm.project.paymentModel" disabled>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目总金额（元）" prop="totalAmount">
                            <el-input v-model="inquiryForm.project.totalAmount" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="押金金额（元）" prop="deposit">
                            <el-input v-model="inquiryForm.project.deposit" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="保证金金额（元）" prop="depositAmount">
                            <el-input v-model="inquiryForm.project.depositAmount" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="服务费金额（元）" prop="serviceCost">
                            <el-input v-model="inquiryForm.project.serviceCost" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="发票税率（人%）" prop="invoiceTaxRateDriver">
                            <el-input v-model.number="inquiryForm.project.invoiceTaxRateDriver" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发票税率（车%）" prop="invoiceTaxRateVehicle">
                            <el-input v-model.number="inquiryForm.project.invoiceTaxRateVehicle" disabled>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="询价明细" name="4">
                    <!--人力-->
                    <el-table v-if="type == 3" :data="inquiryForm.inquiryArray" border style="width: 100%;">

                        <el-table-column
                            prop="sortNum"
                            label="序号"
                            min-width="140">
                        </el-table-column>

                        <el-table-column
                            prop="serviceCityName"
                            label="服务城市"
                            min-width="150">
                            <template slot-scope="scope">
                                {{scope.row.serviceCityName}}/{{scope.row.provinceName}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="vehicleModelInfoName"
                            label="车型"
                            min-width="250">
                        </el-table-column>

                        <el-table-column
                            prop="vehicleQty"
                            label="车辆台数"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="driverQty"
                            label="驾驶员人数"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="carAge"
                            label="车龄（月）"
                            min-width="120">
                        </el-table-column>

                        <el-table-column label="基本工资" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.basicSalary'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.basicSalary"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="单位社保(¥)" min-width="120">

                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.socialSecurityCompany'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">

                                    <el-input type="text"
                                              v-model="scope.row.socialSecurityCompany"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="个人社保(¥)"
                            min-width="120">

                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.socialSecurityPersonal'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">

                                    <el-input type="text" v-model="scope.row.socialSecurityPersonal"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="单位公积金(¥)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.providentFundCompany'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">


                                    <el-input type="text" v-model="scope.row.providentFundCompany"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="个人公积金(¥)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.providentFundPersonal'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">

                                    <el-input type="text" v-model="scope.row.providentFundPersonal"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="其他福利(¥)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.otherWeal'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">

                                    <el-input type="text" v-model="scope.row.otherWeal"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column prop="customerLimitPrice" label="客户限价（不含税）(¥)" min-width="170">
                        </el-table-column>

                        <el-table-column prop="customerLimitPriceTax" label="客户限价（含税）(¥)" min-width="160">
                        </el-table-column>

                        <el-table-column label="司机其他要求" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.driverOtherRequirement'"
                                    :rules="{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }">

                                    <el-input type="text" v-model="scope.row.driverOtherRequirement"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop=""
                            label=""
                            min-width="30">
                        </el-table-column>
                    </el-table>
                    <!--维保-->
                    <el-table v-if="type == 2" :data="inquiryForm.inquiryArray" border style="width: 100%;">

                        <el-table-column
                            prop="sortNum"
                            label="序号"
                            min-width="140">
                        </el-table-column>

                        <el-table-column
                            prop="serviceCityName"
                            label="服务城市"
                            min-width="150">
                            <template slot-scope="scope">
                                {{scope.row.serviceCityName}}/{{scope.row.provinceName}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="vehicleModelInfoName"
                            label="车型"
                            min-width="250">
                        </el-table-column>

                        <el-table-column
                            prop="vehicleQty"
                            label="车辆台数"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="driverQty"
                            label="驾驶员人数"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="carAge"
                            label="车龄（月）"
                            min-width="120">
                        </el-table-column>


                        <el-table-column label="每年保险" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.insuranceCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.insuranceCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>


                        <el-table-column label="每月维修" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.maintenanceCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.maintenanceCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="每月保养" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.maintainCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.maintainCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="每月油路费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.oilCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.oilCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="车船税（年）" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.carShipTax'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.carShipTax" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="月GPS使用费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.gpsCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.gpsCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="年检费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.inspectionCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.inspectionCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="绿标费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.greenLabeCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.greenLabeCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="年票费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.yearTicketCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.yearTicketCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="每月停车费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.parkCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.parkCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="车龄定期清洁消毒费用" min-width="180">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.cleanCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.cleanCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="月牌照使用费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.licencesUseCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.licencesUseCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop=""
                            label=""
                            min-width="30">
                        </el-table-column>
                    </el-table>
                    <!--采购-->
                    <el-table v-if="type == 1" :data="inquiryForm.inquiryArray" border style="width: 100%;">

                        <el-table-column
                            prop="sortNum"
                            label="序号"
                            min-width="140">
                        </el-table-column>

                        <el-table-column
                            prop="serviceCityName"
                            label="服务城市"
                            min-width="150">

                            <template slot-scope="scope">
                                {{scope.row.serviceCityName}}/{{scope.row.provinceName}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="vehicleModelInfoName"
                            label="车型"
                            min-width="250">
                        </el-table-column>

                        <el-table-column
                            prop="vehicleQty"
                            label="车辆台数"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="driverQty"
                            label="驾驶员人数"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="carAge"
                            label="车龄（月）"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="retrofitRequirementOptionsText"
                            label="加装要求选项"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="retrofitRequirement"
                            label="其他加装要求"
                            min-width="120">
                        </el-table-column>

                        <el-table-column label="购车价格" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.carPrice'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.carPrice" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>


                        <el-table-column
                            prop="recentPrice"
                            label="最近价格(¥)"
                            min-width="100">
                        </el-table-column>

                        <el-table-column label="加装费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.installationCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">
                                    <el-input type="text" v-model="scope.row.installationCost" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="采购说明" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'inquiryArray.' + scope.$index  + '.procurementExplanation'"
                                    :rules="{ max: 50, message: '长度不能超过50个字符', trigger: 'blur' }">

                                    <el-input type="text" v-model="scope.row.procurementExplanation"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop=""
                            label=""
                            min-width="30">
                        </el-table-column>
                    </el-table>
                </el-collapse-item>

            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitInquiry('inquiryForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "confirm",
        mixins: [tool],
        data() {
            return {
                type: this.$route.query.type,
                openCollapse: [],
                inquiryForm: {
                    project: {},
                    inquiryArray: [],
                    confirmInfo: {}
                },
                frameContractOps: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                moneyRegex: /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/,
                tenderNumberArray: []
            }
        },
        methods: {
            inquiryParam() {
                ajax.get('/core/coreProjectReview/detailByInquiry'
                    , {id: this.$route.query.id}).then(rs => {

                    this.$set(this.inquiryForm, 'project', rs.data['project']);
                    this.$set(this.inquiryForm, 'inquiryArray', rs.data['inquiry']);

                    rs.data.confirmInfoArray.forEach(item => {
                        if (item.type == this.type)
                            this.$set(this.inquiryForm, 'confirmInfo', item);
                    });

                    let p = rs.data['project'];
                    this.tenderNumberArray = [{
                        label: p.bidNo,
                        value: p.tenderId
                    }];
                    if(this.inquiryForm.project.frameContract)
                    this.inquiryForm.project.frameContract += '';
                    if(this.inquiryForm.project.oilFeePaymenModel)
                    this.inquiryForm.project.oilFeePaymenModel += '';
                });
            },
            open() {
                this.openCollapse = ["1", "2", "3", "4"];
                this.inquiryParam();
            }
            ,
            close() {
                if (this.type == 1) {
                    this.closeCurPage("/tgpt/project/purchase");
                } else if (this.type == 2) {
                    this.closeCurPage("/tgpt/project/maintenance");
                } else if (this.type == 3) {
                    this.closeCurPage("/tgpt/project/human");
                }
            }
            ,
            submitInquiry(form) {
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    var data = {
                        inquiryType: this.type,
                        projectId: this.inquiryForm.project.id,
                        inquiry: this.inquiryForm.inquiryArray
                    };
                    if (this.type == 1) {
                        data.confirmStatus = this.inquiryForm.project.purchaseConfirm;
                    } else if (this.type == 2) {
                        data.confirmStatus = this.inquiryForm.project.maintenanceConfirm;
                    } else if (this.type == 3) {
                        data.confirmStatus = this.inquiryForm.project.humanConfirm;
                    }

                    ajax.post('/core/coreProjectReview/inquiryConfirm', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });

                            this.close();
                            this.$emit('load');
                        } else {
                            this.$message.error(rs.message);
                        }
                    });
                });
            }
        },
        mounted() {
            this.open();
        }
    }
</script>
