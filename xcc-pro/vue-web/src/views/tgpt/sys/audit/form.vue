<template>
    <div class="form-panel">
        <el-form :model="workflowConfigForm" label-position="top" ref="workflowConfigForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="流程配置" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="organizationId" :rules="rules.required('请选择所属组织')">
                            <el-select v-model="workflowConfigForm.organizationId" placeholder="请选择"
                                       @change="organizationChangeHandle($event)" >
                                <el-option
                                    v-for="item in organizations"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模块名称" prop="modelId" :rules="rules.required('请选择模块名称')">
                            <el-select v-model="workflowConfigForm.modelId" placeholder="请选择功能模块"
                                       @change="modelChangeHandle($event)">
                                <el-option
                                    v-for="item in menus"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="流程节点" name="2" >
                    <el-table class="left" border :data="workflowConfigForm.details" style="width: 100%">
                        <el-table-column prop="nodeIndex" type="index" label="序号" min-width="120"></el-table-column>
                        <el-table-column prop="positionName" label="节点" min-width="150">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'details.' + $index + '.positionId'" style="width: 250px;"
                                              :rules="rules.required('请选择审批职位')" >
                                    <tree-select v-model="row.positionId" placeholder="请选择审批职位" type="one"
                                                 url="/admin/position/tree" :params="positionTreeParam" @change="updatePosition($event,row)"
                                                 :disabled-empty="true"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="condition" label="条件" min-width="250">
                            <template slot-scope="{row,$index}">
                                <el-form-item style="width: 120px;">
                                    <el-select v-model="row.conditionField" clearable placeholder="请选择">
                                        <el-option
                                            v-for="item in conditionFields"
                                            :key="item.value"
                                            :label="item.text"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item style="width: 120px;">
                                    <el-select v-model="row.conditionType" clearable placeholder="请选择" >
                                        <el-option
                                            v-for="item in conditionTypes"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-input type="text" v-model="row.conditionValue" size="small"
                                              clearable style="width: 180px;"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="province" label="操作" width="120">
                            <template slot-scope="{row,$index}">
                                <el-button @click="addRow($index)" type="text" size="small">增加</el-button>
                                <el-button v-if="workflowConfigForm.details.length>1" @click="delRow($index)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>


            <el-form-item class="left-row">
                <el-button type="primary" @click="save('workflowConfigForm')" :loading="showSaveLoading">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'

    export default {
        mixins: [tool,ruleTool],
        components:{ TreeSelect },
        data(){
            return {
                isCreate:true,
                workflowConfigForm:{
                    details:[
                        {
                            nodeIndex:1,
                            positionId:[],
                            conditionField:"",
                            conditionType:"",
                            conditionValue:""
                        }
                    ]
                },
                organizations:[],
                menus:[],
                positionTreeParam:{
                    managerId:''
                },
                activeNames: ['1', '2'],
                conditionFields:[
                    /*{'label':'金额','value':'amount'}*/
                ],
                conditionTypes:[
                    {label:"大于",value:">"},
                    {label:"大于或等于",value:">="},
                    {label:"等于",value:"="},
                    {label:"小于",value:"<"},
                    {label:"小于或等于",value:"<="}
                ],
                showSaveLoading:false,
                show:false
            }
        },
        mounted(){
            this.getOrganizations();
            this.getModels();
            this.open();
        },
        methods:{
            updatePosition(data,row){
                row.nodeName = data[0].name;
            },
            save(workflowConfigForm){
                this.showSaveLoading = true;
                this.$refs[workflowConfigForm].validate((valid) => {
                    if (valid) {
                        let url = this.isCreate?"workflow/config/save":"workflow/config/update";
                        let params = this.extend(true, {}, this.workflowConfigForm);
                        params.details.forEach(item =>{
                            item.positionId = item.positionId.join();
                        });
                        ajax.post(url, params).then((res)=>{
                            if(this.checkResponse(res)) {
                                this.showSaveLoading = false;
                                this.showMessage(res.message,"success");
                                this.close();
                            }
                        }).catch((error)=>{
                            this.showSaveLoading = false;
                        });
                    } else {
                        this.showSaveLoading = false;
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });
            },
            resetForm(workflowConfigForm) {
                if (this.$refs[workflowConfigForm]) {
                    this.$refs[workflowConfigForm].resetFields();
                }
            },
            addRow(nodeIndex){
                let details = this.workflowConfigForm.details;
                details.splice(nodeIndex+1,0,{
                    positionId:[],
                    conditionField:"",
                    conditionType:"",
                    conditionValue:""
                });
                this.generIndex(details);
                this.$nextTick(_ =>{
                    this.$refs.workflowConfigForm.clearValidate('details.'+(nodeIndex+1)+'positionId');
                })
            },
            delRow(nodeIndex){
                let details = this.workflowConfigForm.details;
                details.splice(nodeIndex,1);
                this.generIndex(details);
            },
            generIndex(details){
                for(var i=0;i<details.length;i++){
                    details[i].nodeIndex = i+1;
                }
                this.workflowConfigForm.details = details;
            },
            info(id){
                ajax.get("workflow/config/info/"+id).then((res)=>{
                    if(this.checkResponse(res)) {
                        res.data.details.forEach(item =>{
                            this.$set(item,"positionId",item.positionId.split(','))
                            // item.positionId = item.positionId.split(',');
                        });
                        this.workflowConfigForm = res.data;
                        this.$set(this.positionTreeParam, 'managerId', res.data.organizationId);
                        this.getConditionFields();
                    }
                });
            },
            organizationChangeHandle(value){
                this.$set(this.positionTreeParam, 'managerId', value);
                this.workflowConfigForm.details = [
                    {
                        nodeIndex:1,
                        positionId:[],
                        conditionField:"",
                        conditionType:"",
                        conditionValue:""
                    }
                ];
            },
            modelChangeHandle(value){
                let menu = this.menus.filter(item => item.id === value)[0];
                this.workflowConfigForm.modelId = value;
                this.workflowConfigForm.modelCode = menu.code;
                this.workflowConfigForm.modelName = menu.name;
                this.workflowConfigForm.details = [
                    {
                        nodeIndex:1,
                        positionId:[],
                        conditionField:"",
                        conditionType:"",
                        conditionValue:""
                    }
                ];
                this.getConditionFields();
                console.log(menu);
            },
            getModels(){         //获取模块数据
                ajax.get("workflow/workflow/getWorkflowMenuList").then((res)=>{
                    if(this.checkResponse(res)){
                        this.menus = res.data;
                    }
                });
            },
            getOrganizations(){  //获取组织数据
                ajax.get("admin/organization/managerCompany").then((res)=>{
                    if(this.checkResponse(res)){
                        this.organizations = res.data;
                    }
                });
            },
            getConditionFields(){//获取条件属性数据
                //字典值
                ajax.get('/admin/dict/type/流程审核-'+this.workflowConfigForm.modelName).then(res => {
                    this.conditionFields = res;
                });
            },
            open(){
                // this.resetForm('workflowConfigForm');
                // this.workflowConfigForm = {
                //     details:[
                //         {
                //             nodeIndex:1,
                //             positionId:[],
                //             conditionField:"",
                //             conditionType:"",
                //             conditionValue:""
                //         }
                //     ]
                // };
                if (this.$route.query.id){
                    this.isCreate = false;
                    this.info(this.$route.query.id);
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    .el-table.left .el-form-item {
        display: inline-block;
        margin-right: 0;
        width: auto;
    }
    .el-table .el-form-item__error--inline {
        margin-left: 0;
        display: block;
        width: 100%;
    }
</style>
