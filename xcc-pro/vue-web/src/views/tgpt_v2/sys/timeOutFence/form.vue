<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="时间栅栏" name="1">

                    <div class="flex-panel">
                        <el-form-item label="所属组织" >
                            <!--<el-select v-model="addForm.companyId" placeholder="请选择"-->
                                        <!--&gt;-->
                                <!--<el-option-->
                                    <!--v-for="item in organizations"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.name"-->
                                    <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                            <tree-select v-model="organization" placeholder="请选择服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        </el-form-item>

					<el-form-item class="big" label="名称" prop="name">
						<el-input style="width: 20%;" v-model="addForm.name" maxlength=40 placeholder="请输入" clearable></el-input>
					</el-form-item>
                    <el-form-item class="big" label="停止报警时间段" prop="vehicleCount">
                        <el-time-select style="width: 20%;" placeholder="起始时间"
                            v-model="addForm.startTime"
                            :picker-options="{start: '00:00', step: '00:30', end: '24:00' }"
                            @change="changeTime()">
                        </el-time-select>
                        <el-time-select style="width: 20%;" placeholder="结束时间"
                            v-model="addForm.endTime"
                            :picker-options="{ start: '00:00', step: '00:30', end: '24:00', minTime: addForm.startTime }"
                            @change="changeTime()">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item  label="停止时长" prop="stopTime" >
                        <el-select v-model="addForm.stopTime" placeholder="全部" @change="judge" clearable>
                            <el-option label="4小时" :value="4"></el-option>
                            <el-option label="6小时" :value="6"></el-option>
                            <el-option label="8小时" :value="8"></el-option>
                        </el-select>
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
    import $ from 'jquery-slim'

    export default {
        mixins: [tool, ruleTool],
        name: "baseTimeFenceForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            let $this = this;
            return {
                checkList: [],
                activeNames: ['0', '1'],
                organizations:[],
                organization: [],
                addForm: {
                    checkList: [],
                    startTime: '08:00',
                    endTime: '18:00'
                },
                rules: {
                    name: [
                        { required: true, message: '请输入栅栏名称', trigger: 'blur' }
                    ],
                    stopTime: [
                        { required: true, message: '请选择停止时长', trigger: 'blur' },
                        {validator: $this.time, message: '停止时长超出限制', trigger: 'change'}
                    ]
                }
            }
        },
        mounted() {
            // this.getOrganizations();
            this.open();
        },
        methods: {
            changeTime(){
                if(this.addForm.stopTime){
                    this.$refs.addForm.validateField('stopTime')
                }
            },
            time(rule, value, callback) {
                if (this.judge()) {
                    return callback(new Error(rule.message));
                } else {
                    return callback();
                }
            },
            getOrganizations(){  //获取组织数据
                ajax.get("admin/organization/managerCompany").then((res)=>{
                    if(this.checkResponse(res)){
                        this.organizations = res.data;
                        if(this.organizations.length >= 1){
                            this.addForm.companyId=this.organizations[0].id;
                        }
                    }
                });
            },
            changeOrganization(data){
                if(this.organization && this.organization.length==1){
                    //this.addForm.companyId = this.organization[0];
                    this.$set(this.addForm,'companyId',this.organization[0]);
                }else{
                    //this.addForm.companyId = '';
                    this.$set(this.addForm,'',this.organization[0]);
                }
            },
            open() {
                //this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('base/baseTimeOutFence/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        if (rs.data.companyId)
                            this.organization[0] = rs.data.companyId;
                        var time = new Array();
                        time.push(parseInt(rs.data.startTime));
                        time.push(parseInt(rs.data.endTime));
                        this.addForm.time = time;
                    });
                }
            },
            judge(){
                var st ='2018-01-01'+' '+this.addForm.startTime+':00';
                var et ='2018-01-01'+' '+this.addForm.endTime+':00';
                var stDate = new Date(st.replace('-', '/')).getTime();
                var etDate = new Date(et.replace('-', '/')).getTime();
                var differ = etDate - stDate;
                var stopTime = this.addForm.stopTime*3600*1000
                return stopTime>differ
            },
            //保存提交
            submitForm: function (form) {
                var data = {};
                data.id = this.$route.query.id;
                data.companyId = this.addForm.companyId;
                data.name = this.addForm.name;
                data.startTime = this.addForm.startTime;
                data.endTime = this.addForm.endTime;
                data.stopTime = this.addForm.stopTime;
                console.log(data.companyId );
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('base/baseTimeOutFence/', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }
                    });
                });
            },
            contains(needle) {
                for (i in this) {
                    if (this[i] == needle) return true;
                }
                return false;
            }
        }
    }
</script>

