<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px">
            <el-collapse v-model="openCollapse">
                <!--车辆资料-->
                <el-collapse-item title="处置信息" name="1" >
                    <div class="flex-panel">
                        <el-form-item label="所属组织" prop="originateId">
                            <tree-select @change="chooserOrgId" v-model="originateIds" placeholder="请选择组织" type="one"
                                         url="/admin/organization/tree"></tree-select>
                        </el-form-item>

                        <el-form-item label="申请处置车辆数" prop="vehicleDisposalAmount">
                            <el-input v-model="addForm.vehicleDisposalAmount"  clearable disabled></el-input>
                        </el-form-item>

                        <el-form-item label="申请处置说明" prop="applicationInstruction">
                            <el-input v-model="addForm.applicationInstruction"  maxlength=50 placeholder="请输入" clearable></el-input>
                        </el-form-item>

                    </div>
                </el-collapse-item>

                <el-collapse-item title="处置车辆明细" name="2" >
                    <el-button class="float-btn" type="primary" :disabled="dialogDisabled" @click="openDialog() ">新增</el-button>
                    <div class="table-box">
                        <el-table border :data="addForm.useApplyDetail" style="width: 100%">
                            <el-table-column label="序号" min-width="80">
                                <template slot-scope="scope">
                                    {{scope.$index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="车架号" prop="vin" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="车型" prop="vehicleModel" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column min-width="140" label="颜色" prop="vehicleColor" sortable show-overflow-tooltip></el-table-column>
                            <el-table-column fixed="left" label="操作" width="150">
                                <template slot-scope="scope">
                                        <el-form-item>
                                            <el-button type="text"
                                                       @click="deleteItem(scope)"
                                                       style="color:#F56C6C;font-size: 13px;">删除
                                            </el-button>
                                        </el-form-item>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <el-form-item class="left-row">
                    <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                    <el-button @click="close()">关闭</el-button>
                </el-form-item>
            </el-collapse>
        </el-form>

        <el-dialog width="70%" title="选择车辆" :visible.sync="dialogTableVisible"
                   :append-to-body="true">
            <div class="list-panel">
                <div class="row form-horizontal search-box min">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">车牌</label>
                            <div class="input-group">
                                <el-input clearable placeholder="请输入车牌" v-model="dialogParam.plate"></el-input>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">车架号</label>
                            <div class="input-group">
                                <el-input clearable placeholder="请输入车架号" v-model="dialogParam.vin"></el-input>
                            </div>
                        </div>

                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="openDialog()">查询
                        </el-button>
                        <el-button size="small" @click="resetList(2)">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table border style="width: 100%" :data="list"
                              max-height="300">
                        <el-table-column fixed="left" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="organCascade[scope.$index]"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column prop="plate" sortable label="车牌" min-width="140"></el-table-column>
                        <el-table-column prop="vin" sortable label="车架号"
                                         min-width="200"></el-table-column>
                        <el-table-column prop="vehicleModel" sortable label="车型" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                        <el-table-column prop="vehicleColor" sortable label="颜色" show-overflow-tooltip
                                         min-width="140"></el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="page"
                        :page-sizes="pageSizeSetting"
                        :page-size.sync="pageSize"
                        :layout="pageLayout"
                        :total="listCount">
                    </el-pagination>
                </div>
                <div class="left-row" style="padding-bottom: 10px;">
                    <el-button type="primary" @click="saveVehicleData('organCascade')">保存</el-button>
                    <el-button @click="dialogTableVisible=false">关闭</el-button>
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
    import { tool, ruleTool, formRule } from '@/utils/common'


    export default {
        mixins: [ tool, ruleTool ],
        name:"baseVehicleDisposalApplyForm",
        components:{ TreeSelect, MoneyInput, UploadPanel ,CitySelect},

        data(){
            var moneyRegex = /(^[0-9]{1,11}(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]{1,11}\.[0-9]([0-9])?$)/;
            return {
                openCollapse:["1","2"],
                show : false,
                originateIds:[],
                number:'number',
                addForm : {
                    useApplyDetail: []
                },
                dialogDisabled:true,
                dialogParam:{},
                vehicleList:[],
                organCascade:[],
                dialogTableVisible: false,
                numberdisplay:true,
                numberlabel:"新增个数",
                listUrl: '/base/baseVehicleDisposalApply/vehicleList',
                rules: {
                    originateId:[
                        { required: true, message: '请选择所属组织', trigger: 'change' }
                    ],
                    vehicleDisposalAmount: [
                        { required: true, message: '请选择车辆', trigger: 'change' }
                    ],
                    applicationInstruction:[
                        { required: true, message: '请输入处置说明', trigger: 'change' }
                    ]

                }
            }
        },

        methods:{
            saveVehicleData(data){
                var errorMessage="";
                for(var i = 0;i<this.organCascade.length;i++){
                    console.log(this.organCascade);
                    if(this.organCascade[i]==true){
                        let vehicleData={
                            plate:"",
                            vin:"",
                            vehicleModel:"",
                            vehicleColor:""
                        };
                        var is_add=true;
                        for(var j = 0;j< this.addForm.useApplyDetail.length;j++){
                            if(this.addForm.useApplyDetail[j].vehicleId==this.list[i].id){
                                errorMessage+="该车辆["+this.list[i].plate+"]已添加;"
                                is_add=false;
                            }
                        }
                        if(is_add){
                            vehicleData.vehicleId = this.list[i].id;
                            vehicleData.plate = this.list[i].plate;
                            vehicleData.vin = this.list[i].vin;
                            vehicleData.vehicleModel = this.list[i].vehicleModel;
                            vehicleData.vehicleColor = this.list[i].vehicleColor;
                            this.addForm.useApplyDetail.push(vehicleData);
                        }
                    }
                }
                if(errorMessage){
                    this.$message.warning(errorMessage);
                }
                this.$set(this.addForm,"vehicleDisposalAmount",this.addForm.useApplyDetail.length);
                this.dialogTableVisible = false;
                this.$set(this,"list",[]);
                this.$set(this,"organCascade",[]);
            },
            open(){
                let id = this.$route.query.id;
                if(this.addForm.useApplyDetail==undefined){
                    this.addForm.useApplyDetail=[];
                }
                if (id){
                    this.initForm(id);
                }else{
                    this.clearValidate();
                }
                this.openCollapse = ["1","2"];
                this.show = true;

            },
            openDialog(page,size){
                //去掉勾选
                for(var i = 0;i<this.organCascade.length;i++) {
                    if (this.organCascade[i] == true) {
                        this.organCascade[i] = false;
                    }
                }
                this.dialogTableVisible = true;
                const params = this.dialogParam;
                if (this.addForm.originateId) {
                    params.originateId = this.addForm.originateId;
                }
                params.size = this.pageSize;
                if(size != null && size !=undefined){
                    params.size=size
                }
                params.current = this.current;
                if(page != null && page !=undefined){
                    params.current=page
                }
                params.rows = this.pageSize;
                params.page =this.page;
                 if(page != null && page !=undefined){
                     params.page=page
                    }
                ajax.get(this.listUrl, params)
                    .then(res => {

                        if(typeof res.records === "object"){
                            this.list = res.records;
                            this.listCount = res.total;
                        }
                        if(typeof res.rows === "object"){
                            this.vehicleList = res.rows;
                            this.listCount = res.records;
                        }
                    });
                this.addForm.vehicleId = this.list.id;
            },
            resetList(){
                this.$set(this.dialogParam,"plate","");
                this.$set(this.dialogParam,"vin","");
                this.pageSize = 10;
                this.page = 1;
                this.openDialog();
            },

            handleCurrentChange(val){
                this.openDialog(val,null);
            },

            handleSizeChange(val){
                this.openDialog(null,val);
            },

            getListBefore(params){
                //去掉勾选
                for(var i = 0;i<this.organCascade.length;i++) {
                    if (this.organCascade[i] == true) {
                        this.organCascade[i] = false;
                    }
                }
            },
            deleteItem(scope) {
                this.addForm.useApplyDetail.splice(scope.$index, 1);
                this.$set(this.addForm,"vehicleDisposalAmount",this.addForm.useApplyDetail.length);
                console.log(scope.row.vehicleId);
                ajax.get("base/baseVehicleDisposalApply/reductionVehicleStatus/"+scope.row.vehicleId).then(()=>{
                    //this.getList();
                });
            },
            clearValidate(){
                if(this.$refs['addForm'])
                    this.$nextTick(_ =>{
                        this.$refs['addForm'].clearValidate();
                    })

            },
            addRow() {
                this.addForm.useApplyDetail.push({});
            },
            initForm(id){
                this.numberdisplay = false;
                this.numberlabel = "";
                ajax.get("base/baseVehicleDisposalApply/edit/"+id).then(res => {
                    if (res.data.originateId)
                        this.originateIds.push(res.data.originateId);
                    this.addForm = res.data;
                    this.number='';
                    if (this.originateIds.length > 0) {
                        this.dialogDisabled=false;
                    }
                })
            },
            submitForm(addForm) {
                this.saveVehicleData();
                if(this.addForm.useApplyDetail.length == 0){
                    this.$message({message: '没有添加处置车辆！',type: 'error'});
                    return;
                }
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                        var url = '/base/baseVehicleDisposalApply/saveVehicleDetail';
                        ajax.post(url, this.addForm).then(
                            (res) => {
                                if(res.status == 0){
                                    this.$message({message: '保存成功！',type: 'success'});
                                    this.close();
                                }else {
                                    this.$message.error(res.message);
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            chooserOrgId() {/!*选取用户组织*!/
                if (this.originateIds.length > 0) {
                    this.dialogDisabled=false;
                    this.$set(this.addForm,"originateId",this.originateIds[0]);
                }else{
                    this.dialogDisabled=true;
                    this.$set(this.addForm,"originateId","");
                }
                    this.addForm.useApplyDetail=[];
                    this.addForm.vehicleDisposalAmount=0;

            },

        },
        mounted(){
            this.open();
        }
    }
</script>

