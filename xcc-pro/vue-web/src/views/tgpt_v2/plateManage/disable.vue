<template>
    <div class="form-panel detail-panel">
        <el-form :model="disableForm" :rules="rules" label-position="top" ref="disableForm" label-width="100px">
            <el-collapse v-model="openCollapse">

                <el-collapse-item title="指标信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">指标编号</label>
                            <div class="input-group">
                                <span>{{disableForm.indicatorNumber}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{disableForm.companyId}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">所属城市</label>
                            <div class="input-group">
                                <span>{{disableForm.ownCity}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">创建人</label>
                            <div class="input-group">
                                <span>{{disableForm.creater}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">创建时间</label>
                            <div class="input-group">
                                <span>{{disableForm.createTime}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <span>{{disableForm.plate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">使用性质</label>
                            <div class="input-group">
                                <span>{{disableForm.natureType}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">指标所有人</label>
                            <div class="input-group">
                                <span>{{disableForm.holder}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">使用机构</label>
                            <div class="input-group">
                                <span>{{disableForm.useAgency}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">起始日期</label>
                            <div class="input-group">
                                <span>{{disableForm.rentDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">预计截至日期</label>
                            <div class="input-group">
                                <span>{{disableForm.endDate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">使用费用</label>
                            <div class="input-group">
                                <span>{{disableForm.useFee}}</span>
                            </div>
                        </div>
                    </div>

                </el-collapse-item>


                <el-collapse-item title="停用" name="2" >
                    <div class="flex-panel">

                        <el-form-item label="实际截止日期" prop="actualendDate">
                            <el-date-picker
                                v-model="disableForm.actualendDate"
                                type="date"
                                :picker-options="endOption"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="更新到期日" prop="expiryDate">
                            <el-date-picker
                                v-model="disableForm.expiryDate"
                                type="date"
                                :picker-options="endOption"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="备注" >
                            <el-input v-model="disableForm.remarks" placeholder="请输入备注"
                                      clearable ></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>

            </el-collapse>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('disableForm')">保存</el-button>
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
        name:"plateManageDisable",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect,ApprovalFlow},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            let $this = this;
            return {
                openCollapse:["1","2"],
                show : false,
                companyIds:[],
                nearCity4:[],
                disableForm : {},
                endOption:{
                    disabledDate(time) {
                        if($this.disableForm.rentDate){
                            return new Date($this.disableForm.rentDate).getTime() - 24*60*60*1000 > time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                rules: {
                    actualendDate:[
                        { required: true, message: '请选择实际截止日期', trigger: 'change' }
                    ],
                    expiryDate:[
                        { required: true, message: '请选择到期日', trigger: 'change' }
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
                    this.disableForm.ownCity=this.nearCity4[1];
            },
            open(){
                let id = this.$route.params.id;
                this.disableForm = {};
                if (id){
                    this.initForm(id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
                this.show = true;
            },
            clearValidate(){
                if(this.$refs['disableForm'])
                    this.$nextTick(_ =>{
                        this.$refs['disableForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("base/plate/disable/"+id).then(res => {
                    this.disableForm = res.data;

                })
            },
            submitForm(disableForm) {
                this.$refs[disableForm].validate((valid) => {
                    if (valid) {
                        var url = "base/plate/saveDisable";
                        ajax.post(url, this.disableForm).then(
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
                    this.disableForm.companyId = this.companyIds[0];
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

