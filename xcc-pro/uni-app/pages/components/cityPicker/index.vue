<template>
    <div class="selectCity">
		<div class="navBar padding" v-show="list.length">
			<scroll-view scroll-x="true" class="scroll" style="height: 100%;" :scroll-left="scrollLeft">
				<view class="li" :class="{'ungray':i == navBar.length -1}" v-for="(item,i) in navBar" :key="i" @click="onChangeNavBar(item,i)">{{item.pname?item.pname:item.name}}<img v-show="i != navBar.length -1" class="more" src="/static/images/more.png" alt=""></view>
			</scroll-view>
		</div>
		<ul class="data-list">
			<radio-group class="radio-group" @change="radioChange">
				<li v-for="(item,i) in list" :key="i" :style="{paddingLeft:item.id?0:'16px'}">
					<label class="radio">
						<radio v-show="item.id" :value="item.id" :checked="item.checked"/>
					</label>
					<p @click="item.children && item.children.length?onChangeList(item):false">{{item.pname?item.pname:item.name}}<img v-show="item.children && item.children.length" class="more" src="/static/images/more.png" alt=""></p>
				</li>
			</radio-group>
		</ul>
		<div class="operation padding">
			<button class="cancel" @click="onCancel">取消</button>
			<button type="primary" @click="onOk" >确定</button>
		</div>
    </div>
</template>

<script>
import { get, post } from '../../../utils/request'
import { deepClone } from '../../../utils/index'
import bus from '../../../utils/bus'
import { tool } from '../../../utils/common'

export default {
	mixins:[tool],
	data(){
		return {
			listUrl:'admin/dict/cityTree',
			list:[],
			navBar:[{pname:'全部',pid:'all'}],
			activeId:'',
			time:null,
			scrollLeft:0,
			city:{},
			renderPageIndex:0,
			flag:false
		}
	},
	methods: {
		radioChange(e){
			if(this.flag) return
			setTimeout(()=>{
				this.flag = false
			},300)
			let item = e.target.value
			this.list.forEach(_item=>{
				if(_item.id == item){
					this.activeId = item
					this.city = {
						id:_item.id,
						name:_item.name
					}
					_item.checked = true
				}else{
					_item.checked = false
				}
			})
		},
		onChangeNavBar(item,i){
			if(i == this.navBar.length -1) return
			this.setList(item)
			this.navBar.splice(i+1)
		},
		onChangeList(item){
			this.setList(item)
			this.navBar.push(item)
			const $this = this
			wx.createSelectorQuery().selectAll('.scroll,.ungray').boundingClientRect(function (rect) {
				if(rect[1].right + rect[1].width > rect[0].width){
					$this.scrollLeft = rect[1].right + rect[1].width - rect[0].width
				}
			}).exec()  
		},
		setList(item){
			if(item.pid === 'all'){
				this.list = deepClone(this.copyList)
			}else{
				if(item.children && !item.children.length) return
				this.list = item.children
			}
			this.setChecked()
		},
		setChecked(){
			let time = this.list.length > 100 ? 1000 : this.list.length * 10
			clearTimeout(this.time)
			wx.showLoading({
				title: '加载中',
			})
			this.list.map(_item=>{
				if(_item.id == this.activeId){
					_item.checked = true;
				}else{
					_item.checked = false;
				}
			})
			this.time = setTimeout(function () {
				wx.hideLoading()
			}, time)
		},
		onOk(){
			if(this.city.id && this.city.name){
				bus.$emit('changeCity',this.city);
				this.goback();
			}else if(this.activeId && !this.city.id && !this.city.name){
				this.goback();
			}else{
				this.showToast('请选择城市！');
			}
		},
		onCancel(){
			this.goback();
		},
		getList(){
			get({url:this.listUrl}).then(res=>{
				this.copyList = res;
				this.list = res;
			})
		},
		reset(){
	        Object.assign(this, this.$options.data())
		},
	},
	onLoad(){
		if(this.$root.$mp.query.id){
			this.activeId = this.$root.$mp.query.id;
		}
		this.getList();
	},
	onUnload(){
		this.reset()
	}
}
</script>

<style lang="scss" scoped>
    @import './index.css'
</style>
