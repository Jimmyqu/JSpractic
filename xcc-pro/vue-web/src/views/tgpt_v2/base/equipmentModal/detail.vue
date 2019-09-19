<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="产品型号" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">型号名称</label>
						<div class="input-group">
							<span>{{detailForm.name}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">类型</label>
						<div class="input-group">
							<span>{{detailForm.typeText}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">供应商</label>
						<div class="input-group">
							<span>{{detailForm.supplierName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">型号描述</label>
						<div class="input-group">
							<span>{{detailForm.summary}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">升级方式</label>
						<div class="input-group">
							<span>{{detailForm.autoUpdateText}}</span>
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
        name: "equipmentModalDetail",
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
            ajax.get('base//baseEquipmentModal/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
