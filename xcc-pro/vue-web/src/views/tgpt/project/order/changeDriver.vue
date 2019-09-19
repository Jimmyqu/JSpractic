<template>
    <!--更换司机-->
    <div class="form-panel">
        <el-form :model="changeDriverForm" label-position="top" :rules="rules" ref="changeDriverForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--调度-->
                <el-collapse-item title="基本" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="用车城市">
                            <el-input v-model="changeDriverForm.useCarCityName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务组织">
                            <el-input v-model="changeDriverForm.companyName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机姓名">
                            <el-input v-model="changeDriverForm.driverName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机手机号">
                            <el-input v-model="changeDriverForm.phone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="新司机姓名">
                            <el-input v-model="changeDriverForm.newDriverName" @click.native="showDialogDriver()" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新司机手机号">
                            <el-input v-model="changeDriverForm.newPhone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机更换日期">
                            <el-date-picker
                                v-model="changeDriverForm.changeDate"
                                type="date"
                                placeholder="请选择司机更换日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="司机更换费用（元）" prop="fee">
                            <el-input v-model="changeDriverForm.fee"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注信息" name="2">
                    <el-form-item label="更换司机备注" class="big">
                        <el-input type="textarea" v-model="changeDriverForm.remark"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('changeDriverForm')">保存</el-button>
                    <el-button @click="close()">返回</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>

        <!-- 司机弹框 dialogDriverVisible----------------------->
        <el-dialog title="选择司机" :visible.sync="dialogDriverVisible" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.name" placeholder="请输入司机姓名" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.phone" placeholder="请输入手机号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.serviceCityName" placeholder="请输入服务城市" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-width="300px">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="chooseDriver(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="司机姓名"  min-width="300" ></el-table-column>
                        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="serviceCityId" label="服务城市" min-width="200"></el-table-column>
                        <el-table-column prop="workStatus" label="在职状态" min-width="80"></el-table-column>
                        <el-table-column prop="serviceStatus" label="服务状态" min-width="120"></el-table-column>
                        <el-table-column prop="driveAge" label="驾龄" min-width="120"></el-table-column>
                        <el-table-column prop="companyId" label="所属组织" min-width="100"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {startProcess} from '@/utils'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "projectOrderChangeDriver",
        data(){
            return {
                openCollapse:["1","2"],
                dialogDriverVisible : false,
                organizationList:[],
                changeDriverForm : {
                    driverId : "",
                    newDriverId : "",
                },
                rules: {
                    fee: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                }
            }
        },
        methods:{
            showDialogDriver(){
                var url = `core/projectOrder/queryDriverList?orgId=${this.changeDriverForm.companyId}`;
                this.dialogDriverVisible = true;
                this.getListByUrl(url);
            },
            chooseDriver(bean){
                this.changeDriverForm.newDriverName = bean.name;
                this.changeDriverForm.newDriverId = bean.id;
                this.changeDriverForm.newPhone = bean.phone;
                this.dialogDriverVisible = false;
            },
            open(){
                this.changeDriverForm = {};
                if (this.$route.query.id){
                    this.initForm(this.$route.query.id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
            },
            clearValidate(){
                if(this.$refs['changeDriverForm'])
                    this.$nextTick(_ =>{
                        this.$refs['changeDriverForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("core/projectOrder/detail/"+id).then(res => {
                    if(this.checkResponse(res)) {

                    }
                    this.changeDriverForm = res.data;
                    this.clearValidate();
                    console.log(this.vehicleForm)
                })
            },
            getOrganzationList(){
                const userInfo = this.getCurrentUserInfo();
                this.organizationList=userInfo.organizationList;
            },
            submitForm(changeDriverForm) {
                this.$refs[changeDriverForm].validate((valid) => {
                    if (valid) {
                        ajax.post("core/projectOrder/changeDrive", this.changeDriverForm).then((res) => {
                            if(this.checkResponse(res)) {
                                this.showMessage('保存成功！','success');
                                this.close();
                            }
                        });
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });
            },
        },
        mounted(){
            this.getOrganzationList();
            this.open();
        }
    }
</script>

