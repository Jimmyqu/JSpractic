<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">保单号</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.policyNumber" clearable  placeholder="请输入保单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehiclePlate" clearable placeholder="请输入车辆"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <template>
                            <el-select v-model="searchParam.billStatus" clearable placeholder="请选择" >
                                <el-option
                                    v-for="(value, key) in billStatusMap"
                                    :key="key"
                                    :label="value"
                                    :value="key"></el-option>
                            </el-select>
                        </template>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">保险公司</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.insuranceCompany" clearable placeholder="请输入保险公司"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">投保日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="insuredDate"
                            @change="insuredDateChange"
                            clearable
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">到日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="expiryDate"
                            @change="expiryDateChange"
                            clearable
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :editable="false">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.vehicleModel" clearable  placeholder="请输入车型"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车架号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vin" clearable placeholder="请输入车架号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">保险类</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.insuranceType" clearable placeholder="请选择保险类">
                            <el-option label="机动车辆商业保险" value="1" key="1"></el-option>
                            <el-option label="机动车交通事故责任强制保险" value="2" key="2"></el-option>
                            <el-option label="车船税" value="3" key="3"></el-option>
                            <el-option label="承运险" value="4" key="4"></el-option>
                            <el-option label="车辆被盗险" value="5" key="5"></el-option>
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
                <el-button size="mini" v-show="showImportBtn" @click="dialogFormShow(true)">导入</el-button>
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
                <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" border style="width: 100%">
                    <el-table-column label="操作" width="150" fixed>
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.billStatus == 10" v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button v-if="scope.row.insuranceType == 1 && scope.row.billStatus == 10" v-show="showSendBackBtn" @click="sendBack(scope.row.id)" type="text" size="small">退保</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="policyNumber" label="保单号" width="200" sortable fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row.id)">
                                {{scope.row.policyNumber}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="insuranceTypeName" label="保险类" sortable min-width="200" show-overflow-tooltip ></el-table-column>
                    <el-table-column prop="vehiclePlate" label="车牌" sortable min-width="140"></el-table-column>
                    <el-table-column prop="vin" label="车架号" sortable min-width="200" show-overflow-tooltip ></el-table-column>
                    <el-table-column prop="insuranceCompany" label="保险公司" sortable min-width="140" show-overflow-tooltip ></el-table-column>
                    <!--<el-table-column prop="policySalesman" label="保险联系人" sortable min-width="180"></el-table-column>-->
                    <el-table-column prop="expiryDayDiff" label="到期剩余天数" sortable  min-width="120">
                        <template slot-scope="scope">
                            <span :class="{'text-red':scope.row.expiryDayDiff <= 30}">{{scope.row.expiryDayDiff}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="insuredDate" label="投保日期" sortable min-width="100"></el-table-column>
                    <el-table-column prop="expiryDate" label="到期日" sortable min-width="100"></el-table-column>
                    <!--<el-table-column prop="insuranceCost" label="签约保费（元）"sortable  min-width="140"></el-table-column>-->
                    <el-table-column prop="companyName" label="服务组织" sortable min-width="140" show-overflow-tooltip ></el-table-column>
                    <el-table-column prop="billStatusText" label="状态" sortable min-width="100" show-overflow-tooltip ></el-table-column>
                    <el-table-column prop="creater" label="创建人" sortable min-width="140"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable min-width="150"></el-table-column>
                </el-table>
            </template>
        </div>
        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" v-loading="uploadLoading" >
               <!-- <el-form-item label="所属组织" required>
                    <tree-select v-model="exportOrganization" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeExportOrganization"></tree-select>
                </el-form-item>-->
                <el-form-item class="big" label="上传保险单明细(注：图片的名称需与导入文件中的保单号一致)">
                    <upload-panel :size="300" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="imgs" :loading.sync="uploadLoading"
                                  :show-img="false">
                    </upload-panel>
                </el-form-item>
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :params="parseData(imgs)"
                                  :url="'core/insuranceBill/import'"
                                   name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆保险单导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆保险单导入模板.xlsx">下载模板</a>
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
        <!-- 退保弹窗-->
        <el-dialog title="退保" :visible.sync="sendBackVisible" :append-to-body="true"  width="500">
            <el-form :model="backForm" :rules="rules" label-position="top" ref="backForm" class="full-input">
                <el-form-item label="退保日" prop="returnDate">
                    <el-date-picker v-model="backForm.returnDate"   value-format="yyyy-MM-dd"  type="date" placeholder="请选择退保日" ></el-date-picker>
                </el-form-item>
                <el-form-item label="退保金额（元）" label-width="120px" prop="returnAmount">
                    <el-input v-model="backForm.returnAmount" clearable ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close('backForm')">取 消</el-button>
                <el-button type="primary" @click="submit('backForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import UploadPanel from '@/components/UploadPanel/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficInsuranceBill',
        mixins: [ tool, ruleTool ],
        components: { TreeSelect,UploadSubmit,UploadPanel},
        data(){
            return {
                importVisible : false,
                importVisibleError : false,
                imgs:[],
                //organizationId:"",
                organization:[],
                showSearch:false,
                showImportBtn:this.getCurrentUserAuthority("insuranceBill/import"),
                showAddBtn:this.getCurrentUserAuthority("insuranceBill/add"),
                showEditBtn:this.getCurrentUserAuthority("insuranceBill/edit"),
                showExportBtn:this.getCurrentUserAuthority("insuranceBill/export"),
                showSendBackBtn:this.getCurrentUserAuthority("insuranceBill/sendBack"),
                billStatusMap:[],
                sendBackVisible:false,
                listUrl:"core/insuranceBill/list",
                insuredDate:[],
                companys:[],
                exportOrganization:[],
                backForm:{},
                insuranceBillId:"",
                expiryDate:[],
                rules:{
                    returnDate: [
                        { required: true, message: '请选择退保日', trigger: 'change' },
                    ],
                    returnAmount: [
                        { required: true, message: '请输入退保金额', trigger: 'blur' },
                    ]
                },
                uploadLoading:false
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted: function (){

            var billStatus = this.$route.query.billStatus;
            if(billStatus){
                this.searchParam.billStatus = billStatus;
            }
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.searchParam.insuredDateStart = startTime;
                this.searchParam.insuredDateEnd = endTime;
            }
            this.insuredDate.push(startTime);
            this.insuredDate.push(endTime);
            this.searchParam = Object.assign({},this.searchParam);
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getBillStatusList();

        },
        methods: {
            /*getList(callback){
                let params = this.extend(true,{},this.searchParam);
                if(params.companyId){
                    params.companyId = params.companyId.join(',');
                }
                if (this.insuredDate) {
                    params.insuredDateStart = this.insuredDate[0];
                    params.insuredDateEnd = this.insuredDate[1];
                }
                if (this.expiryDate) {
                    params.expiryDateStart = this.expiryDate[0];
                    params.expiryDateEnd = this.expiryDate[1];
                }
                params.rows = this.pageSize;
                params.page = this.page;
                ajax.get(this.listUrl,params).then(res => {
                    this.list = res.rows;
                    this.listCount = res.records;
                    $.isFunction(callback) && callback(res);
                });
            },*/
            //重置筛选
            resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false);
                this.insuredDate = [];
                this.expiryDate = [];
                this.organization= [];
                this.getList();
            },
            insuredDateChange() {
                if(this.insuredDate && this.insuredDate.length>0){
                    let createDate = this.insuredDate;
                    this.searchParam.insuredDateStart = createDate[0];
                    this.searchParam.insuredDateEnd = createDate[1];
                }else{
                    this.searchParam.insuredDateStart="";
                    this.searchParam.insuredDateEnd="";
                }
            },
            expiryDateChange() {
                if(this.expiryDate && this.expiryDate.length>0){
                    let createDate = this.expiryDate;
                    this.searchParam.expiryDateStart = createDate[0];
                    this.searchParam.expiryDateEnd = createDate[1];
                }else{
                    this.searchParam.expiryDateStart="";
                    this.searchParam.expiryDateEnd="";
                }
            },


            getBillStatusList(){
                ajax.get('/core/insuranceBill/getBillStatusEnum/').then(result => {
                    if(result.status == 0){
                        this.billStatusMap = result.data;
                    }
                });
            },
            submitApprove(row){
                this.$confirm('是否确定提交审批?', '提示', {
                    confirmButtonText: '确定1',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    startProcessAsync(row.id,'CLBXD').then((message)=>{
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
                window.location = this.exportUrl("core/insuranceBill/export?" + $.param(this.searchParam));
            },
            //退保
            sendBack(id){
                this.insuranceBillId = id;
                this.backForm = {};
                this.sendBackVisible = true;
            },
            submit(backForm){
                debugger
                this.$refs[backForm].validate((valid) => {
                    if (valid) {
                        let data = this.backForm;
                        data.id = this.insuranceBillId;
                        ajax.post("core/insuranceBill/sendBack", data).then((res) => {
                            if(res.status == 0){
                                this.$message({message: '退保成功！',type: 'success'});
                                this.close(backForm);
                            }else {
                                this.$message.error(res.message);
                            }
                        })
                    }
                });
            },
            dialogFormShow(flag){
                this.exportOrganization=[];
                this.imgs=[];
                //this.organizationId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
           /* changeExportOrganization(data){
                if(this.exportOrganization && this.exportOrganization.length==1)
                    this.organizationId=this.exportOrganization[0];
            },*/
            close(backForm){
                this.backForm = {};
                this.$refs[backForm].resetFields();
                this.sendBackVisible = false;
                this.getList();
            },
            parseData(data){
                let param={
                    data:JSON.stringify(data)
                };
                return param;
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1)
                    this.searchParam.companyId=this.organization[0];
                else
                    this.searchParam.companyId="";
                this.$set(this.searchParam,'organCascade',false)
            },
            detail(id){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+id});
                }else{
                    this.$router.push({path:url+"/detail/"+id});
                }
            },
        }
    }
</script>

