<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames" @change="handleChange">
            <!--车型品牌-->
            <el-collapse-item title="车型品牌" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item big">
                        <label class="control-label">品牌名称</label>
                        <div class="input-group">
                            <span>{{brand.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">品牌图标</label>
                        <div class="input-group">
                            <img :src="brand.icon" @click="showBigImg($event)">
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
        name:'vehicleModelBrandDetail',
        components:{ ApprovalFlow, FileDetail },
        data(){
            return {
                activeNames: ['1'],
                brand:{
                    name: '',
                    icon: ""
                }
            }
        },
        mounted: function () {
            var $this = this;
            let id = this.$route.params.id;
            $this.init(id);
        },
        watch: {

        },
        methods: {
            init(id){
                var $this = this;
                if(id != undefined && id != null && id != ''){
                    ajax.get('/base/vehicleBrand/detail?id=' + id).then(
                        rs => {
                            if(rs.status == 0){
                                $this.brand = rs.data;
                                var obj = JSON.parse(rs.data.icon);
                                if(obj){
                                    $this.brand.icon = obj.filedomain + obj.path;
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
