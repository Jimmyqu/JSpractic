<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">项目合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable autocomplete="off"
                                  placeholder="请输入项目合同编号"></el-input>
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
                    <label class="control-label">项目合同状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.contractStatus">
                            <template v-for="(value, key) in contractStatusMap">
                                <el-option :label="value" :value="key" :key="key"></el-option>
                            </template>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同退出状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.contractExitsStatus" >
                            <template v-for="(value, key) in contractOutStatusMap">
                                <el-option :label="value" :value="key" :key="key"></el-option>
                            </template>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">申请日期</label>
                    <div class="input-group">
                        <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                        v-model="applicationDate" value-format="yyyy-MM-dd"
                                        @change="applicationDataChange(this)">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询
                </el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="table-box">
            <el-table v-loading="listLoading"border style="width: 100%" :data="list">
                <el-table-column fixed label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="exit(scope.row.id)" type="text" size="small"
                                   v-if="showApplyBtn && (scope.row.contractExitsStatus == 10 || scope.row.contractExitsStatus == null)">申请退出
                        </el-button>
                        <el-button @click.native.prevent="commitApplyOut(scope.row.id, scope.row.contractOutId)"
                                   type="text" size="small"
                                   v-if="showSubmitApplyBtn && scope.row.contractExitsStatus == 20">提交审批
                        </el-button>
                        <el-dropdown placement="bottom" size="mini" trigger="click"
                                     v-if="showConfirmBtn && scope.row.contractExitsStatus == 50">
                            <span class="el-dropdown-link">
                                合同退出信息确认<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu class="table-dropdown" slot="dropdown">
                                <el-dropdown-item @click.native.prevent="applyOutConfirm(scope.row.id,1)">资产调拨处置确认
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="applyOutConfirm(scope.row.id,2)">驾驶人员安排确认
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="applyOutConfirm(scope.row.id,3)">车况说明确认
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="applyOutConfirm(scope.row.id,4)">保险确认
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="applyOutConfirm(scope.row.id,5)">违章情况确认
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="applyOutConfirm(scope.row.id,6)">费用收取确认
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column prop="contractNumber" label="项目合同编号" min-width="200" sortable fixed>
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="customerType" label="客户类型" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="enterpriseName" label="服务客户" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="contractStartDate" label="合同开始日期" min-width="120" sortable></el-table-column>
                <el-table-column prop="contractEndDate" label="合同结束日期" min-width="120" sortable></el-table-column>
                <el-table-column prop="applicationDate" label="申请日期" min-width="100" sortable></el-table-column>
                <el-table-column prop="originatorName" label="发起人" min-width="100" sortable></el-table-column>
                <el-table-column prop="originateDeptName" label="发起部门" min-width="140" show-overflow-tooltip sortable></el-table-column>
                <el-table-column prop="salesmanName" label="业务员" min-width="100" sortable></el-table-column>
                <el-table-column prop="projectReviewName" label="项目评审" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="contractStatusName" label="项目合同状态" min-width="120" sortable></el-table-column>
                <el-table-column prop="contractExitsStatusName" label="项目合同退出状态" min-width="150"
                                 sortable></el-table-column>
                <el-table-column prop="assetAllocationDisposalConfirm" label="资产调拨处置确认" min-width="150" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.assetAllocationDisposalConfirm === 1">已确认</span>
                        <span v-else>未确认</span>
                    </template>
                </el-table-column>
                <el-table-column prop="driverArrangementConfirm" label="驾驶人员安排确认" min-width="150" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.driverArrangementConfirm === 1">已确认</span>
                        <span v-else>未确认</span>
                    </template>
                </el-table-column>
                <el-table-column prop="carConditionExplainConfirm" label="车况说明确认" min-width="120" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.carConditionExplainConfirm === 1">已确认</span>
                        <span v-else>未确认</span>
                    </template>
                </el-table-column>
                <el-table-column prop="insuranceConfirm" label="保险确认" min-width="100" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.insuranceConfirm === 1">已确认</span>
                        <span v-else>未确认</span>
                    </template>
                </el-table-column>
                <el-table-column prop="peccancyConfirm" label="违章情况确认" min-width="120" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.peccancyConfirm === 1">已确认</span>
                        <span v-else>未确认</span>
                    </template>
                </el-table-column>
                <el-table-column prop="chargedConfirm" label="费用收取确认" min-width="120" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.chargedConfirm === 1">已确认</span>
                        <span v-else>未确认</span>
                    </template>
                </el-table-column>
            </el-table>
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

        <ConfirmForm ref="confirmForm" @load="getList"></ConfirmForm>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contractOut/confirm'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcess} from '@/utils/index'

    export default {
        name: 'projectContractOut',
        mixins: [tool],
        components:{ConfirmForm},
        data() {
            return {
                showSearch: false,
                showApplyBtn: this.getCurrentUserAuthority("project/projectContractOut/applyOut"),
                showSubmitApplyBtn: this.getCurrentUserAuthority("project/projectContractOut/submitApply"),
                showConfirmBtn: this.getCurrentUserAuthority("project/projectContractOut/confirm"),
                showDetailBtn: this.getCurrentUserAuthority("project/projectContractOut/detail"),
                contractStatusMap: {},
                contractOutStatusMap: {},
                listUrl: "core/projectContractOut/list",
                applicationDate:[]
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted() {
            //初始化状态列表
            this.initDropDownStatus();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                var applicationDate = this.applicationDate;
                if(applicationDate!=null && applicationDate.length>1){
                    params.applicationBeginDate = applicationDate[0] + ' 00:00:00';
                    params.applicationEndDate = applicationDate[1] + ' 23:59:59';
                }else{
                    params.applicationBeginDate = '';
                    params.applicationEndDate ='';
                }
            },
            exit(id) {
                this.$router.push({path:'/tgpt/project/contractOut/exit?id='+id});
            },
            initDropDownStatus() {
                //初始化项目合同退出状态列表
                ajax.get("core/projectContractOut/contractExitStatus").then((result) => {
                    this.contractStatusMap = result.data.contractStatusMap;
                    this.contractOutStatusMap = result.data.contractOutStatusMap;
                });
            },
            commitApplyOut(id, contractOutId) {
                this.$confirm('确认提交合同退出审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("core/projectContractOut/commitContractOut/" + id).then((result) =>{
                        this.getList();
                        //发起审批
                        this.startContractOutApproval(contractOutId);
                        this.$message.success("提交审批成功");
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
            startContractOutApproval(contractOutId) {
                if(!contractOutId) {
                    console.error("流程业务id错误");
                    return;
                }
                let businessId = contractOutId;
                let modelType = "XMHTTC";
                startProcess(businessId, modelType, (result) => {
                    if (result.status == 0) {
                        //刷新列表
                        this.getList();
                    }
                });
            },resetList(){
            this.searchParam={};
            this.applicationDate=[];
            this.handleCurrentChange(1);
        },
        }
    }
</script>

