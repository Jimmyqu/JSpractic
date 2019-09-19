<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.contractType" placeholder="请选择合同类型" clearable >
                            <el-option label="长租" value="1"> </el-option>
                            <el-option label="散租" value="2"> </el-option>
                            <el-option label="服务托管" value="3"> </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同原件状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.originalStatus" placeholder="请选择合同原件状态" clearable >
                            <el-option label="未上传" value="0"> </el-option>
                            <el-option label="已上传" value="1"> </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">企业客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" placeholder="请输入企业客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
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
        <div class="table-box table-upload">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                       <!-- <el-button v-show="showDownloadBtn && scope.row.originalStatus=='已上传'" type="text"><a :href="downloadOriginal(scope.row.original)" :download="downloadName(scope.row.original)">下载</a></el-button>&ndash;&gt;
                        <el-button v-show="showEditBtn && scope.row.originalStatus=='已上传'" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showUploadBtn && scope.row.originalStatus=='未上传'" type="text" @click="edit(scope.row.id)">编辑</el-button>
-->
                        <el-button v-show="showDownloadBtn && scope.row.originalStatus=='已上传'" type="text"><a style="color:#409eff;font-size:12px" :href="downloadOriginal(scope.row)" :download="downloadName(scope.row)">下载</a></el-button>
                        <template v-if="showUploadBtn && scope.row.originalStatus=='未上传'">
                            <upload-submit :size="1" @beforeUpolad="beforeUpolad(scope.row.id)" @upload="uploadOriginal" url="file/upload/multipart" name="file" title="上传" messageShow="false"></upload-submit>
                        </template>
                        <template v-if="showEditBtn && scope.row.originalStatus=='已上传'">
                            <upload-submit :size="1" @beforeUpolad="beforeUpolad(scope.row.id)" @upload="uploadOriginal" url="file/upload/multipart" name="file" title="编辑" messageShow="false"></upload-submit>
                        </template>
                    </template>
                </el-table-column>
				<el-table-column min-width="220" label="合同编号" prop="contractNo" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="合同类型" prop="contractType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="客户类型" prop="customerType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务客户" prop="enterpriseName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合同开始时间" prop="contractStartDate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="合同结束时间" prop="contractEndDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合同原件状态" prop="originalStatus" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合同上传时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import UploadSubmit from '@/components/UploadSubmit/index'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'contractOriginal',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                showSearch: false,
                organization:[],
                searchParam: {},
                id:"",
                showEditBtn: this.getCurrentUserAuthority("contractoriginal/edit"),
                /*showAddBtn: this.getCurrentUserAuthority("contractoriginal/add"),*/
                showExportBtn: this.getCurrentUserAuthority("contractoriginal/export"),
                showDownloadBtn:this.getCurrentUserAuthority("contractoriginal/download"),
                showUploadBtn:this.getCurrentUserAuthority("contractoriginal/upload"),
                listUrl: 'core/coreProjectContractOriginal/list'
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
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            exportExcel() {
                window.location = this.exportUrl("core/coreProjectContractOriginal/excel?" + $.param(this.searchParam));
            },
            beforeUpolad(id){
                this.id=id;
            },
            uploadOriginal(e){
                debugger
                let params={
                    id:this.id,
                    original:JSON.stringify([e.data])
                };
                ajax.post('core/coreProjectContractOriginal/uploadOriginal',params).then(rs=>{
                     if(rs.status==0){
                         this.showMessage("上传成功","success");
                         this.getList();
                         this.id='';
                     }
                });
            },
            downloadOriginal(row){
                if(row.originalStatus == '已上传'){
                    if(row.original){
                      let f=JSON.parse(row.original)[0];
                      return f.filedomain+f.path;
                    }
                }
            },
            downloadName(row){
                if(row.originalStatus == '已上传') {
                    if(row.original) {
                        let f = JSON.parse(row.original)[0];
                        return f.name;
                    }
                }
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.organization=[];
                this.getList();
            }

        }
    }
</script>
<style scoped="">
    .table-upload .upload-panel {
        display: inline-block;
    }
    .table-upload /deep/ .el-button--success {
        background: transparent;
        border: 0;
        color: #409EFF;
    }
</style>
