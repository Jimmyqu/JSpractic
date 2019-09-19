<script>
export default {
	onLaunch: function() {
		const token = uni.getStorageSync('token')
		if(token){
		  this.$store.state.token = token
		  this.$store.dispatch('getUserInfo')
		}else{
		   uni.reLaunch({
			  url: '/pages/index/index'
			})
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
  @import './index.css'
/*每个页面公共css */ 
</style>
