<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择">
                            <el-option value="1" label="自有"></el-option>
                            <el-option value="2" label="租赁"></el-option>
                            <el-option value="3" label="挂靠"></el-option>
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
                        <el-checkbox v-model="searchParam.serviceOrganCascade"  :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">是否违章</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.isViolation" clearable placeholder="请选择">
                            <el-option value="1" label="是"></el-option>
                            <el-option value="2" label="否"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">违章天数</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.violationTime" clearable placeholder="请选择" >
                            <el-option value="1" label="10天以下"></el-option>
                            <el-option value="2" label="10到30天"></el-option>
                            <el-option value="3" label="30天以上"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择">
                            <el-option label="未投入运营" value="1"></el-option>
                            <el-option label="待租" value="2"></el-option>
                            <el-option label="已租" value="3"></el-option>
                            <el-option label="待出车" value="4"></el-option>
                            <el-option label="维修保养" value="5"></el-option>
                            <el-option label="调拨中" value="6"></el-option>
                            <el-option label="待处置" value="7"></el-option>
                            <el-option label="申请出售中" value="8"></el-option>
                            <el-option label="出售待确认" value="9"></el-option>
                            <el-option label="申请处置中" value="10"></el-option>
                            <el-option label="申请使用中" value="11"></el-option>
                            <el-option label="已出售" value="12"></el-option>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <!--
                <el-table-column min-width="160" label="操作"  sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button  type="text" @click="checkRecord(scope.row)">查询记录</el-button>
                        <el-button  type="text"  @click="checkViolation(scope.row)">违章查询</el-button>
                    </template>
                </el-table-column>
                -->
                <el-table-column prop="plate" label="车牌" min-width="80"></el-table-column>
                <el-table-column prop="assetsType" min-width="120" label="资产属性" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="vehicleStatus" label="车辆状态" min-width="100" ></el-table-column>
                <el-table-column prop="violationNum" label="违章总次数" min-width="100" ></el-table-column>
                <el-table-column prop="unNum" label="未处理数" min-width="80"></el-table-column>
                <!--<el-table-column prop="updateTime" label="违章状态" min-width="100" >
                    <template slot-scope="scope">
                        <span>{{scope.row.updateTime | violationStatus}}</span>
                    </template>
                </el-table-column>-->
                <el-table-column prop="updateTime" label="更新时间" min-width="100" ></el-table-column>

            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficViolationTimesList',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                providerOrganization:[],
                serviceOrganization:[],
                showSearch: false,
                searchParam: {equipmentModal:[]},
                showEditBtn: true,
                showAddBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority('trafficViolationTimesList/exportExcel'),
                options: [],
                listUrl: 'traffic/violationrecord/statistics',
                orgId:''
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
        },

        filters: {
            /*获取违章状态*/
            violationStatus: function (value) {
                let result = '';
                if(value){
                    let time = new Date(Date.parse(value.replace(/-/g,"/")));
                    let timeStep = new Date().getTime() - time.getTime();
                    if(timeStep  >= 30*24*60*60*1000){
                        result = '过期'
                    }else if(timeStep  >= 10*24*60*60*1000){
                        result = '即将到期'
                    }else {
                        result = '有效期'
                    }
                }else{
                    result = '未知';
                }
                return result;
            }
        },

        methods: {

            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'providerOrganCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.providerOrganization=[];
                this.serviceOrganization=[];
                this.updateDate=[];
                this.getList();
            },
            getListBefore(params) {

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

            /*导出数据*/
            exportExcel() {
                this.searchParam.size = 10000;
                window.location = this.exportUrl("traffic/violationrecord/statistics/excel?" + $.param(this.searchParam));
                this.searchParam.size = 10;
            },

            /*查看记录*/
        /*  checkRecord(row){
                alert("跳转违章记录页面");
                //跳转违章记录页面
                let url = '/tgpt/traffic/vehicleTrack/detail';
                this.$router.push({path:url , query:{plate: row.plate }});
            },*/
            /*违章查询*/
            checkViolation(){
                alert("跳转违章记录页面");
                //
               /* let url = '/tgpt/se/vehicleTrack/add';
                this.$router.push({path:url , query:{plate: row.plate }});*/
            },
           /* checkRecord(row){
                this.$router.push({path: "/tgpt/traffic/violationQuery/"+row.id});
            }*/

        }
    }
</script>

