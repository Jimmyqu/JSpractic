<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">加油单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oilNum" clearable placeholder="输入订单号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable placeholder="输入合同编号查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" clearable placeholder="输入驾驶员查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="输入车辆查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.reimburseStatus" clearable placeholder="不限">
                            <el-option label="待处理" :value=0></el-option>
                            <el-option label="审批中" :value=1></el-option>
                            <el-option label="驳回" :value=2></el-option>
                            <el-option label="已完成" :value=3></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">支付方式</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.payType" clearable placeholder="不限">
                            <el-option label="油卡" value="1"></el-option>
                            <el-option label="现金" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">加油卡</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oilCar" clearable placeholder="输入加油卡查询"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="creatDate"
                            type="daterange"
                            @change="creatDateChange"
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
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column prop="orderNo" fixed sortable label="加油单号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="detail(scope.row)">{{scope.row.oilNum}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="plate" sortable label="车辆" width="120"></el-table-column>
                <el-table-column  prop="driverName" sortable label="驾驶员" width="120"></el-table-column>
                <el-table-column  prop="oilTime" sortable label="加油时间" width="120"></el-table-column>
                <el-table-column  prop="payTypeName" sortable label="支付方式" width="120"></el-table-column>
                <el-table-column  prop="oilCar" sortable label="加油卡" width="160"></el-table-column>
                <el-table-column  prop="oilCost" sortable label="总金额(元)" width="120"></el-table-column>
                <el-table-column  prop="companyName" sortable label="服务组织" show-overflow-tooltip width="150"></el-table-column>
                <el-table-column  prop="enterpriseName" sortable label="服务客户" show-overflow-tooltip width="150"></el-table-column>
                <el-table-column  prop="contractNo" sortable label="合同编号" width="200"></el-table-column>
                <el-table-column  prop="statusName" sortable label="状态" width="120"></el-table-column>
                <el-table-column  prop="createrName" sortable label="创建人" width="120"></el-table-column>
                <el-table-column  prop="createTime" sortable label="创建时间" width="140"></el-table-column>
            </el-table>
            <!-- 分页 -->

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficRefuel',
        mixins: [tool],
        data: function () {
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("coreVehicleFuelOilBill/addOrEdit"),
                showEditBtn: this.getCurrentUserAuthority("coreVehicleFuelOilBill/addOrEdit"),
                showImportExcelBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority("coreVehicleFuelOilBill/exportExcel"),
                listUrl: 'app/appDriverReimburseOil',
                searchParam: {},
                creatDate:[],
            }
        },
        beforeMount: function () {//载入前
        },
        activated(){
            this.getList();
        },
        mounted: function () {//载入后
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.creatDate = [startTime,endTime];
                this.searchParam.startTime = startTime;
                this.searchParam.endTime = endTime;
            }

            var reimburseStatus = this.$route.query.reimburseStatus;
            if(reimburseStatus){
                this.searchParam.reimburseStatus = parseInt(reimburseStatus);
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            resetList(){
                this.searchParam={};
                this.creatDate=[];
                this.getList();
            },
            creatDateChange() {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0];
                    this.searchParam.endTime = creatDate[1];
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            detail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
            exportExcel() {
                var params=this.searchParam;
                window.location.href = this.exportUrl("app/appDriverReimburseOil/excel?" + $.param(params));
            }
        }
    }
</script>

