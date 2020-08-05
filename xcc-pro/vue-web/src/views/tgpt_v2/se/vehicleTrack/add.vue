<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <el-row :gutter="20">
            <el-col :span="19" style="padding: 10px ; position: relative">
                <el-tag v-show="count && count > 0" type="success" style="position: absolute;top:30px; right: 20px ; z-index: 10000 ;background-color: #28b779 ; color: white">{{count + 'S后刷新'}}</el-tag>
                <div id="map" style="height: 600px"></div>
            </el-col>
            <el-col :span="5" style="padding-right: 20px">
                <el-card class="box-card" style="width: 95% ; margin-top: 10px">
                    <div slot="header" class="clearfix">
                        <h4>车辆信息</h4>
                    </div>
                    <div class="text item">
                       车牌: {{plate}}
                    </div>
                    <div class="text item">
                        IMEI:{{vehicleInfo.imei}}
                    </div>
                    <div class="text item">
                        车型:{{vehicleInfo.vehicleModalName}}
                    </div>
                    <div class="text item">
                        所属部门:{{vehicleInfo.orgName}}
                    </div>
                </el-card>
                <el-card class="box-card" style="margin-top: 10px ;width: 95%">
                    <div slot="header" class="clearfix">
                        <h4>跟踪计划</h4>
                    </div>
                    <div class="text item">
                        定时时间(分钟): {{data.duration}}
                    </div>
                    <div class="text item">
                        上报间隔(秒): {{data.reportingInterval}}
                    </div>
                    <div class="text item">
                        上报间隔(秒): {{data.startTime}}
                    </div>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    export default {
        name: "vehicleTrackAdd",
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },

        data() {
            return {
                vehicleId: '',
                data:{},
                plate:'',
                points: [],
                timmer: '',
                count: 0,
                timeJob: '',
                driving:'',
                vehicleInfo:{},

            }
        },
        activated(){

        },

        beforeMount(){
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
        },
        mounted() {
            this.$nextTick(()=>{
                this.initialize();
            })
        },


        methods: {
            /*地图初始化*/
            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom("武汉",15);
                this.map.enableScrollWheelZoom(true);
                this.dataInit();
            },

            /*数据初始化*/
            dataInit(){
                this.vehicleId = this.$route.query.id;
                this.plate = this.$route.query.plate;
                this.equipmentId = this.$route.query.equipmentId;
                this.type = this.$route.query.type;
                this.getZzPlane();
                this.getVehicleInfo();
            },

            /*根据设备车辆信息*/
            getVehicleInfo(){
                ajax.get(`se/seLocation/equipment/${this.equipmentId}`).then( res=>{
                    this.vehicleInfo = res;
                });

            },

            /*获取追踪计划*/
            getZzPlane(){
                ajax.get(`se/seTrackingPlan/vehicleId/${this.vehicleId}?equipmentId=${this.equipmentId}`).then(res => {
                   if(res.status == 0){
                        if(this.points && this.points.length > 0){
                            this.addLoctions(this.data.locations , res.data.locations);
                            this.data = res.data;
                        }else{
                            this.data = res.data;
                            this.markGps(this.data.locations);
                        }
                        if(!this.timmer && !this.type){
                            this.editSxTime();
                        }
                   } else{
                       this.showMessage(res.msg);
                   }
                },error => {
                    this.showMessage('无法获取设备定位信息');
                });
            },

            /*动态加载刷新数据描点*/
            addLoctions(dataList , resList){
                let locations = [];
                /*对别数据*/
                resList.forEach((item,index) => {
                    let time = dataList[dataList.length - 1].localtionTime.replace(/-/g,"/");
                    let localtionTime = item.localtionTime.replace(/-/g,"/");
                    if(new Date(time).getTime() < new Date(localtionTime).getTime()){
                        locations.push(item);
                    }
                });
                if(locations.length > 0){
                    locations.unshift(dataList[dataList.length - 1]);
                    this.markGps(locations);
                }

            },

            /*描述gps轨迹*/
            markGps(locations){
                this.getAllLoctionPoints(locations);
                for(let i=0 ; i<locations.length - 1 ; i++){
                    this.drivingJob(this.points[i] , this.points[i+1] , locations[i+1]);
                }
            },

            /*获取所有点坐标信息*/
            getAllLoctionPoints(locations){
                locations.forEach(item => {
                    let point = new BMap.Point(item.latitude, item.longitude);
                    this.points.push(point);
                });
            },
            /*划线方法*/
            drivingJob(point1 , point2 , location){
                    let driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: false},
                        onMarkersSet:(routes)=> {
                            this.map.removeOverlay(routes[0].marker); //删除API自带起点
                            this.map.removeOverlay(routes[1].marker); //删除API自带终点
                        }});
                driving.search(point1, point2);
                console.log(location);
                this.drawMark(location);
                this.map.panTo(point2);
            },

            /*绘制标记点*/
            drawMark(item){
                let point = new BMap.Point(item.latitude, item.longitude);
                let icon = this.getIcon(item.direction);
                let marker = new BMap.Marker(point,{icon:icon});
                this.map.clearOverlays();
                this.map.addOverlay(marker);
                marker.addEventListener("click", ()=> {
                    this.showInfoBox(item);
                });
            },

            showInfoBox(item){
                ajax.get(`se/seLocation/vehicle/${item.vehicleId}`).then( res=>{
                    let opts = {
                        width: 355,     // 信息窗口宽度
                        height: 180,     // 信息窗口高度
                        enableMessage: false,
                        offset: new BMap.Size(0, -20)
                    }
                    let content = this.assambleVehicleInfo(res);
                    let infoWindow = new BMap.InfoWindow(content,  opts);  // 创建信息窗口对象
                    let new_point = new BMap.Point(item.latitude, item.longitude);
                    this.map.openInfoWindow(infoWindow, new_point);
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
                return content;
            },

            /*获取点icon图标*/
            getIcon(direction){
                let iconSize = new BMap.Size(24, 29);
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
                return icon;
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

            /*异步搜索车牌号*/
            querySearchAsync(){

            },

            /*修改刷新时间*/
            editSxTime(){
                this.startTimeJob();
                if(this.timmer){
                    clearInterval(this.timmer);
                }
                /*设置定时刷新时间*/
                this.timmer = setInterval(()=>{
                    this.startTimeJob();
                    this.getZzPlane();
                }, this.data.reportingInterval*1000);
            },

            /*时间定时器*/
            startTimeJob(){
                this.count = this.data.reportingInterval;
                if(this.timeJob){
                    clearInterval(this.timeJob);
                }
                this.timeJob = setInterval(()=>{
                    this.count --;
                }, 1000);
            },
        }


    }
</script>
<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,

    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
</style>
