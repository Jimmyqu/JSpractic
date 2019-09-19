<template>
    <div class="form-panel">
        <el-form :model="oilCardRechargeForm" :rules="rules" label-position="top" ref="oilCardRechargeForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <el-collapse-item title="油卡充值记录" name="1">
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="companyId">
                            <tree-select v-model="oilCardRechargeForm.companyId" placeholder="请选择所属组织" type="one"
                                         url="admin/organization/tree?noManager=noManager"
                                         @change="changeArrayItem"></tree-select>
                        </el-form-item>
                        <el-form-item label="加油卡" prop="oilCardCode">
                            <el-input :readonly = "true" :disabled="!oilCardRechargeForm.companyId" v-model="oilCardRechargeForm.oilCardCode" clearable @focus="getOilCard()" placeholder="请选择加油卡">
                                <el-button @click="getOilCard()" slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="油卡类型" >
                            <el-select v-model="oilCardRechargeForm.oilCardType" placeholder="请选择油卡类型" :disabled="true">
                                <el-option label="主卡" value="1"></el-option>
                                <el-option label="副卡" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="充值人" prop="rechargerId">
                            <el-select v-model="oilCardRechargeForm.rechargerId" placeholder="请选择充值人" clearable filterable remote :remote-method="selectRecharger" @click.native="selectRecharger()">
                                <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="充值方式" required prop="rechargeType">
                            <el-select v-model="oilCardRechargeForm.rechargeType" :disabled="disabled" clearable placeholder="请选择充值方式" @change="changeRechargeType(oilCardRechargeForm.rechargeType)">
                                <el-option label="主卡转入" value="1"></el-option>
                                <el-option label="现金" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="充值日期" prop="rechargeDate">
                            <el-date-picker v-model="oilCardRechargeForm.rechargeDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择充值日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="充值前余额" >
                            <el-input v-model="oilCardRechargeForm.beforeRechargeBalance" disabled clearable> <template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="充值金额" prop="rechargeAmount">
                            <el-input v-model="oilCardRechargeForm.rechargeAmount"  clearable @change="changeRechargeAmount(oilCardRechargeForm.rechargeAmount)" type="number"> <template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="充值后余额" >
                            <el-input v-model="oilCardRechargeForm.afterRechargeBalance" clearable disabled><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="发票号" v-if="oilCardRechargeForm.rechargeType == 2">
                            <el-input v-model="oilCardRechargeForm.invoiceNumber" clearable maxlength="20"></el-input>
                        </el-form-item>
                        <template v-if="oilCardRechargeForm.rechargeType == 1">
                            <el-form-item label="加油卡主卡" >
                                <el-input v-model="oilCardRechargeForm.masterCardCode" clearable disabled></el-input>
                            </el-form-item>
                            <el-form-item label="主卡原金额" >
                                <el-input v-model="oilCardRechargeForm.beforeBalance" clearable disabled><template slot="append">元</template></el-input>
                            </el-form-item>
                            <el-form-item label="主卡充值后余额" >
                                <el-input v-model="oilCardRechargeForm.afterBalance"  clearable disabled ><template slot="append">元</template></el-input>
                            </el-form-item>
                        </template>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div  class="left-row">
                <el-button type="primary" @click="submitForm('oilCardRechargeForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

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
                        <!--<div class="form-group">
                            <label class="control-label">所属组织</label>
                            <div class="input-group">
                                <tree-select v-model="searchParam.companyId" placeholder="请选择组织" type="one" url="/admin/organization/tree"></tree-select>
                            </div>
                        </div>-->
                        <div class="form-group">
                            <label class="control-label">服务客户</label>
                            <div class="input-group">
                                <el-input v-model="searchParam.enterpriseName" placeholder="请输入服务客户"></el-input>
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
                        <el-table-column prop="energyCompany" sortable label="能源企业" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="balance" sortable label="油卡余额" min-width="100"></el-table-column>
                        <el-table-column prop="type" sortable label="油卡类型" min-width="100"></el-table-column>
                        <el-table-column prop="cardholderUser" sortable label="持卡人" min-width="140"></el-table-column>
                        <el-table-column prop="companyName" sortable label="所属组织" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="oilCardStatusText" sortable label="状态" min-width="140"></el-table-column>
                        <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="plate" sortable label="绑定车辆" min-width="140"></el-table-column>
                        <el-table-column prop="vehicleModel" sortable label="绑定车型" min-width="140" show-overflow-tooltip></el-table-column>
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

    export default {
        mixins: [ tool, ruleTool ],
        name:"oilCardRechargeForm",
        components : {TreeSelect},
        data(){
            return {
                oilCardRechargeForm:{},
                openCollapse:["1"],
                show:false,
                oilCardShow:false,
                disabled:false,
                listUrl:"/base/oilCard/list",
                users:[],
                companys:[],
                formRule,
                rules:{
                    oilCardCode: [
                        { required: true, message: '请选择加油卡', trigger: 'change' }
                    ],
                    rechargeAmount:[
                        { required: true, message: '请输入充值金额', trigger: 'blur' },
                        {validator: formRule.money, message: '整数最大11位，小数最大2位', trigger: 'blur'}
                    ],
                    rechargeType:[
                        { required: true, message: '请选择充值方式', trigger: 'change' }
                    ],
                    rechargeDate:[
                        { required: true, message: '请选择充值日期', trigger: 'change' }
                    ],
                    rechargerId:[
                        { required: true, message: '请选择充值人', trigger: 'change' }
                    ],
                    companyId:[
                        { required: true, message: '请选择所属组织', trigger: 'change' }
                    ]
                },
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
                    ajax.get('base/oilCardRecharge/detail/' + id).then(rs => {
                        console.log(rs);
                        this.oilCardRechargeForm = rs.data;
                        this.oilCardRechargeForm.companyId = [this.oilCardRechargeForm.companyId];
                        if(this.oilCardRechargeForm.oilCardType == 1){
                            this.disabled = true;
                        }
                    });
                }else{
                    this.disabled = false;
                }
                this.show = true;
                this.selectRecharger();
                this.getCompanys();
            },
            getCompanys() {
                this.companys = this.getCurrentUserInfo().organizationList;
            },
            getOilCard(){ //打开加油卡选择弹窗
                let companyId=this.oilCardRechargeForm.companyId.join();
                this.listUrl = "/base/oilCard/list?oilCardStatus=40&companyId="+companyId;
                this.resetList();
                this.oilCardShow = true;

            },
            selectOilCard(row){ //选择加油卡
                if(row.typeCode == 1){
                    this.disabled = true;
                    this.$set(this.oilCardRechargeForm,"rechargeType","2");
                }else{
                    this.disabled = false;
                }
                this.$set(this.oilCardRechargeForm,"oilCardId",row.id);
                this.$set(this.oilCardRechargeForm,"oilCardCode",row.code);
                this.$set(this.oilCardRechargeForm,"oilCardType",row.type);
                this.$set(this.oilCardRechargeForm,"beforeRechargeBalance",row.balance);
                this.$set(this.oilCardRechargeForm,"afterRechargeBalance",row.balance);
                this.oilCardShow = false;
                if(null != this.oilCardRechargeForm.rechargeAmount && this.oilCardRechargeForm.rechargeAmount  != ""){
                    this.changeRechargeAmount(this.oilCardRechargeForm.rechargeAmount);
                }
            },
            changeRechargeAmount(rechargeAmount){ //充值金额改变触发充值后余额改变
                if(this.oilCardRechargeForm.rechargeType == "2"){
                    if(null != rechargeAmount && rechargeAmount  != ""){
                        this.oilCardRechargeForm.afterRechargeBalance = parseFloat(this.oilCardRechargeForm.beforeRechargeBalance)+parseFloat(rechargeAmount);
                    }else{
                        this.oilCardRechargeForm.afterRechargeBalance = this.oilCardRechargeForm.beforeRechargeBalance;
                    }
                }else if(this.oilCardRechargeForm.rechargeType == "1"){
                    var oilCard = this.oilCardRechargeForm.oilCardId;

                    ajax.get('base/oilCardRecharge/getOilCard/'+oilCard).then(result => {
                        if(result.status == 0){
                            if(parseFloat(rechargeAmount) > parseFloat(result.data.balance) ){
                                this.showMessage("充值金额不能大于主卡余额","error");
                            }else{
                                if(null != rechargeAmount && rechargeAmount  != ""){
                                    this.oilCardRechargeForm.afterRechargeBalance = parseFloat(this.oilCardRechargeForm.beforeRechargeBalance)+parseFloat(rechargeAmount);
                                    this.oilCardRechargeForm.afterBalance = parseFloat(this.oilCardRechargeForm.beforeBalance)-parseFloat(rechargeAmount);
                                }else{
                                    this.oilCardRechargeForm.afterRechargeBalance = this.oilCardRechargeForm.beforeRechargeBalance;
                                    this.oilCardRechargeForm.afterBalance = this.oilCardRechargeForm.beforeBalance;
                                }
                            }
                        }
                    });
                }
            },
            changeRechargeType(rechargeType){ //充值方式如果是主卡转入，获取主卡信息
                var oilCardId = this.oilCardRechargeForm.oilCardId;
                console.log(oilCardId)
                if(rechargeType == "1"){ //主卡转入
                    ajax.get('base/oilCardRecharge/getOilCard/'+oilCardId).then(result => {
                        if(result.status == 0){
                            this.$set(this.oilCardRechargeForm,"masterCardCode",result.data.code);
                            this.$set(this.oilCardRechargeForm,"beforeBalance",result.data.balance);
                            this.$set(this.oilCardRechargeForm,"afterBalance",result.data.balance);
                            if(null != this.oilCardRechargeForm.rechargeAmount && this.oilCardRechargeForm.rechargeAmount  != ""){
                                if(parseFloat(this.oilCardRechargeForm.rechargeAmount) > parseFloat(result.data.balance)){
                                    this.$message.error("充值金额不能大于主卡余额");
                                }else{
                                    this.$set(this.oilCardRechargeForm,"afterBalance",parseFloat(result.data.balance)-parseFloat(this.oilCardRechargeForm.rechargeAmount));
                                }
                            }
                        }
                    });

                }else if(rechargeType == "2"){ //现金
                    if(null != this.oilCardRechargeForm.rechargeAmount && this.oilCardRechargeForm.rechargeAmount  != ""){
                        this.changeRechargeAmount(this.oilCardRechargeForm.rechargeAmount);
                    }
                }
            },
            submitForm(oilCardRechargeForm) {
                let data = this.extend(true,{},this.oilCardRechargeForm);
                data.companyId = data.companyId.join();
                let url = "";
                if(this.oilCardRechargeForm.id != null && this.oilCardRechargeForm.id != ""){
                    url = "base/oilCardRecharge/edit";
                }else{
                    url = "base/oilCardRecharge/add";
                }
                this.$refs[oilCardRechargeForm].validate((valid) => {
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
            selectRecharger(query){
                if(!query){
                    query = "";
                }
                ajax.get('base/oilCard/getUserSelect?name=' + query +'&time=' + new Date().getTime()).then(result => {
                    if (result.length > 0) {
                        this.users = result;
                    }
                });

            },
            //所属组织树组织选择
            changeArrayItem(data) {
                if (!data || data.length == 0){
                    this.$set(this.oilCardRechargeForm,"oilCardId","");
                    this.$set(this.oilCardRechargeForm,"oilCardCode","");
                    this.$set(this.oilCardRechargeForm,"oilCardType","");
                    this.$set(this.oilCardRechargeForm,"beforeRechargeBalance","");
                    this.$set(this.oilCardRechargeForm,"afterRechargeBalance","");
                    this.$set(this.oilCardRechargeForm,"companyName","");
                    this.$set(this.oilCardRechargeForm,"companyId","");
                    return;
                }
                if (Array.isArray(data))
                    data = data[0];
            },
        },

    }
</script>

