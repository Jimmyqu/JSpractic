<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="tool-box">
            <div class="operation">
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
        <div class="table-box">
            <template>
                <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%;">
                    <el-table-column prop="enterpriseName" sortable label="企业客户" min-width="140">
                        <template slot-scope="scope">
                            <a @click="toDetail(scope.row)">{{scope.row.enterpriseName}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="voucherSourceType" sortable label="收款账目单据类型" min-width="150"></el-table-column>
                    <el-table-column prop="voucherCode" sortable label="收款账目单据" min-width="200"></el-table-column>
                    <el-table-column prop="voucherCost" sortable label="收款账目金额（元）" min-width="150"></el-table-column>
                    <el-table-column prop="voucherBeforeAvailable" sortable label="收款账目冲销前余额（元）" min-width="180"></el-table-column>
                    <el-table-column prop="voucherAfterAvailable" sortable label="收款账目冲销后余额（元）" min-width="180"></el-table-column>
                    <el-table-column prop="refundSourceType" sortable label="应收账目单据类型" min-width="180"></el-table-column>
                    <el-table-column prop="refundCode" sortable label="应收账目单据" min-width="220"></el-table-column>
                    <el-table-column prop="refundCost" sortable label="应收账目金额（元）" min-width="150"></el-table-column>
                    <el-table-column prop="refundBeforeAvailable" sortable label="应收账目冲销前余额（元）" min-width="180"></el-table-column>
                    <el-table-column prop="refundAfterAvailable" sortable label="应收账目冲销后余额（元）" min-width="180"></el-table-column>
                    <el-table-column prop="reversedAmount" sortable label="冲销金额（元）" min-width="120"></el-table-column>
                    <el-table-column prop="creater" sortable label="操作人" min-width="120"></el-table-column>
                    <el-table-column prop="createTime" sortable label="操作时间" min-width="180"></el-table-column>
                </el-table>
            </template>

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'corporateCustomerWriteoffRecord',
        mixins: [tool],
        data() {
            return {
                listUrl:"core/corporateCustomer/writeoffRecordList",
                title : '企业客户账户冲销记录',
                showExportBtn : this.getCurrentUserAuthority("customerWriteoffRecord/export"),
                searchParam:{
                    enterpriseName: "",
                },
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
        methods: {
            exportExcel : function () {
                window.location = this.exportUrl("core/corporateCustomer/exportExcel?" + $.param(this.searchParam));
            },
        }
    }
</script>

