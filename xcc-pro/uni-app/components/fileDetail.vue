<template>
  <div class="up-load">
        <div v-if='!fileList.length'>
            暂无图片！
        </div>
        <scroll-view v-else :scroll-x="true" class="scroll" style="width: 100%;">
            <span v-for="(file,i) in fileList" :key="i" >
                <img :src="file.filedomain+file.path" v-if="file.path" @click="onDetail(file)">
            </span>
        </scroll-view>
  </div>
</template>

<script>
export default {
  props: {
    fileList: {
        type: Array,
        default(){
            return []
        },
    },
  },
  data() {
      return {
          urls:[]
      }
  },
  watch: {
      fileList(val){
          this.urls = val.map( file =>{
              return file.filedomain+file.path
          })
      }
  },
  methods: {
      onDetail(file){
          wx.previewImage({
            current: file.filedomain+file.path, // 当前显示图片的http链接
            urls: this.urls // 需要预览的图片http链接列表
        })
      },
  },
}
</script>

<style lang='scss' scoped>
    .up-load{
        padding: 5px 0;
        width: 100%;
        white-space: nowrap;
        min-height: 70px;
        img{
            width: 70px;
            height: 70px;
            margin-right: 10px;
        }
    }
</style>
