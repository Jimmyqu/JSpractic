<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
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

                <div class="form-group">
                    <label class="control-label">时长范围</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.duration" clearable placeholder="请选择时长范围">
                            <el-option label="5分钟以下" :value="1"></el-option>
                            <el-option label="5到10分钟" :value="2"></el-option>
                            <el-option label="10分钟以上" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">驾驶员姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="驾驶员姓名" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌" clearable></el-input>
                    </div>
                </div>


            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini"    @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showDetailBtn" type="text" @click="detail(scope.row.id)">行驶轨迹</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="车牌号" prop="plate" sortable show-overflow-tooltip>
                </el-table-column>
				<el-table-column min-width="140" label="驾驶员姓名" prop="name" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="organizationId" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="资产属性" prop="assets" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="开始时间" prop="startTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="结束时间" prop="endTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="超速时长" prop="timeduration" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="超速里程(km)" prop="mileage" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="最高车速(km/h)" prop="maxSpeed" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="地址" prop="address" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服役状态" prop="serviceStatus" sortable show-overflow-tooltip></el-table-column>

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
        name: 'speeding',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showDetailBtn: true,
                showSearch: false,
                organization:[],
                creatDate:[],
                searchParam: {
                },
                showExportExcelBtn: true,
                listUrl: 'obd//obdAlarmSpeeding'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getCreateDate();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.organization=[];
                this.creatDate=[];
                this.getCreateDate();
                this.getList();
            },
            getListBefore(params) {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    params.startUpdateTime = creatDate[0] + ' 00:00:00';
                    params.endUpdateTime = creatDate[1] + ' 23:59:59';
                }else{
                    params.startUpdateTime="";
                    params.endUpdateTime="";
                }
            },
            exportExcel() {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startUpdateTime = creatDate[0] + ' 00:00:00';
                    this.searchParam.endUpdateTime = creatDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startUpdateTime="";
                    this.searchParam.endUpdateTime="";
                }
                window.location = this.exportUrl("obd//obdAlarmSpeeding//excel?" + $.param(this.searchParam));
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }
            },
            creatDateChange() {

                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startUpdateTime = creatDate[0] + ' 00:00:00';
                    this.searchParam.endUpdateTime = creatDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startUpdateTime="";
                    this.searchParam.endUpdateTime="";
                }
            },
            getCreateDate(){
                let eDate = new Date();
                let strEdate = eDate.format("yyyy-MM-dd")
                let strSdate;
                let sDate = new Date();
                sDate.setDate(eDate.getDate()-7);
                let yy1 = sDate.getFullYear();
                let mm1 = sDate.getMonth()+1;
                let dd1 = sDate.getDate();
                if(dd1 == '00'){
                    mm1 = parseInt(mm1)-1;
                    let new_date = new Date(yy1,mm1,1);
                    dd1 = (new Date(new_date.getTime()-1000*60*60*24)).getDate()
                }
                if (mm1 < 10 ) {
                    mm1 = '0' + mm1;
                }
                if (dd1 < 10) {
                    dd1 = '0' + dd1;
                }
                strSdate = yy1 + '-' + mm1 + '-' + dd1;
                this.searchParam.startUpdateTime = strSdate;
                this.searchParam.endUpdateTime = strEdate;
                this.creatDate = [strSdate, strEdate];
            },
            detail(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detail/"+id});
            }
        }
    }
</script>

