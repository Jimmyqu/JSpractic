<template>
    <div class="detail-panel">
        <el-form label-position="top" label-width="100px" class="demo-ruleForm">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="1" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <span>{{scheduleForm.organizationName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">调度单号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">状态</label>
                            <div class="input-group">
                                <span>{{scheduleForm.scheduleStatusText}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">客户类型</label>
                            <div class="input-group">
                                <span>{{scheduleForm.customerType==1?'企业客户':(scheduleForm.customerType==2?'个人客户':'/')}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <span>{{scheduleForm.enterpriseName}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <span>{{scheduleForm.contractNo}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.user}}&nbsp;{{scheduleForm.phone}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车人数</label>
                            <div class="input-group">
                                <span>{{scheduleForm.userNum}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.useTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">用车事由</label>
                            <div class="input-group">
                                <span>{{scheduleForm.reason}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出发地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">抵达地址</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrAddress}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">订单金额</label>
                            <div class="input-group">
                                <span>{{scheduleForm.orderAmount}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">创建人</label>
                            <div class="input-group">
                                <span>{{scheduleForm.creater}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">创建时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.createTime}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务车辆" name="2">
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <span>{{scheduleForm.plate}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">驾驶员</label>
                            <div class="input-group">
                                <span>{{scheduleForm.driverName}}&nbsp;{{scheduleForm.driverPhone}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="服务信息" name="4" >
                    <div class="flex-panel detail-box">
                        <div class="detail-item">
                            <label class="control-label">出车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">还车时间</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrTime}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">本次服务时长</label>
                            <div class="input-group">
                                <span>{{scheduleForm.duration}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">出车里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.depMile}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">还车里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrMile}}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label class="control-label">本次服务里程(km)</label>
                            <div class="input-group">
                                <span>{{scheduleForm.arrMile - scheduleForm.depMile}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                    <div class="form-panel">
                        <el-form :model="scheduleForm" :rules="rules" label-position="top" ref="scheduleForm" label-width="100px">
                        <el-collapse-item title="费用信息" name="5" >
                            <div class="flex-panel">
                                <el-form-item label="总费用" prop="totalMoney">
                                    <el-input v-model="scheduleForm.totalMoney"  clearable  placeholder="请输入总费用" readonly="">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="租金" prop="rentMoney">
                                    <money-input v-model="scheduleForm.rentMoney"  clearable  placeholder="请输入租金" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="路桥费" prop="tollCharge">
                                    <money-input v-model="scheduleForm.tollCharge"  clearable  placeholder="请输入路桥费" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="停车费" prop="parkingFee">
                                    <money-input v-model="scheduleForm.parkingFee"  clearable  placeholder="请输入停车费" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="加油费" prop="oilFee">
                                    <money-input v-model="scheduleForm.oilFee"  clearable  placeholder="请输入加油费" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="超时费" prop="outtimeFee">
                                    <money-input v-model="scheduleForm.outtimeFee"  clearable  placeholder="请输入超时费" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="超公里费" prop="outmileFee">
                                    <money-input v-model="scheduleForm.outmileFee"  clearable  placeholder="请输入超公里费" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="其他费用" prop="otherFee">
                                    <money-input v-model="scheduleForm.otherFee"  clearable  placeholder="请输入其他费用" @input="moneyChange()" unit="元"></money-input>
                                </el-form-item>
                                <el-form-item label="其他费用说明" prop="otherFeeRemark">
                                    <el-input clearable maxlength="50" v-model="scheduleForm.otherFeeRemark"  placeholder="请输入其他费用说明"></el-input>
                                </el-form-item>
                            </div>
                        </el-collapse-item>
                        <div class="left-row">
                            <el-button type="primary" @click="submitForm('scheduleForm')">保存</el-button>
                            <el-button @click="close()">返回</el-button>
                        </div>
                    </el-form>
                    </div>
            </el-collapse>
        </el-form>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import ApprovalFlow from '@/components/ApprovalFlow/index'
    import FileDetail from '@/components/FileDetail/index'
    import { number_format } from '@/utils'
    import { tool, ruleTool, formRule } from '@/utils/common'
    import MoneyInput from '@/components/MoneyInput/index'

    export default {
        name:'trafficVehicleScheduleSettlement',
        mixins: [ tool, ruleTool ],
        components:{ ApprovalFlow, FileDetail ,MoneyInput},
        data: function () {
            return {
                activeNames: ['1','2','3','4','5'],
                scheduleForm : {},
            }

        },
        beforeMount: function () {//载入前
        },
        mounted: function () {//载入后
            this.open();
        },

        methods: {
            open(){
                var $this = this;
                if(this.$route.query.id){
                    ajax.get('/core/vehicleschedule/detail/' + this.$route.query.id).then(
                        res => {
                            if(res.status == 0 && res.data != null){
                                $this.scheduleForm = res.data;
                            }
                        }
                    )
                }
            },

            submitForm(scheduleForm) {
                var $this = this;
                $this.$refs[scheduleForm].validate((valid) => {
                    if (valid) {
                        var url = "/core/vehicleschedule/settlement";
                        ajax.post(url, $this.scheduleForm).then(
                            res => {
                                if(res.status == 0){
                                    $this.showMessage("操作成功","success");
                                    $this.close();
                                }else {
                                    $this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },


            /*计算服务总金额*/
            moneyChange(){
                let totalMoney = 0;
                if(this.scheduleForm.rentMoney){
                    totalMoney = totalMoney+  Number(this.scheduleForm.rentMoney)
                }
                if(this.scheduleForm.tollCharge){
                    totalMoney = totalMoney + Number(this.scheduleForm.tollCharge)
                }
                if(this.scheduleForm.parkingFee){
                    totalMoney = totalMoney+ Number(this.scheduleForm.parkingFee)
                }
                if(this.scheduleForm.oilFee){
                    totalMoney = totalMoney+ Number(this.scheduleForm.oilFee);
                }
                if(this.scheduleForm.outtimeFee){
                    totalMoney = totalMoney+ Number(this.scheduleForm.outtimeFee);
                }
                if(this.scheduleForm.outmileFee){
                    totalMoney = totalMoney+ Number(this.scheduleForm.outmileFee);
                }
                if(this.scheduleForm.otherFee){
                    totalMoney = totalMoney+Number(this.scheduleForm.otherFee);
                }
                if(totalMoney){
                    this.$set(this.scheduleForm , 'totalMoney',totalMoney);
                }
            },


        }
    }
</script>
