<template>
    <div class="container">
        <div class="info shadow">
          <img class="head-portrait" src="/static/images/index/bg.png" alt="">
          <div class="info-detail">
            <h1 class="name">李建</h1>
            <p class="company">中汽广州分公司</p>
          </div>
        </div>
        <ul class="otherOpreation padding shadow">
            <li @click="toDetail('/pages/my/changePassword/index')">修改密码<img class="more" src="/static/images/more.png" alt=""></li>
        </ul>
        <button class="button shadow" type="warn" @click="loginOut">退出登录</button>
    </div>
</template>

<script>
import { tool } from '../../utils/common'
export default {
    mixins:[tool],
    data(){
        return {

        }
    },
    methods: {
        loginOut(){
            const $this = this
            wx.showModal({
                title: '提示',
                content: '确定要退出登录吗？',
                success (res) {
                    if (res.confirm) {
                        $this.$store.dispatch('loginOut');
                    } else if (res.cancel) {
                    }
                }
            })
        },
  },
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>
