<template>
    <div class="form-panel">
        <el-form :model="maintenanceBillForm" :rules="rules" label-position="top" ref="maintenanceBillForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基础资料" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="服务组织" prop="companyId">
                            <tree-select v-model="maintenanceBillForm.companyId" placeholder="请选择服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeArrayItem"></tree-select>
                        </el-form-item>
                        <el-form-item label="车辆" prop="vehiclePlate">
                            <el-input :readonly = "true" :disabled="!maintenanceBillForm.companyId" v-model="maintenanceBillForm.vehiclePlate" clearable @focus="getVehicle()" placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车型" prop="vehicleModel">
                            <el-input v-model="maintenanceBillForm.vehicleModel" :disabled="true"></el-input>
                        </el-form-item>
                       <!-- <el-form-item label="车辆所在城市" prop="runCity">
                            <el-input v-model="maintenanceBillForm.runCity" :disabled="true"></el-input>
                        </el-form-item>-->
                        <el-form-item label="维保类型" prop="type">
                            <el-select v-model="maintenanceBillForm.type" @change="changeMaintenceType" placeholder="请选择维保类型">
                                <el-option label="事故维修" :value="1"></el-option>
                                <el-option label="常规保养" :value="2"></el-option>
                                <el-option label="故障维修" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事故单号" v-if="maintenanceBillForm.type=='1'" prop="accidentCode">
                            <el-input :readonly = "true"  :disabled="!maintenanceBillForm.companyId" v-model="maintenanceBillForm.accidentCode" clearable @focus="getAccidentBill()" placeholder="请选择事故单">
                                <el-button @click="getAccidentBill()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="保养参考公里数（km）" v-if="maintenanceBillForm.type=='2'" prop="mileage">
                            <el-input v-model="maintenanceBillForm.mileage"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="送修信息" name="2" >
                    <div class="flex-panel">
                        <el-form-item label="维修厂" prop="repairerName">
                            <el-input :readonly = "true" :disabled="!maintenanceBillForm.companyId" v-model="maintenanceBillForm.repairerName" clearable @focus="getRepairer()" placeholder="请选择维修厂">
                                <el-button @click.native = "getRepairer()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="送修时间" prop="arriveRepairTime" :rules="rules.required('请选择送修时间')">
                            <el-date-picker v-model="maintenanceBillForm.arriveRepairTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择送修时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="送修公里数" prop="repairMileage" >
                            <el-input v-model="maintenanceBillForm.repairMileage" maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="送车人" prop="sendCarPeople">
                            <el-input v-model="maintenanceBillForm.sendCarPeople" maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="送车用时" prop="sendCarHours">
                            <el-input v-model="maintenanceBillForm.sendCarHours"  maxlength="5">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="是否4S店司机" prop="is4sShopsDriver">
                            <template>
                                <el-radio-group v-model="maintenanceBillForm.is4sShopsDriver">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                </el-radio-group>
                            </template>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="报价信息" name="3" >
                    <div class="flex-panel">
                        <el-form-item label="报价总额（元）" prop="totalPrice">
                            <el-input :value="getTotalAmount()" v-model="maintenanceBillForm.totalPrice" clearable :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="费用类型" prop="costType">
                            <el-select v-model="maintenanceBillForm.costType"  placeholder="请选择费用类型">
                                <el-option label="公司费用" :value="1"></el-option>
                                <el-option label="代垫费用" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日期" prop="settlementDate" :rules="rules.required('请选择结算日期')">
                            <el-date-picker v-model="maintenanceBillForm.settlementDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结算日期"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="经手人" prop="brokerage">
                            <el-input v-model="maintenanceBillForm.brokerage" maxlength="10" clearable placeholder="请输入经手人"></el-input>
                        </el-form-item>

                        <el-form-item label="核价说明" prop="nuclearPriceRemark" class="big">
                            <el-input type="textarea" v-model="maintenanceBillForm.nuclearPriceRemark" maxlength="200" placeholder="请输入核价说明" ></el-input>
                        </el-form-item>
                        <el-form-item label="诊断维修项目及报价描述" prop="nuclearPriceDescription" class="big">
                            <el-input type="textarea" v-model="maintenanceBillForm.nuclearPriceDescription" maxlength="200" placeholder="请输入诊断维修项目及报价描述"></el-input>
                        </el-form-item>
                        <el-form-item class="big" label="上传报价单">
                            <upload-panel :size="5" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="pics"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="配件明细" name="4">
                    <el-button class="float-btn" type="primary" @click="addRowAccessories()">新增</el-button>
                    <el-table class="left" :data="maintenanceBillForm.accessoriesList" border style="width: 100%;margin-top: 10px">
                        <el-table-column fixed label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button @click="deleteRowAccessories(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="其它" min-width="60">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.accessoriesIs" @change="getAccessoriesIs(scope.$index)"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column label="配件编号" min-width="150">
                            <template slot-scope="scope" >
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.code'"
                                    :rules="[
                                           { required: false, message: '请(选择/填写)配件项目', trigger: 'change' }
                                        ]">
                                    <el-input v-model="scope.row.code" maxlength="50" size="small" @click.native="getAccessories(scope.$index)" ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="配件项目名称" min-width="180" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.name'"
                                    :rules="[{ required: true, message: '请填写配件名称', trigger: 'change' }]">
                                   <el-input v-model="scope.row.name" maxlength="50" :disabled="!scope.row.accessoriesIs"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="型号" min-width="180" >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.model" maxlength="36" :disabled="!scope.row.accessoriesIs"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="品牌" min-width="180">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.brand" maxlength="36" :disabled="!scope.row.accessoriesIs"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="项目分类" min-width="150" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.type'"
                                    :rules="[{ required: true, message: '请选择项目分类', trigger: 'change' }]">
                                <el-select v-model="scope.row.type" filterable clearable :disabled="!scope.row.accessoriesIs" placeholder="请选择">
                                    <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                               :value="e.value"></el-option>
                                </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格（元）" min-width="140" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.price'"
                                    :rules="[
                                           { required: true, message: '请输入价格', trigger: 'change' },
                                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                                        ]">
                                    <el-input v-model="scope.row.price" @change="getAccessoriesTotal(scope.$index)" type="number" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="参考价格（元）" min-width="140">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.referencePrice'"
                                    :rules="[
                                           { required: false, message: '请输入价格', trigger: 'change' },
                                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'change'}
                                        ]">
                                    <el-input  @change="getAccessoriesTotal(scope.$index)" type="number" v-model="scope.row.referencePrice" :disabled="!scope.row.accessoriesIs"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" min-width="140" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'accessoriesList.'+scope.$index+'.amount'"
                                    :rules="[
                                           { required: true, message: '请输入数量', trigger: 'change' },
                                            {validator: formRule.numberSize, size:[1,5] , message: '请最多输入5位数字', trigger: 'change'}
                                        ]">
                                    <el-input v-model="scope.row.amount" type="number" clearable></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column label="小计（元）" min-width="140">
                            <template slot-scope="scope">{{getAccessoriesAmount(scope.row)}}</template>
                        </el-table-column>
                        <el-table-column label="溢价百分比（%）" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.premiumPercentage" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item title="工时明细" name="5">
                    <el-button class="float-btn" type="primary" @click="addRowManhour()">新增</el-button>
                    <el-table class="left" :data="maintenanceBillForm.manhourList" border style="width: 100%;margin-top: 10px">
                        <el-table-column fixed label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button @click="deleteRowManhour(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="其它" min-width="60">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.manhourIs" @change="getManhourIs(scope.$index)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="工时编号" min-width="150">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.code'"
                                    :rules="[
                                           { required: false, message: '请(选择/填写)工时项目', trigger: 'change' }
                                        ]">
                                    <el-input v-model="scope.row.code" maxlength="50" size="small" @click.native="getManhour(scope.$index)" ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="工时项目名称" min-width="180">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.name'"
                                    :rules="[{ required: true, message: '请输入工时名称', trigger: 'change' }]">
                                   <el-input v-model="scope.row.name" maxlength="50" :disabled="!scope.row.manhourIs" ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="项目分类" min-width="150">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.type'"
                                    :rules="[{ required: true, message: '请选择项目分类', trigger: 'change' }]">
                                    <el-select v-model="scope.row.type" filterable clearable placeholder="请选择" :disabled="!scope.row.manhourIs">
                                        <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                                   :value="e.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格（元）" min-width="140" label-class-name="required">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.price'"
                                    :rules="[
                                           { required: true, message: '请输入价格', trigger: 'blur' },
                                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                                        ]">
                                    <el-input v-model="scope.row.price" @change="getManhourTotal(scope.$index)" type="number" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="参考价格（元）" min-width="140">
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'manhourList.'+scope.$index+'.referencePrice'"
                                    :rules="[
                                           { required: false, message: '请输入价格', trigger: 'blur' },
                                           {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                                        ]">
                                <el-input @change="getManhourTotal(scope.$index)" v-model="scope.row.referencePrice" :disabled="!scope.row.manhourIs"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="溢价百分比（%）" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.premiumPercentage" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item title="提车信息" name="6" >
                    <div class="flex-panel">
                        <el-form-item label="提车时间" prop="fetchCarTime">
                            <el-date-picker v-model="maintenanceBillForm.fetchCarTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择提车时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="提车人" prop="name">
                            <el-input v-model="maintenanceBillForm.fetchCarPeople"></el-input>
                           <!-- <el-select v-model="maintenanceBillForm.fetchCarPeople" placeholder="请选择提车人" clearable filterable remote :remote-method="selectFetchCarPeople" @click.native="selectFetchCarPeople()">
                                <el-option v-for="item in people" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>-->
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div  class="left-row">
                <el-button type="primary" @click="submitForm('maintenanceBillForm')">保存</el-button>
                <el-button @click="close('maintenanceBillForm')">返回</el-button>
            </div>
        </el-form>


        <!-- 绑定车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="1000px"
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
                        <div class="form-group">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vin" label="车架号" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="colorName" sortable label="颜色" min-width="80"></el-table-column>
                        <el-table-column prop="licenseName" sortable label="行驶证车主" min-width="140"></el-table-column>
                        <el-table-column prop="vehicleStatusText" sortable label="车辆状态" min-width="100"></el-table-column>
                        <el-table-column prop="plateType" sortable label="车辆来源" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.plateType == 1">自建</span>
                                <span v-if="scope.row.plateType == 2">外部</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serviceRegion" sortable label="服务组织" min-width="140" show-overflow-tooltip></el-table-column>
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

        <!-- 弹窗维修厂  -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="维修厂-查找"
            :visible.sync="repairerShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">维修厂名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable placeholder="请输入维修厂名称"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">城市</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.cityName" clearable placeholder="请输入城市"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">联系人</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.contacts" clearable placeholder="请输入联系人"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">联系人手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.contactsPhone" maxlength="11" clearable placeholder="请输入联系人手机号"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange();">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectRepairer(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" sortable label="维修厂名称" width="180" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="qualificationName" sortable label="资质" width="140">
                        </el-table-column>
                        <el-table-column  prop="contacts" sortable label="联系人" width="140">
                        </el-table-column>
                        <el-table-column  prop="contactsPhone" sortable label="联系人手机号" width="140">
                        </el-table-column>
                        <el-table-column  prop="cityName" sortable label="城市" width="120">
                        </el-table-column>
                        <el-table-column  prop="state" sortable label="维修厂状态" width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.state == 0">停用</span>
                                <span v-if="scope.row.state == 1">启用</span>
                            </template>
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

        <!-- 事故单弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择事故单"
            :visible.sync="accidentBillShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">事故单号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.code" placeholder="请输入事故单号" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectAccidentBill(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="事故单号" min-width="200"></el-table-column>
                        <el-table-column prop="companyName" label="服务组织" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="vehiclePlate" sortable label="事故车辆" min-width="140"></el-table-column>
                        <el-table-column prop="accidentTime" sortable label="事故发生时间" min-width="150"></el-table-column>
                        <el-table-column prop="accidentCause" sortable label="事故起因" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="accidentPlace" sortable label="事故地点" min-width="140" show-overflow-tooltip></el-table-column>
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

        <!-- 配件项目弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择配件项目"
            :visible.sync="accessoriesShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box" :class="{'hide-search':!showSearch}">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">编号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.code" autocomplete="off" type="text" placeholder="请输入编号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">配件名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" autocomplete="off" type="text" placeholder="请输入配件名称"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">型号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.model" autocomplete="off" type="text" placeholder="请输入型号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">品牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.brand" autocomplete="off" type="text" placeholder="请输入品牌"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">项目分类</label>
                                <el-select v-model="searchParam.type" filterable clearable placeholder="请选择">
                                    <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                               :value="e.value"></el-option>
                                </el-select>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectAccessories(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="编号" width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="配件名称" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="model" label="型号" width="140"></el-table-column>
                        <el-table-column prop="brand" label="品牌" width="140"></el-table-column>
                        <el-table-column prop="measureUnit" label="计量单位" width="140"></el-table-column>
                        <el-table-column prop="typeName" label="项目分类" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="advice" label="参考说明" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="referencePrice" label="参考价格" width="140"></el-table-column>
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

        <!-- 工时项目弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择工时项目"
            :visible.sync="manhourShow"
            width="1000px"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box ">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">编号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.code" autocomplete="off" type="text" placeholder="请输入编号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" autocomplete="off" type="text" placeholder="请输入工时项目名称"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">项目分类</label>
                                <el-select v-model="searchParam.type" filterable clearable placeholder="请选择">
                                    <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                               :value="e.value"></el-option>
                                </el-select>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" min-width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectManhour(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="编号" min-width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" sortable label="工时项目名称" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="typeName" sortable label="项目分类" min-width="140"></el-table-column>
                        <el-table-column prop="referencPrice" sortable label="参考价格" min-width="100"></el-table-column>
                        <el-table-column prop="advice" sortable label="参考说明" min-width="140" show-overflow-tooltip></el-table-column>
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
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        mixins: [ tool, ruleTool,formRule ],
        components: { TreeSelect ,UploadPanel},
        name:"maintenanceBillForm",
        data(){
            return {
                maintenanceBillForm:{
                    accessoriesList:[],
                    manhourList:[],
                },
                nuclearPricePhoto:[],
                openCollapse:["1","2","3","4","5","6"],
                show:false,
                vehicleShow:false,
                repairerShow : false,
                accidentBillShow: false,
                accessoriesShow:false,
                manhourShow:false,
                showSearch : false,
                clickTableIndex: 0,
                clickTable1Index: 0,
                formRule,
                pics: [],
                typeOptions : [],
                rules:{
                    companyId: [
                        { required: true, message: "请选择服务组织", trigger: 'change' },
                    ],
                    sendCarHours: [
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'blur' },
                    ],
                    vehiclePlate: [
                        { required: true, message: "请选择车辆", trigger: 'change' },
                    ],
                    accidentCode: [
                        { required: true, message: "请选择事故单", trigger: 'change' },
                    ],
                    mileage: [
                        { required: true, message: "请输入保养参考公里数", trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: "请选择维保类型", trigger: 'change' },
                    ]
                }
            }
        },
        mounted(){
            this.open();
        },
        methods:{
            open(){
                this.getSelectType();
                this.openCollapse = ["1","2","3","4","5","6"];
                let id = this.$route.query.id;
                if(id) {
                    this.initData(id);
                } else{
                    this.maintenanceBillForm.is4sShopsDriver = true;
                }
                this.maintenanceBillForm = Object.assign({},this.maintenanceBillForm);
                this.show = true;
            },
            initData(id){
                ajax.get('/core/maintenanceBill/detail/' + id).then(result => {
                    if(result.status == 0){
                        this.maintenanceBillForm = result.data;
                        this.maintenanceBillForm.companyId = [this.maintenanceBillForm.companyId];
                        if(null != result.data.accessoriesList && result.data.accessoriesList.length > 0){
                            for(var i = 0 ; i < result.data.accessoriesList.length ; i++) {
                                result.data.accessoriesList[i].totalPrice = parseFloat(result.data.accessoriesList[i].price)
                                    *parseFloat(result.data.accessoriesList[i].amount);
                            }
                        }
                        this.maintenanceBillForm.accessoriesList = result.data.accessoriesList;
                        this.maintenanceBillForm.manhourList = result.data.manhourList;
                        if(null != result.data.nuclearPricePic && result.data.nuclearPricePic.length > 0){
                            this.pics = JSON.parse(result.data.nuclearPricePic);
                        }
                    }

                });
            },
            //所属组织树组织选择
            changeArrayItem(data) {
                if (!data || data.length == 0){
                    this.$set(this.maintenanceBillForm,"companyId","");
                    this.$set(this.maintenanceBillForm,"vehiclePlate","");
                    this.$set(this.maintenanceBillForm,"vehicleId","");
                    this.$set(this.maintenanceBillForm,"vehicleModel","");
                    this.$set(this.maintenanceBillForm,"runCity","");
                    this.$set(this.maintenanceBillForm,"accidentCode","");
                    this.$set(this.maintenanceBillForm,"accidentId","");
                    this.$set(this.maintenanceBillForm,"repairerId","");
                    this.$set(this.maintenanceBillForm,"repairerName","");
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            getVehicle(){
                this.listUrl = "core/maintenanceBill/vehicleList?companyId="+this.maintenanceBillForm.companyId;
                this.resetList();
                this.vehicleShow = true;
            },
            selectVehicle(row){
                this.$set(this.maintenanceBillForm,"vehiclePlate",row.plate);
                this.$set(this.maintenanceBillForm,"vehicleId",row.id);
                this.$set(this.maintenanceBillForm,"vehicleModel",row.modelName);
                this.$set(this.maintenanceBillForm,"runCity",row.runCityName);
                this.$set(this.maintenanceBillForm,"companyName",row.serviceRegion);
                /*this.$set(this.maintenanceBillForm,"serviceRegionId",row.companyId);*/
                this.$set(this.maintenanceBillForm,"providerCompanyId",row.companyId);
                // this.$set(this.maintenanceBillForm,"companyId",row.companyId);
                this.maintenanceBillForm=Object.assign({},this.maintenanceBillForm);
                this.vehicleShow = false;
            },
            getAccidentBill(){
                if(this.maintenanceBillForm.vehiclePlate == null || this.maintenanceBillForm.vehiclePlate == ""){
                    this.$message.error("请选择车辆");
                }else{
                    this.listUrl = "core/maintenanceBill/accidentBill/list?vehiclePlate="+this.maintenanceBillForm.vehiclePlate;
                    this.resetList();
                    this.accidentBillShow = true;
                }
            },
            selectAccidentBill(row){
                this.$set(this.maintenanceBillForm,"accidentCode",row.code);
                this.$set(this.maintenanceBillForm,"accidentId",row.id);
                this.maintenanceBillForm=Object.assign({},this.maintenanceBillForm);
                this.accidentBillShow = false;
            },
            changeMaintenceType(e){
                /*accidentCode: [
                        { required: true, message: "请选择车辆事故单", trigger: 'change' },
                    ],*/
                /*mileage: [
                    { required: true, message: "请输入保养参考公里数", trigger: 'blur' },
                ],*/
              /*  let accidentCode='accidentCode';
                let accidentRule=[
                    { required: true, message: "请选择车辆事故单", trigger: 'change' },
                ];
                let mileage='mileage';
                let mileageRule=[
                    { required: true, message: "请输入保养参考公里数", trigger: 'blur' },
                ];*/

                if(e=='1'){
                    this.$set(this.maintenanceBillForm,'mileage','');
                 //   this.$set(this.rules,'accidentCode',accidentRule);
                 //   delete this.rules.mileage;
                }else if(e=='2'){
                    this.$set(this.maintenanceBillForm,'accidentCode','');
                    this.$set(this.maintenanceBillForm,'accidentId','');
                 //   this.$set(this.rules,'mileage',mileageRule);
                 //   delete this.rules.accidentCode;
                }else if(e=='3'){
                    this.$set(this.maintenanceBillForm,'accidentCode','');
                    this.$set(this.maintenanceBillForm,'accidentId','');
                    this.$set(this.maintenanceBillForm,'mileage','');
                //    delete this.rules.mileage;
                //    delete this.rules.accidentCode;
                }
            },
            getRepairer(){
                if(this.maintenanceBillForm.companyId == null || this.maintenanceBillForm.companyId == ""){
                    this.$message.error("请先选择服务组织");
                }else{
                    this.listUrl = "core/maintenanceBill/repairerList?companyId="+this.maintenanceBillForm.companyId;
                    this.resetList();
                    this.repairerShow = true;
                }
            },
            selectRepairer(row){
                this.$set(this.maintenanceBillForm,"repairerId",row.id);
                this.$set(this.maintenanceBillForm,"repairerName",row.name);
                this.maintenanceBillForm=Object.assign({},this.maintenanceBillForm);
                this.repairerShow = false;
            },
            getTotalAmount(){
                let sum = 0;
                let data1 = this.maintenanceBillForm.accessoriesList;
                let data2 = this.maintenanceBillForm.manhourList;
                if(data1 && data1.length) {
                    data1.forEach( item =>{
                        sum+=Number(this.getAccessoriesAmount(item));
                    });
                }
                if(data2 && data2.length) {
                    data2.forEach( item =>{
                        sum+=Number(this.getManhourAmount(item));
                    });
                }
                this.maintenanceBillForm.totalPrice = sum;
                console.log(sum);
                return sum;
            },
            getAccessoriesAmount(row){
                if (row.price && !isNaN(row.price) && row.amount && !isNaN(row.amount)) {
                    let amount = (row.price * row.amount).toFixed(2);
                    return amount;
                } else {
                    return 0;
                }
            },
            getAccessoriesTotal(index){
                this.maintenanceBillForm.accessoriesList[index].totalPrice = parseFloat(0);
                if(null != this.maintenanceBillForm.accessoriesList[index].price && this.maintenanceBillForm.accessoriesList[index].price != ""){
                    //溢价百分比=((价格-参考价格)/ 参考价格)* 100%
                    if(null != this.maintenanceBillForm.accessoriesList[index].referencePrice && this.maintenanceBillForm.accessoriesList[index].referencePrice != ""
                        && this.maintenanceBillForm.accessoriesList[index].referencePrice != 0){
                        this.maintenanceBillForm.accessoriesList[index].premiumPercentage =this.toDecimal(((this.maintenanceBillForm.accessoriesList[index].price-this.maintenanceBillForm.accessoriesList[index].referencePrice)
                            /parseFloat(this.maintenanceBillForm.accessoriesList[index].referencePrice))*parseFloat(100));
                        this.maintenanceBillForm.accessoriesList[index].premiumPercentage = this.maintenanceBillForm.accessoriesList[index].premiumPercentage + "%";
                    }
                }
            },
            getManhourAmount(row){
                console.log(row);
                return row.price;
            },
            getManhourTotal(index){
                this.maintenanceBillForm.manhourList[index].totalPrice = parseFloat(0);
                //溢价百分比=((价格-参考价格)/ 参考价格)* 100%
                if(null != this.maintenanceBillForm.manhourList[index].referencePrice && this.maintenanceBillForm.manhourList[index].referencePrice != ""
                    && this.maintenanceBillForm.manhourList[index].referencePrice != 0){
                    this.maintenanceBillForm.manhourList[index].premiumPercentage =this.toDecimal(((this.maintenanceBillForm.manhourList[index].price-this.maintenanceBillForm.manhourList[index].referencePrice)
                        /parseFloat(this.maintenanceBillForm.manhourList[index].referencePrice))*parseFloat(100));
                    this.maintenanceBillForm.manhourList[index].premiumPercentage = this.maintenanceBillForm.manhourList[index].premiumPercentage + "%";
                }
            },
            toDecimal(x) { //除法四舍五入保留两位小数
                var f = parseFloat(x);
                if (isNaN(f)) {
                    return;
                }
                f = Math.round(x*100)/100;
                return f;
            },
            addRowAccessories(){
                this.maintenanceBillForm.accessoriesList.push({
                    name:"",
                    cityName:"",
                    repairerName:"",
                    code:"",
                    type:"",
                    natureType:"",
                    price:"",
                    amount:"",
                    totalPrice:"",
                    referencePrice:"",
                    premiumPercentage:"",
                    accessoriesIs:false,
                    brand:"",
                    model:""
                });
            },
            deleteRowAccessories(row) {
                var index = this.maintenanceBillForm.accessoriesList.indexOf(row)
                if (index !== -1) {
                    this.maintenanceBillForm.accessoriesList.splice(index, 1);
                }
            },
            addRowManhour(){
                this.maintenanceBillForm.manhourList.push({
                    name:"",
                    cityName:"",
                    repairerName:"",
                    code:"",
                    type:"",
                    natureType:"",
                    price:"",
                    referencePrice:"",
                    premiumPercentage:"",
                    manhourIs:false
                });
            },
            deleteRowManhour(row) {
                var index = this.maintenanceBillForm.manhourList.indexOf(row)
                if (index !== -1) {
                    this.maintenanceBillForm.manhourList.splice(index, 1);
                }
            },
            getAccessories(i){
                if(!this.maintenanceBillForm.accessoriesList[i].accessoriesIs){
                    if(this.maintenanceBillForm.companyId == null || this.maintenanceBillForm.companyId == ""){
                        this.$message.error("请先选服务属组织");
                    }else{
                        this.clickTableIndex = i;
                        this.listUrl = "core/maintenanceBill/accessoriesList?companyId="+this.maintenanceBillForm.companyId;
                        this.resetList();
                        this.accessoriesShow = true;
                    }
                }

            },
            getAccessoriesIs(i){
                if (!this.maintenanceBillForm.accessoriesList[i].accessoriesIs) {
                    this.maintenanceBillForm.accessoriesList[i].accessoriesId = '';
                    this.maintenanceBillForm.accessoriesList[i].code = '';
                    this.maintenanceBillForm.accessoriesList[i].name = '';
                    this.maintenanceBillForm.accessoriesList[i].cityName = '';
                    this.maintenanceBillForm.accessoriesList[i].repairerName = '';
                    this.maintenanceBillForm.accessoriesList[i].type = '';
                    this.maintenanceBillForm.accessoriesList[i].model = '';
                    this.maintenanceBillForm.accessoriesList[i].brand = '';
                    this.maintenanceBillForm.accessoriesList[i].referencePrice = '';
                }else{
                    this.maintenanceBillForm.accessoriesList[i].accessoriesId = '';
                    this.maintenanceBillForm.accessoriesList[i].code = '';
                    this.maintenanceBillForm.accessoriesList[i].referencePrice = '';
                }
            },
            selectAccessories(row){ //选择配件项目
                console.log(this.clickTableIndex)
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].accessoriesId = row.id;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].name = row.name;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].cityName = row.cityName;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].repairerName = row.repairerName;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].code = row.code;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].type = row.type;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].model = row.model;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].brand = row.brand;
                this.maintenanceBillForm.accessoriesList[this.clickTableIndex].referencePrice = row.referencePrice;
                this.accessoriesShow = false;
                //计算溢价百分比
                this.getAccessoriesTotal(this.clickTableIndex);
            },
            getManhourIs(i){
                if(!this.maintenanceBillForm.manhourList[i].manhourIs){
                    this.maintenanceBillForm.manhourList[i].manhourId = '';
                    this.maintenanceBillForm.manhourList[i].code = '';
                    this.maintenanceBillForm.manhourList[i].name = '';
                    this.maintenanceBillForm.manhourList[i].type = '';
                    this.maintenanceBillForm.manhourList[i].referencePrice = '';
                }else {
                    this.maintenanceBillForm.manhourList[i].manhourId = '';
                    this.maintenanceBillForm.manhourList[i].code = '';
                    this.maintenanceBillForm.manhourList[i].referencePrice = '';
                }
            },
            getManhour(i){
                if(!this.maintenanceBillForm.manhourList[i].manhourIs){
                    if(this.maintenanceBillForm.companyId == null || this.maintenanceBillForm.companyId == ""){
                        this.$message.error("请先选服务属组织");
                    }else{
                        this.clickTable1Index = i;
                        this.listUrl = "core/maintenanceBill/manhourList?companyId="+this.maintenanceBillForm.companyId;
                        this.resetList();
                        this.manhourShow = true;
                    }
                }
            },
            selectManhour(row){
                console.log(this.clickTable1Index)
                this.maintenanceBillForm.manhourList[this.clickTable1Index].manhourId = row.id;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].name = row.name;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].code = row.code;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].type = row.type;
                this.maintenanceBillForm.manhourList[this.clickTable1Index].referencePrice = row.referencPrice;
                this.manhourShow = false;
                //计算溢价百分比
                this.getManhourTotal(this.clickTable1Index);
            },
            submitForm(maintenanceBillForm) {
                if (this.pics.length > 0){//转换图片
                    this.maintenanceBillForm.nuclearPricePic = JSON.stringify(this.pics);
                }
                let data = this.extend(true,{},this.maintenanceBillForm);
                data.companyId = data.companyId.join();
                /*if(data.type == "1"){
                    //维保类型为“事故维修”时事故单号为必填
                    if(null == this.maintenanceBillForm.accidentCode || this.maintenanceBillForm.accidentCode == ""){
                        this.$message.error("请选择事故单");
                        return;
                    }
                }*/
                this.$refs[maintenanceBillForm].validate((valid) => {

                    if (valid) {
                        let url = "";
                        if(this.maintenanceBillForm.id != null && this.maintenanceBillForm.id != ""){
                            url = "core/maintenanceBill/edit";
                        }else{
                            url = "core/maintenanceBill/add";
                        }
                        ajax.post(url, data) .then(res => {
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close();
                            }else {
                                this.$message.error(res.message);
                            }
                        });
                    }else{
                        this.$message.error("请检查必填项");
                    }
                });
            },
        //项目分类 下拉
        getSelectType(){
            ajax.get('admin/dict/type/维保项目分类').then(rs => {
                if (rs.length > 0) {
                    this.typeOptions = rs;
                }else{
                    this.typeOptions = [];
                }
            });
        },
        },
    }
</script>

