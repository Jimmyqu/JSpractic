<template>
  <div>
      child
      <p>model from father {{value}}</p>
      <p>props from father {{other}}</p>
      <input  type="text">
      <button @click="handleChange">change props model</button>
      <img v-image="url" alt="">
  </div>
</template>
<script>
export default {
    props:{
        value:[String,Number],
        other:[String]
    },
    model: {
        prop: 'value',
        event: 'updateVal'
    },
    methods: {
        handleChange(){
          this.$emit('updateVal', '还你200块');
        }
    },
    data() {
        return {
            url:''
        }
    },
    mounted() {
        setTimeout(()=>{
            this.url = 'https://i.ytimg.com/an_webp/yCYZ0Tz6lT0/mqdefault_6s.webp?du=3000&sqp=CJnyvfoF&rs=AOn4CLC2iyiDpj3VHecy6B5_RDb81tJOCg'
        },1000)
    },
}
</script>

<style>

</style>