<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class=" search-box" >
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">司机</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driver" placeholder="请输入司机姓名/手机号" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicle" placeholder="请输入车牌/车型" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">绑定状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.bindStatus" placeholder="请选择绑定状态" clearable>
                            <el-option label="已绑定" value="1"></el-option>
                            <el-option label="未绑定" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                <el-table-column fixed="left" label="操作" min-width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.bindStatus != 1 " v-show="showBindBtn" @click="binding(scope.row.id)" type="text" size="small">
                            绑定
                        </el-button>
                        <el-button v-if="scope.row.bindStatus == 1 " v-show="showUnbindBtn" @click="unbind(scope.row)" type="text" size="small">
                            解绑
                        </el-button>
                        <el-button @click="record(scope.row.id)" v-show="showRecordBtn" type="text" size="small">
                            操作记录
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="driverName" sortable label="司机姓名" min-width="100"></el-table-column>
                <el-table-column prop="phone" sortable label="手机号" min-width="100"></el-table-column>
                <el-table-column prop="organizationName" sortable label="所属组织" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="plate" sortable label="绑定车辆" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="scope.row.plate==null">/</template>
                        <template v-else>{{scope.row.plate}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.vehicleModelInfoName==null || scope.row.vehicleModelInfoName==''">/</template>
                        <template v-else>{{scope.row.vehicleModelInfoName}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="color" sortable label="颜色" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.color==null">/</template>
                        <template v-else>{{scope.row.color}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="bindStatusText" sortable label="绑定状态" min-width="100"></el-table-column>
                <el-table-column prop="bindTime" sortable label="绑定时间" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="scope.row.bindTime==null">/</template>
                        <template v-else>{{scope.row.bindTime}}</template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'


    export default {
        name: 'driverVehicleBindingList',
        mixins: [tool],
        components : { TreeSelect,UploadSubmit},
        data(){
            return{
                importVisible: false,
                showBindBtn:this.getCurrentUserAuthority("operation/driverVehicleBinding/bind"),
                showUnbindBtn:this.getCurrentUserAuthority("operation/driverVehicleBinding/unbind"),
                showExportBtn : this.getCurrentUserAuthority("operation/driverVehicleBinding/export"),
                showRecordBtn: this.getCurrentUserAuthority("operation/driverVehicleBinding/record"),
                organization:[],
                serviceOrganization:[],
                companyId:"",
                importVisibleError : false,
                importVisibleErrorId : "",
                listUrl : "operation_base/driverVehicleBinding/list"
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
        watch: {

        },
        methods: {
            /*resetList(){
                this.searchParam = {};
                this.organization = [];
                this.serviceOrganization = [];
                this.handleCurrentChange(1);
            },*/
            binding(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/binding",query:{id:id}});
            },
            /*changeOrganization(){
                if(this.organization && this.organization.length==1)
                    this.searchParam.companyId=this.organization[0];
                else
                    this.searchParam.companyId='';
            },*/

            /*changeServiceOrganization(){
                if(this.serviceOrganization && this.serviceOrganization.length==1)
                    this.searchParam.serviceOrganizationId=this.serviceOrganization[0];
                else
                    this.searchParam.serviceOrganizationId='';
            },*/

            unbind(row){
                let url = "operation_base/driverVehicleBinding/unbind";
                let data = {
                   driverId : row.id,
                   vehicleId : row.vehicleId,
                };
                this.$confirm('是否确认解除绑定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.post(url,data).then(res => {
                        if(res.status == 0){
                           this.$message({message: '解绑成功！',type: 'success'});
                           this.getList();
                         }else {
                            this.$message({message: res.message ,type: 'error'});
                        }
                    });
                }).catch(() => {});
            },
            record(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/record",query:{id:id}});
            },
            exportExcel(){
                window.location = this.exportUrl("operation_base/driverVehicleBinding/export?" + $.param(this.searchParam));
            },
            /*importData(){
                this.importVisibleErrorId = "";
                this.companyId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },*/

        },


    }
</script>

