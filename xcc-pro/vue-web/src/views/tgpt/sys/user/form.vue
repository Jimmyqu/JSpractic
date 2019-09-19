<template>
    <div class="form-panel">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-position="top" label-width="100px"
                 :class="{'register-form': true}">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基本信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="userForm.phone" placeholder="请输入手机号"
                                      @input="phoneInputHandler"></el-input>
                        </el-form-item>

                        <el-form-item label="用户名" prop="account">
                            <el-input v-model="userForm.account" placeholder="请输入用户名"
                                      :class="{'s-input-un': true, sync: syncPhone}" :readonly="syncPhone"></el-input>
                            <el-checkbox v-model="syncPhone" @change="syncBoxChange" :class="{'s-box-un': true}">同手机号
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item label="密码" prop="password" v-if="showPwd">
                            <el-input type="password" v-model="userForm.password"
                                      placeholder="请输入密码，6~14位" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="确认密码" prop="passwordConfirm" v-if="showPwd">
                            <el-input type="password" v-model="userForm.passwordConfirm"
                                      placeholder="请再次输入密码" autocomplete="off"></el-input>
                        </el-form-item>


                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>

                        <el-form-item label="微信号" prop="wechat">
                            <el-input v-model="userForm.wechat" placeholder="请输入微信号"></el-input>
                        </el-form-item>
                        <el-form-item label="其他信息" prop="remark">
                            <el-input v-model="userForm.remark" placeholder="请输入其他信息"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="权限信息" name="2">
                    <div class="flex-panel">
                        <el-form-item label="组织" required>
                            <div :class="{'multi-select-wrap': organizations.length > 1}">
                                <div class="m-s-item" v-for="(organ, index) in organizations" :key="organ.index">
                                    <tree-select v-model="organ.arrayId" placeholder="请选择" type="one"
                                                 @change="changeArrayItem($event, organ, index)"
                                                 :disabled-id="['1']" url="admin/organization/tree"></tree-select>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="角色" required>
                            <div :class="{'multi-select-wrap': roles.length > 1}">
                                <div class="m-s-item" v-for="(role, index) in roles">
                                    <tree-select v-model="role.arrayId" placeholder="请选择" type="one"
                                                 @change="changeArrayItem($event, role)" :disabled-id="['1']"
                                                 :url="'sys/user/role_tree?companyId=' + (treeCompanyId[index]?treeCompanyId[index]:'')"></tree-select>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="职位" required>
                            <div class="multi-select-wrap">
                                <div class="m-s-item small" v-for="(pos, index) in positions">
                                    <tree-select v-model="pos.arrayId" placeholder="请选择" type="one"
                                                 @change="changeArrayItem($event, pos)" :disabled-id="['1']"
                                                 :url="'sys/user/pos_tree?companyId=' + (treeCompanyId[index]?treeCompanyId[index]:'')"></tree-select>

                                    <el-tooltip v-if="index > 0" class="item" content="删除"
                                                placement="right" effect="light">
                                        <i class="el-icon-minus minus" @click="minusItem(index)"
                                           onselectstart="return false;"></i>
                                    </el-tooltip>
                                    <el-tooltip v-if="index == 0" class="item" content="添加"
                                                placement="top" effect="light">
                                        <i class="el-icon-plus plus" @click="plusItem()"
                                           onselectstart="return false;"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                        </el-form-item>

                        <hr>


                        <el-form-item label="用户状态">
                            <el-radio v-model="userForm.userStatus" label="1">正常</el-radio>
                            <el-radio v-model="userForm.userStatus" label="0">停用</el-radio>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
                <el-button @click="close">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool } from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        mixins: [ tool, ruleTool ],
        components:{ TreeSelect },
        data() {

            var checkPwdConfirm = (rule, v, callback) => {
                if (v != this.userForm.password) {
                    callback(new Error('2次密码输入不一致'));
                }
                else
                    callback();
            };
            return {
                userForm: {
                    account: '',
                    phone: '',
                    email: '',
                    wechat: '',
                    userType: '1',
                    userStatus: '1',
                    remark: '',
                    password: ''
                },
                openCollapse: ["1", "2"],//默认打开的面板
                show: false,//编辑页显示状态
                syncPhone: false,
                organizations: [{}],
                roles: [{}],
                positions: [{}],
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: ['blur', 'change']},
                        {max: 20, message: '姓名不能超过20字符', trigger: ['blur', 'change']}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: ['blur', 'change']},
                        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号码格式错误', trigger: ['blur', 'change']}
                    ],
                    account: [
                        {required: true, message: '请输入用户名', trigger: ['blur', 'change']},
                        {max: 20, message: '用户名不能超过20个字符', trigger: ['blur', 'change']},
                        {pattern: /^[a-zA-Z0-9]+$/, message: '只能输入数字和字母', trigger: ['blur', 'change']}
                    ],
                    email: [
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']},
                        {max: 50, message: '邮箱不能超过50个字符', trigger: ['blur', 'change']}
                    ],
                    wechat: [
                        {min: 6, max: 20, message: '微信号长度在 6 到 20 个字符', trigger: ['blur', 'change']}
                    ],
                    remark: [
                        {max: 50, message: '备注不能超过50个字符', trigger: ['blur', 'change']}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: ['blur', 'change']},
                        {min: 6, max: 14, message: '长度必须是6~14位', trigger: ['blur', 'change']}
                    ],
                    passwordConfirm: [
                        {required: true, message: '请再次输入密码', trigger: ['blur', 'change']},
                        {validator: checkPwdConfirm, trigger: ['blur', 'change']}
                    ]
                },
                showPwd: false,
                posUrlArray: [],
                treeCompanyId: {}
            }
        },
        methods: {
            //进入编辑页调用 bean为列表页传入数据
            open(bean) {
                this.openCollapse = ["1", "2"];
                this.show = true;

                if (!bean || !bean.id) {
                    this.showPwd = true;
                    this.userForm.password = '';
                    return;
                }
                this.showPwd = false;
                ajax.get('/sys/user/findOne', {id: bean.id}).then(rs => {
                    rs.data.userType += '';
                    rs.data.userStatus += '';
                    this.userForm = rs.data;
                });

                //加载用户的权限信息
                ajax.get('/sys/user/queryAuth', {id: bean.id}).then(rs => {
                    this.$nextTick(_ =>{
                        this.setAuthArrays(rs.data);
                    });
                });
            },
            submitForm(form) {
                var that = this;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.organizations[0].array) {
                            that.$message.error('请选择组织');
                            return;
                        }

                        if (!this.roles[0].array) {
                            that.$message.error('请选择角色');
                            return;
                        }

                        if (!this.positions[0].array) {
                            that.$message.error('请选择职位');
                            return;
                        }

                        var data = Object.assign(this.userForm, {
                            organizationsJson: JSON.stringify(this.organizations),
                            positionsJson: JSON.stringify(this.positions),
                            rolesJson: JSON.stringify(this.roles)
                        });

                        ajax.post('/sys/user/save', data).then(rs => {
                            if (rs.status == 0) {
                                that.$message({message: '保存成功！', type: 'success'});
                                that.close();
                                that.$emit('load');
                            } else {
                                that.$message.error(rs.message);
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            changeArrayItem(data, oldData, index) {
                //debugger
                var flag = !this.getCurrentUserInfo()['managementCompanyId'];
                if (!data || data.length == 0) {
                    if (null != index && flag)
                        this.$set(this.treeCompanyId, index, 'empty');
                    return;
                }

                if (!Array.isArray(data))
                    data = [data];

                let ids = [], subArray = [];
                var label = '';
                data.forEach(item => {
                    ids.push(item.id);
                    label += (item.name + ',');
                    subArray.push({
                        id: item.id,
                        name: item.name
                    });
                });
                // if (JSON.stringify(ids) === JSON.stringify(oldData.arrayId)) {
                //     return;
                // }
                //console.log(ids)
                this.$set(oldData, "arrayId", ids);
                this.$set(oldData, "label", label.substr(0, label.length - 1));
                this.$set(oldData, "array", subArray);


                //managerCompanyId
                if (null != index) {
                    this.treeCompanyId[index] = data[0].id;

                    if (flag) {
                        this.$set(this.roles[index], "arrayId", []);
                        this.$set(this.roles[index], "label", '');
                        this.$set(this.positions[index], "arrayId", []);
                        this.$set(this.positions[index], "label", '');
                    }
                }
            },
            syncBoxChange(state) {
                if (!state)
                    return;
                this.syncPhone = state;
                this.userForm.account = this.userForm.phone;
            },
            phoneInputHandler(v) {
                if (this.syncPhone)
                    this.userForm.account = v;
            },
            plusItem() {
                this.organizations.push({});
                this.roles.push({});
                this.positions.push({});

            },
            minusItem(index) {
                this.organizations.splice(index, 1);
                this.roles.splice(index, 1);
                this.positions.splice(index, 1);
            },
            setAuthArrays(rs) {
                //this.organizations = organData;
                //角色
                var rolesData = this.groupData(this.groupBy(rs['roles'], 'no'));
                var roleIdx;
                for (var i in rolesData) {
                    roleIdx = [];
                    rolesData[i].array.forEach(obj => {
                        roleIdx.push(obj.id);
                    });
                    rolesData[i].arrayId = roleIdx;
                    this.$set(this.roles, i, rolesData[i]);
                }

                //职位
                var posData = this.groupData(this.groupBy(rs['poss'], 'no'));
                //this.positions = posData;
                var posIdx;
                for (var i in posData) {
                    posIdx = [];
                    posData[i].array.forEach(obj => {
                        posIdx.push(obj.id);
                    });
                    posData[i].arrayId = posIdx;
                    this.$set(this.positions, i, posData[i]);
                }

                var that = this;
                setTimeout(function () {
                    //组织
                    var organData = that.groupData(that.groupBy(rs['organs'], 'no'));
                    var flag = !that.getCurrentUserInfo()['managementCompanyId'];
                    var organIdx;
                    for (var i in organData) {
                        organIdx = [];
                        organData[i].array.forEach(obj => {
                            organIdx.push(obj.id);
                        });
                        organData[i].arrayId = organIdx;
                        that.$set(that.organizations, i, organData[i]);
                        if (flag)
                            that.$set(that.treeCompanyId, i, organData[i].arrayId[0]);
                    }
                }, 500);
            },
            groupData(data) {
                var rs = [], array, label, subArray;

                for (var no in data) {
                    array = data[no];
                    label = '';
                    subArray = [];
                    array.forEach(item => {
                        label += (item.name + ',');
                        subArray.push(item);
                    });

                    rs.push({
                        label: label.substr(0, label.length - 1),
                        array: subArray
                    });
                }
                return rs;
            },
            groupBy(list, field) {
                var rs = {},
                    key;
                $.each(list, function () {
                    key = this[field];
                    if (!rs[key])
                        rs[key] = [];

                    rs[key].push(this);
                });
                return rs;
            }
        },
        mounted(){
            this.open({id:this.$route.query.id});
        }
    }
</script>

<style scoped lang="scss">
    .s-input-un {
        width: calc(100% - 94px);
    }

    .el-dialog .el-form--label-top.register-form .el-form-item__label {
        padding-left: 3px;
        vertical-align: bottom;
        line-height: 35px;
    }

    .register-form .el-form-item {
        margin-right: 3.5%;
        width: 28%;
        margin-top: 7px;
    }

    @media screen and (max-width: 1750px) {
        .register-form .el-form-item {
            margin-right: 3.5% !important;
            width: 28% !important;
            margin-top: 7px !important;
        }
    }

    .register-form .el-form-item:nth-child(3n+3) {
        margin-right: 0;
    }

    .s-box-un.el-checkbox {
        border-bottom: 1px solid #dddede;
        height: 34px;
        padding: 0 4px;
        display: inline-block;
        vertical-align: bottom;
        margin-bottom: 4px;
        margin-right: 0;
    }

    .s-box-un.el-checkbox span.el-checkbox__label {
        font-size: 12px;
        padding-left: 5px;
    }

    .register-form input::-webkit-input-placeholder {
        font-size: 13px;
    }

    .register-form .s-input-un input[readonly] {
        background: #f3f3f3;
        border: 1px solid #e5e5e5;
    }

    .register-form .el-radio {
        width: 68px;
    }

    .register-form .s-select-multi {
        width: calc(100% - 40px);
    }

    .register-form i.plus,
    .register-form i.minus {
        font-size: 20px;
        cursor: pointer;
        color: #6a6a6a;
        vertical-align: bottom;
        margin-bottom: 4px;
        background: #f0f0f0;
        padding: 3px;
        margin-left: 7px;
    }

    .register-form i.plus:hover,
    .register-form i.minus:hover {
        background: #e8e8e8;
    }

    .register-form i.minus {
        background: #fff0f0;
    }

    .register-form i.minus:hover {
        background: #f9e8e8;
    }

    .register-form .m-s-item:first-child {
        margin-top: 7px;
    }

    .register-form hr {
        width: 100%;
        margin: 7px 0 0 0;
        border-top: 1px dashed #eee;
    }

    .el-dialog.is-fullscreen .register-form .flex-panel {
        margin: 0 -10px 12px !important;
    }
    .multi-select-wrap {
        width: 100%;
        .m-s-item.small .tree-select-panel {
            width: calc(100% - 50px);
            display: inline-block;
        }
    }
</style>
