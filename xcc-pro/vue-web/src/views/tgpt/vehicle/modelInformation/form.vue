<template>
    <div class="form-panel">
        <el-form :model="modelForm" :rules="rules" label-position="top" ref="modelForm" label-width="100px">
            <el-collapse v-model="openCollapse" @change="handleChange">
                <!--车型资料-->
                <el-collapse-item title="车型资料" name="1">
                    <div class="flex-panel">
                        <el-form-item label="车型名称">
                            <el-input v-model="modelForm.modelInfo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="品牌" prop="brandName" >
                            <el-input v-model="modelForm.brandName" @click.native="openVehicleBrand()"
                                      placeholder="请选择" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="系列" prop="seriesName" >
                            <el-input v-model="modelForm.seriesName" @click.native="openVehicleSeries()"
                                      placeholder="请选择" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="款式" prop="style">
                            <el-input v-model="modelForm.style" maxlength="20" @change="changeStyle"></el-input>
                        </el-form-item>
                        <el-form-item label="车厢数">
                            <el-select v-model="modelForm.vehicleNumber" placeholder="请选择车厢数">
                                <el-option v-for="e in vehicleNumberList" :key="e.value" :label="e.label"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排量" prop="displacement">
                            <el-input v-model="modelForm.displacement" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="变速箱" prop="transmission">
                            <el-select v-model="modelForm.transmission" placeholder="请选择变速箱"
                                       @change="changeTransmission">
                                <el-option v-for="e in transmissionList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版型名" prop="versionName">
                            <el-input v-model="modelForm.versionName" maxlength="20"
                                      @change="changeVersionName"></el-input>
                        </el-form-item>
                        <el-form-item label="座位数">
                            <el-input v-model="modelForm.seating" min="0" type="number" maxlength="6"
                                      oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
                        </el-form-item>
                        <el-form-item label="车身尺寸">
                            <el-input v-model="modelForm.vehicleSize" maxlength="50"></el-input>
                            <label class="control-label">如：4885*1840*1455</label>
                        </el-form-item>
                        <el-form-item label="燃油类型" prop="fuelType">
                            <el-select v-model="modelForm.fuelType" placeholder="请选择燃油类型">
                                <el-option v-for="e in fuelTypeList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="环保标准">
                            <el-select clearable v-model="modelForm.protectionStandard" placeholder="请选择环保标准">
                                <el-option v-for="e in protectionStandardList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="能源类型">
                            <el-select clearable v-model="modelForm.energyType" placeholder="请选择能源类型">
                                <el-option v-for="e in energyTypeList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车身结构">
                            <el-select clearable v-model="modelForm.vehicleStructure" placeholder="请选择车身结构">
                                <el-option v-for="e in vehicleStructureList" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="油箱容量（升）" prop="fuelCapacity">
                            <el-input v-model="modelForm.fuelCapacity" min="0" type="number"
                                      oninput="if(value.length>6)value=value.slice(0,6)">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="综合油耗（L/100km）">
                            <el-input v-model="modelForm.combined" min="0" type="number"
                                      oninput="if(value.length>6)value=value.slice(0,6)">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="整车质保（年）">
                            <el-input v-model="modelForm.vehicleWarrantyYear" min="0" type="number"
                                      oninput="if(value.length>6)value=value.slice(0,6)">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="整车质保（公里）">
                            <el-input v-model="modelForm.vehicleWarrantyKm" min="0" type="number"
                                      oninput="if(value.length>9)value=value.slice(0,9)">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="轮胎尺寸（寸）">
                            <el-input v-model="modelForm.tireSize" min="0" type="number"
                                      oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
                        </el-form-item>
                        <el-form-item label="备胎规格">
                            <el-select v-model="modelForm.spareTireType" placeholder="请选择备胎规格">
                                <el-option v-for="e in spareTireTypeList" :key="e.value" :label="e.label"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <!--图片-->
                <el-collapse-item title="车型图片" name="2">
                    <upload-panel :size="10" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="pics"
                                  :show-img="true"></upload-panel>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('modelForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
        <vehicle-brand-dialog ref="vehicleBrandDialog" @load="selectVehicleBrand"></vehicle-brand-dialog>
        <vehicle-series-dialog ref="vehicleSeriesDialog" @load="selectVehicleSeries"></vehicle-series-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'
    import $ from 'jquery-slim'
    import vehicleBrandDialog from "@/views/tgpt/vehicle/modelInformation/vehicleBrandDialog";
    import vehicleSeriesDialog from "@/views/tgpt/vehicle/modelInformation/vehicleSeriesDialog";

    export default {
        mixins: [tool, ruleTool],
        name: "demoForm",
        components: {
            vehicleBrandDialog,vehicleSeriesDialog,
            TreeSelect, MoneyInput, UploadPanel},
        data() {
            return {
                modelForm: {},
                show: false,
                id: "",
                type: "add",
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                transmissionList: [],
                fuelTypeList: [],
                protectionStandardList: [],
                energyTypeList: [],
                vehicleStructureList: [],
                openCollapse: ["1", "2", ],
                activeNames: ['1', '2',],
                seriesList: [],
                pics: [],
                vehicleNumberList: [{
                    value: 1,
                    label: '两厢'
                }, {
                    value: 2,
                    label: '三厢'
                }],
                spareTireTypeList: [{
                    value: 1,
                    label: '全尺寸'
                }, {
                    value: 2,
                    label: '非全尺寸'
                }],
                rules: {
                    seriesName: [
                        {required: true, message: '请选择系列', trigger: 'change'}
                    ],
                    brandName: [
                        {required: true, message: '请选择车型', trigger: 'change'}
                    ],
                    style: [
                        {required: true, message: '请输入款式', trigger: 'change'}
                    ],
                    displacement: [
                        {required: true, message: '请输入排量', trigger: 'change'}
                    ],
                    transmission: [
                        {required: true, message: '请选择变速箱', trigger: 'change'}
                    ],
                    versionName: [
                        {required: true, message: '请输入版型名', trigger: 'change'}
                    ],
                    fuelType: [
                        {required: true, message: '请选择燃油类型', trigger: 'change'}
                    ],
                    fuelCapacity: [
                        {required: true, message: '请输入油箱容量', trigger: 'change'}
                    ],
                }
            }
        },

        watch: {
            modelForm: {
                handler(curVal, oldVal) {
                    this.getModelInfo();
                },
                deep: true
            },
        },
        mounted: function () {
            this.initTransmissionList();
            this.initFuelTypeList();
            this.initEnvironmentalStandardList();
            this.initEnergyTypeList();
            this.initVehicleStructureList();
            this.initSeriesList();
            this.open();
        },
        methods: {
            openVehicleBrand(){
                this.$refs.vehicleBrandDialog.open();
            },
            openVehicleSeries(){
                if(this.modelForm.vehicleBrandId){
                    this.$refs.vehicleSeriesDialog.open(this.modelForm.vehicleBrandId);
                }else{
                    this.$message.error("请选择车型");
                }
            },
            selectVehicleBrand(row){
                debugger
                this.modelForm.seriesName='';
                this.modelForm.vehicleSeriesId='';
                this.modelForm.brandName=row.name;
                this.modelForm.vehicleBrandId=row.id;
                this.modelForm=Object.assign({},this.modelForm);
            },
            selectVehicleSeries(row){
                this.modelForm.seriesName=row.name;
                this.modelForm.vehicleSeriesId=row.id;
                this.modelForm=Object.assign({},this.modelForm);
            },
            initTransmissionList() {
                ajax.get('admin/dict/type/变速箱').then(rs => {
                    if (rs.length > 0) {
                        this.transmissionList = rs;
                    } else {
                        console.log("no transmission data!");
                    }
                });
            },
            initFuelTypeList() {
                ajax.get('admin/dict/type/燃油类型').then(rs => {
                    if (rs.length > 0) {
                        this.fuelTypeList = rs;
                    } else {
                        console.log("no fuelType data!");
                    }
                });
            },
            initEnvironmentalStandardList() {
                ajax.get('admin/dict/type/能源类型').then(rs => {
                    if (rs.length > 0) {
                        this.energyTypeList = rs;
                    } else {
                        console.log("no energyType data!");
                    }
                });
            },
            initEnergyTypeList() {
                ajax.get('admin/dict/type/环保标准').then(rs => {
                    if (rs.length > 0) {
                        this.protectionStandardList = rs;
                    } else {
                        console.log("no protectionStandard data!");
                    }
                });
            },
            initVehicleStructureList() {
                ajax.get('admin/dict/type/车身结构').then(rs => {
                    if (rs.length > 0) {
                        this.vehicleStructureList = rs;
                    } else {
                        console.log("no vehicleStructure data!");
                    }
                });
            },
            initSeriesList() {
                ajax.get('base/baseVehicleModelInfo/selectSeriesList/').then(rs => {
                    if (rs.length > 0) {
                        this.seriesList = rs;
                    } else {
                        console.log("no seriesList data!");
                    }
                });
            },
            //改变车系
            changeSeries(item) {
                this.modelForm.brandName = item.brandName;
                this.modelForm.seriesName = item.seriesName;
                this.modelForm.vehicleSeriesId=item.seriesId;
            },
            //改变车厢数
            changeVehicleNumber(vId) {
                let obj = {};
                obj = this.vehicleNumberList.find((item) => {
                    return item.value === vId;
                });
                this.modelForm.vehicleNumberName = obj.label;
            },
            //改变变速箱
            changeTransmission(vId) {
                let obj = {};
                obj = this.transmissionList.find((item) => {
                    return item.value === vId;
                });
                this.modelForm.transmissionName = obj.text;
            },
            //改变款式
            changeStyle() {
                this.getModelInfo();
            },
            //改变版型名
            changeVersionName() {
                this.getModelInfo();
            },
            //生成车型信息
            getModelInfo() {
                var modelInfo = "";
                if (this.modelForm.brandName) {
                    modelInfo = modelInfo + this.modelForm.brandName;
                }
                if (this.modelForm.seriesName) {
                    modelInfo = modelInfo + this.modelForm.seriesName;
                }
                if (this.modelForm.style) {
                    modelInfo = modelInfo + this.modelForm.style;
                }
                if (this.modelForm.versionName) {
                    modelInfo = modelInfo + this.modelForm.versionName;
                }
                this.$set(this.modelForm, "modelInfo", modelInfo);
            },
            open() {
                this.id = this.$route.query.id;
                this.show = true;
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
                this.pic = [];
                ajax.get('base/baseVehicleModelInfo/getDetail?id=' + id).then(rs => {
                    if (rs.status == 0) {
                        this.modelForm = rs.data;
                        if (rs.data && rs.data.pic && rs.data.pic.length > 0)//转换图片
                        {
                            this.pics = JSON.parse(rs.data.pic);
                        }
                    } else {
                        this.$message.error(rs.message);
                    }
                });
            },
            handleChange(val) {
                console.log(val);
            },
            submitForm(modelForm) {
                this.$refs[modelForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.pics.length > 0)//转换图片
                    {
                        this.modelForm.pic = JSON.stringify(this.pics);
                    }
                    ajax.post("base/baseVehicleModelInfo/addOrEdit", this.modelForm).then((res) => {
                        if (res.status == 0) {
                            this.$message({message: '保存成功！', type: 'success'});
                            this.close(modelForm);
                            this.$emit('load');
                        } else {
                            this.$message.error(res.message);
                        }
                    });

                });
            },
        }
    }
</script>

