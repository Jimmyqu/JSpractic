<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="searchParam.organId" placeholder="请选择" type="one"
                                     url="admin/organization/tree"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">姓名或手机号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.nameOrPhone" placeholder="请输入姓名或手机号"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">用户名</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.account" placeholder="请输入用户名"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">角色</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.roleName" placeholder="请输入角色名称"></el-input>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label">职位</label>
                    <div class="input-group" style="width: calc(100% - 82px);">
                        <tree-select v-model="searchParam.posId" placeholder="请选择" type="one"
                                     url="sys/user/pos_tree"></tree-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.userStatus" placeholder="全部">
                            <el-option label="全部" value="-1"></el-option>
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="停用" value="0"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">创建用户</el-button>
        </div>
        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed label="操作" width="170">
                    <template slot-scope="{ row, column, $index }">
                        <el-button v-show="showDisabledBtn" v-if="row.userStatus" @click="updateState(row)" type="text"
                                   size="small">停用
                        </el-button>
                        <el-button v-show="showEnableBtn" v-if="!row.userStatus" @click="updateState(row)" type="text"
                                   size="small">启用
                        </el-button>
                        <el-button v-show="showEditBtn" @click="edit(row.id)" type="text" size="small">编辑</el-button>
                        <el-button v-show="showResetPasswordBtn" @click="openResetPwdForm(row)" type="text" size="small">重置密码</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="name" fixed sortable show-overflow-tooltip min-width="120" label="姓名">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row)" >
                            {{scope.row.name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" sortable min-width="130" label="手机号"></el-table-column>
                <el-table-column prop="account" sortable show-overflow-tooltip min-width="150"
                                 label="用户名">
                </el-table-column>
                <el-table-column prop="email" sortable show-overflow-tooltip min-width="150" label="邮箱"></el-table-column>
                <el-table-column prop="wechat" sortable show-overflow-tooltip min-width="150" label="微信号"></el-table-column>
                <el-table-column prop="organizationsJson" sortable show-overflow-tooltip min-width="150"
                                 label="组织"></el-table-column>
                <el-table-column prop="rolesJson" sortable show-overflow-tooltip min-width="150"
                                 label="角色"></el-table-column>
                <el-table-column prop="positionsJson" sortable show-overflow-tooltip min-width="150"
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
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'sysUser',
        mixins: [tool],
        components:{TreeSelect},
        data() {
            return {
                listUrl: "/sys/user/list",
                showSearch: false,

                showAddBtn: this.getCurrentUserAuthority("/user/save"),
                showBatchImportBtn: true,
                showExportExcelBtn: true,
                showDisabledBtn: this.getCurrentUserAuthority('/user/updateState'),
                showEnableBtn: this.getCurrentUserAuthority('/user/updateState'),
                showEditBtn: this.getCurrentUserAuthority('/user/save'),
                showResetPasswordBtn: this.getCurrentUserAuthority('/user/resetPwd')
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            getListBefore(params) {
                params.organCascade = params.organCascade ? 1 : 0;
                if (params.organId)
                    params.organId = params.organId.join(',');
                if (params.posId)
                    params.posId = params.posId.join(',');
            },
            getListAfter(){
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
                        ajax.post('/sys/user/updateState', JSON.stringify({
                            id: row.id,
                            userStatus: row.userStatus
                        })).then(rs => {
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
            openResetPwdForm(row) {
                this.$prompt('请输入新密码', '为账号 ' + row.account + ' 重置密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[a-zA-Z\d_]{5,13}$/,
                    inputErrorMessage: '6~14位数字、字母、下划线',
                    inputValue: '123456'
                }).then(({value}) => {
                    var user = {
                        id: row.id,
                        password: value
                    };
                    ajax.post('sys/user/resetPwd', user).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        }
                        else
                            this.$message.error(rs.message);
                    });
                }).catch(() => {
                });

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
