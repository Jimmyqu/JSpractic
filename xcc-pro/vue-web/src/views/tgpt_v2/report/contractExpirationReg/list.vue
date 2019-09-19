<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree"  @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.originateId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">厂牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.brandName" placeholder="请输入厂牌" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <BrandSelect ref="brandSelect" :disabledInit="true"
                                     v-model="vehicleModelInfoId" level="3"></BrandSelect>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" placeholder="请输入服务客户" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">合同时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="合同开始时间"
                            end-placeholder="合同结束时间"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询
                </el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column min-width="120" label="所属组织" prop="originatorName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="车牌号" prop="plate" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="厂牌" prop="brandName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务区域" prop="cityName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务客户" prop="enterpriseName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="服役状态" prop="vehicleStatus" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="200" label="合同编号" prop="contractNumber" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column min-width="120" label="合同开始时间" prop="contractStartDate" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="合同结束时间" prop="contractEndDate" sortable
                                 show-overflow-tooltip></el-table-column>
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
    import BrandSelect from '@/components/BrandSelect/index'

    export default {
        name: 'contractExpirationReg',
        mixins: [tool],
        components: {TreeSelect, BrandSelect},
        data() {
            return {
                showSearch: false,
                searchParam: {},
                showExportBtn: true,
                listUrl: 'report/contractExpirationReg/list',
                organizationIds:[],
                contractDate:[],
                vehicleModelInfoId:[]
            }
        },
        activated: function () {
            this.getList();
        },
        mounted() {
            this.$refs.brandSelect.init();

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
              /*  if (this.organizationIds){
                    params.originateId = this.organizationIds[0];
                }*/
                if (this.contractDate) {
                    params.contractStartDate = this.contractDate[0];
                    params.contractEndDate = this.contractDate[1];
                }
                if (this.vehicleModelInfoId){
                    params.vehicleModelInfoId = this.vehicleModelInfoId[2];
                }
            }, resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',0);
                this.organizationIds = [];
                this.contractDate = [];
                this.vehicleModelInfoId = [];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.searchParam.originateId=this.organizationIds[0];
                }else{
                    this.searchParam.originateId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            exportExcel() {
                var params= this.searchParam;
                if (this.organizationIds && this.organizationIds.length>=1){
                    params.originateId = this.organizationIds[0];
                }
                if (this.contractDate && this.contractDate.length>1) {
                    params.contractStartDate = this.contractDate[0];
                    params.contractEndDate = this.contractDate[1];
                }
                if (this.vehicleModelInfoId && this.vehicleModelInfoId.length>1){
                    params.vehicleModelInfoId = this.vehicleModelInfoId[2];
                }
                window.location = this.exportUrl("report/contractExpirationReg/excel?" + $.param(params));
            }
        }
    }
</script>

