<template>
        <el-dialog :visible.sync="show" title="选择服务客户" width="90%"
                   :append-to-body="true">
            <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">企业客户名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入企业客户名称"></el-input>
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
                            <el-table-column fixed label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="selectEnterprise(scope.row)" type="text" size="small">
                                        选择
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="enterpriseName" sortable label="企业客户名称" min-width="200"></el-table-column>
                            <el-table-column prop="enterpriseStatus" sortable label="企业状态" min-width="150"></el-table-column>
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
        name: "enterpriseListPanel",
        mixins: [tool],
        data(){
            return {
                show:false,
                listUrl:"core/vehicleaccident/enterpriselist",
            }
        },
        methods:{
            open(){
                this.show = true;
                this.getList();
            },
            selectEnterprise(row){
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
