<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <!--车辆资料-->
            <el-collapse-item title="基本资料" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{vehicle.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{vehicle.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span style="cursor: pointer;color: #4e8fff;" @click="getModelInfo(vehicle.vehicleModelInfoId)">{{vehicle.modelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">颜色</label>
                        <div class="input-group">
                            <span>{{vehicle.colorName}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">注册城市</label>
                        <div class="input-group">
                            <span>{{vehicle.registerCity}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">车架号</label>
                        <div class="input-group">
                            <span>{{vehicle.vin}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发动机号</label>
                        <div class="input-group">
                            <span>{{vehicle.engineNo}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">机动车登记证</label>
                        <div class="input-group">
                            <span>{{vehicle.certificate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶证号</label>
                        <div class="input-group">
                            <span>{{vehicle.licenseNumber}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">任务状态</label>
                        <div class="input-group">
                            <span>{{vehicle.taskStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">行驶证图片</label>
                        <div class="input-group">
                            <upload-panel :size="2" disabled :file-list.sync="licenseimgs" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item small">
                        <label class="control-label">登记证图片</label>
                        <div class="input-group">
                            <upload-panel :size="2" disabled :file-list.sync="certificateimgs" :show-img="true"></upload-panel>
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
    import UploadPanel from '@/components/UploadPanel/index'
    import {tool} from '@/utils/common'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "appVehicleDetail",
        mixins: [tool],
        components:{ ApprovalFlow, FileDetail, UploadPanel},
        data(){
            return{
                showEditBtn:false,
                activeNames: ['1'],
                certificateimgs:[],
                licenseimgs:[],
                dialogModelVisible:false,
                vehicle:{},
                model:{},
                listUrl: "",

            }
        },
        mounted: function () {
            this.detail();
        },
        watch: {

        },
        methods: {

            getModelInfo(id){
                ajax.get("base/vehicle/model/"+id).then(res => {
                    this.model=res.data;
                    this.dialogModelVisible=true;
                })
            },
            detail(){
                const id = this.$route.params.id
                ajax.get("operation_base/vehicle/detail/"+id).then(res => {
                    if (res.data.licensePic) {
                        //转换图片
                        var licenseimg = JSON.parse(res.data.licensePic);
                        if (typeof licenseimg === 'object' && !isNaN(licenseimg.length)) {
                            this.licenseimgs = licenseimg
                        } else {
                            this.licenseimgs = [licenseimg];
                        }
                    } else {
                        this.licenseimgs = []
                    }
                    if (res.data.certificatePic){//转换图片
                        var certificateimg = JSON.parse(res.data.certificatePic);
                        if (typeof certificateimg === 'object' && !isNaN(certificateimg.length)) {
                            this.certificateimgs = certificateimg
                        } else {
                            this.certificateimgs = [certificateimg];
                        }
                    }else{
                        this.certificateimgs= []
                    }
                    this.vehicle = res.data;
                })
            },
        },

    }
</script>
<style scoped lang="scss">
    .float-box-title {
        font-size: 18px;
        font-weight: bold;
        .el-icon-close {
            position: absolute;
            right: 30px;
            font-size: 20px;
            cursor: pointer;
        }
    }

    .float-box-content {
        padding-top: 10px;
    }
    .float-box {

        position: fixed;
        background: #fff;
        right: -100%;
        width: 350px;
        top: 100px;
        transition: right 0.5s;
        max-height: calc(100% - 120px);
        overflow-y: auto;
        z-index: 5;
        padding: 20px;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.10);
        &.open {
            right: 0;
        }

        .detail-item {
            display: flex;
            height: 40px;
            align-items: center;
            .control-label {
                width: 100px;
                text-align: right;
                margin-right: 20px;
            }
        }
    }

</style>
