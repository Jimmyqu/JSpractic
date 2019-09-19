<template>
  <div class="form-panel">
    <el-form v-cloak ref="addForm" :model="addForm" :rules="rules" label-position="top" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="微课程表" name="1">
          <el-form-item class="big" label="标题" prop="title" :rules="rules.required('请输入标题')">
            <el-input v-model="addForm.title" maxlength="200" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="标题图片">
            <upload-panel :size="1" :file-list.sync="titleImg" accept=".jpg,.jpeg,.png" :show-img="true" />
          </el-form-item>
          <el-form-item label="正文">
            <div v-if="!MyEditor">当前浏览器不支持此插件！</div>
            <my-editor v-if="MyEditor" v-model="addForm.content"></my-editor>
          </el-form-item>
          <el-form-item label="附件" style="margin-top: 100px;">
            <upload-panel :size="4" :file-list.sync="attachmentList" accept=".pdf,.pptx,.ppt" />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <div class="left-row">
        <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
let MyEditor = undefined;
import ajax from '@/utils/request'
import { tool, ruleTool } from '@/utils/common'
if(!!window.ActiveXObject || "ActiveXObject" in window){
    console.log('富文本不支持ie')
}else{
    MyEditor =()=> import("@/components/QuillEditor/index.vue");
}
import UploadPanel from '@/components/UploadPanel/index'
import { setTimeout } from 'timers';
export default {
  name: 'AppDriverMicroCourseForm',
  components: { UploadPanel, MyEditor },
  mixins: [tool, ruleTool],
  data() {
    return {
      activeNames: ['1'],
      addForm: {},
      /* 标题图片*/
      titleImg: [],
      /* 附件*/
      attachmentList: [],
      MyEditor:MyEditor
    }
  },
  mounted() {
    this.open()
  },
  methods: {
    open() {
      this.addForm = {}
      if (this.$route.query.id) {
        ajax.get('app/appDriverMicroCourse/' + this.$route.query.id).then(rs => {
          this.addForm = rs.data
          this.dataInit()
        })
      }
    },
    /* 数据初始化*/
    dataInit() {
      if (this.addForm.titleImg) {
        this.titleImg.push(JSON.parse(this.addForm.titleImg))
      }
      if (this.addForm.fileCount && this.addForm.fileCount > 0) {
        /* 初始化附件列表*/
        this.attachmentList = this.addForm.attachmentList
      }
    },
    /* 格式化显示图片*/
    assambleTitleImage(data) {
      if (data != null && data.length > 0) {
        const object = {}
        object['name'] = data[0].name
        object['path'] = data[0].path
        object['filedomain'] = data[0].filedomain
        return JSON.stringify(object)
      } else {
        return null
      }
    },
    // 保存提交
    submitForm: function(addForm) {
      this.addForm.titleImg = this.assambleTitleImage(this.titleImg)
      var data = this.addForm
      data.attachmentList = this.attachmentList
      this.$refs[addForm].validate((valid) => {
        if (!valid) {
          this.$message.error('校验不通过，请检查输入项')
          return
        }
        ajax.post('app/appDriverMicroCourse/saveEdit/', data).then(rs => {
          if (rs.status == 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.close()
          }
        })
      })
    }
  }
}
</script>

