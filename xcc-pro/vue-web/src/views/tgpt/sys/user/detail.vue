<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="基本信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">姓名</label>
                        <div class="input-group">
                            <span>{{userForm.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">手机号</label>
                        <div class="input-group">
                            <span>{{userForm.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">用户名</label>
                        <div class="input-group">
                            <span>{{userForm.account}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">邮箱</label>
                        <div class="input-group">
                            <span>{{userForm.email}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">微信号</label>
                        <div class="input-group">
                            <span>{{userForm.wechat}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他信息</label>
                        <div class="input-group">
                            <span>{{userForm.remark}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="权限信息" name="2">
                <div class="flex-panel detail-box">
                    <div v-for="(organ, index) in organizations" :key="organ.index" style="width: 100%;display: flex;">
                        <div class="detail-item">
                            <label class="control-label">组织</label>
                            <div class="input-group">
                                <span>{{organ.label}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">角色</label>
                            <div class="input-group">
                                <span>{{roles[index].label}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">职位</label>
                            <div class="input-group">
                                <span>{{positions[index].label}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="detail-item big">
                        <label class="control-label">用户状态</label>
                        <div class="input-group">
                            <span v-if="userForm.userStatus==1">正常</span>
                            <span v-if="userForm.userStatus==0">停用</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { tool } from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: "sysUserDetail",
        mixins: [ tool ],
        data() {
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
                organizations: [{}],
                roles: [{}],
                positions: [{}],
                posUrlArray: [],
                id: this.$route.params.id
            }
        },
        mounted() {
            var that = this;
            ajax.get('/sys/user/findOne', {id: that.id}).then(rs => {
                rs.data.userType += '';
                rs.data.userStatus += '';
                that.userForm = rs.data;
            });

            //加载用户的权限信息
            ajax.get('/sys/user/queryAuth', {id: that.id}).then(rs => {
                this.setAuthArrays(rs.data);
            });
        },
        methods: {
            setAuthArrays(rs) {
                //组织
                this.organizations = this.groupData(this.groupBy(rs['organs'], 'no'));
                //角色
                this.roles = this.groupData(this.groupBy(rs['roles'], 'no'));
                //职位
                this.positions = this.groupData(this.groupBy(rs['poss'], 'no'));
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
        }
    }
</script>
