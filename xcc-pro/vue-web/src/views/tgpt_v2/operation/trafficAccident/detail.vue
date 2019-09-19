<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="事故信息" name="1">
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
                        <label class="control-label">事故时间</label>
                        <div class="input-group">
                            <span>{{detailForm.accidentTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故地点</label>
                        <div class="input-group">
                            <span>{{detailForm.accidentArea}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">事故现场照片</label>
                        <div class="input-group">
                            <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
                            <upload-panel :flex="1" :size="1" style="overflow: hidden;height: 60px;"  disabled :file-list.sync="accidentImg" :show-img="true"></upload-panel>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">文字说明</label>
                        <div class="input-group">
                            <span>{{detailForm.textDesc}}</span>
                        </div>
                    </div>
                    <!--<div class="detail-item">
                        <label class="control-label">语音说明</label>
                        <div class="input-group">
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="voiceFile" :show-img="true"></upload-panel>
                        </div>
                    </div>-->

                    <div class="detail-item  ">
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
                        <label class="control-label">事故描述</label>
                        <div class="input-group">
                            <span>{{detailForm.accidentDesc}}</span>
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
        name: "appOilManageDetail",
        components:{ ApprovalFlow,FileDetail,UploadPanel },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                accidentImg:[],
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
            ajax.get('operation_traffic/accident/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;

                if( this.detailForm.accidentImg){
                    if (this.detailForm.accidentImg.indexOf("[") != -1&&this.detailForm.accidentImg.indexOf("]") != -1){
                        this.accidentImg = JSON.parse(this.detailForm.accidentImg);
                    }else {
                        this.accidentImg = [JSON.parse(this.detailForm.accidentImg)];
                    }
                }else{
                    this.accidentImg = [];
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

