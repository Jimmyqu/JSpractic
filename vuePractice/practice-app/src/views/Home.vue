<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <p>bus msg from HelloWorld Component is : {{msg}} </p>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p>{{this.$myStore.state.count}}</p>
    <button @click="handlClick">+++</button>
  </div>
</template>


<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import bus from '../eventBus'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data(){
    return {
      msg:''
    }
  },
  created(){
    bus.on('msg',(msg)=>{
      this.msg=msg
    })
    // console.log(this.$myStore.state)
      // console.log(this.$myStore.commit('increment'))
  },
  mounted() {
    this.$axios.get('http://t.yushu.im/v2/movie/in_theaters?city=上海&start=0&count=10').then(res=>console.log(res))
    this.$axios.get('http://t.yushu.im/v2/movie/in_theaters').then(res=>console.log(res))
    this.$axios.get('http://t.yushu.im/v2/movie/in_theaters?city=武汉&start=0&count=20').then(res=>console.log(res))
    console.log(this)
  },
  methods:{
    handlClick(){
      this.$myStore.commit('increment',10)
      console.log(this.$myStore.state.count)
    }
  }
}
</script>
