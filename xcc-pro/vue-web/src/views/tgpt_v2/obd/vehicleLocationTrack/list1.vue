<template>
    <div class="app-container white-bg list-panel trajectory-list position" v-cloak>

        <div id="controller" align="center">
            <!--<input id="follow" type="checkbox" /><span style="font-size:12px;">画面跟随</span>-->
            <input id="play" type="button" value="播放" @click="play()" disabled />
            <input id="pause" type="button" value="暂停" @click="pause()" disabled />
            <input id="reset" type="button" value="重置" @click="reset()" disabled />
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">速度</span>
                <el-dropdown-menu slot="dropdown" style="overflow: hidden">
                    <el-slider style="width: 300px" v-model="playSpeed" :step="100" :min="100" :max="1000"
                               show-stops></el-slider>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <div class="left-box">
            <!-- <ve-bmap :settings="mapSetting" :after-set-option-once="initialize" height="100%"
                style="width: 100%;height: 100%;">
            </ve-bmap> -->
            <div id="map" style="height: calc(100vh - 120px)"></div>
            <div class="table-box">
                <el-table v-loading="listLoading" border height="400px" :data="tableList" v-show="table" @row-click="handleRowChange">
                    <el-table-column prop="index" label="序号" width="50"> </el-table-column>
                    <el-table-column prop="direction" label="方向" width="60"> </el-table-column>
                    <el-table-column prop="locationTime" label="GPS时间" width="160"> </el-table-column>
                    <el-table-column prop="speed" label="速度(km/h)" width="100"> </el-table-column>
                    <el-table-column prop="corlong" label="经度" width="180"> </el-table-column>
                    <el-table-column prop="corlat" label="纬度" width="180"> </el-table-column>
                    <el-table-column prop="address" label="位置描述"> </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="right-box">
            <template >
                <div class="right-box-group">
                    <div class="group-left">
                        <el-radio v-model="equType" label="1">有线</el-radio>
                        <el-radio v-model="equType" label="2">无线</el-radio>
                    </div>
                    <div class="group-right">
                        <el-button type="primary" size="small" @click="realTimeTrack()">查询</el-button>
                    </div>
                </div>
            </template>
            <div class="item" style="margin-top: 10px;">
                <el-select
                    v-model="plate"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="请输入车牌号(大于3位数)"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                        v-for="(item,i) in options4"
                        :key="i"
                        :label="item.plate"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="item">
                <el-button size="small" @click="beforeYesterday">前天</el-button>
                <el-button size="small" @click="yesterday">昨天</el-button>
                <el-button size="small" @click="today">今天</el-button>
                <el-select v-model="searchParam.timeSelect" @change="timeChange" style="width: 120px">
                    <el-option
                        v-for="(item,i) in searchParam.timeSelectList"
                        :key="i"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                    </el-option>
                </el-select>
            </div>
            <!--<el-date-picker type="date" v-model="searchParam.startTime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>-->
            <!--<el-date-picker type="date" v-model="searchParam.endTime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>-->
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
            <div class="item" v-if="equType == 1">
                <el-input placeholder="最小速度 km/h" style="width: 48%" v-model="searchParam.startSpeed" clearable></el-input>
                <el-input placeholder="最大速度 km/h" style="width: 48%" v-model="searchParam.endSpeed" clearable></el-input>
            </div>
            <!--<div class="item" v-if="equType == 1">-->
                <!--<el-checkbox >显示行程</el-checkbox>-->
            <!--</div>-->
            <div v-if="wiredEquList && wiredEquList.length > 1">
                <p>设备imei:{{wiredEquList.length}}</p>
                <el-divider></el-divider>
                <el-radio-group v-model="imei" @change="changeImei" style="width: 100px;">
                    <el-radio v-for="equ in wiredEquList"  :key="equ.imei" :label="equ.imei" style="margin-top: 5px">{{equ.imei}}</el-radio>
                </el-radio-group>
            </div>

            <ul class="track-list" v-show="vehicleTrackListDetail" v-if="equType == 1">
                <li>
                    <div>起点</div>
                    <div style="color: green;">{{trackListDetailData.startPoint}}</div>
                    <div>终点</div>
                    <div style="color: red;">{{trackListDetailData.endPoint}}</div>
                </li>
            </ul>

            <div v-show="vehicleTrackListDisplay" class="data-list" v-if="equType == 1">
                <div style="font-size: 18px;">历史行程:{{vehicleTrackList.length}}条</div>
                <ul class="track-list">
                    <li v-for="(item,i) in vehicleTrackList" :key="i" :class="{'active':item.id == activeId}" @click="trackListDetail(item)">
                        <div>始：{{item.startTime}}</div>
                        <div>止：{{item.endTime}}</div>
                        <div>长：{{item.totalTime}}</div>
                        <div>{{item.totalMileage?(item.totalMileage/1000).toFixed(2):'0'}}km {{item.speed?item.speed:0}}km/h {{item.totalOil?item.totalOil:0}}L</div>
                    </li>
                </ul>
            </div>

            <div  class="data-list" v-if="equType == 2">
                <h4 >设备列表:{{equList.length}}</h4>
                <ul class="track-list">
                    <li v-for="(item,i) in equList" :key="i" :class="{'active':item.id == activeId}" @click="equDetail(item)">
                        <div>设备号：{{item.imei}}</div>
                    </li>
                </ul>
            </div>

        </div>

    </div>

</template>

<script>
    // import veBmap from 'v-charts/lib/bmap.common'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool, mapTool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'


    let $this;
    export default {
        name: 'vehicleLocationTrack',
        mixins: [tool, mapTool],
        components: { TreeSelect },
        data() {
            return {
                activeId:"",
                imei: "",
                wiredEquList:[], /* 有线设备列表 */
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
                playSpeed: 300,  //播放速度
                pamVehicleId:this.$route.query.vehicleId,
                pamPlate:this.$route.query.plate,
                /*设备类型*/
                equType: this.$route.query.equType ? this.$route.query.equType : '1',
                /*无线设备*/
                equList:[]
            }
        },
        mounted() {
            $this = this;
            this.$nextTick(()=>{
               this.initialize()
            })
           // window.initialize = this.initialize;
           // var script = document.createElement("script");
          //  script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
           // document.body.appendChild(script);

        },
        methods: {
            open() {
                if(this.pamVehicleId!=undefined && this.pamVehicleId!='' && this.pamPlate!=undefined && this.pamPlate!=''){
                    this.remoteMethod(this.pamPlate);
                    this.plate=this.pamVehicleId;
                    this.today();
                    this.realTimeTrack();
                }
            },
            parseTime(seconds){
                if(seconds){
                   var hour=parseInt(seconds/3600);
                   var min=parseInt((seconds-hour*3600)/60);
                   var sec=seconds%60;
                   return this.addZero(hour)+":"+this.addZero(min)+":"+this.addZero(sec);
                }else{
                    return "00:00:00";
                }
            },
            addZero(s){
               return s<10?"0"+s:""+s;
            },

            initialize(echarts){

                // this.points = [
                //     new BMap.Point(114.00100, 22.550000), new BMap.Point(114.00130, 22.550000),
                //     new BMap.Point(114.00160, 22.550000), new BMap.Point(114.00200, 22.550000),
                //     new BMap.Point(114.00300, 22.550500), new BMap.Point(114.00400, 22.550000),
                //     new BMap.Point(114.00500, 22.550000), new BMap.Point(114.00505, 22.549800),
                //     new BMap.Point(114.00510, 22.550000), new BMap.Point(114.00515, 22.550000),
                //     new BMap.Point(114.00525, 22.550400), new BMap.Point(114.00537, 22.549500)
                // ];

                //初始化地图,选取第一个点为起始点
                //this.map = new BMap.Map('map');
                // var geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(function(r){
                //     $this.map.centerAndZoom(new BMap.Point(r.longitude, r.latitude), 11);
                // });
                // this.map = echarts.getModel().getComponent('bmap').getBMap()
                this.map = new BMap.Map('map');
                $this.map.centerAndZoom(new BMap.Point(114.00510, 22.550000), 11);
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                this.map.addControl(new BMap.ScaleControl());

                this.open();
                //this.init();
            },
            init(startTime,endTime,imei) {
                $this.points = [];
                var param = `&startTime=${startTime}&endTime=${endTime}&equType=${this.equType}&imei=${imei}`;
                ajax.get('obd/obdVehicleTrack/track?vehicleId='+this.plate + param).then(rs => {
                    if(rs && rs.data!='' && Array.isArray(rs.data)){
                        for(var i = 0; i < rs.data.length; i++){
                            rs.data[i].locationTime=this.getTimeDate(rs.data[i].locationTime);
                            $this.points.push(new BMap.Point(rs.data[i].corlong, rs.data[i].corlat));
                        }
                        $this.dataList = rs.data;
                        $this.GetVehcTrack($this.dataList);
                        this.pause();
                        $this.index=0;
                        $this.tableList=[];
                    }else {
                        this.$message.error("未查询到车辆轨迹信息！");
                        return;
                    }
                });
            },
            GetVehcTrack(data) {
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
                    /*if (data.speedGps) {
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
                    }*/
                    //画飙车的线
                    /*if (data.dragraceGps) {
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
                    }*/

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

                   /* //单击轨迹列表 显示悬浮框
                    $this.marker1 = new BMap.Marker(bluepoints[0], { icon: icon = new BMap.Icon("/static/img/offline_car.png", iconSize) });
                    $this.map.addOverlay($this.marker1);*/

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
                debugger
                var a = new Date().getTime();
                var b = new Date().getTime() - (this.searchParam.timeSelect * 60 * 60 * 1000);
                this.searchParam.startTime = [new Date(b).format('yyyy-MM-dd HH:mm:ss'), new Date(a).format('yyyy-MM-dd HH:mm:ss')];
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
                        content += "<p  style='text-align:left '><span style='width:100px;'>GPS时间：</span>" + (row.locationTime == null ? '' : row.locationTime) + "</p>";
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
                        locationTime: data.locationTime,
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
                var gc = new BMap.Geocoder();
                gc.getLocation(new BMap.Point(long, lat),result =>{
                    if(result){
                        obj.address = result.address;
                    }
                });
            },
            pause() {
                $this.playBtn.disabled = false;
                $this.pauseBtn.disabled = true;

                if($this.timer) {
                    window.clearTimeout($this.timer);
                }
            },
            reset() {
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

            /*切换imei*/
            changeImei(){
                var param = "&startTime=" + this.searchParam.startTime[0] + "&endTime=" + this.searchParam.startTime[1]
                    + "&startSpeed=" + this.searchParam.startSpeed + "&endSpeed=" + this.searchParam.endSpeed + "&equType=" +this.equType ;
                const loading = this.$loading({fullscreen: false, lock: true, background: 'rgba(255, 255, 255, 0.6)', target: document.querySelector('#map') });
                setTimeout(() => {
                    loading.close();
                }, 10000);
                this.getWriedTrackList(param , loading);
            },


            realTimeTrack() {
                if(!$this.plate){
                    $this.$message.error("请输入车牌号！");
                    return;
                }

                if(!this.searchParam.startTime){
                    $this.$message.error("请选择时间！");
                    return;
                }
                var param = "&startTime=" + this.searchParam.startTime[0] + "&endTime=" + this.searchParam.startTime[1]
                    + "&startSpeed=" + this.searchParam.startSpeed + "&endSpeed=" + this.searchParam.endSpeed + "&equType=" +this.equType ;

                const loading = this.$loading({fullscreen: false, lock: true, background: 'rgba(255, 255, 255, 0.6)', target: document.querySelector('#map') });
                setTimeout(() => {
                    loading.close();
                }, 10000);

                /*有线设备*/
                if(this.equType == 1){
                    // 首先根据车辆id获取设备信息
                    ajax.get('obd/obdVehicleTrack/wriedEquList?vehicleId=' + this.plate + param).then(rs => {
                        if(rs.status == 0){
                            if(rs.data && rs.data.length > 0){
                                this.wiredEquList = rs.data;
                                this.imei = this.wiredEquList[0].imei;
                                this.getWriedTrackList(param , loading);
                            }else{
                                this.$message.error("未查询到车辆行程信息！");
                            }
                        }
                    });
                }else{
                   /*无线设备*/
                    ajax.get('obd/obdVehicleTrack/equList?vehicleId=' + this.plate + param).then(rs => {
                        loading.close();
                        if(rs && rs.data.length < 1){
                            this.$message.error("未查询到车辆轨迹信息！");
                            this.map.clearOverlays();
                            this.equList = [];
                            return;
                        }else {
                            this.equList = rs.data;
                            this.equDetail(this.equList[0])
                        }
                    }).catch(_ => {
                        loading.close();
                    });
                }
            },
            /*
            * 根据imei号获取车辆行程
            * */
            getWriedTrackList(param , loading){
                ajax.get('obd/obdVehicleTrack/trackListByImei?imei=' + this.imei + param).then(rs => {
                    loading.close();
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
                        this.opentrackListDetail(this.vehicleTrackList[0]);
                        this.vehicleTrackListDisplay = true;
                    }
                }).catch(_ => {
                    loading.close();
                });
            },


            remoteMethod(plateKeyWord) {
                if (plateKeyWord !== '') {
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword?' + 'plate='+plateKeyWord).then(rs => {
                        if(rs && rs.data!=''&& rs.data.length > 0){
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

            /*无线设备轨迹定位信息*/
            equDetail(item){
                this.activeId = item.id;
                this.init(this.searchParam.startTime[0],this.searchParam.startTime[1],item.imei);
            },

            trackListDetail(item){

                this.activeId = item.id;
                this.trackListDetailData.startPoint = item.startLat;
                var geoc = new BMap.Geocoder();
                // var lng = item.startLat + "," + item.startLat;
                // var lat = item.endLat + "," + item.endLong;
                var point = new BMap.Point(item.startLong, item.startLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.startPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
                point = new BMap.Point(item.endLong, item.endLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.endPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });

                this.vehicleTrackListDetail = true;
                this.init(item.startTime,item.endTime,item.imei);
            },
            opentrackListDetail(item){

                this.activeId = item.id;
                this.trackListDetailData.startPoint = item.startLat;
                var geoc = new BMap.Geocoder();
                // var lng = item.startLat + "," + item.startLat;
                // var lat = item.endLat + "," + item.endLong;
                var point = new BMap.Point(item.startLong, item.startLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.startPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
                point = new BMap.Point(item.endLong, item.endLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.endPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });

                this.vehicleTrackListDetail = true;
                this.init(item.startTime,item.endTime,item.imei);
            },
            getTimeDate(time){
                let date = new Date();
                date.setTime(time);
                return  date.format("yyyy-MM-dd HH:mm;ss");
            }
        }
    }
</script>


<style scoped lang="scss">
    .data-list {
        height: calc(100vh - 545px);
        .track-list {
            height: calc(100% - 50px);
            overflow-y: auto;
            li{
                cursor: pointer;
            }
            li.active{
                position: relative;
                &:before {
                    content: "";
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 5px;
                    height: 100%;
                    background: #409EFF;
                }
            }
        }
    }
    .trajectory-list {

        ul.track-list {
            background: #fff;
            padding: 0;
            overflow: auto;
            line-height: 25px;
            font-size: 14px;
            li {
                padding: 10px 15px;
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
        #controller {
            position: absolute;
            z-index: 200;
            right: 10px;
            top: 35px;
            background: #fff;
            border-radius: 5px;
            height: 30px;
            line-height: 30px;
            width: 200px;
            box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.18);
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
            width: 100%;
            height: calc(100vh - 120px);
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
            padding: 10px;
            width: 300px;
            position: absolute;
            top: 35px;
            left: 35px;
            background: #fff;
            box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.18);
            .right-box-group{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
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

