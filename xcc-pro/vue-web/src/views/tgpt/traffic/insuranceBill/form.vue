<template>
    <div class="form-panel">
        <el-form :model="insuranceBillForm" :rules="rules" label-position="top" ref="insuranceBillForm" label-width="100px">
            <el-collapse v-model="openCollapse">

                <el-collapse-item title="车辆保险单信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="服务组织" prop="companyId">
                            <tree-select v-model="insuranceBillForm.companyId" placeholder="请选择服务组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeArrayItem"></tree-select>
                        </el-form-item>
                        <el-form-item label="车辆"  prop="vin" :rules="rules.required('请选择车辆')">
                            <el-input :readonly = "true" v-model="insuranceBillForm.vin" clearable @focus="getVehicle()" placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="车型" prop="vehicleModel">
                            <el-input v-model="insuranceBillForm.vehicleModel" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="车牌" prop="vehiclePlate">
                            <el-input v-model="insuranceBillForm.vehiclePlate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="发动机号" prop="engineNo">
                            <el-input v-model="insuranceBillForm.engineNo" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="行驶证车主" prop="licenseName">
                            <el-input v-model="insuranceBillForm.licenseName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="保险公司"  prop="insuranceCompany" :rules="rules.required('请选择保险公司')">
                            <el-input :readonly = "true" v-model="insuranceBillForm.insuranceCompany" clearable @focus="getSupplier()" placeholder="请选择保险公司">
                                <el-button @click="getSupplier()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                           <!-- <el-input :readonly = "true" :disabled="!insuranceBillForm.companyId" v-model="insuranceBillForm.insuranceCompany" clearable @focus="getInsuranceCompany()" placeholder="请选择保险公司">
                                <el-button @click="getInsuranceCompany()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>-->
                        </el-form-item>
                        <el-form-item label="保险类" prop="insuranceType" :rules="rules.required('请选择保险类')">
                            <el-select v-model="insuranceBillForm.insuranceType" placeholder="请选择保险类">
                                <el-option label="机动车辆商业保险" :value="1"></el-option>
                                <el-option label="机动车交通事故责任强制保险" :value="2"></el-option>
                                <el-option label="车船税" :value="3"></el-option>
                                <el-option label="承运险" :value="4"></el-option>
                                <el-option label="车辆被盗险" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签约保费" prop="insuranceCost">
                            <money-input v-model="insuranceBillForm.insuranceCost"  clearable @keyup.native="onlyDecNum($event,'insuranceCost')" placeholder="请输入签约保费" unit="元"></money-input>
                            <!--<el-input v-model="insuranceBillForm.insuranceCost" clearable ></el-input>-->
                        </el-form-item>
                        <el-form-item label="保单号" prop="policyNumber" :rules="rules.required('请输入保单号')">
                            <el-input v-model="insuranceBillForm.policyNumber" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="保单业务员" prop="policySalesman">
                            <el-input v-model="insuranceBillForm.policySalesman" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="insuranceBillForm.phone" clearable  maxlength="11" ></el-input>
                        </el-form-item>
                        <el-form-item label="投保日期" prop="insuredDate" :rules="rules.required('请选择投保日期')">
                            <el-date-picker v-model="insuranceBillForm.insuredDate" placeholder="请选择投保日期" :picker-options="pickerOptions0" value-format="yyyy-MM-dd" type="date" ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="到期日" prop="expiryDate" :rules="rules.required('请选择到期日')">
                            <el-date-picker v-model="insuranceBillForm.expiryDate"  :picker-options="pickerOptions1"  value-format="yyyy-MM-dd"  type="date" placeholder="请选择到期日" ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="购买类型" prop="buyType" :rules="rules.required('请选择购买类型')">
                            <el-select v-model="insuranceBillForm.buyType" placeholder="请选择购买类型">
                                <el-option label="新增" :value="1"></el-option>
                                <el-option label="续保" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发票抬头" prop="invoiceTitle">
                            <el-input v-model="insuranceBillForm.invoiceTitle" clearable  maxlength="50" ></el-input>
                        </el-form-item>
                        <el-form-item label="备注" class="big" prop="remarks" >
                            <el-input type="textarea" v-model="insuranceBillForm.remarks" maxlength="50" placeholder="请输入备注" ></el-input>
                        </el-form-item>
                        <el-form-item class="big" label="上传保险单明细">
                            <upload-panel :size="5" accept=".jpg,.jpeg,.png,.gif,.bmp" :file-list.sync="pics"
                                          :show-img="true"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div  class="left-row">
                <el-button type="primary" @click="submitForm('insuranceBillForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <!-- 绑定车辆弹窗 -->
        <el-dialog
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="70%"
            append-to-body
            :close-on-click-modal="false">
            <div class="wrapper wrapper-content  fadeInRight list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">车型</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                            </div>
                        </div>
                       <!-- <div class="form-group">
                            <label class="control-label">注册城市</label>
                            <div class="input-group">
                                <el-input  type="text" v-model="searchParam.registerCityName" placeholder="请输入注册城市" autocomplete="off" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">经营城市</label>
                            <div class="input-group">
                                <el-input type="text" v-model="searchParam.runCityName" placeholder="请输入经营城市" autocomplete="off" />
                            </div>
                        </div>-->
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vin" label="车架号" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="serviceRegion" sortable label="服务组织" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="140" show-overflow-tooltip></el-table-column>
                       <!-- <el-table-column prop="registerCityName" sortable label="注册城市" min-width="100"></el-table-column>
                        <el-table-column prop="runCityName" sortable label="经营城市" min-width="100"></el-table-column>-->
                        <el-table-column prop="colorName" sortable label="颜色" min-width="80"></el-table-column>
                        <el-table-column prop="licenseName" sortable label="行驶证车主" min-width="140"></el-table-column>
                        <el-table-column prop="vehicleStatusText" sortable label="车辆状态" min-width="100"></el-table-column>
                        <el-table-column prop="plateType" sortable label="车辆来源" min-width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.plateType == 1">自建</span>
                                <span v-if="scope.row.plateType == 2">外部</span>
                            </template>
                        </el-table-column>

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

        <!-- 保险公司弹窗 -->
        <el-dialog
            title="选择保险公司"
            :visible.sync="supplierShow"
            width="70%"
            append-to-body
            :close-on-click-modal="false">
            <div class="wrapper wrapper-content  fadeInRight list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">公司名称</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.name" clearable placeholder="请输入公司名称"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectSupplier(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="公司名称" min-width="140" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="contact" label="联系人" min-width="140" sortable></el-table-column>
                        <el-table-column prop="contactPhone" label="联系电话" min-width="120" sortable></el-table-column>
                        <el-table-column prop="address" label="地址" min-width="140" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column prop="businessDescription" label="主要业务描述" min-width="120" sortable></el-table-column>
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
    import { tool, ruleTool, formRule } from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import MoneyInput from '@/components/MoneyInput/index'
    import $ from 'jquery-slim'

    export default {
        mixins: [ tool, ruleTool ],
        name:"insuranceBillForm",
        components: { TreeSelect ,UploadPanel,MoneyInput},
        data(){
            return {
                insuranceBillForm:{
                },
                openCollapse:["1","2","3"],
                show:false,
                vehicleShow:false,
                supplierShow:false,
                //insuranceCompanyShow:false,
                pics: [],
                formRule,
                rules:{
                    companyId: [
                        {required: true, message: "请选择服务组织", trigger: "change"},
                    ],
                    /*phone: [
                        {required: true, message: "请输入联系电话", trigger: "blur"},
                        {validator: formRule.isMobilePhone, message: "手机号码格式有误", trigger: "blur"}
                    ],*/
                    insuranceCost: [
                        {required: true, message: "请输入签约保费", trigger: "blur"},
                        { validator: formRule.validateNumber, trigger:'blur'}
                    ],
                },  pickerOptions0: {
                    disabledDate: (time) => {
                        if (this.insuranceBillForm.expiryDate != "") {
                            return time.getTime() > new Date(this.insuranceBillForm.expiryDate).getTime()
                        }

                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        if(this.insuranceBillForm.insuredDate){
                            return time.getTime() < new Date(this.insuranceBillForm.insuredDate).getTime();
                        }
                    }
                }

            }
        },
        mounted(){
            this.open();
        },
        methods:{
            open(){
                this.openCollapse = ["1","2","3"];
                let id = this.$route.query.id;
                if(id) {
                    ajax.get('/core/insuranceBill/detail/' + id).then(rs => {
                        console.log(rs);
                        this.insuranceBillForm = rs.data;
                        this.insuranceBillForm.companyId = [this.insuranceBillForm.companyId];
                        if(null != rs.data.detailPic && rs.data.detailPic.length > 0){
                            this.pics = JSON.parse(rs.data.detailPic);
                        }
                    });
                }
                this.show = true;
            },
            getVehicle(){
                debugger
                if(this.insuranceBillForm.companyId!=null && this.insuranceBillForm.companyId!=undefined
                    && this.insuranceBillForm.companyId.length>0 && this.insuranceBillForm.companyId[0] != ""){
                    this.listUrl = "core/insuranceBill/vehicleList?companyId="+this.insuranceBillForm.companyId[0];
                }else{
                    this.listUrl = "core/insuranceBill/vehicleList";
                }
                this.resetList();
                this.vehicleShow = true;
            },
            selectVehicle(row){
                this.$set(this.insuranceBillForm,"vehiclePlate",row.plate);
                this.$set(this.insuranceBillForm,"vehicleId",row.id);
                this.$set(this.insuranceBillForm,"vehicleModel",row.modelName);
                this.$set(this.insuranceBillForm,"vin",row.vin);
                this.$set(this.insuranceBillForm,"engineNo",row.engineNo);
                this.$set(this.insuranceBillForm,"licenseName",row.licenseName);
                this.$set(this.insuranceBillForm,"providerCompanyId",row.companyId);
                if(this.insuranceBillForm.companyId == null || this.insuranceBillForm.companyId == undefined
                    || this.insuranceBillForm.companyId.length == 0 || this.insuranceBillForm.companyId[0] == ""){
                    this.insuranceBillForm.companyId = [row.companyId];
                }
                this.vehicleShow = false;
            },
            getSupplier(){
                this.listUrl = "core/insuranceBill/insuranceCompanyList?companyId="+this.insuranceBillForm.companyId;
                this.resetList();
                this.supplierShow = true;
            },
            selectSupplier(row){
                this.$set(this.insuranceBillForm,"insuranceCompanyId",row.id);
                this.$set(this.insuranceBillForm,"insuranceCompany",row.name);
                this.supplierShow = false;
            },
           /* getInsuranceCompany(){
                this.listUrl="core/insuranceBill/insuranceCompanyList?companyId="+this.insuranceBillForm.companyId;
                this.resetList();
                this.insuranceCompanyShow = true;
            },
            selectInsuranceCompany(row){
                this.$set(this.insuranceBillForm,"insuranceCompanyId",row.id);
                this.$set(this.insuranceBillForm,"insuranceCompany",row.name);
                this.insuranceCompanyShow = false;
            },*/
            changeArrayItem(data) {
                if (!data || data.length == 0){
                    this.$set(this.insuranceBillForm,"vehiclePlate","");
                    this.$set(this.insuranceBillForm,"vehicleId","");
                    this.$set(this.insuranceBillForm,"vehicleModel","");
                    this.$set(this.insuranceBillForm,"vin","");
                    this.$set(this.insuranceBillForm,"engineNo","");
                    this.$set(this.insuranceBillForm,"licenseName","");
                    this.$set(this.insuranceBillForm,"insuranceCompanyId","");
                    this.$set(this.insuranceBillForm,"insuranceCompany","");
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
            onlyDecNum(e,val) {
                console.log(e);
                $(e.target).val($(e.target).val().replace(/[^\d|\.]/g,""));
                this.$set(this.insuranceBillForm,val,$(e.target).val());
            },
            submitForm(insuranceBillForm) {
                let data = this.extend(true,{},this.insuranceBillForm);
                data.companyId = data.companyId.join();
                if(data.insuranceCost){
                    data.insuranceCost = data.insuranceCost.replace(new RegExp(/,/g),'');
                }
                this.$refs[insuranceBillForm].validate((valid) => {
                    if (valid) {
                        if (this.pics.length > 0)//转换图片
                        {
                            data.detailPic = JSON.stringify(this.pics);
                        }
                        /*if (this.pics.length > 0)//转换图片
                        {
                            data.detailPic = JSON.stringify(this.pics);
                        }else{
                            this.$message.error("请上传保险单明细");
                            return;
                        }*/
                        let url = "";
                        if(this.insuranceBillForm.id != null && this.insuranceBillForm.id != ""){
                            url = "core/insuranceBill/edit";
                        }else{
                            url = "core/insuranceBill/add";
                        }
                        ajax.post(url, data) .then(res => {
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close(insuranceBillForm);
                            }else {
                                this.$message.error(res.message);
                            }
                        });

                    }
                });
            },
        },

    }
</script>

