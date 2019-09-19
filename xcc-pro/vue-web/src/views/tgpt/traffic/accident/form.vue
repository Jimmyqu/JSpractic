<template>
    <div class="form-panel">
        <el-form :model="accident" :rules="rules" label-position="top" ref="accident" label-width="100px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="事故信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="服务组织" prop="companyId">
                            <tree-select v-model="organization" :disabled="!completeFlag" placeholder="请选择服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>

                            <!--<el-select v-model="accident.companyId" @change="selectOrganization" clearable placeholder="请选择" :disabled="!completeFlag">
                                <el-option
                                    v-for="item in currentUserInfo"
                                    :key="item.organizationId"
                                    :label="item.organizationName"
                                    :value="item.organizationId">
                                </el-option>
                            </el-select>-->
                        </el-form-item>
                        <el-form-item label="订单号" prop="code">
                            <el-input v-model="accident.code" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="事故车辆" prop="plate">
                            <el-input v-model="accident.plate" @focus="openVehicleList()" placeholder="请选择事故车辆" :disabled="organizationFlag">
                                <el-button @click="openVehicleList()" slot="append" icon="el-icon-search" :disabled="organizationFlag">
                                </el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车型" prop="vehicleModelInfoName">
                            <el-input v-model="accident.vehicleModelInfoName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="事故经手人" prop="handUser">
                            <el-input v-model="accident.handUser" :disabled="organizationFlag" maxlength="10"></el-input>
                            <!--<el-select v-model="accident.handUser" @change="changeUser()" :disabled="organizationFlag" clearable placeholder="请选择事故经手人">
                                <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>-->
                        </el-form-item>
                        <el-form-item label="事故发生时间" prop="accidentTime">
                            <el-date-picker v-model="accident.accidentTime" :disabled="organizationFlag" type="datetime" value-format="yyyy-MM-dd HH:mm" placeholder="请选择事故发生时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="事故地点" prop="accidentPlace">
                            <el-input v-model="accident.accidentPlace" :disabled="organizationFlag" clearable placeholder="请输入事故地点" maxlength="30"></el-input>
                        </el-form-item>
                        <el-form-item label="事故等级" prop="accidentGrade">
                            <el-select v-model="accident.accidentGrade" :disabled="organizationFlag" clearable placeholder="请选择事故等级">
                                <el-option label="小事故" :value="1"></el-option>
                                <el-option label="中事故" :value="2"></el-option>
                                <el-option label="大事故" :value="3"></el-option>
                                <el-option label="特大事故" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事故方" prop="accidentSquare">
                            <el-select v-model="accident.accidentSquare" :disabled="organizationFlag" clearable placeholder="请选择事故方">
                                <el-option label="单方" :value="1"></el-option>
                                <el-option label="双方" :value="2"></el-option>
                                <el-option label="多方" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事故责任" prop="accidentResponsibility">
                            <el-select v-model="accident.accidentResponsibility" :disabled="organizationFlag" clearable placeholder="请选择事故责任">
                                <el-option label="全责" :value="1"></el-option>
                                <el-option label="主责" :value="2"></el-option>
                                <el-option label="次责" :value="3"></el-option>
                                <el-option label="对等" :value="4"></el-option>
                                <el-option label="无责" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事故起因" prop="accidentCause">
                            <el-select v-model="accident.accidentCause" :disabled="organizationFlag" clearable placeholder="请选择事故起因">
                                <el-option label="碰撞" :value="1"></el-option>
                                <el-option label="停放被破坏" :value="2"></el-option>
                                <el-option label="盗窃" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事故具体起因" prop="accidentSpecificCause">
                            <el-select v-model="accident.accidentSpecificCause" :disabled="organizationFlag" clearable placeholder="请选择事故具体起因">
                                <el-option v-for="item in accidentSpecificCauseList" :key="item.value" :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事故总金额" prop="accidentAmount">
                            <!--<el-input v-model="accident.accidentAmount" :disabled="organizationFlag" clearable placeholder="请输入事故总金额" @keyup.native="onlyDecNum($event,'accidentAmount')" maxlength="17"><template slot="append">元</template></el-input>-->
                            <money-input v-model="accident.accidentAmount" :disabled="organizationFlag" clearable  placeholder="请输入事故总金额" unit="元"></money-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="事故描述" name="2" >
                    <div class="flex-panel">
                        <el-form-item label="事故描述" prop="accidentDescription" class = "big">
                            <el-input type="textarea" :disabled="organizationFlag" v-model="accident.accidentDescription" maxlength="450" placeholder="请输入事故描述" :rows="4"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="事故图片" name="3" >
                    <upload-panel :size="5"  :disabled="organizationFlag" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="imgs" :show-img="true"></upload-panel>
                </el-collapse-item>
                <el-collapse-item title="公司关联信息" name="4" >
                    <div class="flex-panel">
                        <el-form-item label="责任人类型" prop="accidentType">
                            <el-select v-model="accident.accidentType" :disabled="organizationFlag" @change="changeAccidentType()" placeholder="全部">
                                <el-option label="企业客户" :value="1"></el-option>
                                <el-option label="司机" :value="2"></el-option>
                                <el-option label="公司员工" :value="3"></el-option>
                                <el-option label="个人客户" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <template v-if="accident.accidentType=='1'">
                            <el-form-item label="服务客户" prop="accidentUser">
                                <el-input v-model="accident.accidentUser" :disabled="organizationFlag" @focus="openEnterpriseList()" placeholder="请选择服务客户">
                                    <el-button @click="openEnterpriseList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </template>
                        <template v-else-if="accident.accidentType=='2'">
                            <el-form-item label="司机" prop="accidentUser">
                                <el-input v-model="accident.accidentUser" :disabled="organizationFlag"  @focus="openDriverList()" placeholder="请选择司机">
                                    <el-button @click="openDriverList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </template>
                        <template v-else-if="accident.accidentType=='3'">
                            <el-form-item label="公司员工" prop="accidentUserId">
                                <el-select v-model="accident.accidentUserId" :disabled="organizationFlag" clearable placeholder="请选择公司员工">
                                    <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <template v-if="accident.accidentType=='4'">
                            <el-form-item label="个人客户" prop="accidentUser">
                                <el-input v-model="accident.accidentUser" :disabled="organizationFlag" @focus="openPersonalCustomerList()" placeholder="请选择个人客户">
                                    <el-button @click="openPersonalCustomerList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </template>
                        <el-form-item label="事故就近城市">
                            <city-select-panel :value.sync="nearCity2" :disabled="organizationFlag" ref="citySelect"></city-select-panel>
                        </el-form-item>

                        <el-form-item label="单据类型" prop="orderType">
                            <el-select v-model="accident.orderType" :disabled="organizationFlag" @change="changeOrderType()" placeholder="请选择单据类型">
                                <el-option label="项目单" :value="1"></el-option>
                                <el-option label="加油单" :value="2"></el-option>
                                <el-option label="维修单" :value="3"></el-option>
                                <el-option label="调拨过程单" :value="4"></el-option>
                            </el-select>
                        </el-form-item>

                        <template v-if="accident.orderType=='1'">
                            <el-form-item label="项目订单" prop="orderNo">
                                <el-input v-model="accident.orderNo" :disabled="organizationFlag" @focus="openProjectOrderList()" placeholder="请选择项目订单">
                                    <el-button @click="openProjectOrderList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="项目合同编号" prop="contractNo">
                                <el-input v-model="accident.contractNo" disabled></el-input>
                            </el-form-item>
                        </template>
                        <template v-if="accident.orderType=='2'">
                            <el-form-item label="加油单" prop="orderNo">
                                <el-input v-model="accident.orderNo" :disabled="organizationFlag" @focus="openFuelBillList()" placeholder="请选择加油单">
                                    <el-button @click="openFuelBillList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </template>
                        <template v-if="accident.orderType=='3'">
                            <el-form-item label="维修单" prop="orderNo">
                                <el-input v-model="accident.orderNo" :disabled="organizationFlag" @focus="openMaintenanceBillList()" placeholder="请选择维修单">
                                    <el-button @click="openMaintenanceBillList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </template>
                        <template v-if="accident.orderType=='4'">
                            <el-form-item label="调拨过程单" prop="orderNo">
                                <el-input v-model="accident.orderNo" :disabled="organizationFlag" @focus="openTransferProcessList()" placeholder="请选择调拨过程单">
                                    <el-button @click="openTransferProcessList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                                    </el-button>
                                </el-input>
                            </el-form-item>
                        </template>
                        <el-form-item label="加速折旧费" prop="acceleratedDepreciation">
                            <!--<el-input v-model="accident.acceleratedDepreciation" :disabled="organizationFlag" clearable placeholder="请输入加速折旧费" @keyup.native="onlyDecNum($event,'acceleratedDepreciation')" maxlength="17"><template slot="append">元</template></el-input>
                        -->
                            <money-input v-model="accident.acceleratedDepreciation" :disabled="organizationFlag" clearable  placeholder="请输入加速折旧费" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="司机处罚费" prop="driverPenalty">
                            <!--<el-input v-model="accident.driverPenalty" :disabled="organizationFlag" clearable placeholder="请输入司机处罚费" @keyup.native="onlyDecNum($event,'driverPenalty')" maxlength="17"><template slot="append">元</template></el-input>-->
                            <money-input v-model="accident.driverPenalty" :disabled="organizationFlag" clearable  placeholder="请输入司机处罚费" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="处置方式" prop="disposalMethod">
                            <el-select v-model="accident.disposalMethod" :disabled="organizationFlag" placeholder="请选择处置方式">
                                <el-option label="维修" :value="1"></el-option>
                                <el-option label="不维修" :value="2"></el-option>
                                <el-option label="报废" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资料情况" prop="driverInformation">
                            <el-input v-model="accident.driverInformation" :disabled="organizationFlag" clearable placeholder="请输入资料情况" maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="驾驶员扣安全奖情况" prop="driverSafetyAward">
                            <el-input v-model="accident.driverSafetyAward" :disabled="organizationFlag" clearable placeholder="请输入司机扣安全奖情况" maxlength="50"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="保险信息" name="5" >
                    <div class="flex-panel">
                        <el-form-item label="交强险保单">
                            <el-input v-model="insurance.trafficNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="交强险到期">
                            <el-input v-model="insurance.trafficExpireDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="交强险承保公司">
                            <el-input v-model="insurance.trafficCompany" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="交强险赔付金额" prop="strongPayoutAmount">
                            <!--<el-input v-model="accident.strongPayoutAmount" :disabled=trafficInsuranceFlag  clearable placeholder="请输入交强险赔付金额" @keyup.native="onlyDecNum($event,'strongPayoutAmount')" maxlength="17"><template slot="append">元</template></el-input>
                        -->
                            <money-input v-model="accident.strongPayoutAmount" :disabled=trafficInsuranceFlag clearable placeholder="请输入交强险赔付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="商业险保单">
                            <el-input v-model="insurance.businessNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="商业险到期">
                            <el-input v-model="insurance.businessExpireDate" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="商业险承保公司">
                            <el-input v-model="insurance.businessCompany" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="商业险赔付金额" prop="businessPayoutAmount">
                            <money-input v-model="accident.businessPayoutAmount" :disabled=businessInsuranceFlag clearable   placeholder="请输入商业险赔付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="上传定损清单">
                            <upload-panel :size="5"  :disabled="organizationFlag" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="lossimgs" :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="费用信息" name="6" >
                    <div class="flex-panel">

                        <el-form-item label="标的车费用" prop="targetCarAmount">
                            <!--<el-input v-model="accident.companyPaymentAmount" :disabled="organizationFlag" clearable placeholder="请输入公司支付金额" @keyup.native="onlyDecNum($event,'companyPaymentAmount')" maxlength="17"><template slot="append">元</template></el-input>
                            --><money-input v-model="accident.targetCarAmount" @blur="calFixedLossAmount" :disabled="organizationFlag" clearable   placeholder="请输入公司支付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="三方车费用" prop="threeCarAmount">
                            <!--<el-input v-model="accident.companyPaymentAmount" :disabled="organizationFlag" clearable placeholder="请输入公司支付金额" @keyup.native="onlyDecNum($event,'companyPaymentAmount')" maxlength="17"><template slot="append">元</template></el-input>
                            --><money-input v-model="accident.threeCarAmount" @blur="calFixedLossAmount" :disabled="organizationFlag" clearable   placeholder="请输入公司支付金额" unit="元"></money-input>
                        </el-form-item>

                        <el-form-item label="定损金额" prop="fixedLossAmount">
                            <money-input v-model="accident.fixedLossAmount" disabled clearable><template slot="append">元</template></money-input>
                        </el-form-item>
                        <el-form-item label="公司支付金额" prop="companyPaymentAmount">
                            <!--<el-input v-model="accident.companyPaymentAmount" :disabled="organizationFlag" clearable placeholder="请输入公司支付金额" @keyup.native="onlyDecNum($event,'companyPaymentAmount')" maxlength="17"><template slot="append">元</template></el-input>
                            --><money-input v-model="accident.companyPaymentAmount" :disabled="organizationFlag" clearable   placeholder="请输入公司支付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="驾驶员支付金额" prop="driverPaymentAmount">
                            <!--<el-input v-model="accident.driverPaymentAmount" :disabled="organizationFlag" clearable placeholder="请输入驾驶员支付金额" @keyup.native="onlyDecNum($event,'driverPaymentAmount')" maxlength="17"><template slot="append">元</template></el-input>
                           --> <money-input v-model="accident.driverPaymentAmount" :disabled="organizationFlag" clearable   placeholder="请输入驾驶员支付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="客户支付金额" prop="customerPaymentAmount">
                            <!--<el-input v-model="accident.customerPaymentAmount" :disabled="organizationFlag" clearable placeholder="请输入客户支付金额" @keyup.native="onlyDecNum($event,'customerPaymentAmount')" maxlength="17"><template slot="append">元</template></el-input>
                            --><money-input v-model="accident.customerPaymentAmount" :disabled="organizationFlag" clearable   placeholder="请输入客户支付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="对方支付金额" prop="otherParty">
                            <!-- <el-input v-model="accident.otherParty" clearable placeholder="请输入对方支付金额" @keyup.native="onlyDecNum($event,'otherParty')" maxlength="17"><template slot="append">元</template></el-input>
                             --><money-input v-model="accident.otherParty" :disabled="completeFlag && organizationFlag" clearable   placeholder="请输入对方支付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="第三方支付金额" prop="thirdPaymentAmount">
                            <!--<el-input v-model="accident.thirdPaymentAmount" clearable placeholder="请输入第三方支付金额" @keyup.native="onlyDecNum($event,'thirdPaymentAmount')" maxlength="17"><template slot="append">元</template></el-input>
                            --><money-input v-model="accident.thirdPaymentAmount" :disabled="completeFlag && organizationFlag" clearable   placeholder="请输入第三方支付金额" unit="元"></money-input>
                        </el-form-item>
                        <el-form-item label="总维修金额" prop="totalAmount">
                            <!--<el-input v-model="accident.totalAmount" :disabled="organizationFlag" clearable placeholder="请输入总维修金额" @keyup.native="onlyDecNum($event,'totalAmount')" maxlength="17"><template slot="append">元</template></el-input>
                           --> <money-input v-model="accident.totalAmount" :disabled="organizationFlag" clearable  placeholder="请输入总维修金额" unit="元"></money-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm('accident')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
        <driverListPanel ref="driverList" @load="selDriver"></driverListPanel>
        <vehicleListPanel ref="vehicleList" @load="selVehicle"></vehicleListPanel>
        <enterpriseListPanel ref="enterpriseList" @load="selEnterprise"></enterpriseListPanel>
        <projectOrderListPanel ref="projectOrderList" @load="selProjectOrder"></projectOrderListPanel>
        <fuelBillListPanel ref="fuelBillList" @load="selFuelBill"></fuelBillListPanel>
        <maintenanceBillListPanel ref="maintenanceBillList" @load="selMaintenanceBill"></maintenanceBillListPanel>
        <transferProcessListPanel ref="transferProcessList" @load="selTransferProcess"></transferProcessListPanel>
        <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer"></personal-customer-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import CitySelectPanel from '@/components/CitySelect/index'
    import driverListPanel from '@/views/tgpt/traffic/accident/driverList'
    import vehicleListPanel from '@/views/tgpt/traffic/accident/vehicleList'
    import enterpriseListPanel from '@/views/tgpt/traffic/accident/enterpriseList'
    import projectOrderListPanel from '@/views/tgpt/traffic/accident/projectOrderList'
    import fuelBillListPanel from '@/views/tgpt/traffic/accident/fuelBillList'
    import maintenanceBillListPanel from '@/views/tgpt/traffic/accident/maintenanceBillList'
    import transferProcessListPanel from '@/views/tgpt/traffic/accident/transferProcessList'
    import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"trafficAccidentEdit",
        components:{TreeSelect,MoneyInput, UploadPanel,CitySelectPanel,driverListPanel,vehicleListPanel,enterpriseListPanel,projectOrderListPanel,fuelBillListPanel,maintenanceBillListPanel,transferProcessListPanel,personalCustomerDialog},
        data: function () {
            return {
                id:"",
                activeNames: ['1','2','3','4','5','6'],
                show:false,
                accidentSpecificCauseList:[],
                userList:[],
                nearCity2:[],
                imgs:[],
                lossimgs:[],
                organization:[],
                completeFlag:true,
                organizationFlag: false,
                trafficInsuranceFlag:true,
                businessInsuranceFlag:true,
                picOneArr:[],
                accident:{},
                insurance:{},
                currentUserInfo : this.getCurrentUserInfo().organizationList,
                rules: {
                    companyId: [
                        { required: true, message: '请选择所在组织', trigger:'change'},
                    ],
                    plate: [
                        { required: true, message: '请选择车辆', trigger:'change'},
                    ],
                    accidentTime: [
                        { required: true, message: '请选择事故发生时间', trigger: 'change'},
                    ],
                    accidentPlace: [
                        { required: true, message: '请选择事故地点', trigger: 'blur' },
                    ],
                    accidentGrade: [
                        { required: true, message: '请选择事故等级', trigger: 'change' },
                    ],
                    accidentSquare: [
                        { required: true, message: '请选择事故方', trigger: 'change' },
                    ],
                    accidentResponsibility: [
                        { required: true, message: '请选择事故责任', trigger: 'change' },
                    ],
                    accidentCause: [
                        { required: true, message: '请选择事故起因', trigger: 'change' },
                    ],
                    accidentSpecialCause: [
                        { required: true, message: '请选择事故详细起因', trigger: 'change' },
                    ],
                    accidentAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    acceleratedDepreciation: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    driverPenalty: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    strongPayoutAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    businessPayoutAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    fixedLossAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    companyPaymentAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    driverPaymentAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    customerPaymentAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    otherParty: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    thirdPaymentAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    totalAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                    threeCarAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'},
                        { required: true, message: '请输入三者车费用', trigger: 'blur' },
                    ],
                    targetCarAmount: [
                        { validator: formRule.validateNumber, trigger:'blur'},
                        { required: true, message: '请输入标的车费用', trigger: 'blur' },
                    ],
                    driverInformation: [
                        { required: true, message: '请输入信息资料', trigger: 'blur' },
                    ],
                    driverSafetyAward: [
                        { required: true, message: '请输入司机扣安全奖情况', trigger: 'blur' },
                    ],
                },
            }
        },
        mounted: function () {//载入后
            this.getUserList();
            this.getAccidentSpecialCauseList();
            this.open();
        },
        methods: {
            //自定义方法
            open(){
                this.openCollapse = ["1","2","3","4","5"];
                this.show = true;
                //id = this.$route.query.id;
                //flag = this.$route.query.flag;
                if(this.$route.query.id){
                    this.id=this.$route.query.id;
                    this.loadAccident(this.id);
                }/*else{
                    this.accident.accidentType='2';
                }*/
                if(this.$route.query.flag==2){//完成
                   // this.accident.operateType=2;
                    this.organizationFlag=true;
                    this.completeFlag=false;
                }else if(this.$route.query.flag==1){//编辑
                   // this.accident.operateType=1;
                    this.organizationFlag=false;
                }
               /* if(this.$refs['accident'])
                    this.$refs['accident'].clearValidate();*/
            },
            openDriverList(){
                this.$refs.driverList.open();
            },
            openVehicleList(){
                if(this.accident.companyId) {
                    this.$refs.vehicleList.open(this.accident.companyId);
                }else{
                    this.$refs.vehicleList.open(null);
                }
            },
            openEnterpriseList(){
                this.$refs.enterpriseList.open();
            },
            openPersonalCustomerList(){
                this.$refs.personalCustomerList.open(this.accident.companyId);
            },
            openProjectOrderList(){
                if(this.accident.vehicleId){
                    this.$refs.projectOrderList.open(this.accident.vehicleId);
                }else
                    this.$message.error("请先选择事故车辆");
            },
            openFuelBillList(){
                if(this.accident.vehicleId){
                    this.$refs.fuelBillList.open(this.accident.vehicleId);
                }else
                    this.$message.error("请先选择事故车辆");
            },
            openMaintenanceBillList(){
                if(this.accident.vehicleId){
                    this.$refs.maintenanceBillList.open(this.accident.vehicleId);
                }else
                    this.$message.error("请先选择事故车辆");
            },
            openTransferProcessList(){
                if(this.accident.vehicleId){
                    this.$refs.transferProcessList.open(this.accident.vehicleId);
                }else
                    this.$message.error("请先选择事故车辆");
            },

            selDriver(row){
                this.$set(this.accident,'accidentUser',row.name);
                this.$set(this.accident,'accidentUserId',row.id);
                this.accident = Object.assign({},this.accident);
            },
            selVehicle(row){
                this.$set(this.accident,'plate',row.plate);
                this.$set(this.accident,'vehicleModelInfoName',row.vehicleModelInfoName);
                this.$set(this.accident,'companyName',row.company);
                this.$set(this.accident,"providerCompanyId",row.providerCompanyId);
                this.accident.vehicleId=row.id;
                if(this.organization == null ||  this.organization == undefined || this.organization.length == 0 || this.organization[0] == ""){
                    this.organization.push(row.companyId);
                }
                this.$set(this.accident,'companyId',row.companyId);


                //this.accident.companyId=row.companyId;
                this.vehicleInsurance(row.id);
            },
            selEnterprise(row){
                this.$set(this.accident,'accidentUser',row.enterpriseName);
                this.$set(this.accident,'accidentUserId',row.id);
                this.accident = Object.assign({},this.accident);
            },
            //选中个人客户
            selectPersonalCustomer(row){
                this.$set(this.accident,"accidentUserId",row.id);
                this.$set(this.accident,'accidentUser',row.name);
                this.accident = Object.assign({},this.accident);
            },
            selProjectOrder(row){
                this.accident.orderId=row.id;
                this.$set(this.accident,'orderNo',row.orderNo);
                this.$set(this.accident,'contractNo',row.contractNo);
                this.accident = Object.assign({},this.accident);
            },
            selFuelBill(row){
                this.accident.orderId=row.id;
                this.$set(this.accident,'orderNo',row.orderNo);
                this.accident = Object.assign({},this.accident);
            },
            selMaintenanceBill(row){
                this.accident.orderId=row.id;
                this.$set(this.accident,'orderNo',row.maintenanceNo);
                this.accident = Object.assign({},this.accident);
            },
            selTransferProcess(row){
                this.accident.orderId=row.id;
                this.$set(this.accident,'orderNo',row.orderNo);
                this.accident = Object.assign({},this.accident);
            },

            loadAccident(id){
                var $this = this;
                ajax.get("core/vehicleaccident/detail/"+id).then(result=>{
                    if(result.status==0){
                        if(result.data && result.data.cityId && result.data.cityId.split(',').length>=2)//转换城市
                            $this.nearCity2=result.data.cityId.split(',');
                        if(result.data && result.data.accidentPic && result.data.accidentPic.length>0)//转换图片
                            $this.imgs=JSON.parse(result.data.accidentPic);
                        if(result.data && result.data.lossPic && result.data.lossPic.length>0)//转换图片
                            $this.lossimgs=JSON.parse(result.data.lossPic);

                        $this.organization=[result.data.companyId];


                        $this.accident=result.data;
                        $this.vehicleInsurance($this.accident.vehicleId);
                    }else{
                        console.log(result.message);
                    }
                })
            },
            changeUser(){
                //this.accident.userId=this.accident
            },
            changeOrderType(){
                this.accident.orderId='';
                this.accident.orderNo='';
                this.accident.contractNo='';
            },
            changeAccidentType(){
                this.accident.accidentUser='';
                this.accident.accidentUserId='';
            },
            onlyDecNum(e,val) {
                console.log(e);
                var $this=this;
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                $this.$set($this.accident,val,$(e.target).val());
            },
            calFixedLossAmount(){
                var fixedLossAmount = 0;
                //标的车费用
                if(this.accident.targetCarAmount){
                var targetCarAmount = this.accident.targetCarAmount.replace(/[^\d|\.]/g,"");
                if(targetCarAmount && !isNaN(targetCarAmount)) {
                    fixedLossAmount += parseFloat(targetCarAmount);
                }
                }
                //三者车费用
                if(this.accident.threeCarAmount){
                var threeCarAmount = this.accident.threeCarAmount.replace(/[^\d|\.]/g,"");
                if(threeCarAmount && !isNaN(threeCarAmount)) {
                    fixedLossAmount += parseFloat(threeCarAmount);
                }
                }
                this.accident.fixedLossAmount=fixedLossAmount;
                this.accident=Object.assign({},this.accident);
            },
            handleSizeChange(val) {

            },
            handleCurrentChange(val) {

            },
            submitForm(accident) {
                var $this = this;
                $this.$refs[accident].validate((valid) => {
                    if (valid) {
                        var url="";
                        if($this.id){
                            $this.accident.id=$this.id;
                            url = "core/vehicleaccident/edit";
                            if($this.$route.query.flag){
                                $this.accident.operateType=$this.$route.query.flag;
                            }
                        }else{
                            url = "core/vehicleaccident/add";
                        }

                        if($this.imgs.length>0)//转换图片
                            $this.accident.accidentPic=JSON.stringify($this.imgs);
                        if($this.lossimgs.length>0)//转换图片
                            $this.accident.lossPic=JSON.stringify($this.lossimgs);
                        if($this.nearCity2.length==2)//转换城市
                            $this.accident.cityId=$this.nearCity2[1];

                        if($this.accident.accidentAmount)
                            $this.accident.accidentAmount=$this.accident.accidentAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.acceleratedDepreciation)
                            $this.accident.acceleratedDepreciation=$this.accident.acceleratedDepreciation.replace(new RegExp(/,/g),'');
                        if($this.accident.driverPenalty)
                            $this.accident.driverPenalty=$this.accident.driverPenalty.replace(new RegExp(/,/g),'');
                        if($this.accident.strongPayoutAmount)
                            $this.accident.strongPayoutAmount=$this.accident.strongPayoutAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.businessPayoutAmount)
                            $this.accident.businessPayoutAmount=$this.accident.businessPayoutAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.fixedLossAmount)
                            $this.accident.fixedLossAmount=$this.accident.fixedLossAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.companyPaymentAmount)
                            $this.accident.companyPaymentAmount=$this.accident.companyPaymentAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.driverPaymentAmount)
                            $this.accident.driverPaymentAmount=$this.accident.driverPaymentAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.customerPaymentAmount)
                            $this.accident.customerPaymentAmount=$this.accident.customerPaymentAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.otherParty)
                            $this.accident.otherParty=$this.accident.otherParty.replace(new RegExp(/,/g),'');
                        if($this.accident.thirdPaymentAmount)
                            $this.accident.thirdPaymentAmount=$this.accident.thirdPaymentAmount.replace(new RegExp(/,/g),'');
                        if($this.accident.totalAmount)
                            $this.accident.totalAmount=$this.accident.totalAmount.replace(new RegExp(/,/g),'');

                        ajax.post(url, $this.accident).then(res=>{
                                if(res.status == 0){
                                    $this.$message({message: '保存成功！',type: 'success'});
                                    $this.close();
                                    $this.$emit('load');
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
            addImg(){
                if(this.imgs.length<50)
                    this.imgs.push([]);
                else
                    this.$message.error("上传图片数量已达上限");
            },
            deleteImg(i){
                this.imgs.splice(i,1);
            },
            vehicleInsurance(id){
                var $this=this;
                ajax.get("core/vehicleaccident/vehicleinsurance/"+id).then(result=>{
                    if(result.status==0){
                        $this.insurance=result.data;
                        if($this.organizationFlag==false){
                            $this.trafficInsuranceFlag=$this.insurance.trafficNo==null?true:false;
                            $this.businessInsuranceFlag=$this.insurance.businessNo==null?true:false;
                        }
                    }else{
                        console.log("no userList data!");
                    }
                })
            },
            getUserList(){
                var $this=this;
                ajax.get("core/vehicleaccident/userlist").then(result=>{
                    if(result.status==0){
                        $this.userList = result.data;
                    }else{
                        console.log("no userList data!");
                    }
                })
            },
            getAccidentSpecialCauseList(){
                var $this=this;
                ajax.get("admin/dict/type/事故具体起因").then(result=>{
                    if(result!=null){
                        $this.accidentSpecificCauseList = result;
                    }else{
                        console.log("no settlementModel data!");
                    }
                });
            },
            changeOrganization(data){
                if(data && data.length==1){
                    //this.organizationFlag= false;
                    this.accident.companyId=data[0].id;
                    this.accident=Object.assign({},this.accident);
                }else{
                   // this.organizationFlag= true;
                    this.organization=[];
                    this.accident={};
                }
            }
        }
    }
</script>

