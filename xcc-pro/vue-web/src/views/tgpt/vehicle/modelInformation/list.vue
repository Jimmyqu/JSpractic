<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box"  :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车型名称</label>
                    <div class="input-group">
                        <el-input type="text"  placeholder="请输入车型名称" clearable v-model="searchParam.modelInfo" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">品牌</label>
                    <div class="input-group">
                        <el-input type="text"  placeholder="请输入品牌" clearable v-model="searchParam.brandName" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">系列</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入系列" clearable v-model="searchParam.seriesName" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">款式</label>
                    <div class="input-group">
                        <el-input type="text"  placeholder="请输入款式" clearable v-model="searchParam.modelName" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">燃油类型</label>
                    <div class="input-group">
                        <el-select clearable v-model="searchParam.fuelType" placeholder="不限">
                            <el-option  v-for="e in fuelTypeList"  :key="e.value" :label="e.text" :value="e.value" ></el-option >
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">能源类型</label>
                    <div class="input-group">
                        <el-select clearable  v-model="searchParam.energyType" placeholder="不限">
                            <el-option  v-for="e in energyTypeList"  :key="e.value" :label="e.text" :value="e.value" ></el-option >
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">环保标准</label>
                    <div class="input-group">
                        <el-select clearable v-model="searchParam.protectionStandard" placeholder="不限">
                            <el-option  v-for="e in environmentalStandardList"  :key="e.value" :label="e.text" :value="e.value" ></el-option >
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
                <el-button  v-show="addBtnShow" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="importBtnShow" @click="importData">导入</el-button>
                <el-button  v-show="exportBtnShow" size="mini" @click="exportData">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border  style="width: 100%" :data="list">
                <el-table-column fixed="left" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="modelInfo" sortable label="车型名称" show-overflow-tooltip min-width="350" >
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.modelInfo}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" sortable label="品牌"  min-width="100">
                </el-table-column>
                <el-table-column prop="seriesName" sortable label="系列" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="style" sortable label="款式" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="vehicleNumberName" sortable label="车厢数" min-width="100"></el-table-column>
                <el-table-column prop="displacement" sortable label="排量" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="transmissionName" sortable label="变速箱" min-width="120"></el-table-column>
                <el-table-column prop="versionName" sortable label="版型名" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="seating" sortable label="座位数" min-width="100"></el-table-column>
                <el-table-column prop="vehicleStructureName" sortable label="车身结构" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="fuelTypeName" sortable label="燃油类型" min-width="100"></el-table-column>
                <el-table-column prop="combined" sortable label="综合油耗" min-width="120"></el-table-column>
                <el-table-column prop="fuelCapacity" sortable label="邮箱容量" min-width="100"></el-table-column>
                <el-table-column prop="vehicleSize" sortable label="车身尺寸" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="spareTireTypeName" sortable label="轮胎尺寸" min-width="150"></el-table-column>
                <el-table-column prop="energyTypeName" sortable label="能源类型" min-width="120"></el-table-column>
                <el-table-column prop="protectionStandardName" sortable label="环保标准" min-width="120"></el-table-column>
                <el-table-column prop="vehicleWarrantyYear" sortable label="整车质保（年）" min-width="150"></el-table-column>
                <el-table-column prop="vehicleWarrantyKm" sortable label="整车质保（公里）" min-width="150"></el-table-column>
            </el-table>
        </div>

        <!-- 导入弹窗 -->

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item label="管理公司" required>
                    <el-select v-model="companyId" clearable style="width: 400px" placeholder="请选择">
                        <el-option
                            v-for="item in companys"
                            :key="item.organizationId"
                            :label="item.organizationName"
                            :value="item.organizationId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/enterprise/import?companyId='+companyId"
                                  :disabled="!companyId" name="file" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "车型资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/车型资料导入模板.xlsx">下载模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                    </UploadSubmit>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="dialogFormShow(false)">确 定</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import $ from 'jquery-slim'

    export default {
        name: 'vehicleModelInformation',
        mixins: [tool],
        components : {UploadSubmit},
        data() {
            return {
                listUrl: "/base/baseVehicleModelInfo/queryList",
                transmissionList : [],
                fuelTypeList : [],
                environmentalStandardList : [],
                energyTypeList:[],
                formData : {},
                modelForm :{},
                addBtnShow : this.getCurrentUserAuthority("baseVehicleModelInfo/add"),
                exportBtnShow : this.getCurrentUserAuthority("baseVehicleModelInfo/export"),
                importBtnShow : false,
                showEditBtn : this.getCurrentUserAuthority("baseVehicleModelInfo/edit"),
                showDeleteBtn : true,
                showViewBtn : true,
                showSearch : false,
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                companys : [],
                companyId : "",
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted: function () {
            this.getList();
            /*if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }*/
            this.initTransmissionList();
            this.initFuelTypeList();
            this.initEnvironmentalStandardList();
            this.initEnergyTypeList();
           // this.initCompanys();
        },
        watch: {

        },
        methods: {
            initCompanys(){
                ajax.get('sys/position/getUserCompanys').then(rs => {
                    if(rs.status == 0){
                        this.companys = rs.data;
                    }else{
                        this.companys = [];
                    }
                });
            },
            initTransmissionList() {
                ajax.get('admin/dict/type/变速箱').then(rs => {
                    if(rs.length > 0){
                        this.transmissionList = rs;
                    }else{
                        console.log("no transmission data!");
                    }
                });
            },
            initFuelTypeList() {
                ajax.get('admin/dict/type/燃油类型').then(rs => {
                    if(rs.length > 0){
                        this.fuelTypeList = rs;
                    }else{
                        console.log("no industryType data!");
                    }
                });
            },
            initEnvironmentalStandardList() {
                ajax.get('admin/dict/type/能源类型').then(rs => {
                    if(rs.length > 0){
                        this.energyTypeList = rs;
                    }else{
                        console.log("no industryType data!");
                    }
                });
            },
            initEnergyTypeList() {
                ajax.get('admin/dict/type/环保标准').then(rs => {
                    if(rs.length > 0){
                        this.environmentalStandardList = rs;
                    }else{
                        console.log("no industryType data!");
                    }
                });
            },
            exportData : function () {
                window.location = this.exportUrl("base/baseVehicleModelInfo/export?" + $.param(this.searchParam));
            },
            importData(){
                this.importVisibleErrorId = "";
                this.companyId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
        },
    }
</script>

