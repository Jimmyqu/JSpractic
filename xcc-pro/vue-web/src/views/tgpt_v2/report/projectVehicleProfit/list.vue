<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" ></tree-select>
                        <el-checkbox v-model="searchParam.organCascade">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM">
                        </el-date-picker>
                    </div>
                </div>
            </div>

            <div class="search-btn-list">
                <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>

        </div>

        <div class="tool-box">
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
        </div>

        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
				<el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="月份" prop="time" sortable show-overflow-tooltip></el-table-column>
                <el-table-column label="收入">
                    <el-table-column min-width="140" label="收入(万元)" prop="totalAmount" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="同比" prop="yearOnYear" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="环比" prop="chainRatio" sortable show-overflow-tooltip></el-table-column>
                </el-table-column>
                    <el-table-column label="车辆总数(辆)">
                    <el-table-column min-width="140" label="车辆总数(辆)" prop="vehicleTotal" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="同比" prop="vehicleYearOnYear" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="环比" prop="vehiclechainRatio" sortable show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="单车收入(万元)">
                    <el-table-column min-width="140" label="单车收入(万元)" prop="averageIncome" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="同比" prop="averageYearOnYear" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="环比" prop="averageChainRatio" sortable show-overflow-tooltip></el-table-column>
                </el-table-column>
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
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'projectVehicleProfit',
        mixins: [tool],
        components: { TreeSelect,ConfirmForm },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showExportExcelBtn:  this.getCurrentUserAuthority('projectVehicleProfit/exportExcel')
                ,
                listUrl: 'report/projectVehicleProfit',
                createDate:"",
                companyIds:""
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
        },
        methods: {
            getListBefore(params) {
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                }
            },
            exportExcel() {
                var params=this.searchParam;
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                }
                window.location = this.exportUrl("report/projectVehicleProfit/excel?" + $.param(params));
            },resetList(){
                this.searchParam={};
                this.createDate=[];
                this.companyIds=[];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

