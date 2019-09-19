<template>
    <div class="form-panel detail-panel">
        <el-form :model="confirm" :rules="rules" label-position="top" ref="confirm" label-width="100px">
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
                        <div class="detail-item">
                            <label class="control-label">语音说明</label>
                            <div class="input-group">
                                <upload-panel :file-list.sync="voiceFile" :disabled="true"></upload-panel>
                            </div>
                        </div>

                    </div>
                </el-collapse-item>

                <el-collapse-item title="事故确认" name="2">
                    <div class="flex-panel">
                        <el-form-item label="确认状态" prop="confirmStatus">
                            <el-select v-model="confirm.confirmStatus" placeholder="全部" clearable>
                                <el-option label="未确认" value="0"></el-option>
                                <el-option label="已确认" value="1"></el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item label="事故描述" class="big">
                            <el-input type="textarea" v-model="confirm.accidentDesc" placeholder="请输入事故描述" clearable></el-input>
                        </el-form-item>


                    </div>

                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitFormOp('confirm')">保存</el-button>
                <el-button @click="close()">关闭</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {calculator} from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import {formRule, ruleTool, tool} from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name: "appOilManageConfirm",
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
                confirm:{},
                rules: {
                    confirmStatus:[
                        { required: true, message: '请选择确认状态', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            open() {
                this.show = true;
            },
            submitFormOp(confirm) {
                this.$refs[confirm].validate((valid) => {
                    if (valid) {
                        var url = "operation_traffic/accident/confirm";
                        this.confirm.id  = this.id;
                        ajax.post(url, this.confirm).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.close();
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
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
        },


    }
</script>

