<template>
        <el-dialog :visible.sync="show" title="调拨过程单" width="90%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" clearable autocomplete="off" placeholder="请输入车辆"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">出车城市</label>
                            <div class="input-group">
                                <city-select-panel :value.sync="nearCity" @change="changeCity()" ref="citySelect" placeholder="请选择出车城市"></city-select-panel>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">驾驶员</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.driverName" clearable autocomplete="off" placeholder="请输入驾驶员"></el-input>
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
                                    <el-button @click.native.prevent="selectTransferProcess(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="plate" sortable label="车辆" min-width="150"></el-table-column>
                            <el-table-column prop="departureCity" sortable label="出车城市" min-width="120"></el-table-column>
                            <el-table-column prop="outsetTime" sortable label="出车时间" min-width="150"></el-table-column>
                            <el-table-column prop="arrivalCity" sortable label="到达城市" min-width="120"></el-table-column>
                            <el-table-column prop="arrivalTime" sortable label="到达时间" min-width="150"></el-table-column>
                            <el-table-column prop="driverName" sortable label="驾驶员" min-width="100"></el-table-column>
                            <el-table-column prop="beforeCompany" sortable show-overflow-tooltip label="调拨前所属组织" min-width="150"></el-table-column>
                            <el-table-column prop="processStatus" sortable label="状态" min-width="100"></el-table-column>
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
    import CitySelectPanel from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    export default {
        name: "transferProcessListPanel",
        mixins: [tool],
        components:{CitySelectPanel},
        data(){
            return {
                show:false,
                nearCity:[],
                listUrl:"core/vehicleaccident/transferprocesslist",
            }
        },
        methods:{
            open(vehicleId){
                this.show = true;
                this.searchParam.vehicleId=vehicleId;
                this.getList();
            },
            selectTransferProcess(row){
                this.show = false;
                this.$emit('load',row);
            },
            changeCity(){
                if(this.nearCity && this.nearCity.length>=2)
                    this.searchParam.departureCity=this.nearCity[1];
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
