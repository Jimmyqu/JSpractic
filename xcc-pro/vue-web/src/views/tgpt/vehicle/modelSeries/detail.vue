<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames" @change="handleChange">
            <!--车型系列-->
            <el-collapse-item title="车型系列" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">品牌</label>
                        <div class="input-group">
                            <span>{{series.brandName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车系</label>
                        <div class="input-group">
                            <span>{{series.name}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<style type="text/css">
    .list-panel .form-box{
        max-height: 240px;
    }
</style>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "vehicleModelSeriesDetail",
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                id: this.$route.params.id,
                activeNames: ['1'],
                series: {
                    brandName: "",
                    name: "",
                    displacement: "",
                    body: "",
                    priceMin: "",
                    priceMax: "",
                    oilWearMin: "",
                    oilWeaMaxr: "",
                    pic: "",
                    companyId: ""
                }
            }
        },
        mounted: function () {
            var $this = this;
            $this.init();
        },
        watch: {

        },
        methods: {
            init() {
                var $this = this;
                if($this.id != undefined && $this.id != null && $this.id != ''){
                    //$.ajaxSettings.async = false;
                    ajax.get('/base/vehicleModel/detail?id=' + $this.id).then(
                        function (res) {
                            if(res.status == 0){
                                $this.series = res.data;
                                if(res.data.pic != null && res.data.pic != ''){
                                    var obj = JSON.parse(res.data.pic);
                                    if(obj != null){
                                        $this.series.pic = obj.filedomain + obj.path;
                                    }
                                }
                            }
                        }
                    )
                }
            },
            handleChange(val) {
                console.log(val);
            },
            downloadFile:function (url,fileName) {
                downloadFile(url,fileName);
            }
        },
    }
</script>
