<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">企业客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" placeholder="请输入企业客户" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">客户经理</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.customerManagerName" placeholder="请输入客户经理" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">业务助理</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.assistantManagerName" placeholder="请输入业务助理" clearable></el-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" style="width: 100%" border>
                <el-table-column prop="enterpriseName" sortable label="企业客户" show-overflow-tooltip min-width="250">
                    <template slot-scope="scope">
                        <a size="mini" @click="viewData(scope.row.enterpriseId)">{{scope.row.enterpriseName}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="accountTotal" sortable label="账户总额（元）" min-width="120"></el-table-column>
                <el-table-column prop="accountAvailable" sortable label="可用余额（元）" min-width="120"></el-table-column>
                <el-table-column prop="accountReceivable" sortable label="应收总额（元）" min-width="120"></el-table-column>
                <el-table-column prop="accountCurrent" sortable label="活期账户（元）" min-width="120"></el-table-column>
                <el-table-column prop="depositCash" sortable label="保证金（元）" min-width="120"></el-table-column>
                <el-table-column prop="creditLimit" sortable label="信用额度（元）" min-width="120"></el-table-column>
                <el-table-column prop="settlementStatusName" sortable label="结算方式" min-width="100"></el-table-column>
                <el-table-column prop="settlementTime" sortable label="结算日" min-width="100"></el-table-column>
                <el-table-column prop="paymentTypeName" sortable label="付款方式" min-width="100"></el-table-column>
                <el-table-column prop="paymentCycle" sortable label="付款周期" min-width="100"></el-table-column>
                <el-table-column prop="customerManager" sortable label="客户经理" min-width="100"></el-table-column>
                <el-table-column prop="assistantManager" sortable label="业务助理" min-width="100"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'corporateCustomerAccountsStatus',
        mixins: [tool],
        data() {
            return{
                listUrl:"core/corporateCustomer/accountStatusList",
                showExportBtn: this.getCurrentUserAuthority("customerAccountsStatus/export"),
                searchParam: {
                    enterpriseName: "",
                    customerManager: "",
                    businessAssistant: ""
                }
            }
        },
        activated(){
            this.getList();
        },
        mounted(){
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        watch: {

        },
        methods: {
            viewData(id) {
                this.$router.push({path:this.$route.fullPath+"/detail/"+id});
            },
            exportExcel() {
                window.location = this.exportUrl("core/corporateCustomer/exportStatusExcel?" + $.param(this.searchParam));
            }
        }
    }
</script>

