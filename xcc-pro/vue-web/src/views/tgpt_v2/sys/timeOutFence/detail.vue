<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="时间栅栏" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">名称</label>
						<div class="input-group">
							<span>{{detailForm.name}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">受控车数</label>
						<div class="input-group">
							<span>{{detailForm.vehicleCount}}</span>
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
						<label class="control-label">停止时长限制</label>
						<div class="input-group">
							<span>{{detailForm.stopTime}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">栅栏状态</label>
						<div class="input-group">
                            <span v-if="detailForm.fenceStatus == 1">启用</span>
                            <span v-else>停用</span>
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
        name: "timeFenceDetail",
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
            ajax.get('base/baseTimeOutFence/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
