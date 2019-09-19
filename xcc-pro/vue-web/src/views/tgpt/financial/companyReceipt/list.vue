<template>
  <div v-cloak class="app-container white-bg list-panel newList-panel">
    <div class="search-box" :class="{'hide-search':!showSearch}">
      <div class="form-box">
        <div class="form-group">
          <label class="control-label">收款单编号</label>
          <div class="input-group">
            <el-input
              id="orderNo"
              v-model="searchParam.voucherCode"
              name="orderNo"
              autocomplete="off"
              type="text"
              placeholder="请输入收款单编号"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">企业客户</label>
          <div class="input-group">
            <el-input
              id="company"
              v-model="searchParam.enterpriseName"
              name="company"
              autocomplete="off"
              type="text"
              placeholder="请输入企业客户"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">收款日期</label>
          <div class="input-group">
            <el-date-picker
              v-model="voucherDate"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">状态</label>
          <div class="input-group">
            <el-select v-model="searchParam.voucherStatus" placeholder="不限" clearable>
              <el-option label="待提交审批" value="10" />
              <el-option label="审批中" value="20" />
              <el-option label="审批不通过" value="30" />
              <el-option label="完成" value="40" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="search-btn-list">
        <i class="el-icon-arrow-right" @click="showSearch=!showSearch" />

      </div>
    </div>
    <div class="tool-box">
      <div class="operation">
        <el-button v-show="showAddBtn" size="mini" type="warning" @click="add()">新增</el-button>
        <el-button size="mini" type="primary" @click="handleCurrentChange(1)">查询</el-button>
        <el-button size="mini" @click="resetList()">重置</el-button>
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
      <el-table :ref="getRefName" v-loading="listLoading" :max-height="tableHeight" border style="width: 100%" :data="list">
        <el-table-column fixed="left" label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              v-show="showEditBtn && (scope.row.voucherStatus==10 || scope.row.voucherStatus ==30)"
              type="text"
              size="small"
              @click="edit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-show="showSubmitApprovalBtn && scope.row.voucherStatus==10"
              type="text"
              size="small"
              @click="submitApproval(scope.row.id)"
            >
              提交
            </el-button>
            <el-button
              v-show="showReverseOperateBtn && scope.row.voucherStatus==40 && scope.row.noReversedAmount>0"
              type="text"
              size="small"
              @click="reversePage(scope.row, 'reverse')"
            >
              冲销
            </el-button>
            <el-button
              v-show="showReverseOperateBtn && scope.row.voucherStatus==40 && scope.row.voucherReversedAmount>0"
              type="text"
              size="small"
              @click="cancelReverse(scope.row)"
            >
              取消冲销
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="voucherCode" fixed="left" sortable label="收款单编号" min-width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">
              {{ scope.row.voucherCode }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" sortable label="所属组织" min-width="140" show-overflow-tooltip />
        <el-table-column prop="enterpriseName" sortable label="企业客户" min-width="140" show-overflow-tooltip />
        <el-table-column prop="voucherStatusText" sortable label="状态" min-width="140" />
        <el-table-column prop="voucherCost" sortable label="收款金额（元）" min-width="140" />
        <el-table-column prop="noReversedAmount" sortable label="未冲销金额（元）" min-width="140" />
        <el-table-column prop="reversedAmount" sortable label="已冲销金额（元）" min-width="140" />
        <el-table-column prop="voucherWayName" sortable label="收款方式" min-width="100" />
        <el-table-column prop="voucherDate" sortable label="收款日期" min-width="100" />
        <el-table-column prop="remark" sortable label="备注" min-width="140" show-overflow-tooltip />
      </el-table>
    </div>
  </div>
</template>

<script>
import { startProcessAsync } from '@/utils/index'
import ajax from '@/utils/request'
import { tool } from '@/utils/common'
import $ from 'jquery-slim'

export default {
  name: 'FinancialCompanyReceipt',
  mixins: [tool],
  data() {
    return {
      showSearch: false,
      searchParam: {},
      formData: {},
      modelForm: {},
      branchOffice: [],
      voucherDate: [],
      showAddBtn: this.getCurrentUserAuthority('enterpriseVoucher/add'),
      showEditBtn: this.getCurrentUserAuthority('enterpriseVoucher/edit'),
      showExportBtn: this.getCurrentUserAuthority('enterpriseVoucher/export'),
      showSubmitApprovalBtn: this.getCurrentUserAuthority('enterpriseVoucher/submitApproval'),
      showReverseOperateBtn: this.getCurrentUserAuthority('enterpriseVoucher/reverse'),
      listUrl: '/core/enterpriseVoucher/list'
    }
  },
  // 返回页面调用
  activated() {
    this.getList()
  },
  mounted: function() {
    var voucherStatus = this.$route.query.voucherStatus
    var startDate = this.$route.query.startDate
    var endDate = this.$route.query.endDate
    if (voucherStatus) {
      this.searchParam.voucherStatus = voucherStatus
    }
    if (startDate && endDate) {
      this.voucherDate.push(startDate, endDate)
    }
    this.searchParam = Object.assign({}, this.searchParam)
    if (!this.$store.state.isInit) {
      this.$store.state.isInit = true
      this.getList()
    }
  },
  methods: {
    getListBefore(params) {
      if (this.voucherDate) {
        params.voucherDate1 = this.voucherDate[0]
        params.voucherDate2 = this.voucherDate[1]
        this.searchParam.voucherDate1 = ''
        this.searchParam.voucherDate2 = ''
      } else {
        params.voucherDate1 = this.voucherDate[0]
        params.voucherDate2 = this.voucherDate[1]
        this.searchParam.voucherDate1 = ''
        this.searchParam.voucherDate2 = ''
      }
    },
    // 重置筛选
    resetList() {
      this.searchParam = {}
      this.voucherDate = []
      this.handleCurrentChange(1)
    },
    reversePage: function(row, type) {
      const id = row.id
      const enterpriseId = row.enterpriseId
      this.$router.push({
        path: '/tgpt/financial/companyReceipt/reverse',
        query: { id: id, enterpriseId: enterpriseId, type: type }
      })
    },
    cancelReverse(row) {
      const url = 'core/enterpriseVoucher/cancelReverse'
      const data = {
        id: row.id
      }
      this.$confirm('是否确定取消冲销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(url, data).then(res => {
          this.getList()
          if (res.status == 0) {
            this.$message({ message: '保存成功！', type: 'success' })
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {})
    },
    resetList() {
      this.searchParam = {}
      this.voucherDate = ''
      this.handleCurrentChange(1)
    },
    exportData: function() {
      window.location = this.exportUrl('core/enterpriseVoucher/export?' + $.param(this.searchParam))
    },
    submitApproval(id) {
      this.$confirm('是否确定提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startProcessAsync(id, 'QYKHSKD').then((message) => {
          this.getList()
          if (message.status == 0) {
            this.showMessage(message.message, 'success')
          } else {
            this.showMessage(message.message, 'error')
          }
        })
      }).catch(() => {})
    }
  }

}
</script>
