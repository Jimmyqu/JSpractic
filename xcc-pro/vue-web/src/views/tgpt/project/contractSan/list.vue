<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable autocomplete="off"
                                  placeholder="请输入合同编号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">企业客户名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off"
                                  placeholder="请输入企业客户名称查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同开始日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractStartDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同结束日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractEndDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.contractStatus">
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="完成" value="40"></el-option>
                        </el-select>
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
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                   <template slot-scope="scope">
                        <!--<el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">修改</el-button>-->
                       <el-button
                           v-show="showAddOrEditBtn && (scope.row.contractStatus==10||scope.row.contractStatus==30)"
                           @click="edit(scope.row.id)" type="text" size="small">
                           编辑
                       </el-button>
                       <el-button
                           v-show="showSubmitApprovalBtn && (scope.row.contractStatus==10||scope.row.contractStatus==30)"
                           @click="submitApproval(scope.row)" type="text" size="small">
                           提交
                       </el-button>
                    </template>



                </el-table-column>

				<el-table-column min-width="140" label="合同编号" prop="contractNumber" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNumber}}</a>
					</template>
				</el-table-column>
                <el-table-column min-width="120" label="客户类型" prop="customerType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="服务客户" prop="enterpriseName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="合同开始时间" prop="contractStartDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="合同结束时间" prop="contractEndDate" sortable show-overflow-tooltip></el-table-column>
                <!--<el-table-column min-width="140" label="合同总金额" prop="contractAmount" sortable show-overflow-tooltip></el-table-column>-->
                <el-table-column min-width="120" label="是否框架合同" prop="frameContractName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所属组织" prop="originateDeptName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="评审状态" prop="contractStatusText" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="申请人" prop="applicationPeopleName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="申请时间" prop="applicationDate" sortable show-overflow-tooltip></el-table-column>

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
        name: 'projectContractSan',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showAddOrEditBtn:this.getCurrentUserAuthority("coreProjectContractSan/addOrEdit"),
                showExportBtn:this.getCurrentUserAuthority("coreProjectContractSan/export"),
                showSubmitApprovalBtn:this.getCurrentUserAuthority("coreProjectContractSan/submitApproval"),
                showEditBtn: true,
                showAddBtn: this.getCurrentUserAuthority("coreProjectContractSan/add"),
                /*showExportExcelBtn: this.getCurrentUserAuthority("coreProjectContractSan/submitApproval"),*/
                listUrl: 'core/coreProjectContractSan',
                contractStartDate:"",
                contractEndDate:"",
                organizationIds:[]
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
          /*  getListBefore(params) {
                if(params.organizationId){
                    params.organizationId = params.organizationId.join(',');
                }

                let contractStartDateArr = params.contractStartDate;
                params.contractStartDate1 = null;
                params.contractStartDate2 = null;
                if (contractStartDateArr) {
                    if (contractStartDateArr.length > 0)
                        params.contractStartDate1 = contractStartDateArr[0];

                    if (contractStartDateArr.length > 1)
                        params.contractStartDate2 = contractStartDateArr[1];
                }

                let contractEndDateArr = params.contractEndDateDate;
                params.contractEndDate1 = null;
                params.contractEndDate2 = null;
                if (contractEndDateArr) {
                    if (contractEndDateArr.length > 0)
                        params.contractEndDate1 = contractEndDateArr[0];

                    if (contractEndDateArr.length > 1)
                        params.contractEndDate2 = contractEndDateArr[1];
                }
            },*/
            getListBefore(params){
                if (this.contractStartDate) {
                    params.contractStartDate1 = this.contractStartDate[0];
                    params.contractStartDate2 = this.contractStartDate[1];
                }
                if (this.contractEndDate) {
                    params.contractEndDate1 = this.contractEndDate[0];
                    params.contractEndDate2 = this.contractEndDate[1];
                }
                if(this.organizationIds){
                    params.organizationId = this.organizationIds[0];
                }
            },
            resetList(){
                var $this=this;
                $this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false)
                $this.contractStartDate="";
                $this.contractEndDate="";
                this.organizationIds = [];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.searchParam.organizationId=this.organizationIds[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',false)
                }
            },
            exportExcel() {
                var params = this.searchParam;
                if (this.contractStartDate) {
                    params.contractStartDate1 = this.contractStartDate[0];
                    params.contractStartDate2 = this.contractStartDate[1];
                }
                if (this.contractEndDate) {
                    params.contractEndDate1 = this.contractEndDate[0];
                    params.contractEndDate2 = this.contractEndDate[1];
                }
                if(this.organizationIds){
                    params.organizationId = this.organizationIds[0];
                }
               // window.location = this.exportUrl("base//baseEquipmentModal//excel?" + $.param(this.searchParam));
                window.location = this.exportUrl("core/coreProjectContractSan/excel?" + $.param(params));
            },
            submitApproval(row) {
                var id  = row.id;
                debugger;
                var contractAgreedParty = row.contractAgreedParty;
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'XMHTSZ',{'contractAgreedParty':contractAgreedParty}).then((message)=>{
                        $this.getList();
                        if(message.status == 0){
                            $this.showMessage(message.message,"success");
                        }else{
                            $this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
        }
    }
</script>

