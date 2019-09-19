<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="加油卡充值记录" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">充值编号</label>
                        <div class="input-group">
                            <span>{{oilCard.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油卡</label>
                        <div class="input-group">
                            <span>{{oilCard.oilCardCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">充值日期</label>
                        <div class="input-group">
                            <span>{{oilCard.rechargeDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">充值人</label>
                        <div class="input-group">
                            <span>{{oilCard.recharger}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{oilCard.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">充值前余额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.beforeRechargeBalance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">充值金额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.rechargeAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">充值后余额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.afterRechargeBalance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发票号</label>
                        <div class="input-group">
                            <span v-if="oilCard.invoiceNumber != '' && oilCard.invoiceNumber != null">{{oilCard.invoiceNumber}}</span>
                            <span v-else>/</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">充值方式</label>
                        <div class="input-group">
                            <span>{{oilCard.rechargeTypeName}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="oilCard.rechargeType == 1">
                        <label class="control-label">加油卡主卡</label>
                        <div class="input-group">
                            <span>{{oilCard.masterCardCode}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="oilCard.rechargeType == 1">
                        <label class="control-label">主卡原余额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.beforeBalance}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="oilCard.rechargeType == 1">
                        <label class="control-label">主卡充值后余额（元）</label>
                        <div class="input-group">
                            <span>{{oilCard.afterBalance}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="2">
                <approval-flow :id="oilCard.id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'

    export default {
        name: "trafficOilCardRechargeDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames:["1","2"],
                enterpriseIdList: [],
                oilCard: {
                    oillCard: "",
                    rechargeDate:  "",
                    recharger:  "",
                    branchCompany:  "",
                    beforeRechargeBalance:  "",
                    rechargeAmount: "",
                    afterRechargeBalance:  "",
                    invoiceNumber:  "",
                    rechargeType:  "",
                    masterCardCode:  "",
                    beforeBalance:  "",
                    afterBalance: "",
                }
            }
        },
        mounted: function () {
            this.initData();
        },
        methods: {
            initData() {
                let id = this.$route.params.id;
                ajax.get('/base/oilCardRecharge/detail/' + id).then(result => {
                    if(result.status == 0){
                        this.oilCard = result.data;
                    }
                });
            }
        }

    }
</script>
