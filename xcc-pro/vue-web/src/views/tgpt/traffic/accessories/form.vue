<template>
    <div class="form-panel">
        <el-form :model="accessoriesForm" :rules="rules" label-position="top" ref="accessoriesForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="配件项目" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="accessoriesForm.companyId" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeArrayItem"></tree-select>
                        </el-form-item>
                        <el-form-item label="编号" prop="code">
                            <el-input v-model="accessoriesForm.code" clearable maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="配件名称" prop="name">
                            <el-input v-model="accessoriesForm.name" clearable maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="型号" prop="model">
                            <el-input v-model="accessoriesForm.model" clearable maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="计量单位" prop="measureUnit">
                            <el-input v-model="accessoriesForm.measureUnit" clearable maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌" prop="brand">
                            <el-input v-model="accessoriesForm.brand" clearable maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="项目分类" prop="type">
                            <el-select v-model="accessoriesForm.type" filterable clearable placeholder="请选择">
                                <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="参考价格" prop="referencePrice">
                            <money-input v-model="accessoriesForm.referencePrice"  clearable @keyup.native="onlyDecNum($event,'referencePrice')" placeholder="请输入参考价格" unit="元"></money-input>
                            <!--<el-input v-model="accessoriesForm.referencePrice" clearable maxlength="10"><template slot="append">￥</template></el-input>-->
                        </el-form-item>
                        <el-form-item label="参考说明" prop="advice">
                            <el-input v-model="accessoriesForm.advice" clearable maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('accessoriesForm')">保存</el-button>
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
        mixins: [ tool, ruleTool ],
        name:"trafficAccessoriesEdit",
        components:{CitySelectPanel,TreeSelect,MoneyInput},
        data() {
            return {
                accessoriesForm : {},
                /** 新增组件弹窗*/
                activeNames: ['1'],
                show:false,

                /** 验证 */
                rules: {
                    companyId: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ],
                    code:[
                        {required: true, message: '请输入编号', trigger: 'blur'}
                    ],
                    name:[
                        {required: true, message: '请输入配件名称', trigger: 'blur'}
                    ],
                    model:[
                        {required: false, message: '请输入型号', trigger: 'blur'}
                    ],
                    measureUnit:[
                        {required: true, message: '请输入计量单位', trigger: 'blur'}
                    ],
                    brand:[
                        {required: false, message: '请输入品牌', trigger: 'blur'}
                    ],
                    type:[
                        {required: true, message: '请选择项目分类', trigger: 'change'}
                    ],
                    referencePrice:[
                        {required: true, message: '请输入参考价格', trigger: 'blur'},
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ]
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
                    ajax.get("base/accessories/getById?id="+this.$route.query.id).then(result=>{
                        if(result.status == 0){
                            this.accessoriesForm = result.data;
                            this.accessoriesForm.companyId = [this.accessoriesForm.companyId];
                        }
                    });

                }else{
                    this.accessoriesForm = {};
                    if(this.$refs['accessoriesForm']){
                        this.$refs['accessoriesForm'].resetFields();
                    }

                }
                //this.show = true;
            },
            onlyDecNum(e,val) {
                console.log(e);
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                this.$set(this.accessoriesForm,val,$(e.target).val());
            },
            //保存
            submitForm(accessoriesForm){
                let data = this.extend(true,{},this.accessoriesForm);
                data.companyId = data.companyId.join();
                if(data.referencePrice){
                    data.referencePrice = data.referencePrice.replace(new RegExp(/,/g),'');
                }
                let url = "base/accessories/create";
                this.$refs[accessoriesForm].validate((valid) => {
                    if (valid) {
                        ajax.post(url,data).then(result=>{
                            if(result.status == 0){
                                this.showMessage("保存成功","success");
                                this.close();
                            }else {
                                this.$message.error(result.message);
                            }
                        })
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

