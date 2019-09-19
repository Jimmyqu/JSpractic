<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="维修信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{detailForm.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机手机号</label>
                        <div class="input-group">
                            <span>{{detailForm.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌号</label>
                        <div class="input-group">
                            <span>{{detailForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修时间</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修地点</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceArea}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">维修现场照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :flex="1" :size="1" style="overflow: hidden;height: 60px;"  disabled :file-list.sync="maintenanceImg" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">文字说明</label>
                        <div class="input-group">
                            <span>{{detailForm.textDesc}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">语音说明</label>
                        <div class="input-group">
                            <upload-panel :file-list.sync="voiceFile" :disabled="true"></upload-panel>
                        </div>
                    </div>

                </div>
            </el-collapse-item>

            <el-collapse-item title="确认信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">确认状态</label>
                        <div class="input-group">
                            <span>{{detailForm.confirmStatusText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认时间</label>
                        <div class="input-group">
                            <span>{{detailForm.confirmTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">确认人</label>
                        <div class="input-group">
                            <span>{{detailForm.confirmor}}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <label class="control-label">维修描述</label>
                        <div class="input-group">
                            <span>{{detailForm.maintenanceDesc}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: "appMaintenanceDetail",
        components:{ ApprovalFlow,FileDetail,UploadPanel },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                maintenanceImg:[],
                voiceFile:[],

            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('operation_traffic/maintenance/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;

                if( this.detailForm.maintenanceImg){
                    if (this.detailForm.maintenanceImg.indexOf("[") != -1&&this.detailForm.maintenanceImg.indexOf("]") != -1){
                        this.maintenanceImg = JSON.parse(this.detailForm.maintenanceImg);
                    }else {
                        this.maintenanceImg = [JSON.parse(this.detailForm.maintenanceImg)];
                    }
                }else{
                    this.maintenanceImg = [];
                }

                if( this.detailForm.voiceFile){
                    this.voiceFile = [JSON.parse(this.detailForm.voiceFile)];
                }else{
                    this.voiceFile = [];
                }

            });
        }

    }
</script>

