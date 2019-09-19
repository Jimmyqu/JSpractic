<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable  placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">订单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" clearable  placeholder="请输入订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable  placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车城市</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.useCarCityName" clearable  placeholder="请输入用车城市"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车开始日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="startDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车结束日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="endDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">订单状态</label>
                    <div class="input-group">
                        <el-select v-model="orderStatus" multiple collapse-tags placeholder="请选择" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                v-for="item in orderStatusList"
                                :key="item.defaultOrderStatus"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">是否需要司机</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable v-model="searchParam.isNeedDriver">
                            <el-option label="是" value="1"> </el-option>
                            <el-option label="否" value="0"> </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" clearable placeholder="请输入司机姓名"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机手机号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.phone" clearable  placeholder="请输入司机手机号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.modelName" clearable placeholder="请输入车型名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeArrayItem"></tree-select>
                        <el-checkbox  v-model="check"  @change="includeChildrenCheck" :disabled="!searchParam.organizationId">子组织</el-checkbox>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%" >
                <el-table-column fixed label="操作" width="150">
                    <template slot-scope="scope">
                        <!--10-待调度  20-待提交审批  30-审批中  40-审批不通过  50-待出车  60-已出车  70-已完成-->
                        <el-button v-if="(scope.row.showDispatchBtn && scope.row.showDispatchBtn.first)"
                                   @click="openDispatchForm(scope.row.id)" type="text" size="small" >调度</el-button>
                        <el-button v-if="(scope.row.showSubmitApprovalBtn && scope.row.showSubmitApprovalBtn.first) || (scope.row.btnNum == 2 && (scope.row.showSubmitApprovalBtn && !scope.row.showSubmitApprovalBtn.first))"
                                   @click="openApproval(scope.row.id)" type="text" size="small">提交审批</el-button>
                        <el-button v-if="(scope.row.showChangeDriverBtn && scope.row.showChangeDriverBtn.first) || (scope.row.btnNum == 2 && (scope.row.showChangeDriverBtn && !scope.row.showChangeDriverBtn.first))"
                                   @click="openChangeDriver(scope.row.id)" type="text" size="small">更换司机</el-button>
                        <el-button v-if="(scope.row.showChangeVehicleBtn && scope.row.showChangeVehicleBtn.first) || (scope.row.btnNum == 2 && (scope.row.showChangeVehicleBtn && !scope.row.showChangeVehicleBtn.first))"
                                   @click="openChangeVehicle(scope.row.id)" type="text" size="small">替换车</el-button>
                        <el-button v-if="(scope.row.showFinishBtn && scope.row.showFinishBtn.first) || (scope.row.btnNum == 2 && (scope.row.showFinishBtn && !scope.row.showFinishBtn.first))"
                                   @click="openFinish(scope.row)" type="text" size="small">退车</el-button>
                        <el-dropdown v-if="scope.row.btnNum > 2" trigger="click">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showSubmitApprovalBtn && !scope.row.showSubmitApprovalBtn.first)"
                                        @click="openApproval(scope.row.id)" type="text" size="small">提交审批</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showChangeDriverBtn && !scope.row.showChangeDriverBtn.first)"
                                        @click="openChangeDriver(scope.row.id)" type="text" size="small">更换司机</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showChangeVehicleBtn && !scope.row.showChangeVehicleBtn.first)"
                                        @click="openChangeVehicle(scope.row.id)" type="text" size="small">替换车</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showFinishBtn && !scope.row.showFinishBtn.first)"
                                        @click="openFinish(scope.row)" type="text" size="small">退车</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNumber" sortable label="订单编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.orderNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="customerType" sortable label="客户类型" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
                <el-table-column prop="useCarCityName" sortable label="用车城市" min-width="100"></el-table-column>
                <el-table-column prop="orderStatusText" sortable label="订单状态" min-width="100"></el-table-column>
                <el-table-column prop="startDate" sortable label="用车开始日期" min-width="140"></el-table-column>
                <el-table-column prop="endDate" sortable label="用车结束日期" min-width="140"></el-table-column>
                <el-table-column prop="modelName" sortable label="车型名称" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="isNeedDriverText" sortable label="是否需要司机" min-width="120"></el-table-column>
                <el-table-column prop="driverName" sortable label="司机姓名" min-width="120"></el-table-column>
                <el-table-column prop="phone" sortable label="司机手机号" min-width="150"></el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <!--<el-table-column prop="departureDate" sortable label="出车时间" min-width="120"></el-table-column>-->
                <el-table-column prop="companyName" sortable label="服务组织" min-width="120" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: 'projectOrder',
        mixins: [tool],
        components: {TreeSelect },
        data(){
            return {
                showSearch:false,
                organization:[],
                showDispatchBtn : this.getCurrentUserAuthority("coreProjectOrder/dispatch"),
                showSubmitApprovalBtn : this.getCurrentUserAuthority("coreProjectOrder/submitApproval"),
                showApprovalBtn : this.getCurrentUserAuthority("coreProjectOrder/approval"),
                showChangeDriverBtn : this.getCurrentUserAuthority("coreProjectOrder/changeDriver"),
                showChangeVehicleBtn : this.getCurrentUserAuthority("coreProjectOrder/changeVehicle"),
                showVehicleOutBtn : this.getCurrentUserAuthority("coreProjectOrder/vehicleOut"),
                showFinishBtn : this.getCurrentUserAuthority("coreProjectOrder/finish"),
                showExportBtn : this.getCurrentUserAuthority("coreProjectOrder/export"),
                orderStatusList: [{
                    value: '10',
                    label: '待调度'
                }, {
                    value: '20',
                    label: '待提交审批'
                }, {
                    value: '30',
                    label: '审批中'
                }, {
                    value: '40',
                    label: '审批不通过'
                }, {
                    value: '60',
                    label: '已出车'
                }, {
                    value: '70',
                    label: '已完成'
                }, {
                    value: '80',
                    label: '已到期'
                }],
                defaultOrderStatus: '',
                listUrl : "core/projectOrder/list",
                startDate:[],
                endDate:[],
                orderStatus:[],
                check:false
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
            getListBefore(params){
                if (this.startDate!=null && this.startDate.length>1) {
                    params.startDate1 = this.startDate[0];
                    params.startDate2 = this.startDate[1];
                    this.searchParam.startDate1 = this.startDate[0];
                    this.searchParam.startDate2 = this.startDate[1];
                }else{
                    params.startDate1 = '';
                    params.startDate2 = '';
                    this.searchParam.startDate1 = '';
                    this.searchParam.startDate2 = '';
                }
                if (this.endDate!=null && this.endDate.length>1) {
                    params.endDate1 = this.endDate[0];
                    params.endDate2 = this.endDate[1];
                    this.searchParam.endDate1 = this.endDate[0];
                    this.searchParam.endDate2 = this.endDate[1];
                }else{
                    params.endDate1 = '';
                    params.endDate2 = '';
                    this.searchParam.endDate1 = '';
                    this.searchParam.endDate2 = '';
                }
                if(this.orderStatus && this.orderStatus.length>0){
                    params.orderStatus=this.orderStatus.join(',');
                    this.searchParam.orderStatus=this.orderStatus.join(',');
                }else{
                    params.orderStatus=[];
                    this.searchParam.orderStatus='';
                }
            },
            openVehicleOutForm(id){
                let url = '/tgpt/project/order/vehicleOut?id='+id;
                this.$router.push({path:url});
            },
            openDispatchForm(id){
                let url = '/tgpt/project/order/dispatch?id='+id;
                this.$router.push({path:url});
            },
            openChangeDriver(id){
                let url = '/tgpt/project/order/changeDriver?id='+id;
                this.$router.push({path:url});
            },
            openChangeVehicle(id){
                let url = '/tgpt/project/order/changeVehicle?id='+id;
                this.$router.push({path:url});
            },
            openFinish(bean){
                // 完成操作--首先调用生成月结单接口，然后判断是否存在未结算月结单，
                // 如果存在跳转至第一个月结单页面，不存在则跳转至完成页面
                debugger
                var param = {};
                param.id = bean.id;
                param.enterpriseId = bean.enterpriseId;
                param.departureDate = bean.departureDate;
                ajax.post("core/projectOrder/settlementOrder",param).then(res => {
                    if (res.status == 0){
                        ajax.post("core/projectOrder/checkSettlementOrder",param).then(res => {
                            if (res.data != null){
                                this.$confirm('当前存在未结算订单，请先结算','提示',{
                                    confirmButtonText: '去结算',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.showProjectCheckListHtml(res.data);
                                })
                            }else{
                                // 查找订单是否锁定
                                ajax.get("core/projectOrder/getOrderIsLock/"+bean.id).then(res => {
                                    if (res == 1) {
                                        this.showMessage("该订单已锁定","error");
                                    } else {
                                        let url = '/tgpt/project/order/finish?id='+bean.id;
                                        this.$router.push({path:url});
                                    }
                                })
                            }
                        });
                    }
                });
            },
            openApproval(id){
                let url = '/tgpt/project/order/approval?id='+id;
                this.$router.push({path:url});
            },
            showProjectCheckListHtml() {
                this.$router.push({path:'/tgpt/project/check'});
            },
            exportExcel(){
                window.location.href=this.exportUrl("core/projectOrder/exportExcel?"+$.param(this.searchParam));
            },
            changeArrayItem(data) {
                if (this.organization && this.organization.length>0){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.check = false;
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'includeChildren',0);
                }
            },
            includeChildrenCheck(check){
                this.check = check;
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
            resetList(){
                this.organization=[];
                this.orderStatus=[];
                this.searchParam={};
                this.$set(this.searchParam,'includeChildren',0);
                this.check = false;
                this.startDate=[];
                this.endDate=[];
                this.handleCurrentChange(1);
            },
            handleBtn(list){
                var setList = []
                 // 10-待调度  20-待提交审批  30-审批中  40-审批不通过  50-待出车  60-已出车  70-已完成
                for(var i =0;i<this.list.length;i++){
                    var scope = this.list[i]
                    scope.btnNum = 0
                    if(this.showDispatchBtn && (scope.orderStatus == 10 || scope.orderStatus == 20 || scope.orderStatus == 40)){
                        scope.showDispatchBtn = {
                            show:true
                        }
                        scope.first = true
                        scope.showDispatchBtn.first = true
                        scope.btnNum += 1
                    }
                    if(this.showSubmitApprovalBtn && (scope.orderStatus == 20)){
                        scope.showSubmitApprovalBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showSubmitApprovalBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showChangeDriverBtn && scope.orderStatus == 60 && scope.isNeedDriverText == '是' && scope.ownDriver){
                        scope.showChangeDriverBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showChangeDriverBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showChangeVehicleBtn && scope.orderStatus==60 && ((scope.isNeedDriverText!='是')||(scope.isNeedDriverText=='是'&&scope.ownDriver))){
                        scope.showChangeVehicleBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showChangeVehicleBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showFinishBtn && (scope.orderStatus == 60 || scope.orderStatus == 80)){
                        scope.showFinishBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showFinishBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    setList.push(scope)
                }
                this.$set(this,'list',setList)
            },
        }
    }
</script>
