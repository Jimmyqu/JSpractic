<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">采购计划编号</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入采购计划编号" clearable v-model="searchParam.planNumber"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">计划采购车型</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入计划采购车型" clearable
                                  v-model="searchParam.vehicleModelInfoName"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="planStatus" multiple collapseTags placeholder="全部" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="进行中" value="40"></el-option>
                            <el-option label="完成" value="50"></el-option>
                            <el-option label="取消" value="60"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">计划交车日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="deliveryDate"
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
                    <label class="control-label">项目合同编号</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入项目合同编号" clearable v-model="searchParam.contractNumber"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务城市</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入服务城市" clearable v-model="searchParam.cityName"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeArrayItem"></tree-select>
                        <el-checkbox v-model="check" @change="includeChildrenCheck" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>
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
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                            v-show="showEditBtn && (scope.row.planStatus==10 || scope.row.planStatus == '30')"
                            @click="edit(scope.row.id)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button
                            v-show="showApprovalBtn && (scope.row.planStatus==10)"
                            @click="submitApproval(scope.row)" type="text" size="small">
                            提交
                        </el-button>

                    </template>
                </el-table-column>
                <el-table-column prop="planNumber" sortable label="采购计划编号" min-width="200">
                    <template slot-scope="{ row, column, $index }">
                        <a size="mini" @click="detail(row)">{{row.planNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="contractNumber" sortable label="项目合同编号" min-width="200"></el-table-column>
                <el-table-column prop="customerType" sortable label="客户类型" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="enterpriseName" sortable label="服务客户" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="cityName" sortable label="服务城市" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="计划采购车型" show-overflow-tooltip
                                 min-width="200"></el-table-column>
                <el-table-column prop="newOrOldCar" sortable label="车辆新旧" min-width="100"></el-table-column>
                <el-table-column prop="carAge" sortable label="车龄（月）" min-width="100"></el-table-column>
                <el-table-column prop="carColor" sortable label="颜色" min-width="80"></el-table-column>
                <el-table-column prop="deliveryDate" sortable label="计划交车日期" min-width="120"></el-table-column>
                <el-table-column prop="needPurchaseQuantity" sortable label="计划采购数量" min-width="120"></el-table-column>
                <el-table-column prop="hadPurchaseQuantity" sortable label="已采购车台数" min-width="120"></el-table-column>
                <el-table-column prop="planStatusText" sortable label="状态" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="organizationName" sortable label="申请组织" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column prop="creater" sortable label="申请人" show-overflow-tooltip
                                 min-width="100"></el-table-column>
                <el-table-column prop="createTime" sortable label="申请时间" show-overflow-tooltip
                                 min-width="140"></el-table-column>
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
        name: 'vehiclePurchasePlan',
        mixins: [tool],
        components: {TreeSelect, ConfirmForm},
        data() {
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("purchasePlan/add"),
                showExportBtn: this.getCurrentUserAuthority("purchasePlan/export"),
                showEditBtn: this.getCurrentUserAuthority("purchasePlan/edit"),
                showApprovalBtn: this.getCurrentUserAuthority("purchasePlan/approve"),
                searchParam: {},
                listUrl: "core/purchasePlan/list",
                deliveryDate: "",
                organization:[],
                planStatus:[],
                check:false
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
                if(this.deliveryDate){
                    params.deliveryDateStart = this.deliveryDate[0];
                    params.deliveryDateEnd = this.deliveryDate[1];
                    this.searchParam.deliveryDateStart = '';
                    this.searchParam.deliveryDateEnd = '';
                }else{
                    params.deliveryDateStart = this.deliveryDate[0];
                    params.deliveryDateEnd = this.deliveryDate[1];
                    this.searchParam.deliveryDateStart = '';
                    this.searchParam.deliveryDateEnd = '';
                }

                if(this.planStatus && this.planStatus.length>0){
                    params.planStatus = this.planStatus.join(',');
                    this.searchParam.planStatus = this.planStatus.join(',');
                }else{
                    params.planStatus = '';
                    this.searchParam.planStatus = '';
                }
            },
            //重置筛选
            resetList() {
                this.searchParam = {};
                this.$set(this.searchParam,'includeChildren',0);
                this.check = false;
                this.planStatus=[];
                this.deliveryDate = "";
                this.organization = [];
                this.handleCurrentChange(1);
            },
            detail(row) {
                this.$router.push({path: "/tgpt/vehicle/purchasePlan/detail/" + row.id});
            },
            exportData() {
                location.href = this.exportUrl("core/purchasePlan/export?" + $.param(this.searchParam));
            },
            includeChildrenCheck(check){
                this.check = check;
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
            changeArrayItem(data) {
                if (this.organization && this.organization.length>0){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.check = false;
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'includeChildren',0)
                }
            },
            //更新选择的组织
            /*updateData(data) {
                if (data.id) {
                    this.$set(this.searchParam, "originateName", data.name);
                    this.$set(this.searchParam, "originateId", data.id);
                    this.$refs.treeSelect.handleClose();
                }
            },*/
            submitApproval(row) {
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(row.id, 'CLCGJH').then((message) => {
                        $this.getList();
                        if (message.status == 0) {
                            $this.showMessage(message.message, "success");
                        } else {
                            $this.showMessage(message.message, "error");
                        }
                    });
                }).catch(() => {
                });
            },
        }

    }
</script>

