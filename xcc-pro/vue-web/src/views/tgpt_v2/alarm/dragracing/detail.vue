<template>
    <div class="newDetail-panel">
        <div id="map" style="width:100%;height:calc(100vh - 121px)"></div>
        <div class="detail__dialog detail-box " v-drag-dialog>
            <div class="detail-title detail-title__header">
                车辆详情
            </div>
            <div class="flex-panel detail-body">
                <div class="detail-item">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <span>{{detailForm.plate}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">车辆属性</label>
                    <div class="input-group">
                        <span>{{detailForm.assets}}</span>
                    </div>
                </div>
                <!--<div class="detail-item">
                    <label class="control-label">所属部门</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.organizationId)" effect="dark" :content="detailForm.organizationId" placement="top">
                            <span>{{detailForm.organizationId}}</span>
                        </el-tooltip>
                    </div>
                </div>-->
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
                    <label class="control-label">飙车时长</label>
                    <div class="input-group">
                        <span>{{detailForm.overSpeedTimeDuration}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">飙车里程(km)</label>
                    <div class="input-group">
                        <span>{{detailForm.mileage}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">最高车速(km/h)</label>
                    <div class="input-group">
                        <span>{{detailForm.maxSpeed}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">绑定状态</label>
                    <div class="input-group">
                        <span>{{detailForm.bindStatus}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {tool,mapTool} from '@/utils/common'
    import dragDialog from '@/directive/drag-dialog'

    export default {
        name: "dragracingDetail",
        mixins: [tool,mapTool],
        directives:{dragDialog},
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,

            }
        },
        methods: {

            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point( 114.31,30.52 ), 15);
                this.map.enableScrollWheelZoom(true);
                this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                this.gpsTrack1();

            },

            gpsTrack1(){
                ajax.get('obd/obdAlarmDragracing/detail/' + this.id,).then(rs => {
                    this.detailForm = rs.data;
                    /*  this.$set(this.detailForm,"violationMileage",this.detailForm.violationMileage/1000).toFixed(2);*/
                    this.gpsTrack2();
                });
            },
            gpsTrack2(){
                const loading = this.$loading({fullscreen: false, lock: true, text: '拼命加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)', target: document.querySelector('#map') });
                setTimeout(() => {
                    loading.close();
                }, 10000);

                ajax.post('obd/obdAlarmDragracing/detailMap', this.detailForm).then(rs => {
                    loading.close();
                    if(rs.status == 0){
                        /*划线*/
                        let pointList = [];
                        rs.data.forEach(item => {
                            pointList.push(new BMap.Point(item.corlong, item.corlat))
                        });
                        this.drawLine(pointList);
                    }else {
                        this.$message.error(rs.msg);
                    }
                }).catch(_ => {
                    loading.close();
                });
            },
            open() {
                this.show = true;
            }
        },
        mounted() {
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=3.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            // window.initialize = this.initialize;
            this.$nextTick(()=>{
                this.initialize();
            })
        }

    }
</script>
