<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">公司名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" clearable type="text" placeholder="请输入公司名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">联系人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contact" clearable type="text" placeholder="请输入联系人"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">联系电话</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contactPhone" clearable type="text" placeholder="请输入联系电话"></el-input>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%">
                <el-table-column fixed label="操作" min-width="120">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row.id)" type="text" size="small" v-show="editQx">编辑</el-button>
                        <el-button @click="del(scope.row.id)" type="text" size="small" v-show="deleteQx">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable fixed label="公司名称" show-overflow-tooltip min-width="250">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">
                            {{scope.row.name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="shortName" sortable label="简称" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="contact" sortable label="联系人" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="contactPhone" sortable label="联系电话" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="businessDescription" sortable show-overflow-tooltip label="主要业务描述" min-width="200"></el-table-column>
                <el-table-column prop="address" sortable show-overflow-tooltip label="地址"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>

    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'



    export default {
        name: 'trafficInsuranceCompany',
        mixins: [tool],
        data(){
            return {
                showSearch: false,
                addQx: this.getCurrentUserAuthority("base/insuranceCompany/insert"),
                exportQx: this.getCurrentUserAuthority("base/insuranceCompany/export"),
                editQx: this.getCurrentUserAuthority("base/insuranceCompany/update"),
                deleteQx: this.getCurrentUserAuthority("base/insuranceCompany/delete"),
                listUrl: "base/insuranceCompany/list",
                formData: {}
            }
        },
        // 返回页面调用
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
            del:function(id){
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        ajax.get('/base/insuranceCompany/delete/' + id).then(result => {
                            if(result.status == 0){
                                this.showMessage("删除成功","success");
                                this.getList();
                            }else{
                                this.showMessage(result.message,"error");
                            }
                        });
                }).catch(() => {});
            },
            //导出
            exportExcel:function () {
                window.location = this.exportUrl("base/insuranceCompany/export?" +  $.param(this.searchParam));
            }
        }

    }
</script>

