<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <el-tabs v-model="searchParam.flag" @tab-click="tableClick()">
            <el-tab-pane label="我的申请" name="1"></el-tab-pane>
            <el-tab-pane label="我的审批" name="2"></el-tab-pane>
        </el-tabs>

        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <!--<div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group">
                        <tree-select v-model="searchParam.organId" placeholder="请选择" type="one"
                                     url=""></tree-select>
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">申请单号</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.applicationNo" placeholder="请选择" clearable>
                        </el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车人</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.user" placeholder="请选择" clearable>
                        </el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车类型</label>
                    <div class="input-group">
                        <el-select  v-model="searchParam.type" placeholder="请选择" clearable>
                            <el-option  label="自驾" value="1"></el-option>
                            <el-option  label="配驾" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                       <el-select  v-model="searchParam.approvalStatus" placeholder="请选择" clearable>
                           <el-option  label="待提交审批" value="1"></el-option>
                           <el-option  label="待审批" value="2"></el-option>
                           <el-option  label="审批中" value="6"></el-option>
                           <el-option  label="审批通过" value="3"></el-option>
                           <el-option  label="审批驳回" value="4"></el-option>
                          <!-- <el-option  label="审批超时" value="7"></el-option>-->
                           <el-option  label="已作废" value="5"></el-option>
                       </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车开始日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="useTimeStart"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">用车结束日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="useTimeEnd"
                            type="daterange"
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
               <!-- <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>-->
            </div>
        </div>
       <!-- <div class="tool-box" v-if="searchParam.flag == 1">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
            <el-button v-show="showExportExcelBtn" type="primary" size="mini" @click="bathApprove()">批量提交</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="importExcel()">批量导入</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>
        <div class="tool-box" v-if="searchParam.flag == 2">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="bathExamine()">批量审批</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>-->
        <div class="tool-box">
            <div class="operation" v-if="searchParam.flag == 1">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button v-show="showExportExcelBtn" type="primary" size="mini" @click="bathApprove()">提交</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="importExcel()">导入</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
            </div>
            <div class="operation" v-if="searchParam.flag == 2">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="bathExamine()">审批</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope" >
                        <!--作废，被驳回，待提交审批都可修改-->
                        <div v-if="searchParam.flag == 1">
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)" v-if="[1, 4].indexOf(scope.row.approvalStatus)>=0">修改</el-button>
                            <el-button v-show="showEditBtn" type="text" @click="approve(scope.row.id)" v-if="[1, 4].indexOf(scope.row.approvalStatus)>=0" >提交</el-button>
                            <el-button v-show="showEditBtn" type="text" @click="cancle(scope.row.id)" v-if="[1, 2,4,6].indexOf(scope.row.approvalStatus)>=0">作废</el-button>
                        </div>
                        <div v-if="searchParam.flag == 2 && scope.row.approvalStatus == 2">
                            <el-button v-show="showEditBtn" type="text" @click="examine(scope.row.id)" >审批</el-button>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column fixed="left" min-width="200" label="申请单号" prop="applicationNo" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.applicationNo}}</a>
					</template>
				</el-table-column>
                <el-table-column v-if="searchParam.flag == 2" min-width="140" label="申请单状态" prop="applicationStutus" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="审批状态" prop="approvalStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="是否需要审批" prop="needApprover" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.needApprover == 1">是</span>
                        <span v-if="scope.row.needApprover == 0">否</span>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="用车类型" prop="typeText" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="用车人" prop="user" sortable show-overflow-tooltip></el-table-column>
				<!--<el-table-column min-width="140" label="用车人手机号" prop="phone" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="同行人员" prop="peerUser" sortable show-overflow-tooltip></el-table-column>-->
				<el-table-column min-width="140" label="座位数" prop="seateNum" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="150" label="用车开始时间" prop="useTimeStart" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="150" label="用车结束时间" prop="useTimeEnd" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="用车事由" prop="reason" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="出发地址" prop="depAddress" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="抵达地址" prop="arrAddress" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="150" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
        <el-dialog title="导入用车申请" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item label="审批人" >
                    <el-select v-model="approver" multiple placeholder="请选择" @change="approverChange()">
                        <el-option
                            v-for="item in approverList"
                            :key="item.userId"
                            :label="item.name"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用车所属组织" prop="orgId">
                    <tree-select v-model="orgIds" placeholder="请选择用车所属组织" type="one"
                                 url="admin/organization/tree?noManager=noManager"
                                 @change="changeArrayItem"></tree-select>
                </el-form-item>
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="equipmentSubmit"
                                  :url="url"
                                  name="importfile"
                                  :disabled="!orgId"
                                  @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "设备导入模板" 的格式一致。
                            <a href="static/excelTemplate/用车申请导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 流程审批 -->
        <el-dialog title="审批" :visible.sync="approvalVisible" :append-to-body="true">
            <el-form :model="approvalForm" :rules="rules" label-position="top" ref="approvalForm" class="full-input">
                <el-form-item label="审批状态" prop="approveStatus">
                    <el-select v-model="approvalForm.approveStatus" placeholder="请选择">
                        <el-option label="审批通过" value="1"></el-option>
                        <el-option label="审批不通过" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批意见" prop="rejectReason">
                    <el-input type="textarea" v-model="approvalForm.rejectReason"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="approvalVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitExamine('approvalForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'clientVehicleApplication',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                showSearch: false,
                searchParam: {
                    flag: "1",
                },
                showEditBtn: true,
                showAddBtn: true,
                showExportExcelBtn: true,
                listUrl: 'core/clientVehicleApplication',
                importVisible: false,
                url: 'core/clientVehicleApplication/import',
                approver:[],
                orgIds: [] ,
                orgId:'',
                createDate:[],
                approverList:[],
                /*提交审批ids*/
                approveIds:[],
                /*审批ids*/
                examineIds:[],
                approvalVisible:false,
                approvalForm:{},
                rules: {
                    approveStatus: [
                        {required: true, message: '请选择审批状态', trigger: 'blur'}
                    ]
                },
                useTimeStart:[],
                useTimeEnd:[]

            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
            this.getUsers();
        },
        methods: {
            getListBefore(params) {
                if (this.useTimeStart && this.useTimeStart.length>0) {
                    params.useTimeStartst = this.useTimeStart[0];
                    params.useTimeStarted = this.useTimeStart[1];
                    this.searchParam.useTimeStartst = this.useTimeStart[0];
                    this.searchParam.useTimeStarted = this.useTimeStart[1];
                }else{
                    params.useTimeStartst = '';
                    params.useTimeStarted = '';
                    this.searchParam.useTimeStartst = '';
                    this.searchParam.useTimeStarted = '';
                }
                if (this.useTimeEnd && this.useTimeEnd.length>0) {
                    params.useTimeEndst = this.useTimeEnd[0];
                    params.useTimeEnded = this.useTimeEnd[1];
                    this.searchParam.useTimeEndst = this.useTimeEnd[0];
                    this.searchParam.useTimeEnded = this.useTimeEnd[1];
                }else{
                    params.useTimeEndst = '';
                    params.useTimeEnded = '';
                    this.searchParam.useTimeEndst = '';
                    this.searchParam.useTimeEnded = '';
                }
            },
            resetList(){
                this.useTimeStart = [];
                this.useTimeEnd = [];
                if(this.searchParam.flag == "1"){
                    this.searchParam = {
                        flag : "1",
                        applicationNo : "",
                        user :"",
                        type : "",
                        approvalStatus : "",
                        useTimeStartst :'',
                        useTimeStarted : '',
                        useTimeEndst:'',
                        useTimeEnded:''
                    }
                }else if(this.searchParam.flag == "2"){
                    this.searchParam = {
                        flag : "2",
                        applicationNo : "",
                        user :"",
                        type : "",
                        approvalStatus : "",
                        useTimeStartst :'',
                        useTimeStarted : '',
                        useTimeEndst:'',
                        useTimeEnded:''
                    }
                }
                this.getList();
            },
            exportExcel() {
                window.location = this.exportUrl("core/clientVehicleApplication/excel?" + $.param(this.searchParam));
            },

            /*批量导入*/
            importExcel(){
                this.approver=[];
                this.orgIds = [];
                this.orgId = "";
                this.importVisibleError = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },

            /*审批人改变*/
            approverChange(){
                if(this.approver && this.approver.length){
                    const approver = this.approver.join(',');
                    this.url = 'core/clientVehicleApplication/import?approver='+approver;
                    if(this.orgId){
                        this.url = this.url+'&orgId='+this.orgId;
                    }
                }
            },
            changeArrayItem() {
                if(this.orgIds.length>0){
                    this.orgId = this.orgIds[0];
                    this.url = 'core/clientVehicleApplication/import?orgId='+this.orgId;
                    if(this.approver && this.approver.length){
                        const approver = this.approver.join(',');
                        this.url = this.url+'&approver='+approver;
                    }
                }else{
                    this.orgId = '';
                }
            },

            /*获取审批人列表*/
            getUsers(){
                ajax.get('admin/user/listByCompanyId').then(res => {
                    if(res && res.length){
                        this.approverList = res;
                    }
                })
            },
            /*提交审批*/
            approve(id){
                this.approveIds = [];
                this.approveIds.push(id);
                this.submitApprove(this.approveIds);
            },

            /*批量提交*/
            bathApprove(){
                this.submitApprove(this.approveIds);
            },

            /*提交审批*/
            submitApprove(ids){
                if(ids && ids.length > 0){
                    this.$confirm('确认提交审批').then(_ =>{
                        ajax.get(`core/clientVehicleApplication/submit?ids=${ids}`).then(res => {
                            if(res.status == 0){
                                this.$message.success("提交审批成功");
                                this.getList();
                            }else if(res.data){
                                this.$message.error(res.data+"申请单状态已变更，请刷新后重试");
                            }
                        });
                    });
                }else{
                    this.$message.warning("请先选择要提交的申请");
                }
            },

            /*作废*/
            cancle(id){
                this.$confirm('确认作废？').then(_ =>{
                    ajax.get(`core/clientVehicleApplication/invalid/${id}`).then(res => {
                        if(res.status == 0){
                            this.$message.success("作废成功");
                            this.getList();
                        }else{
                            this.$message.error(res.msg);
                        }
                    });
                });
            },
            /*table页切换*/
            tableClick(){
                this.getList();
            },

            /*单条审批*/
            examine(id){
                this.examineIds = [];
                this.examineIds.push(id);
                this.approvalVisible = true;
            },


            bathExamine(){
                if(this.examineIds && this.examineIds.length){
                    this.approvalVisible = true;
                }else{
                    this.$message.warning("请先选择需要审批的用车申请");
                }
            },

            /*提交审批*/
            submitExamine(approvalForm){
                this.$refs[approvalForm].validate((valid) => {
                    if (valid) {
                        let url = "core/clientVehicleApplication/approve";
                        this.approvalForm.ids = this.examineIds;
                        ajax.post(url, this.approvalForm).then((res) => {
                            this.approvalVisible = false;
                            if (res.status == 0) {
                                this.showMessage("审批成功", "success");
                                this.getList();
                            } else {
                                this.showMessage(res.msg, "error");
                            }

                        });
                    } else {
                        return false;
                    }
                });
            },

            /*批量选择*/
            handleSelectionChange(val){
                if(this.searchParam.flag == 1){
                    this.approveIds = [];
                    val.forEach(item => {
                        if(item.approvalStatus == 1){
                            this.approveIds.push(item.id);
                        }
                    });
                }
                if(this.searchParam.flag == 2){
                    this.examineIds = [];
                    val.forEach(item => {
                        if(item.approvalStatus == 2){
                            this.examineIds.push(item.id);
                        }
                    });
                }
            },
        }
    }
</script>

