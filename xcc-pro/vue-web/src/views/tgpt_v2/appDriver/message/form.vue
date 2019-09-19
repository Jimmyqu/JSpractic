<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="消息表" name="1">
				<div class="flex-panel">

                    <el-form-item label="所属组织">
                        <tree-select v-model="organizationIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"></tree-select>
                    </el-form-item>

					<el-form-item label="标题" prop="title">
						<el-input v-model="addForm.title"  maxlength=200 placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="消息内容" prop="content" class = "big">
                        <el-input type="textarea" v-model="addForm.content" maxlength="450" placeholder="请输入消息内容" :rows="4"></el-input>
					</el-form-item>
				</div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "appDriverMessageForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['0', '1'],
                addForm: {},
                organizationIds:[],
                rules:{
                    title: [
                        { required: true, message: '请输入标题', trigger:'change'},
                    ],
                    content: [
                        { required: true, message: '请输入内容', trigger:'change'},
                    ],
                }
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('app/appDriverMessage/detail/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        if(this.addForm.organizationId){
                            this.organizationIds=[this.addForm.organizationId];
                        }
                    });
                }
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    if(this.organizationIds){
                        this.addForm.organizationId=this.organizationIds[0];
                    }else{
                        this.$message.error('校验不通过，请选择组织');
                        return;
                    }
                    ajax.post('app/appDriverMessage/save', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }
                    });
                });
            }
        }
    }
</script>

