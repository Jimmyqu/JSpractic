<template>
    <div class="form-panel detail-panel">
        <el-form :model="confirm" :rules="rules" label-position="top" ref="confirm" label-width="100px">
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

                <el-collapse-item title="维修确认" name="2">
                    <div class="flex-panel">
                        <el-form-item label="确认状态" prop="confirmStatus">
                            <el-select v-model="confirm.confirmStatus" placeholder="全部" clearable>
                                <el-option label="未确认" value="0"></el-option>
                                <el-option label="已确认" value="1"></el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item label="维修描述" class="big">
                            <el-input type="textarea"  v-model="confirm.maintenanceDesc" placeholder="请输入维修描述" clearable></el-input>
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
        name: "appMaintenanceConfirm",
        components:{ ApprovalFlow,FileDetail,UploadPanel },
        data() {
            return {
                openCollapse: ["1","2"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                maintenanceImg:[],
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
                        var url = "operation_traffic/maintenance/confirm";
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
        },


    }
</script>

