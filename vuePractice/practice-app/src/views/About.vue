<template>
  <div>
    <child @giveClick='handleClick' num='1'>
      <p>给子元素的solt类似react的children</p>
      <p>slot内可以使用父组件的数据{{slotData}} 
        而获取不到包裹组件（child）的作用域</p>
       <template #top>
        <h1>给具名slot的 top #top是v-slot:top的简写</h1>
       </template> 
       <template #bottom="slotProps">
          <p>通过命名空间='slot传值'接受并使用 slot传入的数据</p>
          <p>{{slotProps.childData}}</p>
       </template> 
    </child>
  </div>
</template>
<script>
import child from '../components/aboutChildren'
export default {
  components:{
    child
  },
  data(){
    return {
      slotData:'slotVal'
    }
  },
  methods:{
    handleClick(show,num){
      console.log(show)
      console.log(num)
      console.log('father‘s click')
    }
  },
  mounted(){
     console.log(this.$route.query)
     this.$router.replace(this.$route.query.url)
  }
}
</script>

<style>

</style>