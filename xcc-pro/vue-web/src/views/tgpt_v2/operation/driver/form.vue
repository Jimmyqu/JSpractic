<template>
  <div class="form-panel">
    <el-form ref="driverInfo" :model="driverInfo" :rules="rules" label-position="top" label-width="100px">
      <el-collapse v-model="openCollapse">
        <el-collapse-item title="基本资料" name="1">
          <div class="flex-panel">
            <el-form-item label="所属组织" prop="companyId">
              <tree-select
                v-model="companyIds"
                :disabled="editDisabled"
                placeholder="请选择组织"
                type="one"
                url="/admin/organization/tree"
                @change="chooserOrgId"
              />
            </el-form-item>
            <el-form-item label="司机姓名" prop="name">
              <el-input
                v-model="driverInfo.name"
                placeholder="请输入司机姓名"
                max-length="50"
                clearable
              />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="driverInfo.sex" placeholder="请选择性别" clearable>
                <el-option label="男" :value="1" />
                <el-option label="女" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="driverInfo.phone"
                :disabled="editDisabled"
                placeholder="请输入手机号"
                max-length="11"
                clearable
              />
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input
                v-model="driverInfo.idCard"
                placeholder="请输入身份证号"
                max-length="18"
                clearable
                @change="idCardChange"
              />
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="driverInfo.birthday"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择出生日期"
                :editable="false"
                readonly
              />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="driverInfo.age" placeholder="请输入年龄" max-length="3" readonly />
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="驾驶信息" name="2">
          <div class="flex-panel">
            <el-form-item label="驾驶证号" prop="driverNo">
              <el-input
                v-model="driverInfo.driverNo"
                placeholder="请输入驾驶证号"
                max-length="18"
                clearable
              />
            </el-form-item>
            <el-form-item label="驾驶证申领日期" prop="driveDate">
              <el-date-picker
                v-model="driverInfo.driveDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择驾驶证申领日期"
                :editable="false"
              />
            </el-form-item>
            <el-form-item label="准驾车型">
              <el-select v-model="driverInfo.driveType" placeholder="请选择准驾车型" clearable filterable>
                <el-option
                  v-for="item in driveTypeList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="驾龄" prop="driveAge">
              <el-input
                v-model="driverInfo.driveAge"
                placeholder="请输入驾龄"
                max-length="3"
                clearable
              />
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item title="服务信息" name="3">
          <div class="flex-panel">
            <el-form-item label="在职状态" prop="workStatus">
              <el-select v-model="driverInfo.workStatus" placeholder="请选择在职状态" clearable>
                <el-option label="在职" :value="1" />
                <el-option label="离职" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="服务城市" prop="cityName">
              <city-select ref="citySelect" :value.sync="driverInfo.cityName" />
            </el-form-item>
            <el-form-item label="任务状态" prop="taskStatus">
              <el-select v-model="driverInfo.taskStatus" :disabled="editDisabled" placeholder="请选择服务状态" clearable>
                <el-option label="空闲" :value="1" />
                <el-option label="任务中" disabled :value="2" />
                <el-option label="休假" :value="3" />
              </el-select>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item title="证照" name="4">
          <div class="flex-panel">
            <el-form-item label="身份证正面">
              <upload-panel
                :size="1"
                :file-list.sync="idCardFrontPhoto"
                accept=".jpg,.jpeg,.png"
                :show-img="true"
              />
            </el-form-item>
            <el-form-item label="身份证反面">
              <upload-panel
                :size="1"
                :file-list.sync="idCardBackPhoto"
                accept=".jpg,.jpeg,.png"
                :show-img="true"
              />
            </el-form-item>
            <el-form-item label="驾驶证照片">
              <upload-panel
                :size="1"
                :file-list.sync="driverCardPhoto"
                accept=".jpg,.jpeg,.png"
                :show-img="true"
              />
            </el-form-item>
            <el-form-item label="其他">
              <upload-panel
                :size="1"
                :file-list.sync="otherPhoto"
                accept=".jpg,.jpeg,.png"
                :show-img="true"
              />
            </el-form-item>
          </div>
        </el-collapse-item>

      </el-collapse>
      <div class="left-row">
        <el-button type="primary" @click="submitForm('driverInfo')">保存</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </el-form>

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
  name: 'AppDriverForm',
  components: {
    TreeSelect, CitySelect, MoneyInput, UploadPanel },
  mixins: [tool, ruleTool],
  data() {
    return {
      openCollapse: ['1', '2', '3', '4'],
      show: false,
      editDisabled: false,
      serviceStatusDisabledFlag: false,
      driverInfo: {},
      idCardFrontPhoto: [],
      idCardBackPhoto: [],
      driverCardPhoto: [],
      otherPhoto: [],
      companyIds: [],
      rules: {
        companyId: [
          { required: true, message: '所属组织不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入司机姓名', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: formRule.isMobilePhone, message: '手机号格式有误', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            validator: formRule.common,
            reg: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        driverNo: [
          { required: true, message: '请输入驾驶证号', trigger: 'change' }
        ],
        driveDate: [
          { required: true, message: '请选择驾驶证申领日期', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请选择服务城市', trigger: 'change' }
        ],
        workStatus: [
          { required: true, message: '请选择在职状态', trigger: 'change' }
        ],
        taskStatus: [
          { required: true, message: '请选择任务状态', trigger: 'change' }
        ]
      },
      serviceCityList: [],
      driveTypeList: [],
      relatedUserList: []
    }
  },
  mounted() {
    this.selectDriveType()
    this.open()
  },
  methods: {
    idCardChange(value) {
      const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      if (reg.test(value)) {
        /* 计算出生日期和年龄*/
        const birthday = this.getBirthdayFromIdCard(value)
        /* 初始化出生日期和年龄*/
        const data = new Date(Date.parse(birthday.replace(/-/g, '/'))).format('yyyy-MM-dd')
        this.$set(this.driverInfo, 'birthday', data)
        const age = this.getAges(birthday)
        this.$set(this.driverInfo, 'age' + '', age)
      }
    },

    getAges(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear()
        return Y - r[1]
      }
    },

    /* 根据身份证号获取出生年龄*/
    getBirthdayFromIdCard(idCard) {
      var birthday = ''
      if (idCard != null && idCard != '') {
        if (idCard.length == 15) {
          birthday = '19' + idCard.substr(6, 6)
        } else if (idCard.length == 18) {
          birthday = idCard.substr(6, 8)
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
      }
      return birthday
    },

    open() {
      debugger
      var $this = this
      $this.openCollapse = ['1', '2', '3', '4', '5']
      $this.show = true
      $this.clearValidate('driverInfo')
      const id = this.$route.query.id
      if (id) { // 编辑
        ajax.get('operation_base/driver/detail/' + id + '?time=' + new Date().getTime()).then(result => {
          if (result.status == 0) {
            result.data.age = $this.getAges(result.data.birthday)
            $this.driverInfo = result.data
            // if($this.driverInfo.taskStatus==2 || $this.driverInfo.serviceStatus==2 || $this.driverInfo.serviceStatus==5){
            $this.editDisabled = true
            // }
            $this.init()
          }
        })
      } else {
        $this.initData()
      }
    },
    clearValidate(driverInfo) {
      const $this = this
      if ($this.$refs[driverInfo]) {
        $this.$refs[driverInfo].resetFields()
      }
    },
    initData() {
      var $this = this
      $this.driverInfo = { taskStatus: 1 }
      $this.idCardFrontPhoto = []
      $this.idCardBackPhoto = []
      $this.driverCardPhoto = []
      $this.otherPhoto = []
    },
    init() {
      debugger
      var $this = this
      if ($this.driverInfo.id) {
        if ($this.driverInfo.idCardFrontPhoto) {
          $this.idCardFrontPhoto = JSON.parse($this.driverInfo.idCardFrontPhoto)
        }
        if ($this.driverInfo.idCardBackPhoto) {
          $this.idCardBackPhoto = JSON.parse($this.driverInfo.idCardBackPhoto)
        }
        if ($this.driverInfo.driverCardPhoto) {
          $this.driverCardPhoto = JSON.parse($this.driverInfo.driverCardPhoto)
        }
        if ($this.driverInfo.otherPhoto) {
          $this.otherPhoto = JSON.parse($this.driverInfo.otherPhoto)
        }
        $this.driverInfo.cityName = [$this.driverInfo.provinceId, $this.driverInfo.serviceCityId]
        $this.companyIds.push($this.driverInfo.companyId)
      }
    },

    /* 选取用户组织*/
    chooserOrgId() {
      if (this.companyIds.length > 0) {
        this.driverInfo.companyId = this.companyIds[0]
      } else {
        this.driverInfo.companyId = ''
      }
    },

    submitForm(driverInfo) {
      var $this = this
      $this.$refs[driverInfo].validate((valid) => {
        if (valid) {
          if ($this.idCardFrontPhoto != null && $this.idCardFrontPhoto.length > 0) {
            $this.driverInfo.idCardFrontPhoto = JSON.stringify($this.idCardFrontPhoto)
          }
          if ($this.idCardBackPhoto != null && $this.idCardBackPhoto.length > 0) {
            $this.driverInfo.idCardBackPhoto = JSON.stringify($this.idCardBackPhoto)
          }
          if ($this.driverCardPhoto != null && $this.driverCardPhoto.length > 0) {
            $this.driverInfo.driverCardPhoto = JSON.stringify($this.driverCardPhoto)
          }
          if ($this.otherPhoto != null && $this.otherPhoto.length > 0) {
            $this.driverInfo.otherPhoto = JSON.stringify($this.otherPhoto)
          }
          $this.driverInfo.serviceCityId = $this.driverInfo.cityName[1]
          var url = 'operation_base/driver/save'
          // var driverInfo = JSON.stringify($this.driverInfo);
          ajax.post(url, $this.driverInfo).then(res => {
            if (res.status == 0) {
              $this.$message({ message: res.message, type: 'success' })
              $this.close()
              $this.$emit('load')
            } else {
              $this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    selectDriveType() {
      var $this = this
      ajax.get('admin/dict/type/准驾车型?time=' + new Date().getTime()).then(result => {
        if (result.length > 0) {
          $this.driveTypeList = result
        } else {
          $this.driveTypeList = []
        }
      })
    }
  }
}
</script>

