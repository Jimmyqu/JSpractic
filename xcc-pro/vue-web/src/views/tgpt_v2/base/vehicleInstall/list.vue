<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentModalId" clearable placeholder="请选择产品型号">
                            <el-option v-for="item in equipmentModalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                    <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">安装状态</label>
                    <div class="input-group">
                        <el-select v-model="installStatus" multiple clearable placeholder="请选择安装状态">
                            <el-option label="未安装" :value="1"></el-option>
                            <el-option label="已安装" :value="2"></el-option>
                            <el-option label="已激活" :value="3"></el-option>
                            <el-option label="已拆除" :value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">变更日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="updateDate"
                            @change="updateDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.key" clearable placeholder="车架号、车牌、IMEI"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="importData()">导入</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <template>
                            <el-button v-show="showInstallBtn" type="text" @click="install(scope.row)">安装设备</el-button>
                        </template>
                        <template v-if="scope.row.imei">
                            <el-button v-show="showTakeBtn" type="text" @click="takeDown(scope.row)">拆除设备</el-button>
                        </template>
                        <el-button v-show="showHistoryBtn" type="text" @click="history(scope.row.id)">设备记录</el-button>
                    </template>
                </el-table-column>
				<el-table-column min-width="120" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车架号" prop="vin" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="服务组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="设备SN" prop="sn" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="产品类型" prop="equipmentType" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="产品型号" prop="equipmentModal" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="手机号码" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="变更人" prop="updater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="变更时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>


        <el-dialog
            class="demand-selector big-dialog center"
            title="绑定设备"
            :visible.sync="installShow"
            width="30%"
            append-to-body
            :close-on-click-modal="false">
            <el-form :model="installInfo" :rules="rules" ref="installInfo" label-width="100px" v-cloak>
                <el-form-item label="设备类型">
                    <el-select v-model="activeName" placeholder="请选择" @change="changeType()">
                        <el-option label="有线" value="obd"></el-option>
                        <el-option label="无线" value="se"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="车牌">
                    <el-input v-model="installInfo.plate" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="IMEI" prop="imei">
                    <template>
                        <el-select
                            v-model="installInfo.imei" clearable
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入IMEI"
                            :remote-method="getImeiList"
                            :loading="imeiLoading">
                            <el-option v-for="item in imeiList" :key="item.id" :label="item.imei" :value="item.imei"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="安装时里程" prop="mileage" v-if="activeName == 'obd'">
                    <el-input maxlength="6" autocomplete="off" v-model="installInfo.mileage"></el-input>
                </el-form-item>
                <el-form-item label="安装位置" v-if="activeName == 'se'">
                    <el-select v-model="installInfo.installPlace" placeholder="请选择">
                        <el-option label="座椅底下" value="座椅底下"></el-option>
                        <el-option label="副驾杂物箱" value="副驾杂物箱"></el-option>
                        <el-option label="前保险杠" value="前保险杠"></el-option>
                        <el-option label="门板杂物箱" value="门板杂物箱"></el-option>
                        <el-option label="后备箱" value="后备箱"></el-option>
                        <el-option label="后保险杠" value="后保险杠"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安装人员" v-if="activeName == 'se'">
                    <el-input maxlength="10" autocomplete="off" v-model="installInfo.installPersion"></el-input>
                </el-form-item>
                <el-form-item label="安装时间" v-if="activeName == 'se'">
                    <el-date-picker
                        v-model="installInfo.installTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('installInfo')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-dialog>
        <!-- 导入弹窗 -->

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/vehicleInstall/import'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆安装管理导入模版" 的格式一致。
                            <a href="static/excelTemplate/车辆安装管理导入模版.xlsx">下载模板</a>
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
        name: 'vehicleInstallManagement',
        mixins: [tool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                showSearch: false,
                installShow:false,
                installInfo:{},
                organization:[],
                updateDate:[],
                imeiList:[],
                searchParam: {
                },
                activeName:'obd',
                installStatus:[],
                showExportBtn: this.getCurrentUserAuthority('vehicleInstall/export'),
                showImportBtn: this.getCurrentUserAuthority('vehicleInstall/import'),
                showInstallBtn: this.getCurrentUserAuthority('vehicleInstall/install'),
                showTakeBtn: this.getCurrentUserAuthority('vehicleInstall/take'),
                showHistoryBtn: this.getCurrentUserAuthority('vehicleInstall/history'),
                equipmentModalList:[],
                listUrl: 'base/vehicleInstall/list',
                imeiLoading:false,
                rules:{
                    imei: [
                        { required: true, message: '请输入设备IMEI', trigger:'blur'},
                    ],
                }
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var installStatus=this.$route.query.installStatus;
            if(installStatus){
                this.installStatus=[installStatus];
                // this.searchParam = Object.assign({},this.searchParam);
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquipmentModalList();
        },
        methods: {
            getImeiList(query){
                if(query!='' && query!=null && query.length > 3){
                    this.imeiLoading = true;
                    ajax.get(`base/vehicleInstall/imeiList?type=${this.activeName}&imei=${query}`).then(res=>{
                        this.imeiList = res;
                        this.imeiLoading = false;
                    });
                }
            },
            getListBefore(params){
                if(this.installStatus && this.installStatus.length>0){
                    params.installStatus=this.installStatus.join(',');
                    this.searchParam.installStatus=this.installStatus.join(',');
                }else{
                    params.installStatus='';
                    this.searchParam.installStatus='';
                }

            },
            changeType(){
                this.installInfo.imei="";
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.organization=[];
                this.updateDate=[];
                this.installStatus=[];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            updateDateChange() {
                if(this.updateDate && this.updateDate.length>0){
                let updateDate = this.updateDate;
                this.searchParam.startUpdateTime = updateDate[0] + ' 00:00:00';
                this.searchParam.endUpdateTime = updateDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startUpdateTime="";
                    this.searchParam.endUpdateTime="";
                }
            },

            exportExcel() {
                window.location = this.exportUrl("base/vehicleInstall/export?" + $.param(this.searchParam));
            },
            getEquipmentModalList(){
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equipmentModalList=res;
                });
            },
            install(row){
               this.imeiList=[];
               this.installShow=true;
               this.installInfo.plate=row.plate;
               this.installInfo.id=row.id;
               this.installInfo.imei="";
               this.activeName = "obd";
               this.installInfo = Object.assign({},this.installInfo);
            },
            submitForm: function (form) {
                var data = this.installInfo;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('base/vehicleInstall/install', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '绑定成功',
                                type: 'success'
                            });
                            this.installShow=false;
                            this.getList();
                        }else{
                            this.$message({
                                message: rs.msg,
                                type: 'error'
                            });
                        }
                    });
                });
            },

            takeDown(row){
                this.$confirm('你确定要拆除设备吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get(`base/vehicleInstall/takedown/${row.id}?imei=${row.imei}`).then(
                        res=>{
                            if(res.status==0){
                                this.$message({
                                    message: '拆除成功',
                                    type: 'success'
                                });
                                this.installShow=false;
                                this.getList();
                            }else{
                                this.$message({
                                    message: '删除失败',
                                    type: 'error'
                                });
                            }
                        }
                    );
                });
            },
            close(){
                this.installInfo.mileage = "";
                this.installShow=false;
            },
            history(id){
                this.$router.push({path:"/tgpt_v2/base/vehicleInstall/history/"+id});
            },
            importData(){
                this.importVisible = true;
                this.importVisibleErrorId = "";
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            }
        }
    }
</script>

