<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">维保单号</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.maintenanceNo" clearable placeholder="请输入修理单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehiclePlate" clearable placeholder="请输入车辆"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">维修厂</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.repairerName" clearable placeholder="请输入维修厂"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleModel" clearable placeholder="请输入车型"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.billStatus" placeholder="请选择" clearable>
                                <el-option
                                    v-for="(value, key) in billStatusMap"
                                    :key="key"
                                    :label="value"
                                    :value="key"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">维修时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="arriveRepairTime"
                            @change="arriveRepairTimeChange"
                            clearable
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning"  size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
                <el-button type="small" @click="resetList();" size="mini">重置</el-button>
                <el-button  v-show="showExportBtn" size="mini" @click="exportData()">导出</el-button>
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
            <template>
                <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%">
                    <el-table-column fixed label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.billStatus == 10 || scope.row.billStatus == 30" v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button v-if="scope.row.billStatus == 10 || scope.row.billStatus == 30" v-show="showApproveBtn" @click="submitApprove(scope.row.id,scope.row.totalCost)" type="text" size="small">提交</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="maintenanceNo" label="维保单号" min-width="200" sortable fixed>
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row.id)">
                                {{scope.row.maintenanceNo}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="维保类型" min-width="100" sortable></el-table-column>
                    <el-table-column prop="vehiclePlate" label="车辆" min-width="100" sortable></el-table-column>
                    <el-table-column prop="vehicleModel" label="车型" min-width="120" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="driverName" label="驾驶员" min-width="100" sortable></el-table-column>
                    <el-table-column prop="repairerName" label="维修厂" min-width="100" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repairMileage" label="送修公里数" min-width="100" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="nuclearPriceTime" label="维修时间" min-width="140" sortable></el-table-column>
                    <el-table-column prop="totalCost" label="报价总额（元）" min-width="120" sortable></el-table-column>
                    <el-table-column prop="orgName" label="服务组织" min-width="100" sortable></el-table-column>
                    <el-table-column prop="billStatusText" label="状态" min-width="100" sortable show-overflow-tooltip></el-table-column>
                </el-table>
            </template>

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import {startProcessAsync} from '@/utils/index'


    export default {
        name: 'trafficMaintenanceBill',
        mixins: [tool],
        data(){
            return {
                arriveRepairTime:[],
                showSearch : false,
                showAddBtn:this.getCurrentUserAuthority("maintenanceBill/add"),
                showEditBtn:this.getCurrentUserAuthority("maintenanceBill/edit"),
                showExportBtn:this.getCurrentUserAuthority("maintenanceBill/export"),
                showNuclearPriceBtn:this.getCurrentUserAuthority("maintenanceBill/nuclearPrice"),
                showApproveBtn:this.getCurrentUserAuthority("maintenanceBill/approve"),
                showDetailBtn : true,
                listUrl:"core/maintenanceBill/list",
                billStatusMap:[],

            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted: function (){
            var billStatus = this.$route.query.billStatus;
            if(billStatus){
                this.searchParam.billStatus = billStatus;
            }
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.searchParam.arriveRepairTimeStart = startTime;
                this.searchParam.arriveRepairTimeEnd = endTime;
            }
            this.arriveRepairTime.push(startTime);
            this.arriveRepairTime.push(endTime);
            this.searchParam = Object.assign({},this.searchParam);
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getBillStatusList();
        },
        methods: {
            getBillStatusList(){
                ajax.get('/core/maintenanceBill/getBillStatusEnum/').then(result => {
                    if(result.status == 0){
                        this.billStatusMap = result.data;
                    }
                });
            },
            arriveRepairTimeChange() {
                if(this.arriveRepairTime && this.arriveRepairTime.length>0){
                    let createDate = this.arriveRepairTime;
                    this.searchParam.arriveRepairTimeStart = createDate[0];
                    this.searchParam.arriveRepairTimeEnd = createDate[1];
                }else{
                    this.searchParam.arriveRepairTimeStart="";
                    this.searchParam.arriveRepairTimeEnd="";
                }
            },
            submitApprove(id,totalCost){ //提交审批
                this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    startProcessAsync(id,'WXBYD',{'totalPrice':totalCost}).then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            exportData () {
                window.location = this.exportUrl("core/maintenanceBill/export?" + $.param(this.searchParam));
            },
            resetList(){
                this.searchParam = {};
                this.arriveRepairTime = [];
                this.getList();
            },
            detail(id){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+id});
                }else{
                    this.$router.push({path:url+"/detail/"+id});
                }
            }
        }
    }
</script>

