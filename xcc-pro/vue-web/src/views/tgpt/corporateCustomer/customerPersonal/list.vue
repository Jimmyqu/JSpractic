<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">姓名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="请输入姓名" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">手机号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.phone" placeholder="请输入手机号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">性别</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.sex" placeholder="全部" clearable>
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">准驾车型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.driveType" placeholder="全部" clearable>
                            <el-option label="A1" value="1"></el-option>
                            <el-option label="A2" value="2"></el-option>
                            <el-option label="A3" value="3"></el-option>
                            <el-option label="B1" value="4"></el-option>
                            <el-option label="B2" value="5"></el-option>
                            <el-option label="C1" value="6"></el-option>
                            <el-option label="C2" value="7"></el-option>
                            <el-option label="C3" value="8"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">身份证号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.idCard" placeholder="请输入身份证号" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()" :disabled="isDisabled">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button  v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" style="width: 100%" border>
                <el-table-column fixed="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable label="姓名" show-overflow-tooltip min-width="140">
                    <template slot-scope="scope">
                        <!--<a size="mini" v-if="showDetailBtn" @click="viewDriver(scope.row)">{{scope.row.name}}</a>
                        <span v-if="!showDetailBtn">{{scope.row.name}}</span>-->
                        <a size="mini" @click="viewDriver(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" sortable label="手机号" min-width="120"></el-table-column>
                <el-table-column prop="sex" sortable label="性别" min-width="80"></el-table-column>
                <el-table-column prop="maritalStatus" sortable label="婚姻状况" min-width="100"></el-table-column>
                <el-table-column prop="companyId" sortable label="所属组织" show-overflow-tooltip
                                 min-width="140"></el-table-column>

                <el-table-column prop="driveType" sortable label="准驾车型" min-width="100"></el-table-column>
                <el-table-column prop="idCard" sortable label="身份证号" show-overflow-tooltip
                                 min-width="180"></el-table-column>
                <el-table-column prop="birthday" sortable label="出生日期" min-width="100"></el-table-column>
                <el-table-column prop="age" sortable label="年龄" min-width="80"></el-table-column>
                <el-table-column prop="currentAddress" sortable label="现住地址" min-width="140"></el-table-column>
                <!--<el-table-column prop="relatedUserId" sortable label="关联用户" show-overflow-tooltip
                                 min-width="140"></el-table-column>-->
                <el-table-column prop="bankCard" sortable label="银行账号" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column prop="openBank" sortable label="开户行" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column prop="bankOwner" sortable label="开户人姓名" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" show-overflow-tooltip
                                 min-width="140"></el-table-column>
            </el-table>
        </div>

        <!-- 导入弹窗 -->
        <el-dialog title="导入司机资料" class="import-box" :visible.sync="importVisible" :append-to-body="true" width="600px">
            <el-form label-position="top">
                <el-form-item label="所属组织" prop="companyId" style="width: 400px;">
                    <tree-select v-model="companyId" placeholder="所属组织" type="one"
                                 url="admin/organization/tree"
                    ></tree-select>
                </el-form-item>
                <el-form-item  prop="filePath" v-show = "fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/driver/import?companyId='+companyId"
                                  :disabled="!companyId" name="file" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "司机资料导入模板" 的格式一致。
                            <a href="static/excelTemplate/司机资料导入模板.xlsx">下载模板</a>
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
    import CitySelect from '@/components/CitySelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import TreeSelect from '@/components/TreeSelect/index'
    export default {
        name: 'customerPersonal',
        mixins: [tool],
        components: { CitySelect, UploadSubmit ,TreeSelect},
        data(){
            return {
                showSearch: false,
                showAddBtn: /*true,*/this.getCurrentUserAuthority("personal/add"),
                showEditBtn: /*true,*/this.getCurrentUserAuthority("personal/edit"),
                //showDeleteBtn: this.getCurrentUserAuthority("driver/delete"),
                //showDetailBtn: getCurrentUserAuthority("driver/detail"),
                showExportBtn: /*true,*/this.getCurrentUserAuthority("personal/export"),
                showImportBtn:true,/* this.getCurrentUserAuthority("personal/import"),*/
                formData:{},
                listUrl:"core/personal",
                serviceCityList:[],
                importVisible: false,
                companyId: '' ,
                companyNameOptions: [],
                importVisibleError: false,
                importVisibleErrorId: '',
                fileUpload : true,
                nearCity4:[],
                companyIds:"",
                isDisabled:false
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
            this.isDisabled=false;
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            deleteDriver(row) {
                var $this = this;
                this.$confirm('是否确认删除？').then(_ => {
                    ajax.post("base/driver/delete/"+row.id+"?time="+new Date().getTime(), null).then(result => {
                        if (result.status==0) {
                            $this.$message.success(result.message);
                            $this.getList();
                        } else {
                            console.log(result.message);
                            $this.$message.error(result.message);
                        }
                    });
                }).catch(_ => {
                    console.log("关闭");
                });
            },
            viewDriver(row) {
                this.$router.push({path:"/tgpt/corporateCustomer/customerPersonal/detail/"+row.id});
            },
            resetList(){
              this.searchParam={};
              this.$set(this.searchParam,'organCascade',false);
              this.nearCity4=[];
              this.companyIds="";
              this.getList();
            },
            changeOrganization(data){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.companyId=this.companyIds[0];
                }else{
                    this.searchParam.companyId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
           /* getListBefore(params){
                if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }
            },*/
            exportData() {
                var params=this.searchParam;
                if (this.companyIds) {
                    params.companyId = this.companyIds[0];
                }
                location.href = this.exportUrl("core/personal/excel?" + $.param(params));
            },

            /*导入数据，打开框*/
            importExcel(){
                this.companyId = '';
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2)
                    this.searchParam.serviceCityId=this.nearCity4[1];
            },
            add(){
                this.isDisabled=true;
                let url=this.$route.fullPath;
                this.$router.push({path:url+"/add"});
            }
        }
    }
</script>


<style scoped lang="scss">
    .organ_wrap {
        display: flex;

        .tree-select-panel {
            width: 100%;
        }

        .el-checkbox {
            display: flex;
            align-items: center;
            margin-left: 10px;
            margin-right: 0;

            /deep/ .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

    .list-panel .search-box .input-group {
        width: calc(100% - 65px);
    }
</style>
