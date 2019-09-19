<template>
    <div class="container">
        <div class="from shadow">
            <input type="text" v-model="oldPassword" placeholder="请输入原密码">
            <input type="text" v-model="newPassword" placeholder="请输入6-16位数字、字母或符号">
            <input type="text" v-model="dbPassword" placeholder="请再次输入新密码">
        </div>
       <div class="padding">
            <button type="primary" :disabled="disabled" @click="onChengPassWord" >确定</button>
       </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            oldPassword:'',
            newPassword:'',
            dbPassword:''
        }
    },
    computed: {
        disabled(){
            if(this.oldPassword && this.newPassword && this.dbPassword){
                return false
            }else{
                return true
            }
        }
    },
    methods: {
        onChengPassWord(){
            
        }
  },
  mounted(){
      this.oldPassword = '';
      this.newPassword = '';
      this.dbPassword = '';
  }
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>
