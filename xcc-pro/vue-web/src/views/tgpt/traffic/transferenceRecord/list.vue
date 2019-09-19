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
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicleModelInfo" placeholder="请输入车型" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                    url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showBatchBtn" type="warning" size="mini" @click="batchTransfer()">批量调拨</el-button>
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
                        <el-button v-show="showTransferBtn" v-if="(scope.row.vehicleStatus==1 || scope.row.vehicleStatus==2) && scope.row.bindStatus==2" @click="transfer(scope.row)" type="text" size="small" >
                            调拨
                        </el-button>
                        <el-button v-show="showRecordBtn"  @click="transferRecord(scope.row.id)" type="text" size="small">
                            调拨记录
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                <el-table-column prop="vin" sortable label="车架号" min-width="180"></el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="organizationName" sortable label="所属组织" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="serviceRegionName" sortable label="服务组织" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="vehicleStatusText" sortable label="车辆状态" min-width="90"></el-table-column>
                <el-table-column prop="serviceStatusText" sortable label="服役状态" min-width="90"></el-table-column>
                <el-table-column prop="vehicleSourceText" sortable label="车辆来源" min-width="90"></el-table-column>
            </el-table>
        </div>

        <el-dialog
            class="demand-selector big-dialog center"
            title="车辆调拨"
            :visible.sync="transferShow"
            width="40%"
            append-to-body
            :close-on-click-modal="false">
            <el-form :model="transferForm" :rules="transferRule" ref="transferForm" label-width="120px" v-cloak>
                <el-form-item label="车牌">
                    <span>{{transferForm.plate}}</span>
                </el-form-item>
                <el-form-item label="车型">
                    <span>{{transferForm.vehicleModelInfoName}}</span>
                </el-form-item>
                <el-form-item label="所属组织">
                    <span>{{transferForm.organizationName}}</span>
                </el-form-item>
                <el-form-item label="服务组织">
                    <span>{{transferForm.serviceRegionName}}</span>
                </el-form-item>
                <el-form-item label="调拨后所属组织" prop="afterOrganizationId">
                    <tree-select v-model="transferForm.afterOrganizationId" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/companyTree" @change="changeAfterOrganization"></tree-select>
                </el-form-item>
                <el-form-item label="调拨后服务组织" prop="afterServiceOrganizationId">
                    <tree-select v-model="transferForm.afterServiceOrganizationId" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/companyTree" @change="changeAfterServiceOrganization"></tree-select>
                </el-form-item>
                <el-form-item label="调拨日期" prop="transferTime">
                    <el-date-picker v-model="transferForm.transferTime" value-format="yyyy-MM-dd" clearable type="date" placeholder="选择调拨日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="调拨事由" prop="reason">
                    <el-input v-model="transferForm.reason" clearable placeholder="请输入调拨事由" maxLength="50"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('transferForm')" >保存</el-button>
                <el-button @click="closeForm()">返回</el-button>
            </div>
        </el-dialog>

        <el-dialog
            class="demand-selector big-dialog center"
            custom-class='batchTransfer'
            title="批量调拨"
            :visible.sync="batchTransferShow"
            width="40%"
            append-to-body
            :before-close="closeBatchForm"
            :close-on-click-modal="false">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="按组织调拨" name="organ">
                    <el-form :model="batchTransferForm" :rules="batchTransferFormRule" ref="batchTransferForm" label-width="120px" v-cloak>
                        <el-form-item label="调拨前所属组织" prop="beforeOrganizationId">
                            <tree-select v-model="batchTransferForm.beforeOrganizationId" placeholder="请选择调拨前所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeBatchBeforeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="调拨前服务组织" prop="beforeServiceOrganizationId">
                            <tree-select v-model="batchTransferForm.beforeServiceOrganizationId" placeholder="请选择调拨前服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeBatchBeforeServiceOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="调拨后所属组织" prop="afterOrganizationId">
                            <tree-select v-model="batchTransferForm.afterOrganizationId" placeholder="请选择调拨后所属组织" type="one"
                                         url="admin/organization/companyTree" @change="changeBatchAfterOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="调拨后服务组织" prop="afterServiceOrganizationId">
                            <tree-select v-model="batchTransferForm.afterServiceOrganizationId" placeholder="请选择调拨后服务组织" type="one"
                                         url="admin/organization/companyTree" @change="changeBatchAfterServiceOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="调拨日期" prop="transferTime">
                            <el-date-picker v-model="batchTransferForm.transferTime" value-format="yyyy-MM-dd" clearable type="date" placeholder="选择调拨日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="调拨事由" prop="reason">
                            <el-input v-model="batchTransferForm.reason" clearable placeholder="请输入调拨事由" maxLength="50"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="按车辆调拨" name="vehicle">
                    <el-form :model="batchVehicleTransferForm" :rules="batchVehicleTransferFormRule" ref="batchVehicleTransferForm" label-width="120px" v-cloak>
                        <el-form-item label="添加车辆" size="large">
                            <el-select
                                style="margin-right: 10px;width:80%;"
                                v-model="batchVehicleTransferForm.vehiclePlate"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="车牌号"
                                :remote-method="remoteFindPlateInfo"
                                :no-data-text="dataText"
                                :loading="plateLoading">
                                <el-option
                                    v-for="item in vehiclePlateOptions"
                                    :key="item.id"
                                    :label="item.plate"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button v-show="showAddVehiclePlateBtn" type="primary" size="mini" @click="addVehiclePlate()">添加</el-button>
                        </el-form-item>
                        <el-form-item :label="'已选车辆('+vehiclePlateList.length+'辆)'" size="large">
                            <el-tag
                                v-for="tag in vehiclePlateList"
                                :key="tag.id"
                                closable
                                @close="deletePlate(tag)"
                                :type="tag.type">
                                {{tag.plate}}
                            </el-tag>
                        </el-form-item>
                        <el-form-item label="调拨后所属组织" prop="afterOrganizationId">
                            <tree-select v-model="batchVehicleTransferForm.afterOrganizationId" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/companyTree" @change="changeVehicleAfterOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="调拨后服务组织" prop="afterServiceOrganizationId">
                            <tree-select v-model="batchVehicleTransferForm.afterServiceOrganizationId" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/companyTree" @change="changeVehicleAfterServiceOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="调拨日期" prop="transferTime">
                            <el-date-picker v-model="batchVehicleTransferForm.transferTime" value-format="yyyy-MM-dd" clearable type="date" placeholder="选择调拨日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="调拨事由" prop="reason">
                            <el-input v-model="batchVehicleTransferForm.reason" clearable placeholder="请输入调拨事由" maxLength="50"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
             <div slot="footer" class="dialog-footer">
                <el-button @click="closeBatchForm()">返回</el-button>
                <el-button type="primary" @click="submitBatchForm(activeName=='organ'?'batchTransferForm':'batchVehicleTransferForm')" >保存</el-button>
            </div>
        </el-dialog>
        <record ref="recordList" ></record>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import record from '@/views/tgpt/traffic/transferenceRecord/record'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'transferenceReocrd',
        mixins: [tool],
        components: {
            TreeSelect,record},
        data(){
            return{
                state:false,
                dialogChangePlateVisible:false,
                transferShow:false,
                batchTransferShow:false,
                showRecordBtn : this.getCurrentUserAuthority("transferenceRecord/transferRecord"),
                showBatchBtn : this.getCurrentUserAuthority("transferenceRecord/batchTransfer"),
                showExportBtn : this.getCurrentUserAuthority("transferenceRecord/export"),
                showTransferBtn : this.getCurrentUserAuthority("transferenceRecord/transfer"),
                organization:[],
                afterOrganization:[],
                afterServiceOrganization:[],
                transferForm:{},
                activeName:'organ',
                batchTransferForm:{},
                batchVehicleTransferForm:{},
                listUrl : "core/coreVehicleTransferenceRecord/list",
                transferRule:{
                    afterOrganizationId: [
                        { required: true, message: '请选择调拨后所属组织', trigger:'change'},
                    ],
                    afterServiceOrganizationId: [
                        { required: true, message: '请选择调拨后服务组织', trigger:'change'},
                    ],
                    transferTime: [
                        { required: true, message: '请选择调拨时间', trigger:'change'},
                    ],
                },
                batchTransferFormRule:{
                    beforeOrganizationId: [
                        { required: true, message: '请选择调拨前所属组织', trigger:'change'},
                    ],
                    beforeServiceOrganizationId: [
                        { required: true, message: '请选择调拨前服务组织', trigger:'change'},
                    ],
                    afterOrganizationId: [
                        { required: true, message: '请选择调拨后所属组织', trigger:'change'},
                    ],
                    afterServiceOrganizationId: [
                        { required: true, message: '请选择调拨后服务组织', trigger:'change'},
                    ],
                    transferTime: [
                        { required: true, message: '请选择调拨时间', trigger:'change'},
                    ],
                },
                batchVehicleTransferFormRule:{
                    afterOrganizationId: [
                        { required: true, message: '请选择调拨后所属组织', trigger:'change'},
                    ],
                    afterServiceOrganizationId: [
                        { required: true, message: '请选择调拨后服务组织', trigger:'change'},
                    ],
                    transferTime: [
                        { required: true, message: '请选择调拨时间', trigger:'change'},
                    ],
                },
                showAddVehiclePlateBtn: true,
                plateLoading:false,
                dataText:'无数据',
                vehiclePlateOptions:[],
                vehiclePlateList:[],
                vehicleIds:[]
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
            transfer(row){
                debugger
                this.transferForm={
                    vehicleId:row.id,
                    plate:row.plate,
                    vehicleModelInfoName:row.vehicleModelInfoName,
                    organizationName:row.organizationName,
                    serviceRegionName:row.serviceRegionName
                };
                this.transferForm=Object.assign({},this.transferForm);
                this.transferShow=true;
            },
            batchTransfer(){
                this.batchTransferForm={};
                this.batchTransferShow=true;
                this.showAddVehiclePlateBtn=true;
                this.activeName='organ';
                this.$refs["batchTransferForm"].clearValidate();
                this.$refs["batchVehicleTransferForm"].clearValidate();
            },
            transferRecord(vehicleId){
              this.$refs.recordList.open(vehicleId);
            },
            submitForm(transferForm) {
                this.$refs[transferForm].validate((valid) => {
                    if (valid) {
                        let params=this.transferForm;
                        params.afterOrganizationId=params.afterOrganizationId.join();
                        params.afterServiceOrganizationId=params.afterServiceOrganizationId.join();
                        var url = "core/coreVehicleTransferenceRecord/transfer";
                        if(this.state) {
                            return;
                        }
                        this.state = true;
                        ajax.post(url, params).then((res) => {
                            window.setTimeout(_=>{
                                this.state = false;
                            },1000);
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.transferShow=false;
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
            submitBatchForm(transferForm) {
                debugger
                this.$refs[transferForm].validate((valid) => {
                    if (valid) {
                        if (this.activeName == 'organ') {
                            let params = this.batchTransferForm;
                            params.beforeOrganizationId = params.beforeOrganizationId.join();
                            params.beforeServiceOrganizationId = params.beforeServiceOrganizationId.join();
                            params.afterOrganizationId = params.afterOrganizationId.join();
                            params.afterServiceOrganizationId = params.afterServiceOrganizationId.join();
                            var url = "core/coreVehicleTransferenceRecord/batchTransfer";
                            if (this.state) {
                                return;
                            }
                            this.state = true;
                            ajax.post(url, params).then((res) => {
                                window.setTimeout(_ => {
                                    this.state = false;
                                }, 1000);
                                if (res.status == 0) {
                                    this.$message({message: '保存成功！', type: 'success'});
                                    this.batchTransferShow = false;
                                    this.getList();
                                    this.closeBatchForm();
                                } else {
                                    this.$message.error(res.message);
                                }
                            }).catch(_ => {
                                window.setTimeout(_ => {
                                    this.state = false;
                                }, 1000);
                            });
                        } else {
                            let params = this.batchVehicleTransferForm;
                            params.afterOrganizationId = params.afterOrganizationId.join();
                            params.afterServiceOrganizationId = params.afterServiceOrganizationId.join();
                            params.vehicleIds=this.vehicleIds.join(',');
                            if(this.vehicleIds && this.vehicleIds.length==0){
                                this.$message({message: '请选择车辆！', type: 'error'});
                                return;
                            }

                            var url = "core/coreVehicleTransferenceRecord/batchVehicleTransfer";
                            if (this.state) {
                                return;
                            }
                            this.state = true;
                            ajax.post(url, params).then((res) => {
                                window.setTimeout(_ => {
                                    this.state = false;
                                }, 1000);
                                if (res.status == 0) {
                                    this.$message({message: '保存成功！', type: 'success'});
                                    this.batchTransferShow = false;
                                    this.getList();
                                    this.closeBatchForm();
                                } else {
                                    this.$message.error(res.message);
                                }
                            }).catch(_ => {
                                window.setTimeout(_ => {
                                    this.state = false;
                                }, 1000);
                            });
                        }
                    }else{

                    }
                });
            },
            resetList(){
                this.organization=[];
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.getList();
            },
            exportExcel(){
                window.location = this.exportUrl("core/coreVehicleTransferenceRecord/export?" + $.param(this.searchParam));
            },
            /*删除车牌*/
            deletePlate(tag) {
                this.vehiclePlateList.splice(this.vehiclePlateList.indexOf(tag), 1);
            },
            /*根据车牌查找车辆信息*/
            remoteFindPlateInfo(plateKeyWord) {
                if (plateKeyWord !== '' && plateKeyWord.length >= 3) {
                    this.plateLoading = true;
                    ajax.get('core/coreVehicleTransferenceRecord/findPlateListByKeyword', {plate: plateKeyWord}).then(rs => {
                        if (rs && rs.data.length > 0) {
                            setTimeout(() => {
                                this.plateLoading = false;
                                this.vehiclePlateOptions = rs.data;
                            }, 200);
                        }else{
                            this.dataText = '无数据'
                            this.vehiclePlateOptions = [];
                            this.plateLoading = false;
                        }
                    })
                } else if(plateKeyWord !== '' && plateKeyWord.length < 3){
                    this.dataText = '请输入至少3位'
                    this.vehiclePlateOptions = [];
                }else{
                    this.vehiclePlateOptions = [];
                }
            },
            /*添加车辆*/
            addVehiclePlate() {
                debugger
                if (this.batchVehicleTransferForm.vehiclePlate == "") {
                    this.$message.error("请输入车辆！");
                    return false;
                }
                if(!this.checkSelectedPlate()){
                    this.$message.error("车牌号已存在！");
                    return false;
                }
                let vehicle = {};
                vehicle = this.vehiclePlateOptions.find((item)=>{//这里的selectList就是上面遍历的数据源
                    return item.id === this.batchVehicleTransferForm.vehiclePlate;//筛选出匹配数据
                });
                vehicle.type = '';
                /*根据车辆id查询*/
                this.vehiclePlateList.push(vehicle);
                this.vehicleIds.push(vehicle.id);
                if(this.vehiclePlateList.length>=30){
                    this.showAddVehiclePlateBtn=false;
                }
                this.$set(this.batchVehicleTransferForm,'vehiclePlate','');
            },
            checkSelectedPlate(){
                let vehicle = {};
                vehicle = this.vehiclePlateList.find((item)=>{//这里的selectList就是上面遍历的数据源
                    return item.id === this.batchVehicleTransferForm.vehiclePlate;//筛选出匹配数据
                });
                return vehicle==null||Object.keys(vehicle).length === 0;
            },

            handleClick(tab,event){
                this.$refs["batchTransferForm"].clearValidate();
                this.$refs["batchVehicleTransferForm"].clearValidate();
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.serviceRegionId=this.organization[0];
                }else{
                    this.searchParam.serviceRegionId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            changeAfterOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeAfterServiceOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeBatchBeforeOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeBatchBeforeServiceOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeBatchAfterOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeBatchAfterServiceOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeVehicleAfterOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            changeVehicleAfterServiceOrganization(data){
                if (!data || data.length == 0){
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            closeBatchForm(){
                this.batchTransferShow=false;
                this.batchTransferForm={};
                this.batchVehicleTransferForm={};
                this.vehiclePlateList=[];
                this.vehicleIds=[];
            },
            closeForm(){
                this.transferShow=false;
                this.transferForm={};
            }

        },


    }
</script>

<style lang="scss">
    .batchTransfer{
        .el-tag{
            margin-right: 5px;
        }
        .el-tabs__content{
            padding-top: 10px;
        }
    }
</style>
