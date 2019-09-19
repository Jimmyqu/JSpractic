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
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{detailForm.carModel}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{detailForm.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报警时间</label>
                        <div class="input-group">
                            <span>{{detailForm.alarmTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="事故报告" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">碰撞力</label>
                        <div class="input-group">
                            <span>{{detailForm.collisionForce}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">碰撞方向</label>
                        <div class="input-group">
                            <span>{{detailForm.collisionPosition}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加速度值</label>
                        <div class="input-group">
                            <span>{{detailForm.acceleration}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">刹车时长</label>
                        <div class="input-group">
                            <span>{{detailForm.brakeTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">刹车距离</label>
                        <div class="input-group">
                            <span>{{detailForm.brakeDistance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">最高车速</label>
                        <div class="input-group">
                            <span>{{detailForm.maxSpeed}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">故障情况</label>
                        <div class="input-group">
                            <span></span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报警位置</label>
                        <div class="input-group">
                            <span>{{detailForm.address}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse v-model="openCollapse">
                <el-collapse-item title="行驶轨迹" name="1" >
                    <el-col :span="20">
                        <div id="map" style="height: 541px"></div>
                    </el-col>
                </el-collapse-item>
            </el-collapse>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "collisionDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                currentVehicleTrack:{
                },
                id: this.$route.params.id,

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
        }
        ,
        mounted() {
            ajax.get('obd/obdAlarmCollision/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });

            window.initialize = this.initialize;
            var script = document.createElement("script");
            script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            document.body.appendChild(script);

            ajax.get('obd/obdAlarmCollision/findVehicleStatusByVehicleId/' + this.id).then(rs => {
                if(rs.data == null){
                    this.$message.error("未获取到该车辆信息！");
                    return;
                }
                let currentVehicleTrack = rs.data;
                if(status){
                    this.vehicleList = this.vehicleList.concat(rs.data);
                }

                var iconSize = new BMap.Size(24, 29);
                var direction = currentVehicleTrack.direction;
                var icon;
                if (direction >= 337.5 || direction < 22.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_05.png", iconSize);
                }
                else if (direction >= 22.5 && direction < 67.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_04.png", iconSize);
                }
                else if (direction >= 67.5 && direction < 112.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_03.png", iconSize);
                }
                else if (direction >= 112.5 && direction < 157.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_02.png", iconSize);
                }
                else if (direction >= 157.5 && direction < 202.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_01.png", iconSize);
                }
                else if (direction >= 202.5 && direction < 247.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_08.png", iconSize);
                }
                else if (direction >= 247.5 && direction < 292.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_07.png", iconSize);
                }
                else if (direction >= 292.5 && direction < 337.5) {
                    icon = new BMap.Icon("src/styles/img/map_images/car-icon_06.png", iconSize);
                }

                this.map.clearOverlays();
                var new_point = new BMap.Point(currentVehicleTrack.clongitude, currentVehicleTrack.clatitude);
                let marker = new BMap.Marker(new_point);  // 创建标注
                marker.setIcon(icon);//图标

                marker.addEventListener("click", function(){
                    var opts = {
                        width: 355,     // 信息窗口宽度
                        height: 190,     // 信息窗口高度
                        enableMessage: false,
                        offset: new BMap.Size(0, -20)
                    }
                    //创建弹出框信息
                    var content;
                    var gpsdrct;
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
                    var content = "<p>车牌：" + currentVehicleTrack.plate + "</p>";
                    content += "<p>车型 ： " +  currentVehicleTrack.carModel + "</p>";



                    if (rs.vehicleStatus == 1) {
                        status = "运行";
                        content += "<p>状态：" + status + "&nbsp;&nbsp;&nbsp;&nbsp;" +  currentVehicleTrack.runTime + " <span style=' float:right; _position:relative;'>车速 ： " +  currentVehicleTrack.speed + " km/h  &nbsp;&nbsp;&nbsp;</span></p>";
                        content += "<p>行程开始：" +  currentVehicleTrack.startTimeStr + "<span style=' float:right; _position:relative;'>航向：" + gpsdrct + " &nbsp;&nbsp;&nbsp;</span></p>";
                        content += "<p>里程：" +  currentVehicleTrack.subMileage + "km&nbsp;&nbsp;&nbsp;耗油：" + rs.oil + "L</p>";
                        if ( currentVehicleTrack.localtion == null ||  currentVehicleTrack.localtion == undefined) {
                            content += "<p>位置：未解析地址</p></div>";
                        }
                        else {
                            content += "<p>位置：" + currentVehicleTrack.localtion + "</p>";
                        }
                    } else if ( currentVehicleTrack.vehicleStatus == 3) {

                        status = "离线";
                        content += "<p>状态：" + status +
                            " 速度：" + currentVehicleTrack.speed + "</p>";
                        content += "<p>时间：" + currentVehicleTrack.creatTime +
                            " 航向："+gpsdrct +"</p>";
                        content += "<p>位置：" + currentVehicleTrack.address + "</p>";
                    } else {

                        status = "停止";
                        content += "<p>状态：" + status +
                            " 速度：" + currentVehicleTrack.speed + "</p>";
                        content += "<p>时间：" + currentVehicleTrack.creatTime +
                            " 航向："+gpsdrct +"</p>";
                        content += "<p>位置：" + currentVehicleTrack.address + "</p>";
                    }

                    /* if (data.Flag != "" && data.Flag != null) {
                    content += "<p style='float:left;margin-left:90px;margin-top:10px;'>";
                       content += "<a target='_blank' href='/Vehc/VehcInfo/" + data.V_ID + "' class='btn default btn-xs blue'> <img src='/Content/assets/img/vehcCommon/returnCar.png' /> 车辆档案</a>";
                       content += "&nbsp;&nbsp;<a class='btn  btn-xs blue' href='/VehcLocation/TrackPlayback/" + data.V_ID + "' ><img src='/Content/assets/img/vehcCommon/refresh.png' /> 车辆轨迹</a>";
                       content += "</p>";

                       content += "<div class='btn-group dropup' style='float:right;width:100px;margin-right:-5px;position:relative;margin-top:10px;' id='dDiv'>";
                       content += "<button type='button' class='btn default btn-xs blue' onclick='showUlList()' style='height:20px;margin-top:1px;'><img src='/Content/assets/img/vehcCommon/icon_zhanlan.png' />栅栏设置</button>";
                       content += "<button type='button' class='btn default btn-xs blue dropdown-toggle' data-toggle='dropdown' onclick='showUlList()' style='height:20px;margin-top:1px;'><i class='fa fa-angle-down'></i></button>";
                       content += "<ul class='dropdown-menu pull-right' role='menu' style='list-style:none;margin:0px;padding:0px;width:50px;margin-right:10px;' class='ListStyle'>";
                       if (data.Flag.indexOf("1") > -1) {
                           content += "<li><a href='javascript:void(0)' class='btn btn-xs blue' onclick=showTimeModel('" + data.V_PLATES + "','" + data.V_ID + "')><img src='/Content/assets/img/vehcCommon/icon_clock_def.png' /> 时间栅栏 </a></li>";
                       }
                       if (data.Flag.indexOf("2") > -1) {
                           content += "<li><a href='javascript:void(0)' class='btn btn-xs blue' onclick=showAreaModel('" + data.V_PLATES + "','" + data.V_ID + "')><img src='/Content/assets/img/vehcCommon/icon_quyu.png' /> 区域栅栏 </a></li>";
                       }
                       if (data.Flag.indexOf("3") > -1) {
                           content += "<li><a href='javascript:void(0)' class='btn btn-xs blue' onclick=showElectronModel('" + data.V_PLATES + "','" + data.V_ID + "')><img src='/Content/assets/img/vehcCommon/icon_dianzi.png' /> 电子栅栏 </a></li>";
                       }
                       content += "</ul></div>";
                  }
                  else {
                      content += "<p style='float:right;margin-top:10px;'>";
                      content += "<a target='_blank' href='/Vehc/VehcInfo/" + data.V_ID + "' class='btn default btn-xs blue'> <img src='/Content/assets/img/vehcCommon/returnCar.png' /> 车辆档案</a>";
                      content += "&nbsp;&nbsp;<a class='btn  btn-xs blue' href='/VehcLocation/TrackPlayback/" + data.V_ID + "' ><img src='/Content/assets/img/vehcCommon/refresh.png' /> 车辆轨迹</a>";
                      content += "</p>";
                  }*/


                    var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                    var new_point = new BMap.Point(currentVehicleTrack.clongitude, currentVehicleTrack.clatitude);
                    this.map.openInfoWindow(infoWindow, new_point);
                });

                this.map.addOverlay(marker);              // 将标注添加到地图中
                this.map.panTo(new_point);

                //绘制轨迹
                if(currentVehicleTrack.trackStatus==1) {
                    this.polyMapline(currentVehicleTrack,iconSize);
                }

            });
        }

    }
</script>
