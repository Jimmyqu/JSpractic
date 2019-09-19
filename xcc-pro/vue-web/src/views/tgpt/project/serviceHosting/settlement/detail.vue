<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <div class="flex-panel detail-box">
                    <!--基本信息-->
                    <div class="detail-item">
                        <label class="control-label">月结单号</label>
                        <div class="input-group">
                            <span>{{settlementDetail.settlementNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{settlementDetail.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">月份</label>
                        <div class="input-group">
                            <span>{{settlementDetail.month}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{settlementDetail.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算组织</label>
                        <div class="input-group">
                            <span>{{settlementDetail.settlementOrganizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算操作人</label>
                        <div class="input-group">
                            <span>{{settlementDetail.settlementOperator}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算操作时间</label>
                        <div class="input-group">
                            <span>{{settlementDetail.settlementTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="结算前收费价格" name="2">
                <div class="flex-panel detail-box">
                    <!--收费价格-->
                    <div class="detail-item">
                        <label class="control-label">本月车辆台数</label>
                        <div class="input-group">
                            <span>{{settlementDetail.beforeVehicleTotalQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月车辆总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.beforeVehicleTotalCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月司机人数</label>
                        <div class="input-group">
                            <span>{{settlementDetail.beforeDriverTotalQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月司机总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.beforeDriverTotalCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.beforeTotalCost}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="结算后收费价格" name="3">
                <div class="flex-panel detail-box">
                    <!--收费价格-->
                    <div class="detail-item">
                        <label class="control-label">本月车辆台数</label>
                        <div class="input-group">
                            <span>{{settlementDetail.vehicleTotalQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月车辆总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.vehicleTotalCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月司机人数</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverTotalQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月司机总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.driverTotalCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.otherCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">本月总费用(元)</label>
                        <div class="input-group">
                            <span>{{settlementDetail.totalCost}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="5">
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{settlementDetail.remark}}</span>
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
        name: "serviceHostingSettlementDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames:["1","2","3","4","5"],
                settlementDetail: {}
            }
        },
        mounted(){
            this.initData();
        },
        methods:{
            initData() {
                var id = this.$route.params.id;
                ajax.get("core/serviceHostingSettlement/detail/" + id).then(res =>{
                    this.settlementDetail = res.data;
                });
            }
        }

    }
</script>
