<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">月份</label>
                    <div class="input-group">
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
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.settlementNo" clearable
                                  placeholder="请输入用车单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"
                                     @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="check1" @change="includeOrganizationChildren" :disabled="!searchParam.organizationId">子组织
                        </el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结算组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="settlementOrganization" placeholder="请选择结算组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"
                                     @change="changeSettlementOrganization"></tree-select>
                        <el-checkbox v-model="check2" @change="includeSettlementOrganizationChildren" :disabled="!searchParam.settlementOrganizationId">子组织
                        </el-checkbox>
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
                            v-show="showEditBtn && (row.settlementStatus == 1 || row.settlementStatus == 4)"
                            @click="settle(row.id)" type="text" size="small">结算
                        </el-button>
                        <el-button v-show="showCompleteBtn && (row.settlementStatus == 4)"
                                   @click="ok(row)" type="text" size="small">完成
                        </el-button>
                        <el-button v-show="showCancelBtn && row.settlementStatus == 1"
                                   @click="cancelSettlement(row)" type="text" size="small">作废
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="settlementNo" sortable label="结算单号" min-width="220">
                    <template slot-scope="{ row, column, $index }">
                        <a size="mini" @click="toDetail(row)">{{row.settlementNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
                <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column prop="organizationName" sortable label="所属组织" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="settlementOrganizationName" sortable label="结算组织" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="settlementStatusText" sortable label="结算状态" min-width="120"></el-table-column>
                <el-table-column prop="month" sortable label="月份" min-width="120"></el-table-column>
                <el-table-column prop="totalCost" sortable label="本月总费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="vehicleTotalQuantity" sortable label="车辆总数" min-width="140"></el-table-column>
                <el-table-column prop="vehicleTotalCost" sortable label="每月车辆总租金(元)" min-width="150"></el-table-column>
                <el-table-column prop="driverTotalQuantity" sortable label="司机总数" min-width="150"></el-table-column>
                <el-table-column prop="driverTotalCost" sortable label="每月司机总费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="otherCost" sortable label="其他费用(元)" min-width="140"></el-table-column>
                <el-table-column prop="settlementTime" sortable label="结算时间" min-width="140"></el-table-column>
                <el-table-column prop="settlementOperator" sortable label="结算操作人" show-overflow-tooltip min-width="120"></el-table-column>
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
        name: 'serviceHostingSettlement',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                showExportBtn: this.getCurrentUserAuthority("serviceHostingSettlement/export"),
                showEditBtn: this.getCurrentUserAuthority("serviceHostingSettlement/settle"),
                showCompleteBtn: this.getCurrentUserAuthority("serviceHostingSettlement/complete"),
                showCancelBtn: this.getCurrentUserAuthority("serviceHostingSettlement/cancel"),
                organization: [],
                settlementOrganization:[],
                formData: {},
                listUrl: "core/serviceHostingSettlement/list",
                startDate: [],
                endDate: [],
                carUseMonth: [],
                settlementStatus:[],
                check1: false,
                check2: false,
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        mounted() {
            this.initDate();
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
                if (this.carUseMonth && this.carUseMonth.length>0) {
                    params.startMonth = this.carUseMonth[0];
                    params.endMonth = this.carUseMonth[1];
                    this.searchParam.startMonth = this.carUseMonth[0];
                    this.searchParam.endMonth = this.carUseMonth[1];
                } else {
                    params.startMonth = '';
                    params.endMonth = '';
                    this.searchParam.startMonth = '';
                    this.searchParam.endMonth = '';
                }
                if(this.settlementStatus && this.settlementStatus.length>0){
                    params.settlementStatus=this.settlementStatus.join(',');
                    this.searchParam.settlementStatus=this.settlementStatus.join(',');
                }else{
                    params.settlementStatus='';
                    this.searchParam.settlementStatus='';
                }
            },
            exportData() {
                location.href = this.exportUrl("core/serviceHostingSettlement/export?" + $.param(this.searchParam));
            },

            ok(row) {
                this.$confirm('是否确认完成？').then(_ => {
                    ajax.post("core/serviceHostingSettlement/complete/" + row.id).then(res => {
                        if (this.checkResponse(res)) {
                            this.showMessage(res.message, 'success');
                            this.getList();
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },

            settle(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/settle",query:{id:id}});
            },
            cancelSettlement(row) {
                this.$confirm('是否确认作废？').then(_ => {
                    ajax.post("core/serviceHostingSettlement/cancel/" + row.id).then(res => {
                        if (this.checkResponse(res)) {
                            this.showMessage(res.message, 'success');
                            this.getList();
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },
            changeOrganization(data) {
                if (this.organization && this.organization.length > 0) {
                    this.searchParam.organizationId = this.organization[0];
                } else {
                    this.searchParam.organizationId = '';
                    this.check1 = false;
                    this.$set(this.searchParam,'organizationIncludeChildren',0)
                }
            },
            changeSettlementOrganization(data) {
                if (this.settlementOrganization && this.settlementOrganization.length > 0) {
                    this.searchParam.settlementOrganizationId = this.settlementOrganization[0];
                } else {
                    this.searchParam.settlementOrganizationId = '';
                    this.check2 = false;
                    this.$set(this.searchParam,'organizationIncludeChildren',0)
                }
            },
            includeOrganizationChildren(check){
                this.check1 = check;
                if(check==true){
                    this.searchParam.includeOrganizationChildren=true;
                }else{
                    this.searchParam.includeOrganizationChildren=false;
                }
            },
            includeSettlementOrganizationChildren(check){
                this.check2 = check;
                if(check==true){
                    this.searchParam.includeSettlementOrganizationChildren=true;
                }else{
                    this.searchParam.includeSettlementOrganizationChildren=false;
                }
            },
            resetList() {
                this.initDate();
                this.organization = [];
                this.settlementOrganization = [];
                this.searchParam = {};
                this.$set(this.searchParam,'includeOrganizationChildren',0);
                this.check1 = false;
                this.$set(this.searchParam,'includeSettlementOrganizationChildren',0);
                this.check2 = false;
                //this.carUseMonth=[];
                this.settlementStatus=[];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

