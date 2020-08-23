
<template>
  <div class="about">
    <more  :loading='true' :more='false' :list.sync='list'>
      <div>
        <p style=" height:80px" v-for="(item, i) in list" :key="i">
          {{ item }}
        </p>
      </div>
    </more>
  </div>
</template>

<script>
import more from '../components/myLoad'
export default {
  components:{
    more
  },
  data() {
    return {
      list:[]
    };
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.about{
  height: 90vh;
}
</style>>


