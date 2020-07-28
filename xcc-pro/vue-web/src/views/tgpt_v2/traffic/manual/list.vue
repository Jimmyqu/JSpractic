<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group" >
                    <label class="control-label">车牌</label>
                    <div class="input-group" >
                        <el-select
                            v-model="vehicleParam.plate"  filterable  remote reserve-keyword placeholder="请输入车牌号"
                            :remote-method="remoteMethod" @change="getVehicleModalList" :no-data-text="dataText">
                            <el-option
                                v-for="item in plateList" :key="item.plate" :label="item.plate" :value="item.plate">
                            </el-option>
                        </el-select>
                    </div>
                </div>



                <div class="form-group" >
                    <label class="control-label" >车型</label>
                    <div class="input-group" >
                        <el-input :disabled="true" v-model="vehicleParam.versionName" clearable ></el-input>
                    </div>
                </div>



                <div class="form-group" >
                    <label class="control-label">车架号</label>
                    <div class="input-group" >
                        <el-input :disabled="true" v-model="vehicleParam.vin" clearable ></el-input>
                    </div>
                </div>


                <div class="form-group" >
                    <label class="control-label">发动机号</label>
                    <div class="input-group" >
                        <el-input :disabled="true" v-model="vehicleParam.engineNo" clearable ></el-input>
                    </div>
                </div>


                <div class="form-group" >
                    <label class="control-label"  >车辆类型</label>
                    <div class="input-group" >
                        <el-input :disabled="true" v-model="vehicleParam.type" clearable ></el-input>
                    </div>
                </div>
            </div>


            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>

        </div>

        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="getSynchronizationDate()">查询</el-button>
                <el-button size="mini" @click="vehicleParam={}">重置</el-button>
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

        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column min-width="140" label="违章代码" prop="code" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章时间" prop="violationTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章地点" prop="place" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章行为" prop="reason" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="扣分" prop="score" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="罚款" prop="price" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="状态" prop="violationStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                    {{scope.row.violationStatus=='1'?"未处理":"已处理"}}
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="更新时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员" prop="driverName" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>

    </div>


</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    export default {
        name: "trafficManualList",
        mixins: [tool],
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1"],
                showSearch: true,
                exportShow : this.getCurrentUserAuthority("manual/export"),
                vehicleParam: {
                },
                searchParam:{},
                plateList:[],
                loading: false,
                listUrl: 'traffic/violationrecord/manual',
                dataText:'无数据'
            }
        },
        methods: {
            open() {
                vehicleParam={
                    vehicleId:"",
                    plate:"",
                    versionName:"",
                    vin:"",
                    engineNo:"",
                    driverId:""
                };
            },
            remoteMethod(query) {
                if (query.length>2) {
                    setTimeout(() => {
                        ajax.get('traffic/violationrecord/likeVehicle/' + query).then(res => {
                            if(res.data && res.data.length){
                                this.plateList = res.data;
                            }else{
                                this.dataText = '无数据'
                                this.plateList = [];
                            }
                        })
                    }, 200);
                } else {
                    this.dataText = '请输入至少3位'
                    this.plateList = [];
                }
            },getVehicleModalList(){
                var plate=this.vehicleParam.plate;
                var plateList=this.plateList;
                for(var b in plateList){
                    if(plateList[b].plate==plate){
                        this.vehicleParam=plateList[b];
                        return;
                    }
                }
            },
            getSynchronizationDate(){
                var vehicleId=this.vehicleParam.vehicleId;
                if (vehicleId != undefined && vehicleId != '' ) {
                   ajax.get('traffic/violationrecord/findSave/' + vehicleId).then(res => {
                       this.$confirm(res.data, '查询结果', {
                           confirmButtonText: '查看',
                           cancelButtonText: '取消',
                           type: 'warning'
                       }).then(() => {
                           this.searchParam.id=vehicleId;
                           this.handleCurrentChange(1);
                       }).catch(() => {});

                    })
                }else{
                    alert("请先选择车辆")
                }

            },
            exportData(){
                var vehicleId=this.vehicleParam.vehicleId;
                if (vehicleId != undefined &&vehicleId != 'undefined' && vehicleId != '' ) {
                    console.log(vehicleId)
                    var vehicleParam={id:vehicleId}
                    location.href = this.exportUrl("traffic/violationrecord/manual/excel?" + $.param(vehicleParam));
                }else{
                    alert("请先选择车辆")
                }

            }

        },
        mounted() {

        }

    }
</script>
