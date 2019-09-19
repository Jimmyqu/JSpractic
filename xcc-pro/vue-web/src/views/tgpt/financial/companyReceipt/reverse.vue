<template>
    <div class="detail-panel form-panel">
        <el-form label-position="top" label-width="100px" :model="reverseForm" ref="reverseForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="收款单" name="1">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">企业客户</label>
                            <div class="input-group">
                                <span>{{reverseForm.enterpriseName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">收款日期</label>
                            <div class="input-group">
                                <span>{{reverseForm.voucherDate}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">收款方式</label>
                            <div class="input-group">
                                <span>{{reverseForm.voucherWayName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">收款金额（元）</label>
                            <div class="input-group">
                                <span>{{reverseForm.voucherCost==null?'':numberFormat(reverseForm.voucherCost)}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">银行手续费（元）</label>
                            <div class="input-group">
                                <span>{{reverseForm.bankPoundage==null?'':numberFormat(reverseForm.bankPoundage)}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">其他手续费（元）</label>
                            <div class="input-group">
                                <span>{{reverseForm.otherPoundage==null?'':numberFormat(reverseForm.otherPoundage)}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">订单号</label>
                            <div class="input-group">
                                <span>{{reverseForm.voucherCode}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">录入人</label>
                            <div class="input-group">
                                <span>{{reverseForm.creater}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">录入时间</label>
                            <div class="input-group">
                                <span>{{reverseForm.createTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">状态</label>
                            <div class="input-group">
                                <span>{{reverseForm.voucherStatusText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">已冲销金额（元）</label>
                            <div class="input-group">
                                <span>{{reverseForm.reversedAmount==null?'':numberFormat(reverseForm.reversedAmount)}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">未冲销金额（元）</label>
                            <div class="input-group">
                                <span>{{reverseForm.noReversedAmount==null?'':numberFormat(reverseForm.noReversedAmount)}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="银行信息" name="2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">银行</label>
                            <div class="input-group">
                                <span>{{reverseForm.bankName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">银行账号</label>
                            <div class="input-group">
                                <span>{{reverseForm.bankAccount}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">银行户名</label>
                            <div class="input-group">
                                <span>{{reverseForm.bankUsername}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="3">
                    <div class="flex-panel detail-box">
                        <!--合同条款-->
                        <div class="detail-item big">
                            <label class="control-label">备注</label>
                            <div class="input-group">
                                <span>{{reverseForm.remark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="审批进程" name="4"  >
                    <div class="flex-panel detail-box">
                        <approval-flow :id="id"></approval-flow>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="冲销" name="5">
                    <el-button class="float-btn" type="primary" v-show="showAddReversalDetailBtn"
                               @click.native.prevent="addTableRow()">新增
                    </el-button>
                    <el-table border style="width: 100%" :data="reversalDetailList">
                        <el-table-column label="序号" min-width="100">
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="settlementNo" label="应收账款明细" min-width="200">
                            <template slot-scope="scope">
                                <el-input type="text" size="small" v-model="scope.row.settlementNo"
                                          placeholder="单据编号" :disabled="scope.row.settlementNo!=''"
                                          @click.native="openSettlementDialog(scope.$index)">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sourceTypeName" label="单据类型" min-width="200"></el-table-column>
                        <el-table-column prop="settlementTime" label="账目时间" min-width="150"></el-table-column>
                        <el-table-column prop="settlementTotalAmount" label="账目金额(元)"
                                         min-width="150"></el-table-column>
                        <el-table-column prop="overReversedAmount" label="账目冲销前余额(元)"
                                         min-width="150"></el-table-column>
                        <el-table-column prop="reversedAmount" label="冲销金额(元)" min-width="150"></el-table-column>
                        <el-table-column prop="reversedbalance" label="账目冲销后余额(元)"
                                         min-width="150"></el-table-column>
                        <el-table-column label="操作" min-width="100" v-if="type=='reverse'">
                            <template slot-scope="scope">
                                <el-button style="color:#F56C6C;font-size: 13px;" type="text" size="small"
                                           v-if="(scope.$index + 1) == reversalDetailList.length"
                                           @click.native.prevent="deleteTableRow(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="saveReversalDetail()">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <!-- 收款单选择 dialog -->
        <el-dialog width="1000px" title="选择单据" :visible.sync="settlementDialogShow"
                   :before-close="settlementDialogClose"
                   :append-to-body="true">
            <div class="list-panel">
                <div class="search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <el-input v-model="searchParam.settlementNo"
                                      placeholder="请输入单据编号" clearable></el-input>
                        </div>
                    </div>
                    <el-button size="small" type="primary" @click="handleCurrentChange(1)">查询</el-button>
                </div>
                <el-table border :data="list" @row-dblclick="selectRowData($event)">
                    <el-table-column property="settlementNo" label="单据编号" min-width="200"></el-table-column>
                    <el-table-column property="sourceTypeName" label="单据类型" min-width="100"></el-table-column>
                    <el-table-column property="settlementTotalAmount" label="收款金额(元)" min-width="120"></el-table-column>
                    <el-table-column property="reversedAmount" label="已冲销金额(元)" min-width="120"></el-table-column>
                    <el-table-column property="overReversedAmount" label="未冲销金额(元)" min-width="120"></el-table-column>
                    <el-table-column property="settlementTime" label="账目时间" min-width="200"></el-table-column>
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
    import { number_format } from '@/utils'
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"financialCompanyReceiptReverse",
        components:{ ApprovalFlow },
        data: function () {
            return {
                type: "",
                reverseEditShow: false,
                activeNames: ['1', '2', '3', '4', '5'],
                id: "",
                enterpriseId:"",
                reversalDetailList: [],
                searchSettlementListParam: {},
                reverseForm: {},
                showAddReversalDetailBtn: true,
                settlementDialogShow: false,
                voucherList: [],
                currentReversedAmount: 0,
                currentNoReversedAmount: 0,
                reversalSaveDate: {},
               // listUrl:'core/enterpriseVoucher/getSettlementReversalList',
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
            this.open();
        },
        methods: {
            open: function () {
                this.id = this.$route.query.id;
                //类型，判断是冲销还是取消冲销
                this.type = this.$route.query.type;
                this.enterpriseId = this.$route.query.enterpriseId;
                //this.companyId = bean.companyId;
                if (this.type == "noReverse") {
                    this.showAddReversalDetailBtn = false;
                }else{
                    this.showAddReversalDetailBtn = true;
                }
                this.initDetailData();

                this.reverseEditShow = true;
            },
            initDetailData: function () {
                ajax.get('core/enterpriseVoucher/getDetail?id=' + this.id).then(result => {
                    if (result.status == 0) {
                        this.reverseForm = result.data[0];
                        this.currentNoReversedAmount = result.data[0].noReversedAmount;
                        //$this.reversalDetailList = result.data[1];
                        this.reversalDetailList = [];
                    } else {
                        this.$message.error(result.message);
                    }
                });
            },
            openSettlementDialog: function (index) {
                if(this.reversalDetailList[index].settlementNo){
                    return;
                }
                if (this.type == "reverse") {
                    this.selectedRowIndex = index;
                    this.querySettlementList();
                    this.settlementDialogShow = true;
                } else {
                    this.settlementDialogShow = false;
                }

            },
            settlementDialogClose: function () {
                this.settlementDialogShow = false;
            },

            getListBefore(param){
                //拼接已经选择的收款单id
                let $this = this;
                let selectedSettlementNo = "";
                for (let i = 0; i < this.reversalDetailList.length; i++) {
                    if (this.reversalDetailList[i].settlementId) {
                        selectedSettlementNo = selectedSettlementNo + "," + this.reversalDetailList[i].settlementId;
                    }
                }
                param.selectedSettlementNo = selectedSettlementNo;
                param.enterpriseId = $this.enterpriseId;
                param.companyId = $this.companyId;
            },
            querySettlementList: function () {
                debugger


                /*let params = this.searchSettlementListParam;
                params.rows = this.dialogPagination.pageSize;
                params.page = this.dialogPagination.page;*/


                this.getListByUrl('core/enterpriseVoucher/getSettlementReversalList');
                /*ajax.get("core/enterpriseVoucher/getSettlementReversalList", params)
                    .then(result => {
                        $this.voucherList = result.rows;
                        $this.dialogPagination.listCount = result.records;
                    });*/
            },
            /*handleSizeChange(val) {
                this.dialogPagination.pageSize = val;
                this.dialogPagination.page = 1;
                this.querySettlementList();
            },*/
            /*handleCurrentChange(val) {
                this.dialogPagination.page = val;
                this.querySettlementList();
            },*/
            addTableRow: function () {
                let row = {
                    settlementId: "",
                    settlementNo: "",
                    sourceType: "1",
                    sourceTypeName: "",
                    settlementTime: "",
                    settlementTotalAmount: 0.00,
                    overReversedAmount: 0.00,
                    reversedAmount: 0.00,
                    reversedbalance: 0.00
                };
                if(this.reversalDetailList.length>0){
                    for (var i=0;i<this.reversalDetailList.length;i++)
                    {
                        if(this.reversalDetailList[i].settlementTotalAmount==0){
                            this.$message.error("请选择冲销明细！");
                            return;
                        }
                    }
                }
                this.reversalDetailList.push(row);
            },
            selectRowData: function (row) {
                let selRowIndex = this.selectedRowIndex;
                this.reversalDetailList[selRowIndex].settlementId = row.settlementId;
                this.reversalDetailList[selRowIndex].settlementNo = row.settlementNo;
                this.reversalDetailList[selRowIndex].sourceTypeName = row.sourceTypeName;
                this.reversalDetailList[selRowIndex].settlementTime = row.settlementTime;
                this.reversalDetailList[selRowIndex].settlementTotalAmount = row.settlementTotalAmount;
                this.reversalDetailList[selRowIndex].overReversedAmount = row.overReversedAmount;

                /*//计算已冲销金额和未冲销金额
                for (var i=0;i<this.reversalDetailList.length;i++)
                {
                    this.currentReversedAmount = this.reversalDetailList[selRowIndex].reversedAmount;
                }*/

                //判断新增按钮是否显示
                if (this.currentNoReversedAmount <= row.overReversedAmount) {
                    this.showAddReversalDetailBtn = false;
                }

                if (this.currentNoReversedAmount >= row.overReversedAmount) {
                    this.reversalDetailList[selRowIndex].reversedAmount = row.overReversedAmount;
                    this.reversalDetailList[selRowIndex].reversedbalance = 0;
                    this.currentReversedAmount = this.currentReversedAmount + row.overReversedAmount;
                    this.currentNoReversedAmount = this.currentNoReversedAmount - row.overReversedAmount;
                } else {
                    this.reversalDetailList[selRowIndex].reversedAmount = this.currentNoReversedAmount;
                    this.reversalDetailList[selRowIndex].reversedbalance = row.overReversedAmount - this.currentNoReversedAmount;
                    this.currentReversedAmount = this.currentReversedAmount + this.currentNoReversedAmount;
                    this.currentNoReversedAmount = 0;
                }
                this.settlementDialogClose();
            },
            deleteTableRow: function (index) {
                this.currentReversedAmount = this.currentReversedAmount - this.reversalDetailList[index].reversedAmount;
                this.currentNoReversedAmount =  this.currentNoReversedAmount + this.reversalDetailList[index].reversedAmount;

                this.reversalDetailList.splice(index, 1);
                this.showAddReversalDetailBtn = true;
            },
            saveReversalDetail: function () {
                let url = "core/enterpriseVoucher/"+this.type;
                let data = this.reversalSaveDate;
                if (this.reversalDetailList.length > 0) {
                    for(var i=0;i<this.reversalDetailList.length;i++){
                        if(this.reversalDetailList[i].settlementId=='' || this.reversalDetailList[i].settlementId==undefined){
                            this.$message.error("冲销明细不能为空");
                            return false;
                        }
                    }
                    this.reversalSaveDate.id = this.id;
                    this.reversalSaveDate.voucherReverseDetailList = this.reversalDetailList;
                    ajax.post(url, data) .then(res => {
                        if (res.status == 0) {
                            this.$message({message: '保存成功！', type: 'success'});
                            this.close();
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                } else {
                    this.$message.error("没有可以操作的冲销明细");
                    return false;
                }
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
        }
    }
</script>
