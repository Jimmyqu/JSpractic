<template>
    <div class="form-panel">
        <el-form :model="ruleForm" :rules="rules" label-position="top" ref="ruleForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="合同基本信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="发起人" >
                            <el-input v-model="userInfo.name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="originateDeptId"  :rules="rules.required('请选择所属组织')">
                            <tree-select v-model="organization" placeholder="请选择组织" type="one" @change="changeOrganization()"
                                         url="admin/organization/tree?noManager=noManager" disabled></tree-select>
                        </el-form-item>
                        <el-form-item label="业务员" >
                            <el-input v-model="userInfo.name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="申请日期" prop="applicationDate" :rules="rules.required('请选择申请日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.applicationDate"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同开始日期" prop="contractStartDate" :rules="rules.required('请选择合同开始日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.contractStartDate"
                                            value-format="yyyy-MM-dd" :picker-options="startOption"
                                            disabled></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同结束日期" prop="contractEndDate" :rules="rules.required('请选择合同结束日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.contractEndDate"
                                            value-format="yyyy-MM-dd" :picker-options="endOption"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <!--<el-form-item label="交车日期" prop="deliveryDate" :rules="rules.required('请选择交车日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="ruleForm.deliveryDate"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>-->
                        <el-form-item label="客户类型" prop="customerType" >
                            <el-select v-model="ruleForm.customerType" disabled @change="changeCustomerType" :rules="rules.required('请选择客户类型')" placeholder="请选择客户类型">
                                <el-option label="企业客户" :value="1" :key="1"> </el-option>
                                <el-option label="个人客户" :value="2" :key="2"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务客户" prop="enterpriseId" :rules="rules.required('请选择服务客户')">
                            <el-input v-model="companyData.name" placeholder="请选择" disabled>
                                <el-button slot="append" icon="el-icon-search" disabled></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="购买保险方式" prop="insurancePurchaseMode" :rules="rules.required('请选择购买保险方式')">
                            <el-select v-model="ruleForm.insurancePurchaseMode" placeholder="请选择">
                                <el-option label="我司购买" :value="1"></el-option>
                                <el-option label="对方购买" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="违章代办方式" prop="peccancyHandleMode" :rules="rules.required('请选择违章代办方式')">
                            <el-select v-model="ruleForm.peccancyHandleMode" placeholder="请选择">
                                <el-option label="我司办理" :value="1"></el-option>
                                <el-option label="对方办理" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="我方签约主体" prop="ourContractSubject" :rules="rules.required('请选择我方签约主体')">
                            <el-select v-model="ruleForm.ourContractSubject" placeholder="请选择">
                                <el-option v-for="item in ourContractSubjectList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对方签约主体" prop="otherContractSubject" :rules="rules.required('请输入对方签约主体')">
                            <el-input v-model="ruleForm.otherContractSubject" maxlength="36" disabled placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="合同议定方" prop="contractAgreedParty" :rules="rules.required('请选择合同议定方')">
                            <el-select v-model="ruleForm.contractAgreedParty" placeholder="请选择">
                                <el-option label="我司议定" :value="1"></el-option>
                                <el-option label="双方议定" :value="2"></el-option>
                                <el-option label="对方议定" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同文本类型" prop="contractTextType" :rules="rules.required('请选择合同文本类型')">
                            <el-select v-model="ruleForm.contractTextType" placeholder="请选择">
                                <el-option label="配驾合同" :value="1"></el-option>
                                <el-option label="自驾合同" :value="2"></el-option>
                                <el-option label="其他合同" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="押金条件" prop="depositCondition">
                            <el-input v-model="ruleForm.depositCondition" maxlength="50" disabled placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="用印地点">
                            <el-select v-model="ruleForm.useSealPlace" disabled placeholder="请选择">
                                <el-option label="总部" :value="1"></el-option>
                                <el-option label="广州" :value="2"></el-option>
                                <el-option label="其他" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同附件">
                            <upload-panel :size="1" :file-list.sync="fileList"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同费用信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="是否含税" prop="isContainTax" :rules="rules.required('请选择是否含税')">
                            <el-radio v-model="ruleForm.isContainTax" label="1" @change="checkForm('isContainTax')">是</el-radio>
                            <el-radio v-model="ruleForm.isContainTax" label="0" @change="checkForm('isContainTax')">否</el-radio>
                        </el-form-item>
                        <el-form-item label="是否开票" prop="isOpenTicket" :rules="rules.required('请选择是否开票')">
                            <el-radio v-model="ruleForm.isOpenTicket" label="1" @change="checkForm('isOpenTicket')">是</el-radio>
                            <el-radio v-model="ruleForm.isOpenTicket" label="0" @change="checkForm('isOpenTicket')">否</el-radio>
                        </el-form-item>
                        <el-form-item label="发票税率（车）" prop="invoiceTaxRateVehicle" :rules="rules.cess(false)">
                            <el-input type="number" v-model="ruleForm.invoiceTaxRateVehicle" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="发票税率（司机）" prop="invoiceTaxRateDriver" :rules="rules.cess(false)">
                            <el-input v-model="ruleForm.invoiceTaxRateDriver" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="结算方式" prop="settlementModel" :rules="rules.required('请选择结算方式')">
                            <el-select placeholder="请选择结算方式" clearable v-model="ruleForm.settlementModel">
                                <el-option v-for="item in settlementModeList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结算日" prop="settlementDate">
                            <el-input v-model="ruleForm.settlementDate" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel":rules="rules.required('请选择付款方式')">
                            <el-select placeholder="请选择付款方式" clearable v-model="ruleForm.paymentModel">
                                <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="付款周期（日）" prop="paymentCycle">
                            <el-input v-model="ruleForm.paymentCycle" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="合同金额" prop="contractAmount" :rules="rules.money(true)" >
                            <el-input v-model="ruleForm.contractAmount" placeholder="请输入" clearable>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="合同期（月）" prop="contractCycle" >
                            <el-input v-model="ruleForm.contractCycle" placeholder="请输入"></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同条款" name="3">
                    <!--合同条款-->
                    <el-form-item label="合同主要条款" class="big">
                        <el-input type="textarea" v-model="ruleForm.contractMainTerm" disabled maxlength="2000"></el-input>
                    </el-form-item>

                    <el-form-item label="争议解决方式" class="big">
                        <el-input type="textarea" v-model="ruleForm.disputeSolveMode" disabled maxlength="2000"></el-input>
                    </el-form-item>

                    <el-form-item label="备注" class="big">
                        <el-input type="textarea" v-model="ruleForm.remark" disabled maxlength="2000"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="合同车辆信息" name="4">
                    <div class="flex-panel">
                        <el-form-item label="车辆总数">
                            <el-input :value="countVehicleQuantity()" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="每月车辆总租金">
                            <el-input :value="sumVehicleCost()" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="司机总数">
                            <el-input :value="countDriverQuantity()" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机总费用">
                            <el-input :value="sumDriverCost()" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同明细" name="5">
                    <el-button class="float-btn" type="primary" @click="addProjectContractDetail">新增</el-button>
                    <el-table class="left" border :data="ruleForm.contractExecutionDetailList" style="width: 100%">
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column label="结算组织" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}" >
                                <el-form-item  :prop="'contractExecutionDetailList.' + $index + '.settlementOrganizationId'"
                                               :rules="rules.required('请选择结算组织')">
                                    <tree-select v-model="row.settlementOrganizationId" placeholder="请选择组织" type="one"
                                                 url="admin/organization/companyTree" :disabled="row.isNew==0"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="useCarStartDate" label="用车开始时间" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'contractExecutionDetailList.' + $index + '.useCarStartDate'"  :rules="rules.required('请选择用车开始时间')">
                                    <el-date-picker type="date" placeholder="请选择" v-model="row.useCarStartDate"
                                                    value-format="yyyy-MM-dd" :editable="false" :disabled="row.isNew==0"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="useCarEndDate" label="用车结束时间" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'contractExecutionDetailList.' + $index + '.useCarEndDate'"  :rules="rules.required('请选择用车结束时间')">
                                    <el-date-picker type="date" placeholder="请选择" v-model="row.useCarEndDate"
                                                    value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vehicleQty" label="车辆数（台）" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'contractExecutionDetailList.' + $index + '.vehicleQuantity'" :rules="[{ validator: formRule.standardSize,message: '请输入整数', trigger: 'change' },{required: true, message: '请输入车辆数', trigger: 'change'}]" >
                                    <el-input v-model="row.vehicleQuantity" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="车辆每月费用(元)" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'contractExecutionDetailList.' + $index + '.vehicleCost'"
                                              :rules="rules.money(true,'请输入车辆每月费用')" >
                                    <el-input v-model.number="row.vehicleCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="司机人数（名）" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'contractExecutionDetailList.' + $index + '.driverQuantity'" :rules="[{ validator: formRule.standardSize,message: '请输入整数', trigger: 'change' },{required: true, message: '请输入司机人数', trigger: 'change'}]">
                                    <el-input v-model="row.driverQuantity" maxlength="10"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="司机每月费用(元)" min-width="150" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'contractExecutionDetailList.' + $index + '.driverCost'"
                                              :rules="rules.money(true,'请输入司机每月费用')" >
                                    <el-input v-model.number="row.driverCost" clearable placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="120">
                            <template slot-scope="{row,$index}">
                                <el-form-item>
                                    <el-button type="text"
                                               @click="deleteItem($index)"
                                               style="color:#F56C6C;font-size: 13px;">删除
                                    </el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>

            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="save()" :disabled="saveDisabled">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
        <enterprise-dialog ref="enterpriseList" @load="selectEnterprise"></enterprise-dialog>
        <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer"></personal-customer-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
    import enterpriseDialog from '@/views/tgpt/corporateCustomer/customerPersonal/enterpriseDialog'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        name: 'serviceHostingContractRenew',
        mixins: [ tool, ruleTool ],
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect, personalCustomerDialog, enterpriseDialog},
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '金额输入异常', trigger: 'change'};
            var numberThree = (rule, v, callback) => {
                if (!v)
                    callback();
                else if (isNaN(v))
                    callback(new Error('输入数字'));
                else if ((v + '').length > 3)
                    callback(new Error('不超过3个字符'));
                else
                    callback();
            };
            let $this = this;
            return {
                numberThree: numberThree,
                userInfo: this.getCurrentUserInfo(),
                startOption:{
                    disabledDate(time) {
                        if($this.ruleForm.contractEndDate){
                            return new Date($this.ruleForm.contractEndDate).getTime() < time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                endOption:{
                    disabledDate(time) {
                        if($this.ruleForm.contractStartDate){
                            return new Date($this.ruleForm.contractStartDate).getTime() - 24*60*60*1000 > time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                ruleForm: {},//表单数据
                saveDisabled:false,
                enterpriseParam: {},
                projectParam: {},
                projectList: [],
                formRule,
                rules: {
                    contractAmount: [
                        moneyValidator
                    ],
                    settlementDate:[
                        { required: true, message: '请输入日数', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    paymentCycle:[
                        { required: true, message: '请输入付款周期', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ],
                    contractCycle:[
                        { required: true, message: '请输入合同期', trigger: 'change' },
                        { validator: formRule.standardSize, message: "请输入整数", trigger: 'change' }
                    ]
                },
                clickTableIndex: 0,
                activeNames: ["0", "1", "2", "3", "4", "5"],//默认打开的面板
                tableData: [],
                paymentModelList: [],
                settlementModeList: [],
                ourContractSubjectList:[],
                fileList:[],
                companyData: {},
                type: "",
                organization:[]
            }
        },
        methods: {

            changeOrganization(){
                if(this.organization && this.organization.length>0){
                    this.ruleForm.originateDeptId=this.organization[0];
                }else{
                    this.ruleForm.originateDeptId='';
                }
            },
            //车辆总台数
            countVehicleQuantity(){
                let sum = 0;
                let data = this.ruleForm.contractExecutionDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.vehicleQuantity && !isNaN(item.vehicleQuantity)){
                            item.vehicleQuantity = parseInt(item.vehicleQuantity);
                            sum+=item.vehicleQuantity;
                        }
                    });
                }
                return sum;
            },
            //车辆每月总租金
            sumVehicleCost(){
                let sum = 0;
                let data = this.ruleForm.contractExecutionDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.vehicleCost && item.vehicleQuantity && !isNaN(item.vehicleCost) && !isNaN(item.vehicleQuantity)){
                            sum+=item.vehicleCost * item.vehicleQuantity;
                        }
                    });
                }
                return sum;
            },
            //司机总人数
            countDriverQuantity(){
                let sum = 0;
                let data = this.ruleForm.contractExecutionDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.driverQuantity && !isNaN(item.driverQuantity)){
                            item.driverQuantity = parseInt(item.driverQuantity);
                            sum+=item.driverQuantity;
                        }
                    });
                }
                return sum;
            },
            //司机每月总费用
            sumDriverCost(){
                let sum = 0;
                let data = this.ruleForm.contractExecutionDetailList;
                if(data && data.length) {
                    data.forEach( item =>{
                        if(item.driverCost && item.driverQuantity && !isNaN(item.driverCost) && !isNaN(item.driverQuantity)){
                            sum+=item.driverCost * item.driverQuantity;
                        }
                    });
                }
                return sum;
            },
            //初始话数据
            setInitData(){
                this.activeNames = ["0", "1", "2", "3", "4", "5"];
                this.ruleForm = {
                    customerType:1,
                    salesmanId:this.userInfo.userId,//业务员ID
                    originatorId:this.userInfo.userId,//发起人ID
                    applicationDate:new Date().format("yyyy-MM-dd"),
                    contractExecutionDetailList:[]
                };
                this.companyData = {};
                this.projectData = {};
                this.$nextTick(_ =>{
                    this.$refs.ruleForm.clearValidate();
                });
            },
            getListBefore(){
                this.loading = true;
            },
            getListAfter(){
                this.loading = false;
            },

            //企业客户弹框
            openEnterpriseModel(){
                if(!this.ruleForm.originateDeptId){
                    this.showMessage("请先选择所属组织");
                    return;
                }

                if(!this.ruleForm.customerType){
                    this.showMessage("请先选择客户类型");
                    return;
                }
                this.queryEnterprise();

            },
            queryEnterprise() {
                var organId = this.ruleForm.originateDeptId;
                if(this.ruleForm.customerType==1){
                    this.$refs.enterpriseList.open(organId);
                }else if(this.ruleForm.customerType==2){
                    this.$refs.personalCustomerList.open(organId);
                }
            },
            //选中企业客户
            selectEnterprise(row){
                this.companyData = row;
                this.$set(this.ruleForm,"enterpriseId",row.id);
            },
            //更改客户类型
            changeCustomerType(){
                this.ruleForm.enterpriseId = "";
                this.companyData={};
            },
            //选中个人客户
            selectPersonalCustomer(row){
                this.companyData = row;
                this.$set(this.ruleForm,"enterpriseId",row.id);
            },

            open(){
                debugger
                this.setInitData();
                this.initFormData();
            },
            initFormData: function () {
                this.id = this.$route.query.id;
                let type = this.$route.query.type;
                if (type == 1) {//续签
                    this.type = "renew";
                } else if (type == 2) {//编辑
                    this.type = "edit";
                }
                this.getFormData(this.id);
            },
            getFormData: function (id) {
                this.fileList = [];
                if(this.type == 'renew') {
                    ajax.get("core/serviceHostingContract/renewDetail/" + id).then(result => {
                        if (result.status == 0) {
                            if (result.data) {
                                this.ruleForm = result.data;
                                this.companyData.name = result.data.enterpriseName;
                                this.companyData.id = result.data.enterpriseId;

                                if (result.data.attachment) {
                                    this.fileList = JSON.parse(result.data.attachment);
                                }
                                if (this.ruleForm.originateDeptId) {
                                    this.organization = [this.ruleForm.originateDeptId];
                                }
                            }
                            //明细
                            if (result.data.contractExecutionDetailList) {
                                result.data.contractExecutionDetailList.forEach(d => {
                                    d.settlementOrganizationId = [d.settlementOrganizationId];
                                });
                                this.ruleForm.contractExecutionDetailList = result.data.contractExecutionDetailList;
                            }
                        } else {
                            this.$message.error(result.message);
                        }
                    })
                }else if(this.type == 'edit'){
                    ajax.get("core/serviceHostingContract/detail/" + id).then(result =>{
                        if (result.status == 0) {
                            if( result.data){
                                this.ruleForm = result.data;
                                this.companyData.name = result.data.enterpriseName;
                                this.companyData.id = result.data.enterpriseId;

                                if(result.data.attachment){
                                    this.fileList=JSON.parse(result.data.attachment);
                                }
                                if(this.ruleForm.originateDeptId){
                                    this.organization = [this.ruleForm.originateDeptId];
                                }
                            }
                            //明细
                            if( result.data.contractDetailList){
                                result.data.contractDetailList.forEach(d => {
                                    d.settlementOrganizationId=[d.settlementOrganizationId];
                                });
                                this.ruleForm.contractExecutionDetailList =  result.data.contractDetailList;
                            }
                        } else {
                            this.$message.error(result.message);
                        }
                    })
                }
            },
            // 触发单选验证
            checkForm(key){
                this.$refs.ruleForm.validateField(key);
            },
            //新增明细
            addProjectContractDetail() {
                this.ruleForm.contractExecutionDetailList.push({
                    settlementOrganizationId:[],
                    useCarStartDate:'',
                    useCarEndDate:'',
                    vehicleQuantity:'',
                    driverQuantity:'',
                    driverCost:'',
                    vehicleCost:'',
                    isNew:1
                })
            },

            //保存数据
            save() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let detailList=this.ruleForm.contractExecutionDetailList;
                        let params = this.extend(true,{},this.ruleForm);
                        // params.originateDeptId = params.originateDeptId.join();
                        this.convertData(params);
                        console.log(params);
                        let url='';
                        if(this.type == 'renew')
                            url="/core/serviceHostingContract/renew";
                        else if(this.type == 'edit')
                            url="/core/serviceHostingContract/addOrEdit";
                        this.saveDisabled=true;
                        ajax.post(url, params).then(res => {
                            this.saveDisabled=false;
                            if (this.checkResponse(res)) {// 验证请求成功状态
                                this.close();
                                this.$emit("load");//触发列表刷新
                            }
                        }).catch(_=>{
                            this.saveDisabled=false;
                        });
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });

            },
            convertData(params){
                params.contractAmount && (params.contractAmount = parseFloat(params.contractAmount));
                params.invoiceTaxRateDriver && (params.invoiceTaxRateDriver = parseFloat(params.invoiceTaxRateDriver));
                params.invoiceTaxRateVehicle && (params.invoiceTaxRateVehicle = parseFloat(params.invoiceTaxRateVehicle));
                params.contractExecutionDetailList.forEach( item =>{
                    item.settlementOrganizationId=item.settlementOrganizationId[0];
                    item.vehicleQuantity && (item.vehicleQuantity = parseFloat(item.vehicleQuantity));
                    item.vehicleCost && (item.vehicleCost = parseFloat(item.vehicleCost));
                    item.driverQuantity && (item.driverQuantity = parseFloat(item.driverQuantity));
                    item.driverCost && (item.driverCost = parseFloat(item.driverCost));
                });
                var $this = this;
                if($this.fileList.length>0)//转换图片
                    params.attachment=JSON.stringify($this.fileList);

                if($this.type == 'edit')
                    params.contractDetailList=params.contractExecutionDetailList;
            },

            deleteItem(index) {
                if (this.ruleForm.contractExecutionDetailList.length == 1) {
                    this.$message.error('至少保留一条合同明细');
                    return;
                }
                this.ruleForm.contractExecutionDetailList.splice(index, 1);
            }
        },


        mounted(){
            //字典值
            ajax.get('/admin/dict/type/付款方式').then(rs => {
                this.paymentModelList = rs;
            });
            ajax.get('/admin/dict/type/结算方式').then(rs => {
                this.settlementModeList = rs;
            });
            ajax.get('/admin/dict/type/我方签约主体').then(rs => {
                this.ourContractSubjectList = rs;
            });
            this.open();
        }

    }
</script>
