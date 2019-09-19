<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">供应商名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" clearable autocomplete="off"
                                  placeholder="请输入供应商名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select placeholder="全部" clearable v-model="searchParam.supplierStatus">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="停用" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds1"
                                     @change="chooseOrgId(1)"
                                     placeholder="请选择组织" type="one"
                                     url="/admin/organization/tree"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供应商类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.supplierType" placeholder="请选择" clearable>
                            <el-option v-for="item in supplierTypes" :key="item.value" :label="item.text" :value="item.value"></el-option>
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
                <el-button size="mini" v-show="showImportBtn" @click="importExcel">导入</el-button>
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportData">导出</el-button>
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
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border style="width: 100%;" :data="list">
                <el-table-column fixed label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="edit(scope.row.id)"
                                   v-if="showEditBtn">编辑
                        </el-button>
                        <el-button type="text" size="small" @click="deleteSupplier(scope.row.id)"
                                   v-if="showDeleteBtn">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="供应商名称" min-width="140" show-overflow-tooltip sortable>
                    <template slot-scope="scope">
                        <a @click="supplierDetail(scope.row)" v-if="showDetailBtn">{{scope.row.name}}</a>
                        <span v-else>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" label="所属组织" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="supplierType" label="供应商类型" min-width="100" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.supplierType == 1">厂家</span>
                        <span v-if="scope.row.supplierType == 2">4S店</span>
                        <span v-if="scope.row.supplierType == 3">租车公司</span>
                        <span v-if="scope.row.supplierType == 5">车务设备</span>
                        <span v-if="scope.row.supplierType == 6">保险公司</span>
                        <span v-if="scope.row.supplierType == 7">停车场</span>
                        <span v-if="scope.row.supplierType == 8">洗车场</span>
                    </template>
                </el-table-column>
                <el-table-column prop="supplierStatus" label="状态" min-width="60" sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.supplierStatus == 1">正常</span>
                        <span v-if="scope.row.supplierStatus == 2">停用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contact" label="联系人" min-width="100" show-overflow-tooltip
                                 sortable></el-table-column>
                <el-table-column prop="phoneNo" label="联系手机号" min-width="110" sortable></el-table-column>
                <el-table-column prop="contactPhone" label="联系电话" min-width="120" sortable></el-table-column>
                <el-table-column prop="contactAddress" label="联系地址" min-width="140" show-overflow-tooltip
                                 sortable></el-table-column>
            </el-table>

        </div>

        <!-- 导入弹窗 -->
        <el-dialog title="导入供应商资料" class="import-box" :visible.sync="importVisible" :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item label="所属组织" prop="companyId" style="width: 400px;">
                    <tree-select v-model="companyIds" placeholder="所属组织" type="one"
                                 url="admin/organization/tree" @change="chooseOrgId(2)"
                    ></tree-select>
                </el-form-item>
                <el-form-item  prop="filePath" v-show = "fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/supplier/import?companyId='+companyId"
                                  :disabled="!companyId" name="file" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "供应商资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/供应商资料导入模板.xlsx">下载模板</a>
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
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadPanel from '@/components/UploadPanel/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'

    export default {
        name: 'supplierInformation',
        mixins: [tool],
        components:{ UploadPanel, UploadSubmit ,TreeSelect},
        data() {
            return {
                showSearch: false,
                showAddBtn: this.getCurrentUserAuthority("supplier/supplier/add"),
                showEditBtn: this.getCurrentUserAuthority("supplier/supplier/edit"),
                showDeleteBtn: this.getCurrentUserAuthority("supplier/supplier/delete"),
                showExportExcelBtn: this.getCurrentUserAuthority("supplier/supplier/export"),
                showDetailBtn: this.getCurrentUserAuthority("supplier/supplier/detail"),
                showImportBtn: this.getCurrentUserAuthority("supplier/supplier/importe"),
                listUrl: "base/supplier/list",
                companyId: '',
                importVisible: false,
                importVisibleError: false,
                importVisibleErrorId: '',
                fileUpload : true,
                companyIds:[],
                companyIds1:[],
                supplierTypes:[],
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
            this.selectSupplierType();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.selectSupplierType();
        },
        methods: {
            chooseOrgId(type){
                if(type == 1){
                    if(this.companyIds1.length>0){
                        this.searchParam.companyId = this.companyIds1[0];
                    }else{
                        this.searchParam.companyId = '';
                        this.$set(this.searchParam,'organCascade',false);
                    }
                }
                if(type == 2){
                    if(this.companyIds.length>0){
                        this.companyId = this.companyIds[0];
                    }else{
                        this.companyId = '';
                    }
                }
            },

            selectSupplierType() {
                var $this = this;
                ajax.get("admin/dict/type/供应商类型?time=" + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        $this.supplierTypes = result;
                    } else {
                        $this.supplierTypes = [];
                    }
                });
            },

            /*addSupplier() {
                this.$refs.supplierForm.open("");
            },
            editSupplier(id) {
                this.$refs.supplierForm.open(id);
            },*/
            deleteSupplier(id) {
                let $this = this;
                this.$confirm('确定删除供应商资料?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //删除供应商资料
                    ajax.get("base/supplier/delete/" + id).then(result => {
                        if (result.status == 0) {
                            $this.$message.success("删除成功");
                            //刷新列表
                            $this.getList();
                        } else {
                            $this.$message.error("删除失败");
                        }
                    });
                });
            },
            supplierDetail(row) {
                /*$(row).data("href", "modules/supplier/supplier/detail.html?id=" + row.id);
                $(row).data("index", "modules/supplier/supplier/detail.html");
                $(row).data("title", "供应商资料-查看");

                showIFrameTab(row);*/

                this.$router.push({path:"/tgpt/supplier/supplierInformation/detail/"+row.id});
            },
            exportData() {
                location.href = this.exportUrl("base/supplier/export?" + $.param(this.searchParam));
            },

            /*影藏弹出框*/
            dialogFormShow(flag){
                this.companyId = '';
                this.importVisible = flag;
                $("#resultDiv").html("");
            },

            /*导入数据*/
            importExcel(){
                this.companyId = '';
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.companyIds1=[];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

