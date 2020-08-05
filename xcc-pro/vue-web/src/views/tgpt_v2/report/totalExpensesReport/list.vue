<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <!--<el-date-picker-->
                            <!--v-model="createDate"-->
                            <!--@change="chooseTime"-->
                            <!--type="daterange"-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始日期"-->
                            <!--end-placeholder="结束日期"-->
                            <!--value-format="yyyy-MM-dd">-->
                        <!--</el-date-picker>-->
                        <el-date-picker
                            v-model="createDate"
                            type="monthrange"
                            range-separator="至"
                            value-format="yyyy-MM"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" placeholder="不限" clearable>
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌、车架号" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
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
        <!-- 表格 table -->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="plate" sortable label="车牌" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toVehicleDetail(scope.row.id)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="region" sortable label="服务组织" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="inspectionCost" sortable label="年检费用（元）" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="baoyang" sortable label="保养费用（元）" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="insuranceCost" sortable label="保险费用（元）" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="accidentAmount" sortable label="事故费用（元）" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="weixiu" sortable label="维修费用（元）" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="oilCost" sortable label="加油费用（元）" min-width="150" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: 'totalExpensesReport',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                exportBtnShow:this.getCurrentUserAuthority("totalExpensesReportController/exportExcel"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"report/totalExpensesReportController/list",
                companyIds:"",
                dialogForm:{},
                searchParam: {},
                organization:[],
                createDate : [],
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            this.getCreateDate();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                // if (this.companyIds) {
                //     params.organizationId = this.companyIds[0];
                // }else{
                //     params.organizationId = '';
                //     this.$set(this.searchParam,'organCascade',false);
                // }
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                } else {
                    params.startTime = '';
                    params.endTime = '';
                }
            },

            resetList(){
                this.searchParam = {};
                //this.createDate = [];
                this.companyIds = "";
                this.getCreateDate();
                this.getList();
                this.organization=[];
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId = this.organization[0];
                }
            },
            getCreateDate(){
                // let eDate = new Date();
                // let strEdate = eDate.format("yyyy-MM-dd")
                // let strSdate;
                // let sDate = new Date();
                // sDate.setMonth(eDate.getMonth()-1)-1;
                // let yy1 = sDate.getFullYear();
                // let mm1 = sDate.getMonth()+1;
                // let dd1 = sDate.getDate();
                // if(dd1 == '00'){
                //     mm1 = parseInt(mm1)-1;
                //     let new_date = new Date(yy1,mm1,1);
                //     dd1 = (new Date(new_date.getTime()-1000*60*60*24)).getDate()
                // }
                // if (mm1 < 10 ) {
                //     mm1 = '0' + mm1;
                // }
                // if (dd1 < 10) {
                //     dd1 = '0' + dd1;
                // }
                // strSdate = yy1 + '-' + mm1 + '-' + dd1;
                // this.searchParam.startTime = strSdate;
                // this.searchParam.endTime = strEdate;
                // this.createDate = [strSdate, strEdate];
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var endDate = (year.toString() + "-" + month.toString());

                date.setMonth(date.getMonth() - 2);
                var startDate = date.format('yyyy-MM');
                this.searchParam.startTime = startDate;
                this.searchParam.endTime = endDate;
                this.createDate = [startDate,endDate];
            },
            chooseTime(){
                if(this.createDate.length > 0){
                    this.searchParam.startTime = this.createDate[0] ;
                    this.searchParam.endTime = this.createDate[1];
                }else{
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
            },

            toList(date, type, vehicleStatus){
                let url;
                if (type == '1'){
                    url = '/tgpt_v2/alarm/electricfence?date='+date;
                }else if (type == '2'){
                    url = '/tgpt_v2/alarm/areaLimit?date='+date;
                }else if (type == '3'){
                    url = '/tgpt_v2/alarm/timeLimit?date='+date;
                }else if (type == '4'){
                    url = '/tgpt_v2/alarm/parkingfence?date='+date;
                }else if (type == '5'){
                    url = '/tgpt_v2/alarm/operation?date='+date;
                }
                if(this.searchParam.vehicleStatus){
                    url = url + "&vehicleStatus=" + vehicleStatus;
                }
                this.$router.push({path:url});
            },

            exportExcel(){
                window.location = this.exportUrl("report/totalExpensesReportController/excel?" + $.param(this.searchParam));
            },
            toVehicleDetail(id){
                if(id == undefined || id == ''){
                    return;
                }
                let url="/tgpt/vehicle/vehicleInformation/detail/"+id;
                this.$router.push({path:url});
            },
        }
    }
</script>

