<template>
    <div class="form-panel">
        <el-form :model="dataForm" label-position="top" :rules="rules" ref="dataForm" label-width="100px">
            <el-collapse v-model="openCollapse" @change="handleChange">
                <!--车辆采购信息-->
                <el-collapse-item title="车辆采购信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="订单号">
                            <el-input v-model="detailForm.orderNumber" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="采购方式">
                            <el-input value="新购" v-if="detailForm.purchaseMethod==1" disabled></el-input>
                            <el-input value="租赁" v-if="detailForm.purchaseMethod==2" disabled></el-input>
                            <el-input value="现有车辆安排" v-if="detailForm.purchaseMethod==3" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="用车城市">
                            <el-input v-model="detailForm.deliveryCityName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="交车城市">
                            <el-input v-model="detailForm.deliveryCityName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="车型">
                            <el-input v-model="detailForm.vehicleModelInfoName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="预计到车时间">
                            <el-input v-model="detailForm.planDeliveryDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="要求到位时间">
                            <el-input v-model="detailForm.requiredDeliveryDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="采购申请人">
                            <el-input v-model="detailForm.purchaseApplicant" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="颜色">
                            <el-input v-model="detailForm.color" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                           <span v-if="detailForm.state==1">
                                    <el-input value="新增" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==2">
                                    <el-input value="已到车" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==3">
                                    <el-input value="已提车" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==4">
                                    <el-input value="待交车" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==5">
                                    <el-input value="完成" disabled></el-input>
                                </span>
                            <span v-else-if="detailForm.state==6">
                                    <el-input value="终止" disabled></el-input>
                                </span>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="车辆采购信息-到车" name="2">
                    <div class="flex-panel">
                        <el-form-item label="供应商回复到车时间">
                            <el-input v-model="detailForm.supplierPlanDeliveryDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="实际到车时间">
                            <el-input v-model="detailForm.actualDeliveryDate" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <el-collapse-item title="车辆采购信息-保险" name="3">
                    <div class="flex-panel">
                        <el-form-item label="商业险">
                            <el-input v-model="dataForm.businessInsuranceNo"
                                      @focus="openInsuranceSelect('businessInsurance',1)"></el-input>
                        </el-form-item>
                        <el-form-item label="交强险">
                            <el-input v-model="dataForm.compulsoryInsuranceNo"
                                      @focus="openInsuranceSelect('compulsoryInsurance',2)"></el-input>
                        </el-form-item>
                        <el-form-item label="乘运险">
                            <el-input v-model="dataForm.carrierInsuranceNo"
                                      @focus="openInsuranceSelect('carrierInsurance',3)"></el-input>
                        </el-form-item>
                    </div>

                    <div class="flex-panel">
                        <el-form-item label="保险确认人">
                            <el-input disabled v-model="dataForm.insuranceConfirmPerson"></el-input>
                        </el-form-item>

                        <el-form-item label="保险确认时间">
                            <el-date-picker type="datetime"
                                            format="yyyy-MM-dd HH:mm"
                                            value-format="yyyy-MM-dd HH:mm"
                                            range-separator="至"
                                            placeholder="请选择保险确认时间" v-model="dataForm.insuranceConfirmDate"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div class="left-row">
            <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
            <el-button @click="close">返回</el-button>
        </div>

        <!-- 保险选择  -->
        <el-dialog class="full-input" :visible.sync="showInsuranceSelect" title="选择保险" width="800px" append-to-body>
            <el-row :gutter="20">
                <el-col :span="10">
                    <div class="grid-content bg-purple">
                        <div class="form-group">

                            <el-input style=" width: calc(100% - 80px)"
                                      placeholder="请输入车架号" v-model="searchParam.vin"
                                      :disabled="insuranceVinDisabled"></el-input>
                            <button class="btn btn-primary defaultSearchButton" @click="getList"
                                    style="margin-left: 10px;">
                                查询
                            </button>
                        </div>
                    </div>
                </el-col>
            </el-row>

            <div class="row tool-box">
            </div>
            <div class="row">
                <template>
                    <el-table :data="list" border style="width: 100%" @row-dblclick="selectInsurance($event)">
                        <el-table-column prop="policyNumber" label="保单号" width="200" sortable>
                            <template slot-scope="scope">
                                <div>
                                    <a data-title="维修保养单详情" data-index="detail"
                                       :data-href="'modules/traffic/insuranceBill/detail.html?id='+scope.row.id"
                                       onclick="showIFrameTab(this)" style="text-decoration: underline;">{{scope.row.policyNumber}}</a>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vin" label="车架号" sortable min-width="200"></el-table-column>
                        <el-table-column prop="insuranceCompany" label="保险公司" sortable
                                         min-width="150"></el-table-column>
                        <el-table-column prop="insuredDate" label="投保日期" sortable min-width="100"></el-table-column>
                        <el-table-column prop="expiryDate" label="到期日" sortable min-width="100"></el-table-column>
                        <el-table-column prop="warrantyStatus" label="保单状态" sortable min-width="100"></el-table-column>
                        <el-table-column prop="insuranceType" label="保险类" sortable min-width="200"></el-table-column>
                        <el-table-column prop="insuranceCost" label="签单保费" sortable min-width="120"></el-table-column>
                        <el-table-column prop="vehiclePlate" label="车辆" sortable min-width="120"></el-table-column>
                        <el-table-column prop="vehicleModel" label="车型" show-overflow-tooltip sortable
                                         min-width="200"></el-table-column>
                        <el-table-column prop="companyName" label="所属组织" sortable min-width="150"></el-table-column>
                        <el-table-column prop="engineNo" label="发动机号" sortable min-width="150"></el-table-column>
                        <el-table-column prop="licenseName" label="行驶证车主" sortable min-width="120"></el-table-column>
                        <el-table-column prop="billStatusText" label="状态" sortable min-width="200"></el-table-column>
                        <el-table-column prop="policySalesman" label="保单业务员" sortable min-width="120"></el-table-column>
                        <el-table-column prop="phone" label="联系电话" sortable min-width="150"></el-table-column>
                        <el-table-column prop="remarks" label="备注" show-overflow-tooltip sortable
                                         min-width="200"></el-table-column>
                    </el-table>
                </template>
                <div class="block">
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
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"demoForm",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data() {
            return {
                openCollapse: ["1", "2", "3", "4", "5", "6"],
                show: false,
                purchaseForm:{
                    id : "",
                },
                detailForm: {},
                dataForm: {
                    insuranceConfirmPerson: this.getCurrentUserInfo().name,
                    insuranceConfirmDate: new Date().format('yyyy-MM-dd hh:mm')
                },
                rules: {
                    insuranceConfirmDate: [
                        {required: true, message: '请输入保险确认时间', trigger: 'change'}
                    ]
                },
                perData: [],
                plateData: [],
                searchParam: {},
                showInsuranceSelect: false,
                listUrl: '/core/insuranceBill/list',
                insuranceVinDisabled: false
            }
        },
        watch: {
        },
        methods: {
            open() {
                this.dataForm = {
                    insuranceConfirmPerson: this.getCurrentUserInfo().name,
                    insuranceConfirmDate: new Date().format('yyyy-MM-dd hh:mm'),
                    id: this.purchaseForm.id
                };
                ajax.get('/core/purchaseProcess/findById', {id: this.purchaseForm.id}).then(rs => {
                    this.detailForm = rs.data;

                    this.$set(this.dataForm, 'businessInsuranceNo', this.detailForm.businessInsuranceNo);
                    this.$set(this.dataForm, 'compulsoryInsuranceNo', this.detailForm.compulsoryInsuranceNo);
                    this.$set(this.dataForm, 'carrierInsuranceNo', this.detailForm.carrierInsuranceNo);

                    this.$set(this.dataForm, 'businessInsuranceId', this.detailForm.businessInsuranceId);
                    this.$set(this.dataForm, 'compulsoryInsuranceId', this.detailForm.compulsoryInsuranceId);
                    this.$set(this.dataForm, 'carrierInsuranceId', this.detailForm.carrierInsuranceId);
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        ajax.post('/core/purchaseProcess/insurance', JSON.stringify(this.dataForm)).then(rs => {
                            if (rs.status == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });

                                this.close();
                                this.$emit('load');
                            }
                            else
                                this.$message.error(rs.message);
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleChange(val) {
                console.log(val);
            },
            openInsuranceSelect(field, type) {
                this.searchParam = {
                    field: field,
                    insuranceType: type,
                    billStatus: 40,
                    warrantyStatus: 1
                };

                if (this.detailForm.vin) {
                    this.searchParam.vin = this.detailForm.vin;
                    this.insuranceVinDisabled = true;
                } else
                    this.insuranceVinDisabled = false;
                this.showInsuranceSelect = true;
                this.getList();
            },
            selectInsurance(row) {
                this.showInsuranceSelect = false;
                this.$set(this.dataForm, this.searchParam.field + 'No', row.policyNumber);
                this.$set(this.dataForm, this.searchParam.field + 'Id', row.id);
            },
            selectVehicle(row) {
                this.showVehiclePlateSelect = false;
                this.$set(this.dataForm, 'vehicleInfo', row);
                this.$set(this.dataForm, 'vehicleId', row.id);
            }
        },
        mounted() {
            this.purchaseForm.id = this.$route.query.id;
            this.open();
        }
    }
</script>

