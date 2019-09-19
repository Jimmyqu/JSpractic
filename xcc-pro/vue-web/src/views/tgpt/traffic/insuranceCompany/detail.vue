<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="保险公司" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">公司名称</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">简称</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.shortName}}</span>
                        </div>
                    </div>
                    <div class="detail-item" v-if="insuranceCompany.companyName">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.contact}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.contactPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">地址</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.address}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">主要业务描述</label>
                        <div class="input-group">
                            <span>{{insuranceCompany.businessDescription}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'

    export default {
        name: "trafficInsuranceCompanyDetail",
        data:function () {
            return {
                activeNames: ['1'],
                insuranceCompany: {},
            }
        },
        mounted: function () {
            this.getInsuranceCompany();
        },
        methods: {
            getInsuranceCompany() {
                let id = this.$route.params.id;
                ajax.get('/base/insuranceCompany/detail/' + id).then(result => {
                    if(result.status == 0) {
                        this.insuranceCompany = result.data;
                    } else {
                        this.$message.error(result.message);
                    }
                });
            }
        },


    }
</script>
