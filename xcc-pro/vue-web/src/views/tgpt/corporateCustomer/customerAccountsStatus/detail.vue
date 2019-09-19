<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="企业客户账目现状" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">企业客户</label>
                        <div class="input-group">
                            <span>{{customerAccountStatus.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">活期账户（元）</label>
                        <div class="input-group">
                            <span>{{customerAccountStatus.accountCurrent}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">可用余额（元）</label>
                        <div class="input-group">
                            <span>{{customerAccountStatus.accountAvailable}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">应收总额（元）</label>
                        <div class="input-group">
                            <span>{{customerAccountStatus.accountReceivable}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">账户总额（元）</label>
                        <div class="input-group">
                            <span>{{customerAccountStatus.accountTotal}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { number_format } from '@/utils'

    export default {
        name: "corporateCustomerAccountsStatusDetail",
        data(){
            return {
                activeNames: ['1'],
                customerAccountStatus : {},
            }
        },
        mounted: function () {
            this.initForm();
        },
        methods: {
            initForm(){
                var enterpriseId = this.$route.params.id;
                ajax.get("core/corporateCustomer/detail/"+enterpriseId).then(res=>{
                    this.customerAccountStatus = res.data;
                });
            },
        }

    }
</script>
