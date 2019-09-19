<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box">
            <div class="form-group">
                <label class="control-label">司机</label>
                <div class="input-group">
                    <el-input v-model="statistics.driver" :disabled="true"></el-input>
                </div>
            </div>
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">时间</label>
                    <div class="input-group" style="width: 300px;">
                        <el-date-picker
                            v-model="createDate"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
            </div>
        </div>
        <!--grid按钮-->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton"
                           @click="handleCurrentChange(1);mileageTotalInfo()">查询
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
        <!--grid列表部分-->
        <div class="table-box">

            <p class="summary"><span>完成任务数：</span><span>{{formData.count}}</span>
                <span style="margin-left: 150px;">驾驶总里程（公里）：</span><span>{{formData.mileage}}</span>
                <span style="margin-left: 150px;">驾驶总时长：</span><span>{{formData.runTime}}</span>
            </p>

            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list"
                      style="width: 100%" border>
                <el-table-column fixed="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="detailTrip(scope.row.id)" type="text" size="small">
                            查看行程
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="assignmentNo" sortable label="任务编号" min-width="100"></el-table-column>
                <el-table-column prop="startTime" sortable label="行程开始时间" min-width="100"></el-table-column>
                <el-table-column prop="startAddress" show-overflow-tooltip sortable label="行程起点" min-width="120"></el-table-column>
                <el-table-column prop="passengerAddress" show-overflow-tooltip sortable label="乘客上车点" min-width="120"></el-table-column>
                <el-table-column prop="endAddress" show-overflow-tooltip sortable label="行程终点" min-width="120"></el-table-column>
                <el-table-column prop="endTime" sortable label="行程结束时间" min-width="100"></el-table-column>
                <el-table-column prop="mileage" sortable label="驾驶里程（公里）" min-width="100"></el-table-column>
                <el-table-column prop="runTime" sortable label="驾驶时长" min-width="100"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {deepClone} from "../../../../utils"

    export default {
        name: 'assignmentStatisticsRouteList',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                formData: {},
                listUrl: "operation_core/assignment/route/list",
                companyId: '',
                companyNameOptions: [],
                createDate: [],
                companyIds: "",
                statistics: {}
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        mounted: function () {
            this.statistics = this.$route.query;
            if (this.statistics.startTime && this.statistics.endTime) {
                this.createDate.push(this.statistics.startTime)
                this.createDate.push(this.statistics.endTime)
            }
            this.mileageTotalInfo();
            this.getList();
        },
        methods: {
            resetList() {
                this.searchParam = {};
                this.companyIds = "";
                this.createDate = [];
                this.getList();
            },
            getListParam() {
                let params = deepClone(this.searchParam);
                params.driverId = this.statistics.driverId;
                if (this.createDate && this.createDate.length > 1) {
                    params.startTime = this.createDate[0] + ' 00:00:00';
                    params.endTime = this.createDate[1] + ' 23:59:59';
                } else {
                    params.startTime = null;
                    params.endTime = null;
                }
                return params;
            },
            getListBefore(params) {
                if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }
                params.driverId = this.statistics.driverId;
                if (this.createDate && this.createDate.length > 1) {
                    params.startTime = this.createDate[0] + ' 00:00:00';
                    params.endTime = this.createDate[1] + ' 23:59:59';
                } else {
                    params.startTime = null;
                    params.endTime = null;
                }
            },
            detailTrip(id) {
                this.$router.push({path: "/tgpt_v2/operation/assignmentManagement/detailtrip/" + id});
            },
            mileageTotalInfo() {
                ajax.get('operation_core/statistics/detail', this.getListParam()).then(res => {
                    if (res.status == 0) {
                        this.$set(this.formData, "mileage", res.data.totalMileage);
                        this.$set(this.formData, "count", res.data.assignmentCount);
                        this.$set(this.formData, "runTime", res.data.totalRunTime);
                    }
                })
            }
        }
    }
</script>

