<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="产品型号" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">版本号</label>
						<div class="input-group">
							<span>{{detailForm.version}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">类型</label>
						<div class="input-group">
							<span>{{detailForm.typeText}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">渠道版本</label>
                        <div class="input-group">
                            <span>{{detailForm.appTypeText}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">更新内容</label>
						<div class="input-group">
							<span>{{detailForm.content}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">发布日期</label>
                        <div class="input-group">
                            <span>{{detailForm.publishDate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建人</label>
                        <div class="input-group">
                            <span>{{detailForm.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">创建时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
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

    export default {
        name: "appVersionDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id
            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('base//appVersion/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
