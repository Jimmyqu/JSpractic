<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="originateIds" placeholder="请选择" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.originateId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">使用单编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.useNum" placeholder="请输入使用单编号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleUseStatus" placeholder="全部" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="审批通过" value="40"></el-option>
                            <el-option label="作废" value="50"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">申请日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
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
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">申请使用</el-button>
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
                        <el-button v-show="showEditBtn && scope.row.vehicleUseStatus==10 || scope.row.vehicleUseStatus==30" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showApprovalBtn && scope.row.vehicleUseStatus==10 || scope.row.vehicleUseStatus==30" type="text" @click="submitApproval(scope.row.id)">提交</el-button>
                        <el-button v-show="showObsoleteBtn && scope.row.vehicleUseStatus==10 || scope.row.vehicleUseStatus==30" type="text" @click="obsolete(scope.row.id)">作废</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="使用单编号" prop="useNum" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.useNum}}</a>
					</template>
				</el-table-column>
				<el-table-column min-width="140" label="使用车辆数量" prop="vehicleUseAmount" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="状态" prop="vehicleUseStatusText" sortable show-overflow-tooltip></el-table-column>
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
        name: 'vehicleUseApply',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                originateIds:"",
                createDate:"",
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("baseVehicleUseApply/add"),
                showEditBtn: this.getCurrentUserAuthority("baseVehicleUseApply/edit"),
                showApprovalBtn: this.getCurrentUserAuthority("baseVehicleUseApply/approval"),
                showObsoleteBtn: this.getCurrentUserAuthority("baseVehicleUseApply/obsolete"),
                showExportExcelBtn: this.getCurrentUserAuthority("baseVehicleUseApply/excel"),
                searchParam: {
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: 'base/baseVehicleUseApply'
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
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false)
                this.originateIds=[];
                this.createDate=[];
                this.handleCurrentChange(1);
            },
            getListBefore(params) {
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                if (this.originateIds) {
                    params.originateId = this.originateIds[0];
                }
            },
            changeOrganization(data){

                if(this.originateIds && this.originateIds.length==1){
                    this.$set(this.searchParam,'originateId',this.originateIds[0])
                }else {
                    this.$set(this.searchParam,'originateId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            submitApproval(id){
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'CLSYSQ').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            obsolete(id) {
                let $this = this;
                $this.$confirm('是否确定作废?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/baseVehicleUseApply/obsolete/"+id).then((message)=>{
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
                window.location = this.exportUrl("base/baseVehicleUseApply/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

