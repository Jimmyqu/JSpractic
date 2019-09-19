<template>
    <!--调度-->
    <div class="form-panel">
        <el-form :model="dispatchForm" label-position="top" ref="dispatchForm" label-width="100px">
            <el-collapse v-model="openCollapse">

                <el-collapse-item title="订单信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="服务组织">
                            <el-input v-model="dispatchForm.companyName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务客户">
                            <el-input v-model="dispatchForm.enterpriseName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="订单编号">
                            <el-input v-model="dispatchForm.orderNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号">
                            <el-input v-model="dispatchForm.contractNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用车城市">
                            <el-input v-model="dispatchForm.useCarCityName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用车开始日期">
                            <el-input v-model="dispatchForm.startDate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用车结束日期">
                            <el-input v-model="dispatchForm.endDate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="租车月数">
                            <el-input v-model="dispatchForm.months" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆租金" >
                            <el-input v-model="dispatchForm.carRentMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机费用" v-show="dispatchForm.isNeedDriver == 1 ">
                            <el-input v-model="dispatchForm.driverCostMonth" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <!--调度信息-->
                <el-collapse-item title="调度信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="车型名称">
                            <el-input v-model="dispatchForm.modelName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item prop="plate" label="车牌" :rules="rules.required('请选择车辆')">
                            <el-input v-model="dispatchForm.plate" @click.native="showDialogPlate()" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="是否需司机">
                            <el-select placeholder="不限" clearable v-model="dispatchForm.isNeedDriver" :disabled="true">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="司机姓名">
                            <!--<el-input v-model="dispatchForm.driverName" @click.native="showDialogDriver()" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>-->
                            <el-input v-model="dispatchForm.driverName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="司机手机号">
                            <el-input v-model="dispatchForm.phone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="调度操作人">
                            <el-input v-model="dispatchForm.updater" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="调度操作时间">
                            <el-input v-model="dispatchForm.updateTime" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="调度备注" name="3">
                    <el-form-item label="调度备注" class="big">
                        <el-input type="textarea" v-model="dispatchForm.remark"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('dispatchForm')">保存</el-button>
                    <el-button @click="close()">返回</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>

        <!-- 车辆弹框 dialogPlateVisible----------------------->
        <el-dialog title="选择车辆" :visible.sync="dialogPlateVisible" :append-to-body="true" width="70%">
            <div class="wrapper wrapper-content fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable/>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"
                                   @click="handleCurrentChange(1)">查询
                        </el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-height="300">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="choosePlate(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="120"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="300"></el-table-column>
                        <el-table-column prop="color" label="颜色" min-width="80"></el-table-column>
                        <el-table-column prop="driverName" label="司机姓名" min-width="120"></el-table-column>
                        <el-table-column prop="phone" label="司机手机号" min-width="100"></el-table-column>
                        <el-table-column prop="serviceRegion" label="服务组织" min-width="80"></el-table-column>
                        <el-table-column prop="providerCompanyName" label="所属组织" min-width="80"></el-table-column>
                       <!-- <el-table-column prop="vehicleSource" label="车辆来源" min-width="80"></el-table-column>-->
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

        <!-- 司机弹框 dialogDriverVisible----------------------->
        <el-dialog title="选择司机" :visible.sync="dialogDriverVisible" :append-to-body="true" width="70%">
            <div class="wrapper wrapper-content fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" placeholder="请输入司机姓名" clearable/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" placeholder="请输入手机号" clearable/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">服务城市</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.serviceCityName" placeholder="请输入服务城市" clearable/>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"
                                   @click="handleCurrentChange(1)">查询
                        </el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-height="300">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="chooseDriver(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="司机姓名" min-width="120"></el-table-column>
                        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="serviceCityId" label="服务城市" min-width="120"></el-table-column>
                        <el-table-column prop="workStatus" label="在职状态" min-width="120"></el-table-column>
                        <el-table-column prop="serviceStatus" label="服务状态" min-width="120"></el-table-column>
                        <el-table-column prop="driveAge" label="驾龄" min-width="120"></el-table-column>
                        <el-table-column prop="companyName" label="所属组织" min-width="100"></el-table-column>
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
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "projectOrderDispatch",
        data() {
            return {
                openCollapse: ["1", "2", "3"],
                dialogPlateVisible: false,
                dialogDriverVisible: false,
                vehicleModelInfoId: "",
                organizationList: [],
                dispatchForm: {
                    driverId: "",
                    vehicleId: "",
                    orderStatus: ""
                }
            }
        },
        methods: {
            showDialogPlate() {
                /*var url = "core/projectOrder/queryVehicleList?vehicleModelInfoId="+this.dispatchForm.vehicleModelInfoId+
                "&company_id="+this.dispatchForm.companyId+"&isNeedDriver="+this.dispatchForm.isNeedDriver;*/
                var url = "core/projectOrder/queryVehicleList?company_id="+this.dispatchForm.companyId+"&isNeedDriver="+this.dispatchForm.isNeedDriver;
                this.dialogPlateVisible = true;
                this.getListByUrl(url);
            },
            showDialogDriver() {
                var url = "core/projectOrder/queryDriverList";
                this.dialogDriverVisible = true;
                this.getListByUrl(url);
            },
            choosePlate(bean) {
                this.dispatchForm.plate = bean.plate;
                this.dispatchForm.vehicleId = bean.id;
                this.dispatchForm.modelName = bean.modelName;
                this.dialogPlateVisible = false;
                if(bean.driverId!=undefined && bean.driverId!=null && bean.driverId!=''){
                    this.dispatchForm.driverName=bean.driverName;
                    this.dispatchForm.driverId = bean.driverId;
                    this.dispatchForm.phone = bean.phone;
                }else{
                    this.dispatchForm.driverName='';
                    this.dispatchForm.driverId = '';
                    this.dispatchForm.phone = '';
                }
            },
            chooseDriver(bean) {
                this.dispatchForm.driverName = bean.name;
                this.dispatchForm.driverId = bean.id;
                this.dispatchForm.phone = bean.phone;
                this.dialogDriverVisible = false;
            },
            open() {
                this.dispatchForm = {};
                if (this.$route.query.id) {
                    this.initForm(this.$route.query.id);
                } else {
                    this.clearValidate();
                }
                this.openCollapse = ["1", "2", "3"];
            },
            clearValidate() {
                if (this.$refs['dispatchForm'])
                    this.$nextTick(_ => {
                        this.$refs['dispatchForm'].clearValidate();
                    })
            },
            initForm(id) {
                ajax.get("core/projectOrder/detail/" + id).then(res => {
                    if (this.checkResponse(res)) {
                        this.dispatchForm = res.data;
                        // 获取当前用户登录信息
                        const userInfo = this.getCurrentUserInfo();
                        this.dispatchForm.updater = userInfo.name;
                        this.clearValidate();
                    }
                })
            },
            getOrganzationList() {
                const userInfo = this.getCurrentUserInfo();
                this.organizationList = userInfo.organizationList;
            },
            submitForm(dispatchForm) {
                this.$refs[dispatchForm].validate((valid) => {
                    if (valid) {
                        ajax.post("core/projectOrder/dispatch", this.dispatchForm).then((res) => {
                            if (this.checkResponse(res)) {
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
        mounted() {
            this.getOrganzationList();
            this.open();
        }
    }
</script>

