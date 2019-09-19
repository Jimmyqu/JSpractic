<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.publishStatus" clearable placeholder="全部">
                            <el-option label="未发布" value="0"></el-option>
                            <el-option label="已发布" value="1"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">创建时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            @change="createDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="起始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyWord" clearable placeholder="请输入标题关键字查询"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showPublishBtn && scope.row.publishStatus == '未发布'" type="text" @click="publishEdit(scope.row.id)">发布</el-button>
                        <el-button v-show="showEditBtn && scope.row.publishStatus == '未发布'" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showDeleteBtn" type="text" style="color: #F56C6C" @click="del(scope.row)" v-if="scope.row.publishStatus == '未发布'">删除</el-button>
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
				<el-table-column min-width="140" label="阅读量" prop="readCount" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="状态" prop="publishStatus" sortable show-overflow-tooltip></el-table-column>
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
        name: 'microCourse',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                searchParam: {
                },
                showEditBtn: this.getCurrentUserAuthority('appDriverMicroCourse/editSave'),
                showAddBtn: this.getCurrentUserAuthority('appDriverMicroCourse/editSave'),
                showExportBtn: this.getCurrentUserAuthority('appDriverMicroCourse/export'),
                showPublishBtn: this.getCurrentUserAuthority('appDriverMicroCourse/publish'),
                showDeleteBtn: this.getCurrentUserAuthority('appDriverMicroCourse/delete'),
                listUrl: 'app/appDriverMicroCourse/courseList',
                createDate: [],
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
            resetList(){
                this.searchParam={};
                this.createDate=[];
                this.getList();
            },
            createDateChange() {
                if(this.createDate && this.createDate.length>0){
                    let createDate = this.createDate;
                    this.searchParam.startTime = createDate[0];
                    this.searchParam.endTime = createDate[1];
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            toDetail(row){
                if(row.id){
                    let url = '/tgpt_v2/appDriver/microCourse/detail/' + row.id;
                    this.$router.push({path:url});
                }
            },
            publishEdit(id) {
                var $this = this;
                this.$confirm('是否确认发布？').then(_ => {
                    ajax.post("app/appDriverMicroCourse/pulish/"+id, null).then(result => {
                        if (result.status==0) {
                            $this.$message.success(result.msg);
                            $this.getList();
                        } else {
                            console.log(result.msg);
                            $this.$message.error(result.msg);
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },

            /*删除*/
            del(row){
                this.$confirm(`确定删除该课程?`).then(
                    ()=>{
                        ajax.delete(`app/appDriverMicroCourse/${row.id}`).then(
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
                window.location = this.exportUrl("app/appDriverMicroCourse/export?" + $.param(this.searchParam));
            }
        }
    }
</script>

