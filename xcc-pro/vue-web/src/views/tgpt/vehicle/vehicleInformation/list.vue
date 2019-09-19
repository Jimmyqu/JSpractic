<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class=" search-box"  :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">注册城市</label>
                    <div class="input-group">
                        <el-input  type="text" v-model="searchParam.registerCityName" placeholder="请输入注册城市" clearable />
                    </div>
                </div>
            <!-- <div class="form-group">
                    <label class="control-label">经营城市</label>
                    <div class="input-group">
                        <el-input type="text" v-model="searchParam.runCityName" placeholder="请输入经营城市" autocomplete="off" />
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vehicle" placeholder="请输入车牌/车架号/车型" clearable />
                    </div>
                </div>
                <!--<div class="form-group">
                    <label class="control-label">车架号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.vin" placeholder="请输入车架号" clearable />
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one" clearable
                                    url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择服务组织" type="one" clearable
                                    url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">供车单位</label>
                    <div class="input-group organ_wrap">
                        <el-select v-model="searchParam.providerEnterprise" placeholder="请选择供车单位" clearable filterable>
                            <el-option v-for="item in providerEnterpriseList" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
                <!--<div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">车辆状态</label>
                    <div class="input-group">
                        <el-select v-model="vehicleStatus" multiple collapse-tags  placeholder="不限" clearable>
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
            <!-- <div class="form-group">
                    <label class="control-label">在库状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.stockStatus" placeholder="不限">
                            <el-option label="未出库" value="1"></el-option>
                            <el-option label="已出库" value="2"></el-option>
                        </el-select>
                    </div>
                </div>-->
                <div class="form-group">
                    <label class="control-label">车牌属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.plateType" placeholder="不限" clearable>
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">资产属性</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" placeholder="不限" clearable>
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">使用性质</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.useNature" placeholder="不限" clearable>
                            <el-option label="营运" value="1"></el-option>
                            <el-option label="非营运" value="2"></el-option>
                            <el-option label="网约车" value="3"></el-option>
                            <el-option label="租赁" value="4"></el-option>
                            <el-option label="旅游客运" value="5"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服役状态</label>
                    <div class="input-group">
                        <el-select v-model="serviceStatus" multiple collapse-tags  placeholder="不限" clearable>
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
                    <label class="control-label">客户</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.serviceEnterpriseName" placeholder="请输入客户名称" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆来源</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleSource" placeholder="不限" clearable>
                            <el-option label="自建" value="1"></el-option>
                            <el-option label="外部" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <!--<div class="form-group">
                    <label class="control-label">服务单位</label>
                    <div class="input-group" organ_wrap>
                        <tree-select v-model="serviceOrganization" placeholder="请选择服务单位" type="one"
                                    url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>-->
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="dialogFormShow(true)">导入</el-button>
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
                        <el-button v-if="(scope.row.showChangePlateBtn && scope.row.showChangePlateBtn.first)" @click="changePlate(scope.row.vehicleId, scope.row.plate)" type="text" size="small" >
                            更换车牌
                        </el-button>
                        <el-button v-if="(scope.row.showEditBtn && scope.row.showEditBtn.first) || (scope.row.btnNum == 2 && (scope.row.showEditBtn && !scope.row.showEditBtn.first))" @click="edit(scope.row.vehicleId)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button v-if="(scope.row.showVehicleLocationBtn && scope.row.showVehicleLocationBtn.first) || (scope.row.btnNum == 2 && (scope.row.showVehicleLocationBtn && !scope.row.showVehicleLocationBtn.first))" @click="showVehicleLocation(scope.row)" type="text" size="small">
                            车辆定位
                        </el-button>
                        <el-button v-if="(scope.row.showVehicleLocationRealtimeBtn && scope.row.showVehicleLocationRealtimeBtn.first) || (scope.row.btnNum == 2 && (scope.row.showVehicleLocationRealtimeBtn && !scope.row.showVehicleLocationRealtimeBtn.first))" @click="showLocationRealtime(scope.row)" type="text" size="small" >
                            实时追踪
                        </el-button>
                        <!-- <el-button v-show="showDeleteBtn" @click="deleteData(scope.row)" type="text" size="small">
                            删除
                        </el-button> -->
                        <el-dropdown v-if="scope.row.btnNum > 2" trigger="click">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showEditBtn && !scope.row.showEditBtn.first)" @click="edit(scope.row.vehicleId)" type="text" size="small">
                                        编辑
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="((userInfo.account=='admin'||userInfo.account=='saleadmin') && scope.row.vehicleSource==1 && (scope.row.vehicleStatus=='待租'||scope.row.vehicleStatus=='未投入运营'))" @click="del(scope.row.vehicleId)" type="text" size="small">
                                        删除
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showVehicleLocationBtn && !scope.row.showVehicleLocationBtn.first)" @click="showVehicleLocation(scope.row)" type="text" size="small">
                                        车辆定位
                                    </el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-if="(scope.row.showVehicleLocationRealtimeBtn && !scope.row.showVehicleLocationRealtimeBtn.first)" @click="showLocationRealtime(scope.row)" type="text" size="small" >
                                        实时追踪
                                    </el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column prop="plate" sortable label="车牌" fixed="left" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="vin" sortable label="车架号" min-width="180"></el-table-column>
                <el-table-column prop="modelName" sortable label="车型" min-width="180" show-overflow-tooltip></el-table-column>
                <!--<el-table-column prop="companyName" sortable label="所属组织" min-width="140" show-overflow-tooltip></el-table-column>-->
                <el-table-column prop="providerCompanyName" sortable label="所属组织" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="serviceCompanyName" sortable label="服务组织" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="serviceEnterpriseName" sortable label="客户" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assetsType" sortable label="资产属性" min-width="90"></el-table-column>
                <el-table-column prop="vehicleStatus" sortable label="车辆状态" min-width="90"></el-table-column>
                <el-table-column prop="serviceStatus" sortable label="服役状态" min-width="90"></el-table-column>
                <el-table-column prop="vehicleSourceText" sortable label="车辆来源" min-width="90"></el-table-column>
                <!--<el-table-column prop="passValid" sortable label="通行证有效截止日期" min-width="90"></el-table-column>-->
                <el-table-column prop="creater" sortable label="创建人" min-width="180">
                    <template slot-scope="scope" >
                        <template v-if="scope.row.vehicleSource == 1">{{scope.row.creater}}</template>
                        <template v-if="scope.row.vehicleSource == 2">/</template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="140">
                    <template slot-scope="scope" >
                        <template v-if="scope.row.vehicleSource == 1">{{scope.row.createTime}}</template>
                        <template v-if="scope.row.vehicleSource == 2">/</template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item label="管理公司" required>
                    <tree-select v-model="exportOrganization" placeholder="请选择所属组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeExportOrganization"></tree-select>
                </el-form-item>
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/vehicle/import?companyId='+companyId"
                                  :disabled="!companyId" name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆资料导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>

                <!--<el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/vehicle/import?companyId='+companyId"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆资料导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="dialogFormShow(false)">确 定</el-button>-->
            </div>
        </el-dialog>

        <!--车牌变更-->
        <el-dialog title="车牌变更" :visible.sync="dialogChangePlateVisible" :append-to-body="true" width="70%" >
            <div class="list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车型名称</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.modelInfo" placeholder="请输入车型" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table height="250" v-loading="listLoading" :data="list" style="width: 100%;"  border max-height="300">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="chooseModelInfo(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="modelInfo" label="车型名称"  min-width="350" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="modelName" label="款式" min-width="120"></el-table-column>
                        <el-table-column prop="seating" label="座位" min-width="80"></el-table-column>
                        <el-table-column prop="displacement" label="排量" min-width="80"></el-table-column>
                        <el-table-column prop="transmissionName" label="变速箱" min-width="120"></el-table-column>
                        <el-table-column prop="vehicleNumberName" label="车厢数" min-width="80"></el-table-column>
                        <el-table-column prop="fuelTypeName" label="燃油类型" min-width="100"></el-table-column>
                        <el-table-column prop="fuelCapacity" label="油箱容量" min-width="80"></el-table-column>
                    </el-table>
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
        </el-dialog>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'vehicleVehicleInformation',
        mixins: [tool],
        components: { ConfirmForm ,UploadSubmit,TreeSelect},
        data(){
            return{
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                dialogChangePlateVisible:false,
                showAddBtn : this.getCurrentUserAuthority("baseVehicle/add"),
                showChangePlateBtn : this.getCurrentUserAuthority("baseVehicle/changeplate"),
                showVehicleLocationBtn : this.getCurrentUserAuthority("baseVehicle/vehicleLocation"),
                showVehicleLocationRealtimeBtn : this.getCurrentUserAuthority("baseVehicle/vehicleLocationRealtime"),
                showEditBtn : this.getCurrentUserAuthority("baseVehicle/edit"),
                showDeleteBtn : this.getCurrentUserAuthority("baseVehicle/delete"),
                showExportBtn : this.getCurrentUserAuthority("baseVehicle/export"),
                showImportBtn : this.getCurrentUserAuthority("baseVehicle/import"),
                organization:[],
                vehicleStatusFlag:true,
                serviceOrganization:[],
                exportOrganization:[],
                organizationList:[],
                serviceStatus:[],
                vehicleStatus:[],
                providerEnterpriseList:this.getProviderEnterpriseList(),
                companyId:"",
                userInfo:this.getCurrentUserInfo(),
                listUrl : "base/vehicle/list",
            }

        },

        activated: function () {
            this.getList();
        },
        mounted: function () {
            var vehicleStatus=this.$route.query.vehicleStatus;
            if(vehicleStatus){
                this.vehicleStatus=[vehicleStatus];
               // this.searchParam = Object.assign({},this.searchParam);
            }

            this.initVehicleStatus();
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getOrganzationList();
        },
        watch: {

        },
        methods: {
            getProviderEnterpriseList() {
                ajax.get("base/enterprise/providerEnterprise?time=" + new Date().getTime()).then(result => {
                    console.log(result);
                    if (result.length > 0) {
                        this.providerEnterpriseList = result;
                    } else {
                        this.providerEnterpriseList = [];
                    }
                });
            },
            getListBefore(params){
                if(this.vehicleStatus && this.vehicleStatus.length>0){
                    params.vehicleStatus=this.vehicleStatus.join(',');
                    this.searchParam.vehicleStatus=this.vehicleStatus.join(',');
                }else{
                    params.vehicleStatus='';
                    this.searchParam.vehicleStatus='';
                }

                if(this.serviceStatus && this.serviceStatus.length>0){
                    params.serviceStatus=this.serviceStatus.join(',');
                    this.searchParam.serviceStatus=this.serviceStatus.join(',');
                }else{
                    params.serviceStatus='';
                    this.searchParam.serviceStatus='';
                }
            },
            resetList(){
                this.organization=[];
                this.vehicleStatus=[];
                this.serviceStatus=[];
                this.serviceOrganization=[];
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.$set(this.searchParam,'serviceOrganCascade',false);
                this.getList();
            },
            handleBtn(list){
                var setList = []
                for(var i =0;i<this.list.length;i++){
                    var scope = this.list[i]
                    scope.btnNum = 0
                    if(this.showChangePlateBtn && scope.vehicleSource == 1 && (scope.vehicleStatus =='未投入运营' || scope.vehicleStatus =='待租' || scope.vehicleStatus =='维修保养') && scope.plate!=null){
                        scope.showChangePlateBtn = {
                            show:true
                        }
                        scope.first = true
                        scope.showChangePlateBtn.first = true
                        scope.btnNum += 1
                    }
                    if(!this.vehicleStatusFlag && this.showEditBtn && scope.vehicleSource == 1 && (scope.vehicleStatus =='未投入运营' || scope.vehicleStatus =='待租' || scope.vehicleStatus =='维修保养')){
                        scope.showEditBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showEditBtn.first = true
                        }
                        scope.btnNum += 1
                    }else if(this.vehicleStatusFlag && this.showEditBtn){
                        scope.showEditBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showEditBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showVehicleLocationBtn && scope.vehicleStatus !='已出售'){
                        scope.showVehicleLocationBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showVehicleLocationBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showVehicleLocationRealtimeBtn && scope.vehicleStatus !='已出售'){
                        scope.showVehicleLocationRealtimeBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showVehicleLocationRealtimeBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    setList.push(scope)
                }
                this.$set(this,'list',setList)
            },
            /*删除*/
            del(vehicleId){

                this.$confirm('是否确认删除 ?')
                    .then(_ => {
                        ajax.get("base/vehicle/delete/"+vehicleId).then(
                            (res) => {
                                if(res.status == 0){
                                    this.getList();
                                    this.$message({message: '删除成功！',type: 'success'});
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    }).catch(_ => {
                    console.info("关闭");
                });
            },

            changePlate(id,plate) {
                let url = this.$route.fullPath + '/changePlate?id='+id+'&plate='+plate;
                this.$router.push({path:url});
            },

            showVehicleLocation(row) {
                let url = '/tgpt_v2/obd/vehicleLocation';
                let b = this.getCurrentUserMenuAuthority(url);
                if (b) {
                    this.$router.push({path: url, query: {id: row.vehicleId, plate: row.plate, activeName: "1"}});
                } else {
                    alert("没有当前操作项权限！");
                }
            },

            showLocationRealtime(row) {
                let url =  '/tgpt_v2/obd/vehicleLocationRealtime';
                let b = this.getCurrentUserMenuAuthority(url);
                if (b) {
                    this.$router.push({path:url, query:{vehicleId : row.vehicleId,plate:row.plate}});
                } else {
                    alert("没有当前操作项权限！");
                }
            },

            getOrganzationList(){
                var userInfo=this.getCurrentUserInfo();
                this.organizationList=userInfo.organizationList;
            },

            exportExcel(){
                window.location = this.exportUrl("base/vehicle/exportExcel?" + $.param(this.searchParam));
            },

            dialogFormShow(flag){
                this.importVisibleErrorId = "";
                this.exportOrganization=[];
                this.companyId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
               /* this.importVisible = flag;
                $("#resultDiv").html("");*/
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    this.searchParam.companyId=this.organization[0];
                }else{
                    this.searchParam.companyId = '';
                    this.$set(this.searchParam,'organCascade',false)
                }
            },
            changeExportOrganization(data){
                if(this.exportOrganization && this.exportOrganization.length==1){
                    this.companyId=this.exportOrganization[0];
                }else{
                    this.companyId = '';
                }
            },
            changeServiceOrganization(data){
                if(this.serviceOrganization && this.serviceOrganization.length==1){
                    this.searchParam.serviceRegionId=this.serviceOrganization[0];
                }else{
                    this.searchParam.serviceRegionId= '';
                    this.$set(this.searchParam,'serviceOrganCascade',false)
                }
            },
            toDetail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
            initVehicleStatus(){
                ajax.get("base/vehicle/getOrganizationConfig").then(res => {
                        this.vehicleStatusFlag=true;
                        if(res.data && res.data.vehicleStatusOption==1) {//中汽
                                this.vehicleStatusFlag=false;
                        }

                })
            }
        },


    }
</script>

