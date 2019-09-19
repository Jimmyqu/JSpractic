<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--采购计划要求-->
            <el-collapse-item title="采购计划要求" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{purchasePlan.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购计划编号</label>
                        <div class="input-group">
                            <span>{{purchasePlan.planNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{purchasePlan.planStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">计划采购车型</label>
                        <div class="input-group">
                            <span>{{purchasePlan.vehicleModelInfoName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">市场参考价(元)</label>
                        <div class="input-group">
                            <span>{{purchasePlan.referencePrice}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">计划交车日期</label>
                        <div class="input-group">
                            <span>{{purchasePlan.deliveryDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{purchasePlan.carColorText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆新旧</label>
                        <div class="input-group">
                            <span>{{purchasePlan.newOrOldCarText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车龄(月)</label>
                        <div class="input-group">
                            <span>{{purchasePlan.carAge}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务城市</label>
                        <div class="input-group">
                            <span>{{purchasePlan.cityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购说明</label>
                        <div class="input-group">
                            <span>{{purchasePlan.explanation}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加装需求</label>
                        <div class="input-group">
                            <span>{{purchasePlan.retrofitRequirementOptionsText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他加装需求</label>
                        <div class="input-group">
                            <span>{{purchasePlan.retrofitRequirement}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">计划采购车台数</label>
                        <div class="input-group">
                            <span>{{purchasePlan.needPurchaseQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">已采购车台数</label>
                        <div class="input-group">
                            <span>{{purchasePlan.hadPurchaseQuantity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请人</label>
                        <div class="input-group">
                            <span>{{purchasePlan.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请时间</label>
                        <div class="input-group">
                            <span>{{purchasePlan.createTime}}</span>
                        </div>
                    </div>


                </div>
            </el-collapse-item>
            <!--销售合同信息-->
            <el-collapse-item title="销售合同信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">项目合同编号</label>
                        <div class="input-group">
                            <span>{{purchasePlan.contractNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{purchasePlan.enterpriseName}}</span>
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
    import {tool} from '@/utils/common'
    import {number_format} from '@/utils'

    export default {
        name: "vehiclePurchasePlanDetail",
        mixins: [tool],
        components: {ApprovalFlow, FileDetail},
        data() {
            return {
                activeNames: ["1", "2"],
                purchasePlan: {}
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.initData(id);
        },
        methods: {
            initData(id) {
                var $this = this;
                ajax.get("core/purchasePlan/detail/" + id + "?time=" + new Date().getTime()).then(result => {
                    $this.purchasePlan = result.data;
                });
            }
        }
    }
</script>
