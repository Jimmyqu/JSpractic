<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="行程基本信息" name="1" >
                <div class="flex-panel detail-box">
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
                            <span>{{detailForm.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{detailForm.carModel}}</span>
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
                            <span>{{detailForm.durationTime}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">违规里程(km)</label>
						<div class="input-group">
							<span>{{detailForm.violationMileage}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{detailForm.name}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>

            <el-collapse-item title="行驶轨迹" name="2" >
                <el-col >
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
        name: "electricfenceDetail",
        mixins: [tool,mapTool],
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1","2"],
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
                this.map.addControl(new BMap.NavigationControl());
                this.gpsTrack1();
            },
            clickVehicleTrack(bean){
                this.this.id = bean.this.id;
                this.realTimeTrack(false);
            },


            gpsTrack1(){
                ajax.get('obd/obdAlarmElectricFence/detail/' + this.id,).then(rs => {
                    this.detailForm = rs.data;
                    this.$set(this.detailForm,"violationMileage",this.detailForm.violationMileage/1000).toFixed(2);

                    this.gpsTrack2();
                });

            },
            gpsTrack2(){
                const loading = this.$loading({fullscreen: false, lock: true, text: '拼命加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)', target: document.querySelector('#map') });
                setTimeout(() => {
                    loading.close();
                }, 10000);

                ajax.post('obd/obdAlarmElectricFence/detailMap', this.detailForm).then(rs => {
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
        }

        ,
        mounted() {
            var script = document.createElement("script");
            script.src = "https://api.map.baidu.com/api?v=3.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&callback=initialize";
            document.body.appendChild(script);
            window.initialize = this.initialize;
        }

    }
</script>
