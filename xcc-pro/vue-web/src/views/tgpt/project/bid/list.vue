<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">招标编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.bidNo" placeholder="请输入招标编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" placeholder="请输入企业客户" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">项目信息</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.projectInfo" placeholder="请输入项目名称、项目编号、合同编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">招标负责人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.bidUser" placeholder="请输入招标负责人" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">招标时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="bidDate"
                            @change="bidDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd" clearable>
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
               <el-button  v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.approvalStatus==10">
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                            <el-button v-show="showApplyBtn" type="text" @click="apply(scope.row)">提交审批</el-button>
                        </template>
                        <el-button v-show="showDownloadBtn" type="text"><a :href="downloadFile(scope.row.bidFile)" :download="downloadName(scope.row.bidFile)">下载</a></el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="招标编号" prop="bidNo" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.bidNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="项目名称" prop="projectName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="200" label="合同编号" prop="contractNo" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="客户类型" prop="customerType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务客户" prop="enterpriseName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="审批状态" prop="approvalStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="招标负责人" prop="bidUser" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="发布公布日期" prop="issueDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="招标日期" prop="bidDate" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'bid',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                organization:[],
                bidDate:[],
                searchParam: {},
                showEditBtn: this.getCurrentUserAuthority("bid/edit"),
                showAddBtn: this.getCurrentUserAuthority("bid/add"),
                showExportBtn: this.getCurrentUserAuthority("bid/export"),
                showDownloadBtn:this.getCurrentUserAuthority("bid/download"),
                showApplyBtn:this.getCurrentUserAuthority("bid/apply"),
                listUrl: 'core/coreProjectBid/list'
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
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',false)
                }
            },
            resetList(){
               this.organization=[];
               this.bidDate=[];
               this.searchParam={};
               this.$set(this.searchParam,'organCascade',false)
               this.getList();
            },
            bidDateChange() {
                if(this.bidDate && this.bidDate.length>0){
                    let createDate = this.bidDate;
                    this.searchParam.bidStartDate = createDate[0];
                    this.searchParam.bidEndDate = createDate[1];
                }else{
                    this.searchParam.bidStartDate="";
                    this.searchParam.bidEndDate="";
                }
            },
            apply(id){

            },
            exportExcel() {
                window.location = this.exportUrl("core/coreProjectBid/export?" + $.param(this.searchParam));
            },
            apply(row) {
                this.$confirm('你确定要提交审批吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(row.id,'ZTBGL').then((res)=> {
                        this.showMessage("提交审批成功", "success");
                        this.getList();
                    })




                   /* startProcess(rows.id, 'ZTBGL', function () {
                        this.showMessage("提交审批成功", "success", function () {
                            this.getList();
                        });
                    })*/
                });
            },
            downloadFile(file){
                let f=JSON.parse(file)[0];
                return f.filedomain+f.path;
            },
            downloadName(file){
                let f=JSON.parse(file)[0];
                return f.name;
            }
        }
    }
</script>

