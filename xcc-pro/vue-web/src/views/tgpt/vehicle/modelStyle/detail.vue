<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--车型款式-->
            <el-collapse-item title="车型款式" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">款式名称</label>
                        <div class="input-group">
                            <span>{{style.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">在售状态</label>
                        <div class="input-group">
                            <span>{{style.saleStatus}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">系列</label>
                        <div class="input-group ">
                            <span>{{style.seriesName}}</span>
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
        name:'vehicleModelStyleDetail',
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                id: this.$route.params.id,
                activeNames: ['1'],
                style:{
                    name: "",
                    saleStatus: "",
                    seriesName: ""
                }
            }
        },
        mounted: function () {
            this.init(this.id);
        },
        watch: {

        },
        methods: {
            init(id) {
                var $this = this;
                if(id != undefined && id != null && id != ''){
                    debugger
                    ajax.get('/base/vehicleStyle/modelDetail?id=' + id).then(
                        res => {
                            if(res.status == 0){
                                console.info(res.data);
                                $this.style = res.data;
                            }
                        }
                    )
                }
            }
        },
    }
</script>
