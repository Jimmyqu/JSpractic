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
                                <span>{{process.driverName}}&nbsp;{{process.driverTelphone}}</span>
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
                <el-collapse-item title="接车信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="接车人" prop="pickUserId">
                            <el-input v-model="editForm.pickUserId" maxlength="50"></el-input>
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
                            <el-input v-model="editForm.otherFeeDescription" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="总费用(元)" prop="totalFee">
                            <el-input v-model="editForm.totalFee" :readonly="true"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="加油明细" name="5">
                    <el-button @click="addDetail()" type="primary" class="float-btn">新增</el-button>
                    <el-table  class="left" :data="editForm.detail" style="width: 100%;margin-top: 10px" border>
                        <el-table-column fixed="right" label="操作" min-width="100">
                            <template slot-scope="{row,$index}">
                                <el-button @click="delDetail(row,$index)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="index" label="序号" min-width="70">
                            <template slot-scope="{row,$index}">
                                <span>{{$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="加油单" min-width="100" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.orderNo'"
                                              :rules="{required: true, message: '请选择加油单', trigger: 'change'}">
                                    <el-input v-model="row.orderNo" placeholder="请选择加油单" @click.native="getOilBill(row, $index)" :readonly="true">
                                        <el-button slot="append" icon="el-icon-search"></el-button>
                                    </el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addOilTime" label="加油时间" min-width="100"></el-table-column>
                        <el-table-column prop="oilTotalAmount" label="加油金额(元)" show-overflow-tooltip min-width="200"></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm()">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>

        <el-dialog
            class="demand-selector big-dialog center"
            title="加油单"
            :visible.sync="oilBillShow"
            width="95%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">订单号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.orderNo" clearable placeholder="请输入订单号"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌号"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300" @row-dblclick="selectOilBill">
                        <el-table-column label="操作" min-width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectOilBill(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="oilNum" sortable label="加油单号" min-width="200"></el-table-column>
                        <el-table-column prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>
                        <el-table-column prop="plate" sortable label="车辆" min-width="120"></el-table-column>
                        <el-table-column prop="modelName" sortable show-overflow-tooltip label="车型名称" min-width="200"></el-table-column>
                        <el-table-column prop="addOilTime" sortable label="加油时间" min-width="200"></el-table-column>
                        <el-table-column prop="oilCost" sortable label="加油金额(元)" min-width="120"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-sizes="pageSizeSetting"
                        :page-size="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        name: "trafficProcessPickArrival",
        mixins:[tool, ruleTool],
        components:{
        },
        data: function() {
            return {
                partsForm:{},
                openCollapse:["1","2","3","4","5"],
                show: false, //控制当前弹窗显示
                editForm: {
                    detail: []
                }, //表单数据
                process: {}, //调拨过程详情信息
                oilBillShow: false, //控制加油单弹窗显示
                listUrl:"core/process/oilBillList", //车辆列表接口
                selectIndex: 0, //选择的数据索引
                rules: {
                    pickUserPhone: [
                        {validator: formRule.phone, message: "手机号码为11位数字", trigger: "blur"}
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
            },
            open(){
                this.partsForm.id = this.$route.query.id;
                this.getUpdateData();
            },
            getUpdateData() {
                ajax.get("core/process/detail/" + this.partsForm.id).then(result =>{
                    this.process = result.data;
                    this.editForm = result.data;
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
            //计算调度总费用
            calTotalFee() {
                var totalFee = 0;

                //调度人工费
                var laborFee = this.editForm.laborFee;
                if(laborFee && !isNaN(laborFee)) {
                    totalFee += parseFloat(laborFee);
                }
                //加油费
                var fuelCosts = this.editForm.fuelCosts;
                if(fuelCosts && !isNaN(fuelCosts)) {
                    totalFee += parseFloat(fuelCosts);
                }
                //餐费
                var mealFee = this.editForm.mealFee;
                if(mealFee && !isNaN(mealFee)) {
                    totalFee += parseFloat(mealFee);
                }
                //交通费
                var transportationFee = this.editForm.transportationFee;
                if(transportationFee && !isNaN(transportationFee)) {
                    totalFee += parseFloat(transportationFee);
                }
                //住宿费
                var accommodationFee = this.editForm.accommodationFee;
                if(accommodationFee && !isNaN(accommodationFee)) {
                    totalFee += parseFloat(accommodationFee);
                }
                //路桥费
                var roadFee = this.editForm.roadFee;
                if(roadFee && !isNaN(roadFee)) {
                    totalFee += parseFloat(roadFee);
                }
                //停车费
                var parkingFee = this.editForm.parkingFee;
                if(parkingFee && !isNaN(parkingFee)) {
                    totalFee += parseFloat(parkingFee);
                }
                //拖车费
                var towingFee = this.editForm.towingFee;
                if(towingFee && !isNaN(towingFee)) {
                    totalFee += parseFloat(towingFee);
                }
                //保险费
                var insurance = this.editForm.insurance;
                if(insurance && !isNaN(insurance)) {
                    totalFee += parseFloat(insurance);
                }
                //其他费用
                var otherFee = this.editForm.otherFee;
                if(otherFee && !isNaN(otherFee)) {
                    totalFee += parseFloat(otherFee);
                }
                this.editForm.totalFee = totalFee.toFixed(2);
            },
            //计算加油费
            calFuelCost() {
                var fuelCosts = 0;
                if(this.editForm.detail && this.editForm.detail.length > 0) {
                    this.editForm.detail.forEach((row) => {
                        if(row.oilTotalAmount && !isNaN(row.oilTotalAmount)) {
                            fuelCosts += parseFloat(row.oilTotalAmount);
                        }
                    });
                }
                this.editForm.fuelCosts = fuelCosts;

                //计算总费用
                this.calTotalFee();
            },
            //添加详情数据
            addDetail() {
                if(!this.editForm.detail) {
                    this.editForm.detail = [];
                }
                this.editForm.detail.push({});
            },
            //删除详情数据
            delDetail(row,index) {
                this.editForm.detail.splice(index,1);
                //重新计算加油费
                this.calFuelCost();
            },
            //查询加油单信息
            getOilBill(row, index) {
                this.oilBillShow = true;
                this.selectIndex = index;
                this.resetSearchParam();
                this.getList();
            },
            //选择加油卡
            selectOilBill(row) {
                var data = this.editForm.detail[this.selectIndex];
                data["vehicleFuelOilBillId"] = row.id;
                data["orderNo"] = row.oilNum;
                data["oilTotalAmount"] = row.oilCost;
                data["addOilTime"] = row.addOilTime;
                this.$set(this.editForm.detail, this.selectIndex, data);
                this.oilBillShow = false;
                this.searchParam = {};
                this.calFuelCost();
            },
            //更新加油卡查询条件
            resetSearchParam() {
                var oilBillIds = [];
                if(this.editForm.detail && this.editForm.detail.length > 0) {
                    this.editForm.detail.forEach((row) => {
                        if(null != row.oilId && "" != row.oilId) {
                            oilBillIds.push(row.oilId);
                        }
                    });
                }
                this.searchParam.oilBillIds = oilBillIds.join(",");
                this.searchParam.vehicleId = this.editForm.vehicleId;
            },
            //保存数据
            submitForm() {
                this.$refs["editForm"].validate((valid) => {
                    if(!valid) {
                        return false;
                    }
                    ajax.post("core/process/arrival",this.editForm).then(result =>{
                        if(result.status == 0){
                            this.showMessage("保存成功","success",() => {
                                this.close();
                            });
                        } else {
                            this.showMessage(result.message,"error");
                        }
                    });
                });
            }
        }

    }
</script>
