<template>
    <div class="form-panel">
        <el-form :model="customer" label-position="top" :rules="rules" ref="customer" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="1">
                    <!-- <el-button class="float-btn" @click="restPwd()" type="primary" size="small" v-show="id">重置密码
                    </el-button> -->
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="organizationId">
                            <tree-select-panel v-model="organization" placeholder="请选择组织" type="one"
                                               url="admin/organization/tree?noManager=noManager"  @change="changeOrganization"></tree-select-panel>
                        </el-form-item>
                        <el-form-item label="企业客户名称" prop="name">
                            <el-input v-model="customer.name" :disabled="organizationFlag" clearable placeholder="请输入企业名称" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="简称" prop="shortName">
                            <el-input v-model="customer.shortName" :disabled="organizationFlag" clearable placeholder="请输入简称" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="企业所在城市" prop="cityId">
                            <city-select-panel :value.sync="customer.cityId" :disabled="organizationFlag" ref="citySelect"></city-select-panel>
                        </el-form-item>
                        <el-form-item label="企业性质" prop="nature">
                            <el-select v-model="customer.nature" :disabled="organizationFlag" clearable placeholder="请选择行业性质">
                                <el-option v-for="item in natureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="行业分类" prop="classification">
                            <el-select v-model="customer.classification" :disabled="organizationFlag" clearable placeholder="请选择行业分类">
                                <template v-for="c in classificationList">
                                    <el-option :key="c.value" :label="c.text" :value="c.value"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="企业规模">
                            <el-select v-model="customer.scale" :disabled="organizationFlag" clearable placeholder="请选择企业规模">
                                <el-option v-for="item in scaleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="企业联系人" prop="contactName">
                            <el-input v-model="customer.contactName" :disabled="organizationFlag" clearable placeholder="请输入企业联系人" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人手机号" prop="contactPhone">
                            <el-input v-model="customer.contactPhone" :disabled="organizationFlag" clearable maxlength="11" @keyup.native="onlyNum($event,'contactPhone')" placeholder="请输入联系人手机号"></el-input>
                        </el-form-item>

                        <el-form-item label="企业客户登录密码" prop="password" v-if="!id">
                            <el-input v-model="customer.password" :disabled="organizationFlag" clearable   placeholder="请输入企业客户登录密码"></el-input>
                        </el-form-item>

                        <el-form-item label="来源渠道" prop="channel">
                            <el-select v-model="customer.channel" :disabled="organizationFlag" clearable placeholder="请选择来源渠道">
                                <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付主体" prop="paymentSubject">
                            <el-input v-model="customer.paymentSubject" :disabled="organizationFlag" clearable placeholder="请输入支付主体" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="保证金" prop="depositCash">
                            <!--<el-input v-model="customer.depositCash" clearable placeholder="请输入保证金" @keyup.native="onlyDecNum($event,'depositCash')"  maxlength="17"><template slot="append">元</template></el-input>-->
                            <money-input v-model="customer.depositCash" :disabled="organizationFlag" clearable
                                         placeholder="请输入保证金" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="信用额度" prop="creditLimit">
                            <!--<el-input v-model="customer.creditLimit" clearable placeholder="请输入信用额度" @keyup.native="onlyDecNum($event,'creditLimit')" maxlength="17"><template slot="append">元</template></el-input>-->
                            <money-input v-model="customer.creditLimit" :disabled="organizationFlag" clearable
                                         placeholder="请输入信用额度" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="曾用名" prop="usedName">
                            <el-input v-model="customer.usedName" :disabled="organizationFlag" clearable placeholder="请输入曾用名" maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="开票信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="开票名称" prop="billingName">
                            <el-input v-model="customer.billingName" :disabled="organizationFlag" clearable placeholder="请输入开票名称" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="纳税人识别号" prop="taxpayerNo">
                            <el-input v-model="customer.taxpayerNo" maxlength="50" @keyup.native="onlyNumAndChar($event,'taxpayerNo')" clearable placeholder="请输入纳税人识别号"></el-input>
                        </el-form-item>
                        <el-form-item label="开户银行" prop="bankName">
                            <el-input v-model="customer.bankName" :disabled="organizationFlag" clearable placeholder="请输入开户银行" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="开户账号" prop="accountNo">
                            <el-input v-model="customer.accountNo" :disabled="organizationFlag" @keyup.native="onlyNum($event,'accountNo')" clearable maxlength="19" placeholder="请输入开户账号"></el-input>
                        </el-form-item>
                        <el-form-item label="开票电话" prop="billingPhone">
                            <el-input v-model="customer.billingPhone" :disabled="organizationFlag" @keyup.native="onlyNum($event,'billingPhone')" clearable maxlength="11" placeholder="请输入开票电话"></el-input>
                        </el-form-item>
                        <el-form-item label="开票地址" prop="billingAddress">
                            <el-input v-model="customer.billingAddress" :disabled="organizationFlag" clearable placeholder="请输入开票地址" maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="企业服务信息" name="3">
                    <div class="flex-panel">
                        <!-- <el-form-item label="阶段" prop="stage">
                            <el-select v-model="customer.stage" :disabled="organizationFlag" clearable placeholder="请选择阶段">
                                <el-option v-for="item in stageList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="企业状态" prop="enterpriseStatus">
                            <el-select v-model="customer.enterpriseStatus" :disabled="organizationFlag" clearable placeholder="请选择企业状态">
                                <el-option v-for="item in enterpriseStatuslList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="签约状态" prop="signStatus">
                            <el-select v-model="customer.signStatus" disabled>
                                <el-option v-for="item in signStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签约日期" prop="signDate">
                            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="customer.signDate" disabled></el-date-picker>
                        </el-form-item>
                        <el-form-item label="客户经理" prop="customerManager">
                            <el-select v-model="customer.customerManager"  :disabled="organizationFlag" clearable placeholder="请选择客户经理">
                                <el-option v-for="item in userList" :key="item.id" :label="item.account" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="业务助理" prop="assistantManager">
                            <el-select v-model="customer.assistantManager" :disabled="organizationFlag" clearable placeholder="请选择业务助理">
                                <el-option v-for="item in userList" :key="item.id" :label="item.account" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="4">
                    <div class="flex-panel">
                        <el-form-item label="备注说明" class="big" prop="remark">
                            <el-input type="textarea" clearable v-model="customer.remark" :disabled="organizationFlag" placeholder="请输入备注"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="银行信息" name="5">
                    <el-button class="float-btn" @click="addEnterpriseBank()" type="primary">新增
                    </el-button>
                    <el-table :data="customer.bank" style="width: 100%;margin-top: 10px" border>
                        <el-table-column fixed="right" label="操作" min-width="100">
                            <template slot-scope="{row,$index}">
                                <el-button @click="delEnterpriseBank(row,$index)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="index" label="序号" min-width="70">
                            <template slot-scope="{row,$index}">
                                <span>{{$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bankName" label="银行" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.bankName"  :disabled="organizationFlag" clearable placeholder="请输入银行" maxlength="50"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountName" label="户名" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.accountName"  :disabled="organizationFlag" clearable placeholder="请输入户名" maxlength="50"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountNo" label="银行账户" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-input v-model="row.accountNo"  :disabled="organizationFlag" @keyup.native="onlyNum($event,'bank['+$index+'].accountNo')" clearable maxlength="19" placeholder="请输入银行账户"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('customer')" :loading="showSaveLoading">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import TreeSelectPanel from '@/components/TreeSelect/index'
    import CitySelectPanel from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"corporateCustomerInformationEdit",
        components:{ MoneyInput,TreeSelectPanel,CitySelectPanel },
        data(){
            var validatePhone=(rule, value, callback) => {//验证手机号
                let regExp = /^1[3|4|5|7|8][0-9]{9}$/;
                if(!value){
                    callback();
                }else if (!regExp.test(value)) {
                    callback(new Error('手机号格式有误'));
                } else {
                    callback();
                }
            };
            var validateAccount=(rule,value,callBack) =>{
                let regExp1 = /^[1-9](\d{14}|\d{18})$/;
                if(!value){
                    callBack();
                }else if (!regExp1.test(value)) {
                    callBack(new Error('银行卡号格式有误'));
                } else {
                    callBack();
                }
            };
            return {
                customerData:{},
                id:"",
                activeNames:["1","2","3","4","5"],
                organization:[],
                showSaveLoading: false,
                channelList: [
                    {
                        value: '1',
                        label: '招投标'
                    }, {
                        value: '2',
                        label: '自主开发'
                    }, {
                        value: '3',
                        label: '媒体渠道'
                    }, {
                        value: '4',
                        label: '转介绍'
                    }],
                stageList: [
                    {
                        value: '1',
                        label: '初步接治'
                    }, {
                        value: '2',
                        label: '确认需求'
                    }, {
                        value: '3',
                        label: '方案报价'
                    }, {
                        value: '4',
                        label: '谈判'
                    }, {
                        value: '5',
                        label: '签约'
                    }, {
                        value: '6',
                        label: '其它'
                    }],
                natureList: [
                    {
                        value: '1',
                        label: '国营'
                    }, {
                        value: '2',
                        label: '民营'
                    }, {
                        value: '3',
                        label: '合资'
                    }, {
                        value: '4',
                        label: '外资'
                    }, {
                        value: '5',
                        label: '其他'
                    }],
                scaleList: [
                    {
                        value: '1',
                        label: '大型企业'
                    }, {
                        value: '2',
                        label: '中型企业'
                    }, {
                        value: '3',
                        label: '小型企业'
                    }],
                signStatusList: [
                    {
                        value: '1',
                        label: '未签约'
                    }, {
                        value: '2',
                        label: '已签约'
                    }],
                enterpriseStatuslList: [
                    {
                        value: '1',
                        label: '待开拓'
                    }, {
                        value: '2',
                        label: '开拓中'
                    }, {
                        value: '3',
                        label: '正常'
                    }, {
                        value: '4',
                        label: '逾期'
                    }, {
                        value: '5',
                        label: '停止开拓'
                    }, {
                        value: '6',
                        label: '停用'
                    }, {
                        value: '7',
                        label: '黑名单'
                    }],
                cityList:[],
                classificationList:[],
                /*organizationList:[],*/
                fgsMap:{},
                activeFgsArray:[],
                userList:[],
                organizationFlag:true,
                show:false,
                rules: {
                    name: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    shortName: [
                        { required: true, message: '请输入企业简称', trigger: 'blur' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    cityId: [
                        { required: true, message: '请选择企业所在城市', trigger: 'change' },
                    ],
                    nature: [
                        { required: true, message: '请选择企业性质', trigger: 'change' },
                    ],
                   /* scale: [
                        { required: true, message: '请选择企业规模', trigger: 'change' },
                    ],*/
                    contactName: [
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' },
                        { required: true, message: '请输入客户名称', trigger: 'blur' },
                    ],
                    contactPhone: [
                        { max: 11, message: '最多输入 11 个字符', trigger: 'blur' },
                        {validator: formRule.isMobilePhone, message: "手机号码格式有误", trigger: "blur"},
                        { required: true, message: '请输入联系人手机号', trigger: 'blur' },
                    ],
                    /*管理员密码*/
                    password: [
                        { required: true, message: '请输入初始登录密码', trigger: 'blur' },
                        { max: 8, message: '最多输入 8 个字符', trigger: 'blur' },
                    ],

                    paymentSubject: [
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    depositCash: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    creditLimit: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    billingName: [
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    taxpayerNo: [
                        { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    bankName: [
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    accountNo: [
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' },
                        { validator: validateAccount,message: '开户账号有误', trigger: 'blur'}
                    ],
                    billingPhone: [
                        { max: 11, message: '最多输入 11 个字符', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur'}
                    ],
                    billingAddress: [
                        /*{ required: true, message: '请输入开票地址', trigger: 'blur' },*/
                        { max: 50, message: '最多输入 100 个字符', trigger: 'blur' }
                    ],
                    stage: [
                        { required: true, message: '请选择阶段', trigger: 'change' },
                    ],
                    enterpriseStatus: [
                        { required: true, message: '请选择企业状态', trigger: 'change' },
                    ],
                    customerManager: [
                        { required: true, message: '请输入客户经理', trigger: 'blur' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    assistantManager: [
                       /* { required: true, message: '请输入业务助理', trigger: 'blur' },*/
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    organizationId: [
                        { required: true, message: '请选择组织', trigger: 'change' },
                    ],
                    remark: [
                        { max: 500, message: '最多输入 500 个字符', trigger: 'blur' }
                    ]
                },
                customer:{
                    name:'',
                    shortName:'',
                    cityId:[],
                    nature:'',
                    classification:'',
                    scale:'',
                    contactName:'',
                    contactPhone:'',
                    password:'123456',
                    channel:'',
                    paymentSubject:'',
                    creditLimit:'',
                    depositCash:'',
                    usedName:'',
                    billingName:'',
                    taxpayerNo:'',
                    bankName:'',
                    accountNo:'',
                    billingPhone:'',
                    billingAddress:'',
                    stage:'',
                    enterpriseStatus:'',
                    signStatus:'',
                    signDate:'',
                    customerManager:'',
                    assistantManager:'',
                    originatorName:'',
                    originatorId:[],
                    remark:'',
                    bank:[]
                },
            }
        },
        methods:{
            open(){
                this.openCollapse = ["1","2","3","4","5"];
                //this.show = true;
                if(this.$route.query.id){
                    this.id=this.$route.query.id;
                   // ajax.get('/core/coreProjectReview/companyMap').then(rs => {
                    //    this.fgsMap = rs.data;
                        this.loadCustomer(this.$route.query.id);
                    //});
                }else{
                    /*ajax.get('/core/coreProjectReview/companyMap').then(rs => {
                        this.fgsMap = rs.data;
                    });*/
                }
            },

            /*重置密码*/
            restPwd(){
                this.$prompt('请输入新密码', '重置密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:/^[\w_-]{6,16}$/,
                    inputErrorMessage: '密码格式不正确'
                }).then(({ value }) => {
                    let data = {
                        enterpriseId: this.id,
                        password: value
                    }
                    ajax.post('cusupms/user/restpwd' , data).then(res => {
                        if(res.status == 0){
                            this.$message({message: '密码重置成功！',type: 'success'});
                        }else{
                            this.$message.error(res.msg);
                        }
                    });
                })
            },

            handleChange(val) {
                console.log(val);
            },
            submitForm(customer) {
                this.showSaveLoading = true;
                var $this = this;
                $this.$refs[customer].validate((valid) => {
                    if (valid) {
                        if(this.checkBank()){
                            var url="";
                            if($this.id){
                                $this.customer.id=$this.id;
                                url = "base/enterprise/edit";
                            }else{
                                url = "base/enterprise/add";
                            }
                            let params = Object.assign({},$this.customer);
                            if(Array.isArray($this.customer.cityId) && $this.customer.cityId.length==2)
                                params.cityId=params.cityId[1];
                            if(params.creditLimit)
                                params.creditLimit=params.creditLimit.replace(new RegExp(/,/g),'');
                            if(params.depositCash)
                                params.depositCash=params.depositCash.replace(new RegExp(/,/g),'');
                            /*if(params.originatorId)
                                params.originatorId=params.originatorId[0];*/
                            ajax.post(url, params).then(
                                res=> {
                                    if(res.status == 0){
                                        $this.$message({message: '保存成功！',type: 'success'});
                                        $this.close();
                                        $this.$emit('load');
                                    }else {
                                        $this.$message.error(res.message);
                                    }
                                    this.showSaveLoading = false;
                                }
                            ).catch((error) => {
                                this.showSaveLoading = false;
                            })
                        }else{
                            this.showSaveLoading = false;
                            this.$message({message: '请将银行信息填写完整！',type: 'error'});
                        }
                    } else {
                        this.showSaveLoading = false;
                        return false;
                    }
                });
            },

            checkBank() {
                var bank=this.customer.bank;
                if(typeof(bank)=='undefined' || bank==null || bank.length==0){
                    return true;
                }else{
                    for(var b in bank){
                        if(!(bank[b].bankName && bank[b].accountName && bank[b].accountNo)){
                            return false;
                        }
                    }
                }
                return true;
            },
            addEnterpriseBank() {
                if(this.checkBank()){
                    var b={
                        bankName:"",
                        accountName:"",
                        accountNo:""
                    };
                    this.customer.bank.push(b);
                }else{
                    this.$message({message: '请将银行信息填写完整！',type: 'error'});
                }

            },
            delEnterpriseBank(row,index) {
                this.customer.bank.splice(index,1);
            },

            loadCustomer(id){
                var $this=this;
                ajax.get("base/enterprise/detail/"+id).then(result=>{
                    if(result.status==0){
                        $this.organizationFlag= false;
                        if(result.data){
                            if(result.data.cityId)
                                result.data.cityId=result.data.cityId.split(",");
                            else
                                result.data.cityId=[];
                            $this.organization=[result.data.organizationId];
                            $this.customer=result.data;
                            $this.getUserList();

                        }
                    }else{
                        console.log(result.message);
                    }
                });

            },

            onlyNum(e,val) {
                console.log(e);
                var $this=this;

                $(e.target).val($(e.target).val().replace(/[^\d]/g,""));
                $this.$set($this.customer,val,$(e.target).val());
            },
            onlyDecNum(e,val) {
                console.log(e);
                var $this=this;
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                $this.$set($this.customer,val,$(e.target).val());
            },
            onlyNumAndChar(e,val){
                console.log(e);
                var $this=this;

                $(e.target).val($(e.target).val().replace(/[^\dA-Z]/g,""));
                $this.$set($this.customer,val,$(e.target).val());
            },

            selectCitys(){
                var $this=this;
                ajax.get("base/enterprise/selectcitys").then(result=>{
                    if(result.status==0){
                        $this.cityList=result.data;
                    }else{
                        console.log(result.message);
                    }
                });
            },

            selectClassifications(){
                var $this=this;
                ajax.get("base/enterprise/selectdicts/行业分类").then(result=>{
                    if(result.status==0){
                        $this.classificationList=result.data;
                    }else{
                        console.log(result.message);
                    }
                });

            },
            getOrganzationList(){
                /*var userInfo=getCurrentUserInfo();
                if(userInfo.organizationList!=null && userInfo.organizationList.length>0)
                    this.organizationList=userInfo.organizationList;*/
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.organizationFlag= false;
                    this.customer.organizationId=this.organization[0];
                    this.customer=Object.assign({},this.customer);
                    this.getUserList();
                }else{
                    this.organizationFlag=true;
                }
                /*if(data && data.length==1){
                    this.organizationFlag= false;
                    this.customer.organizationId=data[0].id;
                    //   this.getEnterpriseList();
                }*/
            },
            getUserList(){
                var $this=this;
                ajax.get("base/enterprise/selectuserlist?organizationId="+this.customer.organizationId).then(result=>{
                    if(result.status==0){
                        $this.userList=result.data;
                        $this.customer=Object.assign({},$this.customer);
                    }else{
                        console.log(result.message);
                    }
                });
            },
           /* getCompanys(){
                ajax.get('/core/coreProjectReview/companyMap').then(rs => {
                    this.fgsMap = rs.data;
                });
            }*/
        },
        mounted(){
            //this.getCompanys();

            //this.selectCitys();
            ajax.get("base/enterprise/selectcitys").then(result=>{
                if(result.status==0){
                    this.cityList=result.data;
                }else{
                    console.log(result.message);
                }
            });
            //this.selectClassifications();
            ajax.get("base/enterprise/selectdicts/行业分类").then(result=>{
                if(result.status==0){
                    this.classificationList=result.data;
                }else{
                    console.log(result.message);
                }
            });
           // this.getOrganzationList();
            //this.getUserList();

            this.open();
        }
    }
</script>

