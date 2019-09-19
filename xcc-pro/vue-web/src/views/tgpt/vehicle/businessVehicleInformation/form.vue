<template>
    <div class="form-panel">
        <el-form :model="vehicleForm" :rules="rules" label-position="top" ref="vehicleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆资料-->
                <el-collapse-item title="车辆资料" name="1">
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="服务组织" prop="serviceRegionId">
                            <tree-select v-model="serviceOrganization" placeholder="请选择服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeServiceOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="车牌" prop="plate">
                            <el-input v-model="vehicleForm.plate" clearable :disabled="isPlateEdit"
                                      placeholder="请输入车牌"></el-input>
                        </el-form-item>
                        <el-form-item label="发动机号" prop="engineNo">
                            <el-input v-model="vehicleForm.engineNo" :disabled="organizationFlag" clearable
                                      placeholder="请输入发动机号"></el-input>
                        </el-form-item>
                        <el-form-item label="车架号" prop="vin">
                            <el-input v-model="vehicleForm.vin" :disabled="organizationFlag" clearable
                                      placeholder="请输入车架号"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="车辆状态" prop="vehicleStatus">-->
                            <!--<el-select v-model="vehicleForm.vehicleStatus" clearable :disabled="organizationFlag"-->
                                       <!--placeholder="请选择车辆状态">-->
                                <!--<el-option :key="1" label="未投入运营" :value="1"></el-option>-->
                                <!--<el-option :key="2" label="待租" :value="2"></el-option>-->
                                <!--<el-option :key="3" label="已租" :value="3"></el-option>-->
                                <!--<el-option :key="4" label="待出车" :value="4"></el-option>-->
                                <!--<el-option :key="5" label="维修保养" :value="5"></el-option>-->
                                <!--&lt;!&ndash;<el-option :key="6" label="调拨中" :value="6"></el-option>&ndash;&gt;-->
                                <!--<el-option :key="7" label="待处置" :value="7"></el-option>-->
                                <!--&lt;!&ndash;<el-option :key="8" label="申请出售中" :value="8"></el-option>&ndash;&gt;-->
                                <!--&lt;!&ndash;<el-option :key="9" label="出售确认中" :value="9"></el-option>&ndash;&gt;-->
                                <!--&lt;!&ndash;<el-option :key="10" label="申请处置中" :value="10"></el-option>&ndash;&gt;-->
                                <!--&lt;!&ndash;<el-option :key="11" label="申请使用中" :value="11"></el-option>&ndash;&gt;-->
                                <!--<el-option :key="12" label="已出售" :value="12"></el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->


                        <el-form-item label="服役状态" prop="serviceStatus">
                            <el-select v-model="vehicleForm.serviceStatus" clearable :disabled="organizationFlag"
                                       placeholder="请选择服役状态">
                                <el-option :key="101" label="配驾" :value="101"></el-option>
                                <el-option :key="102" label="退租" :value="102"></el-option>
                                <el-option :key="103" label="以租代购" :value="103"></el-option>
                                <el-option :key="104" label="会员租车" :value="104"></el-option>
                                <el-option :key="105" label="已出售" :value="105"></el-option>
                                <el-option :key="106" label="散租" :value="106"></el-option>
                                <el-option :key="107" label="备用" :value="107"></el-option>
                                <el-option :key="108" label="其他" :value="108"></el-option>
                                <el-option :key="109" label="自驾" :value="109"></el-option>
                                <el-option :key="110" label="中汽专车" :value="110"></el-option>
                                <el-option :key="111" label="待租" :value="111"></el-option>
                                <el-option :key="112" label="待处置" :value="112"></el-option>
                                <el-option :key="113" label="公务用车" :value="113"></el-option>
                                <el-option :key="114" label="报废" :value="114"></el-option>
                                <el-option :key="115" label="拍卖" :value="115"></el-option>
                                <el-option :key="116" label="闲置" :value="116"></el-option>
                                <el-option :key="117" label="长租" :value="117"></el-option>
                                <el-option :key="118" label="短租" :value="118"></el-option>
                                <el-option :key="119" label="公务车" :value="119"></el-option>
                                <el-option :key="120" label="班车" :value="120"></el-option>
                                <el-option :key="121" label="承包" :value="121"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车型" prop="modelName">
                            <el-input v-model="vehicleForm.modelName" clearable placeholder="请输入车型"></el-input>
                        </el-form-item>
                        <el-form-item label="注册登记日期" prop="registrationDate">
                            <el-date-picker
                                v-model="vehicleForm.registrationDate"
                                :disabled="organizationFlag" clearable
                                type="date"
                                placeholder="请选择注册登记日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="所有人" prop="owner">
                            <el-input v-model="vehicleForm.owner" clearable placeholder="请输入所有人"></el-input>
                        </el-form-item>
                        <el-form-item label="荷载人数" prop="seatNum">
                            <el-input v-model="vehicleForm.seatNum" clearable placeholder="请输入荷载人数"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆所属" prop="assetsType">
                            <el-select v-model="vehicleForm.assetsType" :disabled="organizationFlag" clearable
                                       placeholder="请选择车辆所属">
                                <el-option :key="1" label="自有" :value="1"></el-option>
                                <el-option :key="2" label="租赁" :value="2"></el-option>
                                <el-option :key="3" label="挂靠" :value="3"></el-option>
                                <el-option :key="4" label="个人" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排量" prop="displacement">
                            <el-input v-model="vehicleForm.displacement" clearable placeholder="请输入排量"></el-input>
                        </el-form-item>
                        <el-form-item label="变速箱" prop="color">
                            <el-select clearable v-model="vehicleForm.transmission" :disabled="organizationFlag"
                                       placeholder="请选择变速箱类型">
                                <el-option :key="1" label="手动" value="1"></el-option>
                                <el-option :key="2" label="自动" value="2"></el-option>
                                <el-option :key="5" label="电机" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="机动车类型" prop="vehicleType">
                            <el-select v-model="vehicleForm.vehicleType" :disabled="organizationFlag" clearable
                                       placeholder="请选择车辆所属">
                                <el-option :key="1" label="大型车" :value="1"></el-option>
                                <el-option :key="2" label="小型车" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="颜色" prop="color">
                            <el-select clearable v-model="vehicleForm.color" :disabled="organizationFlag"
                                       placeholder="请选择车辆颜色">
                                <el-option v-for="e in vehicleColorList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="购置金额(万)" prop="price">
                            <el-input v-model="vehicleForm.price" clearable placeholder="请输入购置金额"></el-input>
                        </el-form-item>
                        <el-form-item label="排放标准" prop="color">
                            <el-select clearable v-model="vehicleForm.protectionStandard" :disabled="organizationFlag"
                                       placeholder="请选择排放标准">
                                <el-option :key="1" label="国V" value="1"></el-option>
                                <el-option :key="2" label="国IV" value="2"></el-option>
                                <el-option :key="4" label="国Ⅲ" value="4"></el-option>
                                <el-option :key="7" label="欧Ⅵ" value="7"></el-option>
                                <el-option :key="3" label="欧V" value="3"></el-option>
                                <el-option :key="6" label="欧IV" value="6"></el-option>
                                <el-option :key="5" label="欧Ⅲ" value="5"></el-option>
                                <!--<el-option v-for="e in protectionStandardList" :key="e.value" :label="e.text" :value="e.value"></el-option>-->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="燃油种类" prop="color">
                            <el-select clearable v-model="vehicleForm.energyType" :disabled="organizationFlag"
                                       placeholder="请选择燃油种类">
                                <el-option :key="1" label="汽油" value="1"></el-option>
                                <el-option :key="2" label="柴油" value="2"></el-option>
                                <el-option :key="6" label="电" value="6"></el-option>
                                <el-option :key="7" label="汽\电" value="7"></el-option>
                                <!--<el-option v-for="e in fuelTypeList" :key="e.value" :label="e.text" :value="e.value"></el-option>-->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="燃料类型" prop="color">
                            <el-select clearable v-model="vehicleForm.fuelType" :disabled="organizationFlag"
                                       placeholder="请选择燃料类型">
                                <el-option v-for="e in energyTypeList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="档案编号" prop="archivesNo">
                            <el-input v-model="vehicleForm.archivesNo" clearable placeholder="请输入档案编号"></el-input>
                        </el-form-item>
                        <el-form-item label="行驶证图片" prop="licensePic">
                            <upload-panel :size="2" :disabled="organizationFlag" :file-list.sync="licenseimgs"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                        <el-form-item label="登记证图片" prop="certificatePic">
                            <upload-panel :size="2" :disabled="organizationFlag" :file-list.sync="certificateimgs"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <!--车辆现状-->
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('vehicleForm')">保存</el-button>
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
    import {tool, ruleTool, formRule} from '@/utils/common'


    export default {
        mixins: [tool, ruleTool],
        name: "businessVehicleInformationForm",
        components: {TreeSelect, MoneyInput, UploadPanel, CitySelect},

        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var intRegex = /(^[0-9]{1,13}?$)/;
            return {
                openCollapse: ["1", "2"],
                dialogPlateVisible: false,
                isEdit: false,
                isPlateEdit: true,
                listUrl: "base/baseVehicleModelInfo/queryList",
                vehicleModelInfoId: "",
                show: false,
                organization: [],
                licenseimgs: [],
                certificateimgs: [],
                organizationFlag: true,
                vehicleStatusFlag: true,
                serviceOrganization: [],
                vehicleColorList: [],
                transmissionList: [],
                fuelTypeList: [],
                protectionStandardList: [],
                energyTypeList: [],
                organizationList: [],
                registerCity: [],
                vehicleForm: {},
                changeVehiclePlate: {},
                rules: {
                    companyId: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ],
                    serviceRegionId: [
                        {required: true, message: '请选择服务组织', trigger: 'change'}
                    ],
                    plate: [
                        {required: true, message: '请输入车牌', trigger: 'blur'},
                        {validator: formRule.validatePlate, message: '车牌号格式有误', trigger: 'blur'}
                    ],
                    engineNo: [
                        {required: true, message: '请输入发动机号', trigger: 'change'},
                        {max: 30, message: '最多输入 30 个字符', trigger: 'change'}
                    ],
                    vin: [
                        {required: true, message: '请输入车架号', trigger: 'change'},
                        {max: 17, message: '最多输入 17 个字符', trigger: 'change'}
                    ],
                    serviceStatus: [
                        {required: true, message: '请选择服务状态', trigger: 'change'},
                    ],

                    modelName: [
                        {required: true, message: '请输入车型', trigger: 'change'}
                    ],
                    registrationDate: [
                        {required: true, message: '请选注册登记日期', trigger: 'change'}
                    ],
                    seatNum: [
                        {pattern: intRegex, required: true, message: '请输入正确的座位数', trigger: 'change'}
                    ],
                    owner: [
                        {required: true, message: '请输入所有人', trigger: 'change'}
                    ],
                    assetsType: [
                        {required: true, message: '请选择车辆所属', trigger: 'change'}
                    ],
                    price: [
                        {pattern: moneyRegex, required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],
                }
            }
        },

        methods: {
            selectVehicleColor() {
                const $this = this;
                const type = '车辆颜色';
                ajax.get("admin/dict/type/" + type).then(
                    result => {
                        if (result.length > 0) {
                            $this.vehicleColorList = result;
                        } else {
                            console.log("no vehicleColor data!");
                        }
                    }
                )
            }, selectProtectionStandard() {
                const $this = this;
                const type = '环保标准';
                ajax.get("admin/dict/type/" + type).then(
                    result => {
                        if (result.length > 0) {
                            $this.protectionStandardList = result;
                        } else {
                            console.log("no protectionStandard data!");
                        }
                    }
                )
            },
            selectEnergyTypeList() {
                const $this = this;
                const type = '燃料类型';
                ajax.get("admin/dict/type/" + type).then(
                    result => {
                        if (result.length > 0) {
                            $this.energyTypeList = result;
                        } else {
                            console.log("no energyType data!");
                        }
                    }
                )
            },
            selectTransmission() {
                const $this = this;
                const type = '变速箱';
                ajax.get("admin/dict/type/" + type).then(
                    result => {
                        if (result.length > 0) {
                            $this.transmissionList = result;
                        } else {
                            console.log("no transmission data!");
                        }
                    }
                )
            },
            selectFuelType() {
                const $this = this;
                const type = '能源类型';
                ajax.get("admin/dict/type/" + type).then(
                    result => {
                        if (result.length > 0) {
                            $this.fuelTypeList = result;
                        } else {
                            console.log("no fuelType data!");
                        }
                    }
                )
            },
            open() {
                let id = this.$route.query.id;
                this.vehicleForm = {};
                if (id) {
                    this.initForm(id);
                } else {
                    this.clearValidate();
                }
                this.openCollapse = ["1", "2"];
                this.show = true;
            },
            clearValidate() {
                if (this.$refs['vehicleForm'])
                    this.$nextTick(_ => {
                        this.$refs['vehicleForm'].clearValidate();
                    })
            },
            initForm(id) {
                ajax.get("base/business/vehicle/getVehicle/" + id).then(res => {
                    this.isPlateEdit = true;
                    this.isEdit = true;
                    this.organizationFlag = false;
                    if (res.data.companyId)
                        this.organization.push(res.data.companyId);
                    if (res.data.serviceRegionId)
                        this.serviceOrganization.push(res.data.serviceRegionId);
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
                    if (res.data.certificatePic) {//转换图片
                        var certificateimg = JSON.parse(res.data.certificatePic);
                        if (typeof certificateimg === 'object' && !isNaN(certificateimg.length)) {
                            this.certificateimgs = certificateimg
                        } else {
                            this.certificateimgs = [certificateimg];
                        }
                    } else {
                        this.certificateimgs = []
                    }
                    this.vehicleForm = res.data;
                })
            },
            getCarAgeMonth() {
                if (this.vehicleForm.registrationDate) {
                    var startDate = new Date(this.vehicleForm.registrationDate);
                    var endDate = new Date();
                    var days = endDate.getTime() - startDate.getTime();
                    var difMonth = days / (1000 * 60 * 60 * 24 * 30);
                    this.vehicleForm.carAgeMonth = difMonth.toFixed(1);
                }
            },
            getOrganzationList() {
                var userInfo = this.getCurrentUserInfo();
                this.organizationList = userInfo.organizationList;
            },
            submitForm(vehicleForm) {
                debugger;
                this.$refs[vehicleForm].validate((valid) => {
                    if (valid) {
                        if (this.licenseimgs.length > 0)//转换图片
                            this.vehicleForm.licensePic = JSON.stringify(this.licenseimgs);
                        if (this.certificateimgs.length > 0)//转换图片
                            this.vehicleForm.certificatePic = JSON.stringify(this.certificateimgs);

                        var url = "base/business/vehicle/save";
                        ajax.post(url, this.vehicleForm).then(
                            (res) => {
                                if (res.status == 0) {
                                    this.$message({message: '保存成功！', type: 'success'});
                                    this.close();
                                } else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            changeOrganization(data) {
                if (data && data.length == 1) {
                    this.organizationFlag = false;
                    this.isPlateEdit = false;
                    this.vehicleForm.companyId = data[0].id;
                    this.vehicleForm = Object.assign({}, this.vehicleForm);
                } else {
                    this.organizationFlag = true;
                    this.organization = [];
                    this.vehicleForm.companyId = null;
                    // this.vehicleForm = {};
                }
            },
            changeServiceOrganization(data) {
                debugger
                if (data && data.length == 1) {
                    this.vehicleForm.serviceRegionId = data[0].id;
                    this.vehicleForm = Object.assign({}, this.vehicleForm);
                } else {
                    this.serviceOrganization = [];
                    this.vehicleForm.serviceRegionId = null;
                }
            },

        },
        mounted() {
            this.open();
            this.getOrganzationList();
            this.selectVehicleColor();
            // this.selectTransmission();
            // this.selectFuelType();
            this.selectEnergyTypeList();
            // this.selectProtectionStandard();
        }
    }
</script>

