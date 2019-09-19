<template>
    <div class="app-container white-bg list-panel trajectory-list" v-cloak>

        <div id="controller" align="center">
            <!--<input id="follow" type="checkbox" /><span style="font-size:12px;">画面跟随</span>-->
            <input id="play" type="button" value="播放" @click="play()" disabled />
            <input id="pause" type="button" value="暂停" @click="pause()" disabled />
            <input id="reset" type="button" value="重置" @click="reset()" disabled />
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">速度</span>
                <el-dropdown-menu slot="dropdown">
                    <el-slider style="width: 300px" v-model="playSpeed" :step="100" :min="100" :max="1000"
                               show-stops></el-slider>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <div class="left-box">
            <div id="map" ></div>

            <div class="table-box">
                <el-table v-loading="listLoading"border height="400px" :data="tableList" v-show="table" @row-click="handleRowChange">
                    <el-table-column prop="index" label="序号" width="50"> </el-table-column>
                    <el-table-column prop="direction" label="方向" width="60"> </el-table-column>
                    <el-table-column prop="localtionTime" label="GPS时间" width="160"> </el-table-column>
                    <el-table-column prop="speed" label="速度(km/h)" width="100"> </el-table-column>
                    <el-table-column prop="corlong" label="经度" width="180"> </el-table-column>
                    <el-table-column prop="corlat" label="纬度" width="180"> </el-table-column>
                    <el-table-column prop="address" label="位置描述"> </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="right-box">

            <div class="item">
                <el-select
                    v-model="plate"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="车牌号"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                        v-for="item in options4"
                        :key="item.id"
                        :label="item.plate"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item">
                <el-date-picker
                    v-model="searchParam.startTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </div>
            <div class="tool-box">
                <el-button type="primary" size="small" @click="realTimeTrack()">查询</el-button>
            </div>

            <ul class="track-list" v-show="vehicleTrackListDetail">
                <li>
                    <div>起点</div>
                    <div style="color: green;">{{trackListDetailData.startPoint}}</div>
                    <div>终点</div>
                    <div style="color: red;">{{trackListDetailData.endPoint}}</div>
                </li>
            </ul>

            <div v-show="vehicleTrackListDisplay">
                <div style="font-size: 18px;">历史行程:{{vehicleTrackList.length}}条</div>
                <ul class="track-list">
                    <li v-for="item in vehicleTrackList" @click="trackListDetail(item)">
                        <div>始：{{item.startTime}}</div>
                        <div>止：{{item.endTime}}</div>
                        <div>长：{{item.totalTime}}</div>
                        <div>{{item.totalMileage}}km {{item.speed}}km/h {{item.totalOil}}L</div>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleTrackPlayback',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                searchParam: {
                    timeSelect: '',
                    timeSelectList: [
                        {
                            value: '0.5',
                            label: '近30分钟'
                        },{
                            value: '1',
                            label: '近1小时'
                        },{
                            value: '3',
                            label: '近3小时'
                        },{
                            value: '6',
                            label: '近6小时'
                        },{
                            value: '9',
                            label: '近9小时'
                        },{
                            value: '12',
                            label: '近12小时'
                        },{
                            value: '48',
                            label: '近两天'
                        },{
                            value: '72',
                            label: '近三天'
                        },
                    ],
                    startTime: '',
                    endTime: '',
                    dateObj: '',
                    startSpeed: '',
                    endSpeed: ''
                },
                startTime: '',
                endTime: '',
                plate: "",
                plateNumber: "",
                options4: [],
                list: [],
                loading: false,
                vehicleTrackList: [],
                vehicleTrackListDisplay: false,
                vehicleTrackListDetail: false,
                trackListDetailData: {
                    startPoint: '',
                    endPoint: ''
                },
                table: false,
                tableList: [],
                dataList: [],

                vehicleTrack:{},
                map:{},     //百度地图对象
                car: {},    //汽车图标
                label: {},  //信息标签
                marker1: '',
                centerPoint: '',
                timer: '',      //定时器
                index: 0,   //记录播放到第几个point
                //followChk: '',
                playBtn: '',
                pauseBtn: '',
                resetBtn: '',
                points: [],
                playSpeed: 300  //播放速度
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var $this = this;

            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })

        },
        methods: {
            initialize(){
                var $this = this;

                // this.points = [
                //     new BMap.Point(114.00100, 22.550000), new BMap.Point(114.00130, 22.550000),
                //     new BMap.Point(114.00160, 22.550000), new BMap.Point(114.00200, 22.550000),
                //     new BMap.Point(114.00300, 22.550500), new BMap.Point(114.00400, 22.550000),
                //     new BMap.Point(114.00500, 22.550000), new BMap.Point(114.00505, 22.549800),
                //     new BMap.Point(114.00510, 22.550000), new BMap.Point(114.00515, 22.550000),
                //     new BMap.Point(114.00525, 22.550400), new BMap.Point(114.00537, 22.549500)
                // ];

                //初始化地图,选取第一个点为起始点
                this.map = new BMap.Map('map');
                // var geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(function(r){
                //     $this.map.centerAndZoom(new BMap.Point(r.longitude, r.latitude), 11);
                // });
                $this.map.centerAndZoom(new BMap.Point(114.00510, 22.550000), 11);
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl());
                this.map.addControl(new BMap.ScaleControl());


                //this.init();
            },
            init() {
                var $this = this;
                $this.points = [];
                ajax.get('tgs/obdLocation/list?vehicleId=1&vehicleTrackId=1').then(rs => {
                    if(rs && rs.length > 0){
                        $this.dataList = rs;
                        for(var i = 0; i < rs.length; i++){
                            $this.points.push(new BMap.Point(rs[i].corlong, rs[i].corlat));
                        }
                        $this.GetVehcTrack($this.dataList);
                        //this.points = rs
                        //$this.tableList = rs;
                        // this.points = [
                        //     new BMap.Point(114.00100, 22.550000), new BMap.Point(114.00130, 22.550000),
                        //     new BMap.Point(114.00160, 22.550000), new BMap.Point(114.00200, 22.550000),
                        //     new BMap.Point(114.00300, 22.550500), new BMap.Point(114.00400, 22.550000),
                        //     new BMap.Point(114.00500, 22.550000), new BMap.Point(114.00505, 22.549800),
                        //     new BMap.Point(114.00510, 22.550000), new BMap.Point(114.00515, 22.550000),
                        //     new BMap.Point(114.00525, 22.550400), new BMap.Point(114.00537, 22.549500)
                        // ];

                        // $this.followChk = document.getElementById("follow");
                        // $this.playBtn = document.getElementById("play");
                        // $this.pauseBtn = document.getElementById("pause");
                        // $this.resetBtn = document.getElementById("reset");

                        //通过DrivingRoute获取一条路线的point
                        // var driving = new BMap.DrivingRoute($this.map);
                        // //driving.search(new BMap.Point(114.00100, 22.550000), new BMap.Point(113.95100, 22.550000));
                        // // var aa = new BMap.Point($this.points[0]);
                        // // var bb = new BMap.Point($this.points[$this.points.length - 1]);
                        // // var c = new BMap.Point(114.00100, 22.550000);
                        // // var d = new BMap.Point(113.95100, 22.550000);
                        // driving.search($this.points[0], $this.points[$this.points.length - 1]);
                        // driving.setSearchCompleteCallback(function() {
                        //     //得到路线上的所有point
                        //     $this.points = driving.getResults().getPlan(0).getRoute(0).getPath();
                        //     //画面移动到起点和终点的中间
                        //     $this.centerPoint = new BMap.Point(($this.points[0].lng + $this.points[$this.points.length - 1].lng) / 2, ($this.points[0].lat + $this.points[$this.points.length - 1].lat) / 2);
                        //     $this.map.panTo($this.centerPoint);
                        //     //连接所有点
                        //     $this.map.addOverlay(new BMap.Polyline($this.points, {strokeColor: "black", strokeWeight: 5, strokeOpacity: 1}));
                        //
                        //
                        //     //开始点
                        //     var point = $this.points[0];
                        //     setTimeout(function () {
                        //         $this.map.panTo(point);
                        //     }, 1500);
                        //     var icon = new BMap.Icon("/static/img/gpsStart.png", new BMap.Size(29, 35));
                        //     var markerStart = new BMap.Marker(point, { icon: icon });
                        //     $this.map.addOverlay(markerStart);
                        //     markerStart.setTop(true, 99999);
                        //
                        //     //结束点
                        //     var icon = new BMap.Icon("/static/img/gpsEnd.png", new BMap.Size(29, 35));
                        //     var endPoint = $this.points[$this.points.length - 1];
                        //     var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                        //     $this.map.addOverlay(markerEnd);
                        //     markerEnd.setTop(true, 99999);
                        //
                        //     //显示车辆
                        //     var iconSize = new BMap.Size(32, 32);
                        //     $this.car = new BMap.Marker(point, { icon: icon = new BMap.Icon("/static/img/car-icon_01.png", iconSize) });
                        //     $this.map.addOverlay($this.car);
                        //
                        //     $this.car.setTop(true, 99999);
                        //
                        //     //gc.getLocation(point, function (rs) { $("#startPoint").text(rs.address); });
                        //
                        //
                        //     //显示小车子
                        //     // $this.label = new BMap.Label("", {offset: new BMap.Size(-20, -20)});
                        //     // $this.car = new BMap.Marker($this.points[0]);
                        //     // $this.car.setLabel($this.label);
                        //     // $this.map.addOverlay($this.car);
                        //
                        //     //点亮操作按钮
                        //     $this.playBtn.disabled = false;
                        //     $this.resetBtn.disabled = false;
                        // });

                    }else {
                        this.$message.error("未查询到车辆轨迹信息！");
                        return;
                    }
                });
            },
            GetVehcTrack(data) {
                var $this = this;
                var vehcpolyline,bluegps;

                var bluepoints = [];
                $this.map.clearOverlays();
                //画整个行程
                if (data.length > 0) {
                    bluegps = data;
                    //开始点
                    var point = new BMap.Point(bluegps[0].corlong, bluegps[0].corlat);
                    setTimeout(function () {
                        $this.map.panTo(point);
                    }, 1500);
                    var icon = new BMap.Icon("/static/img/gpsStart.png", new BMap.Size(29, 35));
                    var markerStart = new BMap.Marker(point, { icon: icon });
                    $this.map.addOverlay(markerStart);
                    markerStart.setTop(true, 99999);
                    //gc.getLocation(point, function (rs) { $("#startPoint").text(rs.address); });

                    // for (var j = 0; j < bluegps.length; j++) {
                    //     var point = new BMap.Point(bluegps[j].corlong, bluegps[j].corlat);
                    //     bluepoints.push(point);
                    // }
                    bluepoints = $this.points;
                    if (bluepoints.length > 0) {
                        var bluepolyline = new BMap.Polyline(bluepoints, { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 0.5 });
                        $this.map.addOverlay(bluepolyline);
                    }

                    //结束点
                    if (data.length > 1) {
                        var icon = new BMap.Icon("/static/img/gpsEnd.png", new BMap.Size(29, 35));
                        var endPoint = new BMap.Point(bluegps[bluegps.length - 1].corlong, bluegps[bluegps.length - 1].corlat);
                        var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                        $this.map.addOverlay(markerEnd);
                        markerEnd.setTop(true, 99999);
                        //gc.getLocation(endPoint, function (rs) { $("#endPoint").text(rs.address); });
                        //$("#PointList").show();
                    }
                    //画超速的线
                    if (data.speedGps) {
                        for (var w = 0; w < data.speedGps.length; w++) {
                            var gps = data.speedGps[w];
                            var speedpoints = [];
                            for (var k = 0; k < gps.length; k++) {
                                speedpoints.push(new BMap.Point(gps[k].VL_LONG, gps[k].VL_LAT));
                                if (k == 0) {
                                    var pointstart = new BMap.Point(gps[k].VL_LONG, gps[k].VL_LAT);
                                    var icon = new BMap.Icon("/Content/assets/img/car-dragracestart.png", new BMap.Size(__seticon.dragracestart, __seticon.dragracestart));
                                    var speedStart = new BMap.Marker(pointstart, { icon: icon });
                                    map.addOverlay(speedStart);
                                }
                            }
                            if (speedpoints.length > 0) {
                                var speedpolyline = new BMap.Polyline(speedpoints, { strokeColor: "#FF6100", strokeWeight: 4 });
                                map.addOverlay(speedpolyline);
                            }
                        }
                    }
                    //画飙车的线
                    if (data.dragraceGps) {
                        for (var f = 0; f < data.dragraceGps.length; f++) {
                            var dragracegps = data.dragraceGps[f];
                            var dragracepoints = [];

                            for (var g = 0; g < dragracegps.length; g++) {
                                dragracepoints.push(new BMap.Point(dragracegps[g].VL_LONG, dragracegps[g].VL_LAT));
                                if (g == 0) {
                                    var pointstart1 = new BMap.Point(dragracegps[g].VL_LONG, dragracegps[g].VL_LAT);
                                    var icon = new BMap.Icon("/Content/assets/img/car-dragracestart.png", new BMap.Size(__seticon.dragracestart, __seticon.dragracestart));
                                    var speedStart1 = new BMap.Marker(pointstart1, { icon: icon });
                                    map.addOverlay(speedStart1);
                                }
                            }
                            if (dragracepoints.length > 0) {
                                var dragracepolyline = new BMap.Polyline(dragracepoints, { strokeColor: "black", strokeWeight: 4 });
                                map.addOverlay(dragracepolyline);
                            }
                        }
                    }

                    //$this.followChk = document.getElementById("follow");
                    $this.playBtn = document.getElementById("play");
                    $this.pauseBtn = document.getElementById("pause");
                    $this.resetBtn = document.getElementById("reset");
                    //speedChoiceBtn = document.getElementById("speedChoice");
                    //点亮操作按钮
                    $this.playBtn.disabled = false;
                    //$("#playImg").attr('src', '/Content/assets/img/vehcTrack/btn_bofang_def.png');

                    //$("#speedChoiceImg").attr('src', '/Content/assets/img/vehcTrack/btn_speed_def.png');


                    //resetBtn.disabled = false;
                    //$("#resetImg").attr('src', '/Content/assets/img/vehcTrack/btn_chong_def.png');


                    var iconSize = new BMap.Size(32, 32);
                    $this.car = new BMap.Marker(bluepoints[0], { icon: icon = new BMap.Icon("/static/img/car-icon_01.png", iconSize) });
                    $this.map.addOverlay($this.car);

                    $this.car.setTop(true, 99999);

                    //单击轨迹列表 显示悬浮框
                    $this.marker1 = new BMap.Marker(bluepoints[0], { icon: icon = new BMap.Icon("/static/img/offline_car.png", iconSize) });
                    $this.map.addOverlay($this.marker1);

                    //点亮操作按钮
                    $this.playBtn.disabled = false;
                    $this.resetBtn.disabled = false;
                }
                else {
                    //toastr.success("当前车辆没有位置信息", "提示信息");
                    return;
                }

                // if (Flag <= 0) //为了防止加载一小段行程
                // {
                //     //单击轨迹li
                //     $(".trackStyle li").on("click", function () {
                //         $(".trackStyle .note").removeClass("note-success");
                //         $(this).find(".note").addClass("note-success");
                //         $(".track-list .note").removeClass("note-success");
                //         map.clearOverlays();
                //         reset();
                //         GetVehcTrack(vehcId, startDate, endDate, plates,flag,startSpeed,endSpeed);
                //     });
                // }
            },
            today() {
                this.searchParam.startTime = [this.dataUtil().format('yyyy-MM-dd HH:mm:ss'), this.dataUtil(1 * 24).format('yyyy-MM-dd HH:mm:ss')];
            },
            yesterday() {
                this.searchParam.startTime = [this.dataUtil(-24, 1).format('yyyy-MM-dd HH:mm:ss'), this.dataUtil(-1).format('yyyy-MM-dd HH:mm:ss')];
            },
            beforeYesterday() {
                this.searchParam.startTime = [this.dataUtil(-48, 1).format('yyyy-MM-dd HH:mm:ss'), this.dataUtil(-24).format('yyyy-MM-dd HH:mm:ss')];
            },
            timeChange() {
                var a = new Date().getTime();
                var b = new Date().getTime() - (this.searchParam.timeSelect * 60 * 60 * 1000);
                this.searchParam.startTime = [new Date(a).format('yyyy-MM-dd HH:mm:ss'), new Date(b).format('yyyy-MM-dd HH:mm:ss')];
            },
            dataUtil(time, type) {
                var date = "";
                if(!time){
                    date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                }else {
                    if(type > 0){
                        date = new Date(new Date(new Date().toLocaleDateString()).getTime() + time * 60 * 60 * 1000);
                    }else {
                        date = new Date(new Date(new Date().toLocaleDateString()).getTime() + time * 60 * 60 * 1000 - 1);
                    }
                }
                return date;
            },
            handleRowChange(row, event, column) {
                var $this = this;
                //clearTimeout(timerclick);
                //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
                var timerclick = setTimeout(function () {
                    var icon;
                    if (row.corlong > 0 || row.corlat > 0) {

                        var pointC = new BMap.Point(row.corlong, row.corlat);
                        var iconSize = new BMap.Size(24, 29);
                        //图标
                        $this.marker1.setZIndex(0);
                        $this.marker1.setPosition(pointC);
                        var p = "";
                        for(var i = 0; i < $this.options4.length; i++){
                            if($this.options4[i].id == $this.plate){
                                p = $this.options4[i].plate;
                                break;
                            }
                        }
                        var content = "<div style='line-height:14px;margin-top: -8px;'><p style='text-align:left '><span style='width:100px;'>车牌：</span>" + (p == null ? '' : p) + "</p>";
                        content += "<p  style='text-align:left '><span style='width:100px;'>方向：</span>" + (row.direction == null ? '' : row.direction) + "</p>";
                        content += "<p  style='text-align:left '><span style='width:100px;'>速度(km/h)：</span>" + (row.speed == null ? '' : row.speed) + "</p>";
                        content += "<p  style='text-align:left '><span style='width:100px;'>GPS时间：</span>" + (row.localtionTime == null ? '' : row.localtionTime) + "</p>";
                        content += "<p  style='text-align:left '><span style='width:100px;'>位置：</span>" + (row.address == null ? '' : row.address) + "</p></div>";
                        var contentObj = { content: content };

                        var opts = {
                            width: 270,     // 信息窗口宽度
                            height: 110,     // 信息窗口高度
                            enableMessage: false,
                            offset: new BMap.Size(0, -20)
                        };

                        var contentStr = contentObj.content;
                        $this.map.panTo(pointC);
                        var infoWindow = new BMap.InfoWindow(contentStr, opts);  // 创建信息窗口对象
                        $this.map.openInfoWindow(infoWindow, pointC); //开启信息窗口
                        var gc = new BMap.Geocoder();
                        gc.getLocation(pointC, function (rs) {
                            infoWindow.setContent(contentStr);
                        });
                    }
                }, 300);
            },
            play() {
                var $this = this;
                $this.table = true;
                $this.playBtn.disabled = true;
                $this.pauseBtn.disabled = false;

                //var point = $this.points[$this.index];
                // var point = $this.dataList[$this.index];
                //if($this.index > 0) {
                //    this.map.addOverlay(new BMap.Polyline([$this.points[$this.index - 1], point], {strokeColor: "red", strokeWeight: 1, strokeOpacity: 1}));
                //}
                //$this.label.setContent("经度: " + point.lng + "<br>纬度: " + point.lat);

                var data = $this.dataList[$this.index];

                if (data.corlong && data.corlat) {
                    var point = new BMap.Point(data.corlong, data.corlat);

                    var icon;
                    var gpsdrct;
                    var iconSize = new BMap.Size(32, 32);

                    if(data.direction){
                        if (data.direction >= 337.5 || data.direction < 22.5) {
                            icon = new BMap.Icon("/static/img/car-icon_05.png", iconSize);
                            gpsdrct = "向北";
                        }
                        else if (data.direction >= 22.5 && data.direction < 67.5) {
                            icon = new BMap.Icon("/static/img/car-icon_04.png", iconSize);
                            gpsdrct = "东北";
                        }
                        else if (data.direction >= 67.5 && data.direction < 112.5) {
                            icon = new BMap.Icon("/static/img/car-icon_03.png", iconSize);
                            gpsdrct = "向东";
                        }
                        else if (data.direction >= 112.5 && data.direction < 157.5) {
                            icon = new BMap.Icon("/static/img/car-icon_02.png", iconSize);
                            gpsdrct = "东南";
                        }
                        else if (data.direction >= 157.5 && data.direction < 202.5) {
                            icon = new BMap.Icon("/static/img/car-icon_01.png", iconSize);
                            gpsdrct = "向南";
                        }
                        else if (data.direction >= 202.5 && data.direction < 247.5) {
                            icon = new BMap.Icon("/static/img/car-icon_08.png", iconSize);
                            gpsdrct = "西南";
                        }
                        else if (data.direction >= 247.5 && data.direction < 292.5) {
                            icon = new BMap.Icon("/static/img/car-icon_07.png", iconSize);
                            gpsdrct = "向西";
                        }
                        else if (data.direction >= 292.5 && data.direction < 337.5) {
                            icon = new BMap.Icon("/static/img/car-icon_06.png", iconSize);
                            gpsdrct = "西北";
                        }
                        $this.car.setIcon(icon);
                    }

                    //加载列表
                    var tableObj = {
                        index: ($this.index + 1),
                        direction: gpsdrct,
                        localtionTime: data.localtionTime,
                        speed: data.speed,
                        corlong: data.corlong,
                        corlat: data.corlat,
                    };
                    $this.getLocation(data.corlong, data.corlat, tableObj);
                    $this.tableList.unshift(tableObj);

                    $this.car.setPosition(point);
                    $this.index++;
                    $this.map.panTo(point);
                    // if($this.followChk.checked) {
                    //     $this.map.panTo(point);
                    // }
                    if($this.index < $this.points.length) {
                        //$this.timer = window.setTimeout($this.play("" + $this.index + ""), 200);
                        $this.timer = window.setTimeout(_=>{
                            this.play("" + $this.index + "");
                        }, $this.playSpeed);
                    } else {
                        $this.playBtn.disabled = true;
                        $this.pauseBtn.disabled = true;
                        this.map.panTo(point);
                    }
                }
            },
            getLocation(long, lat, obj){
                var $this = this;
                var gc = new BMap.Geocoder();
                gc.getLocation(new BMap.Point(long, lat),result =>{
                    if(result){
                        obj.address = result.address;
                    }
                });
            },
            pause() {
                var $this = this;
                $this.playBtn.disabled = false;
                $this.pauseBtn.disabled = true;

                if($this.timer) {
                    window.clearTimeout($this.timer);
                }
            },
            reset() {
                var $this = this;
                $this.tableList = [];
                //$this.followChk.checked = false;
                $this.playBtn.disabled = false;
                $this.pauseBtn.disabled = true;

                if($this.timer) {
                    window.clearTimeout($this.timer);
                }
                $this.index = 0;
                $this.car.setPosition(this.points[0]);
                this.map.panTo($this.centerPoint);
            },
            realTimeTrack() {
                var $this = this;
                if(!$this.plate){
                    $this.$message.error("请输入车牌号！");
                    return;
                }

                if(!this.searchParam.startTime){
                    $this.$message.error("请选择时间！");
                    return;
                }

                var param = "&startTime=" + this.searchParam.startTime[0] + "&endTime=" + this.searchParam.startTime[1]
                    + "&startSpeed=" + this.searchParam.startSpeed + "&endSpeed=" + this.searchParam.endSpeed;
                ajax.get('obd/obdVehicleTrack/trackList?vehicleId=' + this.plate + param).then(rs => {
                    if(rs && rs.data.length < 1){
                        this.$message.error("未查询到车辆轨迹信息！");
                        this.map.clearOverlays();
                        this.vehicleTrackList = "";
                        this.tableList = "";
                        this.table = false;
                        this.vehicleTrackListDisplay = false;
                        this.vehicleTrackListDetail = false;
                        return;
                    }else {
                        this.vehicleTrackList = rs.data;
                        this.vehicleTrackListDisplay = true;
                    }
                });
            },
            remoteMethod(plateKeyWord) {
                var $this = this;
                if (plateKeyWord !== '') {
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword/' + plateKeyWord).then(rs => {
                        if(rs && rs.data.length > 0){
                            setTimeout(() => {
                                this.loading = false;
                                this.options4 = rs.data;
                            }, 200);
                        }
                    })

                } else {
                    this.options4 = [];
                }
            },
            trackListDetail(data){
                var $this = this;
                this.trackListDetailData.startPoint = data.startLat;

                var geoc = new BMap.Geocoder();
                // var lng = data.startLat + "," + data.startLat;
                // var lat = data.endLat + "," + data.endLong;
                var point = new BMap.Point(data.startLong, data.startLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.startPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
                point = new BMap.Point(data.endLong, data.endLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.endPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });

                this.vehicleTrackListDetail = true;

                this.init();
            }
        }
    }
</script>

<style scoped lang="scss">
    .trajectory-list {

        ul.track-list {
            background: #fff;
            padding: 0;
            overflow: auto;
            line-height: 25px;
            font-size: 14px;
            li {
                padding: 10px;
                list-style: none;
                border: 1px solid #eee;
                &:nth-child(n+2) {
                    border-top: 0;
                }
            }
        }

    }
    .list-panel {
        height: auto;
        padding: 20px;
        min-height: 100%;
        display: flex;
        #controller {
            position: absolute;
            z-index: 1;
            right: 350px;
            top: 50px;
            background: #fff;
            border-radius: 5px;
            height: 30px;
            line-height: 30px;
            width: 200px;
            input {
                background: #fff;
                color: #76b6fd;
                border: 0;
                outline: 0;
                cursor: pointer;
                &[disabled] {
                    color: #ccc;
                    cursor: default;
                }
            }
            .el-dropdown {
                color: #76b6fd;
                padding: 0 4px;
            }
        }

        .left-box {
            width: calc(100% - 300px);
            #map {
                width: 100%;
                height: 500px;
                padding: 0;
            }
            .table-box {
                width: 100%;
                padding: 0;
            }
        }

        .right-box {
            padding-left: 10px;
            width: 300px;
            float: right;
            .el-button{
                margin-left: 0;
                padding-left: 8px;
                padding-right: 8px;
            }
            .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
        }
    }

    .el-slider {
        padding: 0 10px;
        /deep/ .el-slider__runway {
            margin: 8px 0;
        }
    }
    .tool-box {
        padding: 0;
    }
</style>

