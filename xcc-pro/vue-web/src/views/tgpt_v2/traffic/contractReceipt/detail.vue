<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">支付日期</label>
                    <div class="input-group">
                        <el-date-picker
                            clearable
                            v-model="paymentDate"
                            @change="paymentDateChange"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">收款状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.paymentStatus" placeholder="请选择收款状态">
                            <el-option label="全部未收" :value="1"></el-option>
                            <el-option label="部分已收" :value="2"></el-option>
                            <el-option label="全部已收" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">到期状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.expiredStatus" placeholder="请选择到期状态">
                            <el-option label="未到期" :value="1"></el-option>
                            <el-option label="即将到期" :value="2"></el-option>
                            <el-option label="已到期" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <!--<el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>-->

            </div>
            <div class="pagination">
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

        <div class="table-box">
            <p class="summary"> <span>合同编号：</span><span>{{paymentTotal.contractNumber}}</span>
                <span style="margin-left: 100px;"> 承租人：</span><span>{{paymentTotal.renter}} | {{paymentTotal.phone}}</span>
                <span style="margin-left: 100px;">到期应收金额(元)：</span><span>{{paymentTotal.dueAmount}}</span>
                <span style="margin-left: 100px;">已收金额(元)：</span><span>{{paymentTotal.receivedAmount}}</span>
            </p>
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showSaveBtn" v-if="(scope.row.paymentStatus == 1 || scope.row.paymentStatus == 2) && scope.row.contractStatus != 70" type="text" @click="registration(scope.row.id,scope.row.unReceivedAmount)">收款登记</el-button>
                        <el-button v-show="showRecordBtn" type="text"  v-if="scope.row.paymentStatus == 2 || scope.row.paymentStatus == 3" @click="receiptRecord(scope.row.id,scope.row.receivedAmount)">收款记录</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="140" label="款项类型" prop="paymentTypeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" label="期数" prop="period" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="应收金额(元)" prop="amount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="支付日期" prop="paymentDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="临期提醒" prop="remindDays" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="到期状态" prop="expiredStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="收款状态" prop="paymentStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="已收金额(元)" prop="receivedAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="未收金额(元)" prop="unReceivedAmount" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>


        <!-- 收款登记弹窗-->
        <el-dialog title="收款登记" class="unReceivedAmount" :visible.sync="receiptVisible" :append-to-body="true"  width="500">
            <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" class="full-input">
                <el-form-item label="收款日期" prop="receiptDate">
                    <el-date-picker v-model="addForm.receiptDate" clearable  value-format="yyyy-MM-dd"  type="date" placeholder="请选择收款日期" ></el-date-picker>
                </el-form-item>
                <el-form-item label="收款金额（元）" label-width="120px" prop="receiptAmount">
                    <el-input v-model="addForm.receiptAmount" clearable ></el-input>
                </el-form-item>
                <span>当前未收金额:{{unReceivedAmount}}元</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close('addForm')">取 消</el-button>
                <el-button type="primary" @click="submit('addForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 收款记录弹窗-->
        <el-dialog title="收款记录" custom-class="receipt-record" :visible.sync="recordVisible" :append-to-body="true" >
            <span style="font-weight: bold;margin: 10px 0;display:block;">收款合计:{{receivedAmount}}元</span>
            <el-table border :data="receiptRecords" max-height="300" style="width: 100%">
                <el-table-column min-width="140" label="收款日期" prop="receiptDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="收款金额(元)" prop="receiptAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="登记人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="登记时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import MoneyInput from '@/components/MoneyInput/index'
    import $ from 'jquery-slim'


    export default {
        name: 'contractReceiptDetail',
        mixins: [ tool, ruleTool ],
        components: { MoneyInput},
        data() {
            return {
                state:false,
                showSearch: false,
                showSaveBtn:this.getCurrentUserAuthority("traffic/trafficReceiptRegistration/registration"),
                showRecordBtn : this.getCurrentUserAuthority("traffic/trafficReceiptRegistration/receiptRecord"),
                organization:[],
                searchParam: {
                  /*  paymentDateStart:'',
                    paymentDateEnd:'',
                    paymentStatus:'',
                    expiredStatus:'',*/
                    contractId : this.$route.params.id,
                },
                paymentDate: [],
                listUrl: 'traffic/trafficReceiptRegistration/receiptList',
                contractPaymentId:'',
                unReceivedAmount:'',
                receivedAmount:'',
                addForm:{},
                receiptVisible:false,
                recordVisible:false,
                receiptRecords: [],
                paymentTotal:{},
                formRule,
                rules:{
                    receiptDate: [
                        { required: true, message: '请选择收款日期', trigger: 'change' },
                    ],
                    receiptAmount: [
                        { required: true, message: '请输入收款金额', trigger: 'blur' },
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ]
                }
            }
        },
        activated(){
            this.getList();
            this.getPaymentTotal();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
                this.getPaymentTotal();
            }
        },
        methods: {
            getListBefore(params) {
                if(this.paymentDate && this.paymentDate.length>0){
                    let date = this.paymentDate;
                    this.searchParam.paymentDateStart = date[0] ;
                    this.searchParam.paymentDateEnd = date[1] ;
                }
            },
            paymentDateChange() {
                if(this.paymentDate && this.paymentDate.length>0){
                    let date = this.paymentDate;
                    this.searchParam.paymentDateStart = date[0] ;
                    this.searchParam.paymentDateEnd = date[1] ;
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            getPaymentTotal(){
                var contractId = this.$route.params.id;
                ajax.get('traffic/trafficReceiptRegistration/receiptTotal/' +contractId,).then(rs => {
                    if(rs.status == 0){
                        this.paymentTotal = rs.data;
                    }else{
                        this.paymentTotal = {}
                    }
                });
            },
            resetList(){
                this.searchParam = {
                        paymentDateStart:'',
                        paymentDateEnd:'',
                        paymentStatus:'',
                        expiredStatus:'',
                        contractId : this.$route.params.id,
                },
                this.paymentDate=[];
                this.getList();
            },
            receiptDetail(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detail/"+id});
            },
            receiptRecord(id,receivedAmount){
                this.receivedAmount = receivedAmount;
                //查询收款记录
                ajax.get('traffic/trafficReceiptRegistration/receiptRecord/' +id,).then(rs => {
                    if(rs.status == 0){
                        this.receiptRecords = rs.data;
                    }else{
                        this.receiptRecords = []
                    }
                    this.recordVisible = true;
                });
            },
            registration(id,unReceivedAmount){
                this.contractPaymentId = id;
                this.unReceivedAmount = unReceivedAmount;
                debugger
                this.addForm = {};
                //this.addForm.receiptDate = new Date().format("yyyy-MM-dd");
                this.$set(this.addForm,"receiptDate",new Date().format("yyyy-MM-dd"));
                this.$set(this.addForm,"receiptAmount",unReceivedAmount+'');
                this.receiptVisible = true;
            },
            close(addForm){
                this.$refs[addForm].resetFields();
                this.receiptVisible = false;
            },
            submit(addForm){
                debugger
                let url = "traffic/trafficReceiptRegistration/save";
                let data = {
                    contractPaymentId : this.contractPaymentId,
                    receiptDate : this.addForm.receiptDate,
                    receiptAmount :  this.addForm.receiptAmount
                };
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                        if(this.addForm.receiptAmount > this.unReceivedAmount){
                            this.$message.error("收款金额不能大于当前未收金额");
                            return;
                        }
                        if(this.state) {
                            return;
                        }
                        this.state = true;
                        ajax.post(url, data) .then(res => {
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close(addForm);
                                this.getList();
                                this.getPaymentTotal();
                            }else {
                                this.$message.error(res.message);
                            }
                        }).catch(_=>{
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .unReceivedAmount{
        .el-dialog{
            width: 30%;
        }
    }
</style>

