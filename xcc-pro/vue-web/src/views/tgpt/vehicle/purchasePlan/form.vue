<template>
    <div class="form-panel">
        <el-form :model="purchasePlanForm" :rules="rules" label-position="top" ref="purchasePlanForm"
                 label-width="100px">
            <el-collapse v-model="activeNames">
                <!--车辆采购单基本信息-->
                <el-collapse-item title="车辆采购单基本信息" name="0">
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="organizationId" :rules="rules.required('请选择所属组织')">
                            <tree-select v-model="purchasePlanForm.organizationId" placeholder="请选择组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"></tree-select>
                        </el-form-item>

                        <el-form-item label="计划采购车型" prop="vehicleModelInfoId" :rules="rules.required('请选择采购车型')">
                            <BrandSelect ref="brandSelect" :disabledInit="true"
                                         v-model="purchasePlanForm.vehicleModelInfoId" level="3"></BrandSelect>
                        </el-form-item>
                        <el-form-item label="计划采购车台数" prop="needPurchaseQuantity" >
                            <el-input v-model="purchasePlanForm.needPurchaseQuantity" type="number"
                                      maxlength=6 oninput="if(value.length>6)value=value.slice(0,6)" placeholder="请输入"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="颜色" prop="carColor">
                            <el-select v-model="purchasePlanForm.carColor" placeholder="请选择">
                                <el-option v-for="item in carColorList" :key="item.value"
                                           :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车辆新旧" prop="newOrOldCar" :rules="rules.required('请选择')">
                            <el-select v-model="purchasePlanForm.newOrOldCar" placeholder="请选择"
                                       @change="changeNewOrOldCar(purchasePlanForm.newOrOldCar)">
                                <el-option label="旧车" :value="0"></el-option>
                                <el-option label="新车" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车龄（月）" prop="carAge" >
                            <el-input v-model="purchasePlanForm.carAge" type="number"
                                      maxlength=3 oninput="if(value.length>3)value=value.slice(0,3)" placeholder="请输入"
                                      clearable :disabled="carAgeDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="服务城市" prop="serviceCityId" :rules="rules.required('请选择服务城市')">
                            <city-select :value.sync="purchasePlanForm.serviceCityId" ref="citySelect"
                                         placeholder="请选择"></city-select>
                        </el-form-item>
                        <el-form-item label="计划交车日期" prop="deliveryDate" :rules="rules.required('请选择交车日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="purchasePlanForm.deliveryDate"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="加装需求" prop="retrofitRequirementOptions">
                            <el-select v-model="purchasePlanForm.retrofitRequirementOptions" multiple
                                       placeholder="请选择">
                                <el-option
                                    v-for="item in retrofitRequirementOptionsList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采购说明" prop="explanation" class="big">
                            <el-input type="textarea" v-model="purchasePlanForm.explanation" placeholder="请输入"
                                      maxlength=100></el-input>
                        </el-form-item>
                        <el-form-item label="其他加装要求" prop="retrofitRequirement" class="big">
                            <el-input type="textarea" v-model="purchasePlanForm.retrofitRequirement" placeholder="请输入"
                                      maxlength=50></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="save('purchasePlanForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>

</template>

<script>
    import BrandSelect from '@/components/BrandSelect/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "purchasePlanForm",
        components: {TreeSelect, MoneyInput, UploadPanel, BrandSelect, CitySelect},
        data() {
            let $this = this;
            return {
                purchasePlanForm: {
                    serviceCityId: [],
                    vehicleModelInfoId: [],
                    retrofitRequirementOptions: [],
                },//表单数据
                activeNames: ["0"],//默认打开的面板
                carColorList: [],
                retrofitRequirementOptionsList: [],
                carAgeDisabled: true,
                rules:{
                    needPurchaseQuantity:[{ required: true, message: '请输入车辆数', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }],
                    carAge:[{ required: true, message: '请输入月数', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }],
                }
            }
        },
        mounted() {
            ajax.get('/admin/dict/type/车辆颜色').then(rs => {
                this.carColorList = rs;
            });
            ajax.get('/admin/dict/type/加装要求选项').then(rs => {
                this.retrofitRequirementOptionsList = rs;
            });
            this.open();
        },
        methods: {
            open() {
                this.id = this.$route.query.id;
                this.initFormData();
            },
            initFormData: function () {
                if (this.id) {//编辑
                    this.type = "edit";
                    this.getFormData(this.id);
                } else {
                    this.$refs.brandSelect.init();
                    this.clearValidate();
                    this.type = "add";
                }
            },
            clearValidate() {
                if (this.$refs['purchasePlanForm'])
                    this.$nextTick(_ => {
                        this.$refs['purchasePlanForm'].clearValidate();
                    })
            },
            getFormData: function (id) {
                let $this = this;
                ajax.get("core/purchasePlan/detail/" + id).then(result => {
                    if (result.status == 0) {

                        if (result.data.organizationId) {
                            result.data.organizationId = [result.data.organizationId];
                        }
                        if (result.data.serviceCityId) {
                            result.data.serviceCityId = result.data.serviceCityId.split(",");
                        }
                        if (result.data.vehicleModelInfoId) {
                            result.data.vehicleModelInfoId = result.data.vehicleModelInfoId.split(",");
                        }
                        if (result.data.retrofitRequirementOptions) {
                            result.data.retrofitRequirementOptions = result.data.retrofitRequirementOptions.split(',');
                        }else{
                            result.data.retrofitRequirementOptions =[]
                        }
                        if (result.data.newOrOldCar=="0"){
                            this.carAgeDisabled=false;
                        }
                        $this.purchasePlanForm = result.data;
                        this.$refs.brandSelect.init();
                        console.log($this.purchasePlanForm);
                    } else {
                        this.$message.error(result.message);
                    }
                })
            },
            save: function (formName) {
                let $this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {//校验通过

                        let params = this.extend(true, {}, this.purchasePlanForm);
                        console.log(params)
                        console.log(params.retrofitRequirementOptions)
                        params.organizationId = params.organizationId.join();

                        params.retrofitRequirementOptions = params.retrofitRequirementOptions.join(',');
                        if (params.vehicleModelInfoId && params.vehicleModelInfoId.length == 3) {
                            params.vehicleModelInfoId = params.vehicleModelInfoId[2];
                        } else {
                            this.showMessage("请选择车型名称", "error");
                            return false;
                        }
                        if (params.serviceCityId && params.serviceCityId.length == 2) {
                            params.serviceCityId = params.serviceCityId[1];
                        } else {
                            this.showMessage("请选择服务城市", "error");
                            return false;
                        }
                        ajax.post("core/purchasePlan/" + $this.type, params).then(result => {
                            if (result.status == 0) {
                                $this.$message.success('保存成功');
                                //返回列表页面,并刷新列表
                                $this.close();
                                $this.$emit("load");
                                //清空已保存表单
                            } else {
                                $this.$message.error('保存失败,请重新保存');
                            }
                        });
                    } else {
                        // $this.$message.error('请正确填写数据后保存');
                        return false;
                    }
                });
            },
            changeNewOrOldCar: function (newOrOldCar) {
                let $this = this;
                if (newOrOldCar == "1") { //新车
                    $this.$set($this.purchasePlanForm, "carAge", 0);
                    $this.carAgeDisabled = true;
                } else {
                    $this.carAgeDisabled = false;
                }
            }
        }
    }
</script>

