<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="用车申请" name="1">
				<div class="flex-panel">
					<!--<el-form-item label="申请单号" prop="applicationNo" v-if="id">
						<el-input v-model="addForm.applicationNo"  maxlength=36 placeholder="请输入" readonly=""></el-input>
					</el-form-item>-->
                    <el-form-item label="所属组织" prop="organizationId">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </el-form-item>
					<el-form-item label="用车类型" prop="type">
                        <el-select v-model="addForm.type">
                            <el-option label="自驾" :value="1"></el-option>
                            <el-option label="配驾" :value="2"></el-option>
                        </el-select>
					</el-form-item>
					<el-form-item label="用车人" prop="user">
						<el-input v-model="addForm.user"  maxlength="36" placeholder="请输入" clearable></el-input>
					</el-form-item>
                    <el-form-item label="用车人手机号" prop="phone">
                        <el-input v-model="addForm.phone" type="number"  maxlength="11" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="同行人员" prop="peerUser">
                        <el-input v-model="addForm.peerUser"  maxlength="36" placeholder="请输入" clearable></el-input>
                    </el-form-item>

					<el-form-item label="座位数" prop="seateNum">
                        <el-input v-model="addForm.seateNum"  maxlength="36" placeholder="请输入座位数" clearable></el-input>
					</el-form-item>
					<el-form-item label="用车开始时间" prop="useTimeStart">
						<el-date-picker type="datetime" v-model="addForm.useTimeStart"  format="yyyy-MM-dd HH:mm" placeholder="请选择" value-format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
					</el-form-item>
					<el-form-item label="用车结束时间" prop="useTimeEnd">
						<el-date-picker type="datetime" v-model="addForm.useTimeEnd" format="yyyy-MM-dd HH:mm"  placeholder="请选择" value-format="yyyy-MM-dd HH:mm" :editable="false"></el-date-picker>
					</el-form-item>
					<el-form-item label="用车事由" prop="reason">
						<el-input v-model="addForm.reason"  maxlength="50" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="出发地址" prop="depAddress">
						<el-input v-model="addForm.depAddress"  maxlength="50" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="抵达地址" prop="arrAddress">
						<el-input v-model="addForm.arrAddress"  maxlength="50" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="remark">
						<el-input v-model="addForm.remark"  maxlength="100" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="是否需要审批人" prop="needApprover">
                        <el-select v-model="addForm.needApprover">
                            <el-option label="否" :value="0"></el-option>
                            <el-option label="是" :value="1"></el-option>
                        </el-select>
					</el-form-item>

                    <el-form-item label="审批人" prop="approvers" v-if="addForm.needApprover">
                        <el-select v-model="addForm.approvers" multiple placeholder="请选择" filterable>
                            <el-option
                                v-for="item in approverList"
                                :key="item.userId"
                                :label="item.name"
                                :value="item.userId">
                            </el-option>
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

    export default {
        mixins: [tool, ruleTool],
        name: "clientVehicleApplicationForm",
        components: {TreeSelect, CitySelect, MoneyInput},
        data() {
            let $this = this;
            return {
                state:false,
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                addForm: {},
                id: this.$route.query.id,
                organization:[],
                dialogTableVisibleApprover: false,
                approverList: [],
                /*endOption  :{
                    disabledDate(time) {
                        if($this.addForm.useTimeStart){
                            return new Date($this.addForm.useTimeStart).getTime() + 60*60*1000 > time.getTime();
                        }else{
                            return false;
                        }
                    },
                    minTime: $this.addForm.useTimeStart
                },*/
                rules: {
                    organizationId: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '请选择用车类型', trigger: 'change'}
                    ],
                    user: [
                        {required: true, message: '请输入用车人', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '请输入用车人手机号', trigger: 'change'},
                        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号码格式错误', trigger: ['blur', 'change']}
                    ],
                    peerUser: [
                        {required: true, message: '请输入用同行人员', trigger: 'change'}
                    ],
                    seateNum: [
                        {required: true, message: '请输入座位数', trigger: 'change'}
                    ],
                    useTimeStart: [
                        {required: true, message: '请选择用车时间', trigger: 'change'}
                    ],
                    useTimeEnd: [
                        {required: true, message: '请选择用车结束时间', trigger: 'change'}
                    ],
                    reason: [
                        {required: true, message: '请输入用车原因', trigger: 'change'}
                    ],
                    depAddress: [
                        {required: true, message: '请输入用车开始地点', trigger: 'change'}
                    ],
                    arrAddress: [
                        {required: true, message: '请输入用车结束地点', trigger: 'change'}
                    ],
                    needApprover:[
                        {required: true, message: '请选择是否需要审批人', trigger: 'change'}
                    ],
                    approvers:[
                        {required: true, message: '请选择审批人', trigger: 'change'}
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
                if (this.id) {
                    ajax.get('core/clientVehicleApplication/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        this.organization.push(rs.data.organizationId);
                    });
                }
                this.getUsers();
            },

            /*选择组织*/
            changeOrganization(){
                if(this.organization && this.organization.length){
                    this.$set(this.addForm,'organizationId',this.organization[0])
                }else{
                    this.$set(this.addForm,'organizationId','')
                }
            },

            getUsers(){
              ajax.get('admin/user/listByCompanyId').then(res => {
                if(res && res.length){
                    this.approverList = res;
                }
              })
            },


            //保存提交
            submitForm: function (form) {
                var data = this.addForm;

                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    if(this.state) {
                        return;
                    }
                    this.state = true;
                    ajax.post('core/clientVehicleApplication/', data).then(rs => {
                        this.state = false;
                        if (rs.status == 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.close();
                        }else{
                            this.$message.error(rs.msg);
                        }

                    }).catch(_=>{
                        this.state = false;
                    });
                });
            }
        }
    }
</script>

