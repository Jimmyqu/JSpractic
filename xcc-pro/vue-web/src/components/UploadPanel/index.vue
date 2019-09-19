<template>
  <div class="upload-panel">
    <template v-if="!showImg">
      <file-detail
        v-for="(file, i) in fileList"
        :key="i"
        :file-name="file.name"
        :file-url="file.path"
        :show-download="true"
        :show-del="!disabled"
        @del="delFile(i)"
      />
    </template>
    <div v-if="showImg" class="img-list" :class="{'flex':flex}">
      <div v-for="(file, i) in fileList" :key="i" class="img-box">
        <img :src="file.filedomain+file.path" @click="showBigImg($event)">
        <i v-if="!disabled" class="el-icon-error" @click="delFile(i)" />
      </div>
    </div>
    <el-upload
      v-if="fileList.length < size && !disabled"
      class="upload"
      :multiple="true"
      :accept="accept"
      :headers="headers"
      :show-file-list="false"
      :action="uploadUrl"
      :before-upload="uploadBefore"
      :on-change="uploadChange"
      :on-error="errorCallback"
      :on-success="success"
      :on-remove="uploadChange"
    >
      <el-button v-if="fileList.length < size" size="mini" type="success" round>点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        <template v-if="!accept">
          支持：.rar .zip .doc .docx .pdf .jpg .png...
        </template>
        <template v-if="accept">
          支持：{{ accept }} 类型文件
        </template>
        <div v-if="size == 5">最多上传5份文件，每份文件最大不超过20M</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import FileDetail from '@/components/FileDetail/index'
import { tool } from '@/utils/common'

export default {
  components: { FileDetail },
  mixins: [tool],
  props: {
    showImg: null,
    accept: String,
    disabled: Boolean,
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    size: Number,
    flex: null
  },
  data() {
    return {
      uploadUrl: !/\/$/.test(process.env.VUE_APP_BASE_API)?process.env.VUE_APP_BASE_API + '/file/upload/multipart':process.env.VUE_APP_BASE_API + 'file/upload/multipart',
      headers: {
        'Authorization': 'Bearer ' + this.$store.getters.token
      },
      type: '',
      successNumber: 0,
      fileSize: 0
    }
  },
  methods: {
    success() {
      this.successNumber += 1
    },
    delFile(i) {
      this.fileList.splice(i, 1)
    },
    uploadBefore(file) {
      // 限制20M
      if (file.size > 1024 * 1024 * 20) {
        this.showMessage('请上传20M以下的文件')
        return false;
      } else if (this.accept && this.accept.toLowerCase().indexOf(file.name.toLowerCase().split('.')[(file.name.toLowerCase().split('.').length - 1)]) == -1) {
          this.showMessage('请上传 ' + this.accept + ' 的文件')
          return false;
      } else {
        this.loading = true;
        // NProgress.start();
        return true;
      }
    },
    uploadChange(file, fileList) {
      if (this.size > 10) {
        this.$emit('update:loading', true);
      }
      this.loading = false;
      if (!file.response) {
        return;
      }
      if (file.response.status == 0) {
        this.fileList.push(file.response.data);
      }
      if (this.size > 10) {
        if (this.successNumber == fileList.length) {
          this.$emit('update:loading', false);
          this.$emit('update:fileList', this.fileList.slice(-this.size));
        }
      } else {
        this.$emit('update:fileList', this.fileList.slice(-this.size));
      }
      // this.list = fileList.slice(-this.size);
    },
    errorCallback() {
      this.loading = false;
      this.$emit('error');
      // NProgress.done();
    }
  }
}
</script>
<style>
    .upload-panel {
        max-width: 100%;
    }
    .upload-panel .upload,
    .upload-panel .el-upload__tip {
        margin-top: 3px;
        line-height: initial;
    }
    .upload-panel .img-list {
        margin: 10px 0;
    }
    .upload-panel .img-list.flex{
        display: flex;
    }
    .upload-panel .img-list:empty {
        display: none;
    }
    .upload-panel .img-box {
        width: 80px;
        height: 80px;
        position: relative;
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
    }
    .upload-panel .img-box .el-icon-error {
        position: absolute;
        right: -7px;
        top: -7px;
        background: #fff;
        border-radius: 50%;
    }
    .upload-panel .img-box img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }
</style>
