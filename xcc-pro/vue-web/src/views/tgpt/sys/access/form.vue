<template>
    <div class="form-panel">
        <el-form :model="ruleForm" label-position="top" ref="ruleForm" label-width="100px">
            <el-collapse>
                <!--合同条款-->
                <el-form-item label="业务模块" prop="businessModule" :rules="rules.required('请选择业务模块')" class="big">
                    <el-select  v-model="ruleForm.businessModule" multiple style="width:500px;">
                        <el-option v-for="item in businessModuleList" :key="item.value"
                                   :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="组织" prop="originateDeptId" :rules="rules.required('请选择组织')" class="big">
                    <tree-select v-model="ruleForm.originateDeptId" placeholder="请选择" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeArrayItem"></tree-select>
                </el-form-item>
                <div class="flex-panel">
                    <el-form-item label="被交接人" prop="removeUserId"  :rules="rules.required('请选择被交接人')">
                        <el-select  v-model="ruleForm.removeUserId"  >
                            <el-option @click.native ="changeRemoveUser()" v-for="item in removeUserList"
                                       :key="item.userId" :label="item.name" :value="item.userId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="接受人" prop="accessUserId"  :rules="rules.required('请选择交接人')" >
                        <el-select  v-model="ruleForm.accessUserId"  >
                            <el-option
                                v-for="item in accessUserList"
                                v-if="item.userId != ruleForm.removeUserId"
                                :key="item.userId"
                                :label="item.name"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

            </el-collapse>

            <el-form-item class="left-row">
                <el-button type="primary"  @click="dataAccess()">提交</el-button>
                <!-- <el-button @click="close()">取消</el-button>-->
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'

    export default {
        name:'sysAccess',
        mixins: [tool,ruleTool],
        components:{ TreeSelect },
        data(){
            return {
                ruleForm:{
                    businessModule:[],
                    removeUserId:'',
                    accessUserId:'',
                },
                dataAccessBtn:this.getCurrentUserAuthority("dataAccess/dataAccess"),
                businessModuleList: [],
                orgSelectId: [],
                removeUserList: [],
                accessUserList: [],
            }
        },
        mounted() {
            //字典值
            ajax.get('/admin/dict/type/数据交接').then(rs => {
                this.businessModuleList = rs;
                this.$refs.ruleForm.clearValidate();
            });

        },
        methods: {
            //更新选择的组织
            changeArrayItem(data){
                if (!data || data.length == 0){
                    return;
                }
                this.$set(this.ruleForm, "originateDeptName", data[0].name);
                this.$set(this.ruleForm, "organizationId", data[0].id);
                this.removeUserList = [];
                this.accessUserList = [];
                //获取该组织下的用户列表
                ajax.get('/admin/user/company/'+data[0].id).then(rs => {
                    this.removeUserList = rs.data;
                    this.accessUserList = rs.data;
                    this.$set(this.ruleForm, "removeUserId", "");
                    this.$set(this.ruleForm, "accessUserId", "");
                    this.$refs.ruleForm.clearValidate(['removeUserId','accessUserId']);
                    /*this.$nextTick(_ =>{
                        this.$refs.ruleForm.clearValidate(['removeUserId','accessUserId']);
                    })*/
                });
            },
            changeRemoveUser(item){
                this.$set(this.ruleForm, "accessUserId", "");
            },
            dataAccess() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('是否确定移交数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let params = Object.assign({}, this.ruleForm);
                            params.originateDeptId = params.originateDeptId.join();
                            ajax.post("base/dataAccess/dataAccess", params).then((res) => {
                                if(this.checkResponse(res)){
                                    this.showMessage('操作成功！ 更新数据：'+res.data+'条', 'success');
                                }
                            })
                        }).catch(() => {
                        });

                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });


            },
        }
    }
</script>
<style scoped lang="scss">
.form-panel {
    padding: 20px;
    .left-row {
        padding-left: 0;
        padding-top: 10px;
        padding-bottom: 0;
    }
    .tree-select-panel /deep/ .el-select{
        width: 500px;
    }
    /deep/ .el-input--suffix .el-input__inner {
        height: 34px !important;
    }
    .flex-panel {
        .el-form-item {
            width: 240px;
        }
    }
}
</style>
