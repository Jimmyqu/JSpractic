<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.plateType" clearable placeholder="请选择">
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <!--<el-option label="挂靠" value="3"></el-option>-->
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="providerOrganization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeProviderOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.providerOrganCascade"  :disabled="!searchParam.providerCompanyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade"  :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
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
                        <el-select
                            v-model="searchParam.brandId"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            placeholder="车品牌"
                            :remote-method="remoteBrandMethod"
                            :loading="loading">
                            <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车系</label>
                    <div class="input-group">
                        <el-select
                            v-model="searchParam.seriesId"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            placeholder="车系"
                            :remote-method="remoteSeriesMethod"
                            :loading="loading">
                            <el-option
                                v-for="item in seriesList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌查询"></el-input>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showRegisterBtn" type="text" @click="registration(scope.row.id)">检查登记
                        </el-button>
                        <el-button v-show="showRecordingBtn" type="text" @click="toDetail(scope.row)">检查记录</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="80" label="车牌" prop="plate" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" label="车辆所属" prop="plateType" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" label="服役状态" prop="vehicleStatusText" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="200" label="车型" prop="vehicleModelInfoName" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="70" label="车辆里程" prop="totalMileage" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="最近检查日期" prop="updateTime" sortable
                                 show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" label="最后检查人" prop="updater" sortable
                                 show-overflow-tooltip></el-table-column>

            </el-table>

        </div>

        <!--车辆日常检查登记弹出框-->
        <el-dialog title="车辆日常检查登记" class="check-dialog" :visible.sync="checkDialog" :append-to-body="true" width="70%" top="5vh">
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <el-form :model="saveCheck" label-position="left" ref="saveCheck">
                    <div class="row">
                        <el-table v-loading="listLoading" :data="modalList" style="width: 100%;" border>
                            <el-table-column fixed="left" label="正常/异常" min-width="100">
                                <template slot-scope="scope">
                                    <el-radio v-model="scope.row.result" label="1" border size="mini">正常</el-radio>
                                    <el-radio v-model="scope.row.result" label="2" border size="mini">异常</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="project" label="项目" min-width="300"></el-table-column>
                            <el-table-column prop="type" label="检查内容" min-width="100"></el-table-column>
                        </el-table>
                    </div>
                    <el-form-item label="备注信息" prop="remark">
                        <el-input type="textarea" v-model="saveCheck.remark" placeholder="备注信息在200字以内" maxlength="150"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="检查日期" prop="createTime">
                        <el-date-picker
                            type="date"
                            v-model="saveCheck.createTime"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注图片">
                        <upload-panel :size="1" :file-list.sync="pic" accept=".jpg,.jpeg,.png" :show-img="true"></upload-panel>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="checkDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitParam()">确 定</el-button>
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
    import UploadPanel from '@/components/UploadPanel/index'

    export default {
        name: 'vehicleCheckList',
        mixins: [tool],
        components: {TreeSelect, UploadPanel},
        data() {
            return {
                checkDialog: false,
                showSearch: false,
                searchParam: {},
                showRegisterBtn: this.getCurrentUserAuthority('vehicleCheckList/register'),
                showRecordingBtn: this.getCurrentUserAuthority('vehicleCheckList/recording'),
                showRecordBtn: true,
                showExportExcelBtn: this.getCurrentUserAuthority('vehicleCheckList/export'),
                listUrl: 'traffic/coreVehicleCheck',
                modalList:[],
                pic:[],
                seriesList: [],
                brandList: [],
                result: '1',
                saveCheck: {},
                vehicleId: '',
                providerOrganization:[],
                serviceOrganization:[],
            }
        },
        activated() {
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params){
                if (this.organizations) {
                    params.organization = this.organizations[0];
                }else {
                    params.organization = '';
                }

            },
            remoteBrandMethod(name) {
                if (name) {
                    ajax.get('traffic/coreVehicleCheck/getVehicleBrand?name=' + name).then(rs => {
                        if (rs && rs.length > 0) {
                            setTimeout(() => {
                                this.brandList = rs;
                            }, 200);
                        }
                    });
                } else {
                    this.brandList = [];
                }
            },
            remoteSeriesMethod(name) {
                if (name) {
                    ajax.get('traffic/coreVehicleCheck/getVehicleSeries?name=' + name).then(rs => {
                        if (rs && rs.length > 0) {
                            setTimeout(() => {
                                this.seriesList = rs;
                            }, 200);
                        }
                    });
                } else {
                    this.seriesList = [];
                }
            },
            registration(id) {
                this.vehicleId = id;
                this.checkDialog = true;
                ajax.get('traffic/coreVehicleCheck/getCheckContent').then(res =>{
                    res.data.forEach(item =>{
                        item.result = '1';
                    });
                    this.modalList = res.data;
                    /*this.pic.push(JSON.parse())*/
                })
            },
            submitParam() {
                var data = {
                    vehicleId: this.vehicleId,
                    remark: this.saveCheck.remark,
                    pic: this.assambleTitleImage(this.pic),
                    map: this.modalList,
                    time: this.saveCheck.createTime
                };
                if(!this.modalList.length) {
                    this.$message({message: '请选择登记项目！',type: 'error'});
                    return
                }
                ajax.post('traffic/coreVehicleCheck/vehicleCheckResult', data).then(res => {
                    debugger
                    if(res.status == 0){
                        this.$message({message: '保存成功！',type: 'success'});
                        this.checkDialog = false;
                        this.getList();
                    }else {
                        this.$message.error(res.msg);
                    }


                    /*if (rs && rs.data > 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        this.checkDialog = false;
                        this.getList();
                    }else{
                        this.showMessage('保存失败');
                    }*/
                });
            },
            recording() {

            },

            /*格式化显示图片*/
            assambleTitleImage(data){
                if(data!=null && data.length>0){
                    let object = {};
                    object['name'] = data[0].name;
                    object['path'] = data[0].path;
                    object['filedomain'] = data[0].filedomain;
                    return JSON.stringify(object);
                }else{
                    return  null;
                }
            },
            exportExcel() {
                var params=this.searchParam;
                if (this.organizations) {
                    params.organization = this.organizations[0];
                }
                window.location = this.exportUrl("traffic/coreVehicleCheck/excel?" + $.param(params));
            },resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'providerOrganCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.providerOrganization=[];
                this.serviceOrganization=[];
                this.getList();
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
        }
    }
</script>

<style scoped lang="scss">
    .check-dialog {

        /deep/ .el-dialog {
            height: 90%;
            .el-dialog__body {
                height: calc(100% - 120px);
                overflow-y: auto;
            }
        }
    }
</style>
