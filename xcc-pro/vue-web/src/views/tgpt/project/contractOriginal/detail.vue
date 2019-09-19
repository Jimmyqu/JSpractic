<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="合同原件" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">所属组织</label>
						<div class="input-group">
							<span>{{detailForm.originationId}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">客户ID</label>
						<div class="input-group">
							<span>{{detailForm.enterpriseId}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">合同ID</label>
						<div class="input-group">
							<span>{{detailForm.projectContractId}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">合同类型</label>
						<div class="input-group">
							<span>{{detailForm.contractType}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">原件负责人</label>
						<div class="input-group">
							<span>{{detailForm.principal}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">原件</label>
						<div class="input-group">
							<span>{{detailForm.original}}</span>
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
        name: "coreProjectContractOriginalDetail",
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
            ajax.get('core//coreProjectContractOriginal/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
