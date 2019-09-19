<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">离线天数</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.days" placeholder="离线天数" clearable>
                            <el-option label="1天" value="1"></el-option>
                            <el-option label="2天" value="2"></el-option>
                            <el-option label="7天" value="7"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">设备类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equType" placeholder="设备类型" clearable>
                            <el-option label="有线" value="1"></el-option>
                            <el-option label="无线" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            @change="chooseTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" placeholder="不限" clearable>
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                            <el-option label="个人" :value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyWord" placeholder="车牌、车架号" clearable></el-input>
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
                <el-table-column prop="plate" sortable label="车牌" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toVehicleDetail(scope.row.id)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="imei" sortable label="IMEI" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="equipmentModalName" sortable label="设备类型" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="assetsTypeName" sortable label="资产属性" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="companyName" sortable label="服务组织" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="seriesName" sortable label="车型" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="vin" sortable label="车架号" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="localtionTime" sortable label="最后离线时间" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="address" sortable label="离线地点" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="diffMinutes" sortable label="离线时长" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="vehicleStatus" sortable label="服役状态" min-width="90" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: 'vehicleOfflineReport',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                exportBtnShow:this.getCurrentUserAuthority("vehicleOfflineReport/exportExcel"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"report/vehicleOfflineReport/list",
                companyIds:"",
                dialogForm:{},
                searchParam: {
                    days:"1",
                    equType:"1"
                },
                organization:[],
                createDate : [],
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
           /* this.getCreateDate();*/
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                // if (this.companyIds) {
                //     params.organizationId = this.companyIds[0];
                // }else{
                //     params.organizationId = '';
                //     this.$set(this.searchParam,'organCascade',false);
                // }
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                } else {
                    params.startTime = '';
                    params.endTime = '';
                }
            },

            resetList(){
                this.searchParam = {
                    days:"1",
                    equType:"1"
                };
                //this.createDate = [];
                this.companyIds = "";
                /*this.getCreateDate();*/
                this.getList();
                this.organization=[];
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId = this.organization[0];
                }
            },
            getCreateDate(){
                let eDate = new Date();
                let strEdate = eDate.format("yyyy-MM-dd")
                let strSdate;
                let sDate = new Date();
                sDate.setMonth(eDate.getMonth()-1)-1;
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
                this.searchParam.startTime = strSdate;
                this.searchParam.endTime = strEdate;
                this.createDate = [strSdate, strEdate];
            },
            chooseTime(){
                if(this.createDate.length > 0){
                    this.searchParam.startTime = this.createDate[0] ;
                    this.searchParam.endTime = this.createDate[1];
                }else{
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
            },

            toList(date, type, vehicleStatus){
                let url;
                if (type == '1'){
                    url = '/tgpt_v2/alarm/electricfence?date='+date;
                }else if (type == '2'){
                    url = '/tgpt_v2/alarm/areaLimit?date='+date;
                }else if (type == '3'){
                    url = '/tgpt_v2/alarm/timeLimit?date='+date;
                }else if (type == '4'){
                    url = '/tgpt_v2/alarm/parkingfence?date='+date;
                }else if (type == '5'){
                    url = '/tgpt_v2/alarm/operation?date='+date;
                }
                if(this.searchParam.vehicleStatus){
                    url = url + "&vehicleStatus=" + vehicleStatus;
                }
                this.$router.push({path:url});
            },

            exportExcel(){
                window.location = this.exportUrl("report/vehicleOfflineReport/export?" + $.param(this.searchParam));
            },toVehicleDetail(id){
                if(id == undefined || id == ''){
                    return;
                }
                let url="/tgpt/vehicle/vehicleInformation/detail/"+id;
                this.$router.push({path:url});
            },
        }
    }
</script>

