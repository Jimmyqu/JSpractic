<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="更换车辆记录" name="1">
                <div class="flex-panel detail-box">
                    <!--更换车辆记录-->
                    <div class="detail-item half">
                        <label class="control-label">原车牌</label>
                        <div class="input-group">
                            <span>{{data.oldPlate}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">新车牌</label>
                        <div class="input-group">
                            <span>{{data.newPlate}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">结束时间</label>
                        <div class="input-group">
                            <span>{{data.endTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">原车型名称</label>
                        <div class="input-group">
                            <span>{{data.oldModel}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">新车型名称</label>
                        <div class="input-group">
                            <span>{{data.newModel}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">车辆更换时间</label>
                        <div class="input-group">
                            <span>{{data.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">项目订单号</label>
                        <div class="input-group">
                            <span>{{data.orderNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">更换车辆操作人</label>
                        <div class="input-group">
                            <span>{{data.replaceName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">更换车辆操作时间</label>
                        <div class="input-group">
                            <span>{{data.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">替代车费用</label>
                        <div class="input-group">
                            <span>{{data.fee}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">调拨费用</label>
                        <div class="input-group">
                            <span>{{data.scheduleFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">替代车调拨单</label>
                        <div class="input-group">
                            <span>{{data.vehicleTransferId}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="2">
                <div class="flex-panel detail-box">
                    <!--备注-->
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{data.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "projectVehicleRecordDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1','2'],
                data : {},
            }
        },
        mounted(){
            let id = this.$route.params.id;
            this.detail(id);
        },
        methods:{
            detail(id){
                ajax.get("core/changeVehicle/detail?id="+id).then(res =>{
                    this.data = res.data;
                });
            }
        }

    }
</script>
