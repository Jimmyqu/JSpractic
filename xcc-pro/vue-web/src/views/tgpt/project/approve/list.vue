<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organIds" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">项目信息</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.projectInfo"
                                  placeholder="请输入项目名称、项目编号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseInfo"
                                  placeholder="请输入客户名称" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">项目类型</label>
                    <div class="input-group">
                        <el-select placeholder="全部" clearable multiple collapse-tags v-model="projectType">
                            <el-option label="配驾" value="配驾"></el-option>
                            <el-option label="自驾" value="自驾"></el-option>
                            <el-option label="司机托管" value="司机托管"></el-option>
                            <el-option label="车辆托管" value="车辆托管"></el-option>
                            <el-option label="司机与车辆托管" value="司机与车辆托管"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">评审状态</label>
                    <div class="input-group">
                        <el-select placeholder="全部" clearable multiple collapse-tags v-model="reviewStatus">
                            <el-option label="发起" value="10"></el-option>
                            <el-option label="询价" value="20"></el-option>
                            <el-option label="待提交审批" value="30"></el-option>
                            <el-option label="审批中" value="40"></el-option>
                            <el-option label="审批不通过" value="50"></el-option>
                            <el-option label="已完成" value="60"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">项目负责人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.projectLeader"
                                  placeholder="请输入项目负责人姓名、手机号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">招标编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.bidNo"
                                  placeholder="请输入招标编号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">申请时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="applicationDate"
                            type="daterange"
                            :editable="false"
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
                <el-button  v-show="showStartBtn" type="warning" size="mini" @click="add()">发起</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn && (scope.row.reviewStatus==10 || scope.row.reviewStatus==50)"
                                   type="text"
                                   @click="edit(scope.row.id)">编辑
                        </el-button>
                        <el-button v-show="showInquiryBtn && (scope.row.reviewStatus==10 || scope.row.reviewStatus==50)"
                                   @click="submitInquiry(scope.row.id, scope.row.projectName)" type="text" >
                            提交询价
                        </el-button>
                        <el-button v-show="showReviewBtn && scope.row.reviewStatus==30"
                                   @click="submitReview(scope.row.id)" type="text" >
                            提交
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed sortable show-overflow-tooltip prop="projectNumber" label="项目编号" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">
                            {{scope.row.projectNumber}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="originateDeptName" label="发起部门" min-width="120" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="applicationDateStr" label="申请日期" min-width="120" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="reviewStatus" label="评审状态" min-width="140" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.reviewStatus == 10">发起</span>
                        <span v-else-if="scope.row.reviewStatus == 20">询价</span>
                        <span v-else-if="scope.row.reviewStatus == 30">待提交审批</span>
                        <span v-else>{{scope.row.reviewStatusText}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="projectName" label="项目名称" min-width="120" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerType" label="客户类型" min-width="140" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="enterpriseName" label="服务客户" min-width="140" sortable show-overflow-tooltip></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="bidNo" label="招标编号"
                                 min-width="140"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="projectLeaderName" label="项目负责人"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="contractMonth" label="合同期（月）"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="settlementDate" label="结算日"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="settlementModel" label="结算方式"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="settlementCycle" label="付款周期（日）"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="paymentModel" label="付款方式"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="deposit" label="押金"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="serviceCost" label="服务费金额"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="projectType" label="项目类型"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="invoiceTaxRateDriver" label="开票（人）"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="invoiceTaxRateVehicle" label="开票（车）"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="deliveryDate" label="交期"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="frameContract" label="是否框架合同" min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.frameContract == 1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="totalAmount" label="项目总金额"
                                 min-width="120"></el-table-column>
                <el-table-column sortable prop="humanConfirm" label="人力询价确认" min-width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.humanConfirm == 1" type="success" size="small">已确认</el-tag>
                        <el-tag v-else type="info" size="small">未确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="maintenanceConfirm" label="车辆维保确认" min-width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.maintenanceConfirm == 1" type="success" size="small">已确认</el-tag>
                        <el-tag v-else type="info" size="small">未确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="purchaseConfirm" label="车辆采购确认" min-width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.purchaseConfirm == 1" type="success" size="small">已确认</el-tag>
                        <el-tag v-else type="info" size="small">未确认</el-tag>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name:'projectApprove',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                    originatorName: '',
                    organName: '',
                    organId: ''
                },
                showEditBtn: this.getCurrentUserAuthority('coreProjectReview/editSave'),
                showInquiryBtn: this.getCurrentUserAuthority('coreProjectReview/submitInquiry'),
                showReviewBtn: this.getCurrentUserAuthority('coreProjectReview/reviewSubmit'),
                showStartBtn: this.getCurrentUserAuthority('coreProjectReview/start'),
                showExportExcelBtn: this.getCurrentUserAuthority('coreProjectReview/exportExcel'),
                listUrl: '/core/coreProjectReview/list',
                //branchOffice: [],
                submitReviewParam: {},
                detailParam: {},
                editParam: {},
                organIds:[],
                applicationDate:[],
                projectType:[],
                reviewStatus:[]
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted() {

            let userInfo = this.getCurrentUserInfo();
            let arr = userInfo.organizationList;
            if (arr && arr[0]) {
                arr.slice(0);
                arr.unshift({organizationId: '', organizationName: '全部'});
                //this.branchOffice = arr;
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                if(this.organIds){
                    params.organId = this.organIds[0];
                    this.searchParam.organId = this.organIds[0];
                }else{
                    params.organId ='';
                    this.searchParam.organId ='';
                }
                if (this.applicationDate) {
                    params.applicationDateStart = this.applicationDate[0];
                    params.applicationDateEnd = this.applicationDate[1];
                    this.searchParam.applicationDateStart = this.applicationDate[0];
                    this.searchParam.applicationDateEnd = this.applicationDate[1];
                }else{
                    params.applicationDateStart ='';
                    params.applicationDateEnd = '';
                    this.searchParam.applicationDateStart ='';
                    this.searchParam.applicationDateEnd = '';
                }
                if(this.projectType && this.projectType.length>0){
                    params.projectType=this.projectType.join(',');
                    this.searchParam.projectType=this.projectType.join(',');
                }else{
                    params.projectType='';
                    this.searchParam.projectType='';
                }
                if(this.reviewStatus && this.reviewStatus.length>0){
                    params.reviewStatus=this.reviewStatus.join(',');
                    this.searchParam.reviewStatus=this.reviewStatus.join(',');
                }else{
                    params.reviewStatus='';
                    this.searchParam.reviewStatus='';
                }
            },
            //重置筛选
            resetList() {
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false);
                this.applicationDate = "";
                this.organIds = [];
                this.reviewStatus = [];
                this.projectType = [];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organIds && this.organIds.length==1){
                    this.searchParam.organId=this.organIds[0];
                }else{
                    this.searchParam.organId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            exportExcel() {
                window.location = this.exportUrl("core/coreProjectReview/exportExcel?" + $.param(this.searchParam));
            },
            submitInquiry(id, name) {
                this.$confirm('【' + name + '】确定提交询价？', '提示', {
                    confirmButtonText: '确认提交询价',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    ajax.post('/core/coreProjectReview/submitInquiry/' + id).then(rs => {
                        this.$message({
                            message: '项目【' + name + '】提交询价成功',
                            type: 'success'
                        });

                        this.getList();
                    });
                }).catch(_ => {
                });
            },
            openInquiryDetail(id, type) {

            },
            submitReview(id) {
                this.$router.push({path:"/tgpt/project/approve/submit",query:{id:id}});
            },
        }
    }
</script>

