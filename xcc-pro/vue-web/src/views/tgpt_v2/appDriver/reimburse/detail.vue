<template>
    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="基本信息" name="1" >
                <div class="flex-panel detail-box">
					<div class="detail-item">
						<label class="control-label">报销编号</label>
						<div class="input-group">
							<span>{{detailForm.reimburseNum}}</span>
						</div>
					</div>
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{detailForm.companyName}}</span>
                        </div>
                    </div>
					<div class="detail-item">
						<label class="control-label">车牌</label>
						<div class="input-group">
							<span>{{detailForm.plate}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">驾驶员</label>
						<div class="input-group">
							<span>{{detailForm.driverName}}</span>
						</div>
					</div>
					<div class="detail-item">
						<label class="control-label">总计费用</label>
						<div class="input-group">
							<span>{{detailForm.totalCost}}</span>
						</div>
					</div>

					<div class="detail-item">
						<label class="control-label">报销状态</label>
						<div class="input-group">
							<span>{{detailForm.statusName}}</span>
						</div>
					</div>

                    <div class="detail-item">
                        <label class="control-label">提交时间</label>
                        <div class="input-group">
                            <span>{{detailForm.submitTime}}</span>
                        </div>
                    </div>

                </div>
            </el-collapse-item>

            <el-collapse-item title="油费" name="2" >
                <el-table border :data="detailForm.oilCostList" style="width: 100%">
                    <el-table-column min-width="140" label="加油单号" prop="oilNum" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="加油时间" prop="oilTime" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="加油地点" prop="oilArea" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="加油原因" prop="businessType" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.oilReason==1?"用车加油":"新车加油"}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="140" label="加油前油量（%）" prop="capacityBefore" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="加油后油量（%）" prop="capacityAfter" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="加油量" prop="oilCapacity" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="单价" prop="oilUnitPrice" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="总价" prop="oilCost" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="支付类型" prop="payType" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                           {{scope.row.payType==1?"油卡":"现金"}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="140" label="加油卡" prop="oilCar" sortable show-overflow-tooltip></el-table-column>

                    <el-table-column min-width="140" label="票据图片" prop="invoiceImg" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="scope.row.invoiceImg" :show-img="true"></upload-panel>

                            <!--<img :src="scope.row.invoiceImg" style="width: 60px;height: 60px;">-->
                        </template>
                    </el-table-column>

                    <el-table-column min-width="140" label="发票号" prop="invoiceNum" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="备注" prop="remark" sortable show-overflow-tooltip></el-table-column>
                </el-table>
            </el-collapse-item>

            <el-collapse-item title="洗车费" name="3" >
                <el-table border :data="detailForm.washCarCostList" style="width: 100%">
                    <el-table-column min-width="140" label="报销单号" prop="washNum" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="洗车时间" prop="washTime" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="洗车地点" prop="washArea" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="洗车场" prop="washShopName" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="业务类型" prop="businessType" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.businessType=='1'?"次结":"月结"}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="140" label="洗车费用" prop="washCost" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="票据图片" prop="invoiceImg" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <upload-panel :size="1" style="width: 60px;height: 60px;"  disabled :file-list.sync="scope.row.invoiceImg" :show-img="true"></upload-panel>
                           <!-- <img :src="scope.row.invoiceImg" style="width: 60px;height: 60px;">-->
                        </template>
                    </el-table-column>
                    <el-table-column min-width="140" label="备注" prop="remark" sortable show-overflow-tooltip></el-table-column>
                </el-table>
            </el-collapse-item>

            <el-collapse-item title="其他费用" name="4" >
            <div class="flex-panel detail-box">

                <div class="detail-item">
                    <label class="control-label">住宿费</label>
                    <div class="input-group">
                        <span>{{detailForm.stayCost}}</span>
                    </div>
                </div>

                <div class="detail-item">
                    <label class="control-label">过桥费</label>
                    <div class="input-group">
                        <span>{{detailForm.bridgeCost}}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <label class="control-label">停车费</label>
                    <div class="input-group">
                        <span>{{detailForm.parkCost}}</span>
                    </div>
                </div>
            </div>
        </el-collapse-item>

         <el-collapse-item title="备注" name="5" >
                <div class="flex-panel detail-box">

                    <div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{detailForm.remark}}</span>
                        </div>
                    </div>
                </div>
        </el-collapse-item>

          <el-collapse-item title="审批进程" name="6">
                <approval-flow :id="id"></approval-flow>
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
        name: "appDriverReimburseDetail",
        components:{ ApprovalFlow,UploadPanel },
        data() {
            return {
                openCollapse: ['1', '2', '3', '4', '5', '6'],
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
            ajax.get('app//appDriverReimburse/' + this.id,).then(rs => {
                var  detailForm = rs.data;
                detailForm.oilCostList
                detailForm.washCarCostList
                detailForm.oilCostList.forEach(v=>{
                    if(v.invoiceImg!=null && v.invoiceImg!=''){
                        var invoiceImg=JSON.parse(v.invoiceImg);
                        v.invoiceImg=[invoiceImg];
                    }else{
                        v.invoiceImg=[]
                    }
                })
                detailForm.washCarCostList.forEach(v=>{
                    if(v.invoiceImg!=null && v.invoiceImg!=''){
                        var invoiceImg=JSON.parse(v.invoiceImg);
                        v.invoiceImg=[invoiceImg];
                    }else{
                        v.invoiceImg=[]
                    }
                })
                this.detailForm = detailForm;
            });
        }

    }
</script>
