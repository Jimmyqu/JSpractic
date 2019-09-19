<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <el-row :gutter="20">
            <el-col :span="19" style="padding: 10px ; position: relative">
                <!--地图头部信息-->
                <el-radio-group v-model="chooseStatus" style="margin: 10px 10px 10px 10px" @change="chooseListByStatus()">
                    <el-radio label="全部" >全部{{list.length ? list.length: 0}}</el-radio>
                    <el-radio label="在线" >在线{{onLineList.length ? onLineList.length: 0}}</el-radio>
                    <el-radio label="休眠" >休眠{{sleepList.length ? sleepList.length: 0}}</el-radio>
                    <el-radio label="故障" >故障{{errList.length ? errList.length: 0}}</el-radio>
                </el-radio-group>
                <el-checkbox style="margin-left: 5px;" v-model="showPlate" @change="showPlateDo()">显示车牌</el-checkbox>
                <el-tag v-show="count && count > 0" type="success" style="position: absolute;top:50px; right: 20px ; z-index: 10000 ;background-color: #28b779 ; color: white">{{count + 'S后刷新'}}</el-tag>
                <div id="map" style="height: 600px"></div>
            </el-col>
            <el-col :span="5" style="padding: 20px">
                <div class="form-group">
                    <div class="input-group">
                        <tree-select v-model="originateDeptId" placeholder="所属部门" type="one"
                                     url="admin/organization/tree"
                        ></tree-select>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 15px">
                    <div class="input-group">
                        <el-autocomplete style="width: 100%;"
                                         v-model="plate"
                                         :fetch-suggestions="querySearchAsync"
                                         placeholder="车牌"
                        ></el-autocomplete>
                    </div>
                </div>
                <div class="search-btn-list" style="width: 100%; margin-top: 10px;">
                    <el-button type="primary" size="small" @click="editSxTime()">查询</el-button>
                </div>
                <div class="table-box" v-if="selectedList.length > 0">
                    <h4>车辆:{{selectedList.length}}</h4>
                    <el-table v-loading="listLoading"border :data="selectedList" style="width: 100%" ref="table" @cell-click="handleSelectionChange" @selection-change="handelChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column min-width="100" label="车牌" prop="plate"  show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="100" label="状态" prop="statusText"  show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="19" v-if="checkboxList && checkboxList.length > 0">
                <div>
                    <span>设备定位信息</span>
                    <template>
                        <el-select v-model="sxTime" placeholder="请选择刷新时间" @change="editSxTime()"  style="width: 20%;float: right;margin-bottom: 5px;">
                            <el-option value="30" label="每隔30秒刷新"></el-option>
                            <el-option value="60" label="每隔1分钟刷新"></el-option>
                            <el-option value="120" label="每隔2分钟刷新"></el-option>
                            <el-option value="600" label="每隔10分钟刷新"></el-option>
                            <el-option value="0" label="不自动刷新"></el-option>
                        </el-select>
                    </template>
                </div>
                <el-table v-loading="listLoading"border :data="checkboxList" style="width: 100%" ref="table">
                    <el-table-column min-width="160" label="操作"  sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button  type="text" @click="tailAfter(scope.row)">跟踪</el-button>
                            <el-button  type="text"  @click="playback(scope.row)">回放</el-button>
                            <el-button  type="text"  @click="plane(scope.row)">计划</el-button>
                            <el-button  type="text" @click="timing(scope.row)">定时</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" label="车牌" prop="plate"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="定位时间" prop="localtionTime"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="在线情况" prop="statusText"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="位置" prop="localtion"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="方向" prop="direction"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="速度（km/h）" prop="speed"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="通讯讯号" prop="networkSignal"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="电池电量（%）" prop="power"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="经度" prop="longitude"  show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="100" label="纬度" prop="latitude"  show-overflow-tooltip></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleTrack',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: 'se//seLocation',
                originateDeptId: '',
                plate: '',
                /*车辆数据集合*/
                list: [],
                /*在线车辆数据集合*/
                onLineList:[],
                /*休眠车辆集合*/
                sleepList:[],
                /*故障车辆集合*/
                errList:[],
                /*当前选择车辆集合*/
                selectedList: [],
                /*当前选择状态*/
                chooseStatus: '全部',  //在线 ， 休眠， 故障
                /*是否显示车牌*/
                showPlate: false,
                /*百度地图*/
                map:'',
                sxTime : '30',
                /*checkbox选中表格数据*/
                checkboxList: [],
                timmer: '',
                count: 0,
                timeJob: '',
            }
        },
        activated(){
        },
        mounted() {
            window.onLineTrace = this.onLineTrace;
            window.gjhf = this.gjhf;
            window.tjjh = this.tjjh;
            window.dssz = this.dssz;
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })
        },

        methods: {

            /*实时追踪*/
            onLineTrace(vehicleId,plate,equipmentId){
                let row = {
                    vehicleId: vehicleId,
                    plate: plate,
                    equipmentId: equipmentId
                }
                this.tailAfter(row);
            },

            /*轨迹回放*/
            gjhf(vehicleId,plate){
                let row = {
                    vehicleId: vehicleId,
                    plate: plate
                }
                this.playback(row);
            },

            /*添加计划*/
            tjjh(vehicleId,plate){
                let row = {
                    vehicleId: vehicleId,
                    plate: plate
                }
                this.plane(row);
            },

            /*定时设置*/
            dssz(vehicleId,plate){
                let row = {
                    vehicleId: vehicleId,
                    plate: plate
                }
                this.timing(row);
            },

            /*数据初始化*/
            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom("武汉",15);
                this.map.enableScrollWheelZoom(true);
            },

            /*修改刷新时间*/
            editSxTime(){
                if(this.sxTime!=0){
                    this.getList();
                    this.startTimeJob();
                    if(this.timmer){
                        clearInterval(this.timmer);
                    }
                    /*设置定时刷新时间*/
                    this.timmer = setInterval(()=>{
                        this.startTimeJob();
                        this.getList();
                    }, this.sxTime*1000);
                }else{
                    this.startTimeJob();
                    this.getList();
                }

            },

            /*时间定时器*/
            startTimeJob(){
                this.count = this.sxTime;
                if(this.timeJob){
                    clearInterval(this.timeJob);
                }
                if(this.sxTime!=0){
                    this.timeJob = setInterval(()=>{
                        this.count --;
                    }, 1000);
                }
            },

            /*实时跟踪*/
            tailAfter(row){
                let url = this.$route.fullPath + '/add';
                this.$router.push({path:url , query:{id: row.vehicleId ,plate: row.plate ,equipmentId: row.equipmentId}});
            },

            /*回放*/
            playback(row){
                alert('暂无页面跳转');
            },
            /*计划*/
            plane(row){
                alert('暂无页面跳转');
            },
            /*定时*/
            timing(){
                alert('暂无页面跳转');
            },
            /*显示对应状态数据*/
            chooseListByStatus(){
                this.addListByType();
                console.log(this.selectedList);
                if(this.selectedList && this.selectedList.length > 0){
                    this.addPoint(this.selectedList[0]);
                    this.lablePoint();
                }else{
                    this.map.clearOverlays();
                }
            },

            /*是否显示车牌*/
            showPlateDo(){
                this.lablePoint(this.showPlate);
            },

            /*异步搜索车牌*/
            querySearchAsync(queryString, cb){
                if(queryString && queryString.length>0 && queryString.length<8){
                }
            },

            /*查询列表数据不分页*/
            getList(){
                if(this.originateDeptId){
                    ajax.get(`se/seLocation/listNoPage?orgId=${this.originateDeptId}&plate=${this.plate}`).then(
                        res => {
                            this.list = res;
                            /*数据分组*/
                            this.groupList();
                            this.addListByType();
                            if(this.selectedList && this.selectedList.length>0){
                                this.lablePoint();
                                this.addPoint(this.selectedList[0]);
                            }
                        }
                    )
                }else{
                   /* this.showMessage('请先选择组织');*/
                }

            },

            /*选择对应数据*/
            addListByType(){
                if(this.chooseStatus == '全部'){
                    this.selectedList = this.list;
                }else if(this.chooseStatus == '在线'){
                    this.selectedList = this.onLineList;
                }else if(this.chooseStatus == '休眠'){
                    this.selectedList = this.sleepList;
                }else {
                    this.selectedList = this.errList;
                }
            },

            /*数据分组*/
            groupList(){
                this.onLineList = [];
                this.sleepList = [];
                this.errList = [];
                this.selectedList = [];
                this.list.forEach(item => {
                    if(item.equipmentStatus == 1){
                        item.statusText = '在线';
                        this.onLineList.push(item);
                    }else if(item.equipmentStatus == 2){
                        this.judgeByTime(item);
                    }
                });
            },

            /*根据离线时间返回状态信息*/
            judgeByTime(item){
                //超过三天时间即为故障
                if(item.locationTime){
                    const now = new Date().getTime();
                    const locationTime = item.localtionTime.getTime();
                    if(now - locationTime <= 3*24*60*60*1000){
                        //休眠状态
                        item.statusText = '休眠';
                    }else{
                        //故障状态
                        item.statusText = '故障';
                        item.equipmentStatus = 3
                    }
                }else{
                    item.statusText = '故障';
                    item.equipmentStatus = 3
                }
            },

            /*选中表checxbox*/
            handelChange(selection){
                this.checkboxList = selection;
            },

            //选中数据,地图显示信息图
            handleSelectionChange(row){
                /*异步加载数据车辆数据*/
                ajax.get(`se/seLocation/vehicle/${row.vehicleId}`).then( res=>{
                    if(res){
                        let opts = {
                            width: 355,     // 信息窗口宽度
                            height: 200,     // 信息窗口高度
                            enableMessage: false,
                            offset: new BMap.Size(0, -20)
                        }
                        let content = this.assambleVehicleInfo(res);
                        let infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                        let new_point = new BMap.Point(res.latitude, res.longitude);
                        this.map.panTo(new_point);
                        this.map.openInfoWindow(infoWindow, new_point);
                        this.bind();
                    }else{
                        this.showMessage('暂未获取到车辆信息');
                    }
                });
            },

            /*组装弹出信息框内容*/
            assambleVehicleInfo(res){
                let content = '';
                /*计算误差值*/
                /*判断定位模式*/
                let sr = '卫星定位';
                if(res.gps != 1 && res.bd != 1){
                    const scValue = this.rateSc(res);
                    sr = `基站定位(误差值 ${scValue}米)`
                }
                content += `<p style="font-weight:bold;text-align:left">车牌: ${res.plate} <span style="float: right">${sr}</span></p>`;
                /*计算航向*/
                const gpsdrct = this.reateCourse(res.direction);
                content += `<p style="text-align:left">IMEI: ${res.imei} <span style="float: right">航向: ${gpsdrct}</span></p>`;
                content += `<p style="text-align:left">部门: ${res.orgName} <span style="float: right">信号: ${res.networkSignal}</span></p>`;
                content += `<p style="text-align:left">时间: ${res.localtionTime} <span style="float: right">电池电量: ${res.power}</span></p>`;
                content += `<p style="text-align:left">位置: ${res.localtion}</p>`;
                content += `<button type="button" onclick="onLineTrace('${res.vehicleId}','${res.plate}','${res.equipmentId}')"  class="el-button el-button--primary el-button--mini mr-15"><span>实时追踪</span></button>`;
                content += `<button type="button" onclick="gjhf('${res.vehicleId}','${res.plate}')" class="el-button el-button--primary el-button--mini mr-15" ><span>轨迹回放</span></button>`;
                content += `<button type="button" onclick="tjjh('${res.vehicleId}','${res.plate}')" class="el-button el-button--primary el-button--mini mr-15"><span>添加计划</span></button>`;
                content += `<button type="button" onclick="dssz('${res.vehicleId}','${res.plate}')" class="el-button el-button--primary el-button--mini mr-15"><span>定时设置</span></button>`;
                return content;
            },

            /*计算航向*/
            reateCourse(direction){
                let gpsdrct ;
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
                return gpsdrct ? gpsdrct : '未知';
            },

            /*计算误差值*/
            rateSc(res){
                return 200;
            },

            /*视图地图定位*/
            addPoint(item){
                let pt = new BMap.Point(item.latitude, item.longitude);
                this.map.panTo(pt);
            },

            //添加地图标注
            lablePoint(flag){
                const list = this.selectedList;
                this.map.clearOverlays();
                list.forEach(item => {
                    this.addMark(item , flag);
                });
            },
            //添加标注
            addMark(item , flag){
                let icon = this.chooseIconByEquStatus(item.equipmentStatus);
                /*创建带图标的标注*/
                let pt = new BMap.Point(item.latitude, item.longitude);
                let marker = new BMap.Marker(pt,{icon:icon});
                marker.id = item.vehicleId
                this.map.addOverlay(marker);
                if(flag){
                    let text = new BMap.Label(item.plate,{offset:new BMap.Size(20,-10)});
                    marker.setLabel(text);
                };
                marker.addEventListener("click", ()=> {
                    this.showInfoBox(item);

                });
            },

            /*根据设备运行状态返回对应图片*/
            chooseIconByEquStatus(equipmentStatus){
                let iconSize = new BMap.Size(24, 29);
                let icon;
                if(equipmentStatus == 1){
                    icon = new BMap.Icon("/static/img/map_images/run_car.png", iconSize);
                }else if(equipmentStatus == 2){
                    icon = new BMap.Icon("/static/img/map_images/stop_car.png", iconSize);
                }else {
                    icon = new BMap.Icon("/static/img/map_images/offline_car.png", iconSize);
                }
                return icon;
            },

            /*打开信息框*/
            showInfoBox(item){
                this.handleSelectionChange(item)
            },

            /*绑定事件*/
            bind(){
                /*首先取消百度地图信息框click事件*/
                $('#map').on('click','#on-line',()=>{
                    debugger
                });
            }
        }
    }
</script>

<style>
    .mr-15{
        margin-right: 5px;
    }
</style>
