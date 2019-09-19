<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box min" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" autocomplete="off" type="text" placeholder="请输入名称"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="warning" size="mini" @click="add()" v-show="addQx">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button type="small" @click="resetList()" size="mini">重置</el-button>
                <el-button size="mini" @click="exportExcel()" v-show="exportQx">导出</el-button>
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
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%">
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row.id)" type="text" size="small" v-show="editQx">编辑</el-button>
                        <el-button @click="del(scope.row.id)" type="text" size="small" v-show="deleteQx">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable label="名称">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficInsuranceType',
        mixins: [tool],
        data() {
            return{
                showSearch:false,
                addQx: this.getCurrentUserAuthority("base/insuranceType/insert"),
                exportQx: this.getCurrentUserAuthority("base/insuranceType/export"),
                editQx: this.getCurrentUserAuthority("base/insuranceType/update"),
                deleteQx: this.getCurrentUserAuthority("base/insuranceType/delete"),
                listUrl:"base/insuranceType/list",
                formData:{}
            }
        },
        activated(){
            this.getList();
        },
        mounted: function (){
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            //删除
            del(id) {
                this.$confirm('是否确认删除?')
                    .then(_ => {
                        ajax.get("base/insuranceType/delete/" + id).then(result=>{
                            if(result.status == 0){
                                this.showMessage("删除成功","success");
                                this.getList();
                               // $("#enableConfirm").modal("hide");
                            }else{
                                this.showMessage(result.message,"error");
                            }
                        });
                    })
                    .catch(_ => {
                       // $("#enableConfirm").modal("hide");
                    });
            },
            exportExcel:function () {
                window.location = this.exportUrl("base/insuranceType/export?" + $.param(this.searchParam));
            }
        }
    }
</script>

