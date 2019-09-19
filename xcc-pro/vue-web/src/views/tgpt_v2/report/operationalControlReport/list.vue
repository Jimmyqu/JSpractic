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
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选车辆所属">
                            <el-option label="自有车辆" :value="1"></el-option>
                            <el-option label="租赁车辆" :value="2"></el-option>
                            <el-option label="挂靠车辆" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <!--<el-checkbox v-model="searchParam.organCascade">子组织</el-checkbox>-->
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌号" clearable></el-input>
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
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="getThisList()">查询</el-button>
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
                <el-table-column  prop="plate" sortable label="车牌" min-width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="toDetail(scope.row)">
                        {{scope.row.plate}}
                    </el-button>
                </template>
                </el-table-column>
                <el-table-column  prop="assetsType" sortable label="车辆所属" min-width="120"></el-table-column>
                <el-table-column  prop="name" sortable label="所属部门" min-width="120"></el-table-column>
                <el-table-column  prop="vehicleModelInfoName" sortable label="车型" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="totalCount" sortable label="违规总数" min-width="120"></el-table-column>
                <el-table-column  prop="timeLimitCount" sortable label="时间栅栏" min-width="120"></el-table-column>
                <el-table-column  prop="areaLimitCount" sortable label="区域栅栏" min-width="120"></el-table-column>
                <el-table-column  prop="electricFenceCount" sortable label="电子围栏" min-width="120"></el-table-column>
                <el-table-column  prop="speedingCount" sortable label="超速" min-width="120"></el-table-column>
                <el-table-column  prop="dragracingCollisionCount" sortable label="飙车" min-width="120"></el-table-column>
                <el-table-column  prop="idleSpeedCount" sortable label="怠速" min-width="120"></el-table-column>
                <el-table-column  prop="fatigueDrivingCount" sortable label="疲劳驾驶" min-width="120"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import ajax from '@/utils/request'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: 'alarmReport',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                exportBtnShow:this.getCurrentUserAuthority("operationalControlReportController/exportExcel"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"report/operationalControlReportController/list",
                companyIds:"",
                dialogForm:{},
                searchParam: {},
                organization:[],
                createDate: [],
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            this.getCreateDate();
            this.getList();
            // if(!this.$store.state.isInit){
            //     this.$store.state.isInit = true;
            //     this.getList();
            // }
        },
        methods: {
            getListBefore(params) {
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

            getThisList(){
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId = this.organization[0];
                }
            },
            getCreateDate(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var endDate = (year.toString() + "-" + month.toString());

                date.setMonth(date.getMonth() - 2);
                var startDate = date.format('yyyy-MM');

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

            exportExcel(){
                window.location = this.exportUrl("report/operationalControlReportController/export?" + $.param(this.searchParam));
            },

            toDetail(row){
                if(row.id){
                    let url = '/tgpt/vehicle/vehicleInformation/detail/' + row.id;
                    this.$router.push({path:url});
                }
            }
        }
    }
</script>

