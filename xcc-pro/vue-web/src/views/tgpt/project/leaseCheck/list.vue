<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">订单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" clearable placeholder="请输入项目订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.settlementNo" clearable
                                  placeholder="请输入用车单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供车单位</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.providerCompanyName" clearable placeholder="请输入供车单位"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" clearable placeholder="请输入司机姓名或手机号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="carUseMonth"
                            type="monthrange"
                            range-separator="至"
                            value-format="yyyy-MM"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">

                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>

                <el-button  v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column prop="orderNumber" sortable label="项目订单号" min-width="200"></el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
                <el-table-column prop="settlementNo" sortable label="用车单号" min-width="220">
                    <template slot-scope="{ row, column, $index }">
                        <a size="mini" @click="toDetail(row)">{{row.settlementNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="providerCompanyName" sortable label="供车单位" min-width="150"></el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <el-table-column prop="driver" sortable label="司机" min-width="140"></el-table-column>
                <el-table-column prop="carUseMonth" sortable label="月份" min-width="120"></el-table-column>
                <el-table-column prop="totalAmount" sortable label="本月总费用(元)" min-width="140"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: 'leaseCheck',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                showExportBtn: this.getCurrentUserAuthority("core/leaseCheck/export"),
                formData: {},
                listUrl: "core/leaseCheck/list",
                carUseMonth: [],
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        mounted() {
            this.initDate();
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            initDate(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var endDate = (year.toString() + "-" + month.toString());

                date.setMonth(date.getMonth() - 3);
                var startDate = date.format('yyyy-MM');

                this.carUseMonth = [startDate,endDate];
            },
            getListBefore(params) {
                if (this.carUseMonth) {
                    params.carUseStartMonth = this.carUseMonth[0];
                    params.carUseEndMonth = this.carUseMonth[1];
                    this.searchParam.carUseStartMonth = this.carUseMonth[0];
                    this.searchParam.carUseEndMonth = this.carUseMonth[1];
                } else {
                    params.carUseStartMonth = '';
                    params.carUseEndMonth = '';
                    this.searchParam.carUseStartMonth = '';
                    this.searchParam.carUseEndMonth = '';
                }
            },
            exportData() {
                location.href = this.exportUrl("core/leaseCheck/export?" + $.param(this.searchParam));
            },
            resetList() {
                this.initDate();
                this.searchParam = {};
                this.startDate = [];
                this.endDate = [];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

