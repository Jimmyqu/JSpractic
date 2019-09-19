<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="单行程行车数据" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{detailForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆属性</label>
                        <div class="input-group">
                            <span>{{detailForm.assetsTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属部门</label>
                        <div class="input-group">
                            <span>{{detailForm.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{detailForm.name}}</span>
                        </div>
                    </div>


                </div>
            </el-collapse-item>
            <el-collapse-item title="行驶轨迹" name="1" >
                <el-col :span="20">
                    <div id="map" style="height: 541px"></div>
                </el-col>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "rolloverTripDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);;
                this.map.enableScrollWheelZoom(true);
                this.map.addControl(new BMap.NavigationControl());
                this.gpsTrack1();
            },
            settime(val) {
                if (this.countdown == 0) {
                    this.countdown = 11;
                    this.settime(this.countdown);
                    if(this.vehicleList.length>0 && this.this.id !=""){
                        this.realTimeTrack(false);
                    }
                } else {
                    this.countdown--;
                    setTimeout(()=> {
                        this.settime(this.countdown);
                    },1000)
                }
            },
            clickVehicleTrack(bean){
                this.this.id = bean.this.id;
                this.realTimeTrack(false);
            },


            gpsTrack1(){
                var PointArr = [{"x":106.6621950000,"y":26.6271700000},
                    {"x":106.6822350000,"y":26.6271700000},
                    {"x":106.7329920000,"y":26.6110190000},
                    {"x":106.7739370000,"y":26.6371410000},
                    {"x":106.8086660000,"y":26.6772330000}];
                var p = Math.ceil(PointArr.length / 2);
                this.map.centerAndZoom(new BMap.Point(PointArr[p].x, PointArr[p].y), 13);
                var driving;
                for(var i in PointArr){
                    if(i == 0 ){
                        var marker0 = new BMap.Marker(new BMap.Point(PointArr[i].x, PointArr[i].y));
                        var label0 = new BMap.Label("起点", {
                            offset : new BMap.Size(20, -10)
                        });
                        marker0.setLabel(label0);
                        this.map.addOverlay(marker0);

                        continue;
                    }
                    driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: false},
                        onMarkersSet:function(routes) {
                            this.map.removeOverlay(routes[0].marker); //删除API自带起点
                            this.map.removeOverlay(routes[1].marker); //删除API自带终点
                        }});
                    driving.search(new BMap.Point(PointArr[i-1].x, PointArr[i-1].y),
                        new BMap.Point(PointArr[i].x, PointArr[i].y));
                    if(i == PointArr.length -1){
                        var marker = new BMap.Marker(new BMap.Point(PointArr[i].x, PointArr[i].y));
                        var label = new BMap.Label("终点", {
                            offset : new BMap.Size(20, -10)
                        });
                        marker.setLabel(label);
                        this.map.addOverlay(marker);

                    }
                }
                var trackPoint = [];
                for (var i = 0, j = PointArr.length; i < j; i++) {
                    trackPoint.push(new BMap.Point(PointArr[i].x, PointArr[i].y));
                }
                //绘制线路
                var polyline = new BMap.Polyline(trackPoint, {strokeColor : "blue", strokeWeight : 6, strokeOpacity:0.5});
                this.map.addOverlay(polyline);
            }
        }
        ,
        mounted() {
            ajax.get('obd/obdAlarmRollover/detailtrip/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });

            window.initialize = this.initialize;
            var script = document.createElement("script");
            script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            document.body.appendChild(script);
        }

    }
</script>
