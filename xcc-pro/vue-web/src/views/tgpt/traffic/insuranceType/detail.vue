<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="保单险种" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">名称</label>
                        <div class="input-group">
                            <span>{{insuranceType.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{insuranceType.companyName}}</span>
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
        name: "trafficInsuranceTypeDetail",
        data(){
            return{
                activeNames: ['1'],
                insuranceType:{}
            }
        },
        mounted: function () {
            this.getInsuranceType();
        },
        methods: {
            getInsuranceType() {
                var id = this.$route.params.id;
                ajax.get("base/insuranceType/detail/" + id).then(result => {
                    if(result.status == 0) {
                        this.insuranceType = result.data;
                    } else {
                        this.showMessage(result.message,"error");
                    }
                });

            }
        },

    }
</script>
