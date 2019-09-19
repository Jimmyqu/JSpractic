<template>
    <div class="nm_login-container">
        <div v-cloak class="nm_signin">
            <div class="nm_left" v-if="isPc()">
                <h3>欢迎登录</h3>
                <div class="nm_title"></div>
            </div>
            <div class="nm_right">
                <div class="nm_logo"></div>
                <div class="nm_frmLogin">
                    <input autocomplete="off" v-model="account" auto-complete="off"
                            type="text" class="nm_user" maxlength="20" placeholder="请输入账号"/>
                    <input autocomplete="off" v-model="password" auto-complete="off" @keyup.enter="login"
                        type="password" class="nm_pwd" maxlength="30" placeholder="请输入密码"/>
                </div>
                <div class="nm_login-info">
                    <el-checkbox v-model="savePwd" style="color: #8E8E93;">自动登录（30天有效）</el-checkbox>
                </div>
                <p class="nm_error-text" style="color:red;"  v-html="message" v-show="message"></p>
                <el-button type="primary" :disabled="disabled()" :loading="loading" @click="login">登录</el-button>
            </div>
        </div>
        <div class="QRcode">
            <div ><p><img src="static/img/gx_android.png" alt="android"><span>android</span></p></div>
            <div ><p><img src="static/img/gx_ios.png" alt="ios"><span>iOS</span></p></div>
        </div>
    </div>
</template>

<script>
    import '@/styles/nmLogin.scss'
    import { loginTool } from '@/utils/common'

    export default {
        name: 'nm-login',
        mixins:[loginTool],
        methods:{
            isPc(){
                const ua = navigator.userAgent
                if ((ua.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))) {
                    if (/iPhone|iPad|iPod/.test(ua)) {
                        return false
                    } else if (/Android/.test(ua)) {
                        return false
                    }
                }else{
                    return true
                }
            }
        }
    }
    // css rem 设置
    !function(n){
        var  e=n.document,
            t=e.documentElement,
            i=1920,// 设计稿宽度
            d=i/100,// 比例
            o="orientationchange"in n?"orientationchange":"resize",
            a=function(){
                var n=t.clientWidth||320;n>1920&&(n=1920);
                t.style.fontSize=n/d+"px"
            };
        window.setTimeout(a,1);
        e.addEventListener&&(n.addEventListener(o,a,!1),e.addEventListener("DOMContentLoaded",a,!1))
    }(window);
</script>
