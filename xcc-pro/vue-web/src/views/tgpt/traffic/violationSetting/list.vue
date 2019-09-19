<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.key" clearable placeholder="车牌号"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">违章查询状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.violationQueryStatus" clearable placeholder="请选择违章查询状态">
                            <el-option label="开启" :value="1"></el-option>
                            <el-option label="关闭" :value="0"></el-option>
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
                <el-button v-show="showInstallBtn" type="primary" size="mini" @click="bathSetViolationQueryStatus(1)">批量开启违章查询</el-button>
                <el-button v-show="showInstallBtn" type="primary" size="mini" @click="bathSetViolationQueryStatus(0)">批量关闭违章查询</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showInstallBtn" v-if="scope.row.violationQueryStatus == 0" type="text" @click="setViolationQueryStatus(scope.row.id, 1)">开启违章查询</el-button>
                        <el-button v-show="showInstallBtn" v-if="scope.row.violationQueryStatus == 1" type="text" @click="setViolationQueryStatus(scope.row.id, 0)">关闭违章查询</el-button>
                    </template>
                </el-table-column>
				<el-table-column min-width="120" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="VIN" prop="vin" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车型" prop="modelName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所属组织" prop="providerCompanyName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="服务组织" prop="serviceCompanyName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章查询状态" prop="violationQueryStatusText" sortable show-overflow-tooltip></el-table-column>
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
        name: 'vehicleInstallManagement',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                showSearch: false,
                organization:[],
                serviceOrganization:[],
                organizationList:[],
                searchParam: {
                },
                vehicleIds:[],
                showInstallBtn: this.getCurrentUserAuthority('vehicleInstall/install'),
                listUrl: 'traffic/violationQuerySetting/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
            this.getOrganzationList();
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.organization=[];
                this.serviceOrganization=[];
                this.organizationList=[];
                this.vehicleIds=[];
                this.handleCurrentChange(1);
            },

            getOrganzationList(){
                var userInfo=this.getCurrentUserInfo();
                this.organizationList=userInfo.organizationList;
            },

            changeOrganization(){
                if(this.organization && this.organization.length==1){
                    this.searchParam.companyId=this.organization[0];
                }else{
                    this.searchParam.companyId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },

            changeServiceOrganization(){
                if(this.serviceOrganization && this.serviceOrganization.length==1){
                    this.searchParam.serviceRegionId=this.serviceOrganization[0];
                }else{
                    this.searchParam.serviceRegionId= '';
                    this.$set(this.searchParam,'serviceOrganCascade',false);
                }
            },

            /*设置违章查询状态*/
            setViolationQueryStatus(id, status){
                this.vehicleIds = [];
                this.vehicleIds.push(id);
                this.submitSetViolationQueryStatus(this.vehicleIds, status);
            },

            /*批量设置违章查询状态*/
            bathSetViolationQueryStatus(status){
                this.submitSetViolationQueryStatus(this.vehicleIds, status);
            },

            /*提交设置违章查询状态*/
            submitSetViolationQueryStatus(ids, status){
                if(ids && ids.length > 0){
                    if(status == 0){
                        this.$confirm('确定要关闭违章查询吗？').then(
                            () => {
                                ajax.get(`traffic/violationQuerySetting/setViolationQueryStatus?ids=${ids}&status=${status}`).then(res => {
                                    if(res.status == 0){
                                        this.$message.success("关闭违章查询成功。");
                                        this.getList();
                                    }else{
                                        this.$message.error(res.msg);
                                    }
                                })
                            }
                        )
                    }else if(status == 1){
                        this.$confirm('确定要开启违章查询吗？').then(
                            () => {
                                ajax.get(`traffic/violationQuerySetting/setViolationQueryStatus?ids=${ids}&status=${status}`).then(res => {
                                    if(res.status == 0){
                                        this.$message.success("开启违章查询成功。");
                                        this.getList();
                                    }else{
                                        this.$message.error(res.msg);
                                    }
                                })
                            }
                        )
                    }
                }else{
                    this.$message.warning("请先选择要设置违章查询状态的车辆。");
                }
            },

            /*批量选择*/
            handleSelectionChange(val){
                this.vehicleIds = [];
                val.forEach(item => {
                    this.vehicleIds.push(item.id);
                });
            }
        }
    }
</script>

