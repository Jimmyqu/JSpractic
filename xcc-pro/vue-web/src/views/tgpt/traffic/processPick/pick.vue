<template>
    <div class="form-panel detail-panel">
        <el-form :model="editForm" :rules="rules" label-position="top" ref="editForm" label-width="100px">
            <el-collapse v-model="openCollapse">

                <el-collapse-item title="调拨信息" name="2">
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
                    </div>
                </el-collapse-item>
                <el-collapse-item title="出车信息" name="3">
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
                                <span>{{process.driverName}}&nbsp;{{process.driverPhone}}</span>
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
                        <el-form-item label="出车油量(%)" prop="outsetOilPercent">
                            <label class="control-label">出车油量</label>
                            <div class="input-group">
                                <span>{{process.outsetOilPercent}}</span>
                            </div>
                        </el-form-item>
                        <div class="detail-item">
                            <label class="control-label">出车油量(L)</label>
                            <div class="input-group">
                                <span>{{process.outsetOil}}</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="接车信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="接车人" prop="pickUserId">
                            <el-input v-model="editForm.pickUser" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="接车人手机号" prop="pickUserPhone">
                            <el-input v-model="editForm.pickUserPhone" maxlength="11"></el-input>
                        </el-form-item>
                        <el-form-item label="接车时间" prop="pickTime">
                            <el-date-picker type="datetime" placeholder="请选择接车确认时间" value-format="yyyy-MM-dd HH:mm" v-model="editForm.pickTime" clearable></el-date-picker>
                        </el-form-item>
                        <el-form-item label="接车里程(km)" prop="arrivalsMileage">
                            <el-input v-model="editForm.arrivalsMileage">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="接车油量(%)" prop="arrivalsOilPercent">
                            <el-input v-model="editForm.arrivalsOilPercent" @blur="calOil">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="接车油量(L)" prop="arrivalsOil">
                            <el-input v-model="editForm.arrivalsOil" :readonly="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="费用" name="4">
                    <div class="flex-panel">
                        <el-form-item label="调度人工费(元)" prop="laborFee">
                            <el-input v-model="editForm.laborFee" @blur="calTotalFee">
                                <template slot="append">￥</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="加油总费用(元)" prop="fuelCosts">
                            <el-input v-model="editForm.fuelCosts" :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="餐费(元)" prop="mealFee">
                            <el-input v-model="editForm.mealFee" @blur="calTotalFee">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="住宿费(元)" prop="accommodationFee">
                            <el-input v-model="editForm.accommodationFee" @blur="calTotalFee">
                            </el-input>
                        </el-form-item>
                        <!--<el-form-item label="交通费" prop="transportationFee">
                            <el-input v-model="editForm.transportationFee" @blur="calTotalFee">
                                <template slot="append">￥</template>
                            </el-input>
                        </el-form-item>-->
                        <el-form-item label="路桥费(元)" prop="roadFee">
                            <el-input v-model="editForm.roadFee" @blur="calTotalFee"></el-input>
                        </el-form-item>
                        <el-form-item label="停车费(元)" prop="parkingFee">
                            <el-input v-model="editForm.parkingFee" @blur="calTotalFee"></el-input>
                        </el-form-item>
                        <el-form-item label="拖车费(元)" prop="towingFee">
                            <el-input v-model="editForm.towingFee" @blur="calTotalFee"></el-input>
                        </el-form-item>
                        <el-form-item label="保险费(元)" prop="insurance">
                            <el-input v-model="editForm.insurance" @blur="calTotalFee"></el-input>
                        </el-form-item>
                        <el-form-item label="其他费用(元)" prop="otherFee">
                            <el-input v-model="editForm.otherFee" @blur="calTotalFee"></el-input>
                        </el-form-item>
                        <el-form-item label="其他费用说明" prop="otherFeeDescription">
                            <el-input v-model="editForm.otherFeeDescription" maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="调度总费用(元)" prop="totalFee">
                            <el-input v-model="editForm.totalFee" :readonly="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="加油明细" name="6">
                    <el-table :data="process.detail" style="width: 100%;margin-top: 10px" border>
                        <el-table-column prop="index" label="序号" min-width="70">
                            <template slot-scope="{row,$index}">
                                <span>{{$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNo" label="加油单" min-width="100"></el-table-column>
                        <el-table-column prop="orderNo" label="加油时间" min-width="100"></el-table-column>
                        <el-table-column prop="oilTotalAmount" label="加油金额(元)" show-overflow-tooltip min-width="200"></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm()">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        name: "trafficProcessPickPick",
        mixins: [ tool, ruleTool ],
        components:{
        },
        data: function() {
            return {
                partsForm:{},
                openCollapse:["1","2","3","4","5","6"],
                show: false, //控制当前弹窗显示
                editForm: {}, //表单数据
                process: {}, //调拨过程详情
                pickUsers: [], //接车人数据
                pickStatus: {}, //接车确认状态
                rules: {
                    pickUserPhone: [
                        {validator: formRule.phone, message: "手机号码为11位数字", trigger: "blur"}
                    ],
                    pickStatus: [
                        {required: true, message: "请选择接车确认状态", trigger: "change"}
                    ],
                    arrivalsMileage: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    arrivalsOilPercent: [
                        {validator: formRule.cess, message: "不大于100，小数最大2位", trigger: "blur"}
                    ],
                    laborFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    fuelCosts: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    mealFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    transportationFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    accommodationFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    roadFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    parkingFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    towingFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    insurance: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    otherFee: [
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ]
                }
            }
        },
        mounted: function() {
            this.open();
        },
        methods: {
            //数据初始化
            init() {
                //接车确认状态
                ajax.get("core/process/getProcessEnumData/pick_status").then(res =>{
                    this.pickStatus = res.data;
                });
            },
            open(){
                this.partsForm.id = this.$route.query.id;
                this.init();
                this.getPickUser();
                this.getUpdateData();
            },
            //获取接车人
            getPickUser() {
                ajax.get("core/process/getPickUser").then(res =>{
                    this.pickUsers = res.data;
                });
            },
            getUpdateData() {
                ajax.get("core/process/detail/" + this.partsForm.id).then(result =>{
                    if(result.data.pickStatus) {
                        result.data.pickStatus = result.data.pickStatus.toString();
                    }
                    this.process = result.data;
                    this.editForm = result.data;
                });
            },
            //保存数据
            submitForm() {
                this.$refs["editForm"].validate((valid) => {
                    if(!valid) {
                        return false;
                    }
                    ajax.post("core/process/pick",this.editForm).then(res =>{
                        this.showMessage("保存成功","success",() => {
                            this.close();
                        });
                    });
                });
            },
            //计算到达油量
            calOil() {
                var fuelCapacity = this.process.fuelCapacity;
                var arrivalsOilPercent = this.process.arrivalsOilPercent;
                if(fuelCapacity && !isNaN(fuelCapacity) && arrivalsOilPercent && !isNaN(arrivalsOilPercent)) {
                    fuelCapacity = parseFloat(fuelCapacity);
                    arrivalsOilPercent = parseFloat(arrivalsOilPercent);
                    if(arrivalsOilPercent <= 100) {
                        this.process.arrivalsOil = (fuelCapacity * arrivalsOilPercent / 100).toFixed(2);
                        return;
                    }
                }
                this.process.arrivalsOil = 0;
            },
        }

    }
</script>
