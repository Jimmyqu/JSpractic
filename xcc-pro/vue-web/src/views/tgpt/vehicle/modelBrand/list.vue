<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box min" >
            <div class="form-group">
                <label class="control-label">品牌名称</label>
                <div class="input-group">
                    <el-input type="text" placeholder="请输入品牌名称"  clearable v-model="searchParam.value" />
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
            <el-table :ref="getRefName" :max-height="tableHeight"  v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column label="操作" width="150">
                    <template slot-scope="{ row, column, $index }">
                        <el-button v-show="showEditBtn"  @click="edit(row.id)" type="text" size="small">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable label="品牌名称" min-width="300">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.name}}</a>
                        <!--<span v-if="!showDetailBtn">{{scope.row.name}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间"  min-width="300"></el-table-column>
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
        name: 'vehicleModelBrand',
        mixins: [tool],
        data(){
            return {
                showEditBtn: this.getCurrentUserAuthority("vehicleBrand/Edit"),
                showAddBtn: this.getCurrentUserAuthority("vehicleBrand/add"),
                showImportExcelBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority("vehicleBrand/exportBrandExcel"),
                showDetailBtn: this.getCurrentUserAuthority("vehicleBrand/detail"),
                listUrl:"/base/vehicleBrand/list"
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
            viewData(row){
                $(row).data("index","modules/vehicle/modelBrand/detail.html?id=" + row.id);
                $(row).data("href","modules/vehicle/modelBrand/detail.html?id=" + row.id);
                $(row).data("title","车型品牌-详情");
                showIFrameTab(row);
            },
            importExcel(){

            },
            exportExcel() {
                var param = "value=" + (this.searchParam.value == undefined ? "" : this.searchParam.value );

                window.location.href = this.exportUrl("base/vehicleBrand/exportBrandExcel?" + param);
            }
        },
    }
</script>

