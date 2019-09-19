<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="设备库存" name="1">
                    <div class="flex-panel">
                        <el-form-item label="产品型号" prop="equipmentName">
                            <el-select v-model="addForm.equipmentName" @change="changeModal" clearable placeholder="请选择产品型号">
                                <el-option v-for="item in equipmentModalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="销售人" prop="salesPerson">
                            <el-input v-model="addForm.salesperson"  maxlength=20 placeholder="请输入销售人" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="数量" prop="quantity">
                            <el-input v-model="addForm.quantity" :rules="[rules.int()]" maxlength=10 placeholder="请输入数量" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="金额" prop="amount">
                            <money-input v-model="addForm.amount" :rules="[rules.money()]"  placeholder="请输入金额" unit="元" clearable></money-input>
                        </el-form-item>
                        <el-form-item label="产品类型" prop="equipmentType">
                            <el-select v-model="addForm.equipmentType" disabled>
                                <el-option label="OBD" :value="1" :key="1"></el-option>
                                <el-option label="GPS" :value="2" :key="2"></el-option>
                                <el-option label="SIM" :value="3" :key="3"></el-option>
                                <el-option label="无线设备" :value="4" :key="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="供应商" prop="supplier">
                            <el-input v-model="addForm.supplier"  disabled></el-input>
                        </el-form-item>
                        <el-form-item label="发货人" prop="sender">
                            <el-input v-model="addForm.sender"  maxlength=20 placeholder="请输入发货人" clearable></el-input>
                        </el-form-item>
                       <!-- <el-form-item label="客户" prop="organizationId">
                            <tree-select v-model="addForm.organizationId" placeholder="请选择客户" type="one"
                                         url="admin/organization/tree?noManager=noManager" @change="changeArrayItem"></tree-select>
                        </el-form-item>-->
                        <el-form-item label="管理公司" label-width="120px" prop="organizationId">
                            <el-select v-model="addForm.organizationId" filterable >
                                <el-option v-for="(item,index) in companys" :key="index"
                                           :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收货人" prop="receiver">
                            <el-input v-model="addForm.receiver"  maxlength=20 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="addForm.phone"  maxlength=11 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号" prop="contractCode">
                            <el-input v-model="addForm.contractCode"  maxlength=20 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="合同开始日期" prop="contractStartdate">
                            <el-date-picker type="date" v-model="addForm.contractStartdate"  maxlength=10 placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同结束日期" prop="contractEnddate">
                            <el-date-picker type="date" v-model="addForm.contractEnddate"  maxlength=10 placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="收货地址" prop="address">
                            <el-input v-model="addForm.address"  maxlength=200 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="发货方式" prop="logisticsType">
                            <el-select v-model="addForm.logisticsType" clearable placeholder="请选择发货方式">
                                <el-option label="供应商直发" :value="1" :key="1"></el-option>
                                <el-option label="我司直发" :value="2" :key="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流单号" prop="logisticsCode">
                            <el-input v-model="addForm.logisticsCode"  maxlength=40 placeholder="请输入" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="物流公司" prop="logisticsCompany">
                            <el-select v-model="addForm.logisticsCompany"  clearable placeholder="请选择物流公司">
                                <el-option v-for="item in logisticsCompanyList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                                   :append-to-body="true" width="600px">
                            <el-form label-position="top" >
                        <el-form-item prop="filePath" v-show="fileUpload">
                            <UploadSubmit ref="uploadSubmit"
                                          :url="'base/baseEquipmentOutput/import?type='+type"
                                          name="file" @upload="returnData">
                        <span class="info-text">
                            提示：请确保文件的格式与 "导入模板" 的格式一致。
                            <a v-if="type == 1" href="static/excelTemplate/OBD出库导入模板.xls">下载OBD导入模板</a>
                            <a v-if="type == 2" href="static/excelTemplate/SIM卡出库导入模板.xls">下载SIM卡导入模板</a>
                            <a v-if="type == 4" href="static/excelTemplate/OBD出库导入模板.xls">下载无线导入模板</a>
                            <br>支持扩展名：.xls和.xlsx
                            <br>文件大小：20M以内
                        </span>
                            </UploadSubmit>
                        </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="importVisible = false">取 消</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="importEquipment()">导入设备</el-button>
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>

            <p class="summary" v-show="showTotal"><span style="margin-left: 20px;">设备数量:</span><span>{{totalQuantity}}</span></p>
            <el-table border :data="tableData" style="width: 100%">
                <template v-if="type==1">
                    <el-table-column min-width="140" label="IMEI" prop="IMEI" show-overflow-tooltip></el-table-column>
                </template>
                <template v-if="type==2">
                    <el-table-column min-width="140" label="手机号" prop="phone" show-overflow-tooltip></el-table-column>
                </template>
            </el-table>

        </el-form>

    </div>
</template>

<script>
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import UploadSubmit from '@/components/UploadSubmit'
    import ajax from '@/utils/request'
    import {tool, ruleTool,formRule } from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "baseEquipmentOutputAdd",
        components: {TreeSelect, CitySelect, MoneyInput,UploadSubmit},
        data() {
            return {
                totalQuantity:"",
                showTotal:false,
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
                type:"",
                activeNames: ['0', '1'],
                addressList: [{id: 1, name: 1}, {id: 2, name: 2}],
                equipmentModalList:[],
                logisticsCompanyList:[],
                tableData:[],
                addForm: {},
                companys: [],
                rules: {
                    equipmentName: [
                        { required: true, message: '请选择产品型号', trigger:'change'},
                    ],
                    organizationId: [
                        { required: true, message: '请选择管理公司', trigger: 'change'},
                    ],
                    quantity: [
                        { required: true, message: '请输入数量', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { validator:formRule.isMobilePhone,message:'电话号格式有误',trigger:'blur'}
                    ],
                    address: [
                        { required: true, message: '请输入收货地址', trigger: 'blur' },
                    ],
                },
            }
        },
        mounted() {
            //this.open();
            this.getCompanys();
            this.getEquipmentModalList();
            this.getLogisticsCompany();

        },
        methods: {
            /*open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('base//baseEquipmentStorage/' + this.$route.query.id).then(rs => {
                        this.addForm = rs.data;
                    });
                }
            },*/
            getCompanys() {
                ajax.get('admin/organization/managerCompany').then(result => {
                    if (this.checkResponse(result)) {
                        this.companys = result.data;
                    } else {
                        this.companys = [];
                    }
                });
            },
            importEquipment(){
                if(this.addForm.equipmentName){
                    this.importVisibleErrorId = "";
                    this.importVisible = true;
                    this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
                }else{
                    this.$message.error('请先选择产品型号');
                    return;
                }
            },
            returnData(result){
                this.showTotal=true;
                this.tableData=result.data;
                this.totalQuantity = result.importTotal;
                console.log(result);
            },
            changeModal(e){
                for(var m in this.equipmentModalList){
                    if(e==this.equipmentModalList[m].id){
                        this.addForm.supplier=this.equipmentModalList[m].supplier;
                        this.addForm.equipmentType=this.equipmentModalList[m].type;
                        if(this.equipmentModalList[m].type && (this.equipmentModalList[m].type==1 || this.equipmentModalList[m].type==2))
                            this.type='1';
                        else if(this.equipmentModalList[m].type && (this.equipmentModalList[m].type==3))
                            this.type='2';
                        else if(this.equipmentModalList[m].type && (this.equipmentModalList[m].type==4))
                            this.type='1';
                        break;
                    }
                }
            },
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    /*if(data.organizationId)
                        data.organizationId=data.organizationId[0];*/
                    if(this.tableData && this.tableData.length>0) {
                        var arr=[];
                        for(var t in this.tableData){
                            if(this.type=='1')
                                arr.push(this.tableData[t].IMEI);
                            if(this.type=='2')
                                arr.push(this.tableData[t].phone);
                        }
                        data.imeiList=arr;
                    }else{
                        this.$message.error('请导入设备');
                        return;
                    }
                    if(this.addForm.quantity != data.imeiList.length){
                        this.$message.error('导入设备数量必须和数量相等，请重新导入！');
                        return;
                    }
                    ajax.post('base/baseEquipmentOutput/save', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '出库成功',
                                type: 'success'
                            });
                            this.close();
                        }else{
                            this.$message({
                                message: rs.msg,
                                type: 'error'
                            });
                        }
                    });
                });
            },
            getEquipmentModalList(){
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equipmentModalList=res;
                });
            },
            getLogisticsCompany(){
                ajax.get('admin/dict/type/物流公司').then(res=>{
                    this.logisticsCompanyList=res;
                })
            },
            changeArrayItem(){}

        }
    }
</script>
