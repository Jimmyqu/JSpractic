import ajax from '@/utils/request'
import $ from 'jquery-slim'

export const tool = {
  data() {
    return {
      searchParam: {},
      pageSize: 15,
      pageSizeSetting: [10, 15, 20, 40, 100],
      page: 1, // 当前页
      listCount: 1,
      listUrl: '',
      pageLayout: 'total, sizes, prev, next, jumper',
      list: [],
      loading: false,
      listLoading: false,
      tableHeight: window.innerHeight - 125,
      showSearch: false,
      minDate: null,
      limit: 30 * 24 * 60 * 60 * 1000,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.minDate = minDate
        },
        disabledDate: (time) => {
          if (this.minDate) {
            return time.getTime() > Date.now() || time > new Date(this.minDate.getTime() + this.limit) || time < new Date(this.minDate.getTime() - this.limit)
          }
          return time.getTime() > Date.now()
        }
      },
      getRefName: this.$route.name + new Date().getTime(),
      settimeout: null,
      setTableHeightTimeout: null,
      hasGetList: false
    }
  },
  watch: {
    loading(val) {
      this.$root.$children[0].loading = val
    },
    showSearch(val) {
      document.body.style.overflow = 'hidden'
      clearTimeout(this.settimeout)
      this.settimeout = setTimeout(() => {
        document.body.style.overflow = ''
      }, 700)
      this.$nextTick(function() {
        if (val) {
          this.setTableHeight(300, 30)
        } else {
          this.setTableHeight(300, 0)
        }
      })
    }
  },
  created() {
    this.keyupSubmit()
  },
  activated() {
    /**
         * keep-alive 重新挂载
         */
    this.keyupSubmit()
    this.setTableHeight()
  },
  methods: {
    keyupSubmit() {
      const $this = this
      if ($this.listUrl) {
        document.onkeydown = function(e) {
          const _key = e.keyCode
          if (_key === 13) {
            $this.handleCurrentChange(1)
          }
        }
      }
    },
    sortChange({ column, prop, order }) {
      if (column.sortable != 'custom') return
      this.searchParam['vueSort'] = order ? prop : undefined
      if (order == 'descending') {
        order = -1
      } else if (order == 'ascending') {
        order = 1
      }
      this.searchParam['vueOrder'] = order
      this.getList()
    },
    // 切换列表Url
    getListByUrl(url) {
      this.listUrl = url
      this.resetList()
    },
    // 重置筛选
    resetList() {
      this.searchParam = {}
      this.handleCurrentChange(1)
    },
    // 切换页容量
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.getList()
    },
    // 翻页
    handleCurrentChange(val, type) {
      this.page = val
      if (type) {
        this.getList(false, false)
      } else {
        this.getList(false, true)
      }
    },
    getListBefore(params) {

    },
    getListAfter(callback) {
    },
    // 查询列表
    getList(callback, type) {
      this.hasGetList = true
      const params = Object.assign({}, this.searchParam)
      params.size = this.pageSize
      params.current = this.page
      params.rows = this.pageSize
      params.page = this.page
      this.getListBefore(params)
      this.listLoading = true
      // this.loading = true;
      // 去除搜索条件 前后的空格
      for (var index in params) {
        if (typeof params[index] === 'string') {
          var param = params[index].toString()
          this.searchParam[index] = params[index] = param.replace(/(^\s*)|(\s*$)/g, '')
        }
      }
      ajax.get(this.listUrl, params).then(res => {
        this.listLoading = false
        // this.loading = false;
        if (typeof res.records === 'object') {
          this.list = res.records
          this.listCount = res.total
        }
        if (typeof res.rows === 'object') {
          this.list = res.rows
          this.listCount = res.records
        }
        if (type && res.total && res.total > 0 && !this.list.length) {
          this.handleCurrentChange(1, true)
        }
        this.handleBtn()
        this.$nextTick(function() {
          this.setTableHeight()
        })
        $.isFunction(callback) && callback(res)
        this.getListAfter()
      }).catch(_ => {
        this.loading = false
        this.listLoading = false
      })
    },
    handleBtn() {
    },
    showMessage(text, type, callback) {
      this.$message({
        showClose: true,
        message: text,
        duration: 2000,
        type: type || 'error',
        onClose: callback || function() {
        }
      })
    },
    checkResponse(res, disabledMessage) {
      if (res && res.status === 0) {
        return true
      } else {
        !disabledMessage && this.showMessage(res.message)
        return false
      }
    },
    closeCurPage(url) {
      const tag = $('.tags-view-item.active .el-icon-error')
      // this.$router.push({path:url});
      window.setTimeout(_ => {
        tag.click()
      }, 200)
    },
    getCurrentUserInfo() {
      return this.extend(true, {}, this.$store.getters.user)
    },
    getCurrentUserAuthority(url) {
      const auth = this.$store.getters.auth
      return auth.indexOf(url) !== -1
    },
    getCurrentUserMenuAuthority(url) {
      const auth = this.$store.getters.authMenu
      return auth.indexOf(url) !== -1
    },
    /**
         * 是否有菜单权限
         */
    getCurrentUserRouterAuthority(url) {
      const auth = this.$store.getters.authorityMenu
      return auth.some(auth => auth.path === url)
    },
    downloadFile(filePath, fileName) {
      var param = 'filePath=' + filePath +
                '&fileName=' + fileName

      location.href = encodeURI(this.exportUrl('file/download/downloadFile?' + param))
    },
    exportUrl(url) {
      var token = this.$store.getters.token
      let BASE_API = process.env.VUE_APP_BASE_API;
      if(!/\/$/.test(BASE_API)){
        BASE_API = BASE_API +'/'
      }
      if (token) {
        if (url.indexOf('?') != -1) { return BASE_API + url + '&access_token=' + token + '&t=' + new Date().getTime() } else {
          return BASE_API + url + '?access_token=' + token + '&t=' + new Date().getTime()
        }
      } else {
        if (url.indexOf('?') != -1) {
          return BASE_API + url + '&t=' + new Date().getTime()
        } else {
          return BASE_API + url + '?t=' + new Date().getTime()
        }
      }
    },
    add() {
      if (~this.$route.fullPath.indexOf('/add')) {
        return
      }
      const _path = this.$route.fullPath.indexOf('?') != -1 ? this.$route.fullPath.split('?')[0] : this.$route.fullPath
      const url = _path + '/add'
      this.$router.push({ path: url })
    },
    edit(id) {
      if (~this.$route.fullPath.indexOf('/edit?')) {
        return
      }
      const _path = this.$route.fullPath.indexOf('?') != -1 ? this.$route.fullPath.split('?')[0] : this.$route.fullPath
      const url = _path + '/edit?id=' + id
      this.$router.push({ path: url })
    },
    close() {
      if (this.close.disabled) {
        return
      }
      this.close.disabled = true
      let i
      if (this.$route.fullPath.indexOf('/detail/') !== -1) {
        i = this.$route.fullPath.lastIndexOf('/detail/')
      } else {
        i = this.$route.fullPath.lastIndexOf('/')
      }
      const url = this.$route.fullPath.substring(0, i)
      this.$router.go(-1)
      this.closeCurPage(url)
      window.setTimeout(_ => {
        this.close.disabled = false
      }, 1000)
    },
    toDetail(row) {
      if (~this.$route.fullPath.indexOf('/detail/')) {
        return
      }
      const _path = this.$route.fullPath.indexOf('?') != -1 ? this.$route.fullPath.split('?')[0] : this.$route.fullPath
      const url = _path + '/detail/' + row.id
      this.$router.push({ path: url })
    },
    toPage(url) {
      this.$router.push({ path: url })
    },
    extend: $.extend,
    showBigImg(e) {
      const img = $('<img>')
      img[0].src = e.target.src
      const div = $("<div class='full-big-img'>").append(img)
      div.on('click', function() {
        $(this).remove()
      })
      $('body').append(div)
    },
    handleBlur() {
      if (this.minDate) {
        this.minDate = null
        this.isGetPickerOptions = false
      }
    },
    isShowTooltip(text) {
      if (text) {
        const textLength = text.getBytesLength()
        if (textLength * 7 >= 153) {
          return false
        } else {
          return true
        }
      }
      return true
    },
    setTableHeight(time = 300, height = 20) {
      if ($('.newList-panel .el-table').length) {
        clearTimeout(this.setTableHeightTimeout)
        this.setTableHeightTimeout = setTimeout(() => {
          let table = $('.newList-panel .el-table')
          if (table.length && table.length > 1 && parseInt(table.offset().top) <= 0) {
            table = $('.newList-panel .table-box-more .el-table')
          }
          if (table.length) {
            const tableTop = parseInt(table.offset().top)
            const difference = this.$route.name === 'todoFlow' ? 20 : 0
            const tableHeight = window.innerHeight - tableTop - height - difference
            const table_body_wrapper = $('.newList-panel .el-table__body-wrapper')
            let table_header_height = $('.newList-panel .el-table__header-wrapper')
            const total = $('.newList-panel .el-table__footer-wrapper').length ? 40 : 0
            if (table_header_height.length && table_header_height.length > 1 && table_header_height.height() <= 0) {
              table_header_height = $('.newList-panel .table-box-more .el-table__header-wrapper')
            }
            table_header_height = parseInt(table_header_height.height())
            if (table_body_wrapper) {
              for (let i = 0; i < table_body_wrapper.length; i++) {
                table_body_wrapper[i].style.maxHeight = tableHeight - table_header_height - total + 'px'
              }
            }
            this.$set(this, 'tableHeight', tableHeight)
            this.$forceUpdate()
          }
        }, time)
      }
    },
    setDialogTableHeight() {
      const dialogBodyWrapper = $('.el-dialog__wrapper .el-table__body-wrapper')
      if (dialogBodyWrapper.length && !$('.newList-panel .el-table').length) {
        for (let i = 0; i < dialogBodyWrapper.length; i++) {
          if (parseInt(dialogBodyWrapper[i].style.maxHeight) < 260) {
            setTimeout(() => {
              dialogBodyWrapper[i].style.maxHeight = 260 + 'px'
            })
          }
        }
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.setTableHeight()
    })
  },
  updated() {
    this.$nextTick(function() {
      this.setDialogTableHeight()
    })
  }
}

// UTF8字符集实际长度计算
function getStrLeng(str) {
  var realLength = 0
  var len = str.length
  var charCode = -1
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1
    } else {
      // 如果是中文则长度加3
      realLength += 3
    }
  }
  return realLength
}

export const ruleTool = {
  data() {
    return {
      rules: {
        // 必填规则
        required(msg = '请输入') {
          return { required: true, message: msg, trigger: 'change' }
        },
        // 税率规则
        cess(required = true, msg = '请输入100以下非负数') {
          return { validator: formRule.cess, message: msg, trigger: 'change' }
        },
        // 金额规则
        money(required = true, msg = '请输入正确格式的金额') {
          return { validator: formRule.money, required: required, message: msg, trigger: 'change' }
        },
        // 公里数规则
        mileage(required = true, msg = '请输入正确格式的公里数') {
          return { validator: formRule.mileage, required: required, message: msg, trigger: 'change' }
        },
        // 三位金额规则
        threeDecimalMoney(required = true, msg = '请输入正确格式的金额') {
          return { validator: formRule.threeDecimalMoney, required: required, message: msg, trigger: 'change' }
        },
        // 整数规则
        int(required = true, size = [], msg = '请输入正整数') {
          return {
            validator: formRule.numberSize,
            required: required,
            size: size,
            message: msg,
            trigger: 'change'
          }
        }
      }
    }
  }
}

export const loginTool = {
  data() {
    return {
      savePwd: !!localStorage.getItem('tgpt_account'),
      account: localStorage.getItem('tgpt_account') || '',
      password: localStorage.getItem('tgpt_password') || '',
      message: '',
      loading: false
    }
  },
  watch: {
    account: function(val) {
      this.message = ''
    },
    password: function(val) {
      this.message = ''
    }
  },
  methods: {
    disabled: function() {
      if (this.account == '' || this.password == '') {
        return true
      } else {
        return false
      }
    },
    login: function() {
      sessionStorage.hasWorkbench = ''
      if (this.disabled() || this.loading) {
        return
      }
      this.loading = true
      var data = {
        account: this.account,
        password: this.password,
        platform: 1,
        loginType: 1
      }
      this.$store.dispatch('Login', data).then(() => {
        this.loading = false
        if (this.savePwd) {
          localStorage.setItem('tgpt_account', data.account)
          localStorage.setItem('tgpt_password', data.password)
        } else {
          localStorage.removeItem('tgpt_account')
          localStorage.removeItem('tgpt_password')
        }
        // this.message = "登录成功，正在进入系统";
        this.$router.push({ path: '/' })
      }).catch(res => {
        this.message = res.message
        this.loading = false
      })
    }
  }
}

export const mapTool = {
  data() {
    return {
      map: {},
      mapSetting: {
        key: 'eSweuVZk7u8QC7OeuG5spvqOFiLAGSK5',
        v: '3.0',
        bmap: {
          center: [120, 30],
          zoom: 14,
          roam: true,
          mapStyle: {}
        }
      }
    }
  },
  methods: {
    drawLine(pointList, opt) {
      debugger
      const $this = this
      const startIcon = new BMap.Icon('/static/img/gpsStart.png', new BMap.Size(20, 26), { imageSize: new BMap.Size(20, 26) })
      const endIcon = new BMap.Icon('/static/img/gpsEnd.png', new BMap.Size(20, 26), { imageSize: new BMap.Size(20, 26) })
      if (pointList && pointList.length > 0) {
        var polyline = new BMap.Polyline(pointList)
        $this.map.addOverlay(polyline)
        // 起点
        if (!opt || !opt.hideStart) {
          const marker = new BMap.Marker(pointList[0], { icon: startIcon })
          $this.map.addOverlay(marker)
        }
        // 终点
        if (!opt || !opt.hideEnd) {
          const marker = new BMap.Marker(pointList[pointList.length - 1], { icon: endIcon })
          $this.map.addOverlay(marker)
        }

        opt && opt.callback && opt.callback(pointList)
      }
      /* var driving = new BMap.DrivingRoute($this.map, {
                 onSearchComplete: function (results) {
                     if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                         var plan = driving.getResults().getPlan(0);
                         var num = plan.getNumRoutes();
                         for (var j = 0; j < num; j++) {
                             var pts = plan.getRoute(j).getPath();    //通过驾车实例，获得一系列点的数组
                             var polyline = new BMap.Polyline(pts);
                             $this.map.addOverlay(polyline);

                             // 起点
                             if(!opt || ! opt.hideStart){
                                 let marker = new BMap.Marker(pts[0],{icon:startIcon});
                                 $this.map.addOverlay(marker);
                             }
                             // 终点
                             if(!opt || !opt.hideEnd){
                                 let marker = new BMap.Marker(pts[pts.length - 1],{icon:endIcon});
                                 $this.map.addOverlay(marker);
                             }
                             opt && opt.callback && opt.callback(pts);
                         }
                     }else {
                         let marker = new BMap.Marker(pointList[0],{icon:startIcon});
                         $this.map.addOverlay(marker);
                     }
                 }
             });*/
      /* driving.search(pointList[0], pointList[pointList.length - 1], {waypoints: pointList});*/
      const add = this.map.getViewport(eval(pointList))
      this.map.centerAndZoom(new BMap.Point(add.center.lng, add.center.lat), add.zoom)
      this.map.zoomTo(this.map.getZoom() - 1)
    }, multipleLine(pointList, opt) {
      const $this = this
      const startIcon = new BMap.Icon('/static/img/gpsStart.png', new BMap.Size(20, 26), { imageSize: new BMap.Size(20, 26) })
      const endIcon = new BMap.Icon('/static/img/gpsEnd.png', new BMap.Size(20, 26), { imageSize: new BMap.Size(20, 26) })

      var arrPois = []
      var keyList = []
      if (pointList && pointList.length > 0) {
        for (var i = 0; i < pointList.length - 1; i++) {
          arrPois.splice(0, arrPois.length)// 清空数组,如若不清空，会在原来基础上每次在重复的增加一边。这儿是让每两个点画线，否则第二次进来的时候就成四个数据了，第二个重复了一次
          arrPois.push(new BMap.Point(pointList[i].corlong, pointList[i].corlat))
          arrPois.push(new BMap.Point(pointList[i + 1].corlong, pointList[i + 1].corlat))
          keyList.push(new BMap.Point(pointList[i].corlong, pointList[i].corlat))
          var akeyline = new BMap.Polyline(arrPois, {
            strokeColor: pointList[i].color, strokeOpacity: 1
          })
          $this.map.addOverlay(akeyline)
        }
        // 起点
        if (!opt || !opt.hideStart) {
          const spot = new BMap.Point(pointList[0].corlong, pointList[0].corlat)
          const marker = new BMap.Marker(spot, { icon: startIcon })
          $this.map.addOverlay(marker)
        }
        // 终点
        if (!opt || !opt.hideEnd) {
          const spot = new BMap.Point(pointList[pointList.length - 1].corlong, pointList[pointList.length - 1].corlat)
          const marker = new BMap.Marker(spot, { icon: endIcon })
          $this.map.addOverlay(marker)
        }
        opt && opt.callback && opt.callback(pointList)
      }
      const add = this.map.getViewport(eval(keyList))
      this.map.centerAndZoom(new BMap.Point(add.center.lng, add.center.lat), add.zoom)
      this.map.zoomTo(this.map.getZoom() - 1)
    }
  }
}

export const statConfig = {
  methods: {
    // 公用饼图配置
    getChartPieOption() {
      return {
        color: ['#2a78fd', '#f73b3b', '#58d24c', '#ff5824', '#ff9600', '#76b6ff', '#909399'],
        legend: {
          show: false,
          top: 40,
          right: 30,
          orient: 'vertical',
          icon: 'circle'
        },
        grid: {
          left: '30px',
          right: '30px',
          top: '330px',
          bottom: '20px'
        },
        series: {
          radius: '40%',
          center: ['22%', '50%'],
          type: 'pie',
          label: {
            normal: {
              show: false,
              position: 'outside',
              formatter: '{b} {d}%'// 模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
            }
          }
        }
      }
    }
  }
}

export const formRule = {
  /**
     * 通用验证 reg可自定义验证正则
     * 常用正则：http://note.youdao.com/noteshare?id=537934c2896cad5aa2cb50e323102d8e&sub=EE59464E3EDC46A08A5F71E4E928CC62
     * field: [{ validator: formRule.common, reg:/^[1][3,4,5,7,8][0-9]{9}$/, message: 'xxxx', trigger: 'change' }],
     */
  common(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    }
    if (!rule.reg.test(value)) {
      return callback(new Error(rule.message))
    } else {
      return callback()
    }
  },
  /**
     * 验证数字大小
     * field: [{ validator: formRule.number, size:[1,10], message: 'xxxx', trigger: 'change' }],
     */
  number(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    }
    if (isNaN(value)) {
      return callback(new Error(rule.message))
    } else if (rule.size && rule.size.length == 2 && (value < rule.size[0] || value > rule.size[1])) {
      return callback(new Error('请输入' + rule.size.join('-') + '的数字'))
    } else {
      return callback()
    }
  },
  /**
     * 验证数字长度
     * field: [{ validator: formRule.numberSize, size:[1,10], message: 'xxxx', trigger: 'change' }],
     */
  numberSize(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    }
    if (isNaN(value) || (rule.size && rule.size.length == 2 && (value.length < rule.size[0] || value.length > rule.size[1]))) {
      return callback(new Error(rule.message))
    } else {
      return callback()
    }
  },
  /**
     * 验证整数
     * field: [{ validator: formRule.numberSize, size:[1,10], message: 'xxxx', trigger: 'change' }],
     */
  standardSize(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    }
    if (isNaN(value) || (rule.size && rule.size.length == 2 && (value < rule.size[0] || value > rule.size[1])) ||
            (value.toString().indexOf('.') != -1) || (value.toString().charAt(0) == '0' && value.length > 1)) {
      return callback(new Error(rule.message))
    } else {
      return callback()
    }
  },
  /**
     * 验证手机号码
     * field: [{ validator: formRule.phone, message: 'xxxx', trigger: 'change' }],
     */
  phone(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    }
    if (isNaN(value) || (value.length != 11) || (value.toString().indexOf('.') != -1)) {
      return callback(new Error(rule.message))
    } else {
      return callback()
    }
  },
  /**
     * 验证手机号码（与required配合使用，空值时不校验）
     */
  isMobilePhone(rule, value, callback) {
    if (!rule.required && !value && value !== 0) { // 只有有值时才进行校验
      return callback()
    } else {
      const reg = /^((1[3-9][0-9])+\d{8})$/
      if (reg.test(value)) {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }
  },
  /**
     * 验证固定电话（与required配合使用，空值时不校验）
     */
  isFixedPhone(rule, value, callback) {
    if (!rule.required && !value && value !== 0) { // 只有有值时才进行校验
      return callback()
    } else {
      const reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
      if (reg.test(value)) {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }
  },
  /**
     * 税率(<=100，2位小数)
     */
  cess(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    } else {
      const reg = /^\d{1,2}(?:\.\d{1,2})?$|^100(?:\.\d{1,2})?$/
      if (reg.test(value)) {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }
  },
  /**
     * 金额校验(11位整数，2位小数)
     * @param rule
     * @param value
     * @param callback
     */
  money(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    } else {
      const reg = /^\d{1,11}(?:\.\d{1,2})?$/
      if (reg.test(value) && value != '0.00') {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }
  },
  mileage(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    } else {
      const reg = /^\d{1,9}(?:\.\d{1,2})?$/
      if (reg.test(value) && value != '0.00') {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }
  },
  /**
     * 特殊金额校验(11位整数，3位小数)
     * @param rule
     * @param value
     * @param callback
     */
  threeDecimalMoney(rule, value, callback) {
    if (!rule.required && !value && value !== 0) {
      return callback()
    } else {
      const reg = /^\d{1,11}(?:\.\d{1,3})?$/
      if (reg.test(value)) {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }
  },
  /**
     * 校验车牌号
     * @param rule
     * @param value
     * @param callBack
     */
  validatePlate(rule, value, callBack) {
    debugger
    if (!value) {
      callBack()
    } else if (value.length >= 7) {
      var provinceArray = ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '黔', '滇', '藏', '陕', '甘', '青', '宁', '新', '台', '港', '澳']
      var lastStr = value.substring(value.length - 1, value.length)
      if (lastStr != '港') {
        var plateProvince = value.substring(0, 1)
        var plateNo = value.substring(1, value.length)
        if (provinceArray.indexOf(plateProvince) >= 0) {
          if (/^[A-Z][A-Z0-9]{5,6}$/.test(plateNo)) {
            callBack()
          } else {
            callBack(new Error('车牌号格式有误'))
          }
        } else {
          callBack(new Error('车牌号格式有误'))
        }
      } else {
        callBack()
      }
    } else {
      callBack(new Error('车牌号格式有误'))
    }
  },
  /**
     * 校验小数
     * @param rule
     * @param value
     * @param callBack
     */
  validateNumber(rule, value, callBack) {
    if (!value) {
      callBack()
    } else if (!(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value.replace(new RegExp(/,/g), '')) || /^(0|0[.]0|0[.]00)$/.test(value.replace(new RegExp(/,/g), '')))) {
      callBack(new Error('数字格式有误'))
    } else if (value > 99999999999.99) {
      callBack(new Error('您输入的金额太大'))
    } else {
      callBack()
    }
  }
}
