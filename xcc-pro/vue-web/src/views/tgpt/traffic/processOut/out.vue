<template>
    <div class="form-panel">
        <el-form :model="editForm" :rules="rules" label-position="top" ref="editForm" label-width="100px">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="调拨信息" name="1">
                <div class="flex-panel">
                    <el-form-item label="调度前组织">
                        <el-input v-model="editForm.beforeCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="出车城市">
                        <el-input v-model="editForm.depCityName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="调度后组织">
                        <el-input v-model="editForm.afterCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="到达城市">
                        <el-input v-model="editForm.arrivalCityName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="车型">
                        <el-input v-model="process.modelName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="油箱容量(L)">
                        <el-input v-model="process.fuelCapacity" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="预计调拨时间">
                        <el-input v-model="process.transferTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="调拨原因">
                        <el-input v-model="process.reasonText" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="预计费用(元)">
                        <el-input v-model="process.estimatedCost" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="是否过户">
                        <el-select v-model="process.isTransfer" disabled>
                            <el-option :key="1" label="是" :value="1"></el-option>
                            <el-option :key="0" label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否送车">
                        <el-select v-model="process.isSend" disabled>
                            <el-option :key="1" label="是" :value="1"></el-option>
                            <el-option :key="0" label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-collapse-item>
            <el-collapse-item title="出车" name="2">
                <div class="flex-panel">
                    <el-form-item label="车辆" prop="plate">
                        <el-input v-model="editForm.plate" placeholder="请选择车辆" @click.native="getVehicle" :readonly="true">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="驾驶员" prop="driverId">
                        <el-input v-model="process.driverName" maxlength="50" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="驾驶员手机号" prop="driverTelphone">
                        <el-input v-model="process.driverTelphone" maxlength="11" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="出车时间" prop="outsetTime">
                        <el-date-picker type="datetime" placeholder="请选择出车时间" value-format="yyyy-MM-dd HH:mm" v-model="editForm.outsetTime" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="出车里程(km)" prop="outsetMileage">
                        <el-input v-model="editForm.outsetMileage"></el-input>
                    </el-form-item>
                    <el-form-item label="出车油量(%)" prop="outsetOilPercent">
                        <el-input v-model="editForm.outsetOilPercent" @blur="calOil"></el-input>
                    </el-form-item>
                    <el-form-item label="出车油量(L)" prop="outsetOil">
                        <el-input v-model="editForm.outsetOil" :readonly="true"></el-input>
                    </el-form-item>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-form-item class="left-row">
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button @click="close()">返回</el-button>
        </el-form-item>
    </el-form>
        <!--选择车辆弹出框-->
        <el-dialog
            class="demand-selector  center"
            title="车辆"
            :visible.sync="vehileShow"
            width="60%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" clearable placeholder="请输入车牌"></el-input>
                            </div>
                        </div>
                       <!-- <div class="form-group">
                            <label class="control-label">经营城市</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.runCity" clearable placeholder="请输入经营城市"></el-input>
                            </div>
                        </div>-->
                        <div class="form-group">
                            <label class="control-label">车辆状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.vehicleStatus" clearable>
                                    <el-option
                                        v-for="(value, key) in vehicleStatus"
                                        :key="key"
                                        :label="value"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300" @row-dblclick="selectVehilce">
                        <el-table-column label="操作" min-width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehilce(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" sortable label="服务组织" min-width="200"></el-table-column>
                        <el-table-column prop="plate" sortable label="车牌" min-width="120"></el-table-column>
                        <el-table-column prop="modelName" sortable show-overflow-tooltip label="车型" min-width="200"></el-table-column>
                        <el-table-column prop="color" sortable label="颜色" min-width="120"></el-table-column>
                        <el-table-column prop="registerCity" sortable label="注册城市" min-width="120"></el-table-column>
                        <!--<el-table-column prop="runCity" sortable label="经营城市" min-width="120"></el-table-column>-->
                        <el-table-column prop="vehicleStatusText" sortable label="车辆状态" min-width="120"></el-table-column>
                        <el-table-column prop="registrationDate" sortable label="上牌日期" min-width="120"></el-table-column>
                        <el-table-column prop="assetsTypeText" sortable label="资产属性" min-width="120"></el-table-column>
                        <el-table-column prop="plateTypeText" sortable label="车牌属性" min-width="120"></el-table-column>
                        <el-table-column prop="useNature" sortable label="经营属性" min-width="120"></el-table-column>
                        <el-table-column prop="fuelType" sortable label="燃油类型" min-width="120"></el-table-column>
                        <el-table-column prop="fuelCapacity" sortable label="油箱容量" min-width="120"></el-table-column>
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
    import { setListWidth } from '@/utils/index'
    export default {
        name: "trafficProcessOutAdd",
        mixins:[tool , ruleTool],
        components:{

        },

        data() {
            return {
                openCollapse:["1","2"],
                show: false, //控制当前弹窗显示
                vehileShow: false, //控制车辆弹窗显示
                listUrl:"core/process/vehicleList", //车辆列表接口
                editForm: {}, //表单数据
                drivers: [], //司机信息
                process: {}, //调拨过程详情信息
                vehicleStatus: {}, //车辆状态
                partsForm : {
                    id: ""
                },
                rules: {
                    plate: [
                        {required: true, message: "请选择车辆", trigger: "change"}
                    ],
                    driverName: [
                        {required: true, message: "请选择驾驶员", trigger: "blur"}
                    ],
                    outsetMileage: [
                        {required: true, message: "请输入出车里程", trigger: "blur"},
                        {validator: formRule.money, message: "整数最大11位，小数最大2位", trigger: "blur"}
                    ],
                    outsetOilPercent: [
                        {required: true, message: "请输入出车油量", trigger: "blur"},
                        {validator: formRule.cess, message: "不大于100，小数最大2位", trigger: "blur"}
                    ],
                    driverTelphone: [
                        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号码格式错误', trigger: ['blur', 'change']}]
                }
            }
        },
        /*页面加载之前请求数据*/
        beforeMount: function() {
            this.init();
        },

        /*页面加载完成*/
        mounted: function() {
            const id = this.$route.query.id;
            this.open(id);
        },

        methods: {
            //数据初始化
            init() {
                //车辆状态
                ajax.get("core/process/getVehicleEnumData/vehicle_status").then(
                    result => {
                        if(result.status == 0){
                            delete result.data["3"];
                            this.vehicleStatus = result.data;
                        }
                    }
                )

            },
            open(id){
                this.$refs["editForm"].clearValidate();
                this.partsForm.id = id;
                this.getUpdateData();
            },

            getUpdateData() {
                ajax.get("core/process/detail/" + this.partsForm.id).then(
                    result => {
                        if(result.status == 0) {
                            this.process = result.data;
                            this.editForm = result.data;
                            //获取司机信息
                            ajax.get("core/process/getDriverBySelect/" + this.process.beforeCompany).then(
                                res => {
                                    if(res.status == 0) {
                                        this.drivers = res.data;
                                    }
                                }, error2 => {
                                    console.log(error2);
                                }
                            )
                        } else {
                            this.showMessage(result.message,"error");
                        }
                        this.$nextTick(_ =>{
                            if(this.$refs["editForm"]) {
                                this.$refs["editForm"].clearValidate();
                            }
                        });
                    },error =>{
                        console.log(error);
                        this.showMessage("系统异常,请联系系统管理员","error");
                    }
                )
            },
            //查询车辆信息
            getVehicle() {
                this.vehileShow = true;
                this.resetSearchParam();
                this.getList();
            },
            //选择车辆
            selectVehilce(row) {
                this.editForm.vehicleId = row.id;
                this.process.plate = row.plate;
                this.vehileShow = false;
                this.searchParam = {};
            },
            //更新车辆查询条件
            resetSearchParam() {
                var vehicleIds = [];
                if(this.editForm.vehicleId && "" != this.editForm.vehicleId) {
                    vehicleIds.push(this.editForm.vehicleId);
                }
                this.searchParam.vehicleIds = vehicleIds.join(",");
                this.searchParam.vehicleModelInfoId = this.process.vehicleModelInfoId;
                this.searchParam.companyId = this.process.beforeCompany;
                if(this.process.isTransfer == 1){
                    //是否过户
                    this.searchParam.vehicleSource=1;
                }
            },

            //计算出车油量
            calOil() {
                var fuelCapacity = this.process.fuelCapacity;
                var outsetOilPercent = this.process.outsetOilPercent;
                if(fuelCapacity && !isNaN(fuelCapacity) && outsetOilPercent && !isNaN(outsetOilPercent)) {
                    fuelCapacity = parseFloat(fuelCapacity);
                    outsetOilPercent = parseFloat(outsetOilPercent);
                    if(outsetOilPercent <= 100) {
                        this.process.outsetOil = (fuelCapacity * outsetOilPercent / 100).toFixed(2);
                        return;
                    }
                }
                this.process.outsetOil = 0;
            },
            //保存数据
            submitForm() {
                this.$refs["editForm"].validate((valid) => {
                    if(!valid) {
                        return false;
                    }
                    ajax.post("core/process/out" , this.editForm).then(
                        result => {
                            if(result.status == 0){
                                this.showMessage("保存成功","success",() => {
                                    this.close();
                                });
                            } else {
                                this.showMessage(result.message,"error");
                            }
                        }, error => {
                            console.log(error);
                            this.showMessage("系统异常,请联系系统管理员","error");
                        }
                    )

                });
            },
        }


    }
</script>
