<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">栅栏名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="栅栏名称" clearable></el-input>
                    </div>
                </div>
                <!--<div class="form-group">-->
                    <!--<label class="control-label">组织</label>-->
                    <!--<div class="input-group">-->
                        <!--<tree-select v-model="searchParam.organId" placeholder="请选择" type="one"-->
                                     <!--url=""></tree-select>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="form-group">-->
                    <!--<label class="control-label">日期</label>-->
                    <!--<div class="input-group">-->
                        <!--<el-date-picker-->
                            <!--v-model="searchParam.createDate"-->
                            <!--type="daterange"-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始日期"-->
                            <!--end-placeholder="结束日期"-->
                            <!--value-format="yyyy-MM-dd">-->
                        <!--</el-date-picker>-->
                    <!--</div>-->
                <!--</div>-->
            </div>

        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
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
                <el-table-column fixed="left" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="showEnabledBtn && scope.row.fenceStatus == 1" type="text" @click="ok(scope.row.id, scope.row.fenceStatus)">停用</el-button>
                        <el-button v-if="showEnabledBtn && scope.row.fenceStatus == 2" type="text" @click="ok(scope.row.id, scope.row.fenceStatus)">启用</el-button>
                        <el-button v-if="showAssignFence" type="text" @click="assignFence(scope.row.id)">分配车辆</el-button>
                        <el-button v-if="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-if="showDeleteBtn" type="text" @click="deleteFence(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="栅栏状态" prop="fenceStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.fenceStatus == 1">启用</div>
                        <div v-else>停用</div>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="名称" prop="name" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.name}}</a>
					</template>
                </el-table-column>
                <el-table-column prop="companyName" label="所属公司" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
				<el-table-column min-width="140" label="受控车数" prop="vehicleCount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="停止报警时间段" prop="startTime" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{scope.row.startTime}}至{{scope.row.endTime}}</div>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="停止时长限制" prop="stopTime" sortable show-overflow-tooltip></el-table-column>

                <el-table-column min-width="140" label="更新人" prop="updater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="更新时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
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
        name: 'timeOutFence',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showAssignFence: this.getCurrentUserAuthority('baseTimeFence/assignFence'),
                showSearch: false,
                searchParam: {
                },
                showEditBtn: this.getCurrentUserAuthority('baseTimeFence/edit'),
                showDeleteBtn: this.getCurrentUserAuthority('baseTimeFence/delete'),
                showEnabledBtn: this.getCurrentUserAuthority('baseTimeFence/enabled'),
                showAddBtn: this.getCurrentUserAuthority('baseTimeFence/add'),
                showExportExcelBtn: false,
                listUrl: 'base/baseTimeOutFence'
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
            ok(id, fenceStatus){
                this.$confirm('确定' + (fenceStatus == 1 ? '停用' : '启用') + '该时间栅栏?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var param = {id: id, fenceStatus: fenceStatus == 1 ? fenceStatus = 2 : fenceStatus = 1, updater:''};
                    ajax.post('base/baseTimeOutFence/ok', param).then(rs => {
                        if(rs && rs.data == 1){
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            this.getList();
                        }else {
                            this.$message({
                                type: 'error',
                                message: '保存失败!'
                            });
                        }
                    });
                });
            },
            assignFence(id){
                let url = this.$route.fullPath + '/assign/' + id;
                this.$router.push({path:url});
            },
            deleteFence(id){
                this.$confirm('确定删除该时间栅栏?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.delete('base/baseTimeOutFence/' + id).then(rs => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    });
                });
            },
            getListBefore(params) {

            },
            exportExcel() {
                window.location = this.exportUrl("base/baseTimeOutFence/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

