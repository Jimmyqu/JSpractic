<template>
    <div class="app-container white-bg list-panel newList-panel special-table" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrgId"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">维保单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.maintenanceNo" placeholder="维保单号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">发生日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="happenDate"
                            @change="happenDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">维修厂名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.repairerName" placeholder="维修厂名称" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">维保类型</label>
                    <div class="input-group">
                        <!--<el-select v-model="searchParam.type" placeholder="请选择">-->
                            <!--<el-option-->
                                <!--v-for="item in types"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <el-select v-model="typeAry" multiple placeholder="请选择" clearable>
                            <el-option
                                v-for="item in types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleModelInfoName" placeholder="车型" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.serverName" placeholder="服务客户" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">经手人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.brokerage" placeholder="经手人" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">费用类型</label>
                    <div class="input-group">
                    <el-select v-model="searchParam.costType" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in costTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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
            <p>
                <span style="margin-left: 20px;">车辆总数: {{sumData.vehCount}}</span>
                <span style="margin-left: 20px;">维修总费用: {{sumData.wxPrice}}</span>
                <span style="margin-left: 20px;">保养总费用: {{sumData.byPrice}}</span>
                <span style="margin-left: 20px;">维保总费用: {{sumData.sumPrice}}</span>
                <span style="margin-left: 20px;">故障总费用: {{sumData.gzPrice}}</span>
            </p>

            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%" :span-method="_spanMethod">
                <el-table-column fixed min-width="140" label="所属组织" prop="organizationName" sortable
                                 show-overflow-tooltip></el-table-column>

                <el-table-column fixed sortable show-overflow-tooltip prop="maintenanceNo" label="维保单号" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">
                            {{scope.row.maintenanceNo}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="150" label="发生日期" prop="arriveRepairTime" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修厂名称" prop="repairerName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维保类型" prop="type" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车牌号" prop="plate" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="排量" prop="displacement" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="此次公里数" prop="repairMileage" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="上次送修公里数(km)" prop="lastRepairMileage" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="上次送修时间" prop="lastArriveRepairTime" sortable
                                 show-overflow-tooltip></el-table-column>

                <el-table-column min-width="140" label="服务客户" prop="serverName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="工时费" prop="manHourPrice" sortable
                                 show-overflow-tooltip></el-table-column>

                <el-table-column label="配件项目">
                    <el-table-column min-width="140" label="配件名称" prop="accessoriesName" sortable
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="配件数量" prop="amount" sortable
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="配件单价" prop="price" sortable
                                     show-overflow-tooltip></el-table-column>

                    <el-table-column min-width="140" label="配件合计" prop="accessoriesPrice" sortable
                                     show-overflow-tooltip></el-table-column>
                </el-table-column>

                <el-table-column min-width="140" label="总计金额" prop="sumPrice" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="结算日期" prop="settlementDate" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="结算单号" prop="maintenanceNo" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="公司费用/代垫费用" prop="costType" sortable
                                 show-overflow-tooltip>

                    <template slot-scope="scope">
                        <span v-if="scope.row.costType==1">公司费用</span>
                        <span v-else-if="scope.row.costType==2">代垫费用</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="经手人签名" prop="brokerage" sortable
                                 show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import ScrollPane from "../../../../components/ScrollPane/index";

    export default {
        name: 'vehicleMaintenanceReport',
        mixins: [tool],
        components: {ScrollPane, TreeSelect},
        data() {
            return {
                showSearch: false,
                orgIds: [],
                createDate: [],
                happenDate:[],
                sumData: {},
                searchParam: {},
                showExportExcelBtn: this.getCurrentUserAuthority('vehicleMaintenanceReport/exportExcel'),
                listUrl: '/report/vehicleMaintenance/vmf',
                types: [
                    {value: '1', label: '事故维修'},
                    {value: '2', label: '常规保养'},
                    {value: '3', label: '故障维修'}
                ],
                costTypes: [
                    {value: '1', label: '公司费用'},
                    {value: '2', label: '代垫费用'}
                ],
                organizationIds:[],
                typeAry: []
            }
        },
        activated: function () {
            this.getList();
        },
        mounted() {
            debugger
            var type = this.$route.query.type;
            if(type){
                this.typeAry = type.split(",");
            }
            var plate = this.$route.query.plate;
            if(plate){
                this.searchParam.plate = plate;
            }
            var regionId = this.$route.query.regionId;
            if(regionId){
                this.organizationIds = [regionId];
                this.searchParam.organizationId = regionId;
            }
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.happenDate = [startTime,endTime];
                this.searchParam.happenStartDate = startTime;
                this.searchParam.happenEndDate = endTime;
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                if(this.typeAry && this.typeAry.length > 0){
                    params.type = this.typeAry.toString();
                }else {
                    params.type = "";
                }
               /* if (this.organizationIds){
                    params.organizationId = this.organizationIds[0];
                }else{
                    params.organizationId =''
                }*/

            },
            changeOrgId(){
                if(this.organizationIds && this.organizationIds.length > 0){
                    this.searchParam.organizationId = this.organizationIds[0];
                }else{
                    this.searchParam.organizationId = '';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            getListAfter() {
                this.getSumData();

                let newList = [];

                let obj;
                let newObj;
                for (let i = 0, len = this.list.length; i < len; i++) {
                    obj = this.list[i];

                    if (!obj.details || obj.details.length==0) {
                        newList.push(obj);
                        continue;
                    }

                    for (let j = 0, len2 = obj.details.length; j < len2; j++) {
                        newObj = Object.assign({}, obj, obj.details[j]);
                        delete newObj.details;

                        if (j == 0)
                            newObj.rowSpan = len2;
                        else
                            newObj.rowSpan = '0';
                        newList.push(newObj);
                    }
                }

                this.list = newList;
            },
            getSumData() {
                const params = Object.assign({}, this.searchParam);
                if (this.organizationIds){
                    params.organizationId = this.organizationIds[0];
                }else{
                    params.organizationId =''
                }
                ajax.get('/report/vehicleMaintenance/vmf/count', params).then(
                    res => {
                        this.sumData = res.data;
                    }
                )
            },
            happenDateChange() {
                if(this.happenDate && this.happenDate.length>0){
                    let createDate = this.happenDate;
                    this.searchParam.happenStartDate = createDate[0]+" 00:00:00";
                    this.searchParam.happenEndDate = createDate[1]+" 23:59:59";
                }else{
                    this.searchParam.happenStartDate="";
                    this.searchParam.happenEndDate="";
                }
            },
            resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',0);
                this.typeAry = [];
                this.happenDate=[];
                this.organizationIds = [];
                this.getList();
            },
            exportExcel() {
                var params=this.searchParam;
                if (this.organizationIds){
                    params.organizationId = this.organizationIds[0];
                }else{
                    params.organizationId =''
                }
                window.location = this.exportUrl("report/vehicleMaintenance/vmf/excel?" + $.param(params));
            },
            _spanMethod({row, column, rowIndex, columnIndex}) {
                if(!row.rowSpan){
                    return{rowspan: 1, colspan: 1};
                }
                else{
                    if (columnIndex > 12 && columnIndex < 16)
                        return{rowspan: 1, colspan: 1};
                    return {
                        rowspan: +row.rowSpan,
                        colspan: 1
                    };
                }
            },
            toDetail(row){
                let url = '/tgpt/traffic/maintenanceBill/detail/' + row.id;
                this.$router.push({path:url});
            }
        }
    }
</script>
<style>
    .ct_tab_wrap {
        width: 100%;
        overflow: auto;
    }
</style>

