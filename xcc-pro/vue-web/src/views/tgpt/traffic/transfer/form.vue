<template>
    <div class="form-panel">
        <el-form :model="editForm" :rules="rules" label-position="top" ref="editForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="调拨申请" name="1">
                    <div class="flex-panel">
                        <el-form-item label="订单号" prop="companyName" v-if="editForm.code">
                            <el-input v-model="editForm.code" clearable :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="editForm.companyId" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree"></tree-select>
                        </el-form-item>
                        <el-form-item label="总调拨车台数" prop="qut">
                            <el-input v-model="editForm.qut" clearable :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="预计总费用(元)" prop="totalCost">
                            <el-input v-model="editForm.totalCost" clearable :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人" prop="creater" v-if="editForm.creater">
                            <el-input v-model="editForm.creater" clearable :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间" prop="createTime" v-if="editForm.createTime">
                            <el-input v-model="editForm.createTime" clearable :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark" class="big">
                            <el-input type="textarea" v-model="editForm.remark" maxlength="200" placeholder="请输入备注" ></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="调拨车辆" name="2">
                    <el-button @click="addDetail()" type="primary" class="float-btn">新增</el-button>
                    <el-table class="left" :data="editForm.detail" style="width: 100%;margin-top: 10px" border>
                        <el-table-column fixed="right" label="操作" min-width="100">
                            <template slot-scope="{row,$index}">
                                <el-button @click="delDetail(row,$index)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="index" label="序号" min-width="70">
                            <template slot-scope="{row,$index}">
                                <span>{{$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="车型名称" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.vehicleModelInfoId'"
                                              :rules="{required: true, message: '请选择车型名称', trigger: 'change'}">
                                    <BrandSelect v-model="row.vehicleModelInfoId" level="2"></BrandSelect>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="所需车辆数" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.vehicleAmount'"
                                              :rules="[{required: true, message: '请输入所需车辆数', trigger: 'blur'},
                                                           {validator: formRule.standardSize, size:[1,1000], message: '请输入不大于1000的整数', trigger: 'blur'}]">
                                    <el-input v-model="row.vehicleAmount" @blur="getQut()"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="出发城市" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.depCitys'"
                                              :rules="{required: true, message: '请选择出发城市', trigger: 'change'}">
                                    <city-select-panel :value.sync="row.depCitys" ref="citySelect"
                                                       v-model="row.depCitys"></city-select-panel>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="预计调拨时间" min-width="220" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.transferTime'"
                                              :rules="{required: true, message: '请选择预计调拨时间', trigger: 'change'}">
                                    <el-date-picker type="datetime" placeholder="请选择预计调拨时间"
                                                    value-format="yyyy-MM-dd HH:mm:ss" v-model="row.transferTime"
                                                    clearable></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="调度前组织" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.depCompany'"
                                              :rules="{required: true, message: '请选择调度前组织', trigger: 'change'}">
                                    <tree-select v-model="row.depCompany" placeholder="请选择组织" type="one"
                                                 url="/admin/organization/companyTree"></tree-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="到达城市" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.arrivalCitys'"
                                              :rules="{required: true, message: '请选择到达城市', trigger: 'change'}">
                                    <city-select-panel :value.sync="row.arrivalCitys" ref="citySelect"
                                                       v-model="row.arrivalCitys"></city-select-panel>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="调度后组织" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.arrivalCompany'"
                                              :rules="{required: true, message: '请选择调度后组织', trigger: 'change'}">
                                    <tree-select v-model="row.arrivalCompany" placeholder="请选择组织" type="one"
                                                 url="/admin/organization/companyTree"></tree-select>
                                </el-form-item>
                            </template>


                        </el-table-column>
                        <el-table-column label="预计费用(元/车)" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.estimatedCost'"
                                              :rules="[
                                                    {required: true, message: '请输入预计费用', trigger: 'blur'},
                                                    {pattern: /(^[0-9]{1,8}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,8}\.[0-9]([0-9])?$)/, message: '整数最大8位，小数最大2位', trigger: 'blur'}
                                                    ]">
                                    <el-input type="number" v-model="row.estimatedCost" clearable maxlength="19"
                                              placeholder="请输入预计费用" @blur="getTotalCost()"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="调拨原因" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.reason'"
                                              :rules="{required: true, message: '请选择调拨原因', trigger: 'change'}">
                                    <el-select v-model="row.reason">
                                        <el-option
                                            v-for="reason in reasons"
                                            :key="reason.value"
                                            :label="reason.text"
                                            :value="reason.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否过户" min-width="200" label-class-name="required">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.isTransfer'"
                                              :rules="{required: true, message: '请选择是否过户', trigger: 'change'}">
                                    <el-select v-model="row.isTransfer">
                                        <el-option :key="1" label="是" :value="1"></el-option>
                                        <el-option :key="0" label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否送车" min-width="200">
                            <template slot-scope="{row,$index}">
                                <el-form-item :prop="'detail.'+$index+'.isSend'">
                                    <el-select v-model="row.isSend">
                                        <el-option :key="1" label="是" :value="1"></el-option>
                                        <el-option :key="0" label="否" :value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="left-row">
                <el-button type="primary" @click="submitForm()">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import BrandSelect from '@/components/BrandSelect/index'
    import CitySelectPanel from '@/components/CitySelect/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "demoForm",
        components: {TreeSelect, MoneyInput, UploadPanel, CitySelectPanel, BrandSelect},
        data() {
            return {
                openCollapse: ["1", "2"],
                show: false, //控制当前弹窗显示
                editForm: {
                    qut: 0,
                    totalCost: 0,
                    detail: []
                }, //表单数据
                editCompanys: [], //调拨前后
                reasons: [], //调拨原因
                modelNames: [], //车型
                vehileShow: false, //控制车辆弹窗显示
                /*listUrl: "core/transfer/vehicleList", //车辆列表接口*/
                rules: {
                },
                partsForm: {},
                formRule
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.partsForm.id = this.$route.query.id;
                //this.getVehicleModel();
                this.getUpdateData();
                this.init();
            },
            //数据初始化
            init() {
                var userInfo = this.getCurrentUserInfo();

                //获取调拨原因
                ajax.get("admin/dict/type/调拨原因").then(result => {
                    this.reasons = result;
                });
            },
            //查询车型信息
            getVehicleModel() {
                ajax.get("core/transfer/getVehicleModelList").then(result => {
                    if (result.status == 0) {
                        this.modelNames = result.data;
                    }
                });
            },
            //获取编辑页数据
            getUpdateData() {
                var id = this.partsForm.id;
                if (null == id || "" == id) {
                    return;
                }
                ajax.get("core/transfer/detail/" + id).then(result => {
                    if (result.status == 0) {
                        if (result.data.detail && result.data.detail.length > 0) {
                            for (var m in result.data.detail) {
                                result.data.detail[m].vehicleModelInfoId = result.data.detail[m].vehicleModelInfoId.split(",");
                                if (result.data.detail[m].depCompany) {
                                    this.$set(result.data.detail[m], "depCompany",[result.data.detail[m].depCompany]);
                                    /*result.data.detail[m].depCompany = [result.data.detail[m].depCompany];*/
                                }
                                if (result.data.detail[m].arrivalCompany) {
                                    result.data.detail[m].arrivalCompany = [result.data.detail[m].arrivalCompany];
                                }
                            }
                        }
                        if (result.data.companyId) {
                            result.data.companyId = [result.data.companyId];
                        }
                        this.editForm = result.data;
                    } else {
                        this.showMessage(result.message, "error");
                    }
                });
            },
            //添加详情数据
            addDetail() {
                this.editForm.detail.push({});
            },
            //计算调拨车辆数
            getQut() {
                var qut = 0;
                if (this.editForm.detail && this.editForm.detail.length > 0) {
                    this.editForm.detail.forEach((row) => {
                        if (null != row.vehicleAmount && "" != row.vehicleAmount && !isNaN(row.vehicleAmount)) {
                            qut += parseInt(row.vehicleAmount);
                        }
                    });
                }
                this.editForm.qut = qut;
            },
            //删除详情数据
            delDetail(row, index) {
                this.editForm.detail.splice(index, 1);
                this.getQut();
            },
            //获取预计总费用
            getTotalCost() {
                var totalCost = 0;
                if (this.editForm.detail && this.editForm.detail.length > 0) {
                    this.editForm.detail.forEach((row) => {
                        if (row.estimatedCost && !isNaN(row.estimatedCost) && row.vehicleAmount && !isNaN(row.estimatedCost)) {
                            totalCost += parseFloat(row.estimatedCost) * parseFloat(row.vehicleAmount);
                        }
                    });
                }
                this.editForm.totalCost = totalCost;
            },
            //保存数据
            submitForm() {
                this.$refs["editForm"].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (!this.editForm.detail || this.editForm.detail.length == 0) {
                        this.showMessage("调拨车辆不能为空", "error");
                        return false;
                    }
                    let param = Object.assign({}, this.editForm);
                    if (param.companyId && param.companyId.length>0) {
                        param.companyId = param.companyId[0];
                    } else {
                        this.showMessage("所属组织", "error");
                        return false;
                    }


                    for (let m in param.detail) {
                        if (param.detail[m].vehicleModelInfoId && param.detail[m].vehicleModelInfoId.length == 2) {
                            param.detail[m].vehicleModelInfoId = param.detail[m].vehicleModelInfoId[1];
                        } else {
                            this.showMessage("请选择车型名称", "error");
                            return false;
                        }

                        if (param.detail[m].arrivalCompany && param.detail[m].arrivalCompany.length>0) {
                            param.detail[m].arrivalCompany = param.detail[m].arrivalCompany[0];
                        } else {
                            this.showMessage("调度后分公司", "error");
                            return false;
                        }
                        if (param.detail[m].depCompany && param.detail[m].depCompany.length>0) {
                            param.detail[m].depCompany = param.detail[m].depCompany[0];
                        } else {
                            this.showMessage("调度前分公司", "error");
                            return false;
                        }

                    }


                    var id = this.partsForm.id;
                    var url = "";
                    if (null != id && '' != id) {
                        url = "core/transfer/update";
                    } else {
                        url = "core/transfer/insert";
                    }
                    ajax.post(url, param).then(result => {
                        if (result.status == 0) {
                            this.showMessage("保存成功", "success", () => {
                                this.close();
                                this.$emit('load');
                            });
                        } else {
                            this.showMessage(result.message, "error");
                        }
                    });
                });
            }
        }

    }
</script>

