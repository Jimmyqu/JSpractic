<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="退款单" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">退款单号</label>
                        <div class="input-group">
                            <span>{{refundDetail.refundCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建人</label>
                        <div class="input-group">
                            <span>{{refundDetail.createrName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{refundDetail.organizationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{refundDetail.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">企业客户</label>
                        <div class="input-group">
                            <span>{{refundDetail.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">退款日期</label>
                        <div class="input-group">
                            <span>{{refundDetail.refundDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">退款方式</label>
                        <div class="input-group">
                            <span>{{refundDetail.refundWayName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">退款金额（元）</label>
                        <div class="input-group">
                            <span>{{refundDetail.refundCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">银行手续费（元）</label>
                        <div class="input-group">
                            <span>{{refundDetail.bankPoundage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他手续费（元）</label>
                        <div class="input-group">
                            <span>{{refundDetail.otherPoundage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">已冲销金额（元）</label>
                        <div class="input-group">
                            <span>{{refundDetail.reversedAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">未冲销金额（元）</label>
                        <div class="input-group">
                            <span>{{refundDetail.unreversedAmount}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="银行信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">银行</label>
                        <div class="input-group">
                            <span>{{refundDetail.bankName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">银行账号</label>
                        <div class="input-group">
                            <span>{{refundDetail.bankAccount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">银行户名</label>
                        <div class="input-group">
                            <span>{{refundDetail.bankUsername}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="3">
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{refundDetail.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="冲销明细" name="4">
                <el-table border style="width: 100%" :data="refundDetail.reversalDetailList">
                    <el-table-column prop="voucherCode" label="收款账款明细" width="200"></el-table-column>
                    <el-table-column prop="sourceTypeName" label="单据类型" width="200"></el-table-column>
                    <el-table-column prop="voucherDate" label="账目时间" width="150"></el-table-column>
                    <el-table-column prop="accountAmount" label="账目金额(元)" width="150"></el-table-column>
                    <el-table-column prop="beforeReversedAmount" label="账目冲销前余额(元)" width="150"></el-table-column>
                    <el-table-column prop="reversedAmount" label="冲销金额(元)" width="150"></el-table-column>
                    <el-table-column prop="overReversedAmount" label="账目冲销后余额(元)" width="150"></el-table-column>
                </el-table>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="5">
                <approval-flow :id="refundDetail.id"></approval-flow>
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
        name: "financialCompanyRefundDetail",
        components:{ ApprovalFlow, FileDetail },
        data: function () {
            return {
                activeNames: ['1', '3', '2', '4', '5'],
                refundDetail: {
                    reversalDetailList: []
                },
            }
        },
        mounted: function () {
            this.initRefundData();
        },
        methods: {
            initRefundData: function () {
                ajax.get('core/enterpriseRefund/detail/'+this.$route.params.id).then(rs => {
                    if (rs.status == 0) {
                        this.refundDetail = rs.data;
                    } else {
                        this.$message.error(rs.message);
                    }
                });
            }
        }

    }
</script>
