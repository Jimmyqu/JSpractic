<template>
        <el-dialog :visible.sync="show" title="维修单" width="90%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row">
                    <template>
                        <el-table :data="list" style="width: 100%" border>
                            <el-table-column fixed label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="selectMaintenanceBill(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="maintenanceNo" sortable label="订单号" min-width="200"></el-table-column>
                            <el-table-column prop="plate" sortable label="车辆" min-width="120"></el-table-column>
                            <el-table-column prop="vehicleModelInfoName" sortable show-overflow-tooltip label="车型" min-width="200"></el-table-column>
                            <el-table-column prop="repairer" sortable label="维修厂" min-width="100"></el-table-column>
                            <el-table-column prop="sendCarPeople" sortable label="送车人" min-width="120"></el-table-column>
                            <el-table-column prop="fetchCarPeople" sortable label="提车人" min-width="120"></el-table-column>
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
        name: "maintenanceBillListPanel",
        mixins: [tool],
        data(){
            return {
                show:false,
                listUrl:"core/vehicleaccident/maintenancebilllist",
            }
        },
        methods:{
            open(vehicleId){
                this.show = true;
                this.searchParam.vehicleId=vehicleId;
                this.getList();
            },
            selectMaintenanceBill(row){
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
