<template>
    <div class="app-container white-bg list-panel" v-cloak>
      <!--  <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="getList()">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>-->

        <div class="table-box">
            <el-table border :data="list" style="width: 100%">
				<el-table-column min-width="140" label="etc卡号" prop="etcNum" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="分配车辆" prop="plate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="充值前余额" prop="balance" sortable show-overflow-tooltip></el-table-column>
				<!--<el-table-column min-width="140" label="充值类型" prop="type" sortable show-overflow-tooltip></el-table-column>-->
				<el-table-column min-width="140" label="充值金额" prop="money" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="备注" prop="remark" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>

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
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficVehicleEtcDetail',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                    id:this.$route.query.id
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: 'traffic/trafficVehicleEtc/listDetail'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            getListBefore(params) {
                var id = this.$route.params.id;
                params.id=id;
            }
        }
    }
</script>

