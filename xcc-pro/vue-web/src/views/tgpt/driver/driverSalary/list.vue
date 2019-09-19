<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">司机</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" placeholder="请输入司机" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">项目月结单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.projectVehicleSettlementNo" placeholder="请输入项目月结单号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">订单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" placeholder="请输入订单编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="check" @change="includeChildrenCheck" :disabled="!searchParam.organizationId">子组织</el-checkbox>
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
                <el-button type="small" @click="resetList();" size="mini">重置</el-button>
                <el-button class="btn btn-border btn-sm" @click="exportData()" v-show="exportShow">导出</el-button>
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="driverName" sortable label="司机" min-width="100">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.driverName}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="projectVehicleSettlementNo" sortable label="项目月结单号" min-width="220"></el-table-column>
                <el-table-column prop="orderNumber" sortable label="订单编号" min-width="220"></el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="220"></el-table-column>
                <el-table-column prop="carUseMonth" sortable label="月份" min-width="140"></el-table-column>
                <el-table-column prop="driverFee" sortable label="每月司机费用" min-width="140"></el-table-column>
                <el-table-column prop="driverCommunicationFee" sortable label="每月司机通讯费" min-width="140"></el-table-column>
                <el-table-column prop="workHour" sortable label="司机每天工作时长" min-width="140"></el-table-column>
                <el-table-column prop="otherSubsidy" sortable label="其他补贴费用" min-width="120"></el-table-column>
                <el-table-column prop="overworkFee" sortable label="司机加班费" min-width="120"></el-table-column>
                <el-table-column prop="stayFee" sortable label="住宿费" min-width="100"></el-table-column>
                <el-table-column prop="mealFee" sortable label="餐费" min-width="100"></el-table-column>
                <el-table-column prop="welfareFee" sortable label="福利费" min-width="100"></el-table-column>
                <el-table-column prop="heatSubsidy" sortable label="高温补贴费" min-width="120"></el-table-column>
                <el-table-column prop="birthdaySubsidy" sortable label="生日补贴费" min-width="120"></el-table-column>
                <el-table-column prop="remark" sortable show-overflow-tooltip label="备注" min-width="140"></el-table-column>
                <el-table-column prop="companyName" sortable show-overflow-tooltip label="所属组织" min-width="120"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: 'driverSalary',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                organization: [],
                listUrl : "base/driverSalary/list",
                exportShow : this.getCurrentUserAuthority("driverSalary/export"),
                detailShow : this.getCurrentUserAuthority("driverSalary/detail"),
                check: false
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
            exportData() {
                location.href = this.exportUrl("base/driverSalary/export?" + $.param(this.searchParam));
            },
            changeOrganization(data) {
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
                this.searchParam={};
                this.check = false;
                this.$set(this.searchParam,'includeChildren',0);
                this.handleCurrentChange(1);
            },
        }

    }
</script>

