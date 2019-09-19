<template>
    <div class="page-common wrapper-content workbench" :class="{'hide':!show}" v-cloak>
        <div class="top-title">
            <div class="top-title-left">
                {{detailedTime}}
            </div>
            <div class="top-title-center">
                数据空间站
                <span class="refresh-box"  @click="init()" ><i class="refresh el-icon-refresh" :class="{'active':reload}"></i>刷新</span>
                <span class="text" @click="close()">进入菜单</span>
            </div>
            <div class="top-title-right">
                <span class="refresh-box" @click="init()" ><i class="el-icon-refresh refresh" :class="{'active':reload}" ></i>刷新</span>
                <span class="text" @click="close()">进入菜单</span>
            </div>
        </div>
        <div class="content">
            <div class="left-box">
                <div class="box1 box-common">
                    <div class="title" v-if="getCurrentUserAuthority('base/workbench/business/vehicleServiceStatistics')">车辆服役状态</div>
                    <div class="chart-list hide-scrollbar" v-if="getCurrentUserAuthority('base/workbench/business/vehicleServiceStatistics')">
                        <div class="chart-box public-chart-box" id="chart1"></div>
                        <div class="line"></div>
                        <div class="chart-box public-chart-box" id="chart2"></div>
                        <div class="line"></div>
                        <div class="chart-box public-chart-box" id="chart3"></div>
                    </div>
                    <div class="no-data no-data-bj hide-scrollbar" v-if="!getCurrentUserAuthority('base/workbench/business/vehicleServiceStatistics')">
                        <div class="plate"></div>
                        <p class="mini">丰富的功能模块，可配置、可定制，满足不同</p>
                        <div class="sys"></div>
                        <div class="characteristic"></div>
                        <p>个性化车辆违章查询</p>
                        <p>智能车辆调度</p>
                        <p>个性化业务审批流配置</p>
                        <p>多维度电子栅栏设置</p>
                        <p>司机培训…..</p>
                    </div>
                </div>
            </div>
            <div class="middle-box middle-box-hide">
                <div class="box-common-border middle-box-1">
                    <div class="num-box box-common">
                        <div class="item" v-if="getCurrentUserAuthority('base/workbench/vehicleOperateStatistics')">
                            <div class="item-title">
                                <i class="car1-icon car-icon-common"></i>
                                <span style="color:rgba(128,207,252,1);">总数车辆</span>
                            </div>
                            <num-change style="color:rgba(128,207,252,1)" :value="vehicleRunStatistics.total"
                                        @click.native="toDetail('/tgpt_v2/obd/vehicleLocation')"></num-change>
                        </div>
                        <div class="item" v-if="getCurrentUserAuthority('base/workbench/vehicleOperateStatistics')">
                            <div class="item-title">
                                <i class="car2-icon car-icon-common"></i>
                                <span style="color:rgba(128,252,197,1);">运行车辆</span>
                            </div>
                            <num-change style="color:rgba(128,252,197,1);" :value="vehicleRunStatistics.running"
                                        @click.native="toDetail('/tgpt_v2/obd/vehicleLocation?runStatus=1')"></num-change>
                        </div>
                        <div class="item" v-if="getCurrentUserAuthority('base/workbench/vehicleOperateStatistics')">
                            <div class="item-title">
                                <i class="car3-icon car-icon-common"></i>
                                <span style="color:rgba(255,86,86,1);">停止车辆</span>
                            </div>
                            <num-change style="color:rgba(255,86,86,1);" :value="vehicleRunStatistics.stop"
                                        @click.native="toDetail('/tgpt_v2/obd/vehicleLocation?runStatus=2')"></num-change>
                        </div>
                        <div class="item" v-if="getCurrentUserAuthority('base/workbench/vehicleOperateStatistics')">
                            <div class="item-title">
                                <i class="car4-icon car-icon-common"></i>
                                <span style="color:rgba(153,153,153,1);">离线车辆</span>
                            </div>
                            <num-change style="color:rgba(153,153,153,1);" :value="vehicleRunStatistics.offline"
                                @click.native="toDetail('/tgpt_v2/obd/vehicleLocation?runStatus=3')"></num-change>
                        </div>
                    </div>
                </div>
                <div class="box-common-border middle-box-2">
                    <div class="box3 box-common">
                       <div v-if="getCurrentUserAuthority('base/workbench/vehicleOperateStatistics')" id="publicWorkbenchMap" style="height: 100%" element-loading-background="rgba(255, 255, 255, 0.6)"></div>
                    </div>
                </div>
            </div>
            <div class="right-box box-common-border">
                <div class="box-common">
                    <div class=" box5 hide-scrollbar" v-if="getCurrentUserAuthority('base/workbench/trafficStatisticsOther')||getCurrentUserAuthority('base/workbench/alert')">
                        <div class="title" v-if="getCurrentUserAuthority('base/workbench/alert')">提醒</div>
                        <div class="list" v-if="getCurrentUserAuthority('base/workbench/alert')">
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/alarm/poweroff?checkResult=1')">断电</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.powerOffAlarmNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/se/backout?dealStatus=1')">拆机</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.backOutNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/alarm/lowvoltage?alarmStatus=1')">低电压</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.lowVoltageAlarmNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/alarm/timeLimit?dealerStatus=0')">时间栅栏</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.timeLimitAlarmNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/alarm/areaLimit?dealerStatus=0')">区域栅栏</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.areaLimitAlarmNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/alarm/electricfence?dealerStatus=0')">电子栅栏</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.electricFenceAlarmNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/alarm/parkingfence?dealerStatus=0')">停车栅栏</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.parkingFenceAlarmNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt/traffic/annual?inspectionStatus=3')">年检到期</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.annualInspectionExpireNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt/traffic/insuranceBill?billStatus=20')">保险到期</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.insuranceBillExpireNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt_v2/base/passValid?dealStatus=0')">通行证到期</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.passValidNum}}</span>
                            </div>
                            <div class="item">
                                <span><el-button type="text" @click="toDetail('/tgpt/todoFlow')">待审批</el-button></span>
                                <span style="padding-left:20px;text-align: center;">{{alertData.taskListNum}}</span>
                            </div>
                        </div>
                        <div class="line" v-if="getCurrentUserAuthority('base/workbench/trafficStatisticsOther') && getCurrentUserAuthority('base/workbench/alert')"></div>
                        <div class="title">本月车务统计</div>
                        <div class="list">
                            <div class="item" v-for="(bean,i) in list" :key="i">
                                <template v-if="bean.type!=2">
                                    <span><el-button type="text" @click="toTrafficDetail(bean)">{{bean.typeName}}</el-button></span>
                                    <span style="padding-left:20px">{{bean.totalCount}}次</span>
                                    <span>{{bean.cost}}万元</span>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-if="!getCurrentUserAuthority('base/workbench/trafficStatisticsOther') && !getCurrentUserAuthority('base/workbench/alert')">
                        <div class="no-data-img"></div>
                        <p>暂无数据</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import { mapGetters } from 'vuex'
    import NumChange from '@/components/NumChange/index'

    export default {
        mixins: [tool],
        components:{ NumChange },
        data() {
            return {
                timer:{},
                timer2:{},
                isInit:false,
                reload:false,
                show:false,
                list:[],
                vehicleRunStatistics:{},
                vehicleStatistics:{},
                alertData:{},
                detailedTime:new Date().format('yyyy-MM-dd hh:mm w'),
                map:null,
                mapLoading:false,
                chartDataName:{
                    status101:'配驾',
                    status102:'退租',
                    status103:'以租代购',
                    status104:'会员租车',
                    status105:'已出售',
                    status106:'散租',
                    status107:'备用',
                    status108:'其他',
                    status109:'自驾',
                    status110:'中汽专车',
                    status111:'待租',
                    status112:'待处置',
                    status113:'公务用车',
                    status114:'报废',
                    status115:'拍卖',
                    status116:'闲置',
                    status117:'长租',
                    status118:'短租',
                    status119:'公务车',
                    status120:'班车',
                    status121:'承包',
                }
            }
        },
        computed: {
            ...mapGetters([
                'hasWorkbench'
            ]),
        },
        methods: {
            //合同数量
            getLineChartData(){
                var $this=this;
                if(!$this.getCurrentUserAuthority("base/workbench/trafficContractStatistics")){
                    return;
                }
                ajax.get("base/workbench/trafficContractStatistics").then(res =>{
                    if($this.checkResponse(res)) {
                        const data = [];
                        for (let i=0;i<res.data.length;i++) {
                            data.push([res.data[i]['月份'],res.data[i]['以租代购'],res.data[i]['直租'],res.data[i]['挂靠'],res.data[i]['内部指派'],res.data[i]['短租'],res.data[i]['租牌'],res.data[i]['长包']])
                        }
                        console.log(data);
                        var myChart=echarts.init(document.getElementById('chart4'));
                        myChart.setOption($this.getLineChartOpt(data));
                        myChart.on('click', function(param){
                            let month=param.name; //柱子的月份 yyyy-MM
                            let index=param.seriesIndex;//柱子的索引，0-新增,1-续签,2-退出
                            if(month!=null && index!=null && typeof(month) !='undefined' && typeof(index) !='undefined'){
                                $this.$router.push({path:'/tgpt_v2/traffic/contract?month='+month+'&index='+index});
                                $this.close();
                            }
                        });
                        window.onresize = function(){
                            myChart.resize(); //自动调整图表位置
                        }
                    }
                });
            },
            setChartData(obj){
                let chartData = [];
                for(let key in obj){
                    if(key!='total' && obj[key]){
                        chartData.push({
                            value:obj[key],
                            name:this.chartDataName[key],
                            icon: 'circle'
                        })
                    }
                }
                if(!chartData.length){
                    chartData.push({
                        value:0,
                        name:'配驾',
                        icon: 'circle'
                    })
                }
                return chartData;
            },
            //车辆服役状态
            getPieChartData(){
                if(!this.getCurrentUserAuthority("base/workbench/business/vehicleServiceStatistics")){
                    return;
                }
                ajax.get("base/workbench/business/vehicleServiceStatistics").then(res =>{
                    if(this.checkResponse(res)) {
                        let textData = [{value:res.data.self.total,name:"自有"}];
                        echarts.init(document.getElementById('chart1')).setOption(this.getPikChartOpt(this.setChartData(res.data.self),textData));
                        
                        textData = [{value:res.data.personal.total,name:"个人"}];
                        echarts.init(document.getElementById('chart2')).setOption(this.getPikChartOpt(this.setChartData(res.data.personal),textData));
                        
                        textData = [{value:res.data.hangup.total,name:"挂靠"}];
                        echarts.init(document.getElementById('chart3')).setOption(this.getPikChartOpt(this.setChartData(res.data.hangup),textData));
                    }
                });
            },
            //提醒统计
            getAlert(){
                if(!this.getCurrentUserAuthority("base/workbench/alert")){
                    return;
                }
                ajax.get("base/workbench/alert").then(res =>{
                    if(this.checkResponse(res)) {
                        this.alertData = res.data;
                    }
                });
            },
            //车辆运行状态
            getVehicleRunStatistics(){
                if(!this.getCurrentUserAuthority("base/workbench/vehicleOperateStatistics")){
                    return;
                }
                ajax.get("base/workbench/vehicleOperateStatistics").then(res =>{
                    if(this.checkResponse(res)) {
                        this.vehicleRunStatistics = res.data;
                    }
                });
            },
            //车务本月统计接口
            getList(){
                if(!this.getCurrentUserAuthority("base/workbench/trafficStatisticsOther")){
                    return;
                }
                ajax.get("/base/workbench/trafficStatisticsOther").then(res =>{
                    if(this.checkResponse(res)) {
                        this.list = res.data;
                    }
                });
            },
            // 获取饼图配置
            getPikChartOpt(data,textData){
                return {
                    // 全局调色盘。
                    color: ['rgba(42, 205, 255, 0.9)','rgba(255, 86, 86, 0.9)', 'rgba(255, 157, 0, 0.9)', 'rgba(176, 140, 255, 0.9)', 'rgba(128, 252, 197, 0.9)','rgba(61, 114, 186, 0.9)',  'rgba(157, 203, 95, 0.9)', 'rgba(153, 153, 153, 0.9)','rgba(255,228,181, 0.9)', 'rgba(225,255,255, 0.9)', '#c4ccd3'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    borderColor:'#fff',
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        x: 'right',
                        y: 'center',
                        align:'left',
                        top: 20,
                        itemWidth: 10,
                        itemHeight:10,
                        data:data,
                        textStyle: {
                            color: "#fff",
                            padding: [0,0]
                        }
                    },
                    series: [
                        // {

                        //     type:'pie',
                        //     selectedMode: 'single',
                        //     hoverAnimation: false,
                        //     selectedOffset:0,
                        //     radius: ['49%', '50%'],
                        //     center: ['40%', '55%'],
                        //     color: ['#319BC2'],
                        //     labelLine: {
                        //         normal: {
                        //             show: false
                        //         }
                        //     },
                        //     data:[
                        //         {value:0, name:''}
                        //     ]
                        // },
                        {

                            type:'pie',
                            hoverAnimation: false,
                            selectedMode: 'single',
                            selectedOffset:0,
                            radius: ['30%', '30%'],
                            center: ['40%', '55%'],
                            color: ['#ffffff'],
                            label: {
                                normal: {
                                    formatter: '{b|{b}}\n{c}\n辆',
                                    position : 'center',
                                    rich: {
                                        b: {
                                            fontSize: 12,
                                            lineHeight: 38,
                                        },
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:textData
                        },
                        {
                            type:'pie',
                            radius: ['35%', '55%'],
                            center: ['40%', '55%'],
                            avoidLabelOverlap: true,
                            label: {
                                normal: {
                                    formatter: '{c} 辆',
                                    padding:[4, -40, 12, -40],
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    borderWidth: 1,
                                    length: 10,
                                    length2: 40,

                                }
                            },
                            itemStyle:{
                                borderWidth:1, //设置border的宽度有多大
                            },
                            data:data
                        }
                    ]
                };
            },
            // 获取线图配置
            getLineChartOpt(data){
                return {
                    legend: {
                        type: "plain",
                        right: 20,
                        top: 0,
                        itemWidth: 10,
                        itemHeight:10,
                        icon: 'circle',
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    grid:{
                        bottom:40,
                        top:50
                    },
                    tooltip: {
                        formatter: function(param){
                            return param.marker+param.seriesName+": "+param.value[param.seriesIndex+1];
                        }
                    },
                    color: ['rgba(42, 205, 255, 0.9)','rgba(255, 86, 86, 0.9)', 'rgba(255, 157, 0, 0.9)', 'rgba(176, 140, 255, 0.9)', 'rgba(128, 252, 197, 0.9)','rgba(61, 114, 186, 0.9)',  'rgba(157, 203, 95, 0.9)', 'rgba(153, 153, 153, 0.9)','#6e7074', '#546570', '#c4ccd3'],
                    dataset: {
                        source: [
                            ['month', '以租代购', '直租', '挂靠', '内部指派', '短租', '租牌', '长包']
                        ].concat(data)
                    },
                    xAxis: {
                        type: 'category',
                        name:'',
                        nameLocation: 'end',
                        //坐标轴轴线相关设置
                        axisLine: {
                            show: true,
                            lineStyle:{
                                color:'rgba(255,255,255,0.5)',
                            }
                        },
                        //坐标轴刻度标签的相关设置
                        axisLabel: {
                            show: true,
                            color:"#fff"
                        },
                        //坐标轴在 grid 区域中的分隔线
                        splitLine:{
                            show: false
                        },
                        //坐标轴刻度相关设置。
                        axisTick: {
                            show: false
                        },
                        nameTextStyle:{
                            color: "#fff",
                        }
                    },
                    yAxis: {
                        name:'',
                        nameLocation: 'end',
                        nameGap: 5,
                        axisLine: {
                            show: true,
                            lineStyle:{
                                color:'rgba(255,255,255,0.5)',
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            color: "#fff",
                        },
                        splitLine:{
                            show: false,
                        },
                        splitNumber:4,
                        nameTextStyle:{
                            color: "#fff",
                            padding: [0, 0, -12, 50],
                        },

                    },
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        },
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        },
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        },
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        },
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        },
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        },
                        {
                            type: 'bar',
                            barMinHeight: 1,
                            itemStyle: {
                                barBorderRadius:[10, 10, 0, 0]
                            }
                        }
                    ]
                };
            },
            toTrafficDetail(row){
                console.log(row);
                let url = "";
                let startDate = this.getCurrentMonthFirst();
                console.log(startDate);
                let endDate  = this.getCurrentMonthLast();
                console.log(endDate);
                switch (row.type){
                    case "1": url= "/tgpt_v2/traffic/refuelingRegistration?startTime="+startDate+"&endTime="+endDate;break;
                    /*case "2": url= "/tgpt/traffic/clean?reimburseStatus=3&startTime="+startDate+"&endTime="+endDate;break;*/
                    case "3": url= "/tgpt/traffic/maintainCw?startTime="+startDate+"&endTime="+endDate;break;
                    case "4": url= "/tgpt/traffic/insuranceBill?startTime="+startDate+"&endTime="+endDate;break;
                    case "5": url= "/tgpt/traffic/accident?billStatus=50&startTime="+startDate+"&endTime="+endDate;break;
                    case "6": url= "/tgpt/traffic/violationRecord?startTime="+startDate+"&endTime="+endDate;break;
                    case "7": url= "/tgpt/traffic/annual?startTime="+startDate+"&endTime="+endDate;break;
                    case "8": url= "/tgpt_v2/traffic/repairCw?startTime="+startDate+"&endTime="+endDate;break;
                    default: url = "";break;
                }

                if (url){
                   this.toDetail(url);
                }
            },
            toDisposalVehicle(url){
                this.$router.push(url);
            },

             getCurrentMonthFirst() {
                 var date = new Date();
                 date.setDate(1);
                 var month_first = this.formatDate(date);
                 return month_first;
             },
            getCurrentMonth(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;//月份是从0开始的
                if (month < 10) {
                    month = '0' + month
                };
                var newTime = year + '-' +
                    month;
                return newTime;
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
                var newTime = year + '-' +
                    month + '-' +
                    day;
                return newTime;
            },
            getCurrentMonthLast(){
                var date=new Date();
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
            getVehicleList(){
                this.mapLoading = true;
                ajax.get('obd/obdVehicleStatus/findVehicleListLocation').then(rs => {
                    if(rs.status == 0){
                        this.mapLoading = false;
                        this.markInfo(rs.data);
                    }else{
                        this.mapLoading = false;
                    }
                },err=>{
                    this.mapLoading = false;
                })
            },
            /*标注信息*/
            markInfo(currentVehicleTrackList){
                this.ss(currentVehicleTrackList)
            },
            ss(markerArr){//markerArr数据库数据查询的结果
                var iconSize = new BMap.Size(24, 29);
                try {
                    var markers = [];
                    this.mCr.clearMarkers();
                    var pt = null;
                    var i = 0;
                    for (var i = 0; i < markerArr.length; i++) {
                        let  currentVehicleTrack = markerArr[i];
                        let vehicleStatus = currentVehicleTrack.vehicleStatus;
                        let icon;
                        if (vehicleStatus == 1) {
                            icon = new BMap.Icon("/static/img/map_images/run_car.png", iconSize);
                        }
                        else if (vehicleStatus == 2) {
                            icon = new BMap.Icon("/static/img/map_images/stop_car.png", iconSize);
                        }
                        else {
                            icon = new BMap.Icon("/static/img/map_images/offline_car.png", iconSize);
                        }
                        let new_point = new BMap.Point(currentVehicleTrack.corlong , currentVehicleTrack.corlat);
                        let marker = new BMap.Marker(new_point);  // 创建标注
                        marker.setIcon(icon);//图标
                        marker.addEventListener("click", ()=>{
                            this.openInfoWindow(currentVehicleTrack);
                        });
                        markers.push(marker);
                    }
                    var st = [
                            {url: "/static/img/m0.png", size:new BMap.Size(53, 53)},
                            {url: "/static/img/m1.png", size:new BMap.Size(56, 56)},
                            {url: "/static/img/m2.png", size:new BMap.Size(66, 66)},
                            {url: "/static/img/m3.png", size:new BMap.Size(78, 78)},
                            {url: "/static/img/m4.png", size:new BMap.Size(90, 90)}
                    ];
                    this.mCr = new BMapLib.MarkerClusterer(this.map, {markers:markers,styles:st,maxZoom: 16});
                    var TextIconOverlay = new BMapLib.TextIconOverlay();
                } catch (error) {
                    console.log(error)
                }
            },
            /*视图地图定位*/
            addPoint(item,flag){
                if(!item.corlong || !item.corlat){
                    return;
                }
                let pt = new BMap.Point(item.corlong ,item.corlat);
                this.map.panTo(pt);
            },
            /*打开信息框*/
            openInfoWindow(currentVehicleTrack){
                const $this = this;
                ajax.get('obd/obdVehicleStatus/locationDetail',{imei:currentVehicleTrack.imei}).then(locationDetail => {
                    if(locationDetail.status == 0){
                        if(!locationDetail.data.corlong || !locationDetail.data.corlat){
                            this.$message.warning("未获取到车辆定位信息！");
                            return;
                        }
                        if(locationDetail.data.corlong < 1 && locationDetail.data.corlat < 1){
                            this.$message.warning("未获取到车辆定位信息！");
                            return;
                        }
                        /*根据经纬度获取车辆定位地址*/
                        let geoc = new BMap.Geocoder();
                        let pt = new BMap.Point(currentVehicleTrack.corlong,currentVehicleTrack.corlat);
                        geoc.getLocation(pt, rs => {
                            locationDetail.data.localtion = rs.address;
                            let vehicleStatus = locationDetail.data.vehicleStatus;
                            var opts = {
                                width: 355,     // 信息窗口宽度
                                height: 270,     // 信息窗口高度
                                enableMessage: false,
                                offset: new BMap.Size(0, -20)
                            }
                            //创建弹出框信息
                            var content;
                            var gpsdrct;
                            var direction = locationDetail.data.direction;
                            if (direction != null && direction != undefined) {
                                if (direction >= 337.5 || direction < 22.5) {
                                    gpsdrct = "向北";
                                }
                                else if (direction >= 22.5 && direction < 67.5) {
                                    gpsdrct = "东北";
                                }
                                else if (direction >= 67.5 && direction < 112.5) {
                                    gpsdrct = "向东";
                                }
                                else if (direction >= 112.5 && direction < 157.5) {
                                    gpsdrct = "东南";
                                }
                                else if (direction >= 157.5 && direction < 202.5) {
                                    gpsdrct = "向南";
                                }
                                else if (direction >= 202.5 && direction < 247.5) {
                                    gpsdrct = "西南";
                                }
                                else if (direction >= 247.5 && direction < 292.5) {
                                    gpsdrct = "向西";
                                }
                                else if (direction >= 292.5 && direction < 337.5) {
                                    gpsdrct = "西北";
                                }
                            }
                            //设置地图弹出框内容
                            var status = "";
        
                            if (vehicleStatus == 1 && this.activeName==1) {
                                status = "运行";
                                if(locationDetail.data.speed && locationDetail.data.speed > 0){
                                    status = '运行';
                                }else{
                                    status = '运行/怠速';
                                }
                            }else if (vehicleStatus == 2 && this.activeName==1) {
                                status = "停止";
                            }else if ( this.activeName==1) {
                                status = "离线";
                            }else if (vehicleStatus == 1 && this.activeName!=1) {
                                status = "在线";
                            }else if (vehicleStatus == 2 && this.activeName!=1) {
                                status = "休眠";
                            }else{
                                status = "故障";
                            }
                            var accText = ''
                            if(locationDetail.data.acc == 1){
                                accText = '开启'
                            }else{
                                accText = '关闭'

                            }
                            var content = "<p style='font-weight:bold;text-align:left '>车牌：" + locationDetail.data.plate+ " <span style=' float:right; _position:relative;'>ACC状态：" +  accText + "&nbsp;&nbsp;&nbsp;</span></p>";
                            content += "<p style='text-align:left '>部门：" + locationDetail.data.companyName + "<span style=' float:right; _position:relative;'>航向：" + gpsdrct + "&nbsp;&nbsp;&nbsp;</span> </p>";
                            content += "<p>状态：" + status  + " <span style=' float:right; _position:relative;'>车速：" +  locationDetail.data.speed + " km/h  &nbsp;&nbsp;&nbsp;</span></p>";
                            content += "<p>总里程：" + (locationDetail.data.totalMileage?(locationDetail.data.totalMileage*1/1000).toFixed(2):0) + " km</p>";
                            content += "<p>车辆运行时间：" + locationDetail.data.startTime + "</p>";
                            content += "<p>停止时间："+ locationDetail.data.localtionTime + "</p>";
                            if ( locationDetail.data.localtion == null ||  locationDetail.data.localtion == undefined) {
                                content += "<p>位置：未解析地址</p></div>";
                            }
                            else {
                                content += "<p>位置：" + locationDetail.data.localtion + "</p>";
                            }
                            var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                            this.map.openInfoWindow(infoWindow, pt);
                        });
                    }else{
                        this.$message.warning("未获取到车辆定位信息！");
                        return;
                    }
                })
            },
            toDetail(path){
                this.$router.push({path:path});
                this.close();
            },
            close(){
                if(!this.hasWorkbench){
                    this.$store.dispatch('setHasWorkbench',true);
                    sessionStorage.hasWorkbench = true
                }
                this.show = false;
                document.body.style.overflow = "";
                window.clearInterval(this.timer);
                window.clearInterval(this.timer2);
            },
            open(){
                this.timer = window.setInterval(this.getAlert, 60*1000);
                this.timer2 = window.setInterval(this.getVehicleRunStatistics, 30*1000);
                document.body.style.overflow = "hidden";
                this.show = true;
                if(this.isInit) {
                    return;
                }
                this.isInit = true;
                this.init();
            },
            init() {
                this.reload = true;
                window.setTimeout(_=>{
                    this.reload = false
                },2000);
                    // this.getLineChartData();
                this.getPieChartData();
                this.getAlert();
                this.getVehicleRunStatistics();
                this.getList();
                this.$nextTick(()=>{
                    this.initialize();
                })
                window.setInterval(() => {
                    let date = new Date();
                    this.detailedTime = date.format('yyyy-MM-dd hh:mm w');
                }, 10 * 1000);
            },
            initialize(echarts){
                this.map = new BMap.Map('publicWorkbenchMap');
                this.map.centerAndZoom("武汉", 5);
                this.map.enableScrollWheelZoom(true);
                this.mCr = new BMapLib.MarkerClusterer(this.map);
                this.getVehicleList();
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "src/styles/workbench.scss"
</style>
