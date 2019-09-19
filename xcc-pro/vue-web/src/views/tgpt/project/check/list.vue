<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
                        <!--<el-date-picker-->
                        <!--v-model="carUseMonth"-->
                        <!--type="month"-->
                        <!--value-format="yyyy-MM"-->
                        <!--placeholder="选择月">-->
                        <!--</el-date-picker>-->
                        <el-date-picker
                            v-model="carUseMonth"
                            type="monthrange"
                            range-separator="至"
                            value-format="yyyy-MM"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label">项目订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNumber" clearable placeholder="请输入项目订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.projectVehicleSettlementNo" clearable
                                  placeholder="请输入用车单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算状态</label>
                    <div class="input-group">
                        <el-select placeholder="全部" clearable multiple collapse-tags v-model="settlementStatus">
                            <el-option label="未结算" value="1"></el-option>
                            <el-option label="已结算" value="2"></el-option>
                            <el-option label="作废" value="3"></el-option>
                            <el-option label="结算中" value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" clearable placeholder="请输入司机姓名"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择结算组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"
                                     @change="changeArrayItem"></tree-select>
                        <el-checkbox v-model="check"  @change="includeChildrenCheck" :disabled="!searchParam.organizationId">子组织
                        </el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>

        <div class="tool-box">
            <div class="operation">

                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>

                <el-button  v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>
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
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed label="操作" min-width="100">
                    <template slot-scope="{ row, column, $index }">
                        <el-button
                            v-show="showEditBtn && (row.settlementStatus == '未结算' || row.settlementStatus == '结算中')"
                            @click="edit(row.id)" type="text" size="small">结算
                        </el-button>
                        <el-button v-show="showEditBtn && (row.settlementStatus == '结算中')"
                                   @click="ok(row)" type="text" size="small">完成
                        </el-button>
                        <el-button v-show="showCancelBtn && row.settlementStatus == '未结算'"
                                   @click="cancelSettlement(row)" type="text" size="small">作废
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNumber" sortable label="项目订单号" min-width="200"></el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
                <el-table-column prop="projectVehicleSettlementNo" sortable label="用车单号" min-width="220">
                    <template slot-scope="{ row, column, $index }">
                        <a size="mini" @click="toDetail(row)">{{row.projectVehicleSettlementNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <el-table-column prop="settlementStatus" sortable label="结算状态" min-width="120"></el-table-column>
                <!--<el-table-column prop="startDate" sortable label="开始日期" min-width="120"></el-table-column>
                <el-table-column prop="endDate" sortable label="结束日期" min-width="120"></el-table-column>-->
                <el-table-column prop="carUseMonth" sortable label="月份" min-width="120"></el-table-column>
                <el-table-column prop="vehicleRental" sortable label="每月车辆租金(元)" min-width="140"></el-table-column>
                <el-table-column prop="oilFee" sortable label="每月车辆油费(元)" min-width="140"></el-table-column>
                <el-table-column prop="limitMileage" sortable label="每月限制里程(公里)" min-width="150"></el-table-column>
                <el-table-column prop="usedMileage" sortable label="本月使用里程(公里)" min-width="150"></el-table-column>
                <el-table-column prop="overMileageUnitPrice" sortable label="超里程单价(元)"
                                 min-width="140"></el-table-column>
                <el-table-column prop="overMileage" sortable label="超里程(公里)" min-width="140"></el-table-column>
                <el-table-column prop="overMileageFee" sortable label="超里程费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="etcFee" sortable label="ETC费(元)" min-width="140"></el-table-column>
                <el-table-column prop="payedOilFee" sortable label="本月支付油费(元)" min-width="140"></el-table-column>
                <el-table-column prop="totalAmount" sortable label="本月总费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="remark" sortable label="备注" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column prop="isNeedDriver" sortable label="是否需要司机" min-width="140">
                    <template slot-scope="{ row, column, $index }">
                        <span v-if="row.isNeedDriver == '是'">是</span>
                        <span v-if="row.isNeedDriver == '否' || !row.isNeedDriver">否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="driverName" sortable label="司机姓名" min-width="140"></el-table-column>
                <el-table-column prop="driverFee" sortable label="每月司机费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="driverCommunicationFee" sortable label="每月司机通讯费(元)"
                                 min-width="150"></el-table-column>
                <el-table-column prop="overworkFee" sortable label="司机加班费(元)" min-width="140"></el-table-column>
                <el-table-column prop="tollFee" sortable label="本月路桥费(元)" min-width="140"></el-table-column>
                <el-table-column prop="workHour" sortable label="司机每天工作时长(小时)" min-width="180"></el-table-column>
                <el-table-column prop="stayFee" sortable label="住宿费(元)" min-width="120"></el-table-column>
                <el-table-column prop="drivingFee" sortable label="代驾费(元)" min-width="120"></el-table-column>
                <el-table-column prop="mealFee" sortable label="餐费(元)" min-width="120"></el-table-column>
                <el-table-column prop="welfareFee" sortable label="福利费(元)" min-width="120"></el-table-column>
                <el-table-column prop="heatSubsidy" sortable label="高温补贴费(元)" min-width="140"></el-table-column>
                <el-table-column prop="birthdaySubsidy" sortable label="生日补贴费(元)" min-width="140"></el-table-column>
                <el-table-column prop="otherSubsidy" sortable label="其他费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="extraFee" sortable label="附加费(元)" min-width="120"></el-table-column>
                <el-table-column prop="settlementTime" sortable label="结算时间" min-width="140"></el-table-column>
                <el-table-column prop="settlementOperator" sortable label="结算操作人" show-overflow-tooltip
                                 min-width="120"></el-table-column>
                <el-table-column prop="companyId" sortable label="结算组织" show-overflow-tooltip
                                 min-width="120"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: 'projectCheck',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                showExportBtn: this.getCurrentUserAuthority("settlement/export"),
                showEditBtn: this.getCurrentUserAuthority("settlement/edit"),
                showCancelBtn: this.getCurrentUserAuthority("settlement/cancel"),
                organization: [],
                formData: {},
                listUrl: "core/settlement/list",
                startDate: [],
                endDate: [],
                carUseMonth: [],
                settlementStatus:[],
                check:false
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        mounted() {
            this.initDate();
            debugger
            var settlementStatus = this.$route.query.settlementStatus;
            var startDate = this.$route.query.startDate;
            var endDate = this.$route.query.endDate;
            if(settlementStatus){
                this.searchParam.settlementStatus=settlementStatus;
            }
            if(startDate && endDate){
                this.carUseMonth = [startDate,endDate];
            }
            this.searchParam = Object.assign({},this.searchParam);
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            initDate(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                var endDate = (year.toString() + "-" + month.toString());

                date.setMonth(date.getMonth() - 3);
                var startDate = date.format('yyyy-MM');

                this.carUseMonth = [startDate,endDate];
            },
            getListBefore(params) {
                if (this.startDate && this.startDate.length>0) {
                    params.startDateMin = this.startDate[0];
                    params.startDateMax = this.startDate[1];
                    this.searchParam.startDateMin = this.startDate[0];
                    this.searchParam.startDateMax = this.startDate[1];
                } else {
                    params.startDateMin = '';
                    params.startDateMax = '';
                    this.searchParam.startDateMin = '';
                    this.searchParam.startDateMax = '';
                }
                if (this.endDate && this.endDate.length>0) {
                    params.endDateMin = this.endDate[0];
                    params.endDateMax = this.endDate[1];
                    this.searchParam.endDateMin = this.endDate[0];
                    this.searchParam.endDateMax = this.endDate[1];
                } else {
                    params.endDateMin = '';
                    params.endDateMax = '';
                    this.searchParam.endDateMin = '';
                    this.searchParam.endDateMax = '';
                }
                //params.carUseMonth = this.carUseMonth
                if (this.carUseMonth && this.carUseMonth.length>0) {
                    params.startCarUseMonth = this.carUseMonth[0];
                    params.endCarUseMonth = this.carUseMonth[1];
                    this.searchParam.startCarUseMonth = this.carUseMonth[0];
                    this.searchParam.endCarUseMonth = this.carUseMonth[1];
                } else {
                    params.startCarUseMonth = '';
                    params.endCarUseMonth = '';
                    this.searchParam.startCarUseMonth = '';
                    this.searchParam.endCarUseMonth = '';
                }

                if(this.settlementStatus && this.settlementStatus.length>0){
                    params.settlementStatus=this.settlementStatus.join(',');
                    this.searchParam.settlementStatus=this.settlementStatus.join(',');
                }else{
                    params.settlementStatus='';
                    this.searchParam.settlementStatus='';
                }
                //params.startCarUseMonth = this.carUseMonth[0];
                //params.endCarUseMonth = this.carUseMonth[1];
            },
            exportData() {
                location.href = this.exportUrl("core/settlement/export?" + $.param(this.searchParam));
            },

            ok(row) {
                this.$confirm('是否确认完成？').then(_ => {
                    ajax.post("core/settlement/complete/" + row.id).then(res => {
                        if (this.checkResponse(res)) {
                            this.showMessage(res.message, 'success');
                            this.getList();
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },

            cancelSettlement(row) {
                this.$confirm('是否确认作废？').then(_ => {
                    ajax.post("core/settlement/cancel/" + row.id).then(res => {
                        if (this.checkResponse(res)) {
                            this.showMessage(res.message, 'success');
                            this.getList();
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },
            changeArrayItem(data) {
                if (this.organization && this.organization.length > 0) {
                    this.searchParam.organizationId = this.organization[0];
                } else {
                    this.searchParam.organizationId = '';
                    this.check = false;
                    this.$set(this.searchParam,'includeChildren',0);
                }
            },
            includeChildrenCheck(check) {
                this.check = check;
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
            resetList() {
                this.initDate();
                this.organization = [];
                this.searchParam = {};
                this.$set(this.searchParam,'includeChildren',0);
                this.check = false;
                this.startDate = [];
                this.endDate = [];
               // this.carUseMonth=[];
                this.settlementStatus=[];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

