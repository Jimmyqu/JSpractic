<template>
    <div class="form-panel">
        <el-form :model="oilCardForm" :rules="rules" label-position="top" ref="oilCardForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="绑定车辆" name="1" >

                    <div class="flex-panel">
                        <el-form-item label="加油卡号"  prop="code" >
                            <el-input v-model="oilCardForm.code" clearable  maxlength="50" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="油卡余额" >
                            <el-input v-model="oilCardForm.balance" disabled>
                                <template slot="append">¥</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="油卡类型"  prop="type" >
                            <el-select v-model="oilCardForm.type" placeholder="请选择油卡类型" clearable disabled>
                                <el-option label="主卡" value="1"></el-option>
                                <el-option label="副卡" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="主卡" v-if="oilCardForm.type == 2"  prop="masterCardCode" >
                            <el-input v-model="oilCardForm.masterCardCode" clearable disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="能源企业"  prop="supplierName">
                            <el-input v-model="oilCardForm.energyCompanyName" clearable disabled>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="有效期" prop="validDate">
                            <el-date-picker type="date" placeholder="请选择有效期" v-model="oilCardForm.validDate" value-format="yyyy-MM-dd" clearable disabled></el-date-picker>
                        </el-form-item>
                        <el-form-item label="到期后处理方式" prop="expirationProcess">
                            <el-select v-model="oilCardForm.expirationProcess" clearable disabled>
                                <el-option label="销卡转入主卡" value="1"></el-option>
                                <el-option label="余额转出" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="持卡人" prop="cardholderUser" >
                            <el-input v-model="oilCardForm.cardholderUser" disabled></el-input>
                            <!--<el-select v-model="oilCardForm.cardholderUserId"  disabled placeholder="请选择持卡人" clearable filterable remote :remote-method="selectCardholderUser" @click.native="selectCardholderUser()">
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>-->
                        </el-form-item>

                        <el-form-item label="所属组织" prop="branchCompany">
                            <el-input v-model="oilCardForm.companyName" disabled></el-input>
                        </el-form-item>
                        <!--<el-form-item label="服务客户" prop="enterpriseName">
                            <el-input v-model="oilCardForm.enterpriseName" disabled></el-input>
                        </el-form-item>-->
                        <el-form-item label="绑定车辆" prop="plate" >
                            <el-input :readonly = "true" v-model="oilCardForm.plate" clearable @focus="getVehicle()" placeholder="请选择车辆">
                                <el-button @click="getVehicle()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="服务客户" prop="enterpriseName">
                            <el-input v-model="contractInfo.enterpriseName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="合同编号" prop="contractNo">
                            <el-input v-model="contractInfo.contractNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="项目订单" prop="orderNo">
                            <el-input v-model="contractInfo.orderNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="绑定车型" prop="vehicleModel">
                            <el-input v-model="oilCardForm.vehicleModel" disabled></el-input>
                        </el-form-item>
                        <!--<el-form-item label="绑定车型" prop="vehicleModel">
                            <el-input v-model="oilCardForm.vehicleModel" disabled></el-input>
                        </el-form-item>-->
                    </div>
                </el-collapse-item>

            </el-collapse>

            <div  class="left-row">
                <el-button type="primary" @click="submitForm('oilCardForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <!-- 绑定车辆弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="选择车辆"
            :visible.sync="vehicleShow"
            width="800"
            append-to-body
            :close-on-click-modal="false">
            <div class="list-panel">
                <div class="row form-horizontal search-box">
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
                <div class="row">
                    <el-table border :data="list" style="width: 100%" max-height="300">
                        <el-table-column label="操作" width="100">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="selectVehicle(row)">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="plate" label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="modelName" label="车型" min-width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="vin" label="车身号" min-width="140"></el-table-column>
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

    export default {
        mixins: [ tool, ruleTool ],
        name:"trafficOilCardBinding",
        data(){
            return {
                oilCardForm:{},
                openCollapse:["1"],
                bindingShow:false,
                vehicleShow:false,
                contractInfo:{},
                users:[],
                rules:{
                    plate: [
                        { required: true, message: '请选择绑定车辆', trigger: 'change' },
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
                this.bindingShow = true;
                this.selectCardholderUser();
                this.initData();
            },
            initData(){
                ajax.get('/base/oilCard/detail/' + this.$route.query.id).then(rs => {
                    console.log(rs);
                    this.oilCardForm = rs.data;
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
            selectCardholderUser(query){ //获取所有用户
                if(!query){
                    query = "";
                }
                ajax.get('base/oilCard/getUserSelect?name=' + query +'&time=' + new Date().getTime()).then(rs => {
                    if (rs.length > 0) {
                        this.users = rs;
                    }else{
                        this.users = [];
                    }

                });
            },
            getVehicle(){
                this.listUrl = "base/oilCard/vehicleList?companyId="+this.oilCardForm.companyId;
                this.resetList();
                this.vehicleShow = true;
            },
            selectVehicle(row){
                this.$set(this.oilCardForm,"plate",row.plate);
                this.$set(this.oilCardForm,"vehicleId",row.id);
                this.$set(this.oilCardForm,"vehicleModel",row.modelName);
                this.getAssociateContractInfo(row.id);
                this.vehicleShow = false;
            },
            submitForm(oilCardForm) {
                let url = "base/oilCard/binding";
                let data = {
                    id : this.oilCardForm.id,
                    vehicleId : this.oilCardForm.vehicleId
                };
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
                    } else {
                        return false;
                    }
                });
            }
        },
    }
</script>
