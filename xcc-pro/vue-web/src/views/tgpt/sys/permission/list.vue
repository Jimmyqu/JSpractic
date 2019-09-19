<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box min">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">角色</label>
                    <div class="input-group">
                        <el-input type="text" placeholder="请输入角色名称" clearable v-model="searchParam.name"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select placeholder="全部" clearable v-model="searchParam.enableStatus">
                            <el-option label="禁用" value="0"></el-option>
                            <el-option label="启用" value="1"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="addRole()">新增</el-button>
        </div>
        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" @click="editRole(scope.row)" type="text" size="small">修改
                        </el-button>
                        <el-button v-show="showDeleteBtn" @click="deleteRole(scope.row)" type="text" size="small">删除
                        </el-button>
                        <el-button v-show="showAuthorityBtn" @click="assignAuthority(scope.row)" type="text"
                                   size="small">分配权限
                        </el-button>
                        <el-button v-if="scope.row.enableStatus == 0" v-show="showEnableBtn"
                                   @click="enableRole(scope.row)" type="text" size="small">启用
                        </el-button>
                        <el-button v-if="scope.row.enableStatus == 1" v-show="showEnableBtn"
                                   @click="enableRole(scope.row)" type="text" size="small">禁用
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" sortable label="角色名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="assignAuthority(scope.row,false)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" sortable label="所属管理公司" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="assignedCount" sortable label="分配人数" min-width="100"></el-table-column>
                <el-table-column prop="enableStatus" sortable label="状态" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.enableStatus == 1">启用</span>
                        <span v-if="scope.row.enableStatus == 0">禁用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" min-width="150"></el-table-column>
                <el-table-column prop="updateTime" sortable label="更新时间" min-width="150"></el-table-column>
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

        <!-- 新增、编辑角色弹窗-->
        <el-dialog :title="title" :visible.sync="addRoleVisible" :append-to-body="true">
            <el-form :model="roleForm" :rules="rules" label-position="top" ref="roleForm" class="full-input">
                <el-form-item label="角色名" label-width="120px" prop="name">
                    <el-input v-model="roleForm.name" clearable maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="120px" prop="remark">
                    <el-input type="roleForm.textarea" v-model="roleForm.remark" clearable maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="管理公司" label-width="120px" prop="companyId">
                    <el-select v-model="roleForm.companyId">
                        <el-option v-for="(item,index) in companys" :key="index"
                                   :label="item.organizationName" :value="item.organizationId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close('roleForm')">取 消</el-button>
                <el-button type="primary" @click="submit('roleForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 权限分配、权限详情-->
        <permissionForm ref="form"></permissionForm>

    </div>
</template>

<script>
    import permissionForm from '@/views/tgpt/sys/permission/form.vue'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'


    export default {
        name: 'sysPermission',
        mixins: [tool, ruleTool],
        components:{ permissionForm },
        data(){
            return {
                showEditBtn: this.getCurrentUserAuthority("role/edit"),
                showAddBtn: this.getCurrentUserAuthority("role/add"),
                showAuthorityBtn: this.getCurrentUserAuthority("role/authority"),
                showEnableBtn: this.getCurrentUserAuthority("role/enable"),
                showDeleteBtn: this.getCurrentUserAuthority("role/delete"),
                listUrl:"sys/role/list",
                addRoleVisible:false,
                roleForm:{
                    name:"",
                    remark:"",
                    companyId:""
                },
                title:"",
                companys: [],
                rules:{
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                    ],
                    companyId: [
                        { required: true, message: '请选择管理公司', trigger: 'change' },
                    ]
                }
            }
        },
        mounted: function () {
            this.getList();
        },
        methods: {
            assignAuthority(row, showButton){
                this.$refs.form.open(row, showButton);
            },
            getCompanys() {
                ajax.get('sys/position/getUserCompanys').then(result =>{
                    if(this.checkResponse(result)) {
                        this.companys = result.data;
                    }else{
                        this.companys = [];
                    }
                });
            },
            addRole(){
                this.title="新增角色";
                this.getCompanys();
                this.roleForm = {};
                this.addRoleVisible = true;
            },
            editRole(row){
                this.title="修改角色";
                this.getCompanys();
                ajax.get('sys/role/detail/'+row.id).then(result =>{
                    if(this.checkResponse(result)) {
                        this.roleForm = result.data;
                        this.addRoleVisible = true;
                    }
                });
            },
            deleteRole(row){
                this.$confirm('是否确认删除 ?').then(_ => {
                    ajax.get("sys/role/delete/"+row.id).then((result) => {
                        if(this.checkResponse(result)) {
                            this.showMessage('删除成功','success');
                            this.getList();
                        }
                    })
                }).catch(_ => {
                    console.info("关闭");
                });
            },
            close(roleForm){
                this.roleForm = {};
                this.$refs[roleForm].resetFields();
                this.addRoleVisible = false;
            },
            submit(roleForm){
                this.$refs[roleForm].validate((valid) => {
                    if (valid) {
                        ajax.post("sys/role/add", this.roleForm).then((res) => {
                            if(this.checkResponse(res)){
                                this.showMessage('保存成功','success');
                                this.addRoleVisible = false;
                                this.getList();
                            }
                        })
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });
            },
            enableRole(row){
                let alertText1 = '';
                let alertText2 = '';
                let data = {roleId:row.id};
                if(row.enableStatus == 1){
                    data.enable = false;
                    alertText1 = '是否确认禁用角色 ?';
                    alertText2 = '禁用成功！';
                }else{
                    data.enable = true;
                    alertText1 = '是否确认启用角色 ?';
                    alertText2 = '启用成功！';
                }
                this.$confirm(alertText1).then(_ => {
                    ajax.post("sys/role/enable", data).then((res) => {
                        if(this.checkResponse(res)){
                            this.showMessage(alertText2,'success');
                            this.getList();
                        }
                    })
                }).catch(_ => {
                    console.info("关闭");
                });
            },


        },
    }
</script>
