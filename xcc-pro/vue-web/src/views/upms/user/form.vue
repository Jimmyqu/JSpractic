<template>
    <div class="form-panel">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-position="top" label-width="100px"
                 :class="{'register-form': true}">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基本信息" name="1">
                    <div class="flex-panel box4">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="userForm.phone" placeholder="请输入手机号"
                                      @input="phoneInputHandler"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="微信号" prop="wechat">
                            <el-input v-model="userForm.wechat" placeholder="请输入微信号"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="account" class="user-input">
                            <el-input v-model="userForm.account" placeholder="请输入用户名"
                                      :class="{'s-input-un': true, sync: syncPhone}" :disabled="syncPhone" ></el-input>
                            <el-checkbox v-model="syncPhone" @change="syncBoxChange"
                            >同手机号
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
                        <el-form-item label="有效期" prop="validDate">
                            <el-date-picker type="date" placeholder="请选择有效期" v-model="userForm.validDate"
                                            :picker-options="pickeroptions" value-format="yyyy-MM-dd" clearable></el-date-picker>
                        </el-form-item>
                        <el-form-item label="其他信息" prop="remark">
                            <el-input v-model="userForm.remark" placeholder="请输入其他信息"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="权限信息" name="2">
                    <el-button class="float-btn" type="primary" @click="addItem">新增</el-button>
                    <el-table border :data="userForm.list" style="width: 100%">
                        <el-table-column label="组织" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'list.' + $index + '.organizations'"
                                              :rules="rules.required('请选择组织')">
                                    <tree-select v-model="row.organizations" placeholder="请选择" type="one" :index="$index"
                                                 :disabled-id="['1']" url="/admin/organization/tree" @change="changeArrayItem"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="角色" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'list.' + $index + '.roles'"
                                              :rules="rules.required('请选择角色')">
                                    <tree-select v-model="row.roles" placeholder="请选择" :disabled="!row.organizations"
                                                 :url="setUrl('admin/role/findByCompany',row)" ></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="职位" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'list.' + $index + '.positions'"
                                              :rules="rules.required('请选择职位')">
                                    <tree-select v-model="row.positions" placeholder="请选择" :disabled="!row.organizations"
                                                 :url="setUrl('admin/position/tree',row)"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="50">
                            <template slot-scope="{row, $index}">
                                <el-button v-if="userForm.list.length>1" type="text"
                                           size="small" @click="delItem($index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        components: {TreeSelect},
        data() {

            var checkPwdConfirm = (rule, v, callback) => {
                if (v != this.userForm.password) {
                    callback(new Error('2次密码输入不一致'));
                } else
                    callback();
            };
            return {
                userForm: {
                    list: [{}],
                    name: '',
                    account: '',
                    phone: '',
                    email: '',
                    wechat: '',
                    userType: '1',
                    userStatus: '1',
                    validDate: "",
                    remark: '',
                    password: '',
                    passwordConfirm: '',
                },
                openCollapse: ["1", "2"],//默认打开的面板
                syncPhone: false,
                flag: this.getCurrentUserInfo()['managementCompanyId'] ? '' : 'empty',
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
                showPwd: true,
                posUrlArray: [],
                treeCompanyId: {},
                pickeroptions:{
                    disabledDate(time) {
                        return time.getTime()  < Date.now() - 24*60*60*1000;
                    },
                },
            }
        },
        methods: {
            //进入编辑页调用 bean为列表页传入数据
            open() {
                this.openCollapse = ["1", "2"];
                if (this.$route.query.id) {
                    this.showPwd = false;
                    ajax.get('admin/user/id/' + this.$route.query.id).then(rs => {
                        //if (this.checkResponse(rs)) {
                            rs.data.userType += '';
                            rs.data.userStatus += '';
                            this.userForm = Object.assign(this.userForm, rs.data);
                            this.syncPhone =  this.userForm.account == this.userForm.phone;
                        //}
                    });
                    //加载用户的权限信息
                    ajax.get('admin/user/getUserOrganStructure', {id: this.$route.query.id}).then(rs => {
                        if (this.checkResponse(rs)) {
                            // this.$set(this.userForm,'list',rs.data)
                            this.setAuthData(rs.data.rows);

                        }

                    });
                }else {
                    this.syncPhone = true;
                }
            },
            setAuthData(data) {
                // data = [
                //     {
                //         organizations: [],
                //         positions: [],
                //         roles: [],
                //     }
                // ];
                this.userForm.list = [];
                if (data && data.length) {
                    data.forEach(item => {
                        let bean = Object.assign({}, item);
                        bean.organizations = [];
                        item.organizations && item.organizations.forEach(item2 => {
                            bean.organizations.push(item2.id);
                        });
                        bean.positions = [];
                        item.positions && item.positions.forEach(item2 => {
                            bean.positions.push(item2.id);
                        });
                        bean.roles = [];
                        item.roles && item.roles.forEach(item2 => {
                            bean.roles.push(item2.id);
                        });
                        this.userForm.list.push(bean);
                    })
                } else {
                    this.userForm.list = [{}];
                }
                this.$set(this.userForm, 'list', this.userForm.list);

            },
            changeArrayItem(data,index) {
                debugger
                this.$set(this.userForm.list[index],"roles","");
                this.$set(this.userForm.list[index],"positions","");
            },
            submitForm(form) {
                var that = this;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.userForm.list || this.userForm.list.length === 0) {
                            this.showMessage('校验不通过，请检查输入项');
                            return;
                        }
                        let organizations = [];
                        let positions = [];
                        let roles = [];
                        this.userForm.list.forEach(item => {
                            organizations.push(item.organizations);
                            positions.push(item.positions);
                            roles.push(item.roles);
                        });
                        const data = Object.assign(this.userForm, {
                            organizations: JSON.stringify(organizations),
                            positions: JSON.stringify(positions),
                            roles: JSON.stringify(roles)
                        });

                        ajax.post('admin/user', data).then(rs => {
                            //if (this.checkResponse(rs)) {
                                that.$message({message: '保存成功！', type: 'success'});
                                that.close();
                            //}
                        });
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }
                });
            },
            setUrl(url, data) {
                console.log(data);
                if (this.flag && (!data.organizations || data.organizations.length === 0)) {
                    return "";
                } else {
                    return url + "?managerId=" + (data.organizations?data.organizations[0]:"")
                }
            },
            addItem() {
                this.userForm.list.push({});
            },
            delItem(i) {
                this.userForm.list.splice(i, 1);
            },
            phoneInputHandler(v) {
                if (this.syncPhone)
                    this.userForm.account = v;
            },
            syncBoxChange(state) {
                if (!state)
                    return;
                this.syncPhone = state;
                this.userForm.account = this.userForm.phone;
            },
        },
        mounted() {
            this.open();
        }
    }
</script>

<style scoped lang="scss">
    .user-input {
        /deep/ .el-form-item__content {
            display: flex;

            .el-checkbox {
                margin-left: 10px;
                margin-right: 0;
            }
        }
    }
</style>
