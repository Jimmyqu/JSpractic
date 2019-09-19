<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="车辆信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{detailForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资产属性</label>
                        <div class="input-group">
                            <span>{{detailForm.assetsTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.attributionRegionName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机</label>
                        <div class="input-group">
                            <span>{{detailForm.driverName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="时间" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">行程总时长(h:m:s)</label>
                        <div class="input-group">
                            <span>{{detailForm.totalTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行程开始时间</label>
                        <div class="input-group">
                            <span>{{detailForm.startTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">怠速总时长(h:m:s)</label>
                        <div class="input-group">
                            <span>{{detailForm.idleTiem}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行程结束时间</label>
                        <div class="input-group">
                            <span>{{detailForm.endTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶时长(h:m:s)</label>
                        <div class="input-group">
                            <span>{{detailForm.runTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="分段里程" name="3">
                <div class="flex-panel detail-box stat-box">
                    <div class="text">行程总里程数<span>{{detailForm.totalMileage}} km</span>,各分段行程里程数和所占比例如下：</div>
                    <div class="detail-item half">
                        <histogram style="width: 100%;height:350px" :data="chartData"></histogram>
                    </div>
                    <div class="detail-item half">
                        <pie style="width: 100%;height:350px" :data="chartData"></pie>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="车速及耗油" name="4">
                <div class="flex-panel detail-box stat-box2">
                    <div class="detail-item">
                        <label class="control-label">耗油量(L)</label>
                        <div class="input-group">
                            <span>{{detailForm.totalOil}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">怠速耗油量(L)</label>
                        <div class="input-group">
                            <span>{{detailForm.idleFuel}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">百公里油耗(L/100km)</label>
                        <div class="input-group">
                            <span>{{detailForm.fuelConsumption}}</span>
                        </div>
                    </div>

                    <div class="detail-item half">
                        <gauge style="width: 100%;height:350px" :data="gaugeDataAvg" :settings="gaugeSettings"></gauge>
                        <div class="title">平均速度</div>
                    </div>
                    <div class="detail-item half">
                        <gauge style="width: 100%;height:350px" :data="gaugeDataMax" :settings="gaugeSettings"></gauge>
                        <div class="title">最高速度</div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="行驶轨迹" name="5">
                <div class="app-container white-bg list-panel" v-cloak>
                    <div id="map" style="width: 100%;height: 80%"></div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import histogram from 'v-charts/lib/histogram.common'
    import pie from 'v-charts/lib/pie.common'
    import gauge from 'v-charts/lib/gauge.common'
    import {secondsToTime, secondsToHour} from '@/utils/index'

    export default {
        name: "vehicleTrackRecordDetail",
        components:{ ApprovalFlow,histogram,pie,gauge },
        data() {
            return {
                activeNames: ["1","2","3","4","5"],
                show: true,
                detailForm: {},
                param:{
                    id : this.$route.params.id,
                    vehicleId: this.$route.query.vehicleId,
                },
                chartData: {
                    columns: ['分段', '里程'],
                    rows: []
                },
                gaugeSettings : {
                    dataName: {
                        '速度': 'km/h'
                    },
                    seriesMap: {
                        '速度': {
                            min: 0,
                            max: 220,
                            splitNumber: 11,
                            center: ['50%', '45%'],
                            /*radius: '50%',*/
                            detail: {
                                backgroundColor: 'rgba(30,144,255,0.8)',
                                borderWidth: 1,
                                borderColor: '#fff',
                                shadowColor: '#fff',
                                shadowBlur: 5,
                                offsetCenter: [0, '50%'],
                                textStyle: {
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                }
                            }
                        },

                    }
                },
                gaugeDataAvg: {
                    columns: ['type', 'value'],
                    rows: []
                },
                gaugeDataMax: {
                    columns: ['type', 'value'],
                    rows: []
                },
                map:{},     //百度地图对象
                points: [],
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            initialize(){
                //初始化地图,选取第一个点为起始点
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point(114.00510, 22.550000), 11);
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl());
                this.map.addControl(new BMap.ScaleControl());
                this.initLines();
            },
            loadDetail(){
                ajax.get('obd/obdVehicleTrack/getSingleTrackById', this.param).then(rs => {
                    if (rs) {
                        this.detailForm = rs.data;
                        this.detailForm.totalTime =secondsToTime(rs.data.totalTime);
                        this.detailForm.idleTiem =secondsToTime(rs.data.idleTiem);
                        this.detailForm.runTime =secondsToTime(rs.data.runTime);
                        this.chartData.rows.push({'分段' : '0-20', '里程': rs.data.mileage0020});
                        this.chartData.rows.push({'分段' : '20-40', '里程': rs.data.mileage2040});
                        this.chartData.rows.push({'分段' : '40-60', '里程': rs.data.mileage4060});
                        this.chartData.rows.push({'分段' : '60-90', '里程': rs.data.mileage6090});
                        this.chartData.rows.push({'分段' : '90-120', '里程': rs.data.mileage90120});
                        this.chartData.rows.push({'分段' : '>120', '里程': rs.data.mileage120});
                        this.gaugeDataAvg.rows.push({type: '速度', value: rs.data.speed});
                        this.gaugeDataMax.rows.push({type: '速度', value: rs.data.maxSpeed});
                    }
                });
            },
            initLines(){
                ajax.get('tgs/obdLocation/list?vehicleId=1&vehicleTrackId=1').then(rs => {
                    if(rs && rs.length > 0){
                        this.dataList = rs;
                        for(var i = 0; i < rs.length; i++){
                            this.points.push(new BMap.Point(rs[i].corlong, rs[i].corlat));
                        }
                        this.GetVehicleTrack(this.dataList);
                    }else {
                        this.$message.error("未查询到车辆轨迹信息！");
                        return;
                    }
                });
            },
            GetVehicleTrack(data) {
                var bluegps;
                var bluepoints = [];
                this.map.clearOverlays();
                //画整个行程
                if (data.length > 0) {
                    bluegps = data;
                    //开始点
                    var point = new BMap.Point(bluegps[0].corlong, bluegps[0].corlat);
                    setTimeout(function () {
                        this.map.panTo(point);
                    }, 1500);
                    var icon = new BMap.Icon("/static/img/gpsStart.png", new BMap.Size(29, 35));
                    var markerStart = new BMap.Marker(point, { icon: icon });
                    this.map.addOverlay(markerStart);
                    markerStart.setTop(true, 99999);
                    bluepoints = this.points;
                    if (bluepoints.length > 0) {
                        var bluepolyline = new BMap.Polyline(bluepoints, { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 0.5 });
                        this.map.addOverlay(bluepolyline);
                    }

                    //结束点
                    if (data.length > 1) {
                        var icon = new BMap.Icon("/static/img/gpsEnd.png", new BMap.Size(29, 35));
                        var endPoint = new BMap.Point(bluegps[bluegps.length - 1].corlong, bluegps[bluegps.length - 1].corlat);
                        var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                        this.map.addOverlay(markerEnd);
                        markerEnd.setTop(true, 99999);
                    }
                }
                else {
                    return;
                }

            },
        },
        mounted() {
            this.loadDetail();

            // 百度地图轨迹
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })
        }

    }
</script>


<style scoped lang="scss">
    .stat-box {
        padding: 15px;
        .detail-item {
            border: 0;
            position: relative;
        }
        .text {
            width: 100%;
            margin-bottom: 10px;
            font-size: 16px;
            span{
                margin-left: 5px;
                margin-right: 5px;
                color: #2AADE0;
                font-weight: bold;
            }
        }
    }
    .stat-box2 {
        .detail-item {
            position: relative;
            .title {
                position: absolute;
                left: 0;
                bottom: 20px;
                width: 100%;
                text-align: center;
                color: #2AADE0;
                font-weight: bold;
            }
        }
    }

</style>
