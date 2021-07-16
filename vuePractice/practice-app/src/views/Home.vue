<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <p>bus msg from HelloWorld Component is : {{msg}} </p>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p>{{this.$myStore.state.count}}</p>
    <p>{{form.id}}</p>
    <button @click="handlClick">+++</button>

    <button @click="hanldeToNewPage">to new Page</button>
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
      msg:'',
      form : {
        id:1
      }
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
    Object.assign(this.form, {
      id:0
    })
    console.log(this.form)
  },
  methods:{
    hanldeToNewPage() {
      this.$router.push(`/about?url=${`/casino?id=3`}`)
    },
    handlClick(){
      this.$myStore.commit('increment',10)
      console.log(this.$myStore.state.count)
    }
  }
}
</script>
