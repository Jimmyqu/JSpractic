
<template>
  <div class="about">
    <a @click="handleClick">11111111111111</a>
    <div ref="btn">22222222222222</div>
    <div class="container">
      <div class="loop">
        <path d="M150 150 L120 120 A130 130 0 0 0 120 120 Z"
          stroke-width="2" 
          fill="red"
          transform="rotate(120)" 
          transform-origin="150 150"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
    }
  },
  mounted(){
    let name='涨先';
    let arr =[];
    (name+'').split('').map((i,index)=>{
      !index?arr.push(i):arr.push('*')
    })
    console.log(arr.join(''))

    const a = (name+'').split('').reduce((acc,cur,idx)=>{
      acc = idx==0?acc+cur:acc+'*'
      return acc
    },'')
    console.log(a)
    this.$refs.btn.addEventListener('click', () => {
      console.log('click');
    });
  },
  methods: {
    handleClick() {
      console.log(11111)
    }
  }
};
</script>

<style lang="less" scoped>
.about{
  height: 90vh;
}
.container {
  display: flex;
  justify-content: center;
  .loop {
    width: 50vw;
    height: 50vw;
    background-color: red;
  }
}
</style>>


