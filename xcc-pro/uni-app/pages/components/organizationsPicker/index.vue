<template>
    <div class="selectOrganizations">
		<div class="navBar padding" >
			<scroll-view scroll-x="true" class="scroll" style="height: 35px;" :scroll-left="scrollLeft">
				<view class="li" :class="i == navBarLeg?'ungray':''" v-for="(item,i) in navBar" :key="i" @click="onChangeNavBar(item,i)">{{item.name}}<img v-if="i != navBarLeg" class="more" src="/static/images/more.png" alt=""></view>
			</scroll-view>
		</div>
		<ul class="data-list" ref="dataList">
			<radio-group class="radio-group" @change="radioChange">
				<li v-for="(item,i) in list" :key="i">
					<label class="radio">
						<radio :value="item.id" :checked="item.checked"/>
					</label>
					<p @click="onChangeList(item)">{{item.name}}<img v-if="item.children.length" class="more" src="/static/images/more.png" alt=""></p>
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
import { tool } from '../../../utils/common'

export default {
	mixins:[tool],
	data(){
		return {
			listUrl:'admin/organization/tree',
			list:[],
			navBar:[{name:'全部',id:'all'}],
			activeId:'',
			time:null,
			scrollLeft:0,
			organization:{},
			renderPageIndex:0,
			flag:false
		}
	},
	computed:{
		navBarLeg(){
			return this.navBar.length - 1
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
					this.organization = {
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
			if(!item.children.length) return;
			console.log(this.$refs)
			// this.$refs.dataList.$el.scrollTop = 0;
			this.setList(item)
			this.navBar.push(item)
			const $this = this
			this.$nextTick(function(){
				wx.createSelectorQuery().selectAll('.scroll,.ungray').boundingClientRect(function (rect) {
					if(rect[1].right + rect[1].width > rect[0].width){
						$this.scrollLeft = rect[1].right + rect[1].width - rect[0].width
					}
				}).exec()
			})
		},
		setList(item){
			if(item.id === 'all'){
				this.list = deepClone(this.copyList)
			}else{
				if(!item.children.length) return
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
			if(this.organization.id && this.organization.name){
				this.$bus.$emit('changeOrganization',this.organization);
				this.goback();
			}else if(this.activeId && !this.organization.id && !this.organization.name){
				this.goback();
			}else{
				this.showToast('请选择组织！');
			}
		},
		onCancel(){
			this.goback();
		},
		getList(){
			get({
				url:this.listUrl,
				data:{
					noManager:"noManager"
				}
			}).then(res=>{
				if(res.status == 0){
					this.copyList = res.data
					this.list = res.data
				}
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
