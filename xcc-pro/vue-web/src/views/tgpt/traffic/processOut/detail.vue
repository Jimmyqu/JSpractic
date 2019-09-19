<template>
    <div class="detail-panel">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="调拨信息" name="1">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">调度前组织</label>
                        <div class="input-group">
                            <span>{{process.beforeCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出车城市</label>
                        <div class="input-group">
                            <span>{{process.depCityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">调度后组织</label>
                        <div class="input-group">
                            <span>{{process.afterCompanyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">到达城市</label>
                        <div class="input-group">
                            <span>{{process.arrivalCityName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{process.modelName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">油箱容量(L)</label>
                        <div class="input-group">
                            <span>{{process.fuelCapacity}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">预计调拨时间</label>
                        <div class="input-group">
                            <span>{{process.transferTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">调拨原因</label>
                        <div class="input-group">
                            <span>{{process.reasonText}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">预计费用(元)</label>
                        <div class="input-group">
                            <span>{{process.estimatedCost}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否过户</label>
                        <div class="input-group">
                            <template v-if="process.isTransfer==1"><span>是</span></template>
                            <template v-else-if="process.isTransfer==0"><span>否</span></template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">是否送车</label>
                        <div class="input-group">
                            <template v-if="process.isSend==1"><span>是</span></template>
                            <template v-else-if="process.isSend==0"><span>否</span></template>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">录入人</label>
                        <div class="input-group">
                            <span>{{process.creater}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">录入时间</label>
                        <div class="input-group">
                            <span>{{process.createTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">完成操作人</label>
                        <div class="input-group">
                            <span>{{process.completer}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">完成操作时间</label>
                        <div class="input-group">
                            <span>{{process.completeTime}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="出车信息" name="2">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">车辆</label>
                        <div class="input-group">
                            <span>{{process.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员</label>
                        <div class="input-group">
                            <span>{{process.driverName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">驾驶员手机号</label>
                        <div class="input-group">
                            <span>{{process.driverTelphone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出车时间</label>
                        <div class="input-group">
                            <span>{{process.outsetTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出车里程(km)</label>
                        <div class="input-group">
                            <span>{{process.outsetMileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出车油量(%)</label>
                        <div class="input-group">
                            <span>{{process.outsetOilPercent}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">出车油量(L)</label>
                        <div class="input-group">
                            <span>{{process.outsetOil}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="接车信息" name="3">
                <div class="flex-panel detail-box">

                    <div class="detail-item">
                        <label class="control-label">接车人</label>
                        <div class="input-group">
                            <span>{{process.pickUserId}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">接车人手机号</label>
                        <div class="input-group">
                            <span>{{process.pickUserPhone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">接车时间</label>
                        <div class="input-group">
                            <span>{{process.pickTime}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">接车里程</label>
                        <div class="input-group">
                            <span>{{process.arrivalsMileage}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">接车油量(%)</label>
                        <div class="input-group">
                            <span>{{process.arrivalsOilPercent}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">接车油量(L)</label>
                        <div class="input-group">
                            <span>{{process.arrivalsOil}}</span>
                        </div>
                    </div>
                    <!--<div class="detail-item">
                        <label class="control-label">备注</label>
                        <div class="input-group">
                            <span>{{process.arrivalsRemark}}</span>
                        </div>
                    </div>-->
                </div>
            </el-collapse-item>
            <el-collapse-item title="费用" name="4">
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">调度人工费(元)</label>
                        <div class="input-group">
                            <span>{{process.laborFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">加油总费用(元)</label>
                        <div class="input-group">
                            <span>{{process.fuelCosts}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">餐费(元)</label>
                        <div class="input-group">
                            <span>{{process.mealFee}}</span>
                        </div>
                    </div>
                    <!--<div class="detail-item">
                        <label class="control-label">交通费</label>
                        <div class="input-group">
                            <span>{{process.transportationFee}}￥</span>
                        </div>
                    </div>-->
                    <div class="detail-item">
                        <label class="control-label">住宿费(元)</label>
                        <div class="input-group">
                            <span>{{process.accommodationFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">路桥费(元)</label>
                        <div class="input-group">
                            <span>{{process.roadFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">停车费(元)</label>
                        <div class="input-group">
                            <span>{{process.parkingFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">拖车费(元)</label>
                        <div class="input-group">
                            <span>{{process.towingFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">保险费(元)</label>
                        <div class="input-group">
                            <span>{{process.insurance}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他费用(元)</label>
                        <div class="input-group">
                            <span>{{process.otherFee}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">其他费用说明</label>
                        <div class="input-group">
                            <span>{{process.otherFeeDescription}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">总费用(元)</label>
                        <div class="input-group">
                            <span>{{process.totalFee}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="加油明细" name="5">
                <el-table :data="process.detail" style="width: 100%;margin-top: 10px" border>
                    <el-table-column prop="index" label="序号" min-width="70">
                        <template slot-scope="{row,$index}">
                            <span>{{$index+1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="加油单" min-width="100"></el-table-column>
                    <el-table-column prop="addOilTime" label="加油时间" min-width="100"></el-table-column>
                    <el-table-column prop="oilTotalAmount" label="加油金额(元)" min-width="200"></el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        name: "trafficProcessOutDetail",
        components:{ ApprovalFlow, FileDetail },

        data(){
            return{
                activeNames: ['1', '2', '3', '4', '5'],
                process:{},
            }
        },
        mounted: function () {
            this.getTransferProcess();
        },
        methods: {
            getTransferProcess() {
                const id = this.$route.params.id
                ajax.get("core/process/detail/" + id).then(
                    result => {
                        if(result.status == 0) {
                            this.process = result.data;
                        } else {
                            this.showMessage(result.message,"error");
                        }
                    },errror =>{
                        console.log(errror);
                        this.showMessage("系统异常,请联系系统管理员","error");
                    }
                )

            }
        },
    }
</script>
