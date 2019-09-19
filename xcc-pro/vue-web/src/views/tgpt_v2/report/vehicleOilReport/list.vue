<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌查询" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">加油单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oilNum" placeholder="请输入报销单号查询" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">加油卡号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oilCar" placeholder="请输入报销单号查询" clearable></el-input>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label">加油日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">燃油标号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.fuelType" clearable placeholder="请选择燃油标号">
                            <el-option v-for="item in fuelTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">加油人员</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" placeholder="请输入司机姓名查询" clearable></el-input>
                    </div>
                </div>

            </div>

            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>

        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="pageAll()">查询</el-button>
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
            <p class="summary"><span>车辆总数：</span><span>{{vehicleTotal.vehicleTotal}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>金额总计：</span><span>{{vehicleTotal.amountTotal}}</span></p>
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
				<el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="加油单号" prop="id" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="detail(scope.row)">{{scope.row.oilNum}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="车牌号" fixed="left" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="加油卡号" prop="oilCar" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="加油日期" prop="createTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="燃油标号" prop="text" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="加油量(升)" prop="oilCapacity" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="单价(元)" prop="oilUnitPrice" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="加油总价" prop="oilCost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="公里数" prop="oilMileage" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="加油人员" prop="driverName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="卡内余额" prop="moneyAfter" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleOilReport',
        mixins: [tool],
        components: { TreeSelect,ConfirmForm },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                vehicleTotal:{},
                /*showExportExcelBtn:  this.getCurrentUserAuthority("vehicleOilReport/export"),*/
                showExportExcelBtn:  this.getCurrentUserAuthority('vehicleOilReport/exportExcel')
                ,
                listUrl: 'report/vehicleOilReport',
                createDate:"",
                companyIds:"",
                fuelTypeList:[]
            }
        },
        activated(){
            this.getList();
            this.vehicleTotalInfo();
            this.getFuelTypeList();
        },
        mounted() {
            var plate = this.$route.query.plate;
            if(plate){
                this.searchParam.plate = plate;
            }
            var regionId = this.$route.query.regionId;
            if(regionId){
                this.companyIds = [regionId];
                this.searchParam.organizationId = regionId;
            }
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.createDate = [startTime,endTime];
                this.searchParam.startTime = startTime;
                this.searchParam.endTime = endTime;
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.vehicleTotalInfo();
            this.getFuelTypeList();
        },
        methods: {
            getListBefore(params) {
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
               /* if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                }*/
            },getListAfter(){
         /*       var length=this.list.length;
                for(var i=0;i<(10-length);i++){
                    var row={
                        organizationName:"",
                        oilNum:"",
                        plate:"",
                        oilCar:"",
                        createTime:"",
                        text:"",
                        oilCapacity:"",
                        oilUnitPrice:"",
                        oilCost:"",
                        oilMileage:"",
                        driverName:"",
                        moneyAfter:"",
                    }
                    this.list.push(row);
                }
                var plateNum=0;
                var totalCost=0;
                var plateList=[];
                for(var i=0;i<length;i++){
                    var plateStr=','+plateList.join(",")+",";
                    if(this.list[i].plate!=null && this.list[i].plate!='' && plateStr.indexOf(','+this.list[i].plate+",") ==-1){
                        plateList.push(this.list[i].plate);
                        plateNum++;
                    }
                    totalCost+=parseFloat(this.list[i].oilCost)
                }
                var row={
                    organizationName:"汇总",
                    oilNum:"",
                    plate:plateNum+"辆",
                    oilCar:"/",
                    createTime:"/",
                    text:"/",
                    oilCapacity:"/",
                    oilUnitPrice:"/",
                    oilCost:totalCost,
                    oilMileage:"/",
                    driverName:"/",
                    moneyAfter:"/",
                }
                this.list.push(row);*/
            },
            pageAll(){
                this.handleCurrentChange(1);
                this.vehicleTotalInfo();
            },
            vehicleTotalInfo() {
                ajax.post('report/vehicleOilReport/vehicleTotalInfo',this.searchParam).then(res=>{
                    if(res.status==0){
                        this.vehicleTotal=res.data;
                    }
                })
            },
            exportExcel() {
                var params=this.searchParam;
                if (this.createDate) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                /*if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                }*/
                window.location = this.exportUrl("report/vehicleOilReport/excel?" + $.param(params));
            },getFuelTypeList(){
                ajax.get('report/vehicleOilReport/findFuelType').then(res=>{
                    this.fuelTypeList=res.data;
                })
            },
            resetList(){
                this.searchParam={};
                this.createDate=[];
                this.companyIds=[];
                this.$set(this.searchParam,'organCascade',0);
                this.pageAll();
            },
            changeOrganization(){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.organizationId=this.companyIds[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            detail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
        }
    }
</script>

