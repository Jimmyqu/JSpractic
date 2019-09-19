<template>
    <div class="newDetail-panel">
        <div id="map" style="width:100%;height:calc(100vh - 121px)"></div>
        <div class="detail__dialog detail-box " v-drag-dialog>
            <div class="detail-title detail-title__header">
                车辆详情
            </div>
            <div class="detail-body">
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
                <div class="detail-item">
                    <label class="control-label">报警时间</label>
                    <div class="input-group">
                        <span>{{detailForm.alarmTime}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail__dialog detail-box detail-box1" style="top:340px" v-drag-dialog>
            <div class="detail-title detail-title__header">
                处理信息
            </div>
            <div class="detail-body">

                <div class="detail-item">
                    <label class="control-label">处理时间</label>
                    <div class="input-group">
                        <span>{{detailForm.dealTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">处理人</label>
                    <div class="input-group">
                        <span>{{detailForm.dealer}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">核实人姓名</label>
                    <div class="input-group">
                        <span>{{detailForm.checker}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">核实人电话</label>
                    <div class="input-group">
                        <span>{{detailForm.checkerPhone}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">核实人部门</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.checkerDept)" effect="dark" :content="detailForm.checkerDept" placement="top">
                            <span>{{detailForm.checkerDept}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">断电原因</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.reason)" effect="dark" :content="detailForm.reason" placement="top">
                            <span>{{detailForm.reason}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">备注信息</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.remake)" effect="dark" :content="detailForm.remake" placement="top">
                            <span>{{detailForm.remake}}</span>
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
    import {tool,mapTool} from '@/utils/common'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import dragDialog from '@/directive/drag-dialog' 

    export default {
        name: "poweroff",
        mixins: [tool,mapTool],
        directives:{dragDialog},
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1","2","3"],
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

            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);

            ajax.get('obd/obdAlarmPowerOff/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });

            // window.initialize = this.initialize;
            this.$nextTick(()=>{
                this.initialize();
            })

            ajax.get('obd/obdAlarmPowerOff/detail/' + this.id).then(rs => {
                if(rs.data == null){
                    this.$message.error("未获取到该车辆信息！");
                    return;
                }
                var currentVehicleTrack = rs.data.locationList;
                if(status){
                    this.vehicleList = this.vehicleList.concat(rs.data);
                }

                var iconSize = new BMap.Size(24, 29);
                /*var direction = currentVehicleTrack.direction;
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
                }*/
                for(var i = 0;i<currentVehicleTrack.length;i++){
                    this.map.clearOverlays();
                    var new_point = new BMap.Point(currentVehicleTrack[i].longitude, currentVehicleTrack[i].latitude);
                    let marker = new BMap.Marker(new_point);  // 创建标注
                    //marker.setIcon(icon);//图标
                    this.map.addOverlay(marker);              // 将标注添加到地图中
                    this.map.panTo(new_point);

                   /* marker.addEventListener("click", function(){
                        var opts = {
                            width: 355,     // 信息窗口宽度
                            height: 190,     // 信息窗口高度
                            enableMessage: false,
                            offset: new BMap.Size(0, -20)
                        }
                        //创建弹出框信息
                        var content;
                        var gpsdrct;
                        /!*if (direction != null && direction != undefined) {
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
                        }*!/

                        //设置地图弹出框内容
                        var status = "";
                        var content = "<p>车牌：" + currentVehicleTrack.plate + "</p>";
                        content += "<p>车型 ： " +  currentVehicleTrack.carModel + "</p>";
                        content += "<p>时间：" + currentVehicleTrack.creatTime +
                            " 航向："+gpsdrct +"</p>";
                        content += "<p>速度：" + currentVehicleTrack.speed + "</p>";
                        content += "<p>位置：" + currentVehicleTrack.address + "</p>";



                        var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                        var new_point = new BMap.Point(currentVehicleTrack[i].longitude, currentVehicleTrack[i].latitude);
                        this.map.openInfoWindow(infoWindow, new_point);
                    });*/
                }






                /*//绘制轨迹
                if(currentVehicleTrack.trackStatus==1) {
                    this.polyMapline(currentVehicleTrack,iconSize);
                }*/

            });
        }

    }
</script>
