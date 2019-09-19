<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="车辆信息" name="1" >
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
                            <span>{{detailForm.plateType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.organization}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{detailForm.modeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报警时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="处理信息" name="2" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">核实时间</label>
                        <div class="input-group">
                            <span>{{detailForm.operaTtime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">核实人员</label>
                        <div class="input-group">
                            <span>{{detailForm.operator}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">拆机原因</label>
                        <div class="input-group">
                            <span>{{detailForm.reason}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">备注信息</label>
                        <div class="input-group">
                            <span>{{detailForm.remarks}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="报警位置跟踪" name="3" >
                <div class="flex-panel detail-box">
                    <div id="map" style="width: 100%;height: 500px;padding: 0;"></div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "backoutDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                map: {},

                openCollapse: ["1", "2", "3"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id
            }
        },
        mounted() {
            ajax.get('obd/obdAlarmBackout/getBackoutDetail?id=' + this.id).then(rs => {
                this.detailForm = rs.data;

                window.initialize = this.initialize;
                var script = document.createElement("script");
                script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
                document.body.appendChild(script);
            });
        },
        methods: {
            open() {
                this.show = true;
            },

            initialize(){
                var $this = this;
                //初始化地图,选取第一个点为起始点
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point(114.00510, 22.550000), 11);
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl());

                //this.map = new BMap.Map('map');
                var point = new BMap.Point($this.detailForm.corlong, $this.detailForm.corlat);
                setTimeout(function () {
                    $this.map.panTo(point);
                }, 500);
                var icon = new BMap.Icon("/static/img/car-power-failure.png", new BMap.Size(29, 35));
                var markerStart = new BMap.Marker(point, { icon: icon });
                $this.map.addOverlay(markerStart);
                markerStart.setTop(true, 99999);

                var gpsdrct = "";
                if($this.detailForm.direction){
                    if ($this.detailForm.direction >= 337.5 || $this.detailForm.direction < 22.5) {
                        gpsdrct = "向北";
                    }
                    else if ($this.detailForm.direction >= 22.5 && $this.detailForm.direction < 67.5) {
                        gpsdrct = "东北";
                    }
                    else if ($this.detailForm.direction >= 67.5 && $this.detailForm.direction < 112.5) {
                        gpsdrct = "向东";
                    }
                    else if ($this.detailForm.direction >= 112.5 && $this.detailForm.direction < 157.5) {
                        gpsdrct = "东南";
                    }
                    else if ($this.detailForm.direction >= 157.5 && $this.detailForm.direction < 202.5) {
                        gpsdrct = "向南";
                    }
                    else if ($this.detailForm.direction >= 202.5 && $this.detailForm.direction < 247.5) {
                        gpsdrct = "西南";
                    }
                    else if ($this.detailForm.direction >= 247.5 && $this.detailForm.direction < 292.5) {
                        gpsdrct = "向西";
                    }
                    else if ($this.detailForm.direction >= 292.5 && $this.detailForm.direction < 337.5) {
                        gpsdrct = "西北";
                    }
                }

                // var content = "<div><p>车牌：" + ($this.detailForm.plate == null ? '' : $this.detailForm.plate) + "</p>";
                // content += "<p>车型：" + ($this.detailForm.modeName == null ? '' : $this.detailForm.modeName) + "</p>";
                // content += "<p>速度：" + ($this.detailForm.speed == null ? '' : $this.detailForm.speed) + "</p>";
                // content += "<p>时间：" + ($this.detailForm.createTime == null ? '' : $this.detailForm.createTime) + "&nbsp;&nbsp;&nbsp;" + "航向：" + gpsdrct + "</p>";
                // content += "<div><div style='float:left;width:39px;'>位置：</div><div style='float:left;width:228px;'>" + ($this.detailForm.localtion == null ? '' : $this.detailForm.localtion) + "</div></div></div>";


                var content = "<div style='line-height:14px;margin-top: -8px;'>" +
                    "<p style='text-align:left '>" +
                    "<span style='width:100px;'>车牌： </span>" + ($this.detailForm.plate == null ? '' : $this.detailForm.plate) + "</p>";
                content += "<p  style='text-align:left '>" +
                    "<span style='width:100px;'>车型： </span>" + ($this.detailForm.modeName == null ? '' : $this.detailForm.modeName) + "</p>";
                //content += "<p  style='text-align:left '>" +
                //    "<span style='width:100px;'>方向： </span>" + (gpsdrct == null ? '' : gpsdrct) + "</p>";
                content += "<p  style='text-align:left '>" +
                    "<span style='width:100px;'>速度(km/h)： </span>" + ($this.detailForm.speed == null ? '' : $this.detailForm.speed) + "</p>";
                //content += "<p  style='text-align:left '>" +
                //    "<span style='width:100px;'>时间： </span>" + ($this.detailForm.createTime == null ? '' : $this.detailForm.createTime) + "</p>";
                content += "<p>时间： " + ($this.detailForm.createTime == null ? '' : $this.detailForm.createTime) + "&nbsp;&nbsp;&nbsp;" + "航向： " + gpsdrct + "</p>";
                markerStart.addEventListener("click", $this.openInfo1.bind(null, content));
            },
            openInfo1(content, e) {
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                let geoc = new BMap.Geocoder();
                geoc.getLocation(point, rs => {
                    content += "<p  style='text-align:left '>" +
                        "<span style='width:100px;'>位置： </span>" + rs.address + "</p></div>";

                    var opts = {
                        width: 270,     // 信息窗口宽度
                        height: 150,     // 信息窗口高度
                        enableMessage: false,
                        offset: new BMap.Size(0, -20)
                    };
                    var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                    this.map.openInfoWindow(infoWindow, point); //开启信息窗口
                });
            }
        }

    }
</script>
