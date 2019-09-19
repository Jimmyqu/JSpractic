<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">系列名称</label>
                    <div class="input-group">
                        <el-input placeholder="请输入系列名称" clearable v-model="searchParam.name" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">品牌</label>
                    <div class="input-group">
                        <el-input placeholder="请输入品牌" clearable v-model="searchParam.brand" />
                    </div>
                </div>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportExcelBtn" @click="importExcel()">导入</el-button>
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column fixed="left" label="操作" min-width="50">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable label="系列名称" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.name}}</a>
                        <!--<span v-if="!showDetailBtn">{{scope.row.name}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" sortable label="品牌" min-width="150"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleModelSeries',
        mixins: [tool],
        data(){
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("vehicleModel/addOrEdit"),
                showEditBtn: this.getCurrentUserAuthority("vehicleModel/addOrEdit"),

                showImportExcelBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority("vehicleModel/exportSeriesExcel"),
                //showDetailBtn: this.getCurrentUserAuthority("vehicleModel/detail"),
                listUrl: 'base/vehicleModel/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        watch: {

        },
        methods: {
            importExcel(){

            },
            exportExcel() {
                var params=this.searchParam;
                window.location.href = this.exportUrl("base/vehicleModel/exportSeriesExcel?" + $.param(params));
            }
        },
    }
</script>

