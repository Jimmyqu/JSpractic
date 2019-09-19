<template>
	<div class="paddingTop-102 container">
		<div class="serach padding shadow">
			<input ref="searchInput" class="input" :focus="focus" confirm-type="search" @confirm="search" v-model="searchParam.driver"
			 placeholder="请输入司机姓名/手机号">
			<icon class="icon" type="search" size="20" @click="search" />
			<icon v-if="searchParam.driver" class="clear" type="clear" size="15" @click="clear" color="#ccc" />
		</div>
		<div class="total padding">
			<p class="tol">总计：{{listCount}} | 全部</p>
			<div class="operation">
				<!-- <p class="screen">筛选</p> -->
				<p class="screen add" @click="toDetail('/pages/driver/add/index')">新增+</p>
			</div>
		</div>
		<div class="data-list shadow padding" v-for="(item,i) in list" :key="i" @click="toDetail('/pages/driver/detail/index',item.id)">
			<p>{{item.name}} <span>{{item.workStatusText}} {{item.workStatusText&& item.taskStatusText ?' | ':''}}
					{{item.taskStatusText}}</span></p>
			<p>{{item.sexText}}</p>
			<p>{{item.phone}}</p>
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
	import {
		tool,
		pullRefresh
	} from '../../utils/common'

	export default {
		mixins: [tool, pullRefresh],
		data() {
			return {
				list: [],
				listUrl: 'operation_app/driverManagement/list',
				taskType: {
					0: '休闲中',
					1: '任务中',
					2: '休假中'
				}
			}
		},
		methods: {
			resetSearchParamKey(){
				this.searchParam.driver = ''
			},
		},
		onShow() {
			this.getList()
		},
	}
</script>

<style lang="scss" scoped>
	@import './index.css'
</style>
