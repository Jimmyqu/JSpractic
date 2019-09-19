<template>
    <div class="login-container">
        <div class="loading-box hide">
            <i class="el-icon-loading"></i>
        </div>
        <div id="app" v-cloak class="signin">
            <div class="left-div">
                <!-- <div class="logo"></div> -->
            </div>
            <div class="right-div" >
                <div id="frmLogin">
                    <div class="title">租赁运营支撑平台</div>
                    <div>
                        <h3>用户登录</h3>
                        <input autocomplete="off" v-model="account" auto-complete="off"
                            type="text" class="form-control nborder icon-input user" maxlength="20" placeholder="请输入账号"/>
                        <input autocomplete="off" v-model="password" auto-complete="off" @keyup.enter="login"
                            type="password" class="form-control nborder icon-input pwd" maxlength="30" placeholder="请输入密码"/>
                        <div class="login-info">
                            <el-checkbox v-model="savePwd">记住密码</el-checkbox>
                           <!-- <span>忘记密码？请联系管理员</span>-->
                        </div>
                    </div>
                    <label class="form-group error-text" style="color:red;"  v-html="message" v-show="message"></label>
                    <el-button id="btnSubmit" type="button" :disabled="disabled()" :loading="loading"
                         class="btn btn-primary block" @click="login">登录</el-button>
                </div>
            </div>
            <div class="QRcode">
                <div ><p><img src="static/img/d_android.png" alt="android"><span>android</span></p></div>
                <div ><p><img src="static/img/d_ios.png" alt="ios"><span>iOS</span></p></div>
            </div>
        </div>
    </div>
</template>

<script>
    import '@/styles/login.scss'
    import { loginTool } from '@/utils/common'

    export default {
        name: 'gd-login',
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
