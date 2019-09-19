<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="tree-box">
            <div class="top-box">
                <div class="title">组织属性设置</div>
            </div>
            <div class="tree-content">
                <tree-panel ref="tree" url="admin/organization/treeList"
                            :showAdd="showAdd" :showEdit="showEdit" @show-form="open"></tree-panel>
            </div>
        </div>

        <el-dialog class="full-input" :visible.sync="show" :title="title">
            <el-form :model="editForm" ref="editForm" label-position="top" label-width="100px">
                <el-form-item label="上级组织属性" prop="parentId" v-if="parentShow" :rules="rules.required('请选择上级组织')">
                    <tree-select v-model="editForm.parentId" placeholder="请选择" type="one"
                                 url="admin/organization/treeList" :params="params"></tree-select>
                </el-form-item>
                <el-form-item label="组织属性名称" prop="name" :rules="rules.required('请输入组织名称')">
                    <el-input v-model="editForm.name" placeholder="请输入" maxlength="30"> </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add">保存</el-button>
                <el-button @click="close">返回</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import TreePanel from '@/components/TreePanel/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool } from '@/utils/common'

    export default {
        name: 'sysOrganization',
        mixins: [ tool, ruleTool ],
        components:{ TreePanel, TreeSelect},
        data() {
            return {
                showAdd: this.getCurrentUserAuthority("sys/organization/insert"),
                showEdit: this.getCurrentUserAuthority("sys/organization/update"),

                show:false,
                parentShow: false,
                title:"",
                orgTypes: [{value: "30", text: "所属组织"}],
                params: {},
                editForm: {}
            }
        },
        methods: {
            open(opt){
                if(opt.state == 1) { //编辑
                    this.title = "编辑组织属性";
                    this.parentShow = true;
                    this.editForm.id = opt.data.id;
                    console.log(opt.data.id)
                    this.$set(this.params,"delCompanyId",opt.data.id);
                    this.getOrganizationDetail(opt.data.id);
                } else {
                    this.title = "新增组织属性";
                    this.parentShow = false;
                    this.editForm = {};
                    this.editForm.parentId = opt.data.id;
                    this.show = true;
                    this.clearValidate();
                }
            },
            close(){
                this.show = false;
                this.editForm = {};
            },
            clearValidate(){
                this.$nextTick(_ =>{
                    if(this.$refs["editForm"]) {
                        this.$refs["editForm"].clearValidate();
                    }
                });
            },
            getOrganizationDetail(id) {
                ajax.get("sys/organization/detail/" + id).then( result =>{
                    if(this.checkResponse(result)) {
                        result.data.parentId = result.data.parentId.split(',');
                        this.editForm = result.data;
                        this.show = true;
                        this.clearValidate();
                    }
                }).catch(e =>{
                    console.log(e);
                    this.showMessage("系统异常,请联系系统管理员","error");
                });
            },
            //新增
            add() {
                this.$refs["editForm"].validate((valid) => {
                    if(!valid) {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                    let url = "";
                    if(this.editForm.id){
                        url = "sys/organization/update";
                    }else{
                        url = "sys/organization/insert";
                    }
                    let params = Object.assign({},this.editForm);
                    if(typeof params.parentId === 'object'){
                        params.parentId = params.parentId.join(',');
                    }
                    ajax.post(url, params).then(res =>{
                        if(this.checkResponse(res)){
                            this.showMessage("保存成功","success",() => {
                                this.close();
                                this.$refs.tree.getData();
                            });
                        }
                    })
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-container {
        padding: 20px;
        height: calc(100% - 20px);
    }
    .tree-box {
        width: 800px;
        height: 100%;
        .top-box {
            width: 100%;
            display: inline-flex;
            align-items: center;
            .title {
                font-size: 18px;
                font-weight: bold;
            }
        }
        /deep/ .el-tree {
            margin-top: 10px;
        }
    }

    .tree-content {
        margin-top: 10px;
        width: 100%;
        height: calc(100% - 60px);
        border-radius: 5px;
        border: 1px solid #eee;
        padding: 20px;
        overflow: auto;
    }
</style>
