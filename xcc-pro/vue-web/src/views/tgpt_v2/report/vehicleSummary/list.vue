<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.month"
                            type="month"
                            placeholder="选择月"
                            value-format="yyyy-MM">
                        </el-date-picker>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column min-width="120" label="分公司" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="在执行合同" prop="contractQuantity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="长租车辆" prop="longRentQuantity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="非长租车辆" prop="unlongRentQuantity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="待处置" prop="disposalQuantity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="已出售" prop="soldQuantity" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleAccidentMaintenanceReport',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                organization:[],
                showExportBtn: this.getCurrentUserAuthority('vehicleSummary/export'),
                listUrl: 'report/vehicleSummary/list',
                searchParam:{
                    month:this.getCurrentMonth()
                },
                outOption:{
                    disabledDate(e){
                        debugger
                        return e<new Date();
                    }
                }
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
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            resetList(){
                this.organization=[];
                this.searchParam={
                    month:this.getCurrentMonth()
                };
                this.$set(this.searchParam,'organCascade',0);
                this.handleCurrentChange(1);
            },

            exportExcel() {
                window.location = this.exportUrl("report/vehicleSummary/export?" + $.param(this.searchParam));
            },

            getCurrentMonth(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;//月份是从0开始的
                if (month < 10) {
                    month = '0' + month
                };
                var newTime = year + '-' +
                    month;
                return newTime;
            }
        }
    }
</script>

