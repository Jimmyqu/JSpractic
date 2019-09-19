<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" clearable type="text" placeholder="请输入编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">工时项目名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" clearable type="text" placeholder="请输入工时项目名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">项目分类</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.type" filterable clearable placeholder="不限">
                            <el-option v-for="e in typeOptions" :key="e.value" :label="e.text"
                                       :value="e.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.manhourStatus" clearable placeholder="请选择状态">
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="停用" value="0"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="warning" v-show="addShow" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
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
        <!-- 列表跟分页 -->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" border style="width: 100%">
                <el-table-column fixed label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row.id)" type="text" size="small" v-show="addShow">编辑</el-button>
                        <el-button @click="del(scope.row.id)" type="text" size="small" v-show="delShow">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="code" sortable label="编号" width="280">
                    <template slot-scope="scope">
                        <div v-if="detailShow">
                            <a size="mini" @click="toDetail(scope.row)">{{scope.row.code}}</a>
                        </div>
                        <div v-else>
                            {{scope.row.code}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable show-overflow-tooltip label="工时项目名称" min-width="200"></el-table-column>
                <el-table-column prop="typeName" sortable label="项目分类" min-width="120"></el-table-column>
                <el-table-column prop="referencPrice" sortable label="参考价格" min-width="120"></el-table-column>
                <el-table-column prop="companyName" sortable show-overflow-tooltip label="所属组织" min-width="140"></el-table-column>
                <el-table-column prop="manhourStatus" sortable label="状态" min-width="100"></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" min-width="140"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="150"></el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
    import CitySelectPanel from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficManhour',
        mixins: [tool],
        components:{CitySelectPanel},
        data(){
            return {
                /** 查询区域显示隐藏*/
                showSearch : false,
                /** table */
                listUrl:"/base/manhour/list",
                /** 组件传参*/
                formData : {},
                /** 可搜索select*/
                // cityOptions : [],
                typeOptions : [],
                /** 权限 */
                addShow : this.getCurrentUserAuthority("manhour/create"),
                delShow : this.getCurrentUserAuthority("manhour/del"),
                exportShow : this.getCurrentUserAuthority("manhour/export"),
                detailShow : this.getCurrentUserAuthority("manhour/getById"),
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
            this.getSelectType();
            // this.getSelectCity();
        },
        methods: {
           // getList(callback){
                /*const params = this.searchParam;
                if(this.searchParam.cityId && this.searchParam.cityId.length){
                    params.city = this.searchParam.cityId[1];
                }*/
                /*params.rows = this.pageSize;
                params.page = this.page;*/
                /*ajax.get(this.listUrl,params).then(res => {
                    this.list = res.rows;
                    this.listCount = res.records;
                    $.isFunction(callback) && callback(res);
                })*/
          //  },
            del(id){
                let $this = this;
                $this.$confirm('您确认要删除嘛?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/manhour/del?id="+id).then(result => {
                        if(result.status == 0){
                            $this.showMessage("删除成功","success");
                            $this.resetList();
                        }
                    })
                }).catch(() => {
                    $this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //项目分类 下拉
            getSelectType(){
                ajax.get('admin/dict/type/维保项目分类').then(rs => {
                    if (rs.length > 0) {
                        this.typeOptions = rs;
                    }else{
                        this.typeOptions = [];
                    }
                });
            },

            //导出
            exportData() {
                window.location = this.exportUrl("base/manhour/export?" + $.param(this.searchParam));
            },
        }
    }
</script>

