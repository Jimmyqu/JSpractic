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
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
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
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyword" clearable placeholder="车牌"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">维修类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.maintenanceType" placeholder="请选择" clearable>
                            <el-option label="正常维修" :value="1"></el-option>
                            <el-option label="事故维修" :value="2"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">维修开始日期</label>
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
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="dialogFormShow()">导入</el-button>
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
                        <el-button v-show="showDetailBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="140" label="编号" prop="maintenanceNum" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.maintenanceNum}}</a>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修开始时间" prop="startTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修里程(km)" prop="maintenanceMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修项目" prop="maintenanceProjectId" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修类型" prop="maintenanceTypeText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合计费用" prop="totalCost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修配件费用(元)" prop="partsCost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修工时费用(元)" prop="workCost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="维修人" prop="maintenancePeople" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>


        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
              <!--  <el-form-item label="管理公司" required>
                    <tree-select v-model="exportOrganization" placeholder="请选择服务组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeExportOrganization"></tree-select>
                </el-form-item>-->
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit" :visible="importVisible"
                                  :url="'traffic/repairCw/import'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "维修管理导入模板" 的格式一致。
                            <a href="static/excelTemplate/维修登记导入模板.xls">下载模板</a>
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
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'repairCw',
        mixins: [tool],
        components: { TreeSelect ,UploadSubmit},
        data() {
            return {
                showDetailBtn: this.getCurrentUserAuthority("traffic/repairCw/edit"),
                showSearch: false,
                showAddBtn : this.getCurrentUserAuthority("traffic/repairCw/add"),
                showImportBtn:this.getCurrentUserAuthority("traffic/repairCw/import"),
                showExportExcelBtn: this.getCurrentUserAuthority("traffic/repairCw/export"),
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                //exportOrganization : [],
                //companyId : "",
                organization:[],
                checkerDept:[],
                creatDate:[],
                searchParam: {
                },
                listUrl: 'traffic/repairCw'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var plate = this.$route.query.plate;
            if(plate){
                this.searchParam.keyword = plate;
            }
            var regionId = this.$route.query.regionId;
            if(regionId){
                this.organization = [regionId];
                this.searchParam.organizationId = regionId;
            }
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime) {
                this.creatDate = [startTime, endTime];
                this.searchParam.startTime = startTime
                this.searchParam.endTime = endTime ;
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false)
                this.organization=[];
                this.creatDate=[];
                this.getList();
            },
            getListBefore(params) {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0] ;
                    this.searchParam.endTime = creatDate[1] ;
                }
            },
            exportExcel() {
                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0] ;
                    this.searchParam.endTime = creatDate[1] ;
                }
                window.location = this.exportUrl("traffic/repairCw/excel?" + $.param(this.searchParam));
            },
            changeOrganization(data){

                if(this.organization && this.organization.length==1){
                    this.$set(this.searchParam,'organizationId',this.organization[0])
                }else {
                    this.$set(this.searchParam,'organizationId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },

            dialogFormShow(){
                this.importVisibleErrorId = "";
                //this.exportOrganization=[];
                //this.companyId = "";
                this.importVisible = true;
            },
           /* changeExportOrganization(){
                if(this.exportOrganization && this.exportOrganization.length==1){
                    this.companyId=this.exportOrganization[0];
                }else{
                    this.companyId = '';
                }
            },*/
            creatDateChange() {

                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    this.searchParam.startTime = creatDate[0] ;
                    this.searchParam.endTime = creatDate[1] ;
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            detail(id){
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/detail/"+id});
            },
        }
    }
</script>

