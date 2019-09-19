<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index)  in levelList" :key="index" v-if="item.meta.title">
                <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">
                    <i class="x-icon" v-if="item&&item.icon" :style="getUrl(item.icon)"></i>
                    <i class="x-icon" v-else style="background-image: url('static/icon/main.png');"></i>
                    {{item.meta.title}}
                </span>
                <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    export default {
        created() {
            this.getBreadcrumb()
        },
        data() {
            return {
                levelList: null
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        },
        methods: {
            getUrl(img){
                const url = "static/icon/"+img+".png";
                const style = {
                    backgroundImage:'url(' + url + ')'
                }
                return style;
            },
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name)
                const first = matched[0]
                //if (first && first.name !== 'work') {
                //  matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
                //}
                for(let i = 0; i < matched.length;i++) {
                    const bean = matched[i]
                    if(bean.meta && bean.meta.icon) {
                        bean.icon = bean.meta.icon;
                    }
                }
                this.levelList = matched
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .x-icon{
        overflow: hidden;
        display: inline-block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
        width: 22px;
        height: 22px;
        vertical-align: middle;
        // filter: brightness(100);
        &:after{
            content: "";
            display: block;
            height: 100%;
            transform: translateX(-100%);
            background: inherit;
            filter: drop-shadow(22px 0 0 #fff);
        }
    }
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 6px;
        .no-redirect {
            color: #fff;
            cursor: text;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.2);
        }

        /deep/ .el-breadcrumb__separator {
            font-size: 0;
            margin: 0 5px;
        }
    }
</style>
