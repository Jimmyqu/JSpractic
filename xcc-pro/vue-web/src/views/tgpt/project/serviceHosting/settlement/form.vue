<template>
    <div class="form-panel">
        <el-form :model="settlementForm" :rules="rules" label-position="top" ref="settlementForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="基本信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="月结单号">
                            <el-input v-model="settlementForm.settlementNo" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="月份">
                            <el-input v-model="settlementForm.month" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务客户" >
                            <el-input v-model="settlementForm.enterpriseName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="结算操作人" prop="name">
                            <el-input v-model="userInfo.name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="结算操作时间" >
                            <el-input v-model="settlementForm.settlementTime" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="本月使用情况" name="3">
                    <!--本月使用情况-->
                    <div class="flex-panel">
                        <el-form-item label="车辆总台数" prop="vehicleTotalQuantity">
                            <el-input v-model="settlementForm.vehicleTotalQuantity" placeholder="请输入车辆总台数" clearable maxlength="10"></el-input>
                        </el-form-item>

                        <el-form-item label="车辆本月总费用" prop="vehicleTotalCost">
                            <el-input v-model="settlementForm.vehicleTotalCost" placeholder="请输入车辆本月总费用" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="司机总人数" prop="driverTotalQuantity">
                            <el-input v-model="settlementForm.driverTotalQuantity" placeholder="请输入司机本月总人数" clearable maxlength="10"></el-input>
                        </el-form-item>

                        <el-form-item label="司机本月总费用" prop="drvierTotalCost">
                            <el-input v-model="settlementForm.driverTotalCost" placeholder="请输入司机本月总费用" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="其他费用" prop="otherCost">
                            <el-input v-model="settlementForm.otherCost" placeholder="请输入其他费用" clearable maxlength="14"><template slot="append">元</template></el-input>
                        </el-form-item>

                        <el-form-item label="本月总费用" prop="totalCost">
                            <el-input v-model="settlementForm.totalCost" :disabled="true"><template slot="append">元</template></el-input>
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
        name:"serviceHostingSettlementEdit",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data(){
            return {
                openCollapse:["1","2","3","4"],
                settlementForm:{},
                userInfo: this.getCurrentUserInfo(),
                rules: {
                    vehicleTotalQuantity: [
                        {required: true, message: '请输入车辆总台数', trigger: 'change'},
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "change"}
                    ],
                    driverTotalQuantity: [
                        {required: true, message: '请输入司机总人数', trigger: 'change'},
                        {validator: formRule.standardSize, message: "请输入整数", trigger: "change"}
                    ],
                    vehicleTotalCost: [
                        {required: true, message: '请输入车辆本月总费用', trigger: 'change'},
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    driverTotalCost: [
                        {required: true, message: '请输入司机本月总费用', trigger: 'change'},
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ],
                    otherCost: [
                        {required: true, message: '请输入其他费用', trigger: 'change'},
                        {validator: formRule.money, message: "请输入最大11位整数，2位小数", trigger: "change"}
                    ]
                },
                activeFgsArray: [],
                orgSelectId: []
            }
        },
        watch: {
            "settlementForm.driverTotalCost": function (value) {
                this.calculateTotalAmount();
            },
            "settlementForm.vehicleTotalCost": function (value) {
                this.calculateTotalAmount();
            },
            "settlementForm.otherCost": function (value) {
                this.calculateTotalAmount();
            },
            "settlementForm.totalCost": function (value) {
                this.calculateTotalAmount();
            }
        },
        methods:{
            open(){
                this.resetForm('settlementForm');
                if(this.$route.query.id){
                    //参数格式根据需要调整
                    ajax.get("core/serviceHostingSettlement/detail/" + this.$route.query.id).then(res =>{
                        if(this.checkResponse(res)) {// 验证请求成功状态
                            this.settlementForm = res.data;
                        }
                    });
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
                        ajax.post("core/serviceHostingSettlement/settle", this.settlementForm).then((res) => {
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
                let driverTotalCost = this.settlementForm.driverTotalCost;
                if (!driverTotalCost || isNaN(driverTotalCost)) {
                    driverTotalCost = 0;
                }
                let vehicleTotalCost = this.settlementForm.vehicleTotalCost;
                if (!vehicleTotalCost || isNaN(vehicleTotalCost)) {
                    vehicleTotalCost = 0;
                }
                let otherCost = this.settlementForm.otherCost;
                if (!otherCost || isNaN(otherCost)) {
                    otherCost = 0;
                }
                this.settlementForm.totalCost = (Number(driverTotalCost) + Number(vehicleTotalCost) + Number(otherCost)).toFixed(2);
            }
        },
        mounted(){
            this.open();
        }
    }
</script>

