<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="考核模板" name="1">
				<div style="width: 50%">
                    <el-form-item label="标题" prop="title" >
                        <el-input v-model="addForm.title"  maxLength=30 placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <div v-for="(qs,index) in qsList" :key="index">
                        <h3 style="display: inline-block">题目{{index+1}}</h3>
                        <el-button style="color: #F56C6C ; margin-left: 10px" type="text" @click="delQs(index)" >删除</el-button>
                        <el-form-item label="类型" prop="type">
                            <el-radio-group v-model="qs.type">
                                <el-radio  :label="1">单选</el-radio>
                                <el-radio  :label="2">多选</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="问题"
                                      :rules="[
                                  { required: true, message: '请输入题目名称', trigger: 'blur' },
                                ]"
                        >
                            <el-input v-model="qs.name" type="text"
                                         placeholder="请输入" clearable maxLength="100"></el-input>
                        </el-form-item>
                        <el-form-item
                            prop="resource">
                            <div solt="label">
                                <label class="answer-option">选项</label>
                                <el-button type="text" style="margin-left: 10px" @click="addAnswer(qs.answerList)" v-show="qs.answerList.length<7">添加选项</el-button>
                            </div>
                            <el-row :gutter="20">
                                <el-col :span="12" v-for="(answer,index) in qs.answerList" :key="answer.id">
                                    <el-input type="text" v-model="answer.name" maxLength="200">
                                        <template slot="prepend">{{index | getAnswerOption}}</template>
                                        <el-button  slot="append" icon="el-icon-close" @click="delAnswer(qs.answerList ,index)"></el-button>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <el-form-item label="正确答案" v-if="qs.type == 1" required=""
                                      :rules="[
                                  { required: true, message: '请选择正确答案', trigger: 'change' },
                                ]">
                            <el-radio-group v-model="qs.answerOne" >
                                <el-radio :label="index | getAnswerOption" :key="index" v-for="(answer,index) in qs.answerList" >
                                    {{index | getAnswerOption}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="正确答案" v-if="qs.type == 2"
                                      :rules="[
                                  {type: 'array', required: true, message: '请至少选择一个正确答案', trigger: 'change'},
                                ]">
                            <el-checkbox-group v-model="qs.answerTwo" >
                                <el-checkbox :label="index | getAnswerOption" :key="index" v-for="(answer,index) in qs.answerList" >{{index | getAnswerOption}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                    <div>
                        <el-button type="primary" @click="addQs" size="small">新增题目</el-button>
                    </div>
                </div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row" style="margin-top: 20px">
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
        name: "appDriverExamineTemplateForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            return {
                addForm: {},
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                rules:{
                    title: [
                        { required: true, message: '请输入模板名称', trigger: 'blur' },
                        { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
                    ],
                    templateStatus: [
                        { required: true, message: '请选择启用禁用', trigger: 'change' }
                    ],
                    publishStatus: [
                        { required: true, message: '请选择发布状态', trigger: 'change' }
                    ],
                },
                qsList:[
                    {
                        type: 1,
                        name:'',
                        answerList:[
                            {
                                name:'',
                                err:''
                            }
                        ],
                        answerOne:'',
                        answerTwo:[],
                        nameErr:'',
                        answerErr:''
                    }
                ]

            }
        },
        mounted() {
            this.open();
        },

        filters: {
            getAnswerOption: function (value) {
                let result = 'A';
                if(value == 1) {
                    result = 'B'
                }else if(value == 2){
                    result = 'C'
                }else if(value == 3){
                    result = 'D'
                }else if(value == 4){
                    result = 'E'
                }else if(value == 5){
                    result = 'F'
                }else if(value == 6){
                    result = 'G'
                }
                return result;
            }
        },

        methods: {
            open() {
                if (this.$route.query.id) {
                    ajax.get('app/appDriverExamineTemplate/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        this.qsList =  this.dataInit(rs.data.qsList);
                });
                }
            },

            /*格式化数据*/
            dataInit(qsList){
                qsList.forEach(qs => {
                    if(qs.type == 1){
                        this.$set(qs,"answerOne",qs.answer);
                    }else if(qs.type == 2){
                        this.$set(qs,"answerTwo",qs.answer.split(','));
                        //qs.answerTwo = qs.answer.split(',');
                    }
                });
                return qsList;
            },

            /*根据选项返回答案*/
            getAnswerOption(value){
                let result = 'A';
                if(value == 1) {
                    result = 'B'
                }else if(value == 2){
                    result = 'C'
                }else if(value == 3){
                    result = 'D'
                }else if(value == 4){
                    result = 'E'
                }else if(value == 5){
                    result = 'F'
                }else if(value == 6){
                    result = 'G'
                }
                return result;
            },

            /*添加答案*/
            addAnswer(answerList){
                //最多添加7个
                if(answerList.length>=7){
                    this.showMessage('最多只能添加7个选项哦');
                }
                let answer = {name:''};
                answerList.push(answer);
            },

            /*删除选项*/
            delAnswer(answerList , index){
                answerList.splice(index , 1);
            },

            /*添加题目*/
            addQs(){
                let qs = {
                    type: 1,
                    name:'',
                    answerList:[
                        {
                            name:'',
                            err:''
                        }
                    ],
                    answerOne:'',
                    answerTwo:[],
                    nameErr:'',
                    answerErr:''
                };
                this.qsList.push(qs);
            },
            /*删除题目*/
            delQs(index){
                this.qsList.splice(index , 1);
            },

            /*表单验证,并构造提交数据*/
            validForm(){
                let qsList = this.addForm.qsList;
                let qsList_ = [];
                let flag = true;
                qsList.forEach(qs => {
                    let qs_ = {};
                    qs_.type = qs.type;
                    /*校验题目名称*/
                    if(qs.name ){
                        qs_.name = qs.name;
                    }else{
                        flag = false;
                    }
                    /*校验题目答案*/
                    if(qs.type == 1){
                        /*单选题*/
                        if(qs.answerOne!=''){
                            qs_.answer = qs.answerOne;
                        }else {
                            flag = false;
                        }
                    }else if(qs.type == 2){
                        /*多选题*/
                        if(qs.answerTwo && qs.answerTwo.length > 0){
                            qs_.answer = qs.answerTwo.join(',');
                        }else {
                            flag = false;
                        }
                    }
                    /*校验题目选项*/
                    let answerList = qs.answerList;
                    let answerList_ = [];
                    answerList.forEach(answer => {
                        let answer_ = {};
                        if(answer.name){
                            answer_.name = answer.name;
                        }else{
                            answer.err = '选项名称必填';
                            flag = false;
                        }
                        answerList_.push(answer_);
                    });
                    qs_.answerList = answerList_;
                    qsList_.push(qs_);
                });
                if(flag){
                    this.addForm.qsList = qsList_;
                }
                return flag;
            },

            //保存提交
            submitForm: function (form) {
                this.$refs[form].validate((valid) => {
                    if(valid){
                        this.addForm.qsList = this.qsList;
                        if(this.validForm()){
                            let data = this.addForm;
                            ajax.post('app/appDriverExamineTemplate/question', data).then(rs => {
                                if (rs.status == 0) {
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.close();
                                }
                            });
                        }else{
                            this.$message({
                                message: '请填写完整表单',
                                type:'error'
                            });
                        }
                    }
                });

            }
        }
    }
</script>
<style>
    .answer-option :before{
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        float: right;
    }
</style>

