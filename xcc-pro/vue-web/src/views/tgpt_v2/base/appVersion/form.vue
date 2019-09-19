<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="APP版本管理" name="1">
				<div class="flex-panel">

					<el-form-item label="类型" prop="type">
                        <el-select v-model="addForm.type" placeholder="请选择类型">
                            <el-option label="iOS" :value="1" ></el-option>
                            <el-option label="android" :value="2" ></el-option>
                        </el-select>
					</el-form-item>
                    <el-form-item label="渠道版本 " prop="appType">
                        <el-select v-model="addForm.appType" placeholder="请选择渠道版本">
                            <el-option label="车家+" :value="1" ></el-option>
                            <el-option label="国信车家+" :value="2" ></el-option>
                            <el-option label="广电车家+" :value="3" ></el-option>
                            <el-option label="SMQ车家+" :value="4" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本号" prop="version">
                        <el-input v-model="addForm.version"  maxlength=20 placeholder="版本号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="发布日期" prop="publishDate">
                        <el-date-picker v-model="addForm.publishDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择发布日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="更新内容" class="big" prop="content">
                        <el-input type="textarea" v-model="addForm.content" maxlength="500"></el-input>
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
        name: "appVersionForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                activeNames: ['1'],
                addForm: {},
                rules:{
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' },
                    ],
                    appType: [
                        { required: true, message: '请选择渠道版本', trigger: 'change' },
                    ],
                    version: [
                        {  required: true, message: '请输入版本号', trigger: 'blur' }
                    ],
                    content: [
                        {  required: true, message: '请输入更新内容', trigger: 'blur' }
                    ],
                    publishDate: [
                        { required: true, message: '请选择发布日期', trigger: 'change' }
                    ]
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
                    ajax.get('base//appVersion/detail/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                    });
                };
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('base//appVersion/save', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }else{
                            this.$message.error(rs.msg);
                        }
                    });
                });
            }
        }
    }
</script>

