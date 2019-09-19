<template>
    <div class="form-panel">
        <el-form :model="vehicleForm" :rules="rules" label-position="top" ref="vehicleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆资料-->
                <el-collapse-item title="车辆资料" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="organization" :disabled="isEdit" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="服务组织" prop="serviceRegionId">
                            <tree-select v-model="serviceOrganization" :disabled="isEdit" placeholder="请选择服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        </el-form-item>

                        <el-form-item label="车牌" prop="plate">
                            <el-input v-model="vehicleForm.plate" clearable :disabled="isPlateEdit" placeholder="请输入车牌"></el-input>
                        </el-form-item>
                        <el-form-item label="车型" prop="modelName">
                            <el-input v-model="vehicleForm.modelName" readonly :disabled="organizationFlag">
                                <el-button slot="append" icon="el-icon-search" @click="openModelInfo()" ></el-button>
                            </el-input>
                            <el-dialog title="选择车型" :visible.sync="dialogPlateVisible" :append-to-body="true" width="70%" >
                                <div class="list-panel" v-cloak>
                                    <div class="row form-horizontal search-box">
                                        <div class="form-box">
                                            <div class="form-group">
                                                <label class="control-label">车型名称</label>
                                                <div class="input-group">
                                                    <el-input  v-model="searchParam.modelInfo" placeholder="请输入车型" clearable />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="search-btn-list">
                                            <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                                            <el-button size="small" @click="resetList()">重置</el-button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <el-table :data="list" style="width: 100%;"  border max-height="300">
                                            <el-table-column fixed="left" label="操作" min-width="50">
                                                <template slot-scope="scope">
                                                    <el-button @click="chooseModelInfo(scope.row)" type="text" size="small">选择</el-button>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="modelInfo" label="车型名称"  min-width="350" show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="modelName" label="款式" min-width="120"></el-table-column>
                                            <el-table-column prop="seating" label="座位" min-width="80"></el-table-column>
                                            <el-table-column prop="displacement" label="排量" min-width="80"></el-table-column>
                                            <el-table-column prop="transmissionName" label="变速箱" min-width="120"></el-table-column>
                                            <el-table-column prop="vehicleNumberName" label="车厢数" min-width="80"></el-table-column>
                                            <el-table-column prop="fuelTypeName" label="燃油类型" min-width="100"></el-table-column>
                                            <el-table-column prop="fuelCapacity" label="油箱容量" min-width="80"></el-table-column>
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
                        </el-form-item>
                        <el-form-item label="颜色" prop="color">
                            <el-select clearable v-model="vehicleForm.color" :disabled="organizationFlag" placeholder="不限">
                                <el-option  v-for="e in vehicleColorList"  :key="e.value" :label="e.text" :value="e.value" ></el-option >
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车架号" prop="vin">
                            <el-input v-model="vehicleForm.vin" :disabled="organizationFlag" clearable placeholder="请输入车架号" ></el-input>
                        </el-form-item>
                        <el-form-item label="发动机号" prop="engineNo">
                            <el-input v-model="vehicleForm.engineNo" :disabled="organizationFlag" clearable placeholder="请输入发动机号"></el-input>
                        </el-form-item>
                        <el-form-item label="机动车登记证" prop="certificate">
                            <el-input v-model="vehicleForm.certificate" :disabled="organizationFlag" clearable placeholder="请输入机动车登记证"></el-input>
                        </el-form-item>
                        <el-form-item label="登记证状态" prop="certificateStatus">
                            <el-select v-model="vehicleForm.certificateStatus" :disabled="organizationFlag" clearable placeholder="请选择登记证状态">
                                <el-option :key="1" label="抵押" :value="1"></el-option>
                                <el-option :key="2" label="非抵押" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="行驶证号" prop="licenseNumber">
                            <el-input v-model="vehicleForm.licenseNumber" :disabled="organizationFlag" clearable placeholder="请输入行驶证号"></el-input>
                        </el-form-item>
                        <el-form-item label="行驶证所有人" prop="licenseName">
                            <el-input v-model="vehicleForm.licenseName" :disabled="organizationFlag" clearable placeholder="请输入行驶证所有人"></el-input>
                        </el-form-item>
                        <el-form-item label="注册城市" prop="registerCityId">
                            <city-select :value.sync="registerCity" @change="changeCity()" :disabled="organizationFlag" ref="citySelect"></city-select>
                        </el-form-item>
                        <el-form-item label="港车车牌" prop="hongkongPlate">
                            <el-input v-model="vehicleForm.hongkongPlate" :disabled="organizationFlag" clearable placeholder="请输入港车车牌"></el-input>
                        </el-form-item>
                        <el-form-item label="使用性质" prop="useNature">
                            <el-select v-model="vehicleForm.useNature" :disabled="organizationFlag" clearable placeholder="请选择使用性质">
                                <el-option  label="营运" value="1"></el-option>
                                <el-option  label="非营运" value="2"></el-option>
                                <el-option  label="网约车" value="3"></el-option>
                                <el-option  label="租赁" value="4"></el-option>
                                <el-option label="旅游客运" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车牌属性" prop="plateType">
                            <el-select v-model="vehicleForm.plateType" :disabled="organizationFlag" clearable placeholder="请选择车牌属性">
                                <el-option :key="1" label="自有" :value="1"></el-option>
                                <el-option :key="2" label="租赁" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上牌日期"  prop="registrationDate">
                            <el-date-picker
                                v-model="vehicleForm.registrationDate"
                                :disabled="organizationFlag" clearable
                                type="date"
                                placeholder="选择上牌日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="上牌费用(元)" prop="plateCost">
                            <el-input v-model="vehicleForm.plateCost" maxlength="13" clearable :disabled="organizationFlag" placeholder="请输入上牌费用"></el-input>
                        </el-form-item>
                        <el-form-item label="资产属性" prop="assetsType">
                            <el-select v-model="vehicleForm.assetsType" clearable :disabled="organizationFlag" placeholder="请选择资产属性">
                                <el-option :key="1" label="自有" :value="1"></el-option>
                                <el-option :key="2" label="租赁" :value="2"></el-option>
                                <el-option :key="3" label="挂靠" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车辆状态" v-if="vehicleStatusFlag" prop="vehicleStatus">
                            <el-select v-model="vehicleForm.vehicleStatus" :disabled="organizationFlag" placeholder="请选择车辆状态">
                                <el-option  v-for="e in vehicleStatusList"  :key="e.value" :label="e.label" :value="e.value" ></el-option >
                            </el-select>
                        </el-form-item>
                        <el-form-item label="购车日期" prop="buyDate">
                            <el-date-picker
                                v-model="vehicleForm.buyDate"
                                clearable :disabled="organizationFlag"
                                type="date"
                                placeholder="选择购车日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="购车价格(元)" prop="price">
                            <el-input v-model="vehicleForm.price" maxlength="13" clearable :disabled="organizationFlag" placeholder="请输入购车价格"></el-input>
                        </el-form-item>
                        <el-form-item label="座位数" prop="seatNum">
                            <el-input v-model="vehicleForm.seatNum" maxlength="3" clearable :disabled="organizationFlag" placeholder="座位数"></el-input>
                        </el-form-item>
                        <el-form-item label="通行证有效截止日期" prop="buyDate">
                            <el-date-picker
                                v-model="vehicleForm.passValidDate"
                                clearable :disabled="organizationFlag"
                                type="date"
                                placeholder="通行证有效截止日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="行驶证图片" prop="licensePic">
                            <upload-panel :size="2" :disabled="organizationFlag"  :file-list.sync="licenseimgs" :show-img="true"></upload-panel>
                        </el-form-item>
                        <el-form-item label="登记证图片" prop="certificatePic">
                            <upload-panel :size="2" :disabled="organizationFlag"  :file-list.sync="certificateimgs" :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <!--车辆现状-->
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('vehicleForm')">保存</el-button>
                    <!--<el-button type="primary" @click="submitForm('vehicleForm')">保存并新增</el-button>-->
                    <el-button @click="close()">关闭</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'

    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'


    export default {
        mixins: [ tool, ruleTool ],
        name:"vehicleVehicleInformationForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var intRegex = /(^[0-9]{1,13}?$)/;
            return {
                openCollapse:["1","2"],
                dialogPlateVisible: false,
                isEdit:false,
                isPlateEdit : true,
                listUrl : "base/baseVehicleModelInfo/queryList",
                vehicleModelInfoId : "",
                show : false,
                organization:[],
                licenseimgs:[],
                certificateimgs:[],
                organizationFlag: true,
                vehicleStatusFlag: true,
                serviceOrganization:[],
                vehicleColorList:[],
                organizationList:[],
                vehicleStatusList:[{
                    value: 1,
                    label: '未投入运营'
                }, {
                    value: 2,
                    label: '待租'
                }, {
                    value: 3,
                    label: '已租'
                }, {
                    value: 4,
                    label: '待出车'
                },{
                    value: 5,
                    label: '维修保养'
                }, {
                    value: 6,
                    label: '调拨中'
                }, {
                    value: 7,
                    label: '待处置'
                }, {
                    value: 8,
                    label: '申请出售中'
                },{
                    value: 9,
                    label: '出售确认中'
                }, {
                    value: 10,
                    label: '申请处置中'
                }, {
                    value: 11,
                    label: '申请使用中'
                }, {
                    value: 12,
                    label: '已出售'
                }],
                registerCity:[],
                vehicleForm : {},
                changeVehiclePlate : {},
                rules: {
                    companyId:[
                        { required: true, message: '请选择所属组织', trigger: 'change' }
                    ],
                    serviceRegionId:[
                        { required: true, message: '请选择服务单位', trigger: 'change' }
                    ],
                    plate: [
                        { required: true, message: '请输入车牌', trigger: 'blur'},
                        { validator:formRule.validatePlate, message: '车牌号格式有误', trigger: 'blur' }
                    ],
                    modelName: [
                        { required: true, message: '请输入车型', trigger: 'change' }
                    ],
                    color: [
                        { required: true, message: '请选择颜色', trigger: 'change' }
                    ],
                    vin: [
                        { required: true, message: '请输入车架号', trigger: 'change' },
                        { max: 17, message: '最多输入 17 个字符', trigger: 'change' }
                    ],
                    engineNo: [
                        { required: true, message: '请输入发动机号', trigger: 'change' },
                        { max: 30, message: '最多输入 30 个字符', trigger: 'change' }
                    ],
                    certificate: [
                        { required: true, message: '请输入机动车登记证', trigger: 'change' },
                        { max: 18, message: '最多输入 18 个字符', trigger: 'change' }
                    ],
                    certificateStatus: [
                        { required: true, message: '请选择登记证状态', trigger: 'change' }
                    ],
                    licenseNumber: [
                        { required: true, message: '请输入行驶证号', trigger: 'change' },
                        { max: 18, message: '最多输入 18 个字符', trigger: 'change' }
                    ],
                    licenseName: [
                        { required: true, message: '请输入行驶证号', trigger: 'change' },
                        { max: 20, message: '最多输入 20 个字符', trigger: 'change' }
                    ],
                    registerCityId: [
                        { required: true, message: '请选择注册城市', trigger: 'change' }
                    ],
                    hongkongPlate: [
                        { max: 10, message: '最多输入 10 个字符', trigger: 'blur' }
                    ],
                    useNature: [
                        { required: true, message: '请选择使用性质', trigger: 'change' }
                    ],
                    plateType: [
                        { required: true, message: '请选择车牌属性', trigger: 'change' }
                    ],
                    assetsType: [
                        { required: true, message: '请选择资产属性', trigger: 'change' }
                    ],
                    vehicleStatus: [
                        { required: true, message: '请选择车辆状态', trigger: 'change' }
                    ],
                    plateCost:[
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],price:[
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],seatNum:[
                        {pattern: intRegex,required: false, message: '请输入正确的座位数', trigger: 'change'}
                    ],
                }
            }
        },

        methods:{
            /*validatePlate(rule, value, callback) {
                if(this.vehicleForm.vehicleStatus == "1"){
                    return callback();
                }else {
                    if (!value){
                        return callback(new Error("非未投入运营的车辆请输入车牌"));
                    }else{
                        return callback();
                    }
                }
            },*/
            changeCity(){
                if(this.registerCity && this.registerCity.length>=2)
                    this.vehicleForm.registerCityId=this.registerCity[1];
            },
            selectVehicleColor(){
                var $this = this;
                var type = '车辆颜色';
                ajax.get("admin/dict/type/"+type).then(
                    result => {
                        if(result.length > 0){
                            $this.vehicleColorList = result;
                        }else{
                            console.log("no vehicleColor data!");
                        }
                    }
                )
            },
            /*changeVehicleStatus(){
                if (this.vehicleForm.vehicleStatus == "1")
                    this.$refs.vehicleForm.clearValidate(['plate']);
            },*/
            openModelInfo(){
                this.dialogPlateVisible = true;
                this.getList();
            },
            chooseModelInfo(bean){
                this.vehicleForm.vehicleModelInfoId = bean.id;
                // this.vehicleForm.modelName = bean.modelInfo;
                this.$set(this.vehicleForm,"modelName",bean.modelInfo);
               // this.vehicleForm.fuelCapacity = bean.fuelCapacity;
               // this.vehicleForm.fuelType = bean.fuelTypeName;
                this.dialogPlateVisible = false;
            },
            open(){
                let id = this.$route.query.id;
                this.vehicleForm = {};
                if (id){
                    this.initForm(id);
                }else{
                    this.clearValidate();
                    this.initVehicleStatus();
                }
                this.openCollapse = ["1","2"];
                this.show = true;
            },
            clearValidate(){
                if(this.$refs['vehicleForm'])
                    this.$nextTick(_ =>{
                        this.$refs['vehicleForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("base/vehicle/getVehicle/"+id).then(res => {
                    this.isPlateEdit = true;
                    this.isEdit = true;
                    this.organizationFlag = false;
                    if (res.data.companyId)
                        this.organization.push(res.data.companyId);
                    if (res.data.serviceRegionId)
                        this.serviceOrganization.push(res.data.serviceRegionId);
                    if (res.data.registerCityId) {
                        this.registerCity = res.data.registerCityId.split(",");
                        res.data.registerCityId = res.data.registerCityId.split(",")[1];
                    } else {
                        res.data.registerCityId = [];
                    }

                    if (res.data.licensePic) {
                        //转换图片
                        var licenseimg = JSON.parse(res.data.licensePic);
                        if (typeof licenseimg === 'object' && !isNaN(licenseimg.length)) {
                            this.licenseimgs = licenseimg
                        } else {
                            this.licenseimgs = [licenseimg];
                        }
                    } else {
                        this.licenseimgs = []
                    }
                    if (res.data.certificatePic){//转换图片
                        var certificateimg = JSON.parse(res.data.certificatePic);
                        if (typeof certificateimg === 'object' && !isNaN(certificateimg.length)) {
                            this.certificateimgs = certificateimg
                        } else {
                            this.certificateimgs = [certificateimg];
                        }
                    }else{
                        this.certificateimgs= []
                    }
                    this.vehicleForm = res.data;
                    this.initVehicleStatus();
                })
            },
            getCarAgeMonth(){
                if (this.vehicleForm.registrationDate){
                    var startDate = new Date(this.vehicleForm.registrationDate);
                    var endDate = new Date();
                    var days = endDate.getTime() - startDate.getTime();
                    var difMonth = days / (1000 * 60 * 60 * 24 * 30);
                    this.vehicleForm.carAgeMonth = difMonth.toFixed(1);
                }
            },
            getOrganzationList(){
                var userInfo=this.getCurrentUserInfo();
                this.organizationList=userInfo.organizationList;
            },
            submitForm(vehicleForm) {
                this.$refs[vehicleForm].validate((valid) => {
                    if (valid) {
                        if(this.licenseimgs.length>0)//转换图片
                            this.vehicleForm.licensePic=JSON.stringify(this.licenseimgs);
                        if(this.certificateimgs.length>0)//转换图片
                            this.vehicleForm.certificatePic=JSON.stringify(this.certificateimgs);

                        var url = "base/vehicle/createOrUpdate";
                        ajax.post(url, this.vehicleForm).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.close();
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            changeOrganization(data){
                if(data && data.length==1){
                    this.organizationFlag= false;
                    this.isPlateEdit=false;
                    this.vehicleForm.companyId=data[0].id;
                    this.vehicleForm=Object.assign({},this.vehicleForm);
                }else{
                    this.organizationFlag= true;
                    this.organization=[];
                    this.vehicleForm={};
                }
            },
            changeServiceOrganization(data){
                if(data && data.length==1){
                    this.vehicleForm.serviceRegionId=data[0].id;
                    this.vehicleForm=Object.assign({},this.vehicleForm);
                }
            },
            initVehicleStatus(){
                ajax.get("base/vehicle/getOrganizationConfig").then(res => {
                    if(this.vehicleForm.id){//编辑
                        if(res.data && res.data.vehicleStatusOption==1) {//中汽
                            if(this.vehicleForm.vehicleStatus==1||this.vehicleForm.vehicleStatus==2||this.vehicleForm.vehicleStatus==3){
                                this.vehicleStatusFlag=true;
                                this.vehicleStatusList=[];
                                this.vehicleStatusList.push({
                                    value: 1,
                                    label: '未投入运营'
                                }, {
                                    value: 2,
                                    label: '待租'
                                }, {
                                    value: 5,
                                    label: '维修保养'
                                });
                            }else{
                                this.vehicleStatusFlag=false;
                            }
                        }
                    }else{//新增
                        if(res.data && res.data.vehicleStatusOption==1){//中汽
                            this.vehicleStatusFlag=true;
                            this.vehicleStatusList=[];
                            this.vehicleStatusList.push({
                                value: 1,
                                label: '未投入运营'
                            }, {
                                value: 2,
                                label: '待租'
                            }, {
                                value: 5,
                                label: '维修保养'
                            });
                        }
                    }
                })
            }
        },
        mounted(){
            this.open();
            //this.getList();
            this.getOrganzationList();
            this.selectVehicleColor();
        }
    }
</script>

