<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">承租人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.renterOrPhone" placeholder="请输入承租人/承租人手机号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">交车状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.deliveryStatus" placeholder="请选择" clearable>
                            <el-option label="未交车" :value="1"></el-option>
                            <el-option label="交车中" :value="2"></el-option>
                            <el-option label="已交车" :value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
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
                <el-table-column fixed="left" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button v-show="showAddBtn" v-if="(scope.row.deliveryStatus == 1 || scope.row.deliveryStatus == 2) && scope.row.contractStatus !=70 " type="text" @click="deliveryRegistration(scope.row.id)">交车登记</el-button>
                        <el-button v-show="showDetailBtn" v-if="scope.row.deliveryStatus == 2 || scope.row.deliveryStatus == 3"  type="text" @click="deliveryDetail(scope.row.id)">交车详情</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="160" label="合同编号" prop="contractNumber" sortable show-overflow-tooltip>
                   <!-- <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.maintenanceNum}}</a>
                    </template>-->
                </el-table-column>
                <el-table-column min-width="140" label="承租人" prop="renter" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="承租人手机号" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所需车辆台数" prop="vehicleNum" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合同状态" prop="contractStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="交车状态" prop="deliveryStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="已交车辆台数" prop="deliveredVehicleNum" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>




    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'


    export default {
        name: 'contractDelivery',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                showAddBtn : this.getCurrentUserAuthority("traffic/trafficDeliveryRegistration/add"),
                showDetailBtn: this.getCurrentUserAuthority("traffic/trafficDeliveryRegistration/detail"),
                showExportExcelBtn: this.getCurrentUserAuthority("traffic/trafficDeliveryRegistration/export"),
                organization:[],
                searchParam: {
                },
                listUrl: 'traffic/trafficDeliveryRegistration'
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
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false)
                this.organization=[];
                this.creatDate=[];
                this.getList();
            },
            exportExcel() {
                window.location = this.exportUrl("traffic/trafficDeliveryRegistration/excel?" + $.param(this.searchParam));
            },
            changeOrganization(data){

                if(this.organization && this.organization.length==1){
                    this.$set(this.searchParam,'organizationId',this.organization[0])
                }else {
                    this.$set(this.searchParam,'organizationId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            deliveryDetail(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detail/"+id});
            },
            deliveryRegistration(id){
                let url = this.$route.fullPath;
                this.$router.push({path:url+"/registration/"+id});
            }
        }
    }
</script>

