<template>
  <div v-cloak class="app-container white-bg list-panel newList-panel">
    <!--table页面-->
    <el-tabs v-model="searchParam.scheduleStatus" @tab-click="handleClick">
      <el-tab-pane label="全部" name="" />
      <el-tab-pane label="待调度" name="10" />
      <el-tab-pane label="待出车" name="20" />
      <el-tab-pane label="出车中" name="30" />
      <el-tab-pane label="待结算" name="60" />
      <el-tab-pane label="已完成" name="40" />
      <el-tab-pane label="已取消" name="50" />
    </el-tabs>
    <!-- 查询 -->
    <div class="search-box" :class="{'hide-search':!showSearch}">
      <div class="form-box">
        <div class="form-group">
          <label class="control-label">所属组织</label>
          <div class="input-group organ_wrap">
            <tree-select
              v-model="companyIds"
              placeholder="请选择所属组织"
              type="one"
              url="admin/organization/tree?noManager=noManager"
              @change="changeOrganization"
            />
            <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">调度单号</label>
          <div class="input-group">
            <el-input v-model="searchParam.orderNo" clearable autocomplete="off" placeholder="请输入调度单号" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">服务客户</label>
          <div class="input-group">
            <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入服务客户" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">合同编号</label>
          <div class="input-group">
            <el-input v-model="searchParam.contractNo" clearable autocomplete="off" placeholder="请输入合同编号" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">用车时间</label>
          <div class="input-group">
            <el-date-picker
              v-model="useDate"
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
          <label class="control-label">用车人</label>
          <div class="input-group">
            <el-input v-model="searchParam.user" clearable autocomplete="off" placeholder="请输入用车人" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">车辆</label>
          <div class="input-group">
            <el-input v-model="searchParam.plate" clearable autocomplete="off" placeholder="请输入车牌号" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">驾驶员</label>
          <div class="input-group">
            <el-input v-model="searchParam.driverName" clearable autocomplete="off" placeholder="请输入驾驶员" />
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">调度类型</label>
          <div class="input-group">
            <el-select v-model="searchParam.orderType" placeholder="请选择散租类型" clearable>
              <el-option label="全部" value="" />
              <el-option label="内部调度" value="1" />
              <el-option label="散租调度" value="2" />
            </el-select>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">用车类型</label>
          <div class="input-group">
            <el-select v-model="searchParam.scheduleType" placeholder="请选择散租类型" clearable>
              <el-option label="散租自驾" value="1" />
              <el-option label="散租配驾" value="2" />
              <el-option label="替代车" value="3" />
              <el-option label="公务车" value="4" />
              <el-option label="代驾" value="5" />
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
            <template v-if="scope.row.scheduleStatus=='待调度'">
              <!--<el-button @click.native.prevent="edit(scope.row.id)" type="text" v-show="editBtnShow" size="small">编辑</el-button>-->
              <el-button v-show="applyBtnShow && scope.row.orderType == 1" type="text" size="small" @click.native.prevent="schedule(scope.row.id)">调度</el-button>
              <el-button v-show="completeBtnShow && scope.row.orderType == 1" type="text" size="small" @click.native.prevent="cancel(scope.row.id)">取消</el-button>
            </template>
            <el-button v-show="driveReturnBtnShow && (scope.row.scheduleStatus == '出车中') && scope.row.orderType == 1" type="text" size="small" @click="driveReturn(scope.row)">还车</el-button>
            <el-button v-show="driveOutBtnShow && (scope.row.scheduleStatus == '待出车') && scope.row.orderType == 1" style="margin-left: 0;" type="text" size="small" @click="driveOut(scope.row)">出车</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed prop="orderNo" sortable label="调度单号" min-width="200">
          <template slot-scope="scope">
            <!--<template v-if="detailBtnShow">-->
            <a size="mini" @click="toDetail(scope.row.id)">{{ scope.row.orderNo }}</a>
            <!--</template>
                        <template v-else>{{scope.row.code}}</template>-->
          </template>
        </el-table-column>
        <el-table-column prop="orderType" sortable label="调度类型" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == 1">内部调度</span>
            <span v-if="scope.row.orderType == 2">散租调度</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" sortable label="用车类型" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.scheduleType == 1">散租自驾</span>
            <span v-if="scope.row.scheduleType == 2">散租配驾</span>
            <span v-if="scope.row.scheduleType == 3">替代车</span>
            <span v-if="scope.row.scheduleType == 4">公务车</span>
            <span v-if="scope.row.scheduleType == 5">代驾</span>
          </template>
        </el-table-column>
        <el-table-column prop="useTime" sortable label="用车时间" min-width="150" />
        <el-table-column prop="useTimeEnd" sortable label="用车结束时间" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == 1">{{ scope.row.useTimeEnd }}</span>
            <span v-if="scope.row.orderType == 2">{{ scope.row.arrTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user" sortable label="用车人" min-width="150" />
        <el-table-column prop="phone" sortable label="用车人电话" min-width="150" />
        <el-table-column prop="seateNum" sortable label="座位数" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == 1">{{ scope.row.seateNum }}</span>
            <span v-if="scope.row.orderType == 2">{{ scope.row.userNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" sortable label="用车事由" show-overflow-tooltip min-width="120" />
        <el-table-column prop="depAddress" sortable label="出发地址" show-overflow-tooltip min-width="180" />
        <el-table-column prop="arrAddress" sortable label="抵达地址" show-overflow-tooltip min-width="180" />
        <el-table-column prop="plate" sortable label="车辆" show-overflow-tooltip min-width="120" />
        <!--  <el-table-column  prop="driverName" sortable label="驾驶员" min-width="120"></el-table-column>-->
        <!--<el-table-column  prop="driverName" sortable label="调度类型" min-width="120"></el-table-column>-->
        <!-- <el-table-column  prop="companyName" sortable label="租赁公司" min-width="120"></el-table-column>-->
        <!-- <el-table-column  prop="contractNo" sortable label="合同编号" show-overflow-tooltip min-width="220"></el-table-column>-->
        <el-table-column prop="scheduleStatus" sortable label="状态" min-width="120" />
        <el-table-column prop="createTime" sortable label="创建时间" min-width="120" />
      </el-table>

    </div>
    <!-- <ConfirmForm ref="accident" @load="getList"></ConfirmForm>-->

    <el-dialog
      title="出车时间"
      :visible.sync="dialogVisibleOut"
      width="30%"
      @close="dialogClose()"
    >
      <el-form ref="dialogOutForm" :model="dialogOutForm" :rules="rules">
        <el-form-item label="出车时间" prop="depTime">
          <el-date-picker
            v-model="dialogOutForm.depTime"
            type="datetime"
            placeholder="日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>

        <el-form-item label="出车里程" prop="depMile">
          <el-input v-model="dialogOutForm.depMile" clearable maxlength="50" type="number" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="submitdialogOutForm('dialogOutForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="还车"
      :visible.sync="dialogVisibleReturn"
      width="30%"
      @close="dialogClose()"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules">
        <el-form-item label="还车时间" prop="arrTime">
          <el-date-picker
            v-model="dialogForm.arrTime"
            type="datetime"
            placeholder="日期"
            format="yyyy-MM-dd HH:mm"
            :picker-options="arrDisabledDate"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>

        <el-form-item label="还车里程" prop="arrMile">
          <el-input v-model="dialogForm.arrMile" clearable maxlength="50" type="number" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="submitdialogForm('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/* import ConfirmForm from '@/views/tgpt/traffic/accident/edit'*/
import ajax from '@/utils/request'
import { tool } from '@/utils/common'
import TreeSelect from '@/components/TreeSelect/index'
import { startProcessAsync, number_format } from '@/utils/index'
import $ from 'jquery-slim'
import MoneyInput from '@/components/MoneyInput/index'

export default {
  name: 'TrafficVehicleSchedule',
  components: { TreeSelect, MoneyInput },
  mixins: [tool],
  data: function() {
    return {
      showSearch: false,
      exportBtnShow: this.getCurrentUserAuthority('vehicleschedule/export'),
      /* detailBtnShow:getCurrentUserAuthority("projectterms/detail"),*/
      editBtnShow: this.getCurrentUserAuthority('vehicleschedule/edit'),
      applyBtnShow: this.getCurrentUserAuthority('vehicleschedule/apply'),
      completeBtnShow: this.getCurrentUserAuthority('vehicleschedule/complete'),
      driveOutBtnShow: this.getCurrentUserAuthority('vehicleschedule/driveOut'),
      driveReturnBtnShow: this.getCurrentUserAuthority('vehicleschedule/driveRetur'),
      driveSettlementShow: true,
      listUrl: 'core/clientVehicleSchedule/list',
      companyIds: '',
      useDate: [],
      scheduleType: [],
      dialogVisibleOut: false,
      dialogVisibleReturn: false,
      dialogForm: {},
      dialogOutForm: {},
      rules: {
        depTime: { required: true, message: '请选择出车时间', trigger: 'change' },
        depMile: { required: true, message: '请选择出车里程', trigger: 'change' },
        arrTime: { required: true, message: '请选择还车时间', trigger: 'change' },
        arrMile: { required: true, message: '请选择还车里程', trigger: 'change' }

      },
      searchParam: {
        scheduleStatus: '',
        from: 'web'
      },
      activeNames: ['1', '2', '3', '4', '5'],

      arrDisabledDate: {
        disabledDate: (e) => {
          const time = new Date(this.dialogForm.checkDepTime.replace(/-/g, '/'))
          if (e.getTime() < time.getTime()) {
            return true
          }
        }
      }
    }
  },
  activated() {
    this.getList()
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    getListBefore(params) {
      params.from = 'web'
      /* if (this.companyIds) {
                    params.organizationId = this.companyIds[0];
                    this.searchParam.organizationId = this.companyIds[0];
                }else{
                    params.organizationId = '';
                    this.searchParam.organizationId = '';
                }*/
      var useDate = this.useDate
      if (useDate != null && useDate.length > 1) {
        params.startUseTime = useDate[0] + ' 00:00:00'
        params.endUseTime = useDate[1] + ' 23:59:59'
        this.searchParam.startUseTime = useDate[0] + ' 00:00:00'
        this.searchParam.endUseTime = useDate[1] + ' 23:59:59'
      } else {
        params.startUseTime = ''
        params.endUseTime = ''
        this.searchParam.startUseTime = ''
        this.searchParam.endUseTime = ''
      }
      /* if(this.scheduleType && this.scheduleType.length>0){
                    params.scheduleType=this.scheduleType.join(',');
                    this.searchParam.scheduleType=this.scheduleType.join(',');
                }else{
                    params.scheduleType='';
                    this.searchParam.scheduleType='';
                }*/
    },
    numberFormat(number) {
      return number_format(number, 2, '.', ',')
    },

    /* 取消*/
    cancel(id) {
      var $this = this
      $this.$confirm('你确定要取消订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.get('core/clientVehicleSchedule/cancel/' + id).then(res => {
          if (res.status == 0) {
            $this.showMessage('取消成功', 'success')
            $this.getList()
          } else {
            console.log('no approvalStatusList data!')
          }
        })
      })
    },
    /* 调度*/
    schedule(id) {
      const url = this.$route.fullPath
      this.$router.push({ path: url + '/schedule', query: { id: id }})
    },
    /* 详情*/
    toDetail(id) {
      if (~this.$route.fullPath.indexOf('/detail/')) {
        return
      }
      const url = this.$route.fullPath
      this.$router.push({ path: url + '/detail/' + id })
    },
    driveOut(row) {
      if (this.$refs.dialogOutForm) {
        this.$nextTick(_ => {
          this.$refs.dialogOutForm.clearValidate()
        })
      }
      this.dialogOutForm.id = row.id
      this.dialogOutForm.plate = row.plate
      this.dialogOutForm.driverName = row.driverName
      this.dialogOutForm.driverId = row.driverId
      this.dialogVisibleOut = true
    },
    driveReturn(row) {
      if (this.$refs.dialogForm) {
        this.$nextTick(_ => {
          this.$refs.dialogForm.clearValidate()
        })
      }
      this.dialogForm.id = row.id
      this.dialogForm.plate = row.plate
      this.dialogForm.checkDepTime = row.depTime
      this.dialogForm.driverName = row.driverName
      this.dialogForm.driverId = row.driverId
      this.dialogVisibleReturn = true
    },

    dialogClose() {
      this.$set(this.dialogForm, 'arrTime', '')
      this.$set(this.dialogForm, 'depTime', '')
      this.dialogVisibleOut = false
      this.dialogVisibleReturn = false
    },
    exportExcel() {
      window.location = this.exportUrl('core/clientVehicleSchedule/export?' + $.param(this.searchParam))
    },
    resetList() {
      this.searchParam = { scheduleStatus: this.searchParam.scheduleStatus }
      this.$set(this.searchParam, 'organCascade', false)
      this.companyIds = []
      this.scheduleType = []
      this.useDate = []
      this.handleCurrentChange(1)
    },

    changeOrganization(data) {
      if (this.companyIds && this.companyIds.length == 1) {
        this.searchParam.organizationId = this.companyIds[0]
      } else {
        this.searchParam.organizationId = ''
        this.$set(this.searchParam, 'organCascade', false)
      }
    },
    /* table选择*/
    handleClick() {
      this.getList()
    },

    submitdialogForm(dialogForm) {
      var $this = this
      $this.$refs[dialogForm].validate((valid) => {
        if (!valid) {
          this.$message.error('校验不通过，请检查输入项')
          return
        }
        var url = '/core/clientVehicleSchedule/outAndReturn'
        ajax.post(url, $this.dialogForm).then(res => {
          if (res.status == 0) {
            $this.showMessage('操作成功', 'success')
            $this.dialogVisibleOut = false
            $this.dialogVisibleReturn = false
            $this.getList()
          } else {
            $this.showMessage(res.msg, 'error')
          }
        }
        )
      })
    },
    submitdialogOutForm(dialogOutForm) {
      var $this = this
      $this.$refs[dialogOutForm].validate((valid) => {
        if (!valid) {
          this.$message.error('校验不通过，请检查输入项')
          return
        }
        var url = '/core/clientVehicleSchedule/outAndReturn'
        ajax.post(url, $this.dialogOutForm).then(res => {
          if (res.status == 0) {
            $this.showMessage('操作成功', 'success')
            $this.dialogVisibleOut = false
            $this.dialogVisibleReturn = false
            $this.getList()
          } else {
            $this.showMessage(res.msg, 'error')
          }
        }
        )
      })
    }
  }
}
</script>

