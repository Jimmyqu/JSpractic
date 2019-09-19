<template>
    <div class="form-panel">
        <el-form :model="vehicleForm" :rules="rules" label-position="top" ref="vehicleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="绑定司机" name="1">

                    <div class="flex-panel">
                        <el-form-item label="车牌" prop="plate">
                            <el-input v-model="vehicleForm.plate" clearable maxlength="50" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车架号" prop="vin">
                            <el-input v-model="vehicleForm.vin" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="服务组织" prop="companyName">
                            <el-input v-model="vehicleForm.companyName" :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="所属组织" prop="providerCompany">
                            <el-input v-model="vehicleForm.providerCompany" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="发动机号" prop="engineNo">
                            <el-input v-model="vehicleForm.engineNo" clearable :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="行驶证号" prop="licenseNumber">
                            <el-input v-model="vehicleForm.licenseNumber" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定司机" prop="name">
                            <el-input :readonly="true" v-model="vehicleForm.name" clearable @focus="getDriver()"
                                      placeholder="请选择司机">
                                <el-button @click="getDriver()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('vehicleForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <!-- 绑定司机弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择司机"
            :visible.sync="driverShow"
            width="1400"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">姓名</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" placeholder="请输入司机姓名" clearable/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">手机号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.phone" placeholder="请输入手机号" clearable/>
                            </div>
                        </div>
                        <!--<div class="form-group">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <tree-select v-model="companyId" placeholder="请选择组织" type="one"
                                             url="/admin/organization/tree"></tree-select>
                            </div>
                        </div>-->
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"
                                   @click="handleCurrentChange(1);">查询
                        </el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectDriver(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
                        <el-table-column prop="phone" sortable label="手机号" min-width="120"></el-table-column>
                        <el-table-column prop="companyName" sortable label="所属组织" show-overflow-tooltip min-width="140"></el-table-column>
                        <el-table-column prop="driverNo" sortable label="驾驶证号" min-width="140"></el-table-column>
                    </el-table>
                    <!-- 分页 -->
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
    import ajax from '@/utils/request'
    import TreeSelect from '@/components/TreeSelect/index'
    import {tool, ruleTool, formRule} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        components: { TreeSelect },
        name: "vehicleDriverBinding",
        data() {
            return {
                vehicleForm: {},
                openCollapse: ["1"],
                driverShow: false,
                companys: [],
                companyId:[],
                rules: {
                    plate: [
                        {required: true, message: '请选择绑定车辆', trigger: 'change'},
                    ],name: [
                        {required: true, message: '请选择绑定司机', trigger: 'change'},
                    ]
                }
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.openCollapse = ["1"];
                //this.getCompanys();
                this.initData();
            },
            /*getCompanys() {
                this.companys = this.getCurrentUserInfo().organizationList;
            },*/
            initData() {
                ajax.get('/base/baseVehicleDriverBinding/detail/' + this.$route.query.id).then(rs => {
                    console.log(rs);
                    this.vehicleForm = rs.data;
                });
            },
            getDriver() {
                this.listUrl = "base/baseVehicleDriverBinding/driverList?companyId=" + this.vehicleForm.companyId;
                this.resetList();
                this.driverShow = true;
            },
            selectDriver(row) {
                this.$set(this.vehicleForm, "name", row.name);
                this.$set(this.vehicleForm, "driverId", row.id);
                this.driverShow = false;
            },
            submitForm(vehicleForm) {
                let url = "base/baseVehicleDriverBinding/binding";
                let data = {
                    driverId: this.vehicleForm.driverId,
                    vehicleId: this.vehicleForm.id,
                    bindStatus: 1
                };
                this.$refs[vehicleForm].validate((valid) => {
                    if (valid) {
                        ajax.post(url, data).then(res => {
                            if (res.status == 0) {
                                this.$message({message: '保存成功！', type: 'success'});
                                this.close();
                            } else {
                                this.$message({message:res.msg, type: 'error'});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            getListBefore(params){
                /*params.companyId=this.companyId[0]*/
            }
        },
    }
</script>
