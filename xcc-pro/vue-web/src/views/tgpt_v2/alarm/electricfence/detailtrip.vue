<template>
    <div class="newDetail-panel">
        <div id="map" style="width:100%;height:calc(100vh - 121px)"></div>
        <div class="detail__dialog detail-box " v-drag-dialog>
            <div class="detail-title detail-title__header">
                单行程行车数据
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
                        <span>{{detailForm.assetsTypeName}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">所属部门</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.organizationName)" effect="dark" :content="detailForm.organizationName" placement="top">
                            <span>{{detailForm.organizationName}}</span>
                        </el-tooltip>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <span>{{detailForm.name}}</span>
                    </div>
                </div>

                <div class="detail-item">
                    <label class="control-label">行程开始时间</label>
                    <div class="input-group">
                        <span>{{detailForm.startTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">行程结束时间</label>
                    <div class="input-group">
                        <span>{{detailForm.endTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">违规时长</label>
                    <div class="input-group">
                        <span>{{detailForm.durationTime}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">违规里程</label>
                    <div class="input-group">
                        <span>{{detailForm.violationMileage}}</span>
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
        name: "electricfenceDetailTrip",
        mixins: [tool,mapTool],
        directives:{dragDialog},
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);;
                this.map.enableScrollWheelZoom(true);
                this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                this.gpsTrack1();
            },
            gpsTrack1(){
                ajax.get('obd/obdAlarmElectricFence/detailtrip/' + this.id,).then(rs => {
                    this.detailForm = rs.data;
                    let pointList = [];
                    this.detailForm.locationList.forEach(item => {
                        pointList.push(new BMap.Point(item.corlong, item.corlat))
                    });
                    this.drawLine(pointList);
                });
            },
            clickVehicleTrack(bean){
                this.this.id = bean.this.id;
                this.realTimeTrack(false);
            },
        }
        ,
        mounted() {
            // window.initialize = this.initialize;
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=3.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            this.$nextTick(()=>{
                this.initialize();
            })

        }

    }
</script>
