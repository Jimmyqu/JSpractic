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
                        <label class="control-label">行程总时长</label>
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
                   <!-- <div class="detail-item">
                        <label class="control-label">怠速总时长(h:m:s)</label>
                        <div class="input-group">
                            <span>{{detailForm.idleTiem}}</span>
                        </div>
                    </div>-->
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
           <!-- <el-collapse-item title="分段里程" name="3">
                <div class="flex-panel detail-box stat-box">
                    <div class="text">行程总里程数<span>{{detailForm.totalMileage?(detailForm.totalMileage/1000).toFixed(2):0}} km</span>,各分段行程里程数和所占比例如下：</div>
                    <div class="detail-item half">
                        <histogram style="width: 100%;height:350px" :data="chartData"></histogram>
                    </div>
                    <div class="detail-item half">
                        <pie style="width: 100%;height:350px" :data="chartData"></pie>
                    </div>
                </div>
            </el-collapse-item>-->
            <el-collapse-item title="车速及耗油" name="4">
                <div class="flex-panel detail-box stat-box2">
                    <div class="detail-item">
                        <label class="control-label">耗油量(L)</label>
                        <div class="input-group">
                            <span>{{detailForm.totalOil?(detailForm.totalOil/1000).toFixed(2):0}}</span>
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
                <!-- <ve-bmap :settings="mapSetting" :after-set-option-once="initMap"  v-loading="mapLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"
                ></ve-bmap> -->
            <div id="map" style="height: 500px" v-loading="mapLoading " element-loading-background="rgba(255, 255, 255, 0.6)"></div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import {mapTool} from '@/utils/common'
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import histogram from 'v-charts/lib/histogram.common'
    import pie from 'v-charts/lib/pie.common'
    import gauge from 'v-charts/lib/gauge.common'
    // import veBmap from 'v-charts/lib/bmap.common'
    import {secondsToTime, secondsToHour} from '@/utils/index'

    export default {
        name: "vehicleTrackRecordDetail",
        components:{ ApprovalFlow,histogram,pie,gauge },
        mixins:[mapTool],
        data() {
            return {
                activeNames: ["1","2","3","4","5"],
                show: true,
                detailForm: {},
                param:{
                    id : this.$route.params.id,
                    vehicleId: this.$route.query.vehicleId,
                    imei: this.$route.query.imei,
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
                mapLoading: false,
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.initMap()
            })
        },
        methods: {
            open() {
                this.show = true;
            },
            initMap: function (echarts) {
                // this.map = echarts.getModel().getComponent('bmap').getBMap()
                this.map = new BMap.Map('map');
                this.map.centerAndZoom("武汉",15);
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl());
                this.map.addControl(new BMap.ScaleControl());
                this.loadDetail();
            },
            loadDetail(){
                ajax.get('obd/obdVehicleTrack/getSingleTrackById', this.param).then(rs => {
                    if (rs) {
                        this.detailForm = rs.data;
                        this.detailForm.totalTime =rs.data.totalTime;
                        this.detailForm.idleTiem =secondsToTime(rs.data.idleTiem);
                        this.detailForm.runTime =rs.data.runTime;
                        this.chartData.rows.push({'分段' : '0-20', '里程': rs.data.mileage0020});
                        this.chartData.rows.push({'分段' : '20-40', '里程': rs.data.mileage2040});
                        this.chartData.rows.push({'分段' : '40-60', '里程': rs.data.mileage4060});
                        this.chartData.rows.push({'分段' : '60-90', '里程': rs.data.mileage6090});
                        this.chartData.rows.push({'分段' : '90-120', '里程': rs.data.mileage90120});
                        this.chartData.rows.push({'分段' : '>120', '里程': rs.data.mileage120});
                        this.gaugeDataAvg.rows.push({type: '速度', value: rs.data.speed});
                        this.gaugeDataMax.rows.push({type: '速度', value: rs.data.maxSpeed});
                        this.initLines();
                    }
                });
            },
            /*初始化行车轨迹*/
            initLines(){
                /*根据行程id获取车辆运行轨迹*/
                var param = `&startTime=${this.detailForm.startTime}&endTime=${this.detailForm.endTime}&imei=${this.param.imei}`;
                this.mapLoading = true;
                ajax.get('obd/obdVehicleTrack/track?vehicleId='+this.param.vehicleId + param).then(rs => {
                    if(rs.data && rs.data.length > 0){
                        this.dataList =  rs.data;
                        for(var i = 0; i <  rs.data.length; i++){
                            this.points.push(new BMap.Point(rs.data[i].corlong, rs.data[i].corlat));
                        }
                        this.drawLine(this.points);
                        this.mapLoading = false;
                    }else {
                        this.$message.error("未查询到车辆轨迹信息！");
                        this.mapLoading = false;
                        return;
                    }
                },()=>{
                    this.mapLoading = false;
                });
            },
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
