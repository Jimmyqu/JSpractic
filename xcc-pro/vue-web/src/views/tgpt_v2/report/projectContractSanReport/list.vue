<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="seMonth"
                            type="month"
                            value-format="yyyy-MM"
                            placeholder="月份">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"
                                    ></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
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
        <!-- 表格 table -->
        <div class="table-box" v-loading="listLoading">
            <el-table :ref="getRefName" :max-height="tableHeight" :data="list" style="width: 100%" border>
                <el-table-column prop="serviceRegionName" sortable label="分公司" min-width="120"></el-table-column>
                <el-table-column prop="orderNum" sortable label="散租订单数" min-width="120"></el-table-column>
                <el-table-column prop="totalMoney" sortable label="散租收入(元)" min-width="120"></el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import ajax from '@/utils/request'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'
    import {deepClone} from "../../../../utils"

    export default {
        name: 'projectContractSanReport',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                exportBtnShow: this.getCurrentUserAuthority("projectContractSan/export"),
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                listUrl: "report/projectContractSan/list",
                companyIds: "",
                dialogForm: {},
                searchParam: {
                },
                organization:[],
                seMonth : '',
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            this.getLastMonth();
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(param){
              /*  if (this.organization && this.organization.length == 1) {
                    param.organizationId = this.organization[0];
                }*/
                param.startTime = this.seMonth +"-01";
                var  endDate = new Date(param.startTime)
                endDate.setMonth(endDate.getMonth() + 1);
                param.endTime = endDate.format('yyyy-MM-dd');
            },
            getListAfter(){
            },
            resetList() {
                this.searchParam = {};
                this.organization = [];
                this.$set(this.searchParam,'organCascade',0);
                this.getList();
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            exportExcel() {
                window.location = this.exportUrl("report/projectContractSan/export?" + $.param(this.getListParam()));
            },getListParam(){
                let param=deepClone(this.searchParam);
                if (this.organization && this.organization.length == 1) {
                    param.organizationId = this.organization[0];
                }
                param.startTime = this.seMonth +"-01";
                var  endDate = new Date(param.startTime)
                endDate.setMonth(endDate.getMonth() + 1);
                param.endTime = endDate.format('yyyy-MM-dd');
                return param;
            },
            getLastMonth() {
                var datetime = new Date();
                var startDate = datetime.format('yyyy-MM');
                this.seMonth=startDate;
            }
        }
    }
</script>

