<template>
  <div class="hello">
   <button @click="handleEmit($event,'asd')">emit to home</button>
  </div>
</template>

<script>

import bus from '../eventBus'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
    handleEmit($event,s){
      console.log($event)
      console.log(s)
      bus.emit('msg',99999)
    }
  },
  mounted(){
    console.log('child')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
