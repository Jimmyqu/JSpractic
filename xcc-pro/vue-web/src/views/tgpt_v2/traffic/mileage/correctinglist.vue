<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">


                <div class="form-group">
                    <label class="control-label">操作人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.creater" placeholder="操作人"></el-input>
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
            <el-table border :data="list" style="width: 100%">


				<el-table-column min-width="140" label="记录时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="读表时间" prop="readTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车辆总里程(km)" prop="totalMileage" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="校正时OBD里程(km)" prop="obdMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="仪表读数(km)" prop="dashboardMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="误差率(%)" prop="errorRate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作人" prop="creater" sortable show-overflow-tooltip></el-table-column>
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
        <driverListPanel ref="driverList" @load="loadList"></driverListPanel>


    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import driverListPanel from '@/views/tgpt_v2/appDriver/message/driverList'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'correctionRecord',
        mixins: [tool],
        components: { TreeSelect,CitySelect,driverListPanel },
        data() {
            return {
                showSearch: false,
                dialogDriver:false,
                createDate:[],
                organization:[],
                searchParam: {
                },
                showEditBtn: true,
                showExportExcelBtn: true,
                id: this.$route.params.id,
                listUrl: 'obd/obdCorrectionRecord'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.searchParam.vehicleId=this.id;
            this.getList();

        },
        methods: {
            loadList(){
              this.handleCurrentChange(1);
            },
            resetList(){
                this.searchParam.creater="";
                this.handleCurrentChange(1);
            },
            exportExcel() {
                window.location = this.exportUrl("obd/obdCorrectionRecord/export?" + $.param(this.searchParam));
            },


        }
    }
</script>

