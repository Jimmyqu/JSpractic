<template>
    <div class="form-panel">
        <el-form label-position="top" label-width="100px" :model="refundForm" :rules="rules" ref="refundForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="退款单" name="1">
                    <div class="flex-panel">
                        <el-form-item label="退款单号">
                            <el-input v-model="refundForm.refundCode" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="创建人">
                            <el-input v-model="refundForm.createrName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="organizationId">
                            <tree-select v-model="refundForm.organizationId" placeholder="请选择组织" type="one"
                                         url="admin/organization/tree" @change="updateEnterpriseList"></tree-select>
                        </el-form-item>
                        <el-form-item label="企业客户" prop="enterpriseId">
                            <el-select v-model="refundForm.enterpriseId" clearable :disabled="refundDisabled" >
                                <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退款日期" prop="refundDate">
                            <el-date-picker v-model="refundForm.refundDate" type="date" clearable
                                            :disabled="refundDisabled"
                                            placeholder="请选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="退款方式" prop="refundWay">
                            <el-select v-model="refundForm.refundWay" clearable :disabled="refundDisabled">
                                <el-option label="现金" :value="1"></el-option>
                                <el-option label="转账" :value="2"></el-option>
                                <el-option label="刷卡" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退款金额（元）" prop="refundCost">
                            <!--<el-input v-model="refundForm.refundCost" clearable
                                      :disabled="refundDisabled"></el-input>-->
                            <money-input v-model="refundForm.refundCost"  clearable @keyup.native="onlyDecNum($event,'refundCost')" placeholder="请输入退款金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="银行手续费（元）" prop="bankPoundage">
                            <!--<el-input v-model="refundForm.bankPoundage" clearable
                                      :disabled="refundDisabled"></el-input>-->
                            <money-input v-model="refundForm.bankPoundage"  clearable @keyup.native="onlyDecNum($event,'bankPoundage')" placeholder="请输入银行手续费" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="其它手续费（元）" prop="otherPoundage">
                            <!--<el-input v-model="refundForm.otherPoundage" clearable
                                      :disabled="refundDisabled"></el-input>-->
                            <money-input v-model="refundForm.otherPoundage"  clearable @keyup.native="onlyDecNum($event,'otherPoundage')" placeholder="请输入其它手续费" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="已冲销金额（元）"
                                      v-if="formType == 'reverse' || formType=='unreverse'">
                            <el-input v-model="refundForm.reversedAmount"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="未冲销金额（元）" v-if="formType == 'reverse' || formType=='unreverse'">
                            <el-input v-model="refundForm.unreversedAmount"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="本次冲销金额（元）" v-if="formType == 'reverse'">
                            <el-input v-model="refundForm.thisReverseAmount"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="银行信息" name="2">
                    <div class="flex-panel">
                        <el-form-item prop="bankName" label="银行">
                            <el-input v-model="refundForm.bankName" clearable :disabled="refundDisabled"
                                      maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item prop="bankAccount" label="银行账号">
                            <el-input v-model="refundForm.bankAccount" clearable
                                      :disabled="refundDisabled" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item prop="bankUsername" label="银行户名">
                            <el-input v-model="refundForm.bankUsername" clearable
                                      :disabled="refundDisabled" maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="3">
                    <el-form-item prop="remark" label="备注" class="big">
                        <el-input type="textarea" v-model="refundForm.remark" :disabled="refundDisabled"
                                  maxlength="200"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="冲销" name="4" v-if="formType == 'reverse' || formType == 'unreverse'">
                    <el-button class="float-btn" type="primary" @click.native.prevent="addTableRow()"
                               v-if="addRowBtnShow">新增
                    </el-button>
                    <el-table border style="width: 100%" :data="refundForm.reversalDetailList">
                        <el-table-column prop="voucherCode" label="序号" min-width="100">
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="voucherCode" label="收款账款明细" min-width="200">
                            <template slot-scope="scope">
                                <el-input type="text" size="small" v-model="scope.row.voucherCode"
                                          placeholder="请选择单据编号" :disabled="formType != 'reverse' || (scope.$index + 1) < refundForm.reversalDetailList.length"
                                          @click.native="openVoucherDialog(scope.$index)">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sourceTypeName" label="单据类型" min-width="200"></el-table-column>
                        <el-table-column prop="voucherDate" label="账目时间" min-width="150"></el-table-column>
                        <el-table-column prop="accountAmount" label="账目金额(元)" min-width="150"></el-table-column>
                        <el-table-column prop="beforeReversedAmount" label="账目冲销前余额(元)"
                                         min-width="150"></el-table-column>
                        <el-table-column prop="reversedAmount" label="冲销金额(元)" min-width="150"></el-table-column>
                        <el-table-column prop="overReversedAmount" label="账目冲销后余额(元)"
                                         min-width="150"></el-table-column>
                        <el-table-column label="操作" min-width="100" v-if="formType == 'reverse'">
                            <template slot-scope="scope">
                                <el-button style="color:#F56C6C;font-size: 13px;" type="text" size="small"
                                           v-if="(scope.$index + 1) == refundForm.reversalDetailList.length"
                                           @click.native.prevent="deleteTableRow(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click.native.prevent="save('refundForm')">保存</el-button>
                <el-button @click.native.prevent="close">返回</el-button>
            </el-form-item>
        </el-form>

        <!-- 收款单选择 dialog -->
        <el-dialog width="1000px" title="选择收款单" :visible.sync="voucherDialogShow" :before-close="voucherDialogClose"
                   :append-to-body="true">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <el-input v-model="searchParam.voucherCode"
                                      placeholder="请输入收款单编号" clearable></el-input>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button size="small" type="primary" @click="handleCurrentChange(1)()">查询</el-button>
                    </div>
                </div>
                <el-table border :data="list" @row-dblclick="selectRowData($event)">
                    <el-table-column property="voucherCode" label="收款单编号" min-width="200"></el-table-column>
                    <el-table-column property="sourceTypeName" label="单据类型" min-width="150"></el-table-column>
                    <el-table-column property="voucherCost" label="收款金额" min-width="150"></el-table-column>
                    <el-table-column property="reversedAmount" label="已冲销金额" min-width="150"></el-table-column>
                    <el-table-column property="unreversedAmount" label="未冲销金额" min-width="150"></el-table-column>
                    <el-table-column property="voucherDate" label="账目时间" min-width="120"></el-table-column>
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
        </el-dialog>
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
        name:"companyRefundForm",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data: function () {
            return {
                state:false,
                activeNames: ["1", "2", "3", "4"],
                refundId: "",
                formType: "",
                //companyId:"",
                refundDisabled: false,
                companyMap: {},
                enterpriseList: [],
                refundForm: {
                    reversalDetailList: []
                },
                rules: {
                    organizationId: [
                        {required: true, message: "所属组织不能为空", trigger: "change"}
                    ],
                    enterpriseId: [
                        {required: true, message: "企业客户不能为空", trigger: "change"}
                    ],
                    refundDate: [
                        {required: true, message: "退款日期不能为空", trigger: "blur"}
                    ],
                    refundWay: [
                        {required: true, message: "退款方式不能为空", trigger: "change"}
                    ],
                    refundCost: [
                        {required: true, message: "退款金额不能为空", trigger: "blur"},
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    bankPoundage: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    otherPoundage: [
                        { validator: formRule.validateNumber, trigger:'blur'}
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
                },
                addRowBtnShow: false,
                voucherDialogShow: false,
                selectedRowIndex: null,
                //searchVoucherListParam: {},
                voucherList: [],

                //listUrl:'core/enterpriseRefund/voucherList',
                /*dialogPagination: {
                    pageSize: 10,
                    pageSizeSetting: [10, 20, 40, 100],
                    page: 1,
                    listCount: 1,
                },
                pageLayout: "total, sizes, prev, pager, next, jumper",*/
            }
        },
        mounted(){
            let bean = this.$route.query;
            console.log(bean);
            this.open(bean);
        },
        methods: {
            /*金额验证*/
            onlyDecNum(e,val) {
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                this.$set(this.refundForm,val,$(e.target).val());
            },
            open(bean) {
                //初始化数据
                this.refundId = bean.id;
                this.formType = bean.formType;
                this.enterpriseId = bean.enterpriseId;
                //初始化页面显示/隐藏，编辑/不可编辑
                this.initBtnShow();
                //初始化表单数据
                this.initFormData();
            },
            initBtnShow: function () {
                //判断页面是否可编辑
                if (this.formType == "reverse" || this.formType == "unreverse") {
                    this.refundDisabled = true;
                } else {
                    this.refundDisabled = false;
                }
                //判断冲销-新增按钮是否显示
                if (this.formType == "reverse") {
                    this.addRowBtnShow = true;
                } else {
                    this.addRowBtnShow = false;
                }
            },
            initEnterpriseList: function (companyId) {
                ajax.get("core/enterpriseRefund/enterpriseList" , {companyId: companyId}).then(result =>{
                    if (result.status == 0) {
                        this.enterpriseList = result.data;
                        console.log(this.enterpriseList);
                        /*设置默认值*/
                        var enterpriseId='';
                        if (this.enterpriseList && this.enterpriseList.length > 0) {
                            for(var i=0;i<this.enterpriseList.length;i++){
                                if(this.enterpriseList[i].id==this.refundForm.enterpriseId){
                                    enterpriseId=this.refundForm.enterpriseId;break;
                                }else{
                                    enterpriseId=this.enterpriseList[0].id;
                                }
                            }

                        }
                        this.$set(this.refundForm, "enterpriseId", enterpriseId);
                    }
                });
            },
            initFormData: function () {
                if (this.refundId) {
                    //编辑
                    ajax.get("core/enterpriseRefund/detail/" + this.refundId).then((result) => {
                        if (result.status == 0) {
                            this.initEnterpriseList(result.data.organizationId);
                            result.data.organizationId = result.data.organizationId.split(',');
                            this.refundForm = result.data;
                            // 由于页面上不显示之前已冲销数据，所有这里将已冲销数据做备份，已冲销数据置换为【】
                            if(this.refundForm && this.refundForm.reversalDetailList && this.refundForm.reversalDetailList.length > 0){
                                this.refundForm['_bfreversalDetailList'] = [];
                                this.refundForm.reversalDetailList.forEach(item => {
                                    this.refundForm['_bfreversalDetailList'].push(item);
                                });
                                this.refundForm.reversalDetailList = [];
                            }
                        } else {
                            this.$message.error(result.message);
                        }
                    });
                } else {
                    this.refundForm.createrName = this.getCurrentUserInfo().name;
                }
            },
            save: function (formName) {
                if (this.formType=="reverse" && this.refundForm.reversalDetailList.length ==0 ) {
                    this.$message.error("至少要有一条冲销明细");
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.state) {
                            return;
                        }
                        this.state = true;
                        let params = this.extend(true, {}, this.refundForm);
                        if(params.refundCost){
                            params.refundCost=params.refundCost.replace(new RegExp(/,/g),'');
                        }
                        if(params.bankPoundage){
                            params.bankPoundage=params.bankPoundage.replace(new RegExp(/,/g),'');
                        }
                        if(params.otherPoundage){
                            params.otherPoundage=params.otherPoundage.replace(new RegExp(/,/g),'');
                        }
                        if (this.checkBank(params)) {
                            params.reversalDetailList = this.concatReversalDetailList();
                            params.organizationId = params.organizationId.join();
                            ajax.post("core/enterpriseRefund/" + this.formType, params) .then(res => {
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

                            /*ajax.post("core/enterpriseRefund/" + this.formType, params).then((result) => {
                                if (result.status == 0) {
                                    this.$message.success('保存成功');
                                    //返回列表页面,并刷新列表
                                    this.close();
                                } else {
                                    this.$message.error(result.message);
                                }
                            });*/
                        }
                        else {
                            this.$message.error("单据编号是必填项");
                        }
                    } else {
                        return false;
                    }
                });
            },
            checkBank(params) {
                let reversalDetailList = params.reversalDetailList;
                for (var b in reversalDetailList) {
                    if (!(reversalDetailList[b].sourceId)) {
                        return false;
                    }
                }
                return true;
            },
            addTableRow: function () {
                let row = {
                    voucherCode: "",
                    sourceId: "",
                    sourceType: "",
                    sourceTypeName: "",
                    voucherDate: "",
                    voucherCost: null,
                    beforeReversedAmount: null,
                    reversedAmount: null,
                    overReversedAmount: null
                };
                if(this.refundForm.reversalDetailList.length>0){
                    for (var i=0;i<this.refundForm.reversalDetailList.length;i++)
                    {
                        if(this.refundForm.reversalDetailList[i].accountAmount==null){
                            this.$message.error("请选择冲销明细！");
                            return;
                        }
                    }
                }
                this.refundForm.reversalDetailList.push(row);
            },
            deleteTableRow: function (index) {
                this.refundForm.reversalDetailList.splice(index, 1);
                this.calcReverseAmount();
            },
            openVoucherDialog: function (index) {
                if (this.formType == 'reverse' && index+1 >= this.refundForm.reversalDetailList.length) {
                    this.selectedRowIndex = index;
                    this.queryVoucherList();
                    this.voucherDialogShow = true;
                }
            },
            voucherDialogClose: function () {
                this.voucherDialogShow = false;
            },
            getListBefore(param){
                // 拼接已经选择的收款单id
                let refundReverseList = this.concatReversalDetailList();
                let selectedVoucherIds = "";
                for (let i = 0; i < refundReverseList.length; i++) {
                    if (refundReverseList[i].sourceId) {
                        selectedVoucherIds = selectedVoucherIds + "," + refundReverseList[i].sourceId;
                    }
                }
                //设置请求参数
                /*let params = this.searchVoucherListParam;
                params.rows = this.dialogPagination.pageSize;
                params.page = this.dialogPagination.page;*/
                // 已选择的收款单
                param.selectedVoucherIds = selectedVoucherIds;
                param.enterpriseId = this.enterpriseId;
                param.companyId = this.companyId;
            },
            queryVoucherList: function () {

                this.getListByUrl('core/enterpriseRefund/voucherList');
                /*ajax.get("core/enterpriseRefund/voucherList", this.searchParam)
                    .then(result => {
                        if(result && result.rows.length > 0){
                            this.addRowBtnShow = true;
                        }else{
                            this.addRowBtnShow = false;
                        }
                        this.voucherList = result.rows;
                      //  this.dialogPagination.listCount = result.records;
                    });*/
            },

            // 合并当次已选择的冲销明细和之前已备份的冲销明细
            concatReversalDetailList(){
                if(this.refundForm._bfreversalDetailList && this.refundForm._bfreversalDetailList.length > 0){
                    //已有备份数据则返回合并后数据
                    return this.refundForm._bfreversalDetailList.concat(this.refundForm.reversalDetailList);
                }else{
                    return this.refundForm.reversalDetailList;
                }
            },

            /*handleSizeChange(val) {
                this.dialogPagination.pageSize = val;
                this.dialogPagination.page = 1;
                this.queryVoucherList();
            },
            handleCurrentChange(val) {
                this.dialogPagination.page = val;
                this.queryVoucherList();
            },*/
            selectRowData: function (row) {
                // 拼接上已冲销过的数据的长度
                let selRowIndex = this.selectedRowIndex + (this.refundForm._bfreversalDetailList ? this.refundForm._bfreversalDetailList.length : 0);
                let reverseList = this.concatReversalDetailList();
                reverseList[selRowIndex].sourceId = row.sourceId;
                reverseList[selRowIndex].voucherCode = row.voucherCode;
                reverseList[selRowIndex].sourceType = "1";
                reverseList[selRowIndex].sourceTypeName = "企业客户收款单";
                reverseList[selRowIndex].voucherDate = row.voucherDate;
                //账目金额
                reverseList[selRowIndex].accountAmount = row.voucherCost;
                //账目冲销前金额
                reverseList[selRowIndex].beforeReversedAmount = row.unreversedAmount;
                //冲销金额
                let totalReversedAmount = 0.00;
                for (let i = 0; i < selRowIndex; i++) {
                    if (reverseList[i].reversedAmount) {
                        totalReversedAmount += parseFloat(reverseList[i].reversedAmount);
                    }
                }
                if (parseFloat(this.refundForm.refundCost) - parseFloat(totalReversedAmount) <
                    parseFloat(row.unreversedAmount)) {
                    reverseList[selRowIndex].reversedAmount = parseFloat(this.refundForm.refundCost) - parseFloat(totalReversedAmount);
                } else {
                    reverseList[selRowIndex].reversedAmount = parseFloat(row.unreversedAmount);
                }
                //账目冲销后金额
                reverseList[selRowIndex].overReversedAmount = reverseList[selRowIndex].beforeReversedAmount - reverseList[selRowIndex].reversedAmount;
                //计算退款金额
                this.calcReverseAmount();

                if(this.list && this.list.length > 1){
                    this.addRowBtnShow = true;
                }else{
                    this.addRowBtnShow = false;
                }
                //关闭选择弹窗
                this.voucherDialogClose();
            },
            calcReverseAmount: function () {
                let reverseList = this.concatReversalDetailList();
                let totalReversedAmount = 0.00;
                for (let i = 0; i < reverseList.length; i++) {
                    if (reverseList[i].reversedAmount) {
                        totalReversedAmount += parseFloat(reverseList[i].reversedAmount);
                    }
                }
                //判断冲销金额是否已经超过退款金额
                if (totalReversedAmount < this.refundForm.refundCost) {
                    this.addRowBtnShow = true;
                } else {
                    this.addRowBtnShow = false;
                }
                //设置本次冲销金额 = 冲销明细总额 - 已冲销金额
                this.refundForm.thisReverseAmount = parseFloat(totalReversedAmount) -
                    parseFloat(this.refundForm.reversedAmount);
            },
            updateEnterpriseList(data){
                this.initEnterpriseList(data[0].id);
            },
        }
    }
</script>

