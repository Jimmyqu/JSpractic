<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">时间</label>
                    <div class="input-group" style="width: 300px;">
                        <el-date-picker
                            v-model="createDate"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">司机</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driver" placeholder="请输入司机姓名/手机号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.includeChildren" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <!--grid按钮-->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column fixed="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="trips(scope.row)" type="text" size="small">
                            行程记录
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="driverName" sortable label="司机名称" min-width="80"></el-table-column>
                <el-table-column prop="driverPhone" sortable label="司机手机号" min-width="120"></el-table-column>
                <el-table-column prop="companyName" sortable label="所属组织" min-width="100"></el-table-column>
                <el-table-column prop="assignmentCount" sortable label="完成任务数" min-width="100"></el-table-column>
                <el-table-column prop="totalMileage" sortable label="驾驶总里程（公里）" min-width="120"></el-table-column>
                <el-table-column prop="totalRunTime" sortable label="驾驶总时长" min-width="120"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'

    export default {
        name: 'assignmentStatistics',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showExportBtn: this.getCurrentUserAuthority("assignmentStatistics/export"),
                formData: [],
                listUrl: "operation_core/statistics/list",
                companyId: '',
                companyNameOptions: [],
                createDate: [],
                companyIds: ""
            }
        },
        // 返回页面调用
        activated() {
            this.getList();
        },
        mounted: function () {
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList() {
                this.searchParam = {};
                this.$set(this.searchParam,'includeChildren',false);
                this.companyIds = "";
                this.createDate = [];
                this.formData=[];
                this.getList();
            },
            getListBefore(params) {
               /* if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }*/
                if (this.createDate && this.createDate.length > 1) {
                    params.startTime = this.createDate[0] + ' 00:00:00';
                    params.endTime = this.createDate[1] + ' 23:59:59';
                } else{
                    params.startTime = null;
                    params.endTime = null;
                }
                this.formData = this.createDate;
            },
            changeOrganization(){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.companyId=this.companyIds[0];
                }else{
                    this.searchParam.companyId='';
                    this.$set(this.searchParam,'includeChildren',false);
                }
            },
            trips(row){
                //跳转行程详情
                this.$router.push({path: `/tgpt_v2/operation/assignmentStatistics/routeList?driverId=${row.driverId}&driver=${row.driverName}&startTime=${this.formData && this.formData.length > 1?this.formData[0]:''}&endTime=${this.formData && this.formData.length > 1?this.formData[1]:''}`});
            },
            exportExcel(){
                window.location = this.exportUrl("operation_core/statistics/export?" + $.param(this.searchParam));
            },
        }
    }
</script>

