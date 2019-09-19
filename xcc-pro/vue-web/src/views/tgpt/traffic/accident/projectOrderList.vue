<template>
        <el-dialog :visible.sync="show" title="项目订单" width="90%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">企业客户</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入企业客户"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.driverName" clearable autocomplete="off" placeholder="请输入司机姓名"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">订单号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.orderNo" clearable autocomplete="off" placeholder="请输入订单号"></el-input>
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="row">
                    <template>
                        <el-table :data="list" style="width: 100%" border>
                            <el-table-column fixed label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="selectProjectOrder(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="orderNo" sortable label="订单号" min-width="200"></el-table-column>
                            <el-table-column prop="enterpriseName" sortable label="企业客户" min-width="150"></el-table-column>
                            <el-table-column prop="driverName" sortable label="司机姓名" min-width="120"></el-table-column>
                            <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                            <el-table-column prop="vehicleModelInfoName" sortable show-overflow-tooltip label="车型" min-width="200"></el-table-column>
                            <el-table-column prop="contractNo" sortable label="合同编号" min-width="200"></el-table-column>
                            <el-table-column prop="contractStartDate" sortable label="用车开始时间" min-width="120"></el-table-column>
                            <el-table-column prop="contractEndDate" sortable label="用车结束时间" min-width="120"></el-table-column>
                            <el-table-column prop="company" sortable label="所属组织" min-width="120"></el-table-column>
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
                    </template>
                </div>
            </div>
        </el-dialog>
</template>
<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    export default {
        name: "projectOrderListPanel",
        mixins: [tool],
        data(){
            return {
                show:false,
                listUrl:"core/vehicleaccident/projectorderlist",
            }
        },
        methods:{
            open(vehicleId){
                this.show = true;
                this.searchParam.vehicleId=vehicleId;
                this.getList();
            },
            selectProjectOrder(row){
                this.show = false;
                this.$emit('load',row);
            }
        },
        mounted(){

        }
    }
</script>
<style>
    .user-edit-panel {

    }
    .user-edit-panel .el-dialog__header {
        display: none;
    }
    .user-edit-panel .el-dialog__body {
        height: auto;
        padding: 0 20px;
    }
    .user-edit-panel .el-dialog__footer {
        text-align: left;
        padding-left: 20px;
        padding-top: 0;
    }
    .user-edit-panel .el-dialog {
        background-color: #f0f0f0;
    }
</style>
