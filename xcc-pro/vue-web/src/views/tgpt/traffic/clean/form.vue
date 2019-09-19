<template>
    <div class="form-panel">
        <el-form :model="cleanForm" :rules="rules" label-position="top" label-width="100px" ref="cleanForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="车辆清洁单" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyName">
                            <el-select v-model="cleanForm.companyId" @change="selectOrganization" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in currentUserInfo"
                                    :key="item.organizationId"
                                    :label="item.organizationName"
                                    :value="item.organizationId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车辆" prop="vehicleName">
                            <el-input readonly :disabled="organizationFlag" v-model="cleanForm.vehicleName" clearable><el-button @click.native = "vehicleId()" slot="append" icon="el-icon-search" :disabled="organizationFlag"></el-button></el-input>
                        </el-form-item>
                        <el-form-item label="车型名称" prop="">
                            <el-input readonly :disabled="organizationFlag" v-model="cleanForm.vehicleModel"></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶员" prop="driverName">
                            <el-input readonly :disabled="organizationFlag" v-model="cleanForm.driverName" clearable><!--<el-button @click.native = "driverId()" slot="append" icon="el-icon-search" :disabled="organizationFlag"></el-button>--></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号" prop="">
                            <el-input readonly :disabled="organizationFlag" v-model="cleanForm.projectContractName" clearable><el-button @click.native = "projectContractId()" slot="append" icon="el-icon-search" :disabled="organizationFlag"></el-button></el-input>
                        </el-form-item>
                        <!--<el-form-item label="每月结算单号" prop="">
                            <el-input :readonly = "true" v-model="cleanForm.projectVehicleSettlementName" clearable><el-button @click.native = "projectVehicleSettlementId()" slot="append" icon="el-icon-search"></el-button></el-input>
                        </el-form-item>-->
                        <el-form-item label="服务客户" prop="">
                            <el-input readonly :disabled="organizationFlag" v-model="cleanForm.serviceName"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="清洁方式" prop="cleanType">
                            <el-select v-model="cleanForm.cleanType" filterable placeholder="请选择" :change="cleanTypeChange()" :disabled="organizationFlag">
                                <el-option
                                    v-for="item in cleanTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>-->
                            <el-form-item label="洗车场" prop="supplierName">
                                <el-input readonly :disabled="organizationFlag" v-model="cleanForm.supplierName" clearable>
                                    <el-button @click.native = "supplierId()" slot="append" icon="el-icon-search" :disabled="organizationFlag"></el-button>
                                </el-input>
                            </el-form-item>
                        <el-form-item label="清洁时间" prop="cleanTime">
                            <el-date-picker v-model="cleanForm.cleanTime" type="date" placeholder="选择日期" :disabled="organizationFlag"></el-date-picker>
                        </el-form-item>
                            <el-form-item label="票据" prop="paper">
                                <el-select v-model="cleanForm.paper" placeholder="请选择" clearable :disabled="organizationFlag">
                                    <el-option label="洗车发票" value="1"></el-option>
                                    <el-option label="停车服务发票" value="2"></el-option>
                                    <el-option label="收据" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        <el-form-item label="地点" prop="">
                            <el-input v-model="cleanForm.place" clearable maxlength="100" :disabled="organizationFlag"></el-input>
                        </el-form-item>
                            <el-form-item label="业务类型" prop="businessType">
                                <el-select v-model="cleanForm.businessType" placeholder="请选择" clearable :disabled="organizationFlag">
                                    <el-option label="月收费" value="1"></el-option>
                                    <el-option label="次收费" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="费用" prop="cost">
                                <el-input v-model="cleanForm.cost" clearable maxlength="10" :disabled="organizationFlag"><template slot="append">￥</template></el-input>
                            </el-form-item>
                            <el-form-item label="加油票图片">
                                <upload-panel :size="1" :file-list.sync="iconPhoto" accept=".png,.jpg" :show-img="true" :disabled="organizationFlag"></upload-panel>
                            </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="录入信息" name="2" >
                    <div class="flex-panel">
                        <el-form-item label="录入人" prop="">
                            <el-input v-model="cleanForm.createrShow" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="录入时间" prop="">
                            <el-input v-model="cleanForm.createTimeShow" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="3" >
                    <div class="flex-panel">
                        <el-form-item label="备注" prop="" class = "big">
                            <el-input type="textarea" :rows="4" v-model="cleanForm.remark" maxlength="150" :disabled="organizationFlag"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('cleanForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
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
                    <el-table border :data="list" style="width: 100%" max-height="300" :row-class-name="classSupplierIdName">
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectSupplierId(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" sortable label="供应商名称">
                        </el-table-column>
                        <el-table-column prop="supplierType" sortable label="供应商类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.supplierType == 1">洗车场</span>
                                <span v-if="scope.row.supplierType == 2">4S店</span>
                                <span v-if="scope.row.supplierType == 3">租车公司</span>
                                <span v-if="scope.row.supplierType == 4">能源企业</span>
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

        <!-- 弹窗车辆  -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择所有车辆"
            :visible.sync="vehicleIdDialogShow"
            width="95%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box" :class="{'hide-search':!vehicleIdSearch}">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">经营城市</label>
                            <div class="input-group">
                                <el-input type="text" v-model="searchParam.runCityName" placeholder="请输入经营城市" autocomplete="off" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车辆状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.vehicleStatus" placeholder="不限">
                                    <el-option label="未投入运营" value="1"></el-option>
                                    <el-option label="待租" value="2"></el-option>
                                    <el-option label="已租" value="3"></el-option>
                                    <el-option label="保养" value="4"></el-option>
                                    <el-option label="维修" value="5"></el-option>
                                    <el-option label="退出运营" value="6"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">在库状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.stockStatus" placeholder="不限">
                                    <el-option label="在库" value="1"></el-option>
                                    <el-option label="出库" value="2"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <i class="el-icon-d-arrow-right" @click="vehicleIdSearch=!vehicleIdSearch"></i>
                        <el-button class="btn btn-primary defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300" :row-class-name="classVehicleIdName">
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicleId(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" sortable label="所在组织" min-width="150"></el-table-column>
                        <el-table-column prop="plate" sortable label="车牌" min-width="150"></el-table-column>
                        <el-table-column prop="modelName" sortable label="车型" min-width="300" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="colorName" sortable label="颜色" min-width="80"></el-table-column>
                        <el-table-column prop="registerCityName" sortable label="注册城市" min-width="150"></el-table-column>
                        <el-table-column prop="runCityName" sortable label="经营城市" min-width="100"></el-table-column>
                        <el-table-column prop="vehicleStatus" sortable label="车辆状态" min-width="100"></el-table-column>
                        <el-table-column prop="stockStatus" sortable label="在库状态" min-width="100"></el-table-column>
                        <el-table-column prop="registrationDate" sortable label="上牌日期" min-width="120"></el-table-column>
                        <el-table-column prop="assetsType" sortable label="资产属性" min-width="100"></el-table-column>
                        <el-table-column prop="plateType" sortable label="车牌属性" min-width="100"></el-table-column>
                        <el-table-column prop="useNature" sortable label="经营属性" min-width="100"></el-table-column>
                        <el-table-column prop="fuelType" sortable label="燃油类型" min-width="150"></el-table-column>
                        <el-table-column prop="fuelCapacity" sortable label="油箱容量" min-width="150"></el-table-column>

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

        <!-- 弹窗车辆  -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择司机"
            :visible.sync="driverIdDialogShow"
            width="95%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" placeholder="请输入司机姓名" clearable></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" placeholder="请输入手机号" clearable></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <city-select-panel :value.sync="searchParam.cityId" ref="citySelect" placeholder="请选择服务城市"></city-select-panel>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button class="btn btn-primary defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300" :row-class-name="classDriverIdName">
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectDirverId(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" sortable label="司机姓名" min-width="80"></el-table-column>
                        <el-table-column prop="phone" sortable label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="serviceCityId" sortable label="服务城市" show-overflow-tooltip min-width="100"></el-table-column>
                        <el-table-column prop="workStatus" sortable label="在职状态" min-width="100"></el-table-column>
                        <el-table-column prop="serviceStatus" sortable label="服务状态" min-width="100"></el-table-column>
                        <el-table-column prop="driveAge" sortable label="驾龄" min-width="80"></el-table-column>
                        <el-table-column prop="companyId" sortable label="所在组织" show-overflow-tooltip min-width="120"></el-table-column>
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

        <!-- 弹窗车辆  -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="合同-查找"
            :visible.sync="projectContractIdDialogShow"
            width="95%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.enterpriseName" placeholder="请输入服务客户" clearable></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button class="btn btn-primary defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectProjectContractId(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="contractNumber" label="合同编号" min-width="200"></el-table-column>
                        <el-table-column prop="projectName" label="项目评审" min-width="150"></el-table-column>
                        <el-table-column prop="enterpriseName" label="服务客户" min-width="150"></el-table-column>
                        <el-table-column prop="contractStartDate" label="合同开始日期" min-width="200"></el-table-column>
                        <el-table-column prop="contractEndDate" label="合同结束日期" min-width="200"></el-table-column>
                        <el-table-column prop="contractStatus" label="合同状态" min-width="150"></el-table-column>
                        <el-table-column prop="companyName" label="所属组织" min-width="120"></el-table-column>
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

        <!-- 弹窗车辆  -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="每月结算单号-查找"
            :visible.sync="projectVehicleSettlementIdDialogShow"
            width="95%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">项目订单号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.orderNumber" clearable autocomplete="off" placeholder="请输入项目订单号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.contractNumber" clearable autocomplete="off" placeholder="请输入合同编号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入服务客户"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">项目月结单编号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.projectVehicleSettlementNo" clearable autocomplete="off" placeholder="请输入用车单号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" clearable autocomplete="off" placeholder="请输入车牌"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button class="btn btn-primary defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectProjectVehicleSettlementId(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNumber" sortable label="项目订单号" min-width="200"></el-table-column>
                        <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
                        <el-table-column prop="enterpriseName" sortable label="企业客户名称" min-width="150"></el-table-column>
                        <el-table-column prop="projectVehicleSettlementNo" sortable label="项目月结单号" min-width="200"></el-table-column>
                        <el-table-column prop="startDate" sortable label="开始日期" min-width="120"></el-table-column>
                        <el-table-column prop="endDate" sortable label="结束日期" min-width="120"></el-table-column>
                        <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                        <el-table-column prop="vehicleModelInfoName" sortable label="车型名称" min-width="300"></el-table-column>
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
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        mixins: [ tool, ruleTool ],
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data: function () {
            let validCost = (rule, value,callback)=>{
                let ret = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                if (!ret.test(value)){
                    callback(new Error('请输入正确的费用'))
                }else {
                    callback()
                }
            };
            return {
                cleanForm : {
                    cleanType : 1,
                },
                activeNames: ['1','2','3'],
                show:false,
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                organizationFlag: true,
                iconPhoto:[],
                cleanTypeOptions : [{
                    value: 1,
                    label: '洗车场'
                }, {
                    value: 2,
                    label: '自行清洁'
                },],
                //清洁方式控制显示的imput
                supplierIdShow : true,
                paperShow : true,
                costShow : true,
                businessTypeShow : true,
                //洗车场弹窗
                supplierIdDialogShow : false,
                //车辆弹窗
                vehicleIdDialogShow : false,
                vehicleIdSearch : false,
                //司机弹窗
                driverIdDialogShow :false,
                //合同编号
                projectContractIdDialogShow : false,
                //每月结算单号
                projectVehicleSettlementIdDialogShow : false,
                rules: {
                    vehicleName: [
                        {required: true, message: '请选择车辆', trigger: 'change'},
                    ],
                    companyId: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ],
                    cleanTime: [
                        {required: true, message: '请选择清洁时间', trigger: 'change'}
                    ],
                    paper: [
                        {required: true, message: '请选择票据', trigger: 'change'}
                    ],
                    businessType: [
                        {required: true, message: '请选择业务类型', trigger: 'change'}
                    ],
                    cost: [
                        {required: true, message: '请输入费用', trigger: 'blur'},
                        {required: true, validator: validCost ,trigger: 'blur'}//这里需要用到全局变量
                    ],
                    // remark: [
                    //     {required: true, message: '请输入备注', trigger: 'blur'}
                    // ],
                },
            }
        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
            this.cleanTypeChange();
            this.getList();
            this.open();
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            getList(callback){
                const params = this.searchParam;
                if (this.listUrl === 'base/driver/list'){
                    if (this.searchParam.cityId && this.searchParam.cityId.length) {
                        params.serviceCityId = this.searchParam.cityId[1];
                    }
                }
                params.rows = this.pageSize;
                params.page = this.page;
                ajax.get(this.listUrl,params).then(res => {
                    this.list = res.rows;
                    this.listCount = res.records;
                    $.isFunction(callback) && callback(res);
                });
            },
            //洗车场 start
            //点击弹出洗车场弹窗
            supplierId(){
                this.supplierIdDialogShow = true;
                //window.setTimeout(setListWidth,1);
                this.getListByUrl('base/supplier/list');
            },
            classSupplierIdName(data){
                if(data.row.supplierType != 1){
                    return "hide";
                }
            },
            //点击弹窗选择
            selectSupplierId(row){
                this.$set(this.cleanForm,"supplierId",row.id);
                this.$set(this.cleanForm,"supplierName",row.companyName);
                this.supplierIdDialogShow = false;
            },
            //洗车场 end
            //车辆 start
            //点击弹出洗车场弹窗
            vehicleId(){
                if(this.cleanForm.companyId){
                    this.vehicleIdDialogShow = true;
                    this.getListByUrl('core/clean/vehiclelist?companyId='+this.cleanForm.companyId);
                }else{
                    this.$message.error("请先选择所在组织!");
                    return;
                }
            },
            classVehicleIdName(data){
                if(null == data.row.plate || '' == data.row.plate){
                    return "hide";
                }
            },
            //点击弹窗选择
            selectVehicleId(row){
                this.$set(this.cleanForm,"vehicleId",row.id);
                this.$set(this.cleanForm,"vehicleName",row.plate);
                this.$set(this.cleanForm,"vehicleModel",row.modelName);
                this.$set(this.cleanForm,"driverName",row.driverName);
               // this.$set(this.cleanForm,"companyId",row.companyId);
                //this.$set(this.cleanForm,"companyName",row.companyName);
                this.vehicleIdDialogShow = false;
            },
            //车辆 end
            //司机start
            driverId(){
                this.driverIdDialogShow = true;
                //window.setTimeout(setListWidth,1);
                this.getListByUrl('base/driver/list');
            },
            //点击弹窗选择
            selectDirverId(row){
                this.$set(this.cleanForm,"driverId",row.id);
                this.$set(this.cleanForm,"driverName",row.name);
                this.driverIdDialogShow = false;
            },
            classDriverIdName(data){
                // if(data.row.supplierType != 1){
                //     return "hide";
                // }
            },
            //司机end
            //合同 start
            projectContractId(){
                if(this.cleanForm.vehicleId){
                    this.projectContractIdDialogShow = true;
                    this.getListByUrl('core/coreProjectContract/queryList?vehicleId='+this.cleanForm.vehicleId);
                }else{
                    this.$message.error("请先选择车辆!");
                    return;
                }
            },
            selectProjectContractId(row){
                this.$set(this.cleanForm,"projectContractId",row.id);
                this.$set(this.cleanForm,"projectContractName",row.contractNumber);
                this.projectContractIdDialogShow = false;
            },
            //合同 end
            //每月结算单号 start
            projectVehicleSettlementId(){
                if(this.cleanForm.projectContractName){
                    this.projectVehicleSettlementIdDialogShow = true;
                    //window.setTimeout(setListWidth,1);
                    this.getListByUrl('core/settlement/list?contractNumber='+this.cleanForm.projectContractName);
                }else{
                    this.$alert('请选择合同编号', '提示', {
                        dangerouslyUseHTMLString: true
                    });
                }
            },
            selectProjectVehicleSettlementId(row){
                this.$set(this.cleanForm,"projectVehicleSettlementId",row.id);
                // this.$set(this.cleanForm,"orderNo",row.orderNumber);
                this.$set(this.cleanForm,"projectVehicleSettlementName",row.projectVehicleSettlementNo);
                this.$set(this.cleanForm,"serviceName",row.enterpriseName);
                this.projectVehicleSettlementIdDialogShow = false;
            },
            //每月结算单号 end
            //自定义方法
            open(){
                let $this = this;
                $this.activeNames = ['1','2','3'];
                if (this.$route.query.id) {
                    ajax.get('core/clean/detail?id=' + this.$route.query.id).then(
                        result => {
                            if(result.status == 0){
                                let user = this.getCurrentUserInfo();
                                $this.companyNameOptions = user.organizationList;
                                $this.companyNameOptions.organizationId = result.data.organizationId;
                                $this.cleanForm = result.data;
                            }
                        }
                    )
                }else{

                   /* $this.cleanForm = {cleanType : 1,};
                    if($this.$refs['cleanForm']){
                        $this.$refs['cleanForm'].resetFields();
                    }*/
                    $this.getCreaterInfo();
                }
                $this.show = true;
            },
            getCreaterInfo(){
                var $this=this;
                let user = this.getCurrentUserInfo();
                //录入人
                $this.cleanForm.creater = user.userId;
                $this.$set($this.cleanForm,"createrShow",user.name);
                //录入时间
                ajax.get('base/manhour/getTime').then(
                    result => {
                        if(result.status == 0){
                            $this.cleanForm.createTime = result.data.createTime;
                            $this.$set($this.cleanForm,"createTimeShow",result.data.createTimeShow);
                        }
                    }
                )
            },
            submitForm(cleanForm) {
                let $this = this;
                console.log($this.cleanForm);
                $this.$refs[cleanForm].validate((valid) => {
                    if (valid) {

                        if($this.iconPhoto != null && $this.iconPhoto.length > 0 && $this.iconPhoto[0] != null){
                            var object = {};
                            object['name'] = $this.iconPhoto[0].name;
                            object['path'] = $this.iconPhoto[0].path;
                            object['filedomain'] = $this.iconPhoto[0].filedomain;
                            $this.cleanForm.billPic = JSON.stringify(object);
                        }

                        ajax.post('core/clean/create', $this.cleanForm).then(
                            result => {
                                if(result.status == 0){
                                    $this.showMessage("保存成功","success",function(){
                                        $this.close();
                                        //$this.$emit("load");
                                    });
                                }
                            }
                        )
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cleanTypeChange(){
                let $this = this;
                if($this.cleanForm.cleanType == 1){
                    $this.supplierIdShow =  true;
                    $this.paperShow = true;
                    $this.costShow = true;
                    $this.businessTypeShow = true;
                }else{
                    $this.supplierIdShow = false;
                    $this.paperShow = false;
                    $this.costShow = false;
                    $this.businessTypeShow = false;
                    this.$set(this.cleanForm,"supplierId","");
                    this.$set(this.cleanForm,"supplierName","");
                    this.$set(this.cleanForm,"paper","");
                    this.$set(this.cleanForm,"cost","");
                    this.$set(this.cleanForm,"businessType","");
                }
            },
            selectOrganization(data){
                if(data){
                    this.organizationFlag= false;
                    this.cleanForm={companyId:data};
                    this.getCreaterInfo();
                }else{
                    this.organizationFlag= true;
                    this.cleanForm={};
                }
            }
        }
    }
</script>

