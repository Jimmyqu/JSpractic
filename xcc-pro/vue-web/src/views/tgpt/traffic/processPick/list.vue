<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
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
                    <label class="control-label">接车时间</label>
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
        <div class="tool-box">
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
                       <!-- <el-button @click="arrival(scope.row.id)" type="text" size="small" v-if="scope.row.processStatus == 20 || scope.row.processStatus == 30">到达</el-button>-->
                        <el-button v-show="pickQx" @click="pick(scope.row.id)" type="text" size="small" v-if="scope.row.processStatus == 20">接车</el-button>
                        <!--<el-button @click="complete(scope.row.id)" type="text" size="small" v-if="scope.row.processStatus == 40">完成</el-button>-->
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
                <el-table-column prop="pickTime" sortable label="接车时间" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column prop="processStatusText" sortable label="状态" show-overflow-tooltip min-width="100"></el-table-column>
                <!--<el-table-column prop="driverPhone" sortable label="驾驶员手机号" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="outsetTime" sortable label="出车时间" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="outsetMileage" sortable label="出车里程" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="outsetOil" sortable label="出车油量" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="arrivalsTime" sortable label="到达时间" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="arrivalsMileage" sortable label="到达里程" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="arrivalsOil" sortable label="到达油量" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="processStatusText" sortable label="状态" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="fuelCosts" sortable label="加油费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="mealFee" sortable label="餐费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="roadFee" sortable label="路桥费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="laborFee" sortable label="调度人工费" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="parkingFee" sortable label="停车费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="transportationFee" sortable label="交通费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="accommodationFee" sortable label="住宿费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="towingFee" sortable label="拖车费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="insurance" sortable label="保险费" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="otherFee" sortable label="其他费用" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="totalFee" sortable label="调度总费用" show-overflow-tooltip min-width="120"></el-table-column>
         -->   </el-table>

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
        name: 'trafficProcessPick',
        mixins: [tool],
        components: { ConfirmForm },
        data(){
            return {
                showSearch:false,
                arrivalQx: this.getCurrentUserAuthority("core/process/arrival"),
                pickQx: this.getCurrentUserAuthority("core/process/pick"),
                completeQx: this.getCurrentUserAuthority("core/process/complete"),
                exportQx: this.getCurrentUserAuthority("core/process/pick/export"),
                listUrl:"core/process/pick/list",
                arrivalFormData:{},
                pickFormData:{},
                transferDate:[]
            }
        },
        activated: function () {
            this.getList();
        },
        mounted: function() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            //到达
            arrival(id){
                let url = this.$route.fullPath + '/arrival?id='+id;
                this.$router.push({path:url});
            },
            //接车
            pick(id){
                let url = this.$route.fullPath + '/arrival?id='+id;
                this.$router.push({path:url});
                /*let url = this.$route.fullPath + '/pick?id='+id;
                this.$router.push({path:url});*/
            },
            //完成
            complete(id) {
                this.$confirm('是否确认完成?')
                    .then(_ => {
                        ajax.get("core/process/complete/" + id).then(result =>{
                            this.showMessage("操作成功","success");
                            this.getList();
                        });
                    })
                    .catch(_ => {

                    });
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
                var params=this.searchParam;
                window.location.href = this.exportUrl("core/process/pick/export?" + $.param(params));
            },
            resetList(){
                this.transferDate=[];
                this.searchParam={};
                this.handleCurrentChange(1);
            }
        }
    }
</script>

