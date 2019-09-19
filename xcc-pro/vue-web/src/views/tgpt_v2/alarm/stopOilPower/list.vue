<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.key" clearable placeholder="车牌号" ></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">油电控制状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.operateType" clearable placeholder="请选择油电控制状态">
                            <el-option label="断油电" :value="64"></el-option>
                            <el-option label="通油电" :value="65"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <!--
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
                -->
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
                        <template >
                            <template v-if="(scope.row.operateType == null || scope.row.operateType == 65)"><el-button v-show="showInstallBtn" type="text" @click="stopOilPower(scope.row.id, 64)">断油电</el-button></template>
                            <template v-else-if="scope.row.operateType == 64"><el-button v-show="showInstallBtn" type="text" @click="stopOilPower(scope.row.id, 65)">通油电</el-button></template>
                        </template>
                        <el-button v-show="showHistoryBtn" type="text" @click="history(scope.row.imei)">油电控制记录</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="120" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="VIN" prop="vin" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="vehicleModelInfoName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="服务组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="设备IMEI号" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="设备型号" prop="imeiModalName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="运行状态" prop="runStatus" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.runStatus==1"><span>运行</span></template>
                        <template v-else-if="scope.row.runStatus==2"><span>停止</span></template>
                        <template v-else><span>离线</span></template>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="油电控制状态" prop="operateType" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.operateType == 64"><span>断油电</span></template>
                        <template v-else-if="(scope.row.operateType == null || scope.row.operateType == 65)"><span>通油电</span></template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
                organization:[],
                searchParam: {
                },
                showExportBtn: this.getCurrentUserAuthority('vehicleInstall/export'),
                showInstallBtn: this.getCurrentUserAuthority('vehicleInstall/install'),
                showHistoryBtn: this.getCurrentUserAuthority('vehicleInstall/history'),
                listUrl: 'obd/obdStopOilPower/getVehicleDiffStatusList'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.organization=[];
                this.handleCurrentChange(1);
            },
            changeOrganization(){
                if(this.organization && this.organization.length==1){
                    this.searchParam.organizationId=this.organization[0];
                }else{
                    this.searchParam.organizationId='';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            exportExcel() {
                window.location = this.exportUrl("base/vehicleInstall/export?" + $.param(this.searchParam));
            },
            /* 油电控制 */
            stopOilPower(id, type){
                if(type == 64){
                    this.$confirm('确定要断油电吗？').then(
                        () => {
                            ajax.get(`obd/obdStopOilPower/stopOilPower/${id}?type=64`).then(res => {
                                if(res.status == 0){
                                    this.showMessage('断油电指令下发成功，稍后可查看设备执行结果。', 'success');
                                    this.getList();
                                }else{
                                    this.showMessage(res.msg, 'error');
                                }
                            })
                        }
                    )
                }else if(type == 65){
                    this.$confirm('确定要通油电吗？').then(
                        () => {
                            ajax.get(`obd/obdStopOilPower/stopOilPower/${id}?type=65`).then(res => {
                                if(res.status == 0){
                                    this.showMessage('通油电指令下发成功，稍后可查看设备执行结果。', 'success');
                                    this.getList();
                                }else{
                                    this.showMessage(res.msg, 'error');
                                }
                            })
                        }
                    )
                }
            },
            history(id){
                this.$router.push({path:"/tgpt_v2/alarm/stopOilPower/history/"+id});
            }
        }
    }
</script>

