<template>
    <div class="app-container white-bg list-panel position" v-cloak>
        <div class="radio-group">
            <!--地图头部信息-->
            <el-radio-group v-model="chooseStatus" style="margin: 10px 10px 10px 10px" @change="chooseListByStatus()">
                <el-radio label="全部" >全部{{listVehicle.length ? listVehicle.length: 0}}</el-radio>
                <el-radio label="运行" >运行{{onLineList.length ? onLineList.length: 0}}</el-radio>
                <el-radio label="停止" >停止{{sleepList.length ? sleepList.length: 0}}</el-radio>
                <el-radio label="离线" >离线{{errList.length ? errList.length: 0}}</el-radio>
            </el-radio-group>
            <el-checkbox style="margin:0 40px 0 10px" v-model="showPlate" @change="showPlateDo">显示车牌</el-checkbox>
        </div>
        <el-tag v-show="count && count > 0" type="success" style="position: absolute;top:35px; right: 20px ; z-index: 10000 ;background-color: #28b779 ; color: white">{{count + 'S后刷新'}}</el-tag>
        <div class="frame">
            <template >
                <el-radio v-model="activeName" label="1">有线</el-radio>
                <el-radio v-model="activeName" label="2">无线</el-radio>
                <el-button type="primary" size="small" @click="batchLocation()">查询</el-button>
            </template>
            <div class="form-group" style="margin-top: 15px">
                <div class="input-group">
                    <tree-select v-model="originateDeptId" placeholder="服务组织" type="one"
                                    url="admin/organization/tree"
                    ></tree-select>
                </div>
            </div>
            <div class="form-group" style="margin-top: 10px;">
                <template>
                    <el-select
                        v-model="vehicleId"
                        filterable
                        clearable
                        remote
                        reserve-keyword
                        placeholder="车牌号"
                        :remote-method="remoteFindPlateInfo"
                        :loading="plateLoading">
                        <el-option
                            v-for="(item,i) in options4"
                            :key="i"
                            :label="item.plate"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </template>
            </div>
            <div class="table-box frame-table-box" v-if="selectedList.length > 0">
                <h4>车辆:{{selectedList.length}}</h4>
                <el-table v-loading="listLoading" :data="selectedList" style="width: 100%;cursor: pointer;" height="350" ref="table" @cell-click="handleSelectionChange" >
                    <el-table-column min-width="120" label="车牌" prop="plate"  show-overflow-tooltip ></el-table-column>
                    <el-table-column min-width="120" label="状态" prop="statusText"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.vehicleStatus == 1" style="color: #409EFF ; " >{{scope.row.statusText}}</span>
                            <span v-if="scope.row.vehicleStatus == 2" style="color: #E6A23C ; ">{{scope.row.statusText}}</span>
                            <span v-if="scope.row.vehicleStatus == 3 || scope.row.vehicleStatus == 0 || scope.row.vehicleStatus == null" style="color: #F56C6C ; ">{{scope.row.statusText}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        
        <!-- <div id="map" style="height: 800px"></div> -->
        <ve-bmap :settings="mapSetting" :after-set-option-once="initialize" height="100%"
                style="width: 100%;height: calc(100vh - 120px)" v-loading="mapLoading " element-loading-background="rgba(255, 255, 255, 0.6)">
        </ve-bmap>

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
    import {tool, mapTool} from '@/utils/common'

    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import '@/utils/markerManager.js'

    export default {
        name: 'vehicleLocation',
        mixins: [tool, mapTool],
        components: { TreeSelect, veBmap },
        data() {
            return {
                map:{},
                //搜索框的车辆id
                vehicleId: [],
                //远程搜索车牌号
                options4: [],
                loading: false,
                mapLoading: false,
                plateLoading: false,
                plate: '',
                /*部门id*/
                originateDeptId:'',
                /*车辆数据集合*/
                listVehicle: [],
                /*在线车辆数据集合*/
                onLineList:[],
                /*休眠车辆集合*/
                sleepList:[],
                /*故障车辆集合*/
                errList:[],
                /*当前选择车辆集合*/
                selectedList: [],
                /*当前选择状态*/
                chooseStatus: '全部',  //运行 ， 停止， 离线
                /*是否显示车牌*/
                showPlate: false,
                timmer: '',
                count: 0,
                timeJob: '',
                mrg: {},
                activeName: '1',
                showEnabledBtn:true,
                dialogTableVisibleTime: false,
                dialogTableVisibleArea:false,
                dialogTableVisibleElectron:false,
                dialogParam:{},
                organCascade:[],
                listUrl: '',
                limtListData:{}
            }
        },
        mounted() {
            /*绑定事件*/
            window.vlShowDropMenu = this.vlShowDropMenu;
            window.vlCarInfoDetail = this.vlCarInfoDetail;
            window.vlToLocationRealtime = this.vlToLocationRealtime;
            window.vlToVehicleLocationTrack = this.vlToVehicleLocationTrack;
            window.vlToVehicleTrackRecord = this.vlToVehicleTrackRecord;
            window.vlAreaFence = this.vlrtAreaFenceLocation;
            window.vlElectronFence = this.vlrtElectronFenceLocation;
            window.vlShowTimeFence = this.vlShowTimeFence;
            //window.initialize = this.initialize;
            //var script = document.createElement("script");
            //script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            //document.body.appendChild(script);

            //初始化从参数带过来的车牌号
            this.platInit();
        },
        methods: {
            initialize(echarts){
                this.map = echarts.getModel().getComponent('bmap').getBMap()
                // this.map = new BMap.Map('map');
                this.map.centerAndZoom("武汉", 12);
                this.map.enableScrollWheelZoom(true);
                this.mrg = new BMapLib.MarkerManager(this.map , {borderPadding: 10,maxZoom: 19,trackMarkers: true});
                this.platInit();
            },

            platInit(){
                let plate = this.$route.query.plate;
                let vId = this.$route.query.id;
                let activeName = this.$route.query.activeName;
                let runStatus = this.$route.query.runStatus;
                if(runStatus){
                    if (runStatus == "1"){
                        this.chooseStatus = '运行'
                    } else if(runStatus == "2"){
                        this.chooseStatus = '停止'
                    } else if(runStatus == "3"){
                        this.chooseStatus = '离线'
                    }
                    this.batchLocation();
                }
                else
                if (plate && vId && activeName){
                    this.options4.push(
                        {plate:plate , id:vId}
                    );
                    this.vehicleId = vId;
                    this.activeName = activeName;
                    this.batchLocation();
                }
            },

            /*跳转车辆档案*/
            vlCarInfoDetail(id){
                let url = `/tgpt/vehicle/vehicleInformation/detail/${id}`
                this.$router.push({path: url});
            },


            /*显示下拉菜单*/
            vlShowDropMenu(type){
                if(type == 1){
                    $("#drop-down-menu2").hide();
                    $("#drop-down-menu1").toggle();
                }
                if(type == 2){
                    $("#drop-down-menu1").hide();
                    $("#drop-down-menu2").toggle();
                }
            },

            /*跳转实时追踪界面*/
            vlToLocationRealtime(vehicleId , plate){
                let url = `/tgpt_v2/obd/vehicleLocationRealtime`;
                this.$router.push({path: url , query:{vehicleId : vehicleId ,plate:plate}});
            },

            /*跳转行程记录页面*/
            vlToVehicleTrackRecord(plate){
                let url = `/tgpt_v2/obd/vehicleTrackRecord`;
                this.$router.push({path: url , query:{plate:plate}});
            },

            /*跳转车辆轨迹页面*/
            vlToVehicleLocationTrack(vehicleId , plate , equType){
                let url = `/tgpt_v2/obd/vehicleLocationTrack`;
                this.$router.push({path: url , query:{vehicleId : vehicleId ,plate:plate , equType: equType}});
            },

            /*时间栅栏*/
            vlShowTimeFence(){
                this.dialogTableVisibleTime = true;
                this.listUrl='base/baseTimeFence'
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

            /*区域围栏*/
            vlrtAreaFenceLocation(){
                this.dialogTableVisibleArea = true;
                this.listUrl='/base/baseAreaFence'
                this.getList();
            },

            /*电子栅栏*/
            vlrtElectronFenceLocation(){
                this.dialogTableVisibleElectron = true;
                this.listUrl='/base/baseElectron'
                this.getList();
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
                                vehicleId: this.selectedList[0].vehicleId
                            };
                        } else if(index==2){
                            addUrl = 'base/baseAreaFence/vehicleSetFence'
                            param = {
                                areaId: this.list[i].id,
                                vehicleId: this.selectedList[0].vehicleId
                            };
                        }else {
                            addUrl = '/base/baseElectron/vehicleSetFence'
                            param = {
                                areaId: this.list[i].id,
                                vehicleId: this.selectedList[0].vehicleId
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
                const params = {
                    vehicleId:this.selectedList[0].vehicleId
                }
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
            },

            _delete(index) {
                for(var i = 0;i<this.organCascade.length;i++){
                    if(this.organCascade[i]==false){
                        var param = {
                            areaId: this.list[i].id,
                            vehicleId: this.selectedList[0].vehicleId
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

            /*是否显示车牌*/
            showPlateDo(){
                this.markInfo(this.selectedList , this.showPlate);
                this.addPoint(this.selectedList[0]);
            },

            /*根据状态选择对应数据*/
            chooseListByStatus(){
                this.addListByType();
                if(this.selectedList && this.selectedList.length > 0){
                    this.markInfo(this.selectedList);
                    this.addPoint(this.selectedList[0]);
                }else{
                    this.mrg.clearMarkers();
                }
            },

            /*数据分组*/
            groupList(){
                this.onLineList = [];
                this.sleepList = [];
                this.errList = [];
                this.selectedList = [];
                this.listVehicle.forEach(item => {
                    if(item.vehicleStatus == 1){
                        item.statusText = '运行';
                        if(item.speed && item.speed > 0){
                            item.statusText = '运行';
                        }else{
                            item.statusText = '运行/怠速';
                        }
                        this.onLineList.push(item);
                    }else if(item.vehicleStatus == 2){
                        item.statusText = `停止${item.runtime ? item.runtime: ''}`;
                        this.sleepList.push(item);
                    }else if(item.vehicleStatus ==3){
                        item.statusText = `离线${item.runtime ? item.runtime: ''}`;
                        this.errList.push(item);
                    }else{
                        item.statusText = `未定位`;
                    }
                });
            },

            /*查询车牌信息*/
            remoteFindPlateInfo(plateKeyWord) {
                if (plateKeyWord !== '') {
                    this.plateLoading = true;
                    var companyId=''
                    if(this.originateDeptId && this.originateDeptId.length>0){
                        companyId=this.originateDeptId[0];
                    }
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword?' + 'plate='+plateKeyWord+'&companyId='+companyId).then(rs => {
                        if(rs && rs.data.length > 0){
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
            /*批量查询*/
            batchLocation() {
                this.mapLoading = true;
                ajax.get(`obd/obdVehicleStatus/findVehicleListLocation?vehicleId=${this.vehicleId == null ?'':this.vehicleId}&orgId=${this.originateDeptId}&equType=${this.activeName}`).then(rs => {
                    this.mapLoading = false;
                    if(rs.data == null || rs.data.length == 0){
                        this.$message.warning("未获取到车辆定位信息！");
                        return;
                    }
                    /*地理位置坐标转换*/
                    this.listVehicle = rs.data;
                    /*数据分组*/
                    this.groupList(rs.data);
                    /*选中数据*/
                    this.addListByType();
                    /*标注*/
                    this.markInfo(this.selectedList , this.showPlate);
                    /*聚焦*/
                    this.addPoint(this.selectedList[0]);
                }).catch(_ => {
                    this.mapLoading = false;
                });
            },

            /*打开弹出框*/
            handleSelectionChange(item){
                this.openInfoWindow(item);
                this.addPoint(item)
            },

            /*选择对应数据*/
            addListByType(){
                if(this.chooseStatus == '全部'){
                    this.selectedList = this.listVehicle;
                }else if(this.chooseStatus == '运行'){
                    this.selectedList = this.onLineList;
                }else if(this.chooseStatus == '停止'){
                    this.selectedList = this.sleepList;
                }else {
                    this.selectedList = this.errList;
                }
            },

            /*视图地图定位*/
            addPoint(item){
                if(!item.corlong || !item.corlat){
                    this.$message.warning("未获取到车辆定位信息！");
                    return;
                }
                let pt = new BMap.Point(item.corlong ,item.corlat);
                this.map.panTo(pt);
                this.mrg.showMarkers();
            },

            /*标注信息*/
            markInfo(currentVehicleTrackList , flag){
                var iconSize = new BMap.Size(24, 29);
                this.mrg.clearMarkers();
                let markers = [];
                for (var i = 0; i < currentVehicleTrackList.length; i++) {
                    let  currentVehicleTrack = currentVehicleTrackList[i];
                    let vehicleStatus = currentVehicleTrack.vehicleStatus;
                    let icon;
                    if (vehicleStatus == 1) {
                        icon = new BMap.Icon("/static/img/map_images/run_car.png", iconSize);
                    }
                    else if (vehicleStatus == 2) {
                        icon = new BMap.Icon("/static/img/map_images/stop_car.png", iconSize);
                    }
                    else {
                        icon = new BMap.Icon("/static/img/map_images/offline_car.png", iconSize);
                    }
                    let new_point = new BMap.Point(currentVehicleTrack.corlong , currentVehicleTrack.corlat);
                    let marker = new BMap.Marker(new_point);  // 创建标注
                    marker.setIcon(icon);//图标
                    /*显示车牌*/
                    if(flag){
                        let text = new BMap.Label(currentVehicleTrack.plate,{offset:new BMap.Size(20,-10)});
                        marker.setLabel(text);
                    };
                    marker.addEventListener("click", ()=>{
                        this.openInfoWindow(currentVehicleTrack);
                    });
                    markers.push(marker);
                }
                this.mrg.addMarkers(markers);
    },


            /*打开信息框*/
            openInfoWindow(currentVehicleTrack){
                if(!currentVehicleTrack.corlong || !currentVehicleTrack.corlat){
                    this.$message.warning("未获取到车辆定位信息！");
                    return;
                }
                /*根据经纬度获取车辆定位地址*/
                let geoc = new BMap.Geocoder();
                let pt = new BMap.Point(currentVehicleTrack.corlong,currentVehicleTrack.corlat);
                geoc.getLocation(pt, rs => {
                    currentVehicleTrack.localtion = rs.address;
                    let vehicleStatus = currentVehicleTrack.vehicleStatus;
                    var opts = {
                        width: 355,     // 信息窗口宽度
                        height: 200,     // 信息窗口高度
                        enableMessage: false,
                        offset: new BMap.Size(0, -20)
                    }
                    //创建弹出框信息
                    var content;
                    var gpsdrct;
                    var direction = currentVehicleTrack.direction;
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
                    if (vehicleStatus == 1) {
                        status = "运行";
                    }else if (vehicleStatus == 2) {
                        status = "停止";
                    }else {
                        status = "离线";
                    }
                    var content = "<p style='font-weight:bold;text-align:left '>车牌：" + currentVehicleTrack.plate;
                    content += "<p style='text-align:left '>部门 ： " + currentVehicleTrack.companyName + "<span style=' float:right; _position:relative;'>航向：" + gpsdrct + "&nbsp;&nbsp;&nbsp;</span> </p>";
                    content += "<p>状态：" + status  + " <span style=' float:right; _position:relative;'>车速 ： " +  currentVehicleTrack.speed + " km/h  &nbsp;&nbsp;&nbsp;</span></p>";
                    content += "<p>时间：" + currentVehicleTrack.gpsTime + "</p>";
                    if ( currentVehicleTrack.localtion == null ||  currentVehicleTrack.localtion == undefined) {
                        content += "<p>位置：未解析地址</p></div>";
                    }
                    else {
                        content += "<p>位置：" + currentVehicleTrack.localtion + "</p>";
                    }
                    content += `<div style="float: right; " >`
                    content += `<button type="button" onclick="vlCarInfoDetail('${currentVehicleTrack.id}')" class="el-button el-button--primary el-button--mini " ><span>车辆档案</span></button>`;
                    content += `<button type="button" onclick="vlShowDropMenu('1')" class="el-button el-button--primary el-button--mini "><span>行程轨迹</span></button>`;
                    content += `<div class="drop-down-menu1" id="drop-down-menu1" >
                                        <ul class="el-dropdown-menu "
                                            style="transform-origin: center top 0px; ">
                                            <li tabindex="-1" onclick="vlToLocationRealtime('${currentVehicleTrack.vehicleId}', '${currentVehicleTrack.plate}')" class="el-dropdown-menu__item">实时追踪</li>
                                            <li tabindex="-1" onclick="vlToVehicleLocationTrack('${currentVehicleTrack.vehicleId}', '${currentVehicleTrack.plate}','${this.activeName}' )"  class="el-dropdown-menu__item">车辆轨迹</li>
                                            <li tabindex="-1" onclick="vlToVehicleTrackRecord('${currentVehicleTrack.plate}')" class="el-dropdown-menu__item">行程记录</li>
                                        </ul>
                                     </div>`
                    content += `<button style="margin-left: 10px;" type="button" onclick="vlShowDropMenu('2')"  class="el-button el-button--primary el-button--mini"><span>栅栏设置</span></button>`;
                    content += `<div class="drop-down-menu2" id="drop-down-menu2" >
                                        <ul class="el-dropdown-menu el-popper"
                                            style="transform-origin: center top 0px; ">
                                            <li tabindex="-1" onclick="vlShowTimeFence('${currentVehicleTrack.vehicleId}')" class="el-dropdown-menu__item">时间栅栏</li>
                                            <li tabindex="-1" onclick="vlElectronFence('${currentVehicleTrack.vehicleId}')"  class="el-dropdown-menu__item">电子围栏</li>
                                            <li tabindex="-1" onclick="vlAreaFence('${currentVehicleTrack.vehicleId}')" class="el-dropdown-menu__item">区域栅栏</li>
                                        </ul>
                                     </div>`
                    content += `</div>`
                    var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                    var new_point = new BMap.Point(currentVehicleTrack.corlong , currentVehicleTrack.corlat);
                    this.map.openInfoWindow(infoWindow, new_point);
                });

            }

        }
    }
</script>
<style>
    .drop-down-menu1{
        display: none; position: absolute ; z-index:  10000; bottom: 34px;; right: 70px; width: 100px; height: 140px;
    }

    .drop-down-menu2{
        display: none;  position: absolute ; z-index:  10000; bottom: 34px;; right: -5px; width: 100px; height: 140px;
    }

</style>

