<template>
    <div class="show-info" style="margin-top: 15px;">
        <div class="cropper-default" v-show="!option.img">
            <div class="default">
                <img :src="cropperSrc?cropperSrc:'static/img/logo1.png'" alt="logo">
            </div>
        </div>
        <div class="cropper-content" v-show="option.img">
            <div class="cropper">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    :enlarge="option.enlarge"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                ></vueCropper>
            </div>
            <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img">
            </div>
            </div>
        </div>
        <div class="footer-btn">
            <div class="scope-btn">
            <label class="btn" for="uploads">更换图片</label>
            <input ref="uploadFile" type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png" @change="uploadImg($event, 1)">
            <el-button v-show="option.img" @click="changeScale(1)">+</el-button>
            <el-button v-show="option.img" @click="changeScale(-1)">-</el-button>
            <el-button v-show="option.img" @click="clear">取消</el-button>
            </div>
        </div>
        <div>
            上传图片要求<br>

            1. 图片颜色为白色，无背景色<br>

            2. 图片格式仅支持PNG格式<br>

            3. 图片尺寸为130*50px，大小不超过2M
        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { VueCropper }  from 'vue-cropper' 
    import $ from 'jquery-slim'

    export default {
        name: 'editor-cropper',
        components: { VueCropper },
        props: {
            options: {
                type:Object,
                default(){
                    return {}
                }
            },
            path:String,
        },
        watch: {
           options:{
               handler(val){
                   console.log(val)
               }
           },
            path:{
                handler(val){
                    this.cropperSrc = val
                    console.log(val)
                }
            }
        },
        data() {
            return {
                option:{
                    img:'',
                    size:1,
                    outputType:'png',
                    full:false,
                    canMove:true,
                    canMoveBox:true,
                    fixedBox:false,
                    original:true,
                    autoCrop:true,
                    autoCropWidth:135,
                    autoCropHeight:50,
                    centerBox:true,
                    high:true,
                    infoTrue:true,
                    enlarge:2
                },
                previews:{},
                flag:true,
                fileName:'',
                cropperSrc:''
            };
        },
        methods: {
             startCrop() {
                if (!this.flag || !this.fileName) {
                    this.$message({
                            message: '请更换图片',
                            type: 'error'
                        });
                        return false
                }
                this.flag = false
                let _this = this;
                let formData = new FormData();
                this.$refs.cropper.getCropBlob(data => {
                    let img = window.URL.createObjectURL(data) 
                    formData.append('file', data, _this.fileName,'.png')
                    this.upload(formData)
                })
            },
            upload(data){
                ajax.post('file/upload/multipart', data).then(rs => {
                    if (rs.status == 0) {
                        this.flag = true
                        localStorage.logoUrl = rs.data.filedomain + rs.data.path
                        this.cropperSrc = rs.data.filedomain + rs.data.path
                        // this.$store.dispatch('setLogoUrl', rs.data.filedomain + rs.data.path)
                        this.$emit("file", this.cropperSrc);
                        this.clear()
                    }else{
                        this.$message({
                            message: rs.msg,
                            type: 'error'
                        });
                    }
                });
            },
            realTime (data) { 
                this.previews = data
            }, 
            imgLoad(){

            },
            cropMoving(){

            },
            uploadImg(e,num){
                //上传图片 
                // this.option.img
                let file = e.target.files[0]
                this.fileName = file.name;
                if (!/\.png$/.test(e.target.value)) {
                    this.$message({
                        message: '图片类型必须是.png格式',
                        type: 'error'
                    });
                    return false
                }
                if(file.size > (2 * 1024 * 1024)){
                    this.$message({
                        message: '图片大小不超过2M',
                        type: 'error'
                    });
                    return false
                }
                let reader = new FileReader()
                reader.onload = (e) => {
                    let data;
                    if (typeof e.target.result === 'object') { 
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result])) 
                    } else { 
                        data = e.target.result 
                    } 
                    if (num === 1) { 
                        this.option.img = data
                    } else if (num === 2) { 
                        this.example2.img = data 
                    } 
                } 
                // 转化为base64 
                // reader.readAsDataURL(file) 
                // 转化为blob 
                reader.readAsArrayBuffer(file)
            }, 
            imgLoad (msg) {
                if(msg == 'success'){

                }
            },
            clear(){
                this.option.img = '';
                this.$refs.uploadFile.value=null;
                this.fileName = '';
            },
            refreshCrop(){

            },
            changeScale(num){
                num = num || 1 
                this.$refs.cropper.changeScale(num) 
            },
        },
    }
</script>

<style scoped lang="scss">
.cropper-default{
    margin-top: 15px;
    width: 250px;
    height: 100px;
    display: flex;
    align-items: center;
  .default{
      background-color: #0a4895;
        width: 180px;
        height: 52px;
        background-size:100%;
        margin: auto;
        border: 1px solid #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width: 135px;
            height: auto;
        }
  }
}
 .cropper-content{
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  .cropper{
    width: 450px;
    height: 300px;
  }
  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    .preview{
      overflow: hidden;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.footer-btn{
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
  .scope-btn{
    width: 350px;
    display: flex;
    display: -webkit-flex;
    .el-button{
        padding: 5px 13px;
    }
  }
  .upload-btn{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }
  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin-right: 10px;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
}
</style>
