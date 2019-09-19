<template>
  <div class="form-panel">
    <el-form ref="scheduleForm" :model="scheduleForm" :rules="rules" label-position="top" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="订单基本信息" name="1">
          <div class="flex-panel">
            <el-form-item label="所属组织" prop="organizationId">
              <tree-select
                v-model="organization"
                placeholder="请选择所属组织"
                type="one"
                url="admin/organization/tree?noManager=noManager"
                @change="changeOrganization"
              />
            </el-form-item>
            <el-form-item label="是否为补录订单" prop="reason">
              <el-select v-model="scheduleForm.isRecordOrder" placeholder="是否为补录订单">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="散租类型" prop="scheduleType">
              <el-select v-model="scheduleForm.scheduleType" placeholder="请选择散租类型" @change="scheduleTypeChange()">
                <el-option label="散租自驾" :value="1" />
                <el-option label="散租配驾" :value="2" />
                <el-option label="替代车" :value="3" />
                <el-option label="公务车" :value="4" />
                <el-option label="代驾" :value="5" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户类型" prop="customerType">
              <el-select v-model="scheduleForm.customerType" placeholder="请选择客户类型" :disabled="organizationFlag" @change="changeCustomerType">
                <el-option :key="1" label="企业客户" :value="1" />
                <el-option :key="2" label="个人客户" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="服务客户" prop="enterpriseId">
              <el-input v-model="scheduleForm.enterpriseName" readonly :disabled="organizationFlag" placeholder="请选择服务客户">
                <el-button slot="append" :disabled="organizationFlag" icon="el-icon-search" @click="openEnterpriseList()" />
              </el-input>
            </el-form-item>
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="scheduleForm.contractNo" readonly :disabled="organizationFlag">
                <template slot="append"><el-button class="el-icon-search" :disabled="organizationFlag" @click.native="openContract" /></template>
              </el-input>
            </el-form-item>
            <el-form-item label="用车人" prop="user">
              <el-input v-model="scheduleForm.user" clearable maxlength="50" :disabled="organizationFlag" />
            </el-form-item>
            <el-form-item label="用车人手机号" prop="phone">
              <el-input v-model="scheduleForm.phone" clearable maxlength="11" :disabled="organizationFlag" />
            </el-form-item>
            <el-form-item label="用车人数" prop="userNum">
              <el-input-number v-model="scheduleForm.userNum" :min="1" :max="99" :disabled="organizationFlag" />
            </el-form-item>
            <el-form-item label="用车时间" prop="useTime">
              <el-date-picker v-model="scheduleForm.useTime" clearable type="datetime" :picker-options="pickeroptions" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" :disabled="organizationFlag" />
            </el-form-item>
            <el-form-item label="用车事由" prop="reason">
              <el-input v-model="scheduleForm.reason" clearable maxlength="50" :disabled="organizationFlag" />
            </el-form-item>
            <el-form-item label="出发地址" prop="depAddress">
              <!--<el-input clearable maxlength="50" id="depAddress" name="depAddress" v-model="scheduleForm.depAddress" :disabled="organizationFlag"></el-input>-->
              <!-- <el-autocomplete
                                id="depAddress"
                                name="depAddress"
                                popper-class="inline-input"
                                v-model="scheduleForm.depAddress"
                                :disabled="organizationFlag"
                                clearable
                                :fetch-suggestions="querySearch"
                                placeholder="请输入出发地址"
                                :trigger-on-focus="false"
                                @select="handleSelect">
                                <template slot-scope="{item}">
                                    <p><i class="el-icon-search" ></i><font v-html="renderAddress(item.address,'depAddress')"></font><span>{{item.city}}</span></p>
                                </template>
                            </el-autocomplete> -->
              <address-select id="depAddress" v-model="scheduleForm.depAddress" placeholder="请输入出发地址" :disabled="organizationFlag" @input="inputAddress" @change="changeAddress" />
            </el-form-item>
            <el-form-item label="抵达地址" prop="arrAddress">
              <!--<el-input clearable maxlength="50" id="arrAddress" name="arrAddress" v-model="scheduleForm.arrAddress" :disabled="organizationFlag"></el-input>-->
              <!-- <el-autocomplete
                                id="arrAddress"
                                name="arrAddress"
                                popper-class="inline-input"
                                v-model="scheduleForm.arrAddress"
                                :disabled="organizationFlag"
                                clearable
                                :fetch-suggestions="querySearch2"
                                placeholder="请输入抵达地址"
                                :trigger-on-focus="false"
                                @select="handleSelect2">
                                <template slot-scope="{item}">
                                    <p><i class="el-icon-search" ></i><font v-html="renderAddress(item.address,'arrAddress')"></font><span>{{item.city}}</span></p>
                                </template>
                            </el-autocomplete> -->
              <address-select id="arrAddress" v-model="scheduleForm.arrAddress" placeholder="请输入抵达地址" :disabled="organizationFlag" @input="inputAddress" @change="changeAddress" />
            </el-form-item>
            <el-form-item label="订单预计金额" prop="orderAmount" :rules="rules.money(true)">
              <money-input v-model="scheduleForm.orderAmount" :disabled="organizationFlag" clearable placeholder="请输入订单预计金额" unit="元" />
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="scheduleForm.isRecordOrder == '1'" title="调度信息" name="2">
          <div class="flex-panel">

            <el-form-item v-if="scheduleForm.scheduleType !=5" label="是否使用挂靠车">
              <el-select v-model="ifCallVehicle" placeholder="是否使用挂靠车" @change="changeIfCallVehicle">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="scheduleForm.scheduleType !=5 && ifCallVehicle==0" label="车辆" prop="plate">
              <el-input v-model="scheduleForm.plate" readonly clearable>
                <template slot="append"><el-button class="el-icon-search" @click.native="openVehicle" /></template>
              </el-input>
            </el-form-item>

            <el-form-item v-if="scheduleForm.scheduleType !=5 && ifCallVehicle==1" label="车辆">
              <el-input v-model="scheduleForm.callVehicle" placeholder="请输入" />
            </el-form-item>

            <el-form-item v-if="scheduleForm.scheduleType !=1" label="是否使用挂靠司机">
              <el-select v-model="ifCallDriver" placeholder="是否使用挂靠司机" @change="changeIfCallDriver">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>

            <!--<el-form-item label="司机" prop="driverName" v-if="scheduleForm.scheduleType !=1">
                            <el-input readonly v-model="scheduleForm.driverName" clearable>
                                <template slot="append" ><el-button class="el-icon-search" @click.native="openDriver" :disabled="disableSearchDrive"></el-button></template>
                            </el-input>
                        </el-form-item>-->

            <el-form-item v-if="scheduleForm.scheduleType !=1 && ifCallDriver==0" label="司机">

              <el-input v-model="scheduleForm.driverName" readonly clearable>
                <template slot="append"><el-button class="el-icon-search" @click.native="openDriver" /></template>
              </el-input>

            </el-form-item>

            <el-form-item v-if="scheduleForm.scheduleType !=1 && ifCallDriver==1" label="司机">

              <el-input v-model="scheduleForm.callDriver" placeholder="请输入" />

            </el-form-item>

          </div>
        </el-collapse-item>

        <el-collapse-item v-if="scheduleForm.isRecordOrder == '1'" title="出车信息" name="3">
          <div class="flex-panel">
            <el-form-item label="出车时间" prop="depTime">
              <el-date-picker
                v-model="scheduleForm.depTime"
                clearable
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择出车时间"
                :disabled="organizationFlag"
                @change="changeTime(1)"
              />
            </el-form-item>
            <el-form-item v-if="scheduleForm.scheduleType!=5" label="出车里程" prop="depMile">
              <el-input
                v-model="scheduleForm.depMile"
                :disabled="organizationFlag"
                clearable
                placeholder="请输入出车里程"
                type="number"
                @change="changeMile()"
              >
                <template slot="append">km</template>
              </el-input>
            </el-form-item>
          </div>

        </el-collapse-item>
        <el-collapse-item v-if="scheduleForm.isRecordOrder == '1'" title="还车信息" name="4">
          <div class="flex-panel">
            <el-form-item label="还车时间" prop="arrTime">
              <el-date-picker
                v-model="scheduleForm.arrTime"
                clearable
                type="datetime"
                :picker-options="arrPickeroptions"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择还车时间"
                :disabled="organizationFlag || !scheduleForm.depTime"
                @change="changeTime(2)"
              />
            </el-form-item>
            <el-form-item v-if="scheduleForm.scheduleType!=5" label="还车里程" prop="arrMile">
              <el-input
                v-model="scheduleForm.arrMile"
                :disabled="organizationFlag"
                clearable
                placeholder="请输入还车里程"
                type="number"
                @change="changeMile()"
              >
                <template slot="append">km</template>
              </el-input>
            </el-form-item>
            <el-form-item label="用车时长">
              <el-input v-model="scheduleForm.diffTime" clearable maxlength="50" readonly="" />
            </el-form-item>
            <el-form-item v-if="scheduleForm.scheduleType!=5" label="行驶里程">
              <el-input v-model="scheduleForm.useMile" clearable maxlength="50" readonly="" />
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="scheduleForm.isRecordOrder == '1'" title="费用信息" name="5">
          <div class="flex-panel">
            <el-form-item label="总费用" prop="totalMoney">
              <el-input v-model="scheduleForm.totalMoney" :disabled="organizationFlag" clearable placeholder="请输入总费用" readonly="">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="租金" prop="rentMoney">
              <money-input v-model="scheduleForm.rentMoney" :disabled="organizationFlag" clearable placeholder="请输入租金" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="路桥费" prop="tollCharge">
              <money-input v-model="scheduleForm.tollCharge" :disabled="organizationFlag" clearable placeholder="请输入路桥费" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="停车费" prop="parkingFee">
              <money-input v-model="scheduleForm.parkingFee" :disabled="organizationFlag" clearable placeholder="请输入停车费" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="加油费" prop="oilFee">
              <money-input v-model="scheduleForm.oilFee" :disabled="organizationFlag" clearable placeholder="请输入加油费" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="超时费" prop="outtimeFee">
              <money-input v-model="scheduleForm.outtimeFee" :disabled="organizationFlag" clearable placeholder="请输入超时费" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="超公里费" prop="outmileFee">
              <money-input v-model="scheduleForm.outmileFee" :disabled="organizationFlag" clearable placeholder="请输入超公里费" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="其他费用" prop="otherFee">
              <money-input v-model="scheduleForm.otherFee" :disabled="organizationFlag" clearable placeholder="请输入其他费用" unit="元" @input="moneyChange()" />
            </el-form-item>
            <el-form-item label="其他费用说明" prop="otherFeeRemark">
              <el-input v-model="scheduleForm.otherFeeRemark" clearable maxlength="50" :disabled="organizationFlag" placeholder="请输入其他费用说明" />
            </el-form-item>
          </div>
        </el-collapse-item>

      </el-collapse>
      <div class="left-row">
        <el-button type="primary" :loading="addLoading" @click="submitForm('scheduleForm')">保存</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </el-form>

    <el-dialog title="选择合同" :visible.sync="dialogContractNo" :append-to-body="true" width="70%">
      <div v-cloak class="wrapper wrapper-content  fadeInRight list-panel">
        <div class="row form-horizontal search-box">
          <div class="form-box">
            <div class="form-group">
              <label class="control-label">合同编号</label>
              <div class="input-group">
                <el-input v-model="searchParam.contractNo" placeholder="请输入合同编号" clearable />
              </div>
            </div>
          </div>
          <div class="search-btn-list">
            <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
          </div>
        </div>
        <div class="row">
          <el-table :data="list" style="width: 100%;" border max-height="250">
            <el-table-column fixed="left" label="操作" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="changeContract(scope.row)">选择</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="contractNo" label="合同编号" min-width="200" />
            <el-table-column prop="startDate" label="合同开始时间" min-width="120" />
            <el-table-column prop="endDate" label="合同结束时间" min-width="120" />
            <el-table-column prop="contractAmount" label="合同总金额" min-width="150" />
            <el-table-column prop="contractStatus" label="合同状态" min-width="100" />
          </el-table>
          <el-pagination
            :current-page="page"
            :page-sizes="pageSizeSetting"
            :page-size="pageSize"
            :layout="pageLayout"
            :total="listCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
    <enterprise-dialog ref="enterpriseList" @load="selectEnterprise" />
    <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer" />

    <el-dialog title="选择车辆" :visible.sync="dialogVehicle" :append-to-body="true" width="70%">
      <div v-cloak class="wrapper wrapper-content  fadeInRight list-panel">
        <div class="row form-horizontal search-box">
          <div class="form-box">
            <div class="form-group">
              <label class="control-label">车牌</label>
              <div class="input-group">
                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
              </div>
            </div>

          </div>
          <div class="search-btn-list">
            <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
          </div>
        </div>
        <div class="row">
          <el-table :data="list" style="width: 100%;" border>
            <el-table-column fixed="left" label="操作" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="changeVehicleForm(scope.row)">选择</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="plate" label="车辆" min-width="100" />
            <el-table-column prop="modelInfoName" label="车型" min-width="300" />
            <el-table-column prop="color" label="颜色" min-width="80" />
            <!--<el-table-column prop="runCityName" label="经营城市" min-width="120"></el-table-column>-->
            <el-table-column prop="vehicleStatus" label="车辆状态" min-width="100" />
          </el-table>
          <el-pagination
            :current-page="page"
            :page-sizes="pageSizeSetting"
            :page-size="pageSize"
            :layout="pageLayout"
            :total="listCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>

    <el-dialog title="选择司机" :visible.sync="dialogDriver" :append-to-body="true" width="70%">
      <div v-cloak class="wrapper wrapper-content  fadeInRight list-panel">
        <div class="row form-horizontal search-box">
          <div class="form-box">
            <div class="form-group">
              <label class="control-label">司机姓名</label>
              <div class="input-group">
                <el-input v-model="searchParam.name" placeholder="请输入司机姓名" clearable />
              </div>
            </div>

          </div>
          <div class="search-btn-list">
            <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
          </div>
        </div>
        <div class="row">
          <el-table :data="list" style="width: 100%;" border>
            <el-table-column fixed="left" label="操作" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="changeDriver(scope.row)">选择</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="司机名称" min-width="100" />
            <el-table-column prop="sex" label="性别" min-width="300" />
            <el-table-column prop="phone" label="电话" min-width="100" />
          </el-table>
          <el-pagination
            :current-page="page"
            :page-sizes="pageSizeSetting"
            :page-size="pageSize"
            :layout="pageLayout"
            :total="listCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect/index'
import MoneyInput from '@/components/MoneyInput/index'
import UploadPanel from '@/components/UploadPanel/index'
import AddressSelect from '@/components/AddressSelect/index'
import enterpriseDialog from '@/views/tgpt/corporateCustomer/customerPersonal/enterpriseDialog'
import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
import ajax from '@/utils/request'
import { tool, ruleTool, formRule } from '@/utils/common'

export default {
  name: 'TrafficVehicleScheduleEdit',
  components: { TreeSelect, MoneyInput, UploadPanel, AddressSelect, enterpriseDialog, personalCustomerDialog },
  mixins: [tool, ruleTool],
  data: function() {
    return {
      dialogContractNo: false,
      organizationFlag: true,
      enterpriseList: [],
      depAddressList: [],
      arrAddressList: [],
      organization: [],
      map: {},
      dialogVehicle: false,
      dialogDriver: false,
      disableSearchDrive: true,
      addLoading: false,
      pickeroptions: {
        disabledDate: (e) => {
          if (this.scheduleForm.isRecordOrder == '1') {
            return false
          }
          const now = new Date()
          now.setDate(now.getDate() - 1)
          if (e < now) {
            return true
          }
        }
      },
      arrPickeroptions: {
        disabledDate: (e) => {
          const time = new Date(this.scheduleForm.depTime.replace(/-/g, '/'))
          if (e.getTime() + 24 * 60 * 60 * 1000 - 1 < time.getTime()) {
            return true
          }
        }
      },
      scheduleForm: {
        isRecordOrder: 2,
        ifCallVehicle: 0,
        ifCallDriver: 0
      },
      ifCallVehicle: 0,
      ifCallDriver: 0,
      currentUserInfo: this.getCurrentUserInfo().organizationList,
      activeNames: ['1', '2', '3', '4', '5'],
      rules: {
        organizationId: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请输入用车人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请选择用车人手机号', trigger: 'blur' },
          { validator: formRule.isMobilePhone, message: '手机号码格式有误', trigger: 'blur' }
        ],
        userNum: [
          { required: true, message: '请选择用车人数', trigger: 'blur' }
        ],
        orderAmount: [
          { required: true, message: '请输入订单金额', trigger: 'blur' }
        ],
        useTime: [
          { required: true, message: '请选择用车时间', trigger: 'change' }
        ],
        depAddress: [
          { required: true, message: '请选择出发地址', trigger: 'change' }
        ],
        arrAddress: [
          { required: true, message: '请选择抵达地址', trigger: 'change' }
        ],
        depTime: [
          { required: true, message: '请选择出车时间', trigger: 'blur' }
        ],
        arrTime: [
          { required: true, message: '请选择还车时间', trigger: 'blur' }
        ],
        plate: [
          { required: true, message: '请选择车辆', trigger: 'change' }
        ],
        driverName: [],
        scheduleType: [
          { required: true, message: '请选择散租类型', trigger: 'change' }
        ],
        depMile: [
          { required: true, message: '请输入出车里程', trigger: 'blur' }
        ],
        arrMile: [
          { required: true, message: '请输入还车里程', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {// 它用于观察Vue实例上的数据变动。对应一个对象，键是观察表达式，值是对应回调。值也可以是方法名，或者是对象，包含选项。

  },
  beforeMount: function() { // 载入前
  },
  mounted: function() { // 载入后
    this.open()
    this.$nextTick(() => {
      this.initialize()
    })
    // this.initMap();
    // window.initialize = this.initialize;
    // var script = document.createElement("script");
    // script.src = "https://api.map.baidu.com/api?v=2.0&ak=eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5&s=1&callback=initialize";
    // document.body.appendChild(script);
  },
  methods: {
    // 自定义方法
    open() {
      var $this = this
      if (this.$route.query.id) {
        ajax.get('/core/vehicleschedule/detail/' + this.$route.query.id).then(
          res => {
            if (res.status == 0 && res.data != null) {
              $this.organization.push(res.data.organizationId)
              $this.getEnterpriseList(res.data.organizationId)
              $this.scheduleForm = res.data
              $this.scheduleForm.isRecordOrder = 2
              this.organizationFlag = false
            }
          }
        )
      }
    },
    getEnterpriseList(companyId) {
      ajax.get('/core/vehicleschedule/enterpriseList/' + companyId).then(
        res => {
          if (res.status == 0 && res.data != null) {
            this.enterpriseList = res.data
          }
        }
      )
    },
    changeIfCallVehicle() {
      if (this.ifCallVehicle == 1) {
        this.$set(this.scheduleForm, 'vehicleId', '')
        this.$set(this.scheduleForm, 'plate', '')
      } else if (this.ifCallVehicle == 0) {
        this.$set(this.scheduleForm, 'callVehicle', '')
      }
    },
    changeIfCallDriver() {
      if (this.ifCallDriver == 1) {
        this.$set(this.scheduleForm, 'driverId', '')
        this.$set(this.scheduleForm, 'driverName', '')
      } else if (this.ifCallDriver == 0) {
        this.$set(this.scheduleForm, 'callDriver', '')
      }
    },
    changeVehicleForm(row) {
      if (row != null) {
        this.dialogVehicle = false
        this.$set(this.scheduleForm, 'vehicleId', row.id)
        this.$set(this.scheduleForm, 'plate', row.plate)
        /* if(row.driverId){
                        this.disableSearchDrive = true;
                        this.ifCallDriver=0;
                        this.$set(this.scheduleForm,"driverId",row.driverId);
                        this.$set(this.scheduleForm,"driverName",row.driverName+' '+row.driverPhone);
                    }else{
                        this.$set(this.scheduleForm,"driverId",'');
                        this.$set(this.scheduleForm,"driverName",'');
                        this.disableSearchDrive = false;
                    }*/
      }
    },
    submitForm(schedultForm) {
      var $this = this
      this.addLoading = true
      $this.$refs[schedultForm].validate((valid) => {
        if (valid) {
          /* let now=new Date();
                        if($this.scheduleForm.useTime<now){
                            $this.showMessage.error("请选择当前时间之后的时间");
                            return;
                        }*/
          $this.scheduleForm.ifCallVehicle = $this.ifCallVehicle
          $this.scheduleForm.ifCallDriver = $this.ifCallDriver

          /* if($this.scheduleForm.ifCallDriver!=1&&($this.scheduleForm.driverId==""||$this.scheduleForm.driverId==null)){
                            $this.scheduleForm.ifCallDriver=null;
                        }
                        if ( $this.scheduleForm.ifCallVehicle!=1&&($this.scheduleForm.vehicleId==""||$this.scheduleForm.vehicleId==null)){

                            $this.scheduleForm.ifCallVehicle=null;
                        }*/
          if ($this.scheduleForm.scheduleType == 1) {
            $this.scheduleForm.ifCallDriver = null
            $this.scheduleForm.driverId = null
          }
          if ($this.scheduleForm.scheduleType == 5) {
            $this.scheduleForm.ifCallVehicle = null
            $this.scheduleForm.vehicleId = null
          }
          var url = '/core/vehicleschedule/save'
          ajax.post(url, $this.scheduleForm).then(
            res => {
              if (res.status == 0) {
                $this.showMessage('操作成功', 'success')
                $this.close()
                window.setTimeout(() => {
                  this.addLoading = false
                }, 2000)
              } else {
                $this.$message.error(res.message)
                this.addLoading = false
              }
            }
          )
        } else {
          this.addLoading = false
          return false
        }
      })
    },
    // 打开服务客户弹窗
    openEnterpriseList() {
      if (this.scheduleForm.customerType) {
        if (this.scheduleForm.customerType == 1) { this.$refs.enterpriseList.open(this.scheduleForm.organizationId) } else if (this.scheduleForm.customerType == 2) { this.$refs.personalCustomerList.open(this.scheduleForm.organizationId) }
      } else {
        this.$message.error('请选择客户类型')
        return
      }
    },
    // 选择企业客户
    selectEnterprise(row) {
      this.scheduleForm.contractNo = ''
      this.scheduleForm.projectContractId = ''
      this.scheduleForm.enterpriseId = row.id
      this.scheduleForm.enterpriseName = row.name
      this.scheduleForm = Object.assign({}, this.scheduleForm)
    },
    // 选择个人客户
    selectPersonalCustomer(row) {
      this.scheduleForm.contractNo = ''
      this.scheduleForm.projectContractId = ''
      this.scheduleForm.enterpriseId = row.id
      this.scheduleForm.enterpriseName = row.name
      this.scheduleForm = Object.assign({}, this.scheduleForm)
    },
    changeCustomerType() {
      this.scheduleForm.enterpriseId = ''
      this.scheduleForm.enterpriseName = ''
      this.scheduleForm.contractNo = ''
      this.scheduleForm.projectContractId = ''
    },
    openContract() {
      if (this.scheduleForm.enterpriseId && this.scheduleForm.scheduleType) { // 先选车再选合同
        if (this.scheduleForm.scheduleType == '3') {
          // 替代车选择长租合同
          this.getListByUrl('core/vehicleschedule/czcontractList?enterpriseId=' + this.scheduleForm.enterpriseId)
        } else {
          this.getListByUrl('core/vehicleschedule/contractList?enterpriseId=' + this.scheduleForm.enterpriseId)
        }
        this.dialogContractNo = true
      } else {
        this.$message.error('请先选择服务客户和散租类型!')
        return
      }
    },
    changeContract(row) {
      if (row != null) {
        this.dialogContractNo = false
        this.scheduleForm.contractNo = row.contractNo
        this.scheduleForm.projectContractId = row.id
      }
    },

    selectOrganization(data) {
      if (data) {
        this.organizationFlag = false
        this.scheduleForm = { organizationId: data }
        this.getEnterpriseList(data)
      } else {
        this.organizationFlag = true
        this.scheduleForm = {}
      }
    },
    initialize() {
      this.map = new BMap.Map()
      // this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);;
      // this.map.enableScrollWheelZoom(true);
      // this.map.addControl(new BMap.NavigationControl());
      // this.initAddress("depAddress");
      // this.initAddress("arrAddress");
    },
    /**
             * 地址搜索输入框初始化
             */
    initMap() {
      // this.map = new BMap.Map();

      // this.initAddress("emergencyContactAddress");
    },
    initAddress(address) {
      var $this = this
      var ac
      if (address == 'depAddress') {
        ac = new BMap.Autocomplete(
          {
            'input': address,
            'location': this.map,
            'onSearchComplete': this.searchComplete1
          }
        )
      } else if (address == 'arrAddress') {
        ac = new BMap.Autocomplete(
          {
            'input': address,
            'location': this.map,
            'onSearchComplete': this.searchComplete2
          }
        )
      } else {
        return
      }
      // 鼠标放到下拉框列表的事件
      // ac.addEventListener("onhighlight", function(e) {
      //     var _value;
      //     if (e.fromitem.index > -1) {
      //         _value = e.fromitem.value;
      //     }
      //     if (e.toitem.index > -1) {
      //         _value = e.toitem.value;
      //     }
      // });

      // //鼠标点击下拉列表后的事件
      // ac.addEventListener("onconfirm", function(e) {

      //     var _value = e.item.value;
      //     var city=_value.province+_value.city+_value.district;
      //     var address = _value.province+_value.city+_value.district+_value.business+_value.street+_value.streetNumber;// _value.street +  _value.business;
      //     //e.currentTarget.pc.input
      //     $this.$set($this.scheduleForm,e.currentTarget.pc.input,address);
      //     $this.$set($this.scheduleForm,e.currentTarget.pc.input+'City',city);

      //     //ac.setInputValue(_value.district +  _value.street +  _value.business);
      // });
    },
    searchComplete1(result) {
      var list = []
      for (var i = 0; i < result.Ar.length; i++) {
        const r = result.Ar[i]
        var _value = result.Ar[i]
        var city = _value.province + _value.city + _value.district
        var address = _value.business + _value.street + _value.streetNumber
        var value = _value.province + _value.city + _value.district + _value.business + _value.street + _value.streetNumber
        list.push({
          value,
          city,
          address
        })
      }
      // this.searchComplete(result);
      this.depAddressList = list
    },

    searchComplete2(result) {
      var list = []
      for (var i = 0; i < result.Ar.length; i++) {
        const r = result.Ar[i]
        var _value = result.Ar[i]
        var city = _value.province + _value.city + _value.district
        var address = _value.business + _value.street + _value.streetNumber
        var value = _value.province + _value.city + _value.district + _value.business + _value.street + _value.streetNumber
        list.push({
          value,
          city,
          address
        })
      }
      this.arrAddressList = list
      // this.searchComplete(result);
      // this.arrAddressList=result;
      /*  for(let r in result){
                    let tepmp=r.province+r.city+r.district+r.business+r.street+r.streetNumber;
                    this.arrAddressList.push(temp);
                }*/
    },
    renderAddress(text, name) {
      if (this.queryString != '' && name == 'depAddress') {
        text = text.replace(this.queryString, "<b style='color:#333'>" + this.queryString + '</b>')
      } else if (this.queryString2 != '' && name == 'arrAddress') {
        text = text.replace(this.queryString2, "<b style='color:#333'>" + this.queryString2 + '</b>')
      }
      return text
    },
    querySearch(queryString, cb) {
      this.queryString = queryString
      setTimeout(() => {
        cb(this.depAddressList)
      }, 300)
    },
    querySearch2(queryString, cb) {
      this.queryString2 = queryString
      setTimeout(() => {
        cb(this.arrAddressList)
      }, 300)
    },
    changeAddress(item, key) {
      this.$set(this.scheduleForm, key, item.value)
      this.$set(this.scheduleForm, key + 'City', item.city)
    },
    inputAddress(value, key) {
      this.$set(this.scheduleForm, key, value)
    },
    handleSelect(item) {
      this.$set(this.scheduleForm, 'depAddress', item.value)
      this.$set(this.scheduleForm, 'depAddressCity', item.city)
    },
    handleSelect2(item) {
      this.$set(this.scheduleForm, 'arrAddress', item.value)
      this.$set(this.scheduleForm, 'arrAddressCity', item.city)
    },
    changeOrganization(data) {
      if (data && data.length == 1) {
        this.organizationFlag = false
        this.scheduleForm = { organizationId: data[0].id }
        this.$set(this.scheduleForm, 'isRecordOrder', 2)
      } else {
        this.organizationFlag = true
        this.organization = []
        this.scheduleForm = {}
        this.$set(this.scheduleForm, 'isRecordOrder', 2)
      }
      this.scheduleForm.id = this.$route.query.id
    },

    /* 计算服务总金额*/
    moneyChange() {
      let totalMoney = 0
      if (this.scheduleForm.rentMoney) {
        totalMoney = totalMoney + Number(this.scheduleForm.rentMoney)
      }
      if (this.scheduleForm.tollCharge) {
        totalMoney = totalMoney + Number(this.scheduleForm.tollCharge)
      }
      if (this.scheduleForm.parkingFee) {
        totalMoney = totalMoney + Number(this.scheduleForm.parkingFee)
      }
      if (this.scheduleForm.oilFee) {
        totalMoney = totalMoney + Number(this.scheduleForm.oilFee)
      }
      if (this.scheduleForm.outtimeFee) {
        totalMoney = totalMoney + Number(this.scheduleForm.outtimeFee)
      }
      if (this.scheduleForm.outmileFee) {
        totalMoney = totalMoney + Number(this.scheduleForm.outmileFee)
      }
      if (this.scheduleForm.otherFee) {
        totalMoney = totalMoney + Number(this.scheduleForm.otherFee)
      }
      if (totalMoney) {
        this.$set(this.scheduleForm, 'totalMoney', totalMoney)
      }
    },

    /* 出车还车时间变化*/
    changeTime(type) {
      if (this.scheduleForm.arrTime && this.scheduleForm.depTime) {
        /* 计算时间差*/
        let useTime = ''
        const arrTime = new Date((this.scheduleForm.arrTime + ':00').replace(/-/g, '/'))
        const depTime = new Date((this.scheduleForm.depTime + ':00').replace(/-/g, '/'))
        const diffmin = (arrTime.getTime() - depTime.getTime()) / (1000 * 60)
        if (diffmin <= 0) {
          if (type == 1) {
            this.$set(this.scheduleForm, 'depTime', '')
          }
          if (type == 2) {
            this.$set(this.scheduleForm, 'arrTime', '')
          }
          this.$message.error('还车时间要大于出车时间')
          return
        }
        const hour = Math.floor(diffmin / 60)
        if (hour <= 0) {
          useTime = diffmin + 'min'
        } else {
          const min = diffmin - hour * 60
          useTime = `${hour}h${min}min`
        }
        this.$set(this.scheduleForm, 'diffTime', useTime)
      }
    },

    /* 出车还车里程变化*/
    changeMile() {
      if (this.scheduleForm.arrMile && this.scheduleForm.depMile) {
        /* 计算时间差*/
        const diffMile = this.scheduleForm.arrMile - this.scheduleForm.depMile
        this.$set(this.scheduleForm, 'useMile', diffMile)
      }
    },

    /* 打开司机搜索框，查询未绑定车辆司机*/
    openDriver() {
      if (this.scheduleForm.organizationId) {
        this.searchParam = {}
        this.listUrl = 'core/vehicleschedule/driverList'
        this.searchParam.companyId = this.scheduleForm.organizationId
        this.searchParam.scheduleType = this.scheduleForm.scheduleType
        this.searchParam.isRecordOrder = this.scheduleForm.isRecordOrder
        this.searchParam.type = 1
        this.getList()
        this.dialogDriver = true
      } else {
        this.$message.error('订单信息有误!')
        return
      }
    },
    /* 选择司机*/
    changeDriver(row) {
      if (row != null) {
        this.dialogDriver = false
        this.$set(this.scheduleForm, 'driverId', row.driverId)
        this.$set(this.scheduleForm, 'driverName', row.name + ' ' + row.phone)
      }
    },
    /* 打开车辆弹出框*/
    openVehicle() {
      if (this.scheduleForm.organizationId) {
        this.listUrl = 'core/vehicleschedule/vehicleList'
        this.searchParam.companyId = this.scheduleForm.organizationId
        this.searchParam.scheduleType = this.scheduleForm.scheduleType
        this.searchParam.isRecordOrder = this.scheduleForm.isRecordOrder
        this.getList()
        this.dialogVehicle = true
      } else {
        this.$message.error('订单信息有误!')
        return
      }
    },
    /* 选择车辆*/
    changeVehicle(row) {
      if (row != null) {
        this.dialogVehicle = false
        this.$set(this.scheduleForm, 'vehicleId', row.id)
        this.$set(this.scheduleForm, 'plate', row.plate)
        if (row.driverId) {
          this.disableSearchDrive = true
          this.$set(this.scheduleForm, 'driverId', row.driverId)
          this.$set(this.scheduleForm, 'driverName', row.driverName + ' ' + row.driverPhone)
        } else {
          this.$set(this.scheduleForm, 'driverId', '')
          this.$set(this.scheduleForm, 'driverName', '')
          this.disableSearchDrive = false
        }
      }
    },
    /* 选择订单类型*/
    scheduleTypeChange() {
      this.scheduleForm.driverId = ''
      this.$set(this.scheduleForm, 'driverName', '')
      this.$set(this.scheduleForm, 'contractNo', '')
      this.$set(this.scheduleForm, 'projectContractId', '')
      if (this.scheduleForm.scheduleType == 2) {
        const driverNameRlus = []
        driverNameRlus.push({ required: true, message: '请选择司机', trigger: 'change' })
        this.$set(this.rules, 'driverName', driverNameRlus)
      } else {
        this.$set(this.rules, 'driverName', [])
      }
    }

  }
}
</script>

<style lang="scss">
    .inline-input{
        ul li{
            white-space: pre-wrap;
            overflow: visible;
            text-overflow: clip;
            padding: 0 10px;
            p{
                margin: 0;
                font-size: 12px;
                line-height: 30px;
                .el-icon-search{
                    margin-right: 5px;
                }
                span{
                    color: #bbb;
                    margin-left: 5px;
                }
            }
        }
    }
</style>
