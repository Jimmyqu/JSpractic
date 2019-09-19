<template>
    <div class="form-panel">
        <el-form :model="scheduleForm" :rules="rules" label-position="top" ref="scheduleForm" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="任务信息" name="1">
                    <div class="flex-panel box4">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="任务时间" prop="assignmentTime">
                            <!-- <el-date-picker v-model="scheduleForm.assignmentTime" clearable type="datetime"
                                            format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"
                                            placeholder="请选择乘客出发时间"></el-date-picker> -->
                                            <DateTimePick v-model="scheduleForm.assignmentTime" @change="changeAssignmentTime" />
                        </el-form-item>
                        <el-form-item label="任务起点" prop="depAddress">
                            <!-- <amap-address-select id="depAddress" v-model="scheduleForm.depAddress" :disabled="false"
                                                 placeholder="请输入任务起点" @change="changeAddress"
                                                 maxlength="50"/> -->
                            <el-input ref="depAddress" v-model="scheduleForm.depAddress" @focus="changeVisible('depAddress')" placeholder="请选择任务起点"></el-input>
                        </el-form-item>
                        <el-form-item label="任务终点" prop="desAddress">
                            <!-- <amap-address-select id="desAddress" v-model="scheduleForm.desAddress" :disabled="false"
                                                 placeholder="请输入任务终点" @change="changeAddress"
                                                 maxlength="50"/> -->
                            <el-input ref="desAddress" v-model="scheduleForm.desAddress" @focus="changeVisible('desAddress')" placeholder="请选择任务起点"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contacterName">
                            <el-input clearable maxlength="20" v-model="scheduleForm.contacterName"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="contacterPhone">
                            <el-input clearable maxlength="11" v-model="scheduleForm.contacterPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="用车人数" prop="passengerNum">
                            <el-input-number v-model="scheduleForm.passengerNum" :min="1" :max="99"></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" maxlength="200" v-model="scheduleForm.remark"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>


            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('scheduleForm')" :loading="addLoading">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>
        <AddressPicker v-model="address" :visible.sync="visible" :id="id" @change="changeAddress"></AddressPicker>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import AmapAddressSelect from '@/components/AmapAddressSelect/index'
    import AddressPicker from '@/components/AddressPicker/index'
    import DateTimePick from '@/components/DateTimePick/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        name: "assignmentManagementForm",
        mixins: [tool, ruleTool],
        components: {TreeSelect, AmapAddressSelect,DateTimePick,AddressPicker},
        data: function () {
            return {
                organization: [],
                addLoading: false,
                scheduleForm: {passengerNum: 1},
                activeNames: ['1', '2'],
                rules: {
                    companyId: [
                        {required: true, message: '请选择所属公司', trigger: 'change'}
                    ],
                    contacterName: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    contacterPhone: [
                        {required: true, message: '请输入联系人电话', trigger: 'blur'},
                        {validator: formRule.isMobilePhone, message: "手机号码格式有误", trigger: "blur"}
                    ],
                    passengerNum: [
                        {required: true, message: '请输入用车人数', trigger: 'blur'}
                    ],
                    assignmentTime: [
                        {required: true, message: '请选择任务时间', trigger: 'change'}
                    ],
                    depAddress: [
                        {required: true, message: '请选择任务起点', trigger: 'change'}
                    ],
                    desAddress: [
                        {required: true, message: '请选择任务终点', trigger: 'change'}
                    ],
                },
                visible:false,
                id:'',
                address:''
            }
        },
        mounted: function () {//载入后
            this.open();
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            changeVisible(key){
                this.id = key;
                this.address = this.scheduleForm[key];
                this.visible = true;
                this.$refs.depAddress.blur();
                this.$refs.desAddress.blur();
            },
            //自定义方法
            open() {
                var $this = this;
                if (this.$route.query.id) {
                    ajax.get('operation_core/assignment/detail/' + this.$route.query.id).then(
                        res => {
                            if (res.status == 0 && res.data != null) {
                                $this.organization.push(res.data.companyId);
                                $this.scheduleForm = res.data;
                                $this.scheduleForm.isRecordOrder = 2
                            }
                        }
                    )
                }
            },

            changeAssignmentTime(value){
                if(value){
                    this.$set(this.scheduleForm,'assignmentTime',value)
                }else{
                    this.$set(this.scheduleForm,'assignmentTime','')
                }
            },

            submitForm(schedultForm) {
                var $this = this;
                this.addLoading = true;
                $this.$refs[schedultForm].validate((valid) => {
                    if (valid) {
                        var url = "/operation_core/assignment/save";
                        ajax.post(url, $this.scheduleForm).then(
                            res => {
                                if (res.status == 0) {
                                    $this.showMessage("操作成功", "success");
                                    $this.close();
                                    window.setTimeout(() => {
                                        this.addLoading = false;
                                    }, 2000)
                                } else {
                                    $this.$message.error(res.message);
                                    this.addLoading = false;
                                }
                            },()=>{
                                this.addLoading = false;
                            }
                        )
                    } else {
                        this.addLoading = false;
                        return false;
                    }
                });
            },
            changeAddress(item, key) {
                if (key === 'depAddress' && item.location) {
                    this.$set(this.scheduleForm, 'depLon', item.location.lng);
                    this.$set(this.scheduleForm, 'depLat', item.location.lat);
                } else if (key === 'desAddress' && item.location) {
                    this.$set(this.scheduleForm, 'desLon', item.location.lng);
                    this.$set(this.scheduleForm, 'desLat', item.location.lat);
                } else {
                    if (key === 'desAddress') {
                        this.$set(this.scheduleForm, 'desLon', '');
                        this.$set(this.scheduleForm, 'desLat', '');
                    } else if (key === 'depAddress') {
                        this.$set(this.scheduleForm, 'depLon', '');
                        this.$set(this.scheduleForm, 'depLat', '');
                    }
                }
                this.$set(this.scheduleForm, key, item.address);
            },

            changeOrganization(data) {
                if (data && data.length == 1) {
                    this.$set(this.scheduleForm, 'companyId', data[0].id);
                } else {
                    this.organization = [];
                }
            },
        }
    }
</script>
