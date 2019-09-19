<template>
  <div v-cloak class="app-container white-bg list-panel">
    <div class="search-box" :class="{'hide-search':!showSearch}">
      <div class="form-box">
        <div class="form-group">
          <label class="control-label">采购订单号</label>
          <div class="input-group">
            <el-input v-model="searchParam.orderNumber" type="text" placeholder="请输入采购订单号" clearable />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">采购日期</label>
          <div class="input-group">
            <el-date-picker
              v-model="searchParam.purchaseDate"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">合同编号</label>
          <div class="input-group">
            <el-input v-model="searchParam.contractNumber" type="text" placeholder="请输入合同编号" clearable />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">采购方式</label>
          <div class="input-group">
            <el-select v-model="searchParam.purchaseMethod" placeholder="不限">
              <el-option label="新购" value="1" />
              <el-option label="租赁" value="2" />
              <el-option label="现有车辆安排" value="3" />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">供应商</label>
          <div class="input-group">
            <el-input v-model="searchParam.supplierName" type="text" placeholder="请输入供应商" clearable />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">车型</label>
          <div class="input-group">
            <el-input v-model="searchParam.vehicleModelInfoName" type="text" placeholder="请输入车型" clearable />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">状态</label>
          <div class="input-group">
            <el-select v-model="searchParam.state" placeholder="不限">
              <el-option label="新增" value="1" />
              <el-option label="已到车" value="2" />
              <el-option label="已提车" value="3" />
              <el-option label="待交车" value="4" />
              <el-option label="完成" value="5" />
              <el-option label="终止" value="6" />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">采购过程编号</label>
          <div class="input-group">
            <el-input v-model="searchParam.processNo" type="text" placeholder="请输入采购过程编号" clearable />
          </div>
        </div>
      </div>
      <div class="search-btn-list">
        <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch" />
        <el-button type="primary" class="defaultSearchButton" size="small" @click="_query">查询</el-button>
        <el-button size="small" @click="resetList()">重置</el-button>
      </div>
    </div>
    <div class="row tool-box" />
    <div class="table-box">
      <el-table v-loading="listLoading" border :data="list" style="width: 100%">
        <el-table-column fixed="left" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button v-show="showInsuranceBtn && scope.row.state>=4 && scope.row.state<6" type="text" size="small" @click="edit(scope.row.id)">
              保险
            </el-button>
          </template>
        </el-table-column>
        <el-table-column sortable fixed show-overflow-tooltip prop="purchaseProcessNo" label="采购过程编号" min-width="200">
          <template slot-scope="scope">
            <a size="mini" @click="goDetail(scope.row)">{{ scope.row.purchaseProcessNo }}</a>
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="orderNumber" label="采购订单号" min-width="200">
          <template slot-scope="scope">
            <a size="mini" @click="toOrderDetail(scope.row)">{{ scope.row.orderNumber }}</a>
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="contractNumber" label="合同编号" min-width="200">
          <template slot-scope="scope">
            <a size="mini" @click="toContractDetail(scope.row)">{{ scope.row.contractNumber }}</a>
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="vehicleModelInfoName" label="车型" min-width="220" />
        <el-table-column sortable show-overflow-tooltip prop="purchaseDate" label="采购日期" min-width="120" />
        <el-table-column sortable show-overflow-tooltip prop="purchaseMethod" label="采购方式" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.purchaseMethod==1">新购</span>
            <span v-else-if="scope.row.purchaseMethod==2">租赁</span>
            <span v-else-if="scope.row.purchaseMethod==3">现有车辆安排</span>
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="supplierName" label="供应商" min-width="180" />
        <el-table-column sortable show-overflow-tooltip prop="state" label="状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">新增</span>
            <span v-else-if="scope.row.state==2">已到车</span>
            <span v-else-if="scope.row.state==3">已提车</span>
            <span v-else-if="scope.row.state==4">待交车</span>
            <span v-else-if="scope.row.state==5">完成</span>
            <span v-else-if="scope.row.state==6">终止</span>
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip prop="requiredDeliveryDate" label="要求到位时间" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="deliveryCityName" label="用车城市" min-width="100" />
        <el-table-column sortable show-overflow-tooltip prop="deliveryCityName" label="交车城市" min-width="100" />
        <el-table-column sortable show-overflow-tooltip prop="receiver" label="接收人" min-width="100" />
        <el-table-column sortable show-overflow-tooltip prop="planDeliveryDate" label="预计到车时间" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="supplierPlanDeliveryDate" label="供应商回复到车时间" min-width="150" />
        <el-table-column sortable show-overflow-tooltip prop="actualDeliveryDate" label="实际到车时间" min-width="150" />
        <el-table-column sortable show-overflow-tooltip prop="pickingTime" label="提车时间" min-width="150" />
        <el-table-column sortable show-overflow-tooltip prop="deliveryDate" label="实际到位时间" min-width="150" />
        <el-table-column sortable show-overflow-tooltip prop="" label="上牌日期" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="" label="号牌来源" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="plate" label="车牌" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="vin" label="车架号" min-width="160" />
        <el-table-column sortable show-overflow-tooltip prop="engineNo" label="发动机号" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="licenseNumber" label="行驶证号" min-width="140" />
        <el-table-column sortable show-overflow-tooltip prop="certificate" label="机动车登记证" min-width="150" />
        <el-table-column sortable show-overflow-tooltip prop="companyName" label="所属组织" min-width="150" />
        <el-table-column sortable show-overflow-tooltip prop="licenseName" label="行驶证车主" min-width="150" />
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
</template>

<script>
import ConfirmForm from '@/views/tgpt/project/contract/confirm'
import ajax from '@/utils/request'
import { tool } from '@/utils/common'
import { startProcessAsync } from '@/utils/index'
import $ from 'jquery-slim'

export default {
  name: 'VehiclePurchaseProcessInsurance',
  components: { ConfirmForm },
  mixins: [tool],
  data() {
    return {
      showInsuranceBtn: this.getCurrentUserAuthority('core/purchaseProcess/insurance'),
      showSearch: false,
      searchParam: {
        orderNum: '',
        purchaseDate: '',
        contractNo: '',
        purchasePattern: '',
        provider: '',
        model: '',
        status: '',
        processNo: ''
      },
      listUrl: '/core/purchaseProcess/list',
      editFormData: {},
      rules: {}
    }
  },
  watch: {},
  activated() {
    this._query()
  },
  mounted: function() {
    if (!this.$store.state.isInit) {
      this.$store.state.isInit = true
      this._query()
    }
  },
  methods: {
    _query() {
      var rdArr = this.searchParam.purchaseDate
      this.searchParam.purchaseDateStart = null
      this.searchParam.purchaseDateEnd = null
      if (rdArr) {
        if (rdArr.length > 0) { this.searchParam.purchaseDateStart = rdArr[0] }

        if (rdArr.length > 1) { this.searchParam.purchaseDateEnd = rdArr[1] }
      }

      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this._query()
    },
    handleCurrentChange(val) {
      this.page = val
      this._query()
    },
    goDetail(row) {
      const url = '/tgpt/vehicle/purchaseProcess/detail/' + row.id
      this.$router.push({ path: url })
    },
    toOrderDetail(row) {
      const url = '/tgpt/vehicle/purchaseOrder/detail/' + row.orderId
      this.$router.push({ path: url })
    },
    toContractDetail(row) {
      const url = '/tgpt/project/contract/detail/' + row.contractId
      this.$router.push({ path: url })
    }
  }
}
</script>

