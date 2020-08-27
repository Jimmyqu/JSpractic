<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
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
                    <label class="control-label">所属部门</label>
                    <div class="input-group">
                        <tree-select v-model="originateDeptId" placeholder="所属部门" type="one" clearable
                                     url="admin/organization/tree"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select  v-model="searchParam.assetsType" placeholder="请选择" clearable>
                            <el-option  label="自有" value="1"></el-option>
                            <el-option  label="租赁" value="2"></el-option>
                            <el-option  label="挂靠" value="3"></el-option>
                            <el-option  label="个人" value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.key" placeholder="车牌、车型" clearable>
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="searchList()">查询</el-button>
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
        <div class="content" v-loading="listLoading">
            <el-tabs class="content-left" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="按车辆统计" name="1">
                    <div class="table-box">
                        <div class="table-content">
                            <el-table  :ref="getRefName" :max-height="tableHeight"  border :data="list" style="width: 100%" show-summary>
                                <el-table-column prop="plate" sortable label="车牌" min-width="100">
                                </el-table-column>
                                <el-table-column prop="assetsType" sortable label="车辆所属" min-width="100">
                                </el-table-column>
                                <el-table-column prop="region" sortable label="所属部门" min-width="200"></el-table-column>
                                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="200"></el-table-column>
                                <el-table-column prop="count" sortable label="保养次数" min-width="100"></el-table-column>
                                <el-table-column prop="oilCost" sortable label="保养总金额(元)" min-width="120"></el-table-column>
                                <el-table-column label="操作" min-width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="toDetail(scope.row.plate, null)" type="text" size="small">详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="按部门统计" name="2">
                    <div class="table-box table-box-more">
                        <div class="table-content">
                            <el-table  :ref="getRefName" :max-height="tableHeight"  border :data="list" style="width: 100%" show-summary>
                              <!--  <el-table-column label="所属公司" prop="company" sortable min-width="100">
                                </el-table-column>-->
                                <el-table-column prop="region" sortable label="所属部门" min-width="200"></el-table-column>
                                <el-table-column prop="count" sortable label="保养次数" min-width="100"></el-table-column>
                                <el-table-column prop="oilCost" sortable label="保养总金额(元)" min-width="120"></el-table-column>
                                <el-table-column label="操作" min-width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="toDetail(null, scope.row.regionId)" type="text"
                                                   size="small">详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="content-right">
                <p>保养总金额：<span class="text-red">{{oilCost}} 元</span></p>
                <div id="department-chart2"></div>
            </div>
        </div>
        <detailedListPanel ref="detailedList" @load="loadList"></detailedListPanel>
    </div>
</template>

<script>
    import echarts from "echarts";
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import { mapGetters } from 'vuex'
    import TreeSelect from '@/components/TreeSelect/index'
    import detailedListPanel from '@/views/tgpt_v2/report/maintainCwReport/detailedList'

    export default {
        name: 'maintainCwReport',
        mixins: [tool],
        components: { TreeSelect,detailedListPanel },
        data() {
            return {
                activeName: "1",
                mChart2:null,
                listUrl: 'report/maintainCwReport/byVehicleList',
                excelUrl: 'report/maintainCwReport/excel',
                showExportExcelBtn: this.getCurrentUserAuthority('maintainCwReport/exportExcel'),
                showSearch: false,
                carUseMonth: [],
                originateDeptId: [],
                oilCost: 0,
            }
        },
        computed:{
            ...mapGetters([
                'sidebar'
            ]),
            sidebar() {
                return this.$store.state.app.sidebar.opened
            },
        },
        watch:{
            sidebar(val,olval){
                setTimeout(()=>{
                    this.mChart2.resize();
                },300)
            }
        },
        mounted() {
            this.initDate();
            this.getList();
            this.$nextTick(()=>{
                this.getFuelConsumption();
            })
        },
        methods: {
            searchList(){
                this.searchParam.organizationId = this.originateDeptId[0];
                this.getList();
                this.getFuelConsumption();
            },
            initDate(){
                var date = new Date();
                var endDate = date.format('yyyy-MM');
                date.setMonth(date.getMonth() - 2);
                var startDate = date.format('yyyy-MM');
                this.carUseMonth = [startDate,endDate];
            },
            getListBefore(params) {
                if (this.carUseMonth) {
                    params.startTime = this.carUseMonth[0];
                    params.endTime = this.carUseMonth[1];
                } else {
                    params.startTime = '';
                    params.endTime = '';
                }
            },
            handleClick(){
                if(this.activeName == "2"){
                    this.listUrl = 'report/maintainCwReport/byServiceList';
                }else {
                    this.listUrl = 'report/maintainCwReport/byVehicleList';
                }
                this.getList();
            },
            toDetail(plate, regionId){
                var startTime = this.searchParam.startTime;
                var endTime = this.searchParam.endTime;
                startTime = this.formatDate(startTime);
                endTime = this.getCurrentMonthLast(endTime);
                this.$refs.detailedList.open(startTime,endTime,plate,regionId);
               /* var url = "";
                if(plate){
                    url = "/tgpt/traffic/maintainCw?startTime="+startTime+"&endTime="+endTime+"&plate="+plate;
                }
                if(regionId){
                    url = "/tgpt/traffic/maintainCw?startTime="+startTime+"&endTime="+endTime+"&regionId="+regionId;
                }
                this.$router.push({path:url});*/
            },
            getCurrentMonthFirst(date) {
                date = new Date(date);
                date.setDate(1);
                var month_first = this.formatDate(date);
                return month_first;
            },
            formatDate(time){
                var date = new Date(time);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;//月份是从0开始的
                var day = date.getDate();
                if (month < 10) {
                    month = '0' + month
                };
                if (day < 10) {
                    day = '0' + day
                };
                var newTime = year + '-' +month + '-' +day;
                return newTime;
            },
            getCurrentMonthLast(date){
                date = new Date(date);
                var currentMonth=date.getMonth();
                var nextMonth=++currentMonth;
                var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
                var oneDay=1000*60*60*24;
                var lastTime = new Date(nextMonthFirstDay-oneDay);
                var month = parseInt(lastTime.getMonth()+1);
                var day = lastTime.getDate();
                if (month < 10) {
                    month = '0' + month
                }
                if (day < 10) {
                    day = '0' + day
                }
                return date.getFullYear() + '-' + month + '-' + day;
            },
            exportExcel(){
                if(this.activeName == "2"){
                    this.excelUrl = 'report/maintainCwReport/excelService?';
                }else {
                    this.excelUrl = 'report/maintainCwReport/excel?';
                }
                var params = this.searchParam;
                if (this.carUseMonth) {
                    params.startTime = this.carUseMonth[0];
                    params.endTime = this.carUseMonth[1];
                }
                if (this.originateDeptId) {
                    params.organizationId = this.originateDeptId[0];
                }
                window.location = this.exportUrl(this.excelUrl + $.param(params));
            },
            resetList() {
                this.originateDeptId = '';
                this.searchParam = {};
                this.initDate();
                this.searchList();
                this.handleCurrentChange(1);
            },
            getFuelConsumption() {
                var $this = this;
                this.oilCost = 0;
                if (this.carUseMonth) {
                    this.searchParam.startTime = this.carUseMonth[0];
                    this.searchParam.endTime = this.carUseMonth[1];
                } else {
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
                ajax.get('report/maintainCwReport/getChartData', $this.searchParam).then(res => {
                    if(res.status == 0){
                        let data = {
                            date:[],
                            amount:[],
                            money:[],
                        };
                        var oilCost =0;
                        for (let i=0;i < res.data.length;i++) {
                            const item = res.data[i]
                            data.date.push(item.oilTime)
                            data.money.push(item.oilCost)
                            oilCost += parseFloat(item.oilCost);
                        }
                        this.oilCost = oilCost.toFixed(2);

                        this.mChart2 = echarts.init(document.getElementById("department-chart2"));

                        this.mChart2.setOption(this.getLineChartOpt(data));
                        window.onresize = () => {
                            this.mChart2.resize();
                        };
                    }
                });
            },
            getLineChartOpt(data) {
                const areaStyle = {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgba(213, 238, 246, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(213, 238, 246, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                }
                let options = {
                    backgroundColor: '#FBFBFB',
                    tooltip : {
                        trigger: 'axis',
                        formatter: "日期：{b}<br/>保养金额：{c}元"
                    },
                    grid: {
                        x: 70,  // 左
                        y: 20, // 上
                        x2: 50, // 右
                        y2: 30, //下
                        borderWidth: 1
                    },
                    calculable : true,
                    xAxis : [
                        {
                            axisLabel:{
                                interval:0,
                                rotate:data.date.length >7?60:0
                            },
                            boundaryGap : false,
                            data : data.date
                        }
                    ],
                    yAxis : [
                        {
                            splitNumber:4,
                            type : 'value',
                            axisLine:{
                                lineStyle :{
                                }
                            }
                        }
                    ],
                    series : [{
                        type:'line',
                        color:['#38B7FE'],
                        data:data.money,
                        areaStyle: areaStyle,
                        symbolSize: 4,
                    }]
                };

                return options
            },
        }
    }
</script>

<style rel="stylesheet/scss" scoped lang="scss">
    .content{
        display: flex;
        .content-left{
            width: 60%;
            border-right: 1px solid #eee;
            padding-right: 15px;
        }
        .content-right{
            width: 40%;
            padding: 15px;
            p{
                font-weight: bold;
                margin-bottom: 24px;
                .text-red{
                    color: #ff6666;
                }
                .text-green{
                    color: #008000;
                }
            }
            .register{
                padding-bottom: 24px;
                border-bottom: 1px solid #eee;
            }
            #department-chart1,#department-chart2{
                width: 100%;
                height: 200px;
                padding: 0px;
                position: relative;
                margin-top: 24px;
            }
            #department-chart1{
                padding-bottom: 40px;
                border-bottom:1px solid #eee;
            }
        }
    }
</style>
