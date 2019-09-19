<template>
    <div class="detail-panel">
        <el-form :model="addForm" label-position="top" :rules="rules" ref="dataForm" label-width="100px">
            <el-collapse v-model="openCollapse" @change="handleChange">
                <!--车辆采购信息-->
                <el-collapse-item title="车辆采购信息" name="1">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{detailForm.originateName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">采购过程编号</label>
                            <div class="input-group">
                                <span>{{detailForm.purchaseProcessNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">状态</label>
                            <div v-if="detailForm.purchaseMethod==1" class="input-group">
                                <span v-if="detailForm.state==1">待提车</span>
                                <span v-if="detailForm.state==2">待上牌</span>
                                <span v-if="detailForm.state==3">完成</span>
                            </div>

                            <div v-if="detailForm.purchaseMethod==2 || detailForm.purchaseMethod==3"
                                 class="input-group">
                                <span v-if="detailForm.state==1">待派车</span>
                                <span v-if="detailForm.state==3">完成</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">采购订单编号</label>
                            <div class="input-group">
                                <span>{{detailForm.orderNumber}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <span>{{detailForm.contractNo}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <span>{{detailForm.enterpriseName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <span>{{detailForm.vehicleModelInfoName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">颜色</label>
                            <div class="input-group">
                                <span>{{detailForm.colorName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">购车价格（元）</label>
                            <div class="input-group">
                                <span>{{detailForm.tradeAmount}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">计划到车日期</label>
                            <div class="input-group">
                                <span>{{detailForm.deliveryDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">车辆新旧</label>
                            <div class="input-group">
                                <span v-if="detailForm.newOrOldCar==0">旧</span>
                                <span v-if="detailForm.newOrOldCar==1">新</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">车龄（月）</label>
                            <div class="input-group">
                                <span>{{detailForm.carAge}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <span>{{detailForm.serviceCityName}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">采购方式</label>
                            <div class="input-group">
                                <span v-if="detailForm.purchaseMethod==1">新购</span>
                                <span v-if="detailForm.purchaseMethod==2">租赁</span>
                                <span v-if="detailForm.purchaseMethod==3">现有车辆安排</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">加装需求</label>
                            <div class="input-group">
                                <span>{{detailForm.retrofitRequirementOptionsLabel}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">采购说明</label>
                            <div class="input-group">
                                <span>{{detailForm.explanation}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">其他加装需求</label>
                            <div class="input-group">
                                <span>{{detailForm.retrofitRequirement}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">申请采购人</label>
                            <div class="input-group">
                                <span>{{detailForm.reqPurchaser}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">申请时间</label>
                            <div class="input-group">
                                <span>{{detailForm.reqDate}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>


                <el-collapse-item title="提车" name="1" v-if="purchaseForm.type == 2 || purchaseForm.type == 3">
                    <div class="form-panel" style="min-height: auto;">
                        <div class="flex-panel">
                            <el-form-item label="车型">
                                <el-input v-model="detailForm.vehicleModelInfoName" disabled></el-input>
                            </el-form-item>

                            <el-form-item label="颜色">
                                <el-select v-model="addForm.color" prop="color" :rules="rules.required('请选择颜色')"
                                           placeholder="请选择">
                                    <el-option v-for="item in carColorList" :key="item.value"
                                               :label="item.text"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="车架号" prop="vin" >
                                <el-input v-model="addForm.vin" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="发动机号" prop="engineNo" >
                                <el-input v-model="addForm.engineNo" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="机动车登记证" prop="certificate" >
                                <el-input v-model="addForm.certificate" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="登记证抵押状态" prop="certificateStatus"
                                          :rules="rules.required('请选择登记证抵押状态')">
                                <el-select v-model="addForm.certificateStatus" placeholder="请选择">
                                    <el-option label="抵押" :value="1" :key="1"></el-option>
                                    <el-option label="非抵押" :value="2" :key="2"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="行驶证号" prop="licenseNumber" >
                                <el-input v-model="addForm.licenseNumber" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="行驶证所有人" prop="licenseName" >
                                <el-input v-model="addForm.licenseName" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="注册城市" prop="registerCityId" :rules="rules.required('请选择注册城市')">
                                <city-select v-model="addForm.registerCityId"></city-select>
                            </el-form-item>

                            <el-form-item label="提车人" prop="actualPickingPerson">
                                <el-select v-model="addForm.actualPickingPerson" placeholder="请选择提车人">

                                    <el-option
                                        v-for="item in perData"
                                        :key="item.account"
                                        :label="item.name"
                                        :value="item.userId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="提车时间" prop="pickingTime" :rules="rules.required('请选择提车时间')">
                                <el-date-picker type="date" placeholder="选择日期" v-model="addForm.pickingTime"
                                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="油费（元）" prop="pickingOilFee" :rules="rules.money()">
                                <el-input v-model="addForm.pickingOilFee" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="洗车费（元）" prop="carWashExpenses" :rules="rules.money()">
                                <el-input v-model="addForm.carWashExpenses" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="其他费用（元）" prop="otherExpenses" :rules="rules.money()">
                                <el-input v-model="addForm.otherExpenses" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="登记证照片">
                                <upload-panel :size="1" :file-list.sync="djFileList"></upload-panel>
                            </el-form-item>

                            <el-form-item label="行驶证图片">
                                <upload-panel :size="1" :file-list.sync="xsFileList"></upload-panel>
                            </el-form-item>
                        </div>
                    </div>
                </el-collapse-item>

                <!--<el-collapse-item title="提车" name="1" v-if="purchaseForm.type == 3">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <span>{{detailForm.vehicleModelInfoName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">颜色</label>
                            <div class="input-group">
                                <span>{{detailForm.carColor}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">车架号</label>
                            <div class="input-group">
                                <span>{{detailForm.vin}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">发动机号</label>
                            <div class="input-group">
                                <span>{{detailForm.engineNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">机动车登记证</label>
                            <div class="input-group">
                                <span>{{detailForm.certificate}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">登记证状态</label>
                            <div class="input-group">
                                <span>{{detailForm.certificateStatus}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">行驶证号</label>
                            <div class="input-group">
                                <span>{{detailForm.licenseNumber}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">行驶证所有人</label>
                            <div class="input-group">
                                <span>{{detailForm.licenseName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">注册城市</label>
                            <div class="input-group">
                                <span>{{detailForm.registerCityName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">提车时间</label>
                            <div class="input-group">
                                <span>{{detailForm.pickingTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">实际提车人</label>
                            <div class="input-group">
                                <span>{{detailForm.actualPickingPerson}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">提车油费</label>
                            <div class="input-group">
                                <span>{{detailForm.pickingOilFee}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">洗车费</label>
                            <div class="input-group">
                                <span>{{detailForm.carWashExpenses}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他费用</label>
                            <div class="input-group">
                                <span>{{detailForm.otherExpenses}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">行驶证图片</label>
                            <div class="input-group">
                                <upload-panel :size="1" :file-list.sync="xsFileList"></upload-panel>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">登记证图片</label>
                            <div class="input-group">
                                <upload-panel :size="1" :file-list.sync="djFileList"></upload-panel>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>-->

                <el-collapse-item title="上牌" name="2" v-if="purchaseForm.type == 3">
                    <div class="form-panel" style="min-height: auto;">
                        <div class="flex-panel">
                            <el-form-item label="车牌" prop="plate" :rules="rules.required('请输入车牌')" >
                                <el-input v-model="addForm.plate" placeholder="请输入" maxLength="10"></el-input>
                            </el-form-item>

                            <el-form-item label="号牌来源" prop="plateType" :rules="rules.required('请选择号牌来源')">
                                <el-select v-model="addForm.plateType" placeholder="请选择">
                                    <el-option label="自有" value="1"></el-option>
                                    <el-option label="租赁" value="2"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="上牌日期" prop="installPlateDate" :rules="rules.required('请选择上牌日期')">
                                <el-date-picker type="date" placeholder="选择日期" v-model="addForm.installPlateDate"
                                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="上牌费用（元）" prop="installPlateFees" :rules="rules.money()">
                                <el-input v-model="addForm.installPlateFees" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-collapse-item>


                <el-collapse-item title="分配车辆" name="2" v-if="purchaseForm.type == 1">
                    <div class="form-panel" style="min-height: auto;">
                        <div class="flex-panel">
                            <el-form-item label="车型">
                                <el-input v-model="detailForm.vehicleModelInfoName" placeholder="请输入"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item label="颜色">
                                <el-input v-model="detailForm.colorName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="车辆" prop="vehicleName" :rules="rules.required('请选择车辆')">
                                <el-input v-model="addForm.vehicleName" placeholder="请选择"
                                          @focus="openVehicleSelect()"></el-input>
                            </el-form-item>

                            <el-form-item label="提车人" prop="actualPickingPerson">
                                <el-select v-model="addForm.actualPickingPerson" placeholder="请选择提车人">

                                    <el-option
                                        v-for="item in perData"
                                        :key="item.account"
                                        :label="item.name"
                                        :value="item.userId">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="提车时间" prop="pickingTime" :rules="rules.required('请选择提车时间')">
                                <el-date-picker type="date" placeholder="选择日期" v-model="addForm.pickingTime"
                                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="油费（元）" prop="pickingOilFee" :rules="rules.money()">
                                <el-input v-model="addForm.pickingOilFee" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="洗车费（元）" prop="carWashExpenses" :rules="rules.money()">
                                <el-input v-model="addForm.carWashExpenses" placeholder="请输入"></el-input>
                            </el-form-item>

                            <el-form-item label="其他费用（元）" prop="otherExpenses" :rules="rules.money()">
                                <el-input v-model="addForm.otherExpenses" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="left-row">
            <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
            <el-button @click="close">返回</el-button>
        </div>
        <!-- 车辆选择  -->
        <el-dialog class="full-input" :visible.sync="showVehiclePlateSelect" width="900px" title="车辆选择" append-to-body>
            <el-row :gutter="20">
                <el-col :span="10">
                    <div class="grid-content bg-purple">
                        <div class="form-group">

                            <el-input style=" width: calc(100% - 80px)"
                                      placeholder="请输入车牌/车架号/车型" v-model="vp.searchParam.vehicle"></el-input>
                            <button class="btn btn-primary defaultSearchButton" @click="_query_vehicle"
                                    style="margin-left: 10px;">
                                查询
                            </button>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="row tool-box">
            </div>
            <div class="row">
                <el-table border :data="vpList" style="width: 100%" @row-dblclick="selectVehicle($event)">
                    <el-table-column prop="vin" sortable label="车架号" min-width="150"></el-table-column>
                    <el-table-column prop="plate" sortable label="车牌" min-width="100">
                    </el-table-column>
                    <el-table-column prop="modelName" sortable label="车型" min-width="300"
                                     show-overflow-tooltip></el-table-column>
                    <!--<el-table-column prop="registerCityName" sortable label="注册城市" min-width="150"></el-table-column>
                    <el-table-column prop="runCityName" sortable label="经营城市" min-width="100"></el-table-column>
                    <el-table-column prop="engineNo" sortable label="发动机号" min-width="150"></el-table-column>
                    <el-table-column prop="colorName" sortable label="颜色" min-width="80"></el-table-column>
                    <el-table-column prop="licenseName" sortable label="行驶证车主" min-width="150"></el-table-column>
                    <el-table-column prop="licenseNumber" sortable label="行驶证号" min-width="150"></el-table-column>
                    <el-table-column prop="certificate" sortable label="机动车登记证" min-width="150"></el-table-column>
                    <el-table-column prop="certificateStatus" sortable label="登记证状态" min-width="100"></el-table-column>-->
                    <el-table-column prop="vehicleStatus" sortable label="车辆状态" min-width="100"></el-table-column>
                   <!-- <el-table-column prop="stockStatus" sortable label="在库状态" min-width="100"></el-table-column>
                    <el-table-column prop="plateType" sortable label="车牌属性" min-width="100"></el-table-column>-->
                    <el-table-column prop="assetsType" sortable label="资产属性" min-width="100"></el-table-column>
                   <!-- <el-table-column prop="useNature" sortable label="经营属性" min-width="100"></el-table-column>
                    <el-table-column prop="registrationDate" sortable label="上牌日期" min-width="120"></el-table-column>
                    <el-table-column prop="mileage" sortable label="行驶里程(KM)" min-width="150"></el-table-column>
                    <el-table-column prop="insuranceInsuredDate" sortable label="保险投保日期"
                                     min-width="150"></el-table-column>
                    <el-table-column prop="insuranceExpirationDate" sortable label="保险到期日期"
                                     min-width="150"></el-table-column>
                    <el-table-column prop="maintenanceExpirationMil" sortable label="保养到期里程(KM)"
                                     min-width="150"></el-table-column>
                    <el-table-column prop="maintenanceExpirationDate" sortable label="保养到期日期"
                                     min-width="150"></el-table-column>
                    <el-table-column prop="inspectionExpirationDate" sortable label="年检到期日期"
                                     min-width="150"></el-table-column>-->
                    <el-table-column prop="providerCompanyName" sortable label="所属组织" min-width="150"></el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="pageSizeSetting"
                    :layout="pageLayout"
                    :current-page="vpPage"
                    :page-size="pageSize"
                    :total="vpListCount">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "vehiclePurchaseProcessForm",
        components: {TreeSelect, MoneyInput, UploadPanel, CitySelect},
        data() {
            var maxLength36 = {max: 36, message: '长度不能超过36个字符', trigger: 'change' };
            return {
                purchaseForm: {
                    id: "",
                    type: "",
                    title: "",
                    url: "",
                },
                openCollapse: ["1", "2", "3", "4", "5", "6"],
                show: false,
                vehicleModelInfoDisabled:false,
                detailForm: {},
                dataForm: {
                    pickingConfirmPerson: this.getCurrentUserInfo().name,
                    vehicleInfo: {}
                },
                rules: {
                    vin: [maxLength36,{required: true, message: '请输入车架号'}],
                    engineNo:[maxLength36,{required: true, message: '请输入发动机号'}],
                    certificate:[maxLength36,{required: true, message: '请输入机动车登记证'}],
                    licenseNumber:[maxLength36,{required: true, message: '请输入行驶证号'}],
                    licenseName:[maxLength36,{required: true, message: '请输入行驶证所有人'}]
                },
                perData: [],
                plateData: [],
                vp: {searchParam: {}},
                showVehiclePlateSelect: false,
                vpList: [],
                vpPage: 1,
                vpListCount: 0,
                fileList: [],
                djFileList: [],
                xsFileList: [],
                platIsDisabled: true,
                addForm: {},
                carColorList: []
            }
        },
        methods: {
            open() {
                this.dataForm = {
                    pickingConfirmPerson: this.getCurrentUserInfo().name,
                    vehicleInfo: {}
                };
                this.platIsDisabled = true;
                this.fileList = [];
                this.djFileList = [];
                this.xsFileList = [];

                ajax.get('/core/purchaseProcess/findById', {id: this.purchaseForm.id}).then(rs => {
                    this.detailForm = rs.data;
                    this.addForm.color = this.detailForm.color;
                    this.addForm.vehicleModelInfoId = this.detailForm.vehicleModelInfoId;
                    this.addForm.price=this.detailForm.tradeAmount;
                    if(this.purchaseForm.type == 3){
                        this.addForm.vin=this.detailForm.vin;
                        this.addForm.engineNo=this.detailForm.engineNo;
                        this.addForm.certificate=this.detailForm.certificate;
                        this.addForm.certificateStatus=this.detailForm.certificateStatusValue;
                        this.addForm.licenseNumber=this.detailForm.licenseNumber;
                        this.addForm.licenseName=this.detailForm.licenseName;
                        this.addForm.actualPickingPerson=this.detailForm.actualPickingPersonId;
                        this.addForm.pickingTime=this.detailForm.pickingTime;
                        this.addForm.pickingOilFee=this.detailForm.pickingOilFee;
                        this.addForm.carWashExpenses=this.detailForm.carWashExpenses;
                        this.addForm.otherExpenses=this.detailForm.otherExpenses;
                        if (this.detailForm.registerCityId !=null && this.detailForm.registerCityId !='') {
                            if(this.detailForm.registerCityId.indexOf(",")>0){
                                this.addForm.registerCityId=this.detailForm.registerCityId.split(",");
                            }else {
                                this.addForm.registerCityId[0]=this.detailForm.registerCityId;
                            }
                        }
                        this.addForm=Object.assign({},this.addForm);
                    }
                    let df = this.detailForm;

                    this.$set(this.dataForm, 'supplierPlanDeliveryDate', df.supplierPlanDeliveryDate);
                    this.$set(this.dataForm, 'actualDeliveryDate', df.actualDeliveryDate);
                    //if (that.purchaseForm.step == 2) {
                    this.$set(this.dataForm, 'pickingTime', df.pickingTime);
                    this.$set(this.dataForm, 'actualPickingPerson', df.actualPickingPerson);
                    this.$set(this.dataForm, 'pickingOilFee', df.pickingOilFee);
                    //}
                    //else if (that.purchaseForm.step == 3) {
                    this.$set(this.dataForm, 'installPlateDate', df.installPlateDate);
                    this.$set(this.dataForm, 'installPlateFees', df.installPlateFees);
                    if (!df.installPlateConfirmPerson)
                        this.detailForm.installPlateConfirmPerson = this.getCurrentUserInfo().userId;
                    this.$set(this.dataForm, 'installPlateConfirmPerson', df.installPlateConfirmPerson);

                    //}
                    //else if (that.purchaseForm.step == 4) {
                    this.$set(this.dataForm, 'deliveryDate', df.deliveryDate);
                    if (!df.deliveryConfirmPerson)
                        df.deliveryConfirmPerson = this.getCurrentUserInfo().userId;
                    this.$set(this.dataForm, 'deliveryConfirmPerson', df.deliveryConfirmPerson);

                    if (df.actualDeliveryPerson)
                        this.$set(this.dataForm, 'actualDeliveryPerson', df.actualDeliveryPerson);
                    //}

                    //附件
                    if (this.detailForm.certificatePic)
                        this.djFileList = [JSON.parse(this.detailForm.certificatePic)];
                    if (this.detailForm.licensePic)
                        this.xsFileList = [JSON.parse(this.detailForm.licensePic)];

                    //车辆关联信息
                    this.$set(this.dataForm, 'vehicleInfo', {
                        plate: this.detailForm.plate,
                        hongkongPlate: this.detailForm.hongkongPlate,
                        vin: this.detailForm.vin,
                        engineNo: this.detailForm.engineNo,
                        certificate: this.detailForm.certificate,
                        licenseName: this.detailForm.licenseName,
                        licenseNumber: this.detailForm.licenseNumber,
                        registrationDate: this.detailForm.registrationDate
                    });

                    this.$set(this.dataForm, 'vehicleId', this.detailForm.vehicleId);


//                    ajax.get('/core/purchaseProcess/getVehicleByID/'+this.detailForm.vehicleId).then(res=>{
//                        this.djFileList=JSON.parse(res.data.certificatePic);
//                        this.xsFileList=JSON.parse(res.data.licensePic);
//                        this.addForm=res.data;
//                    });


                    //转换加装要求 detailForm.retrofitRequirementOptionsLabel

                    ajax.get('admin/dict/type/加装要求选项').then(rs => {
                        let map = {};
                        rs.forEach(obj =>{
                           map[obj.value] = obj.text;
                        });

                        if(this.detailForm.retrofitRequirementOptions) {
                            let arr = this.detailForm.retrofitRequirementOptions.split(',');
                            let label = '';

                            arr.forEach(str => {
                                label += (map[str] + ',');
                            });

                            this.$set(this.detailForm, 'retrofitRequirementOptionsLabel', label);
                        }
                    });
                    this.init();

                });

                this.$set(this.dataForm, 'url', this.purchaseForm.url);
                this.$set(this.dataForm, 'id', this.purchaseForm.id);
            },
            submitForm(formName) {
                if (this.djFileList.length == 1) {
                    let objectFile = {};
                    objectFile['name'] = this.djFileList[0].name;
                    objectFile['path'] = this.djFileList[0].path;
                    objectFile['filedomain'] = this.djFileList[0].filedomain;
                    this.addForm.registerPic = JSON.stringify(objectFile);
                }

                if (this.xsFileList.length == 1) {
                    let objectFile = {};
                    objectFile['name'] = this.xsFileList[0].name;
                    objectFile['path'] = this.xsFileList[0].path;
                    objectFile['filedomain'] = this.xsFileList[0].filedomain;
                    this.addForm.licensePic = JSON.stringify(objectFile);
                }

                this.addForm.purchaseProcessId = this.detailForm.id;
                if (!this.addForm.vehicleId)
                    this.addForm.vehicleId = this.detailForm.vehicleId;
                this.addForm.organizationId = this.detailForm.organizationId;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addForm.registerCityId)
                            this.addForm.registerCityId = this.addForm.registerCityId[1];
                        ajax.post(this.dataForm.url, this.addForm).then(rs => {
                            if (rs.status == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });

                                this.close();
                                this.$emit('load');
                            } else
                                this.$message.error(rs.message);
                        });
                    } else {
                        return false;
                    }
                });
            },
            init() {
                //实际提车人
                ajax.get(`/admin/user/company/${this.detailForm.organizationId}`).then(rs => {
                    if (rs.status == 0)
                        this.perData = rs.data;
                });
            },
            handleChange(val) {
                console.log(val);
            },
            openVehicleSelect() {
                this.showVehiclePlateSelect = true;
                this._query_vehicle();

            },
            _query_vehicle() {
                const params = this.vp.searchParam;
                params.rows = this.pageSize;
                params.page = this.vpPage;
                params.modelName = this.detailForm.vehicleModelInfoName;
                if (this.purchaseForm.title != '上牌')
                    params.plateIsNotEmpty = 1;
                else
                    params.plateIsNotEmpty = null;
                ajax.get('/base/vehicle/list', params).then(res => {
                    this.vpList = res.rows;
                    this.vpListCount = res.records;
                })
            },
            //切换页容量
            handleSizeChange(val) {
                this.pageSize = val;
                this.vpPage = 1;
                this._query_vehicle();
            },
            //翻页
            handleCurrentChange(val) {
                this.vpPage = val;
                this._query_vehicle();
            },
            selectVehicle(row) {
                this.showVehiclePlateSelect = false;

                this.$set(this.addForm, 'vehicleId', row.vehicleId);
                this.$set(this.addForm, 'vehicleName', row.plate);
            }
        },
        mounted() {
            this.purchaseForm.id = this.$route.query.id;
            this.purchaseForm.type = this.$route.query.type;


            if (this.purchaseForm.type == "2") {
                this.purchaseForm.title = "提车";
                this.purchaseForm.url = '/core/purchaseProcess/pickUpCar';
            } else if (this.purchaseForm.type == "3") {
                this.vehicleModelInfoDisabled=true;
                this.purchaseForm.title = "上牌";
                this.purchaseForm.url = '/core/purchaseProcess/setPlate';
            } else if (this.purchaseForm.type == "1") {
                this.purchaseForm.url = '/core/purchaseProcess/setExistCar';
            }

            ajax.get('/admin/dict/type/车辆颜色').then(rs => {
                this.carColorList = rs;
            });
            this.open();
        }
    }
</script>

