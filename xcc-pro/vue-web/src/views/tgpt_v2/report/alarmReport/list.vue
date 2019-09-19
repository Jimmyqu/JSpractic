<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
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
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选车辆所属">
                            <el-option label="自有车辆" :value="1"></el-option>
                            <el-option label="租赁车辆" :value="2"></el-option>
                            <el-option label="挂靠车辆" :value="3"></el-option>
                            <el-option label="个人车辆" :value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌号" clearable></el-input>
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
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="getThisList()">查询</el-button>
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
            <p class="summary">
                <span>汇总:</span>
                <span style="margin-left: 20px;">报警总数: {{sumData.total}}</span>
                <span style="margin-left: 20px;">碰撞: {{sumData.collisionCount}}</span>
                <span style="margin-left: 20px;">断电: {{sumData.powerOffCount}}</span>
                <span style="margin-left: 20px;">侧翻: {{sumData.rolloverCount}}</span>
                <span style="margin-left: 20px;">严重碰撞: {{sumData.seriousCollisionCount}}</span>
                <span style="margin-left: 20px;">拖吊: {{sumData.towCount}}</span>
                <span style="margin-left: 20px;">震动: {{sumData.vibrationCount}}</span>
                <span style="margin-left: 20px;">水温: {{sumData.waterTemperatureCount}}</span>
                <span style="margin-left: 20px;">低电压: {{sumData.lowVoltageCount}}</span>
            </p>
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column  prop="plate" sortable label="车牌" fixed="left" min-width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="toDetail(scope.row)">
                        {{scope.row.plate}}
                    </el-button>
                </template>
                </el-table-column>
                <el-table-column  prop="assetsType" sortable label="车辆所属" min-width="120"></el-table-column>
                <el-table-column  prop="name" sortable label="所属部门" min-width="120"></el-table-column>
                <el-table-column  prop="vehicleModelInfoName" sortable label="车型" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="total" sortable label="报警总数" min-width="120"></el-table-column>
                <el-table-column  prop="collisionCount" sortable label="碰撞" min-width="120"></el-table-column>
                <el-table-column  prop="powerOffCount" sortable label="断电" min-width="120"></el-table-column>
                <el-table-column  prop="lowVoltageCount" sortable label="低电压" min-width="120"></el-table-column>
                <el-table-column  prop="rolloverCount" sortable label="侧翻" min-width="120"></el-table-column>
                <el-table-column  prop="seriousCollisionCount" sortable label="严重碰撞" min-width="120"></el-table-column>
                <el-table-column  prop="towCount" sortable label="拖吊" min-width="120"></el-table-column>
                <el-table-column  prop="vibrationCount" sortable label="震动" min-width="120"></el-table-column>
                <el-table-column  prop="waterTemperatureCount" sortable label="水温" min-width="120"></el-table-column>
                <!--<el-table-column  prop="vehicleStatusStr" sortable label="车辆状态" min-width="120"></el-table-column>
                <el-table-column  prop="illegalVehicleCount" sortable label="违规车辆总数" min-width="120"></el-table-column>
                <el-table-column  prop="illegalTotalCount" sortable label="违规总次数" min-width="120"></el-table-column>
                <el-table-column  prop="electricFence" sortable label="电子栅栏" show-overflow-tooltip min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toList(scope.row.alarmDate, '1', scope.row.vehicleStatus)">{{scope.row.electricFence}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="areaLimit" sortable label="区域栅栏" show-overflow-tooltip min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toList(scope.row.alarmDate, '2', scope.row.vehicleStatus)">{{scope.row.areaLimit}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="timeLimit" sortable label="时间栅栏" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toList(scope.row.alarmDate, '3', scope.row.vehicleStatus)">{{scope.row.timeLimit}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="parkingFence" sortable label="停车栅栏" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toList(scope.row.alarmDate, '4', scope.row.vehicleStatus)">{{scope.row.parkingFence}}</a>
                    </template>
                </el-table-column>
                <el-table-column  prop="illegalOperation" sortable label="非法调度" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toList(scope.row.alarmDate, '5', scope.row.vehicleStatus)">{{scope.row.illegalOperation}}</a>
                    </template>
                </el-table-column>-->
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import ajax from '@/utils/request'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name: 'alarmReport',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            //let searchParam = {};
            return {
                exportBtnShow:this.getCurrentUserAuthority("alarmReport/exportExcel"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"report/alarmReport/list",
                companyIds:"",
                dialogForm:{},
                searchParam: {},
                sumData:{},
                organization:[],
                createDate : [],
            }
        },
        activated(){
            this.getList();
            this.getSumData();
        },
        mounted: function () {
            this.getCreateDate();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getSumData();
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
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',0);
                //this.createDate = [];
                this.companyIds = "";
                this.getCreateDate();
                this.getList();
                this.getSumData();
                this.organization=[];
            },

            getThisList(){
                this.handleCurrentChange(1);
                this.getSumData();
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId = this.organization[0];
                }else{
                    this.searchParam.organizationId = '';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            getCreateDate(){
                let eDate = new Date();
                let strEdate = eDate.format("yyyy-MM-dd")
                let strSdate;
                let sDate = new Date();
                sDate.setDate(eDate.getDate()-1);
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

            getSumData(){
                const params = Object.assign({},this.searchParam);
                ajax.get('report/alarmReport/sumData' , params).then(
                    res => {
                        this.sumData = res;
                    }
                )
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
                window.location = this.exportUrl("report/alarmReport/export?" + $.param(this.searchParam));
            },

            toDetail(row){
                if(row.id!=undefined){
                    let url = '/tgpt/vehicle/vehicleInformation/detail/' + row.id;
                    this.$router.push({path:url});
                }
            },

            getListAfter(){
                var info={
                    plate :"合计",
                    total:0,
                    collisionCount:0,
                    powerOffCount:0,
                    lowVoltageCount:0,
                    rolloverCount:0,
                    seriousCollisionCount:0,
                    towCount:0,
                    vibrationCount:0,
                    waterTemperatureCount:0
                }
                for(var i=0;i<this.list.length;i++){
                    info.total+= this.list[i].total;
                    info.collisionCount+= this.list[i].collisionCount;
                    info.powerOffCount+= this.list[i].powerOffCount;
                    info.lowVoltageCount+= this.list[i].lowVoltageCount;
                    info.rolloverCount+= this.list[i].rolloverCount;
                    info.seriousCollisionCount+= this.list[i].seriousCollisionCount;
                    info.towCount+= this.list[i].towCount;
                    info.vibrationCount+= this.list[i].vibrationCount;
                    info.waterTemperatureCount+= this.list[i].waterTemperatureCount;
                }

                this.list[this.list.length]=info;
                /*if(this.page == 1) {
                    this.mileageTotalInfo();
                }*/
            },
        }
    }
</script>

