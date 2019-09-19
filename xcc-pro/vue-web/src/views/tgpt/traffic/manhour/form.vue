<template>
    <div class="form-panel">
        <el-form :model="manhourForm" :rules="rules" label-position="top" ref="manhourForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="编辑工时项目" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="manhourForm.companyId" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeArrayItem"></tree-select>
                        </el-form-item>
                        <el-form-item label="编号" prop="code">
                            <el-input v-model="manhourForm.code" clearable maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="工时项目名称" prop="name">
                            <el-input v-model="manhourForm.name" clearable maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="项目分类" prop="type">
                            <el-select v-model="manhourForm.type" filterable clearable placeholder="请选择">
                                <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="参考价格" prop="referencPrice">
                            <money-input v-model="manhourForm.referencPrice"  clearable @keyup.native="onlyDecNum($event,'referencePrice')" placeholder="请输入参考价格" unit="元"></money-input>
                            <!--<el-input v-model="manhourForm.referencPrice" clearable maxlength="10"><template slot="append">￥</template></el-input>-->
                        </el-form-item>
                        <el-form-item label="参考说明" prop="advice">
                            <el-input v-model="manhourForm.advice" clearable maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('manhourForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CitySelectPanel from '@/components/CitySelect/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import MoneyInput from '@/components/MoneyInput/index'
    import $ from 'jquery-slim'

    export default {
        name:"trafficManhourEdit",
        mixins: [ tool, ruleTool ],
        components:{CitySelectPanel,TreeSelect,MoneyInput},
        data: function () {
            let validCode = (rule, value,callback)=>{
                let $this = this;
                if($this.manhourForm.id === undefined){
                    $this.manhourForm.id = "";
                }
                ajax.get("base/manhour/checkCode?id="+$this.manhourForm.id+"&code="+value).then(result=>{
                    if(result > 0){
                        callback(new Error('编号已存在，请重新输入'))
                    }else{
                        callback()
                    }
                });

            };
            return {
                manhourForm : {},
                /** 新增组件弹窗*/
                activeNames: ['1'],
                show:false,
                /** 验证 */
                rules: {
                    companyId: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ],
                    code: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {required: true, validator: validCode ,trigger: 'blur'}//这里需要用到全局变量
                    ],
                    type: [
                        {required: true, message: '请选择项目分类', trigger: 'change'}
                    ],
                    referencPrice: [
                        {required: true, message: '请输入参考价格', trigger: 'blur'},
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入工时项目名称', trigger: 'blur'}
                    ],

                },
                /** 可搜索select*/
                // cityOptions : [],
                typeOptions : [],
            }
        },
        beforeMount: function () {
        },
        mounted: function () {
            this.open();
            this.getList();
            // this.getSelectCity();
            this.getSelectType();
        },
        watch: {

        },
        methods: {
            className(data){
                if(data.row.state != 1){
                    return "hide";
                }
            },
            open(){
                this.activeNames = ['1','2','3'];
                if (this.$route.query.id) {
                    ajax.get("base/manhour/getById?id="+this.$route.query.id).then(result=>{
                        if(result.status == 0){
                            this.manhourForm = result.data;
                            this.manhourForm.companyId = [this.manhourForm.companyId];
                        }
                    });

                }else{
                    this.manhourForm = {};
                    this.clearValidate('manhourForm');
                }
                this.show = true;
            },
            clearValidate(manhourForm) {
                if(this.$refs[manhourForm]){
                    this.$refs[manhourForm].resetFields();
                }
            },
            onlyDecNum(e,val) {
                console.log(e);
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                this.$set(this.manhourForm,val,$(e.target).val());
            },
            //保存
            submitForm(manhourForm){
                debugger
                let data = this.extend(true,{},this.manhourForm);
                data.companyId = data.companyId.join();
                if(data.referencPrice){
                    data.referencPrice = data.referencPrice.replace(new RegExp(/,/g),'');
                }
                let url = "base/manhour/create";
                this.$refs[manhourForm].validate((valid) => {
                    if (valid) {
                        ajax.post(url,data).then(result=>{
                            if(result.status == 0){
                                this.showMessage("保存成功","success");
                                this.close();
                            }else {
                                this.$message.error(result.message);
                            }
                        });

                    } else {
                        this.$message.error("请检查必填项");
                    }
                });
            },
            //项目分类 下拉
            getSelectType(){
                ajax.get('admin/dict/type/维保项目分类').then(rs => {
                    if (rs.length > 0) {
                        this.typeOptions = rs;
                    }else{
                        this.typeOptions = [];
                    }
                });
            },
            //所属组织树组织选择
            changeArrayItem(data) {
                if (Array.isArray(data))
                    data = data[0];
            },
        }
    }
</script>

