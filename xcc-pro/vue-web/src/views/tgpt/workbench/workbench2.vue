<template>
    <div class="page-common wrapper-content workbench" :class="{'hide':!show}" v-cloak>
        <div class="top-title">
            <span class="text" @click="close()">进入菜单</span>
            <i class="text el-icon-refresh" :class="{'active':reload}" @click="init()"></i>
        </div>
        <div class="content">
            <div class="left-box">
                <div class="box1 box-common" v-if="getCurrentUserAuthority('base/workbench/vehicleServiceStatistics')">
                    <div class="title">车辆服役状态</div>
                    <div class="chart-list hide-scrollbar">
                        <div class="chart-box" id="chart1"></div>
                        <div class="line"></div>
                        <div class="chart-box" id="chart2"></div>
                        <div class="line"></div>
                        <div class="chart-box" id="chart3"></div>
                    </div>
                </div>
                <div class="box2 box-common" v-if="getCurrentUserAuthority('base/workbench/trafficStatistics')">
                    <div class="title">本月车务统计</div>
                    <div class="list hide-scrollbar">
                        <div class="item" v-for="(bean,i) in list">
                            <span>{{bean.typeName}}</span>
                            <span>{{bean.totalCount}}次</span>
                            <span>{{bean.cost}}万元</span>
                            <el-button type="text" size="mini" @click="toTrafficDetail(bean)">明细</el-button>
                        </div>

                    </div>
                </div>
            </div>
            <div class="middle-box">
                <div class="num-box" v-if="getCurrentUserAuthority('base/workbench/vehicleOperateStatistics')">
                    <div class="item">
                        <div class="item-title">
                            <i class="car1-icon car-icon-common"></i>
                            <span>总数(辆)</span>
                        </div>
                        <num-change :value="vehicleRunStatistics.total"
                                    @click.native="toDetail('/tgpt_v2/obd/vehicleLocation')"></num-change>
                    </div>
                    <div class="item">
                        <div class="item-title">
                            <i class="car2-icon car-icon-common"></i>
                            <span>运行(辆)</span>
                        </div>
                        <num-change :value="vehicleRunStatistics.running"
                                    @click.native="toDetail('/tgpt_v2/obd/vehicleLocation?runStatus=1')"></num-change>
                    </div>
                    <div class="item">
                        <div class="item-title">
                            <i class="car3-icon car-icon-common"></i>
                            <span>停止(辆)</span>
                        </div>
                        <num-change :value="vehicleRunStatistics.stop"
                                    @click.native="toDetail('/tgpt_v2/obd/vehicleLocation?runStatus=2')"></num-change>
                    </div>
                    <div class="item">
                        <div class="item-title">
                            <i class="car4-icon car-icon-common"></i>
                            <span>离线(辆)</span>
                        </div>
                        <num-change :value="vehicleRunStatistics.offline"
                                    @click.native="toDetail('/tgpt_v2/obd/vehicleLocation?runStatus=3')"></num-change>
                    </div>
                </div>
                <div class="box3 box-common" v-if="getCurrentUserAuthority('base/workbench/alert')">
                    <div class="title">提醒</div>
                    <div class="remind-box hide-scrollbar">
                        <div class="item">
                            <num-change :value="alertData.powerOffAlarmNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/poweroff?checkResult=1')"></num-change>
                            <div>断电报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.lowVoltageAlarmNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/lowvoltage?alarmStatus=1')"></num-change>
                            <div>低电压报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.timeLimitAlarmNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/timeLimit?dealerStatus=0')"></num-change>
                            <div>时间栅栏报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.areaLimitAlarmNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/areaLimit?dealerStatus=0')"></num-change>
                            <div>区域栅栏报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.electricFenceAlarmNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/electricfence?dealerStatus=0')"></num-change>
                            <div>电子栅栏报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.parkingFenceAlarmNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/parkingfence?dealerStatus=0')"></num-change>
                            <div>停车栅栏报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.illegalOperationNum" type="1"
                                        @click.native="toDetail('/tgpt_v2/alarm/operation?dealerStatus=0')"></num-change>
                            <div>非法调度报警</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.annualInspectionExpireNum" type="1"
                                        @click.native="toDetail('/tgpt/traffic/annual?inspectionStatus=3')"></num-change>
                            <div>年检到期</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.insuranceBillExpireNum" type="1"
                                        @click.native="toDetail('/tgpt/traffic/insuranceBill?billStatus=20')"></num-change>
                            <div>保险到期</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.oilCardNum" type="1"
                                        @click.native="toDetail('/tgpt/traffic/oilCard?oilCardStatus=60')"></num-change>
                            <div>加油卡到期</div>
                        </div>
                        <div class="item">
                            <num-change :value="alertData.taskListNum" type="1"
                                        @click.native="toDetail('/tgpt/todoFlow')"></num-change>
                            <div>待审批事项</div>
                        </div>
                    </div>
                </div>
                <div class="box4 box-common" v-if="getCurrentUserAuthority('base/workbench/contractQuantityStatistics')">
                    <div class="title" style="margin-left: 5%;">合同数量统计</div>
                    <div class="line-chart" id="chart4"></div>
                </div>
            </div>
            <div class="right-box">
                <div class="box5 box-common hide-scrollbar">
                    <div class="title" v-if="getCurrentUserAuthority('base/workbench/financialAccount')">财务账款</div>
                    <div class="small-box" v-if="getCurrentUserAuthority('base/workbench/financialAccount')">
                        <div class="item">
                            <div class="info">
                                <span>本月应收</span>
                                <span class="num"><a @click="toDetail('/tgpt/project/check?settlementStatus=2&startDate='+getCurrentMonth()+'&endDate='+getCurrentMonth())">{{financialAccount.receipt}}万元</a></span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="info">
                                <span>本月实收</span>
                                <span class="num"><a @click="toDetail('/tgpt/financial/companyReceipt?voucherStatus=40&startDate='+getCurrentMonthFirst()+'&endDate='+getCurrentMonthLast())">{{financialAccount.actualReceipt}}万元</a></span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="info">
                                <span>本月退款</span>
                                <span class="num"><a @click="toDetail('/tgpt/financial/companyRefund?refundStatus=40&startDate='+getCurrentMonthFirst()+'&endDate='+getCurrentMonthLast())">{{financialAccount.refund}}万元</a></span>
                            </div>
                        </div>
                    </div>
                    <div class="line" v-if="getCurrentUserAuthority('base/workbench/contractCurrentStatus')"></div>
                    <div class="title" v-if="getCurrentUserAuthority('base/workbench/contractCurrentStatus')">合同现状</div>
                    <div class="small-box small-box2" v-if="getCurrentUserAuthority('base/workbench/contractCurrentStatus')">
                        <div class="item">
                            <div class="num"><a @click="toDetail('/tgpt/project/contract?contractStatus=30')">{{contractStatus.executing}}</a></div>
                            <div>执行中</div>
                        </div>
                        <div class="item">
                            <div class="num">{{contractStatus.toExpire}}</div>
                            <div>即将到期</div>
                        </div>
                        <div class="item">
                            <div class="num"><a @click="toDetail('/tgpt/project/contract?contractStatus=40')">{{contractStatus.expired}}</a></div>
                            <div>已到期</div>
                        </div>
                    </div>
                    <div class="line" v-if="getCurrentUserAuthority('base/workbench/purchaseDisposalVehicleStatistics')"></div>
                    <div class="title" v-if="getCurrentUserAuthority('base/workbench/purchaseDisposalVehicleStatistics')">车辆采购/处置统计</div>
                    <div class="small-box small-box2 small-box3" v-if="getCurrentUserAuthority('base/workbench/purchaseDisposalVehicleStatistics')">
                        <div class="item">
                            <!-- <a @click="toDetail('/tgpt/vehicle/purchaseProcess')"></a> -->
                            <div class="num" @click="toDetail('/tgpt/vehicle/purchaseProcess?purchaseMethod=1&state=1-2')" style="cursor: pointer">{{vehicleStatistics.purchaseCount}}</div>
                            <div>待采购(辆)</div>
                        </div>
                        <div class="item">
                           <!-- <a @click="toDetail('/tgpt/vehicle/vehicleInformation?vehicleStatus=7')"></a>-->
                            <div class="num" @click="toDetail('/tgpt/vehicle/vehicleInformation?vehicleStatus=7')" style="cursor: pointer">{{vehicleStatistics.disposalCount}}</div>
                            <div>待处置(辆)</div>
                        </div>
                        <div class="item">
                            <div class="num" @click="toDetail('/tgpt/vehicle/purchaseProcess?purchaseMethod=1&state=3&startDate='+getCurrentMonthFirst()+'&endDate='+getCurrentMonthLast())" style="cursor: pointer">{{vehicleStatistics.purchasedCount}}</div>
                            <div>本月采购(辆)</div>
                            <div class="money">{{vehicleStatistics.purchasedAmount}}万元</div>
                        </div>
                        <div class="item">
                            <div class="num" @click="toDetail('/tgpt_v2/vehicleSellProcess?vehicleSellStatus=2&startDate='+getCurrentMonthFirst()+'&endDate='+getCurrentMonthLast())" style="cursor: pointer">{{vehicleStatistics.soldCount}}</div>
                            <div>本月出售(辆)</div>
                            <div class="money">{{vehicleStatistics.vehicleSellMoneySum}}万元</div>
                        </div>
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
                financialAccount:{},
                alertData:{},
                contractStatus:{}
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
                if(!$this.getCurrentUserAuthority("base/workbench/contractQuantityStatistics")){
                    return;
                }
                ajax.get("base/workbench/contractQuantityStatistics").then(res =>{
                    if($this.checkResponse(res)) {
                        const data = [];
                        for (let i=0;i<res.data.length;i++) {
                            data.push([res.data[i]['月份'],res.data[i]['新增合同'],res.data[i]['续签合同'],res.data[i]['退出合同']])
                        }
                        console.log(data);
                        var myChart=echarts.init(document.getElementById('chart4'));
                        myChart.setOption($this.getLineChartOpt(data));
                        myChart.on('click', function(param){
                            let month=param.name; //柱子的月份 yyyy-MM
                            let index=param.seriesIndex;//柱子的索引，0-新增,1-续签,2-退出
                            if(month!=null && index!=null && typeof(month) !='undefined' && typeof(index) !='undefined'){
                                $this.$router.push({path:'/tgpt/project/contract?month='+month+'&index='+index});
                                $this.close();
                            }
                        });
                        window.onresize = function(){
                            myChart.resize(); //自动调整图表位置
                        }
                    }
                });
            },
            //车辆服役状态
            getPieChartData(){
                if(!this.getCurrentUserAuthority("base/workbench/vehicleServiceStatistics")){
                    return;
                }
                ajax.get("base/workbench/vehicleServiceStatistics").then(res =>{
                    if(this.checkResponse(res)) {
                        let textData = [{value:res.data.zyMap.zy,name:"自有"}];
                        let chartData = [
                            {value:res.data.zyMap.zyczzj ,name:"长租自驾"},
                            {value:res.data.zyMap.zyczpj ,name:"长租配驾"},
                            {value:res.data.zyMap.zyszzj ,name:"散租自驾"},
                            {value:res.data.zyMap.zyszpj ,name:"散租配驾"},
                            {value:res.data.zyMap.zytdc ,name:"替代车"},
                            {value:res.data.zyMap.zygwc ,name:"公务车"},
                            {value:res.data.zyMap.zyqt ,name:"其它"},
                            {value:res.data.zyMap.zydz ,name:"待租"},
                        ];
                        echarts.init(document.getElementById('chart1')).setOption(this.getPikChartOpt(chartData,textData));
                        textData = [{value:res.data.zlMap.zl,name:"租赁"}];
                        chartData = [
                            {value:res.data.zlMap.zlczzj  ,name:"长租自驾"},
                            {value:res.data.zlMap.zlczpj ,name:"长租配驾"},
                            {value:res.data.zlMap.zlszzj ,name:"散租自驾"},
                            {value:res.data.zlMap.zlszpj ,name:"散租配驾"},
                            {value:res.data.zlMap.zltdc ,name:"替代车"},
                            {value:res.data.zlMap.zlgwc ,name:"公务车"},
                            {value:res.data.zlMap.zlqt ,name:"其它"},
                            {value:res.data.zlMap.zldz ,name:"待租"},
                        ];
                        echarts.init(document.getElementById('chart2')).setOption(this.getPikChartOpt(chartData,textData));
                        textData = [{value:res.data.gkMap.gk,name:"挂靠"}];
                        chartData = [
                            {value:res.data.gkMap.gkczzj ,name:"长租自驾"},
                            {value:res.data.gkMap.gkczpj ,name:"长租配驾"},
                            {value:res.data.gkMap.gkszzj ,name:"散租自驾"},
                            {value:res.data.gkMap.gkszpj ,name:"散租配驾"},
                            {value:res.data.gkMap.gktdc ,name:"替代车"},
                            {value:res.data.gkMap.gkgwc ,name:"公务车"},
                            {value:res.data.gkMap.gkqt ,name:"其它"},
                            {value:res.data.gkMap.gkdz ,name:"待租"},
                        ];
                        echarts.init(document.getElementById('chart3')).setOption(this.getPikChartOpt(chartData,textData));
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
            //合同现状
            getContractCurrentStatus(){
                if(!this.getCurrentUserAuthority("base/workbench/contractCurrentStatus")){
                    return;
                }
                ajax.get("base/workbench/contractCurrentStatus").then(res =>{
                    if(this.checkResponse(res)) {
                        this.contractStatus = res.data;
                    }
                });
            },
            //财务账款
            getFinancialAccount(){
                if(!this.getCurrentUserAuthority("base/workbench/financialAccount")){
                    return;
                }
                ajax.get("base/workbench/financialAccount").then(res =>{
                    if(this.checkResponse(res)) {
                        this.financialAccount = res.data;
                    }
                });
            },
            //采购/处置统计
            getVehicleStatistics(){
                if(!this.getCurrentUserAuthority("base/workbench/purchaseDisposalVehicleStatistics")){
                    return;
                }
                ajax.get("base/workbench/purchaseDisposalVehicleStatistics").then(res =>{
                    if(this.checkResponse(res)) {
                        this.vehicleStatistics = res.data;
                    }
                });
            },
            //车务本月统计接口
            getList(){
                if(!this.getCurrentUserAuthority("base/workbench/trafficStatistics")){
                    return;
                }
                ajax.get("base/workbench/trafficStatistics").then(res =>{
                    if(this.checkResponse(res)) {
                        this.list = res.data;
                    }
                });
            },
            // 获取饼图配置
            getPikChartOpt(data,textData){
                return {
                    // 全局调色盘。
                    color: ['#34b2d7','#ff5166', '#48fce9', '#ff9000', '#fed900','#749f83',  '#cbcaca', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        align:'left',
                        top: 20,
                        itemWidth: 10,
                        itemHeight:10,
                        data:[
                            {name:'长租自驾',icon: 'circle'},
                            {name:'长租配驾',icon: 'circle'},
                            {name:'散租自驾',icon: 'circle'},
                            {name:'散租配驾',icon: 'circle'},
                            {name:'替代车',icon: 'circle'},
                            {name:'公务车',icon: 'circle'},
                            {name:'其它',icon: 'circle'},
                            {name:'待租',icon: 'circle'}
                        ],
                        textStyle: {
                            color: "#fff",
                            padding: [0,5]
                        }
                    },
                    series: [
                        {

                            type:'pie',
                            selectedMode: 'single',
                            hoverAnimation: false,
                            selectedOffset:0,
                            radius: ['49%', '50%'],
                            center: ['40%', '55%'],
                            color: ['#319BC2'],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:0, name:''}
                            ]
                        },
                        {

                            type:'pie',
                            hoverAnimation: false,
                            selectedMode: 'single',
                            selectedOffset:0,
                            radius: ['29%', '30%'],
                            center: ['40%', '55%'],
                            color: ['#319BC2'],
                            label: {
                                normal: {
                                    formatter: '{b|{b}}\n{c} 辆',
                                    position : 'center',
                                    rich: {
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
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
                            radius: ['35%', '45%'],
                            center: ['40%', '55%'],
                            avoidLabelOverlap: true,
                            label: {
                                normal: {
                                    formatter: '{c} 辆',
                                    padding:[0, -40, 12, -40],

                                }

                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    borderWidth: 1,
                                    length: 20,
                                    length2: 50,

                                }
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
                    color:["#48FDEC","#35B1D7","#FF5467"],
                    dataset: {
                        source: [
                            ['month', '新增合同', '续签合同', '退出合同']
                        ].concat(data)
                    },
                    xAxis: {
                        type: 'category',
                        name:'月份',
                        nameLocation: 'end',
                        //坐标轴轴线相关设置
                        axisLine: {
                            show: false
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
                        name:'合同数',
                        nameLocation: 'end',
                        nameGap: 5,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            color: "#fff",
                        },
                        splitLine:{
                            show: false
                        },
                        nameTextStyle:{
                            color: "#fff",
                            padding: [0, 0, -12, 50],
                        }
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
                            barMinHeight: 2,
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
                    case "1": url= "/tgpt/traffic/refuel?reimburseStatus=3&startTime="+startDate+"&endTime="+endDate;break;
                    case "2": url= "/tgpt/traffic/clean?reimburseStatus=3&startTime="+startDate+"&endTime="+endDate;break;
                    case "3": url= "/tgpt/traffic/maintenanceBill?billStatus=40&startTime="+startDate+"&endTime="+endDate;break;
                    case "4": url= "/tgpt/traffic/insuranceBill?startTime="+startDate+"&endTime="+endDate;break;
                    case "5": url= "/tgpt/traffic/accident?billStatus=50&startTime="+startDate+"&endTime="+endDate;break;
                    case "6": url= "/tgpt/traffic/violationRecord?startTime="+startDate+"&endTime="+endDate;break;
                    case "7": url= "/tgpt/traffic/annual?startTime="+startDate+"&endTime="+endDate;break;
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
                this.getLineChartData();
                this.getPieChartData();
                this.getAlert();
                this.getVehicleRunStatistics();
                this.getContractCurrentStatus();
                this.getFinancialAccount();
                this.getVehicleStatistics();
                this.getList();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "src/styles/workbench.scss"

</style>
