<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">联系人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contacter" placeholder="请输入联系人/联系电话" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driver" placeholder="请输入司机姓名/手机号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicle" placeholder="请输入车牌号/车型" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">任务状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assignmentStatus" placeholder="全部" clearable>
                            <el-option label="已取消" value="0"></el-option>
                            <el-option label="待派发" value="1"></el-option>
                            <el-option label="已派发" value="2"></el-option>
                            <el-option label="待出车" value="3"></el-option>
                            <el-option label="待接人" value="4"></el-option>
                            <el-option label="待送达" value="5"></el-option>
                            <el-option label="已送达" value="6"></el-option>
                            <el-option label="返程中" value="7"></el-option>
                            <el-option label="返程结束" value="8"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">任务时间</label>
                    <div class="input-group">
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
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.includeChildren" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <!--grid按钮-->
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" size="mini" type="warning" @click="add()">新增</el-button>
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询
                </el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list"
                      style="width: 100%" border>
                <el-table-column fixed="left" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" v-if="scope.row.status == 1" @click="edit(scope.row.id)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button v-if="scope.row.status == 1" @click="handOut(scope.row.id)" type="text" size="small">
                            派发
                        </el-button>
                        <el-button v-if="scope.row.status == 1 || scope.row.status == 2" @click="cancelAssignment(scope.row.id)" type="text" size="small">
                            取消
                        </el-button>
                        <el-button v-if="scope.row.status >= 4" @click="detailTrip(scope.row.id)" type="text" size="small">
                            查看行程
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="assignmentNo" sortable label="任务编号" show-overflow-tooltip min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.assignmentNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="assignmentTime" sortable label="任务时间" min-width="100"></el-table-column>
                <el-table-column prop="depAddress" show-overflow-tooltip sortable label="任务起点" min-width="120"></el-table-column>
                <el-table-column prop="desAddress" show-overflow-tooltip sortable label="任务终点" min-width="120"></el-table-column>
                <el-table-column prop="passengerNum" sortable label="乘车人数" min-width="80"></el-table-column>
                <el-table-column prop="contacterName" sortable label="联系人" min-width="80"></el-table-column>
                <el-table-column prop="contacterPhone" sortable label="联系电话" min-width="100"></el-table-column>
                <el-table-column prop="statusText" sortable label="任务状态" min-width="80"></el-table-column>
                <el-table-column prop="driverName" sortable label="司机" min-width="80"></el-table-column>
                <el-table-column prop="plate" sortable label="车辆" min-width="80"></el-table-column>
                <el-table-column prop="remark" sortable show-overflow-tooltip label="备注" min-width="140"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import $ from 'jquery-slim'

    export default {
        name: 'assignmentManagement',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showAddBtn: this.getCurrentUserAuthority("assignment/add"),
                showEditBtn: this.getCurrentUserAuthority("assignment/edit"),
                showExportBtn: this.getCurrentUserAuthority("assignment/export"),
                showSearch: false,
                formData: {},
                listUrl: "operation_core/assignment/list",
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
                this.getList();
            },
            getListBefore(params) {
               /* if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }*/
                if (this.createDate && this.createDate.length > 1) {
                    params.assignmentStartTime = this.createDate[0] + ' 00:00:00';
                    params.assignmentEndTime = this.createDate[1] + ' 23:59:59';
                }else{
                    params.assignmentStartTime = null;
                    params.assignmentEndTime = null;
                }
            },
            changeOrganization(){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.companyId=this.companyIds[0];
                }else{
                    this.searchParam.companyId='';
                    this.$set(this.searchParam,'includeChildren',false);
                }
            },
            handOut(id) {
                this.$router.push({path: "/tgpt_v2/operation/assignmentManagement/handOut/" + id});
            },
            detailTrip(id) {
                this.$router.push({path: "/tgpt_v2/operation/assignmentManagement/detailtrip/" + id});
            },
            exportExcel(){
                window.location = this.exportUrl("operation_core/assignment/export?" + $.param(this.searchParam));
            },
            cancelAssignment(id) {
                this.$confirm('是否确认取消？').then(_ => {
                    ajax.get("operation_core/assignment/cancel/" + id).then(res => {
                        if (this.checkResponse(res)) {
                            this.showMessage(res.message, 'success');
                            this.getList();
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },
        }
    }
</script>

