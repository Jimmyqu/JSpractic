<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
                        <!--<el-date-picker-->
                        <!--v-model="searchParam.carUseMonth"-->
                        <!--type="month"-->
                        <!--value-format="yyyy-MM"-->
                        <!--placeholder="选择月">-->
                        <!--</el-date-picker>-->
                        <el-date-picker
                            v-model="carUseMonth"
                            type="monthrange"
                            range-separator="至"
                            value-format="yyyy-MM"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="check1" @change="organizationIncludeChildrenCheck" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="check2" @change="serviceOrganizationIncludeChildrenCheck" :disabled="!searchParam.serviceOrganizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="settlementOrganization" placeholder="请选择结算组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeSettlementOrganization"></tree-select>
                        <el-checkbox v-model="check3" @change="settlementOrganizationIncludeChildrenCheck" :disabled="!searchParam.settlementOrganizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">客户名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable placeholder="请输入客户名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable placeholder="请输入合同编号"></el-input>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%" >
                <el-table-column prop="enterpriseName" sortable label="客户名称" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="organizationName" sortable label="所属组织" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column prop="serviceOrganizationName" sortable label="服务组织" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column prop="settlementOrganizationName" sortable label="结算组织" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column prop="contractNo" sortable label="合同编号" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="carUseMonth" sortable label="月份" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column prop="settlementStatus" sortable label="结算状态" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column label="应收">
                    <el-table-column label="固定费用">
                        <el-table-column min-width="140" label="车辆租金(固定)" prop="vehicleRental" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="司机服务费(固定)" prop="driverFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="合计" prop="fixedFeeTotal" sortable show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column label="代垫费用">
                        <el-table-column min-width="140" label="油卡油费" prop="oilFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="路桥费" prop="tollFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="粤卡通" prop="etcFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="停车费" prop="parkingFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="餐费" prop="mealFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="住宿费" prop="stayFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="洗车费" prop="washFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="合计" prop="reimbursedFeeTotal" sortable show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column label="变动费用">
                        <el-table-column min-width="140" label="超里程费" prop="overMileageFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="长途补助费" prop="longDistanceFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="司机加班费" prop="overworkFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="其它费用" prop="otherFee" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="合计" prop="changeFeeTotal" sortable show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column min-width="140" label="合计" prop="total" sortable show-overflow-tooltip></el-table-column>
                </el-table-column>

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
        name: 'projectCheckSum',
        mixins: [tool],
        components: {TreeSelect },
        data(){
            return {
                showSearch:false,
                organization:[],
                serviceOrganization:[],
                settlementOrganization:[],
                showExportBtn:this.getCurrentUserAuthority("settlementSum/export"),
                listUrl:"core/settlementSum/list",

                carUseMonth: [],
                check1:false,
                check2:false,
                check3:false
            }
        },
        activated(){
            this.getList();
        },
        mounted(){
            this.initDate();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods:{
            initDate(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var endDate = (year.toString() + "-" + month.toString());

                date.setMonth(date.getMonth() - 3);
                var startDate = date.format('yyyy-MM');

                this.carUseMonth = [startDate,endDate];
            },getListBefore(params) {
                if (this.carUseMonth) {
                    params.startCarUseMonth = this.carUseMonth[0];
                    params.endCarUseMonth = this.carUseMonth[1];
                } else {
                    params.startCarUseMonth = '';
                    params.endCarUseMonth = '';
                }
            },
            exportData(){
                var params = this.searchParam;
                if (this.carUseMonth) {
                    params.startCarUseMonth = this.carUseMonth[0];
                    params.endCarUseMonth = this.carUseMonth[1];
                } else {
                    params.startCarUseMonth = '';
                    params.endCarUseMonth = '';
                }
                location.href = this.exportUrl("core/settlementSum/export?" + $.param(params));
            },
            changeOrganization(data) {
                if (this.organization && this.organization.length>0){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.check1 = false;
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organizationIncludeChildren',0)
                }
            },
            changeServiceOrganization(data) {
                if (this.serviceOrganization && this.serviceOrganization.length>0){
                    this.searchParam.serviceOrganizationId=this.serviceOrganization[0];
                }else{
                    this.check2 = false;
                    this.searchParam.serviceOrganizationId='';
                    this.$set(this.searchParam,'serviceOrganizationIncludeChildren',0)
                }
            },
            changeSettlementOrganization(data) {
                if (this.settlementOrganization && this.settlementOrganization.length>0){
                    this.searchParam.settlementOrganizationId=this.settlementOrganization[0];
                }else{
                    this.check3 = false;
                    this.searchParam.settlementOrganizationId='';
                    this.$set(this.searchParam,'settlementOrganizationIncludeChildren',0)
                }
            },
            organizationIncludeChildrenCheck(check){
                this.check1 = check;
                if(check==true){
                    this.searchParam.organizationIncludeChildren=1;
                }else{
                    this.searchParam.organizationIncludeChildren=0;
                }
            },
            serviceOrganizationIncludeChildrenCheck(check){
                this.check2 = check;
                if(check==true){
                    this.searchParam.serviceOrganizationIncludeChildren=1;
                }else{
                    this.searchParam.serviceOrganizationIncludeChildren=0;
                }
            },
            settlementOrganizationIncludeChildrenCheck(check){
                this.check3 = check;
                if(check==true){
                    this.searchParam.settlementOrganizationIncludeChildren=1;
                }else{
                    this.searchParam.settlementOrganizationIncludeChildren=0;
                }
            },
            resetList(){
                this.initDate();
                this.organization=[];
                this.serviceOrganization=[];
                this.settlementOrganization=[];
                this.searchParam={};
                this.$set(this.searchParam,'organizationIncludeChildren',0);
                this.check1 = false;
                this.$set(this.searchParam,'serviceOrganizationIncludeChildren',0);
                this.check2 = false;
                this.$set(this.searchParam,'settlementOrganizationIncludeChildren',0);
                this.check3 = false;
                this.handleCurrentChange(1);
            }
        }
    }
</script>

