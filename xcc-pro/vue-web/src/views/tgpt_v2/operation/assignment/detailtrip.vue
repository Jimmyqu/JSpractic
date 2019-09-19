<template>
    <div class="newDetail-panel">
        <div class="detail-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="任务" name="1"></el-tab-pane>
                <el-tab-pane label="回程" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <div id="map" style="width:100%;height:calc(100vh - 171px)"></div>
        <div class="detail__dialog detail-box " v-drag-dialog>
            <div class="detail-title detail-title__header">
                行程信息
            </div>
            <div class="detail-body">
                <div class="detail-item">
                    <label class="control-label">司机姓名</label>
                    <div class="input-group">
                        <span>{{detailForm.driverName}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <span>{{detailForm.plate}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行程类型</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.typeText)" effect="dark"
                                    :content="detailForm.typeText" placement="top">
                            <span>{{detailForm.typeText}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行程开始时间</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.startTime)" effect="dark"
                                    :content="detailForm.startTime" placement="top">
                            <span>{{detailForm.startTime}}</span>
                        </el-tooltip>
                    </div>
                </div>

                <div class="detail-item">
                    <label class="control-label">行程起点</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.startAddress)" effect="dark"
                                    :content="detailForm.startAddress" placement="top">
                            <span>{{detailForm.startAddress}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">乘客上车点</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.passengerAddress)" effect="dark"
                                    :content="detailForm.passengerAddress" placement="top">
                            <span>{{detailForm.passengerAddress}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行程终点</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.endAddress)" effect="dark"
                                    :content="detailForm.endAddress" placement="top">
                            <span>{{detailForm.endAddress}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行程结束时间</label>
                    <div class="input-group">
                        <span>{{detailForm.endTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行驶里程(公里)</label>
                    <div class="input-group">
                        <span>{{detailForm.mileage}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行驶时长(h:m:s)</label>
                    <div class="input-group">
                        <span>{{detailForm.runTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">平均车速(km/h)</label>
                    <div class="input-group">
                        <span>{{detailForm.avgSpeed}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">最高车速(km/h)</label>
                    <div class="input-group">
                        <span>{{detailForm.maxSpeed}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {calculator} from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {tool, mapTool} from '@/utils/common'
    import dragDialog from '@/directive/drag-dialog'
    import {isInclude} from '@/utils/index'

    export default {
        name: "assignmentManagementDetailTrip",
        mixins: [tool, mapTool],
        directives: {dragDialog},
        components: {ApprovalFlow},
        data() {
            return {
                openCollapse: ["1", "2"],
                show: true,
                detailForm: {},
                id: this.$route.params.id,
                activeName: '1'
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            initialize() {
                this.map = new AMap.Map("map", {
                    resizeEnable: true,
                    center: [116.397428, 39.90923],
                    zoom: 11
                });
                this.gpsTrack1(1);
            },
            clickVehicleTrack(bean) {
                this.this.id = bean.this.id;
                this.realTimeTrack(false);
            },
            handleClick(type) {
                this.gpsTrack1(type.name);
            },
            gpsTrack1(type) {
                ajax.get('operation_core/assignment/route?id=' + this.id + '&type=' + type).then(rs => {
                    this.detailForm = rs.data ? rs.data : {};
                    this.gpsTrack2(this.id, type);
                });
            },
            gpsTrack2(id, type) {
                const loading = this.$loading({
                    fullscreen: false,
                    lock: true,
                    text: '拼命加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector('#map')
                });
                setTimeout(() => {
                    loading.close();
                }, 10000);
                const param = {
                    id: id,
                    type: type

                };
                ajax.post('operation_core/assignment/track', param).then(rs => {
                    loading.close();
                    if (rs.status == 0) {
                        /*划线*/
                        let pointList = [];

                        if (rs.data.points != null) {
                            rs.data.points.forEach(item => {
                                pointList.push(new AMap.LngLat(item.lon, item.lat))
                            });
                        }

                        const startPoint = rs.data.startPoint;
                        const midPoint = rs.data.passengerPoint;
                        const endPoint = rs.data.endPoint;

                        this.tomap(pointList, startPoint, midPoint, endPoint);
                    } else {
                        this.$message.error(rs.msg);
                    }
                }).catch(_ => {
                    loading.close();
                });
            },
            tomap(pointList, startPoint, midPoint, endPoint) {

                const $this = this
                this.map.clearMap();  // 清除地图覆盖物

                if (pointList.length == 0) {
                    if (startPoint != null) {
                        pointList.push(new AMap.LngLat(startPoint.lon, startPoint.lat));
                    }
                    if (midPoint != null) {
                        pointList.push(new AMap.LngLat(midPoint.lon, midPoint.lat));
                    }
                    if (endPoint != null) {
                        pointList.push(new AMap.LngLat(endPoint.lon, endPoint.lat));
                    }
                }
                debugger
                if (pointList.length == 0) {
                    debugger
                    //返程未开始,定位到PC当前位置
                    AMap.plugin('AMap.Geolocation', function () {
                        var geolocation = new AMap.Geolocation({
                            showMarker: false,
                            enableHighAccuracy: true,//是否使用高精度定位，默认:true
                            timeout: 10000,          //超过10秒后停止定位，默认：5s
                            // buttonPosition:'RB',    //定位按钮的停靠位置
                            // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
                        });
                        $this.map.addControl(geolocation);
                        geolocation.getCurrentPosition(function (status, result) {
                            console.info(result);
                        });
                    });
                    return;
                }


                if (midPoint != null) {
                    var marker = new AMap.Marker({
                        map: $this.map,
                        position: pointList[0],
                        icon: "/static/img/map_images/origin.png",
                        offset: new AMap.Pixel(-16, -30),
                        autoRotation: true,
                        angle: 0,
                    });

                    const midPosition = new AMap.LngLat(midPoint.lon, midPoint.lat);
                    var midMarker = new AMap.Marker({
                        map: $this.map,
                        position: midPosition,
                        icon: "/static/img/map_images/start.png",
                        offset: new AMap.Pixel(-16, -30),
                        autoRotation: true,
                        angle: 0,
                    });

                    if (pointList.length > 1) {
                        var endMarker = new AMap.Marker({
                            map: $this.map,
                            position: pointList[pointList.length - 1],
                            icon: "/static/img/map_images/end.png",
                            offset: new AMap.Pixel(-16, -30),
                            autoRotation: true,
                            angle: 0,
                        });
                    }

                } else {
                    var marker = new AMap.Marker({
                        map: $this.map,
                        position: pointList[0],
                        icon: "/static/img/map_images/start.png",
                        offset: new AMap.Pixel(-16, -30),
                        autoRotation: true,
                        angle: 0,
                    });

                    if (pointList.length > 1) {
                        var endMarker = new AMap.Marker({
                            map: $this.map,
                            position: pointList[pointList.length - 1],
                            icon: "/static/img/map_images/end.png",
                            offset: new AMap.Pixel(-16, -30),
                            autoRotation: true,
                            angle: 0,
                        });
                    }
                }

                // 绘制轨迹
                var polyline = new AMap.Polyline({
                    map: $this.map,
                    path: pointList,
                    showDir: true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 4,      //线宽
                    // strokeStyle: "solid"  //线样式
                });

                this.map.setFitView();
            }
        }

        ,
        mounted() {
            this.$nextTick(() => {
                let script = document.createElement("script");
                if (!isInclude("https://webapi.amap.com/maps?v=1.4.15&key=73b8b5e6c588c4e95124269591ff89f0")) {
                    script.src = "https://webapi.amap.com/maps?v=1.4.15&key=73b8b5e6c588c4e95124269591ff89f0";
                    document.body.appendChild(script);
                    script.onload = this.initialize
                } else {
                    this.initialize();
                }
            })
        }

    }
</script>


<style lang="scss" scoped>
    .newDetail-panel .detail-box {
        top: 70px;
    }

    .newDetail-panel .detail-tabs {
        width: 200px;
        height: 50px;
        background: #fff;
    }
</style>
