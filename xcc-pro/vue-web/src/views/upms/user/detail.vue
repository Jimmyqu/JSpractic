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
                        <label class="control-label">有效期</label>
                        <div class="input-group">
                            <span>{{userForm.validDate}}</span>
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
                    <template v-for="(bean, i) in list">
                        <div class="detail-item">
                            <label class="control-label">组织</label>
                            <div class="input-group">
                                <span v-for="(item,ii) in bean.organizations" :key="ii">{{item.name}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">角色</label>
                            <div class="input-group">
                                <span v-for="(item,ii) in bean.roles" :key="ii">{{item.name}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">职位</label>
                            <div class="input-group">
                                <span v-for="(item,ii) in bean.positions" :key="ii">{{item.name}}</span>
                            </div>
                        </div>
                    </template>
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

    export default {
        name: "userDetail",
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
                list: [],
            }
        },
        mounted() {
            ajax.get('admin/user/id/' + this.$route.params.id).then(rs => {
                //if(this.checkResponse(rs)) {
                    rs.data.userType += '';
                    rs.data.userStatus += '';
                    this.userForm = rs.data;
                //}
            });

            //加载用户的权限信息
            ajax.get('admin/user/getUserOrganStructure', {id: this.$route.params.id}).then(rs => {
                //if(this.checkResponse(rs)) {
                    this.list = rs.data.rows;
                //}
            });
        },
        methods: {

        },

    }
</script>
