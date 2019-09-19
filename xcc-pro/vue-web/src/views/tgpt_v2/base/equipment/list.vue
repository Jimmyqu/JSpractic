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
                    <label class="control-label">库存状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.stockStatus" clearable placeholder="请选择库存状态">
                            <el-option label="库存" :value="1"></el-option>
                            <el-option label="已出库" :value="2"></el-option>
                            <el-option label="已安装" :value="3"></el-option>
                            <el-option label="已激活" :value="4"></el-option>
                            <el-option label="已拆除" :value="5"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                    <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId" >子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">设备检修状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.checkStatus" clearable placeholder="请选择设备检修状态">
                            <el-option label="正常" :value="1"></el-option>
                            <el-option label="故障" :value="2"></el-option>
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
                        <el-input v-model="searchParam.key" clearable placeholder="设备SN、IMEI"></el-input>
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
                <el-button v-show="showExportExcelBtn" size="mini" @click="importExcel()">导入设备检修状态</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
                <el-button v-show="showImportExcelBtn" size="mini" @click="importEquipment()">导入设备</el-button>
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
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button v-if="(scope.row.showEditBtn && scope.row.showEditBtn.first)" type="text" @click="detail(scope.row)">查看</el-button>
                        <el-button v-if="(scope.row.showEditBtn1 && scope.row.showEditBtn1.first) || (scope.row.showEditBtn1 && !scope.row.showEditBtn1.first && scope.row.btnNum == 2)" type="text" @click="editSim(scope.row)">{{scope.row.sim?"手机卡变更":"手机卡绑定"}}</el-button>
                        <el-button v-if="(scope.row.showSimDetailBtn && scope.row.showSimDetailBtn.first) || (scope.row.showSimDetailBtn && !scope.row.showSimDetailBtn.first && scope.row.btnNum == 2)" type="text" @click="viewSimDetail(scope.row)">手机卡绑定记录</el-button>
                         <el-dropdown v-if="scope.row.btnNum > 2" trigger="click">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button v-if="scope.row.showEditBtn1 && !scope.row.showEditBtn1.first" type="text" @click="editSim(scope.row)">{{scope.row.sim?"手机卡变更":"手机卡绑定"}}</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="scope.row.showSimDetailBtn && !scope.row.showSimDetailBtn.first" type="text" @click="viewSimDetail(scope.row)">手机卡绑定记录</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
				<el-table-column min-width="120" label="变更日期" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="设备SN" prop="sn" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="供应商" prop="supplierName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="产品型号" prop="equipmentModal" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="IMSI" prop="imsi" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="SIM卡号" prop="sim" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="110" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="设备检修状态" prop="checkStatus" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="120" label="库存状态" prop="stockStatus" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>
        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/baseEquipmentInfo/import'"
                                  name="file">
                        <span class="info-text">
                            提示：请确保文件的格式与 "设备检修状态导入模板" 的格式一致。
                            <a href="static/excelTemplate/设备检修状态导入.xls">下载模板</a>
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

        <el-dialog title="设备导入" class="import-box" :visible.sync="importEquVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="equipmentSubmit"
                                  :url="'base/baseEquipmentInfo/equipmentImport'"
                                  name="file">
                        <span class="info-text">
                            提示：请确保文件的格式与 "设备导入模板" 的格式一致。
                            <a href="static/excelTemplate/设备导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importEquVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog
            class="demand-selector big-dialog center"
            title="入库信息"
            :visible.sync="inStorageShow"
            width="65%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{inStorage.code}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">操作人</label>
                        <div class="input-group">
                            <span>{{inStorage.creater}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">入库时间</label>
                        <div class="input-group">
                            <span>{{inStorage.createTime}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">产品型号</label>
                        <div class="input-group">
                            <span>{{inStorage.equipmentModal}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">产品类型</label>
                        <div class="input-group">
                            <span>{{inStorage.equipmentType}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">供应商</label>
                        <div class="input-group">
                            <span>{{inStorage.supplierName}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">入库数量</label>
                        <div class="input-group">
                            <span>{{inStorage.quantity}}</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            class="demand-selector big-dialog center"
            title="出库信息"
            :visible.sync="outStorageShow"
            width="65%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                    <div class="form-group">
                        <label class="control-label">订单号</label>
                        <div class="input-group">
                            <span>{{outStorage.code}}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">操作人</label>
                        <div class="input-group">
                            <span>{{outStorage.creater}}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">出库时间</label>
                        <div class="input-group">
                            <span>{{outStorage.createTime}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">产品型号</label>
                        <div class="input-group">
                            <span>{{outStorage.equipmentModal}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">产品类型</label>
                        <div class="input-group">
                            <span>{{outStorage.equipmentType}}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">供应商</label>
                        <div class="input-group">
                            <span>{{outStorage.supplierName}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">出库数量</label>
                        <div class="input-group">
                            <span>{{outStorage.quantity}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{outStorage.organizationName}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">发货人</label>
                        <div class="input-group">
                            <span>{{outStorage.sender}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">收货人</label>
                        <div class="input-group">
                            <span>{{outStorage.receiver}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">联系电话</label>
                        <div class="input-group">
                            <span>{{outStorage.phone}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">物流方式</label>
                        <div class="input-group">
                            <span>{{outStorage.logisticsType}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">物流公司</label>
                        <div class="input-group">
                            <span>{{outStorage.logisticsCompany}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                    <label class="control-label">物流\快递单号</label>
                        <div class="input-group">
                            <span>{{outStorage.logisticsCode}}</span>
                        </div>
                    </div>
                        <div class="form-group">
                        <label class="control-label">收获地址</label>
                        <div class="input-group">
                            <span>{{outStorage.address}}</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </el-dialog>

        <el-dialog
            class="demand-selector big-dialog center"
            title="安装信息"
            :visible.sync="installShow"
            width="65%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <span>{{install.plate}}</span>
                    </div>
                </div>
                    <div class="form-group">
                    <label class="control-label">车架号</label>
                    <div class="input-group">
                        <span>{{install.vin}}</span>
                    </div>
                </div>
                    <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group">
                        <span>{{install.organizationName}}</span>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </el-dialog>

        <el-dialog title="手机卡变更" class="import-box" :visible.sync="editVisible" :append-to-body="true"   width="440px":close-on-click-modal="false">
                <el-form :model="editSimForm" :rules="rules" label-position="top" ref="editSimForm">
                        <el-form-item label="原手机号" prop="oldPhone" style="width: 400px;">
                            <el-input v-model="editSimForm.oldPhone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="变更为:" prop="simId" style="width: 400px;" :rules="rules.required('请选择')">
                            <!--<el-form-item label="变更为:" prop="simId" style="width: 400px;">-->
                            <el-select v-model="editSimForm.simId" filterable clearable placeholder="请选择">
                                <el-option v-for="item in phoneList" :key="item.id"
                                           :label="item.phone" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="变更说明:" prop="summary" style="width: 400px;">
                            <el-input type="textarea" v-model="editSimForm.summary" placeholder="" maxlength="50" clearable></el-input>
                        </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('editSimForm')">保存</el-button>
                <el-button @click="editVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'baseEquipmentInfo',
        mixins: [tool,ruleTool],
        components: { TreeSelect,UploadSubmit },
        data() {
            return {
                fileUpload : true,
                importVisible : false,
                importEquVisible: false,
                importVisibleError : false,
                importVisibleErrorId : "",
                showSearch: false,
                inStorageShow:false,
                outStorageShow:false,
                installShow:false,
                showSimDetailBtn:true,
                inStorage:{},
                outStorage:{},
                install:{},
                organization:[],
                phoneList: [],
                updateDate:[],
                editVisible: false,
                editSimForm:{},
                searchParam: {
                },
                showEditBtn: this.getCurrentUserAuthority('baseEquipmentInfo/detail'),
                showAddBtn: true,
                showExportExcelBtn: this.getCurrentUserAuthority('baseEquipmentInfo/export'),
                showImportExcelBtn: this.getCurrentUserAuthority('baseEquipmentInfo/import'),
                equipmentModalList:[],
                deviceId:"",
                listUrl: 'base/baseEquipmentInfo/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquipmentModalList();


        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.organization=[];
                this.updateDate=[];
                this.getList();
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

            importExcel() {
                this.importVisibleErrorId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },

            /*设备导入*/
            importEquipment(){
                this.importEquVisible = true;
                this.$refs.equipmentSubmit && this.$refs.equipmentSubmit.init();
            },



            exportExcel() {
                window.location = this.exportUrl("base/baseEquipmentInfo/export?" + $.param(this.searchParam));
            },
            getEquipmentModalList(){
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equipmentModalList=res;
                });
            },
            detail(row){
                let id=row.id;
                let stockStatus=row.stockStatus;
                if(stockStatus=="库存"){//入库信息
                    this.inStorageShow=true;
                    this.getInStorageInfo(id);
                }else if(stockStatus=="已出库"||stockStatus=="已拆除"){//出库信息
                    this.outStorageShow=true;
                    this.getOutStorageInfo(id);
                }else if(stockStatus=="已安装"||stockStatus=="已激活"){//安装信息
                    this.installShow=true;
                    this.getIntallInfo(id);
                }else{
                    this.$message.error("库存状态有误");
                }
            },
            getInStorageInfo(id){
                ajax.get('base/baseEquipmentInfo/inStorageInfo/'+id).then(res=>{
                    if(res.status==0){
                        if(res.data!=null){
                            this.inStorage=res.data?res.data:{};
                        }
                    } else{
                            this.$message.error("入库信息有误");
                    }
                });
            },
            getOutStorageInfo(id){
                ajax.get('base/baseEquipmentInfo/outStorageInfo/'+id).then(res=>{
                    if(res.status==0)
                        this.outStorage=res.data?res.data:{};
                    else
                        this.$message.error("出库信息有误");
                });
            },
            getIntallInfo(id){
                ajax.get('base/baseEquipmentInfo/installInfo/'+id).then(res=>{
                    if(res.status==0)
                        this.install=res.data?res.data:{};
                    else
                        this.$message.error("安装信息有误");
                });
            },
            editSim(row) {
                this.editVisible = true;
                this.editSimForm = {
                    oldPhone: row.sim,
                    equipmentId: row.id
                }
                // this.editSimForm.oldPhone = row.phone;
                // this.editSimForm.equipmentId = row.id;
                this.selectPhones();

                this.$nextTick(_=>{
                    if(this.$refs["editSimForm"]){
                        this.$refs["editSimForm"].clearValidate();
                    }
                });

            },
            selectPhones() {
                var $this = this;
                ajax.get("base/baseEquipment/simList?time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.phoneList = result;
                    } else {
                        $this.phoneList = [];
                    }
                });
            },
            submitForm(editSimForm) {
                var $this = this;
                $this.$refs[editSimForm].validate((valid) => {
                    if (valid) {
                        var url = "base/baseEquipment/eidtSim";
                        ajax.post(url, $this.editSimForm).then(res => {
                            if(res.status == 0){
                                $this.$message({message: '保存成功',type: 'success'});
                                this.editVisible = false;
                                this.getList();
                            }else {
                                $this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },//手机卡绑定记录
            viewSimDetail(row) {
                this.$router.push({path:"/tgpt_v2/base/equipment/simdetail/"+row.id});
            },
            handleBtn(list){
                var setList = []
                for(var i =0;i<this.list.length;i++){
                    var scope = this.list[i]
                    scope.btnNum = 0
                    if(this.showEditBtn){
                        scope.showEditBtn = {
                            show:true
                        }
                        scope.first = true
                        scope.showEditBtn.first = true
                        scope.btnNum += 1
                    }
                    if(this.showEditBtn){
                        scope.showEditBtn1 = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showEditBtn1.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showSimDetailBtn){
                        scope.showSimDetailBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showSimDetailBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    setList.push(scope)
                }
                this.$set(this,'list',setList)
            },
        }
    }
</script>

