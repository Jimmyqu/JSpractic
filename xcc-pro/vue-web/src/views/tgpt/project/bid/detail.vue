<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="招投标管理" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">所属组织</label>
						<div class="input-group">
							<span>{{detailForm.organizationName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">招标编号</label>
						<div class="input-group">
							<span>{{detailForm.bidNo}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">项目编号</label>
						<div class="input-group">
							<span>{{detailForm.projectNo}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <span>{{detailForm.enterpriseName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <span>{{detailForm.contractNo}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">招标负责人</label>
						<div class="input-group">
							<span>{{detailForm.bidUser}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">发布公布日期</label>
                        <div class="input-group">
                            <span>{{detailForm.issueDate}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">招标日期</label>
						<div class="input-group">
							<span>{{detailForm.bidDate}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">招标信息链接</label>
						<div class="input-group">
							<span>{{detailForm.bidInfoLink}}</span>
						</div>
					</div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="招投标管理" name="2" >
                <div class="flex-panel detail-box">
					<div class="detail-item big">
						<label class="control-label">项目介绍内容</label>
						<div class="input-group">
							<span>{{detailForm.introduceContent}}</span>
						</div>
					</div>
					<div class="detail-item big">
						<label class="control-label">违约责任</label>
						<div class="input-group">
							<span>{{detailForm.breakResponsibility}}</span>
						</div>
					</div>
					<div class="detail-item big">
						<label class="control-label">评分标准</label>
						<div class="input-group">
							<span>{{detailForm.gradeStandard}}</span>
						</div>
					</div>
					<div class="detail-item big">
						<label class="control-label">其他要求</label>
						<div class="input-group">
							<span>{{detailForm.otherRequirement}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">招标文件</label>
						<div class="input-group">
                            <upload-panel :size="1"  disabled :file-list.sync="imgs"></upload-panel>
						</div>
					</div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="审批进程" name="3" >
                <approval-flow :id="refundDetail.serviceId"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import UploadPanel from '@/components/UploadPanel/index'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "bidDetail",
        components:{ ApprovalFlow,UploadPanel},
        data() {
            return {
                openCollapse: ["1","2","3"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                refundDetail:{
                    serviceId:this.$route.params.id
                }
            }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('core/coreProjectBid/detail/' + this.id,).then(rs => {
                if(rs.data.bidFile)//转换图片
                    this.imgs=JSON.parse(rs.data.bidFile);
                this.detailForm = rs.data;
            });
        }

    }
</script>
