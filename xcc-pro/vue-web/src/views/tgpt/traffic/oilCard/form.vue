<template>
    <div class="form-panel">
        <el-form :model="oilCardForm" :rules="rules" label-position="top" ref="oilCardForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="加油卡信息" name="1" >

                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree"
                                         @change="changeArrayItem"></tree-select>
                        </el-form-item>
                        <el-form-item label="加油卡号"  prop="code" >
                            <el-input v-model="oilCardForm.code" clearable  maxlength="50"></el-input>
                        </el-form-item>
                        <el-form-item label="油卡类型"  prop="type">
                            <el-select v-model="oilCardForm.type" placeholder="请选择油卡类型"  @change="changeType(oilCardForm.type)" clearable>
                                <el-option label="主卡" value="1"></el-option>
                                <el-option label="副卡" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="主卡" v-if="oilCardForm.type == 2"  prop="masterCardCode" >
                            <el-input :readonly = "true" v-model="oilCardForm.masterCardCode" clearable @focus="getOilCard()" placeholder="请选择主卡">
                                <el-button @click="getOilCard()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="能源企业"  prop="energyCompany">
                            <el-select v-model="oilCardForm.energyCompany" filterable clearable placeholder="请选择请选择能源企业">
                                <el-option v-for="e in suppliers" :key="e.value" :label="e.text"
                                           :value="e.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="到期日" prop="validDate">
                            <el-date-picker type="date" placeholder="请选择到期日" v-model="oilCardForm.validDate" value-format="yyyy-MM-dd" clearable></el-date-picker>
                        </el-form-item>
                        <el-form-item label="到期后处理方式" prop="expirationProcess">
                            <el-select v-model="oilCardForm.expirationProcess" clearable :disabled="expirationProcessDisabled">
                                <el-option label="销卡转入主卡" value="1"></el-option>
                                <el-option label="余额转出" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="持卡人" prop="cardholderUser" >
                            <el-input v-model="oilCardForm.cardholderUser" maxlength="10"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定车辆" v-if="oilCardForm.type == 2">
                            <el-input :readonly = "true" :disabled="!oilCardForm.companyId" v-model="oilCardForm.plate" clearable @focus="getVehicle()" placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="服务客户" v-if="oilCardForm.type == 2" prop="enterpriseName">
                            <el-input v-model="contractInfo.enterpriseName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号" v-if="oilCardForm.type == 2" prop="contractNo">
                            <el-input v-model="contractInfo.contractNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="项目订单" v-if="oilCardForm.type == 2" prop="orderNo">
                            <el-input v-model="contractInfo.orderNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="绑定车型" v-if="oilCardForm.type == 2" prop="vehicleModel">
                            <el-input v-model="oilCardForm.vehicleModel" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-item>

                <div class="left-row">
                    <el-button type="primary" @click="submitForm('oilCardForm')">保存</el-button>
                    <el-button @click="close()">返回</el-button>
                </div>
            </el-collapse>
        </el-form>

        <!-- 绑定车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="70%"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable />
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%" max-height="300" max-width="600%">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="vin" label="车驾号" min-width="140"></el-table-column>
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


        <!-- 加油卡弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择加油卡"
            :visible.sync="oilCardShow"
            width="800"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">加油卡号</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.code" placeholder="请输入加油卡号"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1);">查询</el-button>
                        <el-button type="small" @click="resetList();" size="small">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="120">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectOilCard(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="加油卡号" min-width="200"></el-table-column>
                        <el-table-column prop="type" sortable label="油卡类型" min-width="100"></el-table-column>
                        <el-table-column prop="energyCompany" sortable label="能源企业" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="balance" sortable label="油卡余额（元）" min-width="140"></el-table-column>
                        <el-table-column prop="cardholderUser" sortable label="持卡人" min-width="140"></el-table-column>
                        <el-table-column prop="companyName" sortable label="所属组织" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="plate" sortable label="绑定车辆" min-width="140"></el-table-column>
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
    import MoneyInput from '@/components/MoneyInput/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import { tool, ruleTool, formRule } from '@/utils/common'

    export default {
        mixins: [ tool, ruleTool ],
        name:"oilCardForm",
        components:{ TreeSelect, MoneyInput, UploadPanel },
        data(){
            return {
                oilCardForm:{},
                openCollapse:["1"],
                show:false,
                oilCardShow:false,
                vehicleShow:false,
                expirationProcessDisabled:false,
                enterprises:[],
                enterprise:{},
                suppliers:[],
                vehicles:[],
                organization:[],
                contractInfo:{},
                rules:{
                    code: [
                        { required: true, message: '请输入加油卡号', trigger: 'blur' },
                    ],
                    type: [
                        {  required: true, message: '请选择油卡类型', trigger: 'change' }
                    ],
                    energyCompany: [
                        {  required: true, message: '请选择能源企业', trigger: 'change' }
                    ],
                    /*cardholderUser: [
                        { required: true, message: '请输入持卡人', trigger: 'blur' ,maxlength:10 }
                    ],*/
                    masterCardCode: [
                        { required: true, message: '请选择主卡', trigger: 'change' }
                    ],
                    companyId:[
                        { required: true, message: '请选择组织', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            this.open();
        },
        methods:{
            open(){
                this.openCollapse = ["1"];
                let id = this.$route.query.id;
                if(id) {
                        ajax.get('base/oilCard/detail/' + id).then(rs => {
                            console.log(rs);
                            this.oilCardForm = rs.data;
                            this.organization.push(this.oilCardForm.companyId);
                        });
                }
                this.show = true;
                this.getSupplier();
            },
            selectEnterprise(query) {
                if(!query){
                    query = "";
                }
                ajax.get('base/oilCard/getEnterpriseSelect?name=' + query +'&companyId='+this.oilCardForm.companyId).then(rs => {
                    if (rs.length > 0) {
                        this.enterprises = rs;
                    }else{
                        this.enterprises = [];
                    }
                });
            },
            getAssociateContractInfo(id){
                ajax.get('base/oilCard/contractInfo?vehicleId='+id+'&companyId='+this.oilCardForm.companyId).then(rs => {
                    if (rs.status == 0) {
                        if(rs.data)
                            this.contractInfo = rs.data;
                        else
                            this.contractInfo = {};
                    }else{
                        this.$message.error("查询合同信息有误");
                    }
                });
            },
            getSupplier(){
                ajax.get('admin/dict/type/能源企业').then(rs => {
                    if (rs.length > 0) {
                        this.suppliers = rs;
                    }else{
                        this.suppliers = [];
                    }
                });
            },
            getVehicle(){
                if(null != this.oilCardForm.companyId && this.oilCardForm.companyId != ""){
                    this.listUrl = "base/oilCard/vehicleList?companyId="+this.oilCardForm.companyId;
                    this.resetList();
                    this.vehicleShow = true;
                }else{
                    this.$message.error("请选择所属组织");
                }

            },
            selectVehicle(row){
                this.contractInfo={};
                this.$set(this.oilCardForm,"plate",row.plate);
                this.$set(this.oilCardForm,"vehicleId",row.id);
                this.$set(this.oilCardForm,"vehicleModel",row.modelName);
                this.getAssociateContractInfo(row.id);
                this.vehicleShow = false;
            },
            getOilCard(){ //打开加油卡选择弹窗
                this.listUrl = "/base/oilCard/list?type=1&companyId="+this.oilCardForm.companyId;
                this.resetList();
                this.oilCardShow = true;
            },
            selectOilCard(row){ //选择加油卡
                this.$set(this.oilCardForm,"masterCardCode",row.code);
                this.$set(this.oilCardForm,"masterCard",row.id);
                this.oilCardShow = false;
            },
            submitForm(oilCardForm) {
                let data = this.extend(true,{},this.oilCardForm);
                let url = "";
                if(this.oilCardForm.id != null && this.oilCardForm.id != ""){
                    url = "base/oilCard/edit";
                }else{
                    url = "base/oilCard/add";
                }
                this.$refs[oilCardForm].validate((valid) => {
                    if (valid) {
                        ajax.post(url, data) .then(res => {
                            if(res.status == 0){
                                this.$message({message: '保存成功！',type: 'success'});
                                this.close();
                            }else {
                                this.$message.error(res.message);
                            }
                        });
                    }
                });
            },
            changeType(type){
                if(type == "1"){ //主卡
                    this.$set(this.oilCardForm,"expirationProcess","2");
                    this.expirationProcessDisabled = true
                }else{
                    this.$set(this.oilCardForm,"expirationProcess","1");
                    this.expirationProcessDisabled = false;
                }
            },
            //所属组织树组织选择
            changeArrayItem(data) {
                if(data && data.length==1){
                    this.$set(this.oilCardForm,"companyId",data[0].id);
                }else{
                    this.$set(this.oilCardForm,"companyId","");
                    this.$set(this.oilCardForm,"plate","");
                    this.$set(this.oilCardForm,"vehicleId","");
                }
            }
        }
    }
</script>

