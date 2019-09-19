<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">项目合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable autocomplete="off" placeholder="请输入项目合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">条款状态</label>
                    <div class="input-group">
                        <el-select placeholder="请选择条款状态" clearable v-model="searchParam.termsStatus">
                            <el-option label="不限" value=""> </el-option>
                            <el-option label="有效" value="1"> </el-option>
                            <el-option label="作废" value="2"> </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">审批状态</label>
                    <div class="input-group">
                        <el-select placeholder="请选择审批状态" clearable v-model="searchParam.approvalStatus">
                            <el-option v-for="(value, key) in approvalStatusList" :key="key" :label="value" :value="key">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算方式</label>
                    <div class="input-group">
                        <el-select placeholder="请选择结算方式" clearable v-model="searchParam.settlementModel">
                            <el-option v-for="item in settlementModelList" :key="item.value" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">协议开始日期</label>
                    <div class="input-group">
                        <el-date-picker clearable v-model="searchParam.contractDate"
                                        @change="contractDateChange"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">付款方式</label>
                    <div class="input-group">
                        <el-select placeholder="请选择付款方式" clearable v-model="searchParam.paymentModel">
                            <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button size="mini" type="warning" v-show="addBtnShow" @click="add()">申请条款</el-button>
            <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
        </div>

        <div class="table-box">
            <el-table v-loading="listLoading":data="list" style="width: 100%" border>
                <el-table-column fixed label="操作" width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.approvalStatus==10">
                            <el-button @click.native.prevent="edit(scope.row.id)" type="text" v-show="editBtnShow" size="small">编辑</el-button>
                            <el-button @click.native.prevent="apply(scope.row)" type="text" v-show="applyBtnShow" size="small">提交审批</el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="contractNo" sortable label="项目合同编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="150"></el-table-column>
                <el-table-column prop="contractStartDate" sortable label="协议开始日期" min-width="130"></el-table-column>
                <el-table-column prop="contractEndDate" sortable label="协议结束日期" min-width="130"></el-table-column>
                <el-table-column prop="termsStatus" sortable label="条款状态" min-width="120"></el-table-column>
                <el-table-column prop="approvalStatusText" sortable label="审批状态" min-width="120"></el-table-column>
                <el-table-column prop="settlementModel" sortable label="结算方式" min-width="100"></el-table-column>
                <el-table-column prop="settlementDate" sortable label="结算日(日)" min-width="100"></el-table-column>
                <el-table-column prop="paymentModel" sortable label="付款方式" min-width="120"></el-table-column>
                <el-table-column prop="paymentCycle" sortable label="付款周期(日)" min-width="120"></el-table-column>
                <el-table-column prop="creditLimit" sortable label="信用额度(元)" min-width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.creditLimit=='/'?'/':numberFormat(scope.row.creditLimit)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="invoiceTaxRateDriver" sortable label="税金(司机)" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.invoiceTaxRateDriver}}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="invoiceTaxRateVehicle" sortable label="税金(车)" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.invoiceTaxRateVehicle}}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" sortable label="录入人" min-width="120"></el-table-column>
                <el-table-column prop="createTime" sortable label="录入时间" min-width="150"></el-table-column>
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
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcess,number_format} from '@/utils/index'

    export default {
        name: 'projectTermApplyApprova',
        mixins: [tool],
        data() {
            return {
                showSearch: false,
                addBtnShow: this.getCurrentUserAuthority("projectterms/add"),
                exportBtnShow: this.getCurrentUserAuthority("projectterms/export"),
                editBtnShow: this.getCurrentUserAuthority("projectterms/edit"),
                applyBtnShow: this.getCurrentUserAuthority("projectterms/apply"),
                settlementModelList: [],
                paymentModelList: [],
                approvalStatusList: [],
                listUrl: "core/projectterms/list",
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getSettlementModelList();
            this.getpaymentModelList();
            this.getApprovalStatus();
        },
        methods: {
            numberFormat(number) {
                return number_format(number, 2, '.', ',');
            },
            getSettlementModelList() {
                ajax.get("admin/dict/type/付款方式").then(res =>{
                    this.paymentModelList = res;
                });
            },
            getpaymentModelList() {
                ajax.get("admin/dict/type/结算方式").then(res =>{
                    this.settlementModelList = res;
                });
            },
            getApprovalStatus() {
                ajax.get("core/projectterms/getapprovalstatus").then(res =>{
                    this.approvalStatusList = res.data;
                });
            },
            contractDateChange() {
                let contractDate = this.searchParam.contractDate;

                this.searchParam.contractStartDate = contractDate[0] + " 00:00:00";
                this.searchParam.contractEndDate = contractDate[1] + " 23:59:59";
            },
            exportExcel() {
                var param = ""
                for (var p in this.searchParam) {
                    param += p + "=" + this.searchParam[p] + "&";
                }
                window.location.href = this.exportUrl("core/projectterms/export?" + param.substr(0, param.length - 1));
            },
            apply(rows) {
                this.$confirm('你确定要提交审批吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcess(rows.id, 'XMTKSQJSP', function () {
                        this.showMessage("提交审批成功", "success", function () {
                            this.getList();
                        });
                    })
                });
            }
        }

    }
</script>

