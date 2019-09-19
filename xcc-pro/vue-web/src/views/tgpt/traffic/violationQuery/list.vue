<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">查询时间范围</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="violationDate"
                            @change="violationDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车载设备</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipment" clearable placeholder="请选择">
                            <el-option label="有" :value="0"></el-option>
                            <el-option label="无" :value="1"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">查询结果</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.result" clearable placeholder="请选择">
                            <el-option label="有违章" :value="1"></el-option>
                            <el-option label="无违章" :value="2"></el-option>
                            <el-option label="车辆信息错误" :value="3"></el-option>
                            <el-option label="交管服务器错误" :value="4"></el-option>
                            <el-option label="不支持查询的车辆" :value="5"></el-option>
                            <el-option label="查询出错" :value="6"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择">
                            <el-option label="自有" :value="1"></el-option>
                            <el-option label="租赁" :value="2"></el-option>
                            <el-option label="挂靠" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="providerOrganization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeProviderOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.providerOrganCascade" :disabled="!searchParam.providerCompanyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择">
                            <el-option label="未投入运营" :value="1"></el-option>
                            <el-option label="待租" :value="2"></el-option>
                            <el-option label="已租" :value="3"></el-option>
                            <el-option label="待出车" :value="4"></el-option>
                            <el-option label="维修保养" :value="5"></el-option>
                            <el-option label="调拨中" :value="6"></el-option>
                            <el-option label="待处置" :value="7"></el-option>
                            <el-option label="申请出售中" :value="8"></el-option>
                            <el-option label="出售确认中" :value="9"></el-option>
                            <el-option label="申请处置中" :value="10"></el-option>
                            <el-option label="申请使用中" :value="11"></el-option>
                            <el-option label="已出售" :value="12"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="车牌"></el-input>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
				<el-table-column min-width="140" label="查询时间" prop="queryTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column  min-width="120" label="资产属性"  prop="assetsType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车辆状态" prop="vehicleStatus" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车载设备" prop="equipment" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="具体原因" prop="resultText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="查询结果" prop="queryresult" sortable show-overflow-tooltip></el-table-column>

            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficViolationQuery',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                violationDate:[],
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                showSearch: false,
                inStorageShow:false,
                outStorageShow:false,
                installShow:false,
                inStorage:{},
                outStorage:{},
                install:{},
                providerOrganization:[],
                serviceOrganization:[],
                updateDate:[],
                searchParam: {
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: this.getCurrentUserAuthority('trafficViolationQuery/exportExcel'),
                equipmentModalList:[],
                listUrl: 'traffic/coreVehicleViolationQuery/'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquipmentModalList();
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'providerOrganCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.providerOrganization=[];
                this.serviceOrganization=[];
                this.violationDate=[];
                this.getList();
            },
            changeProviderOrganization(data){
                if(this.providerOrganization && this.providerOrganization.length==1){
                    this.searchParam.providerCompanyId=this.providerOrganization[0];
                }else{
                    this.searchParam.providerCompanyId='';
                    this.$set(this.searchParam,'providerOrganCascade',false);
                }
            },
            changeServiceOrganization(data){
                if(this.serviceOrganization && this.serviceOrganization.length==1){
                    this.searchParam.serviceRegionId=this.serviceOrganization[0];
                }else{
                    this.searchParam.serviceRegionId='';
                    this.$set(this.searchParam,'serviceOrganCascade',false);
                }
            },
            updateDateChange() {
                if(this.updateDate && this.updateDate.length>0){
                let updateDate = this.updateDate;
                this.searchParam.startViolationTime = updateDate[0] + ' 00:00:00';
                this.searchParam.endViolationTime = updateDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startViolationTime="";
                    this.searchParam.endViolationTime="";
                }
            },

            importExcel() {
                this.importVisibleErrorId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
            exportExcel() {
                window.location = this.exportUrl("traffic/coreVehicleViolationQuery/excel?" + $.param(this.searchParam));
            },
            violationDateChange() {
                if(this.violationDate && this.violationDate.length>0){
                    let violationDate = this.violationDate;
                    this.searchParam.startViolationTime = violationDate[0] + ' 00:00:00';
                    this.searchParam.endViolationTime = violationDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startViolationTime="";
                    this.searchParam.endViolationTime="";
                }
            }

        }
    }
</script>

