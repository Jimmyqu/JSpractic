<template>
    <div class="distributePicker paddingTop">
        <div class="serach padding shadow">
        	<input ref="searchInput" class="input" :focus="focus" confirm-type="search" @confirm="search" v-model="searchParam.driver" placeholder="请输入司机姓名/手机号">
        	<icon class="icon" type="search" size="20" @click="search"/>
        	<icon v-if="searchParam.driver" class="clear" type="clear" size="15" @click="clear" color="#ccc"/>
        </div>
		<div class="total padding">
			<p class="tol">总计：{{listCount}}</p>
		</div>
        <ul class="list">
			<li v-for="(driver,i) in list" :key="driver.id" @click="onSubmit(i)">
				<div class="shadow" :class="driver.bindStatus == 2 && (driver.taskStatus == 1 || driver.taskStatus == 2) && (driver.serviceStatus == 1 || driver.serviceStatus == 4)?'':'notOptional'">
					<p>{{driver.driverName}} | {{driver.sex ==1?'男':'女'}}<span>{{driver.bindStatus == 2 && (driver.taskStatus == 1 || driver.taskStatus == 2) && (driver.serviceStatus == 1 || driver.serviceStatus == 4)?'可选':'不可选'}}</span></p>
					<p>{{driver.driverPhone}}<span>{{driver.plate || ''}}</span></p>
				</div>
			</li>
        </ul>
		<div v-if="list.length && list.length >= listCount" class="noData">
			到底啦~
		</div>
		<div v-if="!list.length" class="noData">
			暂无数据~
		</div>
    </div>
</template>
<script>
import { get, post } from '../../../utils/request'
import { deepClone } from '../../../utils/index'
import { tool,pullRefresh } from '../../../utils/common'
import bus from '../../../utils/bus'

export default {
	props:["driver"],
	mixins:[tool,pullRefresh],
	data(){
		return {
			listUrl:'operation_core/assignment/driver/list',
			searchParam:{
				driver:''
			},
		}
	},
	watch: {
	
	},
	methods: {
		getListBefore(params){
			params.id = this.$root.$mp.query.id;
		},
		onSubmit(i){
			const item = this.list[i]
			if(item.bindStatus == 2 && (item.taskStatus == 1 || item.taskStatus == 2) && (item.serviceStatus == 1 || item.serviceStatus == 4)){
				bus.$emit('changeDriver',item);
				this.goback();
			}else{
				return
			}
		},
		reset(){
	        Object.assign(this, this.$options.data())
		},
	},
	mounted() {
		this.getList()
	},
	onUnload(){
        this.reset()
	}
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>