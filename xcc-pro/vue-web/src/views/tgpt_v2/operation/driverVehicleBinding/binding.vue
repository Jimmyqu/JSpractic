<template>
    <div class="form-panel">
        <el-form :model="vehicleForm" :rules="rules" label-position="top" ref="vehicleForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="绑定车辆" name="1">

                    <div class="flex-panel">
                        <el-form-item label="司机姓名" prop="name">
                            <el-input v-model="vehicleForm.name"  disabled></el-input>
                        </el-form-item>
                        <el-form-item label="司机手机号" prop="phone">
                            <el-input v-model="vehicleForm.phone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="organizationName">
                            <el-input v-model="vehicleForm.organizationName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="服务城市" prop="serviceCity">
                            <el-input v-model="vehicleForm.serviceCity" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="绑定车辆" prop="plate">
                            <el-input :readonly="true" v-model="vehicleForm.plate" @focus="getVehicle()"
                                      placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车型" prop="vehicleModelInfoName">
                            <el-input v-model="vehicleForm.vehicleModelInfoName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="颜色" prop="colorText">
                            <el-input v-model="vehicleForm.colorText" disabled></el-input>
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
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="1400"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车辆</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.vehicle" placeholder="请输入车牌号/车型" clearable/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">绑定状态</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.bindStatus" placeholder="不限">
                                    <el-option label="已绑定" value="1"></el-option>
                                    <el-option label="未绑定" value="2"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small"
                                   @click="handleCurrentChange(1)">查询
                        </el-button>
                        <el-button type="small" @click="resetList()" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectDriver(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌号" min-width="140"></el-table-column>
                        <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="120"></el-table-column>
                        <el-table-column prop="colorText" sortable label="颜色" show-overflow-tooltip min-width="140"></el-table-column>
                        <el-table-column prop="bindStatusText" sortable label="绑定状态" min-width="140"></el-table-column>
                        <el-table-column prop="driverName" sortable label="绑定司机" min-width="140"></el-table-column>
                        <el-table-column prop="driverPhone" sortable label="司机手机号" min-width="140"></el-table-column>
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
        name: "driverVehicleBinding",
        data() {
            return {
                vehicleForm: {},
                openCollapse: ["1"],
                vehicleShow: false,
                companys: [],
                companyId:[],
                rules: {
                    plate: [
                        {required: true, message: '请选择绑定车辆', trigger: 'change'},
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
                this.initData();
            },
            initData() {
                ajax.get('/operation_base/driverVehicleBinding/driverInfo/' + this.$route.query.id).then(rs => {
                    console.log(rs);
                    this.vehicleForm = rs.data;
                });
            },
            getVehicle() {
                this.listUrl = "operation_base/driverVehicleBinding/vehicleList?organizationId=" + this.vehicleForm.companyId;
                this.resetList();
                this.vehicleShow = true;
            },
            selectDriver(row) {
                debugger
                this.$set(this.vehicleForm, "plate", row.plate);
                this.$set(this.vehicleForm, "vehicleId", row.id);
                this.$set(this.vehicleForm, "vehicleModelInfoName", row.vehicleModelInfoName);
                this.$set(this.vehicleForm, "colorText", row.colorText);
                this.vehicleShow = false;
            },
            submitForm(vehicleForm) {
                debugger
                let url = "operation_base/driverVehicleBinding/bind";
                let data = {
                    driverId: this.vehicleForm.id,
                    vehicleId: this.vehicleForm.vehicleId,
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
