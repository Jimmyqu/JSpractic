<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="司机报销表" name="1">
				<div class="flex-panel">

                    <el-form-item label="服务组织" prop="companyId">
                        <tree-select  placeholder="请选择服务组织" type="one" v-model="companyId"
                                     url="admin/organization/tree?noManager=noManager" @change="getVehicleModalList"></tree-select>
                    </el-form-item>

					<el-form-item label="车辆" prop="vehicleId">
                        <el-input :readonly = "true" :disabled="!companyId" v-model="addForm.plate" clearable @focus="getVehicle()" placeholder="请选择车辆">
                            <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
					</el-form-item>

                    <el-form-item label="驾驶员" prop="driverId">
                        <el-input :readonly="true" v-model="addForm.driverName" clearable @focus="getDriver()"
                                  placeholder="请选择驾驶员">
                            <el-button @click="getDriver()" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <!--<el-select v-model="addForm.driverId" clearable placeholder="请选择驾驶员">
                            <el-option v-for="item in driverModalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>-->
                    </el-form-item>

                    <el-form-item label="合同编号" prop="contractNo">
                        <el-select v-model="addForm.contractNo" clearable placeholder="请选择合同编号" @change="getcontractNoList()">
                            <el-option v-for="item in contractNoList" :key="item.id" :label="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="服务客户">
                        <el-input disabled clearable v-model="enterpriseName"></el-input>
                    </el-form-item>

				</div>
                </el-collapse-item>




                <el-collapse-item title="油费" name="2">
                    <el-button class="float-btn" @click="addOli()" type="primary">新增
                    </el-button>
                    <el-table :data="addForm.oilCostList" style="width: 100%;margin-top: 10px" border>
                        <el-table-column fixed="right" label="操作" min-width="100">
                            <template slot-scope="{row,$index}">
                                <el-button @click="delEnterpriseOli(row,$index)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="index" label="序号" min-width="70">
                            <template slot-scope="{row,$index}">
                                <span>{{$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="oilTime" label="加油时间" min-width="160">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilTime'"
                                               :rules="rules.required('必填')">
                                <el-date-picker type="date" placeholder="请选择" v-model="row.oilTime"
                                                value-format="yyyy-MM-dd" :picker-options="row.oilTime"
                                                :editable="false"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="oilArea" label="加油地点" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilArea'"
                                               :rules="rules.required('必填')">
                                <el-input v-model="row.oilArea" clearable placeholder="加油地点" maxlength="180"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="capacityBefore" label="加油前油量（%）" min-width="140">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.capacityBefore'"
                                               :rules="rules.cess(true,'油量输入异常')">
                                    <el-input v-model="row.capacityBefore"  clearable maxlength="15" placeholder="加油前油量"  @change="automaticCalculation($index)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="capacityAfter" label="加油后油量（%）" min-width="140">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.capacityAfter'"
                                               :rules="rules.cess(true,'油量输入异常')">
                                    <el-input v-model="row.capacityAfter"  clearable maxlength="15" placeholder="加油后油量（%）" @change="automaticCalculation($index)"></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>

                        <el-table-column prop="oilMileage" label="加油里程" min-width="140">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilMileage'"
                                               :rules="rules.money(true,'加油里程输入异常')">
                                    <el-input v-model="row.oilMileage" clearable placeholder="加油里程" maxlength="15"></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column prop="oilCapacity" label="加油量" min-width="140">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilCapacity'"
                                               :rules="rules.money(true,'油量输入异常')">
                                    <el-input v-model="row.oilCapacity" clearable placeholder="加油量" maxlength="15"></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column prop="oilUnitPrice" label="单价" min-width="140">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilUnitPrice'"
                                               :rules="rules.money(true)">
                                    <el-input v-model="row.oilUnitPrice"  clearable maxlength="15" placeholder="单价"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="oilCost" label="总价" min-width="140">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilCost'"
                                               :rules="rules.money(true)">
                                    <el-input v-model="row.oilCost"  clearable maxlength="15" placeholder="总价"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="payType" label="支付类型" min-width="120">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.payType'"
                                               :rules="rules.required('必填')">
                                <el-select v-model="row.payType" placeholder=""  @change="getPayType($index)">
                                    <el-option label="油卡" :value="1"></el-option>
                                    <el-option label="现金" :value="2"></el-option>
                                </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column prop="oilReason" label="加油原因" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.oilReason'"
                                               :rules="rules.required('必填')">
                                <el-select v-model="row.oilReason" placeholder="请选择加油原因">
                                    <el-option label="用车加油" value="1"></el-option>
                                    <el-option label="新车加油" value="2"></el-option>

                                </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column prop="oilCar" label="加油卡" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input readonly  v-model="row.oilCar" @click.native = "openOilCard($index)" clearable placeholder="请选择加油卡">
                                    <el-button @click.native = "openOilCard($index)" slot="append" icon="el-icon-search" ></el-button>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceImg" label="票据图片" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'oilCostList.' + $index + '.invoiceImg'">
                                <upload-panel :size="1" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="row.invoiceImg"
                                              :show-img="true"></upload-panel>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceNum" label="发票号" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.invoiceNum"  :disabled="row.payType==1" clearable maxlength="36" placeholder="请输入发票号"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="remark" label="备注" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.remark"  clearable maxlength="200" placeholder="备注"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-collapse-item>


                <el-collapse-item title="洗车费" name="3">
                    <el-button class="float-btn" @click="addWash()" type="primary">新增
                    </el-button>
                    <el-table :data="addForm.washCarCostList" style="width: 100%;margin-top: 10px" border>
                        <el-table-column fixed="right" label="操作" min-width="100">
                            <template slot-scope="{row,$index}">
                                <el-button @click="delEnterprisedWash(row,$index)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="index" label="序号" min-width="70">
                            <template slot-scope="{row,$index}">
                                <span>{{$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="washTime" label="洗车时间" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'washCarCostList.' + $index + '.washTime'"
                                               :rules="rules.required('必填')">
                                <el-date-picker type="date" placeholder="请选择" v-model="row.washTime"
                                                value-format="yyyy-MM-dd" :picker-options="row.washTime"
                                                :editable="false"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="washArea" label="洗车地点" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.washArea" clearable placeholder="请输入洗车地点" maxlength="50"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="washShop" label="洗车场" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input readonly  v-model="row.washShopName" @click.native = "supplierId($index)" clearable placeholder="请选择洗车场">
                                    <el-button @click.native = "supplierId($index)" slot="append" icon="el-icon-search" ></el-button>
                                </el-input>
                            </template>

                        </el-table-column>


                        <el-table-column prop="businessType" label="业务类型" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'washCarCostList.' + $index + '.businessType'"
                                               :rules="rules.required('必填')">
                                <el-select v-model="row.businessType" placeholder="请选择业务类型">
                                    <el-option label="次结" :value="1"></el-option>
                                    <el-option label="月结" :value="2"></el-option>
                                </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="washCost" label="洗车费用" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'washCarCostList.' + $index + '.washCost'"
                                              :rules="rules.money(true)">
                                    <el-input v-model="row.washCost"  clearable maxlength="15" placeholder="请输入洗车费用"></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column prop="invoiceImg" label="票据图片" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item  :prop="'washCarCostList.' + $index + '.invoiceImg'"
                                               :rules="rules.required('必填')">
                                <upload-panel :size="1" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="row.invoiceImg"
                                              :show-img="true"></upload-panel>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.remark"  clearable maxlength="200" placeholder="备注"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>

                <el-collapse-item title="其他费用" name="4">
                    <div class="flex-panel">
                        <el-form-item label="住宿费" prop="stayCost">
                            <el-input v-model="addForm.stayCost" placeholder="请输入住宿费" clearable>
                                <template slot="append">¥</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="过桥费" prop="bridgeCost">
                            <el-input  v-model="addForm.bridgeCost"  placeholder="请输入过桥费" clearable>
                                <template slot="append">¥</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="停车费" prop="parkCost">
                            <el-input v-model="addForm.parkCost" placeholder="请输入停车费" clearable>
                                <template slot="append">¥</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="备注" name="5">
                    <div class="flex-panel">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="addForm.remark" :rules="[rules.int()]" maxlength=10 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">{{submitText}}</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>


        <!-- 弹窗洗车场  -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="洗车场-查找"
            :visible.sync="supplierIdDialogShow"
            width="95%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">

                    </div>
                    <div class="search-btn-list">

                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300" >
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectSupplierId(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" sortable label="供应商名称">
                        </el-table-column>
                        <el-table-column prop="supplierType" sortable label="供应商类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.supplierType == 1">洗车场</span>
                                <span v-if="scope.row.supplierType == 2">4S店</span>
                                <span v-if="scope.row.supplierType == 3">租车公司</span>
                                <span v-if="scope.row.supplierType == 4">能源企业</span>
                                <span v-if="scope.row.supplierType == 8">洗车场</span>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="contact" sortable label="联系人">
                        </el-table-column>
                        <el-table-column  prop="phoneNo" sortable label="联系电话">
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>


        <el-dialog title="选择加油卡" :visible.sync="dialogOilCard" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">加油卡号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.code" placeholder="请输入加油卡号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.company" placeholder="请输入所属组织" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.enterprise" placeholder="请输入服务客户" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border>
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeOilCard(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="加油卡号"  min-width="200" ></el-table-column>
                        <el-table-column prop="supplier" label="能源企业" min-width="250"></el-table-column>
                        <el-table-column prop="balance" label="油卡余额" min-width="90"></el-table-column>
                        <el-table-column prop="type" label="油卡类型" min-width="80"></el-table-column>
                        <el-table-column prop="cardholderUser" label="持卡人" min-width="150"></el-table-column>
                        <el-table-column prop="company" label="所属组织" min-width="200"></el-table-column>
                        <el-table-column prop="oilCardStatus" label="状态" min-width="100"></el-table-column>
                        <el-table-column prop="enterprise" label="服务客户" min-width="250"></el-table-column>
                        <el-table-column prop="modelName" label="绑定车型" min-width="300"></el-table-column>
                        <el-table-column prop="plate" label="绑定车辆" min-width="100"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>

        <!-- 绑定车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="1000"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300" max-width="600%">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="vin" label="车架号" min-width="140"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>


        <!-- 绑定司机弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择司机"
            :visible.sync="driverShow"
            width="1200"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" placeholder="请输入车牌" clearable/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" placeholder="请输入手机号" clearable/>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"
                                   @click="handleCurrentChange(1);">查询
                        </el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectDriver(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
                        <el-table-column prop="remark" sortable label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="modelName" sortable label="驾驶证号" min-width="100"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "appDriverReimburseForm",
        components: {TreeSelect, CitySelect, MoneyInput,UploadPanel},
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '金额输入异常', trigger: 'change'};
            return {
                activeNames: ['0', '1', '2', '3', '4', '5'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                vehicleModalList:[],
                driverModalList:[],
                contractNoList:[],
                addForm:{id:'',
                    bridgeCost:'',
                    parkCost:'',
                    vehicleId:'',
                    driverId:'',
                    contractNo:'',
                    enterpriseId:'',
                    stayCost:'',
                    oilCostList:[],
                    remark:'',
                    washCarCostList:[],
                    organizationId:''
                },
                companyId:[],
                enterpriseName:"",
                supplierIdDialogShow:false,
                washIndex:"",
                dialogOilCard: false,
                vehicleShow:false,
                driverShow:false,
                oilIndex:"",
                total_mileagefrom: "",
                oilMileage:"",
                rules: {
                    vehicleId: [
                        {required: true, message: '请选择所属车辆', trigger: 'change'}
                    ],
                   /* driverId: [
                        {required: true, message: '请选择所属司机', trigger: 'change'}
                    ],*/
                    stayCost: [moneyValidator],
                    bridgeCost: [moneyValidator],
                    parkCost: [moneyValidator],
                    remark: [{max: 200, message: '长度不能超过200个字符', trigger: 'change'}],
                    washCost:[moneyValidator],
                },
                submitText:"保存"
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                if (this.$route.query.id) {
                    ajax.get('app/appDriverReimburse/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        this.enterpriseName=this.addForm.enterpriseName;
                        if(rs.data.companyId){
                            this.companyId[0]=rs.data.companyId;
                            var contractNo=this.addForm.contractNo;
                            this.getDriverModalList();
                            this.addForm.contractNo= contractNo;
                            this.$set(this, "companyId", [rs.data.companyId]);
                        }
                        var oilCostList=this.addForm.oilCostList;
                        if(typeof(oilCostList)!='undefined' && oilCostList!=null && oilCostList.length!=0){
                            for(var b in oilCostList){
                                if(oilCostList[b].invoiceImg!='undefined' && oilCostList[b].invoiceImg!=null && oilCostList[b].invoiceImg!=''){
                                    oilCostList[b].invoiceImg=[JSON.parse(oilCostList[b].invoiceImg)]
                                }else{
                                    oilCostList[b].invoiceImg=[];
                                }
                            }
                            this.$set(this.addForm, "oilCostList", oilCostList);
                        }
                        var washCarCostList=this.addForm.washCarCostList;
                        if(typeof(washCarCostList)!='undefined' && washCarCostList!=null && washCarCostList.length!=0){
                            for(var b in washCarCostList){
                                if(washCarCostList[b].invoiceImg!='undefined' && washCarCostList[b].invoiceImg!=null && washCarCostList[b].invoiceImg!=''){
                                    washCarCostList[b].invoiceImg=[JSON.parse(washCarCostList[b].invoiceImg)]
                                }else{
                                    washCarCostList[b].invoiceImg=[];
                                }
                            }
                            this.$set(this.addForm, "washCarCostList", washCarCostList);
                        }
                    });
                }
            },
            //保存提交
            submitForm: function (form) {

                let data = this.extend(true,{},this.addForm);
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    if(!this.checkOli()){
                        return;
                    }
                    if(!this.checkWash()){
                        this.$message({message: '请将洗车信息填写完整！',type: 'error'});
                        return;
                    }
                    var oilCostList=data.oilCostList;
                    if(typeof(oilCostList)!='undefined' && oilCostList!=null && oilCostList.length!=0){
                        for(var b in oilCostList){
                            var invoiceImg="";
                            if(oilCostList[b].invoiceImg.length>0){
                                invoiceImg=JSON.stringify(oilCostList[b].invoiceImg[0]);
                            }
                            oilCostList[b].invoiceImg=invoiceImg;
                        }
                        data.oilCostList=oilCostList;
                    }else{
                        data.oilCostList=[];
                    }
                    var washCarCostList=data.washCarCostList;
                    if(typeof(washCarCostList)!='undefined' && washCarCostList!=null && washCarCostList.length!=0){
                        for(var b in washCarCostList){
                            var invoiceImg="";
                            if(washCarCostList[b].invoiceImg.length>0){
                                invoiceImg=JSON.stringify(washCarCostList[b].invoiceImg[0]);
                            }
                            washCarCostList[b].invoiceImg=invoiceImg;

                        }
                        data.washCarCostList=washCarCostList;
                    }else{
                        data.washCarCostList=[];
                    }
                    if(this.submitText=="保存"){
                        this.submitText="保存中";
                        ajax.post('app/appDriverReimburse/', data).then(rs => {
                            if (rs.status == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.close();
                            }else{
                                this.$message.error('操作失败');
                                this.submitText="保存"
                            }
                        });
                    }

                });
            },
            getDriverModalList(){
                this.addForm.contractNo="";
                ajax.get('app/appDriverReimburse/contractList/'+this.addForm.vehicleId).then(res=>{
                    this.contractNoList=res.data;
                });
            },
            getcontractNoList(){
                var contractNoList=this.contractNoList;
                for(var b in contractNoList){
                    if(contractNoList[b].id==this.addForm.contractNo){
                        this.addForm.enterpriseId=contractNoList[b].name;
                        this.enterpriseName=contractNoList[b].remark;
                        return;
                    }
                }
            },
            checkOli() {
                var oilCostList=this.addForm.oilCostList;
                if(typeof(oilCostList)=='undefined' || oilCostList==null || oilCostList.length==0){
                    return true;
                }else{
                    for(var b in oilCostList){
                        if(!(oilCostList[b].oilTime && oilCostList[b].oilArea && oilCostList[b].capacityBefore && oilCostList[b].capacityAfter
                            && oilCostList[b].oilCapacity && oilCostList[b].oilUnitPrice && oilCostList[b].oilCost && oilCostList[b].invoiceImg && ((oilCostList[b].payType==1
                            && oilCostList[b].oilCar) || (oilCostList[b].payType==2)) ) ){
                            this.$message({message: '油费信息未正确填写或不完整完整！',type: 'error'});
                            return false;
                        }
                        if(parseFloat(oilCostList[b].capacityBefore)>=parseFloat(oilCostList[b].capacityAfter)){
                            this.$message({message: '加油后油量应大于加油前油量！',type: 'error'});
                            return false;
                        }
                    }
                }
                return true;
            },
            addOli(){
                if(this.checkOli()){
                    var b={
                        oilTime:"",
                        oilArea:"",
                        capacityBefore:"",
                        capacityAfter:"",
                        oilMileage:this.oilMileage,
                        oilCapacity:"",
                        oilUnitPrice:"",
                        oilCost:"",
                        payType:"",
                        oilReason:"",
                        oilCar:"",
                        invoiceImg:[],
                        invoiceNum:"",
                        remark:""
                    };
                    this.addForm.oilCostList.push(b);
                }
            },
            checkWash() {
                var washCarCostList=this.addForm.washCarCostList;
                if(typeof(washCarCostList)=='undefined' || washCarCostList==null || washCarCostList.length==0){
                    return true;
                }else{
                    for(var b in washCarCostList){
                        if(!(washCarCostList[b].washTime &&  washCarCostList[b].invoiceImg && washCarCostList[b].businessType
                            && washCarCostList[b].washCost)){
                            return false;
                        }
                    }
                }
                return true;
            },
            addWash(){
                if(this.checkWash()){
                    var b={
                        washTime:"",
                        washArea:"",
                        washShop:"",
                        washShopName:"",
                        businessType:"",
                        washCost:"",
                        invoiceImg:[],
                        remark:""
                    };
                    this.addForm.washCarCostList.push(b);
                }else{
                    this.$message({message: '请将洗车信息填写完整！',type: 'error'});
                }
            },
            delEnterpriseOli(row,index){
                this.addForm.oilCostList.splice(index, 1);
            },
            delEnterprisedWash(row,index){
                /*if (this.addForm.oilCostList.length == 1) {
                    this.$message.error('至少保留一条油费明细');
                    return;
                }*/
                this.addForm.washCarCostList.splice(index, 1);
            },supplierId(index){
                this.washIndex=index;
                this.supplierIdDialogShow = true;
                this.getListByUrl('base/supplier/list?supplierType=8');
            },
            //点击弹窗选择
            selectSupplierId(row){
                this.$set(this.addForm.washCarCostList[this.washIndex],"washShop",row.id);
                this.$set(this.addForm.washCarCostList[this.washIndex],"washShopName",row.name);
                this.supplierIdDialogShow = false;
            },
            openOilCard(index){
                if(this.addForm.vehicleId){
                    if(this.addForm.oilCostList[index].payType==1) {
                        var oilCost = this.addForm.oilCostList[index].oilCost;
                        if (oilCost != undefined && oilCost != '') {
                            this.oilIndex = index;
                            this.getListByUrl("core/coreVehicleFuelOilBill/queryOilCard?vehicleId=" + this.addForm.vehicleId + "&companyId="+this.companyId[0]);
                            this.dialogOilCard = true;
                        } else {
                            this.$message.error("请先填写加油总价!");
                        }
                    }else{
                        this.$message.error("支付类型不是油卡!");
                    }
                }else {
                    this.$message.error("请先选择车辆!");
                    return;
                }
            },
            changeOilCard(row) {
                if(row != null){
                    var oilCost=parseFloat(this.addForm.oilCostList[this.oilIndex].oilCost);
                    if(parseFloat(row.balance)-oilCost>0){
                        this.dialogOilCard = false;
                        this.$set(this.addForm.oilCostList[this.oilIndex],"oilCar",row.code);
                    }else{
                        this.$message.error("加油卡余额不足!");
                    }
                }
            },automaticCalculation(index){
                if(this.total_mileagefrom!=null && this.total_mileagefrom!="" && this.addForm.oilCostList[index].capacityBefore!="" && this.addForm.oilCostList[index].capacityAfter!=""){
                    this.addForm.oilCostList[index].oilCapacity=this.total_mileagefrom*(this.addForm.oilCostList[index].capacityAfter-this.addForm.oilCostList[index].capacityBefore);
                }
            },getPayType(index){//支付类型改变事件
                if(this.addForm.oilCostList[index].payType==1){
                    this.addForm.oilCostList[index].invoiceNum='';
                }else if(this.addForm.oilCostList[index].payType==2){
                    this.addForm.oilCostList[index].oilCar='';
                }
            },
            getVehicle(){
                if(this.companyId!=null && this.companyId!=undefined && this.companyId.length>0 && this.companyId[0] != ""){
                    this.listUrl = 'app/appDriverReimburse/vehicleList?companyId='+this.companyId[0];
                    this.resetList();
                    this.vehicleShow = true;
                }else{
                    this.$message.error("请选择所属组织");
                }

            },
            //获取车辆信息
            getVehicleModalList(){
                this.addForm.vehicleId="";
                this.addForm.plate="";
                this.total_mileagefrom="";
                this.oilMileage="";
                if (this.companyId.length > 0) {
                    this.$set(this.addForm,"serviceRegionId",this.companyId[0]);
                }else{
                    this.$set(this.addForm,"serviceRegionId","");
                }
            },
            selectVehicle(row){
                this.$set(this.addForm,"plate",row.name);
                this.$set(this.addForm,"vehicleId",row.id);
                this.$set(this.addForm,"providerCompanyId",row.providerCompanyId);
                this.total_mileagefrom=row.total_mileagefrom;
                this.oilMileage=row.remark;
                this.vehicleShow = false;
                this.getDriverModalList();
            },
            getDriver() {
                if(null != this.companyId && this.companyId!=undefined && this.companyId.length>0  && this.companyId[0] != ""){
                    this.listUrl = "app/appDriverReimburse/driverList?companyId=" + this.companyId[0];
                    this.resetList();
                    this.driverShow = true;
                }else{
                    this.$message.error("请选择所属组织");
                }
            },selectDriver(row) {
                this.$set(this.addForm, "driverName", row.name);
                this.$set(this.addForm, "driverId", row.id);
                this.driverShow = false;
            },
        }
    }
</script>

