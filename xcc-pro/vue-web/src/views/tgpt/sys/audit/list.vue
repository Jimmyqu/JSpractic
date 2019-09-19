<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box min">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.organizationId" clearable filterable placeholder="请选择">
                            <el-option
                                v-for="item in organizations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">模块名称</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.modelId" placeholder="请选择">
                            <el-option
                                v-for="item in menus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
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
                <el-table-column fixed="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="edit(scope.row.id)" type="text" size="small">修改
                        </el-button>
                        <el-button v-show="showDeleteBtn" @click="del(scope.row)" type="text" size="small">删除
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="modelName" sortable label="模块名称" min-width="140"></el-table-column>
                <el-table-column prop="organizationName" sortable label="所属组织" min-width="140"></el-table-column>
                <el-table-column prop="processDetail" sortable label="流程详情" min-width="140"></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" min-width="140"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="140"></el-table-column>
                <el-table-column prop="updateTime" sortable label="更新时间" min-width="140"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {deepClone} from '@/utils'

    export default {
        name: 'sysAudit',
        mixins: [tool],
        data() {
            return {
                showAddBtn: this.getCurrentUserAuthority("workflow/add"),
                showEditBtn: this.getCurrentUserAuthority("workflow/edit"),
                showDeleteBtn: this.getCurrentUserAuthority("workflow/delete"),
                showLogBtn: this.getCurrentUserAuthority("workflow/record"),
                organizations: [],
                menus: [],
                formData: {},
                listUrl: "workflow/config/list",
            }
        },
        activated() {
            this.getList();
        },
        mounted() {
            this.getOrganizations();
            this.getModels();
            if (this.getCurrentUserInfo().managementCompanyId) {
                this.searchParam.organizationId = this.getCurrentUserInfo().managementCompanyId;
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            del(bean) {
                this.$confirm('删除流程？').then(_ => {
                    ajax.get("workflow/config/delete/" + bean.id).then((res) => {
                        if (this.checkResponse(res)) {
                            this.showMessage(res.message, "success");
                            this.getList();
                        }
                    });
                }).catch(_ => {

                });
            },
            //获取模块数据
            getModels() {
                ajax.get("workflow/workflow/getWorkflowMenuList").then((res) => {
                    if (this.checkResponse(res)) {
                        this.menus = res.data;
                    }

                });
            },
            //获取组织数据
            getOrganizations() {
                ajax.get("admin/organization/managerCompany").then((res) => {
                    this.organizations = res.data;
                    this.organizations.forEach(item=>{
                        item.value = item.name
                    })
                });
            }
        }
    }
</script>