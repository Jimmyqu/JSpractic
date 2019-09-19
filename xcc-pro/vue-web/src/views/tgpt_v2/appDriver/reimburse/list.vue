<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.reimburseStatus" placeholder="请选择" clearable>
                            <el-option label="待处理" value="0"></el-option>
                            <el-option label="审批中" value="1"></el-option>
                            <el-option label="驳回" value="2"></el-option>
                            <el-option label="已完成" value="3"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">日期</label>
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
                    <label class="control-label">报销单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.reimburseNum" placeholder="请输入报销单号查询" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization" clearable></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌查询" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" placeholder="请输入司机姓名查询" clearable></el-input>
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
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn && (scope.row.reimburseStatus==0 || scope.row.reimburseStatus==2) " type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showEditBtn && scope.row.reimburseStatus==0" type="text" @click="submitApproval(scope.row.id)">提交</el-button>
                        <!--<template v-if="scope.row.reimburseStatus=='2'">
                            <el-button v-show="true" type="text" @click="fingApproval(scope.row.id)">查看驳回原因</el-button>
                        </template>-->
                        <template v-if="scope.row.reimburseStatus=='3'">
                            报销已完成
                        </template>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="报销单号" prop="id" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.reimburseNum}}</a>
					</template>
				</el-table-column>
				<el-table-column min-width="100" label="服务组织" prop="companyName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="车辆" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="司机姓名" prop="driverName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="提交时间" prop="submitTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="住宿费" prop="stayCost" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="过桥费" prop="bridgeCost" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="停车费" prop="parkCost" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="加油费" prop="oilCost" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="洗车费" prop="washCarCost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="总计费用" prop="totalCost" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="报销状态" prop="statusName" sortable show-overflow-tooltip></el-table-column>

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
        name: 'appDriverReimburse',
        mixins: [tool],
        components: { TreeSelect,ConfirmForm },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showAddBtn: this.getCurrentUserAuthority("appDriver/reimburse/add"),
                showEditBtn: this.getCurrentUserAuthority("appDriver/reimburse/edit"),
                showExportExcelBtn:  this.getCurrentUserAuthority("appDriver/reimburse/export"),
                listUrl: 'app/appDriverReimburse',
                createDate:"",
                companyIds:""
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
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }
            },
            exportExcel() {
                var params=this.searchParam;
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }
                window.location = this.exportUrl("app/appDriverReimburse/excel?" + $.param(params));
            },
            submitApproval(id){
                let $this = this;
                $this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'BXGL').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false)
                this.createDate=[];
                this.companyIds=[];
                this.handleCurrentChange(1);

            },
            changeOrganization(data){

                if(this.companyIds && this.companyIds.length==1){
                    this.$set(this.searchParam,'companyId',this.companyIds[0])
                }else {
                    this.$set(this.searchParam,'companyId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
        }
    }
</script>

