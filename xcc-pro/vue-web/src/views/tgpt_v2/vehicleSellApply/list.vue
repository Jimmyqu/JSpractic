<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择所属组织" type="one" clearable
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.originateId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">出售单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.sellNum" placeholder="请输入出售单编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleSellStatus" placeholder="全部" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option label="待提交审批" value="10"></el-option>
                           <!-- <el-option label="待审批" value="20"></el-option>-->
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="审批通过" value="40"></el-option>
                            <el-option label="作废" value="50"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd" clearable>
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">申请人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.creater" placeholder="请输入姓名" clearable></el-input>
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
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn && (scope.row.vehicleSellStatu=='待提交审批' || scope.row.vehicleSellStatu=='审批不通过') " type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showApprovalBtn && (scope.row.vehicleSellStatu=='待提交审批' || scope.row.vehicleSellStatu=='审批不通过')" type="text" @click="apply(scope.row)">提交</el-button>
                        <el-button v-show="showObsoleteBtn && (scope.row.vehicleSellStatu=='待提交审批' || scope.row.vehicleSellStatu=='审批不通过') " type="text" @click="obsolete(scope.row.id)">作废</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="出售单编号" prop="sellNum" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.sellNum}}</a>
					</template>
				</el-table-column>
				<el-table-column min-width="140" label="出售车辆数量" prop="vehicleSellNum" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="出售总金额(元）" prop="vehicleSellMoney" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="状态" prop="vehicleSellStatu" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="所属组织" prop="originateId" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="申请人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="申请时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'baseVehicleSellApply',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                organizationIds:[],
                originateId:[],
                contractDate:"",
                showEditBtn: this.getCurrentUserAuthority("baseVehicleSellApply/edit"),
                showAddBtn:this.getCurrentUserAuthority("baseVehicleSellApply/add"),
                showApprovalBtn: this.getCurrentUserAuthority("baseVehicleSellApply/approval"),
                showExportExcelBtn: this.getCurrentUserAuthority("baseVehicleSellApply/excel"),
                showObsoleteBtn: this.getCurrentUserAuthority("baseVehicleSellApply/obsolete"),
                listUrl: 'base/baseVehicleSellApply'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                if (this.organizationIds){
                    params.originateId = this.organizationIds[0];
                }
                if (this.contractDate) {
                    params.contractStartDate = this.contractDate[0];
                    params.contractEndDate = this.contractDate[1];
                }

            },
            resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false)
                this.organizationIds = [];
                this.contractDate = [];
                this.handleCurrentChange(1);

            },
            changeOrganization(data){

                if(this.organizationIds && this.organizationIds.length==1){
                    this.$set(this.searchParam,'originateId',this.organizationIds[0])
                }else {
                    this.$set(this.searchParam,'originateId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            apply(row) {
                this.$confirm('你确定要提交吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(row.id,'CLCSSQ').then((res)=> {
                        this.showMessage("提交审批成功", "success");
                        this.getList();
                    })

                });
            },
            obsolete(id) {
                let $this = this;
                $this.$confirm('是否确定作废?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/baseVehicleSellApply/obsolete/"+id).then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage("已作废！","success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            exportExcel() {
                var params= this.searchParam;
                if (this.organizationIds && this.organizationIds.length>=1){
                    params.originateId = this.organizationIds[0];
                }
                if (this.contractDate && this.contractDate.length>1) {
                    params.contractStartDate = this.contractDate[0];
                    params.contractEndDate = this.contractDate[1];
                }
                window.location = this.exportUrl("base/baseVehicleSellApply/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

