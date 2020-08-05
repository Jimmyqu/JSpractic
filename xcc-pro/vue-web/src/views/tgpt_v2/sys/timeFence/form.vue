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
                    <el-form-item class="big" label="允许时间段" prop="vehicleCount">
                        <el-time-select style="width: 20%;" placeholder="起始时间"
                            v-model="addForm.startTime"
                            :picker-options="{start: '00:00', step: '00:30', end: '24:00' }">
                        </el-time-select>
                        <el-time-select style="width: 20%;" placeholder="结束时间"
                            v-model="addForm.endTime"
                            :picker-options="{ start: '00:00', step: '00:30', end: '24:00', minTime: addForm.startTime }">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item class="big" label="重复周期" prop="checkList" >
                        <el-checkbox-group v-model="addForm.checkList">
                            <el-checkbox label="周日"></el-checkbox>
                            <el-checkbox label="周一"></el-checkbox>
                            <el-checkbox label="周二"></el-checkbox>
                            <el-checkbox label="周三"></el-checkbox>
                            <el-checkbox label="周四"></el-checkbox>
                            <el-checkbox label="周五"></el-checkbox>
                            <el-checkbox label="周六"></el-checkbox>
                        </el-checkbox-group>
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
                    checkList: [
                        { required: true, message: '请选择重复周期', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            // this.getOrganizations();
            this.open();
        },
        methods: {
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
                    ajax.get('base//baseTimeFence/' + this.$route.query.id).then(rs => {
                        rs.data.checkList = rs.data.cycle.split(",");
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
            //保存提交
            submitForm: function (form) {
                var data = {};
                data.id = this.$route.query.id;
                data.companyId = this.addForm.companyId;
                data.name = this.addForm.name;
                data.startTime = this.addForm.startTime;
                data.endTime = this.addForm.endTime;

                //data.startTime = this.addForm.time[0];
                //data.endTime = this.addForm.time[1];
                if(this.addForm.checkList.length == 7){
                    data.cycleText = "每天";
                }else if(this.addForm.checkList.length == 5 && this.addForm.checkList.indexOf("周日") < 0 && this.addForm.checkList.indexOf("周六") < 0){
                    data.cycleText = "周一至周五(工作日)";
                }else {
                    data.cycleText = this.addForm.checkList.toString();
                }
                data.cycle = this.addForm.checkList.toString();

                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    ajax.post('base//baseTimeFence/', data).then(rs => {
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

