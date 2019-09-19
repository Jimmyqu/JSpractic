<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class=" search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">调拨申请单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" clearable type="text" placeholder="请输入调拨申请单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable type="text" placeholder="请输入车牌号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">出发城市</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.departureCityName" clearable type="text" placeholder="请输入出发城市"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">到达城市</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.arrivalCityName" clearable type="text" placeholder="请输入到达城市"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">调度前组织</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.beforeCompanyName" clearable type="text" placeholder="请输入调度前所属组织"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">调度后组织</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.afterCompanyName" clearable type="text" placeholder="请输入调度后所属组织"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">出车时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="transferDate"
                            @change="transferDateChange"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.processStatus" placeholder="请选择状态" clearable>
                            <el-option label="待出车" value="10"></el-option>
                            <el-option label="待接车" value="20"></el-option>
                            <el-option label="完成" value="30"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <div class="row tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button type="small" @click="resetList()" size="mini">重置</el-button>
                <el-button size="mini" @click="exportExcel()" v-show="exportQx">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%">
                <el-table-column fixed label="操作" min-width="120">
                    <template slot-scope="scope">
                        <el-button @click="out(scope.row.id)" type="text" size="small" v-if="scope.row.processStatus == 10" v-show="outQx">出车</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="code" sortable fixed label="调拨单号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="plate" sortable label="车辆" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="modelInfoName" sortable label="车型" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="departureCityName" sortable label="出发城市" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="beforeCompanyName" sortable label="调度前组织" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="arrivalCityName" sortable label="到达城市" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="afterCompanyName" sortable label="调度后组织" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="estimatedCost" sortable label="预计费用(元)" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="transferTime" sortable label="预计调拨时间" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column prop="outsetTime" sortable label="出车时间" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column prop="processStatusText" sortable label="状态" show-overflow-tooltip min-width="120"></el-table-column>
                </el-table>

        </div>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficProcessOut',
        mixins: [tool],
        components: { ConfirmForm },
        data() {
            return{
                showSearch:false,
                outQx: this.getCurrentUserAuthority("core/process/out"),
                exportQx: this.getCurrentUserAuthority("core/process/out/export"),
                listUrl:"core/process/out/list",
                outFormData:{},
                transferDate:[]
            }
        },
        mounted: function() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        activated: function () {
            this.getList();
        },
        methods: {
            //出车
            out(id){
                this.$router.push({path:"/tgpt/traffic/processOut/out",query:{id:id}});
            },
            transferDateChange() {
                if(this.transferDate && this.transferDate.length>0){
                    let createDate = this.transferDate;
                    this.searchParam.startDate = createDate[0] + ' 00:00:00';
                    this.searchParam.endDate = createDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startDate="";
                    this.searchParam.endDate="";
                }
            },
            //导出
            exportExcel() {

                window.location = this.exportUrl("core/process/out/export?" + $.param(this.searchParam));
            },
            resetList(){
                this.transferDate=[];
                this.searchParam={};
                this.handleCurrentChange(1);
            }
        }

    }
</script>

