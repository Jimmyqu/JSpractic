<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="考核详情" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">创建人</label>
                        <div class="input-group">
                            <span>{{detailForm.orgName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">发布时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{detailForm.publishStatus == 1 ? '已发布': '未发布'}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">已完成</label>
                        <div class="input-group">
                            <span>{{detailForm.subNum}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="已完成人员" name="2" >
                <el-row :gutter="20">
                    <el-col :span="3" v-for="driver in subDrivers" :key="driver.id">
                        <el-button type="text" @click="toDriverSubDetail(driver)">{{driver.driverName+'('+driver.correctRate+')'}}</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="openCollapse">
            <el-collapse-item title="考题(蓝色为正确答案)" name="3" >
                <h2>{{questionForm.title}}</h2>
                <div v-for="(qs,index) in questionForm.qsList" :key="qs.id">
                    <h3>{{index+1}}.{{qs.name}}({{qs.type == 1 ? '单选':'多选'}})</h3>
                    <el-row :gutter="20">
                        <el-col :span="6" v-for="answer in qs.answerList" :key="answer.id">
                            <span v-bind:class="{ active: answer.rigth }">{{answer.option}}.{{answer.name}}</span>
                        </el-col>
                    </el-row>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div style="margin-left: 20px ; margin-top: 30px">
            <el-button type="primary" size="small" @click="close()">返回</el-button>
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        name: "appDriverExamineTemplateDetail",
        mixins: [tool, ruleTool],
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1" , "2" , "3"],
                show: true,
                /*详情页面*/
                detailForm: {
                },
                /*提交司机数据*/
                subDrivers:[],
                /*题目表单*/
                questionForm:{},
                id: this.$route.params.id,
            }
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
                this.show = true;
            },

            /*跳转司机提交详情页面*/
            toDriverSubDetail(driver){
                this.$router.push({path:'../driversubdetail' , query:{driverId: driver.driverId , templateId: driver.examineTemplateId , name: driver.driverName}});
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

            /*初始化questionForm*/
            assambleQuestionForm(questionForm){
                let qsList = questionForm.qsList;
                let answers = [];
                qsList.forEach(qs => {
                    if(qs.type == 2){
                         answers = qs.answer.split(',');
                    }
                    let answerList = qs.answerList;
                    answerList.forEach((answer , index) => {
                        let result = this.getAnswerOption(index);
                        answer.option = result;
                        if(qs.type == 1){
                            if(result == qs.answer){
                                answer.rigth = true;
                            }
                        }else if(qs.type == 2){
                            if(answers.indexOf(result)>=0){
                                answer.rigth = true;
                            }
                        }
                    });
                });
            }
        },
        mounted() {
            /*获取统计数据*/
            ajax.get('app/appDriverExamineTemplate/count/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
            /*获取已完成人员*/
            ajax.get('app/appDriverExamineSubmit/template/' + this.id,).then(rs => {
                this.subDrivers = rs;
            });
            /*获取考题信息*/
            ajax.get('app/appDriverExamineTemplate/' + this.id,).then(rs => {
                if(rs.status == 0){
                    this.questionForm = rs.data
                    this.assambleQuestionForm(this.questionForm);
                }
            });
        }

    }
</script>
<style>
    .active{
        color: #409EFF;
    }
</style>
