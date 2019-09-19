<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">清洁单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.washNum" clearable autocomplete="off" placeholder="请输入订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable autocomplete="off" placeholder="请输入车辆"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.reimburseStatus" placeholder="不限" clearable>
                            <el-option label="待处理" :value=0></el-option>
                            <el-option label="审批中" :value=1></el-option>
                            <el-option label="驳回" :value=2></el-option>
                            <el-option label="已完成" :value=3></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="creatDate"
                            @change="creatDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="exportShow" size="mini" @click="exportData()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column prop="orderNo" sortable label="清洁单号" min-width="220">
                    <template slot-scope="scope">
                         <a size="mini" @click="detail(scope.row.id)">{{scope.row.washNum}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="plate" sortable label="车辆" min-width="120"></el-table-column>
                <el-table-column  prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>
                <el-table-column prop="washTime" sortable label="清洁时间" min-width="120"></el-table-column>
                <el-table-column  prop="washCost" sortable label="费用" min-width="100"></el-table-column>
                <el-table-column  prop="companyName" sortable label="服务组织" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="enterpriseName" sortable label="服务客户" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column  prop="contractNo" sortable label="合同编号" min-width="200"></el-table-column>
                <el-table-column  prop="statusName" sortable label="状态" min-width="100"></el-table-column>
                <el-table-column  prop="createrName" sortable label="创建人" min-width="100"></el-table-column>
                <el-table-column  prop="createTime" sortable label="创建时间" min-width="140"></el-table-column>
            </el-table>
            <!-- 分页 -->

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficClean',
        mixins: [tool],
        data: function () {
            return {
                listUrl:"app/appDriverReimburseWash",
                formData:{},
                exportShow : this.getCurrentUserAuthority("clean/export"),
                creatDate:[],
                showSearch: false,
            }
        },
        beforeMount: function () {//载入前

        },
        activated(){
            this.getList();
        },
        mounted: function () {//载入后
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.creatDate = [startTime,endTime];
                this.searchParam.startTime = startTime;
                this.searchParam.endTime = endTime;
            }

            var reimburseStatus = this.$route.query.reimburseStatus;
            if(reimburseStatus){
                this.searchParam.reimburseStatus = parseInt(reimburseStatus);
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            resetList(){
                this.searchParam={};
                this.creatDate=[];
                this.getList();
            },
            creatDateChange() {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0];
                    this.searchParam.endTime = creatDate[1];
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            detail(id){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+id});
                }else{
                    this.$router.push({path:url+"/detail/"+id});
                }
            },
            exportData() {
                location.href = this.exportUrl("app/appDriverReimburseWash/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

