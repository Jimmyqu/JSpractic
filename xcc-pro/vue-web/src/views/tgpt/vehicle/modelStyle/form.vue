<template>
    <div class="form-panel">
        <el-form :model="styleForm" :rules="rules" label-position="top"  ref="styleForm"  label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="车型款式" name="1" >
                    <div class="flex-panel">
                        <!--<el-form-item label="管理公司" prop="companyId">-->
                        <!--<el-select v-model="styleForm.companyId" clearable placeholder="请选择管理公司">-->
                        <!--<el-option-->
                        <!--v-for="item in companys"-->
                        <!--:key="item.organizationId"-->
                        <!--:label="item.organizationName"-->
                        <!--:value="item.organizationId">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="款式名称" prop="name">
                            <el-input v-model="styleForm.name" maxlength="20" clearable  placeholder="请输入款式名称">
                                <label class="control-label">如：2018款</label>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="在售状态">
                            <el-select placeholder="请选择在售状态" clearable v-model="styleForm.saleStatus">
                                <el-option label="在售" :value="1"> </el-option>
                                <el-option label="停售" :value="2"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系列" prop="seriesId">
                            <el-select v-model="styleForm.seriesId" clearable filterable placeholder="请选择系列">
                                <el-option
                                    v-for="item in seriesList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="left-row">
            <el-button type="primary" @click="submitForm('styleForm')">保存</el-button>
            <el-button @click="close()">返回</el-button>
        </div>
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
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data(){
            return {
                styleForm: {},
                openCollapse:["1"],
                show:false,
                seriesList:[],
                //companys: [],
                rules: {
                    companyId: [
                        { required: true, message: '请选择管理公司', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入款式名称', trigger: 'blur' }
                    ],
                    // saleStatus: [
                    //     { required: true, message: '请选择在售状态', trigger: 'change' }
                    // ],
                    seriesId: [
                        { required: true, message: '请选择系列', trigger: 'change' }
                    ]
                }
            }
        },
        methods:{
            open(){
                var $this = this;
                this.openCollapse = ["1"];
                this.show = true;

                ajax.get('/base/vehicleStyle/seriesSelect').then(
                    res => {
                        if(res.status == 0){
                            $this.seriesList = res.data;
                        }
                    }
                )

                if(this.$route.query.id){
                    ajax.get('/base/vehicleStyle/detail?id=' + this.$route.query.id).then(
                        res => {
                            if(res.status == 0){
                                $this.styleForm = res.data;
                            }
                        }
                    )
                }

            },
            submitForm(styleForm) {
                var $this = this;
                this.$refs[styleForm].validate((valid) => {
                    if (valid) {
                        if($this.styleForm.id == undefined || $this.styleForm.id == null || $this.styleForm.id == ''){
                            $this.styleForm.id = "add";
                        }
                        var url = '/base/vehicleStyle/addOrEdit';
                        ajax.post(url, $this.styleForm).then(
                            res => {
                                if(res.status == 0){
                                    $this.$message({message: '保存成功！',type: 'success'});
                                    $this.close(styleForm);
                                    $this.$emit('load');
                                }else if(res.status == 1000){
                                    $this.$message.error("该系列下款式已经存在");
                                }else{
                                    $this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            handleChange(val) {
                console.log(val);
            }
        },
        mounted(){
            this.open();
        }
    }
</script>

