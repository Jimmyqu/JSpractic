<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="司机与车辆绑定详情" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">司机</label>
                        <div class="input-group">
                            <span>{{form.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车辆</label>
                        <div class="input-group">
                            <span>{{form.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{form.modelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{form.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{form.serviceName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{form.contractNumber}}</span>
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
        name: "driverAndCarDetail",
        components:{ ApprovalFlow, FileDetail },
        data() {
            return {
                activeNames:["1"],
                form : {},
            }
        },
        mounted: function () {
            let id = this.$route.params.id;
            this.detail(id);
        },
        methods: {
            detail(id){
                let $this = this;
                ajax.get("base/driverAndVehicle/detail?id="+id).then(result =>{
                    if(result.status == 0){
                        $this.form = result.data;
                    }
                });
            }
        }
    }
</script>
