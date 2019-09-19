<template>
	<div class="container paddingTop">
		<div class="serach padding shadow">
		  <input ref="searchInput" class="input" :focus="focus" v-model="word" placeholder="请输入城市">
		  <icon class="icon" type="search" size="20" @click="search"/>
		  <icon v-show="word" class="clear" type="clear" size="15" @click="clear" color="#ccc"/>
		</div>
		<scroll-view class="wrap" @scroll="scroll" :scroll-y="true">
			<div v-for="(item,i) in list" :key="i" class="province">
				<span class="padding province-name" v-if="scrollTop > 0 && index == i" :style="{position:scrollTop > 0 && index == i?'fixed':''}">{{item.pname}}</span>
				<span class="padding">{{item.pname}}</span>
				<ul class="city-wrap padding">
					<li v-for="(city,j) in item.children" :key="j" @click="changeCity(city)">{{city.name}}</li>
				</ul>
			</div>
		</scroll-view>
	</div>
</template>

<script>
	import { tool } from '../../../utils/common'
	export default {
		mixins: [tool],
		data() {
			return {
				word:'',
				listUrl: 'admin/dict/cityTree',
				list: [],
				scrollTop: 0,
				index: 0,
				copyList:[]
			}
		},
		watch:{
			word(val){
				this.search(val)
			}
		},
		methods: {
			search(val){
				let _array = [];
				this.copyList.forEach(item=>{
					let children = [];
					if(item.pname.indexOf(val) !== -1){
						children = item.children
					}else{
						children = item.children.filter(city=>{
							if(!val) return true
							return city.name.indexOf(val) !== -1
						})
					}
					if(children.length){
						_array.push({
							pid:item.pid,
							pname:item.pname,
							children
						})
					}
				})
				this.list = _array;
			},
			clear(){
				this.word = "";
				this.search();
			},
			changeCity(city) {
				this.$bus.$emit('changeCity', city);
				this.goback();
			},
			getList() {
				this.$ajax.get({
					url: this.listUrl
				}).then(res => {
					this.list = res;
					this.copyList = res;
				})
			},
			scroll(e) {
				const $this = this;
				var query = wx.createSelectorQuery(); //创建选择器
				query.selectAll('.province').boundingClientRect(function(rect) {
 					let index = 0;
					for (var i = 0; i < rect.length; i++){
						if(i == 0 && e.target.scrollTop<rect[0].height){
							$this.index = 0;
						}else if(e.target.scrollTop >= index - 12){
							$this.index = i;
						}
						index += rect[i].height
					}
				}).exec();
				this.scrollTop = e.target.scrollTop;
			}
		},
		onLoad() {
			this.getList();
		},
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: calc(100vh - 60px);
		.province {
			line-height: 34px;
			span {
				font-weight: bold;
				font-size: 14px;
			}
			.province-name {
				display: block;
				top: 60px;
				width: 100%;
				background: #F8FBFF;
			}
		}

		.city-wrap {
			background: #fff;

			li {
				line-height: 42px;

				uni-icon {
					float: right;
				}
			}

			li:last-child {
				border-bottom: none;

			}
		}
	}
</style>
