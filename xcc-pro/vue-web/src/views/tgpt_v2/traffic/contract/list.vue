<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group" >
                    <label class="control-label" >合同编号</label>
                    <div class="input-group" >
                        <el-input placeholder="请输入合同编号" v-model="searchParam.contractNumber" clearable ></el-input>
                    </div>
                </div>
                <div class="form-group" >
                    <label class="control-label">承租人</label>
                    <div class="input-group" >
                        <el-input placeholder="请输入承租人/承租人手机号" v-model="searchParam.renter" clearable ></el-input>
                    </div>
                </div>
                <div class="form-group" >
                    <label class="control-label">合同结束日期</label>
                    <div class="input-group" >
                        <el-date-picker
                            v-model="endDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group" >
                    <label class="control-label">合同状态</label>
                    <div class="input-group" >
                        <el-select v-model="contractStatus" multiple collapse-tags placeholder="全部" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="执行中" value="40"></el-option>
                            <el-option label="已到期" value="50"></el-option>
                            <el-option label="已完成" value="60"></el-option>
                            <el-option label="已终止" value="70"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group" >
                    <label class="control-label"  >合同类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.contractType" placeholder="全部" clearable>
                            <el-option label="以租代购" value="1"></el-option>
                            <el-option label="直租" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                            <el-option label="内部指派" value="4"></el-option>
                            <el-option label="短租" value="5"></el-option>
                            <el-option label="租牌" value="6"></el-option>
                            <el-option label="长包" value="7"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade"  :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group" >
                    <label class="control-label">创建时间</label>
                    <div class="input-group" >
                        <el-date-picker
                            v-model="createTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
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
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column min-width="140" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="showEditBtn && (scope.row.contractStatus==10||scope.row.contractStatus==30)" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-if="showApplyBtn && (scope.row.contractStatus==10||scope.row.contractStatus==30)" type="text" @click="submitApproval(scope.row)" :disabled="commitDisabled">提交</el-button>
                        <el-button v-if="showTerminateBtn && (scope.row.contractStatus==40)" type="text" @click="terminate(scope.row.id)">终止</el-button>
                        <el-button v-if="showFinishBtn && (scope.row.contractStatus==40||scope.row.contractStatus==50)" type="text" @click="finish(scope.row)">完成</el-button>
                        <el-button v-if="showDeleteBtn && (scope.row.contractStatus==10||scope.row.contractStatus==30||scope.row.contractStatus==70)" type="text" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="160" label="合同编号" prop="contractNumber" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="合同结束日期" prop="contractEndDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" label="合同状态" prop="contractStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" label="承租人" prop="renter" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="承租人手机号" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="合同类型" prop="contractTypeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所需车辆台数" prop="vehicleNum" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合同总金额(元)" prop="contractAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: "contract",
        mixins: [tool],
        components:{ ApprovalFlow, TreeSelect },
        data() {
            return {
                showExportBtn : this.getCurrentUserAuthority('traffic/contract/export'),
                showAddBtn: this.getCurrentUserAuthority('traffic/contract/add'),
                showEditBtn: this.getCurrentUserAuthority('traffic/contract/edit'),
                showApplyBtn: this.getCurrentUserAuthority('traffic/contract/apply'),
                showTerminateBtn: this.getCurrentUserAuthority('traffic/contract/terminate'),
                showFinishBtn: this.getCurrentUserAuthority('traffic/contract/finish'),
                showDeleteBtn: this.getCurrentUserAuthority('traffic/contract/delete'),
                commitDisabled: false,
                searchParam:{},
                loading: false,
                organizationIds:[],
                endDate:[],
                createTime:[],
                contractStatus:[],
                listUrl: 'traffic/trafficContract/list'
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted() {
            var month = this.$route.query.month;
            var index = this.$route.query.index;
            debugger
            if(index && month){
                this.$set(this.searchParam,'contractType',index*1+1+'');
                this.contractStatus = ['40','50','60','70'];
                this.createTime=[month+'-01',this.getMonthLastDay(month)];
            }
            this.searchParam = Object.assign({},this.searchParam);
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {

            getListBefore(params) {
                if (this.endDate && this.endDate.length > 0) {
                    params.contractEndDateStart = this.endDate[0];
                    params.contractEndDateEnd = this.endDate[1];
                    this.searchParam.contractEndDateStart = this.endDate[0];
                    this.searchParam.contractEndDateEnd = this.endDate[1];
                } else {
                    params.contractEndDateStart = '';
                    params.contractEndDateEnd = '';
                    this.searchParam.contractEndDateStart = '';
                    this.searchParam.contractEndDateEnd = '';
                }
                if (this.createTime && this.createTime.length > 0) {
                    params.createTimeStart = this.createTime[0];
                    params.createTimeEnd = this.createTime[1];
                    this.searchParam.createTimeStart = this.createTime[0];
                    this.searchParam.createTimeEnd = this.createTime[1];
                } else {
                    params.createTimeStart = '';
                    params.createTimeEnd = '';
                    this.searchParam.createTimeStart = '';
                    this.searchParam.createTimeEnd = '';
                }
                if(this.contractStatus && this.contractStatus.length>0){
                    params.contractStatus=this.contractStatus.join(',');
                    this.searchParam.contractStatus=this.contractStatus.join(',');
                }else{
                    params.contractStatus=[];
                    this.searchParam.contractStatus='';
                }
            },
            getMonthLastDay(month){
                debugger
                let arr=month.split('-');
                let now=new Date(arr[0],arr[1],1,0,0,0);
                // now.setFullYear(arr[0]);
                // now.setMonth(arr[1]);//已将日期设置到下一月了
                // now.setDate(0);
                //  now.setHours(0);
                //  now.setMinutes(0);
                //  now.setMilliseconds(0);
                now.setTime(now.getTime() - 60*60*24*1000)
                let y=now.getFullYear();
                let m=now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1;
                let d=now.getDate()<10?'0'+now.getDate():now.getDate();
                return y+'-'+m+'-'+d;
            },
            submitApproval(row) {
                var id  = row.id;
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $this.commitDisabled=true;
                    startProcessAsync(id,'CWHT').then((message)=>{
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

            terminate(id){
                this.$confirm('终止后将不能再对合同款进行临期提醒，是否确认终止？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get('traffic/trafficContract/terminate/' + id).then(res => {
                        if (res.status == 0) {
                            this.getList();
                            this.showMessage('操作成功', "success");
                        } else {
                            this.showMessage(res.msg, "error");
                        }
                    })
                })
            },
            finish(row){
                ajax.get('traffic/trafficContract/finish/'+row.id).then(res=>{
                    if(res.status==0){
                        this.getList();
                        this.showMessage('操作成功',"success");
                    }else if(res.status==-2){
                        this.$confirm('当前合同还存在未收的合同款，请先完成收款！', '提示', {
                            confirmButtonText: '去收款',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$router.push({path:'/tgpt_v2/traffic/contractReceipt?contractNumber='+row.contractNumber});
                        })
                    }else{
                        this.showMessage(res.msg,'error')
                    }
                })
            },
            del(id){
                this.$confirm('确定要删除此合同嘛？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get('traffic/trafficContract/delete/' + id).then(res => {
                        if (res.status == 0) {
                            this.getList();
                            this.showMessage('删除成功', "success");
                        } else {
                            this.showMessage(res.msg, "error");
                        }
                    })
                })
            },

            exportExcel(){
                window.location = this.exportUrl("traffic/trafficContract/export?" + $.param(this.searchParam));
            },
            changeOrganization(){
                if (this.organizationIds && this.organizationIds.length>0){
                    this.searchParam.organizationId=this.organizationIds[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            resetList(){
                this.organizationIds=[];
                this.endDate=[];
                this.createTime=[];
                this.contractStatus=[];
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.handleCurrentChange(1);
            }
        },

    }
</script>
