<template>
  <div class="container">
    <ul class="header shadow padding">
      <li v-for="(item,i) in statusList" :key="i" :class="{'active':isActive == i}" @click="onTabs(i)">{{item.name}}</li>
      <img class="slider" :style="{left:left+'rpx'}" src="/static/images/task/slider.png" alt=""/>
    </ul>
    <p class="add" @click="toDetail('/pages/task/add/index')">新增+</p>
    <div class="data-list shadow" v-for="(item,i) in list" :key="i" @click="toDetail('/pages/task/detail/index',item.id)">
      <div class="head padding">
        <h2>{{item.assignmentTime}}</h2>
        <p>{{item.passengerNum}}人</p>
        <span>{{item.statusText}}</span>
      </div>
      <div class="body padding">
        <div class="address">
          <img class="icon" src="/static/images/task/start.png" alt="start">
          <p>{{item.depAddress}}</p>
        </div>
        <div class="address">
          <img class="icon" src="/static/images/task/end.png" alt="end">
          <p>{{item.desAddress}}</p>
        </div>
      </div>
      <div class="footer padding" v-if="item.contacterName || item.plate">
        <p>{{item.contacterName}} | {{item.plate || ''}}</p>
      </div>
    </div>
    <div v-if="list.length && list.length >= listCount" class="noData">
      到底啦~
    </div>
    <div v-if="!list.length" class="noData">
      暂无数据~
    </div>
  </div>
</template>

<script>
import { tool,pullRefresh } from '../../utils/common'

export default {
  mixins:[tool,pullRefresh],
  data () {
    return {
      statusList:[
        {name:'全部'},
        {name:'待派发'},
        {name:'已派发'},
        {name:'待出车'},
        {name:'待接人'},
        {name:'待送达'},
      ],
      isActive:0,
      listUrl:'operation_core/assignment/list'
    }
  },
  computed:{
    left(){
      let num = 0
      switch(this.isActive){
        case 0:num = 4;break;
        case 1:num = 60;break;
        case 2:num = 124;break;
        case 3:num = 186;break;
        case 4:num = 248;break;
        case 5: num = 312;
          break;
      }
      return num*2
    }
  },
  methods: {
   onTabs(i){
      this.isActive = i;
      wx.pageScrollTo({scrollTop:0,duration:0})
      this.page = 1;
      this.getList();
   },
   getListBefore(params){
     if(this.isActive){
       params.assignmentStatus = this.isActive
     }
   }
  },
  onLoad(){
    if(this.$root.$mp.query.id){
      this.isActive = this.$root.$mp.query.id*1
    }
  },
  onShow() {
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
  @import './index.css'
</style>