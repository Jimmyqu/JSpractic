<template>
    <div class="form-panel">
        <el-form :model="purchaseForm" :rules="rules" label-position="top" ref="purchaseForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆采购单基本信息-->
                <el-collapse-item title="车辆采购单基本信息" name="1">
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="organizationId" :rules="rules.required('请选择所属组织')">
                            <tree-select v-model="purchaseForm.organizationId" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree" @change="changeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="供应商" prop="supplierName" :rules="rules.required('请选择供应商')">
                            <el-input v-model="purchaseForm.supplierName" @focus="openDialog(1)" placeholder="请选择供应商">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="采购日期" prop="purchaseDate" :rules="rules.required('请选择采购日期')">
                            <el-date-picker v-model="purchaseForm.purchaseDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="请选择采购日期" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="采购方式" prop="purchaseMethod" :rules="rules.required('请选择采购方式')">
                            <el-select v-model="purchaseForm.purchaseMethod" filterable placeholder="请选择采购方式" clearable>
                                <el-option label="新购" :value="1"></el-option>
                                <el-option label="租赁" :value="2"></el-option>
                                <el-option label="现有车辆安排" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车台数" prop="vehicleNum">
                            <el-input :value="getVehicleNum()" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="总金额（元）" prop="totalAmount">
                            <el-input :value="getTotalAmount()" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" :rows="2" v-model="purchaseForm.remark" placeholder="请输入备注"
                                      clearable maxlength="200"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <!--车辆采购明细-->
                <el-collapse-item title="车辆采购明细" name="2">
                    <el-button class="float-btn" type="primary" @click="addRow()">新增</el-button>
                    <template>
                        <el-table class="left" border :data="purchaseForm.purchaseOrderDetail" style="width: 100%">
                            <el-table-column label="序号" min-width="80">
                                <template slot-scope="scope">
                                    {{scope.$index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="采购计划" min-width="220" label-class-name="required">
                                <template slot-scope="{row,$index}">
                                    <el-form-item :prop="'purchaseOrderDetail.' + $index  + '.planNumber'"
                                                  :rules="rules.required('请选择采购计划')">

                                        <el-input type="text" placeholder="请选择采购计划" v-model="row.planNumber"
                                                  size="small"
                                                  @click.native="openDialog(2, $index)"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cityName" label="服务城市" show-overflow-tooltip min-width="140">
                            </el-table-column>
                            <el-table-column prop="vehicleModelInfoName" label="车型" show-overflow-tooltip
                                             min-width="140">
                            </el-table-column>
                            <el-table-column prop="newOrOldCar" label="车辆新旧" min-width="100">
                            </el-table-column>
                            <el-table-column prop="carAge" label="车龄（月）" min-width="100">
                            </el-table-column>
                            <el-table-column prop="carColor" label="颜色" min-width="100">
                            </el-table-column>
                            <el-table-column prop="retrofitRequirementOptions" label="加装要求" show-overflow-tooltip
                                             min-width="140">
                            </el-table-column>
                            <el-table-column prop="retrofitRequirement" label="其他加装要求" show-overflow-tooltip
                                             min-width="140">
                            </el-table-column>
                            <el-table-column prop="referencePrice" label="市场参考价(元)" min-width="140">
                            </el-table-column>
                            <el-table-column prop="createTime" label="申请时间" min-width="140">
                            </el-table-column>
                            <el-table-column label="接收人" min-width="180" label-class-name="required">
                                <template slot-scope="{row,$index}">
                                    <el-form-item :prop="'purchaseOrderDetail.' + $index + '.receiver'"
                                                  :rules="rules.required('请输入接收人')">
                                        <el-input v-model="row.receiver" clearable placeholder="请输入接收人"
                                                  maxlength="30"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="上牌费用类型" min-width="200" label-class-name="required">
                                <template slot-scope="{row,$index}">
                                    <el-form-item :prop="'purchaseOrderDetail.' + $index + '.plateFeeType'"
                                                  :rules="rules.required('请选择上牌费用类型')">
                                        <el-select v-model="row.plateFeeType" placeholder="请选择上牌费用类型">
                                            <el-option label="包牌" :value="1"></el-option>
                                            <el-option label="不包牌" :value="2"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="成交单价(元)" min-width="180" label-class-name="required">
                                <template slot-scope="{row,$index}">
                                    <el-form-item :prop="'purchaseOrderDetail.' + $index + '.unitPrice'"
                                                  :rules="rules.money()">
                                        <el-input v-model="row.unitPrice" clearable placeholder="请输入"
                                                  maxlength="14"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="购买数量" min-width="180" label-class-name="required">
                                <template slot-scope="{row,$index}">
                                    <el-form-item :prop="'purchaseOrderDetail.' + $index + '.quantity'"
                                                  :rules="intRule2(true,[1,row.needPurchaseQuantity])">
                                        <el-input v-model="row.quantity" clearable placeholder="请输入"
                                                  maxlength="6"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="首付款(元)" min-width="180" label-class-name="required">
                                <template slot-scope="{row,$index}">
                                    <el-form-item :prop="'purchaseOrderDetail.' + $index + '.firstPayment'"
                                                  :rules="rules.money()">
                                        <el-input v-model="row.firstPayment" clearable placeholder="请输入"
                                                  maxlength="14"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column prop="tradeAmount" label="成交总额(元)" min-width="200">
                                <template slot-scope="scope">{{getTradeAmount(scope.row)}}</template>
                            </el-table-column>
                            <el-table-column prop="creater" label="申请人" show-overflow-tooltip
                                             min-width="140">
                            </el-table-column>
                            <el-table-column prop="organizationName" label="申请组织" show-overflow-tooltip min-width="140">
                            </el-table-column>
                            <el-table-column label="操作" min-width="100">
                                <template slot-scope="scope">
                                    <el-form-item>
                                        <el-button type="text"
                                                   @click="deleteItem(scope.$index)"
                                                   style="color:#F56C6C;font-size: 13px;">删除
                                        </el-button>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <!--</div>-->
                </el-collapse-item>

            </el-collapse>
            <div class="left-row">
                <el-button type="primary" @click="submitForm('purchaseForm')">保存</el-button>
                <el-button @click="close">返回</el-button>
            </div>
        </el-form>

        <!-- 供应商 -->
        <el-dialog width="70%" title="选择供应商" :visible.sync="dialogVisibleArray[0]" :before-close="handleDialogClose"
                   :append-to-body="true">
            <div class="list-panel">
                <div class="row form-horizontal search-box min">
                    <div class="form-group">
                        <label class="control-label">供应商名称</label>
                        <div class="input-group">
                            <el-input clearable placeholder="请输入供应商名称" v-model="supplierParam.name"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">手机号</label>
                        <div class="input-group">
                            <el-input clearable placeholder="请输入手机号" v-model="supplierParam.phone"></el-input>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="_querySupplier">查询
                        </el-button>
                        <el-button size="small" @click="resetList(1)">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border style="width: 100%" :data="supplierList" @row-dblclick="selectOne($event)"
                              max-height="300">
                        <el-table-column property="name" label="供应商名称" sortable show-overflow-tooltip min-width="140"
                                         @click.native="selectOne()"></el-table-column>
                        <el-table-column property="contact" label="联系人" sortable show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column property="contactPhone" label="联系电话" sortable
                                         min-width="120"></el-table-column>
                        <el-table-column property="phoneNo" label="联系手机号" sortable min-width="120"></el-table-column>
                        <el-table-column property="contactAddress" label="联系地址" sortable show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column property="companyName" label="所属组织" sortable show-overflow-tooltip
                                         min-width="140"></el-table-column>
                    </el-table>
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

        <!-- 采购计划 -->
        <el-dialog width="70%" title="采购计划" :visible.sync="dialogVisibleArray[1]" :before-close="handleDialogClose"
                   :append-to-body="true">
            <div class="list-panel">
                <div class="row form-horizontal search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">订单号</label>
                            <div class="input-group">
                                <el-input clearable placeholder="请输入订单号" v-model="planParam.planNumber"></el-input>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">申请时间</label>
                            <div class="input-group" style="width: 330px;">
                                <el-date-picker
                                    v-model="applicationDate"
                                    type="datetimerange"
                                    range-separator="至"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="yyyy-MM-dd HH:mm"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :editable="false">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">计划采购车型</label>
                            <div class="input-group">
                                <el-input clearable placeholder="请输入计划采购车型"
                                          v-model="planParam.vehicleModelInfoName"></el-input>
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="_queryPlan">查询
                        </el-button>
                        <el-button size="small" @click="resetList(2)">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border style="width: 100%" :data="planList" @row-dblclick="selectTwo($event)"
                              max-height="300">
                        <el-table-column prop="planNumber" sortable label="订单号" min-width="200"></el-table-column>
                        <el-table-column prop="contractNumber" sortable label="项目合同编号"
                                         min-width="200"></el-table-column>
                        <el-table-column prop="vehicleModelInfoName" sortable label="计划采购车型" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="organizationName" sortable label="所属组织" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="cityName" sortable label="服务城市" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="carAge" sortable label="车龄" min-width="100"></el-table-column>
                        <el-table-column prop="carColor" sortable label="颜色" min-width="100"></el-table-column>
                        <el-table-column prop="newOrOldCar" sortable label="车辆新旧" min-width="100"></el-table-column>
                        <el-table-column prop="needPurchaseQuantity" sortable label="计划采购数量"
                                         min-width="120"></el-table-column>
                        <el-table-column prop="hadPurchaseQuantity" sortable label="已采购车台数"
                                         min-width="120"></el-table-column>
                        <el-table-column prop="referencePrice" sortable label="市场参考价(元)"
                                         min-width="140"></el-table-column>
                        <el-table-column prop="explanation" sortable label="采购说明" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="planStatusText" sortable label="状态" min-width="80"></el-table-column>
                        <el-table-column prop="retrofitRequirementOptions" sortable label="加装需求选项" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="retrofitRequirement" sortable label="加装需求" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="deliveryDate" sortable label="计划交车日期" min-width="140"></el-table-column>
                        <el-table-column prop="creater" sortable label="申请人" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="createTime" sortable label="申请时间" min-width="140"></el-table-column>
                    </el-table>
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
    import CitySelect from '@/components/CitySelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "purchaseOrderForm",
        components: {TreeSelect, CitySelect, MoneyInput, UploadPanel},

        data() {
            return {
                openCollapse: ["1", "2"],
                show: false,
                purchaseForm: {},
                supplierList: [],
                clickTableIndex: 0,
                supplierParam: {},
                supplierList: [],
                planParam: {},
                planList: [],
                dialogVisibleArray: [false, false, false],
                applicationDate: '',
                orgSelectId: [],
                receiverList: [],
                editabled: false,
                rules: {}
            }
        },
        methods: {
            getTradeAmount(row) {
                if (row.unitPrice && !isNaN(row.unitPrice) && row.quantity && !isNaN(row.quantity)) {
                    let amount = (row.unitPrice * row.quantity).toFixed(2);
                    row.tradeAmount = amount;
                    return amount;
                } else {
                    row.tradeAmount = 0;
                    return 0;
                }
            },
            open() {
                var $this = this;
                this.purchaseForm = {purchaseOrderDetail: [{}]};
                let id = this.$route.query.id;
                if (id) {
                    //参数格式根据需要调整
                    ajax.get("core/purchaseOrder/selectPurchaseOrderInfo/" + id).then(res => {
                        if (this.checkResponse(res)) {// 验证请求成功状态
                            this.purchaseForm = res.data;
                            this.openCollapse = ["1", "2"];
                            this.show = true;
                            //组织
                            this.editabled = true;
                            this.purchaseForm.organizationId = [res.data.organizationId];
                            //明细
                            this.purchaseForm.purchaseOrderDetail.forEach(d => {
                                d.deliveryCityId = [d.deliveryCityProvinceId, d.deliveryCityId];
                            });

                        }
                    });
                } else {
                    this.openCollapse = ["1", "2"];
                    this.show = true;
                    this.editabled = false;
                }

            },
            resetForm(purchaseForm) {
                let $this = this;
                if ($this.$refs[purchaseForm]) {
                    $this.$refs[purchaseForm].resetFields();
                }
            },

            openDialog(type, i) {
                this.clickTableIndex = i;
                this.dialogVisibleArray[type - 1] = true;

                this._queryDialog();
            },
            getActiveDialogType() {
                var arr = this.dialogVisibleArray;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i])
                        return i + 1;
                }
                return -1;
            },
            _queryDialog() {
                var type = this.getActiveDialogType();
                console.log(type);
                if (type == 1) {
                    this._querySupplier();
                } else if (type == 2) {
                    this._queryPlan();
                }
            },
            _querySupplier() {
                var that = this;
                const params = this.supplierParam;
                if (this.purchaseForm.organizationId) {
                    params.organizationId = this.purchaseForm.organizationId.join();
                }
                params.size = this.pageSize;
                params.rows = this.pageSize;
                params.page = this.page;
                params.current = this.page;
                ajax.get('/core/purchaseOrder/supplierList', params)
                    .then(rs => {
                        that.supplierList = rs.rows;
                        that.listCount = rs.records;
                    });
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.page = 1;
                this._queryDialog();
            }
            ,
            handleCurrentChange(val) {
                this.page = val;
                this._queryDialog();
            },
            _queryPlan() {
                var that = this;
                var params = this.planParam;
                if (this.applicationDate) {
                    params.applicationDateStart = this.applicationDate[0];
                    params.applicationDateEnd = this.applicationDate[1];
                }
                if (this.purchaseForm.organizationId) {
                    params.organizationId = this.purchaseForm.organizationId.join();
                }
                params.size = this.pageSize;
                params.rows = this.pageSize;
                params.page = this.page;
                params.current = this.page;
                ajax.get('/core/purchaseOrder/selectUnderwayPlanList', params)
                    .then(rs => {
                        that.planList = rs.rows;
                        that.listCount = rs.records;
                    });
            },

            //供应商弹出框table数据选择
            selectOne(cell) {
                this.purchaseForm.supplierName = cell.name;
                this.purchaseForm.supplierId = cell.id;
                this.purchaseForm = Object.assign({}, this.purchaseForm);
                this.handleDialogClose();
            },
            //采购计划弹出框table数据选择
            selectTwo(cell) {
                var i = this.clickTableIndex;
                this.purchaseForm.purchaseOrderDetail[i].planNumber = cell.planNumber;
                this.purchaseForm.purchaseOrderDetail[i].purchasePlanId = cell.id;
                this.purchaseForm.purchaseOrderDetail[i].cityName = cell.cityName;
                this.purchaseForm.purchaseOrderDetail[i].vehicleModelInfoName = cell.vehicleModelInfoName;
                this.purchaseForm.purchaseOrderDetail[i].carAge = cell.carAge;
                this.purchaseForm.purchaseOrderDetail[i].newOrOldCar = cell.newOrOldCar;
                this.purchaseForm.purchaseOrderDetail[i].carColor = cell.carColor;
                this.purchaseForm.purchaseOrderDetail[i].referencePrice = cell.referencePrice;
                this.purchaseForm.purchaseOrderDetail[i].organizationName = cell.organizationName;
                this.purchaseForm.purchaseOrderDetail[i].retrofitRequirementOptions = cell.retrofitRequirementOptions;
                this.purchaseForm.purchaseOrderDetail[i].retrofitRequirement = cell.retrofitRequirement;
                this.purchaseForm.purchaseOrderDetail[i].createTime = cell.createTime;
                this.purchaseForm.purchaseOrderDetail[i].creater = cell.creater;
                this.purchaseForm.purchaseOrderDetail = [].concat(this.purchaseForm.purchaseOrderDetail);
                this.$set(this.purchaseForm.purchaseOrderDetail, i, Object.assign({}, this.purchaseForm.purchaseOrderDetail[i]));

                this.handleDialogClose();
            },
            handleDialogClose() {
                this.dialogVisibleArray = [false, false, false];
            },
            //重置筛选
            resetList(num) {
                if (num == 1) {
                    this.supplierParam = {};
                    this._querySupplier();
                } else if (num == 2) {
                    this.planParam = {};
                    this.applicationDate = '';
                    this._queryPlan();
                }
            },
            addRow() {
                this.purchaseForm.purchaseOrderDetail.push({})
            },
            deleteItem(index) {
                if (this.purchaseForm.purchaseOrderDetail.length == 1) {
                    this.$message.error('至少保留一条车辆采购明细');
                    return;
                }
                this.purchaseForm.purchaseOrderDetail.splice(index, 1);
            },


            submitForm(purchaseForm) {
                var $this = this;
                $this.$refs[purchaseForm].validate((valid) => {
                    if (valid) {
                        //var data = this.purchaseForm;
                        let parmas = this.extend(true, {}, this.purchaseForm);
                        parmas.organizationId = parmas.organizationId.join();
                        var url = "core/purchaseOrder/edit";
                        ajax.post(url, parmas).then(res => {
                            if (res.status == 0) {
                                $this.$message({message: res.message, type: 'success'});
                                $this.close();
                                $this.$emit('load');
                            } else {
                                $this.$message.error(res.message);
                            }
                        });
                    } else {
                        return false;
                    }

                });
            },
            //整数规则
            intRule2(required = true, size = []) {
                if (size[1] === undefined) {
                    size = [1, 999999];
                    return [{validator: formRule.standardSize, required: required, message: "请输入整数", trigger: 'change'},
                        {
                            validator: formRule.standardSize,
                            required: required,
                            size: size,
                            message: "请输入大于0的整数",
                            trigger: 'change'
                        }];
                }
                return [{validator: formRule.standardSize, required: required, message: "请输入整数", trigger: 'change'},
                    {
                        validator: formRule.standardSize,
                        required: required,
                        size: size,
                        message: "请输入" + size[0] + "-" + size[1] + "的整数",
                        trigger: 'change'
                    }];
            },
            //车台数
            getVehicleNum() {
                let sum = 0;
                let data = this.purchaseForm.purchaseOrderDetail;
                if (data && data.length) {
                    data.forEach(item => {
                        if (item.quantity && !isNaN(item.quantity)) {
                            sum += Number(item.quantity);
                        }
                    });
                }
                this.purchaseForm.vehicleNum = sum;
                return sum;
            },
            //总金额
            getTotalAmount() {
                let sum = 0;
                let data = this.purchaseForm.purchaseOrderDetail;
                if (data && data.length) {
                    data.forEach(item => {
                        sum += Number(this.getTradeAmount(item));
                    });
                }
                this.purchaseForm.totalAmount = sum;
                console.log(sum);
                return sum;
            },
            changeOrganization() {
                this.purchaseForm.supplierName = "";
                this.purchaseForm.supplierId = "";
                this.purchaseForm.purchaseOrderDetail = [{}]
            }

        },
        mounted() {
            var $this = this;
            this.open();
        }


    }
</script>

