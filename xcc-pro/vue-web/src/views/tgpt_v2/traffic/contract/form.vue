<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆资料-->
                <el-collapse-item title="合同信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item prop="contractNumber" label="合同编号">
                            <el-input v-model="addForm.contractNumber" clearable maxlength="20" placeholder="请输入合同编号"></el-input>
                        </el-form-item>
                        <el-form-item prop="contractType" label="合同类型">
                            <el-select v-model="addForm.contractType" placeholder="请选择" clearable>
                                <el-option label="以租代购" :value="1"></el-option>
                                <el-option label="直租" :value="2"></el-option>
                                <el-option label="挂靠" :value="3"></el-option>
                                <el-option label="内部指派" :value="4"></el-option>
                                <el-option label="短租" :value="5"></el-option>
                                <el-option label="租牌" :value="6"></el-option>
                                <el-option label="长包" :value="7"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属组织" prop="organizationId">
                            <tree-select  placeholder="请选择所属组织" type="one" v-model="companyId"
                                          url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        </el-form-item>
                        <el-form-item label="承租人" prop="renter">
                            <el-input v-model="addForm.renter" maxlength="20" clearable placeholder="请输入承租人"></el-input>
                        </el-form-item>
                        <el-form-item prop="phone" label="承租人手机号">
                            <el-input v-model="addForm.phone" clearable maxlength="11" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="contractStartDate" label="合同开始日期">
                            <el-date-picker type="date" placeholder="请选择" v-model="addForm.contractStartDate" :picker-options="startOption" value-format="yyyy-MM-dd"
                                :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="contractEndDate" label="合同结束日期">
                            <el-date-picker type="date" placeholder="请选择" :picker-options="endOption" v-model="addForm.contractEndDate" value-format="yyyy-MM-dd"
                                :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="vehicleNum" label="所需车辆台数">
                            <el-input v-model.number="addForm.vehicleNum" maxlength="20" clearable placeholder="请输入正整数"></el-input>
                        </el-form-item>

                        <el-form-item prop="contractAmount" :rules="[rules.money()]" label="合同总金额(元)">
                            <money-input v-model="addForm.contractAmount" :disabled="true" clearable placeholder="自动计算"></money-input>
                        </el-form-item>

                        <el-form-item prop="salesman" label="业务员">
                            <el-input v-model="addForm.salesman" maxlength="20" clearable placeholder="请输入业务员"></el-input>
                        </el-form-item>

                        <el-form-item prop="assurePersonIdcard" label="担保人身份证">
                            <el-input v-model="addForm.assurePersonIdcard" clearable maxlength="18" placeholder="请输入担保人身份证"></el-input>
                        </el-form-item>

                        <el-form-item prop="assurePersonPhone" label="担保人手机号">
                            <el-input v-model="addForm.assurePersonPhone" clearable maxlength="11" placeholder="请输入担保人手机号"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="addForm.remark" clearable maxlength="200" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="附件">
                            <upload-panel :size="1" :file-list.sync="fileList"></upload-panel>
                        </el-form-item>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="合同款项" name="2" >
                    <div class="flex">
                        <label class="required">款项类型</label>
                        <el-form-item prop="paymentType" label="">
                            <el-select v-model="addForm.paymentType" placeholder="请选择">
                                    <el-option label="定金" :value="1"></el-option>
                                    <el-option label="首付款" :value="2"></el-option>
                                    <el-option label="押金" :value="3"></el-option>
                                    <el-option label="租金" :value="4"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-button class="" type="primary" @click="addContractDetail">新增</el-button>
                    </div>
                    <ul class="form-table">
                        <li class="table-tr header">
                            <div class="table-td required" style="min-width:100px">款项类型</div>
                            <div class="ul">
                                <div class="table-td" style="min-width:100px">期数</div>
                                <div class="table-td required" style="min-width:100px">金额（元）</div>
                                <div class="table-td required" style="min-width:150px">支付日期</div>
                                <div class="table-td required" style="min-width:290px">临期提醒</div>
                            </div>
                            <div class="table-td" style="min-width:100px;width:15%">操作</div>
                        </li>
                        <li class="table-tr" v-for="(row,i) in addForm.detailList" :key="i">
                            <template v-if="row.paymentType && row.paymentType != 4">
                                <div class="table-td" style="min-width:100px">
                                    {{paymentType[row.paymentType]}}
                                </div>
                                <div class="ul">
                                    <div class="table-td" style="min-width:100px">
                                        {{row.period || '--'}}
                                    </div>
                                    <div class="table-td" style="min-width:100px">
                                        <el-form-item :prop="'detailList.'+i+'.amount'"
                                            :rules="[rules.money()]" >
                                                <money-input v-model="row.amount" clearable placeholder="请输入"></money-input>
                                        </el-form-item>
                                    </div>
                                    <div class="table-td" style="min-width:150px">
                                        <el-form-item :prop="'detailList.'+i+'.paymentDate'" :rules="rules.required('请选择支付日期')">
                                            <el-date-picker type="date" placeholder="请选择" v-model="row.paymentDate"
                                                value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <div class="table-td remind" style="min-width:290px">
                                        <el-form-item :prop="'detailList.'+i+'.remindDays'"
                                            :rules="[
                                                {required: true, message: '请输入临期提醒', trigger: 'change'},
                                                {type: 'number', message: '必须为数字值', trigger: 'change'},
                                                {validator:formRule.number, size:[0,30], trigger: 'change' }
                                            ]">
                                            <div>
                                                在到期前<el-input  type="text" v-model.number="row.remindDays" size="small" placeholder="请输入"></el-input><span>天提醒（0不提醒）</span>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="table-td" style="min-width:100px;width:15%">
                                    <el-button type="text" @click="onDelContractDetailList(row,i)">删除</el-button>
                                </div>
                            </template>
                            <template v-else>
                                <div class="table-td" style="min-width:100px">
                                    {{paymentType[row.paymentType]}}
                                </div>
                                <ul class="form-rent-table" :style="{'margin-right': rentObj.period > 7?'-8px':''}">
                                    <li class="rent-table-tr" v-for="(props,k) in rentObj.children" :key="k">
                                        <el-form :model="rentObj" label-position="left" inline class="form-rent" ref="formRent">
                                            <div class="rent-table-td " style="min-width:100px">
                                                第{{props.period}}期
                                            </div>
                                            <div class="rent-table-td" style="min-width:100px">
                                                <el-form-item :prop="'children.'+k+'.amount'" :rules="[rules.money()]">
                                                    <money-input v-model="props.amount" clearable placeholder="请输入"></money-input>
                                                </el-form-item>
                                            </div>
                                            <div class="rent-table-td" style="min-width:150px">
                                                <el-form-item :prop="'children.'+k+'.paymentDate'" :rules="rules.required('请选择支付日期')">
                                                    <el-date-picker type="date" placeholder="请选择" v-model="props.paymentDate"
                                                        value-format="yyyy-MM-dd" disabled
                                                        :editable="false"></el-date-picker>
                                                </el-form-item>
                                            </div>
                                            <div class="rent-table-td remind" style="min-width:290px">
                                                <el-form-item :prop="'children.'+k+'.remindDays'" :rules="[
                                                            {required: true, message: '请输入临期提醒', trigger: 'change'},
                                                            {type: 'number', message: '必须为数字值', trigger: 'change'},
                                                            {validator:formRule.number, size:[0,30], trigger: 'change' }
                                                        ]">
                                                    在到期前<el-input type="text" v-model.number="props.remindDays" size="small" placeholder="请输入"></el-input><span>天提醒（0不提醒）</span>
                                                </el-form-item>
                                            </div>
                                        </el-form>
                                    </li>
                                </ul>
                                <div class="table-td" style="min-width:100px;width:15%">
                                    <el-button type="text" @click="onRentObjEdit(row,i)">编辑</el-button>
                                    <el-button type="text" @click="onDelContractDetailList(row,i)">删除</el-button>
                                </div>
                            </template>
                        </li>
                    </ul>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                    <el-button @click="close()">关闭</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>

        <!-- 分期弹窗 -->
        <el-dialog
            class="demand-selector big-dialog center"
            title="添加分期"
            :visible.sync="visible"
            append-to-body
            @close="visibleClose"
            :close-on-click-modal="false">
            <div class="dialog-form">
                <el-form ref="rentObj" :model="rentObj" :rules="rentRules" label-width="150px">
                    <el-form-item label="款项类型">
                        <el-input value="租金" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式" prop='type'>
                        <el-select v-model="rentObj.type" placeholder="请选择">
                        <el-option label="月付" value="1"></el-option>
                        <el-option label="季付" value="2"></el-option>
                        <el-option label="半年付" value="3"></el-option>
                        <el-option label="年付" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="总期数" prop='period' >
                        <el-input type="text" v-model.number="rentObj.period" placeholder="请输入正整数"></el-input>
                    </el-form-item>
                    <el-form-item label="每期金额（元）" prop='amount' :rules="[rules.money()]" >
                        <!-- <el-input type="text" v-model="rentObj.money" placeholder="请输入金额"></el-input> -->
                        <money-input v-model="rentObj.amount" clearable placeholder="请输入"></money-input>
                    </el-form-item>
                    <el-form-item label="首次支付日期" prop='paymentDate'>
                        <el-date-picker type="date" placeholder="请选择" v-model="rentObj.paymentDate" value-format="yyyy-MM-dd"
                            :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="临期提醒" class="tip" prop='remindDays'>
                        在到期前<el-input type="text" v-model.number="rentObj.remindDays"  placeholder="请输入"></el-input>天提醒（0不提醒）
                    </el-form-item>
                    <div class="opertion">
                        <el-button type="primary" @click="onSubimtRentObj">保存</el-button>
                        <el-button @click="visibleClose">取消</el-button>
                    </div>
                </el-form>
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
    import { tool, ruleTool, formRule } from '@/utils/common'
    import { deepClone } from '@/utils/index'


    export default {
        mixins: [ tool, ruleTool ],
        name:"contractForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect},

        data(){
            let $this = this;
            let int = (rule, v, callback) => {
                if (!v && v != 0){
                    callback();
                }else if(isNaN(v) || v <= 0 || v >= 100 || ((v + '').indexOf('.') != -1)){
                    callback(new Error('请输入1~99的正整数'));
                }else{
                    callback();
                }
            };
            return {
                paymentType:{
                    1:'定金',
                    2:'首付款',
                    3:'押金',
                    4:'租金',
                },
                openCollapse: ['1','2'],
                dialogDisabled:true,
                show : false,
                organization:[],
                visible:false,
                companyId:[],
                fileList:[],
                formRule:formRule,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now()-24*60*60*1000;
                    }
                },
                addForm : {
                    detailList:[],
                },
                startOption:{
                    disabledDate(time) {
                        if($this.addForm.contractEndDate){
                            return new Date($this.addForm.contractEndDate).getTime()- 24*60*60*1000 < time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                endOption:{
                    disabledDate(time) {
                        if($this.addForm.contractStartDate){
                            return new Date($this.addForm.contractStartDate).getTime() > time.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                rentObj:{
                },
                rules: {
                    contractNumber: [
                        {required: true, message: '请输入合同编号', trigger: 'change'}
                    ],
                    contractType: [
                        {required: true, message: '请选择合同类型', trigger: 'change'}
                    ],
                    organizationId: [{required: true, message: '请选择所属组织', trigger: 'change'}],
                    renter: [{required: true, message: '请输入承租人', trigger: 'change'}],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'change'},
                        {validator: formRule.isMobilePhone, message: "手机号格式有误", trigger: "blur"}
                     ],
                    contractStartDate: [{required: true, message: '请选择合同开始日期', trigger: 'change'}],
                    contractEndDate:[{required: true, message: '请选择合同结束日期', trigger: 'change'}],
                    vehicleNum:[
                        {required: true, message: '请输入所需车辆台数', trigger: 'change'},
                        {type: 'number', message: '必须为正整数', trigger: 'change'},
                    ],
                    contractAmount: [
                        {required: true, message: '请选择合同款项', trigger: 'change'},
                    ],
                    salesman: [
                        {required: true, message: '请输入业务员', trigger: 'change'}
                    ],
                    assurePersonIdcard: [
                        {required: true, message: '请输入担保人身份证', trigger: 'change'},
                        {
                            validator: formRule.common,
                            reg: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                            message: "请输入正确的身份证号",
                            trigger: "change"
                        }
                    ],
                    assurePersonPhone: [
                        {required: true, message: '请输入手机号', trigger: 'change'},
                        {validator: formRule.isMobilePhone, message: "手机号格式有误", trigger: "blur"}
                    ],
                    paymentType:[{required: true, message: '请选择款项类型', trigger: 'change'}]
                },
                rentRules:{
                    type: [
                        {required: true, message: '请选择支付方式', trigger: 'change'}
                    ],
                    period: [
                        {required: true, message: '请输入总期数', trigger: 'change'},
                        {type: 'number', message: '必须为正整数', trigger: 'change'},
                        {type: 'number', validator: int, trigger: 'change'}
                    ],
                    paymentDate:[
                        {required: true, message: '请选择首次支付日期', trigger: 'change'}
                    ],
                    remindDays:[
                        {required: true, message: '请输入临期提醒', trigger: 'change'},
                        {type: 'number', message: '必须为数字值', trigger: 'change'},
                        {validator:formRule.number, size:[0,30], trigger: 'change' }
                    ],
                },
                rentDateList:[],
                id:this.$route.query.id,
                copyRentObj:null,
                index:null
            }
        },
        watch:{
            rentObj:{
                handler(val){
                    this.getTotalMoney();
                },
                immediate:true,
                deep:true
            },
            'addForm.detailList':{
                handler(val){
                    this.getTotalMoney();
                },
                immediate:true,
                deep:true
            }
        },
        methods:{
            getTotalMoney(){
                let amount = 0;
                if(this.rentObj.children && this.rentObj.children.length){
                    this.rentObj.children.map(item=>{
                        amount += item.amount*1
                    })
                }
                if(this.addForm.detailList.length){
                    this.addForm.detailList.map(item=>{
                        if(item.amount){
                            amount += item.amount*1
                        }
                    })
                }
                this.$set(this.addForm,"contractAmount", amount.toFixed(2));
            },
            changeOrganization(){
                if (this.companyId.length > 0) {
                    this.$set(this.addForm,"organizationId",this.companyId[0]);
                }else{
                    this.$set(this.addForm,"organizationId","");
                }
            },
            onDelContractDetailList(row,i){
                if(row.paymentType == 4){
                    this.rentObj = {};
                }
                this.addForm.detailList.splice(i,1);
                if(!this.addForm.detailList.length){
                    this.addForm.paymentType = '';
                }
            },
            addContractDetail(){
                if(!this.addForm.paymentType){
                    this.$message({message: '请选择款项类型',type: 'error'});
                    return
                }
                if(this.addForm.detailList.some(item=> item.paymentType == this.addForm.paymentType)){
                    this.$message({message: '此类型已存在！',type: 'error'});
                    return
                }
                if(this.addForm.paymentType != 4){
                    this.addForm.detailList.push({
                        paymentType:this.addForm.paymentType,
                        period:'',
                        amount:'',
                        paymentDate:'',
                        remindDays:''
                    });
                }else{
                    this.visible = true;
                }
            },
            onRentObjEdit(row,i){
                this.visible = true;
                this.copyRentObj = deepClone(this.rentObj)
            },
            onSubimtRentObj(){
                this.$refs.rentObj.validate((valid) => {
                    if (valid) {
                        const { rentObj } = this;
                        this.$set(rentObj,'children',[])
                        this.handleDate(rentObj)
                        for( let i = 0;i<rentObj.period;i++ ){
                            rentObj.paymentType = 4;
                            rentObj.children.push({
                                paymentType:4,
                                period:(i+1),
                                amount:rentObj.amount,
                                paymentDate:this.rentDateList[i],
                                remindDays:rentObj.remindDays
                            })
                        }
                        if(!this.addForm.detailList.some(item=> item.paymentType == 4)){
                            this.addForm.detailList.push({
                                paymentType:4,
                            });
                        }
                        this.copyRentObj = null;
                        this.visible = false;
                    }
                })
            },
            handleDate(rentObj,i){
                this.rentDateList = [];
                const date = new Date(rentObj.paymentDate);
                let year = date.getFullYear();
                let month = new Date(rentObj.paymentDate).format('MM');
                let day = new Date(rentObj.paymentDate).format('dd');
                let flag = false;
                let newDay = '';
                for( let i = 1;i<=rentObj.period;i++ ){
                    month = month*1
                    let toDay = '';
                    if(i == 1){
                        this.rentDateList.push(new Date(rentObj.paymentDate).format('yyyy-MM-dd'))
                    }else{
                        if(rentObj.type == 1){ // 月付
                            month++
                            if(month > 12){
                                year++;
                                month = 1;
                            }
                        }else if(rentObj.type == 2){ // 季付
                            month = month + 3;
                            if(month > 12){
                                year++;
                                month = month - 12;
                            }
                        }else if(rentObj.type == 3){ // 半年付
                            month = month + 6;
                            if(month > 12){
                                year++;
                                month = month - 12;
                            }
                        }else if(rentObj.type == 4){ //年付
                            year++;
                        }
                        if(day == 31 || flag){
                            flag = true;
                            day = this.getLastDay(year,month);
                        }
                        if(day > 28 && day < 31 && month == 2 ){
                            toDay = this.getLastDay(year,month)
                        }
                        newDay =toDay? toDay: day;
                        newDay = newDay > 9 ? newDay: '0' + newDay;
                        month = month>9? month :'0' + month;
                        const _d = year + '-' + month + '-' + newDay;
                        this.rentDateList.push(new Date(_d).format('yyyy-MM-dd'));
                    }
                }
            },
            getLastDay(year, month) {
                var new_year = year;
                var new_month = month++;
                var new_date = new Date(new_year, new_month, 1);
                return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
            },
            visibleClose(){
                if(this.copyRentObj){
                    this.rentObj = deepClone(this.copyRentObj)
                }else if(!this.addForm.detailList.some(item=> item.paymentType == 4)){
                    this.rentObj = {};
                }
                this.visible = false;
            },
            getRenNo(){
                if(!this.id){
                    ajax.get('traffic/trafficContract/genNo').then(res=>{
                        if(res.status == 0){
                            this.$set(this.addForm,'contractNumber',res.data)
                        }
                    })
                }
            },
            setRentObj(data,children){
                if(children.length){
                    this.rentObj.period = children.length;
                    // this.rentObj.type = new Date(children[1].paymentDate).format('MM') -new Date(children[0].paymentDate).format('MM');
                    this.rentObj.amount = children[0].amount;
                    this.rentObj.paymentDate = children[0].paymentDate;
                    this.rentObj.remindDays = children[0].remindDays;
                    this.rentObj.children = children;
                }
            },
            getData(){
                this.fileList = [];
                if(this.id){
                    ajax.get('traffic/trafficContract/detail/' + this.id).then(res=>{
                        if(res.status == 0){
                            this.addForm = res.data;
                            const detailList = res.data.detailList.filter(item=>item.paymentType != 4);
                            const children = res.data.detailList.filter(item=>item.paymentType == 4);
                            this.setRentObj(res.data,children);
                            this.addForm.detailList = detailList;
                            if(children.length){
                                this.addForm.detailList.push({paymentType:4});
                            }
                            if(res.data.attachment){
                                this.fileList=JSON.parse(res.data.attachment);
                            }
                            this.companyId[0] = res.data.organizationId;
                            this.$set(this.addForm,'paymentType',res.data.detailList[0].paymentType);
                        }
                    })
                }
            },
            submitForm(addForm) {
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                            if(this.fileList.length>0){
                                this.addForm.attachment=JSON.stringify(this.fileList);
                            }
                        if(this.rentObj.children){
                            this.addForm.detailList.map(item=>{
                                if(item.paymentType == 4){
                                    item.children = this.rentObj.children;
                                }
                            })
                        }
                        var data = this.addForm;
                        ajax.post('traffic/trafficContract/save', data).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.close();
                                }else {
                                    this.$message.error(res.msg);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted(){
            this.getRenNo();
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
    .flex{
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .el-form-item{
            margin: 0;
        }
        >label{
            width:100px;
            text-align: right;
            margin-right: 10px;
        }
        >label::after{
            content: '*';
            color: #f56c6c;
            margin-left: 4px;
            font-size: 14px;
        }
        >button{
            margin-left: 16px;
            line-height: .6;
        }
    }
</style>

