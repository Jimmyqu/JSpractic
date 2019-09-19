<template>
  <div class="paddingTop-102 container">
    <div class="serach padding shadow">
      <input ref="searchInput" class="input" :focus="focus" confirm-type="search" @confirm="search" v-model="searchParam.plate" placeholder="请输入车牌号">
      <icon class="icon" type="search" size="20" @click="search"/>
      <icon v-show="searchParam.plate" class="clear" type="clear" size="15" @click="clear" color="#ccc"/>
    </div>
    <div class="total padding">
      <p class="tol">总计：{{listCount}} | 全部</p>
      <div class="operation">
        <!-- <p class="screen">筛选</p> -->
        <p class="screen add" @click="toDetail('/pages/vehicle/add/index')">新增+</p>
      </div>
    </div>
    <div class="data-list shadow padding" v-for="(item,i) in list" :key="i" @click="toDetail('/pages/vehicle/detail/index',item.id)">
      <p>{{item.plate}}（{{item.color}}）<span>{{item.taskStatusText}}</span></p>
      <p class="modelName">{{item.modelName}}</p>
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
      listUrl:'operation_app/appVehicle/list',
      taskType:{
        0:'休闲中',
        1:'任务中',
        2:'休假中'
      }
    }
  },
  methods: {
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