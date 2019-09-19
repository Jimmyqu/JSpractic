<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择" type="one" clearable
                                     url="admin/organization/tree" @change="changeOrganId"></tree-select>
                        <!--<el-checkbox v-model="searchParam.organCascade">子组织</el-checkbox>-->
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">姓名或手机号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.nameOrPhone" placeholder="请输入姓名或手机号" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">用户名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.account" placeholder="请输入用户名" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">角色</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.roleName" placeholder="请输入角色名称" clearable></el-input>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label">职位</label>
                    <div class="input-group" style="width: calc(100% - 82px);">
                        <tree-select v-model="posIds" placeholder="请选择" type="one" clearable
                                     url="admin/position/tree" @change="changePosId"></tree-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.userStatus" placeholder="全部" clearable>
                            <el-option label="全部" value="-1"></el-option>
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="停用" value="0"></el-option>
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
                <el-button size="mini" v-show="showAddBtn" type="warning" @click="add()">创建用户</el-button>
                <el-button size="mini" type="primary" @click="handleCurrentChange(1)">查询</el-button>
                <!--<el-button size="mini" v-show="showImportBtn" @click="dialogFormShow(true)">导入</el-button>-->
                <el-button size="mini" v-show="showexportBtn" @click="exportExcel()">导出</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
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
                <el-table-column fixed label="操作" width="170">
                    <template slot-scope="{ row, column, $index }">
                        <el-button v-show="showDisabledBtn" v-if="row.userStatus" @click="updateState(row)" type="text"
                                   size="small">停用
                        </el-button>
                        <el-button v-show="showEnableBtn" v-if="!row.userStatus" @click="updateState(row)" type="text"
                                   size="small">启用
                        </el-button>
                        <el-button v-show="showEditBtn" @click="edit(row.id)" type="text" size="small">编辑</el-button>
                        <el-button v-show="showResetPasswordBtn" @click="openResetPwdForm(row)" type="text"
                                   size="small">重置密码
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="name" fixed sortable show-overflow-tooltip min-width="120" label="姓名">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row)">
                            {{scope.row.name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="id" sortable min-width="130" label="用户ID"></el-table-column>
                <el-table-column prop="phone" sortable min-width="130" label="手机号"></el-table-column>
                <el-table-column prop="account" sortable show-overflow-tooltip min-width="150"
                                 label="用户名">
                </el-table-column>
                <el-table-column prop="email" sortable show-overflow-tooltip min-width="150"
                                 label="邮箱"></el-table-column>
                <el-table-column prop="wechat" sortable show-overflow-tooltip min-width="150"
                                 label="微信号"></el-table-column>
                <el-table-column prop="organizations" sortable show-overflow-tooltip min-width="150"
                                 label="组织"></el-table-column>
                <el-table-column prop="roles" sortable show-overflow-tooltip min-width="150"
                                 label="角色"></el-table-column>
                <el-table-column prop="positions" sortable show-overflow-tooltip min-width="150"
                                 label="职位"></el-table-column>
                <el-table-column prop="userStatus" sortable min-width="100" label="状态">
                    <template slot-scope="{row}">
                        <span v-if="row.userStatus">正常</span>
                        <span v-if="!row.userStatus">停用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTimeStr" sortable min-width="150" label="创建时间"></el-table-column>
                <el-table-column prop="updateTimeStr" sortable min-width="150" label="更新时间"></el-table-column>
                <el-table-column prop="loginTimeStr" sortable min-width="150" label="最后登录时间"></el-table-column>
            </el-table>

        </div>


        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'admin/user/import'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "用户导入模板" 的格式一致。
                            <a href="static/excelTemplate/用户导入模板.xlsx">下载模板</a>
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
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'user',
        mixins: [tool],
        components: {TreeSelect,UploadSubmit},
        data() {
            return {
                listUrl: "/admin/user",
                showSearch: false,

                showAddBtn: this.getCurrentUserAuthority("/user/save"),
                showexportBtn:this.getCurrentUserAuthority("/user/exportExcel"),
                showDisabledBtn: this.getCurrentUserAuthority('/user/updateState'),
                showEnableBtn: this.getCurrentUserAuthority('/user/updateState'),
                showEditBtn: this.getCurrentUserAuthority('/user/save'),
                showResetPasswordBtn: this.getCurrentUserAuthority('/user/resetPwd'),
                showImportBtn:false,
                importVisible : false,
                organizationIds:[],
                posIds:[]

            }
        },
        activated: function () {
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam = {};
                this.organizationIds = [];
                this.posIds = [];
                this.handleCurrentChange(1);
            },
            changeOrganId(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.$set(this.searchParam,'organId',this.organizationIds[0])
                }else{
                    this.$set(this.searchParam,'organId',undefined)
                }
            },
            changePosId(){
                if(this.posIds && this.posIds.length==1){
                    this.$set(this.searchParam,'posId',this.posIds[0])
                }else{
                    this.$set(this.searchParam,'posId',undefined)
                }
            },
            getListBefore(params) {
                params.organCascade = params.organCascade ? 1 : 0;
            },
            getListAfter() {
                var s = "yyyy-MM-dd hh:mm";
                this.list.forEach(item => {
                    if (item.createTime)
                        item.createTimeStr = new Date(item.createTime).format(s);
                    if (item.updateTime)
                        item.updateTimeStr = new Date(item.updateTime).format(s);
                    if (item.lastLoginTime)
                        item.loginTimeStr = new Date(item.lastLoginTime).format(s);
                });
            },
            updateState(row) {
                let msg = "确认启用？";
                if (row.userStatus) {
                    msg = "确认停用？";
                }
                this.$confirm(msg)
                    .then(_ => {
                        row.userStatus = row.userStatus == 0 ? 1 : 0;
                        ajax.post('admin/user/updateState', {
                            id: row.id,
                            userStatus: row.userStatus
                        }).then(rs => {
                            if (rs.status == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                            }
                        });

                    })
                    .catch(_ => {
                    });
            },
            exportExcel() {
                window.location = this.exportUrl("admin/user/export?" + $.param(this.searchParam));
            },
            openResetPwdForm(row) {
                this.$prompt('请输入新密码', '为账号 ' + row.account + ' 重置密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[a-zA-Z\d_]{6,14}$/,
                    inputErrorMessage: '6~14位数字、字母、下划线',
                    inputValue: ''
                }).then(({value}) => {
                    var user = {
                        id: row.id,
                        password: value
                    };
                    ajax.post('admin/user/resetPwd', user).then(rs => {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    });
                }).catch(() => {
                });

            },
            dialogFormShow(flag){
                this.importVisibleErrorId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            },
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
