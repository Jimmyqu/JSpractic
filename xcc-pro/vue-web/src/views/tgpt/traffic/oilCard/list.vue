<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">加油卡号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" clearable placeholder="请输入加油卡号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">油卡类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.type" placeholder="请选择油卡类型" clearable>
                            <el-option label="主卡" value="1"></el-option>
                            <el-option label="副卡" value="2"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">持卡人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.cardholderUser" clearable  placeholder="请输入持卡人"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.enterpriseName" clearable placeholder="请输入服务客户"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNo" clearable placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">项目订单</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.orderNo" clearable placeholder="请输入项目订单"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">绑定车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehiclePlate" clearable placeholder="请输入车牌号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"
                                     @change="changeArrayItem"></tree-select>
                        <el-checkbox v-model="check" @change="includeChildrenCheck" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.oilCardStatus" placeholder="请选择状态" clearable>
                            <el-option label="待提交审批" value="10"></el-option>
                            <el-option label="审批中" value="20"></el-option>
                            <el-option label="审批不通过" value="30"></el-option>
                            <el-option label="使用中" value="40"></el-option>
                            <el-option label="已销卡" value="50"></el-option>
                            <el-option label="已到期" value="60"></el-option>
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
                <el-button v-show="showAddBtn" type="warning"  size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
                <el-button type="small" @click="resetList();" size="mini">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="importData()">导入</el-button>
                <el-button  v-show="showExportBtn" size="mini" @click="exportData()">导出</el-button>
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
            <template>
                <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list"  style="width: 100%" >
                    <el-table-column fixed label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.oilCardStatus == 10 || scope.row.oilCardStatus == 30" v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button v-if="scope.row.oilCardStatus == 60 || scope.row.oilCardStatus == 40" v-show="showCancelBtn" @click="cancel(scope.row)" type="text" size="small">销卡</el-button>
                            <el-button v-if="scope.row.oilCardStatus == 10 || scope.row.oilCardStatus == 30" v-show="showApproveBtn" @click="approve(scope.row.id)" type="text" size="small">提交</el-button>
                            <el-button v-if="scope.row.oilCardStatus == 40 && (scope.row.vehicleId == null || scope.row.vehicleId == '' ) && scope.row.typeCode==2" v-show="showBingBtn" @click="bindingVehicle(scope.row.id)" type="text" size="small">绑定车辆</el-button>
                            <el-button v-if="scope.row.oilCardStatus == 40 && (scope.row.vehicleId != null && scope.row.vehicleId != '' ) && scope.row.typeCode==2" v-show="showUnbindBtn" @click="unbindVehicle(scope.row.id)" type="text" size="small">解绑车辆</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" fixed sortable label="加油卡号" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="text" @click="toDetail(scope.row)">
                                {{scope.row.code}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" sortable label="油卡类型" min-width="100"></el-table-column>
                    <el-table-column prop="energyCompany" sortable label="能源企业" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="balance" sortable label="油卡余额（元）" min-width="120"></el-table-column>
                    <el-table-column prop="cardholderUser" sortable label="持卡人" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="companyName" sortable label="所属组织" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="enterpriseName" sortable label="服务客户" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="contractNo" sortable label="合同编号" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="orderNo" sortable label="项目订单" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="plate" sortable label="绑定车辆" min-width="100"></el-table-column>
                    <el-table-column prop="masterCard" sortable label="主卡" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="oilCardStatusText" sortable label="状态" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="creater" sortable label="创建人" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" sortable label="创建时间" min-width="120" show-overflow-tooltip></el-table-column>

                </el-table>

            </template>
        </div>

        <!-- 导入弹窗 -->

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item label="所属组织" required>
                    <tree-select v-model="orgId" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/tree?noManager=noManager"
                                 @change="changeArrayItem"></tree-select>
                </el-form-item>
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/oilCard/importExcel?companyId='+orgId"
                                  :disabled="!orgId" name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "加油卡导入模板" 的格式一致。
                            <a href="static/excelTemplate/加油卡导入模板.xlsx">下载模板</a>
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

    import $ from 'jquery-slim'
    import {startProcessAsync} from '@/utils/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        name: 'trafficOilCard',
        mixins: [tool],
        components : {UploadSubmit,TreeSelect},
        data(){
            return {
                showSearch:false,
                showAddBtn:this.getCurrentUserAuthority("oilCard/add"),
                showEditBtn:this.getCurrentUserAuthority("oilCard/edit"),
                showExportBtn:this.getCurrentUserAuthority("oilCard/export"),
                showApproveBtn:this.getCurrentUserAuthority("oilCard/approve"),
                showBingBtn:this.getCurrentUserAuthority("oilCard/binding"),
                showUnbindBtn:this.getCurrentUserAuthority("oilCard/unbind"),
                showImportBtn:this.getCurrentUserAuthority("oilCard/import"),
                showCancelBtn:this.getCurrentUserAuthority("oilCard/cancel"),
                listUrl:"/base/oilCard/list",
                orgId: [] ,
                companyId: '',
                organization:[],
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                check: false

            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted(){
            var oilCardStatus = this.$route.query.oilCardStatus;
            if(oilCardStatus){
                this.searchParam.oilCardStatus = oilCardStatus;
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods:{
            /*getListBefore(params) {
                if(params.companyId){
                    params.companyId = params.companyId.join(',');
                }
            },*/
            includeChildrenCheck(check){
                this.check = check;
                if(check==true){
                    this.searchParam.includeChildren=1;
                }else{
                    this.searchParam.includeChildren=0;
                }
            },
            edit(id){
                let url = this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/edit?id="+id});
                }else{
                    this.$router.push({path:url+"/edit?id="+id});
                }
            },
            toDetail(row){
                let url = this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
            approve(id){
                this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'JYK').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            bindingVehicle(id){ //绑定车辆
                this.$router.push({path:"/tgpt/traffic/oilCard/binding",query:{id:id}});
            },
            unbindVehicle(id){ //解绑车辆
                this.$confirm('是否确认解绑车辆?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/oilCard/unbind/"+id).then(
                        (res) => {
                            if(res.status == 0){
                                this.$message({message: '解绑成功！',type: 'success'});
                                this.getList();
                            }else {
                                this.$message.error(res.message);
                            }
                        }
                    )
                }).catch(() => {});
            },
            cancel(row){
                //如果是主卡，必须主卡下面的副卡都注销后才可以注销
                if(row.typeCode == 1){
                    ajax.get('/base/oilCard/checkUncanceledOilCard/' + row.id).then(result => {
                        if(result){
                            this.$confirm('是否注销该油卡?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                ajax.get('/base/oilCard/cancel/' + row.id).then(result => {
                                    if(result.status == 0){
                                        this.showMessage("注销成功","success");
                                        this.getList();
                                    }else{
                                        this.showMessage(result.message,"error");
                                    }
                                });
                            }).catch(() => {});
                        }else{
                            this.showMessage("请先注销副卡后再注销主卡！","error");
                        }
                    });
                }else{
                    this.$confirm('是否注销该油卡?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        ajax.get('/base/oilCard/cancel/' + row.id).then(result => {
                            if(result.status == 0){
                                this.showMessage("注销成功","success");
                                this.getList();
                            }else{
                                this.showMessage(result.message,"error");
                            }
                        });
                    }).catch(() => {});
                }
            },
            exportData(){
                window.location = this.exportUrl("base/oilCard/export?" + $.param(this.searchParam));
            },
            importData(){
                this.importVisibleErrorId = "";
                this.orgId = [];
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
            changeArrayItem(data) {
                if (this.organization && this.organization.length>0){
                    this.searchParam.companyId=this.organization[0];
                }else{
                    this.check = false;
                    this.searchParam.companyId='';
                    this.$set(this.searchParam,'includeChildren',0);
                }
            },resetList(){
                this.searchParam={};
                this.check = false;
                this.$set(this.searchParam,'includeChildren',0);
                this.organization=[];
                this.handleCurrentChange(1);
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
/*
    .list-panel .search-box .input-group {
        width: calc(100% - 65px);
    }*/
</style>
