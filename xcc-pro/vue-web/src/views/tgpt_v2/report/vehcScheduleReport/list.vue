<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">开始时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.startTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">结束时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.endTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group">
                        <tree-select v-model="originateDeptId" placeholder="服务组织" type="one" clearable
                                     url="admin/organization/tree"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="searchList(1)">查询
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
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <el-table-column prop="company" sortable label="所属部门" min-width="120"></el-table-column>
                <el-table-column prop="orderNum" sortable label="调度次数" min-width="120"></el-table-column>
                <el-table-column prop="totalTime" sortable label="行程总时长" min-width="120"></el-table-column>
                <el-table-column prop="totalKm" sortable label="行程总里程（km）" min-width="120"></el-table-column>
                <el-table-column fixed="right"  label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-show="showDetailBtn" type="text" @click="detail(scope.row)">详情
                        </el-button>
                        <!--<el-button type="text" size="small" @click="edit(scope.row.id)"-->
                                   <!--v-if="showEditBtn">编辑-->
                        <!--</el-button>-->
                    </template>
                </el-table-column>
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
        name: 'vehcScheduleReport',
        mixins: [tool],
        components: {TreeSelect, MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                //showDetailBtn: this.getCurrentUserAuthority("vehcScheduleReport/detail"),
                showDetailBtn: true,
                exportBtnShow: this.getCurrentUserAuthority("vehcScheduleReport/export"),
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                listUrl: "report/vehcScheduleReport/list",
                companyIds: "",
                dialogForm: {},
                searchParam: {
                    /*startTime: this.timeStamp2String(new Date(new Date - 24 * 60 * 60 * 1000),'-'),*/
                    startTime:"2019-03-01",
                    endTime:new Date().format("yyyy-MM-dd"),
                    organization: '',
                },
                originateDeptId: [],
            }
        },
        activated() {
            this.getList();
        },
        mounted: function () {
            this.searchParam = {
                startTime: this.timeStamp2String(new Date(new Date - 31 * 24 * 60 * 60 * 1000),'-'),
                endTime: new Date().format("yyyy-MM-dd"),
            };
            if (!this.$store.state.isInit) {
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            searchList(){
                var day = this.getDays(this.searchParam.startTime, this.searchParam.endTime);
                if(day > 90){
                    this.$message.error('查询范围最大90天');
                    return;
                }
                this.searchParam.organization = this.originateDeptId[0];
                this.getList();
            },
            resetList() {
                this.searchParam = {
                    startTime: this.timeStamp2String(new Date(new Date - 31 * 24 * 60 * 60 * 1000),'-'),
                    endTime: new Date().format("yyyy-MM-dd"),
                    organization: ''
                };
                this.getList();
                this.originateDeptId = [];
            },
            exportExcel() {
                var day = this.getDays(this.searchParam.startTime, this.searchParam.endTime);
                if(day > 90){
                    this.$message.error('导出范围最大90天');
                    return;
                }
                if (this.originateDeptId && this.originateDeptId.length == 1) {
                    this.searchParam.organization = this.organization[0];
                }
                window.location = this.exportUrl("report/vehcScheduleReport/export?" + $.param(this.searchParam));
            },
            detail(row){
                let url=this.$route.fullPath;
                if (~this.$route.fullPath.indexOf("/detail")) {
                    return;
                }
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail?plate=" + row.plate + "&startTime=" + this.searchParam.startTime + "&endTime=" + this.searchParam.endTime});
                }else{
                    this.$router.push({path:url+"/detail?plate=" + row.plate + "&startTime=" + this.searchParam.startTime + "&endTime=" + this.searchParam.endTime});
                }
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
            },
            getDays(strDateStart,strDateEnd){
                if(strDateStart && strDateEnd){
                    var strSeparator = "-"; //日期分隔符
                    var oDate1;
                    var oDate2;
                    var iDays;
                    oDate1= strDateStart.split(strSeparator);
                    oDate2= strDateEnd.split(strSeparator);
                    var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
                    var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
                    iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
                    return iDays ;
                }else {
                    return 1;
                }
            }
        }

    }
</script>

<style scoped>

</style>
