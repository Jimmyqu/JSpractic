<template>
    <div class="newDetail-panel">
        <div id="map" style="width:100%;height:calc(100vh - 121px)"></div>
        <div class="detail__dialog detail-box " v-drag-dialog>
            <div class="detail-title detail-title__header">
                车辆详情
            </div>
            <div class="flex-panel detail-body">
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
                        <el-tooltip :disabled="isShowTooltip(detailForm.organizationName)" effect="dark" :content="detailForm.organizationName" placement="top">
                            <span>{{detailForm.organizationName}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.carModel)" effect="dark" :content="detailForm.carModel" placement="top">
                            <span>{{detailForm.carModel}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <span>{{detailForm.name}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail__dialog detail-box detail-box1" style="top:300px" v-drag-dialog>
            <div class="detail-title detail-title__header">
                报警详情
            </div>
            <div class="flex-panel detail-body">
                <div class="detail-item">
                    <label class="control-label">开始时间：</label>
                    <div class="input-group">
                        <span>{{detailForm.startTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">结束时间：</label>
                    <div class="input-group">
                        <span>{{detailForm.endTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">震动值(最后)</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.maxStrength)" effect="dark" :content="detailForm.maxStrength" placement="top">
                            <span>{{detailForm.maxStrength}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <span></span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">开始位置</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.startAddress)" effect="dark" :content="detailForm.startAddress" placement="top">
                            <span>{{detailForm.startAddress}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">最后位置</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.endAddress)" effect="dark" :content="detailForm.endAddress" placement="top">
                            <span>{{detailForm.endAddress}}</span>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {tool,mapTool} from '@/utils/common'
    import dragDialog from '@/directive/drag-dialog' 

    export default {
        name: "towDetail",
        mixins: [tool,mapTool],
        directives:{dragDialog},
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                currentVehicleTrack:{
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
                this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
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
            ajax.get('obd/obdAlarmTow/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })

            ajax.get('obd/obdAlarmTow/findVehicleStatusByVehicleId/' + this.id).then(rs => {
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
                    icon = new BMap.Icon("/static/img/car-icon_05.png", iconSize);
                }
                else if (direction >= 22.5 && direction < 67.5) {
                    icon = new BMap.Icon("/static/img/car-icon_04.png", iconSize);
                }
                else if (direction >= 67.5 && direction < 112.5) {
                    icon = new BMap.Icon("/static/img/car-icon_03.png", iconSize);
                }
                else if (direction >= 112.5 && direction < 157.5) {
                    icon = new BMap.Icon("/static/img/car-icon_02.png", iconSize);
                }
                else if (direction >= 157.5 && direction < 202.5) {
                    icon = new BMap.Icon("/static/img/car-icon_01.png", iconSize);
                }
                else if (direction >= 202.5 && direction < 247.5) {
                    icon = new BMap.Icon("/static/img/car-icon_08.png", iconSize);
                }
                else if (direction >= 247.5 && direction < 292.5) {
                    icon = new BMap.Icon("/static/img/car-icon_07.png", iconSize);
                }
                else if (direction >= 292.5 && direction < 337.5) {
                    icon = new BMap.Icon("/static/img/car-icon_06.png", iconSize);
                }

                this.map.clearOverlays();
                var new_point = new BMap.Point(currentVehicleTrack.startLongitude, currentVehicleTrack.startLatitude);
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
                    content += "<p>时间：" + currentVehicleTrack.creatTime +
                        " 航向："+gpsdrct +"</p>";
                    content += "<p>速度：" + currentVehicleTrack.speed + "</p>";
                    content += "<p>位置：" + currentVehicleTrack.address + "</p>";


                    /*if (rs.vehicleStatus == 1) {
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
                        content += "<p>状态：" + status + "</p>";
                        content += "<p>最后更新时间：" +currentVehicleTrack.updateTimeStr + "</p>";
                        content += "<p>位置：" + currentVehicleTrack.localtion + "</p>";
                    } else {

                        status = "停止";
                        content += "<p>状态：" + status + "</p>";
                        content += "<p>最后更新时间：" + currentVehicleTrack.updateTimer + "</p>";
                        content += "<p>位置：" + currentVehicleTrack.endAddress + "</p>";
                    }*/

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
                    var new_point = new BMap.Point(currentVehicleTrack.startLongitude, currentVehicleTrack.startLatitude);
                    this.map.openInfoWindow(infoWindow, new_point);
                });

                this.map.addOverlay(marker);              // 将标注添加到地图中
                this.map.panTo(new_point);
                this.map.setZoom(9);

                //绘制轨迹
                if(currentVehicleTrack.trackStatus==1) {
                    this.polyMapline(currentVehicleTrack,iconSize);
                }

            });
        }

    }
</script>
