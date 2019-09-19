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
                        <el-select v-model="searchParam.serviceStatus" clearable placeholder="请选择">
                            <el-option label="长租自驾" value="1"></el-option>
                            <el-option label="长租配驾" value="2"></el-option>
                            <el-option label="散租自驾" value="3"></el-option>
                            <el-option label="散租配驾" value="4"></el-option>
                            <el-option label="替代车" value="5"></el-option>
                            <el-option label="公务车" value="6"></el-option>
                            <el-option label="未服役" value="7"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleModel" clearable  placeholder="请输入车车型"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">距离下次保养里程</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.miNextMileage" clearable placeholder="请选择">
                            <el-option label="100公里以下" value="1"></el-option>
                            <el-option label="100到500公里" value="2"></el-option>
                            <el-option label="500公里以上" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">保养状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.miStatus" clearable placeholder="请选择">
                            <el-option label="有效期" value="1"></el-option>
                            <el-option label="即将到期" value="2"></el-option>
                            <el-option label="过期" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">保养登记日期</label>
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
                    <template slot-scope="scope">
                        <el-button v-show="showRegisterBtn" type="text" @click="register(scope.row)">保养登记</el-button>
                        <template v-if="scope.row.maintainCwId!=null">
                            <el-button v-show="showEditBtn" type="text" @click="edit(scope.row)">编辑</el-button>
                        </template>
                        <el-button v-show="showRecordBtn" type="text" @click="record(scope.row)">保养记录</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="150" label="保养编号" prop="miCode" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="车辆所属" prop="assetsTypeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="服役状态" prop="serviceStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="180" label="车型" prop="modelInfoName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="110" label="最近保养日期" prop="miDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="上次保养里程（KM）" prop="miMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="下期保养间隔（KM）" prop="miInterval" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="距下期保养里程（KM）" prop="miNextMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="保养状态" prop="miStatusText" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>
        <el-dialog
            class="demand-selector big-dialog center"
            title="车辆保养登记"
            :visible.sync="maintainCwShow"
            width="40%"
            append-to-body
            :close-on-click-modal="false">
            <el-form :model="maintainCwForm" :rules="rules" ref="maintainCwForm" label-width="100px" v-cloak>
                <el-form-item>
                    <span>{{maintainCwForm.plateNo}}（{{maintainCwForm.assetsTypeText}}）{{maintainCwForm.modelInfoName}}，服务组织：{{maintainCwForm.serviceOrganizationName}}</span>
                </el-form-item>
                <el-form-item label="保养人" prop="miOperator">
                    <el-input v-model="maintainCwForm.miOperator" clearable placeholder="请输入保养人" maxLength="18"></el-input>
                </el-form-item>
                <el-form-item label="本期保养里程（KM）" prop="miMileage">
                    <el-input v-model="maintainCwForm.miMileage" clearable placeholder="请输入本期保养里程"></el-input>
                </el-form-item>
                <el-form-item label="下期保养间隔（KM）" prop="miInterval">
                    <el-input v-model="maintainCwForm.miInterval" clearable placeholder="请输入下期保养间隔"></el-input>
                </el-form-item>
                <el-form-item label="本期保养日期" prop="miDate">
                    <el-date-picker v-model="maintainCwForm.miDate" clearable type="date" placeholder="选择本期保养日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="本期保养费用(元)" prop="miCost">
                    <el-input v-model="maintainCwForm.miCost" clearable placeholder="请输入本期保养费用"></el-input>
                </el-form-item>
                <el-form-item label="定期保养项目" >
                    <el-checkbox-group v-model="miProjectList">
                        <el-checkbox v-for="project in projectList" :label="project.value" :key="project.value">{{project.text}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="其它项目" prop="miOtherProject">
                    <el-input type="textarea" v-model="maintainCwForm.miOtherProject" clearable placeholder="请输入其它项目" maxLength="500"></el-input>
                </el-form-item>
                <el-form-item class="big" label="上传保养附件">
                    <upload-panel :size="5" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="pics"
                                  :show-img="true"></upload-panel>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('maintainCwForm')" >保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'traffic/trafficVehicleMaintainCw/import'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆保养登记信息导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆保养登记信息导入模板.xlsx">下载模板</a>
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
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'maintainCwList',
        mixins: [ tool, ruleTool ],
        components: { TreeSelect,UploadSubmit,UploadPanel},
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '金额输入异常', trigger: 'blur'};
            var mileageValidator = {pattern: moneyRegex,required: true, message: '保养里程输入异常', trigger: 'blur'};
            var intervalValidator = {pattern: moneyRegex,required: true, message: '保养间隔输入异常', trigger: 'blur'};
            return {
                state:false,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                serviceOrganization:[],
                pics:[],
                miProjectList:[],
                showSearch: false,
                maintainCwShow: false,
                searchParam: {},
                maintainCwForm:{},
                showRegisterBtn: this.getCurrentUserAuthority('annualList/register'),
                showEditBtn: this.getCurrentUserAuthority('annualList/edit'),
                showRecordBtn: this.getCurrentUserAuthority('annualList/record'),
                showExportExcelBtn: this.getCurrentUserAuthority('annualList/export'),
                showImportBtn:this.getCurrentUserAuthority('annualList/import'),
                listUrl: 'traffic/trafficVehicleMaintainCw/list',
                rules: {
                    miOperator:[
                        { required: true, message: '请输入保养人', trigger: 'blur' }
                    ],
                    miMileage:[
                        { required: true, message: '请输入本期保养里程', trigger: 'blur' },
                        mileageValidator
                    ],
                    miInterval:[
                        { required: true, message: '请输入下期保养间隔', trigger: 'blur' },
                        intervalValidator
                    ],
                    miDate: [
                        { required: true, message: '请选择本期保养日期', trigger: 'blur'},
                    ],
                    miCost: [
                        { required: true, message: '请输入本期保养费用', trigger: 'blur' },
                         moneyValidator
                    ]
                },
                creatDate:[],
                projectList: [],
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var plate = this.$route.query.plate;
            if(plate){
                this.searchParam.plate = plate;
            }
            var regionId = this.$route.query.regionId;
            if(regionId){
                this.serviceOrganization = [regionId];
                this.searchParam.serviceRegionId = regionId;
            }

            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.creatDate = [startTime,endTime];
                this.searchParam.startTime = startTime;
                this.searchParam.endTime = endTime;
            }
            this.searchParam = Object.assign({},this.searchParam);

            var miStatus = this.$route.query.miStatus;
            if(miStatus){
                this.searchParam.miStatus = miStatus;
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            register(row){
                if(this.$refs.maintainCwForm){
                    this.$nextTick(_ =>{
                        this.$refs.maintainCwForm.clearValidate();
                    })
                }
                this.maintainCwForm={};
                this.miProjectList = [];
                this.pics = [];
                this.selectProjectList();
                this.maintainCwForm.vehicleId=row.vehicleId;
                this.maintainCwForm.plateNo=row.plate;
                this.maintainCwForm.assetsTypeText=row.assetsTypeText;
                this.maintainCwForm.serviceOrganizationName=row.serviceOrganizationName;
                this.maintainCwForm.modelInfoName=row.modelInfoName;
                this.maintainCwForm=Object.assign({},this.maintainCwForm);
                this.maintainCwShow=true;
            },
            edit(row){
                if(this.$refs.maintainCwForm){
                    this.$nextTick(_ =>{
                        this.$refs.maintainCwForm.clearValidate();
                    })
                }
                this.maintainCwForm={};
                this.selectProjectList();
                this.initForm(row);
                this.maintainCwShow=true;
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.creatDate=[];
                this.serviceOrganization=[];
                this.getList();
            },
            record(row){
                let url=this.$route.fullPath;
                let param={
                    id:row.vehicleId,
                    plate:row.plate,
                    assetsTypeText:row.assetsTypeText,
                    serviceOrganizationName:row.serviceOrganizationName,
                    serviceRegionId:row.serviceRegionId,
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
            changeServiceOrganization(data){
                if(this.serviceOrganization && this.serviceOrganization.length==1){
                    this.searchParam.serviceRegionId=this.serviceOrganization[0];
                }else{
                    this.searchParam.serviceRegionId='';
                    this.$set(this.searchParam,'serviceOrganCascade',false);
                }
            },
            initForm(row){
                ajax.get("traffic/trafficVehicleMaintainCw/detail/"+row.maintainCwId).then(res => {
                    if(null != res.data.miPics && res.data.miPics.length > 0){
                        this.pics = JSON.parse(res.data.miPics);
                    }
                    if(null != res.data.miProjectList && res.data.miProjectList.length > 0){
                        this.miProjectList =  res.data.miProjectList.split(',');
                    }
                    this.maintainCwForm = res.data;
                    this.maintainCwForm.plateNo=row.plate;
                    this.maintainCwForm.assetsTypeText=row.assetsTypeText;
                    this.maintainCwForm.serviceOrganizationName=row.serviceOrganizationName;
                    this.maintainCwForm.modelInfoName=row.modelInfoName;
                    if(res.data.miDate){
                        this.maintainCwForm.miDate = res.data.miDate.split(' ')[0];
                    }
                    this.maintainCwForm=Object.assign({},this.maintainCwForm);
                })
            },
            selectProjectList() {
                var $this = this;
                ajax.get("admin/dict/type/定期保养项目").then(result => {
                    console.log(result);
                    if (result.length > 0) {
                        $this.projectList = result;
                    } else {
                        $this.projectList = [];
                    }
                });
            },
            submitForm(maintainCwForm) {
                let data = this.extend(true,{},this.maintainCwForm);
                this.$refs[maintainCwForm].validate((valid) => {
                    if (valid) {
                        if (this.pics.length > 0)//转换图片
                        {
                            data.miPics = JSON.stringify(this.pics);
                        }

                        data.miProjectList = this.miProjectList.join(',');

                        var url = "traffic/trafficVehicleMaintainCw/save";

                        if(this.state) {
                            return;
                        }
                        this.state = true;
                        ajax.post(url, data).then((res) => {
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);


                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.maintainCwShow=false;
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
                window.location = this.exportUrl("traffic/trafficVehicleMaintainCw/excel?" + $.param(this.searchParam));
            },
            close(){
                this.maintainCwShow=false;
            }
        }
    }
</script>

