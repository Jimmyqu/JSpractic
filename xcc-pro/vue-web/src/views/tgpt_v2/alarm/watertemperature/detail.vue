<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="车辆信息" name="1" >
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
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{detailForm.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">报警时间</label>
                        <div class="input-group">
                            <span>{{detailForm.alarmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">解除时间</label>
                        <div class="input-group">
                            <span>{{detailForm.liftTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">最高水温</label>
                        <div class="input-group">
                            <span>{{detailForm.maxTemperature}}</span>
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
        name: "watertemPeratureDetail",
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
            ajax.get('obd/obdAlarmWaterTemperature/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
