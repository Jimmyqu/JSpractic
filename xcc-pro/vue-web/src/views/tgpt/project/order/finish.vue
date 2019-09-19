<template>
    <!--完成-->
    <div class="form-panel">
        <el-form :model="finishForm" label-position="top" ref="finishForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--确认信息-->
                <el-collapse-item title="确认信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="订单编号">
                            <el-input v-model="finishForm.orderNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号">
                            <el-input v-model="finishForm.contractNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务客户">
                            <el-input v-model="finishForm.enterpriseName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车型名称">
                            <el-input v-model="finishForm.modelName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车牌">
                            <el-input v-model="finishForm.plate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机姓名">
                            <el-input v-model="finishForm.driverName" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <!--退出说明-->
                <el-collapse-item title="退出说明" name="2">
                    <div class="flex-panel">
                        <el-form-item label="是否提前退出">
                            <el-select placeholder="请选择" clearable v-model="finishForm.isAdvanceExit">
                                <el-option label="是" value="1"> </el-option>
                                <el-option label="否" value="0"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退出方式">
                            <el-select placeholder="请选择" clearable v-model="finishForm.exitMode">
                                <el-option label="违约退车" value="0"> </el-option>
                                <el-option label="正常退车" value="1"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="违约金">
                            <el-input v-model="finishForm.breakAmount" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="违约原因" class="big" clearable>
                            <el-input type="textarea" v-model="finishForm.breakReason"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('finishForm')">保存</el-button>
                    <el-button @click="close()">返回</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>
    </div>
</template>

<script>
    import {startProcess} from '@/utils'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "projectOrderFinish",
        data(){
            return {
                openCollapse:["1","2"],
                organizationList:[],
                finishForm : {
                    driverId : "",
                    vehicleId : "",
                },
            }
        },
        methods:{
            open(){
                this.finishForm = {};
                if (this.$route.query.id) {
                    this.initForm(this.$route.query.id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
            },
            clearValidate(){
                if(this.$refs['finishForm'])
                    this.$nextTick(_ =>{
                        this.$refs['finishForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("core/projectOrder/detail/"+id).then(res => {
                    if(this.checkResponse(res)) {
                        this.finishForm = res.data;
                        this.clearValidate();
                    }
                })
            },
            submitForm(finishForm) {
                this.$refs[finishForm].validate((valid) => {
                    if (valid) {
                        ajax.post("core/projectOrder/finish", this.finishForm).then((res) => {
                            if(this.checkResponse(res)) {
                                this.showMessage('保存成功！', 'success');
                                this.close();
                            }
                        })
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });
            },
        },
        mounted(){
            this.open();
        }
    }
</script>

