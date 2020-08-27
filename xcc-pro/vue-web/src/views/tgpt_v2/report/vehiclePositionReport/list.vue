<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="searchParam.time"
                            type="datetime"
                            placeholder="时间"
                            value-format="yyyy-MM-dd HH:mm">
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
                            <el-option label="个人" value="4"></el-option>
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
                <el-table-column  prop="assetsTypeName" sortable label="资产属性" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="companyName" sortable label="服务组织" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="seriesName" sortable label="车型" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="vin" sortable label="车架号" min-width="170" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="position" sortable label="定位有效性" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="localtionTime" sortable label="定位时间" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="address" sortable label="定位地点" min-width="170" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'vehiclePositionReport',
        mixins: [tool],
        components: { TreeSelect },
        data: function () {
            return {
                exportBtnShow:this.getCurrentUserAuthority("vehiclePositionReport/exportExcel"),
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                listUrl:"obd/vehiclePositionReport/list",
                companyIds:"",
                dialogForm:{},
                searchParam: {},
                organization:[],
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam = {};
                this.companyIds = "";
                this.organization=[];
                this.getList();

            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId = this.organization[0];
                }else {
                    delete this.searchParam.organizationId;
                }
            },
            exportExcel(){
                window.location = this.exportUrl("obd/vehiclePositionReport/export?" + $.param(this.searchParam));
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

