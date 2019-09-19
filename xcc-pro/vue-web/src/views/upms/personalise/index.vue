<template>
    <div class="form-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="个性化" name="1">
                <h4>管理公司</h4>
                <el-select :disabled="userType == 1" v-model="companyId" @change="onChange" clearable filterable placeholder="请选择">
                    <el-option v-for="(item,index) in companys" :key="index"
                                :label="item.name" :value="item.id"></el-option>
                </el-select>
                <editor-cropper @file="onFilePath" :path="path" ref="cropper"></editor-cropper>
            </el-collapse-item>
        </el-collapse>

        <div class="left-row">
            <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
            <el-button type="primary" @click="updateLogo('addForm')">还原logo</el-button>
            <!--<el-button @click="close()">返回</el-button>-->
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'
    import editorCropper from '@/components/EditorCropper/index'
    export default {
        mixins: [tool, ruleTool],
        name: "appDriverMicroCourseForm",
        components: { editorCropper},
        data() {
            return {
                activeNames: ['1'],
                companyId: '',
                /*标题图片*/
                titleImg:[],
                /*附件*/
                //attachmentList:[],
                companys: [],
                userType: 1,
                path: '',
                filePath: ''
            }
        },
        mounted() {
            this.getCompanys();
            this.getLogo();
        },
        methods: {
            getCompanys() {
                ajax.get('admin/organization/managerCompany').then(result => {
                    if (this.checkResponse(result)) {
                        this.companys = result.data;
                    } else {
                        this.companys = [];
                    }
                });
            },
            getLogo() {
                ajax.get('admin/personaliseController/getLogo?company=' + this.companyId).then(result => {
                    if (this.checkResponse(result)) {
                        this.userType = result.data.userType;
                        this.companyId = result.data.company;
                        if(result.data.path){
                            this.path = result.data.path;
                        }else {
                            this.path = "";
                        }
                        console.log(result)
                    }
                });
            },
            updateLogo(){
                var data = {
                    companyId: this.companyId,
                    path: ''
                };
                if(!this.companyId){
                    this.$message({
                        message:'请选择管理公司',
                        type: 'error'
                    });
                    return;
                }
                if(!this.path){
                      this.$message({
                        message:'已经是系统默认LOGO',
                        type: 'error'
                    });
                    return;
                }
                ajax.post('admin/personaliseController/addOrUpdate', data).then(result => {
                    if (this.checkResponse(result)) {
                        this.$store.dispatch('setLogoUrl', '');
                        this.showMessage('保存成功', 'success');
                        this.path = '';
                        this.$refs.cropper.clear()
                        console.log(result)
                    }
                });
            },
            onChange(value){
                if(value){
                    this.companyId = value
                    this.getLogo()
                }else{
                    this.companyId = ''
                }
            },
            onFilePath(value){
                var data = {
                    companyId: this.companyId,
                    path: value
                };
                ajax.post('admin/personaliseController/addOrUpdate', data).then(result => {
                    if (this.checkResponse(result)) {
                        this.path = value
                        if(this.userType == 1){
                            this.$store.dispatch('setLogoUrl', value);
                        }
                        this.showMessage('保存成功', 'success');
                        console.log(result)
                    }
                });
            },
            //保存提交
            submitForm() {
                if(this.companyId){
                    this.$refs.cropper.startCrop()
                }else{
                    this.$message({
                        message:'请选择管理公司',
                        type: 'error'
                    });
                }
            }
        }
    }
</script>

