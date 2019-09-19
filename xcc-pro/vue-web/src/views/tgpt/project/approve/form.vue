<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="项目评审" name="1">

                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="originateDeptId">
                            <tree-select v-model="addForm.originateDeptId" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree" @change="changeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="addForm.projectName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="客户类型" prop="customerType">
                            <el-select v-model="addForm.customerType" @change="changeCustomerType" placeholder="请选择客户类型">
                                <el-option label="企业客户" value="1" key="1"> </el-option>
                                <el-option label="个人客户" value="2" key="2"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务客户" prop="enterpriseId">
                            <el-input v-model="addForm.enterpriseName" readonly :disabled="!addForm.customerType">
                                <el-button slot="append" icon="el-icon-search" @click="openEnterprise" :disabled="!addForm.customerType"></el-button>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="项目类型">
                            <el-select v-model="addForm.projectType" placeholder="请选择项目类型">
                                <el-option label="自驾" value="自驾"></el-option>
                                <el-option label="配驾" value="配驾"></el-option>
                                <el-option label="司机托管" value="司机托管"></el-option>
                                <el-option label="车辆托管" value="车辆托管"></el-option>
                                <el-option label="司机与车辆托管" value="司机与车辆托管"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目负责人" prop="projectLeaderId">

                            <el-select v-model="addForm.projectLeaderId" placeholder="请选择项目负责人">

                                <el-option
                                    v-for="item in principalData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>

                        </el-form-item>

                        <el-form-item label="油费类型" prop="">
                            <el-select v-model="addForm.oilFeePaymenModel" placeholder="请选择">
                                <el-option label="全包" value="1"></el-option>
                                <el-option label="里程内包" value="2"></el-option>
                                <el-option label="不包" value="3"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目周期（月）" prop="contractMonth">
                            <el-input v-model.number="addForm.contractMonth" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="申请日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.applicationDate"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="交付日期">
                            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.deliveryDate"
                                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="招标编号" prop="tenderId">
                            <template>
                                <el-select
                                    v-model="addForm.tenderId"
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
                            <el-select v-model="addForm.frameContract">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="费用信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="结算方式" prop="settlementModel">
                            <el-select placeholder="请选择结算方式" clearable v-model="addForm.settlementModel">
                                <el-option v-for="item in settlementModeList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日（日）" prop="settlementDate">
                            <el-input v-model.number="addForm.settlementDate" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="结算周期（天）" prop="settlementCycle">
                            <el-input v-model.number="addForm.settlementCycle" placeholder="请输入"
                                      clearable></el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel">
                            <el-select placeholder="请选择付款方式" clearable v-model="addForm.paymentModel">
                                <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="项目总金额（元）" prop="totalAmount">
                            <el-input v-model="addForm.totalAmount" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="押金金额（元）" prop="deposit">
                            <el-input v-model="addForm.deposit" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="保证金金额（元）" prop="depositAmount">
                            <el-input v-model="addForm.depositAmount" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="服务费金额（元）" prop="serviceCost">
                            <el-input v-model="addForm.serviceCost" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="发票税率（人%）" prop="invoiceTaxRateDriver">
                            <el-input v-model.number="addForm.invoiceTaxRateDriver" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发票税率（车%）" prop="invoiceTaxRateVehicle">
                            <el-input v-model.number="addForm.invoiceTaxRateVehicle" placeholder="请输入" clearable>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="询价明细" name="3">
                    <div class="comfirm_panel">
                        <el-checkbox v-model="addForm.isHumanEnquiryInquiry">人力询价确认</el-checkbox>
                        <el-checkbox v-model="addForm.isPurchaseInquiry">采购询价确认</el-checkbox>
                        <el-checkbox v-model="addForm.isMaintenanceInquiry">维保询价确认</el-checkbox>
                    </div>
                    <el-button type="primary" @click="addInquiryItem" style="padding: 8px 15px;border: 0;">新增
                    </el-button>
                    <el-table border :data="addForm.details" style="width: 100%;">
                        <el-table-column label="操作" min-width="120" fixed>
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-button type="text"
                                               @click="deleteItem(scope.$index)"
                                               style="font-size: 13px;">删除
                                    </el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="服务城市" min-width="150">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.city'" :rules="[rules.required()]">
                                    <city-select :value.sync="scope.row.city"
                                                 :ref="'citySelect_' + scope.$index"></city-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dataModel" label="车型" min-width="250">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.dataModel'"
                                              :rules="[rules.required()]">
                                    <el-input type="text" placeholder="请选择车型" v-model="scope.row.dataModel"
                                              size="small"
                                              @click.native="openDialog(3, scope.$index)">
                                    </el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="颜色" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.carColor'">
                                    <el-select v-model="scope.row.carColor" placeholder="请选择">
                                        <el-option v-for="item in carColorList" :key="item.value"
                                                   :label="item.text"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="车辆成色" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.newOrOldCar'"
                                              :rules="[rules.required()]">
                                    <el-select v-model="scope.row.newOrOldCar" placeholder="请选择">

                                        <el-option label="旧车" value="0"></el-option>
                                        <el-option label="新车" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>

                        </el-table-column>
                        <el-table-column label="车辆台数（辆）" min-width="120">
                            <template slot-scope="scope">

                                <el-form-item :prop="'details.' + scope.$index  + '.vehicleQty'"
                                              :rules="[{validator: numberTen, trigger: 'change'},
                                              { validator: formRule.standardSize, message: '请输入整数', trigger: 'change' }]">
                                    <el-input type="text" v-model="scope.row.vehicleQty" size="small"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="司机人数（人）" min-width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.driverQty'"
                                              :rules="[{validator: numberTen, trigger: 'change'},
                                              { validator: formRule.standardSize, message: '请输入整数', trigger: 'change' }]">
                                    <el-input type="text" v-model="scope.row.driverQty" size="small"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="车龄（月）" min-width="120">
                            <template slot-scope="scope">

                                <el-form-item :prop="'details.' + scope.$index  + '.carAge'"
                                              :rules="[{validator: numberThree, trigger: 'change'},
                                              { validator: formRule.standardSize, message: '请输入整数', trigger: 'change' }]">
                                    <el-input type="text" v-model="scope.row.carAge" size="small"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="合同周期（月）" width="120">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.contractCycle'"
                                              :rules="[{validator: numberThree, trigger: 'change'},
                                              { validator: formRule.standardSize, message: '请输入整数', trigger: 'change' }]">
                                    <el-input type="text" v-model="scope.row.contractCycle" size="small"
                                              placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="加装要求" min-width="250">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-select v-model="scope.row.retrofitRequirementValues" multiple
                                               placeholder="请选择">
                                        <el-option
                                            v-for="item in retrofitRequirementOptionsList"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="其他加装要求" min-width="200">
                            <template slot-scope="scope">
                                <el-form-item :prop="'details.' + scope.$index  + '.retrofitRequirement'"
                                              :rules="{max: 50, message: '不能超过50个字符', trigger: 'change'}">
                                    <el-input type="text" v-model="scope.row.retrofitRequirement"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="客户限价（不含税/元）" min-width="170">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'details.' + scope.$index  + '.customerLimitPrice'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'change'}">

                                    <el-input type="text" v-model="scope.row.customerLimitPrice"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="客户限价（含税/元）" min-width="160">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'details.' + scope.$index  + '.customerLimitPriceTax'"
                                    :rules="{pattern: moneyRegex, message: '金额输入异常', trigger: 'change'}">

                                    <el-input type="text" v-model="scope.row.customerLimitPriceTax"
                                              size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>

            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <!-- 车型 dialog -->
        <el-dialog title="选择车型" :visible.sync="dialogVisibleArray[2]" :append-to-body="true" width="1000px">
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
                        <el-button type="primary" size="small" @click="_queryVehModelInfo">查询</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="vehInfoList" @row-dblclick="selectThree($event)">
                        <el-table-column fixed="left" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="selectThree(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column property="modelInfo" label="车型名称" show-overflow-tooltip
                                         min-width="200"></el-table-column>
                        <el-table-column property="modelName" label="款式" show-overflow-tooltip
                                         min-width="120"></el-table-column>
                        <el-table-column property="seating" label="座位" show-overflow-tooltip
                                         min-width="80"></el-table-column>
                        <el-table-column property="displacement" label="排量" show-overflow-tooltip
                                         min-width="80"></el-table-column>
                        <el-table-column property="transmissionName" label="变速箱" show-overflow-tooltip
                                         min-width="120"></el-table-column>
                        <el-table-column property="vehicleNumberName" label="车厢" show-overflow-tooltip
                                         min-width="80"></el-table-column>
                        <el-table-column property="fuelTypeName" label="燃油类型" show-overflow-tooltip
                                         min-width="80"></el-table-column>
                        <el-table-column property="fuel_capacity" label="邮箱容量" show-overflow-tooltip
                                         min-width="80"></el-table-column>
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

        <!-- 企业用户  dialog -->
        <!-- <el-dialog title="选择企业用户" :visible.sync="dialogVisibleArray[0]" width="850px" :append-to-body="true">
             <div class="list-panel">
                 <div class="search-box min">
                     <div class="form-box">
                         <div class="form-group">
                             <div class="input-group">
                                 <el-input v-model="enterpriseParam.name"
                                           placeholder="企业客户名称"></el-input>
                             </div>
                         </div>
                     </div>
                     <div class="search-btn-list">
                         <el-button type="primary" size="small" @click="_queryEnterprise">查询</el-button>
                     </div>
                 </div>
                 <div class="table-box">
                     <el-table border :data="enterpriseList" @row-dblclick="selectOne($event)">
                         <el-table-column fixed="left" label="操作" width="50">
                             <template slot-scope="scope">
                                 <el-button @click="selectOne(scope.row)" type="text">选择</el-button>
                             </template>
                         </el-table-column>
                         <el-table-column property="name" label="企业名称" width="200"
                                          @click.native="selectOne()"></el-table-column>
                         <el-table-column property="nature" label="企业性质" width="120">
                             <template slot-scope="scope">
                                 <span v-if="scope.row.nature==1">国企</span>
                                 <span v-else-if="scope.row.nature==2">民营</span>
                                 <span v-else-if="scope.row.nature==3">合资</span>
                                 <span v-else-if="scope.row.nature==4">外资</span>
                                 <span v-else-if="scope.row.nature==5">其他</span>
                             </template>
                         </el-table-column>
                         <el-table-column property="scale" label="企业规模">
                             <template slot-scope="scope">
                                 <span v-if="scope.row.scale==1">大型企业</span>
                                 <span v-else-if="scope.row.scale==2">中型企业</span>
                                 <span v-else-if="scope.row.scale==3">小型企业</span>
                             </template>
                         </el-table-column>
                         <el-table-column property="city_name" label="所在城市"></el-table-column>
                         <el-table-column property="enterprise_status" label="企业状态">
                             <template slot-scope="scope">
                                 <span v-if="scope.row.enterprise_status==1">待开拓</span>
                                 <span v-else-if="scope.row.enterprise_status==2">开拓中</span>
                                 <span v-else-if="scope.row.enterprise_status==3">正常</span>
                                 <span v-else-if="scope.row.enterprise_status==4">逾期</span>
                                 <span v-else-if="scope.row.enterprise_status==5">停止开拓</span>
                                 <span v-else-if="scope.row.enterprise_status==6">停用</span>
                                 <span v-else-if="scope.row.enterprise_status==7">黑名单</span>
                             </template>
                         </el-table-column>
                         <el-table-column property="company_name" label="所属组织" width="180"></el-table-column>
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
 -->
        <!-- 供应商 -->
        <el-dialog title="选择供应商" :visible.sync="dialogVisibleArray[1]" :append-to-body="true" width="900px">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <div class="input-group">
                                <el-input placeholder="供应商名称" v-model="supplierParam.name"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <el-input placeholder="手机号" v-model="supplierParam.phone"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" size="small" @click="_querySupplier">查询</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="supplierList" @row-dblclick="selectTwo($event)">
                        <el-table-column fixed="left" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="selectTwo(scope.row)" type="text">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column property="name" label="供应商名称" min-width="140"></el-table-column>
                        <el-table-column property="contact" label="联系人" min-width="110"></el-table-column>
                        <el-table-column property="contact_phone" label="联系电话" min-width="120"></el-table-column>
                        <el-table-column property="contact_phone" label="联系手机号" min-width="120"></el-table-column>
                        <el-table-column property="contact_address" label="联系地址" min-width="140"></el-table-column>
                        <el-table-column property="company_name" label="所属组织" min-width="140"></el-table-column>
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
        <enterprise-dialog ref="enterpriseList" @load="selectEnterprise"></enterprise-dialog>
        <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer"></personal-customer-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import enterpriseDialog from '@/views/tgpt/corporateCustomer/customerPersonal/enterpriseDialog'
    import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "projectApproveForm",
        components: {TreeSelect, CitySelect,personalCustomerDialog,enterpriseDialog},
        data() {
            let checkDayOfMonth = (rule, v, callback) => {
                if (!v)
                    callback();
                else if (isNaN(v) || v < 0 || v > 31 || ((v + '').indexOf('.') != -1))
                    callback(new Error('只能输入1~31'));
                else
                    callback();
            };

            let checkTaxRate = (rule, v, callback) => {
                if (!v)
                    callback();
                else if (isNaN(v) || v < 0 || v > 100)
                    callback(new Error('只能输入0~100'));
                else
                    callback();
            };

            let numberTen = (rule, v, callback) => {
                if (!v)
                    callback();
                else if (isNaN(v))
                    callback(new Error('输入数字'));
                else if ((v + '').length > 10)
                    callback(new Error('不超过10个字符'));
                else
                    callback();
            };

            let numberThree = (rule, v, callback) => {
                if (!v)
                    callback();
                else if (isNaN(v))
                    callback(new Error('输入数字'));
                else if ((v + '').length > 3)
                    callback(new Error('不超过3个字符'));
                else
                    callback();
            };

            let moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            let moneyValidator = {pattern: moneyRegex, message: '金额输入异常', trigger: 'change'};
            let maxLength50 = {max: 50, message: '长度不能超过50个字符', trigger: 'change'};
            return {
                orgSelectId: [],
                type: '',
                activeNames: ['1', '2', '3'],
                clickTableIndex: 0,
                formRule,
                addForm: {},
                rules: {
                    originateDeptId: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ],
                    projectName: [
                        {required: true, message: '请输入项目名称', trigger: 'change'},
                        maxLength50
                    ],
                    serviceCityExplain: [
                        maxLength50
                    ],
                    applicationDate: [
                        {required: true, message: '请选择申请日期', trigger: 'change'}
                    ],
                    customerType: [
                        {required: true, message: '请选择客户类型', trigger: 'change'}
                    ],
                    enterpriseId: [
                        {required: true, message: '请选择服务客户', trigger: ['blur', 'change']}
                    ],
                    contractMonth: [
                        {required: true, message: '请输入合同期', trigger: 'change'},
                        {type: 'number', message: '合同期必须为数字值', trigger: 'change'},
                        {validator: numberThree, trigger: 'change'},
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    settlementDate: [
                        {required: true, message: '请输入结算日', trigger: 'change'},
                        {type: 'number', message: '合同期必须为数字值', trigger: 'change'},
                        {validator: checkDayOfMonth, trigger: 'change'}
                    ],
                    settlementModel: [
                        {required: true, message: '请选择结算方式', trigger: 'change'}
                    ],
                    settlementCycle: [
                        {required: true, message: '请输入结算周期', trigger: 'change'},
                        {validator: numberThree, trigger: 'change'},
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    paymentModel: [
                        {required: true, message: '请输入付款方式', trigger: 'change'},
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    invoiceTaxRateDriver: [
                        {type: 'number', message: '请输入数字', trigger: 'change'},
                        {validator: checkTaxRate, trigger: 'change'}
                    ],
                    invoiceTaxRateVehicle: [
                        {type: 'number', message: '请输入数字', trigger: 'change'},
                        {validator: checkTaxRate, trigger: 'change'}
                    ],
                    projectLeaderId: [
                        {required: true, message: '请选择项目负责人', trigger: 'change'}
                    ],
                    introduceContent: [
                        {required: true, message: '请输入项目内容介绍', trigger: 'change'},
                        {max: 2000, message: '长度不能超过2000个字符', trigger: 'change'}
                    ],
                    breakResponsibility: [
                        {max: 2000, message: '长度不能超过2000个字符', trigger: 'change'}
                    ],
                    gradeStandard: [
                        {max: 2000, message: '长度不能超过2000个字符', trigger: 'change'}
                    ],
                    otherRequirement: [
                        {max: 2000, message: '长度不能超过2000个字符', trigger: 'change'}
                    ],
                    deposit: [moneyValidator],
                    totalAmount: [moneyValidator],
                    depositAmount: [moneyValidator],
                    serviceCost: [moneyValidator],
                    tenderNumber: [maxLength50],
                    standardPackageDivided: [maxLength50],
                    bidInfoLink: [maxLength50]
                }
                ,
                paymentModelList: [],
                settlementModeList: [],
                currentName: '',
                branchOffice: [],
                principalData: [],
                params: {},
                dialogTitle: '',
                vehInfoParam: {},
                vehInfoList: [],
                enterpriseList: [],
                enterpriseParam: {},
                supplierParam: {},
                supplierList: [],
                dialogVisibleArray: [false, false, false],
                dialogPagination: {
                    pageSize: 10,
                    pageSizeSetting: [10, 20, 40, 100],
                    page: 1,
                    listCount: 1,
                },
                numberTen: numberTen,
                numberThree: numberThree,
                carColorList: [],
                retrofitRequirementOptionsList: [],
                moneyRegex: moneyRegex,
                activeFgsArray: [],

                pageSize: 10,
                pageSizeSetting: [10, 20, 40, 100],
                page: 1,// 当前页
                listCount: 1,
                pageLayout: "total, sizes, prev, pager, next, jumper",
                tenderNumberArray: [],
                loading: false

            }
        },
        mounted() {
            let userInfo = this.getCurrentUserInfo();
            this.currentName = userInfo.name;
            //项目负责人
            this.principal();

            //字典值
            ajax.get('/admin/dict/type/付款方式').then(rs => {
                this.paymentModelList = rs;
            });
            ajax.get('/admin/dict/type/结算方式').then(rs => {
                this.settlementModeList = rs;
            });
            ajax.get('/admin/dict/type/车辆颜色').then(rs => {
                this.carColorList = rs;
            });
            ajax.get('/admin/dict/type/加装要求选项').then(rs => {
                this.retrofitRequirementOptionsList = rs;
            });

            this.open();
        }
        ,
        methods: {
            editParam() {
                if (this.$route.query.id) {
                    ajax.get('/core/coreProjectReview/findById/' + this.$route.query.id).then(rs => {

                        let p = rs['project'];
                        p.details = rs['details'];
                        //时间戳
                        p.applicationDate = p.applicationDateStr;
                        //询价勾选
                        let irArr = p.inquiryRequire.split(',');
                        p.isPurchaseInquiry = (irArr[0] == 1);
                        p.isMaintenanceInquiry = (irArr[1] == 1);
                        p.isHumanEnquiryInquiry = (irArr[2] == 1);
                        p.settlementModel = p.settlementModelV;
                        p.paymentModel = p.paymentModelV;

                        p.frameContract += '';
                        //组织
                        p.originateDeptId = [p.originateDeptId];
                        //明细
                        p.details.forEach(d => {
                            d.city = [d.provinceId, d.serviceCityId];
                            d.dataModel = d.vehicleModelInfoName;
                            d.newOrOldCar += '';
                            d.oilFeePaymenModel += '';
                            if (d.retrofitRequirementOptions) {
                                d.retrofitRequirementValues = d.retrofitRequirementOptions.split(',');
                            }else{
                                d.retrofitRequirementValues=[]
                            }
                        });
                        if(p.oilFeePaymenModel!=null){
                            p.oilFeePaymenModel += '';
                        }
                        this.addForm = p;

                        this.tenderNumberArray = [{
                            label: p.bidNo,
                            value: p.tenderId
                        }];
                    });
                } else {
                }
            },
            principal: function () {
                ajax.get('/core/coreProjectReview/projectLeader').then(rs => {
                    if (rs.status == 0)
                        this.principalData = rs.data;
                });
            },
            //返回按钮
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            open() {
                this.addForm = {
                    projectLeaderId: this.getCurrentUserInfo().userId,
                    isHumanEnquiryInquiry: true,
                    isPurchaseInquiry: true,
                    isMaintenanceInquiry: true,
                    details: [{
                        newOrOldCar: "1",
                        cityName: [],
                        dataModel: '',

                        retrofitRequirementValues: [],
                        recentPrice: '',
                        carAge: 0,
                        contractCycle: 0
                    }],
                    originateDeptName: '',
                    enterpriseId: '',
                    originateDeptId: '',
                    frameContract: '0'
                };

                if (this.$refs.addForm)
                    this.$refs.addForm.resetFields();
                this.editParam();
            },
            openDialog(type, i) {
                debugger
                this.clickTableIndex = i;
                this.dialogVisibleArray[type - 1] = true;
                this._queryDialog();
            }
            ,
            _queryDialog() {
                let type = this.getActiveDialogType();
                if (type == 3)
                    this._queryVehModelInfo();
                // else if (type == 1)
                //     this._queryEnterprise();
                else if (type == 2)
                    this._querySupplier();
            }
            ,
            _querySupplier() {
                let params = this.supplierParam;
                params.size = this.dialogPagination.pageSize;
                params.current = this.dialogPagination.page;

                ajax.get('/core/coreProjectReview/supplier', params)
                    .then(rs => {
                        var data = rs.data;
                        if (rs.status == 0) {
                            this.supplierList = data.rows;
                            this.dialogPagination.listCount = data.records;
                        }
                    });
            }
            ,
            _queryVehModelInfo() {
                let params = this.vehInfoParam;
                params.size = this.dialogPagination.pageSize;
                params.current = this.dialogPagination.page;
                ajax.get('/base/baseVehicleModelInfo/queryList', params)
                    .then(rs => {
                        let data = rs;
                        //if (rs.status == 0) {
                        this.vehInfoList = data.rows;
                        this.dialogPagination.listCount = data.records;
                        //}
                    });
            }
            ,
            openEnterprise() {
                if(this.addForm.originateDeptId==null || this.addForm.originateDeptId.length!=1){
                    this.$message.error("请选择所属组织");
                    return;
                }
                if(!this.addForm.customerType){
                    this.$message.error("请选择客户类型");
                    return;
                }
                if(this.addForm.customerType==1)
                    this.$refs.enterpriseList.open(this.addForm.originateDeptId.join());
                else if(this.addForm.customerType==2)
                    this.$refs.personalCustomerList.open(this.addForm.originateDeptId.join());
            },
            //选择企业客户
            selectEnterprise(row){
                this.addForm.enterpriseId=row.id;
                this.addForm.enterpriseName=row.name;
                this.addForm=Object.assign({},this.addForm);
            },
            //选择个人客户
            selectPersonalCustomer(row){
                this.addForm.enterpriseId=row.id;
                this.addForm.enterpriseName=row.name;
                this.addForm=Object.assign({},this.addForm);
            },
            changeCustomerType(){
                this.addForm.enterpriseId='';
                this.addForm.enterpriseName='';
                this.addForm=Object.assign({},this.addForm);
            },
            /* ,
             //企业客户弹出框table数据选择
             selectOne(cell) {
                 this.addForm.enterpriseName = cell.name;
                 this.addForm.enterpriseId = cell.id;
                 this.handleDialogClose();
             }
             ,*/
            //招标供应商弹出框table数据选择
            selectTwo(cell) {
                this.addForm.supplierName = cell.name;
                this.addForm.supplierId = cell.id;
                this.handleDialogClose();
            }
            ,
            //车型弹出框table数据选择
            selectThree(cell) {
                var i = this.clickTableIndex;
                //查询最近价格
                ajax.get('/core/coreProjectReview/findNearPrice/' + cell.id).then(rs => {
                    this.addForm.details[i].recentPrice = rs.data;
                });

                this.addForm.details[i].dataModel = cell.modelInfo;
                this.addForm.details[i].vehicleModelInfoId = cell.id;
                this.handleDialogClose();
            }
            ,
            //查询明细新增
            addInquiryItem() {
                this.addForm.details.push({
                    newOrOldCar: "1",
                    cityName: [],
                    dataModel: '',

                    retrofitRequirementValues: [],
                    recentPrice: ''
                })
            }
            ,
            handleSizeChange(val) {
                this.dialogPagination.pageSize = val;
                this.dialogPagination.page = 1;
                this._queryDialog();
            }
            ,
            handleCurrentChange(val) {
                this.dialogPagination.page = val;
                this._queryDialog();
            }
            ,
            //保存提交
            submitForm: function (form) {
                let data = this.extend(true, {}, this.addForm);
                data.details.forEach((d, i) => {
                    try {
                        d.cityId = this.$refs['citySelect_' + i].value[1];
                    } catch (e) {
                    }
                    d.retrofitRequirementOptions = d.retrofitRequirementValues.join(',');
                    d.sortNum = i + 1;
                });

                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    let url = '/core/coreProjectReview/start';
                    if (data.id)
                        url = '/core/coreProjectReview/editSave';

                    data.originateDeptId = data.originateDeptId.join();
                    ajax.post(url, data)
                        .then(rs => {
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
            ,
            handleDialogClose() {
                this.dialogVisibleArray = [false, false, false];
            }
            ,
            getActiveDialogType() {
                var arr = this.dialogVisibleArray;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i])
                        return i + 1;
                }
                return -1;
            },
            deleteItem(index) {
                if (this.addForm.details.length == 1) {
                    this.$message.error('至少保留一条询价明细');
                    return;
                }
                this.addForm.details.splice(index, 1);
            },
            changeOrganization(data){
                this.addForm.enterpriseId='';
                this.addForm.enterpriseName='';
                this.addForm=Object.assign({},this.addForm);
            },
            queryTenderNumber(query) {
                console.log('queryTenderNumber', query);

                this.tenderNumberArray = [];

                if (query !== '') {
                    this.loading = true;

                    ajax.get('core/coreProjectBid/list', {bidNo: query}).then(rs => {
                        rs.records.forEach(item => {
                            this.tenderNumberArray.push({
                                label: item.bidNo,
                                value: item.id
                            })
                        });

                        this.loading = false;
                    });
                }
            }
        }
    }
</script>
<style>
    .comfirm_panel {
        padding: 5px 0 22px;
    }
</style>

