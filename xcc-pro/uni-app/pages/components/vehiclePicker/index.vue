<template>
  <div class="paddingTop container">
    <div class="serach padding shadow">
      <input ref="searchInput" class="input" :focus="focus" confirm-type="search" @confirm="search" v-model="searchParam.plate" placeholder="请输入车牌号">
      <icon class="icon" type="search" size="20" @click="search"/>
      <icon v-show="searchParam.plate" class="clear" type="clear" size="15" @click="clear" color="#ccc"/>
    </div>
    <div class="data-list shadow padding" v-for="(item,i) in list" :key="i" @click="selectVehicle(item)">
      <p>{{item.plate}}</span></p>
      <p class="modelName">{{item.vehicleModelInfoName}}</p>
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
		searchParam:{
			plate:''
		},
		list:[],
		listUrl:'operation_app/driverVehicleBinding/vehicleList',
    }
  },
  methods: {
	selectVehicle(vehicle){
		this.$bus.$emit('vehicleInfo',vehicle);
		this.goback();
	},
	resetSearchParamKey(){
		this.searchParam.plate = ''
	},
  },
  onShow(){
	this.searchParam.companyId = this.$root.$mp.query.id
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
.container{
    .data-list{
        margin-bottom: 10px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p{
            font-size:15px;
            color:rgba(0,0,0,1);
            span{
                float: right;
                font-size:15px;
                font-weight:400;
                color:rgba(77,192,115,1);
            }
        }
        .modelName{
            margin-top: 16px;
        }
    }
}
</style>