<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择车辆所属">
                            <el-option label="自有" :value="1"></el-option>
                            <el-option label="租赁" :value="2"></el-option>
                            <el-option label="挂靠" :value="3"></el-option>
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
                    <label class="control-label">车辆总里程</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.mileage" clearable placeholder="请选择里程范围">
                            <el-option label="1万公里以下" :value="1"></el-option>
                            <el-option label="1到6万公里" :value="2"></el-option>
                            <el-option label="6到12万公里" :value="3"></el-option>
                            <el-option label="12万公里以上" :value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="车牌"></el-input>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="correctionRecord1(scope.row)">里程校正</el-button>
                        <a size="mini" @click="correctionRecord(scope.row)">校正记录</a>
                    </template>
                </el-table-column>

                <!--<el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>-->
                <el-table-column min-width="100" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="车辆所属" prop="assetsTypeName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="服役状态" prop="vehicleStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="车型" prop="carModel" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车辆总里程(km)" prop="mileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="最近仪表登记(km)" prop="meterMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="OBD累计里程(km)" prop="obdMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="最后操作人" prop="creater" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
        <driverListPanel ref="driverList" @load="loadList"></driverListPanel>

        <el-dialog :title="'里程校正 '+addForm.formPlate" :visible.sync="dialogFormVisible">
            <el-form :model="addForm" ref="addForm" :rules="rules" >
                <el-form-item label="仪表里程读数" prop="dashboardMileage">
                    <el-input v-model="addForm.dashboardMileage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="读表时间" prop="readTime" >
                    <el-date-picker
                        v-model="addForm.readTime"
                        type="datetime"
                        placeholder="日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import driverListPanel from '@/views/tgpt_v2/appDriver/message/driverList'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficMileageList',
        mixins: [tool],
        components: { TreeSelect,CitySelect,driverListPanel,MoneyInput },
        data() {
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '仪表里程读数异常', trigger: 'blur'};
            return {
                showSearch: false,
                dialogDriver:false,
                createDate:[],
                providerOrganization:[],
                serviceOrganization:[],
                searchParam: {},
                showEditBtn: true,
                showExportExcelBtn: this.getCurrentUserAuthority('trafficMileageList/exportExcel'),
                dialogFormVisible: false,
                addForm: {
                    vehicleId:'',
                    dashboardMileage: '',
                    readTime:'',
                    totalMileage:'',
                    obdMileage:'',
                    creater:'',
                    formPlate:''
                },
                listUrl: 'obd/obdMileageAdjust',
                rules: {
                    dashboardMileage: [moneyValidator],
                    readTime: [{required: true, message: '请选择读表时间', trigger: 'change'}],
                }
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
        },
        methods: {
            loadList(){
                this.getList();
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'providerOrganCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.createDate=[];
                this.providerOrganization=[];
                this.serviceOrganization=[];
                this.getList();
            },
            createDateChange() {
                if(this.createDate && this.createDate.length>0){
                    let createDate = this.createDate;
                    this.searchParam.startCreateTime = createDate[0] + ' 00:00:00';
                    this.searchParam.endCreateTime = createDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startCreateTime="";
                    this.searchParam.endCreateTime="";
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
            publish(id){//发布
                this.$refs.driverList.open(id,true);
            },
            published(id){//已发布司机
                this.$refs.driverList.open(id,false);
            },

            exportExcel() {
                window.location = this.exportUrl("obd/obdMileageAdjust/excel?" + $.param(this.searchParam));
            },
            correctionRecord(row) {
                this.$router.push({path:'/tgpt_v2/traffic/mileage/correctinglist/' + row.id});
            },
            correctionRecord1(row) {
                if(this.$refs.addForm){
                    this.$nextTick(_ =>{
                        this.$refs.addForm.clearValidate();
                    })
                }
                this.dialogFormVisible = true;
                this.addForm.vehicleId=row.id;
                this.addForm.totalMileage = row.mileage;
                this.addForm.obdMileage = row.obdMileage;
                this.addForm.creater = row.creater;
                this.addForm.dashboardMileage = "";
                this.addForm.readTime = new Date();
                this.addForm.formPlate = row.plate;

            },
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    if(data.totalMileage==null || data.totalMileage==undefined || data.totalMileage==''){
                        data.totalMileage=0;
                    }
                    if(parseFloat(data.totalMileage)>parseFloat(data.dashboardMileage)){
                        this.$message.error('仪表读数应大于总里程');
                        return;
                    }
                    ajax.post('obd/obdMileageAdjust/', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.getList();
                        } else {
                            this.$message.error(rs.msg);
                        }
                    });
                });
            }


        }
    }
</script>

