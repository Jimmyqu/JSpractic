<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算方式</label>
                    <div class="input-group">
                        <el-select placeholder="请输入结算方式" clearable v-model="searchParam.settlementModel">
                            <el-option v-for="item in settlementModelList" :key="item.value" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">付款方式</label>
                    <div class="input-group">
                        <el-select placeholder="请选择项目编号" clearable v-model="searchParam.paymentModel">
                            <el-option v-for="item in paymentModelList" :key="item.value" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">项目合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable autocomplete="off" placeholder="请输入项目合同编号"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
        </div>

        <div class="table-box">
            <el-table v-loading="listLoading":data="list" style="width: 100%" border>
                <el-table-column prop="contractNo" fixed sortable label="项目合同编号" min-width="220">
                    <template slot-scope="scope">
                        <template v-if="detailBtnShow">
                            <a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNo}}</a>
                        </template>
                        <template v-else>{{scope.row.contractNo}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="150"></el-table-column>
                <el-table-column prop="contractStartDate" sortable label="协议开始日期" min-width="120"></el-table-column>
                <el-table-column prop="contractEndDate" sortable label="协议结束日期" min-width="120"></el-table-column>
                <el-table-column prop="termsStatus" sortable label="条款状态" min-width="120"></el-table-column>
                <el-table-column prop="approvalStatusText" sortable label="审批状态" min-width="120"></el-table-column>
                <el-table-column prop="settlementModel" sortable label="结算方式" min-width="100"></el-table-column>
                <el-table-column prop="settlementDate" sortable label="结算日(日)" min-width="100"></el-table-column>
                <el-table-column prop="paymentModel" sortable label="付款方式" min-width="120"></el-table-column>
                <el-table-column prop="paymentCycle" sortable label="付款周期(日)" min-width="120"></el-table-column>
                <el-table-column prop="creditLimit" sortable label="信用额度(元)" min-width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.creditLimit=='/'?'/':numberFormat(scope.row.creditLimit)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="invoiceTaxRateDriver" sortable label="税金(司机)" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.invoiceTaxRateDriver}}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="invoiceTaxRateVehicle" sortable label="税金(车)" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.invoiceTaxRateVehicle}}%</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creater" sortable label="录入人" min-width="120"></el-table-column>
                <el-table-column prop="createTime" sortable label="录入时间" min-width="150"></el-table-column>
            </el-table>
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
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'projectTermStatus',
        mixins: [tool],
        components: {  },

        data(){
            return {
                showSearch: false,
                detailBtnShow: this.getCurrentUserAuthority("projectterms/detailcurrent"),
                exportBtnShow: this.getCurrentUserAuthority("projectterms/exportcurrent"),
                settlementModelList:[],
                paymentModelList:[],
                listUrl:"core/projectterms/currentlist",
            }
        },
        activated(){
            this.getList();
        },
        mounted(){
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getSettlementModelList();
            this.getpaymentModelList();
        },
        methods:{
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
            exportExcel(){
                var param=""
                for(var p in this.searchParam){
                    param+=p+"="+this.searchParam[p]+"&";
                }
                window.location.href=this.exportUrl("core/projectterms/exportcurrent?"+param.substr(0,param.length-1));
            },
            getSettlementModelList(){
                ajax.get("admin/dict/type/付款方式").then(res =>{
                    this.paymentModelList = res;
                });
            },
            getpaymentModelList(){
                ajax.get("admin/dict/type/结算方式").then(res =>{
                    this.settlementModelList = res;
                });
            }
        }

    }
</script>

