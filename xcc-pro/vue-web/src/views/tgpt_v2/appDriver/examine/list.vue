<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">发布状态</label>
                    <el-select v-model="searchParam.publishStatus" clearable placeholder="请选择">
                        <el-option value="1" label="已发布"></el-option>
                        <el-option value="0" label="未发布"></el-option>
                    </el-select>
                </div>
                <div class="form-group">
                    <label class="control-label">创建时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createTime"
                            @change="createDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">标题</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.title" clearable placeholder="标题"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <!-- <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i> -->
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
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
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)" v-if="scope.row.publishStatus == 0">编辑</el-button>
                        <el-button v-show="showPublishBtn" v-if="scope.row.publishStatus == 0" type="text" @click="editPublishStatus(scope.row)">发布</el-button>
                        <el-button v-show="showDeleteBtn" type="text" style="color: #F56C6C" @click="del(scope.row)" v-if="scope.row.publishStatus == 0">删除</el-button>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="标题" prop="title" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.title}}</a>
					</template>
				</el-table-column>
                <el-table-column min-width="140" label="创建人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发布时间" prop="publishTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="已完成" prop="subNum" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="状态" prop="publishStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.publishStatus == 1">已发布</span>
                        <span v-if="scope.row.publishStatus == 0">未发布</span>
                    </template>
                </el-table-column>

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
        name: 'appDriverExamineTemplate',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                createTime:[],
                showEditBtn: this.getCurrentUserAuthority('appDriverExamine/editSave'),
                showAddBtn: this.getCurrentUserAuthority('appDriverExamine/add'),
                showExportExcelBtn: this.getCurrentUserAuthority('appDriverExamine/exportExcel'),
                showPublishBtn: this.getCurrentUserAuthority('appDriverExamine/publish'),
                showDeleteBtn: this.getCurrentUserAuthority('appDriverExamine/delete'),
                listUrl: 'app/appDriverExamineTemplate'
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

            },

            createDateChange(){
                this.searchParam.startTime = this.createTime[0] + ' 00:00:00';
                this.searchParam.endTime = this.createTime[1] +' 23:59:59';
            },

            /*重置*/
            resetList(){
                this.searchParam = {};
                this.createTime = [];
                this.getList();
            },

            /*发布*/
            editPublishStatus(row){
                let str = JSON.stringify(row);
                let data = JSON.parse(str);
                data.publishStatus = 1;
                this.$confirm(`确定发布该模板`).then(
                    ()=>{
                        this.subData(data ,2);
                    }
                );
            },

            /*修改数据提交*/
            subData(data , type){
                ajax.post(`app/appDriverExamineTemplate?type=${type}`, data).then(rs => {
                    if (rs.status == 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.getList();
                    }
                });
            },
            /*删除*/
            del(row){
                this.$confirm(`确定删除该模板`).then(
                    ()=>{
                        ajax.delete(`app/appDriverExamineTemplate/${row.id}`).then(
                            rs => {
                                if(rs.status == 0){
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.getList();
                                }
                            }
                        )
                    }
                );
            },

            exportExcel() {
                window.location = this.exportUrl("app/appDriverExamineTemplate/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

