<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="工时项目信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item half">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{form.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">录人人</label>
                        <div class="input-group">
                            <span>{{form.createrShow}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">录入时间</label>
                        <div class="input-group">
                            <span>{{form.createTimeShow}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">车辆</label>
                        <div class="input-group">
                            <span>{{form.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">月租金</label>
                        <div class="input-group">
                            <span>{{form.vehicleRental}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">项目每月结算单</label>
                        <div class="input-group">
                            <span>{{form.projectVehicleSettlementNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">折旧</label>
                        <div class="input-group">
                            <span>{{form.depreciationCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">保养</label>
                        <div class="input-group">
                            <span>{{form.maintenanceCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">保险</label>
                        <div class="input-group">
                            <span>{{form.insuranceCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item half">
                        <label class="control-label">利润</label>
                        <div class="input-group">
                            <span>{{form.profits}}</span>
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
        name: "trafficProfitDetail",
        data:function () {
            return {
                activeNames: ['1'],
                form : {}
            }
        },
        beforeMount:function () {

        },
        mounted:function () {
            this.detail(this.$route.params.id);
        },
        methods:{
            detail(id){
                let $this = this;
                ajax.get("base/profit/detail?id="+id).then(result=>{
                    if(result.status == 0){
                        $this.form = result.data;
                    }
                });

            },
        }

    }
</script>
