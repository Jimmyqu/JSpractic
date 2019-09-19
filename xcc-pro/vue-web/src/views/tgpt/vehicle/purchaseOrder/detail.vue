<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--车辆采购单基本信息-->
            <el-collapse-item title="车辆采购单基本信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{order.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购订单号</label>
                        <div class="input-group">
                            <span>{{order.orderNumber}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{order.orderStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">供应商</label>
                        <div class="input-group">
                            <span>{{order.supplierName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购日期</label>
                        <div class="input-group">
                            <span>{{order.purchaseDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">采购方式</label>
                        <div class="input-group">
                            <span>{{order.purchaseMethodName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车台数</label>
                        <div class="input-group">
                            <span>{{order.vehicleNum}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">总金额(元)</label>
                        <div class="input-group">
                            <span>{{order.totalAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{order.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <!--车辆采购明细-->
            <el-collapse-item title="车辆采购明细" name="2">
                <template>
                    <el-table
                        border
                        :data="order.purchaseOrderDetail"
                        style="width: 100%">
                        <el-table-column prop="sortNum" label="序号" min-width="60">
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="planNumber" label="采购计划" min-width="200"></el-table-column>
                        <el-table-column prop="enterpriseName" label="服务客户" min-width="200"></el-table-column>
                        <el-table-column prop="contractNumber" label="合同编号" min-width="200"></el-table-column>
                        <el-table-column prop="cityName" label="服务城市" show-overflow-tooltip min-width="150"></el-table-column>
                        <el-table-column prop="vehicleModelInfoName" label="车型" show-overflow-tooltip min-width="200"></el-table-column>
                        <el-table-column prop="newOrOldCar" label="车辆新旧" min-width="100"></el-table-column>
                        <el-table-column prop="carAge" label="车龄（月）" min-width="100"></el-table-column>
                        <el-table-column prop="carColor" label="颜色" min-width="100"></el-table-column>
                        <el-table-column prop="retrofitRequirementOptions" label="加装需求" show-overflow-tooltip min-width="150"></el-table-column>
                        <el-table-column prop="retrofitRequirement" label="其他加装需求" show-overflow-tooltip min-width="150"></el-table-column>
                        <el-table-column prop="referencePrice" label="市场参考价(元)" min-width="150"></el-table-column>
                        <el-table-column prop="receiver" label="接收人" show-overflow-tooltip min-width="150"></el-table-column>
                        <el-table-column prop="plateFeeTypeStr" label="上牌费用类型" min-width="100"></el-table-column>
                        <el-table-column prop="unitPrice" label="成交单价(元)" min-width="150"></el-table-column>
                        <el-table-column prop="quantity" label="购买数量" min-width="100"></el-table-column>
                        <el-table-column prop="firstPayment" label="首付款(元)" min-width="150"></el-table-column>
                        <el-table-column prop="tradeAmount" label="成交总额(元)" min-width="150"></el-table-column>
                        <el-table-column prop="creater" label="申请人" show-overflow-tooltip min-width="150"></el-table-column>
                        <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip min-width="150"></el-table-column>
                        <el-table-column prop="organizationName" label="申请组织" show-overflow-tooltip min-width="150"></el-table-column>

                    </el-table>
                </template>
            </el-collapse-item>

            <!--审批进程-->
            <el-collapse-item title="审批进程" name="3">
                <approval-flow :id="order.id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import {number_format} from '@/utils'

    export default {
        name: "vehiclePurchaseOrderDetail",
        components: {ApprovalFlow, FileDetail},
        data() {
            return {
                activeNames: ['1', '2', '3'],
                orderStatus: 1,
                items: [{title: '新增', description: '管理员2018-08-23 21:34:40'}, {
                    title: '提交审批',
                    description: '管理员2018-08-23 21:34:40'
                }, {title: '审批', description: '管理员2018-08-23 21:34:40'}],
                order: {},
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.initData(id);
        },
        methods: {
            initData(id) {
                var $this = this;
                ajax.get("core/purchaseOrder/selectPurchaseOrderInfo/" + id + "?time=" + new Date().getTime()).then(result => {
                    if (result.status == 0) {
                        $this.order = result.data;
                    }
                });
            }
        }
    }
</script>
