<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.type" placeholder="全部" clearable>
                            <el-option label="iOS" :value="1"></el-option>
                            <el-option label="android" :value="2"></el-option>
                        </el-select>
                    </div>
                </div>

            </div>

            <div class="search-btn-list">
            </div>

        </div>


        <div class="tool-box">
            <div class="operation">
                <el-button type="warning" v-show="showEditBtn" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
<!--                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>-->
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
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button  type="text" v-show="showEditBtn" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button  type="text" v-show="showDeleteBtn" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="版本号" prop="version" sortable>
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.version}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="类型" prop="typeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="渠道版本 " prop="appTypeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="180" label="更新内容" prop="content" show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="发布日期" prop="publishDate" ></el-table-column>
                <el-table-column min-width="140" label="创建人" prop="creater" ></el-table-column>
                <el-table-column min-width="140" label="创建时间" prop="createTime" ></el-table-column>
            </el-table>

        </div>


    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelectPanel from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'appVersion',
        mixins: [tool],
        data() {
            return {
                showEditBtn: this.getCurrentUserAuthority('appVersion/edit'),
                showDeleteBtn: this.getCurrentUserAuthority('appVersion/delete'),
                searchParam: {},
                listUrl: 'base/appVersion/list',
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.handleCurrentChange(1);
            },
            del(id){
                this.$confirm("确认删除此版本？")
                    .then(_ => {
                        ajax.get('base//appVersion/delete/' + id,).then(rs => {
                            if (rs.status == 0) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getList();
                            }else{
                                this.$message.error("删除失败");
                            }
                        });

                    })
                    .catch(_ => {
                    });
            }

        }
    }
</script>

