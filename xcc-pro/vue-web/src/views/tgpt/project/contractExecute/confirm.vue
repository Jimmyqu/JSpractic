<template>
    <el-dialog :title="title" :visible.sync="show" :append-to-body="true" width="600px">
        <el-form :model="confirmForm" :rules="rules" ref="confirmForm" class="detail-panel" style="min-height:inherit">
            <el-form-item label="确认状态" prop="confirmStatus">
                <el-select v-model="confirmForm.confirmStatus" placeholder="请选择" clearable>
                    <el-option label="已确认" value="1"></el-option>
                    <el-option label="未确认" value="0"></el-option>
                </el-select>
            </el-form-item>

            <div class="detail-box">
                <div class="detail-item big">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <span>{{projectContractConfirmModel.confirmStatus==1?"已确认":"未确认"}}</span>
                    </div>
                </div>
                <div class="detail-item big">
                    <label class="control-label">操作人</label>
                    <div class="input-group">
                        <span>{{projectContractConfirmModel.confirmUserName}}</span>
                    </div>
                </div>
                <div class="detail-item big">
                    <label class="control-label">时间</label>
                    <div class="input-group">
                        <span>{{projectContractConfirmModel.confirmDate}}</span>
                    </div>
                </div>
            </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmSubmit('confirmForm')">提交</el-button>
            <el-button @click="close()">关闭</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "confirm",
        mixins: [tool],
        data(){
            return {
                show:false,
                title:'信息完整性确认',
                projectContractConfirmModel:{},
                confirmForm:{},
                rules: {
                    'confirmStatus': [
                        {required: true, message: '请选择确认状态', trigger: 'change'}
                    ]
                }
            }
        },
        methods:{
            open(bean, confirmType){
                if(confirmType ==1){
                    this.title = "项目合同-信息完整性确认";
                }else if(confirmType ==2){
                    this.title = "项目合同-资金安排确认";
                }else if(confirmType ==3){
                    this.title = "项目合同-服务信息确认";
                }else if(confirmType ==4){
                    this.title = "项目合同-车务信息确认";
                }else if(confirmType ==5){
                    this.title = "项目合同-人员成本报价确认";
                }else if(confirmType ==6){
                    this.title = "项目合同-人员成本报价确认";
                }else if(confirmType ==7){
                    this.title = "项目合同-分公司筹备确认";
                }

                this.confirmForm.id = bean.id;
                this.confirmForm.confirmType = confirmType;
                this.projectContractConfirmModel = {};
                this.getContractConfirm(bean.id,confirmType);
            },
            confirmSubmit(confirmForm){
                this.$refs[confirmForm].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否提交该操作?').then(_ => {
                            ajax.post('/core/coreProjectContractExecute/confirmOperate' , this.confirmForm).then(rs => {
                                if (rs.status == 0) {
                                    this.$message({message: '操作成功！', type: 'success'});
                                    this.close();
                                    this.$emit('load');
                                } else {
                                    this.$message({message: rs.message, type: 'error'});
                                }
                            });
                        }).catch(_ => {
                        });
                    }else {
                        return false;
                    }

                });

            },
            close(){
                this.show = false;
            },
            getContractConfirm(id,type){
                let params = {
                    id:id,
                    type:type
                };
                ajax.get("/core/coreProjectContractExecute/getContractConfirm",params).then(res=>{
                    this.show = true;
                    if (res.status == 0&&res.data) {
                        this.projectContractConfirmModel = res.data;
                    }
                })
            }
        }
    }
</script>
