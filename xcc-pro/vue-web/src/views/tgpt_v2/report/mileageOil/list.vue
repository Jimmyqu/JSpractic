<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="dateTime"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :picker-options="pickerOptions"
                            :clearable="false"
                            @blur="handleBlur">
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
                                     url="admin/organization/tree?noManager=noManager"
                                     @change="changeOrganization" ></tree-select>
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
                    <label class="control-label">日均油耗</label>
                    <div class="input-group">
                        <el-input @blur="handleChange('startAvgOil')" v-model="searchParam.startAvgOil" maxlength=10 placeholder="≥0的整数(km)" clearable></el-input>
                    </div>
                    <span style="padding-top: 8px;">-</span>
                    <div class="input-group">
                        <el-input @blur="handleChange('endAvgOil')" v-model="searchParam.endAvgOil"  maxlength=10 placeholder="≥0的整数(km)" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">百公里油耗</label>
                    <div class="input-group">
                        <el-select v-model="fuelOil" clearable placeholder="请选择">
                            <el-option label="<5" :value="1"></el-option>
                            <el-option label="5-8" :value="2"></el-option>
                            <el-option label="8-10" :value="3"></el-option>
                            <el-option label="10-15" :value="4"></el-option>
                            <el-option label=">15" :value="5"></el-option>
                        </el-select>
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
            <p class="summary"> <span>总耗油量：</span><span>{{mileageOilTotal.totalOil}}L</span>
                <span style="margin-left: 100px;">怠速耗油量：</span><span>{{mileageOilTotal.idleOil}}L</span>
                <span style="margin-left: 100px;">行驶耗油量：</span><span>{{mileageOilTotal.travelOil}}L</span>
                <span style="margin-left: 100px;">登记加油量：</span><span>{{mileageOilTotal.registerOil}}L</span>
            </p>
            <el-table :ref="getRefName" :max-height="tableHeight" :data="list" style="width: 100%" border>
                <el-table-column prop="plate" sortable label="车牌" fixed="left" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toVehicleDetail(scope.row.id)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="imei" sortable label="IMEI" min-width="120"></el-table-column>
                <el-table-column prop="assetsTypeName" sortable label="资产属性" min-width="120"></el-table-column>
                <el-table-column prop="serviceRegionName" sortable label="服务组织" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column prop="modelName" sortable label="车型" min-width="170" show-overflow-tooltip></el-table-column>

                <el-table-column prop="totalMileage" sortable label="里程(km)" min-width="120"></el-table-column>
                <el-table-column prop="totalOil" sortable label="总油耗量(L)" min-width="120"></el-table-column>

                <el-table-column prop="avgOil" sortable label="日均油耗量(L)" min-width="120"></el-table-column>
                <el-table-column prop="idleOil" sortable label="怠速油耗量(L)" min-width="120"></el-table-column>

                <el-table-column prop="idleOilPercentage" sortable label="怠速油耗占比(%)" min-width="130"></el-table-column>
                <el-table-column prop="travelOil" sortable label="行驶油耗量(L)" min-width="130"></el-table-column>
                <el-table-column prop="travelOilPercentage" sortable label="行驶油耗占比(%)" min-width="130"></el-table-column>
                <el-table-column prop="fuelOil" sortable label="百公里油耗量(L/100km)" min-width="170"></el-table-column>
                <el-table-column prop="registerOil" sortable label="登记加油量(L)" min-width="120"></el-table-column>

            </el-table>
        </div>
   <!-- </div>

    <div class="app-container white-bg list-panel" v-cloak>-->
        <div class="chart-panel">
            <h3>每日里程</h3>
            <div id="mileage-chart1"></div>
            <div class="tip">
                <span>
                    统计车辆数：
                    <em>{{mileage.vehicleNum}}</em>
                </span>
                <span>
                    统计天数：
                    <em>{{mileage.dayNum}}</em>
                </span>
                <span>
                    小计里程总数：
                    <em>{{mileage.totalMileage}}km</em>
                </span>
                <el-button size="small" type="primary" class="defaultSearchButton" style="float: right;margin-right: 50px;" @click="toList(2)">明细</el-button>
            </div>
        </div>
        <div class="chart-panel">
            <h3>每日油耗<p><span><i class='spot-green'></i>总耗油量</span><span><i class="spot-red"></i>怠速耗油量</span></p></h3>
            <div id="mileage-chart2"></div>
            <div class="tip">
                <span>
                    统计车辆数：
                    <em>{{oil.vehicleNum}}</em>
                </span>
                <span>
                    统计天数：
                    <em>{{oil.dayNum}}</em>
                </span>
                <span>
                    小计总耗油量：
                    <em>{{oil.totalOil}}L</em>
                </span>
                <el-button size="small" type="primary" class="defaultSearchButton" style="float: right;margin-right: 50px;" @click="toList(1)">明细</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import TreeSelect from "@/components/TreeSelect/index";
import ajax from "@/utils/request";
import { tool } from "@/utils/common";
import { startProcessAsync } from "@/utils/index";
import $ from "jquery-slim";
import { mapGetters } from 'vuex';
import {deepClone} from "../../../../utils";

export default {
    name: "mileageOil",
    mixins: [tool],
    components: { TreeSelect },
    data() {
        return {
            showSearch: false,
            exportBtnShow: this.getCurrentUserAuthority("mileageOil/export"),
            listUrl: "report/mileageOil/list",
            companyIds: "",
            dialogForm: {},
            searchParam: {
            },
            pickerOptions:{
                onPick:({ maxDate, minDate })=>{
                    this.minDate = minDate
                },
                disabledDate:(time)=> {
                    return time.getTime() > Date.now()-24*60*60*1000
                }
            },
            organization:[],
            fuelOil:'',
            dateTime:[],
            mileageOilTotal:{},
            mileage:{},
            oil:{},
            mChart1:null,
            mChart2:null
        };
    },
    activated() {
        this.getList();
    },
    computed:{
        ...mapGetters([
            'sidebar'
        ]),
        sidebar() {
            return this.$store.state.app.sidebar.opened
        },
    },
    watch:{
        searchParam:{
            handler(val, oldVal){
                if(val.startAvgOil){
                    this.searchParam.startAvgOil = val.startAvgOil.replace(/[^\d]/g,'')
                }
                if(val.endAvgOil){
                    this.searchParam.endAvgOil = val.endAvgOil.replace(/[^\d]/g,'')
                }
            },
            deep:true
        },
        sidebar(val,olval){
            setTimeout(()=>{
                this.mChart1.resize();
                this.mChart2.resize();
            },300)
        }
    },
    mounted() {
        this.getLastWeek();
        if (!this.$store.state.isInit) {
            this.$store.state.isInit = true;
            this.getList();
        }
    },
    methods: {
        getListBefore(param){
            if (this.organization && this.organization.length == 1) {
                param.organizationId = this.organization[0];
            }
            if(this.dateTime.length > 0){
                param.startTime = this.dateTime[0];
                param.endTime = this.dateTime[1];
                var  endDate = new Date(param.endTime)
                endDate.setDate(endDate.getDate()+1);
                param.endTime = endDate.format('yyyy-MM-dd');
            }else{
                param.startTime = '';
                param.endTime = '';
            }
            switch (this.fuelOil) {
                case 1:
                    param.startFuelOil = 0;
                    param.endFuelOil = 5;
                    break;
                case 2:
                    param.startFuelOil = 5;
                    param.endFuelOil = 8;
                    break;
                case 3:
                    param.startFuelOil = 8;
                    param.endFuelOil = 10;
                    break;
                case 4:
                    param.startFuelOil = 10;
                    param.endFuelOil = 15;
                    break;
                case 5:
                    param.startFuelOil = 15;
                    param.endFuelOil = '';
                    break;
                default:
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
                totalOil:0,
                idleOil:0,
                travelOil:0,
                registerOil:0
            }
            for(var i=0;i<this.list.length;i++){
                info.totalOil+= parseFloat(this.list[i].totalOil);
                info.idleOil+= parseFloat(this.list[i].idleOil);
                info.travelOil+= parseFloat(this.list[i].travelOil);
                info.registerOil+= parseFloat(this.list[i].registerOil);
            }
            info.totalOil=info.totalOil.toFixed(2);
            info.idleOil=info.idleOil.toFixed(2);
            info.travelOil=info.travelOil.toFixed(2);
            info.registerOil=info.registerOil.toFixed(2);
            this.list[this.list.length]=info;
            if(this.page == 1){
                this.totalOilInfo();
                this.dailyMileageInfo();
                this.dailyOilInfo()
            }
        },resetList() {
            this.organization = [];
            this.searchParam={};
            this.$set(this.searchParam,'organCascade',0);
            this.getLastWeek();
            this.getList();

        },totalOilInfo() {
            ajax.get('report/mileageOil/totalOil',this.getListParam()).then(res=>{
                if(res.status==0){
                    this.$set(this,"mileageOilTotal",res.data);
                }
            })
        },dailyMileageInfo() {
            ajax.get('report/mileageOil/dailyMileage',this.getListParam()).then(res=>{
                if(res.status==0){
                    this.$set(this,"mileage",res.data);
                    this.mChart1 = echarts.init(document.getElementById("mileage-chart1"));
                    this.mChart1.setOption(this.getLineChartOpt(this.handleChartData(res.data.list)));
                     window.onresize = () => {
                        if(this.mChart2){
                            this.mChart2.resize();
                        }
                        if(this.mChart1){
                            this.mChart1.resize();
                        }
                    };
                }
            })
        },dailyOilInfo() {
            ajax.get('report/mileageOil/dailyOil',this.getListParam()).then(res=>{
                if(res.status==0){
                    this.$set(this,"oil",res.data);
                    this.mChart2 = echarts.init(document.getElementById("mileage-chart2"));
                    this.mChart2.setOption(this.getLineChartOpt(this.handleChartData(res.data.list),true));
                    window.onresize = () => {
                        if(this.mChart2){
                            this.mChart2.resize();
                        }
                        if(this.mChart1){
                            this.mChart1.resize();
                        }
                    };
                }
            })
        }, exportExcel() {
            window.location = this.exportUrl("report/mileageOil/export?" + $.param(this.getListParam()));
        },getListParam(){
            let param=deepClone(this.searchParam);
            if (this.organization && this.organization.length == 1) {
                param.organizationId = this.organization[0];
            }
            if(this.dateTime.length > 0){
                param.startTime = this.dateTime[0];
                param.endTime = this.dateTime[1];
                var  endDate = new Date(param.endTime)
                endDate.setDate(endDate.getDate()+1);
                param.endTime = endDate.format('yyyy-MM-dd');
            }else{
                param.startTime = '';
                param.endTime = '';
            }

            if(this.fuelOil == ''){
                return param;
            }
            switch (this.fuelOil) {
                case 1:
                    param.startFuelOil = 0;
                    param.endFuelOil = 5;
                    break;
                case 2:
                    param.startFuelOil = 5;
                    param.endFuelOil = 8;
                    break;
                case 3:
                    param.startFuelOil = 8;
                    param.endFuelOil = 10;
                    break;
                case 4:
                    param.startFuelOil = 10;
                    param.endFuelOil = 15;
                    break;
                case 5:
                    param.startFuelOil = 15;
                    param.endFuelOil = '';
                    break;
                default:
            }
            return param;
        },
        handleChange(key){
            if(this.searchParam.startAvgOil*1 > this.searchParam.endAvgOil*1 && this.searchParam.endAvgOil){
                let startAvgOil = this.searchParam.startAvgOil
                this.searchParam.startAvgOil = this.searchParam.endAvgOil
                this.searchParam.endAvgOil = startAvgOil
            }
        },
        toVehicleDetail(id){
            if(id == undefined || id == ''){
                return;
            }
            let url="/tgpt/vehicle/vehicleInformation/detail/"+id;
            this.$router.push({path:url});
        },getLastWeek() {
            var datetime = new Date();
            datetime.setDate(datetime.getDate()-1);
            var endDate = datetime.format('yyyy-MM-dd');
            datetime.setDate(datetime.getDate()-6);
            var startDate = datetime.format('yyyy-MM-dd');
            this.dateTime=[startDate,endDate];
        },toList(type){
            let url;
            let param = JSON.stringify(this.getListParam());
            if (type == 1){
                url = '/tgpt_v2/report/mileageOil/oilDetail?param='+param;
            }else if (type == 2){
                url = '/tgpt_v2/report/mileageOil/mileageDetail?param='+param;
            }
            this.$router.push({path:url});
        },handleChartData(list){
            let data = {
                date:[],
                mileage:[],
                total:[],
                idling:[]
            };
            for (let i=0;i<list.length;i++) {
                const item = list[i]
                data.date.push(item.date)
                if(item.totalMileage != undefined){
                    data.mileage.push(item.totalMileage)
                }
                if(item.totalOil != undefined || item.idleOil != undefined){
                    data.total.push(item.totalOil)
                    data.idling.push(item.idleOil)
                }
            }
            return data
        },
        getLineChartOpt(data,type) {
            let options = {
                backgroundColor: '#FBFBFB',
                tooltip : {
                    trigger: 'axis',
                    formatter: !type?"日期：{b}<br/>里程：{c}km":"日期：{b}<br/><i class='spot-green'></i>总耗油量：{c}L<br/><i class='spot-red'></i>怠速耗油量：{c1}L"
                },
                grid: {
                    x: 70,  // 左
                    y: 20, // 上
                    x2: 50, // 右
                    y2: 30, //下
                    borderWidth: 1
                },
                calculable : true,
                xAxis :{
                        axisLabel:{
                            interval:0,
                            rotate:data.date.length >15?40:0
                        },
                        boundaryGap : false,
                        data : data.date
                },
                yAxis : {
                        splitNumber:4,
                        type : 'value',
                        axisLine:{
                            lineStyle :{
                            }
                        }
                    },
                series : []
            };
            const areaStyle = {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: 'rgba(213, 238, 246, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(213, 238, 246, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            }
            if(!type){
                options.series.push({
                    type:'line',
                    color:['#5582FD'],
                    data:data.mileage,
                    areaStyle: areaStyle,
                    symbolSize: 4,
                })
            }

            if(type){
                options.series.push({
                    type:'line',
                    color:['#38B7FE'],
                    data:data.total,
                    areaStyle: areaStyle,
                    symbolSize: 4,
                },{
                    type:'line',
                    color:['#FE0302'],
                    data:data.idling,
                    areaStyle: areaStyle,
                    symbolSize: 4,
                })

            }
            return options
        },
    }
};
</script>

<style scoped lang="scss">
.chart-panel {
    padding: 15px;
    #mileage-chart1,
    #mileage-chart2 {
        min-height: 173px;
        max-height: 173px;
        padding: 0px;
        position: relative;
    }
    > h3 {
        margin: 15px 0px 15px 0px;
        padding-bottom: 5px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
        font-weight: normal;
        p{
            float: right;
            font-size: 14px;
            margin:0 20px 0 0;
            vertical-align: top;
            span{
                margin-right: 10px;
            }
        }
    }
    .tip {
        margin-top: 7px;
        span{
            margin-right: 50px;
        }
        em {
            font-style: normal;
            color: #ff6666;
            font-weight: bold;
        }
    }

}
</style>
