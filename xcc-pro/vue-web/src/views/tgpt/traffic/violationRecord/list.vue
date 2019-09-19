<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" clearable placeholder="请选择">
                            <el-option value="1" label="自有"></el-option>
                            <el-option value="2" label="租赁"></el-option>
                            <el-option value="3" label="挂靠"></el-option>
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
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleStatus" clearable placeholder="请选择设备检修状态">
                            <el-option label="未投入运营" :value="1"></el-option>
                            <el-option label="待租" :value="2"></el-option>
                            <el-option label="已租" :value="3"></el-option>
                            <el-option label="待出车" :value="4"></el-option>
                            <el-option label="维修保养" :value="5"></el-option>
                            <el-option label="调拨中" :value="6"></el-option>
                            <el-option label="待处置" :value="7"></el-option>
                            <el-option label="申请出售中" :value="8"></el-option>
                            <el-option label="出售确认中" :value="9"></el-option>
                            <el-option label="申请处置中" :value="10"></el-option>
                            <el-option label="申请使用中" :value="11"></el-option>
                            <el-option label="已出售" :value="12"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">扣分</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.score" clearable placeholder="请选择扣分">
                            <el-option label="0" :value="0"></el-option>
                            <el-option label="2" :value="2"></el-option>
                            <el-option label="3" :value="3"></el-option>
                            <el-option label="6" :value="6"></el-option>
                            <el-option label="12" :value="12"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">罚款</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.price" clearable placeholder="请选择罚款">
                            <el-option label="50" :value="50"></el-option>
                            <el-option label="100" :value="100"></el-option>
                            <el-option label="150" :value="150"></el-option>
                            <el-option label="200" :value="200"></el-option>
                            <el-option label="300" :value="300"></el-option>
                            <el-option label="500" :value="500"></el-option>
                            <el-option label="1000" :value="1000"></el-option>
                            <el-option label="2000" :value="2000"></el-option>
                            <el-option label="3000" :value="3000"></el-option>
                            <el-option label="5000" :value="5000"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">违章状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.violationStatus" clearable placeholder="请选择违章状态">
                            <el-option label="未处理" :value="1"></el-option>
                            <el-option label="已处理" :value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">违章时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="violationDate"
                            @change="violationDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">更新时间</label>
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
                        <el-input v-model="searchParam.key" clearable placeholder="车牌、违章代码、驾驶员"></el-input>
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
                        <el-button v-show="showEditBtn" type="text" @click="manualHandle(scope.row.id)">手工处理</el-button>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="车牌" prop="plate" fixed="left" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="资产属性" prop="assetsType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="车辆状态" prop="vehicleStatus" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="违章时间" prop="violationTime" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="违章城市" prop="city" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="违章地点" prop="place" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="违章行为" prop="reason" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章代码" prop="violationCode" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="扣分" prop="score" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="罚款" prop="price" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="违章状态" prop="violationStatus" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="更新时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="驾驶员" prop="driverName" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
        <el-dialog
            class="demand-selector big-dialog center"
            title="手工处理违章"
            :visible.sync="manualHandleShow"
            width="30%"
            append-to-body
            :close-on-click-modal="false">
            <el-form :model="manualHandleForm" :rules="rules" ref="manualHandleForm" label-width="100px" v-cloak>
                <el-form-item label="处理人姓名" prop="handler">
                    <el-input v-model="manualHandleForm.handler" maxlength="20" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="处理时间">
                    <el-date-picker type="date" v-model="manualHandleForm.handleTime" placeholder="请选择" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('manualHandleForm')">保存</el-button>
                <el-button @click="closeModel()">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficViolationRecord',
        mixins: [tool,ruleTool],
        components: { TreeSelect },
        data() {
            return {
                manualHandleShow:false,
                manualHandleForm:{},
                showSearch: false,
                providerOrganization:[],
                serviceOrganization:[],
                violationDate:[],
                updateDate:[],
                searchParam: {
                },
                showEditBtn: this.getCurrentUserAuthority('trafficViolationRecord/edit'),
                showAddBtn: true,
                showExportExcelBtn: this.getCurrentUserAuthority('trafficViolationRecord/exportExcel'),
                equipmentModalList:[],
                listUrl: 'traffic/violationrecord/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.violationDate = [startTime,endTime];
                this.searchParam.startViolationTime = startTime;
                this.searchParam.endViolationTime = endTime;
            }
            this.searchParam = Object.assign({},this.searchParam);

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'providerOrganCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.providerOrganization=[];
                this.serviceOrganization=[];
                this.updateDate=[];
                this.violationDate=[];
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
            violationDateChange() {
                if(this.violationDate && this.violationDate.length>0){
                    let violationDate = this.violationDate;
                    this.searchParam.startViolationTime = violationDate[0] + ' 00:00:00';
                    this.searchParam.endViolationTime = violationDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startViolationTime="";
                    this.searchParam.endViolationTime="";
                }
            },
            exportExcel() {
                window.location = this.exportUrl("traffic/violationrecord/export?" + $.param(this.searchParam));
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
            manualHandle(id){
                this.manualHandleShow=true;
                this.manualHandleForm.id=id;
            },
            submitForm(form) {
                var data = this.manualHandleForm;
                this.$refs[form].validate((valid) => {
                    if (data.handler==undefined || data.handler=='') {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    if (data.handleTime==undefined || data.handleTime=='') {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('traffic/violationrecord/manualhandle', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '处理成功',
                                type: 'success'
                            });
                            this.manualHandleShow=false;
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

            getOutStorageInfo(id){
                ajax.get('base/baseEquipmentInfo/outStorageInfo/'+id).then(res=>{
                    if(res.status==0)
                        this.outStorage=res.data;
                    else
                        this.$message.error("出库信息有误");
                });
            },
            getIntallInfo(id){
                ajax.get('base/baseEquipmentInfo/installInfo/'+id).then(res=>{
                    if(res.status==0)
                        this.install=res.data;
                    else
                        this.$message.error("安装信息有误");
                });
            },
            closeModel(){
                this.manualHandleShow=false;
            }
        }
    }
</script>

