<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" >
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">款式名称</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入款式名称"  clearable v-model="searchParam.name" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">在售状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.saleStatus">
                            <el-option label="在售" value="1"> </el-option>
                            <el-option label="停售" value="2"> </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">系列</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入系列" clearable  v-model="searchParam.seriesName" />
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
            <el-button v-show="showImportExcelBtn" size="mini" @click="importExcel()">导入</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
        </div>
        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable label="款式名称" min-width="400">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.name}}</a>
                        <!--<span v-if="!showDetailBtn">{{scope.row.name}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column prop="seriesName" sortable label="系列" min-width="400"></el-table-column>
                <el-table-column prop="saleStatus" sortable label="在售状态" min-width="100"></el-table-column>
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
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleModelStyle',
        mixins: [tool],
        components: { ConfirmForm },
        data(){
            return {
                showAddBtn: this.getCurrentUserAuthority("vehicleStyle/addOrEdit"),
                showEditBtn: this.getCurrentUserAuthority("vehicleStyle/addOrEdit"),

                showImportExcelBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority("vehicleStyle/exportStyleExcel"),
                showDetailBtn: this.getCurrentUserAuthority("vehicleStyle/detail"),
                listUrl: 'base/vehicleStyle/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            this.getList();
            /*if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }*/
        },
        watch: {

        },
        methods: {
            importExcel(){

            },
            exportExcel() {
                var params=this.searchParam;
                window.location.href = this.exportUrl("base/vehicleStyle/exportStyleExcel?" + $.param(params));
            }
        },
    }
</script>

