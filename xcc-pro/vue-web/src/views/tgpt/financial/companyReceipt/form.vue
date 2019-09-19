<template>
    <div class="form-panel">
        <el-form label-position="top" label-width="100px" :model="modelForm" :rules="rules" ref="modelForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="收款单" name="1">
                    <div class="flex-panel">
                        <el-form-item label="创建人">
                            <el-input v-model="userInfo.name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="organizationId">
                            <tree-select v-model="modelForm.organizationId" placeholder="请选择组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="initEnterpriseList"></tree-select>
                        </el-form-item>
                        <el-form-item label="企业客户" prop="enterpriseId">
                            <el-select v-model="modelForm.enterpriseId" clearable filterable placeholder="请选择企业客户">
                                <el-option v-for="item in enterpriseList"
                                           :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收款日期" required prop="voucherDate">
                            <el-date-picker type="date" placeholder="请选择收款日期" v-model="modelForm.voucherDate"
                                            value-format="yyyy-MM-dd" :editable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="收款方式" required prop="voucherWay">
                            <el-select v-model="modelForm.voucherWay" clearable filterable placeholder="请选择收款方式">
                                <el-option label="现金" :value="1"></el-option>
                                <el-option label="转账" :value="2"></el-option>
                                <el-option label="刷卡" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="voucherCost" label="收款金额（元）"  >
                            <!-- <el-input v-model="modelForm.voucherCost" placeholder="请输入"></el-input>-->
                            <money-input v-model="modelForm.voucherCost"  clearable @keyup.native="onlyDecNum($event,'voucherCost')" placeholder="请输入收款金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item prop="bankPoundage" label="银行手续费（元）">
                            <!-- <el-input v-model="modelForm.bankPoundage" placeholder="请输入"></el-input>-->
                            <money-input v-model="modelForm.bankPoundage"  clearable @keyup.native="onlyDecNum($event,'bankPoundage')" placeholder="请输入银行手续费" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item prop="otherPoundage" label="其它手续费（元）">
                            <!--<el-input v-model="modelForm.otherPoundage" placeholder="请输入"></el-input>-->
                            <money-input v-model="modelForm.otherPoundage"  clearable @keyup.native="onlyDecNum($event,'otherPoundage')" placeholder="请输入其它手续费" unit="元"></money-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="银行信息" name="2">
                    <div class="flex-panel">
                        <el-form-item prop="bankName" label="银行">
                            <el-input v-model="modelForm.bankName" placeholder="请输入" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item prop="bankAccount" label="银行账号">
                            <el-input v-model="modelForm.bankAccount" placeholder="请输入" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item prop="bankUsername" label="银行户名">
                            <el-input v-model="modelForm.bankUsername" placeholder="请输入" maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="3">
                    <el-form-item prop="remark"label="备注" class="big">
                        <el-input type="textarea" v-model="modelForm.remark" placeholder="请输入" maxlength="200"></el-input>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="save('modelForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"companyReceiptForm",
        components:{ TreeSelect, MoneyInput },
        data(){
            let moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            let moneyValidator = {pattern: moneyRegex, message: '金额输入异常', trigger: 'change'};
            return {
                state:false,
                id: "",
                type: "add",
                show: false,
                activeNames: ['1', '2', '3'],
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                userInfo: this.getCurrentUserInfo(),
                companyMap: {},
                //companyList: [],
                enterpriseList: [],
                modelForm: {},
                rules: {
                    organizationId: [
                        {required: true, message: '所属组织不能为空', trigger: 'change'},
                    ],
                    enterpriseId: [
                        {required: true, message: '企业客户不能为空', trigger: 'change'},
                    ],
                    voucherDate: [
                        {required: true, message: '收款日期不能为空', trigger: 'blur'}
                    ],
                    voucherWay: [
                        {required: true, message: '收款方式不能为空', trigger: 'change'}
                    ],
                    voucherCost: [
                        {required: true, message: "收款金额不能为空", trigger: "blur"},
                        { validator: formRule.validateNumber, trigger:'blur'},
                        moneyValidator
                    ],
                    bankPoundage: [
                        {required: true, message: "银行手续费不能为空", trigger: "blur"},
                        { validator: formRule.validateNumber, trigger:'blur'},
                        moneyValidator
                    ],
                    otherPoundage: [
                        {required: true, message: "其它手续费不能为空", trigger: "blur"},
                        { validator: formRule.validateNumber, trigger:'blur'},
                        moneyValidator
                    ],
                    bankName: [
                        {max: 50, message: "银行名称最长50字符", trigger: "blur"},
                    ],
                    bankAccount: [
                        {max: 50, message: "银行账号最长50字符", trigger: "blur"},
                    ],
                    bankUsername: [
                        {max: 50, message: "银行户名最长50字符", trigger: "blur"},
                    ],
                    remark: [
                        {max: 200, message: "备注最长200字符", trigger: "blur"},
                    ],
                }
            }
        },
        mounted(){
            this.open();
        },
        methods: {
            open() {
                this.id = this.$route.query.id;
                //this.initEnterpriseList();
                this.initFormData();
            },
            /*initCompanyData(id) {
                ajax.get('core/coreProjectReview/companyMap/').then(rs => {
                    this.companyMap = rs.data;
                    if(this.companyMap[id]) {
                        this.companyList = this.companyMap[id];
                    }
                });
            },*/
            initEnterpriseList(data) {
                ajax.get('core/enterpriseRefund/enterpriseList', {companyId: data[0].id}).then(result => {
                    if (result.status == 0) {
                        this.enterpriseList = result.data;
                        /*设置默认值*/
                        var enterpriseId='';
                        if (this.enterpriseList && this.enterpriseList.length > 0) {
                            for(var i=0;i<this.enterpriseList.length;i++){
                                if(this.enterpriseList[i].id==this.modelForm.enterpriseId){
                                    enterpriseId=this.modelForm.enterpriseId;break;
                                }else{
                                    enterpriseId=this.enterpriseList[0].id;
                                }
                            }

                        }
                       this.$set(this.modelForm, "enterpriseId", enterpriseId);
                    }
                });
            },
            initFormData: function () {
                if (this.id) {//编辑
                    this.type = "edit";
                    this.getFormData(this.id);
                } else {
                    this.type = "add";
                    this.setInitData();
                    //this.initCompanyData();
                }
            },
            setInitData() {
                this.modelForm = {
                    // organizationName: this.userInfo.organizationList[0].organizationName,//组织名
                    // organizationId: this.userInfo.organizationList[0].organizationId,//组织ID
                    originatorId: this.userInfo.userId,//发起人ID
                };

            },
            getFormData: function (id) {
                ajax.get('core/enterpriseVoucher/getDetail?id='+id).then(result => {
                    if (result.status == 0) {
                        this.modelForm = result.data[0];
                        //this.initCompanyData(this.modelForm.organizationId);
                        this.initEnterpriseList([{id:this.modelForm.organizationId}]);
                        this.modelForm.organizationId = this.modelForm.organizationId.split(',');
                    } else {
                        this.$message.error(result.message);
                    }
                });
            },
            onlyDecNum(e,val) {
                console.log(e);
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                this.$set(this.modelForm,val,$(e.target).val());
            },
            save(modelForm) {
                let url = "core/enterpriseVoucher/addOrEdit";
                this.$refs[modelForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if(this.state) {
                        return;
                    }
                    this.state = true;
                    let params = this.extend(true,{},this.modelForm);
                    if(params.voucherCost){
                        params.voucherCost=params.voucherCost.replace(new RegExp(/,/g),'');
                    }
                    if(params.bankPoundage){
                        params.bankPoundage=params.bankPoundage.replace(new RegExp(/,/g),'');
                    }
                    if(params.otherPoundage){
                        params.otherPoundage=params.otherPoundage.replace(new RegExp(/,/g),'');
                    }
                    params.organizationId = params.organizationId.join();
                    ajax.post(url, params) .then(res => {
                        if (res.status == 0) {
                            this.$message({message: '保存成功！', type: 'success'});
                            this.close();
                        } else {
                            this.$message.error(res.message);
                        }
                    }).catch(_=>{
                        window.setTimeout(_=>{
                            this.state = false;
                        },1000);
                    });

                });
            },



        }
    }
</script>

