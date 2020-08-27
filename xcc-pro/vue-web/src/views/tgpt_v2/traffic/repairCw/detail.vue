<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="维修详情" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">编号</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修类型</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceTypeText}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">维修人</label>
						<div class="input-group">
							<span>{{detailForm.maintenancePeople}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">维修时里程(km)</label>
						<div class="input-group">
							<span>{{detailForm.maintenanceMileage}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">维修开始日期</label>
						<div class="input-group">
							<span>{{detailForm.startTime}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">维修结束日期</label>
                        <div class="input-group">
                            <span>{{detailForm.endTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修单位</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceSection}}</span>
                        </div>
                     </div>
                    <div class="detail-item">
                        <label class="control-label">维修配件费用(元)</label>
                        <div class="input-group">
                            <span>{{detailForm.partsCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修工时费用(元)</label>
                        <div class="input-group">
                            <span>{{detailForm.workCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修项目</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceProjectId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其它项目/备注</label>
                        <div class="input-group">
                            <span>{{detailForm.otherProject}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">修改人</label>
                        <div class="input-group">
                            <span>{{detailForm.updater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">修改日期</label>
                        <div class="input-group">
                            <span>{{detailForm.updateTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">维修附件</label>
                        <div class="input-group">
                            <img :src="detailForm.maintenanceImg" @click="showBigImg($event)">
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
    import FileDetail from '@/components/FileDetail/index'

    export default {
        name: "repairCwDetail",
        components:{ ApprovalFlow,FileDetail },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                }
        },
        methods: {
            open() {
                this.show = true;
            },
            photoHandle(object,num) {
                var $this = this;
                var result;
                if (object) {
                    var object1 = JSON.parse(object);
                    result = object1.filedomain + object1.path;
                    if (num == 1) {
                        $this.detailForm.maintenanceImg = result;
                    }
                }
            },
        }
        ,
        mounted() {
            ajax.get('traffic/repairCw/' + this.id,).then(rs => {
                this.detailForm = rs.data;
                this.photoHandle(rs.data.maintenanceImg,1);
            });
        }

    }
</script>
