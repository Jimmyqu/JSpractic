<template>
    <div class="form-panel">
        <el-form :model="brandForm" :rules="rules" label-position="top"  ref="brandForm"  label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="车型品牌" name="1" >
                    <div class="flex-panel">
                        <!--<el-form-item label="管理公司" prop="companyId">-->
                        <!--<el-select v-model="brandForm.companyId" clearable placeholder="请选择">-->
                        <!--<el-option-->
                        <!--v-for="item in companys"-->
                        <!--:key="item.organizationId"-->
                        <!--:label="item.organizationName"-->
                        <!--:value="item.organizationId">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="品牌名称" prop="name">
                            <el-input v-model="brandForm.name" maxlength="50" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="品牌图标" prop="icon">
                            <upload-panel :size="1" :file-list.sync="iconPhoto" accept=".png,.jpg" :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="left-row">
            <el-button type="primary" @click="submitForm('brandForm')">保存</el-button>
            <el-button @click="close()">返回</el-button>
        </div>
    </div>
</template>

<style>
    .user-edit-panel {

    }
    .user-edit-panel .el-dialog__header {
        display: none;
    }
    .user-edit-panel .el-dialog__body {
        height: auto;
        padding: 0 20px;
    }
    .user-edit-panel .el-dialog__footer {
        text-align: left;
        padding-left: 20px;
        padding-top: 0;
    }
    .user-edit-panel .el-dialog {
        background-color: #f0f0f0;
    }
</style>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data(){
            return {
                openCollapse:["1"],
                brandForm: {},
                iconPhoto:[],
                show:false,
                //companys: [],
                rules: {
                    companyId: [
                        { required: true, message: '请选择管理公司', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入品牌名称', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            open(){
                var $this = this;
                $this.openCollapse = ["1"];
                $this.show = true;
                $this.iconPhoto = [];

                if(this.$route.query.id){
                    ajax.get('/base/vehicleBrand/detail?id=' + this.$route.query.id).then(
                        function (res) {
                            if(res.status == 0 && res.data != null){
                                $this.brandForm = res.data;
                                if(res.data.icon){
                                    $this.iconPhoto.push(JSON.parse(res.data.icon));
                                }
                            }
                        }
                    )
                }
            },
            handleChange(val) {
                console.log(val);
            },
            submitForm(brandForm) {
                var $this = this;
                var data = $this.brandForm;
                this.$refs[brandForm].validate((valid) => {
                    if (valid) {
                        if($this.iconPhoto != null && $this.iconPhoto.length > 0 && $this.iconPhoto[0] != null){
                            var object = {};
                            object['name'] = $this.iconPhoto[0].name;
                            object['path'] = $this.iconPhoto[0].path;
                            object['filedomain'] = $this.iconPhoto[0].filedomain;
                            $this.brandForm.icon = JSON.stringify(object);
                        }else {
                            $this.brandForm.icon = "";
                        }
                        var url = "/base/vehicleBrand/addOrEdit";
                        if(!$this.brandForm.id){
                            $this.brandForm.id = "add";
                        }
                        ajax.post(url, data).then(
                            res => {
                                if(res.status == 0){
                                    $this.$message({message: '保存成功！',type: 'success'});
                                    $this.close(brandForm);
                                    $this.$emit('load');
                                }else if(res.status == 1000){
                                    $this.$message.error("该品牌名称已存在");
                                }else {
                                    $this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
        },
        mounted(){
            this.open();
            console.log(this.brandForm)
        }
    }
</script>

