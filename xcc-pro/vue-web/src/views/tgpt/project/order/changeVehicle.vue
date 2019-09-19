<template>
    <!--更换车辆-->
    <div class="form-panel">
        <el-form :model="changeVehicleForm" label-position="top" :rules="rules" ref="changeVehicleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--调度-->
                <el-collapse-item title="订单信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="用车城市">
                            <el-input v-model="changeVehicleForm.useCarCityName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务组织">
                            <el-input v-model="changeVehicleForm.companyName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车牌">
                            <el-input v-model="changeVehicleForm.plate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车型名称">
                            <el-input v-model="changeVehicleForm.modelName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="新车牌">
                            <el-input v-model="changeVehicleForm.newPlate" @click.native="showDialogPlate()" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新车型名称">
                            <el-input v-model="changeVehicleForm.newModelName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="替代车调拨单">
                            <el-input v-model="changeVehicleForm.code" @click.native="showDialogTransfer()" readonly>
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="替代车费用（元）" prop="fee">
                            <el-input v-model="changeVehicleForm.fee"></el-input>
                        </el-form-item>
                        <el-form-item label="调拨费用（元）" prop="scheduleFee">
                            <el-input v-model="changeVehicleForm.scheduleFee" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车辆更换时间">
                            <el-date-picker
                                v-model="changeVehicleForm.changeDate"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="请选择车辆更换时间">
                            </el-date-picker>

                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注信息" name="2">
                    <el-form-item label="更换车辆备注" class="big">
                        <el-input type="textarea" v-model="changeVehicleForm.remark"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('changeVehicleForm')">保存</el-button>
                    <el-button @click="close()">返回</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>

        <!-- 车辆调拨单弹框 dialogTransferVisible----------------------->
        <el-dialog title="选择车辆调拨单" :visible.sync="dialogTransferVisible" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">调度单号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.code" placeholder="请输入调度单号" clearable >
                                </el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">出车城市</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.depCityName" placeholder="请输入出车城市" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">驾驶员</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.driverName" placeholder="请输入驾驶员" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-width="300px;">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="chooseTransfer(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="调度单号" min-width="150"></el-table-column>
                        <!--<el-table-column prop="plate" label="车辆" min-width="120"></el-table-column>-->
                        <el-table-column prop="departureCityName" label="出发城市" min-width="120"></el-table-column>
                        <el-table-column prop="outsetTime" label="出车时间" min-width="150"></el-table-column>
                        <el-table-column prop="arrivalCityName" label="到达城市" min-width="120"></el-table-column>
                        <el-table-column prop="arrivalsTime" label="到达时间" min-width="150"></el-table-column>
                        <el-table-column prop="driverName" label="驾驶员" min-width="100"></el-table-column>
                        <el-table-column prop="beforeCompanyName" label="调度前所属组织" min-width="100"></el-table-column>
                        <!--<el-table-column prop="processStatusName" label="状态" min-width="100"></el-table-column>-->
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

        <!-- 车辆弹框 dialogPlateVisible----------------------->
        <el-dialog title="选择在库车辆" :visible.sync="dialogPlateVisible" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.plate" placeholder="请输入车牌" clearable >
                                </el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">经营城市</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.runCityName" placeholder="请输入经营城市" clearable />
                            </div>
                        </div>
                       <!-- <div class="form-group">
                            <label class="control-label">车辆状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.vehicleStatus" placeholder="请选择车辆状态">
                                    <el-option label="未投入运营" value="1"></el-option>
                                    <el-option label="待租" value="2"></el-option>
                                    <el-option label="已租" value="3"></el-option>
                                    <el-option label="保养" value="4"></el-option>
                                    <el-option label="维修" value="5"></el-option>
                                    <el-option label="退出运营" value="6"></el-option>
                                </el-select>
                            </div>
                        </div>-->
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-width="300px;">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="choosePlate(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="120"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="300"></el-table-column>
                        <el-table-column prop="registerCityName" label="注册城市" min-width="120"></el-table-column>
                        <el-table-column prop="runCityName" label="经营城市" min-width="120"></el-table-column>
                        <el-table-column prop="companyName" label="所属组织" min-width="120"></el-table-column>
                        <el-table-column prop="vehicleStatus" label="车辆状态" min-width="100"></el-table-column>
                        <el-table-column prop="assetsType" label="资产属性" min-width="100"></el-table-column>
                        <el-table-column prop="plateType" label="车牌属性" min-width="100"></el-table-column>
                        <el-table-column prop="useNature" label="经营属性" min-width="100"></el-table-column>
                        <el-table-column prop="stockStatus" label="在库状态" min-width="100"></el-table-column>
                        <el-table-column prop="licenseName" label="驾驶员" min-width="100"></el-table-column>
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
        name: "projectOrderChangeVehicle",
        data(){
            return {
                openCollapse:["1","2"],
                dialogPlateVisible : false,
                dialogTransferVisible : false,
                show : false,
                organizationList:[],
                changeVehicleForm : {
                    vehicleId : "",
                    newVehicleId : "",
                    transferProcessId : "",
                    vehicleTransferId : "",
                    transferPlate:"",
                },
                rules: {
                    fee: [
                        { required: true, message: '请输入替代车费用', trigger: 'blur' },
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    scheduleFee: [
                        { validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                }
            }
        },
        methods:{
            showDialogPlate(){//加载不需要司机的待租的车辆
                var url = "core/projectOrder/queryVehicleList?company_id="+this.changeVehicleForm.companyId+"&isNeedDriver=0";
                this.dialogPlateVisible = true;
                this.getListByUrl(url);
            },
            choosePlate(bean){
                this.changeVehicleForm.vehicleTransferId = "";
                this.changeVehicleForm.code = "";
                this.changeVehicleForm.scheduleFee = "";
                this.changeVehicleForm.newVehicleId = bean.id;
                this.changeVehicleForm.newPlate = bean.plate;
                this.changeVehicleForm.newModelName = bean.modelName;
                this.dialogPlateVisible = false;
            },
            showDialogTransfer(){
                if(this.changeVehicleForm.newVehicleId){
                    var url = "core/projectOrder/queryTransferList?vehicleId="+ this.changeVehicleForm.newVehicleId;
                    this.dialogTransferVisible = true;
                    this.getListByUrl(url);
                }else{
                    this.$message.error("请先选择车辆");
                    return;
                }
            },
            chooseTransfer(bean){
                debugger
                this.changeVehicleForm.vehicleTransferId = bean.vehicleTransferId;
                this.changeVehicleForm.code = bean.code;
                //this.changeVehicleForm.newVehicleId = bean.vehicleId;
                //this.changeVehicleForm.transferPlate = bean.plate;
                //this.changeVehicleForm.newPlate = bean.plate;
                //this.changeVehicleForm.newModelName = bean.modelName;
                this.changeVehicleForm.scheduleFee = bean.scheduleFee;
                this.dialogTransferVisible = false;
            },
            open(){
                this.changeVehicleForm = {};
                if (this.$route.query.id){
                    this.initForm(this.$route.query.id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
                this.show = true;
            },
            clearValidate(){
                if(this.$refs['changeVehicleForm'])
                    this.$nextTick(_ =>{
                        this.$refs['changeVehicleForm'].clearValidate();
                    })
            },
            initForm(id){
                ajax.get("core/projectOrder/detail/"+id).then(res => {
                    if(this.checkResponse(res)) {
                        this.changeVehicleForm = res.data;
                        this.clearValidate();
                    }
                })
            },
            getOrganzationList(){
                const userInfo = this.getCurrentUserInfo();
                this.organizationList = userInfo.organizationList;
            },
            submitForm(changeVehicleForm) {
                this.$refs[changeVehicleForm].validate((valid) => {
                    if (valid) {
                        ajax.post("core/projectOrder/changeVehicle", this.changeVehicleForm).then((res) => {
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
            this.getOrganzationList();
            this.open();
        }
    }
</script>

