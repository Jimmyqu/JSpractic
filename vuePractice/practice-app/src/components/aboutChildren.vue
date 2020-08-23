<template>
  <div>
      <slot name="top">
      </slot>
      <p>props:{{num}}</p>
      <button @click="recivedClick(1)">father click</button>
      <slot>
          <p>默认slot 如果父组件未指定 则显示它</p>
      </slot>
      <slot name="bottom" :childData='childData'>
          {{childData}}
      </slot>
  </div>
</template>
<script>
export default {
    props:{
        num:String
    },
    data(){
        return {
            childData:'子组件可以通过v-bind:state将数据传入父组件的solt内'
        }
    },
    methods:{
        recivedClick(num){
            console.log('child click')
            const val = 'someVal'
            this.$emit('giveClick',val,num)
        }
    }
}
</script>

<style>

</style>