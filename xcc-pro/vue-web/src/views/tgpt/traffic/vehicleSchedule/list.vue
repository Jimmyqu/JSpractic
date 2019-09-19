<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>

        <!--table页面-->
        <el-tabs v-model="searchParam.scheduleStatus" @tab-click="handleClick">
            <el-tab-pane label="全部" name=""></el-tab-pane>
            <el-tab-pane label="待调度" name="10"></el-tab-pane>
            <el-tab-pane label="待出车" name="20"></el-tab-pane>
            <el-tab-pane label="出车中" name="30"></el-tab-pane>
            <el-tab-pane label="待结算" name="60"></el-tab-pane>
            <el-tab-pane label="已完成" name="40"></el-tab-pane>
            <el-tab-pane label="已取消" name="50"></el-tab-pane>
        </el-tabs>

        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">调度单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNo" clearable  placeholder="请输入调度单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization" ></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable  placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable  placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车时间</label>
                    <div class="input-group">
                        <el-date-picker clearable v-model="useDate"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.user" clearable placeholder="请输入用车人"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable  placeholder="请输入车牌号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">驾驶员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" clearable  placeholder="请输入驾驶员"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">散租类型</label>
                    <div class="input-group">
                        <el-select v-model="scheduleType" clearable multiple collapse-tags placeholder="请选择散租类型">
                            <el-option label="散租自驾" value="1"></el-option>
                            <el-option label="散租配驾" value="2"></el-option>
                            <el-option label="替代车" value="3"></el-option>
                            <el-option label="公务车" value="4"></el-option>
                            <el-option label="代驾" value="5"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">挂靠情况</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.callSituation"  clearable placeholder="挂靠情况">
                            <el-option label="未挂靠" value="0"></el-option>
                            <el-option label="仅车辆挂靠" value="1"></el-option>
                            <el-option label="仅司机挂靠" value="2"></el-option>
                            <el-option label="车辆和司机挂靠" value="3"></el-option>
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">

                <el-button  v-show="addBtnShow" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="exportBtnShow" size="mini" @click="exportExcel()">导出</el-button>
            </div>
            <div class="pagination">
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
        <!-- 表格 table -->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column fixed label="操作" width="180">
                    <template slot-scope="scope">
                        <template v-if="scope.row.scheduleStatus=='待调度'">
                            <el-button @click.native.prevent="edit(scope.row.id)" type="text" v-if="editBtnShow" size="small">编辑</el-button>
                            <el-button @click.native.prevent="schedule(scope.row.id)" type="text" v-if="applyBtnShow" size="small">调度</el-button>
                            <el-button @click.native.prevent="cancel(scope.row.id)" type="text" v-if="completeBtnShow" size="small">取消</el-button>
                        </template>
                        <el-button @click="driveReturn(scope.row)" type="text" v-if="driveReturnBtnShow && (scope.row.scheduleStatus == '出车中')" size="small" >还车</el-button>
                        <el-button @click="settlement(scope.row)" type="text" v-if="driveSettlementShow && (scope.row.scheduleStatus == '待结算')" size="small" >结算</el-button>
                        <el-button style="margin-left: 0;"  @click="driveOut(scope.row)" type="text" v-if="driveOutBtnShow && (scope.row.scheduleStatus == '待出车')" size="small" >出车</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="orderNo" sortable label="调度单号" min-width="200">
                    <template slot-scope="scope">
                        <!--<template v-if="detailBtnShow">-->
                        <a size="mini" @click="toDetail(scope.row.id)">{{scope.row.orderNo}}</a>
                        <!--</template>
                        <template v-else>{{scope.row.code}}</template>-->
                    </template>
                </el-table-column>
                <el-table-column  prop="customerType" sortable label="客户类型" min-width="120"></el-table-column>
                <el-table-column  prop="enterpriseName" sortable label="服务客户" min-width="120"></el-table-column>
                <el-table-column  prop="scheduleTypeText" sortable label="散租类型" min-width="150"></el-table-column>
                <el-table-column  prop="contractNo" sortable label="合同编号" show-overflow-tooltip min-width="220"></el-table-column>
                <el-table-column  prop="useTime" sortable label="用车时间" min-width="150"></el-table-column>
                <el-table-column  prop="user" sortable label="用车人" min-width="150"></el-table-column>
                <el-table-column  prop="orderAmount" sortable label="订单金额(元)" min-width="150"></el-table-column>
                <el-table-column  prop="userNum" sortable label="用车人数" min-width="100"></el-table-column>
                <el-table-column  prop="reason" sortable label="用车事由" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="depAddress" sortable label="出发地址" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column  prop="arrAddress" sortable label="抵达地址" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column  prop="ifCallVehicleText" sortable label="是否为挂靠车辆" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="plate" sortable label="车辆" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="ifCallDriverText" sortable label="是否为挂靠司机" min-width="120"></el-table-column>
                <el-table-column  prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>
                <el-table-column  prop="isRecordOrderText" sortable label="是否为补录订单" min-width="120"></el-table-column>
                <el-table-column  prop="scheduleStatus" sortable label="状态" min-width="120"></el-table-column>
            </el-table>

        </div>
        <!-- <ConfirmForm ref="accident" @load="getList"></ConfirmForm>-->

        <el-dialog
            title="出车时间"
            :visible.sync="dialogVisibleOut" @close="dialogClose()"
            width="30%">
            <el-form :model="dialogOutForm" ref="dialogOutForm" :rules="rules" >
                <el-form-item label="出车时间" prop="depTime" >
                    <el-date-picker
                        v-model="dialogOutForm.depTime"
                        type="datetime"
                        placeholder="日期"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="出车里程"  v-if="this.disableMileage==true" prop="depMile">
                    <el-input clearable maxlength="50" v-model="dialogOutForm.depMile"  type="number"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClose()">取 消</el-button>
                <el-button type="primary" @click="submitdialogOutForm('dialogOutForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="还车"
            :visible.sync="dialogVisibleReturn"
            width="70%" @close="dialogClose()">
            <el-form :model="dialogForm" ref="dialogForm" :rules="rules1" label-width="100px">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="还车信息" name="1" >
                        <div class="flex-panel">
                            <el-form-item label="还车时间" prop="arrTime" >
                                <el-date-picker
                                    v-model="dialogForm.arrTime"
                                    type="datetime"
                                    placeholder="日期"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="yyyy-MM-dd HH:mm">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="还车里程" prop="arrMile" v-if="this.disableMileage==true">
                                <el-input clearable maxlength="50" v-model="dialogForm.arrMile" type="number"></el-input>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="费用信息" name="2" >
                        <div class="flex-panel">
                            <el-form-item label="总费用" prop="totalMoney">
                                <el-input v-model="dialogForm.totalMoney"  clearable  placeholder="请输入总费用" readonly="">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="租金" prop="rentMoney">
                                <money-input v-model="dialogForm.rentMoney"  clearable  placeholder="请输入租金" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="路桥费" prop="tollCharge">
                                <money-input v-model="dialogForm.tollCharge"  clearable  placeholder="请输入路桥费" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="停车费" prop="parkingFee">
                                <money-input v-model="dialogForm.parkingFee"  clearable  placeholder="请输入停车费" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="加油费" prop="oilFee">
                                <money-input v-model="dialogForm.oilFee" clearable  placeholder="请输入加油费" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="超时费" prop="outtimeFee">
                                <money-input v-model="dialogForm.outtimeFee"  clearable  placeholder="请输入超时费" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="超公里费" prop="outmileFee">
                                <money-input v-model="dialogForm.outmileFee"  clearable  placeholder="请输入超公里费" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="其他费用" prop="otherFee">
                                <money-input v-model="dialogForm.otherFee"  clearable  placeholder="请输入其他费用" unit="元" @input="moneyChange()"></money-input>
                            </el-form-item>
                            <el-form-item label="其他费用说明" prop="otherFeeRemark">
                                <el-input clearable maxlength="50" v-model="dialogForm.otherFeeRemark"  placeholder="请输入其他费用说明" ></el-input>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClose()">取 消</el-button>
                <el-button type="primary" @click="submitdialogForm('dialogForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    /* import ConfirmForm from '@/views/tgpt/traffic/accident/edit'*/
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: 'trafficVehicleSchedule',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            return {
                showSearch:false,
                addBtnShow:this.getCurrentUserAuthority("vehicleschedule/add"),
                exportBtnShow:this.getCurrentUserAuthority("vehicleschedule/export"),
                /*detailBtnShow:getCurrentUserAuthority("projectterms/detail"),*/
                editBtnShow:this.getCurrentUserAuthority("vehicleschedule/edit"),
                applyBtnShow:this.getCurrentUserAuthority("vehicleschedule/schedule"),
                completeBtnShow:this.getCurrentUserAuthority("vehicleschedule/cancel"),
                driveOutBtnShow:this.getCurrentUserAuthority("vehicleschedule/driveOut"),
                driveReturnBtnShow:this.getCurrentUserAuthority("vehicleschedule/driveReturn"),
                driveSettlementShow: this.getCurrentUserAuthority("vehicleschedule/driveSettlement"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"core/vehicleschedule/list",
                companyIds:"",
                useDate:[],
                scheduleType:[],
                dialogVisibleOut:false,
                dialogVisibleReturn:false,
                dialogForm:{},
                dialogOutForm:{},
                disableMileage:true,
                rules:{
                    depTime:{required: true, message: '请选择出车时间', trigger: 'change'},
                    depMile:{required: true, message: '请选择出车里程', trigger: 'change'}
                },
                rules1:{
                    arrTime:{required: true, message: '请选择还车时间', trigger: 'change'},
                    arrMile:{required: true, message: '请选择还车里程', trigger: 'change'},
                },
                searchParam:{
                    scheduleStatus: "",
                    callSituation:''
                },
                activeNames: ['1','2','3','4','5'],
                statusText:'',
                arrDisabledDate:{
                    disabledDate:(e)=>{
                        let time = new Date(this.dialogForm.checkDepTime.replace(/-/g,"/"));
                        if(e.getTime() + 24*60*60*1000 - 1 < time.getTime()){
                            return true;
                        }
                    }
                }
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                    this.searchParam.organizationId = this.companyIds[0];
                }else{
                    params.organizationId = '';
                    this.searchParam.organizationId = '';
                }
                var useDate = this.useDate;
                if(useDate!=null && useDate.length>1){
                    params.startUseTime = useDate[0] + ' 00:00:00';
                    params.endUseTime = useDate[1] + ' 23:59:59';
                    this.searchParam.startUseTime = useDate[0] + ' 00:00:00';
                    this.searchParam.endUseTime = useDate[1] + ' 23:59:59';
                }else{
                    params.startUseTime = '';
                    params.endUseTime ='';
                    this.searchParam.startUseTime = '';
                    this.searchParam.endUseTime ='';
                }
                if(this.scheduleType && this.scheduleType.length>0){
                    params.scheduleType=this.scheduleType.join(',');
                    this.searchParam.scheduleType=this.scheduleType.join(',');
                }else{
                    params.scheduleType='';
                    this.searchParam.scheduleType='';
                }
            },
            numberFormat(number){
                return number_format(number, 2, '.', ',');
            },
            add(){
                this.$router.push({path:"/tgpt/traffic/vehicleSchedule/form"});
            },
            edit(id){
                this.$router.push({path:"/tgpt/traffic/vehicleSchedule/form",query:{id:id}});
            },
            cancel(id){
                var $this=this;
                $this.$confirm('你确定要取消订单吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("core/vehicleschedule/cancel/"+id).then(res => {
                        if(res.status==0){
                            $this.showMessage("取消成功","success");
                            $this.getList();
                        }else{
                            console.log("no approvalStatusList data!");
                        }
                    });
                });
            },
            schedule(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/schedule",query:{id:id}});
            },
            toDetail(id){
                if(~this.$route.fullPath.indexOf("/detail/")){
                    return;
                }
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detail/"+id});
            },
            driveOut(row){
                if(this.$refs.dialogOutForm){
                    this.$nextTick(_ =>{
                        this.$refs.dialogOutForm.clearValidate();
                    })
                }
                this.dialogOutForm.id=row.id;
                this.dialogOutForm.plate=row.plate;
                this.dialogOutForm.driverName=row.driverName;
                this.dialogOutForm.driverId = row.driverId;
                if (this.dialogOutForm.plate==null){
                    this.disableMileage=false;
                }
                this.dialogVisibleOut =true;
            },
            driveReturn(row){
                if(this.$refs.dialogForm){
                    this.$nextTick(_ =>{
                        this.$refs.dialogForm.clearValidate();
                    })
                }
                this.dialogForm.id=row.id;
                this.dialogForm.plate=row.plate;
                this.dialogForm.checkDepTime = row.depTime;
                this.dialogForm.driverName=row.driverName;
                this.dialogForm.driverId = row.driverId;
                if (this.dialogForm.plate==null){
                    this.disableMileage=false;
                }
                this.dialogVisibleReturn =true;
            },

            /*计算服务总金额*/
            moneyChange(){
                let totalMoney = 0;
                if(this.dialogForm.rentMoney){
                    totalMoney = totalMoney+  Number(this.dialogForm.rentMoney)
                }
                if(this.dialogForm.tollCharge){
                    totalMoney = totalMoney + Number(this.dialogForm.tollCharge)
                }
                if(this.dialogForm.parkingFee){
                    totalMoney = totalMoney+ Number(this.dialogForm.parkingFee)
                }
                if(this.dialogForm.oilFee){
                    totalMoney = totalMoney+ Number(this.dialogForm.oilFee);
                }
                if(this.dialogForm.outtimeFee){
                    totalMoney = totalMoney+ Number(this.dialogForm.outtimeFee);
                }
                if(this.dialogForm.outmileFee){
                    totalMoney = totalMoney+ Number(this.dialogForm.outmileFee);
                }
                if(this.dialogForm.otherFee){
                    totalMoney = totalMoney+Number(this.dialogForm.otherFee);
                }
                if(totalMoney){
                    this.$set(this.dialogForm , 'totalMoney',totalMoney);
                }
            },

            /*结算*/
            settlement(row){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/settlement",query:{id:row.id}});
            },

            dialogClose(){
                this.$set(this.dialogForm,"arrTime","");
                this.$set(this.dialogOutForm,"depTime","");
                this.$set(this.dialogForm,"arrMile","");
                this.$set(this.dialogOutForm,"depMile","");
                this.dialogVisibleOut =false;
                this.dialogVisibleReturn =false;
                this.disableMileage=true;
            },
            exportExcel(){
                window.location = this.exportUrl("core/vehicleschedule/export?" + $.param(this.searchParam));
            },
            getBillStatusList(){
                var $this=this;
                ajax.get("core/vehicleaccident/getbillstatus").then(res => {
                    if(res.status==0){
                        $this.billStatusList = res.data;
                    }else{
                        console.log("no approvalStatusList data!");
                    }
                });
            },
            resetList(){
                this.searchParam={scheduleStatus: this.searchParam.scheduleStatus};
                this.$set(this.searchParam,'organCascade',false)
                this.companyIds=[];
                this.scheduleType=[];
                this.useDate=[];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.organizationId=this.companyIds[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',false)
                }
            },

            /*table选择*/
            handleClick(){
                this.getList();
            },


            submitdialogForm(dialogForm) {
                console.log(this.dialogOutForm);
                var $this = this;
                $this.$refs[dialogForm].validate((valid) => {
                    if (valid) {
                        var url = "/core/vehicleschedule/outAndReturn";
                        ajax.post(url, $this.dialogForm).then(res => {
                                debugger
                                if(res.status == 0){
                                    $this.showMessage("操作成功","success");
                                    $this.dialogVisibleOut = false;
                                    $this.dialogVisibleReturn = false;
                                    $this.dialogClose();
                                    $this.getList();
                                }else {
                                    $this.$message.error(res.message);
                                }
                            }
                        )

                    }else {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }


                });
            },
            submitdialogOutForm(dialogOutForm) {
                console.log(this.dialogOutForm);
                var $this = this;
                $this.$refs[dialogOutForm].validate((valid) => {
                    if (valid) {
                        var url = "/core/vehicleschedule/outAndReturn";
                        ajax.post(url, $this.dialogOutForm).then(res => {
                                debugger
                                if(res.status == 0){
                                    $this.showMessage("操作成功","success");
                                    $this.dialogVisibleOut = false;
                                    $this.dialogVisibleReturn = false;
                                    $this.dialogClose();
                                    $this.getList();
                                }else {
                                    $this.$message.error(res.message);
                                }
                            }
                        )

                    }else {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }


                });
            }
        }
    }
</script>

