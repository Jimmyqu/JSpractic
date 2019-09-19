<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeArrayItem"></tree-select>
                        <el-checkbox v-model="check" @change="includeChildrenCheck" :disabled="!searchParam.organizationId">子组织</el-checkbox>
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
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off"
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
                <div class="form-group">
                    <label class="control-label">合同状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable multiple collapse-tags v-model="contractStatus">
                            <el-option label="创建中" value="10"></el-option>
                            <el-option label="待执行" value="20"></el-option>
                            <el-option label="执行中" value="30"></el-option>
                            <el-option label="已到期" value="40"></el-option>
                            <el-option label="续签中" value="50"></el-option>
                            <el-option label="已续签" value="60"></el-option>
                            <el-option label="退出中" value="70"></el-option>
                            <el-option label="已退出" value="90"></el-option>
                            <el-option label="已作废" value="100"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">业务员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.saleMan" clearable autocomplete="off"
                                  placeholder="请输入业务员"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同退出日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractOutDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同属性</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.contractProperty">
                            <el-option label="新增" value="0"></el-option>
                            <el-option label="续签" value="1"></el-option>
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
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">发起</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
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
                <el-table-column fixed="left" label="操作" width="170">
                    <template slot-scope="scope">
                        <el-button
                            v-show="showEditBtn && (scope.row.contractStatus==10 && (scope.row.approveStatus==10 || scope.row.approveStatus==30))"
                            @click="editContract(scope.row)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button
                            v-show="showInvalidBtn && (scope.row.contractStatus==10 && (scope.row.approveStatus==10 || scope.row.approveStatus==30))"
                            @click="invalid(scope.row.id)" type="text" size="small">
                            作废
                        </el-button>
                        <el-button
                            v-show="showSubmitApprovalBtn && (scope.row.contractStatus==10 && scope.row.contractProperty == '新增' && (scope.row.approveStatus==10 || scope.row.approveStatus==30))"
                            @click="submitApproval(scope.row)" type="text" size="small" :disabled="commitDisabled">
                            提交
                        </el-button>
                        <el-button
                            v-show="showCancelBtn && (scope.row.contractStatus==30 || scope.row.contractStatus==40)"
                            @click="exit(scope.row.id)" type="text" size="small">
                            申请退出
                        </el-button>
                        <el-button
                            v-show="showRenewBtn && (scope.row.contractStatus==30 || scope.row.contractStatus==40)"
                            @click="renew(scope.row.id)" type="text" size="small">
                            续签
                        </el-button>
                        <el-button
                            v-show="showCancelSubmitApplyBtn && scope.row.contractStatus == 70 && (scope.row.approveStatus==10)"
                            @click.native.prevent="commitApplyOut(scope.row.id)" type="text" size="small"   >
                            退出提交
                        </el-button>
                        <el-button
                            v-show="showCancelEditBtn && scope.row.contractStatus == 70 && scope.row.approveStatus==10"
                            @click.native.prevent="exit(scope.row.id)" type="text" size="small">
                            退出编辑
                        </el-button>
                        <el-button
                            v-show="showCancelInvalidBtn && scope.row.contractStatus == 70 && (scope.row.approveStatus==10)"
                            @click.native.prevent="invalidContractOut(scope.row.id)" type="text" size="small">
                            退出作废
                        </el-button>
                        <el-button
                            v-show="showCancelSubmitApplyBtn && scope.row.contractStatus == 10 && scope.row.contractProperty == '续签' && (scope.row.approveStatus==10 || scope.row.approveStatus==30)"
                            @click.native.prevent="commitApplyRenew(scope.row.id)" type="text" size="small" :disabled="renewDisabled">
                            续签提交
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="contractNumber" fixed="left" sortable label="合同编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="detail(scope.row)">{{scope.row.contractNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="customerType" sortable show-overflow-tooltip label="客户类型" min-width="120"></el-table-column>
                <el-table-column prop="enterpriseName" sortable show-overflow-tooltip label="服务客户" min-width="120"></el-table-column>
                <el-table-column prop="contractStartDate" sortable label="合同开始日期" min-width="120"></el-table-column>
                <el-table-column prop="contractEndDate" sortable label="合同结束日期" min-width="120"></el-table-column>
                <el-table-column prop="contractAmount" sortable label="合同金额(元)" min-width="120"></el-table-column>
                <el-table-column prop="contractStatusText" sortable label="合同状态" min-width="140"></el-table-column>
                <el-table-column prop="approveStatusText" sortable label="审批状态" min-width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.approveStatusText==null?'/':scope.row.approveStatusText}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contractProperty" sortable label="合同属性" min-width="100"></el-table-column>
                <el-table-column prop="applicationDate" sortable label="申请日期" min-width="100"></el-table-column>
                <el-table-column prop="contractOutDate" sortable label="退出日期" min-width="100"></el-table-column>
                <el-table-column prop="contractCycle" sortable label="合同期（月）" min-width="130"></el-table-column>
                <el-table-column prop="originatorName" sortable label="发起人" min-width="100"></el-table-column>
                <el-table-column prop="originateDeptName" sortable label="所属组织" min-width="100"></el-table-column>
                <el-table-column prop="originatorName" sortable label="业务员" min-width="100"></el-table-column>
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
        name: 'serviceHostingContract',
        mixins: [tool],
        components: { TreeSelect },
        data(){
            return {
                listUrl: "/core/serviceHostingContract/list",
                transmissionList:[],
                formData: {},
                modelForm:{},
                organization:[],
                showAddBtn:this.getCurrentUserAuthority("serviceHostingContract/add"),
                showEditBtn:this.getCurrentUserAuthority("serviceHostingContract/edit"),
                showExportBtn:this.getCurrentUserAuthority("serviceHostingContract/export"),
                showSubmitApprovalBtn:this.getCurrentUserAuthority("serviceHostingContract/submit"),
                showCancelBtn:this.getCurrentUserAuthority("serviceHostingContract/applyOut"),
                showRenewBtn:this.getCurrentUserAuthority("serviceHostingContract/renew"),
                showInvalidBtn:this.getCurrentUserAuthority("serviceHostingContract/invalid"),
                showCancelSubmitApplyBtn:this.getCurrentUserAuthority("serviceHostingContract/outCommit"),
                showCancelEditBtn:this.getCurrentUserAuthority("serviceHostingContract/outEdit"),
                showCancelInvalidBtn:this.getCurrentUserAuthority("serviceHostingContract/outInvalid"),
                showSearch: false,
                branchOffice: [],
                contractStartDate:[],
                contractEndDate:[],
                contractOutDate:[],
                contractStatus:[],
                commitDisabled:false,
                renewDisabled:false,
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
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    debugger
                    $this.commitDisabled=true;
                    startProcessAsync(id,'FWTGHT').then((message)=>{
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
                this.check = check;
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
            getListBefore(params){
                if (this.contractStartDate && this.contractStartDate.length>0) {
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

                if (this.contractEndDate && this.contractEndDate.length>0) {
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

                if (this.contractOutDate && this.contractOutDate.length>0) {
                    params.contractOutStartDate = this.contractOutDate[0];
                    params.contractOutEndDate = this.contractOutDate[1];
                    this.searchParam.contractOutStartDate = this.contractOutDate[0];
                    this.searchParam.contractOutEndDate = this.contractOutDate[1];
                }else{
                    params.contractOutStartDate = '';
                    params.contractOutEndDate = '';
                    this.searchParam.contractOutStartDate = '';
                    this.searchParam.contractOutEndDate = '';
                }

                if(this.contractStatus && this.contractStatus.length>0){
                    params.contractStatus=this.contractStatus.join(',');
                    this.searchParam.contractStatus=this.contractStatus.join(',');
                }else{
                    params.contractStatus=[];
                    this.searchParam.contractStatus='';
                }
            },

            confirmOperateView(row,confirmType){
                this.$refs.confirmForm.open(row,confirmType);
            },
            changeArrayItem(data) {
                if (this.organization && this.organization.length>0){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.check = false;
                    this.$set(this.searchParam,'includeChildren',0)
                }
            },
            exportData:function () {
                window.location = this.exportUrl("core/serviceHostingContract/export?" + $.param(this.searchParam));
            },
            exit(id) {
                this.$router.push({path:'/tgpt/project/serviceHosting/contract/exit?id='+id});
            },
            renew(id) {
                this.$router.push({path:'/tgpt/project/serviceHosting/contract/renew?id='+id+"&type=1"});
            },
            editContract(row){
                if(row.contractProperty == '续签' )
                    this.$router.push({path:'/tgpt/project/serviceHosting/contract/renew?id='+row.id+"&type=2"});
                else if(row.contractProperty == '新增' )
                    this.$router.push({path:'/tgpt/project/serviceHosting/contract/edit?id='+row.id});
            },
            commitApplyOut(id) {
                let $this = this;
                this.$confirm('确认提交合同退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     ajax.get('core/serviceHostingContract/commitContractOut/'+id).then(rs=>{
                         if(rs.status==0){
                             $this.showMessage("合同退出提交成功",'success');
                             $this.getList();
                         }else{
                             $this.showMessage(rs.message,"error");
                         }
                     });
                });
            },
            commitApplyRenew(id){
                let $this = this;
                this.$confirm('确认提交合同续签审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $this.renewDisabled=true;
                    startProcessAsync(id,'FWTGHTXQ').then((message)=>{
                        $this.renewDisabled=false;
                        $this.getList();
                        if(message.status == 0){
                            $this.showMessage(message.message,"success");
                        }else{
                            $this.showMessage(message.message,"error");
                        }
                    }).catch(_=>{
                        $this.renewDisabled=false;
                    });
                });
            },
            applyOutConfirm(id, confirmType) {
                let param = {
                    id: id,
                    type: confirmType
                };
                this.$refs.confirmForm.open(param);
            },
            invalidContractOut(id){
                let $this = this;
                $this.$confirm('是否确定作废合同退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("core/serviceHostingContract/invalidContractOut/"+id).then((message)=>{
                        if(message.status == 0){
                            $this.showMessage(message.message,"success");
                        }else{
                            $this.showMessage(message.message,"error");
                        }
                        $this.getList();
                    });
                }).catch(() => {});
            },
            invalid(id){
                let $this = this;
                $this.$confirm('是否确定作废合同?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("core/serviceHostingContract/invalid/"+id).then((message)=>{
                        $this.getList();
                        if(message.status == 0){
                            $this.showMessage(message.message,"success");
                        }else{
                            $this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            resetList(){
                this.organization=[];
                this.searchParam={};
                this.$set(this.searchParam,'includeChildren',0);
                this.check = false;
                this.contractStartDate=[];
                this.contractEndDate=[];
                this.contractStatus=[];
                this.contractOutDate=[];
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
            detail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
            getMonthFirstDay(month){
               return month+'-01';
            },
            getMonthLastDay(month){
                debugger
                let arr=month.split('-');
                let now=new Date(arr[0],arr[1],1,0,0,0);
                    now.setTime(now.getTime() - 60*60*24*1000)
                let y=now.getFullYear();
                let m=now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1;
                let d=now.getDate()<10?'0'+now.getDate():now.getDate();
                return y+'-'+m+'-'+d;
            }
        },
    }
</script>

