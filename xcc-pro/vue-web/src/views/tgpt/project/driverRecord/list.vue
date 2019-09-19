<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="row form-horizontal search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">项目订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" clearable autocomplete="off" placeholder="请输入项目订单号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">新司机姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.newDriver" clearable autocomplete="off" placeholder="请输入新司机姓名查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">新司机手机号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.newPhone" clearable autocomplete="off" placeholder="请输入新司机手机号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">原司机姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oldDriver" clearable autocomplete="off" placeholder="请输入原司机姓名查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">原司机手机号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oldPhone" clearable autocomplete="off" placeholder="请输入原司机手机号查询"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="exportShow" size="mini" @click="exportData">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%" >
                <el-table-column prop="orderNumber" sortable label="项目订单号" min-width="220">
                    <template slot-scope="scope">
                        <div v-if="detailShow">
                            <a @click="toDetail(scope.row)">{{scope.row.orderNumber}}</a>
                        </div>
                        <div v-else>
                            {{scope.row.orderNumber}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="newDriver" sortable label="新司机姓名" min-width="120"></el-table-column>
                <el-table-column prop="newPhone" sortable label="新司机手机号" min-width="140"></el-table-column>
                <el-table-column prop="replaceName" sortable label="更换司机操作人" min-width="140"></el-table-column>
                <el-table-column prop="startTime" sortable label="开始日期" min-width="140"></el-table-column>
                <el-table-column prop="endTime" sortable label="结束日期" min-width="140"></el-table-column>
                <el-table-column prop="oldDriver" sortable label="原司机姓名" min-width="120"></el-table-column>
                <el-table-column prop="oldPhone" sortable label="原司机手机号" min-width="140"></el-table-column>
                <el-table-column prop="createTime" sortable label="更换司机操作时间" min-width="150"></el-table-column>
                <el-table-column prop="fee" sortable label="更换费用" min-width="140"></el-table-column>
                <el-table-column prop="remark" sortable show-overflow-tooltip label="备注" min-width="140"></el-table-column>
                <el-table-column prop="companyName" sortable label="所属组织" min-width="140"></el-table-column>
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
        name: 'projectDriverRecord',
        mixins: [tool],
        data(){
            return {
                showSearch : false,
                listUrl:"core/changeDriver/list",
                exportShow : this.getCurrentUserAuthority("changeDriver/export"),
                detailShow : this.getCurrentUserAuthority("changeDriver/detail"),
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted(){
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods:{
            exportData() {
                location.href = this.exportUrl("core/changeDriver/export?" + $.param(this.searchParam));
            },
        }
    }
</script>

