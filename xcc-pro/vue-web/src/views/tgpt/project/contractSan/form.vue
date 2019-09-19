<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="合同基本信息" name="1">
                    <div class="flex-panel">

                        <el-form-item label="所属组织" prop="originateDeptId" :rules="rules.required('请选择所属组织')">
                            <tree-select v-model="addForm.originateDeptId" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree" ></tree-select>
                        </el-form-item>
                        <el-form-item label="客户类型" prop="customerType" :rules="rules.required('请选择客户类型')">
                            <el-select v-model="addForm.customerType" @change="changeCustomerType" placeholder="请选择客户类型" :disabled="organizationFlag">
                                <el-option label="企业客户" :value="1" :key="1"> </el-option>
                                <el-option label="个人客户" :value="2" :key="2"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务客户" prop="enterpriseId" :rules="rules.required('请选择服务客户')">
                            <el-input v-model="companyData.name" @click.native="openCompanyModel()" :disabled="!addForm.customerType"
                                      placeholder="请选择" readonly>
                                <el-button slot="append" icon="el-icon-search" :disabled="!addForm.customerType"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请日期" prop="applicationDate" :rules="rules.required('请选择申请日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="addForm.applicationDate"
                                            value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同开始日期" prop="contractStartDate" :rules="rules.required('请选择合同开始日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="addForm.contractStartDate"
                                            value-format="yyyy-MM-dd" :picker-options="startOption"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同结束日期" prop="contractEndDate" :rules="rules.required('请选择合同结束日期')">
                            <el-date-picker type="date" placeholder="请选择" v-model="addForm.contractEndDate"
                                            value-format="yyyy-MM-dd" :picker-options="endOption"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同负责人" prop="contractLeaderId" :rules="rules.required('请选择合同负责人')">

                            <el-select v-model="addForm.contractLeaderId" placeholder="请选择合同负责人">
                                <el-option
                                    v-for="item in principalData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="是否框架合同"  prop="frameContract" :rules="rules.required('请选择是否框架合同')">
                            <el-select v-model="addForm.frameContract">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="我方签约主体" prop="ourContractSubject" :rules="rules.required('请选择我方签约主体')">
                            <el-select v-model="addForm.ourContractSubject" placeholder="请选择">
                                <el-option v-for="item in ourContractSubjectList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="对方签约主体" prop="otherContractSubject" >
                            <el-input maxLength="36" v-model="addForm.otherContractSubject" clearable placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="合同议定方" prop="contractAgreedParty" :rules="rules.required('请选择合同议定方')">
                            <el-select v-model="addForm.contractAgreedParty" placeholder="请选择">
                                <el-option label="我司议定" :value="1"></el-option>
                                <el-option label="双方议定" :value="2"></el-option>
                                <el-option label="对方议定" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同附件">
                            <upload-panel :size="1" :file-list.sync="fileList"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同费用信息" name="2">
                    <div class="flex-panel">
                        <!--<el-form-item label="合同金额" prop="contractAmount" :rules="rules.required('请输入合同金额')">
                            <money-input v-model="addForm.contractAmount"  clearable placeholder="请输入" unit="元"></money-input>
                        </el-form-item>-->
                        <el-form-item label="是否含税" prop="isContainTax" :rules="rules.required('请选择是否含税')">
                            <el-radio v-model="addForm.isContainTax" label="1" @change="checkForm('isContainTax')">是</el-radio>
                            <el-radio v-model="addForm.isContainTax" label="0" @change="checkForm('isContainTax')">否</el-radio>
                        </el-form-item>
                        <el-form-item label="是否开票" prop="isOpenTicket" :rules="rules.required('请选择是否开票')">
                            <el-radio v-model="addForm.isOpenTicket" label="1" @change="checkForm('isOpenTicket')">是</el-radio>
                            <el-radio v-model="addForm.isOpenTicket" label="0" @change="checkForm('isOpenTicket')">否</el-radio>
                        </el-form-item>
                        <el-form-item label="发票税率" prop="invoiceTaxRate"   :rules="rules.cess(true)">
                            <el-input  type="number" v-model="addForm.invoiceTaxRate" placeholder="请输入"  ></el-input>
                        </el-form-item>

                        <el-form-item label="结算日" prop="settlementDate">
                            <el-input v-model="addForm.settlementDate" placeholder="请输入"></el-input>
                        </el-form-item>

                        <el-form-item label="付款方式" prop="paymentModel":rules="rules.required('请选择付款方式')">
                            <el-select placeholder="请选择付款方式" clearable v-model="addForm.paymentModel">
                                <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </div>
                </el-collapse-item>

                <el-collapse-item title="服务车型" name="3">
                    <el-form-item  label="选择车型" prop="vehicleModelInfoIds"  >
                        <BrandSelect v-model="vehicleModelInfo" style="width: 300px" level="3" @change="setVehicleModelInfo"></BrandSelect>
                        <!--<el-button  size="mini" @click="addvehicleModelInfoId()" type="primary">确定</el-button>-->
                    </el-form-item>
                    <ul class="list-box">
                        <li v-for="bean in vehicleModelInfoList" >
                            <span>{{bean.name}}</span>;
                            <el-button type="text" @click.stop="deletePlate(bean.modelId)">删除</el-button>
                        </li>
                    </ul>

                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
       <!-- <el-dialog class="big" title="企业客户" width="1000px" :visible.sync="dialog.company">
            <div class="list-panel">
                <div class="row form-horizontal search-box min" >
                    <div class="form-group">
                        <label class="control-label">企业客户名称</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.name" clearable autocomplete="off"
                                      placeholder="请输入企业客户名称查询"></el-input>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"  @click="handleCurrentChange(1);">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border  style="width: 100%" :data="list" @row-dblclick="saveCompany" max-height="300" >
                        <el-table-column fixed="left" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="saveCompany(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="企业客户名称" sortable min-width="150"></el-table-column>
                        <el-table-column prop="nature" label="企业性质" sortable min-width="150"></el-table-column>
                        <el-table-column prop="scale" label="企业规模" sortable min-width="150"></el-table-column>
                        <el-table-column prop="city" label="企业所在城市" sortable min-width="150"></el-table-column>
                        &lt;!&ndash;<el-table-column prop="enterpriseStatus" label="企业状态" min-width="150"></el-table-column>&ndash;&gt;
                        <el-table-column prop="company" label="所属组织" sortable min-width="150"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>-->
        <enterprise-dialog ref="enterpriseList" @load="selectEnterprise"></enterprise-dialog>
        <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer"></personal-customer-dialog>
    </div>
</template>

<script>

    import BrandSelect from '@/components/BrandSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import enterpriseDialog from '@/views/tgpt/corporateCustomer/customerPersonal/enterpriseDialog'
    import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
    import ajax from '@/utils/request'
    import {tool, ruleTool,formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "coreProjectContractSanForm",
        components: {TreeSelect, CitySelect, MoneyInput,BrandSelect,enterpriseDialog,personalCustomerDialog,UploadPanel},
        data() {
            let $this = this;
            var maxLength36 = {max: 36, message: '长度不能超过36个字符', trigger: 'change' };
            var moneyRegex = /(^[0-9]{1,4}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,4}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '发票税率输入异常', trigger: 'change'};
            return {
                vehicleModelInfo:[],
                vehicleModelInfoIds:"",
                curSelect:{},
                vehicleModelInfoList:[],
                activeNames: ['1', '2','3'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                addForm: {},
                id:"",
                rules: {
                    invoiceTaxRate:[moneyValidator],
                    otherContractSubject:[maxLength36,{required: true, message: '请输入对方签约主体'}],
                    settlementDate:[{ validator: formRule.standardSize, message: "请输入整数", trigger: 'change' },
                        { required: true, message: '请输入日数', trigger: 'change' },]
                },
                companyData: {},
                dialog:{
                    company:false,
                },
                fileList:[],
                ourContractSubjectList:[],
                paymentModelList:[],
                principalData: [],
                startOption:{
                    disabledDate(time) {
                        if($this.addForm.contractEndDate){
                            return new Date($this.addForm.contractEndDate).getTime() < time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                endOption:{
                    disabledDate(time) {
                        if($this.addForm.contractStartDate){
                            return new Date($this.addForm.contractStartDate).getTime() - 24*60*60*1000 > time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
            }
        },
        mounted() {
            //字典值
            ajax.get('/admin/dict/type/付款方式').then(rs => {
                this.paymentModelList = rs;
            });
            ajax.get('/admin/dict/type/我方签约主体').then(rs => {
                this.ourContractSubjectList = rs;
            });
            //负责人
            this.principal();
            this.open();
        },
        methods: {

            deletePlate(modelId){
                for (var i = 0; i < this.vehicleModelInfoList.length; i++) {
                    if (this.vehicleModelInfoList[i].modelId ==modelId) {
                        this.vehicleModelInfoList.splice(i,1);
                        return;
                    }
                }
            },
            clickVehicleTrack(bean){
                this.vehicleId = bean.id;
            },

            setVehicleModelInfo(data){
                var modelName = data[0].name + data[1].name + data[2].name;
                var modelId = data[2].id;
                debugger;

                var vehicleModelSel = {};
                vehicleModelSel.name = modelName;
                vehicleModelSel.modelId = modelId;

                for (var i = 0; i < this.vehicleModelInfoList.length; i++) {
                    if (vehicleModelSel.modelId == this.vehicleModelInfoList[i].modelId) {
                        this.$message.error("车型已添加！");
                        return false;
                    }
                }
                this.vehicleModelInfoList.push(vehicleModelSel);

            },

            addvehicleModelInfoId(){
                debugger;
                if (this.curSelect.modelId == "") {
                    this.$message.error("请输入车型！");
                    return false;
                }
               // this.vehicleModelInfoIds = "";
                debugger
                for(var i=0;i<this.vehicleModelInfoList.length;i++){
                    if (this.curSelect.id == this.vehicleModelInfoList[i].id) {
                        this.$message.error("车型已添加！");
                        return false;
                    }
                  // this.vehicleModelInfoIds += ","+this.vehicleModelInfoList[i].id;
                //    this.vehicleModelInfoIds += ","+this.curSelect.id;
                }
                this.vehicleModelInfoList.push(this.curSelect);
                // this.vehicleModelInfoList.push(vehicleModelInfo);

            },

            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    this.id = this.$route.query.id;
                    ajax.get('core/coreProjectContractSan/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        this.vehicleModelInfoList = rs.data.vehicleModelInfoList;
                        this.companyData.name = rs.data.enterpriseName;
                        this.companyData.id = rs.data.enterpriseId;
                        if(this.addForm.originateDeptId){
                            this.addForm.originateDeptId = [this.addForm.originateDeptId];
                        }
                        if(rs.data.attachment){
                            this.fileList=JSON.parse(rs.data.attachment);
                        }
                    });
                }
            },
            principal: function () {
                ajax.get('/core/coreProjectReview/projectLeader').then(rs => {
                    if (rs.status == 0)
                        this.principalData = rs.data;
                });
            },
            //更新选择的组织
            changeArrayItem(data){
                if (!data || data.length == 0){
                    return;
                }
                data = data[0];
                this.addForm.enterpriseId='';
                this.companyData={};
            },
            //企业客户弹框
            openCompanyModel(){
                /*this.dialog.company = true;
                this.getListByUrl("base/enterprise/list");*/
                if(this.addForm.originateDeptId==null || this.addForm.originateDeptId.length!=1){
                    this.$message.error("请选择所属组织");
                    return;
                }
                if(!this.addForm.customerType){
                    this.$message.error("请选择客户类型");
                    return;
                }
                if(this.addForm.customerType==1)
                    this.$refs.enterpriseList.open(this.addForm.originateDeptId.join());
                else if(this.addForm.customerType==2)
                    this.$refs.personalCustomerList.open(this.addForm.originateDeptId.join());
            },
            changeCustomerType(){
                this.addForm.enterpriseId='';
                this.companyData={};
            },
            //选中企业客户
            selectEnterprise(row){
                this.companyData = row;
                this.$set(this.addForm,"enterpriseId",row.id);
               // this.dialog.company = false;
            },
            selectPersonalCustomer(row){
                this.companyData = row;
                this.$set(this.addForm,"enterpriseId",row.id);
                // this.dialog.company = false;
            },
            // 触发单选验证
            checkForm(key){
                this.$refs.addForm.validateField(key);
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                console.log(this.vehicleModelInfoIds);

                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    let params = this.extend(true,{},this.addForm);
                    params.originateDeptId = params.originateDeptId.join();
                    params.id  = this.id;

                    if(this.fileList.length>0)//转换图片
                        params.attachment=JSON.stringify(this.fileList);

                    // this.vehicleModelInfoIds = "";
                    for(var i=0;i<this.vehicleModelInfoList.length;i++){
                         this.vehicleModelInfoIds =this.vehicleModelInfoIds+ ","+this.vehicleModelInfoList[i].modelId;
                    }

                   // params.vehicleModelInfoIds  = this.addForm.vehicleModelInfoIds;

                    params.vehicleModelInfoIds=this.vehicleModelInfoIds;
                    ajax.post('/core/coreProjectContractSan/addOrEdit', params).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }
                    });
                });
            }
        }
    }
</script>

