<template>
    <div class="form-panel">
        <el-form :model="editForm" :rules="rules" label-position="top" ref="editForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="保险公司信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="管理公司" prop="companyId">
                            <el-select v-model="editForm.companyId" filterable placeholder="请选择所属组织">
                                <el-option v-for="(item) in organization" :label="item.name" :key="item.id" :value="item.id"></el-option>
                            </el-select>
                            <!--<tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree"
                                         @change="changeOrganization"></tree-select>-->
                        </el-form-item>
                        <el-form-item label="公司名称" prop="name">
                            <el-input v-model="editForm.name" clearable maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="简称" prop="shortName">
                            <el-input v-model="editForm.shortName" clearable maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contact">
                            <el-input v-model="editForm.contact" clearable maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="editForm.contactPhone" clearable maxlength="11"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="editForm.address" clearable maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="主要业务描述" prop="businessDescription">
                            <el-input type="textarea" v-model="editForm.businessDescription" clearable maxlength="255"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div  class="left-row">
                <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>

    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        mixins: [ tool, ruleTool ],
        name:"editForm",
        components : {TreeSelect},
        data: function () {
            return {
                openCollapse:["1","2"],
                organization:[],
                show: false,
                rules: {
                    name: [
                        {required: true, message: "请输入公司名称", trigger: "blur"}
                    ],
                    contact: [
                        {required: true, message: "请输入联系人", trigger: "blur"}
                    ],
                    contactPhone: [
                        {required: true, message: "请输入联系电话", trigger: "blur"},
                        {validator: formRule.isMobilePhone, message: "手机号码格式有误", trigger: "blur"}
                    ],
                    companyId: [
                        {required: true, message: "请选择所属组织", trigger: "change"}
                    ]
                },
                editForm: {},
                companys: []
            }
        },
        mounted: function () {
            this.open();
        },
        methods: {
            open(){
                if(this.$refs["editForm"]) {
                    this.$refs["editForm"].clearValidate();
                }
                let id = this.$route.query.id;
                if(id) {
                    ajax.get('/base/insuranceCompany/getManagementCompanyList').then(rs => {
                        this.organization = rs.data;
                        ajax.get('/base/insuranceCompany/detail/' + id).then(rs => {
                            this.editForm = rs.data;
                        });
                    });
                }else{
                    this.getManagementCompanyList();
                }
                this.show = true;
                //获取当前用户所属组织
                //this.companys = this.getCurrentUserInfo().organizationList;
            },
            getManagementCompanyList(){
                ajax.get('/base/insuranceCompany/getManagementCompanyList').then(rs => {
                    this.organization = rs.data;
                    if(!this.$route.query.id){
                        if(this.organization.length>0)
                            this.editForm.companyId=this.organization[0].id;
                        this.editForm=Object.assign({},this.editForm);
                    }
                });
            },
            submitForm(editForm){
                let data = this.extend(true,{},this.editForm);
                //data.companyId = data.companyId.join();
                this.$refs[editForm].validate((valid) => {
                    if(!valid) {
                        return false;
                    }
                    let url = "";
                    if(this.editForm.id != null && this.editForm.id != ""){
                        url = "base/insuranceCompany/update";
                    }else{
                        url = "base/insuranceCompany/insert";
                    }
                    ajax.post(url, data) .then(res => {
                        if(res.status == 0){
                            this.$message({message: '保存成功！',type: 'success'});
                            this.close();
                        }else {
                            this.$message.error(res.message);
                        }
                    });
                });
            },
            /*changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.editForm.companyId=this.organization[0];
                    this.editForm=Object.assign({},this.editForm);
                }
            }*/
        }
    }
</script>

