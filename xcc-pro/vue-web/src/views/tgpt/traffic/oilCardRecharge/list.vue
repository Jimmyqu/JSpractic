<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">加油卡</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.oillCard" placeholder="请输入内容" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">充值人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.recharger" placeholder="请输入内容" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">充值日期</label>
                    <div class="input-group">
                        <el-date-picker
                            clearable
                            v-model="rechargeDate"
                            @change="rechargeDateChange"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>

            </div>
        </div>
        <!--grid按钮-->
        <div class="tool-box">
            <div class="operation">
                <el-button type="warning"  size="mini"  @click="add()" v-show="showAddBtn">新增</el-button>
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list"  style="width: 100%" border>
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button  v-if="scope.row.currentStatus == 10 || scope.row.currentStatus == 30" v-show="showEditBtn"   @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                        <el-button  v-if="scope.row.currentStatus == 10 || scope.row.currentStatus == 30" v-show="showDeleteBtn" @click="deleteOilCard(scope.row.id)" type="text" size="small">删除</el-button>
                        <el-button  v-if="scope.row.currentStatus == 10 || scope.row.currentStatus == 30" v-show="showApproveBtn" @click="approveOilCard(scope.row.id)" type="text" size="small">提交</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="code" fixed sortable label="充值编号" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">
                            {{scope.row.code}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="oillCard" sortable label="加油卡号" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="oilCardType" sortable label="油卡类型" width="100"></el-table-column>
                <el-table-column prop="rechargeType" sortable label="充值方式" width="100"></el-table-column>
                <el-table-column prop="rechargeDate" sortable label="充值日期" width="100"></el-table-column>
                <el-table-column prop="rechargeAmount" sortable label="充值金额（元）" width="140"></el-table-column>
                <el-table-column prop="recharger" sortable label="充值人" width="100"></el-table-column>
                <el-table-column prop="branchCompany" sortable label="所属组织" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="currentStatusText" sortable label="状态" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" width="140"></el-table-column>
            </el-table>

        </div>


        <!-- 导入弹窗 -->

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/oilCardRecharge/importExcel'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "加油卡充值记录导入模板" 的格式一致。
                            <a href="static/excelTemplate/加油卡充值记录导入模板.xlsx">下载模板</a>
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
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        name: 'trafficOilCardRecharge',
        mixins: [tool],
        components : {UploadSubmit,TreeSelect},
        data(){
            return {
                searchParam: {
                    companyId: ''
                },
                organization:[],
                showSearch:false,
                showAddBtn:this.getCurrentUserAuthority("oilCardRecharge/add"),
                showEditBtn:this.getCurrentUserAuthority("oilCardRecharge/edit"),
                showExportBtn:this.getCurrentUserAuthority("oilCardRecharge/export"),
                showApproveBtn:this.getCurrentUserAuthority("oilCardRecharge/approve"),
                showDeleteBtn:this.getCurrentUserAuthority("oilCardRecharge/delete"),
                showImportBtn:this.getCurrentUserAuthority("oilCardRecharge/import"),
                listUrl:"/base/oilCardRecharge/list",
                rechargeDate:[],
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
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
        watch: {},
        methods: {
            /*getList(callback){
                let params = this.extend(true,{},this.searchParam);
                if(params.companyId){
                    params.companyId = params.companyId.join(',');
                }
                if (this.rechargeDate) {
                    params.rechargeDateStart = this.rechargeDate[0];
                    params.rechargeDateEnd = this.rechargeDate[1];
                }
                this.getListByUrl("/base/oilCardRecharge/list");
                /!*params.rows = this.pageSize;
                params.page = this.page;
                ajax.get(this.listUrl,params).then(res => {
                    this.list = res.rows;
                    this.listCount = res.records;
                    $.isFunction(callback) && callback(res);
                });*!/
            },*/
            //重置筛选
            resetList(){
                this.searchParam = {
                    companyId: ''
                };
                this.$set(this.searchParam,'organCascade',false);
                this.organization=[];
                this.rechargeDate = "";
                this.handleCurrentChange(1);
            },
            deleteOilCard(id) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get('/base/oilCardRecharge/delete/' + id).then(result => {
                        if(result.status == 0){
                            this.showMessage("删除成功","success");
                            this.getList();
                        }else{
                            this.showMessage(result.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            approveOilCard(id){ //提交审批
                this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(id,'JYKCZJL').then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage(message.message,"success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            exportData(){
                window.location = this.exportUrl("base/oilCardRecharge/export?" + $.param(this.searchParam));
            },
            importData(){
                this.importVisible = true;
                this.importVisibleErrorId = "";
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
            rechargeDateChange() {
                if(this.rechargeDate && this.rechargeDate.length>0){
                    let rechargeDate = this.rechargeDate;
                    this.searchParam.rechargeDateStart = rechargeDate[0];
                    this.searchParam.rechargeDateEnd = rechargeDate[1];
                }else{
                    this.searchParam.rechargeDateStart="";
                    this.searchParam.rechargeDateEnd="";
                }
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1)
                    this.searchParam.companyId=this.organization[0];
                else{
                    this.searchParam.companyId="";
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
        }

    }
</script>

