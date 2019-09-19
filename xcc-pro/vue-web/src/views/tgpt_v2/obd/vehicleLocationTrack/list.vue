<template>
    <div class="app-container white-bg list-panel trajectory-list position" :class="{'small':!changeRightBox}" v-cloak>
        <div class="left-box">
            <div class="map_table">
                <div id="controller" align="center" :style="{right:'10px'}">
                    <input id="play" type="button" value="播放" @click="equType == 1?play():wirelessPlay()" disabled />
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
                <div id="map"></div>
                <div class="table-box" id="data-list" v-show="tableList.length">
                    <div v-drag class="line"></div>
                    <ul class="table-list" :style="{height:elTableHeight+'px'}">
                            <li class="t-head">
                                <span class="index">序号</span>
                                <span class="direction">方向</span>
                                <span class="locationTime">GPS时间</span>
                                <span class="speed">速度(km/h)</span>
                                <span class="corlong">经度</span>
                                <span class="corlat">纬度</span>
                                <span class="address">位置描述</span>
                            </li>
                            <li v-for="(item,i) in tableList" :key="i" class="t-body" @click="handleRowChange(item)" @dblclick="delMarker1">
                                <span :title="item.index" class="index">{{item.index}}</span>
                                <span :title="item.direction" class="direction">{{item.direction}}</span>
                                <span :title="item.locationTime" class="locationTime">{{item.locationTime}}</span>
                                <span :title="item.speed" class="speed">{{item.speed}}</span>
                                <span :title="item.corlong" class="corlong">{{item.corlong}}</span>
                                <span :title="item.corlat" class="corlat">{{item.corlat}}</span>
                                <span :title="item.address" class="address" :style="{width:(tableList.length+1)*27 > elTableHeight?'calc(30% - 13px)':'30%'}">{{item.address}}</span>
                            </li>
                    </ul>
                </div>
            </div>
            <!-- <div v-show="vehicleTrackListDisplay" id="data-list" :class="{'flex':mode}" :style="{height:mode?dataListHeight?dataListHeight:'210px':'',width:!mode?!shrink?'350px':0:''}" class="data-list" v-if="equType == 1"> -->
            <div v-show="vehicleTrackListDisplay" :style="{minWidth:!shrink?'350px':0}" class="data-list" v-if="equType == 1">
                <!-- <div v-drag class="line"></div> -->
                <div class="shrink" @click="shrink = !shrink">{{!shrink?'收起':'展开'}}</div>
                <div v-show="!shrink" style="font-size: 16px;padding: 10px">历史行程:{{vehicleTrackList.length}}条&nbsp;&nbsp;&nbsp;已选:{{activeIds.length}}条
                    <!-- <el-dropdown style="float: right;margin-right: 12px;" trigger="click">
                        <span class="el-dropdown-link" style="color:#409EFF">
                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item ><el-button type="text" size="small" @click="mode = !mode">{{mode?'右侧展示':'底部展示'}}</el-button></el-dropdown-item>
                            <el-dropdown-item ><el-button type="text" size="small" @click="onShowTime">{{showTime?'隐藏时间':"显示时间"}}</el-button></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                    <a class="play" style="float: right;margin-right: 12px;" @click="onShowTime">{{showTime?'隐藏时间':"显示时间"}}</a>
                    <a class="play" :disabled="vehicleTrackList.length == 1" style="float: right;margin-right: 12px;" @click="handleCheckAll">{{!checked?'播放全部':"取消播放"}}</a>
                    </div>
                <ul v-show="!shrink" class="track-list" :class="{'noClicking':checked}">
                    <li v-for="(item,i) in vehicleTrackList" :key="i" :class="{'active':has(item)}" @click="trackListDetail(item)">
                        <div><p :title="item.startTime">开始时间:{{item.startTime}}</p><p :title="item.startAddress">地址:{{item.startAddress}}</p></div>
                        <div><p :title="item.endTime">结束时间:{{item.endTime}}</p><p :title="item.endAddress">地址:{{item.endAddress}}</p></div>
                        <div>时长:{{item.totalTime}}</div>
                        <div>里程:{{item.totalMileage?(item.totalMileage/1000).toFixed(2):'0'}}km 速度:{{item.speed?item.speed:0}}km/h 油耗:{{item.totalOil?item.totalOil:0}}L</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-box right-small">
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
                    placeholder="请输入"
                    :remote-method="remoteMethod"
                    :no-data-text="dataText"
                    :loading="plateLoading">
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
            <div v-if="wiredEquList && wiredEquList.length > 1 && equType == 1" style="margin-bottom:10px;">
                <p style="border-bottom:1px solid #eee;padding-bottom: 10px;margin-bottom: 0;">设备imei:{{wiredEquList.length}}</p>
                <el-radio-group v-model="imei" @change="changeImei" style="width: 100px;">
                    <el-radio v-for="equ in wiredEquList"  :key="equ.imei" :label="equ.imei" style="margin-top: 5px">{{equ.imei}}</el-radio>
                </el-radio-group>
            </div>
            <ul class="track-list" v-show="vehicleTrackListDetail" v-if="equType == 1">
                <li>
                    <div>起点</div>
                    <div>{{trackListDetailData.startTime}}</div>
                    <div style="color: green;">{{trackListDetailData.startPoint}}</div>
                    <div>终点</div>
                    <div >{{trackListDetailData.endTime}}</div>
                    <div style="color: red;">{{trackListDetailData.endPoint}}</div>
                </li>
            </ul>
            <div  class="data-list equData-list" v-if="equType == 2">
                <h4 >设备列表:{{equList.length}}</h4>
                <ul class="track-list">
                    <li v-for="(item,i) in equList" :key="i" :class="{'active':item.id == activeId}" @click="equDetail(item)">
                        <div>设备号：{{item.imei}}</div>
                    </li>
                </ul>
            </div>
            <span style="line-height: 21px;margin:0" v-show="!changeRightBox">{{plate | plateName(options4)}}</span>
            <span v-show="vehicleTrackList.length || equList.length" class="shrink" @click="changeRightBox = !changeRightBox"><SvgIcon :class="!changeRightBox?'open':'retract'" :iconClass="!changeRightBox?'open':'retract'"/><el-button type="text">{{!changeRightBox?'展开':'收起'}}</el-button></span>
        </div>
    </div>

</template>

<script>
    // import veBmap from 'v-charts/lib/bmap.common'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool, mapTool} from '@/utils/common'
	import {startProcessAsync, deepClone} from '@/utils/index'
    import $ from 'jquery-slim'
    import SvgIcon from '@/components/SvgIcon/index'

    let pointsList = [];
    let $this;
    export default {
        name: 'vehicleLocationTrack',
        mixins: [tool, mapTool],
        components: { TreeSelect, SvgIcon },
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
                plateLoading:false,
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
                equList:[],
                activeIds:[],
                num:0, //记录播放到第几段轨迹
                changeRightBox:true,
                checked:false,
                bPoints:[],
                dataText:'无数据',
                hasPlay:false,
                pList:[],
                mode: false,
                dataListHeight:0,
                shrink:false,
                showTime:false,
                startPoint:null,
                hasLong:false,
                elTableHeight:240,
                timerclick:null,
                serialNumber:0
            }
        },
        mounted() {
            $this = this;
            this.$nextTick(()=>{
               this.initialize()
            })
        },
        filters:{
            plateName:function(plateId,list){
                var plate = ''
                if(plateId){
                    list.forEach(item=>{
                        if(item.id == plateId){
                            plate = item.plate
                        }
                    })
    　　　　　　　　return plate
                }
　　　　　　}
        },
        directives:{
            drag(el, bindings){
                el.onmousedown = function(e){
                    var disy = e.pageY - el.offsetTop;
                    document.onmousemove = function (e){
                        el.style.top = e.pageY - disy + 'px';
                    }
                    document.onmouseup = function(){
                        const tableDiv = $('#data-list')
                        let tableHeight = tableDiv.height()
                        // tableDiv[0].style.height = tableHeight - parseInt(el.style.top) + 'px';
                        // $this.dataListHeight = tableHeight - parseInt(el.style.top) + 'px';
                        $this.elTableHeight = tableHeight - parseInt(el.style.top);
                        el.style.top = '-14px';
                        document.onmousemove = document.onmouseup = null;
                    }
                }
            }
        },
        methods: {
            handleCheckAll() {
                this.checked = !this.checked;
                $this.points = []
                $this.index = 0
                $this.hasPlay = false;
                $this.num = 0
                this.activeIds = []
                if(this.checked){
                    this.toggleAll(this.vehicleTrackList)
                    $this.setGeoc();
                    $this.init($this.activeIds[0].startTime,$this.activeIds[0].endTime,$this.activeIds[0].imei,$this.activeIds[0]).then(()=>{
                        this.reset();
                        this.play();
                    })
                }else{
                    this.vehicleTrackListDetail = false;
                    this.reset();
                    this.clearDisableMass()
                    $this.map.clearOverlays();
                }
            },
            has: item => {
                return $this.activeIds.some(_item=>{
                    return _item.id == item.id
                })
            },
            toggle: item => {
                const exist = $this.has(item)
                if (exist) {
                    $this.remove(item)
                } else {
                    $this.add(item)
                }
                $this.activeIds.sort((a,b)=>{
                    return new Date(a.startTime.replace(/-/g,'/')).getTime() - new Date(b.startTime.replace(/-/g,'/')).getTime()
                })
            },
            toggleAll: list => {
                const allChecked = $this.hasAll(list)
                const toAllChecked = !allChecked
                if (toAllChecked) {
                    $this.addList(list)
                } else {
                    $this.removeList(list)
                }
                $this.activeIds.sort((a,b)=>{
                    return new Date(a.startTime.replace(/-/g,'/')).getTime() - new Date(b.startTime.replace(/-/g,'/')).getTime()
                })
            },
            hasAll: list => {
                let idList = list.map(_item => {
                    return _item.id
                })
                let idList2 = $this.activeIds.map(_item => {
                    return _item.id
                })
                let helper = {}
                idList2.forEach(id => {
                    helper[id] = true
                })
                const result = idList.every(id => {
                    return helper[id]
                })
                return result
            },
            removeList: list => {
                var helper = {}
                $this.activeIds.forEach(_item => {
                    helper[id] = _item
                })
                list.forEach(_item => {
                    if (helper[_item.id]) {
                        delete helper[_item.id]
                    }
                })
                var result = []
                for (let key in helper) {
                    result.push(helper[key])
                }
                $this.$set($this,'activeIds',result)
            },
            addList: list => {
                const concatedList = list.concat($this.activeIds)
                let helper = {}
                concatedList.forEach((item, index) => {
                    helper[item.id] = item
                })
                let result = []
                for (let key in helper) {
                    result.push(helper[key])
                }
                $this.$set($this,'activeIds',result)

            },
            remove: item => {
                $this.activeIds = $this.activeIds.filter(_item => {
                    return item.id != _item.id
                })
            },
            add: item => {
                if ($this.has(item)) return
                $this.activeIds.push(item)
            },
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
                this.map = new BMap.Map('map');
                $this.map.centerAndZoom(new BMap.Point(114.00510, 22.550000), 11);
                this.map.enableScrollWheelZoom();
                this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                this.map.addControl(new BMap.ScaleControl());
                this.open();
            },
            pointsSort(){
                $this.points.sort((a,b)=>{
                    return new Date(a.startTime.replace(/-/g,'/')).getTime() - new Date(b.startTime.replace(/-/g,'/')).getTime()
                })
            },
            getPoints(data){
                let list = []
                for(var i = 0; i < data.length; i++){
                    list.push(new BMap.Point(data[i].corlong, data[i].corlat));
                }
                return list
            },
            init(startTime,endTime,imei,item) {
                if(this.equType == 2){
                    $this.points = []
                }
                var param = `&startTime=${startTime}&endTime=${endTime}&equType=${this.equType}&imei=${imei}`;
                return new Promise((resolve,reject)=>{
                    ajax.get('obd/obdVehicleTrack/track?vehicleId='+this.plate + param).then(rs => {
                        if(this.activeIds.length == 1){
                            $this.points = []
                        }
                        if(rs && rs.data!='' && Array.isArray(rs.data)){
                            $this.points.push({
                                id:item.id,
                                startTime:item.startTime,
                                data:rs.data,
                                points:$this.getPoints(rs.data)
                            })
                            if(!this.checked){
                                if(this.equType == 1){
                                    $this.pointsSort()
                                }
                                $this.GetVehcTrack();
                                this.pause();
                            }
                            resolve()
                        }else {
                            this.$message.error("未查询到车辆轨迹信息！");
                            this.toggle(item)
                            reject()
                        }
                    });
                })
            },
            onShowTime(){
                this.showTime = !this.showTime;
                if(!this.hasPlay){
                    this.GetVehcTrack();
                }else{
                    // this.clearDisableMass();
                    $this.addLine($this.bPoints);//隐藏时间，重新画线
                }
            },
            GetVehcTrack() {
                var bluepoints = [];
                //画整个行程
                bluepoints = $this.points;
                this.clearDisableMass();
                $this.map.clearOverlays();
                if (bluepoints.length > 0) {
                    //起点
                    var point = new BMap.Point(bluepoints[0].data[0].corlong, bluepoints[0].data[0].corlat);
                    setTimeout(function () {
                        $this.map.panTo(point);
                    }, 1000);
                    var icon = new BMap.Icon("/static/img/gpsStart.png", new BMap.Size(29, 35));
                    $this.markerStart = new BMap.Marker(point, { icon: icon });
                    $this.markerStart.addEventListener("click", ()=>{
                        $this.openInfoWindow(point,bluepoints[0].data[0]);
                    });
                    $this.map.addOverlay($this.markerStart);
                    $this.markerStart.setTop(true,9999);
                    for(var i=0;i<bluepoints.length;i++){
                        if(this.showTime){
                            const data = bluepoints[i].data;
                            for(var k=0;k<data.length;k++){
                                const _d = data[k];
                                if(k != 0 && k < data.length-1 && k%6 == 0 ){
                                    let label = new BMap.Label("时间:"+new Date(_d.locationTime*1).format('yyyy-MM-dd HH:mm:ss'),{offset:new BMap.Size(20,-5)});
                                    let marker = new BMap.Marker(new BMap.Point(_d.corlong,_d.corlat));
                                    label.addEventListener("mouseover", event=>{
                                        marker.setTop(true);
                                    });
                                    label.addEventListener("mouseout", event=>{
                                        marker.setTop(false);
                                    });
                                    marker.addEventListener("click", ()=>{
                                        $this.openDetarInfoWindow(_d);
                                    });
                                    $this.map.addOverlay(marker);  //添加标注    
                                    marker.setLabel(label);  //添加标签
                                }
                            }
                        }
                        var bluepolyline = new BMap.Polyline(bluepoints[i].points, { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 0.5 });
                        $this.map.addOverlay(bluepolyline);

                        if (bluepoints.length > 1) {
                            if(i > 0){
                                //起点 停车点
                                var icon = new BMap.Icon("/static/img/stop.png", new BMap.Size(29, 35));
                                var endPoint = new BMap.Point(bluepoints[i].data[0].corlong, bluepoints[i].data[0].corlat);
                                var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                                (function(i){
                                    markerEnd.addEventListener("click", ()=>{
                                        var new_endPoint = new BMap.Point(bluepoints[i].data[0].corlong, bluepoints[i].data[0].corlat);
                                        $this.openInfoWindow(new_endPoint,bluepoints[i].data[0]);
                                    });
                                })(i)
                                $this.map.addOverlay(markerEnd);
                                markerEnd.setTop(true,9998);
                            }
                            if(i < bluepoints.length-1){
                                // 结束 停车点
                                var icon = new BMap.Icon("/static/img/stop.png", new BMap.Size(29, 35));
                                var endPoint = new BMap.Point(bluepoints[i].data[bluepoints[i].data.length - 1].corlong, bluepoints[i].data[bluepoints[i].data.length - 1].corlat);
                                var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                                 (function(i){
                                    markerEnd.addEventListener("click", ()=>{
                                        var new_endPoint = new BMap.Point(bluepoints[i].data[bluepoints[i].data.length - 1].corlong, bluepoints[i].data[bluepoints[i].data.length - 1].corlat);
                                        $this.openInfoWindow(new_endPoint,bluepoints[i].data[bluepoints[i].data.length - 1]);
                                    });
                                })(i)
                                $this.map.addOverlay(markerEnd);
                                markerEnd.setTop(true,9998);
                            }
                        }
                    }
                    //结束点
                    var icon = new BMap.Icon("/static/img/gpsEnd.png", new BMap.Size(29, 35));
                    var endPoint = new BMap.Point(bluepoints[bluepoints.length-1].data[bluepoints[bluepoints.length-1].data.length - 1].corlong, bluepoints[bluepoints.length-1].data[bluepoints[bluepoints.length-1].data.length - 1].corlat);
                    var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                    markerEnd.addEventListener("click", ()=>{
                            this.openInfoWindow(endPoint,bluepoints[bluepoints.length-1].data[bluepoints[bluepoints.length-1].data.length - 1]);
                        });
                    $this.map.addOverlay(markerEnd);
                    markerEnd.setTop(true,9999);

                    $this.playBtn = document.getElementById("play");
                    $this.pauseBtn = document.getElementById("pause");
                    $this.resetBtn = document.getElementById("reset");
                    //点亮操作按钮
                    $this.playBtn.disabled = false;

                    if(this.equType == 2){
                        var iconSize = new BMap.Size(32, 32);
                        $this.car = new BMap.Marker(bluepoints[0].points[0], { icon: icon = new BMap.Icon("/static/img/car-icon_01.png", iconSize) });
                        $this.map.addOverlay($this.car);
                        $this.car.setTop(true, 9999);
                    }

                    //点亮操作按钮
                    $this.resetBtn.disabled = false;
                }else {
                    return;
                }
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
                this.searchParam.startTime = [new Date(b).format('yyyy-MM-dd HH:mm:ss'), new Date(a).format('yyyy-MM-dd HH:mm:ss')];
            },
            dataUtil(time, type) {
                var date = "";
                if(!time){
                    date = new Date(new Date(new Date().toLocaleDateString().replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,'')).getTime());
                }else {
                    if(type > 0){
                        date = new Date(new Date(new Date().toLocaleDateString().replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,'')).getTime() + time * 60 * 60 * 1000);
                    }else {
                        date = new Date(new Date(new Date().toLocaleDateString().replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,'')).getTime() + time * 60 * 60 * 1000 - 1);
                    }
                }
                return date;
            },
            delMarker1(){
                clearTimeout(this.timerclick);
                this.map.removeOverlay($this.marker1);
            },
            handleRowChange(row) {
                //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
                clearTimeout(this.timerclick);
                this.timerclick = setTimeout(function () {
                    var icon;
                    if (row.corlong > 0 && row.corlat > 0) {

                        var pointC = new BMap.Point(row.corlong, row.corlat);
                        var iconSize = new BMap.Size(39, 39);
                        //图标
                        if(!$this.marker1 || !$this.marker1.map){
                            $this.marker1 = new BMap.Marker(pointC, { icon: icon = new BMap.Icon("/static/img/offline_car.png", iconSize) });
                            $this.map.addOverlay($this.marker1);
                        }else{
                            $this.marker1.setTop(true);
                            $this.marker1.setPosition(pointC);
                        }
                        // var p = "";
                        // for(var i = 0; i < $this.options4.length; i++){
                        //     if($this.options4[i].id == $this.plate){
                        //         p = $this.options4[i].plate;
                        //         break;
                        //     }
                        // }
                        // var content = "<div style='line-height:14px;margin-top: -8px;'><p style='text-align:left '><span style='width:100px;'>车牌：</span>" + (p == null ? '' : p) + "</p>";
                        // content += "<p  style='text-align:left '><span style='width:100px;'>方向：</span>" + (row.direction == null ? '' : row.direction) + "</p>";
                        // content += "<p  style='text-align:left '><span style='width:100px;'>速度(km/h)：</span>" + (row.speed == null ? '' : row.speed) + "</p>";
                        // content += "<p  style='text-align:left '><span style='width:100px;'>GPS时间：</span>" + (row.locationTime == null ? '' : row.locationTime) + "</p>";
                        // content += "<p  style='text-align:left '><span style='width:100px;'>位置：</span>" + (row.address == null ? '' : row.address) + "</p></div>";
                        // var contentObj = { content: content };

                        // var opts = {
                        //     width: 270,     // 信息窗口宽度
                        //     height: 110,     // 信息窗口高度
                        //     enableMessage: false,
                        //     offset: new BMap.Size(0, -20)
                        // };

                        // var contentStr = contentObj.content;
                        $this.map.panTo(pointC);
                        // var infoWindow = new BMap.InfoWindow(contentStr, opts);  // 创建信息窗口对象
                        // $this.map.openInfoWindow(infoWindow, pointC); //开启信息窗口
                        // var gc = new BMap.Geocoder();
                        // gc.getLocation(pointC, function (rs) {
                        //     infoWindow.setContent(contentStr);
                        // });
                    }
                }, 300);
            },
            setAddress(){
                this.vehicleTrackList.map((item,i)=>{
                    item.startAddress = '...'
                    item.endAddress = '...'
                    this.getLocation(this.vehicleTrackList,item.startLong,item.startLat,item,'startAddress',i);
                    this.getLocation(this.vehicleTrackList,item.endLong,item.endLat,item,'endAddress',i);
                })
            },
            getLocation(list,long, lat,item,key,i){
                var gc = new BMap.Geocoder();
                gc.getLocation(new BMap.Point(long, lat),result =>{
                    if(result){
                        item[key] = result.address;
                        $this.$set(list, i, item);
                    }
                });
            },
            getTabelLocation(long, lat,obj){
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
            reset(type) {
                $this.tableList = [];
                this.serialNumber = 0;
                //$this.followChk.checked = false;
                if(!type){
                    if(this.activeIds.length){
                        $this.playBtn.disabled = false;
                        $this.pauseBtn.disabled = true;
                        $this.resetBtn.disabled = false;
                    }else if($this.playBtn || $this.pauseBtn || $this.resetBtn){
                        $this.playBtn.disabled = true;
                        $this.pauseBtn.disabled = true;
                        $this.resetBtn.disabled = true;
                    }
                }
                this.strokeColor = '';
                this.index = 0;
                this.num = 0;
                this.bPoints = [];
                this.pList = [];
                this.hasPlay = false;
                this.startPoint = null;
                this.hasLong = false;
                if(!type){
                    this.GetVehcTrack()
                }
                if($this.timer) {
                    window.clearTimeout($this.timer);
                }

            },
            /*切换imei*/
            changeImei(){
                this.activeIds = [];
                this.activeId = '';
                this.points = [];
                this.checked = false;
                this.reset()
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
                this.shrink = false;
                this.activeIds = [];
                this.activeId = '';
                this.points = [];
                this.checked = false;
                this.reset()
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
                        loading.close();
                        if(rs.status == 0){
                            if(rs.data && rs.data.length > 0){
                                this.wiredEquList = rs.data;
                                this.imei = this.wiredEquList[0].imei;
                                this.getWriedTrackList(param , loading);
                            }else{
                                this.$message.error("未查询到车辆行程信息！");
                                this.clearDisableMass();
                                this.map.clearOverlays();
                                this.vehicleTrackList = [];
                                this.wiredEquList= [];
                                this.tableList = [];
                                this.table = false;
                                this.vehicleTrackListDisplay = false;
                                this.vehicleTrackListDetail = false;
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
                this.options = []
                ajax.get('obd/obdVehicleTrack/trackListByImei?imei=' + this.imei + param).then(rs => {
                    loading.close();
                    if(rs && rs.data.length < 1){
                        this.$message.error("未查询到车辆轨迹信息！");
                        this.clearDisableMass();
                        this.map.clearOverlays();
                        this.vehicleTrackList = [];
                        this.tableList = [];
                        this.table = false;
                        this.vehicleTrackListDisplay = false;
                        this.vehicleTrackListDetail = false;
                        return;
                    }else {
                        this.vehicleTrackList = rs.data;
                        this.trackListDetail(this.vehicleTrackList[0]);
                        this.vehicleTrackListDisplay = true;
                        this.setAddress()
                    }
                }).catch(_ => {
                    loading.close();
                });
            },
            remoteMethod(plateKeyWord) {
                if (plateKeyWord !== '' && plateKeyWord.length >= 3) {
                    this.plateLoading = true;
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword', {plate: plateKeyWord}).then(rs => {
                        if(rs && rs.data!=''&& rs.data.length > 0){
                            setTimeout(() => {
                                this.plateLoading = false;
                                this.options4 = rs.data;
                            }, 200);
                        }else{
                            this.dataText = '无数据'
                            this.options4 = [];
                            this.plateLoading = false;
                        }
                    })

                } else if(plateKeyWord !== '' && plateKeyWord.length < 3){
                    this.dataText = '请输入至少3位'
                    this.options4 = [];
                }else{
                    this.options4 = [];
                }
            },

            /*无线设备轨迹定位信息*/
            equDetail(item){
                this.activeId = item.id;
                this.init(this.searchParam.startTime[0],this.searchParam.startTime[1],item.imei,item);
            },

            trackListDetail(item){
                if(this.checked) return;
                this.toggle(item);
                this.strokeColor = '';
                this.reset(true);
                if($this.has(item)){
                    $this.setGeoc()
                    this.init(item.startTime,item.endTime,item.imei,item,true);
                }else{
                    if(this.activeIds.length){
                        $this.points = $this.points.filter(_item => {
                            return item.id != _item.id
                        })
                        $this.pointsSort();
                        $this.GetVehcTrack();
                        $this.setGeoc()
                    }else{
                        this.vehicleTrackListDetail = false
                        $this.points = [];
                        this.clearDisableMass();
                        $this.map.clearOverlays();
                    }
                }
            },
            setGeoc(){
                var geoc = new BMap.Geocoder();
                $this.trackListDetailData.startTime = this.activeIds[0].startTime
                $this.trackListDetailData.endTime = this.activeIds[$this.activeIds.length-1].endTime
                var point = new BMap.Point($this.activeIds[0].startLong, $this.activeIds[0].startLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.startPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
                point = new BMap.Point($this.activeIds[$this.activeIds.length-1].endLong, $this.activeIds[$this.activeIds.length-1].endLat);
                geoc.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    $this.trackListDetailData.endPoint = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                });
                this.vehicleTrackListDetail = true;
            },
            getTimeDate(time){
                let date = new Date();
                date.setTime(time);
                return date.format("yyyy-MM-dd HH:mm;ss");
            },
            wirelessPlay() {
                $this.playBtn.disabled = true;
                $this.pauseBtn.disabled = false;

                var data = $this.points[0].data[$this.index]

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
                    $this.car.setPosition(point);
                    $this.index++;
                    $this.map.panTo(point);
                    if($this.index < $this.points.length) {
                        $this.timer = window.setTimeout(_=>{
                            this.wirelessPlay("" + $this.index + "");
                        }, $this.playSpeed);
                    } else {
                        $this.playBtn.disabled = true;
                        $this.pauseBtn.disabled = true;
                        this.map.panTo(point);
                    }
                }
            },
            clearDisableMass(){
                var allOverlay = this.map.getOverlays();
                for (var i = 0; i < allOverlay.length; i++) {
                    allOverlay[i].enableMassClear();
                }
            },
            play(){
                if(!$this.hasPlay){
                    this.clearDisableMass();
                    $this.map.clearOverlays();
                    var iconSize = new BMap.Size(32, 32);
                    $this.car = new BMap.Marker($this.points[0].points[0], { icon: icon = new BMap.Icon("/static/img/car-icon_01.png", iconSize) });
                    $this.car.disableMassClear();
                    $this.map.addOverlay($this.car);
                    $this.car.setTop(true,9999);
                }
                $this.table = true;
                $this.hasPlay = true;
                $this.playBtn.disabled = true;
                $this.pauseBtn.disabled = false;
                var pointsLength = $this.points[$this.num].points.length-1
                if(pointsLength < $this.index){
                    if($this.checked && $this.num < $this.activeIds.length && $this.activeIds.length != $this.points.length){
                        $this.index = 0
                        $this.num++
                        $this.pList = []
                        $this.bPoints.push({
                            color:$this.getRandomColor(),
                            point:$this.pList,
                        })
                        return;
                    }else if($this.num < $this.points.length-1){
                        $this.index = 0
                        $this.num++
                        $this.pList = []
                        $this.bPoints.push({
                            color:$this.getRandomColor(),
                            point:$this.pList,
                        })
                    }else{
                        var icon = new BMap.Icon("/static/img/gpsEnd.png", new BMap.Size(29, 35));
                        var endPoint = new BMap.Point($this.points[$this.points.length-1].data[$this.points[$this.points.length-1].data.length - 1].corlong, $this.points[$this.points.length-1].data[$this.points[$this.points.length-1].data.length - 1].corlat);
                        var markerEnd = new BMap.Marker(endPoint, { icon: icon });
                        markerEnd.addEventListener("click", ()=>{
                            this.openInfoWindow(endPoint,$this.points[$this.points.length-1].data[$this.points[$this.points.length-1].data.length - 1]);
                        });
                        $this.map.addOverlay(markerEnd);
                        markerEnd.setTop(true,9999);
                        $this.map.removeOverlay($this.car);
                        $this.playBtn.disabled = true;
                        $this.pauseBtn.disabled = true;
                        $this.hasPlay = false;
                        $this.checked = false;
                        this.map.panTo(point);
                        return;
                    }
                }
                var points = $this.points[$this.num].points;
                var data = $this.points[$this.num].data[$this.index];

                if (data.corlong && data.corlat) {
                    var point = new BMap.Point(data.corlong, data.corlat);
                    point.data = data;
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
                    
                        index: ++$this.serialNumber,
                        direction: gpsdrct,
                        locationTime: new Date(data.locationTime*1).format('yyyy-MM-dd HH:mm:ss'),
                        speed: data.speed,
                        corlong: data.corlong,
                        corlat: data.corlat,
                    };
                    $this.getTabelLocation(data.corlong, data.corlat, tableObj);
                    $this.tableList.unshift(tableObj);

                    $this.car.setPosition(point);
                    var newLinePoints = [],len;
                    this.pList.push(point)
                    if($this.index != 0 || $this.num != 0){
                        $this.bPoints[$this.num].point = this.pList;
                    }
                    //起点
                    if($this.index == 0 && $this.num == 0){
                        $this.bPoints.push({
                            color:'#409eff',
                            point:$this.pList,
                            date:data.locationTime
                        })
                        var point = new BMap.Point($this.pList[0].lng, $this.pList[0].lat);
                        var icon = new BMap.Icon("/static/img/gpsStart.png", new BMap.Size(29, 35));
                        $this.markerStart = new BMap.Marker(point, { icon: icon });
                        $this.markerStart.addEventListener("click", ()=>{
                            this.openInfoWindow(point,data);
                        });
                        $this.markerStart.disableMassClear();
                        $this.map.addOverlay($this.markerStart);
                        $this.markerStart.setTop(true,9999);
                    }else if(($this.num > 0 && $this.index == 0) || ($this.num >= 0 && $this.index == points.length-1 && this.activeIds.length > 1)){
                        var point = new BMap.Point($this.pList[$this.pList.length-1].lng, $this.pList[$this.pList.length-1].lat);
                        var icon = new BMap.Icon("/static/img/stop.png", new BMap.Size(29, 35));
                        $this.markerStop = new BMap.Marker(point, { icon: icon });
                        $this.markerStop.addEventListener("click", ()=>{
                            $this.openInfoWindow(point,data);
                        });
                        $this.markerStop.disableMassClear();
                        $this.map.addOverlay($this.markerStop);
                        $this.markerStop.setTop(true,9998);
                    }

                    $this.index++;
                    $this.addLine($this.bPoints);//增加轨迹线
                    if( $this.index < points.length -1){
                        var endData = $this.points[$this.num].data[$this.index+1];
                        $this.setMarker(data,endData,$this.index,points);
                    }
                    // $this.map.centerAndZoom(point,17);
                    this.setZoom(this.pList)
                    // $this.map.panTo(point);
                    if($this.index <= points.length) {
                        $this.timer = window.setTimeout(_=>{
                            this.play("" + $this.index + "");
                        }, $this.playSpeed);
                    } else {
                        $this.playBtn.disabled = true;
                        $this.pauseBtn.disabled = true;
                        $this.hasPlay = false
                        this.map.panTo(point);
                    }
                }
            },
            setMarker(data,endData,index,points){
                if($this.showTime){
                    $this.clearOverlay = true;
                    if(index != 0 && index < points.length-1 && index%6 == 0 ){
                        let dateLabel = new BMap.Label("时间:"+new Date(data.locationTime*1).format('yyyy-MM-dd HH:mm:ss')+' 车速:'+data.speed+' km/h',{offset:new BMap.Size(20,-5)});
                        let dateMarker = new BMap.Marker(new BMap.Point(data.corlong, data.corlat));
                        dateLabel.addEventListener("mouseover", event=>{
                            dateMarker.setTop(true);
                        });
                        dateLabel.addEventListener("mouseout", event=>{
                            dateMarker.setTop(false);
                        });
                        dateMarker.addEventListener("click", ()=>{
                            $this.openDetarInfoWindow(data);
                        });
                        dateMarker.disableMassClear();
                        $this.map.addOverlay(dateMarker);  //添加标注    
                        dateMarker.setLabel(dateLabel);  //添加标签
                    }
                }
                if(index != 0 && points.length > 2 && index < points.length-1){
                    $this.handleLongStop(data,endData,index,points);
                }
            },
            /*打开信息框*/
            openInfoWindow(point,data){
                /*根据经纬度获取车辆定位地址*/
                let geoc = new BMap.Geocoder();
                geoc.getLocation(point, rs => {
                    data.localtion = rs.address;
                    var opts = {
                        enableMessage: false,
                        offset: new BMap.Size(0, -20)
                    }
                    var content = `<p>时间：${new Date(data.locationTime*1).format('yyyy-MM-dd HH:mm:ss')}</p>
                                    <p>地址：${data.localtion?data.localtion:'未解析地址'}</p>`
                    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                    $this.map.openInfoWindow(infoWindow, point);
                })
            },
            /*打开车的信息框*/
            openDetarInfoWindow(data,startdata){
                /*根据经纬度获取车辆定位地址*/
                let geoc = new BMap.Geocoder();
                let pt = startdata ?new BMap.Point(startdata.corlong,startdata.corlat):new BMap.Point(data.corlong,data.corlat);
                geoc.getLocation(pt, rs => {
                    data.localtion = rs.address;
                    var opts = {
                        width: 300,     // 信息窗口宽度
                        height: 120,     // 信息窗口高度
                        enableMessage: false,
                        offset: new BMap.Size(0, -25)
                    }
                    let time = '';
                    if(startdata){
                        time = $this.formatDuring(data.locationTime-startdata.locationTime)
                    }
                    //创建弹出框信息
                    var content = "<p style='text-align:left '>运行时间：" + new Date(data.locationTime*1).format('yyyy-MM-dd HH:mm:ss');
                    if(startdata){
                        content += "<p style='text-align:left '>停车时间："+ time + "</p>";
                    }
                    content += "<p style='text-align:left '>车速：" + data.speed + " km/h</p>";
                    if (data.localtion == null || data.localtion == undefined) {
                        content += "<p>位置：未解析地址</p></div>";
                    }
                    else {
                        content += "<p>位置：" + data.localtion + "</p>";
                    }
                    var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                    $this.map.openInfoWindow(infoWindow, pt);
                });
            },
            formatDuring(mss) {
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = (mss % (1000 * 60)) / 1000;
                let str = '';
                if(days) str += days + " 天 ";
                if(hours) str += hours + " 小时 ";
                if(minutes) str += minutes + " 分钟 ";
                if(seconds) str += seconds + " 秒 ";
                return str;
            },
            /**
             * 处理长停点
             */
            handleLongStop(startData,endData,index,points){
                let start = this.startPoint?this.startPoint:startData;
                let startPt = this.startPoint?new BMap.Point(this.startPoint.corlong,this.startPoint.corlat):new BMap.Point(startData.corlong,startData.corlat);
                const endPt = new BMap.Point(endData.corlong,endData.corlat);
                const distance = parseInt(this.map.getDistance(startPt,endPt))

                if(distance <= 20 && index != 1 && index < points.length-3){
                    if(!this.startPoint){
                        this.startPoint = startData;
                    } 
                    if(endData.locationTime - start.locationTime >= 1000*60*5){
                       this.hasLong = true;
                    }
                }else{
                    if(this.hasLong){
                        this.hasLong = false;
                        var icon = new BMap.Icon("/static/img/longStop.png", new BMap.Size(29, 35));
                        let longStopMarker = new BMap.Marker(startPt, { icon: icon });
                        longStopMarker.addEventListener("mouseover", event=>{
                            longStopMarker.setTop(true);
                        });
                        longStopMarker.addEventListener("mouseout", event=>{
                            longStopMarker.setTop(false);
                        });
                        longStopMarker.addEventListener("click", ()=>{
                            $this.openDetarInfoWindow(startData,start);
                        });
                        longStopMarker.disableMassClear();
                        $this.map.addOverlay(longStopMarker);
                    }
                    this.startPoint = null;
                }
            },

            setZoom(bPoints){
                var view = $this.map.getViewport(eval(bPoints));
                var mapZoom = view.zoom;
                var centerPoint = view.center;
                $this.map.centerAndZoom(centerPoint,mapZoom);
            },
            addLine(points){
                $this.map.clearOverlays();
                var pointsLen = points.length,i;
                if(pointsLen == 0){
                    return;
                }
                // 创建标注对象并添加到地图
                for(i = 0;i <pointsLen;i++){
                    var polyline = new BMap.Polyline(points[i].point, {strokeColor: points[i].color, strokeWeight: 4, strokeOpacity: 1 });   //创建折线
                    $this.map.addOverlay(polyline);   //增加折线
                }
            },
            getRandomColor(){
                var colorValue="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
                var colorArray = colorValue.split(",");
                var color="#";
                for(var i=0;i<6;i++){
                    color+=colorArray[Math.floor(Math.random()*16)];
                }
                return color;
            }
        },
        watch: {
            num(val){
                this.strokeColor = this.getRandomColor()
                if(this.checked && this.hasPlay && this.activeIds.length != this.points.length){
                    $this.init($this.activeIds[val].startTime,$this.activeIds[val].endTime,$this.activeIds[val].imei,$this.activeIds[val]).then(()=>{
                        $this.play("" + $this.index + "")
                    })
                }
            },
            equType(){
                this.activeIds = [];
                this.activeId = '';
                this.points = [];
                this.checked = false;
                this.reset()
                if(this.equType == 1 && this.vehicleTrackList.length){
                    this.trackListDetail(this.vehicleTrackList[0]);
                }else if(this.equType == 2 && this.equList.length){
                    this.equDetail(this.equList[0]);
                }
            }
        },
    }
</script>


<style scoped lang="scss">
    .data-list {
        position: relative;
        background: #fff;
        user-select:none;
        .line{
            width: 100%;
            cursor: row-resize;
            position: absolute;
            top: 1px;
            border-top: 2px solid #409EFF;
            height: 7px;
            z-index: 1;
            display: none;
        }
        .shrink{
            color: #fff;
            padding-top: 6px;
            text-align: center;
            position: absolute;
            top: 50%;
            height: 43px;
            width: 21px;
            background: #409EFF;
            cursor: pointer;
            left: -20px;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            opacity: 1;
            -webkit-transition: .38s;
            transition: .38s;
        }
        .shrink:hover{
            opacity: .8;
        }
        .shrink-right:after {
            content: "";
            position: absolute;
            top: 10px;
            left: 3px;
            width:0;
            height:0;
            border-top:5px solid transparent;
            border-bottom:5px solid transparent;
            border-left:5px solid #fff;
        }

        .shrink-left:after{
            content: "";
            position: absolute;
            top: 10px;
            left: 3px;
            width:0;
            height:0;
            border-top:5px solid transparent;
            border-bottom:5px solid transparent;
            border-right:5px solid #fff;
        }
        ul.track-list {
            height: calc(100% - 42px);
            overflow-y: auto;
            margin: 0;
            li{
                cursor: pointer;
                padding: 10px 15px;
                >div{
                    >p{
                        margin: 0;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            li:hover{
                background: rgba(201, 228, 255,.3);
            }
            li.active{
                position: relative;
                background: rgb(201, 228, 255);
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
        .track-list.noClicking{
            li{
                cursor:not-allowed;
            }
        }
        .play{
            color: #409EFF;
            font-size: 14px;
        }
        .play:hover{
            color: #66b1ff;
        }
    }
    .data-list.flex{
        .line{
            display: block;
        }
        ul.track-list{
            li{
                display: flex;
                padding: 6px 0 6px 10px;
                div{
                        width: 25%;
                        padding-left: 20px;
                        border-right: 1px solid #ccc;
                    }
                div:first-child{
                    padding-left:0;
                }
            }
        }
    }
    .equData-list{
        user-select: text;
        height: calc(100vh - 370px);
    }
    .trajectory-list {

        .track-list {
            background: #fff;
            padding: 0;
            overflow: auto;
            line-height: 22px;
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
            top: 15px;
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
            display: flex;
            position: relative;
            .map_table{
                flex: 1;
                display: flex;
                flex-direction: column;
                position: relative;
                #map {
                    padding: 0;
                    flex: 1;
                    user-select:none;
                }
                .table-box {
                    position: relative;
                    padding:0 21px;
                    margin-bottom: 15px;
                    width: 100%;
                    .line{
                        width: calc(100% - 44px);
                        cursor: row-resize;
                        position: absolute;
                        top: -14px;
                        border-top: 2px solid #409EFF;
                        height: 7px;
                        z-index: 1;
                    }
                    .table-list{
                        overflow-y:auto;
                        margin: 0;
                        border: 1px solid #eee;
                        padding-top: 30px;
                        li{
                            display: flex;
                            border-bottom: 1px solid #eee;
                            span{
                                width: 30%;
                                padding: 5px;
                                border-right: 1px solid #eee;
                            }
                            .index{
                                width: 12%;
                            }
                            .direction{
                                width: 13%;
                            }
                            .speed{
                                width: 20%;
                            }
                            .corlong,.corlat{
                                width: 25%;
                            }
                        }
                        .t-body:hover{
                            background: #c9e4ff;
                        }
                        .t-head{
                            position: absolute;
                            top:1px;
                            width: calc(100% - 44px);
                            background: #fff;
                            height: 30px;
                            span{
                                color: #000;
                            }
                        }
                        .t-body{
                            cursor: pointer;
                            span{
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }
                }
            }
        }
        // .left-box.column{
            // flex-direction: column;
        // }
        .right-box {
            padding: 10px;
            width: 300px;
            position: absolute;
            top: 10px;
            left: 15px;
            background: #fff;
            box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.18);
            transition: all 80ms;
            z-index: 2;
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
            .shrink{
                float: right;
                .el-button{
                    padding: 0;
                }
            }
        }
        .right-small{
            > .el-icon-arrow-up{
                font-size: 20px;
                float: right;
                cursor: pointer;
                transform: rotate(-45deg);
            }
        }
    }
    .small .right-box {
        width: 200px;
        height: 30px;
        overflow: hidden;
        padding: 5px;
        line-height: 20px;
        div,ul,.item{
            display: none;
        }
        .el-icon-arrow-up{
            transform: rotate(135deg);
            padding-top: 10px
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

