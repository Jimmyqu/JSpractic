<template>
    <div class="form-panel detail-panel">
        <el-form :model="useForm" :rules="rules" label-position="top" ref="useForm" label-width="100px">
            <el-collapse v-model="openCollapse">

                <el-collapse-item title="指标信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">指标编号</label>
                            <div class="input-group">
                                <span>{{useForm.indicatorNumber}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{useForm.companyId}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">所属城市</label>
                            <div class="input-group">
                                <span>{{useForm.ownCity}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">指标所有人</label>
                            <div class="input-group">
                                <span>{{useForm.holder}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">到期日</label>
                            <div class="input-group">
                                <span>{{useForm.expiryDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">创建人</label>
                            <div class="input-group">
                                <span>{{useForm.creater}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">创建时间</label>
                            <div class="input-group">
                                <span>{{useForm.createTime}}</span>
                            </div>
                        </div>
                    </div>

                </el-collapse-item>


                <el-collapse-item title="使用" name="2" >
                    <div class="flex-panel">
                        <el-form-item label="车牌" prop="plate">
                            <el-input v-model="useForm.plate" placeholder="请输入车牌"
                                      clearable ></el-input>
                        </el-form-item>

                        <el-form-item label="使用性质" prop="natureType">
                            <el-select v-model="useForm.natureType" placeholder="请选择使用性质" clearable>
                                <el-option label="自用" :value="1"></el-option>
                                <el-option label="出租" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="使用机构" prop="useAgency">
                            <el-input v-model="useForm.useAgency" placeholder="请输入使用机构"
                                      clearable ></el-input>
                        </el-form-item>

                        <el-form-item label="租用起始日期" prop="rentDate">
                            <el-date-picker
                                v-model="useForm.rentDate"
                                type="date"
                                :picker-options="startOption"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="预计截止日期" prop="endDate">
                            <el-date-picker
                                v-model="useForm.endDate"
                                type="date"
                                :picker-options="endOption"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="使用费用（元/月）" prop="useFee">
                            <el-input v-model="useForm.useFee" placeholder="请输入使用费用"
                                      clearable ></el-input>
                        </el-form-item>

                        <el-form-item label="备注" prop="remarks">
                            <el-input v-model="useForm.remarks" placeholder="请输入备注"
                                      clearable ></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>

            </el-collapse>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('useForm')">保存</el-button>
                    <el-button @click="closeCurPage()">关闭</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import $ from 'jquery-slim'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'


    export default {
        mixins: [ tool, ruleTool ],
        name:"plateManageUse",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect,ApprovalFlow},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            let $this = this;
            return {
                openCollapse:["1","2"],
                show : false,
                companyIds:[],
                nearCity4:[],
                useForm : {},
                startOption:{
                    disabledDate(time) {
                        if($this.useForm.endDate){
                            return new Date($this.useForm.endDate).getTime() < time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                endOption:{
                    disabledDate(time) {
                        if($this.useForm.rentDate){
                            return new Date($this.useForm.rentDate).getTime() > time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                rules: {
                    natureType:[
                        { required: true, message: '请选择使用性质', trigger: 'change' }
                    ],
                    plate: [
                        { required: true, message: '请输入车牌', trigger: 'blur'},
                        { validator:formRule.validatePlate, message: '车牌号格式有误', trigger: 'blur' }
                    ],
                    useAgency: [
                        { required: true, message: '请输入使用机构', trigger: 'change' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'change' }
                    ],
                    rentDate: [
                        { required: true, message: '请选择租用起始日期', trigger: 'change' }
                    ],
                    endDate: [
                        { required: true, message: '请选择预计截止日期', trigger: 'change' }
                    ],
                    useFee:[
                        { required: true, message: '请输入使用费用', trigger: 'change' },
                        {pattern: moneyRegex,required: false, message: '请输入正确的金额', trigger: 'change'}
                    ],
                    remarks: [
                        { max: 50, message: '最多输入 50 个字符', trigger: 'change' }
                    ]
                }
            }
        },

        methods:{
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2)
                    this.useForm.ownCity=this.nearCity4[1];
            },
            open(){
                let id = this.$route.params.id;
                this.useForm = {};
                if (id){
                    this.initForm(id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
                this.show = true;
            },
            clearValidate(){
                if(this.$refs['useForm'])
                    this.$nextTick(_ =>{
                        this.$refs['useForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("base/plate/use/"+id).then(res => {
                    this.useForm = res.data;

                })
            },
            submitForm(useForm) {
                this.$refs[useForm].validate((valid) => {
                    if (valid) {
                        var url = "base/plate/saveUse";
                        ajax.post(url, this.useForm).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.closeCurPage();
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
                    this.useForm.companyId = this.companyIds[0];
                }
            },
            closeCurPage(){
                var url = "/tgpt_v2/plateManage";
                let tag = $(".tags-view-item.active .el-icon-close");
                this.$router.push({path:url});
                window.setTimeout(_ =>{
                    tag.click();
                },500);
            },

        },
        mounted(){
            this.open();
        }
    }
</script>

