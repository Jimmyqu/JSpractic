<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="orgIds" placeholder="请选择" type="one" @change="changeOrgId"
                                     url="admin/organization/tree"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.orgId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vin" placeholder="车牌/车架号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.serviceName" placeholder="服务客户" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">购买日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            @change="chooseTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">发票抬头</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.invoiceTitle" placeholder="发票抬头" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">保险单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.policyNumber" placeholder="保险单号" clearable></el-input>
                    </div>
                </div>


            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="getThisList()">查询</el-button>
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
            <p class="summary">
                <span>汇总:</span>
                <span style="margin-left: 20px;">车辆总数: {{sumData.totalCar}}</span>
                <span style="margin-left: 20px;">商业险总费用: {{sumData.sumSy}}</span>
                <span style="margin-left: 20px;">交强险总费用: {{sumData.sumJq}}</span>
                <span style="margin-left: 20px;">保险总费用: {{sumData.total}}</span>
            </p>
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column prop="plate" sortable label="车牌" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toVehicleDetail(scope.row.vehicleRelationId)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="所属组织" prop="orgName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车架号" prop="vin" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="服务客户" prop="serviceName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="购买月份" prop="buyMonth" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="购买时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="发票抬头" prop="invoiceTitle" sortable show-overflow-tooltip></el-table-column>
                <el-table-column label="商业保险信息">
                    <el-table-column min-width="140" label="商业保险单号" prop="syPolicyNumber" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="商业险开始时间" prop="syInsuredDate" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="商业险结束时间" prop="syExpiryDate" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="商业险金额" prop="syInsuranceCost" sortable show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="交强险信息">
                    <el-table-column min-width="140" label="交强险保单号" prop="jqPolicyNumber" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="交强险开始时间" prop="jqInsuredDate" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="交强险结束时间" prop="jqExpiryDate" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="交强险金额" prop="jqInsuranceCost" sortable show-overflow-tooltip></el-table-column>
                </el-table-column>
				<el-table-column min-width="140" label="合计" prop="totalCost" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name:'vehicleInsuranceReport',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                orgIds:[],
                createDate:[],
                sumData:{},
                searchParam: {
                },
                showExportExcelBtn: this.getCurrentUserAuthority('vehicleInsuranceReport/exportExcel'),
                listUrl: '/report/vehicleInsurance/insuranceList'
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
            this.getSumData();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getSumData();
        },
        methods: {
            getListBefore(params) {

            },

            /*选择所属组织*/
            changeOrgId(){
                if(this.orgIds && this.orgIds.length > 0){
                    this.searchParam.orgId = this.orgIds[0];
                }else{
                    this.searchParam.orgId = '';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },

            chooseTime(){
                if(this.createDate.length > 0){
                    this.searchParam.startTime = this.createDate[0] + ' 00:00:00';
                    this.searchParam.endTime = this.createDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
            },

            getSumData(){
                const params = Object.assign({},this.searchParam);
                ajax.get('/report/vehicleInsurance/sumData' , params).then(
                    res => {
                        this.sumData = res;
                    }
                )
            },

            getThisList(){
                this.handleCurrentChange(1);
                this.getSumData();
            },

            resetList(){
                this.createDate = [];
                this.orgIds = [];
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',0);
                this.getList();
                this.getSumData();
            },

            exportExcel() {
                window.location = this.exportUrl("report/vehicleInsurance/excel?" + $.param(this.searchParam));
            },toVehicleDetail(id){
                let url="/tgpt/vehicle/vehicleInformation/detail/"+id;
                this.$router.push({path:url});
            },
        }
    }
</script>

