<template>
    <div class="form-panel">
        <el-form :model="plateForm" :rules="rules" label-position="top" ref="plateForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆资料-->
                <el-collapse-item title="车牌" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select @change="chooserOrgId" v-model="companyIds" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree"></tree-select>
                        </el-form-item>
                        <el-form-item label="所属城市" prop="ownCity">
                            <city-select :value.sync="nearCity4" @change="changeCity()" clearable ref="citySelect"></city-select>
                        </el-form-item>
                        <el-form-item label="指标类型" prop="indicatorType">
                            <el-select v-model="plateForm.indicatorType" placeholder="请选择指标类型" clearable>
                                <el-option label="油车指标" :value="1"></el-option>
                                <el-option label="油电指标" :value="2"></el-option>
                                <el-option label="纯电指标" :value="3"></el-option>
                                <el-option label="县际牌指标" :value="4"></el-option>
                                <el-option label="市际牌指标" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="指标所有人" prop="holder">
                            <el-input v-model="plateForm.holder" placeholder="请输入指标所有人"
                                      clearable ></el-input>
                        </el-form-item>
                        <el-form-item label="指标到期日" prop="expiryDate">
                            <el-date-picker
                                v-model="plateForm.expiryDate"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="numberlabel" :prop="number">
                            <el-input v-model="plateForm.number" placeholder="请输入新增个数" maxLength="6"
                                      clearable v-if="numberdisplay"></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>
                <!--车辆现状-->
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('plateForm')">保存</el-button>
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
        name:"plateManageForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            return {
                openCollapse:["1","2"],
                show : false,
                companyIds:[],
                number:'number',
                organization:[],
                nearCity4:[],
                plateForm : {},
                numberdisplay:true,
                numberlabel:"新增个数",
                rules: {
                    companyId:[
                        { required: true, message: '请选择所属组织', trigger: 'change' }
                    ],
                    ownCity: [
                        { required: true, message: '请选择注册城市', trigger: 'change' }
                    ],
                    indicatorType:[
                        { required: true, message: '请选择指标类型', trigger: 'change' }
                    ],
                    holder:[
                        { required: true, message: '请输入指标所有人', trigger: 'change' },
                        { max: 36, message: '最多输入 36 个字符', trigger: 'change' }
                    ],
                    plate: [
                        { required: true, message: '请输入车牌', trigger: 'blur'},
                        { validator:formRule.validatePlate, message: '车牌号格式有误', trigger: 'blur' }
                    ],
                    expiryDate: [
                        { required: true, message: '请选择指标到期日', trigger: 'change' }
                    ],
                    number: [
                        { required: true, message: '请输入个数', trigger: 'change' },
                        { max: 3, message: '最多输入 3 个字符', trigger: 'change' }
                    ],
                    vin: [
                        { required: true, message: '请输入车架号', trigger: 'change' },
                        { max: 17, message: '最多输入 17 个字符', trigger: 'change' }
                    ],
                    vehicleStatus: [
                        { required: true, message: '请选择车辆状态', trigger: 'change' }
                    ],plateCost:[
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],price:[
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],
                }
            }
        },

        methods:{
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2)
                    this.$set(this.plateForm,"ownCity",this.nearCity4[1]);
                    // this.plateForm.ownCity=this.nearCity4[1];
            },
            open(){
                let id = this.$route.query.id;
                this.plateForm = {};
                if (id){
                    this.initForm(id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
                this.show = true;

            },
            clearValidate(){
                if(this.$refs['plateForm'])
                    this.$nextTick(_ =>{
                        this.$refs['plateForm'].clearValidate();
                    })
            },
            initForm(id){
                this.numberdisplay = false;
                this.numberlabel = "";
                ajax.get("base/plate/edit/"+id).then(res => {
                    if (res.data.companyId)
                        this.companyIds.push(res.data.companyId);
                    if (res.data.ownCity) {
                        this.nearCity4 = res.data.ownCity.split(",");
                        res.data.ownCity = res.data.ownCity.split(",")[1];
                        /*this.nearCity4[0] = res.data.provinceId;
                        this.nearCity4[1] = res.data.ownCity;
                        res.data.ownCity = res.data.ownCity;*/
                    } else {
                        res.data.ownCity = [];
                    }
                    this.plateForm = res.data;
                    if(res.data.expiryDate){
                        this.$set(this.plateForm,'expiryDate',res.data.expiryDate.split(' ')[0]);
                    }
                    this.number='';
                })
            },
            submitForm(plateForm) {
                this.$refs[plateForm].validate((valid) => {
                    if (valid) {
                        var url = "base/plate";
                        ajax.post(url, this.plateForm).then(
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
            chooserOrgId() {/!*选取用户组织*!/
                if (this.companyIds.length > 0) {
                    this.$set(this.plateForm,"companyId",this.companyIds[0]);
                    // this.plateForm.companyId = this.companyIds[0];
                }
            },

        },
        mounted(){
            this.open();
        }
    }
</script>

