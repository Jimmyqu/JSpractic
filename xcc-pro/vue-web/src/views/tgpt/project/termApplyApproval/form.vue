<template>
    <div class="form-panel">
        <el-form :model="terms" :rules="rules" label-position="top" ref="terms" label-width="100px" class="demo-terms">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="编辑服务客户条款" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="项目合同编号" prop="contractNo">
                            <el-input v-model="terms.contractNo" @focus="openContractList()" placeholder="请选择项目合同编号">
                                <el-button slot="append"  @click="openContractList()" icon="el-icon-search">
                                </el-button>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="服务客户" prop="enterprisename">
                            <el-input v-model="terms.enterpriseName" disabled>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="开始日期" prop="contractStartDate">
                            <el-date-picker type="date" placeholder="请选择开始日期" v-model="terms.contractStartDate" style="width: 100%;"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="结束日期" prop="contractEndDate">
                            <el-date-picker type="date" placeholder="请选择结束日期" v-model="terms.contractEndDate" style="width: 100%;"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="信用额度" prop="creditLimit">
                            <money-input v-model="terms.creditLimit" clearable
                                         placeholder="请输入信用额度" unit="元"></money-input>
                        </el-form-item>

                        <el-form-item label="付款周期" prop="paymentCycle">
                            <el-input v-model="terms.paymentCycle" placeholder="请输入付款周期" @keyup.native="onlyNum($event,'paymentCycle')" maxlength="3">
                                <template slot="append">日</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="结算方式" prop="settlementModel">
                            <el-select v-model="terms.settlementModel" placeholder="请选择结算方式">
                                <el-option v-for="item in settlementModelList" :key="item.value" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日" prop="settlementDate">
                            <el-input v-model="terms.settlementDate" placeholder="请输入结算日" @keyup.native="onlyNum($event,'settlementDate')" maxlength="2">
                                <template slot="append">日</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel">
                            <el-select v-model="terms.paymentModel" placeholder="请选择付款方式">
                                <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="税金(司机)" prop="invoiceTaxRateDriver">
                            <el-input v-model="terms.invoiceTaxRateDriver" placeholder="请输入司机税金" @keyup.native="onlyDecNum($event,'invoiceTaxRateDriver')" maxlength="5">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="税金(车)" prop="invoiceTaxRateVehicle">
                            <el-input v-model="terms.invoiceTaxRateVehicle" placeholder="请输入车辆税金" @keyup.native="onlyDecNum($event,'invoiceTaxRateVehicle')" maxlength="5">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="备注" class="small">
                            <el-input type="textarea" placeholder="请输入备注" v-model="terms.remark" maxlength="100"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('terms')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <contract-list ref="contractList" @load="selContract"></contract-list>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import contractList from '@/views/tgpt/project/termApplyApproval/contractList'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        mixins: [ tool, ruleTool ],
        name:"demoForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,contractList },

        data(){
            var validateSettlementDate=(rule,value,callBack) =>{
                let regExp1 = /^[1-9]\d*|[0]$/;
                if (!regExp1.test(value)) {
                    callBack(new Error('数字格式有误'));
                }else if(value>31 || value<1){
                    callBack(new Error('请输入1到31的整数'));
                } else {
                    callBack();
                }
            };
            var validatePaymentCycle=(rule,value,callBack) =>{
                let regExp1 = /^[1-9]\d*|[0]$/;
                if (!regExp1.test(value)) {
                    callBack(new Error('数字格式有误'));
                } else if( value<1){
                    callBack(new Error('请输入大于0的整数'));
                } else {
                    callBack();
                }
            };
            var validateTaxRate=(rule,value,callBack) =>{
                if (!(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value) || /^(0|0[.]0|0[.]00)$/.test(value))) {
                    callBack(new Error('数字格式有误'));
                } else if( value>100){
                    callBack(new Error('请输入小于100的数,可保留两位小数'));
                } else {
                    callBack();
                }
            };

            return {
                id:"",
                activeNames:["1"],
                settlementModelList:[],
                paymentModelList:[],
                rules: {
                    contractNo: [
                        { required: true, message: '请选择项目合同编号', trigger: 'change'},
                    ],
                    enterpriseName: [
                        { required: true, message: '请选择服务客户', trigger: 'change'},
                    ],
                    contractStartDate: [
                        { required: true, message: '请选择开始时间', trigger: 'change' },
                    ],
                    contractEndDate: [
                        { required: true, message: '请选择结束时间', trigger: 'change' },
                    ],
                    paymentModel: [
                        { required: true, message: '请选择付款方式', trigger: 'change' },
                    ],
                    paymentCycle: [
                        { required: true, message: '请输入付款周期', trigger: 'blur' },
                        { validator: validatePaymentCycle, trigger:'blur'}
                    ],
                    settlementModel: [
                        { required: true, message: '请选择结算方式', trigger: 'change' },
                    ],
                    settlementDate: [
                        { required: true, message: '请输入结算日', trigger: 'blur' },
                        { validator: validateSettlementDate, trigger:'blur'}
                    ],
                    invoiceTaxRateDriver: [
                        { required: true, message: '请输入司机税金', trigger: 'blur' },
                        { validator: validateTaxRate, trigger:'blur'}
                    ],
                    invoiceTaxRateVehicle: [
                        { required: true, message: '请输入车辆税金', trigger: 'blur' },
                        { validator: validateTaxRate, trigger:'blur'}
                    ],
                    creditLimit: [
                        { validator: formRule.validateNumber, trigger: 'blur' },
                    ],
                    remark: [
                        { max: 100, message: '最多输入 500 个字符', trigger: 'blur' }
                    ]
                },
                terms:{},
            }
        },
        methods:{
            open(id){
                this.openCollapse = ["1","2","3","4","5"];
                if(id){
                    this.id=id;
                    this.loadProjectTerms(id);
                }
            },
            openContractList(){
                this.$refs.contractList.open();
            },
            selEnterprise(row){
                this.$set(this.terms,'enterpriseId',row.id);
                this.$set(this.terms,'enterpriseName',row.name);
            },
            selContract(row){
                var terms={
                    projectContractId:row.id,
                    contractNo:row.contractNo,
                    enterpriseId:row.enterpriseId,
                    enterpriseName:row.enterpriseName,
                    contractStartDate:row.contractStartDate,
                    contractEndDate:row.contractEndDate,
                    companyId:row.companyId,
                    companyName:row.companyName,
                    paymentModel:row.paymentModel,
                    settlementModel:row.settlementModel,
                    paymentCycle:row.paymentCycle,
                    settlementDate:row.settlementDate,
                    invoiceTaxRateDriver:row.invoiceTaxRateDriver,
                    invoiceTaxRateVehicle:row.invoiceTaxRateVehicle
                };
                this.$set(this,'terms',terms);
            },
            submitForm(terms) {
                this.$refs[terms].validate((valid) => {
                    if (valid) {
                        var url="";
                        if(this.id){
                            this.terms.id=this.id;
                            url = "core/projectterms/edit";
                        }else{
                            url = "core/projectterms/add";
                        }

                        if(this.terms.creditLimit)
                            this.terms.creditLimit=this.terms.creditLimit.replace(new RegExp(/,/g),'');

                        ajax.post(url, this.terms).then((res) => {
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close();
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },

            loadProjectTerms(id){
                ajax.get("core/projectterms/detail/"+id).then(res =>{
                    this.terms=res.data;
                });
            },

            onlyNum(e,val) {
                console.log(e);
                var $this=this;
                $(e.target).val($(e.target).val().replace(/[^\d]/g,""));
                $this.$set($this.terms,val,$(e.target).val());
            },

            onlyDecNum(e,val) {
                console.log(e);
                var $this=this;
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                $this.$set($this.terms,val,$(e.target).val());
            },


            getSettlementModelList(){
                ajax.get("admin/dict/type/付款方式").then(res =>{
                    this.paymentModelList = res;
                });
            },
            getpaymentModelList(){
                ajax.get("admin/dict/type/结算方式").then(res =>{
                    this.settlementModelList = res;
                });
            },
            handleChange(val){
                console.log(val);
            }
        },
        mounted(){
            this.getSettlementModelList();
            this.getpaymentModelList();
            this.open(this.$route.query.id);
        }
    }
</script>

