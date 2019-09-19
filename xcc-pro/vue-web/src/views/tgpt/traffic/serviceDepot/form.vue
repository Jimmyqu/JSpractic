<template>
    <div class="form-panel">
        <el-form label-width="100px" label-position="top"
                 ref="repairerForm" :model="repairerForm" :rules="rules">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="维修厂" name="1">
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="repairerForm.companyId" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree"changeArrayItem></tree-select>
                        </el-form-item>
                        <el-form-item label="维修厂名称" prop="name">
                            <el-input v-model="repairerForm.name" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="城市" prop="cityId">
                            <city-select :value.sync="repairerForm.cityId" ref="citySelect"></city-select>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contacts">
                            <el-input v-model="repairerForm.contacts" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人手机号" prop="contactsPhone">
                            <el-input v-model="repairerForm.contactsPhone" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="资质" prop="qualification">
                            <el-select v-model="repairerForm.qualification" placeholder="请选择" clearable>
                                <el-option v-for="(item,i) in qualificationList" :key="i" :label="item.text"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签约类型" prop="signed">
                            <el-select v-model="repairerForm.signed" placeholder="请选择" clearable>
                                <el-option label="已签约" :value="1"></el-option>
                                <el-option label="未签约" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签约日期" prop="signDate">
                            <el-date-picker v-model="repairerForm.signDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="到期日期" prop="expireDate">
                            <el-date-picker v-model="repairerForm.expireDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="维修厂地址" class="small" prop="address">
                            <el-input type="textarea" v-model="repairerForm.address" placeholder="请输入" clearable
                                      autocomplete="off"></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>
                <el-collapse-item title="维修内容" name="2">
                    <el-form-item label="维修内容" class="big" prop="serviceContent">
                        <el-input type="textarea" v-model="repairerForm.serviceContent" placeholder="请输入" clearable
                                  autocomplete="off"></el-input>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="save('repairerForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>

    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import CitySelect from '@/components/CitySelect/index'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        mixins: [ tool, ruleTool ],
        components: { CitySelect,TreeSelect },
        name:"repairerForm",
        data: function () {
            return {
                show: false,
                activeNames: ["1", "2"],
                type: "add",
                cityList: [],
                companyList: [],
                qualificationList: [],
                repairerId: "",
                repairerForm: {
                    id: "",
                    name: "",
                    cityId: [],
                    contacts: "",
                    contactsPhone: "",
                    qualification: "",
                    signed: "",
                    signDate: "",
                    expireDate: "",
                    address: "",
                    serviceContent: ""
                },
                rules: {
                    name: [
                        {required: true, message: '维修厂名称不能为空', trigger: 'blur'},
                        {max: 20, message: '维修厂名称长度不能超过20字符', trigger: 'blur'}
                    ],
                    cityId: [
                        {required: true, message: '城市不能为空', trigger: 'change'}
                    ],
                    companyId: [
                        {required: true, message: '所属组织不能为空', trigger: 'change'}
                    ],
                    contacts: [
                        {required: true, message: '联系人不能为空', trigger: 'blur'},
                        {max: 20, message: '联系人长度不能超过20字符', trigger: 'blur'}
                    ],
                    contactsPhone: [
                        {required: true, message: '联系人手机号不能为空', trigger: 'blur'},
                        {validator: formRule.isMobilePhone, message: '请输入正确的手机号', trigger: 'blur'}
                    ],
                    qualification: [
                        {required: true, message: '资质不能为空', trigger: 'change'}
                    ],
                    address: [
                        {max: 200, message: '维修厂地址长度不能超过200字符', trigger: 'blur'}
                    ],
                    serviceContent: [
                        {max: 200, message: '维修内容长度不能超过200字符', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted(){
            this.open();
        },
        methods: {
            open() {
                this.repairerId =  this.$route.query.id;;
                this.show = true;
                //初始化数据,编辑页弹出时mounted方法不会执行
                this.initQualificationData();
                this.initFormData();

            },
            initQualificationData: function () {
                let url = "admin/dict/type/维修厂资质";
                let postData = {
                    type: "维修厂资质",
                    value: ""
                };
                ajax.get(url) .then(res => {
                    this.qualificationList = res;
                });
            },
            //所属组织树组织选择
            changeArrayItem(data) {
                if (!data || data.length == 0)
                    return;
                if (Array.isArray(data))
                    data = data[0];
            },
            initFormData: function () {
                if (this.repairerId) {//编辑
                    this.type = "edit";
                    this.getFormData(this.repairerId);
                } else {//新增
                    this.type = "add";
                    //清空表单数据
                    this.repairerForm = {
                        id: "",
                        name: "",
                        cityId: [],
                        companyId: "",
                        contacts: "",
                        contactsPhone: "",
                        qualification: "",
                        signed: "",
                        signDate: "",
                        expireDate: "",
                        address: "",
                        serviceContent: ""
                    };
                }
            },
            getFormData: function (id) {
                ajax.get('base/repairer/detail/' + id).then(result => {
                    if (result.status == 0) {
                        //处理城市数据
                        if(result.data){
                            if(result.data.cityId)
                                result.data.cityId = result.data.cityId.split(",");
                            else {
                                result.data.cityId = [];
                            }
                            //赋值
                            this.repairerForm = result.data;
                            this.repairerForm.companyId = [this.repairerForm.companyId];
                        }
                    } else {
                        this.$message.error(result.message);
                    }
                });
            },
            save: function (formName) {
                debugger
                let data = this.extend(true,{},this.repairerForm);
                if(Array.isArray(data.companyId))
                    data.companyId = data.companyId.join();

                let url = "base/repairer/" + this.type;
                //处理城市数据
                if(Array.isArray(this.repairerForm.cityId) && this.repairerForm.cityId.length == 2) {
                    data.cityId = data.cityId[1];
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {//校验通过
                        ajax.post(url, data) .then(res => {
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close();
                            }else {
                                this.$message.error(res.message);
                            }
                        });
                    }
                });
            },
        }

    }
</script>

