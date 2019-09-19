<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="企业客户帐目" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">企业客户</label>
                        <div class="input-group">
                            <span>{{accountInfo.enterprise}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">单据类型</label>
                        <div class="input-group">
                            <span>{{accountInfo.invoiceType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">账目类型</label>
                        <div class="input-group">
                            <span>{{accountInfo.accountType}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">账目时间</label>
                        <div class="input-group">
                            <span>{{accountInfo.time}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">单据编号</label>
                        <div class="input-group">
                            <span>{{accountInfo.code}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{accountInfo.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">操作员</label>
                        <div class="input-group">
                            <span>{{accountInfo.operator}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="帐目金额" name="2" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">应收金额(元)</label>
                        <div class="input-group">
                            <span>{{accountInfo.receivableAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">收款金额(元)</label>
                        <div class="input-group">
                            <span>{{accountInfo.collectionAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">已冲销金额(元)</label>
                        <div class="input-group">
                            <span>{{accountInfo.reversedAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">未冲销金额(元)</label>
                        <div class="input-group">
                            <span>{{accountInfo.unreversedAmount}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">期初余额(元)</label>
                        <div class="input-group">
                            <span>{{accountInfo.openingBalance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">期末余额(元)</label>
                        <div class="input-group">
                            <span>{{accountInfo.endingBalance}}</span>
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
    import $ from 'jquery-slim'

    export default {
        name:'corporateCustomerAccountsDetail',
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                accountInfo: {},
                activeNames: ['1','2','3','4','5']
            }
        },
        mounted: function () {
            var $this = this;
            $this.initData();
            console.log(this.$route.params)
        },
        methods: {
            initData() {
                //var eventId = getParam("id");
                var $this = this;
                var customerAccounts = sessionStorage.getItem('customerAccounts');
                $this.accountInfo = JSON.parse(customerAccounts);

                //var storage = window.localStorage;
                //storage.removeItem("customerAccounts");
            }
        }
    }
</script>
