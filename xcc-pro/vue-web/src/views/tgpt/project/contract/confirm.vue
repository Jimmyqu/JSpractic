<template>
    <el-dialog :title="confirmTitle" :visible.sync="confirmFormShow" :append-to-body="true">
        <el-form label-position="top" label-width="100px" ref="contractOutConfirmForm" :model="contractOutConfirmForm">
            <div v-if="confirmType===1">
                <el-form-item label="资产调拨处置确认" :rules="[
                                  { required: true, message: '资产调拨处置确认不能为空', trigger: 'change' },
                                ]">
                    <el-select v-model="contractOutConfirmForm.assetAllocationDisposalConfirm"
                               placeholder="请选择">
                        <el-option label="已确认" :value="1"></el-option>
                        <el-option label="未确认" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产调拨处置确认人">
                    <el-input v-model="contractOutConfirmForm.assetAllocationDisposalConfirmUserName"
                              :disabled="true">
                    </el-input>
                </el-form-item>
                <el-form-item label="资产调拨处置确认时间">
                    <el-input v-model="contractOutConfirmForm.assetAllocationDisposalConfirmTime"
                              :disabled="true">
                    </el-input>
                </el-form-item>
            </div>
            <div v-if="confirmType===2">
                <el-form-item label="驾驶人员安排确认" :rules="[
                                  { required: true, message: '驾驶人员安排确认不能为空', trigger: 'change' },
                                ]">
                    <el-select v-model="contractOutConfirmForm.driverArrangementConfirm" placeholder="请选择">
                        <el-option label="已确认" :value="1"></el-option>
                        <el-option label="未确认" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="驾驶人员安排确认人">
                    <span>{{contractOutConfirmForm.driverArrangementConfirmUserName}}</span>
                </el-form-item>
                <el-form-item label="驾驶人员安排确认时间">
                    <span>{{contractOutConfirmForm.driverArrangementConfirmTime}}</span>
                </el-form-item>
            </div>
            <div v-if="confirmType===3">
                <el-form-item label="车况说明确认" :rules="[
                                  { required: true, message: '车况说明确认不能为空', trigger: 'change' },
                                ]">
                    <el-select v-model="contractOutConfirmForm.carConditionExplainConfirm" placeholder="请选择">
                        <el-option label="已确认" :value="1"></el-option>
                        <el-option label="未确认" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车况说明确认人">
                    <span>{{contractOutConfirmForm.carConditionExplainConfirmUserName}}</span>
                </el-form-item>
                <el-form-item label="车况说明确认时间">
                    <span>{{contractOutConfirmForm.carConditionExplainConfirmTime}}</span>
                </el-form-item>
            </div>
            <div v-if="confirmType===4">
                <el-form-item label="保险确认" :rules="[
                                  { required: true, message: '保险确认不能为空', trigger: 'change' },
                                ]">
                    <el-select v-model="contractOutConfirmForm.insuranceConfirm" placeholder="请选择">
                        <el-option label="已确认" :value="1"></el-option>
                        <el-option label="未确认" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保险确认人">
                    <span>{{contractOutConfirmForm.insuranceConfirmUserName}}</span>
                </el-form-item>
                <el-form-item label="保险确认时间">
                    <span>{{contractOutConfirmForm.insuranceConfirmTime}}</span>
                </el-form-item>
            </div>
            <div v-if="confirmType===5">
                <el-form-item label="违章情况确认" :rules="[
                                  { required: true, message: '违章情况确认不能为空', trigger: 'change' },
                                ]">
                    <el-select v-model="contractOutConfirmForm.peccancyConfirm" placeholder="请选择">
                        <el-option label="已确认" :value="1"></el-option>
                        <el-option label="未确认" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="违章情况确认人">
                    <span>{{contractOutConfirmForm.peccancyConfirmUserName}}</span>
                </el-form-item>
                <el-form-item label="违章情况确认时间">
                    <span>{{contractOutConfirmForm.peccancyConfirmTime}}</span>
                </el-form-item>
            </div>
            <div v-if="confirmType===6">
                <el-form-item label="费用收取确认" :rules="[
                                  { required: true, message: '费用收取确认不能为空', trigger: 'change' },
                                ]">
                    <el-select v-model="contractOutConfirmForm.chargedConfirm" placeholder="请选择">
                        <el-option label="已确认" :value="1"></el-option>
                        <el-option label="未确认" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用收取确认人">
                    <span>{{contractOutConfirmForm.chargedConfirmUserName}}</span>
                </el-form-item>
                <el-form-item label="费用收取确认时间">
                    <span>{{contractOutConfirmForm.chargedConfirmTime}}</span>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save('contractOutConfirmForm')">保存</el-button>
            <el-button @click="close()">返回</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "confirm",
        mixins: [tool],
        data: function () {
            return {
                id: "",
                confirmType: "",
                confirmTitle: "",
                confirmFormShow: false,
                contractOutConfirmForm: {
                    assetAllocationDisposalConfirm: null,
                    driverArrangementConfirm: null,
                    carConditionExplainConfirm: null,
                    insuranceConfirm: null,
                    peccancyConfirm: null,
                    chargedConfirm: null,
                },
            }
        },
        methods: {
            open(bean) {
                //初始化页面参数
                this.id = bean.id;
                this.confirmType = bean.type;
                //初始化页面数据
                this.initFormTitle();
                this.initFormData(bean.id);
                //清空表单验证
                if (this.$refs["contractOutConfirmForm"]) {
                    this.$refs["contractOutConfirmForm"].clearValidate();
                }
                this.confirmFormShow = true;
            },
            close() {
                //关闭当前页面
                this.confirmFormShow = false;
                //重新加载列表
                this.$emit("load");
                //重置已保存表单
                this.contractOutConfirmForm = {};
            },
            initFormTitle() {
                switch (this.confirmType) {
                    case 1:
                        this.confirmTitle = "资产调拨处置确认";
                        break;
                    case 2:
                        this.confirmTitle = "驾驶人员安排确认";
                        break;
                    case 3:
                        this.confirmTitle = "车况说明确认";
                        break;
                    case 4:
                        this.confirmTitle = "保险确认";
                        break;
                    case 5:
                        this.confirmTitle = "违章情况确认";
                        break;
                    case 6:
                        this.confirmTitle = "费用收取确认";
                        break;
                    default:
                        this.confirmTitle = "";
                        break;
                }
            },
            initFormData(id) {
                ajax.get("core/projectContractOut/detail/" + id).then((result) => {
                    this.contractOutConfirmForm = result.data;
                });
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {//校验通过
                        let postData = {
                            id: this.contractOutConfirmForm.id,
                            confirmType: this.confirmType,
                            assetAllocationDisposalConfirm: this.contractOutConfirmForm.assetAllocationDisposalConfirm,
                            driverArrangementConfirm: this.contractOutConfirmForm.driverArrangementConfirm,
                            carConditionExplainConfirm: this.contractOutConfirmForm.carConditionExplainConfirm,
                            insuranceConfirm: this.contractOutConfirmForm.insuranceConfirm,
                            peccancyConfirm: this.contractOutConfirmForm.peccancyConfirm,
                            chargedConfirm: this.contractOutConfirmForm.chargedConfirm
                        };
                        this.loading = true;
                        ajax.post("core/projectContractOut/contractOutConfirm", postData).then((result) => {
                            this.loading = false;
                            this.$message.success('信息确认成功');
                            //关闭当前页
                            this.close();
                        });
                    } else {
                        return false;
                    }
                });
            },
        },
    }
</script>
