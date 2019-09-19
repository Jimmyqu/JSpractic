<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="沉默鹰设备状态" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">车辆id</label>
						<div class="input-group">
							<span>{{detailForm.vehicleId}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">设备id</label>
						<div class="input-group">
							<span>{{detailForm.equipmentId}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">纬度</label>
						<div class="input-group">
							<span>{{detailForm.latitude}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">经度</label>
						<div class="input-group">
							<span>{{detailForm.longitude}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">纠偏后纬度</label>
						<div class="input-group">
							<span>{{detailForm.corlat}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">纠偏后经度</label>
						<div class="input-group">
							<span>{{detailForm.corlong}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">定位地址</label>
						<div class="input-group">
							<span>{{detailForm.localtion}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">定位时间</label>
						<div class="input-group">
							<span>{{detailForm.localtionTime}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">速度km/h</label>
						<div class="input-group">
							<span>{{detailForm.speed}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">方向</label>
						<div class="input-group">
							<span>{{detailForm.direction}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">无线通信网络信号强度</label>
						<div class="input-group">
							<span>{{detailForm.networkSignal}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">电量</label>
						<div class="input-group">
							<span>{{detailForm.power}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">设备状态</label>
						<div class="input-group">
							<span>{{detailForm.onlineStatus}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">数据类型</label>
						<div class="input-group">
							<span>{{detailForm.type}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">ACC开关</label>
						<div class="input-group">
							<span>{{detailForm.acc}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">是否定位</label>
						<div class="input-group">
							<span>{{detailForm.pos}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">0：未使用GPS卫星进行定位；1：使用GPS卫星进行定位</label>
						<div class="input-group">
							<span>{{detailForm.gps}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">0：未使用北斗卫星进行定位；1：使用北斗卫星进行定位</label>
						<div class="input-group">
							<span>{{detailForm.bd}}</span>
						</div>
					</div>

                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "seEquipmentStatusDetail",
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
            }
        }
        ,
        mounted() {
            ajax.get('se//seEquipmentStatus/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
