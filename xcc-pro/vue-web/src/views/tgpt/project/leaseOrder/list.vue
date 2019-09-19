<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable autocomplete="off" placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">订单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" clearable autocomplete="off" placeholder="请输入订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供车单位</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.providerCompanyName" clearable autocomplete="off" placeholder="请输入服务客户"></el-input>
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
                        <el-select v-model="searchParam.orderStatus" placeholder="请选择">
                            <el-option label="待调度" value="10"></el-option>
                            <el-option label="出车中" value="60"></el-option>
                            <el-option label="已到期" value="80"></el-option>
                            <el-option label="已完成" value="70"></el-option>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%" >
                <el-table-column prop="orderNumber" sortable label="订单编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.orderNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
                <el-table-column prop="providerCompanyName" sortable label="供车单位" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="useCarCityName" sortable label="用车城市" min-width="100"></el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="useCarStartDate" sortable label="用车开始日期" min-width="140"></el-table-column>
                <el-table-column prop="useCarEndDate" sortable label="用车结束日期" min-width="140"></el-table-column>
                <el-table-column prop="isNeedDriverText" sortable label="用车类型" min-width="120"></el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <el-table-column prop="driver" sortable label="司机" min-width="120"></el-table-column>
                <el-table-column prop="orderStatusText" sortable label="订单状态" min-width="100"></el-table-column>
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
        name: 'leaseOrder',
        mixins: [tool],
        components: {TreeSelect },
        data(){
            return {
                showSearch:false,
                organization:[],
                showExportBtn : this.getCurrentUserAuthority("core/leaseOrder/export"),
                defaultOrderStatus: '',
                listUrl : "core/leaseOrder/list",
                startDate:[],
                endDate:[],
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
            },
            exportExcel(){
                window.location.href=this.exportUrl("core/leaseOrder/export?"+$.param(this.searchParam));
            },
            resetList(){
                this.searchParam={};
                this.startDate=[];
                this.endDate=[];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

