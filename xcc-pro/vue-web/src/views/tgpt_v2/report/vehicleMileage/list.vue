<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="seMonth"
                            type="monthrange"
                            range-separator="至"
                            value-format="yyyy-MM"
                            :picker-options="pickerOptions"
                            :clearable="false"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择">
                            <el-option label="自有" :value="1"></el-option>
                            <el-option label="租赁" :value="2"></el-option>
                            <el-option label="挂靠" :value="3"></el-option>
                            <el-option label="个人" :value="4"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"  @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌查询" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.modelName" placeholder="品牌、车系、车型" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">日均里程</label>
                    <div class="input-group">
                        <el-input @blur="handleChange('startAvgMileage')" v-model="searchParam.startAvgMileage" maxlength=10 placeholder="≥0的整数(km)" clearable></el-input>
                    </div>
                    <span style="padding-top: 8px;">-</span>
                    <div class="input-group">
                        <el-input @blur="handleChange('endAvgMileage')" v-model="searchParam.endAvgMileage" maxlength=10 placeholder="≥0的整数(km)" clearable></el-input>
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
        <div class="table-box" v-loading="listLoading">
            <p class="summary"> <span>OBD累计里程：</span><span>{{mileage[0]}}km</span>
                <span style="margin-left: 150px;">GPS累计里程：</span><span>{{mileage[1]}}km</span>
            </p>
            <el-table :ref="getRefName" :max-height="tableHeight" :data="list" style="width: 100%" border>
               <el-table-column prop="plate" sortable label="车牌" fixed="left" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toVehicleDetail(scope.row.id)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="imei" sortable label="imei" min-width="120"></el-table-column>
                <el-table-column prop="assetsTypeName" sortable label="资产属性" min-width="120"></el-table-column>
                <el-table-column prop="serviceRegionName" sortable label="服务组织" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column prop="modelName" sortable label="车型" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column sortable label="OBD里程(km)" min-width="120">
                    <el-table-column prop="obdTotalMileage" sortable label="累计里程" min-width="120"></el-table-column>
                    <el-table-column prop="obdAvgMileage" sortable label="日均里程" min-width="120"></el-table-column>
                </el-table-column>
                <el-table-column sortable label="GPS里程(km)" min-width="120">
                    <el-table-column prop="gpsTotalMileage" sortable label="累计里程" min-width="120"></el-table-column>
                    <el-table-column prop="gpsAvgMileage" sortable label="日均里程" min-width="120"></el-table-column>
                </el-table-column>
                <el-table-column sortable label="车速段里程(km)" min-width="120">
                    <el-table-column prop="mileage0020" sortable label="0-20" min-width="120"></el-table-column>
                    <el-table-column prop="mileage2040" sortable label="20-40" min-width="120"></el-table-column>
                    <el-table-column prop="mileage4060" sortable label="40-60" min-width="120"></el-table-column>
                    <el-table-column prop="mileage6090" sortable label="60-90" min-width="120"></el-table-column>
                    <el-table-column prop="mileage90120" sortable label="90-120" min-width="120"></el-table-column>
                    <el-table-column prop="mileage120" sortable label=">120" min-width="120"></el-table-column>
                </el-table-column>

                <el-table-column prop="utilizationRate" sortable label="使用率" min-width="120"></el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import ajax from '@/utils/request'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import $ from 'jquery-slim'
    import {deepClone} from "../../../../utils"

    export default {
        name: 'vehicleMileage',
        mixins: [tool],
        components: {TreeSelect},
        data() {
            return {
                showSearch: false,
                exportBtnShow: this.getCurrentUserAuthority("vehicleMileage/export"),
                currentUserInfo: this.getCurrentUserInfo().organizationList,
                listUrl: "report/vehicleMileage/list",
                companyIds: "",
                dialogForm: {},
                searchParam: {
                },
                pickerOptions:{
                    onPick:({ maxDate, minDate })=>{
                        this.minDate = minDate
                    },
                    disabledDate:(time)=> {
                        var datetime = new Date();
                        let newDate = new Date(datetime.getTime() - 24 * 60 * 60 * 1000 * datetime.getDate())
                        return time.getTime() > newDate.getTime()
                    }
                },
                organization:[],
                seMonth : [],
                mileage : [0,0],
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            this.getLastMonth();
            if (!this.$store.state.isInit) {
                this.getList();
                this.$store.state.isInit = true;
            }
        },
        watch:{
            searchParam:{
                handler(val, oldVal){
                    if(val.startAvgMileage){
                        this.searchParam.startAvgMileage = val.startAvgMileage.replace(/[^\d]/g,'')
                    }
                    if(val.endAvgMileage){
                        this.searchParam.endAvgMileage = val.endAvgMileage.replace(/[^\d]/g,'')
                    }
                    if(this.searchParam.startAvgMileage*1 > this.searchParam.endAvgMileage*1 && this.searchParam.endAvgMileage){
                        //    let startAvgMileage = this.searchParam.startAvgMileage
                        //    this.searchParam.startAvgMileage = this.searchParam.endAvgMileage
                        //    this.searchParam.endAvgMileage = startAvgMileage
                    }
                },
                deep:true
            },
        },
        methods: {
            getListBefore(param){
               /* if (this.organization && this.organization.length == 1) {
                    param.organizationId = this.organization[0];
                }*/
                if(this.seMonth.length > 0){
                    /*param.startTime = this.seMonth[0] +"-01";
                    param.endTime = this.seMonth[1] +"-01";
                    var  endDate = new Date(param.endTime)
                    endDate.setMonth(endDate.getMonth() + 1);
                    param.endTime = endDate.format('yyyy-MM-dd');*/
                    param.startTime = this.seMonth[0];
                    param.endTime = this.seMonth[1];
                }else{
                    param.startTime = '';
                    param.endTime = '';
                }
            },
            changeOrganization(){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            getListAfter(){
                var info={
                    plate :"合计",
                    obdTotalMileage:0,
                    gpsTotalMileage:0,
                    mileage0020:0,
                    mileage2040:0,
                    mileage4060:0,
                    mileage6090:0,
                    mileage90120:0,
                    mileage120:0
                }
                for(var i=0;i<this.list.length;i++){
                    info.obdTotalMileage+= parseFloat(this.list[i].obdTotalMileage);
                    info.gpsTotalMileage+= parseFloat(this.list[i].gpsTotalMileage);
                    info.mileage0020+= parseFloat(this.list[i].mileage0020);
                    info.mileage2040+= parseFloat(this.list[i].mileage2040);
                    info.mileage4060+= parseFloat(this.list[i].mileage4060);
                    info.mileage6090+= parseFloat(this.list[i].mileage6090);
                    info.mileage90120+= parseFloat(this.list[i].mileage90120);
                    info.mileage120+= parseFloat(this.list[i].mileage120);
                }
                info.obdTotalMileage=info.obdTotalMileage.toFixed(2);
                info.gpsTotalMileage=info.gpsTotalMileage.toFixed(2);
                info.mileage0020=info.mileage0020.toFixed(2);
                info.mileage2040=info.mileage2040.toFixed(2);
                info.mileage4060= info.mileage4060.toFixed(2);
                info.mileage6090= info.mileage6090.toFixed(2);
                info.mileage90120=info.mileage90120.toFixed(2);
                info.mileage120=info.mileage120.toFixed(2);
                this.list[this.list.length]=info;
                if(this.page == 1) {
                    this.mileageTotalInfo();
                }
            },
            resetList() {
                this.organization = [];
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',0);
                this.getLastMonth();
                this.getList();
            },
            mileageTotalInfo() {
                ajax.get('report/vehicleMileage/totalMileage',this.getListParam()).then(res=>{
                    if(res.status==0){
                        var mileage=[0,0];
                        for (var i=0;i< res.data.length ;i++) {
                            if( res.data[i].imeiType == 1){
                                mileage[0] =  res.data[i].totalMileage
                            }else if(res.data[i].imeiType == 2){
                                mileage[1] =  res.data[i].totalMileage
                            }
                        }
                        this.$set(this,"mileage",mileage);
                    }
                })
            },toVehicleDetail(id){
                if(id == undefined || id == ''){
                    return;
                }
                let url="/tgpt/vehicle/vehicleInformation/detail/"+id;
                this.$router.push({path:url});
            },
            exportExcel() {
                window.location = this.exportUrl("report/vehicleMileage/export?" + $.param(this.getListParam()));
            },getListParam(){
                let param=deepClone(this.searchParam);

                if (this.organization && this.organization.length == 1) {
                    param.organizationId = this.organization[0];
                }

                if(this.seMonth.length > 0){
                    /*param.startTime = this.seMonth[0] +"-01";
                    param.endTime = this.seMonth[1] +"-01";
                    var  endDate = new Date(param.endTime)
                    endDate.setMonth(endDate.getMonth() + 1);
                    param.endTime = endDate.format('yyyy-MM-dd');*/
                    param.startTime = this.seMonth[0];
                    param.endTime = this.seMonth[1];
                }else{
                    param.startTime = '';
                    param.endTime = '';
                }
                return param;
            },
            getLastMonth() {
                var datetime = new Date();
                let newDate = new Date(datetime.getTime() - 24 * 60 * 60 * 1000 * datetime.getDate())
                var startDate = newDate.format('yyyy-MM');
                this.seMonth=[startDate,startDate];
            },
            handleChange(key){
                if(this.searchParam.startAvgMileage*1 > this.searchParam.endAvgMileage*1 && this.searchParam.endAvgMileage){
                    let startAvgMileage = this.searchParam.startAvgMileage
                    this.searchParam.startAvgMileage = this.searchParam.endAvgMileage
                    this.searchParam.endAvgMileage = startAvgMileage
                }
            }
        }
    }
</script>

