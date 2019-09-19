<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.month"
                            type="month"
                            value-format="yyyy-MM"
                            placeholder="月份">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
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
                <el-table-column prop="serviceRegionName" sortable label="所属组织" min-width="120"></el-table-column>
                <el-table-column prop="executionNum" sortable label="在执行合同" min-width="120"></el-table-column>
                <el-table-column prop="expireNum" sortable label="本月到期合同" min-width="120"></el-table-column>
                <el-table-column prop="renewalNum" sortable label="本月续签合同" min-width="120"></el-table-column>
                <el-table-column prop="outNum" sortable label="本月退出合同" min-width="120"></el-table-column>
                <el-table-column prop="newNum" sortable label="本月新增合同" min-width="120"></el-table-column>
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
        name: 'projectContractReport',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                exportBtnShow: this.getCurrentUserAuthority("projectContractReport/export"),
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                listUrl: "report/projectContract/list",
                companyIds: "",
                dialogForm: {},
                searchParam: {
                    month:this.getCurrentMonth()
                },
                organization:[],
                seMonth : '',
                outOption: {
                    disabledDate(e) {
                        //const now=new Date();
                        // now.setDate(now.getDate()-1);
                        return e < new Date();
                    },
                }
            }
        },
        activated(){
                this.getList();
        },
        mounted: function () {
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {

            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },

            resetList() {
                this.searchParam = {
                    month:this.getCurrentMonth()
                };
                this.$set(this.searchParam,'organCascade',0);
                this.organization = [];
                this.handleCurrentChange(1);
            },
            exportExcel() {
                window.location = this.exportUrl("report/projectContract/export?" + $.param(this.searchParam));
            },
            getLastMonth() {
                var datetime = new Date();
                var startDate = datetime.format('yyyy-MM');
                this.seMonth=startDate;
            },

            getCurrentMonth(){
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;//月份是从0开始的
                if (month < 10) {
                    month = '0' + month
                };
                var newTime = year + '-' +
                    month;
                return newTime;
            }
        }
    }
</script>

