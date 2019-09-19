<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class=" search-box"  :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <!--<div class="form-group">-->
                    <!--<label class="control-label">注册城市</label>-->
                    <!--<div class="input-group">-->
                        <!--<el-input  type="text" v-model="searchParam.registerCityName" placeholder="请输入注册城市" autocomplete="off" />-->
                    <!--</div>-->
                <!--</div>-->
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
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                    url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="serviceOrganization" placeholder="请选择服务组织" type="one"
                                    url="admin/organization/tree?noManager=noManager" @change="changeServiceOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.serviceOrganCascade" :disabled="!searchParam.serviceRegionId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车辆所属</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.assetsType" placeholder="不限" clearable>
                            <el-option label="自有" value="1"></el-option>
                            <el-option label="租赁" value="2"></el-option>
                            <el-option label="挂靠" value="3"></el-option>
                            <el-option label="个人" value="4"></el-option>

                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服役状态</label>
                    <div class="input-group">
                        <el-select v-model="serviceStatus" multiple collapse-tags  placeholder="不限" clearable>
                            <el-option label="配驾" :value="101"></el-option>
                            <el-option label="退租" :value="102"></el-option>
                            <el-option label="以租代购" :value="103"></el-option>
                            <el-option label="会员租车" :value="104"></el-option>
                            <el-option label="已出售" :value="105"></el-option>
                            <el-option label="散租" :value="106"></el-option>
                            <el-option label="备用" :value="107"></el-option>
                            <el-option label="其他" :value="108"></el-option>
                            <el-option label="自驾" :value="109"></el-option>
                            <el-option label="中汽专车" :value="110"></el-option>
                            <el-option label="待租" :value="111"></el-option>
                            <el-option label="待处置" :value="112"></el-option>
                            <el-option label="公务用车" :value="113"></el-option>
                            <el-option label="报废" :value="114"></el-option>
                            <el-option label="拍卖" :value="115"></el-option>
                            <el-option label="闲置" :value="116"></el-option>
                            <el-option label="长租" :value="117"></el-option>
                            <el-option label="短租" :value="118"></el-option>
                            <el-option label="公务车" :value="119"></el-option>
                            <el-option label="班车" :value="120"></el-option>
                            <el-option label="承包" :value="121"></el-option>
                        </el-select>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border :data="list" @sort-change="sortChange" style="width: 100%">
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
                                    <el-button v-if="(scope.row.showDeleteBtn && !scope.row.showDeleteBtn.first && scope.row.vehicleSource==1)" @click="del(scope.row.vehicleId)" type="text" size="small">
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
                <el-table-column prop="plate" sortable="custom" label="车牌" fixed="left" min-width="120">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.plate}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="vin" sortable="custom" label="车架号" min-width="180"></el-table-column>
                <el-table-column prop="modelName" sortable label="车型" min-width="180" show-overflow-tooltip></el-table-column>
                <!--<el-table-column prop="companyName" sortable label="所属组织" min-width="140" show-overflow-tooltip></el-table-column>-->
                <el-table-column prop="providerCompanyName" sortable="custom"  label="所属组织" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="serviceCompanyName" sortable="custom"  label="服务组织" min-width="180" show-overflow-tooltip></el-table-column>
                <!--<el-table-column prop="serviceEnterpriseName" sortable label="客户" min-width="160" show-overflow-tooltip></el-table-column>-->
                <el-table-column prop="assetsType" sortable label="车辆所属" min-width="90"></el-table-column>
                <!--<el-table-column prop="vehicleStatus" sortable label="车辆状态" min-width="90"></el-table-column>-->
                <el-table-column prop="serviceStatus" sortable label="服役状态" min-width="90"></el-table-column>
                <el-table-column prop="vehicleSourceText" sortable label="车辆来源" min-width="90"></el-table-column>
                <!--<el-table-column prop="passValid" sortable label="通行证有效截止日期" min-width="90"></el-table-column>-->
                <el-table-column prop="creater" sortable label="创建人" min-width="180">
                    <template slot-scope="scope" >
                        <template v-if="scope.row.vehicleSource == 1">{{scope.row.creater}}</template>
                        <template v-if="scope.row.vehicleSource == 2">/</template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" sortable="custom" label="创建时间" min-width="140">
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
                                  :url="'base/business/vehicle/import?companyId='+companyId"
                                  :disabled="!companyId" name="file" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车辆资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/车辆管理车辆信息导入模板.xls">下载模板</a>
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
        name: 'businessVehicleVehicleInformation',
        mixins: [tool],
        components: { ConfirmForm ,UploadSubmit,TreeSelect},
        data(){
            return{
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                dialogChangePlateVisible:false,
                showAddBtn : this.getCurrentUserAuthority("business/baseVehicle/add"),
                showChangePlateBtn : this.getCurrentUserAuthority("business/baseVehicle/changeplate"),
                showVehicleLocationBtn : this.getCurrentUserAuthority("business/baseVehicle/vehicleLocation"),
                showVehicleLocationRealtimeBtn : this.getCurrentUserAuthority("business/baseVehicle/vehicleLocationRealtime"),
                showEditBtn : this.getCurrentUserAuthority("business/baseVehicle/edit"),
                showDeleteBtn : this.getCurrentUserAuthority("business/baseVehicle/delete"),
                showExportBtn : this.getCurrentUserAuthority("business/baseVehicle/export"),
                showImportBtn : this.getCurrentUserAuthority("business/baseVehicle/import"),
                organization:[],
                vehicleStatusFlag:true,
                serviceOrganization:[],
                exportOrganization:[],
                organizationList:[],
                serviceStatus:[],
                providerEnterpriseList:this.getProviderEnterpriseList(),
                companyId:"",
                userInfo:this.getCurrentUserInfo(),
                listUrl : "base/business/vehicle/list",
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
                if(this.serviceStatus && this.serviceStatus.length>0){
                    params.serviceStatus=this.serviceStatus.join(',');
                    this.searchParam.serviceStatus=this.serviceStatus.join(',');
                }else{
                    params.serviceStatus='';
                    this.searchParam.serviceStatus='';
                }
            },
            resetList(){
                debugger;
                this.organization=[];
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
                    if(this.showChangePlateBtn && scope.vehicleSource == 1 && scope.plate!=null){
                        scope.showChangePlateBtn = {
                            show:true
                        }
                        scope.first = true
                        scope.showChangePlateBtn.first = true
                        scope.btnNum += 1
                    }
                    if(!this.vehicleStatusFlag && this.showEditBtn && scope.vehicleSource == 1){
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

                    if(!this.vehicleStatusFlag && this.showDeleteBtn && scope.vehicleSource == 1){
                        scope.showDeleteBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showDeleteBtn.first = true
                        }
                        scope.btnNum += 1
                    }else if(this.vehicleStatusFlag && this.showDeleteBtn){
                        scope.showDeleteBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showDeleteBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showVehicleLocationBtn){
                        scope.showVehicleLocationBtn = {
                            show:true
                        }
                        if(!scope.first){
                            scope.first = true
                            scope.showVehicleLocationBtn.first = true
                        }
                        scope.btnNum += 1
                    }
                    if(this.showVehicleLocationRealtimeBtn){
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
                                    debugger;
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
                window.location = this.exportUrl("base/business/vehicle/exportExcel?" + $.param(this.searchParam));
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
                let url = '/tgpt/vehicle/businessVehicleInformation/detail/'+row.id;
                this.$router.push({path: url});

            },
        },


    }
</script>

