<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">司机</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverName" placeholder="请输入司机姓名/手机号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">确认状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.confirmStatus" placeholder="全部" clearable>
                            <el-option label="未确认" value="0"></el-option>
                            <el-option label="已确认" value="1"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">维修日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="createTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
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

                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <!--<el-button  v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>-->
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" style="width: 100%" border>
                <el-table-column fixed="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-show="showConfirmBtn && scope.row.confirmStatus == 0" @click="confirm(scope.row)" type="text" size="small">确认
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="maintenanceNum" sortable label="事故编号" show-overflow-tooltip min-width="140">
                    <template slot-scope="scope">
                        <a size="mini" @click="detail(scope.row)">{{scope.row.maintenanceNum}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="driverName" sortable label="司机姓名" min-width="120"></el-table-column>
                <el-table-column prop="phone" sortable label="手机号" min-width="120"></el-table-column>
                <el-table-column prop="plate" sortable label="车辆" min-width="120"></el-table-column>
                <el-table-column prop="companyName" sortable label="所属组织" show-overflow-tooltip
                                 min-width="120"></el-table-column>
                <el-table-column prop="maintenanceTime" sortable label="维修时间" min-width="120"></el-table-column>
                <el-table-column prop="maintenanceArea" sortable label="维修地点" min-width="180"></el-table-column>
                <el-table-column prop="confirmStatusText" sortable label="确认状态" show-overflow-tooltip
                                 min-width="120"></el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import CitySelect from '@/components/CitySelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        name: 'appMaintenance',
        mixins: [tool],
        components: { CitySelect, UploadSubmit ,TreeSelect},
        data(){
            return {
                showSearch: false,
                showConfirmBtn:this.getCurrentUserAuthority("maintenance/confirm"),
                //showDeleteBtn: this.getCurrentUserAuthority("driver/delete"),
                listUrl:"operation_traffic/maintenance",
                companyIds:[],
                createTime: []
            }
        },
        // 返回页面调用
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

            detail(row) {
                this.$router.push({path:"/tgpt_v2/operation/trafficMaintenance/detail/"+row.id});
            },
            confirm(row) {
                this.$router.push({path:"/tgpt_v2/operation/trafficMaintenance/confirm/"+row.id});
            },
            changeOrganization(){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.companyId=this.companyIds[0];
                }else{
                    this.searchParam.companyId='';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            resetList(){
              this.searchParam={};
                this.$set(this.searchParam,'organCascade',0);
              this.companyIds=[];
              this.createTime = [];
              this.getList();
            },
            getListBefore(params){
                if(this.createTime){
                    params.startTime = this.createTime[0];
                    params.endTime = this.createTime[1];
                }
            },

        }
    }
</script>


<style scoped lang="scss">
    .organ_wrap {
        display: flex;

        .tree-select-panel {
            width: 100%;
        }

        .el-checkbox {
            display: flex;
            align-items: center;
            margin-left: 10px;
            margin-right: 0;

            /deep/ .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

    .list-panel .search-box .input-group {
        width: calc(100% - 65px);
    }
</style>
