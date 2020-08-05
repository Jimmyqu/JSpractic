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
                        <tree-select v-model="originateDeptId" placeholder="服务组织" type="one"
                                     url="admin/organization/tree"></tree-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="searchList()">查询
                </el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column prop="orderNo" sortable label="操作" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="detail(scope.row)">行程记录</a>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" sortable label="调度单号" min-width="200">
                    <!--<template slot-scope="scope">-->
                        <!--<a size="mini" @click="toDetail(scope.row.id)">{{scope.row.orderNo}}</a>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column  prop="customerType" sortable label="客户类型" min-width="120"></el-table-column>
                <el-table-column  prop="enterpriseName" sortable label="服务客户" min-width="120"></el-table-column>
                <el-table-column  prop="scheduleTypeText" sortable label="散租类型" min-width="150"></el-table-column>
                <el-table-column  prop="useTime" sortable label="用车开始时间" min-width="150"></el-table-column>
                <el-table-column  prop="useTimeEnd" sortable label="用车结束时间" min-width="150"></el-table-column>
                <el-table-column  prop="user" sortable label="用车申请人" min-width="150"></el-table-column>
                <el-table-column  prop="orderAmount" sortable label="订单金额(元)" min-width="150"></el-table-column>
                <el-table-column  prop="userNum" sortable label="用车人数" min-width="100"></el-table-column>
                <el-table-column  prop="reason" sortable label="用车事由" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="depAddress" sortable label="出发地址" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column  prop="arrAddress" sortable label="抵达地址" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column  prop="plate" sortable label="车辆" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>
                <el-table-column  prop="scheduleStatus" sortable label="状态" min-width="120"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import TreeSelect from '@/components/TreeSelect/index'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: "vehcScheduleReportDetail",
        mixins: [tool],
        components: {TreeSelect},

        data() {
            return {
                showSearch: false,
                showExportExcelBtn: true,
                listUrl: 'report/vehcScheduleReport/detailList',
                plate: this.$route.params.plate,

                searchParam: {
                    startTime: this.timeStamp2String(new Date(new Date - 31 * 24 * 60 * 60 * 1000),'-'),
                    endTime: new Date().format("yyyy-MM-dd"),
                },
                originateDeptId: [],
            }
        },
        mounted() {
            var plate = this.$route.query.plate;
            if(plate){
                this.searchParam.plate = plate;
            }
            var startTime = this.$route.query.startTime;
            if(startTime){
                this.searchParam.startTime = startTime;
            }
            var endTime = this.$route.query.endTime;
            if(endTime){
                this.searchParam.endTime = endTime;
            }
            this.searchParam = Object.assign({},this.searchParam);

            this.searchList();
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
            detail(row){
                let url =  '/tgpt_v2/obd/vehicleTrackRecord';
                let b = this.getCurrentUserMenuAuthority(url);
                if (b) {
                    this.$router.push({path:url, query:{plate:row.plate,startTime:row.useTime,endTime:row.useTimeEnd}});
                } else {
                    alert("没有当前操作项权限！");
                }
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
            // getList(callback){
            //     const params = Object.assign({},this.searchParam);
            //     params.plate = this.plate;
            //
            //
            //     params.size = this.pageSize;
            //     params.current = this.page;
            //     this.getListBefore(params);
            //     ajax.get(this.listUrl, params).then(res => {
            //         this.list = res.records;
            //         this.listCount = res.total;
            //         $.isFunction(callback) && callback(res);
            //         this.getListAfter(callback);
            //     })
            // }
        }


    }
</script>


