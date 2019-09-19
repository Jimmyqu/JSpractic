<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="考题(蓝色为正确答案)" name="3" >
                <h2>{{title}}</h2>
                <p>
                    <span>答题人: {{name}}</span>
                    <span style="margin-left: 10px">答题时间: {{data.examineTime}}</span>
                    <span style="margin-left: 10px">成绩:（{{data.correctRate}}）</span>
                </p>
                <div v-for="(qs,index) in qsList" :key="qs.id">
                    <h3>{{index+1}}.{{qs.name}}({{qs.type == 1 ? '单选':'多选'}})</h3>
                    <div v-if="qs.type == 1">
                        <el-radio-group v-model="qs.driverAnswer" :disabled="true">
                            <el-radio :label="answer.option" v-for="answer in qs.answerList" :key="answer.id">
                                <span v-bind:class="{ active: answer.rigth }">{{answer.option}}.{{answer.name}}</span>
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <div v-if="qs.type == 2">
                        <el-checkbox-group  :disabled="true" v-model="qs.driverAnswer">
                            <el-checkbox :label="answer.option"  v-for="answer in qs.answerList" :key="answer.id" >
                                <span v-bind:class="{ active: answer.rigth }">{{answer.option}}.{{answer.name}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                        <!--<el-checkbox-group v-model="qs.driverAnswer" :disabled="true">
                            <el-checkbox :label="answer.option" v-for="answer in qs.answerList" :key="answer.id">
                                <span v-bind:class="{ active: answer.rigth }">{{answer.option}}.{{answer.name}}</span>
                            </el-checkbox>
                        </el-checkbox-group>-->
                    </div>
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
    import {tool, ruleTool} from '@/utils/common'
    export default {
        name: "driverSubDetail",
        mixins: [tool, ruleTool],
        data() {
            return {
                openCollapse: ["1" , "2" , "3"],
                show: true,
                questionForm:{},
                driverId: this.$route.query.driverId,
                templateId: this.$route.query.templateId,
                name: this.$route.query.name,
                data:{},
                title:'',
                qsList: []
            }
        },

        methods: {
            /*数据初始化*/
            dataInit(){
                let url = `app/appDriverExamineSubmit/detail?driverId=${this.driverId}&templateId=${this.templateId}`
                ajax.get(url).then(res => {
                    this.assambleData(res);
                })
            },

            /*返回*/
            close(){
                window.history.go(-1);
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

            /*组装数据*/
            assambleData(data){
                this.title = data.templateQuestion.title;
                let qsList = data.templateQuestion.qsList;
                let driverAnswerList = data.driverAnswerList;
                let answers = [];
                qsList.forEach(
                    qs => {
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
                        let driverAnswer = driverAnswerList.find(answer => answer.topicId == qs.id);
                        if(qs.type == 2){
                            qs.driverAnswer = driverAnswer.answer.split(',');
                        }else if(qs.type == 1){
                            qs.driverAnswer = driverAnswer.answer
                        }
                    }
                )
                this.data = data;
                this.qsList = data.templateQuestion.qsList;
                console.log(this.qsList);
            }
        },

        mounted() {
            this.dataInit();
        },
    }

</script>

<style scoped>
    .active{
        color: #409EFF;
    }
</style>
