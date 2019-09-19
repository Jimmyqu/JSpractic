<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <breadcrumb></breadcrumb>
        <Notice url="admin/notice/detail"></Notice>
        <div class="avatar-container">
            <el-tooltip effect="dark" content="数据空间站" placement="bottom">
                <div v-if="hasWorkbench" class="workbench-btn" @click="showWorkbench" >
                    <i class="work-icon" ></i>
                </div>
            </el-tooltip>

            <div class="msg-btn" @click="showMsgPanel">
                <i class="msg-icon"></i>
                <div class="count" v-if="msgCount&&msgCount<=99">{{msgCount}}</div>
                <div class="count" v-if="msgCount&&msgCount>99">99+</div>
            </div>
            <el-dropdown  size="small" trigger="click">
                <div class="avatar-wrapper">
                    <span style="margin-right: 10px;font-size: 14px" :title="nowDate">{{nowTime}}</span>
                    <span v-if="nowText">{{nowText}}好，{{user.name}}</span>
                    <span v-else>{{user.name}}</span>
                    <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <el-dropdown-item @click.native="openForm">修改密码</el-dropdown-item>
                    <el-dropdown-item divided>
                        <span @click="logout" style="display:block;">退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <UpdPassword ref="form"></UpdPassword>
        <!--<workbench ref="workbench"></workbench>-->
         <component ref="workbench" :is="user.managementCompanyId == '110'?'Workbench':'PublicWorkbench'"></component>

        <div class="msg-box" :class="{'show':showMsg}">
            <div class="title">
                系统消息
                <span class="red">{{msgCount}}</span>
                <div class="hide-btn el-icon-d-arrow-right" @click="showMsg=false"></div>
            </div>
            <div class="list" @scroll="getMsgList">
                <div class="item" v-for="(bean,i) in list" :key="i" @click="openDetail(bean)">
                    <div :class="{'gray':bean.readStatus==1}">{{bean.content}}</div>
                    <div class="time">{{bean.createTime}}</div>
                </div>
            </div>
        </div>

    </el-menu>
</template>

<script>
    import {tool} from '@/utils/common'
    import ajax from '@/utils/request'
    import {mapGetters} from 'vuex'
    import UpdPassword from './UpdPassword'
    import Workbench from '@/views/tgpt/workbench/workbench'
    import PublicWorkbench from '@/views/tgpt/publicWorkbench/index'
    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import Notice from '@/components/Notice'

    export default {
        data(){
            return {
                msgCount:0,
                pageSize:20,
                showMsg: false,
                isMsgInit: false,
                nowDate: new Date().format('yyyy-MM-dd'),
                nowText: this.getDateText(),
                nowTime: new Date().format('hh:mm'),
                hasWorkbench: this.getCurrentUserMenuAuthority('/tgpt/index')
            }
        },
        components: { UpdPassword, Breadcrumb, Hamburger,Workbench,PublicWorkbench, Notice },
        mixins: [tool],
        computed: {
            ...mapGetters([
                'user',
                'sidebar',
                'avatar'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                })
            },
            showWorkbench(){
                this.$refs.workbench.open();
            },
            showMsgPanel(){
                this.showMsg = true;
                if(this.isMsgInit){
                    return;
                }
                this.listUrl = "base/workbench/messageList";
                this.handleCurrentChange(1);

            },
            openDetail(bean) {
                ajax.get("base/message/setRead/"+ bean.id).then(res => {
                    if (this.checkResponse(res)) {
                        if (bean.readStatus == 0) {
                            this.getMsgCount();
                        }
                        this.showMsg = false;
                        this.$set(bean, "readStatus", 1);
                        this.$router.push({path:bean.jumpUrl});
                    }
                });
            },
            getListBefore(params){
                this.loading = true;
            },
            getListAfter(){
                this.isMsgInit = true;
                this.loading = false;
                this.showMsg = true;
            },
            getMsgCount(){
                ajax.get("base/workbench/unreadMessageQuantity").then(res =>{
                    if(this.checkResponse(res)) {
                        this.msgCount = res.data.unread;
                    }
                });
            },
            getList() {
                if(!this.listUrl){
                    return;
                }
                const params = Object.assign({},this.searchParam);
                params.current = this.page;
                params.rows = this.pageSize;
                this.getListBefore(params);
                ajax.get(this.listUrl, params).then(res => {
                    this.listLoading = false;
                    if(this.page == 1){
                        this.list = res.rows;
                    }else{
                        this.list = this.list.concat(res.rows);
                    }
                    this.listCount = res.records;
                    this.getListAfter();
                }).catch(_=>{
                    this.loading = false;
                    this.listLoading = false;
                })
            },
            getMsgList(e){
                if(this.listLoading){
                    return;
                }
                const clientHeight = e.target.clientHeight;
                const scrollHeight = e.target.scrollHeight;
                const scrollTop = e.target.scrollTop;
                if(clientHeight + scrollTop >= scrollHeight && this.list.length<this.listCount){
                    this.listLoading = true;
                    this.page++;
                    this.getList();
                }
            },
            openForm(){
                this.$refs.form.open();
            },
            getDateText(date=new Date()){
                let h = date.getHours();
                if(h>=0&&h<6){
                    return "凌晨";
                }else if(h>=6&&h<9){
                    return "早上";
                }else if(h>=9&&h<12){
                    return "上午";
                }else if(h>=12&&h<14){
                    return "中午";
                }else if(h>=14&&h<18){
                    return "下午";
                }else if(h>=18&&h<24){
                    return "晚上";
                }
            }
        },
        mounted(){
            if(this.hasWorkbench && !sessionStorage.hasWorkbench){
                this.showWorkbench()
            }
            this.getMsgCount();
            window.setInterval(() => {
                let date = new Date();
                this.nowDate = date.format('yyyy-MM-dd');
                this.nowText = this.getDateText(date);
                this.nowTime = date.format('hh:mm');
            }, 10 * 1000);
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-dropdown-menu {
        top: 35px !important;
    }
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        overflow: hidden;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            right: 35px;
            color: #fff;
            .workbench-btn {
                font-size: 14px;
                margin-right: 20px;
                cursor: pointer;
                line-height: initial;
                display: flex;
                align-items: center;
                .work-icon {
                    background-image: url("~img/workbench/work.png");
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    width: 23px;
                    height: 16px;
                    display: inline-block;
                    margin-right: 5px;
                }
            }
            .msg-btn {
                line-height: 15px;
                position: relative;
                margin-right: 20px;
                cursor: pointer;
                .msg-icon {
                    background-image: url("~img/workbench/xiaoxi.png");
                    background-repeat: no-repeat;
                    background-size: 100%;
                    background-position: center 5px;;
                    width: 14px;
                    height: 22px;
                    display: inline-block;
                    margin-right: 5px;
                }
                .el-icon-bell {
                    font-size: 20px;
                }
                .count {
                    position: absolute;
                    right: -6px;
                    top: -8px;
                    font-size: 12px;
                    transform: scale(0.9);
                    padding: 3px;
                    border-radius: 50%;
                    background-color: red;
                    min-width: 20px;
                    text-align: center;
                }
            }

            .el-dropdown {
                color: inherit;
            }
            .avatar-wrapper {
                cursor: pointer;
                margin-right: 20px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 18px;
                    font-size: 12px;
                }
            }
        }
    }
    .msg-box {
        position: fixed;
        right: -300px;
        top: 0;
        z-index: 1042;
        height: 100%;
        width: 300px;
        background-color: #171337;
        color: #fff;
        padding: 10px 0;
        transition: all 0.7s;
        .title {
            padding: 0 30px;
        }
        &.show {
            right: 0;
        }
        .red {
            color: red;
        }
        .list {
            padding: 0 30px;
            line-height: 20px;
            font-size: 14px;
            height: calc(100% - 40px);
            overflow-y: auto;
            &::-webkit-scrollbar-thumb {
                background-color: #ccc;
                border-radius: 4px;
            }

            &::-webkit-scrollbar-track-piece {
                background: transparent;
                border: 0;
            }
            .gray {
                opacity: 0.7;
            }
            .item {
                margin: 15px 0;
                text-align: justify;
                word-break: break-all;
                cursor: pointer;
            }
            .time {
                color: #999;
                text-align: right;
                margin-top: 3px;
            }
        }

        .hide-btn {
            float: right;
            margin-top: 17px;
            cursor: pointer;
        }
    }
</style>

