<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable
                                  placeholder="请输入服务客户"></el-input>
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
                <!--<div class="form-group">
                    <label class="control-label">项目评审</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.projectName" clearable autocomplete="off"
                                  placeholder="请输入项目评审查询"></el-input>
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">合同执行状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable multiple collapse-tags v-model="contractStatus">
                            <el-option label="待执行" value="10"></el-option>
                            <el-option label="执行待确认" value="20"></el-option>
                            <el-option label="执行中" value="30"></el-option>
                            <el-option label="已到期" value="40"></el-option>
                            <el-option label="续签中" value="50"></el-option>
                            <el-option label="已续签" value="60"></el-option>
                            <el-option label="退出中" value="70"></el-option>
                            <el-option label="已退出" value="80"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable
                                  placeholder="请输入合同编号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">信息完整性</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.informationIntegrity">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">资金安排</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.fundingArrangement">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务信息确认</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.serviceInformationConfirm">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车务信息确认</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.trafficInformationConfirm">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">人员招聘确认</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.recruitmentConfirm">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">人员成本报价确认</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.personnelCostQuotationConfirm">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">分公司筹备确认</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.branchCompanyPreparationConfirm">
                            <el-option label="未确认" value=0></el-option>
                            <el-option label="已确认" value=1></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeArrayItem"></tree-select>
                        <el-checkbox v-model="check"  @change="includeChildrenCheck" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">业务员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.saleMan" clearable autocomplete="off"
                                  placeholder="请输入业务员"></el-input>
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

                <el-button  v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border style="width: 100%" :data="list">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                            v-show="showPerformBtn && (scope.row.contractStatus==10 && (scope.row.versions==null||scope.row.versions=='') && (scope.row.approveStatus==null || scope.row.approveStatus==10 || scope.row.approveStatus==30))"
                            @click="perform(scope.row.id)" type="text" size="small">
                            执行
                        </el-button>
                        <el-button
                            v-show="showSubmitApprovalBtn && (scope.row.approveStatus==10 || scope.row.approveStatus==30)"
                            @click="submitApproval(scope.row)" type="text" size="small" :disabled="commitDisabled">
                            提交
                        </el-button>
                        <el-button
                            v-show="showVersionsBtn && scope.row.versions"
                            @click="showVersions(scope.row)" type="text" size="small">
                            版本号
                        </el-button>
                        <el-button
                            v-show="showEditBtn && scope.row.contractStatus==30 && (scope.row.approveStatus==null || scope.row.approveStatus==10 || scope.row.approveStatus==30)"
                            @click="editContractExecute(scope.row)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-dropdown
                            v-show="scope.row.confirmType != '' && scope.row.confirmType != null && scope.row.contractStatus==20"
                            placement="bottom" size="mini" trigger="click">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="table-dropdown" slot="dropdown">

                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('1') !== -1 && informationIntegrityConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,1,scope.row.informationIntegrity)">
                                    信息完整性确认
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('2') !== -1  && informationIntegrityConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,2,scope.row.fundingArrangement)">
                                    资金安排确认
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('3') !== -1  && serviceInformationConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,3,scope.row.serviceInformationConfirm)">
                                    服务信息确认
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('4') !== -1 && trafficInformationConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,4,scope.row.trafficInformationConfirm)">
                                    车务信息确认
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('5') !== -1  && recruitmentConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,5,scope.row.recruitmentConfirm)">
                                    人员招聘确认
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('6') !== -1  && personnelCostQuotationConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,6,scope.row.personnelCostQuotationConfirm)">
                                    人员成本报价确认
                                </el-dropdown-item>
                                <el-dropdown-item v-show="scope.row.confirmType != '' && scope.row.confirmType != null &&scope.row.confirmType.indexOf('7') !== -1  && branchCompanyPreparationConfirmBtn"
                                                  @click.native.prevent="confirmOperateView(scope.row,7,scope.row.branchCompanyPreparationConfirm)">
                                    分公司筹备确认
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column prop="contractNumber" fixed="left" sortable label="合同编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="projectName" sortable show-overflow-tooltip label="项目评审" min-width="100"></el-table-column>
                <el-table-column prop="customerType" sortable show-overflow-tooltip label="客户类型" min-width="120"></el-table-column>
                <el-table-column prop="enterpriseName" sortable show-overflow-tooltip label="服务客户" min-width="120"></el-table-column>
                <el-table-column prop="bidNo" sortable show-overflow-tooltip label="招标编号" min-width="100"></el-table-column>
                <el-table-column prop="contractStartDate" sortable label="合同开始日期" min-width="120"></el-table-column>
                <el-table-column prop="contractAmount" sortable label="合同金额(元)" min-width="120"></el-table-column>
                <el-table-column prop="contractEndDate" sortable label="合同结束日期" min-width="120"></el-table-column>
                <el-table-column prop="contractStatusText" sortable label="合同状态" min-width="140"></el-table-column>
                <el-table-column prop="approveStatusText" sortable label="审批状态" min-width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.approveStatusText==null?'/':scope.row.approveStatusText}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="applicationDate" sortable label="申请日期" min-width="100"></el-table-column>
                <el-table-column prop="contractCycle" sortable label="合同期（月）" min-width="130"></el-table-column>
                <el-table-column prop="originatorName" sortable label="发起人" min-width="100"></el-table-column>
                <el-table-column prop="originateDeptName" sortable label="发起部门" min-width="100"></el-table-column>
                <el-table-column prop="originatorName" sortable label="业务员" min-width="100"></el-table-column>
                <el-table-column prop="informationIntegrityName" sortable label="信息完整性"
                                 min-width="100"></el-table-column>
                <el-table-column prop="fundingArrangementName" sortable label="资金安排" min-width="100"></el-table-column>
                <el-table-column prop="serviceInformationConfirmName" sortable label="服务信息确认"
                                 min-width="130"></el-table-column>
                <el-table-column prop="trafficInformationConfirmName" sortable label="车务信息确认"
                                 min-width="130"></el-table-column>
                <el-table-column prop="recruitmentConfirmName" sortable label="人员招聘确认"
                                 min-width="130"></el-table-column>
                <el-table-column prop="personnelCostQuotationConfirmName" sortable label="人员成本报价确认"
                                 min-width="150"></el-table-column>
                <el-table-column prop="branchCompanyPreparationConfirmName" sortable label="分公司筹备确认"
                                 min-width="140"></el-table-column>
                <el-table-column prop="projectTotalAmount" sortable label="项目总金额(元)" min-width="120"></el-table-column>
            </el-table>

        </div>

        <ConfirmForm ref="confirmForm"  @load="getList"></ConfirmForm>
        <VersionListPanel ref="versionList" @load="getList"></VersionListPanel>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contractExecute/confirm'
    import VersionListPanel from '@/views/tgpt/project/contractExecute/versionList'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'projectContractExecute',
        mixins: [tool],
        components: { ConfirmForm,TreeSelect,VersionListPanel },
        data(){
            return {
                listUrl: "/core/coreProjectContractExecute/queryList",
                transmissionList:[],
                commitDisabled:false,
                formData: {},
                modelForm:{},
                organization:[],
                showPerformBtn:this.getCurrentUserAuthority("coreProjectContractExecute/perform"),
                showEditBtn:this.getCurrentUserAuthority("coreProjectContractExecute/edit"),
                showExportBtn:this.getCurrentUserAuthority("coreProjectContractExecute/export"),
                //showDetailBtn:this.getCurrentUserAuthority("coreProjectContract/detail"),
                showVersionsBtn:this.getCurrentUserAuthority("coreProjectContractExecute/versions"),
                showSubmitApprovalBtn:this.getCurrentUserAuthority("coreProjectContractExecute/submitApproval"),
                informationIntegrityConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/informationIntegrityConfirm"),
                fundingArrangementConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/fundingArrangementConfirm"),
                serviceInformationConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/serviceInformationConfirm"),
                trafficInformationConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/trafficInformationConfirm"),
                recruitmentConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/recruitmentConfirm"),
                personnelCostQuotationConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/personnelCostQuotationConfirm"),
                branchCompanyPreparationConfirmBtn:this.getCurrentUserAuthority("coreProjectContractExecute/branchCompanyPreparationConfirm"),
                showSearch: false,
                contractStatus:[],
                branchOffice: [],
                contractStartDate:"",
                contractEndDate:"",
                check:false
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {

            submitApproval(row) {
                var id  = row.id;
                var contractAgreedParty = row.contractAgreedParty;
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $this.commitDisabled=true;
                    startProcessAsync(id,'XMHTZX').then((message)=>{
                        $this.commitDisabled=false;
                        $this.getList();
                        if(message.status == 0){
                            $this.showMessage(message.message,"success");
                        }else{
                            $this.showMessage(message.message,"error");
                        }
                    }).catch(_=>{
                        $this.commitDisabled=false;
                    });
                }).catch(() => {});
            },
            includeChildrenCheck(check){
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
            getListBefore(params){
                if (this.contractStartDate) {
                    params.contractStartDate1 = this.contractStartDate[0];
                    params.contractStartDate2 = this.contractStartDate[1];
                    this.searchParam.contractStartDate1 = this.contractStartDate[0];
                    this.searchParam.contractStartDate2 = this.contractStartDate[1];
                }else{
                    params.contractStartDate1 = '';
                    params.contractStartDate2 = '';
                    this.searchParam.contractStartDate1 = '';
                    this.searchParam.contractStartDate2 = '';
                }

                if (this.contractEndDate) {
                    params.contractEndDate1 = this.contractEndDate[0];
                    params.contractEndDate2 = this.contractEndDate[1];
                    this.searchParam.contractEndDate1 = this.contractEndDate[0];
                    this.searchParam.contractEndDate2 = this.contractEndDate[1];
                }else{
                    params.contractEndDate1 = '';
                    params.contractEndDate2 = '';
                    this.searchParam.contractEndDate1 = '';
                    this.searchParam.contractEndDate2 = '';
                }

                if(this.contractStatus && this.contractStatus.length>0){
                    params.contractStatus=this.contractStatus.join(',');
                    this.searchParam.contractStatus=this.contractStatus.join(',');
                }else{
                    params.contractStatus=[];
                    this.searchParam.contractStatus='';
                }
            },
            perform(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/perform",query:{id:id,type:1}});
            },
            editContractExecute(row){
                debugger
                let url=this.$route.fullPath;
                if(row.contractStatus==30 && (row.approveStatus==30 || row.approveStatus==10)) {//编辑编辑中的的合同执行
                    this.$router.push({path: url + "/edit", query: {id: row.id, type: 2, editable: 1}});
                }else{
                    this.$router.push({path:url+"/edit",query:{id:row.id,type:2}});
                }
            },
            confirmOperateView(row,confirmType){
                this.$refs.confirmForm.open(row,confirmType);
            },
            showVersions(row){
                this.$refs.versionList.open(row.projectContractId);
            },
            changeArrayItem(data) {
                if (this.organization && this.organization.length>0){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.check = false;
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'includeChildren',0)
                }
            },
            exportData:function () {
                window.location = this.exportUrl("core/coreProjectContractExecute/export?" + $.param(this.searchParam));
            },
            resetList(){
                this.organization=[];
                this.searchParam={};
                this.$set(this.searchParam,'includeChildren',0);
                this.check = false;
                this.contractStatus=[];
                this.contractStartDate=[];
                this.contractEndDate=[];
                this.handleCurrentChange(1);
            },
            includeChildrenCheck(check){
                this.check = check;
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
        },
    }
</script>

