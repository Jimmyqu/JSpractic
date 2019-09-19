<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="出售信息" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{detailForm.originateId}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">出售单编号</label>
						<div class="input-group">
							<span>{{detailForm.sellNum}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">出售车辆数量</label>
						<div class="input-group">
							<span>{{detailForm.vehicleSellNum}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">车辆出售说明</label>
						<div class="input-group">
							<span>{{detailForm.sellInstructions}}</span>
						</div>
					</div>
                    <div class="detail-item">
                    <label class="control-label">申请时间</label>
                    <div class="input-group">
                        <span>{{detailForm.createTime}}</span>
                    </div>
                </div>
                    <div class="detail-item">
                        <label class="control-label">出售总金额(元)</label>
                        <div class="input-group">
                            <span>{{detailForm.vehicleSellMoney}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>

            <el-collapse-item title="出售车辆明细" name="2" >
                <el-table border :data="tableData1" style="width: 100%" >
                    <el-table-column prop="index" label="序号" min-width="120">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="plate" label="车牌" min-width="100"></el-table-column>
                    <el-table-column prop="vin" label="车架号" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleModel" label="车型" min-width="150"></el-table-column>
                    <el-table-column prop="vehicleColor" label="颜色" min-width="120"></el-table-column>
                    <el-table-column prop="vehicleSellMoney" label="出售费用（元）" min-width="120"></el-table-column>
                </el-table>
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
        name: "baseVehicleDisposalApplyDetail",
        components:{ ApprovalFlow },
        data() {
            return {
                openCollapse: ["1","2","3"],
                show: true,
                detailForm: {
                },
                id: this.$route.params.id,
                tableData1:[],
                }
        },
        methods: {
            open() {
                this.show = true;
            }
        }
        ,
        mounted() {
            ajax.get('base/baseVehicleSellApply/' + this.id,).then(rs => {
                this.detailForm = rs.data;
                this.tableData1 = rs.data.list;
            });
        }

    }
</script>
