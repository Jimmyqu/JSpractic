<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="tree-box">
            <div class="top-box">
                <div class="title">组织设置</div>
            </div>
            <div class="tree-content">
                <tree-panel all="false" ref="tree" url="admin/organization/tree" :lazy="true"
                            :showAdd="showAdd" :showEdit="showEdit" @show-form="open"></tree-panel>
            </div>
        </div>

        <el-dialog width="600px" class="full-input" :visible.sync="show" :title="title">
            <el-form :model="editForm" ref="editForm" label-position="top" label-width="100px">
                <el-form-item label="上级组织" prop="parentId" v-if="parentShow" :rules="rules.required('请选择上级组织')">
                    <tree-select v-model="editForm.parentId" placeholder="请选择" type="one" ref="parentTree"
                                 url="admin/organization/tree" :disabled-id="parentDisabledArr" :params="params"></tree-select>

                </el-form-item>
                <el-form-item label="组织名称" prop="name" :rules="rules.required('请输入组织名称')">
                    <el-input v-model="editForm.name" placeholder="请输入" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="组织属性" prop="type" :rules="rules.required('请选择组织属性')">

                    <tree-select v-model="editForm.type" placeholder="请选择" type="one" ref="typeTree"
                                 url="admin/organization/typeTree" :params="params"
                                 :disabled-id="disabledArray"></tree-select>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add" :loading="addLoading">保存</el-button>
                <el-button @click="close">返回</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import TreePanel from '@/components/TreePanel/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        name: 'organization',
        mixins: [tool, ruleTool],
        components: {TreePanel, TreeSelect},
        data() {
            return {
                showAdd: this.getCurrentUserAuthority("sys/organization/insert"),
                showEdit: this.getCurrentUserAuthority("sys/organization/update"),

                show: false,
                parentShow: false,
                title: "",
                params: {},
                editForm: {},
                disabledArray: [],
                parentDisabledArr: [],
                addLoading : false,
            }
        },
        methods: {
            open(opt) {
                this.disabledArray = [];
                let isEdit = false;
                if (opt.state == 1) {
                    this.title = "编辑组织";
                    this.parentShow = true;
                    this.getOrganizationDetail(opt.data.id);
                    isEdit = true;

                    //this.parentDisabledArr = [];
                    //this.parentDisabledArr.push(opt.data.id);

                    //上级组织禁选
                    setTimeout(function () {
                        that.disabledParentTree(opt.data.id);
                    }, 400);
                } else {
                    this.title = [opt.data.name] + " - 新增下级";
                    this.parentShow = false;
                    this.$set(this.editForm, "parentId", [opt.data.id]);
                    this.$set(this.editForm, "type", '');
                    this.$set(this.editForm, "id", '');
                    this.show = true;
                    this.clearValidate();
                }

                //禁用不能选择的 type 层级
                let that = this;
                setTimeout(function () {
                    that.disabledTypeTree(that.getParent(opt.data).type);
                }, 400);
            },
            close() {
                this.show = false;
                this.editForm = {};
            },
            clearValidate() {
                this.$nextTick(_ => {
                    if (this.$refs["editForm"]) {
                        this.$refs["editForm"].clearValidate();
                    }
                });
            },
            getOrganizationDetail(id) {
                //this.show = true;
                ajax.get("admin/organization/" + id).then(result => {
                    if (this.checkResponse(result)) {
                        this.editForm = result.data;
                        this.$set(this.editForm, "name", result.data.name);
                        this.$set(this.editForm, "parentId", [result.data.parentId]);
                        this.$set(this.editForm, "type", [result.data.type]);
                        this.show = true;
                        this.clearValidate();
                    }
                }).catch(e => {
                    console.log(e);
                    this.showMessage("系统异常,请联系系统管理员", "error");
                });
            },
            //新增
            add() {
                this.addLoading = true;
                this.$refs["editForm"].validate((valid) => {
                    if (!valid) {
                        this.showMessage('校验不通过，请检查输入项');
                        this.addLoading = false;
                        return false;
                    }


                    let params = Object.assign({}, this.editForm);
                    if (Array.isArray(params.parentId)) {
                        params.parentId = params.parentId[0];
                    }

                    if (Array.isArray(params.type)) {
                        params.type = params.type[0];
                    }
                    ajax.post('/admin/organization', params).then(rs => {
                        this.showMessage("保存成功", "success");
                        this.addLoading = false;
                        this.show = false;
                        this.editForm.name = '';
                        this.$refs.tree.getData();
                    });
                });
            },
            disabledTypeTree(type) {
                let data = this.$refs.typeTree.data[0];

                let disabledArray = [];
                let other = [];
                let current;
                if (data.id == type)
                    current = data;


                let f = function (parent, set) {

                    if (!parent.children)
                        return;

                    let node;
                    for (let i = 0, len = parent.children.length; i < len; i++) {
                        node = parent.children[i];

                        set.push(node.id);

                        if (node.id == type)
                            current = node;

                        if (Array.isArray(node.children))
                            f(node, set);
                    }
                };

                //要禁用的
                f(data, disabledArray);

                //可选的
                f(current, other);
                //if (isEdit)
                other.push(current.id);

                other.forEach(id => {
                    disabledArray.splice(disabledArray.indexOf(id), 1);
                });

                //disabledArray.push(data.id);
                disabledArray.push("10");
                disabledArray.push("20");

                this.disabledArray = disabledArray;
            },
            disabledParentTree(cId){
                let data = this.$refs.parentTree.data[0];

                let disabledArray = [];
                let other = [];
                let current;
                if (data.id == cId)
                    current = data;

                let f = function (parent, set) {

                    if (!parent.children)
                        return;

                    let node;
                    for (let i = 0, len = parent.children.length; i < len; i++) {
                        node = parent.children[i];

                        set.push(node.id);

                        if (node.id == cId)
                            current = node;

                        if (Array.isArray(node.children))
                            f(node, set);
                    }
                };


                //可选的
                f(data, other);

                //要禁用的
                f(current, disabledArray);
                //if (isEdit)
                //other.push(current.id);

                /*other.forEach(id => {
                    disabledArray.splice(disabledArray.indexOf(id), 1);
                });*/

                disabledArray.push(cId);
                this.parentDisabledArr = disabledArray;
            },
            getParent(n){
                let data = this.$refs.tree.data[0];
                let parentNode;
                let f = function (parent) {

                    if (!parent.children || parentNode)
                        return;

                    let node;
                    for (let i = 0, len = parent.children.length; i < len; i++) {
                        node = parent.children[i];

                        if(node.id == n.id){
                            parentNode = parent;
                            return;
                        }

                        if (Array.isArray(node.children))
                            f(node);
                    }
                };

                f(data);
                return parentNode;
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
