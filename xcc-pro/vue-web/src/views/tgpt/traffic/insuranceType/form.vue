<template>
    <div class="form-panel">
        <el-form :model="editForm" :rules="rules" label-position="top" ref="editForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="保单险种信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="editForm.name" clearable maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"trafficInsuranceTypeEdit",
        data: function () {
            return {
                openCollapse:["1","2"],
                id:"",
                show: false,
                rules: {
                    name: [
                        {required: true, message: "请输入名称", trigger: "blur"}
                    ]
                },
                editForm: {},
                companys: []
            }
        },
        beforeMount: function () {
            this.init();
            this.open();
        },
        mounted: function () {
        },
        methods: {
            //数据初始化
            init() {
                /*ajax.get("base/insuranceType/getManagementCompanyList").then(result=>{
                    if(result.status == 0){
                        this.companys = result.data;
                        if(this.companys && this.companys.length > 0) {
                            this.editForm.companyId = this.companys[0].id;
                        }
                    }
                });*/

            },
            open(){
                /*if(this.$refs["editForm"]) {
                    this.$refs["editForm"].clearValidate();
                }

                this.show = true;*/
                //this.partsForm.id = id;
                if(this.$route.query.id){
                    this.id=this.$route.query.id;
                    this.getUpdateData(this.$route.query.id);
                }
            },
            getUpdateData(id) {

                ajax.get("base/insuranceType/detail/" + id).then(result=>{
                    if(result.status == 0) {
                        this.editForm = result.data;
                    } else {
                        this.showMessage(result.message,"error");
                    }
                   /* this.$nextTick(_ =>{
                        if(this.$refs["editForm"]) {
                            this.$refs["editForm"].clearValidate();
                        }
                    });*/
                });

            },
            submitForm(){
                this.$refs["editForm"].validate((valid) => {
                    if(!valid) {
                        return false;
                    }
                    var id = this.id;
                    var url = "";
                    if(null != id && '' != id){
                        this.editForm.id=id;
                        url = "base/insuranceType/update";
                    }else{
                        url = "base/insuranceType/insert";
                    }
                    ajax.post(url,this.editForm).then(result=>{
                        if(result.status == 0){
                            this.showMessage("保存成功","success")
                            this.close();
                            this.$emit('load');
                        } else {
                            this.showMessage(result.message,"error");
                        }
                    });

                });

            }
        }
    }
</script>

