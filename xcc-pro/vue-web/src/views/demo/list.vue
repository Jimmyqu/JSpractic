<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">ID</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.id" placeholder="id"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group">
                        <tree-select v-model="searchParam.organId" placeholder="请选择" type="one"
                                     url=""></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.createDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="getList()">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>

        <div class="table-box">
            <el-table border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn"
                                   type="text"
                                   @click="edit(scope.row.id)">修改
                        </el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="项目评审编号" prop="reviewNumber" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发起人" prop="originatorId" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发起部门" prop="originateDeptId" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="项目名称" prop="projectName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="申请日期" prop="applicationDate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="企业客户id" prop="enterpriseId" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="服务城市说明" prop="serviceCityExplain" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="交期" prop="deliveryDate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="合同期" prop="contractMonth" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="结算日" prop="settlementDate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="结算方式" prop="settlementModel" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="结算周期" prop="settlementCycle" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="付款方式" prop="paymentModel" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="押金" prop="deposit" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="保证金金额" prop="depositAmount" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="服务费" prop="serviceCost" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发票税率" prop="invoiceTaxRateDriver" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发票税率" prop="invoiceTaxRateVehicle" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="是否框架合同" prop="frameContract" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="招标供应商" prop="supplierId" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="招标编号" prop="tenderNumber" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="发布公布日期" prop="releaseDate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="标包划分" prop="standardPackageDivided" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="投标日期" prop="bidDate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="项目负责人" prop="projectLeaderId" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="项目类型" prop="projectType" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="招标信息链接" prop="bidInfoLink" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="项目介绍内容" prop="introduceContent" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="违约责任" prop="breakResponsibility" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="评分标准" prop="gradeStandard" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="其他要求" prop="otherRequirement" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="项目总金额" prop="totalAmount" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="是否需要询价" prop="inquiryRequire" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车辆采购确认" prop="purchaseConfirm" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车辆维保确认" prop="maintenanceConfirm" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="人力询价确认" prop="enquiryConfirm" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="评审状态" prop="reviewStatus" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="评审状态文本" prop="reviewStatusText" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="访问人" prop="accessUser" sortable show-overflow-tooltip></el-table-column>


            </el-table>
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
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name:'coreProjectReview',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: '/core/coreProjectReview/list'
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            getListBefore(params) {

            },
            exportExcel() {
                window.location = this.exportUrl("core/coreProjectReview/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

