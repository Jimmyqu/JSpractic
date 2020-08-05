<template>
  <div v-cloak class="app-container white-bg list-panel newList-panel">
    <div class="search-box" :class="{'hide-search':!showSearch}">
      <div class="form-box">
        <div class="form-group">
          <label class="control-label">供应商</label>
          <div class="input-group">
            <el-input v-model="searchParam.supplier" clearable placeholder="请输入供应商" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">供应商类型</label>
          <div class="input-group">
            <el-select v-model="searchParam.supplierType" placeholder="请选择供应商类型" clearable>
              <el-option label="厂家" value="厂家" />
              <el-option label="4S店" value="4S店" />
              <el-option label="租车公司" value="租车公司" />
              <el-option label="车务设备" value="车务设备" />
              <el-option label="保险公司" value="保险公司" />
              <el-option label="停车场" value="停车场" />
              <el-option label="洗车场" value="洗车场" />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">单据类型</label>
          <div class="input-group">
            <el-select v-model="searchParam.billType" placeholder="请选择单据类型" clearable>
              <el-option label="保险" value="1" />
              <el-option label="洗车" value="2" />
              <el-option label="车辆采购" value="3" />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">单据编号</label>
          <div class="input-group">
            <el-input v-model="searchParam.code" clearable placeholder="请输入单据编号" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">单据时间</label>
          <div class="input-group">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="billDateChange"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">所属组织</label>
          <div class="input-group organ_wrap">
            <tree-select
              v-model="organization"
              placeholder="请选择所属组织"
              type="one"
              url="admin/organization/tree?noManager=noManager"
              @change="changeArrayItem"
            />
            <el-checkbox :disabled="!searchParam.organizationId" @change="includeChildrenCheck">子组织</el-checkbox>
          </div>
        </div>
      </div>
      <div class="search-btn-list">
        <i class="el-icon-arrow-right" @click="showSearch=!showSearch" />

      </div>
    </div>
    <div class="tool-box">
      <div class="operation">
        <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
        <el-button type="mini" size="small" @click="resetList">重置</el-button>
        <el-button v-show="showExportBtn" size="mini" @click="exportData()">导出</el-button>
      </div>
      <div class="pagination">
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
    <div class="table-box">
      <template>
        <el-table :ref="getRefName" v-loading="listLoading" :max-height="tableHeight" border :data="list" style="width: 100%">
          <el-table-column prop="code" fixed sortable label="单据编号" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">
                {{ scope.row.code }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="billType" sortable label="单据类型" min-width="100" />
          <el-table-column prop="supplier" sortable label="供应商" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierType" sortable label="供应商类型" min-width="120" />
          <el-table-column prop="billCost" sortable label="单据金额" show-overflow-tooltip min-width="120" />
          <el-table-column prop="billDate" sortable label="单据日期" show-overflow-tooltip min-width="120" />
          <el-table-column prop="organizationName" sortable label="所属组织" show-overflow-tooltip min-width="120" />
        </el-table>
      </template>
    </div>

  </div>
</template>

<script>

import $ from 'jquery-slim'
import { startProcessAsync } from '@/utils/index'
import ajax from '@/utils/request'
import { tool } from '@/utils/common'
import TreeSelect from '@/components/TreeSelect/index'

export default {
  name: 'SupplierMonthlyBill',
  components: { TreeSelect },
  mixins: [tool],
  data() {
    return {
      showSearch: false,
      showExportBtn: this.getCurrentUserAuthority('supplierMonthlyBill/exportExcel'),
      listUrl: '/report/supplierMonthlyBill/list',
      billDate: [],
      organization: []
    }
  },
  // 返回页面调用
  activated() {
    this.getList()
  },
  mounted() {
    if (!this.$store.state.isInit) {
      this.$store.state.isInit = true
      this.getList()
    }
  },
  methods: {
    billDateChange() {
      if (this.billDate && this.billDate.length > 0) {
        const createDate = this.billDate
        this.searchParam.billStartDate = createDate[0] + ' 00:00:00'
        this.searchParam.billEndDate = createDate[1] + ' 23:59:59'
      } else {
        this.searchParam.billStartDate = ''
        this.searchParam.billEndDate = ''
      }
    },
    includeChildrenCheck(check) {
      if (check == true) {
        this.searchParam.includeChildren = '1'
      } else {
        this.searchParam.includeChildren = '0'
      }
    },
    detail(rows) {
      if (rows.billType == '保险') {
        this.$router.push({ path: '/tgpt/traffic/insuranceBill/detail/' + rows.id })
      } else if (rows.billType == '洗车') {
        this.$router.push({ path: '/tgpt/traffic/clean/detail/' + rows.id })
      } else if (rows.billType == '车辆采购') {
        this.$router.push({ path: '/tgpt/vehicle/purchaseOrder/detail/' + rows.id })
      }
    },
    exportData() {
      window.location = this.exportUrl('report/supplierMonthlyBill/exportExcel?' + $.param(this.searchParam))
    },

    changeArrayItem(data) {
      if (this.organization && this.organization.length > 0) {
        this.searchParam.organizationId = this.organization[0]
      } else {
        this.searchParam.organizationId = ''
      }
    },
    resetList() {
      this.searchParam = {}
      this.organization = []
      this.billDate = []
      this.handleCurrentChange(1)
    }
  }
}
</script>

<style scoped lang="scss">
    .organ_wrap {
        display: flex;

        .tree-select-panel {
            width: 100%;
        }

        .el-checkbox {
            display: flex;
            align-items: center;
            margin-left: 10px;
            margin-right: 0;

            /deep/ .el-checkbox__label {
                font-size: 12px;
            }
        }
    }
</style>
