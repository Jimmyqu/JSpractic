<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="orgIds" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.orgId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">年份</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.year"
                            type="year"
                            value-format = "yyyy"
                            placeholder="选择年份">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <!-- <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i> -->
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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

        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column min-width="120" label="序号" prop="index"  show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="所属组织" prop="orgName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="一月(万元)" prop="janFee" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="二月(万元)" prop="febFee" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="三月(万元)" prop="marFee" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="四月(万元)" prop="aprFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="五月(万元)" prop="mayFee" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="六月(万元)" prop="junFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="七月(万元)" prop="julFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="八月(万元)" prop="augFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="九月(万元)" prop="sepFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="十月(万元)" prop="octFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="十一月(万元)" prop="novFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="十二月(万元)" prop="decFee" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="汇总(万元)" prop="totalCost" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name:'branchIncomeReport',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                orgIds:[],
                searchParam: {
                    year: '2018'
                },
                showExportExcelBtn: this.getCurrentUserAuthority('branchIncomeReport/exportExcel'),
                listUrl: '/report/branchIncome/branchIncomeList'
            }
        },
        activated: function () {
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
           /* getListBefore(params) {
                params.orgId = this.orgIds[0];
            },*/
            changeOrganization(data){
                if(this.orgIds && this.orgIds.length==1){
                    this.searchParam.orgId=this.orgIds[0];
                }else{
                    this.searchParam.orgId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            resetList(){
              this.searchParam = {year:"2018"};
              this.orgIds = [];
              this.$set(this.searchParam,'organCascade',0);
              this.getList();
            },

            exportExcel() {
                var params=this.searchParam;
                params.orgId = this.orgIds[0];
                window.location = this.exportUrl("report/branchIncome/excel?" + $.param(params));
            }
        }
    }
</script>

