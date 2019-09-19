<template>
    <div class="newDetail-panel">
        <div id="map" style="width:100%;height:calc(100vh - 121px)"></div>
        <div class="detail__dialog detail-box " v-drag-dialog>
            <div class="detail-title detail-title__header">
                行程基本信息
            </div>
            <div class="detail-body">
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
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.carModel)" effect="dark" :content="detailForm.carModel" placement="top">
                            <span>{{detailForm.carModel}}</span>
                        </el-tooltip>
                    </div>
                </div>

                <div class="detail-item">
                    <label class="control-label">时间</label>
                    <div class="input-group">
                        <span>{{detailForm.time}}</span>
                    </div>
                </div>

                <div class="detail-item">
                    <label class="control-label">违规地点</label>
                    <div class="input-group">
                        <el-tooltip :disabled="isShowTooltip(detailForm.address)" effect="dark" :content="detailForm.address" placement="top">
                            <span>{{detailForm.address}}</span>
                        </el-tooltip>
                    </div>
                </div>

                <div class="detail-item">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <span>{{detailForm.name}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {calculator} from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {tool} from '@/utils/common'
    import dragDialog from '@/directive/drag-dialog'

    export default {
        name: "parkingfenceDetail",
        mixins: [tool],
        directives: { dragDialog },
        components: {ApprovalFlow},
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {},
                id: this.$route.params.id
            }
        },
        methods: {
            initialize(){
                this.map = new BMap.Map('map');
                this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);;
                this.map.enableScrollWheelZoom(true);
                this.map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                this.open();
            },
            open() {
                const loading = this.$loading({fullscreen: false, lock: true, text: '拼命加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)', target: document.querySelector('#map') });
                setTimeout(() => {
                    loading.close();
                }, 10000);

                this.show = true;
                ajax.get('obd/obdAlarmParkingFence/detail/' + this.id,).then(rs => {
                    loading.close();
                    this.detailForm = rs.data;
                    if(rs.data.longitude == null || rs.data.latitude == null){
                        this.$message.error("未获取位置信息！");
                        return;
                    }

                    var new_point = new BMap.Point(rs.data.longitude, rs.data.latitude);
                    let marker = new BMap.Marker(new_point);  // 创建标注
                    this.map.addOverlay(marker);              // 将标注添加到地图中
                    this.map.panTo(new_point);
                });
            },
            clickVehicleTrack(bean) {
                this.this.id = bean.this.id;
                this.realTimeTrack(false);
            },
        }

        ,
        mounted() {
            // var script = document.createElement("script");
            // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            // document.body.appendChild(script);
            // window.initialize = this.initialize;
            this.$nextTick(()=>{
                this.initialize();
            })
        }

    }
</script>
