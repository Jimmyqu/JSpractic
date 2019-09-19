<template>
    <div class="form-panel">
        <el-form :model="supplierForm" :rules="rules" label-position="top" ref="supplierForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="供应商名称" prop="name">
                            <el-input v-model="supplierForm.name" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="供应商状态" prop="supplierStatus">
                            <el-select v-model="supplierForm.supplierStatus" placeholder="请选择" clearable>
                                <el-option label="正常" :value="1"></el-option>
                                <el-option label="停用" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select @change="chooserOrgId" v-model="companyIds" placeholder="请选择组织" type="one" url="/admin/organization/tree"></tree-select>
                        </el-form-item>

                        <el-form-item label="供应商类型" prop="supplierType">
                            <el-select v-model="supplierForm.supplierType" placeholder="请选择" clearable>
                                <el-option v-for="item in supplierTypes" :key="item.value" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="联系人" prop="contact">
                            <el-input v-model="supplierForm.contact" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="联系手机号" prop="phoneNo">
                            <el-input v-model="supplierForm.phoneNo" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="supplierForm.contactPhone" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="联系地址" class="small" prop="contactAddress">
                            <el-input type="textarea" v-model="supplierForm.contactAddress" placeholder="请输入"
                                      clearable autocomplete="off"></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>
            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="save('supplierForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
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
        name:"supplierInformationForm",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data() {
            return {
                show: false,
                activeNames: ["1", "2"],
                type: "add",
                companyList: [],
                qualificationList: [],
                supplierId: "",
                companyIds:[],
                supplierForm: {
                    id: "",
                    name: "",
                    supplierStatus: "",
                    companyId: "",
                    supplierType: "",
                    contact: "",
                    phoneNo: "",
                    contactPhone: "",
                    contactAddress: "",
                },
                supplierTypes:[],
                rules: {
                    name: [
                        {required: true, message: '供应商名称不能为空', trigger: 'blur'},
                        {max: 50, message:"长度不能超过50字符", trigger: "blur"}
                    ],
                    supplierStatus: [
                        {required: true, message: '供应商状态不能为空', trigger: 'change'}
                    ],
                    companyId: [
                        {required: true, message: '所属组织不能为空', trigger: 'change'}
                    ],
                    supplierType: [
                        {required: true, message: '供应商类型不能为空', trigger: 'change'}
                    ],
                    contact: [
                        {required: true, message: '联系人不能为空', trigger: 'blur'},
                        {max: 20, message:"长度不能超过20字符", trigger: "blur"}
                    ],
                    phoneNo: [
                        {validator: formRule.isMobilePhone, message: '请输入正确的联系手机号', trigger: 'blur'}
                    ],
                    contactPhone: [
                        {validator: formRule.isFixedPhone, message: '请输入正确的联系电话', trigger: 'blur'}
                    ],
                    contactAddress: [
                        {required: true, message: '联系地址不能为空', trigger: 'blur'},
                        {max: 100, message:"长度不能超过100字符", trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            open() {
                this.supplierId = this.$route.query.id;
                this.show = true;
                //初始化数据,编辑页弹出时mounted方法不会执行
                this.initCompanyData();
                this.initFormData();
                //清空表单验证
                if (this.$refs["supplierForm"]) {
                    this.$refs["supplierForm"].clearValidate();
                }
            },
            initCompanyData: function () {
                let $this = this;
                $this.companyList = this.getCurrentUserInfo().organizationList;
            },
            initFormData: function () {
                if (this.supplierId) {//编辑
                    this.type = "edit";
                    this.getFormData(this.supplierId);
                } else {//新增
                    this.selectSupplierType();
                    this.type = "add";
                    //清空表单数据
                    this.supplierForm = {
                        id: "",
                        name: "",
                        supplierStatus: "",
                        companyId: "",
                        supplierType: "",
                        contact: "",
                        phoneNo: "",
                        contactPhone: "",
                        contactAddress: ""
                    };
                }
            },

            /*选取用户组织*/
            chooserOrgId(){
                if(this.companyIds.length>0){
                    this.supplierForm.companyId = this.companyIds[0];
                }
            },

            selectSupplierType() {
                var $this = this;
                ajax.get("admin/dict/type/供应商类型?time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.supplierTypes = result;
                    } else {
                        $this.supplierTypes = [];
                    }
                });
            },

            getFormData: function (id) {
                let $this = this;
                ajax.get("base/supplier/detail/" + id).then(result =>{
                    if (result.status == 0) {
                        $this.supplierForm = result.data;
                        $this.supplierForm.supplierType = $this.supplierForm.supplierType+'';
                        $this.companyIds.push(result.data.companyId);
                        $this.selectSupplierType();
                    } else {
                        $this.$message.error(result.message);
                    }
                });
            },
            save: function (formName) {
                let $this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {//校验通过
                        let postData = this.supplierForm;
                        ajax.post("base/supplier/" + $this.type, postData).then(result => {
                            if (result.status == 0) {
                                $this.$message.success('保存成功');
                                //返回列表页面,并刷新列表
                                $this.close();
                                $this.$emit("load");
                                //清空已保存表单
                                $this.supplierForm = {
                                    id: "",
                                    name: "",
                                    supplierStatus: "",
                                    companyId: "",
                                    supplierType: "",
                                    contact: "",
                                    phoneNo: "",
                                    contactPhone: "",
                                    contactAddress: "",
                                };
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
        },
        mounted(){
            this.open();
        }
    }
</script>

