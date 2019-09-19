<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class=" search-box"  :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicle" placeholder="请输入车牌/车型" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">注册城市</label>
                    <div class="input-group">
                        <el-input  type="text" v-model="searchParam.registerCityName" placeholder="请输入注册城市" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                    url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">任务状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.taskStatus" placeholder="不限" clearable>
                            <el-option label="空闲" :value="1"></el-option>
                            <el-option label="任务中" :value="2"></el-option>
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
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
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
        <div class="table-box" >
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" min-width="160">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">
                            编辑
                        </el-button>
                        <!-- <el-button v-show="showDeleteBtn" @click="deleteData(scope.row)" type="text" size="small">
                            删除
                        </el-button> -->
                    </template>
                </el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="modelName" sortable label="车型" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="color" sortable label="颜色" min-width="90"></el-table-column>
                <el-table-column prop="companyName" sortable label="所属组织" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="registerCity" sortable label="注册城市" min-width="100"></el-table-column>
                <el-table-column prop="taskStatusText" sortable label="任务状态" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="140">
                </el-table-column>
            </el-table>
        </div>
       <!-- <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item label="管理公司" required>
                    <tree-select v-model="exportOrganization" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeExportOrganization"></tree-select>
                </el-form-item>
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/vehicle/import?companyId='+companyId"
                                  :disabled="!companyId" name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆资料导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>

                &lt;!&ndash;<el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/vehicle/import?companyId='+companyId"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆资料导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>&ndash;&gt;
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">取 消</el-button>
                &lt;!&ndash; <el-button type="primary" @click="dialogFormShow(false)">确 定</el-button>&ndash;&gt;
            </div>
        </el-dialog>-->

    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'appVehicle',
        mixins: [tool],
        components: { ConfirmForm ,UploadSubmit,TreeSelect},
        data(){
            return{
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                dialogChangePlateVisible:false,
                showAddBtn : this.getCurrentUserAuthority("appVehicle/add"),
                showEditBtn : this.getCurrentUserAuthority("appVehicle/edit"),
                //showDeleteBtn : this.getCurrentUserAuthority("baseVehicle/delete"),
                showExportBtn : this.getCurrentUserAuthority("appVehicle/export"),
                organization:[],
                organizationList:[],
                serviceStatus:[],
                vehicleStatus:[],
                companyId:"",
                userInfo:this.getCurrentUserInfo(),
                listUrl : "operation_base/vehicle/list",
            }

        },

        activated: function () {
            this.getList();
        },
        mounted: function () {
            var vehicleStatus=this.$route.query.vehicleStatus;
            if(vehicleStatus){
                this.vehicleStatus=[vehicleStatus];
               // this.searchParam = Object.assign({},this.searchParam);
            }

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getOrganzationList();
        },
        watch: {

        },
        methods: {
            getListBefore(params){
                if(this.vehicleStatus && this.vehicleStatus.length>0){
                    params.vehicleStatus=this.vehicleStatus.join(',');
                    this.searchParam.vehicleStatus=this.vehicleStatus.join(',');
                }else{
                    params.vehicleStatus='';
                    this.searchParam.vehicleStatus='';
                }

                if(this.serviceStatus && this.serviceStatus.length>0){
                    params.serviceStatus=this.serviceStatus.join(',');
                    this.searchParam.serviceStatus=this.serviceStatus.join(',');
                }else{
                    params.serviceStatus='';
                    this.searchParam.serviceStatus='';
                }
            },
            resetList(){
                debugger;
                this.organization=[];
                this.vehicleStatus=[];
                this.serviceStatus=[];
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',0);
                this.getList();
            },
            /*删除*/
           /* del(vehicleId){

                this.$confirm('是否确认删除 ?')
                    .then(_ => {
                        ajax.get("base/vehicle/delete/"+vehicleId).then(
                            (res) => {
                                if(res.status == 0){
                                    debugger;
                                    this.getList();
                                    this.$message({message: '删除成功！',type: 'success'});
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    }).catch(_ => {
                    console.info("关闭");
                });
            },*/

            getOrganzationList(){
                var userInfo=this.getCurrentUserInfo();
                this.organizationList=userInfo.organizationList;
            },

            exportExcel(){
                window.location = this.exportUrl("operation_base/vehicle/export?" + $.param(this.searchParam));
            },

            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.companyId=this.organization[0];
                }else{
                    this.searchParam.companyId = '';
                    this.$set(this.searchParam,'organCascade',0);
                }
            },
            toDetail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            }
        },


    }
</script>

