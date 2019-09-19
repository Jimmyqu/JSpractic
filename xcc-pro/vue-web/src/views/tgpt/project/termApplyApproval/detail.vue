<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="服务客户条款" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{terms.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">协议开始日期</label>
                        <div class="input-group">
                            <span>{{terms.contractStartDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">协议结束日期</label>
                        <div class="input-group">
                            <span>{{terms.contractEndDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{terms.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">信用额度(元)</label>
                        <div class="input-group">
                            <span>{{terms.creditLimit==null?'/':numberFormat(terms.creditLimit)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算周期（日）</label>
                        <div class="input-group">
                            <span>{{terms.paymentCycle}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算方式</label>
                        <div class="input-group">
                            <span>{{terms.paymentModelText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">结算日（日）</label>
                        <div class="input-group">
                            <span>{{terms.settlementDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">付款方式</label>
                        <div class="input-group">
                            <span>{{terms.paymentModelText}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">税金（司机）</label>
                        <div class="input-group">
                            <span>{{terms.invoiceTaxRateDriver}}%</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">税金（车）</label>
                        <div class="input-group">
                            <span>{{terms.invoiceTaxRateVehicle}}%</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{terms.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="操作信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">最后修改时间</label>
                        <div class="input-group">
                            <span>{{terms.updateTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">最后修改人</label>
                        <div class="input-group">
                            <span>{{terms.updater}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="3">
                <approval-flow :id="refundDetail.serviceId"></approval-flow>
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
        name: "projectTermApplyApprovalDetail",
        components:{ ApprovalFlow, FileDetail },
        data() {
            return {
                activeNames: ['1', '2', '3', '4', '5'],
                terms: {},
                refundDetail: {
                    serviceId: ""
                }
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                let id = this.$route.params.id;
                this.refundDetail.serviceId = id;
                ajax.get("core/projectterms/detail/" + id).then(res => {
                    this.terms = res.data;
                });
            },
            numberFormat(number) {
                return number_format(number, 2, '.', ',');
            }
        }

    }
</script>
