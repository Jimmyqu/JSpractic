<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="维修厂" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">维修厂名称</label>
                        <div class="input-group">
                            <span>{{formData.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">城市</label>
                        <div class="input-group">
                            <span>{{formData.cityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人</label>
                        <div class="input-group">
                            <span>{{formData.contacts}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">联系人手机号</label>
                        <div class="input-group">
                            <span>{{formData.contactsPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">资质</label>
                        <div class="input-group">
                            <span>{{formData.qualificationName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">签约类型</label>
                        <div class="input-group">
                            <span v-if="formData.signed == 0">未签约</span>
                            <span v-if="formData.signed == 1">已签约</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">签约日期</label>
                        <div class="input-group">
                            <span>{{formData.signDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">到期日期</label>
                        <div class="input-group">
                            <span>{{formData.expireDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修厂地址</label>
                        <div class="input-group">
                            <span>{{formData.address}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="维修内容" name="2">
                <div class="panel-body detail-box">
                    <!--合同条款-->
                    <div class="detail-item big">
                        <label class="control-label">维修内容</label>
                        <div class="input-group">
                            <span>{{formData.serviceContent}}</span>
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
        name: "trafficServiceDepotDetail",
        data: function () {
            return {
                activeNames: ['1', '2'],
                formData: {
                    id: "",
                    name: "",
                    cityId: "",
                    cityName: "",
                    contacts: "",
                    contactsPhone: "",
                    qualificationId: "",
                    qualificationName: "",
                    signed: "",
                    signDate: "",
                    expireDate: "",
                    address: "",
                    serviceContent: ""
                },
            }
        },
        mounted: function () {
            this.initFormData();
        },
        methods: {
            initFormData: function () {
                let id = this.$route.params.id;
                ajax.get('/base/repairer/detail/' + id).then(result => {
                    if(result.status == 0){
                        this.formData = result.data;
                    }
                });
            },

        }
    }
</script>
