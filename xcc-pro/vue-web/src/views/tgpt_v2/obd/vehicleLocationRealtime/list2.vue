<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="left-box">
            <div class="map-info" v-show="timer">{{this.countdown}}秒刷新</div>
            <ve-bmap :settings="mapSetting" :after-set-option-once="initMap" height="100%"
                     style="width: 100%;height: 100%"></ve-bmap>
        </div>
        <div class="right-box">
            <div class="item">
                <el-select
                    style="margin-right: 10px;"
                    v-model="vehicleId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="车牌号"
                    :remote-method="remoteFindPlateInfo"
                    :loading="plateLoading">
                    <el-option
                        v-for="item in options4"
                        :key="item.id"
                        :label="item.plate"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="addVehiclePlate()">添加</el-button>
            </div>
            <div style="font-size: 18px;">车辆:{{vehicleList.length}}</div>
            <ul class="list-box">
                <li v-for="bean in vehicleList" @click="clickVehicleTrack(bean)" style="cursor:pointer;padding-left: 10px" :class="{'active':bean.vehicleId == vehicleId}">
                    <i class="icon-run" v-if="bean.vehicleStatus==1"></i>
                    <i class="icon-pause" v-if="bean.vehicleStatus==2"></i>
                    <i class="icon-leave" v-if="bean.vehicleStatus==3"></i>
                    <span>{{bean.plate}}</span>
                    <span v-if="bean.vehicleStatus==1">运行</span>
                    <span v-if="bean.vehicleStatus==2">停止</span>
                    <span v-if="bean.vehicleStatus==3">离线</span>
                    <el-button type="text" @click.stop="deletePlate(bean.index)">删除</el-button>
                </li>
            </ul>
        </div>


        <el-dialog width="70%" title="选择时间栅栏" :visible.sync="dialogTableVisibleTime"
                   :append-to-body="true">
            <div class="list-panel">

                <div class="row">
                    <el-table border style="width: 100%" :data="list"
                              max-height="300">
                        <el-table-column fixed="left" label="状态" width="200">
                            <template slot-scope="scope">
                                <el-button v-show="showEnabledBtn && scope.row.fenceStatus == 1" type="text" @click="ok(scope.row.id, scope.row.fenceStatus)">停用</el-button>
                                <el-button v-show="showEnabledBtn && scope.row.fenceStatus == 2" type="text" @click="ok(scope.row.id, scope.row.fenceStatus)">启用</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" sortable label="栅栏名称" min-width="140"></el-table-column>
                        <el-table-column min-width="140" label="允许运行时间" prop="startTime" sortable show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{scope.row.startTime}}至{{scope.row.endTime}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cycleText" sortable label="监控周期" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <!--<el-table-column prop="vehicleColor" sortable label="是否设置" show-overflow-tooltip
                                         min-width="140"></el-table-column>-->
                        <el-table-column fixed="left" label="是否设置" width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="organCascade[scope.$index]"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
                <div class="left-row" style="padding-bottom: 10px;">
                    <el-button type="primary" @click="saveVehicleData(1)">保存</el-button>
                    <el-button @click="dialogTableVisibleTime=false">关闭</el-button>
                </div>
            </div>
        </el-dialog>


        <el-dialog width="70%" title="选择区域栅栏" :visible.sync="dialogTableVisibleArea"
                   :append-to-body="true">
            <div class="list-panel">

                <div class="row">
                    <el-table border style="width: 100%" :data="list"
                              max-height="300">
                        <el-table-column fixed="left" label="状态" width="240">
                            <template slot-scope="scope">
                                <el-button v-show="showEnabledBtn" type="text">
                            <span v-if="scope.row.fenceStatusText == '启用'"
                                  @click="_enableArea({id: scope.row.id, fenceStatus: 2})">停用</span>
                                    <span v-else @click="_enableArea({id: scope.row.id, fenceStatus: 1})">启用</span>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" sortable label="栅栏名称" min-width="140"></el-table-column>
                        <el-table-column prop="cityStr" sortable label="允许运行城市"
                                         min-width="200"></el-table-column>
                        <el-table-column fixed="left" label="是否设置" width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="organCascade[scope.$index]"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
                <div class="left-row" style="padding-bottom: 10px;">
                    <el-button type="primary" @click="saveVehicleData(2)">保存</el-button>
                    <el-button @click="dialogTableVisibleArea=false">关闭</el-button>
                </div>
            </div>
        </el-dialog>


        <el-dialog width="70%" title="选择电子围栏" :visible.sync="dialogTableVisibleElectron"
                   :append-to-body="true">
            <div class="list-panel">

                <div class="row">
                    <el-table border style="width: 100%" :data="list"
                              max-height="300">
                        <el-table-column fixed="left" label="状态" width="240">
                            <template slot-scope="scope">
                                <el-button v-show="showEnabledBtn" type="text">
                            <span v-if="scope.row.fenceStatus == 1"
                                  @click="_enableElectron({id: scope.row.id, fenceStatus: 2})">停用</span>
                                    <span v-else @click="_enableElectron({id: scope.row.id, fenceStatus: 1})">启用</span>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" sortable label="围栏名称" min-width="140"></el-table-column>

                        <el-table-column fixed="left" label="是否设置" width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="organCascade[scope.$index]"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
                <div class="left-row" style="padding-bottom: 10px;">
                    <el-button type="primary" @click="saveVehicleData(3)">保存</el-button>
                    <el-button @click="dialogTableVisibleElectron=false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import veBmap from 'v-charts/lib/bmap.common'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool,mapTool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import '@/utils/markerManager.js'

    export default {
        name: 'vehicleLocationRealtime',
        mixins: [tool,mapTool],
        components: {TreeSelect,veBmap},
        data() {
            return {
                currentVehicleTrack: {},
                countdown: 10,
                map: {},
                //右边列表的车辆集合
                vehicleList: [],
                //被刷新的车辆
                trackPlate: [],
                //搜索框的车辆id
                vehicleId: '',
                //远程搜索车牌号
                options4: [],
                loading: false,
                /*车辆最后位置*/
                endMarker:{},
                /*车辆最后开始时间*/
                startTime:'',
                /*定时任务类*/
                timer:'',
                /*最后定位point*/
                lastPoint:{},
                showEnabledBtn:true,
                dialogTableVisibleTime: false,
                dialogTableVisibleArea:false,
                dialogTableVisibleElectron:false,
                dialogParam:{},
                organCascade:[],
                listUrl: '',
                limtListData:{},
                vehicleIdDialog:'',
                plateLoading: false,
            }
        },
        mounted() {
            /*绑定事件*/
            window.vlrtShowDropMenu = this.vlrtShowDropMenu;
            window.vlrtCarInfoDetail = this.vlrtCarInfoDetail;
            window.vlrtVehicleLocationTrack = this.vlrtVehicleLocationTrack;
            window.vlrtShowTimeFence = this.vlrtShowTimeFence;
            window.vlrtAreaFence = this.vlrtAreaFence;
            window.vlrtElectronFence = this.vlrtElectronFence;
        },

        // 进入页面
        activated(){
            /*开启定时任务，定时查询车辆实时位置*/
            if(this.vehicleList && this.vehicleList.length > 0){
                this.timeTask();
            }
        },
        /*离开页面时*/
        deactivated(){
            /*销毁定时器*/
            if(this.timer){
                window.clearInterval(this.timer);
            }
        },

        methods: {
            initMap: function (echarts) {
                this.map = echarts.getModel().getComponent('bmap').getBMap()
               /* var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(res=>{
                    if(this.map.getStatus() == BMAP_STATUS_SUCCESS){
                        this.map.centerAndZoom(r.point,15);
                        alert('您的位置：');
                    }else{
                        this.map.centerAndZoom("武汉",15);
                    }
                });*/
                this.map.centerAndZoom("武汉",15);
                this.map.enableScrollWheelZoom(true);
                this.map.addControl(new BMap.NavigationControl());
                let vehicleId = this.$route.query.vehicleId;
                if(vehicleId){
                    let plate = this.$route.query.plate;
                    this.options4.push(
                        {
                            id: vehicleId,
                            plate: plate
                        }
                    )
                    this.vehicleId = vehicleId;
                    this.getVehicleExerciseInfo(vehicleId);
                }
            },


            /*显示下拉菜单*/
            vlrtShowDropMenu(){
                $("#drop-down-menu").toggle();
            },

            /*跳转车辆档案*/
            vlrtCarInfoDetail(id){
                let url = `/tgpt/vehicle/vehicleInformation/detail/${id}`
                this.$router.push({path: url});
            },

            /*跳转车辆轨迹*/
            vlrtVehicleLocationTrack(plate ,vehicleId ){
                let url = `/tgpt_v2/obd/vehicleLocationTrack`
                this.$router.push({path: url , query:{plate:plate ,vehicleId : vehicleId }});
            },

            /*时间栅栏*/
            vlrtShowTimeFence(vehicleId){
                this.dialogTableVisibleTime = true;
                this.listUrl='base/baseTimeFence'
                this.getList();
            },

            /*区域栅栏*/
            vlrtAreaFence(vehicleId){
                this.dialogTableVisibleArea = true;
                this.listUrl='/base/baseAreaFence'
                this.getList();
            },

            /*电子围栏*/
            vlrtElectronFence(vehicleId){
                this.dialogTableVisibleElectron = true;
                this.listUrl='/base/baseElectron'
                this.getList();
            },

            getListAfter(){
                if(this.listUrl=='base/baseTimeFence'){
                    this.index(1);
                }else if(this.listUrl=='/base/baseAreaFence'){
                    this.index(2);
                }else{
                    this.index(3);
                }

            },

            saveVehicleData(index){
                for(var i = 0;i<this.organCascade.length;i++){
                    if(this.organCascade[i]==true){
                        var addUrl = '';
                        var param = {};
                        if (index==1){
                            addUrl = 'base/baseTimeFence/vehicleSetFence';
                            param = {
                                timeFenceId: this.list[i].id,
                                vehicleId: this.vehicleIdDialog
                            };
                        } else if(index==2){
                            addUrl = 'base/baseAreaFence/vehicleSetFence'
                            param = {
                                areaId: this.list[i].id,
                                vehicleId: this.vehicleIdDialog
                            };
                        }else {
                            addUrl = '/base/baseElectron/vehicleSetFence'
                            param = {
                                areaId: this.list[i].id,
                                vehicleId: this.vehicleIdDialog
                            };
                        }
                        ajax.post(addUrl, param).then(rs => {
                            if(rs && rs.data == 1){
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                });
                                //this.getList();
                                //this.$emit("load");
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: '保存失败!'
                                });
                            }
                        });

                    }else {
                        this.organCascade[i]=false;
                    }
                }
                this._delete(index);

            },

            index(n){
                var Url = '';
                if(n==1){
                    Url = 'base/baseTimeFence/selectLimtList'
                }else if(n==2){
                    Url = 'base/baseAreaFence/selectLimtList'
                }else {
                    Url = 'base/baseElectron/selectLimtList'
                }
                console.log(this.vehicleList);
                const params = {
                    vehicleId:''
                }
                for(var n = 0;n<this.vehicleList.length;n++){
                    params.vehicleId = this.vehicleList[n].vehicleId;
                    ajax.get(Url,params).then(rs => {
                        if(rs.data != null){
                            this.limtListData = rs.data.limtList;
                            var organ=[];
                            if(Url=='base/baseTimeFence/selectLimtList'){
                                for(var i =0;i<this.limtListData.length;i++){
                                    for(var j =0;j<this.list.length;j++){
                                        if(this.list[j].id==this.limtListData[i].timeFenceId){
                                            organ[j]=true;
                                            break;
                                        }else if(!organ[i]){
                                            organ[i]=false;
                                        }
                                    }
                                }
                            }else if(Url=='base/baseElectron/selectLimtList'){
                                //debugger;
                                for(var i =0;i<this.limtListData.length;i++){
                                    for(var j =0;j<this.list.length;j++){
                                        if(this.limtListData[i].electronFenceId==this.list[j].id){
                                            organ[j]=true;
                                            break;
                                        }else if(!organ[i]){
                                            organ[i]=false;
                                        }
                                    }
                                }
                            }else {
                                for(var i =0;i<this.limtListData.length;i++){
                                    for(var j =0;j<this.list.length;j++){
                                        if(this.limtListData[i].areaFenceId==this.list[j].id){
                                            organ[j]=true;
                                            break;
                                        }else if(!organ[i]){
                                            organ[i]=false;
                                        }
                                    }
                                }
                            }
                            this.$set(this,"organCascade",organ);
                        }else {
                            this.organCascade = [];
                        }

                    });
                }

            },

            _delete(index) {
                for(var i = 0;i<this.organCascade.length;i++){
                    if(this.organCascade[i]==false){
                        var param = {
                            areaId: this.list[i].id,
                            vehicleId: this.vehicleIdDialog
                        };
                        var deleteUrl = '';
                        if (index==1){
                            deleteUrl = '/base/baseTimeFence/deleteAfVehicleBase/';
                        } else if(index==2){
                            deleteUrl = '/base/baseAreaFence/deleteAfVehicleBase/'
                        }else {
                            deleteUrl = '/base/baseElectron/deleteAfVehicleBase/'
                        }
                        console.log(param);
                        ajax.delete(deleteUrl+param.areaId+'/'+param.vehicleId).then(res => {
                            this.$message({message: '操作成功', type: 'success'});
                        });

                    }
                }


            },

            ok(id, fenceStatus){
                this.$confirm('确定' + (fenceStatus == 1 ? '停用' : '启用') + '该时间栅栏?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var param = {id: id, fenceStatus: fenceStatus == 1 ? fenceStatus = 2 : fenceStatus = 1, updater:''};
                    ajax.post('base//baseTimeFence/ok', param).then(rs => {
                        if(rs && rs.data == 1){
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                            this.getList();
                        }else {
                            this.$message({
                                type: 'error',
                                message: '保存失败!'
                            });
                        }
                    });
                });
            },

            _enableElectron(obj) {
                ajax.post('/base/baseElectron/enable', obj).then(res => {
                    this.$message({message: '操作成功', type: 'success'});
                    this.getList();
                });
            },

            _enableArea(obj) {
                ajax.post('/base/baseAreaFence/enable', obj).then(res => {
                    this.$message({message: '操作成功', type: 'success'});
                    this.getList();
                });
            },

            /*添加车辆*/
            addVehiclePlate() {
                if (this.vehicleId == "") {
                    this.$message.error("请输入车牌号！");
                    return false;
                }
                if(this.findVehicleInList(this.vehicleId)){
                    this.$message.error("该车牌号已添加！");
                    return false;
                }
                /*根据车辆id查询*/
                this.getVehicleExerciseInfo(this.vehicleId);
            },

            /*查询车辆集合中是否有该车辆*/
            findVehicleInList(vehicleId){
                let vehicle = this.vehicleList.find(item =>
                    item.vehicleId == this.vehicleId
                );
                if(vehicle){
                    return true;
                }else{
                    return false;
                }
            },

            /*查询车辆id查询车辆行使信息*/
            getVehicleExerciseInfo(vehicleId) {
                if(this.timer){
                    window.clearInterval(this.timer);
                }
                const loading = this.$loading({fullscreen: false, lock: true, text: '拼命加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)', target: document.querySelector('.ve-bmap') });
                setTimeout(() => {
                    loading.close();
                }, 10000);
                ajax.get('obd/obdVehicleStatus/findVehicleStatusByVehicleId/' + vehicleId).then(rs => {
                    loading.close();
                    if (rs.data == null) {
                        this.$message.warning("未获取到该车辆定位信息！");
                        return;
                    }
                    let currentVehicleTrack = rs.data;
                    // 放入车辆集合,
                    if(!this.findVehicleInList(this.vehicleId)){
                        this.vehicleList.push(rs.data);
                    }
                    /*绘制车辆运行轨迹*/
                    this.drawCarExerciseLine(currentVehicleTrack);
                    /*获取最后更新时间*/
                    let locationList = currentVehicleTrack.locationList;
                    this.startTime = locationList[locationList.length - 1].locationTime;
                    let equId = currentVehicleTrack.locationList[0].equipmentId;
                    this.equId = equId;
                    /*开启定时任务，定时查询车辆实时位置*/
                    this.timeTask();
                }).catch(_ => {
                    loading.close();
                });
            },

            /*开启定时任务*/
            timeTask(){
                 this.timer =  window.setInterval(()=>{
                        this.countdown --;
                     if(this.countdown == 0){
                         // 已最后更新时间为起点查询
                         let startTime = this.startTime;
                         this.getCarLocationOnTime(this.equId , startTime);
                         this.countdown = 10;
                     }
                 }, 1000);
            },
            /*绘制车辆运行轨迹*/
            drawCarExerciseLine(currentVehicleTrack) {
                // this.map.clearOverlays();
                //绘制路线
                let locationList = currentVehicleTrack.locationList;
                const pointList = [];
                locationList.forEach(item => {
                        pointList.push(new BMap.Point(item.corlong, item.corlat))
                    }
                )
                this.drawLine(pointList,{
                    hideEnd:true,
                    callback: list =>{
                        /*绘制终点*/
                        let point = list[list.length - 1];
                        let endPoint = new BMap.Point(point.lng,point.lat);
                        this.lastPoint = endPoint;
                        this.drawEndPoint(locationList[locationList.length - 1]);
                    }
                });

            },

            /*绘制终点*/
            drawEndPoint(currentVehicleTrack) {
                let icon = this.getPicIconByDirection(currentVehicleTrack.direction);
                let marker = new BMap.Marker(this.lastPoint);  // 创建标注
                marker.setIcon(icon);//图标
                let $this = this;
                marker.addEventListener("click", function () {
                    //创建弹出框信息
                    $this.getMarkerContent(currentVehicleTrack.vehicleId , $this);
                });
                this.endMarker = marker;
                $this.map.addOverlay(marker);
            },

            /*获取车辆实时定位信息*/
            getCarLocationOnTime(equId ,startTime){
                ajax.get(`obd/obdVehicleStatus/obdLoctions/${equId}?startTime=${startTime}&vId=${this.vehicleId}`).then(
                    rs => {
                        if(rs && rs.loctionList && rs.loctionList.length > 0){
                            if(rs.loctionList[0].equipmentId != this.equId){
                                return;
                            }
                            // 更新车辆状态
                            this.updateVehicleStatus(rs.status);
                            // 绘制实时定位信息
                            const pointList = [];
                            pointList.push(this.lastPoint);
                            rs.loctionList.forEach(item => {
                                pointList.push(new BMap.Point(item.corlong, item.corlat))
                            });
                            this.drawLine(pointList,{
                                hideEnd:true,
                                hideStart:true,
                                callback: list =>{
                                    // 设置新的图标
                                    const lastP = rs.loctionList[rs.loctionList.length - 1];
                                    let point = list[list.length - 1];
                                    let lastPoint = new BMap.Point(point.lng,point.lat);
                                    const icon = this.getPicIconByDirection(lastP.direction);
                                    this.endMarker.setIcon(icon);
                                    this.endMarker.setPosition(lastPoint);
                                    this.lastPoint = lastPoint;
                                    this.startTime = lastP.locationTime;
                                }
                            });
                        }
                    }
                )
            },

            /*更新车辆状态信息*/
            updateVehicleStatus(dto){
                if(dto){
                    this.vehicleList.forEach(item => {
                        if(item.vehicleId == dto.vehicleId){
                            item.vehicleStatus = dto.vehicleStatus;
                        }
                    })
                }
            },

            /*绘制车辆弹出框内容*/
            getMarkerContent(vehicleId , $this) {
                ajax.get(`obd/obdVehicleStatus/findVehicleStatusByVehicleId/${$this.vehicleId}?type=1`).then(
                    rs => {
                        this.vehicleIdDialog = $this.vehicleId;
                        let geoc = new BMap.Geocoder();
                        geoc.getLocation(this.lastPoint, rs1 => {
                            var opts = {
                                width: 355,     // 信息窗口宽度
                                height: 230,     // 信息窗口高度
                                enableMessage: false,
                                offset: new BMap.Size(0, -20)
                            }
                            let currentVehicleTrack = rs.data;
                            currentVehicleTrack.localtion = rs1.address;
                            let gpsdrct = this.getCarDirection(currentVehicleTrack.direction);
                            //设置地图弹出框内容
                            var status = "";
                            var content = "<p style='font-weight:bold;text-align:left '>车牌：" + currentVehicleTrack.plate + "</p>";
                            content += "<p style='font-weight:bold;text-align:left '>部门 ： " + currentVehicleTrack.companyName + "</p>";
                            if (currentVehicleTrack.vehicleStatus == 1) {
                                status = "运行";
                                content += "<p>状态：" + status + "&nbsp;&nbsp;&nbsp;&nbsp;"  + " <span style=' float:right; _position:relative;'>车速 ： " + currentVehicleTrack.speed + " km/h  &nbsp;&nbsp;&nbsp;</span></p>";
                                content += "航向：" + gpsdrct + " &nbsp;&nbsp;&nbsp;</span></p>";
                                content += "<p>最后更新时间：" + currentVehicleTrack.gpsTime + "</p>";
                                if (currentVehicleTrack.localtion == null || currentVehicleTrack.localtion == undefined) {
                                    content += "<p>位置：未解析地址</p></div>";
                                }
                                else {
                                    content += "<p>位置：" + currentVehicleTrack.localtion + "</p>";
                                }
                            } else if (currentVehicleTrack.vehicleStatus == 3) {
                                status = "离线";
                                content += "<p>状态：" + status + "</p>";
                                content += "<p>最后更新时间：" + currentVehicleTrack.gpsTime + "</p>";
                                content += "<p>位置：" + currentVehicleTrack.localtion + "</p>";
                            } else {
                                status = "停止";
                                content += "<p>状态：" + status + "</p>";
                                content += "<p>最后更新时间：" + currentVehicleTrack.gpsTime + "</p>";
                                content += "<p>位置：" + currentVehicleTrack.localtion + "</p>";
                            }
                            content += `<div style="float: right ; position: relative">`
                            content += `<button type="button" onclick="vlrtCarInfoDetail('${currentVehicleTrack.id}')"  class="el-button el-button--primary el-button--mini mr-15"><span>车辆档案</span></button>`;
                            content += `<button type="button" onclick="vlrtVehicleLocationTrack('${currentVehicleTrack.plate}','${currentVehicleTrack.vehicleId}')" class="el-button el-button--primary el-button--mini mr-15" ><span>车辆轨迹</span></button>`;
                            content += `<button type="button" onclick="vlrtShowDropMenu()" class="el-button el-button--primary el-button--mini mr-15"><span>栅栏设置<i class="el-icon-arrow-up el-icon--right"></span></button>`;
                            content += `<div class="drop-down-menu" id="drop-down-menu" style="display: none ; position: absolute ; z-index:  10000; bottom: 27px;; right: -5px; width: 100px; height: 140px;">
                                        <ul class="el-dropdown-menu el-popper"
                                            style="transform-origin: center top 0px; ">
                                            <li tabindex="-1" onclick="vlrtShowTimeFence('${$this.vehicleId}')" class="el-dropdown-menu__item">时间栅栏</li>
                                            <li tabindex="-1" onclick="vlrtElectronFence('${$this.vehicleId}')"  class="el-dropdown-menu__item">电子围栏</li>
                                            <li tabindex="-1" onclick="vlrtAreaFence('${$this.vehicleId}')" class="el-dropdown-menu__item">区域栅栏</li>
                                        </ul>
                                     </div>`
                            content += `</div>`
                            let infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                            let new_point = this.lastPoint;
                            $this.map.openInfoWindow(infoWindow, new_point);
                        });
                    }
                )
            },

            getFormatTimeStr(time){
                let date = new Date();
                date.setTime(time);
                return  date.format("yyyy-MM-dd HH:mm;ss")
            },

            /*根据车辆方向显示车辆运行时图片*/
            getPicIconByDirection(direction) {
                const iconSize = new BMap.Size(30, 30);
                let icon = new BMap.Icon("/static/img/map_images/car-icon_05.png", iconSize);
                if (direction >= 337.5 || direction < 22.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_05.png", iconSize);
                }
                else if (direction >= 22.5 && direction < 67.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_04.png", iconSize);
                }
                else if (direction >= 67.5 && direction < 112.5) {
                    icon = new BMap.Icon("/static/img/map_im，ages/car-icon_03.png", iconSize);
                }
                else if (direction >= 112.5 && direction < 157.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_02.png", iconSize);
                }
                else if (direction >= 157.5 && direction < 202.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_01.png", iconSize);
                }
                else if (direction >= 202.5 && direction < 247.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_08.png", iconSize);
                }
                else if (direction >= 247.5 && direction < 292.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_07.png", iconSize);
                }
                else if (direction >= 292.5 && direction < 337.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_06.png", iconSize);
                }
                return icon;
            },

            /*获取车辆方向*/
            getCarDirection(direction) {
                let gpsdrct = '未知方向';
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
                ;
                return gpsdrct;
            },

            /*根据车牌查找车辆信息*/
            remoteFindPlateInfo(plateKeyWord) {
                if (plateKeyWord !== '') {
                    this.plateLoading = true;
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword?' +'plate='+plateKeyWord).then(rs => {
                        if (rs && rs.data.length > 0) {
                            setTimeout(() => {
                                this.plateLoading = false;
                                this.options4 = rs.data;
                            }, 200);
                        }else{
                            this.options4 = [];
                            this.plateLoading = false;
                        }
                    })
                } else {
                    this.options4 = [];
                }
            },

            /*删除车牌*/
            deletePlate(index) {
                this.vehicleList.splice(index, 1);
                this.map.clearOverlays();
                if(this.timer){
                    window.clearInterval(this.timer);
                    this.countdown = 10;
                    this.timer = '';
                }

            },

            /*点击显示车辆路线*/
            clickVehicleTrack(bean) {
                if(this.vehicleId && this.vehicleId == bean.vehicleId){
                    return;
                }
                // 清除地图覆盖物
                this.map.clearOverlays();
                this.vehicleId = bean.vehicleId;
                this.countdown = 10;
                this.getVehicleExerciseInfo(this.vehicleId);
            },

        }
    }
</script>

<style scoped lang="scss">
    .active{
        position: relative;
        &:before {
            content: "";
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 5px;
            height: 70%;
            background: #409EFF;
            margin-top: 2%;
        }
    }

    .list-panel {
        padding: 20px;
        display: flex;
        .left-box {
            width: calc(100% - 300px);
            position: relative;
            height: calc(100vh - 200px);
            #map {
                width: 100%;
                height: 100%;
                padding: 0;
            }
            .map-info {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1;
                color: #fff;
                background: #4ca5ff;
                font-size: 14px;
                padding: 5px 8px;
                line-height: 1;

            }
        }
        .right-box {
            padding-left: 10px;
            width: 300px;
            float: right;
            .el-button {
                margin-left: 0;
                padding-left: 8px;
                padding-right: 8px;
            }
            .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .drop-down-menu{
                position: absolute;
                z-index: 10000;
                bottom: 40px;
                right: 0px;
                border: 1px solid red;
                width: 90px;
                height: 140px;
            }


           /* ul {
                margin: 10px 0;
                height: calc(100% - 74px);
                overflow-y: auto;
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    background: #f8f8f8;
                    &:nth-child(n+2) {
                        border-top: 1px solid #eee;
                    }
                }
            }
            i {
                display: inline-block;
                width: 16px;
                height: 16px;
                background-size: 100%;
            }*/
            .icon-run {
                background: url("~img/map_images/run.png") no-repeat;
            }
            .icon-leave {
                background: url("~img/map_images/offline.png") no-repeat;
            }
            .icon-pause {
                background: url("~img/map_images/stop.png") no-repeat;
            }
        }
        .left-row {
            justify-content: flex-start;
            width: 100%;
            margin: 0;
            padding-bottom: 20px;
            padding-left: 20px;
            button {
                padding: 9px 12px;
            }
        }

    }

</style>

