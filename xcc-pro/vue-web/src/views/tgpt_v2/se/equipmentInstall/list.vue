<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">ID</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.id" placeholder="id"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group">
                        <tree-select v-model="searchParam.organId" placeholder="请选择" type="one"
                                     url=""></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.createDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>

        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">修改</el-button>
                    </template>
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
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'equipmentInstall',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: ''
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

            },
            exportExcel() {
                window.location = this.exportUrl("?" + $.param(this.searchParam));
            }
        }
    }
</script>

