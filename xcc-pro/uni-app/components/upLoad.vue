<template>
  <div class="up-load">
        <span v-for="(file,i) in list" :key="i" >
            <img :src="file.filedomain+file.path" v-if="file.path" @click="upLoad(i)" @longpress="onDetele(i)">
        </span>
        <img src="/static/images/add.png" alt="新增图片" v-if="!list.length || size != list.length" @click="upLoad(false)">
  </div>
</template>

<script>
import config from '../utils/config'
export default {
  props: {
    fileList: {
        type: Array,
        default(){
            return []
        },
    },
    size:Number
  },
  data() {
      return {
		  list:[]
      }
  },
  watch:{
	  fileList:{
		  handler(val, oldVal) {
			  console.log(val);
			  this.list = val
		  },
		  deep: true,
		  immediate: true
	  }
  },
  methods: {
      onDetele(i){
          const $this = this
          uni.showModal({
            title: '提示',
            content: '确定删除吗？',
            success (res) {
                if (res.confirm) {
					$this.list.splice(i,1);
                } else if (res.cancel) {

                }
            }
        })
      },
      upLoad(i){
          const $this = this
          uni.chooseImage({
            count: i === false?$this.size - $this.list.length:1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                for(let k =0;k<tempFilePaths.length;k++){
                    uni.uploadFile({
                        url: config.BASE_API + 'file/upload/multipart',
                        filePath: tempFilePaths[k],
                        name: 'file',
                        header:{
                            Authorization: 'Bearer ' + $this.$store.state.token
                        },
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            if(res.statusCode == 200){
                                const obj = JSON.parse(res.data);
                                if(obj.status == 0 && i === false){
                                    $this.list.push(obj.data)
                                }else{
                                     $this.list.splice(i,1,obj.data);
                                }
                                $this.$emit("update:fileList", $this.list);
                            }else{
                                $this.showToast('上传失败！')
                            }
                        }
                    })
                }
            }
        })
      },
  },
}
</script>

<style lang='scss' scoped>
    .up-load{
        padding: 5px 0;
        img{
            width: 70px;
            height: 70px;
            margin-right: 10px;
        }
    }
</style>
