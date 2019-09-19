<template>
  <div class="container">
    <div class="total padding">
      <p class="tol">总计：{{listCount}} | 全部</p>
    </div>
    <div class="data-list shadow padding" v-for="(item,i) in list" :key="i">
      <p>{{item.createTime}}<span :style="{color:item.typeText == '绑定'? '#4dc073':'red'}">{{item.typeText}}</span></p>
      <p >{{item.plate}} | {{item.vehicleModelInfoName}} | {{item.colorText}}</p>
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
import { tool,pullRefresh } from '../../../utils/common'

export default {
  mixins:[tool,pullRefresh],
  data () {
    return {
	  searchParam:{},
	  detail:{},
      list:[],
      listUrl:'operation_app/driverVehicleBinding/bindingRecord',
    }
  },
  onShow(){
	this.searchParam.driverId = this.$root.$mp.query.id;
    this.getList();
  },
}
</script>

<style lang="scss" scoped>
  @import './index.css';
  .container{
	  padding-top: 42px;
  }
  .total{
	  top : 0;
  }
</style>