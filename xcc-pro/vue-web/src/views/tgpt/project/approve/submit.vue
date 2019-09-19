<template>
    <div class="form-panel">
        <el-form :model="reviewForm" ref="reviewForm" label-position="top" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="消息确认" name="1">
                    <div class="flex-panel" v-if="reviewForm.confirmInfo.a_1">
                        <el-form-item label="采购询价确认" class="font_stress"
                                      required>
                            <el-select v-model="reviewForm.project.purchaseConfirm" disabled>
                                <el-option label="" value=""></el-option>
                                <el-option label="未确认" value="0"></el-option>
                                <el-option label="已确认" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="采购询价确认人">
                            <el-input :value="reviewForm.confirmInfo.a_1.name" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="采购询价确认时间">
                            <el-input :value="reviewForm.confirmInfo.a_1.date" disabled></el-input>
                        </el-form-item>
                    </div>

                    <div class="flex-panel" v-if="reviewForm.confirmInfo.a_2">
                        <el-form-item label="维保询价确认" class="font_stress" required>
                            <el-select v-model="reviewForm.project.maintenanceConfirm" disabled>
                                <el-option label="" value=""></el-option>
                                <el-option label="未确认" value="0"></el-option>
                                <el-option label="已确认" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="采购询价确认人">
                            <el-input :value="reviewForm.confirmInfo.a_2.name" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="采购询价确认时间">
                            <el-input :value="reviewForm.confirmInfo.a_2.date" disabled></el-input>
                        </el-form-item>
                    </div>

                    <div class="flex-panel" v-if="reviewForm.confirmInfo.a_3">
                        <el-form-item label="人力询价确认" class="font_stress" required>
                            <el-select v-model="reviewForm.project.humanConfirm" disabled>
                                <el-option label="" value=""></el-option>
                                <el-option label="未确认" value="0"></el-option>
                                <el-option label="已确认" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="人力询价确认人">
                            <el-input :value="reviewForm.confirmInfo.a_3.name" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="人力询价确认时间">
                            <el-input :value="reviewForm.confirmInfo.a_3.date" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="项目评审" name="2">

                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="region">
                            <el-input :value="reviewForm.project.originateDeptName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="reviewForm.project.projectName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="企业客户" prop="enterpriseId">
                            <el-input v-model="reviewForm.project.enterpriseName" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="项目类型">
                            <el-select v-model="reviewForm.project.projectType" disabled>
                                <el-option label="自驾" value="自驾"></el-option>
                                <el-option label="配驾" value="配驾"></el-option>
                                <el-option label="司机托管" value="司机托管"></el-option>
                                <el-option label="车辆托管" value="车辆托管"></el-option>
                                <el-option label="司机与车辆托管" value="司机与车辆托管"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目负责人">
                            <el-input v-model="reviewForm.project.projectLeaderName" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="油费类型" prop="">
                            <el-select v-model="reviewForm.project.oilFeePaymenModel" disabled>
                                <el-option label="全包" value="1"></el-option>
                                <el-option label="里程内包" value="2"></el-option>
                                <el-option label="不包" value="3"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目周期（月）" prop="contractMonth">
                            <el-input v-model.number="reviewForm.project.contractMonth" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请日期">
                            <el-date-picker type="date" disabled v-model="reviewForm.project.applicationDateStr"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="交付日期">
                            <el-date-picker type="date" disabled v-model="reviewForm.project.deliveryDate"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="招标编号" prop="tenderId">
                            <template>
                                <el-select
                                    disabled
                                    v-model="reviewForm.project.tenderId"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请输入"
                                   :remote-method="queryTenderNumber"
                                    :loading="loading">
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
                            <el-select v-model="reviewForm.project.frameContract" disabled>
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="费用信息" name="3">
                    <div class="flex-panel">
                        <el-form-item label="结算方式" prop="settlementModel">
                            <el-select placeholder="请选择结算方式" v-model="reviewForm.project.settlementModel" disabled>
                                <el-option v-for="item in settlementModeList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日（日）" prop="settlementDate" >
                            <el-input v-model.number="reviewForm.project.settlementDate" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="结算周期（天）" prop="settlementCycle">
                            <el-input v-model.number="reviewForm.project.settlementCycle" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel">
                            <el-select placeholder="请选择付款方式" v-model="reviewForm.project.paymentModel" disabled>
                                <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目总金额（元）" prop="totalAmount">
                            <el-input v-model="reviewForm.project.totalAmount" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="押金金额（元）" prop="deposit">
                            <el-input v-model="reviewForm.project.deposit" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="保证金金额（元）" prop="depositAmount">
                            <el-input v-model="reviewForm.project.depositAmount" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="服务费金额（元）" prop="serviceCost">
                            <el-input v-model="reviewForm.project.serviceCost" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="发票税率（人%）" prop="invoiceTaxRateDriver">
                            <el-input v-model.number="reviewForm.project.invoiceTaxRateDriver" disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发票税率（车%）" prop="invoiceTaxRateVehicle">
                            <el-input v-model.number="reviewForm.project.invoiceTaxRateVehicle" disabled>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>


                <el-collapse-item title="报价明细" name="5">
                    <el-table :data="reviewForm.inquiryArray" border>
                        <el-table-column prop="sortNum" label="序号" min-width="140"></el-table-column>
                        <el-table-column prop="serviceCityName" label="服务城市" min-width="150"></el-table-column>
                        <el-table-column prop="vehicleModelInfoName" label="车型" min-width="250"></el-table-column>
                        <el-table-column prop="vehicleQty" label="车辆台数" min-width="120"></el-table-column>
                        <el-table-column prop="driverQty" label="驾驶员人数" min-width="120"></el-table-column>
                        <el-table-column prop="carPrice" label="购车价格（包牌）(¥)" min-width="170"></el-table-column>
                        <el-table-column prop="installationCost" label="加装费（随车物品等）(¥)"
                                         min-width="170"></el-table-column>
                        <el-table-column prop="retrofitRequirementOptionsText" label="加装要求选项"
                                         min-width="200"></el-table-column>
                        <el-table-column prop="retrofitRequirement" label="加装要求" min-width="120"></el-table-column>
                        <el-table-column prop="newOrOldCarName" label="车辆新旧" min-width="120"></el-table-column>
                        <el-table-column prop="carAge" label="车龄（月）" min-width="120"></el-table-column>
                        <el-table-column prop="contractCycle" label="合同周期（月）" min-width="120"></el-table-column>
                        <el-table-column prop="insuranceCost" label="每年保险（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="maintenanceCost" label="维修（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="maintainCost" label="保养（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="oilCost" label="油路费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="gpsCost" label="GPS使用费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="carShipTax" label="车船税（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="inspectionCost" label="年检费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="greenLabeCost" label="绿标费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="yearTicketCost" label="年票费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="parkCost" label="停车费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="cleanCost" label="车辆定期清洁消毒费用（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="licencesUseCost" label="牌照使用费用（¥）" min-width="140"></el-table-column>
                        <el-table-column prop="businessCost" label="业务费" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.businessCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'change'}">
                                    <el-input type="text" v-model="scope.row.businessCost"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="investmentIncome" label="投资收益(%)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.investmentIncome'"
                                              :rules="[{required: true, message: '请输入投资收益', trigger: 'change'},{validator: checkTaxRate, trigger: 'blur'}]">
                                    <el-input @input="tzsyInput(scope.$index, $event)" type="text"
                                              v-model="scope.row.investmentIncome"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="financingCost" label="融资成本(%)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.financingCost'"
                                              :rules="{validator: checkTaxRate, trigger: 'blur'}">

                                    <el-input @input="rzcbInput(scope.$index, $event)" type="text"
                                              v-model="scope.row.financingCost"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="monthTotalCost" label="每月合计(¥)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input type="text" v-model="scope.row.monthTotalCost"
                                              disabled></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="税金（车）(%)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.taxVehicle'"
                                              :rules="rules.cess(false,'税金（车）(%)输入异常')">

                                    <el-input @input="_calculatePrice(scope.$index)" type="text"
                                              v-model="scope.row.taxVehicle"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="税金（人）(%)" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.taxPeople'"
                                              :rules="rules.cess(false,'税金（人）(%)输入异常')">

                                    <el-input type="text"
                                              v-model="scope.row.taxPeople"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="managementCost" label="管理费用(%)" min-width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.managementCost'"
                                              :rules="{validator: checkTaxRate, trigger: 'blur'}">

                                    <el-input @input="_calculatePrice(scope.$index)" type="text"
                                              v-model="scope.row.managementCost"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="calculatePrice" label="测算价格（含税）(¥)" min-width="160"></el-table-column>
                        <el-table-column prop="finalCost" label="最终报价(¥)" min-width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'inquiryArray.' + scope.$index  + '.finalCost'"
                                              :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}">

                                    <el-input type="text" v-model="scope.row.finalCost"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="actualDepreciationRate" label="实际折旧率(%)" min-width="140">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-input type="text" v-model="scope.row.actualDepreciationRate"
                                              disabled></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="depreciationCost" label="折旧(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="monthInstallationCost" label="月加装费（随车物品等）(¥)	"
                                         min-width="200"></el-table-column>
                        <el-table-column prop="monthInsurance" label="月保险(¥)	" min-width="120"></el-table-column>
                        <el-table-column prop="maintenanceCost" label="每月维修(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="maintainCost" label="每月保养(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="oilCost" label="每月油路费(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="gpsCost" label="每月GPS使用费(¥)" min-width="140"></el-table-column>
                        <el-table-column prop="monthCarShipTax" label="每月车船税(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="monthInspection" label="每月年检费(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="monthGreenLabe" label="每月绿标费(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="monthYearTicket" label="每月年票费(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="parkCost" label="每月停车费(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="cleanCost" label="每月车辆定期清洁消毒费用(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="licencesUseCost" label="每月牌照使用费用(¥)" min-width="150"></el-table-column>
                        <el-table-column label="每月投资收益(¥)" prop="monthInvestmentIncome"
                                         min-width="120"></el-table-column>
                        <el-table-column label="每月融资成本(¥)" prop="monthFinancingCost" min-width="120"></el-table-column>
                        <el-table-column prop="carColorName" label="颜色" min-width="120"></el-table-column>
                        <el-table-column prop="procurementExplanation" label="采购说明" min-width="120"></el-table-column>
                        <el-table-column prop="basicSalary" label="基本工资(¥)" min-width="120"></el-table-column>
                        <el-table-column prop="socialSecurityCompany" label="单位社保（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="socialSecurityPersonal" label="个人社保（¥）"
                                         min-width="120"></el-table-column>
                        <el-table-column prop="providentFundCompany" label="单位公积金（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="providentFundPersonal" label="个人公积金（¥）"
                                         min-width="120"></el-table-column>
                        <el-table-column prop="otherWeal" label="其他福利（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="customerLimitPrice" label="客户限价（不含税）(¥)"
                                         min-width="180"></el-table-column>
                        <el-table-column prop="customerLimitPriceTax" label="	司机最终报价（含税）(¥)"
                                         min-width="170"></el-table-column>
                        <el-table-column prop="driverOtherRequirement" label="司机其他要求" min-width="120"></el-table-column>
                        <!--<el-table-column prop="oilFeePaymenModelName" label="油费支付类型" min-width="120"></el-table-column>-->
                    </el-table>
                </el-collapse-item>


                <el-collapse-item title="询价明细" name="6">
                    <el-table :data="reviewForm.inquiryArray" border>
                        <el-table-column prop="sortNum" label="序号" min-width="140"></el-table-column>
                        <el-table-column prop="serviceCityName" label="服务城市" min-width="150"></el-table-column>
                        <el-table-column prop="vehicleModelInfoName" label="车型" min-width="250"></el-table-column>
                        <el-table-column prop="carColorName" label="颜色" min-width="120"></el-table-column>
                        <el-table-column prop="procurementExplanation" label="采购说明" min-width="170"></el-table-column>
                        <el-table-column prop="retrofitRequirementOptionsText" label="加装要求选项"
                                         min-width="200"></el-table-column>
                        <el-table-column prop="vehicleQty" label="车辆台数" min-width="120"></el-table-column>
                        <el-table-column prop="driverQty" label="驾驶员人数" min-width="120"></el-table-column>
                        <el-table-column prop="carPrice" label="购车价格（包牌）（¥）" min-width="170"></el-table-column>
                        <el-table-column label="最近价格（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="installationCost" label="加装费（随车物品等）（¥）"
                                         min-width="190"></el-table-column>
                        <!--<el-table-column prop="oilFeePaymenModelName" label="油费支付类型" min-width="120"></el-table-column>-->
                        <el-table-column prop="retrofitRequirement" label="其他加装要求" min-width="120"></el-table-column>
                        <el-table-column prop="carAge" label="车龄（月）" min-width="120"></el-table-column>
                        <el-table-column prop="contractCycle" label="合同周期（月）" min-width="120"></el-table-column>
                        <el-table-column prop="insuranceCost" label="每年保险（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="maintenanceCost" label="每月维修（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="maintainCost" label="每月保养（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="oilCost" label="每月油路费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="gpsCost" label="每月GPS使用费（¥）" min-width="150"></el-table-column>
                        <el-table-column prop="carShipTax" label="车船税（年）（¥）" min-width="140"></el-table-column>
                        <el-table-column prop="inspectionCost" label="年检费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="greenLabeCost" label="绿标费（年）（¥）" min-width="140"></el-table-column>
                        <el-table-column prop="yearTicketCost" label="年票费（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="parkCost" label="停车费（月）（¥）" min-width="140"></el-table-column>
                        <el-table-column prop="cleanCost" label="每月车辆定期清洁消毒费用（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="licencesUseCost" label="每月牌照使用费（¥）" min-width="150"></el-table-column>
                        <el-table-column prop="basicSalary" label="基本工资（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="socialSecurityCompany" label="单位社保（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="socialSecurityPersonal" label="个人社保（¥）"
                                         min-width="120"></el-table-column>
                        <el-table-column prop="providentFundCompany" label="单位公积金（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="providentFundPersonal" label="个人公积金（¥）"
                                         min-width="120"></el-table-column>
                        <el-table-column prop="otherWeal" label="其他福利（¥）" min-width="120"></el-table-column>
                        <el-table-column prop="customerLimitPrice" label="客户限价（不含税）（¥）"
                                         min-width="180"></el-table-column>
                        <el-table-column prop="customerLimitPriceTax" label="客户限价（含税）（¥）"
                                         min-width="160"></el-table-column>
                    </el-table>
                </el-collapse-item>

            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submit('reviewForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {startProcess, calculator} from '@/utils'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        name: "projectApproveSubmit",
        mixins: [tool, ruleTool],
        data() {
            var checkTaxRate = (rule, v, callback) => {
                if (!v)
                    callback(new Error('不能为空'));
                else if (isNaN(v) || v < 0 || v > 100)
                    callback(new Error('只能输入0~100'));
                else
                    callback();
            };
            return {
                openCollapse: [],
                dialogProvinceTableVisible: false,
                reviewForm: {
                    project: {},
                    inquiryArray: [],
                    confirmInfo: {}
                },
                frameContractOps: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                moneyRegex: /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/,
                checkTaxRate: checkTaxRate,
            }
        },

        methods: {
            reviewParam() {
                if(!this.$route.query.id){
                    return;
                }
                ajax.get('/core/coreProjectReview/detailByReviewSubmit'
                    , {id: this.$route.query.id}).then(rs => {

                    if (rs.data['project'].humanConfirm)
                        rs.data['project'].humanConfirm += '';
                    if (rs.data['project'].maintenanceConfirm)
                        rs.data['project'].maintenanceConfirm += '';
                    if (rs.data['project'].purchaseConfirm)
                        rs.data['project'].purchaseConfirm += '';

                    rs.data['inquiry'].forEach(item => {
                        item.taxVehicle =  rs.data['project'].invoiceTaxRateVehicle;
                        item.taxPeople =  rs.data['project'].invoiceTaxRateDriver;
                    });

                    this.$set(this.reviewForm, 'project', rs.data['project']);
                    this.$set(this.reviewForm, 'inquiryArray', rs.data['inquiry']);

                    let confirms = {};
                    rs.data.confirmInfoArray.forEach(item => {
                        confirms['a_' + item.type] = item;
                    });

                    this.$set(this.reviewForm, 'confirmInfo', confirms);

                    rs.data['inquiry'].forEach((item, index) => {
                        this.calcMonthCount(index);
                    });



                    this.reviewForm.project.frameContract += '';
                    this.reviewForm.project.oilFeePaymenModel += '';
                });
            },
            open() {
                this.openCollapse = ["1", "2", "3", "4", "5", "6"];
                if (this.$refs.reviewForm)
                    this.$refs.reviewForm.resetFields();
                this.reviewParam();
            },
            tzsyInput(i, e) {
                var v = parseFloat(e);
                if (v > 100)
                    v = 100;

                var item = this.reviewForm.inquiryArray[i];
                item.monthInvestmentIncome = calculator.Div(
                    calculator.Mul(item.carPrice, v), 1200, 2);

                this.calcMonthCount(i);
            },
            rzcbInput(i, e) {
                var v = parseFloat(e);
                if (v > 100)
                    v = 100;

                var item = this.reviewForm.inquiryArray[i];
                item.monthFinancingCost = calculator.Div(
                    calculator.Mul(item.carPrice, v), 1200, 2);

                this.calcMonthCount(i);
            },
            calcMonthCount(i) {
                var item = this.reviewForm.inquiryArray[i];
                var sum = 0;

                sum = calculator.Add(sum, item.depreciationCost);//折旧
                sum = calculator.Add(sum, item.monthInstallationCost);//月加装费
                sum = calculator.Add(sum, item.monthInsurance);//月保险
                sum = calculator.Add(sum, item.maintenanceCost);//每月维修
                sum = calculator.Add(sum, item.maintainCost);//每月保养
                sum = calculator.Add(sum, item.oilCost);//每月油路费
                sum = calculator.Add(sum, item.gpsCost);//每月GPS使用费
                sum = calculator.Add(sum, item.monthCarShipTax);//月车船税
                sum = calculator.Add(sum, item.monthInspection);//月年检费
                sum = calculator.Add(sum, item.monthGreenLabe);//月绿标费
                sum = calculator.Add(sum, item.monthYearTicket);//月年票费
                sum = calculator.Add(sum, item.parkCost);//每月停车费
                sum = calculator.Add(sum, item.cleanCost);//每月车龄定期清洁消毒费用
                sum = calculator.Add(sum, item.licencesUseCost);//每月牌照使用费
                sum = calculator.Add(sum, item.monthInvestmentIncome);//每月投资收益
                sum = calculator.Add(sum, item.monthFinancingCost);//每月融资成本

                item.monthTotalCost = sum;
                this._calculatePrice(i);

            },
            _calculatePrice(i) {
                var item = this.reviewForm.inquiryArray[i];
                if(item.taxVehicle && item.managementCost && item.monthTotalCost ){
                    var divisor = calculator.Sub(calculator.Sub(100, item.taxVehicle), item.managementCost);
                    item.calculatePrice = calculator.Div(item.monthTotalCost, calculator.Div(divisor, 100), 2);
                    item.finalCost = item.calculatePrice;
                }else{
                    item.calculatePrice = 0;
                    item.finalCost = 0;
                }

            },
            submit(form) {
                this.$refs[form].validate((valid) => {

                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    this.reviewForm.inquiryArray.forEach(item => {
                        item.projectReviewInquiryId = item.id;
                    });

                    var project = this.reviewForm.project;
                    var data = {
                        projectId: project.id,
                        inquiryQuote: this.reviewForm.inquiryArray
                    }

                    //对接审批流
                    startProcess(project.id, "XMPS", (result) => {
                        if (result.status == 0) {
                            this.$message('提交审批流成功！');

                            ajax.post('/core/coreProjectReview/reviewSubmit', data).then(rs => {
                                if (rs.status == 0) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.close();
                                } else {
                                    this.$message.error(rs.message);
                                }
                            });

                        } else {
                            this.$message.error(result.message);
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

