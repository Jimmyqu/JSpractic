<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <el-row :gutter="20">
            <el-col :span="19">
                <div id="map" style="height: 650px"></div>
            </el-col>
            <el-col :span="5" style="padding: 20px">
                <div class="item" >
                    <template >
                        <el-radio v-model="activeName" label="1">有线</el-radio>
                        <el-radio v-model="activeName" label="2">无线</el-radio>
                    </template>
                    <!--<el-date-picker
                        v-model="targetTime"
                        type="datetime"
                        placeholder="日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>-->
                    <el-date-picker style="margin-top: 15px"
                        v-model="targetTime"
                        size="small"
                        value-format="timestamp"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="form-group" style="margin-top: 10px;">
                    <template>
                        <el-select
                            v-model="vehicleId"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="车牌号"
                            :remote-method="remoteFindPlateInfo"
                            :loading="loading">
                            <el-option
                                v-for="item in options4"
                                :key="item.id"
                                :label="item.plate"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </div>
                <div class="search-btn-list" style="width: 100%; margin-top: 10px;">
                    <el-button type="primary" size="small" @click="batchLocation()">查询</el-button>
                </div>
                <h3>位置:{{list.length}}</h3>
                <div style="height: 400px;overflow-y: scroll;">
                    <div v-if="list.length > 0" v-for="(bean,i) in list" :key="i" class="panle-box" :class="{'active':bean.id == activeId}"  @click="handleSelectionChange(bean)">
                        <p>车牌:{{plate}}</p>
                        <p>时间:{{bean.locationTime}}</p>
                        <p>车速:{{bean.speed}}&nbsp;km/h</p>
                        <p>航向:{{bean.directionName}}</p>
                       <!-- <p>位置:{{bean.localtion}}</p>-->
                    </div>
                </div>

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
        name: 'vehicleLocationHistorical',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                activeId:'',
                map:{},
                //搜索框的车辆id
                vehicleId: "",
                //远程搜索车牌号
                options4: [],
                loading: false,
                plate: '',
                targetTime:'',
                showSearch: false,
                searchParam: {
                },
                listUrl: '',
                pamVehicleId:this.$route.query.vehicleId,
                pamPlate:this.$route.query.plate,
                activeName: '1'
            }
        },
        activated(){
        },
        mounted() {
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })
            this.open();
        },
        methods: {
            open() {
                if(this.pamVehicleId!=undefined && this.pamVehicleId!='' && this.pamPlate!=undefined && this.pamPlate!=''){
                    this.remoteFindPlateInfo(this.pamPlate);
                    this.vehicleId=this.pamVehicleId;
                    /*this.targetTime=this.getStringDate(new Date());*/
                    this.batchLocation();
                }
            },
            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
                this.map.enableScrollWheelZoom(true);
            },

            /*查询车牌信息*/
            remoteFindPlateInfo(plateKeyWord) {
                if (plateKeyWord !== '') {
                    var companyId=''
                    if(this.originateDeptId && this.originateDeptId.length>0){
                        companyId=this.originateDeptId[0];
                    }
                    ajax.get('obd/obdVehicleStatus/findPlateListByKeyword', {plate:plateKeyWord, companyId:companyId}).then(rs => {
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
            /*批量查询*/
            batchLocation() {
                var $this = this;
                if(!this.targetTime){
                    $this.$message.error("请选择时间！");
                    return;
                }
                if(!$this.vehicleId){
                    $this.$message.error("请输入车牌号！");
                    return;
                }
               var pamar="vehicleId="+this.vehicleId+"&startTime="+this.targetTime[0]+"&endTime="+this.targetTime[1]+ "&equType="+this.activeName;

                const loading = this.$loading({fullscreen: false, lock: true, text: '拼命加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)', target: document.querySelector('#map') });
                setTimeout(() => {
                    loading.close();
                }, 10000);

                ajax.get(`obd/obdVehicleStatus/historical?`+pamar).then(rs => {
                    loading.close();
                    if(rs.data == null){
                        this.$message.error("未获取到该车辆信息！");
                        return;
                    }
                    this.getPlate();
                    this.list = rs.data;
                    this.activeId = rs.data[0].id;
                    this.list.forEach(item =>{
                        item.directionName=this.getDirection(item.direction);
                        item.locationTime= this.getTimeDate(item.locationTime);
                    })
                    setTimeout(rst =>{
                        this.markInfo(rs.data[0]);
                        this.addPoint(rs.data[0]);
                    },1000)

                }).catch(_ => {
                    loading.close();
                });
            },
            /*打开弹出框*/
            handleSelectionChange(item){
                this.activeId = item.id;
                this.markInfo(item);
                this.openInfoWindow(item);
            },

            /*视图地图定位*/
            addPoint(item){
                let pt = new BMap.Point(item.corlong, item.corlat);
                this.map.panTo(pt);
            },

            /*标注信息*/
            markInfo(currentVehicleTrack){
                var iconSize = new BMap.Size(24, 29);
                this.map.clearOverlays();
                let direction = currentVehicleTrack.direction;
                //let vehicleStatus = currentVehicleTrack.vehicleStatus;
                let icon;
                if (direction >= 337.5 || direction < 22.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_05.png", iconSize);
                }
                else if (direction >= 22.5 && direction < 67.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_04.png", iconSize);
                }
                else if (direction >= 67.5 && direction < 112.5) {
                    icon = new BMap.Icon("/static/img/map_images/car-icon_03.png", iconSize);
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
                let new_point = new BMap.Point(currentVehicleTrack.corlong, currentVehicleTrack.corlat);
                let marker = new BMap.Marker(new_point);  // 创建标注
                marker.setIcon(icon);//图标
                marker.addEventListener("click", ()=>{
                    this.openInfoWindow(currentVehicleTrack);
                });
                this.map.addOverlay(marker);
                this.addPoint(currentVehicleTrack);

            },

            /*打开信息框*/
            openInfoWindow(currentVehicleTrack){
                let vehicleStatus = currentVehicleTrack.currentVehicleTrack;
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
                gpsdrct=this.getDirection(direction);
                //设置地图弹出框内容
                var status = "";
                if (vehicleStatus == 1) {
                    status = "运行";
                }else if (vehicleStatus == 2) {
                    status = "停止";
                }else {
                    status = "离线";
                }
                var positionText;
                if (currentVehicleTrack.position == 1) {
                    positionText = "是";
                }else {
                    positionText = "否";
                }

                var content = "<p>车牌：" + this.plate + "</p>";
                content += "<p>时间：" + currentVehicleTrack.locationTime + "</p>";
                content += "<p>车速 ： " +  currentVehicleTrack.speed + " km/h "+ "<span style=' float:right; _position:relative;'>航向：" + gpsdrct + "&nbsp;&nbsp;&nbsp;</span> </p>";
                /*       content += "<p style='text-align:left '>部门 ： " + currentVehicleTrack.companyName + "<span style=' float:right; _position:relative;'>航向：" + gpsdrct + "&nbsp;&nbsp;&nbsp;</span> </p>";
                       content += "<p>状态：" + status + "&nbsp;&nbsp;&nbsp;&nbsp;" +  currentVehicleTrack.runTime + " <span style=' float:right; _position:relative;'>车速 ： " +  currentVehicleTrack.speed + " km/h  &nbsp;&nbsp;&nbsp;</span></p>";
                       content += "<p>时间：" + currentVehicleTrack.updateTimeStr + "</p>";*/
                // var lng = data.startLat + "," + data.startLat;
                // var lat = data.endLat + "," + data.endLong;
                if ( currentVehicleTrack.corlong == null ||  currentVehicleTrack.corlong == undefined) {
                    content += "<p>位置：未解析地址</p></div>";
                    var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                    var new_point = new BMap.Point(currentVehicleTrack.corlong, currentVehicleTrack.corlat);
                    this.map.openInfoWindow(infoWindow, new_point);
                }else{
                    var geoc = new BMap.Geocoder();
                    var point = new BMap.Point(currentVehicleTrack.corlong, currentVehicleTrack.corlat);
                    geoc.getLocation(point, rs => {
                        var addComp = rs.addressComponents;
                        content +="<p>位置：" + addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber+ "</p>";
                        var infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                        var new_point = new BMap.Point(currentVehicleTrack.corlong, currentVehicleTrack.corlat);
                        this.map.openInfoWindow(infoWindow, new_point);
                    });

                }
            },

            getPlate(){
                for(var i=0;i<this.options4.length;i++){
                    if(this.options4[i].id==this.vehicleId){
                        this.plate=this.options4[i].plate;
                    }
                }
            },
            getDirection(direction){
                var gpsdrct="";
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
                  return gpsdrct;
             },
            getTimeDate(time){
                let date = new Date();
                date.setTime(time);
                return  date.format("yyyy-MM-dd HH:mm;ss")
            },
            getStringDate(d){
                var month=(d.getMonth() + 1)>9?(d.getMonth() + 1):("0"+(d.getMonth() + 1));
                var date=d.getDate()>9?d.getDate():("0"+d.getDate())
                var times=d.getFullYear() + '-' +month  + '-' +date + ' ' +  '00:' + '00:' +'00';
                return times;
            }
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
            height: 100%;
            background: #409EFF;
        }
    }

    .panle-box{
        background-color: #f0f1f4 ;
        padding: 1px 0px 1px 10px;
    }
</style>

