<template>
  <div class="detail-panel">
    <el-collapse v-model="openCollapse">
      <el-collapse-item title="微课程表" name="1">
        <div class="flex-panel detail-box">
          <div class="detail-item detail-item-content">
            <label class="control-label">标题</label>
            <div class="input-group">
              <span>{{ detailForm.title }}</span>
            </div>
          </div>
          <div class="detail-item detail-item-content">
            <label class="control-label">内容</label>
            <div class="input-group">
              <!--<span>{{detailForm.content}}</span>-->
              <!--<my-editor v-model="detailForm.content"></my-editor>-->
              <div v-html="detailForm.content" />
            </div>
          </div>
          <div class="detail-item ">
            <label class="control-label">标题图片</label>
            <!--<div class="input-group">
							<span>{{detailForm.titleImg}}</span>
						</div>-->

            <div class="input-group">
              <!--<img :src="customerInfo.idCardFrontPhoto" @click="showBigImg($event)">-->
              <upload-panel :size="1" style="width: 100px;height: 100px;" disabled :file-list.sync="detailForm.titleImg" :show-img="true" />
            </div>
          </div>
          <div class="detail-item  ">
            <label class="control-label">附件</label>
            <div class="input-group">
              <upload-panel :file-list.sync="detailForm.attachmentList" :disabled="true" />
            </div>
          </div>
          <div class="detail-item detail-item-wrap">
            <div class="detail-item detail-item-content">
              <label class="control-label">发布状态</label>
              <div class="input-group">
                <span>{{ detailForm.publishStatus == 0 ?'未发布':'已发布' }}</span>
              </div>
            </div>
            <div class="detail-item detail-item-content">
              <label class="control-label">发布时间</label>
              <div class="input-group">
                <span>{{ detailForm.publishTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>

<script>
import ajax from '@/utils/request'
import { calculator } from '@/utils'
import ApprovalFlow from '@/components/ApprovalFlow/index'
import UploadPanel from '@/components/UploadPanel/index'

export default {
  name: 'MicroCourseDetail',
  components: { ApprovalFlow, UploadPanel },
  data() {
    return {
      openCollapse: ['1'],
      show: true,
      detailForm: {
      },
      id: this.$route.params.id
    }
  },
  mounted() {
    ajax.get('app/appDriverMicroCourse/' + this.id,).then(rs => {
      this.detailForm = rs.data

      if (this.detailForm.titleImg) {
        this.detailForm.titleImg = [JSON.parse(this.detailForm.titleImg)]
      } else {
        this.detailForm.titleImg = []
      }
    })
  },
  methods: {
    open() {
      this.show = true
    }
  }

}
</script>

<style lang="scss" scoped>
    .detail-panel .detail-box .detail-item-content{
        width: 100%;
    }
    .detail-panel .detail-box .detail-item-wrap{
        flex-wrap: wrap;
    }
</style>
