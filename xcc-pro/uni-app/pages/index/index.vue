<template>
  <div class="container">
    <div class="user-info shadow">
      <img class="img" src="/static/images/index/bg.png" alt="">
      <div class="info-box">
        <div class="info" @click="toDetail('/pages/my/index')">
          <img class="head-portrait" src="/static/images/index/bg.png" alt="">
          <div class="info-detail">
            <h1 class="name">李建</h1>
            <p class="company">中汽广州分公司</p>
          </div>
        </div>
        <div class="user-detail">
          <div class="item">
            <p class="num">56</p>
            <p>车辆</p>
          </div>
          <div class="item">
            <p class="num">8</p>
            <p>司机</p>
          </div>
          <div class="item">
            <p class="num">129</p>
            <p>任务</p>
          </div>
        </div>
      </div>
    </div>
    <div class="task shadow">
      <div class="header">
        <h2 class="padding">任务<span @click="toDetail('/pages/task/index','0')">查看全部 ></span></h2>
      </div>
      <div class="task-box padding">
        <div class="item" v-for="(item,i) in taskList" :key="i" @click="toDetail(item.url,i+1)">
          <img :class="'ioc'+i" :src="item.src" :alt="item.name">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="operation shadow">
      <div class="header">
        <h2 class="padding">运营</h2>
      </div>
      <div class="operation-box padding">
        <div class="item" v-for="(item,i) in operationList" :key="i" @click="toDetail(item.url)">
          <img class="ioc" :src="item.src" :alt="item.name">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="statistics shadow">
      <div class="header">
        <h2 class="padding">统计</h2>
      </div>
      <div class="statistics-box padding">
        <div class="item" v-for="(item,i) in statisticsList" :key="i" @click="toDetail(item.url)">
          <img class="ioc" :src="item.src" :alt="item.name">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tool } from '../../utils/common'

export default {
  mixins:[tool],
  data () {
    return {
      taskList:[
        {name:'待派发',src:'/static/images/index/distribute.png',url:'/pages/task/index'},
        {name:'已派发',src:'/static/images/index/distribution.png',url:'/pages/task/index'},
        {name:'待出车',src:'/static/images/index/waiting-departure.png',url:'/pages/task/index'},
        {name:'待接人',src:'/static/images/index/picked-up.png',url:'/pages/task/index'},
        {name:'待送达',src:'/static/images/index/served.png',url:'/pages/task/index'},
      ],
      operationList:[
        {name:'司机管理',src:'/static/images/index/driver.png',url:'/pages/driver/index'},
        {name:'车辆管理',src:'/static/images/index/car.png',url:'/pages/vehicle/index'},
        {name:'人车绑定',src:'/static/images/index/man-car.png',url:'/pages/vehicleDriverBinding/index'},
        {name:'加油管理',src:'/static/images/index/oil.png',url:'/pages/oil/index'},
        {name:'事故管理',src:'/static/images/index/accident.png',url:'/pages/vehicle/index'},
        {name:'维修管理',src:'/static/images/index/repair.png',url:'/pages/vehicle/index'}
      ],
      statisticsList:[
        {name:'任务管理',src:'/static/images/index/task-statistics.png',url:'/pages/task/index'},
        {name:'考勤管理',src:'/static/images/index/time-statistics.png',url:'/pages/task/index'},
      ]
    }
  },
  methods: {
    toDetail(url,i){
      wx.navigateTo({ url:i?url+'?type='+i: url});
    },
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
  @import './index.css'
</style>