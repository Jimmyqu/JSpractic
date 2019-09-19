<template>
    <div class="sz_login-container">
        <div v-cloak class="sz_signin">
            <div class="sz_signin-l">
            </div>
            <div class="sz_signin-r">
                <div class="sz_title">
                    <div class="logo"></div>
                    <div class="title">
                        <h1>深圳市计量质量检测研究所</h1>
                        <p>Shenzhen Academy of Metrology & Quality Inspection</p>
                    </div>
                </div>
                <div class="sz_right">
                    <h1>车辆运营管理平台</h1>
                    <div class="sz_frmLogin">
                        <label>用户名</label>
                        <el-input v-model="account" placeholder="请输入账号" maxlength="20"></el-input>
                        <label>密码</label>
                        <el-input type="password" v-model="password" maxlength="30" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
                    </div>
                    <div class="sz_login-info">
                        <el-checkbox v-model="savePwd" style="color: #8E8E93;">自动登录（30天有效）</el-checkbox>
                    </div>
                    <p class="sz_error-text" style="color:red;"  v-html="message" v-show="message"></p>
                    <el-button type="primary" :disabled="disabled()" :loading="loading" @click="login">登录</el-button>
                </div>
            </div>
        </div>
        <div class="QRcode">
            <div ><p><img src="static/img/smq_android.png" alt="android"><span>android</span></p></div>
            <div ><p><img src="static/img/smq_ios.png" alt="ios"><span>iOS</span></p></div>
        </div>
    </div>
</template>

<script>
    import '@/styles/szLogin.scss'
    import { loginTool } from '@/utils/common'

    export default {
        name: 'sz-login',
        mixins:[loginTool],
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
