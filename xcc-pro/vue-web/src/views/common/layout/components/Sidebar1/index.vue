<template>
    <el-scrollbar wrapClass="scrollbar-wrapper">
        <div class="logo"></div>
        <el-menu
            :router="true"
            mode="vertical"
            :show-timeout="200"
            :default-active="$route.path"
            :collapse="isCollapse"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF">
            <sidebar-item v-for="(route,index) in menu" :key="index" :item="route"
                          :base-path="route.path"></sidebar-item>
        </el-menu>
    </el-scrollbar>
</template>

<script>
    import {mapGetters} from 'vuex'
    import SidebarItem from './SidebarItem'

    export default {
        components: {SidebarItem},
        computed: {
            ...mapGetters([
                'menu',
                'sidebar'
            ]),

            isCollapse() {
                return !this.sidebar.opened
            }
        }
    }
</script>
