<template>
    <div class="login">
        <h1>欢迎登录车家+</h1>
        <div class="user-box">
            <img src="/static/images/logo.png" alt="logo">
            <div class="user-info padding">
                <div class="user">
                    <label>账号</label>
                    <input v-model="account" type="text" placeholder="请输入您的账号" maxlength="20">
                </div>
                <div class="password">
                    <label>密码</label>
                    <input v-model="password" @confirm="onLogin" password placeholder="请输入您的密码（6-14位）" maxlength="14" confirm-type="go">
                </div>
                <button type="primary" :disabled="disabled" @click="onLogin" hover-class="other-button-hover">登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { get, post } from '../../utils/request'

export default {
  data () {
    return {
      account:'',
      password:'',
    }
  },

  methods: {
    ...mapActions(["login"]),
    onLogin(){
        if(this.loading) return
        const data = {
            username: this.account,
            password: this.password,
            grant_type: "password"
        }
        this.login(data)
    }
  },
  computed: {
        disabled(){
            if(this.account && this.password){
                return false
            }else{
                return true
            }
        }
  },
  mounted() {
      this.account = '';
      this.password = '';
  },
  created () {
    
  }
}
</script>

<style lang="scss" scoped>
  @import './index.css'
</style>