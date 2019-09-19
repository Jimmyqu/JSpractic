<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择">
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="providerOrganization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeProviderOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.providerOrganCascade" :disabled="!searchParam.providerCompanyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服役状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择">
                            <el-option label="未投入运营" value="1"></el-option>
                            <el-option label="待租" value="2"></el-option>
                            <el-option label="已租" value="3"></el-option>
                            <el-option label="待出车" value="4"></el-option>
                            <el-option label="维修保养" value="5"></el-option>
                            <el-option label="调拨中" value="6"></el-option>
                            <el-option label="待处置" value="7"></el-option>
                            <el-option label="申请出售中" value="8"></el-option>
                            <el-option label="出售待确认" value="9"></el-option>
                            <el-option label="申请处置中" value="10"></el-option>
                            <el-option label="申请使用中" value="11"></el-option>
                            <el-option label="已出售" value="12"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车品牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleModel" clearable placeholder="请输入车品牌"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车系</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleSeries" clearable placeholder="请输入车系"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">距离下次检验天数</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.nextInspectionDays" clearable placeholder="请选择">
                            <el-option label="10天以下" value="1"></el-option>
                            <el-option label="10到30天" value="2"></el-option>
                            <el-option label="30天以上" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.inspectionStatus" clearable placeholder="请选择">
                            <el-option label="有效期" value="1"></el-option>
                            <el-option label="即将到期" value="2"></el-option>
                            <el-option label="过期" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="请输入车辆"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="creatDate"
                            @change="creatDateChange"
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

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="dialogFormShow(true)">导入</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="200">
                    <template slot-scope="scope" v-if="scope.row.vehicleSource == 1">
                        <el-button v-show="showRegisterBtn" type="text" @click="register(scope.row)">年检登记</el-button>
                        <template v-if="scope.row.annualInspectionId!=null">
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row)">编辑</el-button>
                        </template>
                        <el-button v-show="showRecordBtn" type="text" @click="record(scope.row)">年检记录</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车辆所属" prop="assetsTypeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服役状态" prop="vehicleStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="modelInfoName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员" prop="driverName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="年检日期" prop="operateDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="检验合格有效期" prop="effectiveDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="距下次检验天数" prop="nextInspectionDays" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="状态" prop="inspectionStatus" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>
        <el-dialog
            class="demand-selector big-dialog center"
            title="车辆年检登记"
            :visible.sync="annualShow"
            width="40%"
            append-to-body
            :close-on-click-modal="false">
            <el-form :model="annualForm" :rules="rules" ref="annualForm" label-width="100px" v-cloak>
                <el-form-item>
                    <span>{{annualForm.plate}}（{{annualForm.assetsTypeText}}）{{annualForm.modelInfoName}}，所属部门：{{annualForm.organizationName}}</span>
                </el-form-item>
                <el-form-item label="年检日期" prop="operateDate">
                    <el-date-picker v-model="annualForm.operateDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择年检日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="年检结果" prop="result">
                    <el-radio v-model="annualForm.result" :label="1">合格</el-radio>
                    <el-radio v-model="annualForm.result" :label="2">不合格</el-radio>
                </el-form-item>
                <el-form-item label="检验合格有效期至" prop="effectiveDate">
                    <el-date-picker v-model="annualForm.effectiveDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="检验单位" prop="department">
                    <el-input v-model="annualForm.department" clearable placeholder="请输入检验单位" maxLength="50"></el-input>
                </el-form-item>
                <el-form-item label="年检费用(元)" prop="cost">
                    <el-input v-model="annualForm.cost" clearable placeholder="请输入年检费用"></el-input>
                </el-form-item>
                <el-form-item label="年检办理人" prop="operator">
                    <el-input v-model="annualForm.operator" clearable placeholder="请输入年检办理人" maxLength="50"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('annualForm')" >保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'traffic/coreAnnualInspection/import'"
                                   name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆年检导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆年检导入模板.xls">下载模板</a>
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
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'annualList',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '金额输入异常', trigger: 'blur'};
            return {
                state:false,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                providerOrganization:[],
                serviceOrganization:[],
                showSearch: false,
                annualShow: false,
                searchParam: {},
                annualForm:{},
                showRegisterBtn: this.getCurrentUserAuthority('annualList/register'),
                showEditBtn: this.getCurrentUserAuthority('annualList/edit'),
                showRecordBtn: this.getCurrentUserAuthority('annualList/record'),
                showExportExcelBtn: this.getCurrentUserAuthority('annualList/export'),
                showImportBtn:this.getCurrentUserAuthority('annualList/import'),
                listUrl: 'traffic/coreAnnualInspection/list',
                rules: {
                    operateDate:[
                        { required: true, message: '请选择年检日期', trigger: 'blur' }
                    ],
                    result:[
                        { required: true, message: '请选个年检结果', trigger: 'blur' }
                    ],
                    effectiveDate: [
                        { required: true, message: '请选择检验合格有效期至', trigger: 'blur'},
                    ],
                    cost: [
                        { required: true, message: '请输入年检费用', trigger: 'blur' },
                         moneyValidator
                    ]
                },
                creatDate:[],
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.creatDate = [startTime,endTime];
                this.searchParam.startTime = startTime;
                this.searchParam.endTime = endTime;
            }
            this.searchParam = Object.assign({},this.searchParam);

            var inspectionStatus = this.$route.query.inspectionStatus;
            if(inspectionStatus){
                this.searchParam.inspectionStatus = inspectionStatus;
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            register(row){
                if(this.$refs.annualForm){
                    this.$nextTick(_ =>{
                        this.$refs.annualForm.clearValidate();
                    })
                }
                this.annualForm={};
                this.annualForm.vehicleId=row.id;
                this.annualForm.plate=row.plate;
                this.annualForm.assetsTypeText=row.assetsTypeText;
                this.annualForm.organizationName=row.organizationName;
                this.annualForm.modelInfoName=row.modelInfoName;
                this.annualForm=Object.assign({},this.annualForm);
                this.annualShow=true;
            },
            edit(row){
                if(this.$refs.annualForm){
                    this.$nextTick(_ =>{
                        this.$refs.annualForm.clearValidate();
                    })
                }
                this.annualForm={};
                this.initForm(row);
                this.annualShow=true;
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'providerOrganCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.creatDate=[];
                this.providerOrganization=[];
                this.serviceOrganization=[];
                this.getList();
            },
            record(row){
                let url=this.$route.fullPath;
                let param={
                    id:row.id,
                    plate:row.plate,
                    assetsTypeText:row.assetsTypeText,
                    organizationName:row.organizationName,
                    modelInfoName:row.modelInfoName
                };
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/record",query:param});
                }else{
                    this.$router.push({path:url+"/record",query:param});
                }
            },
            creatDateChange() {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0];
                    this.searchParam.endTime = creatDate[1];
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            changeProviderOrganization(data){
                if(this.providerOrganization && this.providerOrganization.length==1){
                    this.searchParam.providerCompanyId=this.providerOrganization[0];
                }else{
                    this.searchParam.providerCompanyId='';
                    this.$set(this.searchParam,'providerOrganCascade',false);
                }
            },
            changeServiceOrganization(data){
                if(this.serviceOrganization && this.serviceOrganization.length==1){
                    this.searchParam.serviceRegionId=this.serviceOrganization[0];
                }else{
                    this.searchParam.serviceRegionId='';
                    this.$set(this.searchParam,'serviceOrganCascade',false);
                }
            },
            initForm(row){
                ajax.get("traffic/coreAnnualInspection/detail/"+row.annualInspectionId).then(res => {
                    this.annualForm = res.data;
                    this.annualForm.id=row.annualInspectionId;
                    this.annualForm.vehicleId=row.id;
                    this.annualForm.plate=row.plate;
                    this.annualForm.assetsTypeText=row.assetsTypeText;
                    this.annualForm.organizationName=row.organizationName;
                    this.annualForm.modelInfoName=row.modelInfoName;
                    this.annualForm=Object.assign({},this.annualForm);
                })
            },
            submitForm(annualForm) {
                this.$refs[annualForm].validate((valid) => {
                    if (valid) {

                        var url = "traffic/coreAnnualInspection/save";

                        if(this.state) {
                            return;
                        }
                        this.state = true;
                        ajax.post(url, this.annualForm).then((res) => {
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);


                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.annualShow=false;
                                this.getList();
                            }else {
                                this.$message.error(res.message);
                            }
                        }).catch(_=>{
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);
                        });
                    } else {
                        return false;
                    }
                });
            },
            dialogFormShow(flag){
                this.importVisibleErrorId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
            exportExcel() {
                window.location = this.exportUrl("traffic/coreAnnualInspection/excel?" + $.param(this.searchParam));
            },
            close(){
                this.annualShow=false;
            }
        }
    }
</script>

