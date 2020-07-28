<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">事故单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.accidentNo" placeholder="请输入事故单号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">维修单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.maintenanceNo" placeholder="请输入维修单号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">出险时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="accidentDate"
                            @change="accidentDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleModelInfoName" placeholder="请输入车型" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">事故类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.accidentResponsibility" clearable placeholder="请选择事故类型">
                            <el-option label="全责" value="1"></el-option>
                            <el-option label="主责" value="2"></el-option>
                            <el-option label="次责" value="3"></el-option>
                            <el-option label="对等" value="4"></el-option>
                            <el-option label="无责" value="5"></el-option>
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
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
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
            <p class="summary"><span>车辆总数：</span><span>{{vehicleTotal.vehicleTotal}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>金额总计：</span><span>{{vehicleTotal.amountTotal}}</span></p>
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column min-width="120" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="200" label="事故单号" prop="accidentNo" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="accidentDetail(scope.row.accidentId)">{{scope.row.accidentNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="司机姓名" prop="driverName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="车牌号" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="出险时间" prop="accidentTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="事故类型" prop="accidentResponsibilityText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="事故描述" prop="accidentDescription" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="200" label="维修单号" prop="maintenanceNo" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="maintenanceDetail(scope.row.maintenanceId)">{{scope.row.maintenanceNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="维修项目" prop="maintenanceAccessories" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="标的车费用" prop="targetCarAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="三者车费用" prop="threeCarAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="金额合计" prop="fixedLossAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="资料情况" prop="driverInformation" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员扣款金额" prop="driverPenalty" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员扣安全奖情况" prop="driverSafetyAward" sortable show-overflow-tooltip></el-table-column>
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
        name: 'vehicleAccidentMaintenanceReport',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                organization:[],
                accidentDate:[],
                searchParam: {},
                vehicleTotal:{},
                //showEditBtn: this.getCurrentUserAuthority("bid/edit"),
                //showAddBtn: this.getCurrentUserAuthority("bid/add"),
                showExportBtn: this.getCurrentUserAuthority('vehicleAccidentMaintenanceReport/exportExcel'),
                //showDownloadBtn:this.getCurrentUserAuthority("bid/download"),
               // showApplyBtn:this.getCurrentUserAuthority("bid/apply"),
                listUrl: 'report/accidentMaintenance/list'
            }
        },
        activated(){
            this.getList();
           // this.vehicleTotalInfo();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            //this.vehicleTotalInfo();
        },
        methods: {
            getListAfter(){
                this.vehicleTotalInfo();
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            resetList(){
               this.organization=[];
               this.accidentDate=[];
               this.searchParam={};
                this.$set(this.searchParam,'organCascade',0);
               this.getList();
            },
            accidentDateChange() {
                if(this.accidentDate && this.accidentDate.length>0){
                    let createDate = this.accidentDate;
                    this.searchParam.accidentStartTime = createDate[0]+" 00:00:00";
                    this.searchParam.accidentEndTime = createDate[1]+" 23:59:59";
                }else{
                    this.searchParam.accidentStartDate="";
                    this.searchParam.accidentEndDate="";
                }
            },
            exportExcel() {
                window.location = this.exportUrl("report/accidentMaintenance/export?" + $.param(this.searchParam));
            },
            vehicleTotalInfo() {
                ajax.post('report/accidentMaintenance/vehicleTotalInfo',this.searchParam).then(res=>{
                    if(res.status==0){
                        this.vehicleTotal=res.data;
                    }
                })
            },
            maintenanceDetail(id){
                this.$router.push({path:"/tgpt/traffic/maintenanceBill/detail/"+id});
            },
            accidentDetail(id){
                this.$router.push({path:"/tgpt/traffic/accident/detail/"+id});
            }
        }
    }
</script>

