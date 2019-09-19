<template>
    <div class="form-panel detail-panel">
        <el-form :model="scheduleForm" :rules="rules" label-position="top" ref="scheduleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="调拨信息" name="2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{scheduleForm.organizationName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">调度单号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">状态</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleStatusText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">客户类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.customerType==1?'企业客户':(scheduleForm.customerType==2?'个人客户':'/')}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <span>{{scheduleForm.enterpriseName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.contractNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.user}}&nbsp;{{scheduleForm.phone}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人数</label>
                            <div class="input-group">
                                <span>{{scheduleForm.userNum}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车事由</label>
                            <div class="input-group">
                                <span>{{scheduleForm.reason}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出发地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">抵达地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">预计订单金额</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderAmount}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">散租类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleTypeText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">创建人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.creater}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">创建时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.createTime}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务车辆" name="1">
                    <div class="flex-panel" >
                        <el-form-item label="是否使用挂靠车" v-if="scheduleForm.scheduleType !=5" >
                            <el-select v-model="ifCallVehicle" placeholder="是否使用挂靠车" @change="changeIfCallVehicle">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="车辆"  v-if="scheduleForm.scheduleType !=5 && ifCallVehicle==0" prop="plate">
                            <el-input readonly v-model="scheduleForm.plate" clearable  >
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openVehicle" ></el-button></template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车辆"  v-if="scheduleForm.scheduleType !=5 && ifCallVehicle==1" prop="callVehicle">
                            <el-input v-model="scheduleForm.callVehicle" placeholder="请输入" ></el-input>
                        </el-form-item>





                        <el-form-item label="是否使用挂靠司机" v-if="scheduleForm.scheduleType !=1">
                            <el-select v-model="ifCallDriver" placeholder="是否使用挂靠司机" @change="changeIfCallDriver" :disabled="disableIfCallDriver">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="司机" prop="driverName" v-if="scheduleForm.scheduleType !=1 && ifCallDriver==0&&scheduleForm.scheduleType==5">

                            <el-input readonly v-model="scheduleForm.driverName" clearable >
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openDriver" ></el-button></template>
                            </el-input>

                        </el-form-item>

                        <el-form-item label="司机" prop="driverName" v-if="scheduleForm.scheduleType !=1 && ifCallDriver==0&&scheduleForm.scheduleType!=5">

                            <el-input readonly v-model="scheduleForm.driverName" clearable >
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openDriver" :disabled="disableSearchDrive"></el-button></template>
                            </el-input>

                        </el-form-item>

                        <el-form-item label="司机" prop="callDriver" v-if="scheduleForm.scheduleType !=1 && ifCallDriver==1" >

                            <el-input v-model="scheduleForm.callDriver" placeholder="请输入"></el-input>

                        </el-form-item>




                        <el-form-item label="备注">
                            <el-input v-model="scheduleForm.remake" placeholder="请输入备注"></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('scheduleForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="选择车辆" :visible.sync="dialogVehicle" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border>
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeVehicle(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车辆" min-width="100"></el-table-column>
                        <el-table-column prop="modelInfoName" label="车型" min-width="300"></el-table-column>
                        <el-table-column prop="color" label="颜色" min-width="80"></el-table-column>
                        <!--<el-table-column prop="runCityName" label="经营城市" min-width="120"></el-table-column>-->
                        <el-table-column prop="vehicleStatus" label="车辆状态" min-width="100"></el-table-column>
                        <el-table-column prop="driverName" label="车辆绑定的司机" min-width="100"></el-table-column>
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

        <el-dialog title="选择司机" :visible.sync="dialogDriver" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">司机姓名</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.name" placeholder="请输入司机姓名" clearable />
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border>
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeDriver(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="司机名称" min-width="100"></el-table-column>
                        <el-table-column prop="sex" label="性别" min-width="100"></el-table-column>
                        <el-table-column prop="phone" label="电话" min-width="100"></el-table-column>
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
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        name: "trafficVehicleScheduleSchedule",
        mixins:[tool, ruleTool],
        components:{
        },
        data: function() {
            return {
                openCollapse:["1","2","3","4","5"],
                scheduleForm:{},
                //searchParam:{},
                dialogVehicle:false,
                dialogDriver: false,
                listUrl:"",
                disableSearchDrive: false,
                disableIfCallDriver:false,
                rules: {
                    plate: [
                        { required: true, message: '请选择车辆', trigger: 'blur' }
                    ],
                    callVehicle: [
                        { required: true, message: '请输入车辆', trigger: 'blur' }
                    ],
                    driverName:[{ required: true, message: '请选择司机', trigger: 'blur' }],
                    callDriver:[{ required: true, message: '请输入司机', trigger: 'blur' }]
                },
                ifCallVehicle:0,
                ifCallDriver:0
            }
        },
        mounted: function() {
            this.open();
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.searchParam.companyId=this.scheduleForm.organizationId;
                this.getList();
            },
            open(){
                var $this = this;
                if(this.$route.query.id){
                    ajax.get('/core/vehicleschedule/detail/' + this.$route.query.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                $this.scheduleForm = res.data;
                                if($this.scheduleForm && $this.scheduleForm.scheduleType == 2){
                                    let driverNameRlus = [];
                                    //driverNameRlus.push({ required: true, message: '请选择司机', trigger: 'change' });
                                    this.$set($this.rules,"driverName",driverNameRlus);
                                }
                            }
                        }
                    )
                }
            },

            /*打开司机搜索框，查询未绑定车辆司机*/
            openDriver(){
                if(this.scheduleForm.organizationId) {
                    this.searchParam = {};
                    this.listUrl = "core/vehicleschedule/driverList";
                    this.searchParam.companyId=this.scheduleForm.organizationId;
                    this.searchParam.scheduleType = this.scheduleForm.scheduleType;
                    this.searchParam.type = 1;
                    this.getList();
                    this.dialogDriver = true;
                }else{
                    this.$message.error("订单信息有误!");
                    return;
                }
            },
            /*选择司机*/
            changeDriver(row){
                if(row != null){
                    this.dialogDriver = false;
                    this.$set(this.scheduleForm,"driverId",row.driverId);
                    this.$set(this.scheduleForm,"driverName",row.name +' '+row.phone);
                }
            },

            openVehicle(){
                if(this.scheduleForm.organizationId) {
                    this.listUrl = "core/vehicleschedule/vehicleList";
                    this.searchParam.companyId=this.scheduleForm.organizationId;
                    this.searchParam.scheduleType = this.scheduleForm.scheduleType;
                    this.getList();
                    this.dialogVehicle = true;
                }else{
                    this.$message.error("订单信息有误!");
                    return;
                }
            },
            changeVehicle(row) {
                if(row != null){
                    this.dialogVehicle = false;
                    this.$set(this.scheduleForm,"vehicleId",row.id);
                    this.$set(this.scheduleForm,"plate",row.plate);
                    if(row.driverId){
                        this.disableSearchDrive = true;
                        this.disableIfCallDriver = true;
                        this.ifCallDriver=0;
                        this.$set(this.scheduleForm,"driverId",row.driverId);
                        this.$set(this.scheduleForm,"driverName",row.driverName+' '+row.driverPhone);
                    }else{
                        this.$set(this.scheduleForm,"driverId",'');
                        this.$set(this.scheduleForm,"driverName",'');
                        this.disableSearchDrive = false;
                        this.disableIfCallDriver = false;
                    }
                }
            },
            changeIfCallVehicle(){
                if(this.ifCallVehicle==1){
                    this.disableIfCallDriver = false;
                    this.disableSearchDrive = false;
                    this.$set(this.scheduleForm,"vehicleId",'');
                    this.$set(this.scheduleForm,"plate","");
                }else if(this.ifCallVehicle==0){
                    this.$set(this.scheduleForm,"callVehicle","");
                }

            },
            changeIfCallDriver(){
                if(this.ifCallDriver==1){
                    this.$set(this.scheduleForm,"driverId",'');
                    this.$set(this.scheduleForm,"driverName","");
                }else if(this.ifCallDriver==0){
                    this.$set(this.scheduleForm,"callDriver","");
                }

            },
            submitForm(schedultForm) {
                var $this = this;
                debugger
                $this.$refs[schedultForm].validate((valid) => {
                    if (valid) {
                        /*if($this.scheduleForm.vehicleId|| $this.scheduleForm.callVehicle){*/
                        let param={
                          id:$this.scheduleForm.id,
                          driverId:$this.scheduleForm.driverId,
                          vehicleId:$this.scheduleForm.vehicleId,
                            callVehicle:$this.scheduleForm.callVehicle,
                            callDriver:$this.scheduleForm.callDriver,
                            ifCallVehicle:$this.ifCallVehicle,
                            ifCallDriver:$this.ifCallDriver,
                            remake:$this.scheduleForm.remake,
                            scheduleType:$this.scheduleForm.scheduleType
                        };
                        if(param.ifCallDriver!=1&&(param.driverId==""||param.driverId==null)){
                            param.ifCallDriver=null;
                            console.log(param.ifCallDriver);
                        }
                        if (param.ifCallVehicle!=1&&(param.vehicleId==""||param.vehicleId==null)){

                            param.ifCallVehicle=null;
                            console.log(param.ifCallVehicle);
                        }
                        if(param.scheduleType==1){
                            param.ifCallDriver=null;
                            param.driverId=null;
                        }
                        var url = "/core/vehicleschedule/schedule";
                        ajax.post(url, param).then(
                            res => {
                                if(res.status == 0){
                                    $this.showMessage("调度成功","success");
                                    $this.close();
                                }else {
                                    $this.$message.error(res.message);
                                }
                            }
                        )
                        /*}else{
                            $this.$message.error("请重新选择则车辆")
                            return;
                        }*/
                    } else {
                        return false;
                    }
                });
            },
        }

    }
</script>
