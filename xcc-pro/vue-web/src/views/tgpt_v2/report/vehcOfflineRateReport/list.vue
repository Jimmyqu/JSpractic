<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <!--<el-date-picker-->
                        <!--v-model="createDate"-->
                        <!--@change="chooseTime"-->
                        <!--type="daterange"-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="开始日期"-->
                        <!--end-placeholder="结束日期"-->
                        <!--value-format="yyyy-MM-dd">-->
                        <!--</el-date-picker>-->
                        <el-date-picker
                            v-model="searchParam.time"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <!--<div class="form-group">-->
                <!--<label class="control-label">车辆状态</label>-->
                <!--<div class="input-group">-->
                <!--<el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择车辆状态">-->
                <!--<el-option label="未投入运营" :value="1"></el-option>-->
                <!--<el-option label="待租" :value="2"></el-option>-->
                <!--<el-option label="已租" :value="3"></el-option>-->
                <!--<el-option label="待处置" :value="7"></el-option>-->
                <!--</el-select>-->
                <!--</div>-->
                <!--</div>-->
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organizations" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"
                                     @change="changeOrganization"></tree-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询
                </el-button>
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
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="company" sortable label="所属部门" min-width="120"></el-table-column>
                <el-table-column prop="localtionTime" sortable label="统计日期" min-width="120"></el-table-column>
                <el-table-column prop="count" sortable label="车辆总数" min-width="120"></el-table-column>
                <el-table-column prop="online" sortable label="在线总数" min-width="120"></el-table-column>
                <el-table-column prop="onlineRate" sortable label="在线率" min-width="120"></el-table-column>
                <el-table-column prop="offline" sortable label="离线总数" min-width="120"></el-table-column>
                <el-table-column prop="offlineRate" sortable label="离线率" min-width="120"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync, number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: 'alarmReport',
        mixins: [tool],
        components: {TreeSelect, MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                exportBtnShow: this.getCurrentUserAuthority("vehcOfflineRateReport/export"),
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                listUrl: "report/vehcOfflineRateReport/list",
                companyIds: "",
                dialogForm: {},
                searchParam: {
                    time: this.timeStamp2String(new Date(new Date - 24 * 60 * 60 * 1000),'-'),
                    organizationId: '',
                },
                organizations: ''
            }
        },
        activated() {
            this.getList();
        },
        mounted: function () {
            this.getCreateDate();
            this.$store.state.isInit = false;
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList() {
                this.searchParam = {
                    time: this.timeStamp2String(new Date(new Date - 24 * 60 * 60 * 1000),'-')
                };
                this.getCreateDate();
                this.getList();
                this.organizations = [];
            },
            changeOrganization(data) {
                if (this.organizations && this.organizations.length == 1) {
                    this.searchParam.organizationId = this.organizations[0];
                }
            },
            getCreateDate() {
                // var curDate = new Date();
                // var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
                // this.searchParam.time = strSdate;
                // this.searchParam = Object.assign({},this.searchParam);
            },
            exportExcel() {
                window.location = this.exportUrl("report/vehcOfflineRateReport/export?" + $.param(this.searchParam));
            },
            timeStamp2String(time, format) {
                var mark = "-";
                if (null != format && format.length > 0) {
                    mark = format;
                }
                var datetime = new Date();
                datetime.setTime(time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
                var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
                var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
                var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
                var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
                return year + mark + month + mark + date;
            }
        }
    }
</script>

