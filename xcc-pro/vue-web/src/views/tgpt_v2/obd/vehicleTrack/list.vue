<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择">
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organIds" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyword" clearable placeholder="车牌、VIN、IMEI"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车系</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleSeries" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">排量</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.displacement" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">总里程(km)</label>
                    <div class="input-group">
                        <el-input style="width: 40%" v-model="searchParam.totalMileage1" clearable ></el-input>
                        <label class="control-label">到</label>
                        <el-input style="width: 40%" v-model="searchParam.totalMileage2" clearable ></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">总行驶时间(h)</label>
                    <div class="input-group">
                        <el-input style="width: 40%" v-model="searchParam.totalTime1" clearable></el-input>
                        <label class="control-label">到</label>
                        <el-input style="width: 40%" v-model="searchParam.totalTime2" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">总耗油量(L)</label>
                    <div class="input-group">
                        <el-input style="width: 40%" v-model="searchParam.totalOil1" clearable></el-input>
                        <label class="control-label">到</label>
                        <el-input style="width: 40%" v-model="searchParam.totalOil2" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">总怠速时间(h)</label>
                    <div class="input-group">
                        <el-input style="width: 40%" v-model="searchParam.idleTiem1" clearable></el-input>
                        <label class="control-label">到</label>
                        <el-input style="width: 40%" v-model="searchParam.idleTiem2" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">总行程数(条)</label>
                    <div class="input-group">
                        <el-input style="width: 40%" v-model="searchParam.trackCount1" clearable></el-input>
                        <label class="control-label">到</label>
                        <el-input style="width: 40%" v-model="searchParam.trackCount2" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">

                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>

                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                        <el-button v-show="showDetailBtn" type="text" @click="vehicleTrackRecord(scope.row)">行程记录</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="100" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="服务组织" prop="companyName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="总里程(km)" prop="totalMileage" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{(scope.row.totalMileage / 1000).toFixed(2)}}
                    </template>
                </el-table-column>
				<el-table-column min-width="120" label="总油耗量(L)" prop="totalOil" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="总行程数(次)" prop="trackCount" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="总行程时间" prop="totalTimeStr" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="总怠速时间" prop="idleTiemStr" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="70" label="排量" prop="displacement" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="90" label="车辆所属" prop="assetsTypeName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="150" label="最后行驶时间" prop="lastTime" sortable show-overflow-tooltip></el-table-column>

            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleTrack',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showDetailBtn: this.getCurrentUserAuthority('vehicleTrack/detail'),
                showExportExcelBtn: this.getCurrentUserAuthority('vehicleTrack/export'),
                listUrl: 'obd/obdVehicleTrackSum',
                organIds:[]
            }
        },
        activated: function () {
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {

            /*跳转行程记录*/
            vehicleTrackRecord(row){
                let url = `/tgpt_v2/obd/vehicleTrackRecord`;
                this.$router.push({path: url , query:{plate:row.plate , imei:row.imei}});
            },

            changeOrganization(data){
                if(this.organIds && this.organIds.length==1)
                    this.searchParam.organId=this.organIds[0];
                else{
                    this.searchParam.organId="";
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            resetList(){
                this.searchParam={}
                this.$set(this.searchParam,'organCascade',false);
                this.organIds=[]
                this.handleCurrentChange(1);
            },
            exportExcel() {
                var params=this.searchParam;
                if(this.organIds!=null && this.organIds.length>0){
                    params.organId=this.organIds[0]
                }
                window.location = this.exportUrl("obd/obdVehicleTrackSum/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

