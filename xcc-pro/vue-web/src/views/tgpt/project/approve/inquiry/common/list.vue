<template>
    <div id="app" class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization" ></tree-select>
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
                    <label class="control-label">企业客户</label>
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
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>


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
                <el-table-column fixed="left" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-show="showInquiryBtn && (scope.row.reviewStatus==20)"
                                   @click="openInquiryDetail(scope.row.id)" type="text" size="small">
                            <template v-if="type==3">人力询价</template>
                            <template v-if="type==2">维保询价</template>
                            <template v-if="type==1">采购询价</template>
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
                <el-table-column prop="customerType" label="客户类型" min-width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="enterpriseName" label="服务客户" min-width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="bidNo" label="招标编号"
                                 min-width="140"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="projectLeaderName" label="项目负责人"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="contractMonth" label="合同期（月）"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="settlementDate" label="结算日"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="settlementModel" label="结算方式"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="settlementCycle" label="付款周期（日）"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="paymentModel" label="付款方式"
                                 min-width="120"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="deposit" label="押金"
                                 min-width="100"></el-table-column>
                <el-table-column sortable show-overflow-tooltip prop="serviceCost" label="服务费金额"
                                 min-width="120"></el-table-column>
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


                <div v-if="type == 3">

                    <el-table-column sortable label="确认状态" min-width="120">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.humanConfirm == 1" type="success" size="small">已确认</el-tag>
                            <el-tag v-else type="info" size="small">未确认</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column sortable show-overflow-tooltip prop="humanConfirmUser" label="确认人"
                                     min-width="120"></el-table-column>
                    <el-table-column sortable show-overflow-tooltip prop="humanConfirmTime" label="确认时间"
                                     min-width="160"></el-table-column>

                </div>

                <div v-if="type == 2">

                    <el-table-column sortable label="确认状态" min-width="120">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.maintenanceConfirm == 1" type="success" size="small">已确认</el-tag>
                            <el-tag v-else type="info" size="small">未确认</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column sortable show-overflow-tooltip prop="maintenanceConfirmUser" label="确认人"
                                     min-width="120"></el-table-column>
                    <el-table-column sortable show-overflow-tooltip prop="maintenanceConfirmTime" label="确认时间"
                                     min-width="160"></el-table-column>

                </div>


                <div v-if="type == 1">

                    <el-table-column sortable label="确认状态" min-width="120">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.purchaseConfirm == 1" type="success" size="small">已确认</el-tag>
                            <el-tag v-else type="info" size="small">未确认</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column sortable show-overflow-tooltip prop="purchaseConfirmUser" label="确认人"
                                     min-width="120"></el-table-column>
                    <el-table-column sortable show-overflow-tooltip prop="purchaseConfirmTime" label="确认时间"
                                     min-width="160"></el-table-column>

                </div>
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
        mixins: [tool],
        props: {
            type: String
        },
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                searchParam: {},
                showInquiryBtn: this.getCurrentUserAuthority('coreProjectReview/submitInquiry'),
                listUrl: '/core/coreProjectReview/listByInquiry',
                branchOffice: [],
                projectType:[],
                reviewStatus:[],
                organization:[],
                applicationDate:[],
                inquiryConfigParam: {}
            }
        },
        mounted() {
      /*      let userInfo = this.getCurrentUserInfo();
            let arr = userInfo.organizationList;
            if (arr && arr[0]) {
                arr.slice(0);
                arr.unshift({organizationId: '', organizationName: '全部'});
                this.branchOffice = arr;
            }
*/
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        methods: {
            getListBefore(params) {
                params.inquiryType = this.type;
                if(this.organization && this.organization.length>0){
                    params.organId = this.organization[0];
                    this.searchParam.organId = this.organization[0];
                }else{
                    params.organId ='';
                    this.searchParam.organId ='';
                }
                if (this.applicationDate && this.applicationDate.length>0) {
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
            exportExcel() {
                window.location = exportUrl("core/coreProjectReview/exportExcel?" + $.param(this.searchParam));
            },
            openInquiryDetail(id) {
                if (this.type == 1) {
                    this.$router.push({path: "/tgpt/project/purchase/confirm", query: {id: id, type: this.type}});
                } else if (this.type == 2) {
                    this.$router.push({path: "/tgpt/project/maintenance/confirm", query: {id: id, type: this.type}});
                } else if (this.type == 3) {
                    this.$router.push({path: "/tgpt/project/human/confirm", query: {id: id, type: this.type}});
                }
            },
            toDetail(bean) {
                this.$router.push({path: "/tgpt/project/approve/detail/" + bean.id});
            },
            resetList(){
                this.organization=[];
                this.applicationDate=[];
                this.reviewStatus=[];
                this.projectType=[];
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organId=this.organization[0];
                }else{
                    this.searchParam.organId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
        }
    }
</script>

