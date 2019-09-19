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
                            <label class="control-label">用车人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.user}}&nbsp;{{scheduleForm.phone}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">同行人员</label>
                            <div class="input-group">
                                <span>{{scheduleForm.peerUser}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">座位数</label>
                            <div class="input-group">
                                <span>{{scheduleForm.seateNum}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车结束时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTimeEnd}}</span>
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
                            <label class="control-label">散租类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleTypeText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">备注</label>
                            <div class="input-group">
                                <span>{{scheduleForm.remark}}</span>
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
                    <div class="flex-panel">
                        <el-form-item label="调度类型" prop="orderType" v-if="false">
                            <el-select v-model="scheduleForm.orderType">
                                <el-option label="内部调度" :value="1"></el-option>
                                <el-option label="散租调度" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车辆" prop="plate" v-if="scheduleForm.orderType == 1">
                            <el-input readonly v-model="scheduleForm.plate" >
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openVehicle" ></el-button></template>
                            </el-input>
                        </el-form-item>
                        <!--配驾才显示司机-->
                        <el-form-item label="司机"  v-if="scheduleForm.scheduleType == 2">
                            <el-input readonly v-model="scheduleForm.driverName">
                            </el-input>
                        </el-form-item>

                        <!--<el-form-item label="租赁公司" prop="enterprise" v-if="scheduleForm.orderType == 2">
                            <el-select v-model="scheduleForm.enterprise" @change="rentCompanyChange">
                                <el-option
                                    v-for="item in rentCompanyList"
                                    :key="item.enterpriseId"
                                    :label="item.name"
                                    :value="item.enterpriseId">
                                </el-option>
                            </el-select>
                        </el-form-item>-->

                        <!--<el-form-item label="散租合同" prop="projectContractNo" v-if="scheduleForm.orderType == 2">
                            <el-input readonly v-model="scheduleForm.projectContractNo" >
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openContract" ></el-button></template>
                            </el-input>
                        </el-form-item>-->
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
                        <el-table-column prop="vehicleStatus" label="车辆状态" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.vehicleStatus == 2">待租</span>
                                <span v-if="scope.row.vehicleStatus == 3">已租</span>
                                <span v-if="scope.row.vehicleStatus == 4">待出车</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serviceStatus" label="服役状态" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.serviceStatus == 1">长租自驾</span>
                                <span v-if="scope.row.serviceStatus == 2">长租配驾</span>
                                <span v-if="scope.row.serviceStatus == 3">散租自驾</span>
                                <span v-if="scope.row.serviceStatus == 4">散租配驾</span>
                                <span v-if="scope.row.serviceStatus == 5">替代车</span>
                                <span v-if="scope.row.serviceStatus == 6">公务车</span>
                                <span v-if="scope.row.serviceStatus == 7">未服役</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serviceName" label="服务部门" min-width="100"></el-table-column>
                        <el-table-column prop="driverName" label="司机" min-width="100"></el-table-column>
                        <el-table-column prop="vehicleSource" label="车辆属性" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.vehicleSource == 1">自有</span>
                                <span v-if="scope.row.vehicleSource == 2">租赁</span>
                                <span v-if="scope.row.vehicleSource == 3">挂靠</span>
                                <span v-if="scope.row.vehicleSource == 4">个人</span>
                            </template>
                        </el-table-column>
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
                dialogContractNo: false,
                listUrl:"",
                rentCompanyList:[],
                contractId:'',
                rentCompanyName:'',
                enterpriseId:'',
                disableSearchDrive: true,
                rules: {
                    plate: [
                        { required: true, message: '请选择车辆', trigger: 'change' }
                    ],
                    projectContractNo:[
                        { required: true, message: '请选择散租合同', trigger: 'change' }
                    ],
                }
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
                    ajax.get('/core/clientVehicleSchedule/detail/' + this.$route.query.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                $this.scheduleForm = res.data.vehicleSchedule;
                            }
                        }
                    )
                }
            },



            /*获取车辆列表*/
            openVehicle(){
                if(this.scheduleForm.organizationId) {
                    this.listUrl = "core/clientVehicleSchedule/vehicleList";
                    this.searchParam = {
                        companyId: this.scheduleForm.organizationId,
                        scheduleType: this.scheduleForm.scheduleType,
                    }
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
                        this.$set(this.scheduleForm,"driverId",row.driverId);
                        this.$set(this.scheduleForm,"driverName",row.driverName+' '+row.driverPhone);
                    }else{
                        this.$set(this.scheduleForm,"driverId",'');
                        this.$set(this.scheduleForm,"driverName",'');
                        this.disableSearchDrive = false;
                    }
                }
            },
            submitForm(schedultForm) {
                var $this = this;
                $this.$refs[schedultForm].validate((valid) => {
                    if (valid) {
                        if($this.scheduleForm.vehicleId ){
                        let param={
                          id:$this.scheduleForm.id,
                          driverId:$this.scheduleForm.driverId,
                          vehicleId:$this.scheduleForm.vehicleId,
                            orderType:$this.scheduleForm.orderType,
                            projectContractId: $this.scheduleForm.projectContractId,
                            organizationId: $this.scheduleForm.organizationId,
                            rentCompanyName:this.rentCompanyName
                        };
                        var url = "/core/clientVehicleSchedule/schedule";
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
                        }else{
                            $this.$message.error("请重新选择则车辆")
                            return;
                        }
                    } else {
                        return false;
                    }
                });
            },
        }

    }
</script>
