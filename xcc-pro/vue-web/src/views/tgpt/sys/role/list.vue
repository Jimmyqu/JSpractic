<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="tree-box">
            <div class="top-box">
                <div class="title">职位设置</div>
                <el-select v-model="params.companyId" style="width:150px;margin-left: 20px">
                    <el-option
                        v-for="(item,i) in companys"
                        :key="i"
                        :label="item.organizationName"
                        :value="item.organizationId"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="tree-content">
                <tree-panel ref="tree" url="admin/position/tree" :params="params"
                            :showAdd="showAdd" :showEdit="showEdit" @show-form="open"></tree-panel>
            </div>
        </div>

        <el-dialog class="full-input" :visible.sync="show" :title="title">
            <el-form :model="editForm" ref="editForm" label-position="top" label-width="100px">
                <el-form-item label="职位名称" prop="name" :rules="rules.required('请输入职位名称')">
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
        name: 'sysRole',
        mixins: [ tool, ruleTool ],
        components:{ TreePanel, TreeSelect},
        data() {
            return {
                showAdd: this.getCurrentUserAuthority("sys/position/insert"),
                showEdit: this.getCurrentUserAuthority("sys/position/update"),

                show:false,
                companys:[],
                title:"",
                orgTypes: [{value: "30", text: "所属组织"}],
                params: {},
                editForm: {}
            }
        },
        mounted(){
            ajax.get('sys/position/getUserCompanys').then(result =>{
                if(this.checkResponse(result)){
                    this.companys = result.data;
                    if(this.companys && this.companys.length > 0) {
                        this.params = {
                            companyId: result.data[0].organizationId
                        };
                    }
                }
            })
        },
        methods: {
            open(opt){

                if(opt.state == 1) { //编辑
                    this.title = "编辑职位";
                    this.editForm.id = opt.data.id;
                    this.getDetail(opt.data.id);
                } else {
                    this.editForm = {};
                    this.editForm.parentId = opt.data.id;
                    this.title = "新增职位";

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
            getDetail(id) {
                ajax.get("sys/position/detail/" + id).then( result =>{
                    if(this.checkResponse(result)) {
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
                        url = "sys/position/update";
                    }else{
                        url = "sys/position/insert";
                    }

                    let params = Object.assign({},this.editForm);
                    params.companyId = this.params.companyId;
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
