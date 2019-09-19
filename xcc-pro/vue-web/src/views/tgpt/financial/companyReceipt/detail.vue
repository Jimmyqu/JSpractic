<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="收款单" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">企业客户</label>
                        <div class="input-group">
                            <span>{{voucherModel.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款日期</label>
                        <div class="input-group">
                            <span>{{voucherModel.voucherDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款方式</label>
                        <div class="input-group">
                            <span>{{voucherModel.voucherWayName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款金额（元）</label>
                        <div class="input-group">
                            <span>{{voucherModel.voucherCost==null?'':numberFormat(voucherModel.voucherCost)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">银行手续费（元）</label>
                        <div class="input-group">
                            <span>{{voucherModel.bankPoundage==null?'':numberFormat(voucherModel.bankPoundage)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他手续费（元）</label>
                        <div class="input-group">
                            <span>{{voucherModel.otherPoundage==null?'':numberFormat(voucherModel.otherPoundage)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{voucherModel.voucherCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">录入人</label>
                        <div class="input-group">
                            <span>{{voucherModel.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">录入时间</label>
                        <div class="input-group">
                            <span>{{voucherModel.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{voucherModel.voucherStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">已冲销金额（元）</label>
                        <div class="input-group">
                            <span>{{voucherModel.reversedAmount==null?'':numberFormat(voucherModel.reversedAmount)}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">未冲销金额（元）</label>
                        <div class="input-group">
                            <span>{{voucherModel.noReversedAmount==null?'':numberFormat(voucherModel.noReversedAmount)}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="银行信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">银行</label>
                        <div class="input-group">
                            <span>{{voucherModel.bankName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">银行账号</label>
                        <div class="input-group">
                            <span>{{voucherModel.bankAccount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">银行户名</label>
                        <div class="input-group">
                            <span>{{voucherModel.bankUsername}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="备注" name="3">
                <div class="flex-panel detail-box">
                    <!--合同条款-->
                    <div class="detail-item big">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{voucherModel.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="4"  >
                <div class="flex-panel detail-box">
                    <approval-flow :id="id"></approval-flow>
                </div>
            </el-collapse-item>
            <el-collapse-item title="冲销明细" name="5">
                <template>
                    <el-table :data="voucherDetailList" border style="width: 100%">
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="settlementNo" label="应收账款明细" width="200"></el-table-column>
                        <el-table-column prop="sourceTypeName" label="单据类型" width="200"></el-table-column>
                        <el-table-column prop="settlementTime" label="账目时间" width="200"></el-table-column>
                        <el-table-column prop="settlementTotalAmount" label="账目金额(元)" width="200"></el-table-column>
                        <el-table-column prop="beforeReversedAmount" label="账目冲销前余额(元)" width="200"></el-table-column>
                        <el-table-column prop="reversedAmount" label="冲销金额(元)" width="200"></el-table-column>
                        <el-table-column prop="overReversedAmount" label="账目冲销后余额(元)" min-width="150"></el-table-column>
                    </el-table>
                </template>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { number_format } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "financialCompanyReceiptDetail",
        components:{ ApprovalFlow },
        data:function () {
            return {
                activeNames: ['1','3','2','4','5'],
                voucherDetailList:[],
                voucherModel:{},
                id:"",
            }

        },
        mounted(){
            this.id = this.$route.params.id;
            this.detail();
        },
        methods:{
            detail:function () {
                ajax.get('core/enterpriseVoucher/getDetail?id=' + this.id).then(result => {
                    if (result.status == 0) {
                        this.voucherModel=result.data[0];
                        this.voucherDetailList=result.data[1];
                    } else {
                        this.$message.error(result.message);
                    }
                });
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
        }


    }
</script>
