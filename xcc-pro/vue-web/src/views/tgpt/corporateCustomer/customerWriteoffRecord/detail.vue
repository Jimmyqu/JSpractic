<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="企业客户账目冲销记录" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">企业客户</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款账目单据</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.voucherCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款账目金额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.voucherCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款账目冲销前余额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.voucherBeforeAvailable}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">收款账目冲销后余额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.voucherAfterAvailable}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">应收账目单据</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.refundCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">应收账目金额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.refundCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">应收账目冲销前余额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.refundBeforeAvailable}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">应收账目冲销后余额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.refundAfterAvailable}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">冲销金额（元）</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.reversedAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">操作人</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">操作时间</label>
                        <div class="input-group">
                            <span>{{customerWriteoffRecord.createTime}}</span>
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
        name: "corporateCustomerWriteoffRecordDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1'],
                customerWriteoffRecord : {}
            }
        },
        mounted: function () {
            this.initForm();
        },
        methods: {
            initForm(){
                var id = this.$route.params.id;
                ajax.get("core/corporateCustomer/writeoffRecordDetail/"+id).then(res => {
                    this.customerWriteoffRecord = res.data;
                })
            },
        }

    }
</script>
