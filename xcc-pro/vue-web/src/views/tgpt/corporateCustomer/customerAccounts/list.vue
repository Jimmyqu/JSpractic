<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">企业客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterprise" placeholder="请输入内容" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">单据编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" placeholder="请输入内容" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">单据类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.invoiceType" placeholder="不限" clearable>
                            <el-option v-for="item in invoiceTypeList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择组织" type="one"
                                     url="/admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">账目时间</label>
                    <div class="input-group">
                        <el-date-picker v-model="times" type="daterange" @change="chooseTime"
                                        value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="companyName" sortable label="所属组织" min-width="150"></el-table-column>
                <el-table-column prop="enterprise" sortable label="企业客户" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="code" sortable label="单据编号" min-width="250">
                    <template slot-scope="scope">
                        <a size="mini" @click="viewCustomerInfo(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="invoiceType" sortable label="单据类型" min-width="100"></el-table-column>
                <el-table-column prop="openingBalance" sortable label="期初余额(元)" min-width="120"></el-table-column>
                <el-table-column prop="receivableAmount" sortable label="应收余额(元)" min-width="120"></el-table-column>
                <el-table-column prop="collectionAmount" sortable label="收款金额(元)" min-width="120"></el-table-column>
                <el-table-column prop="endingBalance" sortable label="期末余额(元)" min-width="120"></el-table-column>
                <el-table-column prop="reversedAmount" sortable label="已冲销金额(元)" min-width="130"></el-table-column>
                <el-table-column prop="unreversedAmount" sortable label="未冲销金额(元)" min-width="130"></el-table-column>
                <el-table-column prop="accountType" sortable label="账目类型" min-width="100"></el-table-column>
                <el-table-column prop="createTime" sortable label="账目时间" min-width="150"></el-table-column>
                <el-table-column prop="operator" sortable label="操作员" min-width="100"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: 'corporateCustomerAccounts',
        mixins: [tool],
        components: {TreeSelect,ConfirmForm},
        data(){
            return {
                showSearch: false,
                showExportExcelBtn: this.getCurrentUserAuthority('corporateCustomerAccounts/exportExcel'),
                listUrl:"/core/coreCorporateCustomerAccountController/list",
                times:[],
                organizationIds:[],
                invoiceTypeList: [{
                    value: '1',
                    label: '项目月结单'
                }, {
                    value: '2',
                    label: '收款单'
                }, {
                    value: '3',
                    label: '退款单'
                }]
            }
        },
        activated: function () {
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        watch: {},
        methods: {
            getListBefore(params){
                if (this.times) {
                    params.startTime = this.times[0];
                    params.endTime = this.times[1];
                }
               /* if (this.organizationIds) {
                    params.companyId = this.organizationIds[0];
                }*/
            },
            changeOrganization(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.searchParam.companyId=this.organizationIds[0];
                }else{
                    this.check = false;
                    this.searchParam.organId = '';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            viewCustomerInfo(bean) {
                this.$router.push({
                    path:"/tgpt/corporateCustomer/customerAccounts/detail/"+bean.code,
                    params:bean,
                });
                sessionStorage.setItem('customerAccounts', JSON.stringify(bean));
            },

            /*选择开始结束时间*/
            chooseTime(){
                if(this.times && this.times.length > 0 ){
                    this.searchParam.startTime = this.times[0];
                    this.searchParam.endTime = this.times[1];
                }
            },

            /*重置*/
            resetList(){
                this.times = [];
                this.organizationIds = [];
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',0);
                this.getList();
            },

            exportExcel() {
                var params=this.searchParam;
                if (this.times) {
                    params.startTime = this.times[0];
                    params.endTime = this.times[1];
                }
                if (this.organizationIds) {
                    params.companyId = this.organizationIds[0];
                }
                window.location.href = this.exportUrl("core/coreCorporateCustomerAccountController/exportExcel?" + $.param(params));
            }
        }
    }
</script>

