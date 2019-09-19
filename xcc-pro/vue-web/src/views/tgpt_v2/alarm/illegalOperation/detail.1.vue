<template>
    <div class="detail-panel" v-loading="loading">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="非法调度详情" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{detailForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.orgName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">开始时间</label>
                        <div class="input-group">
                            <span>{{detailForm.startTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结束时间</label>
                        <div class="input-group">
                            <span>{{detailForm.endTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">违规时长</label>
                        <div class="input-group">
                            <span>{{detailForm.diffTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{detailForm.driveName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报警开始地址</label>
                        <div class="input-group">
                            <span>{{detailForm.startPlace}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报警结束地址</label>
                        <div class="input-group">
                            <span>{{detailForm.endPlace}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">原因</label>
                        <div class="input-group">
                            <span>{{detailForm.reason}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">核实人</label>
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
                    <div class="detail-item" >
                        <label class="control-label">核实人部门</label>
                        <div class="input-group">
                            <span>{{detailForm.checkerDept}}</span>
                        </div>
                    </div>
                    <div class="detail-item" >
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{detailForm.remark}}</span>
                        </div>
                    </div>
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
                </div>
            </el-collapse-item>

            <el-collapse-item title="行驶轨迹" name="2" >
                <el-col :span="24">
                    <div id="map" style="height: 541px"></div>
                </el-col>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {tool,mapTool} from '@/utils/common'

    export default {
        name: "illegalOperationDetail",
        mixins: [tool,mapTool],
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                loading: true,

            }
        },
        methods: {

            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point( 114.31,30.52 ), 15);
                this.map.enableScrollWheelZoom(true);
                this.map.addControl(new BMap.NavigationControl());
                this.gpsTrack1();
            },
            gpsTrack1(){
                ajax.get('obd/obdLllegalOperation/detail/' + this.id,).then(rs => {
                    this.detailForm = rs.data;
                        /*划线*/
                        let pointList = [];
                        if(this.detailForm && this.detailForm.locationList && this.detailForm.locationList.length > 0){
                            this.detailForm.locationList.forEach(item => {
                                pointList.push(new BMap.Point(item.corlong, item.corlat))
                            });
                            this.drawLine(pointList);
                        }else{
                            /*如果只有开始地址则划出一个点*/
                            if(this.detailForm && this.detailForm.startPlace){
                                this.drawStartPoint(this.detailForm.startPlace);
                            }else{
                                this.$message.warning("未获取到定位信息");
                            }
                        }
                    this.loading = false;
                });
            },
            open(){
                this.show = true;
            },
            /*画出开始点*/
            drawStartPoint(startPlace){
                let geoc = new BMap.Geocoder();
                let $this = this;
                geoc.getPoint(startPlace, function(point){
                    if (point) {
                        let startIcon = new BMap.Icon("/static/img/gpsStart.png", new BMap.Size(20,26),{imageSize:new BMap.Size(20,26)});
                        let marker = new BMap.Marker(point,{icon:startIcon});
                        $this.map.centerAndZoom(point, 16);
                        $this.map.addOverlay(marker);
                    }else{
                        this.$message.warning("未获取到定位信息");
                    }
                }, startPlace);
            },

        },
        mounted() {
            window.initialize = this.initialize;
            var script = document.createElement("script");
            script.src = "https://api.map.baidu.com/api?v=3.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            document.body.appendChild(script);
        }

    }
</script>
