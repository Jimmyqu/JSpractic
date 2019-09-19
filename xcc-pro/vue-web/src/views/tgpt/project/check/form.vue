<template>
    <div class="form-panel">
        <el-form :model="settlementForm" :rules="rules" label-position="top" ref="settlementForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基本信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="用车单编号">
                            <el-input v-model="settlementForm.projectVehicleSettlementNo" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="是否需要司机">
                            <el-radio-group v-model="settlementForm.isNeedDriver" :disabled="true">
                                <el-radio name="isNeedDriver" :label="1">是</el-radio>
                                <el-radio name="isNeedDriver" :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="司机姓名" v-if="settlementForm.isNeedDriver">
                            <el-input v-model="settlementForm.driverName" :disabled="true"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="开始日期">
                            <el-input v-model="settlementForm.startDate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="结束日期">
                            <el-input v-model="settlementForm.endDate" :disabled="true"></el-input>
                        </el-form-item>-->
                        <el-form-item label="月份">
                            <el-input v-model="settlementForm.carUseMonth" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="结算操作人" prop="name">
                            <el-input v-model="userInfo.name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务客户" >
                            <el-input v-model="settlementForm.enterpriseName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车牌号" >
                            <el-input v-model="settlementForm.plate" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="收费价格" name="2">
                    <div class="flex-panel">
                        <el-form-item label="每月车辆租金" prop="vehicleRental">
                            <el-input v-model="settlementForm.vehicleRental" placeholder="请输入每月车辆租金" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="ETC费" prop="etcFee">
                            <el-input v-model="settlementForm.etcFee" placeholder="请输入ETC费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="每月车辆油费" prop="oilFee">
                            <el-input v-model="settlementForm.oilFee" placeholder="请输入每月车辆油费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机费用" prop="driverFee">
                            <el-input v-model="settlementForm.driverFee" placeholder="请输入每月司机费用" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="每月司机通讯费" prop="driverCommunicationFee">
                            <el-input v-model="settlementForm.driverCommunicationFee" placeholder="请输入每月司机通讯费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="代驾费" prop="drivingFee">
                            <el-input v-model="settlementForm.drivingFee" placeholder="请输入代驾费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="住宿费" prop="stayFee">
                            <el-input v-model="settlementForm.stayFee" placeholder="请输入住宿费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="餐费" prop="mealFee">
                            <el-input v-model="settlementForm.mealFee" placeholder="请输入餐费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="福利费" prop="welfareFee">
                            <el-input v-model="settlementForm.welfareFee" placeholder="请输入福利费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="高温补贴费" prop="heatSubsidy">
                            <el-input v-model="settlementForm.heatSubsidy" placeholder="请输入高温补贴费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="生日补贴费" prop="birthdaySubsidy">
                            <el-input v-model="settlementForm.birthdaySubsidy" placeholder="请输入生日补贴费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="其他补贴费用" prop="otherSubsidy">
                            <el-input v-model="settlementForm.otherSubsidy" placeholder="请输入其他补贴费用" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="本月使用情况" name="3">
                    <!--本月使用情况-->
                    <div class="flex-panel">
                        <el-form-item label="超里程费用" prop="overMileageFee">
                            <el-input v-model="settlementForm.overMileageFee" :disabled="true"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="本月使用里程" prop="usedMileage">
                            <el-input v-model="settlementForm.usedMileage" placeholder="请输入本月使用里程" clearable maxlength="14"><template slot="append">公里</template></el-input>
                        </el-form-item>

                        <el-form-item label="超里程" prop="overMileage">
                            <el-input v-model="settlementForm.overMileage" :disabled="true"><template slot="append">公里</template></el-input>
                        </el-form-item>

                        <el-form-item label="每月限制里程" prop="limitMileage">
                            <el-input v-model="settlementForm.limitMileage" :disabled="true"><template slot="append">公里</template></el-input>
                        </el-form-item>

                        <el-form-item label="本月支付油费" prop="payedOilFee">
                            <el-input v-model="settlementForm.payedOilFee"  placeholder="请输入本月支付油费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="油费支付类型" prop="oilFeePaymentModel">
                            <el-input v-model="settlementForm.oilFeePaymentModel" :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="超里程单价" prop="overMileageUnitPrice">
                            <el-input v-model="settlementForm.overMileageUnitPrice" placeholder="请输入超里程单价" :disabled="true"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="本月路桥费" prop="tollFee">
                            <el-input v-model="settlementForm.tollFee" placeholder="请输入本月路桥费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="停车费" prop="parkingFee">
                            <el-input v-model="settlementForm.parkingFee" placeholder="请输入停车费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="洗车费" prop="washFee">
                            <el-input v-model="settlementForm.washFee" placeholder="请输入洗车费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="司机加班费" prop="overworkFee">
                            <el-input v-model="settlementForm.overworkFee" placeholder="请输入司机加班费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="司机每天工作时长" prop="workHour">
                            <el-input v-model="settlementForm.workHour" placeholder="请输入司机每天工作时长" :disabled="true"><template slot="append">小时</template></el-input>
                        </el-form-item>

                        <el-form-item label="附加费" prop="extraFee">
                            <el-input v-model="settlementForm.extraFee" placeholder="请输入附加费" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="本月总费用" prop="totalAmount">
                            <el-input v-model="settlementForm.totalAmount" disabled><template slot="append">元</template></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="备注" name="4">
                    <!--备注-->
                    <el-form-item label="备注" class="big" prop="remark">
                        <el-input type="textarea" v-model="settlementForm.remark" placeholder="请输入备注" clearable maxlength="200"></el-input>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="save()">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"projectCheckEdit",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data(){
            return {
                openCollapse:["1","2","3","4"],
                settlementForm:{},
                userInfo: this.getCurrentUserInfo(),
                rules: {
                    usedMileage: [
                        { required: true, message: '请输入本月使用里程', trigger: 'change' },
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "change"}
                    ],
                    vehicleRental: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    etcFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    oilFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    driverFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    driverCommunicationFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    drivingFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    stayFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    mealFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    welfareFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    heatSubsidy: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    birthdaySubsidy: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    otherSubsidy: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    payedOilFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    /*overMileageUnitPrice: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],*/
                    tollFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    parkingFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    washFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    overworkFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    extraFee: [
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],

                    totalAmount: [
                        { required: true, message: '请输入本月总费用', trigger: 'change' },
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    /*treeId: [
                        { required: true, message: '请选择所属组织', trigger: 'change' }
                    ]*/
                },
                activeFgsArray: [],
                orgSelectId: []
            }
        },
        watch: {
            "settlementForm.usedMileage": function (value) {//本月使用里程
                if (value && !isNaN(value)){
                    // 超里程 = 本月使用里程-每月限制里程
                    let overMileageValue = value - this.settlementForm.limitMileage;
                    if (overMileageValue >= 0) {
                        this.settlementForm.overMileage = overMileageValue;
                    } else {
                        this.settlementForm.overMileage = 0;
                    }
                } else {
                    this.settlementForm.overMileage = 0;
                }
            },
            "settlementForm.overMileage": function (value) {//超里程
                if (value && !isNaN(value)){
                    let overMileageUnitPrice = this.settlementForm.overMileageUnitPrice;
                    if (overMileageUnitPrice && !isNaN(overMileageUnitPrice)) {
                        // 超里程费用 = 超里程*超里程单价
                        this.settlementForm.overMileageFee = (value * overMileageUnitPrice).toFixed(2);
                    } else {
                        this.settlementForm.overMileageFee = 0;
                    }
                } else {
                    this.settlementForm.overMileageFee = 0;
                }
            },

            "settlementForm.driverFee": function (value) {//每月司机费用
                this.calculateTotalAmount();
            },
            "settlementForm.vehicleRental": function (value) {//每月车辆租金
                this.calculateTotalAmount();
            },
            "settlementForm.etcFee": function (value) {//ETC费
                this.calculateTotalAmount();
            },
            "settlementForm.driverCommunicationFee": function (value) {//每月司机通讯费
                this.calculateTotalAmount();
            },
            "settlementForm.drivingFee": function (value) {//代驾费
                this.calculateTotalAmount();
            },
            "settlementForm.stayFee": function (value) {//住宿费
                this.calculateTotalAmount();
            },
            "settlementForm.mealFee": function (value) {//餐费
                this.calculateTotalAmount();
            },
            "settlementForm.welfareFee": function (value) {//福利费
                this.calculateTotalAmount();
            },
            "settlementForm.heatSubsidy": function (value) {//高温补贴费
                this.calculateTotalAmount();
            },
            "settlementForm.birthdaySubsidy": function (value) {//生日补贴费
                this.calculateTotalAmount();
            },
            "settlementForm.otherSubsidy": function (value) {//其他补贴费用
                this.calculateTotalAmount();
            },
            "settlementForm.tollFee": function (value) {//本月路桥费
                this.calculateTotalAmount();
            },
            "settlementForm.parkingFee": function (value) {//停车费
                this.calculateTotalAmount();
            },
            "settlementForm.washFee": function (value) {//洗车费
                this.calculateTotalAmount();
            },
            "settlementForm.overworkFee": function (value) {//司机加班费
                this.calculateTotalAmount();
            },
            "settlementForm.extraFee": function (value) {//附加费
                this.calculateTotalAmount();
            },
            "settlementForm.overMileageFee": function (value) {//超里程费用
                this.calculateTotalAmount();
            },
            "settlementForm.payedOilFee": function (value) {//本月支付油费
                this.calculateTotalAmount();
            }
        },
        methods:{
            open(){
                this.resetForm('settlementForm');
                if(this.$route.query.id){
                    //参数格式根据需要调整
                    ajax.get("core/settlement/selectSettlement/" + this.$route.query.id).then(res =>{
                        if(this.checkResponse(res)) {// 验证请求成功状态
                            this.settlementForm = res.data;
                            if(!this.settlementForm.isNeedDriver){
                                this.settlementForm.isNeedDriver = 0;
                            }
                            this.openCollapse = ["1","2","3","4"];
                        }
                    });
                }else{
                    this.settlementForm = {};
                    this.openCollapse = ["1","2","3","4"];
                }

            },
            resetForm(settlementForm) {
                if(this.$refs[settlementForm]){
                    this.$refs[settlementForm].resetFields();
                }
            },
            save() {
                this.$refs['settlementForm'].validate((valid) => {
                    if (valid) {
                        ajax.post("core/settlement/edit", this.settlementForm).then((res) => {
                            if(this.checkResponse(res)) {
                                this.showMessage(res.message, 'success');
                                this.close();
                            }
                        });
                    } else {
                        this.showMessage('校验不通过，请检查输入项');
                        return false;
                    }

                });
            },
            calculateTotalAmount() {
                // 油费类型为“全包”：=每月司机费用+每月车辆租金+ETC费+每月司机通讯费+代驾费+住宿费+餐费+福利费+高温补贴费+生日补贴费+其他补贴费用+本月路桥费+司机加班费+附加费
                // 油费类型为“里程内包”：=每月司机费用+每月车辆租金+ETC费+每月司机通讯费+代驾费+住宿费+餐费+福利费+高温补贴费+生日补贴费+其他补贴费用+本月路桥费+司机加班费+附加费+超里程费用
                // 油费类型为“不包”：=每月司机费用+每月车辆租金+ETC费+每月司机通讯费+代驾费+住宿费+餐费+福利费+高温补贴费+生日补贴费+其他补贴费用+本月路桥费+司机加班费+附加费+本月支付邮费+超里程费用
                let driverFee = this.settlementForm.driverFee;
                if (!driverFee || isNaN(driverFee)) {
                    driverFee = 0;
                }
                let vehicleRental = this.settlementForm.vehicleRental;
                if (!vehicleRental || isNaN(vehicleRental)) {
                    vehicleRental = 0;
                }
                let etcFee = this.settlementForm.etcFee;
                if (!etcFee || isNaN(etcFee)) {
                    etcFee = 0;
                }
                let driverCommunicationFee = this.settlementForm.driverCommunicationFee;
                if (!driverCommunicationFee || isNaN(driverCommunicationFee)) {
                    driverCommunicationFee = 0;
                }
                let drivingFee = this.settlementForm.drivingFee;
                if (!drivingFee || isNaN(drivingFee)) {
                    drivingFee = 0;
                }
                let stayFee = this.settlementForm.stayFee;
                if (!stayFee || isNaN(stayFee)) {
                    stayFee = 0;
                }
                let mealFee = this.settlementForm.mealFee;
                if (!mealFee || isNaN(mealFee)) {
                    mealFee = 0;
                }
                let welfareFee = this.settlementForm.welfareFee;
                if (!welfareFee || isNaN(welfareFee)) {
                    welfareFee = 0;
                }
                let heatSubsidy = this.settlementForm.heatSubsidy;
                if (!heatSubsidy || isNaN(heatSubsidy)) {
                    heatSubsidy = 0;
                }
                let birthdaySubsidy = this.settlementForm.birthdaySubsidy;
                if (!birthdaySubsidy || isNaN(birthdaySubsidy)) {
                    birthdaySubsidy = 0;
                }
                let otherSubsidy = this.settlementForm.otherSubsidy;
                if (!otherSubsidy || isNaN(otherSubsidy)) {
                    otherSubsidy = 0;
                }
                let tollFee = this.settlementForm.tollFee;
                if (!tollFee || isNaN(tollFee)) {
                    tollFee = 0;
                }
                let parkingFee = this.settlementForm.parkingFee;
                if (!parkingFee || isNaN(parkingFee)) {
                    parkingFee = 0;
                }
                let washFee = this.settlementForm.washFee;
                if (!washFee || isNaN(washFee)) {
                    washFee = 0;
                }
                let overworkFee = this.settlementForm.overworkFee;
                if (!overworkFee || isNaN(overworkFee)) {
                    overworkFee = 0;
                }
                let extraFee = this.settlementForm.extraFee;
                if (!extraFee || isNaN(extraFee)) {
                    extraFee = 0;
                }
                let value = 0;

                // 全包
                let allInclusives = Number(driverFee) + Number(vehicleRental) + Number(etcFee) + Number(driverCommunicationFee) + Number(drivingFee) + Number(stayFee) + Number(mealFee) + Number(welfareFee) + Number(heatSubsidy) + Number(birthdaySubsidy) + Number(otherSubsidy) + Number(tollFee) + Number(parkingFee) + Number(washFee) +Number(overworkFee) + Number(extraFee);
                if (this.settlementForm.oilFeePaymentModel == "全包") {
                    value = allInclusives;
                } else if (this.settlementForm.oilFeePaymentModel == "里程内包") {
                    // 超里程费用
                    let overMileageFee = this.settlementForm.overMileageFee;
                    if (!overMileageFee || isNaN(overMileageFee)) {
                        overMileageFee = 0;
                    }
                    value = allInclusives + Number(overMileageFee);
                } else if (this.settlementForm.oilFeePaymentModel == "不包") {
                    // 本月支付油费
                    let payedOilFee = this.settlementForm.payedOilFee;
                    if (!payedOilFee || isNaN(payedOilFee)) {
                        payedOilFee = 0;
                    }
                    // 超里程费用
                    let overMileageFee = this.settlementForm.overMileageFee;
                    if (!overMileageFee || isNaN(overMileageFee)) {
                        overMileageFee = 0;
                    }
                    value = allInclusives + Number(payedOilFee) +Number(overMileageFee);
                }
                this.settlementForm.totalAmount = value.toFixed(2);
            }

        },
        mounted(){
            this.open();

        }
    }
</script>

