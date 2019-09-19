<template>
    <el-dialog title="修改密码" :visible.sync="formShow" :close-on-click-modal="false" :append-to-body="true" width="500px">
        <el-form :model="formData" label-position="top" ref="modelForm" :rules="formRules">
            <el-form-item label="旧密码" prop="oldpwd">
                <el-input type="password" v-model="formData.oldpwd" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpwd1">
                <el-input type="password" v-model="formData.newpwd1" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="newpwd2">
                <el-input type="password" v-model="formData.newpwd2" placeholder="请输入确认新密码"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formShow = false">关 闭</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import ajax from '@/utils/request'
    import { tool, ruleTool } from '@/utils/common'
    export default {
        name: "updPassword",
        mixins:[tool, ruleTool],
        data(){
            return {
                formShow:false,
                formData:{},
                formRules: {
                    oldpwd: [
                        {required: true, message: '请输入旧密码', trigger: 'change'},
                        {min: 6, message: '长度在 6 个字符以上', trigger: 'change'}
                    ],
                    newpwd1: [
                        {required: true, message: '请输入新密码', trigger: 'change'},
                        {min: 6, message: '长度在 6 个字符以上', trigger: 'change'}
                    ],
                    newpwd2: [
                        {required: true, message: '请输入确认新密码', trigger: 'change'},
                        {min: 6, message: '长度在 6 个字符以上', trigger: 'change'}
                    ]
                },
            }
        },
        mounted(){},
        methods:{
            open(){
                this.formShow = true;
                this.formData = {};
                this.$nextTick(_ =>{
                    this.$refs.modelForm.clearValidate();
                })
            },
            submitForm(){
                this.$refs.modelForm.validate(state => {
                    if (state) {
                        if (this.formData.newpwd1 != this.formData.newpwd2) {
                            this.showMessage("2次输入的新密码不一致，请确认");
                            return;
                        }
                        let data = {
                            oldPwd: this.formData.oldpwd,
                            newPwd: this.formData.newpwd1
                        };
                        ajax.post('admin/user/editPwd', data).then(res => {
                            if (res.status == 0) {
                                this.showMessage("密码修改成功,请重新登录", "success");
                                setTimeout(() => {
                                    this.$store.dispatch('LogOut').then(() => {
                                        location.reload() // 为了重新实例化vue-router对象 避免bug
                                    })
                                }, 1000);
                            }
                            else {
                                this.showMessage(res.message);
                            }
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped lang="sass">

</style>
