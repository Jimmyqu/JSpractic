<template>
    <div>
        <div class="logo" >
            <img :src="logoUrl?logoUrl:'static/img/logo1.png'" alt="logo">
        </div>
        <el-scrollbar wrapClass="scrollbar-wrapper">
            <el-menu
                class="menu-main"
                :router="true"
                mode="vertical"
                :show-timeout="200"
                :default-active="$route.path"
                :collapse="isCollapse"
                background-color="transparent"
                text-color="#fff"
                active-text-color="#409EFF"
                :unique-opened="true">
                <sidebar-item v-for="(route,index) in menu" :key="index" :item="route"
                              :base-path="route.path"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'
    import SidebarItem from './SidebarItem'

    export default {
        components: {SidebarItem},
        computed: {
            ...mapGetters([
                'menu',
                'sidebar',
                'logoUrl'
            ]),

            isCollapse() {
                return !this.sidebar.opened
            }
        }
    }
</script>
