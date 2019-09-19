<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆资料-->
                <el-collapse-item title="加油登记维护" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="服务组织" prop="serviceRegionId">
                            <tree-select  placeholder="请选择服务组织" type="one" v-model="companyId"
                                          url="admin/organization/tree?noManager=noManager" @change="getVehicleModalList"></tree-select>
                        </el-form-item>

                        <el-form-item label="车辆" prop="vehicleId">
                            <el-input :readonly = "true" v-model="addForm.plate" clearable @focus="getVehicle()" placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="oilTime" label="加油时间">
                            <el-date-picker type="datetime" placeholder="请选择" v-model="addForm.oilTime" value-format="yyyy-MM-dd HH:mm:ss"
                                            :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="fuelType" label="燃油种类">
                            <el-select v-model="addForm.fuelType" placeholder="" clearable>
                                <el-option label="柴油" :value="1"></el-option>
                                <el-option label="汽油" :value="2"></el-option>
                                <el-option label="电" :value="3"></el-option>
                                <el-option label="气/电" :value="4"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="fuelModel" label="燃油型号">
                            <el-select v-model="addForm.fuelModel" placeholder="" clearable>
                                <el-option label="93#" :value="1"></el-option>
                                <el-option label="97#" :value="2"></el-option>
                                <el-option label="90#" :value="3"></el-option>
                                <el-option label="92#" :value="4"></el-option>
                                <el-option label="95#" :value="5"></el-option>
                                <el-option label="98#" :value="6"></el-option>
                                <el-option label="0#" :value="7"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="oilBear" label="油费承担">
                            <el-select v-model="addForm.oilBear" placeholder="" clearable>
                                <el-option label="公司承担油费" :value="1"></el-option>
                                <el-option label="客户自行承担" :value="2"></el-option>
                                <el-option label="其它" :value="3"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="addOil" label="加油量">
                            <el-input v-model="addForm.addOil" @change="getAmount" clearable maxlength="15" placeholder="非负数油量"
                                      ></el-input>
                        </el-form-item>

                        <el-form-item prop="oilUnitPrice" label="单价(元)">
                            <el-input v-model="addForm.oilUnitPrice" @change="getAmount" clearable maxlength="15" placeholder="非负数单价"
                            ></el-input>
                        </el-form-item>

                        <el-form-item prop="amount" label="金额(元)">
                            <el-input v-model="addForm.amount"  clearable maxlength="15" placeholder="非负数金格"
                            ></el-input>
                        </el-form-item>

                        <el-form-item prop="paymentMethod" label="支付方式">
                            <el-select v-model="addForm.paymentMethod" placeholder="" clearable>
                                <el-option label="现金" :value="1"></el-option>
                                <el-option label="油卡" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item prop="thisMileage" label="加油里程(km)">
                            <el-input v-model="addForm.thisMileage" @change="getMileage" clearable maxlength="15" placeholder="非负数加油里程"
                            ></el-input>
                        </el-form-item>

                        <el-form-item prop="oilPeople" label="加油人">
                            <el-input v-model="addForm.oilPeople"  clearable maxlength="15" placeholder=""
                            ></el-input>
                        </el-form-item>


                        <el-form-item prop="lastMileage" label="上次加油里程(km)">
                            <el-input v-model="addForm.lastMileage" @change="getMileage" clearable maxlength="15" placeholder="非负数上次加油里程"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="里程数(km)">
                            <el-input v-model="addForm.mileage" :readonly = "true" clearable maxlength="15" placeholder=""
                            ></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>

                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                    <el-button @click="close()">关闭</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>

        <!-- 绑定车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="1000"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300" max-width="600%">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="oilTimeText" label="上次加油时间" min-width="200"></el-table-column>
                        <el-table-column prop="thisMileage" label="上次里程数(km)" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="vin" label="车架号" min-width="140"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
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
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'

    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'


    export default {
        mixins: [ tool, ruleTool ],
        name:"plateManageForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            var moneyValidator = {pattern: moneyRegex,required: true, message: '数值输入异常', trigger: 'change'};
            return {
                openCollapse: ['1'],
                dialogDisabled:true,
                show : false,
                organization:[],
                vehicleShow:false,
                companyId:[],
                addForm : {
                },
                listUrl: '/traffic/refuelingRegistration/getVehicleBySelect',
                rules: {
                    serviceRegionId: [
                        {required: true, message: '请选择服务组织', trigger: 'change'}
                    ],
                    vehicleId: [
                        {required: true, message: '请选择所属车辆', trigger: 'change'}
                    ],
                    addOil: [moneyValidator],
                    oilUnitPrice: [moneyValidator],
                    amount: [moneyValidator],
                    oilPeople: [{required: true,max: 100, message: '长度不能超过100个字符', trigger: 'change'}],
                    thisMileage:[moneyValidator],
                    lastMileage:[moneyValidator],
                    oilTime: [
                        {required: true, message: '请选择加油时间', trigger: 'change'}
                    ],
                    fuelType: [
                        {required: true, message: '请选择燃油种类', trigger: 'change'}
                    ],
                    fuelModel: [
                        {required: true, message: '请选择燃油型号', trigger: 'change'}
                    ],
                    oilBear: [
                        {required: true, message: '请选择油费承担', trigger: 'change'}
                    ],
                    paymentMethod: [
                        {required: true, message: '请选择支付方式', trigger: 'change'}
                    ],
                }
            }
        },

        methods:{

            //获取车辆信息
            getVehicleModalList(){
                this.addForm.vehicleId="";
                this.addForm.plate="";
                if (this.companyId.length > 0) {
                    this.$set(this.addForm,"serviceRegionId",this.companyId[0]);
                }else{
                    this.$set(this.addForm,"serviceRegionId","");
                }
            },getVehicle(){
                if(this.companyId!=null && this.companyId!=undefined && this.companyId.length>0 && this.companyId[0] != ""){
                    this.listUrl = 'traffic/refuelingRegistration/getVehicleBySelect?companyId='+this.companyId[0];
                }else{
                    this.listUrl = 'traffic/refuelingRegistration/getVehicleBySelect';
                }
                this.resetList();
                this.vehicleShow = true;
            },
            selectVehicle(row){
                this.$set(this.addForm,"plate",row.plate);
                this.$set(this.addForm,"vehicleId",row.id);
                this.$set(this.addForm,"lastMileage",row.thisMileage);
                if(this.companyId == null ||  this.companyId == undefined || this.companyId.length == 0 || this.companyId[0] == ""){
                    this.companyId.push(row.companyId);
                    this.$set(this.addForm,"serviceRegionId",this.companyId[0]);
                }
                this.vehicleShow = false;
            },
            open(){
                var id = this.$route.query.id;
                if (id){
                    ajax.get('traffic/refuelingRegistration/details/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                        if (rs.data.serviceRegionId) {
                            this.companyId[0]=rs.data.serviceRegionId;
                        }
                    });
                }
                this.show = true;

            },
            submitForm(addForm) {
                var data=this.addForm;
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                       ajax.post('traffic/refuelingRegistration/save', data).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.close();
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },getAmount(){
                var addOil = this.addForm.addOil;
                var oilUnitPrice = this.addForm.oilUnitPrice;
                var amount = parseFloat(addOil) * parseFloat(oilUnitPrice);
                if(!isNaN(amount) && typeof amount == 'number'){
                    this.$set(this.addForm,"amount",amount.toFixed(2));
                }
            },getMileage(){
                var thisMileage = this.addForm.thisMileage;
                var lastMileage = this.addForm.lastMileage;
                var mileage = parseFloat(thisMileage) - parseFloat(lastMileage);
                if(!isNaN(mileage) && typeof mileage == 'number'){
                    this.$set(this.addForm,"mileage",mileage.toFixed(2));
                }
            }
        },
        mounted(){
            this.open();
        }
    }
</script>

