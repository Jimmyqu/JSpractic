<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box min" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <!--<el-input v-model="searchParam.id" placeholder="id"></el-input>-->
                        <el-select
                            v-model="searchParam.imei"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            placeholder="车牌号"
                            :remote-method="remoteMethod"
                            :no-data-text="dataText"
                            :loading="loading">
                            <el-option
                                v-for="(item,i) in vehicles"
                                :key="i"
                                :label="item.plate"
                                :value="item.imei">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group" >
                    <label class="control-label">日期</label>
                    <div class="input-group" style="width: 300px;">
                        <el-date-picker
                            v-model="createDate"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <el-button type="primary" size="small" @click="searchList()">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="info-box">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="小计信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="item blue">
                            <i class="icon1"></i>
                            <div>
                                <div class="key">{{totalForm.records||'0'}}</div>
                                <div class="name">行程数(次)</div>
                            </div>
                        </div>
                        <div class="item green">
                            <i class="icon2"></i>
                            <div>
                                <div class="key">{{totalForm.totalMileage?(totalForm.totalMileage/1000).toFixed(2):'0'}}</div>
                                <div class="name">里程(km)</div>
                            </div>
                        </div>
                        <div class="item purple">
                            <i class="icon3"></i>
                            <div>
                                <div class="key">{{totalForm.avgMileage ? (totalForm.avgMileage/1000).toFixed(2):'0'}}</div>
                                <div class="name">日均里程(km/天)</div>
                            </div>
                        </div>
                        <div class="item orange">
                            <i class="icon4"></i>
                            <div>
                                <div class="key">{{totalForm.totalOil||'0'}}</div>
                                <div class="name">耗油量(L)</div>
                            </div>
                        </div>
                        <div class="item blue">
                            <i class="icon5"></i>
                            <div>
                                <div class="key">{{totalForm.totalTime}}</div>
                                <div class="name">运行时间</div>
                            </div>
                        </div>
                       <!-- <div class="item green">
                            <i class="icon6"></i>
                            <div>
                                <div class="key">{{totalForm.idleTiem||'0'}}</div>
                                <div class="name">怠速时长(h:m:s)</div>
                            </div>
                        </div>-->
                        <div class="item purple">
                            <i class="icon7"></i>
                            <div>
                                <div class="key">{{totalForm.oilMileage||'0'}}</div>
                                <div class="name">油耗(L/100km)</div>
                            </div>
                        </div>
                        <div class="item orange">
                            <i class="icon8"></i>
                            <div>
                                <div class="key">{{totalForm.idleFuel||'0'}}</div>
                                <div class="name">怠速耗油量(L)</div>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="tool-box" style="margin-top: -13px;">
            <div class="operation">
                <el-button class="float-btn" v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button v-show="showDetailBtn" type="text" @click="goDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" label="开始时间" prop="startTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="结束时间" prop="endTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="行程时长(h:m:s)" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{getTime(scope.row.runTime)}}
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="里程(km)" prop="totalMileage" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.totalMileage">
                            {{(scope.row.totalMileage/1000).toFixed(2)}}
                        </template>
                        <template v-else>
                           <span>/</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column min-width="90" label="耗油量(L)" prop="totalOil" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.totalOil">
                            {{(scope.row.totalOil/1000).toFixed(2)}}
                        </template>
                        <template v-else>
                            <span>/</span>
                        </template>
                    </template>
                </el-table-column>
                <!--<el-table-column min-width="90" label="怠速时长" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{getTime(scope.row.idleTiem)}}
                    </template>
                </el-table-column>-->
                <el-table-column min-width="120" label="怠速耗油量(L)" prop="idleFuel" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.idleFuel">
                            {{(scope.row.idleFuel/1000).toFixed(2)}}
                        </template>
                        <template v-else>
                            <span>/</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="油耗(L/100km)" prop="fuelConsumption" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="平均车速(km/h)" prop="speed" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync, secondsToTime, secondsToHour} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleTrackRecord',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                openCollapse:['1'],
                showSearch: false,
                searchParam: {
                    vehicleId : "",
                    createDate : [],
                },
                showDetailBtn : this.getCurrentUserAuthority('vehicleTrackRecord/detail'),
                showAddBtn : true,
                showExportExcelBtn : this.getCurrentUserAuthority('vehicleTrackRecord/export'),
                listUrl : '/obd/obdVehicleTrack/trackRecordList',
                plate : "",
                vehicles : [],
                loading : false,
                vehicleTrackList : [],
                totalForm : {
                },
                createDate:[],
                plate : this.$route.query.plate,
                imei: this.$route.query.imei ? this.$route.query.imei : '',
                dataText:'无数据',
            }
        },
        watch:{
            openCollapse(val){
                document.body.style.overflow = "hidden";
                clearTimeout(this.settimeout)
                this.settimeout = setTimeout(()=>{
                    document.body.style.overflow = '';
                },700)
                this.$nextTick(function () {
                    this.setTableHeight()
                })
            }
        },
        activated(){
            /*if(this.plate){
                this.remoteMethod(this.plate);
            }*/
        },
        mounted() {
            // 查看是否有车牌号
            var startTime=this.$route.query.startTime;
            var endTime=this.$route.query.endTime;
            if(startTime && endTime){
                this.createDate.push(startTime);
                this.createDate.push(endTime);
            }else {
                this.createDate.push(this.currentStartTime());
                this.createDate.push(this.currentEndTime());
            }
            if(this.plate){
                this.remoteMethod(this.plate);
            }
            /*else{
                if(!this.$store.state.isInit) {
                    this.$store.state.isInit = true;
                    this.handleCurrentChange(1);
                }
            }*/
        },
        methods: {
            remoteMethod(plateKeyWord) {
                if (plateKeyWord != '' && plateKeyWord.length >= 3) {
                    ajax.get('obd/obdVehicleStatus/findPlateListByPlateAndImei',{plate:plateKeyWord,imei:this.imei}).then(rs => {
                        if(rs && rs.data.length > 0){
                            this.vehicles = rs.data;
                            /*this.vehicles.idleTiem = secondsToTime(rs.data.idleTiem);*/
                            if(this.plate){
                                if(this.vehicles && this.vehicles.length > 0){
                                    this.searchParam.imei = this.vehicles[0].imei;
                                    this.totalRecord();
                                }
                                this.handleCurrentChange(1);
                                this.plate=''
                            }
                        }else{
                            this.dataText='无数据'
                        }
                    })

                } else if(plateKeyWord != '' && plateKeyWord.length < 3){
                    this.dataText='请输入至少3位'
                    this.vehicles = [];
                }else{
                    this.vehicles = [];
                }
            },
            searchList(){
                if(this.searchParam.vehicleId || this.searchParam.imei){
                    this.handleCurrentChange(1);
                    this.totalRecord();
                }else{
                    this.$message({
                        message: '请先选择车辆',
                        type: 'warning'
                    });
                }
            },
            totalRecord() {
                const params = Object.assign({},this.searchParam);
                this.getListBefore(params);
                ajax.get('obd/obdVehicleTrack/getTrackTotalById', params).then(rs => {
                    if (rs) {
                        this.totalForm = rs.data;
                        if (this.totalForm.idleTiem && this.totalForm.idleTiem > 0){
                            this.totalForm.idleTiem = secondsToTime(rs.data.idleTiem);
                        }
                    }
                })
            },
            getTime(time){
                return secondsToTime(time);
            },
            getListBefore(params) {
                if (this.createDate && this.createDate.length>1) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
            },
            goDetail(row) {
                let url = this.$route.path + '/detail/'+ row.id + '?vehicleId='+ row.vehicleId + '&imei='+row.imei;
                this.$router.push({path:url});
            },
            currentStartTime() {
                var curDate = new Date();
                let date = new Date(curDate.setDate(curDate.getDate()-3));
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = this.zeroFill(date.getMonth() + 1);
                let strDate = this.zeroFill(date.getDate());
                let hour = this.zeroFill(date.getHours());
                let minute = this.zeroFill(date.getMinutes());
                let second = this.zeroFill(date.getSeconds());
                let currentDate = year + seperator1 + month + seperator1 + strDate+' '+hour+':'+minute+':'+second;
                return currentDate;
            },
            currentEndTime() {
                let date = new Date();
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = this.zeroFill(date.getMonth() + 1);
                let strDate = this.zeroFill(date.getDate());
                let hour = this.zeroFill(date.getHours());
                let minute = this.zeroFill(date.getMinutes());
                let second = this.zeroFill(date.getSeconds());
                let currentDate = year + seperator1 + month + seperator1 + strDate+' '+hour+':'+minute+':'+second;
                return currentDate;
            },
            zeroFill(i){
                if (i >= 0 && i <= 9) {
                    return "0" + i;
                } else {
                    return i;
                }
            },
            exportExcel() {
                var params=this.searchParam;
                params.plate = this.$route.query.plate;
                if (this.createDate && this.createDate.length>1) {
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                window.location = this.exportUrl("obd/obdVehicleTrack/excel?" + $.param(params));
            },resetList(){
                this.searchParam = {};
                this.createDate = [];
                this.searchList();
            },
        }
    }
</script>

<style scoped lang="scss">
    @import '@/styles/vehicleTrackRecord.scss';
</style>
