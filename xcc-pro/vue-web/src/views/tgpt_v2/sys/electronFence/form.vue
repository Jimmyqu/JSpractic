<template>
    <div class="map_wrap electron">
        <!-- <div id="map"></div> -->
        <!-- <ve-bmap :settings="mapSetting" :after-set-option-once="initialize" height="100%"
            style="width: 100%;height: 100%" v-loading="mapLoading "
            element-loading-background="rgba(255, 255, 255, 0.6)"></ve-bmap> -->
        <div id="map" style="height: calc(100vh - 120px)" v-loading="mapLoading " element-loading-background="rgba(255, 255, 255, 0.6)"></div>

        <div class="DrawingManager" :class="{'block':showDrawingManager}">
            <ul class="DrawingManager-box">
                <li :class="{'active':drawingManagerActive == 'detail'}" @click="handleDrawingManager('detail')">
                    <span class="detail_img"></span>详情</li>
                <li :class="{'active':drawingManagerActive == 'circlecomplete'}" @click="handleDrawingManager('circlecomplete')">
                    <span class="circle_img"></span>圈选区域</li>
                <li :class="{'active':drawingManagerActive == 'polygoncomplete'}" @click="handleDrawingManager('polygoncomplete')">
                    <span class="polygon_img"></span>自定义区域</li>
                <li :class="{'active':drawingManagerActive == 'rectanglecomplete'}" @click="handleDrawingManager('rectanglecomplete')">
                    <span class="rectangle_img"></span>框选区域</li>
            </ul>
        </div>
        <el-card class="box-card map_right_card">
            <el-form :model="addForm" :rules="rules" label-position="right" ref="addForm" label-width="100px" v-cloak>
                <el-form-item label="服务组织" prop="companyId" :rules="rules.required('请选择服务组织')">
                    <!--<el-select v-model="addForm.companyId" placeholder="请选择">-->
                        <!--<el-option-->
                            <!--v-for="item in organizations"-->
                            <!--:key="item.id"-->
                            <!--:label="item.name"-->
                            <!--:value="item.id">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                    <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                        url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                </el-form-item>

                <el-form-item label="栅栏名称" prop="name" :rules="rules.required()">
                    <el-input v-model="addForm.name" placeholder="栅栏名称"></el-input>
                </el-form-item>

                <el-form-item label="区域报警" prop="type" :rules="rules.required()">
                    <el-select v-model="addForm.type" placeholder="请选择">
                        <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <div class="left-row" style="margin-top: 25px;padding: 0;text-align: right">
                    <el-button @click="close()">返回</el-button>
                    <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                </div>
            </el-form>
        </el-card>
        <el-alert
            title="【小提示】">
            <ul>
                <li>1、画围栏之前，可以拖动地图，及使用鼠标滚轮放大缩小地图到需要的位置后，再开始画围栏；</li>
                <li>2、选中需要的图形类型,点鼠标左键开始画围栏、双击鼠标左键结束画围栏、围栏自动闭合；</li>
                <li>3、围栏使用的是封闭多边形，各个点依次连接，各个边不要有交叉；</li>
                <li>4、围栏可在合理范围内适当设置的大一点，减少误报的可能！</li>
            </ul>
        </el-alert>
    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, mapTool} from '@/utils/common'
    import {isInclude} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        mixins: [tool, ruleTool, mapTool],
        name: "electronFenceForm",
        components: {TreeSelect, CitySelect, MoneyInput,},
        data() {
            return {
                addForm: {},
                types: [
                    {value: 1, label: '区域内'},
                    {value: 2, label: '区域外'}
                ],
                map: {},
                overlay: {},
                organizations:[],
                organization: [],
                PI:3.1415926535897932384626,
                A:6378245.0,
                EE:0.00669342162296594323,
                mapLoading: false,
                drawingManagerActive:'',
                showDrawingManager:false,
                ply:null
            }
        },
        mounted() {
            //this.getOrganizations();
            this.loadResource();
            this.open();
            this.$nextTick(()=>{
                this.initialize();
            })
        },
        activated(){
            const path = this.$route.path
            const flag = path.indexOf('add') != -1 ?this.$store.state.isEditPicture:this.$store.state.isAddPicture
            if(this.$store.state.isParkingPicture || this.$store.state.isPicture || flag ){
                this.drawingManagerActive = 'detail'
                this.$store.state.isElectronPicture = false
                this.$store.state.isPicture = false
            }
        },
        methods: {
            handleDrawingManager(value){
                const path = this.$route.path
                if(path.indexOf('add') != -1){
                    this.$store.state.isAddPicture = true
                    this.$store.state.isEditPicture = false
                }else{
                    this.$store.state.isEditPicture = true
                    this.$store.state.isAddPicture = false
                }
                this.drawingManagerActive = value
                if(value ==  'circlecomplete'){
                    if($('.BMapLib_circle')[0]){
                        $('.BMapLib_circle')[0].click()
                    }
                    this.$store.state.isElectronPicture = true
                }else if(value ==  'polygoncomplete'){
                    if($('.BMapLib_polygon')[0]){
                        $('.BMapLib_polygon')[0].click()
                    }
                    this.$store.state.isElectronPicture = true
                }else if(value ==  'rectanglecomplete'){
                    if($('.BMapLib_rectangle')[0]){
                        $('.BMapLib_rectangle')[0].click()
                    }
                    this.$store.state.isElectronPicture = true
                }else{
                    if(this.$store.state.isElectronPicture){
                        this.$store.state.isPicture = true
                    }
                    this.$store.state.isElectronPicture = false
                    if($('.BMapLib_hander')[0]){
                        $('.BMapLib_hander')[0].click()
                    }
                }
            },
            getOrganizations(){  //获取组织数据
                ajax.get("admin/organization/managerCompany").then((res)=>{
                    if(this.checkResponse(res)){
                        this.organizations = res.data;
                        if(this.organizations.length == 1){
                            this.addForm.companyId=this.organizations[0].id;
                        }
                    }
                });
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                   // this.addForm.companyId = this.organization[0];
                    this.$set(this.addForm,'companyId',this.organization[0]);
                }else{
                    //this.addForm.companyId = '';
                    this.$set(this.addForm,'',this.organization[0]);
                }
            },
            open() {
                this.addForm = {};
                let that = this;
                if (this.$route.query.id) {
                    ajax.get('/base/baseElectron/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        if (rs.data.companyId)
                            this.organization[0] = rs.data.companyId;
                        setTimeout(function () {
                            that.drawOverlay();
                        }, 400);
                    });
                }
            },
            //保存提交
            submitForm: function (form) {
                let data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    if (!this.addForm.shape || !this.addForm.points) {
                        this.$message.error('请在左侧地图绘制电子围栏');
                        return;
                    }

                    ajax.post('/base/baseElectron', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }
                    });
                });
            },
            drawOverlay() {
                if (this.addForm.shape == 1
                    || this.addForm.shape == 3)
                    this.drawPolygon();
                else if (this.addForm.shape == 2)
                    this.drawCircle();

            },
            drawCircle() {
                let array = this.addForm.points.split(',');
                let wgs84_pos=this.wgs84tobd09( parseFloat(array[1]),parseFloat(array[0]));
                let point = new BMap.Point(wgs84_pos.lon,wgs84_pos.lat);
                /*let point = new BMap.Point(parseFloat(array[0]), parseFloat(array[1]));*/


                let circle = new BMap.Circle(point, this.addForm.radius, {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
                this.map.addOverlay(circle);
                this.map.setCenter(point);
                this.map.setZoom(this.getZoom(this.addForm.radius));

                this.overlay = circle;
            },
            getZoom(radius){
                var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]
                for(var i = 0;i<zoom.length;i++){
                    if(zoom[i]-radius > 0){
                        return 18 - i + 1;
                    }
                }
                return 3;
            },
            drawPolygon() {
                let coods = this.addForm.points.split(';');
                let points = [];

                coods.forEach(c => {
                    if (!c)
                        return;
                    let array = c.split(',');
                    let wgs84_pos=this.wgs84tobd09( parseFloat(array[1]),parseFloat(array[0]));
                    let point = new BMap.Point(wgs84_pos.lon,wgs84_pos.lat);
                    /*let point=new BMap.Point(parseFloat(array[0]), parseFloat(array[1]));*/
                    points.push(point);
                });

                let polygon = new BMap.Polygon(points, {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});

                this.map.addOverlay(polygon);
                /*this.map.setCenter(points[0]);
                this.map.setZoom(16);*/
                this.setZoom(points);

                this.overlay = polygon;
            },
            setZoom(bPoints){
                var view = this.map.getViewport(eval(bPoints));
                var mapZoom = view.zoom;
                var centerPoint = view.center;
                this.map.centerAndZoom(centerPoint,mapZoom);
            },
            initialize(echarts) {
                // this.map = echarts.getModel().getComponent('bmap').getBMap();
                const $this = this
                this.map = new BMap.Map('map');
                this.map.centerAndZoom("深圳市");
                this.map.enableScrollWheelZoom(true);

                let size = new BMap.Size(10, 20);
                this.map.addControl(new BMap.CityListControl({
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                    offset: size,
                    // 切换城市之间事件
                    // onChangeBefore: function(){
                    //    alert('before');
                    // },
                    //切换城市之后事件
                    // onChangeAfter:function(rs){
                    // },
                    onChangeSuccess: function (e) {
                        $this.getBoundary(e.city);
                    }
                }));

                // window._drawingManagerLoaded = this.initDrawingManager;
                let script = document.createElement("script");
                // if(!isInclude("https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js")){
                //     //鼠标绘制工具
                //     script.src = "https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js";
                //     document.body.appendChild(script);
                //     script.onload = window._drawingManagerLoaded;
                // }else{
                //     this.initDrawingManager()
                // }

                // if(!isInclude("https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js")){
                //     //geo
                //     script = document.createElement("script");
                //     script.src = "https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js";
                //     document.body.appendChild(script);
                // }
                if(!isInclude("https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css")){
                    let link = document.createElement("link");
                    link.rel = 'stylesheet';
                    link.href = 'https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css';
                    document.body.appendChild(link);
                }
                this.initDrawingManager();
            },
            getBoundary(name){
                const $this = this
                this.handleDrawingManager('detail')
                const bdary = new BMap.Boundary();
                bdary.get(name, function(rs){       //获取行政区域
                    $this.map.clearOverlays();      //清除地图覆盖物
                    const length = rs.boundaries.length
                    var s = 0;
                    if(length > 1){
                        var max = rs.boundaries[0].length;
                        for(var i = 0;i<length;i++){
                           var cur = rs.boundaries[i].length
                            if(cur > max){
                                max = cur
                                s = i
                            }
                        }
                    }
                    const polygon = rs.boundaries[s].split(';')
                    let cityPoints = '';
                    polygon.forEach(p => {
                        let latAndLng=$this.bd09_to_wgs84(p.split(',')[1] , p.split(',')[0] );//百度转gps
                        cityPoints += (latAndLng.lon + ',' + latAndLng.lat + ';');
                    });

                    $this.addForm.shape = 3;
                    $this.addForm.points = cityPoints;

                    $this.ply = new BMap.Polygon(rs.boundaries[s],{strokeColor: '#409eff', strokeWeight: 4, strokeOpacity: 0.5 ,fillColor:'#409eff',fillOpacity:0.3}); //建立多边形覆盖物
                    $this.map.addOverlay($this.ply); //添加覆盖物
                    $this.map.setViewport($this.ply.getPath());    //调整视野
                })
            },
            loadResource() {
                //window.initialize = this.initialize;
                //let script = document.createElement("script");
                //script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
                //document.body.appendChild(script);
            },
            initDrawingManager() {
                this.showDrawingManager = false
                try {
                    let styleOptions = {
                        strokeColor: "red",    //边线颜色。
                        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: 3,       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        strokeStyle: 'solid' //边线的样式，solid或dashed。
                    };

                    //实例化鼠标绘制工具
                    let drawingManager = new BMapLib.DrawingManager(this.map, {
                        isOpen: false, //是否开启绘制模式
                        enableDrawingTool: true, //是否显示工具栏
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_LEFT, //位置
                            offset: new BMap.Size(25, 25), //偏离值
                            drawingModes: [
                                BMAP_DRAWING_CIRCLE,
                                BMAP_DRAWING_POLYGON,
                                BMAP_DRAWING_RECTANGLE]
                        },
                        circleOptions: styleOptions, //圆的样式
                        polylineOptions: styleOptions, //线的样式
                        polygonOptions: styleOptions, //多边形的样式
                        rectangleOptions: styleOptions //矩形的样式
                    });

                    drawingManager.addEventListener('circlecomplete', this.circlecomplete);
                    drawingManager.addEventListener('polygoncomplete', this.polygoncomplete);
                    drawingManager.addEventListener('rectanglecomplete', this.rectanglecomplete);
                    setTimeout(()=>{
                        this.showDrawingManager = true
                    },300)
                } catch (error) {
                    console.log(error)
                }
            },
            circlecomplete(c) {
                if (!c || c.getRadius() == 0)
                    return;
                this.addForm.shape = 2;
                this.addForm.radius = c.getRadius();

                let p = c.getCenter();
                let wgs84_pos = this.bd09_to_wgs84(p.lat,p.lng);
                this.addForm.points = wgs84_pos.lon + ',' + wgs84_pos.lat;
                this.addForm.calculate = 2 * Math.PI * c.getRadius();

                this.map.removeOverlay(this.overlay);
                this.map.removeOverlay(this.ply);
                this.overlay = c;
            },
            polygoncomplete(polygon) {
                this.drawingManagerActive = 'detail'
                //polygon
                this.addForm.shape = 3;
                this.addForm.radius = 0;

                let ps = '';
                polygon.getPath().forEach(p => {
                    let latAndLng=this.bd09_to_wgs84(p.lat,  p.lng);//百度转gps
                    ps += (latAndLng.lon + ',' + latAndLng.lat + ';');
                   /* ps += (p.lng + ',' + p.lat + ';');*/
                });
                this.addForm.points = ps;
                this.addForm.calculate = BMapLib.GeoUtils.getPolygonArea(polygon.getPath());

                this.map.removeOverlay(this.overlay);
                this.map.removeOverlay(this.ply);
                this.overlay = polygon;
            },
            rectanglecomplete(rect) {
                this.addForm.shape = 1;
                this.addForm.radius = 0;

                let ps = '';
                rect.getPath().forEach(p => {
                    let latAndLng=this.bd09_to_wgs84(p.lat,  p.lng);//百度转gps
                    ps += (latAndLng.lon + ',' + latAndLng.lat + ';');
                    /*ps += (p.lng + ',' + p.lat + ';');*/
                });
                this.addForm.points = ps;
                this.addForm.calculate = BMapLib.GeoUtils.getPolygonArea(rect);

                this.map.removeOverlay(this.overlay);
                this.map.removeOverlay(this.ply);
                this.overlay = rect;
            },bd09_to_wgs84(lat,  lon){
                var latAndLon= this.bd09_to_gcj02( lat,  lon);
                return this.gcj02_to_wgs84(latAndLon.lat,latAndLon.lon)
            },bd09_to_gcj02( lat,  lon){
                let x = lon - 0.0065;
                let y = lat - 0.006;
                let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.PI);
                let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.PI);
                return {lat:z * Math.sin(theta), lon:z * Math.cos(theta)};
            },gcj02_to_wgs84(lat,lon){
                let wgs84_pos= this.tran(lat,  lon);
                let gcj02_lon = lon * 2 - wgs84_pos.lon;
                let gcj02_lat = lat * 2 - wgs84_pos.lat;
                return {lat:gcj02_lat, lon:gcj02_lon};
            },tran( lat,  lon){

                var dLat = this.transformLat(lon - 105.0, lat - 35.0);
                var dLon = this.transformLon(lon - 105.0, lat - 35.0);


                let radLat = lat / 180.0 * this.PI;
                var magic = Math.sin(radLat);
                magic = 1 - this.EE * magic * magic;
                let sqrtMagic = Math.sqrt(magic);
                dLat = (dLat * 180.0) / ((this.A * (1 - this.EE)) / (magic * sqrtMagic) * this.PI);
                dLon = (dLon * 180.0) / (this.A / sqrtMagic * Math.cos(radLat) * this.PI);

                let mgLat = lat + dLat;
                let mgLon = lon + dLon;
                return {lat:mgLat, lon:mgLon};
            },transformLat(x, y){
                var ret = -100.0 + 2.0 * x + 3.0 * y;
                ret += 0.2 * y * y + 0.1 * x * y;
                ret += 0.2 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
                return ret;
            },transformLon(x, y){
                var ret = 300.0 + x + 2.0 * y;
                ret += 0.1 * x * x + 0.1 * x * y;
                ret += 0.1 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
                return ret;
            },wgs84tobd09(lat,lon){
                let wgs84_pos= this.tran(lat,  lon);
                return this.gcj02tobd09(wgs84_pos.lat,wgs84_pos.lon);

            },gcj02tobd09(lat,lon){
                let z = Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * this.PI);
                let theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * this.PI);
                let bd_lng = z * Math.cos(theta) + 0.0065;
                let bd_lat = z * Math.sin(theta) + 0.006;
                return {lat:bd_lat, lon:bd_lng};
            }
        }
    }
</script>
<style>
    .map_wrap {
        height: 100%;
        width: 100%;
        position: absolute;
        /*top: 0;*/
        left: 0;
    }

    .map_wrap #map {
        height: 100%;
        width: 100%
    }

    .map_wrap #map .anchorBL {
        display: none;
    }

    .electron .map_right_card {
        position: absolute;
        left: 25px;
        top: 90px;
        z-index: 2;
        width: 340px;
        height: 255px;
        box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.18);
    }

    .map_right_card .el-card__body {
        padding: 15px 15px 15px 0;
    }
    .DrawingManager{
        position: absolute;
        left: 25px;
        top: 25px;
        z-index: 2;
        box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.18);
        background: #fff;
        border-radius: 4px;
        display: none;
    }
    .DrawingManager.block{
        display: block;
    }
    .DrawingManager .DrawingManager-box{
        display: flex;
        padding: 11px 0;
        margin: 0;
    }
    .DrawingManager .DrawingManager-box li{
        border-right: 1px solid #ececec;
        padding: 0 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .DrawingManager .DrawingManager-box li span{
        display: inline-block;
        width: 20px;
        height: 20px;
        background-size: 80%;
        background-position: center;
        background-repeat: no-repeat;
        margin-right: 5px;
    }
    .DrawingManager .DrawingManager-box li .detail_img{
        background-image: url('/static/img/map_images/detail.png');
    }
    .DrawingManager .DrawingManager-box li .circle_img{
        background-image: url('/static/img/map_images/circle.png');
    }
    .DrawingManager .DrawingManager-box li .polygon_img{
        background-image: url('/static/img/map_images/polygon.png');
    }
    .DrawingManager .DrawingManager-box li .rectangle_img{
        background-image: url('/static/img/map_images/rectangle.png');
    }
    .DrawingManager .DrawingManager-box li.active{
        color: #409eff;
    }
    .DrawingManager .DrawingManager-box li.active .detail_img{
        background-image: url('/static/img/map_images/detail_active.png');
    }
    .DrawingManager .DrawingManager-box li.active .circle_img{
        background-image: url('/static/img/map_images/circle_active.png');
    }
    .DrawingManager .DrawingManager-box li.active .polygon_img{
        background-image: url('/static/img/map_images/polygon_active.png');
    }
    .DrawingManager .DrawingManager-box li.active .rectangle_img{
        background-image: url('/static/img/map_images/rectangle_active.png');
    }
    .DrawingManager .DrawingManager-box li.active{
        color: #409eff;
    }
    .el-alert {
        color: #909399;
        background-color: #fff;
        border-color: #bce8f1;
        box-shadow: 0px 4px 2px 0px rgba(0,0,0,0.18);
    }
    .el-alert--info{
        color: #909399;
        width: 338px;
        top: 360px;
        left: 25px;
        position: absolute;
    }

     .el-alert ul {
        padding: 0;
    }

     .el-alert ul li {
        padding: 4px 0;
        font-size: 13px;
        letter-spacing: 1px;
        line-height: 20px;
    }

    /* .map_wrap .BMapLib_Drawing { */
        /* right: 380px !important;
        top: 25px !important; */
    /* } */

    .map_wrap .BMapLib_Drawing_panel {
        border: 1px solid #efefef ;
        box-shadow: 0 3px 2px 1px #ccc;
        display: none;
        /**
            animated
         */
        -webkit-animation-name: fadeInDown;
        animation-name: fadeInDown;

        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            -webkit-transform: translate3d(0, -100%, 0);
            transform: translate3d(0, -100%, 0);
        }

        to {
            opacity: 1;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
    }
</style>

