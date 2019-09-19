<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="使用信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.originateId}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">使用单编号</label>
						<div class="input-group">
							<span>{{detailForm.useNum}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">状态</label>
                        <div class="input-group">
                            <span>{{detailForm.vehicleUseStatus}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">使用车辆数量</label>
						<div class="input-group">
							<span>{{detailForm.vehicleUseAmount}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">使用车辆说明</label>
                        <div class="input-group">
                            <span>{{detailForm.useInstructions}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请人</label>
                        <div class="input-group">
                            <span>{{detailForm.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">申请时间</label>
                        <div class="input-group">
                            <span>{{detailForm.createTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="使用车辆明细" name="2" >
                <div class="table-box">
                    <el-table border :data="detailForm.useApplyDetail" style="width: 100%">
                        <el-table-column label="序号" min-width="80">
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="车架号" prop="vin" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="车型" prop="vehicleModel" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="颜色" prop="vehicleColor" sortable show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>

            <!--审批进程-->
            <el-collapse-item title="审批进程" name="3">
                <approval-flow :id="id"></approval-flow>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { calculator } from '@/utils'
    import ApprovalFlow from '@/components/ApprovalFlow/index'

    export default {
        name: "vehicleUseApplyDetail",
        components:{ ApprovalFlow},
        data() {
            return {
                openCollapse: ["1","2","3"],
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
            ajax.get('base/baseVehicleUseApply/' + this.id,).then(rs => {
                this.detailForm = rs.data;
            });
        }

    }
</script>
