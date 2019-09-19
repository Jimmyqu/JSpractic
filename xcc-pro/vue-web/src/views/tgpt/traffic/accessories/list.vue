<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" clearable type="text" placeholder="请输入编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">配件名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" clearable type="text" placeholder="请输入配件名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">型号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.model" clearable type="text" placeholder="请输入型号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">品牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.brand" clearable type="text" placeholder="请输入品牌"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="warning" v-show="addShow" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange();">查询</el-button>
                <el-button type="small" @click="resetList();" size="mini">重置</el-button>
                <el-button size="mini" v-show="exportShow" @click="exportData()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" border style="width: 100%">
                <el-table-column fixed label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row.id)" type="text" size="small" v-show="addShow">编辑</el-button>
                        <el-button @click="del(scope.row.id)" type="text" size="small" v-show="delShow">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="code" sortable show-overflow-tooltip label="编号" width="140">
                    <template slot-scope="scope">
                        <div v-if="detailShow">
                            <a size="mini" @click="toDetail(scope.row)">{{scope.row.code}}</a>
                        </div>
                        <div v-else>
                            {{scope.row.code}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable show-overflow-tooltip label="配件名称" min-width="100"></el-table-column>
                <el-table-column prop="model" sortable show-overflow-tooltip label="型号" min-width="100"></el-table-column>
                <el-table-column prop="brand" sortable show-overflow-tooltip label="品牌" min-width="100"></el-table-column>
                <el-table-column prop="measureUnit" sortable label="计量单位" min-width="100"></el-table-column>
                <el-table-column prop="typeName" sortable label="项目分类" min-width="120"></el-table-column>
                <el-table-column prop="referencePrice" sortable label="参考价格" min-width="100"></el-table-column>
                <el-table-column prop="advice" sortable label="参考说明" show-overflow-tooltip  min-width="160"></el-table-column>
                <el-table-column prop="companyName" sortable label="所属组织" min-width="120"></el-table-column>
                <el-table-column prop="accessoriesStatus" sortable label="状态" min-width="100"></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" min-width="120"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="140"></el-table-column>
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
        name: 'trafficAccessories',
        mixins: [tool],
        data(){
            return {
                showSearch: false,
                listUrl: "base/accessories/list",
                formData: {},
                /** 权限 */
                addShow : this.getCurrentUserAuthority("accessories/create"),
                delShow : this.getCurrentUserAuthority("accessories/del"),
                exportShow : this.getCurrentUserAuthority("accessories/export"),
                detailShow : this.getCurrentUserAuthority("accessories/getById"),
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
            del(id){
                this.$confirm('您确认要删除嘛?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/accessories/del?id="+id).then(result=>{
                        if(result.status == 0){
                            this.showMessage("删除成功","success");
                            this.getList();
                        }else{
                            this.showMessage(result.message,"error");
                        }
                    })
                }).catch(() => {});
            },
            //导出
            exportData() {
                window.location = this.exportUrl("base/accessories/export?" + $.param(this.searchParam));
            },
        }
    }
</script>

