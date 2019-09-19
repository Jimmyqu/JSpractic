<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">采购订单编号</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入采购订单编号" clearable v-model="searchParam.orderNumber"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">采购日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="purchaseDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供应商</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入供应商" clearable v-model="searchParam.supplier"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">采购方式</label>
                    <div class="input-group">
                        <el-select v-model="purchaseMethod" multiple collapseTags placeholder="全部" clearable>
                            <el-option label="新购" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="现有车辆安排" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.orderStatus" placeholder="全部" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="已完成" value="40"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">采购组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择组织" type="one"
                                     url="/admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
          </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.orderStatus == '10'||scope.row.orderStatus == '30'"
                                   v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">编辑
                        </el-button>
                        <el-button v-if="scope.row.orderStatus == '10'" v-show="showApprovalBtn"
                                   @click="approvalData(scope.row)" type="text" size="small">提交
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNumber" sortable label="采购订单编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="viewData(scope.row)">{{scope.row.orderNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseDate" sortable label="采购日期" min-width="100"></el-table-column>
                <el-table-column prop="supplier" sortable label="供应商" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="vehicleNum" sortable label="车台数" min-width="100"></el-table-column>
                <el-table-column prop="purchaseMethod" sortable label="采购方式" min-width="100"></el-table-column>
                <el-table-column prop="totalAmount" sortable label="总金额(元)" min-width="100"></el-table-column>
                <el-table-column prop="orderStatusText" sortable label="状态" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="creater" sortable label="采购员" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="organizationName" sortable label="采购组织" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" show-overflow-tooltip
                                 min-width="120"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehiclePurchaseOrder',
        mixins: [tool],
        components: {TreeSelect,ConfirmForm},
        data() {
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("purchaseOrder/insert"),
                showExportBtn: this.getCurrentUserAuthority("purchaseOrder/export"),
                showEditBtn: this.getCurrentUserAuthority("purchaseOrder/update"),
                showApprovalBtn: this.getCurrentUserAuthority("purchaseOrder/approve"),
                searchParam: {},
                listUrl: "core/purchaseOrder/list",
                purchaseDate: "",
                organizationIds:[],
                purchaseMethod:[]
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params){
                if (this.purchaseDate) {
                    params.purchaseDateStart = this.purchaseDate[0];
                    params.purchaseDateEnd = this.purchaseDate[1];
                    this.searchParam.purchaseDateStart = this.purchaseDate[0];
                    this.searchParam.purchaseDateEnd = this.purchaseDate[1];
                }else{
                    params.purchaseDateStart = '';
                    params.purchaseDateEnd = '';
                    this.searchParam.purchaseDateStart = '';
                    this.searchParam.purchaseDateEnd = '';
                }
                /*if (this.organizationIds && this.organizationIds.length>0) {
                    params.organizationId = this.organizationIds[0];
                    this.searchParam.organizationId = this.organizationIds[0];
                }else{
                    params.organizationId = '';
                    this.searchParam.organizationId = '';
                }*/
                if(this.purchaseMethod && this.purchaseMethod.length>0){
                    params.purchaseMethod = this.purchaseMethod.join(',');
                    this.searchParam.purchaseMethod = this.purchaseMethod.join(',');
                }else{
                    params.purchaseMethod = '';
                    this.searchParam.purchaseMethod = '';
                }
            },
            //重置筛选o
            resetList() {
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false);
                this.purchaseMethod=[];
                this.purchaseDate = "";
                this.organizationIds = [];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.searchParam.organizationId=this.organizationIds[0];
                }else{
                    this.searchParam.organizationId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            exportData() {
                location.href = this.exportUrl("core/purchaseOrder/export?" + $.param(this.searchParam));
            },
            viewData(row) {
                this.$router.push({path: "/tgpt/vehicle/purchaseOrder/detail/" + row.id});
            },
            approvalData(row) {
                var $this = this;
                this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(row.id, "CLCGDD").then((message) => {
                        this.getList();
                        if (message.status == 0) {
                            this.showMessage(message.message, "success");
                        } else {
                            this.showMessage(message.message, "error");
                        }
                    });
                })
                    .catch(_ => {
                        console.info("关闭");
                    });
            }
        }
    }
</script>

