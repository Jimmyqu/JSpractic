<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="originateList" placeholder="请选择所属组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.originateId">子组织</el-checkbox>
                    </div>
                </div>
              <!-- <div class="form-group">
                    <label class="control-label">ID</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.id" placeholder="id"></el-input>
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">处置单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.disposalNum" placeholder="请输入处置单编号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleDisposalStatus" placeholder="全部" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="审批通过" value="40"></el-option>
                            <el-option label="已作废" value="50"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">申请日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createTime"
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
                        <el-input v-model="searchParam.creater" placeholder="请输入申请人" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">申请处置</el-button>
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
                        <el-button v-show="showEditBtn && scope.row.vehicleDisposalStatus=='待提交审批' || scope.row.vehicleDisposalStatus=='审批不通过'" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showApprovalBtn && scope.row.vehicleDisposalStatus=='待提交审批' || scope.row.vehicleDisposalStatus=='审批不通过'" type="text" @click="submitApproval(scope.row.id)">提交</el-button>
                        <el-button v-show="showObsoleteBtn && scope.row.vehicleDisposalStatus=='待提交审批' || scope.row.vehicleDisposalStatus=='审批不通过'" type="text" @click="obsolete(scope.row.id)">作废</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="处置单编号" prop="disposalNum" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.disposalNum}}</a>
					</template>
				</el-table-column>
				<el-table-column min-width="140" label="处置车辆数量" prop="vehicleDisposalAmount" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="状态" prop="vehicleDisposalStatus" sortable show-overflow-tooltip></el-table-column>
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
        name: 'baseVehicleDisposalApply',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showAddBtn: this.getCurrentUserAuthority("baseVehicleDisposalApply/add"),
                showEditBtn: this.getCurrentUserAuthority("baseVehicleDisposalApply/edit"),
                showApprovalBtn: this.getCurrentUserAuthority("baseVehicleDisposalApply/approval"),
                showObsoleteBtn: this.getCurrentUserAuthority("baseVehicleDisposalApply/obsolete"),
                showExportExcelBtn: this.getCurrentUserAuthority("baseVehicleDisposalApply/excel"),
                listUrl: 'base/baseVehicleDisposalApply',
                originateList:[],
                createTime: []
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
                if(this.createTime){
                    params.startTime = this.createTime[0];
                    params.endTime = this.createTime[1];
                }
            },
            //重置筛选
            resetList() {
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false)
                this.createTime = [];
                this.originateList = [];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.originateList && this.originateList.length==1){
                    this.searchParam.originateId=this.originateList[0];
                }else{
                    this.searchParam.originateId='';
                    this.$set(this.searchParam,'organCascade',false)
                }
            },
            obsolete(id) {
                let $this = this;
                $this.$confirm('是否确定作废?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/baseVehicleDisposalApply/obsolete/"+id).then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage("已作废！","success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            submitApproval(id){
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'CLCZSQ').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            exportExcel() {
                var params=this.searchParam;
                if(this.createTime){
                    params.startTime = this.createTime[0];
                    params.endTime = this.createTime[1];
                }
                debugger
                console.log(params);
                window.location = this.exportUrl("base/baseVehicleDisposalApply/excel?" + $.param(params));
            }
        }
    }
</script>

