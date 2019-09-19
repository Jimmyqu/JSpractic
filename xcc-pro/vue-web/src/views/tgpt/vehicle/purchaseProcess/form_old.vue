<template>
    <div class="form-panel">
        <el-form :model="dataForm" label-position="top" :rules="rules" ref="dataForm" label-width="100px">
            <el-collapse v-model="openCollapse" @change="handleChange">
                <!--车辆采购信息-->
                <el-collapse-item :title="'车辆采购信息-' + purchaseForm.title" name="1">
                    <div class="flex-panel">
                        <el-form-item label="订单号">
                            <el-input v-model="detailForm.orderNumber" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="采购方式">
                            <el-input value="新购" v-if="detailForm.purchaseMethod==1" disabled></el-input>
                            <el-input value="租赁" v-if="detailForm.purchaseMethod==2" disabled></el-input>
                            <el-input value="现有车辆安排" v-if="detailForm.purchaseMethod==3" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="用车城市">
                            <el-input v-model="detailForm.deliveryCityName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="交车城市">
                            <el-input v-model="detailForm.deliveryCityName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="车型">
                            <el-input v-model="detailForm.vehicleModelInfoName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="预计到车时间">
                            <el-input v-model="detailForm.planDeliveryDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="要求到位时间">
                            <el-input v-model="detailForm.requiredDeliveryDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="采购申请人">
                            <el-input v-model="detailForm.purchaseApplicant" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-input v-model="detailForm.color" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                           <span v-if="detailForm.state==1">
                                    <el-input value="新增" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==2">
                                    <el-input value="已到车" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==3">
                                    <el-input value="已提车" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==4">
                                    <el-input value="待交车" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==5">
                                    <el-input value="完成" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==6">
                                    <el-input value="终止" disabled></el-input>
                                </span>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <!--到车-->
                <el-collapse-item title="到车" name="2" v-if="purchaseForm.type==1">
                    <div class="flex-panel">
                        <el-form-item label="供应商回复到车时间"
                                      prop="supplierPlanDeliveryDate">
                            <el-date-picker type="datetime" placeholder="请选择供应商回复到车时间"
                                            v-model="dataForm.supplierPlanDeliveryDate"
                                            format="yyyy-MM-dd HH:mm"
                                            value-format="yyyy-MM-dd HH:mm"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="实际到车时间"
                                      prop="actualDeliveryDate">

                            <el-date-picker type="datetime" placeholder="请选择实际到车时间"
                                            v-model="dataForm.actualDeliveryDate"
                                            format="yyyy-MM-dd HH:mm"
                                            value-format="yyyy-MM-dd HH:mm"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <!--提车-->
                <el-collapse-item title="到车" name="2" v-if="purchaseForm.type==2 || purchaseForm.type==3 || purchaseForm.type==4 || purchaseForm.type==5">
                    <div class="flex-panel">
                        <el-form-item label="供应商回复到车时间">
                            <el-input v-model="detailForm.supplierPlanDeliveryDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="实际到车时间">
                            <el-input v-model="detailForm.actualDeliveryDate" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="保险确认" name="3" v-if="purchaseForm.type==2 || purchaseForm.type==3 || purchaseForm.type==4 || purchaseForm.type==5">
                    <div class="flex-panel">
                        <el-form-item label="商业险保单号">
                            <el-input v-model="detailForm.businessInsuranceNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="交强险保单号">
                            <el-input v-model="detailForm.compulsoryInsuranceNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="乘运险保单号">
                            <el-input v-model="detailForm.carrierInsuranceNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="保险确认人">
                            <el-input v-model="detailForm.insuranceConfirmPersonName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="保险确认时间">
                            <el-input v-model="detailForm.insuranceConfirmDate" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="提车" name="4" v-if="purchaseForm.type==2">
                    <div class="flex-panel">
                        <el-form-item label="提车时间" prop="pickingTime">
                            <el-date-picker type="datetime"
                                            format="yyyy-MM-dd HH:mm"
                                            value-format="yyyy-MM-dd HH:mm"
                                            range-separator="至"
                                            placeholder="请选择提车时间" v-model="dataForm.pickingTime"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="实际提车人" prop="actualPickingPerson">
                            <el-select v-model="dataForm.actualPickingPerson" placeholder="请选择实际提车人">

                                <el-option
                                    v-for="item in perData"
                                    :key="item.account"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="提车确认人">
                            <el-input disabled v-model="dataForm.pickingConfirmPerson"></el-input>
                        </el-form-item>
                        <el-form-item label="提车油费" prop="pickingOilFee">
                            <el-input v-model="dataForm.pickingOilFee" placeholder="请输入提车油费"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>


                <!-- 现有车安排  -->
                <el-collapse-item title="现有车安排" name="1" v-if="purchaseForm.type==0">
                    <div class="flex-panel">
                        <el-form-item label="车牌'">
                            <el-input v-model="dataForm.vehicleInfo.plate" placeholder="请选择车牌号"
                                      @focus="openVehicleSelect"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <!-- 上牌  -->
                <el-collapse-item title="提车" name="4" v-if="purchaseForm.type==3 || purchaseForm.type==4 || purchaseForm.type==5">
                    <div class="flex-panel">
                        <el-form-item label="提车时间">
                            <el-input v-model="detailForm.pickingTime" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="实际提车人">
                            <el-input v-model="detailForm.actualPickingPersonName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="提车确认人">
                            <el-input disabled v-model="detailForm.pickingConfirmPerson" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="提车油费">
                            <el-input v-model="detailForm.pickingOilFee" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item :title="purchaseForm.title=='租赁提车'?'车辆信息区域':purchaseForm.title" name="5"
                                  v-if="purchaseForm.type==3 || purchaseForm.type==4 || purchaseForm.type==5">
                    <div class="flex-panel">
                        <el-form-item label="车牌" prop="vehicleInfo.plate"
                                      :rules="{required: true, message: '请输入车牌', trigger: ['blur','change']}">
                            <el-input v-model="dataForm.vehicleInfo.plate" :disabled="platIsDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="港车车牌">
                            <el-input v-model="dataForm.vehicleInfo.hongkongPlate"
                                      :disabled="platIsDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="号牌来源">
                            <el-input disabled></el-input>
                        </el-form-item>

                        <el-form-item label="车架号" prop="vehicleInfo.vin"
                                      :rules="{required: true, message: '请选择车架号', trigger: 'change'}"
                                      v-if="purchaseForm.type==3">
                            <el-input v-model="dataForm.vehicleInfo.vin" @focus="openVehicleSelect" placeholder="请选择车架号"
                                      readonly></el-input>
                        </el-form-item>
                        <el-form-item label="车架号" v-if="purchaseForm.type==5">
                            <el-input v-model="dataForm.vehicleInfo.vin" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="发动机号">
                            <el-input v-model="dataForm.vehicleInfo.engineNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="机动车登记证">
                            <el-input v-model="dataForm.vehicleInfo.certificate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="行驶证车主">
                            <el-input v-model="dataForm.vehicleInfo.licenseName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="行驶证号">
                            <el-input v-model="dataForm.vehicleInfo.licenseNumber" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="登记证照片">
                            <upload-panel :size="1" :file-list.sync="djFileList"></upload-panel>
                        </el-form-item>

                        <el-form-item label="行驶证图片">
                            <upload-panel :size="1" :file-list.sync="xsFileList"></upload-panel>
                        </el-form-item>
                    </div>
                    <div class="flex-panel" v-if="purchaseForm.title=='上牌'">
                        <el-form-item label="上牌日期" v-if="purchaseForm.type==3 || purchaseForm.type==4">
                            <el-date-picker type="datetime"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            v-model="dataForm.vehicleInfo.registrationDate"
                                            style="width: 100%;" :disabled="platIsDisabled"></el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="purchaseForm.type==5" label="上牌日期">
                            <el-input v-model="detailForm.registrationDate" disabled></el-input>
                        </el-form-item>


                        <el-form-item label="上牌费用" prop="installPlateFees" v-if="purchaseForm.type==3 || purchaseForm.type==4">
                            <el-input v-model="dataForm.installPlateFees" placeholder="请输入上牌费用"></el-input>
                        </el-form-item>

                        <el-form-item label="上牌费用" v-if="purchaseForm.type==5">
                            <el-input v-model="dataForm.installPlateFees" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="上牌确认人" prop="installPlateConfirmPerson" v-if="purchaseForm.type==3 || purchaseForm.type==4">
                            <el-select v-model="dataForm.installPlateConfirmPerson" disabled placeholder="请选择上牌确认人">

                                <el-option
                                    v-for="item in perData"
                                    :key="item.account"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上牌确认人" v-if="purchaseForm.type==5">
                            <el-input v-model="detailForm.installPlateConfirmPersonName" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <!-- 交车 -->
                <el-collapse-item title="交车" name="6" v-if="purchaseForm.type==5">
                    <div class="flex-panel">
                        <el-form-item label="实际就位时间" prop="deliveryDate">
                            <el-date-picker type="datetime"
                                            format="yyyy-MM-dd HH:mm"
                                            value-format="yyyy-MM-dd HH:mm"
                                            range-separator="至"
                                            placeholder="请选择实际就位时间" v-model="dataForm.deliveryDate"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="交车确认人" prop="deliveryConfirmPerson">
                            <el-select v-model="dataForm.deliveryConfirmPerson" disabled placeholder="请选择交车确认人">

                                <el-option
                                    v-for="item in perData"
                                    :key="item.account"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="实际交车人" prop="actualDeliveryPerson">
                            <el-select v-model="dataForm.actualDeliveryPerson" placeholder="请选择实际交车人">

                                <el-option
                                    v-for="item in perData"
                                    :key="item.account"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="交车单" required>
                            <upload-panel :size="1" :file-list.sync="fileList"></upload-panel>
                        </el-form-item>
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
                                      placeholder="请输入车架号" v-model="vp.searchParam.vin"></el-input>
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
                    <el-table-column prop="registerCityName" sortable label="注册城市" min-width="150"></el-table-column>
                    <el-table-column prop="runCityName" sortable label="经营城市" min-width="100"></el-table-column>
                    <el-table-column prop="engineNo" sortable label="发动机号" min-width="150"></el-table-column>
                    <el-table-column prop="colorName" sortable label="颜色" min-width="80"></el-table-column>
                    <el-table-column prop="licenseName" sortable label="行驶证车主" min-width="150"></el-table-column>
                    <el-table-column prop="licenseNumber" sortable label="行驶证号" min-width="150"></el-table-column>
                    <el-table-column prop="certificate" sortable label="机动车登记证" min-width="150"></el-table-column>
                    <el-table-column prop="certificateStatus" sortable label="登记证状态" min-width="100"></el-table-column>
                    <el-table-column prop="vehicleStatus" sortable label="车辆状态" min-width="100"></el-table-column>
                    <el-table-column prop="stockStatus" sortable label="在库状态" min-width="100"></el-table-column>
                    <el-table-column prop="plateType" sortable label="车牌属性" min-width="100"></el-table-column>
                    <el-table-column prop="assetsType" sortable label="资产属性" min-width="100"></el-table-column>
                    <el-table-column prop="useNature" sortable label="经营属性" min-width="100"></el-table-column>
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
                                     min-width="150"></el-table-column>
                    <el-table-column prop="companyName" sortable label="所属组织" min-width="150"></el-table-column>
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
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"vehiclePurchaseProcessForm",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            return {
                purchaseForm:{
                    id : "",
                    type : "",
                    title :"",
                    url :"",
                },
                openCollapse: ["1", "2", "3", "4", "5", "6"],
                show: false,
                detailForm: {},
                dataForm: {
                    pickingConfirmPerson: this.getCurrentUserInfo().name,
                    vehicleInfo: {}
                },
                rules: {
                    supplierPlanDeliveryDate: [{required: true, message: '请选择供应商回复到车时间', trigger: 'change'}],
                    actualDeliveryDate: [{required: true, message: '请选择实际到车时间', trigger: 'change'}],
                    pickingOilFee: [
                        {required: true, message: '请输入提车油费', trigger: 'blur'},
                        {pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}
                    ],
                    pickingTime: [
                        {required: true, message: '请选择提车时间', trigger: 'change'}
                    ],
                    actualPickingPerson: [
                        {required: true, message: '请选择实际提车人', trigger: 'change'}
                    ],
                    deliveryDate: [
                        {required: true, message: '请选择实际就位时间', trigger: 'change'}
                    ],
                    deliveryConfirmPerson: [
                        {required: true, message: '请选择交车确认人', trigger: 'change'}
                    ],
                    actualDeliveryPerson: [
                        {required: true, message: '请选择实际交车人', trigger: 'change'}
                    ],
                    installPlateFees: [
                        {required: true, message: '请输入上牌费用', trigger: 'blur'},
                        {pattern: moneyRegex, message: '金额输入异常', trigger: 'blur'}
                    ],
                    installPlateConfirmPerson: [
                        {required: true, message: '请选择上牌确认人', trigger: 'change'}
                    ]
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
                platIsDisabled: true
            }
        },
        watch: {
            purchaseForm() {
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
                    var df = this.detailForm;

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
                    if (this.detailForm.deliveryCertificate)
                        this.fileList = [JSON.parse(this.detailForm.deliveryCertificate)];
                    if (this.detailForm.registerPic)
                        this.djFileList = [JSON.parse(this.detailForm.registerPic)];
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

                    /*that.$set(that.dataForm, 'vehicleId', {
                        plate: that.detailForm.plate,
                        hongkongPlate: that.detailForm.hongkongPlate,
                        vin: that.detailForm.vin,
                        engineNo: that.detailForm.engineNo,
                        certificate: that.detailForm.certificate,
                        licenseName: that.detailForm.licenseName,
                        licenseNumber: that.detailForm.licenseNumber,
                        registrationDate: that.detailForm.registrationDate
                    });*/

                    this.$set(this.dataForm, 'vehicleId', this.detailForm.vehicleId);

                    /*this.$nextTick(_ => {
                        this.$refs.dataForm.clearValidate();
                    });*/
                });

                this.$set(this.dataForm, 'url', this.purchaseForm.url);
                this.$set(this.dataForm, 'id', this.purchaseForm.id);
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
                    var df = this.detailForm;

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
                    if (this.detailForm.deliveryCertificate)
                        this.fileList = [JSON.parse(this.detailForm.deliveryCertificate)];
                    if (this.detailForm.registerPic)
                        this.djFileList = [JSON.parse(this.detailForm.registerPic)];
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

                    /*that.$set(that.dataForm, 'vehicleId', {
                        plate: that.detailForm.plate,
                        hongkongPlate: that.detailForm.hongkongPlate,
                        vin: that.detailForm.vin,
                        engineNo: that.detailForm.engineNo,
                        certificate: that.detailForm.certificate,
                        licenseName: that.detailForm.licenseName,
                        licenseNumber: that.detailForm.licenseNumber,
                        registrationDate: that.detailForm.registrationDate
                    });*/

                    this.$set(this.dataForm, 'vehicleId', this.detailForm.vehicleId);
                });

                this.$set(this.dataForm, 'url', this.purchaseForm.url);
                this.$set(this.dataForm, 'id', this.purchaseForm.id);
            },
            submitForm(formName) {
                if (this.purchaseForm.title == '交车'
                    && this.fileList.length == 0) {
                    this.$message.error('请上传交车单...');
                    return;
                }
                if (this.fileList.length == 1) {
                    var objectFile = {};
                    objectFile['name'] = this.fileList[0].name;
                    objectFile['path'] = this.fileList[0].path;
                    objectFile['filedomain'] = this.fileList[0].filedomain;
                    this.dataForm.deliveryCertificate = JSON.stringify(objectFile);
                }

                if (this.djFileList.length == 1) {
                    var objectFile = {};
                    objectFile['name'] = this.djFileList[0].name;
                    objectFile['path'] = this.djFileList[0].path;
                    objectFile['filedomain'] = this.djFileList[0].filedomain;
                    this.dataForm.registerPic = JSON.stringify(objectFile);
                }

                if (this.xsFileList.length == 1) {
                    var objectFile = {};
                    objectFile['name'] = this.xsFileList[0].name;
                    objectFile['path'] = this.xsFileList[0].path;
                    objectFile['filedomain'] = this.xsFileList[0].filedomain;
                    this.dataForm.licensePic = JSON.stringify(objectFile);
                }

                this.dataForm.reverseWrite = this.platIsDisabled ? 0 : 1;
                try {
                    this.dataForm.plate = this.dataForm.vehicleInfo.plate;
                    this.dataForm.hongkongPlate = this.dataForm.vehicleInfo.hongkongPlate;
                    this.dataForm.registrationDate = this.dataForm.vehicleInfo.registrationDate;
                } catch (e) {
                    console.log(e);
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        ajax.post(this.dataForm.url, this.dataForm).then(rs => {
                            if (rs.status == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });

                                this.close();
                                this.$emit('load');
                            }
                            else
                                this.$message.error(rs.message);
                        });
                    } else {
                        return false;
                    }
                });
            },
            init() {
                //实际提车人
                ajax.get('/core/coreProjectReview/projectLeader', {companyType: 2}).then(rs => {
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
                if(this.purchaseForm.title!='上牌')
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
                this.$set(this.dataForm, 'vehicleInfo', row);
                //this.$set(this.dataForm.vehicleInfo, 'vin', this.dataForm.vehicleInfo.vin);
                this.$set(this.dataForm, 'vehicleId', row.id);

                if (!row.plate && this.purchaseForm.title == '上牌')
                    this.platIsDisabled = false;
            }
        },
        mounted() {
            this.init();

            this.purchaseForm.id = this.$route.query.id;
            this.purchaseForm.type = this.$route.query.type;
            if (this.purchaseForm.type == "0"){
                this.purchaseForm.title = "现有车安排";
                this.purchaseForm.url =  '/core/purchaseProcess/setPlate';
            }else if (this.purchaseForm.type == "1"){
                this.purchaseForm.title = "到车";
                this.purchaseForm.url = '/core/purchaseProcess/arriveCar';
            }else if (this.purchaseForm.type == "2"){
                this.purchaseForm.title = "提车";
                this.purchaseForm.url = '/core/purchaseProcess/pickUpCar';
            }else if (this.purchaseForm.type == "3"){
                this.purchaseForm.title = "上牌";
                this.purchaseForm.url = '/core/purchaseProcess/setPlate';
            }else if (this.purchaseForm.type == "4"){
                this.purchaseForm.title = "租赁提车";
                this.purchaseForm.url = '/core/purchaseProcess/setPlate';
            }else if (this.purchaseForm.type == "5"){
                this.purchaseForm.title = "交车";
                this.purchaseForm.url = '/core/purchaseProcess/deliveryCar';
            }
            this.open();
        }
    }
</script>

