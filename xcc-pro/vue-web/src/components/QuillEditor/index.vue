<template>
  <div>
    <!-- 图片上传组件辅助-->
    <el-upload
      style="display: none;"
      class="avatar-uploader"
      :action="serverUrl"
      name="file"
      accept=".jpg,.jpeg,.png"
      :headers="header"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    />
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      v-loading="loading"
      style="max-height: 350px; height: 350px"
      class="editer"
      :options="editorOption"
      @change="onEditorChange($event)"
    >
      <div id="toolbar" slot="toolbar">
        <span class="ql-formats">
          <button type="button" class="ql-bold" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-italic" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-underline" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-strike" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-blockquote" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-code-block" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-header" value="1" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-header" value="2" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="ordered" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="bullet" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-script" value="sub" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-script" value="super" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-indent" value="-1" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-indent" value="+1" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-direction" value="rtl" />
        </span>
        <span class="ql-formats"><select class="ql-size">
          <option value="small">10px</option>
          <option selected>14px</option>
          <option value="large">18px</option>
          <option value="huge">32px</option>
        </select></span>
        <span class="ql-formats"><select class="ql-header">
          <option value="1" />
          <option value="2" />
          <option value="3" />
          <option value="4" />
          <option value="5" />
          <option value="6" />
          <option selected="selected" />
        </select></span>
        <span class="ql-formats"><select class="ql-color">
          <option selected="selected" />
          <option value="#e60000" />
          <option value="#ff9900" />
          <option value="#ffff00" />
          <option value="#008a00" />
          <option value="#0066cc" />
          <option value="#9933ff" />
          <option value="#ffffff" />
          <option value="#facccc" />
          <option value="#ffebcc" />
          <option value="#ffffcc" />
          <option value="#cce8cc" />
          <option value="#cce0f5" />
          <option value="#ebd6ff" />
          <option value="#bbbbbb" />
          <option value="#f06666" />
          <option value="#ffc266" />
          <option value="#ffff66" />
          <option value="#66b966" />
          <option value="#66a3e0" />
          <option value="#c285ff" />
          <option value="#888888" />
          <option value="#a10000" />
          <option value="#b26b00" />
          <option value="#b2b200" />
          <option value="#006100" />
          <option value="#0047b2" />
          <option value="#6b24b2" />
          <option value="#444444" />
          <option value="#5c0000" />
          <option value="#663d00" />
          <option value="#666600" />
          <option value="#003700" />
          <option value="#002966" />
          <option value="#3d1466" />
        </select></span>
        <span class="ql-formats"> <select class="ql-background">
          <option value="#000000" />
          <option value="#e60000" />
          <option value="#ff9900" />
          <option value="#ffff00" />
          <option value="#008a00" />
          <option value="#0066cc" />
          <option value="#9933ff" />
          <option selected="selected" />
          <option value="#facccc" />
          <option value="#ffebcc" />
          <option value="#ffffcc" />
          <option value="#cce8cc" />
          <option value="#cce0f5" />
          <option value="#ebd6ff" />
          <option value="#bbbbbb" />
          <option value="#f06666" />
          <option value="#ffc266" />
          <option value="#ffff66" />
          <option value="#66b966" />
          <option value="#66a3e0" />
          <option value="#c285ff" />
          <option value="#888888" />
          <option value="#a10000" />
          <option value="#b26b00" />
          <option value="#b2b200" />
          <option value="#006100" />
          <option value="#0047b2" />
          <option value="#6b24b2" />
          <option value="#444444" />
          <option value="#5c0000" />
          <option value="#663d00" />
          <option value="#666600" />
          <option value="#003700" />
          <option value="#002966" />
          <option value="#3d1466" />
        </select></span>
        <span class="ql-formats"><select class="ql-font">
          <option selected="selected">标准字体</option>
          <option value="serif">衬线字体</option>
          <option value="monospace">等宽字体</option>
        </select></span>
        <span class="ql-formats">
          <select class="ql-align">
            <option selected="selected" />
            <option value="center" />
            <option value="right" />
            <option value="justify" />
          </select>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-clean" />
        </span>
        <span class="ql-formats">
          <button type="button" @click="fileClick('voice')">
            <img src="/static/img/voice.png" style="width: 100%">
          </button>
        </span>
        <span class="ql-formats">
          <button type="button" @click="fileClick('image')">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="10" width="12" x="3" y="4" />
              <circle class="ql-fill" cx="6" cy="7" r="1" />
              <polyline
                class="ql-even ql-fill"
                points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"
              />
            </svg>
          </button>
        </span>
        <span class="ql-formats" @click="fileClick('video')">
          <button type="button">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="12" width="12" x="3" y="3" />
              <rect class="ql-fill" height="12" width="1" x="5" y="3" />
              <rect class="ql-fill" height="12" width="1" x="12" y="3" />
              <rect class="ql-fill" height="2" width="8" x="5" y="8" />
              <rect class="ql-fill" height="1" width="3" x="3" y="5" />
              <rect class="ql-fill" height="1" width="3" x="3" y="7" />
              <rect class="ql-fill" height="1" width="3" x="3" y="10" />
              <rect class="ql-fill" height="1" width="3" x="3" y="12" />
              <rect class="ql-fill" height="1" width="3" x="12" y="5" />
              <rect class="ql-fill" height="1" width="3" x="12" y="7" />
              <rect class="ql-fill" height="1" width="3" x="12" y="10" />
              <rect class="ql-fill" height="1" width="3" x="12" y="12" />
            </svg>
          </button>
        </span>
        <span class="ql-formats" />
      </div>
    </quill-editor>
    <el-dialog
      title="上传"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-upload
        class="upload-demo"
        drag
        :action="serverUrl"
        name="file"
        :accept="accept"
        :headers="header"
        :show-file-list="true"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :before-upload="beforeUpload"
        :on-progress="onUpload"
        :multiple="false"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传{{ accept }}文件，且不超过100M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>

import { Quill, quillEditor } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

const BlockEmbed = Quill.import('blots/block/embed')
/* 定义video标签*/
class VideoBlot extends BlockEmbed {
  static create(url) {
    const node = super.create()
    node.setAttribute('src', url)
    node.setAttribute('controls', 'controls')
    node.setAttribute('style', 'max-width:500px')
    return node
  }
  static value(node) {
    return node.getAttribute('src')
  }
}
VideoBlot.blotName = 'video'
VideoBlot.tagName = 'video'
Quill.register(VideoBlot)

/* 定义voice标签*/
class VoiceBlot extends BlockEmbed {
  static create(url) {
    const node = super.create()
    node.setAttribute('src', url)
    node.setAttribute('controls', 'controls')
    node.setAttribute('draggable', 'true')
    return node
  }
  static value(node) {
    return node.getAttribute('src')
  }
}
VoiceBlot.blotName = 'voice'
VoiceBlot.tagName = 'audio'
Quill.register(VoiceBlot)
export default {
  name: 'MyEditor',
  components: {
    quillEditor
  },
  props: {
    /* 编辑器的内容*/
    value: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      content: this.value,
      uploadType: 'image',
      accept: '.mp4,.avi,.rmvb',
      /* 加载框*/
      loading: false,
      editorOption: {
        placeholder: '',
        theme: 'snow',
        placeholder: '请输入文本内容',
        modules: {
          toolbar: {
            container: '#toolbar'
          },
          imageDrop: true,
          imageResize: {
            parchment: Quill.import('parchment'),
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        }
      },
      serverUrl: !/\/$/.test(process.env.VUE_APP_BASE_API)?process.env.VUE_APP_BASE_API + '/file/upload/multipart':process.env.VUE_APP_BASE_API + 'file/upload/multipart',
      header: {
        'Authorization': 'Bearer ' + this.$store.getters.token
      }
    }
  },

  computed: {
    // 获取富文本组件实例
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    value(val) {
      this.content = val
    }
  },

  methods: {
    onEditorChange({ editor, html, text }) {
      this.$emit('input', html)
    },

    // 富文本图片上传前
    beforeUpload(file) {
      // 图片大小限制
      const size = 10 * 1024 * 1024
      // 图片格式显示
      const imageType = ['jpg', 'jpeg', 'png']
      // 验证文件大小和格式
      if (this.uploadType == 'image') {
        if (file.size > size) {
          this.showMessage('图片太大,最大只能上传10M')
          return false
        }
        const type = file.type.split('/')[1]
        if (imageType.indexOf(type) < 0) {
          this.showMessage('图片格式不对，只支持' + imageType.join(','))
          return false
        }
      } else if (this.uploadType == 'video') {
        const videoSize = 100 * 1024 * 1024
        const videoType = ['avi', 'mp4', 'rmvb']
        if (file.size > videoSize) {
          this.showMessage('视频太大,最大只能上传100M')
          return false
        }
        const type = file.type.split('/')[1]
        if (videoType.indexOf(type) < 0) {
          this.showMessage('视频格式不对，只支持' + videoType.join(','))
          return false
        }
      }
      if (this.uploadType == 'image') {
        this.loading = true
      }
      return true
    },

    fileClick(type) {
      if (type == 'image') {
        this.uploadType = 'image'
        document.querySelector('.avatar-uploader input').click()
      } else if (type == 'video') {
        this.uploadType = 'video'
        this.dialogVisible = true
        this.accept = '.mp4,.avi,.rmvb'
      } else if (type == 'voice') {
        this.uploadType = 'voice'
        this.dialogVisible = true
        this.accept = '.mp3,wav,flac,aac,ape'
      }
    },

    // 文件上传时
    onUpload(event, file, fileList) {
    },

    /* 上传成功以后*/
    uploadSuccess(res, file) {
      // 如果上传成功
      if (res.status == 0) {
        this.editor.focus()
        // 获取光标所在位置
        const length = this.editor.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        const url = res.data.filedomain + res.data.path
        this.editor.insertEmbed(length, this.uploadType, url)
        // 调整光标到最后
        this.editor.setSelection(length + 1)
        this.dialogVisible = false
        this.loading = false
      } else {
        this.loading = false
        this.$message.error('上传失败')
      }
    },
    // 富文本图片上传失败
    uploadError() {
      this.loading = false
      this.$message.error('插入失败')
    }
  }
}
</script>

<style>
    .editor {
        line-height: normal !important;
        height: 800px;
    }

    .ql-snow .ql-tooltip[data-mode=link]::before {
        content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: '保存';
        padding-right: 0px;
    }

    .ql-snow .ql-tooltip[data-mode=video]::before {
        content: "请输入视频地址:" !important;
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: '14px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
        content: '10px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
        content: '18px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
        content: '32px';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: '文本';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        content: '标题1';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        content: '标题2';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        content: '标题3';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        content: '标题4';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        content: '标题5';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        content: '标题6';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: '标准字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
        content: '衬线字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
        content: '等宽字体';
    }

    .ql-picker-label:before {
        vertical-align: top;
    }

    .ql-picker-label svg{
        vertical-align: top;
    }
</style>
