<template>
  <div v-cloak class="app-container white-bg list-panel newList-panel">
    <!-- 查询 -->
    <div class="search-box" :class="{'hide-search':!showSearch}">
      <div class="form-box">
        <div class="form-group">
          <label class="control-label">事故单号</label>
          <div class="input-group">
            <el-input v-model="searchParam.code" clearable autocomplete="off" placeholder="请输入订单号" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">车辆</label>
          <div class="input-group">
            <el-input v-model="searchParam.plate" clearable autocomplete="off" placeholder="请输入车辆" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">事故发生时间</label>
          <div class="input-group">
            <el-date-picker
              v-model="accidentDate"
              clearable
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">状态</label>
          <div class="input-group">
            <el-select v-model="searchParam.billStatus" clearable placeholder="请选择状态">
              <el-option v-for="(value, key) in billStatusList" :key="key" :label="value" :value="key" />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">单据类型</label>
          <div class="input-group">
            <el-select v-model="searchParam.orderType" clearable placeholder="请选择单据类型">
              <el-option label="项目单" value="1" />
              <el-option label="加油单" value="2" />
              <el-option label="维修单" value="3" />
              <el-option label="调拨过程单" value="4" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="search-btn-list">
        <i class="el-icon-arrow-right" @click="showSearch=!showSearch" />
      </div>
    </div>
    <!-- 按钮 -->
    <div class="tool-box">
      <div class="operation">
        <el-button v-show="addBtnShow" size="mini" type="warning" @click="add()">新增</el-button>
        <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
        <el-button size="mini" @click="resetList()">重置</el-button>
        <el-button v-show="exportBtnShow" size="mini" @click="exportExcel()">导出</el-button>
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
    <!-- 表格 table -->
    <div class="table-box">
      <el-table :ref="getRefName" v-loading="listLoading" :max-height="tableHeight" :data="list" style="width: 100%" border>
        <el-table-column fixed label="操作" width="180">
          <template slot-scope="scope">
            <template v-if="scope.row.billStatus==10">
              <el-button v-show="editBtnShow" type="text" size="small" @click.native.prevent="edit(scope.row.id)">编辑</el-button>
              <el-button v-show="applyBtnShow" type="text" size="small" @click.native.prevent="apply(scope.row)">提交审批</el-button>
            </template>
            <template v-else-if="scope.row.billStatus==40">
              <el-button v-show="completeBtnShow" type="text" size="small" @click.native.prevent="complete(scope.row)">完成</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed prop="code" sortable label="事故单号" min-width="200">
          <template slot-scope="scope">
            <!--<template v-if="detailBtnShow">-->
            <a size="mini" @click="detail(scope.row.id)">{{ scope.row.code }}</a>
            <!--</template>
                        <template v-else>{{scope.row.code}}</template>-->
          </template>
        </el-table-column>
        <el-table-column prop="plate" sortable label="车辆" min-width="100" />
        <el-table-column prop="vehicleModelInfo" sortable label="车型" show-overflow-tooltip min-width="220" />
        <el-table-column prop="accidentTime" sortable label="事故发生时间" min-width="150" />
        <el-table-column prop="accidentCause" sortable label="事故起因" min-width="100" />
        <el-table-column prop="accidentSquare" sortable label="事故方" min-width="100" />
        <el-table-column prop="accidentResponsibility" sortable label="事故责任" min-width="100" />
        <el-table-column prop="accidentGrade" sortable label="事故等级" min-width="100" />
        <el-table-column prop="accidentAmount" sortable label="事故总金额(元)" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.accidentAmount=='/'?'/':numberFormat(scope.row.accidentAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="company" sortable label="服务组织" show-overflow-tooltip min-width="120" />
        <el-table-column prop="billStatusText" sortable label="状态" min-width="100" />
        <el-table-column prop="creater" sortable label="创建人" min-width="100" />
        <el-table-column prop="createTime" sortable label="创建时间" min-width="140" />
      </el-table>

    </div>
    <!-- <ConfirmForm ref="accident" @load="getList"></ConfirmForm>-->
  </div>
</template>

<script>
/* import ConfirmForm from '@/views/tgpt/traffic/accident/edit'*/
import ajax from '@/utils/request'
import { tool } from '@/utils/common'
import { startProcessAsync, number_format } from '@/utils/index'
import $ from 'jquery-slim'

export default {
  name: 'trafficAccident',
  mixins: [tool],
  /* components: { ConfirmForm },*/
  data: function() {
    return {
      showSearch: false,
      addBtnShow: this.getCurrentUserAuthority('vehicleaccident/add'),
      exportBtnShow: this.getCurrentUserAuthority('vehicleaccident/export'),
      /* detailBtnShow:getCurrentUserAuthority("projectterms/detail"),*/
      editBtnShow: this.getCurrentUserAuthority('vehicleaccident/edit'),
      applyBtnShow: this.getCurrentUserAuthority('vehicleaccident/apply'),
      completeBtnShow: this.getCurrentUserAuthority('vehicleaccident/complete'),
      billStatusList: [],
      listUrl: 'core/vehicleaccident/list',
      accidentDate: []
    }
  },
  activated() {
    this.getList()
  },
  mounted: function() { // 载入后
    var startTime = this.$route.query.startTime
    var endTime = this.$route.query.endTime
    if (startTime && endTime) {
      this.searchParam.accidentStartDate = startTime + ' 00:00:00'
      this.searchParam.accidentEndDate = endTime + ' 23:59:59'
      this.accidentDate.push(startTime)
      this.accidentDate.push(endTime)
    }
    var billStatus = this.$route.query.billStatus
    if (billStatus) {
      this.searchParam.billStatus = billStatus
    }

    this.searchParam = Object.assign({}, this.searchParam)
    if (!this.$store.state.isInit) {
      this.$store.state.isInit = true
      this.getList()
    }
    this.getBillStatusList()
  },
  methods: {
    getListBefore(params) {
      var accidentDate = this.accidentDate
      if (typeof (accidentDate) !== 'undefined' && accidentDate != null && accidentDate.length > 1) {
        params.accidentStartDate = accidentDate[0] + ' 00:00:00'
        params.accidentEndDate = accidentDate[1] + ' 23:59:59'
      } else {
        params.accidentStartDate = ''
        params.accidentEndDate = ''
      }
    },
    numberFormat(number) {
      return number_format(number, 2, '.', ',')
    },
    add() {
      this.$router.push({ path: '/tgpt/traffic/accident/edit' })
    },
    edit(id) {
      const url = this.$route.fullPath
      this.$router.push({ path: url + '/edit', query: { id: id, flag: 1 }})
    },
    apply(row) {
      var $this = this
      $this.$confirm('你确定要提交审批吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startProcessAsync(row.id, 'CLSGD').then((res) => {
          $this.showMessage('提交审批成功', 'success')
          $this.getList()
        })
      })
    },
    complete(row) {
      this.$router.push({ path: '/tgpt/traffic/accident/edit', query: { id: row.id, flag: 2 }})
    },
    exportExcel() {
      var params = this.searchParam
      var accidentDate = this.accidentDate
      if (accidentDate != null && accidentDate.length > 1) {
        params.accidentStartDate = accidentDate[0] + ' 00:00:00'
        params.accidentEndDate = accidentDate[1] + ' 23:59:59'
      } else {
        params.accidentStartDate = ''
        params.accidentEndDate = ''
      }
      window.location = this.exportUrl('core/vehicleaccident/export?' + $.param(params))
    },
    getBillStatusList() {
      var $this = this
      ajax.get('core/vehicleaccident/getbillstatus').then(res => {
        if (res.status == 0) {
          $this.billStatusList = res.data
        } else {
          console.log('no approvalStatusList data!')
        }
      })
    }, resetList() {
      this.searchParam = {}
      this.accidentDate = []
      this.handleCurrentChange(1)
    },
    detail(id) {
      const url = this.$route.fullPath
      if (url.indexOf('?') > -1) {
        const nUrl = url.split('?')
        this.$router.push({ path: nUrl[0] + '/detail/' + id })
      } else {
        this.$router.push({ path: url + '/detail/' + id })
      }
    }
  }
}
</script>

