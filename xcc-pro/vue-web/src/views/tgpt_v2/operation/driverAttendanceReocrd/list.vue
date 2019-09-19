<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">司机姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" placeholder="司机姓名" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.includeChildren" :disabled="!searchParam.orgId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">打卡日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.time"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <!--<el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>-->
                <el-button type="primary" size="mini" @click="getList()">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
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
            <el-table border :data="list" style="width: 100%">
                <!--<el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">修改</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="用户ID" prop="userId" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.userId}}</a>
					</template>
				</el-table-column>-->
				<el-table-column min-width="140" label="司机姓名" prop="driverName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="日期" prop="dateTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="上班打卡时间" prop="clockInTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="上班打卡地点" prop="address" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="下班打卡时间" prop="clockOffTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="下班打卡地点" prop="offAddress" sortable show-overflow-tooltip></el-table-column>
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
        name: 'baseDriverAttendanceRecord',
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
                listUrl: 'operation_base/driverAttendance/list',
                companyIds:[]
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
           /* getListBefore(params) {
                if (this.companyIds && this.companyIds.length > 0) {
                    params.orgId = this.companyIds[0];
                }else{
                    params.orgId = '';
                }
            },*/
            exportExcel() {
                window.location = this.exportUrl("operation_base/driverAttendance/export?" + $.param(this.searchParam));
            },
            changeOrganization(data) {
                if (this.companyIds && this.companyIds.length>0){
                    this.searchParam.orgId=this.companyIds[0];
                }else{
                    this.check = false;
                    this.searchParam.orgId='';
                    this.$set(this.searchParam,'includeChildren',false);
                }
            },
            resetList(){
                this.companyIds=[];
                this.searchParam={};
                this.check = false;
                this.$set(this.searchParam,'includeChildren',false);
                this.handleCurrentChange(1);
            }
        }
    }
</script>

