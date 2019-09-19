<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="消息表" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">标题</label>
						<div class="input-group">
							<span>{{detailForm.title}}</span>
						</div>
					</div>
					<div class="detail-item big">
						<label class="control-label">消息内容</label>
						<div class="input-group">
							<span>{{detailForm.content}}</span>
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
        name: "appDriverMessageDetail",
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
        },
        mounted() {
            ajax.get('app/appDriverMessage/detail/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
