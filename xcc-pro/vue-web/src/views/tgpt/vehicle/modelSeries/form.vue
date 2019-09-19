<template>
    <div class="form-panel">
        <el-form :model="seriesForm" :rules="rules" label-position="top"  ref="seriesForm"  label-width="100px">
            <el-collapse v-model="openCollapse" @change="handleChange">
                <el-collapse-item title="车型系列" name="1" >
                    <div class="flex-panel">
                        <!--<el-form-item label="管理公司" prop="companyId">-->
                        <!--<el-select v-model="seriesForm.companyId" clearable placeholder="请选择">-->
                        <!--<el-option-->
                        <!--v-for="item in companys"-->
                        <!--:key="item.organizationId"-->
                        <!--:label="item.organizationName"-->
                        <!--:value="item.organizationId">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="品牌"  required prop="brandId">
                            <el-select v-model="seriesForm.brandId" filterable clearable placeholder="请选择品牌">
                                <el-option
                                    v-for="item in brands"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车系" prop="name">
                            <el-input v-model="seriesForm.name" maxlength="20" clearable placeholder="请输入车系"></el-input>
                            <label class="control-label">如：君威</label>
                        </el-form-item>

                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="left-row">
            <el-button type="primary" @click="submitForm('seriesForm')">保存</el-button>
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
                seriesForm:{
                    price: '',
                    oilWea: ''
                },
                iconPhoto:[],
                openCollapse:["1"],
                show:false,
                //companys: [],
                rules: {
                    brandId: [
                        { required: true, message: '请选择品牌', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入车系', trigger: 'blur' }
                    ]
                },
                brands:[]
            }
        },
        mounted(){
            this.open();
        },
        methods:{
            initSelect() {
                var $this = this;
                ajax.get('/base/vehicleModel/brandSelect').then(
                    res => {
                        if(res.status == 0){
                            $this.brands = res.data;
                        }
                    }
                )
            },
            open(){
                this.seriesForm.id = this.$route.query.id
                var $this = this;
                this.openCollapse = ["1"];
                this.show = true;
                this.initSelect();

                $this.iconPhoto = [];
                if(this.seriesForm.id != undefined && this.seriesForm.id != null && this.seriesForm.id != ''){
                    //ajax.ajaxSettings.async = false;
                    ajax.get('/base/vehicleModel/detail?id=' + this.seriesForm.id).then((res) => {
                        if(res.status == 0){
                            this.seriesForm = res.data;
                        }
                    })
                }
            },
            submitForm(seriesForm) {
                var $this = this;
                this.$refs[seriesForm].validate((valid) => {
                    if (valid) {
                        if($this.iconPhoto != null && $this.iconPhoto.length > 0 && $this.iconPhoto[0] != null){
                            var object = {};
                            object['name'] = $this.iconPhoto[0].name;
                            object['path'] = $this.iconPhoto[0].path;
                            object['filedomain'] = $this.iconPhoto[0].filedomain;
                            $this.seriesForm.pic = JSON.stringify(object);
                        }else {
                            $this.seriesForm.pic = "";
                        }
                        if($this.seriesForm.id == undefined || $this.seriesForm.id == null || $this.seriesForm.id == ''){
                            $this.seriesForm.id = "add";
                        }
                        var url = '/base/vehicleModel/addOrEdit';
                        ajax.post(url, $this.seriesForm).then(
                            res => {
                                if(res.status == 0){
                                    $this.$message({message: '保存成功！',type: 'success'});
                                    $this.close(seriesForm);
                                    $this.$emit('load');
                                }else if(res.status == 1000){
                                    $this.$message.error("该品牌下车系名称已经存在");
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
        }
    }
</script>

