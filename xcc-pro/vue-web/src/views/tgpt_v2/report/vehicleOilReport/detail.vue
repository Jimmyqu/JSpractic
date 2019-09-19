<template>
    <div class="detail-panel">
        <el-form label-position="top" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="车辆加油单" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">加油单号</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilNum}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.plate}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">加油时间</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油地点</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilArea}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油原因</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilReason==1?"用车加油":"新车加油"}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">驾驶员</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.driverName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油前油量</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.capacityBefore}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油单价(元)</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilUnitPrice}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油量</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilCapacity}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油后油量</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.capacityAfter}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油里程</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilMileage}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">分公司</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.companyName}}</span>
                            </div>
                        </div>
                        <div class="detail-item big">
                            <label class="control-label">加油票图片</label>
                            <div class="input-group">
                                <img :src="oilDataFrom.invoiceImg" @click="showBigImg($event)">
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="支付方式及费用归属" name="2" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.contractNo}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.enterpriseName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">支付方式</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.payType=='1'?"油卡":"现金"}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">加油卡</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilCar}}</span>
                            </div>
                        </div>

                        <div class="detail-item">
                            <label class="control-label">总金额(元)</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.oilCost}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="4" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item big">
                            <label class="control-label">备注</label>
                            <div class="input-group">
                                <span>{{oilDataFrom.remark}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'

    export default {
        components:{ ApprovalFlow, FileDetail },
        name: "vehicleOilReportDetail",
        data: function () {
            return {
                id: this.$route.params.id,
                activeNames: ['1','2','3','4','5'],
                oilDataFrom : {},
                refundDetail:{
                    serviceId: this.$route.params.id
                }
            }

        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
            this.init();
        },
        watch: {//它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

        },
        methods: {
            init() {
                if(this.id){
                    ajax.get('/report/vehicleOilReport/' + this.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                this.oilDataFrom = res.data;
                                if(res.data.invoiceImg!=null && res.data.invoiceImg!=''){
                                    var invoiceImg=JSON.parse(res.data.invoiceImg);
                                    this.oilDataFrom.invoiceImg=invoiceImg.filedomain+invoiceImg.path
                                }
                            }
                        }
                    )
                }
            },
        }
    }
</script>
