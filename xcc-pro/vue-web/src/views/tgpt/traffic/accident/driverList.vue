<template>
        <el-dialog :visible.sync="show" title="选择司机" width="90%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable autocomplete="off" placeholder="请输入司机姓名"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" clearable autocomplete="off" placeholder="请输入手机号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <city-select-panel :value.sync="nearCity3" @change="changeCity()" ref="citySelect" placeholder="请选择经营城市"></city-select-panel>
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
                                    <el-button @click.native.prevent="selectDriver(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="name" sortable label="司机姓名" min-width="150"></el-table-column>
                            <el-table-column prop="phone" sortable label="手机号" min-width="150"></el-table-column>
                            <el-table-column prop="serviceCity" sortable label="服务城市" min-width="120"></el-table-column>
                            <el-table-column prop="workStatus" sortable label="在职状态" min-width="120"></el-table-column>
                            <el-table-column prop="serviceStatus" sortable label="服务状态" min-width="120"></el-table-column>
                            <el-table-column prop="driveAge" sortable label="驾龄" min-width="100"></el-table-column>
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
    import CitySelectPanel from '@/components/CitySelect/index'
    export default {
        name: "driverListPanel",
        mixins: [tool],
        components:{CitySelectPanel},
        data(){
            return {
                show:false,
                nearCity3:[],
                listUrl:"core/vehicleaccident/driverlist",
            }
        },
        methods:{
            open(){
                this.show = true;
                this.getList();
            },
            selectDriver(row){
                this.show = false;
                this.$emit('load',row);
            },
            changeCity(){
                if(this.nearCity3 && this.nearCity3.length>=2)
                    this.searchParam.serviceCity=this.nearCity3[1];
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
