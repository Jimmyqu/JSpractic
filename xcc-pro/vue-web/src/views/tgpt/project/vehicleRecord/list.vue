<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">项目订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" clearable autocomplete="off" placeholder="请输入项目订单号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">新车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.newPlate" clearable autocomplete="off" placeholder="请输入新车牌查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">原车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oldPlate" clearable autocomplete="off" placeholder="请输入原车牌查询"></el-input>
                    </div>
                </div>
            </div>

        </div>

        <div class="tool-box">
            <div class="operation">

                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>

                <el-button  v-show="exportShow" size="mini" @click="exportData">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%" >
                <el-table-column prop="orderNumber" sortable label="项目订单号" min-width="220">
                    <template slot-scope="scope">
                        <div v-if="detailShow">
                            <a @click="toDetail(scope.row)">{{scope.row.orderNumber}}</a>
                        </div>
                        <div v-else>
                            {{scope.row.orderNumber}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="newPlate" sortable label="新车牌" min-width="120"></el-table-column>
                <el-table-column prop="newModel" sortable show-overflow-tooltip label="新型车型名称" min-width="140"></el-table-column>
                <el-table-column prop="startTime" sortable label="开始时间" min-width="150"></el-table-column>
                <el-table-column prop="endTime" sortable label="结束时间" min-width="150"></el-table-column>
                <el-table-column prop="oldPlate" sortable label="原车牌" min-width="120"></el-table-column>
                <el-table-column prop="oldModel" sortable show-overflow-tooltip label="原车型名称" min-width="140"></el-table-column>
                <el-table-column prop="fee" sortable label="替代车费用" min-width="120"></el-table-column>
                <el-table-column prop="scheduleFee" sortable label="调拨费用" min-width="120"></el-table-column>
                <el-table-column prop="vehicleTransferId" sortable show-overflow-tooltip label="替代车调拨单" min-width="140"></el-table-column>
                <el-table-column prop="remark" sortable show-overflow-tooltip label="备注" min-width="140"></el-table-column>
                <el-table-column prop="replaceName" sortable label="更换车辆操作人" min-width="140"></el-table-column>
                <el-table-column prop="createTime" sortable label="更换车辆操作时间" min-width="150"></el-table-column>
                <el-table-column prop="companyName" sortable show-overflow-tooltip label="所属组织" min-width="140"></el-table-column>
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
        name: 'projectVehicleRecord',
        mixins: [tool],
        data(){
            return {
                listUrl:"core/changeVehicle/list",
                exportShow : this.getCurrentUserAuthority("changeVehicle/export"),
                detailShow : this.getCurrentUserAuthority("changeVehicle/detail"),
            }
        },
        activated(){
            this.getList();
        },
        mounted(){
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods:{
            exportData() {
                location.href = this.exportUrl("core/changeVehicle/export?" + $.param(this.searchParam));
            },
        }
    }
</script>

