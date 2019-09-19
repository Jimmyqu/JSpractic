<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">调度单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNo" clearable  placeholder="请输入调度单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable  placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable  placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable  placeholder="请输入车牌号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" clearable placeholder="请输入驾驶员"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">散租类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.scheduleType" placeholder="请选择散租类型" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option label="散租自驾" value="1"></el-option>
                            <el-option label="散租配驾" value="2"></el-option>
                            <el-option label="替代车" value="3"></el-option>
                            <el-option label="公务车" value="4"></el-option>
                        </el-select>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed prop="orderNo" sortable label="调度单号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row.id)">{{scope.row.orderNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="scheduleTypeText" sortable label="订单类型" min-width="120"></el-table-column>
                <el-table-column  prop="enterpriseName" sortable label="服务客户" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="contractNo" sortable label="合同编号" show-overflow-tooltip min-width="220"></el-table-column>
                <el-table-column  prop="depTime" sortable label="出车时间" show-overflow-tooltip min-width="220"></el-table-column>
                <el-table-column  prop="arrTime" sortable label="还车时间" min-width="150"></el-table-column>
                <el-table-column   sortable label="服务时长" min-width="150">
                    <template slot-scope="scope">
                        {{getDiffTime(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column   sortable label="服务里程" min-width="150">
                    <template slot-scope="scope">
                        {{getDiffMile(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column  prop="plate" sortable label="车辆" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>
                <el-table-column  prop="totalMoney" sortable label="订单金额" min-width="100"></el-table-column>
                <el-table-column  prop="rentMoney" sortable label="车辆租金" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="tollCharge" sortable label="路桥费" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column  prop="parkingFee" sortable label="停车费" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column  prop="oilFee" sortable label="加油费" min-width="120"></el-table-column>
                <el-table-column  prop="outtimeFee" sortable label="超时费" min-width="120"></el-table-column>
                <el-table-column  prop="outmileFee" sortable label="超公里费" min-width="120"></el-table-column>
                <el-table-column  prop="otherFee" sortable label="其他费用" min-width="120"></el-table-column>
                <el-table-column  prop="organizationName" sortable label="所属组织" min-width="120"></el-table-column>
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
        name: 'vehicleScheduleReport',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            return {
                showSearch:false,
                exportBtnShow:this.getCurrentUserAuthority("vehicleScheduleReport/exportExcel"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"report/vehicleSchedule/list",
                companyIds:"",
                useDate:[],
                dialogForm:{},
            }
        },
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
           /* getListBefore(params) {
                if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                }else{
                    params.organizationId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },*/
            changeOrganization(data){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.organizationId=this.companyIds[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            resetList(){
              this.searchParam = {};
              this.$set(this.searchParam,'organCascade',0);
              this.companyIds = "";
              this.getList();
            },

            toDetail(id){
                if(~this.$route.fullPath.indexOf("/detail/")){
                    return;
                }
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detail/"+id});
            },

            getDiffTime(row){
                if(row.depTime && row.depTime){
                    let useTime = '';
                    let arrTime = new Date((row.arrTime+':00').replace(/-/g,"/"));
                    let depTime = new Date((row.depTime+':00').replace(/-/g,"/"));
                    let diffmin = (arrTime.getTime() - depTime.getTime())/(1000*60);
                    let hour = Math.floor(diffmin/60);
                    if(hour<=0){
                        useTime =  diffmin+'min'
                    }else{
                        let min = diffmin-hour*60;
                        useTime =  `${hour}h${min}min`;
                    }
                    return useTime;
                }
            },

            getDiffMile(row){
                if(row.depMile && row.arrMile){
                    return row.arrMile - row.depMile;
                }
            },

            exportExcel(){
                var params= this.searchParam;
                if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                }
                var useDate = this.useDate;
                if(useDate!=null && useDate.length>1){
                    params.startUseTime = useDate[0] + ' 00:00:00';
                    params.endUseTime = useDate[1] + ' 23:59:59';
                }else{
                    params.startUseTime = '';
                    params.endUseTime ='';
                }
                window.location = this.exportUrl("report/vehicleSchedule/export?" + $.param(params));
            },
        }
    }
</script>

