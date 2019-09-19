<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="调拨详情" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{transfer.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{transfer.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">总调拨车台数</label>
                        <div class="input-group">
                            <span>{{transfer.qut}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">预计总费用(元)</label>
                        <div class="input-group">
                            <span>{{transfer.totalCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请人</label>
                        <div class="input-group">
                            <span>{{transfer.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请时间</label>
                        <div class="input-group">
                            <span>{{transfer.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{transfer.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="调拨车辆" name="2">
                <el-table :data="transfer.detail" style="width: 100%;margin-top: 10px" border>
                    <el-table-column prop="index" label="序号" min-width="70">
                        <template slot-scope="{row,$index}">
                            <span>{{$index+1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="modelName" label="车型名称" show-overflow-tooltip min-width="200"></el-table-column>
                    <el-table-column prop="vehicleAmount" label="所需车辆数" min-width="200"></el-table-column>
                    <el-table-column prop="depCityName" label="出发城市" min-width="200"></el-table-column>
                    <el-table-column prop="transferTime" label="预计调拨时间" min-width="220"></el-table-column>
                    <el-table-column prop="depCompanyName" label="调度前组织" min-width="200"></el-table-column>
                    <el-table-column prop="arrivalCityName" label="到达城市" min-width="200"></el-table-column>
                    <el-table-column prop="arrivalCompanyName" label="调度后组织" min-width="200"></el-table-column>
                    <el-table-column prop="estimatedCost" label="预计费用(元)" min-width="200"></el-table-column>
                    <el-table-column prop="reasonText" label="调拨原因" min-width="200"></el-table-column>
                    <el-table-column prop="isTransfer" label="是否过户" min-width="200">
                        <template slot-scope="{row,$index}">
                            <template v-if="row.isTransfer==1"><span>是</span></template>
                            <template v-else-if="row.isTransfer==0"><span>否</span></template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isSend" label="是否送车" min-width="200">
                        <template slot-scope="{row,$index}">
                            <template v-if="row.isSend==1"><span>是</span></template>
                            <template v-else-if="row.isSend==0"><span>否</span></template>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
            <el-collapse-item title="审批" name="3">
                <div class="flex-panel detail-box">
                    <approval-flow :id="transfer.id"></approval-flow>
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
        name: "trafficTransferDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1', '2', '3'],
                transfer:{},
            }
        },
        mounted: function () {
            this.getVehicleTransfer();
        },
        methods: {
            getVehicleTransfer() {
                var id = this.$route.params.id;
                ajax.get("core/transfer/detail/" + id).then(result =>{
                    if(result.status == 0) {
                        this.transfer = result.data;
                    } else {
                        this.showMessage(result.message,"error");
                    }
                });
            }
        },


    }
</script>
