<template>
  <div class="container paddingTop">
	  <ul class="swiper-nav shadow">
	  	<li v-for="(nav,i) in navList" :key="i" :class="activeIndex == i ? 'isActive':''" @click="changeActive(i)">{{nav}}</li>
	  </ul>
     <swiper class="swiper" :current="activeIndex" @animationfinish="animationfinish">
		<swiper-item>
			<ul class="data-list" @scroll="scroll">
				<li class="shadow padding" v-for="(item,i) in list" :key="i" @click="toDetail('/pages/vehicle/detail/index',item.id)">
					<p>{{item.oilTime}}<span>{{item.driverName}} | {{item.plate}}</span></p>
					<p>{{item.oilArea}}</p>
					<div calss="photo">
						<fileDetail :fileList="fileList(item)"></fileDetail>
					</div>
				</li>
			</ul>
		</swiper-item>
		<swiper-item>
			<ul class="data-list">
				<li class="shadow padding" v-for="(item,i) in list" :key="i" @click="toDetail('/pages/vehicle/detail/index',item.id)">
					<p>{{item.oilTime}}<span>{{item.driverName}} | {{item.plate}}</span></p>
					<p>{{item.oilArea}}</p>
					<div calss="photo">
						<fileDetail :fileList="fileList(item)"></fileDetail>
					</div>
				</li>
			</ul>
		</swiper-item>
	</swiper>
  </div>
</template>

<script>
import { tool,pullRefresh } from '../../utils/common'
import fileDetail from '@/components/fileDetail'

export default {
  mixins:[tool,pullRefresh],
  components:{ fileDetail },
  data () {
    return {
	  searchParam:{
		  plate:''
	  },
      list:[],
	  navList:['未确认','已确认'],
      listUrl:'operation_traffic/oilManage',
	  activeIndex: 0,
    }
  },
  methods: {
	resetSearchParamKey(){
		this.searchParam.plate = ''
	},
	scroll(e){
		console.log(e)
	},
	changeActive(i){
		this.activeIndex = i
	},
	animationfinish(e){
		this.activeIndex = e.target.current;
	},
	fileList(item){
		let fileList = [];
		if(item.dashboardImgBefore){
			fileList.push(JSON.parse(item.dashboardImgBefore))
		}
		if(item.dashboardImgAfter){
			fileList.push(JSON.parse(item.dashboardImgAfter))
		}
		if(item.invoiceImg){
			fileList.push(JSON.parse(item.invoiceImg))
		}
		return fileList
	}
  },
  onLoad(){ 
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
  // @import './index.css'
  .swiper-nav{
	  position: fixed;
	  top: 0;
	  height: 45px;
	  z-index: 99;
	  display: flex;
	  justify-content: space-between;
	  width: 100%;
	  background: #fff;
	  li{
		  width: 50%;
		  text-align: center;
		  position: relative;
		  line-height: 45px;
		  height: 45px;
	  }
	  li.isActive{
		color: #0091FF;
		border-bottom: 2px solid #0091FF;
	  }
  }
  .swiper{
	  height: calc(100vh - 60px);
  }
  .data-list{
	  height: 100%;
	  overflow-y: auto;
	  li{
		  margin-bottom: 16px;
		  padding-top: 10px;
		  p{
			  margin-bottom: 6px;
			  span{
				  float: right;
			  }
		  }
	  }
  }
</style>