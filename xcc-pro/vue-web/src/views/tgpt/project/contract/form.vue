<template>
    <div class="form-panel">
        <el-form :model="ruleForm" :rules="rules" label-position="top" ref="ruleForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <!--<el-collapse-item title="确认信息" name="0">
                    <el-checkbox-group v-model="ruleForm.confirmType">
                        <el-checkbox label="1">信息完整性确认</el-checkbox>
                        <el-checkbox label="2">资金安排确认</el-checkbox>
                        <el-checkbox label="3">服务信息确认</el-checkbox>
                        <el-checkbox label="4">车务信息确认</el-checkbox>
                        <el-checkbox label="5">人员招聘信息确认</el-checkbox>
                        <el-checkbox label="6">人员成本报价确认</el-checkbox>
                        <el-checkbox label="7">分公司筹备确认</el-checkbox>
                    </el-checkbox-group>
                </el-collapse-item>-->
                <el-collapse-item title="合同基本信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="发起人" >
                            <el-input v-model="userInfo.name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="originateDeptId"  :rules="rules.required('请选择所属组织')">
                            <tree-select v-model="ruleForm.originateDeptId" placeholder="请选择组织" type="one" @change="getcompanyData()"
                                         url="admin/organization/tree?noManager=noManager"></tree-select>
                        </el-form-item>
                        <!--</el-form-item>-->
                        <el-form-item label="业务员" >
                            <el-input v-model="userInfo.name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="申请日期" prop="applicationDate" :rules="rules.required('请选择申请日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.applicationDate"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同开始日期" prop="contractStartDate" :rules="rules.required('请选择合同开始日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.contractStartDate"
                                            value-format="yyyy-MM-dd" :picker-options="startOption"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同结束日期" prop="contractEndDate" :rules="rules.required('请选择合同结束日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.contractEndDate"
                                            value-format="yyyy-MM-dd" :picker-options="endOption"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="交车日期" prop="deliveryDate" :rules="rules.required('请选择交车日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.deliveryDate"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="客户类型" prop="customerType" >
                            <el-select v-model="ruleForm.customerType" @change="changeCustomerType" :rules="rules.required('请选择客户类型')" placeholder="请选择客户类型">
                                <el-option label="企业客户" :value="1" :key="1"> </el-option>
                                <el-option label="个人客户" :value="2" :key="2"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务客户" prop="enterpriseId" :rules="rules.required('请选择服务客户')">
                            <el-input v-model="companyData.name" clearable @click.native="openEnterpriseModel()" :disabled="!ruleForm.customerType"
                                      placeholder="请选择" readonly>
                                <el-button slot="append" icon="el-icon-search" :disabled="!ruleForm.customerType"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="项目评审" prop="projectReviewId" >
                            <el-input v-model="projectData.projectName" clearable @click.native="openProjectModel()"
                                      placeholder="请选择" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="项目编号">
                            <el-input v-model="ruleForm.projectNumber" style="font-size: 12px" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="项目总金额">
                            <el-input v-model="ruleForm.projectTotalAmount" disabled>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                       <!-- <el-form-item label="报价模板" prop="quotationTemplate" :rules="rules.required('请选择报价模板')">-->
                        <el-form-item label="报价模板" prop="quotationTemplate" >
                            <el-select v-model="ruleForm.quotationTemplate" placeholder="请选择">
                                <el-option label="配驾" :value="1"></el-option>
                                <el-option label="自驾" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报价范围">
                            <el-select v-model="ruleForm.quotationRange" placeholder="请选择">
                                <el-option label="公司范围" :value="1"></el-option>
                                <el-option label="其他" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="购买保险方式" prop="insurancePurchaseMode" :rules="rules.required('请选择购买保险方式')">
                            <el-select v-model="ruleForm.insurancePurchaseMode" placeholder="请选择">
                                <el-option label="我司购买" :value="1"></el-option>
                                <el-option label="对方购买" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="违章代办方式" prop="peccancyHandleMode" :rules="rules.required('请选择违章代办方式')">
                            <el-select v-model="ruleForm.peccancyHandleMode" placeholder="请选择">
                                <el-option label="我司办理" :value="1"></el-option>
                                <el-option label="对方办理" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="我方签约主体" prop="ourContractSubject" :rules="rules.required('请选择我方签约主体')">
                            <el-select v-model="ruleForm.ourContractSubject" placeholder="请选择">
                                <el-option v-for="item in ourContractSubjectList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对方签约主体" prop="otherContractSubject" :rules="rules.required('请输入对方签约主体')">
                            <el-input v-model="ruleForm.otherContractSubject" maxlength="36" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="合同议定方" prop="contractAgreedParty" :rules="rules.required('请选择合同议定方')">
                            <el-select v-model="ruleForm.contractAgreedParty" placeholder="请选择">
                                <el-option label="我司议定" :value="1"></el-option>
                                <el-option label="双方议定" :value="2"></el-option>
                                <el-option label="对方议定" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同文本类型" prop="contractTextType" :rules="rules.required('请选择合同文本类型')">
                            <el-select v-model="ruleForm.contractTextType" placeholder="请选择">
                                <el-option label="配驾合同" :value="1"></el-option>
                                <el-option label="自驾合同" :value="2"></el-option>
                                <el-option label="其他合同" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="押金条件" prop="depositCondition">
                            <el-input v-model="ruleForm.depositCondition" maxlength="50" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="用印地点">
                            <el-select v-model="ruleForm.useSealPlace" placeholder="请选择">
                                <el-option label="总部" :value="1"></el-option>
                                <el-option label="广州" :value="2"></el-option>
                                <el-option label="其他" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同附件">
                            <upload-panel :size="1" :file-list.sync="fileList"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同费用信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="是否含税" prop="isContainTax" :rules="rules.required('请选择是否含税')">
                            <el-radio v-model="ruleForm.isContainTax" label="1" @change="checkForm('isContainTax')">是</el-radio>
                            <el-radio v-model="ruleForm.isContainTax" label="0" @change="checkForm('isContainTax')">否</el-radio>
                        </el-form-item>
                        <el-form-item label="是否开票" prop="isOpenTicket" :rules="rules.required('请选择是否开票')">
                            <el-radio v-model="ruleForm.isOpenTicket" label="1" @change="checkForm('isOpenTicket')">是</el-radio>
                            <el-radio v-model="ruleForm.isOpenTicket" label="0" @change="checkForm('isOpenTicket')">否</el-radio>
                        </el-form-item>
                        <el-form-item label="发票税率（车）" prop="invoiceTaxRateVehicle" :rules="rules.cess(false)">
                            <el-input type="number" v-model="ruleForm.invoiceTaxRateVehicle" placeholder="请输入" @change="invoiceTaxRateVehicleChange()" ></el-input>
                        </el-form-item>
                        <el-form-item label="发票税率（司机）" prop="invoiceTaxRateDriver" :rules="rules.cess(false)">
                            <el-input v-model="ruleForm.invoiceTaxRateDriver" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="结算方式" prop="settlementModel" :rules="rules.required('请选择结算方式')">
                            <el-select placeholder="请选择结算方式" clearable v-model="ruleForm.settlementModel">
                                <el-option v-for="item in settlementModeList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日" prop="settlementDate">
                            <el-input v-model="ruleForm.settlementDate" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel":rules="rules.required('请选择付款方式')">
                            <el-select placeholder="请选择付款方式" clearable v-model="ruleForm.paymentModel">
                                <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="付款周期（日）" prop="paymentCycle">
                            <el-input v-model="ruleForm.paymentCycle" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="合同金额" prop="contractAmount" :rules="rules.money(true)" >
                            <!--<el-input v-model="ruleForm.contractAmount" placeholder="请输入"> <template slot="append">元</template></el-input>-->
                            <!--<money-input v-model="ruleForm.contractAmount"  clearable placeholder="请输入" unit="元"></money-input>-->
                            <el-input v-model="ruleForm.contractAmount" placeholder="请输入" clearable>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="合同期（月）" prop="contractCycle" >
                            <el-input v-model="ruleForm.contractCycle" placeholder="请输入"></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同条款" name="3">
                    <!--合同条款-->
                    <el-form-item label="合同主要条款" class="big">
                        <el-input type="textarea" v-model="ruleForm.contractMainTerm" maxlength="2000"></el-input>
                    </el-form-item>

                    <el-form-item label="争议解决方式" class="big">
                        <el-input type="textarea" v-model="ruleForm.disputeSolveMode" maxlength="2000"></el-input>
                    </el-form-item>

                    <el-form-item label="备注" class="big">
                        <el-input type="textarea" v-model="ruleForm.remark" maxlength="2000"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="附件" class="big">
                        <upload-panel :size="1" :file-list.sync="fileList"></upload-panel>
                    </el-form-item>-->
                </el-collapse-item>
                <el-collapse-item title="合同车辆信息" name="4">
                    <div class="flex-panel">
                        <el-form-item label="车辆总台数">
                            <el-input :value="getCountSum()" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="车辆每月总租金">
                            <el-input :value="getCarMoneySum()" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="司机每月总费用">
                            <el-input :value="getDriverMoneySum()" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同明细" name="5">
                    <el-button class="float-btn" type="primary" v-if="!ruleForm.projectNumber" @click="addProjectContractDetail">新增</el-button>
                    <el-table class="left" border :data="ruleForm.projectContractDetailList" style="width: 100%">
                        <el-table-column type="index" label="序号" width="50"></el-table-column>

                        <el-table-column label="服务组织" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}" >
                                <el-form-item  :prop="'projectContractDetailList.' + $index + '.serviceOrganizationId'"
                                               :rules="rules.required('请选择服务组织')">
                                    <tree-select v-model="row.serviceOrganizationId" placeholder="请选择组织" type="one"
                                                 url="admin/organization/companyTree"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="结算组织" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}" >
                                <el-form-item  :prop="'projectContractDetailList.' + $index + '.settlementOrganizationId'"
                                               :rules="rules.required('请选择结算组织')">
                                    <tree-select v-model="row.settlementOrganizationId" placeholder="请选择组织" type="one"
                                                 url="admin/organization/companyTree"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="useCarCityName" show-overflow-tooltip label="用车城市" min-width="150">
                            <template slot-scope="{row,$index}" >
                                <el-form-item prop="city"  v-if="!ruleForm.projectNumber">
                                    <city-select :value.sync="row.city" :ref="'citySelect_' + $index">
                                    </city-select>
                                </el-form-item>
                                <div v-else>{{row.useCarCityName}}</div>
                            </template>
                        </el-table-column>

                        <!-- <el-table-column prop="useCarCityName" show-overflow-tooltip label="车牌要求城市" min-width="150"></el-table-column>-->
                        <el-table-column prop="vehicleModelInfoName" show-overflow-tooltip label="车型" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}" >
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.dataModel'" v-if="!ruleForm.projectNumber" :rules="rules.required('请选择车型')">
                                    <el-input type="text"  placeholder="请选择车型" v-model="row.dataModel"
                                              size="small"
                                              @click.native="openDialogVehicleModelInfo($index)">
                                    </el-input>
                                </el-form-item>
                                <div v-else>{{row.vehicleModelInfoName}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="useCarStartDate" label="用车开始时间" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.useCarStartDate'"  :rules="rules.required('请选择用车开始时间')">
                                    <el-date-picker type="date" placeholder="请选择" v-model="row.useCarStartDate"
                                                    value-format="yyyy-MM-dd" :picker-options="row.useCarStartDate"
                                                    :editable="false"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="useCarEndDate" label="用车结束时间" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.useCarEndDate'"  :rules="rules.required('请选择用车结束时间')">
                                <el-date-picker type="date" placeholder="请选择" v-model="row.useCarEndDate"
                                                value-format="yyyy-MM-dd" :picker-options="row.useCarEndDate"
                                                :editable="false"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column prop="carColorName" label="颜色" min-width="150">
                            <template slot-scope="{row,$index}" >
                                <el-form-item prop="carColor"  v-if="!ruleForm.projectNumber">
                                    <el-select v-model="row.carColor" placeholder="请选择">
                                        <el-option v-for="item in carColorList" :key="item.value"
                                                   :label="item.text"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <div v-else>{{row.carColorName}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="carAge" label="车龄（月）" min-width="150">
                            <template slot-scope="{row,$index}" >
                                <el-form-item :prop="'projectContractDetailList.' + $index  + '.carAge'"
                                              :rules="{validator: numberThree, trigger: 'change'}" v-if="!ruleForm.projectNumber">
                                    <el-input type="text" v-model="row.carAge" size="small"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                                <div v-else>{{row.carAge}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="newOrOldCarName" label="车辆新旧" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}" >
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.newOrOldCar'" v-if="!ruleForm.projectNumber" :rules="rules.required('请选择车辆新旧')">
                                    <el-select v-model="row.newOrOldCar" placeholder="请选择">
                                        <el-option label="旧车" :value="0"></el-option>
                                        <el-option label="新车" :value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                                <div v-else>{{row.newOrOldCarName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="每月车辆租金(元)" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}" >
                                <el-form-item  :prop="'projectContractDetailList.' + $index + '.carRentMonth'"
                                               :rules="rules.money(true , '请输入车辆每月租金')">
                                    <el-input v-model="row.carRentMonth"  clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="测算租金(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.calculatePrice'"  :rules="rules.money(false)"  v-if="!ruleForm.projectNumber">
                                    <el-input v-model="row.calculatePrice"    placeholder="请输入"></el-input>
                                </el-form-item>
                                <div v-else>{{row.calculatePrice}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vehicleQty" label="车辆台数（台）" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.vehicleQty'" :rules="[{ validator: formRule.standardSize,message: '请输入整数', trigger: 'change' },{required: true, message: '请输入车辆台数', trigger: 'change'}]"  v-if="!ruleForm.projectNumber">
                                    <el-input v-model="row.vehicleQty" @blur="changeDriverCount(row)"  placeholder="请输入"></el-input>
                                </el-form-item>
                                <div v-else>{{row.vehicleQty}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="oilFeePaymenModel" label="油费支付类型" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index  + '.oilFeePaymenModel'"
                                              :rules="{required: true, message: '请选择油费支付类型', trigger: 'change'}"  >
                                    <el-select v-model="row.oilFeePaymenModel" placeholder="请选择">
                                        <el-option label="全包" :value="1"></el-option>
                                        <el-option label="里程内包" :value="2"></el-option>
                                        <el-option label="不包" :value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="每月车辆油费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.carOilCostMonth'"
                                              :rules="rules.money(false)" >
                                    <el-input v-model.number="row.carOilCostMonth" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="每月限制里程公里" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.limitMileageMonth'"
                                              :rules="rules.int(false)">
                                    <el-input v-model="row.limitMileageMonth" clearable placeholder="请输入" maxlength="10"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="超里程单价(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.overMileagePrice'"
                                              :rules="rules.threeDecimalMoney(false)">
                                    <el-input v-model="row.overMileagePrice" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="ETC费(元)" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.etcCost'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.etcCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="retrofitRequirement" label="加装要求" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.retrofitRequirement'"  v-if="!ruleForm.projectNumber">
                                    <el-input v-model="row.retrofitRequirement" placeholder="请输入"></el-input>
                                </el-form-item>
                                <div v-else>{{row.retrofitRequirement}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="procurementExplanation" label="采购说明" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'projectContractDetailList.' + $index + '.procurementExplanation'"  v-if="!ruleForm.projectNumber">
                                    <el-input v-model="row.procurementExplanation" placeholder="请输入"></el-input>
                                </el-form-item>
                                <div v-else>{{row.procurementExplanation}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="retrofitRequirementOptionsText" label="加装要求选项" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item  v-if="!ruleForm.projectNumber">
                                    <el-select v-model="row.retrofitRequirementOptionsList" multiple
                                               placeholder="请选择">
                                        <el-option
                                            v-for="item in retrofitRequirementOptionsList"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <div v-else>{{row.retrofitRequirementOptionsText}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否需要司机" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item >
                                    <el-checkbox v-model="row.isNeedDriverBoolean" @click.native="changeNeedDriver(row)">是</el-checkbox>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="司机每天工作时长(小时)" min-width="170">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.driverWorktimeDay'"
                                              :rules="rules.int(false,[1,24],'请输入1-24的整数')">
                                    <el-input v-model="row.driverWorktimeDay" placeholder="请输入" ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="司机数（名）" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.driverCount'">
                                    <el-input v-model="row.driverCount" disabled maxlength="10"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="每月司机费用(元)" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.driverCostMonth'"
                                              :rules="rules.money(true)">
                                    <el-input v-model="row.driverCostMonth" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="每月司机通讯费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.driverCommunicationCostMonth'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.driverCommunicationCostMonth" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="代驾费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.drivingCost'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.drivingCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="加班费（小时）" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.overtimeCost'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.overtimeCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="每晚住宿费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.stayCost'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.stayCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="餐费（次）" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean":prop="'projectContractDetailList.' + $index + '.mealCost'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.mealCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="福利费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.welfareFee'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.welfareFee" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="年高温补贴费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.highTemperatureFee'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.highTemperatureFee" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="年生日补贴费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.birthdayFee'"
                                              :rules="rules.money(false)">
                                    <el-input v-model="row.birthdayFee" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="其他补贴费(元)" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item v-if="row.isNeedDriverBoolean" :prop="'projectContractDetailList.' + $index + '.otherSubsidyCost'"
                                              :rules="rules.money(false)">
                                    <el-input  v-model="row.otherSubsidyCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="其他费用说明" min-width="150">
                            <template slot-scope="{row}">
                                <el-form-item v-if="row.isNeedDriverBoolean" >
                                    <el-input v-model="row.otherCostExplanation" clearable placeholder="请输入" maxlength="50"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" min-width="120"  v-if="!ruleForm.projectNumber">
                            <template slot-scope="{row,$index}">
                                <el-form-item>
                                    <el-button type="text"
                                               @click="deleteItem($index)"
                                               style="color:#F56C6C;font-size: 13px;">删除
                                    </el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>

            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="save()" :disabled="saveDisabled">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <el-dialog class="big" title="企业客户" width="1000px"  :visible.sync="dialog.company">
            <div class="list-panel">
                <div class="row form-horizontal search-box min" >
                    <div class="form-group">
                        <label class="control-label">企业客户名称</label>
                        <div class="input-group">
                            <el-input v-model="enterpriseParam.name" clearable autocomplete="off"
                                      placeholder="请输入企业客户名称查询"></el-input>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                       <!-- <el-button size="small" @click="resetList()">重置</el-button>-->
                    </div>
                </div>
                <div class="row">
                    <el-table border  style="width: 100%" :data="enterpriseList" @row-dblclick="saveCompany" max-height="300" >
                        <el-table-column fixed="left" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="saveCompany(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="企业客户名称" sortable min-width="150"></el-table-column>
                        <el-table-column prop="id" label="企业客户ID" sortable min-width="150"></el-table-column>
                        <el-table-column prop="nature" label="企业性质" sortable min-width="150"></el-table-column>
                        <el-table-column prop="scale" label="企业规模" sortable min-width="150"></el-table-column>
                        <el-table-column prop="city" label="企业所在城市" sortable min-width="150"></el-table-column>
                        <el-table-column prop="enterpriseStatus" label="企业状态" min-width="150"></el-table-column>
                        <!--TODO -->
                        <el-table-column prop="company" label="所属组织" sortable min-width="150"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="dialogPagination.page"
                        :page-sizes="dialogPagination.pageSizeSetting"
                        :page-size="dialogPagination.pageSize"
                        :layout="pageLayout"
                        :total="dialogPagination.listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <el-dialog class="big projectDialog" title="项目评审" width="1000px" :visible.sync="dialog.project">
            <div class="list-panel">
                <div class="row form-horizontal search-box" >
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">项目信息</label>
                            <div class="input-group">
                                <el-input v-model="projectParam.projectInfo" autocomplete="off"
                                          placeholder="请输入项目名称、编号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">招标编号</label>
                            <div class="input-group">
                                <el-input v-model="projectParam.bidNo" autocomplete="off"
                                          placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border  style="width: 100%" :data="projectList" @row-dblclick="saveProject" max-height="300">
                        <el-table-column fixed="left" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="saveProject(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bidNo" label="招标编号" sortable min-width="150"></el-table-column>
                        <el-table-column prop="projectName" label="项目名称" sortable min-width="150"></el-table-column>
                        <el-table-column prop="projectNumber" label="项目标号" sortable min-width="200"></el-table-column>
                        <el-table-column prop="projectLeaderName" label="项目负责人" sortable min-width="150"></el-table-column>
                        <el-table-column prop="originateDeptName" label="所属组织" sortable min-width="150"></el-table-column>
                        <el-table-column prop="applicationDateStr" label="申请日期" sortable min-width="150"></el-table-column>
                        <el-table-column prop="totalAmount" label="项目总金额" sortable min-width="150"></el-table-column>
                        <el-table-column prop="settlementDate" label="结算日" sortable min-width="150"></el-table-column>
                        <el-table-column prop="paymentModel" label="付款方式" sortable min-width="150"></el-table-column>
                        <el-table-column prop="settlementModel" label="结算方式" sortable min-width="150"></el-table-column>
                        <el-table-column prop="contractMonth" label="合同期（月）" sortable min-width="150"></el-table-column>
                        <el-table-column prop="settlementCycle" label="结算周期（日）" sortable min-width="150"></el-table-column>
                        <el-table-column prop="invoiceTaxRateVehicle" label="发票税率（车辆）" sortable min-width="150"></el-table-column>
                        <el-table-column prop="invoiceTaxRateDriver" label="发票税率（司机）" sortable min-width="150"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="dialogPagination.page"
                        :page-sizes="dialogPagination.pageSizeSetting"
                        :page-size="dialogPagination.pageSize"
                        :layout="pageLayout"
                        :total="dialogPagination.listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <!-- 车型 dialog -->
        <el-dialog title="选择车型" :visible.sync="dialog.vehInfo" :append-to-body="true" width="1000px">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <div class="input-group">
                                <el-input v-model="vehInfoParam.modelInfo"
                                          placeholder="请输入车型名称查询"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="vehInfoList" @row-dblclick="selectVehModelInfo($event)">
                        <el-table-column fixed="left" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="selectVehModelInfo(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column property="modelInfo" label="车型名称" show-overflow-tooltip min-width="200"></el-table-column>
                        <el-table-column property="id" label="车型ID" show-overflow-tooltip min-width="200"></el-table-column>
                        <el-table-column property="modelName" label="款式" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column property="seating" label="座位" show-overflow-tooltip min-width="80"></el-table-column>
                        <el-table-column property="displacement" label="排量" show-overflow-tooltip min-width="80"></el-table-column>
                        <el-table-column property="transmissionName" label="变速箱" show-overflow-tooltip min-width="120"></el-table-column>
                        <el-table-column property="vehicleNumberName" label="车厢" show-overflow-tooltip min-width="80"></el-table-column>
                        <el-table-column property="fuelTypeName" label="燃油类型" show-overflow-tooltip min-width="80"></el-table-column>
                        <el-table-column property="fuel_capacity" label="邮箱容量" show-overflow-tooltip min-width="80"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="dialogPagination.page"
                        :page-sizes="dialogPagination.pageSizeSetting"
                        :page-size="dialogPagination.pageSize"
                        :layout="pageLayout"
                        :total="dialogPagination.listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer"></personal-customer-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect,personalCustomerDialog},
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '金额输入异常', trigger: 'change'};
            var numberThree = (rule, v, callback) => {
                if (!v)
                    callback();
                else if (isNaN(v))
                    callback(new Error('输入数字'));
                else if ((v + '').length > 3)
                    callback(new Error('不超过3个字符'));
                else
                    callback();
            };
            let $this = this;
            return {
                dialog:{
                    company:false,
                    project:false,
                    vehInfo:false,
                },
                numberThree: numberThree,
                userInfo: this.getCurrentUserInfo(),
                startOption:{
                    disabledDate(time) {
                        if($this.ruleForm.contractEndDate){
                            return new Date($this.ruleForm.contractEndDate).getTime() < time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                endOption:{
                    disabledDate(time) {
                        if($this.ruleForm.contractStartDate){
                            return new Date($this.ruleForm.contractStartDate).getTime() - 24*60*60*1000 > time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                ruleForm: {},//表单数据
                saveDisabled:false,
                enterpriseParam: {},
                enterpriseList:[],
                projectParam: {},
                projectList: [],
                formRule,
                rules: {
                    contractAmount: [
                        moneyValidator
                    ],
                    settlementDate:[
                        { required: true, message: '请输入日数', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    paymentCycle:[
                        { required: true, message: '请输入付款周期', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    contractCycle:[
                        { required: true, message: '请输入合同期', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ]
                },
                clickTableIndex: 0,
                activeNames: ["0", "1", "2", "3", "4", "5"],//默认打开的面板
                tableData: [],
                paymentModelList: [],
                settlementModeList: [],
                ourContractSubjectList:[],
                fileList:[],
                companyData: {},
                projectData: {},
                type: "add",
                activeFgsArray: [],
                vehInfoParam: {},
                vehInfoList: [],
                dialogPagination: {
                    pageSize: 10,
                    pageSizeSetting: [10, 20, 40, 100],
                    page: 1,
                    listCount: 1,
                },
                carColorList: [],
                retrofitRequirementOptionsList: [],
            }
        },
        methods: {
            changeNeedDriver(row){
                if(!row.isNeedDriverBoolean){
                    this.$set(row,"driverWorktimeDay","");
                    this.$set(row,"driverCount",row.vehicleQty);
                    this.$set(row,"driverCostMonth","");
                    this.$set(row,"driverCommunicationCostMonth","");
                    this.$set(row,"drivingCost","");
                    this.$set(row,"overtimeCost","");
                    this.$set(row,"stayCost","");
                    this.$set(row,"mealCost","");
                    this.$set(row,"welfareFee","");
                    this.$set(row,"highTemperatureFee","");
                    this.$set(row,"birthdayFee","");
                    this.$set(row,"otherSubsidyCost","");
                    this.$set(row,"otherCostExplanation","");
                }else{
                    this.$set(row,"driverCount","");
                }
            },
            changeDriverCount(row){
               if(!row.isNeedDriverBoolean) {
                   this.$set(row, "driverCount","");
               }else{
                   this.$set(row, "driverCount",row.vehicleQty);
               }
            },
            getcompanyData(){
                this.companyData.name='';
                this.companyData.id='';
            },
            //车辆总台数
            getCountSum(){
                let sum = 0;
                let data = this.ruleForm.projectContractDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.vehicleQty && !isNaN(item.vehicleQty)){
                            item.vehicleQty = parseInt(item.vehicleQty);
                            sum+=item.vehicleQty;
                        }
                    });
                }
                return sum;
            },
            //车辆每月总租金
            getCarMoneySum(){
                let sum = 0;
                let data = this.ruleForm.projectContractDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.carRentMonth && item.vehicleQty && !isNaN(item.carRentMonth) && !isNaN(item.vehicleQty)){
                            sum+=item.carRentMonth*item.vehicleQty;
                        }
                    });
                }
                return sum;
            },
            //司机每月总费用
            getDriverMoneySum(){
                let sum = 0;
                let data = this.ruleForm.projectContractDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.driverCostMonth && item.driverCount && !isNaN(item.driverCostMonth) && !isNaN(item.driverCount)){
                            sum+=item.driverCostMonth*item.driverCount;
                        }
                    });
                }
                return sum;
            },
            //初始号数据
            setInitData(){
                this.activeNames = ["0", "1", "2", "3", "4", "5"];
                this.ruleForm = {
                    customerType:1,
                   // confirmType: [],
                    salesmanId:this.userInfo.userId,//业务员ID
                    originatorId:this.userInfo.userId,//发起人ID
                    applicationDate:new Date().format("yyyy-MM-dd"),
                    quotationTemplate:'',//报价模板
                    projectContractDetailList:[
                        {
                            cityName: [],
                            dataModel: '',
                            vehicleModelInfoId:"",
                        }
                    ],//合同明细
                };
                this.companyData = {};
                this.projectData = {};
                this.$nextTick(_ =>{
                    this.$refs.ruleForm.clearValidate();
                });
            },
            getListBefore(){
                this.loading = true;
            },
            getListAfter(){
                this.loading = false;
            },
            handleSizeChange(val) {
                var $this = this;
                $this.$set(this.dialogPagination,"pageSize",val);
                $this.$set(this.dialogPagination,"page",1);
                /*this.dialogPagination.pageSize = val;
                this.dialogPagination.page = 1;*/
                if($this.dialog.company){
                    $this.queryEnterprise();
                }else if($this.dialog.project){
                    $this.queryProject();
                }else if($this.dialog.vehInfo){
                    $this.queryVehModelInfo();
                }
            }
            ,
            handleCurrentChange(val) {
                var $this = this;
                this.$set($this.dialogPagination,"page",val);
               // this.dialogPagination.page = val;
                if($this.dialog.company){
                    $this.queryEnterprise();
                }else if($this.dialog.project){
                    $this.queryProject();
                }else if($this.dialog.vehInfo){
                    $this.queryVehModelInfo();
                }
            },
            //企业客户弹框
            openEnterpriseModel(){
                if(!this.ruleForm.originateDeptId || this.ruleForm.originateDeptId.join().length==0){
                    this.showMessage("请先选择所属组织");
                    return;
                }

                if(!this.ruleForm.customerType){
                    this.showMessage("请先选择客户类型");
                    return;
                }

                this.dialogPagination.pageSize=10;
                this.dialogPagination.page=1;
                this.queryEnterprise();

            },
            queryEnterprise() {
                var organId = this.ruleForm.originateDeptId.join().toString();
                let params = this.enterpriseParam;
                params.rows = this.dialogPagination.pageSize;
                params.current = this.dialogPagination.page;
                params.organId = organId;
                params.organCascade = 0;
                if(this.ruleForm.customerType==1){
                    this.dialog.company = true;
                    ajax.get('/base/enterprise/list', params)
                        .then(rs => {
                            this.enterpriseList = rs.rows;
                            this.$set(this.dialogPagination,"listCount",rs.records);
                            console.log(this.dialogPagination)
                           // this.dialogPagination.listCount = rs.records;
                    });
                }else if(this.ruleForm.customerType==2){
                    this.$refs.personalCustomerList.open(organId);
                }
            },
            //选中企业客户
            saveCompany(row){
                if(row.id!=this.ruleForm.enterpriseId){
                    this.projectData.projectName = "";
                    this.ruleForm.projectNumber = "";
                }
                this.companyData = row;
                this.$set(this.ruleForm,"enterpriseId",row.id);
                this.dialog.company = false;

            },
            //更改客户类型
            changeCustomerType(){
                this.projectData.projectName = "";
                this.ruleForm.projectNumber = "";
                this.ruleForm.enterpriseId = "";
                this.companyData={};
            },
            //选中个人客户
            selectPersonalCustomer(row){
                if(row.id!=this.ruleForm.enterpriseId){
                    this.projectData.projectName = "";
                    this.ruleForm.projectNumber = "";
                }
                this.companyData = row;
                this.$set(this.ruleForm,"enterpriseId",row.id);
                this.dialog.company = false;
            },
            //项目评审弹框
            openProjectModel(){
                if(this.companyData.id){
                    this.dialog.project = true;
                    this.dialogPagination.pageSize=10;
                    this.dialogPagination.page=1;
                    this.queryProject();
                }else{
                    this.showMessage("请先选择企业客户");
                }

            },
            queryProject() {
                let params = this.projectParam;
                params.enterpriseId = this.companyData.id;
                params.rows = this.dialogPagination.pageSize;
                params.current = this.dialogPagination.page;

                ajax.get('/core/coreProjectReview/list', params)
                    .then(rs => {
                        this.projectList = rs.rows;
                        this.dialogPagination.listCount = rs.records;
                    });
            },
            //选中项目评审
            saveProject(row){
                ajax.get("/core/coreProjectReview/detailByInquiry", {id:row.id}).then(res => {
                    if (this.checkResponse(res)) {// 验证请求成功状态
                        this.projectData = row;
                        this.ruleForm.projectReviewId = row.id;
                        this.ruleForm.projectNumber = row.projectNumber;
                        this.ruleForm.projectTotalAmount = row.totalAmount;
                        this.ruleForm.invoiceTaxRateDriver = row.invoiceTaxRateDriver||"";
                        this.ruleForm.invoiceTaxRateVehicle = row.invoiceTaxRateVehicle||"";
                        this.ruleForm.settlementModel = row.settlementModelV||"";
                        this.ruleForm.paymentModel = row.paymentModelV||"";
                        this.ruleForm.settlementDate = row.settlementDate||"";
                        this.ruleForm.paymentCycle = row.settlementCycle||"";
                        this.ruleForm.contractCycle = row.contractMonth||"";
                        if(res.data.inquiry && res.data.inquiry.length) {
                            res.data.inquiry.forEach(item =>{
                                if(item.provinceName && item.serviceCityName){
                                    item.useCarCityName = item.provinceName + item.serviceCityName;
                                    item.needLicensePlateCity = item.provinceName + item.serviceCityName;
                                    delete item.provinceName;
                                    delete item.serviceCityName;
                                }
                                item.settlementOrganizationId=this.ruleForm.originateDeptId;
                                item.serviceOrganizationId=this.ruleForm.originateDeptId;
                                item.projectReviewInquiryId = item.id;delete item.id;
                                //item.carRentMonth = item.recentPrice;delete item.recentPrice;
                                item.driverCount = item.driverQty;delete item.driverQty;
                                item.driverCostMonth = item.customerLimitPriceTax;delete item.customerLimitPriceTax;
                                item.isNeedDriverBoolean = item.driverCount>0;
                                item.oilFeePaymenModel = "";
                            });
                        }
                        this.ruleForm.projectContractDetailList = res.data.inquiry;
                        console.log(this.ruleForm.projectContractDetailList )
                        this.ruleForm = Object.assign({},this.ruleForm);
                        this.dialog.project = false;

                    }
                });
            },
            //修改 发票税率（车）更新合同明细 测算租金
            invoiceTaxRateVehicleChange(){
                let invoiceTaxRateVehicle = this.ruleForm.invoiceTaxRateVehicle;
                if(this.ruleForm.projectContractDetailList){
                    this.ruleForm.projectContractDetailList.forEach(row=>{
                        if (row.monthTotalCost&&row.managementCost){
                            row.calculatePrice = (row.monthTotalCost/(1-(invoiceTaxRateVehicle/100)-(row.managementCost/100))).toFixed(2);
                        }
                    });
                }

            },
            open(){
                this.id = this.$route.query.id;
                this.setInitData();
                this.initFormData();
            },
            initFormData: function () {
                if (this.id) {//编辑
                    this.type = "edit";
                    this.getFormData(this.id);
                } else {
                    this.type = "add";
                }
            },
            getFormData: function (id) {
                this.fileList = [];
                //this.confirmType=[];
                ajax.get("core/coreProjectContract/getDetail?id=" + id).then(result =>{
                    if (result.status == 0) {
                        if( result.data[0]){
                            this.ruleForm = result.data[0];
                            this.companyData.name = result.data[0].enterpriseName;
                            this.companyData.id = result.data[0].enterpriseId;
                            this.projectData.projectName = result.data[0].projectName;
                            this.projectData.id = result.data[0].projectReviewId;
                            if(result.data[0].attachment){
                                this.fileList=JSON.parse(result.data[0].attachment);
                            }
                            if(this.ruleForm.originateDeptId){
                                this.ruleForm.originateDeptId = [this.ruleForm.originateDeptId];
                            }

                            //确认类型
                           /* if(result.data[0].confirmType){
                                this.ruleForm.confirmType =  result.data[0].confirmType.split(",");
                            }else{
                                this.ruleForm.confirmType = [];
                            }*/
                        }
                        //明细
                        if( result.data[1]){
                            result.data[1].forEach(d => {
                                d.serviceOrganizationId=[d.serviceOrganizationId];
                                d.settlementOrganizationId=[d.settlementOrganizationId];
                                d.city = [d.provinceId, d.serviceCityId];
                                d.dataModel = d.vehicleModelInfoName;
                                if(d.carColor!=null && d.carColor!='null' && d.carColor!=undefined){
                                    d.carColor += '';
                                }else{
                                    d.carColor = '';
                                }
                                if (d.retrofitRequirementOptionsList) {
                                    d.retrofitRequirementOptionsList = d.retrofitRequirementOptionsList.split(',');
                                }else {
                                    d.retrofitRequirementOptionsList = [];
                                }
                            });
                            this.ruleForm.projectContractDetailList =  result.data[1];
                        }

                    } else {
                        this.$message.error(result.message);
                    }
                })
            },
            // 触发单选验证
            checkForm(key){
                this.$refs.ruleForm.validateField(key);
            },
            //新增明细
            addProjectContractDetail() {
                this.ruleForm.projectContractDetailList.push({
                    serviceOrganizationId:[],
                    settlementOrganizationId:[],
                    vehicleQty:"",
                    dataModel:'',
                    useCarStartDate:'',
                    useCarEndDate:'',
                    carAge:'',
                    newOrOldCar:'',
                    carRentMonth:'',
                    calculatePrice:'',
                    oilFeePaymenModel:'',
                    carOilCostMonth:'',
                    limitMileageMonth:'',
                    overMileagePrice:'',
                    etcCost:'',
                    driverWorktimeDay:'',
                    driverCostMonth:'',
                    driverCommunicationCostMonth:'',
                    drivingCost:'',
                    overtimeCost:'',
                    stayCost:'',
                    mealCost:'',
                    welfareFee:'',
                    highTemperatureFee:'',
                    birthdayFee:'',
                    otherSubsidyCost:''
                })
            },

            //保存数据
            save() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        debugger
                        let detailList=this.ruleForm.projectContractDetailList;
                        for(var i=0;i<detailList.length;i++){
                            if(detailList[i].vehicleModelInfoId){
                            }else{
                                this.showMessage('第'+(i+1)+"条明细车型为空");
                                return;
                            }
                            if(detailList[i].isNeedDriverBoolean==0){
                                this.$set(detailList[i],"driverWorktimeDay","");
                                this.$set(detailList[i],"driverCount","");
                                this.$set(detailList[i],"driverCostMonth","");
                                this.$set(detailList[i],"driverCommunicationCostMonth","");
                                this.$set(detailList[i],"drivingCost","");
                                this.$set(detailList[i],"overtimeCost","");
                                this.$set(detailList[i],"stayCost","");
                                this.$set(detailList[i],"mealCost","");
                                this.$set(detailList[i],"welfareFee","");
                                this.$set(detailList[i],"highTemperatureFee","");
                                this.$set(detailList[i],"birthdayFee","");
                                this.$set(detailList[i],"otherSubsidyCost","");
                                this.$set(detailList[i],"otherCostExplanation","");
                            }
                        }

                        let params = this.extend(true,{},this.ruleForm);
                        params.originateDeptId = params.originateDeptId.join();
                        this.convertData(params);
                        console.log(params)
                        this.saveDisabled=true;
                        ajax.post("/core/coreProjectContract/addOrEdit", params).then(res => {
                            this.saveDisabled=false;
                            if (this.checkResponse(res)) {// 验证请求成功状态
                                this.close();
                                this.$emit("load");//触发列表刷新
                            }
                        }).catch(_=>{
                            this.saveDisabled=false;
                        });
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });

            },
            convertData(params){
                params.contractAmount && (params.contractAmount = parseFloat(params.contractAmount));
                params.invoiceTaxRateDriver && (params.invoiceTaxRateDriver = parseFloat(params.invoiceTaxRateDriver));
                params.invoiceTaxRateVehicle && (params.invoiceTaxRateVehicle = parseFloat(params.invoiceTaxRateVehicle));
                params.projectContractDetailList.forEach( item =>{
                    item.organizationId=this.ruleForm.originateDeptId.join();
                    item.serviceOrganizationId=item.serviceOrganizationId[0];
                    item.settlementOrganizationId=item.settlementOrganizationId[0];
                    item.calculateRent && (item.calculateRent = parseFloat(item.calculateRent));
                    item.birthdayFee && (item.birthdayFee = parseFloat(item.birthdayFee));
                    item.highTemperatureFee && (item.highTemperatureFee = parseFloat(item.highTemperatureFee));
                    item.welfareFee && (item.welfareFee = parseFloat(item.welfareFee));
                    item.mealCost && (item.mealCost = parseFloat(item.mealCost));
                    item.stayCost && (item.stayCost = parseFloat(item.stayCost));
                    item.drivingCost && (item.drivingCost = parseFloat(item.drivingCost));
                    item.etcCost && (item.etcCost = parseFloat(item.etcCost));
                    item.overtimeCost && (item.overtimeCost = parseFloat(item.overtimeCost));
                    item.driverWorktimeDay && (item.driverWorktimeDay = parseFloat(item.driverWorktimeDay));
                    item.otherSubsidyCost && (item.otherSubsidyCost = parseFloat(item.otherSubsidyCost));
                    item.driverCommunicationCostMonth && (item.driverCommunicationCostMonth = parseFloat(item.driverCommunicationCostMonth));
                    item.driverCostMonth && (item.driverCostMonth = parseFloat(item.driverCostMonth));
                    item.overMileagePrice && (item.overMileagePrice = parseFloat(item.overMileagePrice));
                    item.limitMileageMonth && (item.limitMileageMonth = parseFloat(item.limitMileageMonth));
                    item.carOilCostMonth && (item.carOilCostMonth = parseFloat(item.carOilCostMonth));
                    item.carRentMonth && (item.carRentMonth = parseFloat(item.carRentMonth));
                    item.isNeedDriver = item.isNeedDriverBoolean?1:0;
                });
                var $this = this;
                // params.attachment = JSON.stringify(this.fileList);
                /*if($this.fileList != null && $this.fileList.length > 0){
                    var objectFile = {};
                    objectFile['name'] = $this.fileList[0].name;
                    objectFile['path'] = $this.fileList[0].path;
                    objectFile['filedomain'] = $this.fileList[0].filedomain;
                    params.attachment =  JSON.stringify(objectFile);
                }*/
                if($this.fileList.length>0)//转换图片
                    params.attachment=JSON.stringify($this.fileList);
               // params.confirmType = params.confirmType.join(",");
            },
            openDialogVehicleModelInfo(i){
                this.clickTableIndex = i;
                this.dialog.vehInfo = true;
                this.dialogPagination.pageSize=10;
                this.dialogPagination.page=1;
                this.queryVehModelInfo();
            },
            queryVehModelInfo() {
                let params = this.vehInfoParam;
                params.rows = this.dialogPagination.pageSize;
                params.current = this.dialogPagination.page;
                /*console.log(this.vehInfoParam)
                console.log(params)*/
                ajax.get('/base/baseVehicleModelInfo/queryList', params)
                    .then(rs => {
                        let data = rs;
                        this.vehInfoList = data.rows;
                        this.dialogPagination.listCount = data.records;
                    });
            },
            //车型弹出框table数据选择
            selectVehModelInfo(cell) {
                var i = this.clickTableIndex;
                this.$set(this.ruleForm.projectContractDetailList[i],"dataModel",cell.modelInfo);
                this.$set(this.ruleForm.projectContractDetailList[i],"vehicleModelInfoId",cell.id);
                /*  this.ruleForm.projectContractDetailList[i].dataModel = cell.modelInfo
                  this.ruleForm.projectContractDetailList[i].vehicleModelInfoId = cell.id;*/
                this.dialog.vehInfo = false;
            },
            deleteItem(index) {
                if (this.ruleForm.projectContractDetailList.length == 1) {
                    this.$message.error('至少保留一条合同明细');
                    return;
                }
                this.ruleForm.projectContractDetailList.splice(index, 1);
            }
        },


        mounted(){
            //字典值
            ajax.get('/admin/dict/type/付款方式').then(rs => {
                this.paymentModelList = rs;
            });
            ajax.get('/admin/dict/type/结算方式').then(rs => {
                this.settlementModeList = rs;
            });
            ajax.get('/admin/dict/type/我方签约主体').then(rs => {
                this.ourContractSubjectList = rs;
            });
            ajax.get('/admin/dict/type/车辆颜色').then(rs => {
                this.carColorList = rs;
            });
            ajax.get('/admin/dict/type/加装要求选项').then(rs => {
                this.retrofitRequirementOptionsList = rs;
            });
            this.open();
        }

    }
</script>
