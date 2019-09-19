<template>
    <div class="form-panel">
        <el-form :model="changePlateForm" :rules="rules" label-position="top" ref="vehicleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车牌变更-->
                <el-collapse-item title="车牌变更" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="原车牌">
                            <el-input v-model="changePlateForm.plate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="变更为" prop="newPlate">
                            <el-input v-model="changePlateForm.newPlate"></el-input>
                        </el-form-item>
                        <el-form-item label="变更日期" prop="updateTime">
                            <el-date-picker
                                v-model="changePlateForm.updateTime"
                                type="datetime"
                                placeholder="选择变更日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="变更事由" prop="reason">
                            <el-input type="textarea" v-model="changePlateForm.reason"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('vehicleForm')">保存</el-button>
                    <el-button @click="close()">关闭</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'

    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'


    export default {
        mixins: [ tool, ruleTool ],
        name:"vehicleVehicleInformationChangePlateForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect},

        data(){
            return {
                openCollapse:["1"],
                changePlateForm : {
                    vehicleId : "",
                },
                rules: {
                    newPlate: [
                        { required: true, max: 10, message: '最多输入 10 个字符', trigger: 'change' },
                        { validator:formRule.validatePlate, message: '车牌号格式有误', trigger: 'blur' }
                    ],
                    updateTime: [
                        { required: true, message: '请选择变更日期', trigger: 'change' }
                    ],
                    reason: [
                        { required: true, message: '请输入变更事由', trigger: 'change' },
                        { max: 200, message: '最多输入 200 个字符', trigger: 'change' }
                    ],
                }
            }
        },

        methods:{
            /*validatePlate(rule, value, callback) {
                if(this.vehicleForm.vehicleStatus == "1"){
                    return callback();
                }else {
                    if (!value){
                        return callback(new Error("非未投入运营的车辆请输入车牌"));
                    }else{
                        return callback();
                    }
                }
            },*/
            open(){
                let id = this.$route.query.id;
                let plate = this.$route.query.plate;
                this.changePlateForm.vehicleId = id;
                this.changePlateForm.plate = plate;
                this.changePlateForm = Object.assign({},this.changePlateForm);
            },
            clearValidate(){
                if(this.$refs['changePlateForm'])
                    this.$nextTick(_ =>{
                        this.$refs['vehicleForm'].clearValidate();
                    })
            },
            submitForm(changePlateForm) {
                this.$refs[changePlateForm].validate((valid) => {
                    if (valid) {
                        var url = "base/vehicle/vehicleChangePlate";
                        ajax.post(url, this.changePlateForm).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '车牌变更成功！',type: 'success'});
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
        },
        mounted(){
            this.open();
        }
    }
</script>

