<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
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
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="originateDeptId" placeholder="服务组织" type="one" clearable
                                     url="admin/organization/tree"></tree-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <!--<i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>-->
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="searchList()">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
        <div class="content" v-loading="listLoading">
            <div class="table-box">
                <div class="table-content">
                    <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                        <el-table-column prop="region" sortable label="分公司" min-width="100"></el-table-column>
                        <el-table-column prop="count" sortable label="维保单数" min-width="100"></el-table-column>
                        <el-table-column prop="total" sortable label="总费用（元）" min-width="200"></el-table-column>
                        <el-table-column prop="cvmaprice" sortable label="配件费用（元）" min-width="100"></el-table-column>
                        <el-table-column prop="cvmmprice" sortable label="工时费用（元）" min-width="120"></el-table-column>
                        <!--<el-table-column label="操作" min-width="100">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-button @click="toDetail(scope.row.plate, null)" type="text"-->
                                        <!--size="small">详情-->
                                <!--</el-button>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from "echarts";
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import { mapGetters } from 'vuex'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {

                listUrl: 'report/maintenanceBillReportController/list',
                excelUrl: 'report/maintenanceBillReportController/exportExcel?',
                showExportExcelBtn: this.getCurrentUserAuthority('maintenanceBillReportController/exportExcel'),
                showSearch: false,
                carUseMonth: [],
                originateDeptId: []
            }
        },
        computed:{
            ...mapGetters([
                'sidebar'
            ]),
            sidebar() {
                return this.$store.state.app.sidebar.opened
            },
        },
        mounted() {
            this.initDate();
            this.getList();
        },
        methods: {
            searchList(){
                this.searchParam.organizationId = this.originateDeptId[0];
                this.getList();
                this.getFuelConsumption();
            },
            initDate(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var endDate = (year.toString() + "-" + month.toString());

                date.setMonth(date.getMonth() - 2);
                var startDate = date.format('yyyy-MM');

                this.carUseMonth = [startDate,endDate];
            },
            getListBefore(params) {
                if (this.carUseMonth) {
                    params.startTime = this.carUseMonth[0];
                    params.endTime = this.carUseMonth[1];
                } else {
                    params.startTime = '';
                    params.endTime = '';
                }
            },
            formatDate(time){
                var date = new Date(time);

                var year = date.getFullYear();
                var month = date.getMonth() + 1;//月份是从0开始的
                var day = date.getDate();
                if (month < 10) {
                    month = '0' + month
                };
                if (day < 10) {
                    day = '0' + day
                };
                var newTime = year + '-' +
                    month + '-' +
                    day;
                return newTime;
            },
            exportExcel(){
                var params = this.searchParam;
                if (this.carUseMonth) {
                    params.startTime = this.carUseMonth[0];
                    params.endTime = this.carUseMonth[1];
                }
                if (this.originateDeptId) {
                    params.organizationId = this.originateDeptId[0];
                }
                window.location = this.exportUrl(this.excelUrl + $.param(params));
            },
            resetList() {
                this.originateDeptId = '';
                this.searchParam = {};
                this.initDate();
                this.searchList();
                this.handleCurrentChange(1);
            },
        }
    }
</script>
