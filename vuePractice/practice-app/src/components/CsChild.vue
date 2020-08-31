<template>
  <div>
      child
      <p>model from father {{value}}</p>
      <p>props from father {{other}}</p>
      <button @click="handleChange">change props model</button>
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
}
</script>

<style>

</style>