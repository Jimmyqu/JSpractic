<template>
  <div class="paddingTop-102 container">
    <div class="serach padding shadow">
      <input ref="searchInput" class="input" :focus="focus" confirm-type="search" @confirm="search" v-model="searchParam.plate" placeholder="请输入司机姓名/手机号/车牌号">
      <icon class="icon" type="search" size="20" @click="search"/>
      <icon v-show="searchParam.plate" class="clear" type="clear" size="15" @click="clear" color="#ccc"/>
    </div>
    <div class="total padding">
      <p class="tol">总计：{{listCount}} | 全部</p>
    </div>
    <div class="data-list shadow padding" v-for="(item,i) in list" :key="i" @click="toDetail(item)">
      <p>{{item.name}}<span :style="{color:item.vehicleId? '#4dc073':'#666'}">{{item.bindStatusText}}</span></p>
      <p >{{item.sexText}}</p>
      <p >{{item.phone}}</p>
      <p v-if="item.vehicleId">{{item.plate}}</p>
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
	  searchParam:{
		  plate:''
	  },
      list:[],
      listUrl:'operation_app/driverVehicleBinding/list',
    }
  },
  methods: {
	  toDetail(item){
	      wx.navigateTo({url:`/pages/vehicleDriverBinding/detail/index?id=${item.id}&vehicleId=${item.vehicleId}`});
	  },
	resetSearchParamKey(){
		this.searchParam.plate = ''
	},
  },
  onShow(){
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
  @import './index.css'
</style>