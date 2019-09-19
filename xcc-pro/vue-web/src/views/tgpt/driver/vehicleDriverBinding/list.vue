<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class=" search-box"  :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车架号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vin" placeholder="请输入车架号" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">绑定状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.bindStatus" placeholder="不限" clearable>
                            <el-option label="已绑定" value="1"></el-option>
                            <el-option label="未绑定" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">司机信息</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.driverInfo" placeholder="请输入司机姓名、手机号" clearable />
                    </div>
                </div>
                <!--<div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceOrganizationId">子组织</el-checkbox>
                    </div>
                </div>-->
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="importData()">导入</el-button>
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
                        <el-button v-if="scope.row.bindStatus == 2 " v-show="showBindBtn" @click="binding(scope.row.id)" type="text" size="small">
                            绑定
                        </el-button>
                        <el-button v-if="scope.row.bindStatus == 1 " v-show="showBindBtn" @click="unbind(scope.row)" type="text" size="small">
                            解绑
                        </el-button>
                        <el-button @click="record(scope.row.id)" v-show="showRecordBtn" type="text" size="small">
                            操作记录
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="100"></el-table-column>
                                <el-table-column prop="modelName" sortable label="车型" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="vin" sortable label="车架号" min-width="150"></el-table-column>
                <el-table-column prop="companyName" sortable label="服务组织" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="providerCompany" sortable label="所属组织" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="engineNo" sortable label="发动机号" min-width="150"></el-table-column>
                <el-table-column prop="licenseNumber" sortable label="行驶证号" min-width="150"></el-table-column>
                 <el-table-column prop="driverName" sortable label="司机姓名" min-width="100"></el-table-column>
                <el-table-column prop="driverPhone" sortable label="司机电话" min-width="100"></el-table-column>
                <el-table-column prop="bindStatusText" sortable label="绑定状态" min-width="100"></el-table-column>
                <el-table-column prop="bindTime" sortable label="绑定时间" min-width="120"></el-table-column>
            </el-table>
        </div>

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/baseVehicleDriverBinding/importExcel'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆司机绑定导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆司机绑定导入模板.xls" style="color: #5895fd;text-decoration: none !important;">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="dialogFormShow(false)">确 定</el-button>-->
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'


    export default {
        name: 'vehicleDriverBindingList',
        mixins: [tool],
        components : { TreeSelect,UploadSubmit},
        data(){
            return{
                importVisible: false,
                showSearch:false,
                showBindBtn:this.getCurrentUserAuthority("baseVehicle/bind"),
                showImportBtn:this.getCurrentUserAuthority("baseVehicle/import"),
                showExportBtn : this.getCurrentUserAuthority("baseVehicle/export"),
                showRecordBtn: this.getCurrentUserAuthority("baseVehicle/record"),
                organization:[],
                serviceOrganization:[],
                companyId:"",
                importVisibleError : false,
                importVisibleErrorId : "",
                listUrl : "base/baseVehicleDriverBinding/list"
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
            resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false);
                this.organization = [];
                this.serviceOrganization = [];
                this.handleCurrentChange(1);
            },
            binding(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/binding",query:{id:id}});
            },
            changeOrganization(){
                if(this.organization && this.organization.length==1)
                    this.searchParam.companyId=this.organization[0];
                else{
                    this.searchParam.companyId='';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },

            changeServiceOrganization(){
                if(this.serviceOrganization && this.serviceOrganization.length==1)
                    this.searchParam.serviceOrganizationId=this.serviceOrganization[0];
                else
                    this.searchParam.serviceOrganizationId='';
            },

            unbind(row){
                let url = "base/baseVehicleDriverBinding/binding";
                let data = {
                   driverId : "",
                   vehicleId : row.id,
                   bindStatus : 2
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
                            this.$message({message: res.msg ,type: 'error'});
                        }
                    });
                }).catch(() => {});
            },
            record(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/record",query:{id:id}});
            },
            exportExcel(){
                window.location = this.exportUrl("base/baseVehicleDriverBinding/exportExcel?" + $.param(this.searchParam));
            },
            importData(){
                this.importVisibleErrorId = "";
                this.companyId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },

        },


    }
</script>

