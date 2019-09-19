<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="处置车辆信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.originateId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{detailForm.serveId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆状态</label>
                        <div class="input-group">
                            <span>{{detailForm.vehicleStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{detailForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车架</label>
                        <div class="input-group">
                            <span>{{detailForm.vin}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{detailForm.modelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{detailForm.colour}}</span>
                        </div>
                    </div>


                </div>
            </el-collapse-item>

            <el-collapse-item title="出售信息" name="2" >
                <div class="flex-panel detail-box">

                    <div class="detail-item">
                        <label class="control-label">出售费用</label>
                        <div class="input-group">
                            <span>{{detailForm.vehicleSellMoney}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出售说明</label>
                        <div class="input-group">
                            <span>{{detailForm.sellInstructions}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请人</label>
                        <div class="input-group">
                            <span>{{detailForm.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请组织</label>
                        <div class="input-group">
                            <span>{{detailForm.applyId}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>

            <el-collapse-item title="信息确认" name="3" >
                <div class="flex-panel detail-box">

                    <div class="detail-item">
                        <label class="control-label">信息确认</label>
                        <div class="input-group">
                            <span>财务确认</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认结果</label>
                        <div class="input-group">
                            <span>{{detailForm.financialConfirmationResult}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认人</label>
                        <div class="input-group">
                            <span>{{detailForm.resultName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认时间</label>
                        <div class="input-group">
                            <span>{{detailForm.resultTime}}</span>
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
        name: "baseVehicleDisposalApplyDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1","2","3"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                tableData1:[],
            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('base/baseVehicleSellProcess/' + this.id,).then(rs => {
                 this.detailForm = rs.data;
                 // this.tableData1 = rs.data.list;
            });
        }

    }
</script>
