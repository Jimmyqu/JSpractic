<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">退款单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.refundCode" autocomplete="off" type="text" clearable
                                  placeholder="请输入退款单编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">企业客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" autocomplete="off" type="text" clearable
                                  placeholder="请输入企业客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">退款日期</label>
                    <div class="input-group">
                        <el-date-picker v-model="refundDate" type="daterange" clearable
                                        start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.refundStatus" placeholder="不限" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="完成" value="40"></el-option>
                        </el-select>

                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="row tool-box">
            <div class="operation">
                <el-button type="warning" size="mini" @click="addRefund()" v-if="showAddBtn">新增</el-button>
                <el-button size="mini" type="primary" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" @click="exportRefund()" v-if="showExportBtn">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border style="width: 100%" :data="list">
                <el-table-column label="操作" min-width="140" fixed="left">
                    <template slot-scope="scope">
                        <el-button @click="editRefund(scope.row.id)" type="text" size="small"
                                   v-if="(scope.row.refundStatus == 10 || scope.row.refundStatus == 30) && showEditBtn">编辑
                        </el-button>
                        <el-button @click="submitRefund(scope.row.id)" type="text" size="small"
                                   v-if="scope.row.refundStatus == 10 && showSubmitBtn">提交</el-button>
                        <el-button @click="reversal(scope.row)" type="text" size="small"
                                   v-if="scope.row.refundStatus == 40 && scope.row.unreversedAmount > 0 && showReverseBtn">冲销</el-button>
                        <el-button @click="unReversal(scope.row.id)" type="text" size="small"
                                   v-if="scope.row.refundStatus == 40 && scope.row.reversedAmount > 0 && showReverseBtn">取消冲销</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="refundCode" label="退款单编号" min-width="200" sortable fixed="left">
                    <template slot-scope="scope">
                        <a @click="toDetail(scope.row)">{{ scope.row.refundCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" label="所属组织" min-width="140" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="enterpriseName" label="企业客户" min-width="140" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="refundStatusText" label="状态" min-width="140" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="refundWayName" label="退款方式" min-width="100" sortable></el-table-column>
                <el-table-column prop="refundDate" label="退款日期" min-width="100" sortable></el-table-column>
                <el-table-column prop="refundCost" label="退款金额（元）" min-width="140" sortable></el-table-column>
                <el-table-column prop="reversedAmount" label="已冲销金额（元）" min-width="150" sortable></el-table-column>
                <el-table-column prop="unreversedAmount" label="未冲销金额（元）" min-width="150" sortable></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip sortable></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {startProcessAsync , startProcess} from '@/utils/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'financialCompanyRefund',
        mixins: [tool],
        data: function () {
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("financial/enterpriseRefund/add"),
                showEditBtn: this.getCurrentUserAuthority("financial/enterpriseRefund/edit"),
                showSubmitBtn: this.getCurrentUserAuthority("financial/enterpriseRefund/submit"),
                showReverseBtn: this.getCurrentUserAuthority("financial/enterpriseRefund/reverse"),
                showExportBtn: this.getCurrentUserAuthority("financial/enterpriseRefund/export"),
                refundStatusMap: [],
                refundDate:[],
                listUrl: "core/enterpriseRefund/list",
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
           // this.initStatus();
            var refundStatus = this.$route.query.refundStatus;
            var startDate = this.$route.query.startDate;
            var endDate = this.$route.query.endDate;
            if(refundStatus){
                this.searchParam.refundStatus=refundStatus;
            }
            if(startDate && endDate){
                this.refundDate.push(startDate,endDate);
            }
            this.searchParam = Object.assign({},this.searchParam);
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            initStatus: function () {
                //获取退款单状态
                ajax.get("core/enterpriseRefund/getStatus").then(res=>{
                    this.refundStatusMap = res.data;
                });

            },

            getListBefore(params){
                if (this.refundDate) {
                    params.refundBeginDate = this.refundDate[0];
                    params.refundEndDate = this.refundDate[1];
                    this.searchParam.refundBeginDate = '';
                    this.searchParam.refundEndDate = '';
                }else{
                    params.refundBeginDate = this.refundDate[0];
                    params.refundEndDate = this.refundDate[1];
                    this.searchParam.refundBeginDate = '';
                    this.searchParam.refundEndDate = '';
                }
            },
            /*refundDateChange: function () {
                let refundDate = this.searchParam.refundDate;

                this.searchParam.refundBeginDate = refundDate[0];
                this.searchParam.refundEndDate = refundDate[1];
            },*/
            addRefund: function () {
                let param = {
                    "id": "",
                    "formType": "add"
                };
                this.$router.push({path:"/tgpt/financial/companyRefund/add",query:param});
            },
            editRefund: function (id) {
                let param = {
                    "id": id,
                    "formType": "edit"
                };
                this.$router.push({path:"/tgpt/financial/companyRefund/edit",query:param});
            },

            submitRefund: function (id) {

                this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'QYKHTKD').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});

            },

            /*submitRefund: function (id) {
                this.$confirm('确认提交退款单审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("core/enterpriseRefund/submit/" + id, "", function (result) {
                        if(result.status == 0) {
                            //发起审批
                            this.startContractOutApproval(id);
                            this.$message.success("提交审批成功");
                        }else {
                            this.$message.error(result.message);
                        }
                    });
                });
            },*/
            reversal: function (row) {
                let param = {
                    "id": row.id,
                    "enterpriseId":row.enterpriseId,
                    "formType": "reverse",
                    "companyId": row.companyId
                };
                this.$router.push({path:"/tgpt/financial/companyRefund/reversal",query:param});
            },
            unReversal: function (id) {
                this.$confirm('是否确定取消冲销?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var data = {
                        id:id,
                    };
                    ajax.post("core/enterpriseRefund/unreverse", data).then( result => {
                        if(result.status == 0) {
                            this.$message.success("提交审批成功");
                            //发起审批
                            this.startContractOutApproval(id);
                        }else {
                            this.$message.error(result.message);
                        }
                    })
                })
            },
            exportRefund: function () {
                window.location = this.exportUrl("core/enterpriseRefund/export?" + $.param(this.searchParam));
            },
            //重置筛选
            resetList(){
                this.searchParam = {};
                this.refundDate = [];
                this.handleCurrentChange(1);
            },
            startContractOutApproval(id) {
                if(!id) {
                    console.error("流程业务id错误");
                    return;
                }
                let businessId = id;
                let modelType = "QYKHTKD";
                let $this = this;
                startProcess(businessId, modelType, function (result) {
                    if (result.status == 0) {
                        //刷新列表
                        $this.getList();
                    }
                });
            },
        }
    }
</script>

