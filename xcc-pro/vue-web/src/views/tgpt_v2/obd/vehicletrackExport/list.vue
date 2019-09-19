<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">任务名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.taskName" clearable maxlength="18"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">创建时间</label>
                    <div class="input-group" style="width: 300px;">
                        <el-date-picker
                            v-model="createDate"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.taskStatus" placeholder="不限">
                            <el-option label="待执行" value="0"></el-option>
                            <el-option label="已完成" value="1"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询
                </el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list"
                      style="width: 100%">
                <el-table-column fixed="left" label="操作" width="90">
                    <template slot-scope="scope">
                        <a v-if="scope.row.filePath != null"
                           @click="downloadFile(scope.row.filePath,scope.row.taskName+'.zip')">下载</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="任务名称" prop="taskName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="任务状态" prop="taskStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.taskStatus == 0 ? "待执行" : "已完成" }}
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="当前等待任务数" prop="rank" sortable show-overflow-tooltip>
                    <template slot-scope="scope"  v-if="scope.row.rank != null">
                        {{scope.row.rank}}
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="创建时间" prop="createTime" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="完成时间" prop="taskEndTime" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="备注" prop="remark" sortable show-overflow-tooltip>
                    <template slot-scope="scope"  v-if="scope.row.remark != null">
                        {{scope.row.remark}}
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
        name: 'vehicleTrackExport',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                createDate:[],
                searchParam: {},
                listUrl: 'obd/obdVehicleTrackExport/task/list',
                organIds: []
            }
        },
        activated() {
            this.getList();
        },
        mounted: function () {
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {

            getListBefore(params) {
                debugger
                if (this.organIds != null && this.organIds.length > 0) {
                    params.organId = this.organIds[0]
                }
                if (this.createDate && this.createDate.length>1) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
            },
            resetList() {
                this.searchParam = {};
                this.createDate = [];
                this.organIds = [];
                this.handleCurrentChange(1);
            }
        }
    }
</script>
