<template>
    <!--出车-->
    <div class="form-panel">
        <el-form :model="vehicleOutForm" label-position="top" :rules="rules" ref="vehicleOutForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="出车信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="订单编号">
                            <el-input v-model="vehicleOutForm.orderNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车型名称">
                            <el-input v-model="vehicleOutForm.modelName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用车开始日期">
                            <el-input v-model="vehicleOutForm.startDate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="租车月数">
                            <el-input v-model="vehicleOutForm.months" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机姓名">
                            <el-input v-model="vehicleOutForm.driverName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车牌">
                            <el-input v-model="vehicleOutForm.plate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="出车时间" prop="departureDate">
                            <el-date-picker
                                v-model="vehicleOutForm.departureDate"
                                type="datetime"
                                placeholder="选择日期"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="调车备注" name="2">
                    <el-form-item label="出车备注" class="big">
                        <el-input type="textarea" v-model="vehicleOutForm.remark"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('vehicleOutForm')">保存</el-button>
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
        name: "projectOrderVehicleOut",
        data(){
            return {
                openCollapse:["1","2"],
                show : false,
                vehicleOutForm : {},
                rules: {
                    departureDate: [
                        { required: true, message: '请选择出车时间', trigger: 'blur' },
                    ],
                }
            }
        },
        methods:{
            open(){
                this.vehicleOutForm = {};
                if (this.$route.query.id){
                    this.initForm(this.$route.query.id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
            },
            clearValidate(){
                if(this.$refs['vehicleOutForm'])
                    this.$nextTick(_ =>{
                        this.$refs['vehicleOutForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("core/projectOrder/detail/"+id).then(res => {
                    if(this.checkResponse(res)) {
                        this.vehicleOutForm = res.data;
                        this.clearValidate();
                    }
                })
            },
            submitForm(vehicleOutForm) {
                this.$refs[vehicleOutForm].validate((valid) => {
                    if (valid) {
                        ajax.post("core/projectOrder/vehicleOut", this.vehicleOutForm).then((res) => {
                            if(this.checkResponse(res)) {
                                this.showMessage('保存成功！','success')
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

