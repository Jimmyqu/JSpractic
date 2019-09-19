<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="合同原件" name="1">
				<div class="flex-panel">

					<el-form-item label="所属组织" prop="organizationId">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
					</el-form-item>
                    <el-form-item label="客户类型" prop="customerType">
                        <el-select v-model="addForm.customerType" @change="changeCustomerType" placeholder="请选择客户类型" :disabled="organizationFlag">
                            <el-option label="企业客户" :value="1" :key="1"> </el-option>
                            <el-option label="个人客户" :value="2" :key="2"> </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="服务客户" prop="enterpriseId">
                        <el-input v-model="addForm.enterpriseName" readonly :disabled="organizationFlag" placeholder="请选择服务客户">
                            <el-button @click="openEnterpriseList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                            </el-button>
                        </el-input>
					</el-form-item>
                    <el-form-item label="合同编号" prop="contractNo">
                        <el-input v-model="addForm.contractNo" readonly :disabled="organizationFlag" placeholder="请选择合同">
                            <el-button @click="openContractList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                            </el-button>
                        </el-input>
                    </el-form-item>
					<el-form-item label="合同类型" prop="contractType">
                        <el-select v-model="addForm.contractType" placeholder="请选择合同类型" disabled>
                            <el-option label="长租" :value="1" :key="1"> </el-option>
                            <el-option label="短租" :value="2" :key="2"> </el-option>
                        </el-select>
					</el-form-item>
                    <el-form-item label="合同开始时间" prop="contractStartDate">
                        <el-input v-model="addForm.contractStartDate" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="合同结束时间" prop="contractEndDate">
                        <el-input v-model="addForm.contractEndDate" disabled></el-input>
                    </el-form-item>
					<el-form-item label="原件负责人" prop="principal">
						<el-input v-model="addForm.principal"  maxlength=50 placeholder="请输入" :disabled="organizationFlag" clearable></el-input>
					</el-form-item>
					<el-form-item label="合同原件上传" prop="original">
                        <upload-panel :size="1" :disabled="organizationFlag"  :file-list.sync="imgs"></upload-panel>
					</el-form-item>

				</div>
                </el-collapse-item>
            </el-collapse>

            <div class="left-row">
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                <el-button @click="close()">返回</el-button>
            </div>
        </el-form>

        <el-dialog title="选择合同" :visible.sync="dialogContractNo" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.contractNo" placeholder="请输入合同编号" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">合同类型</label>
                            <div class="input-group">
                                <el-select v-model="searchParam.contractType" placeholder="请选择合同类型" clearable >
                                    <el-option label="长租" value="1"> </el-option>
                                    <el-option label="短租" value="2"> </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                       <!-- <el-button size="small" @click="resetList()">重置</el-button>-->
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-height="250">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeContract(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="contractNo" label="合同编号"  min-width="200" ></el-table-column>
                        <el-table-column prop="contractType" label="合同类型" min-width="250"></el-table-column>
                        <el-table-column prop="contractStartDate" label="合同开始时间" min-width="120"></el-table-column>
                        <el-table-column prop="contractEndDate" label="合同结束时间" min-width="120"></el-table-column>
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
        <enterprise-dialog ref="enterpriseList" @load="selectEnterprise"></enterprise-dialog>
        <personal-customer-dialog ref="personalCustomerList" @load="selectPersonalCustomer"></personal-customer-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import enterpriseDialog from '@/views/tgpt/corporateCustomer/customerPersonal/enterpriseDialog'
    import personalCustomerDialog from '@/views/tgpt/corporateCustomer/customerPersonal/personalCustomerDialog'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "coreProjectContractOriginalForm",
        components: {TreeSelect, UploadPanel,enterpriseDialog,personalCustomerDialog},
        data() {
            return {
                activeNames: ['0', '1'],
                enterpriseList : [],
                organization:[],
                organizationFlag: true,
                dialogContractNo: false,
                dialogEnterprise: false,
                addForm: {},
                imgs:[],
                listUrl:'core/coreProjectContractOriginal/contractlist',
                rules:{
                    organizationId: [
                        { required: true, message: '请选择所在组织', trigger:'change'},
                    ],
                    customerType: [
                        { required: true, message: '请选择企业客户类型', trigger:'change'},
                    ],
                    enterpriseId: [
                        { required: true, message: '请选择服务客户', trigger:'change'},
                    ],
                    contractNo: [
                        { required: true, message: '请选择合同', trigger:'change'},
                    ],
                    principal: [
                        { required: true, message: '请输入原件负责人', trigger:'blur'},
                    ]

                }
            }
        },
        mounted() {
            debugger

            this.open();
        },
        methods: {
            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('core/coreProjectContractOriginal/detail/' + this.$route.query.id).then(rs => {
                        if(rs.status==0 && rs.data){
                            this.organizationFlag=false;
                            this.organization.push(rs.data.organizationId);
                            this.addForm.organizationId=rs.data.organizationId;
                           // this.getEnterpriseList();
                            if(rs.data.original)//转换图片
                                this.imgs=JSON.parse(rs.data.original);
                        }
                        this.addForm = rs.data;
                    });
                }
            },
            /*getEnterpriseList() {
                if (this.addForm.organizationId) {
                    ajax.get('core/coreProjectContractOriginal/enterpriselist/' + this.addForm.organizationId).then(rs => {
                        this.enterpriseList = rs.data;
                    });
                }else{
                    this.$message.error("请选择所属组织");
                    return;
                }
            },*/
             //打开服务客户弹窗
            openEnterpriseList(){
                if (this.addForm.customerType) {
                    if(this.addForm.customerType==1)
                        this.$refs.enterpriseList.open(this.addForm.organizationId);
                    else if(this.addForm.customerType==2)
                        this.$refs.personalCustomerList.open(this.addForm.organizationId);
                }else{
                    this.$message.error("请选择客户类型");
                    return;
                }
            },
            //选择企业客户
            selectEnterprise(row){
                this.addForm.enterpriseId=row.id;
                this.addForm.enterpriseName=row.name;
                this.changeEnterprise();
                this.addForm=Object.assign({},this.addForm);
            },
            //选择个人客户
            selectPersonalCustomer(row){
                this.addForm.enterpriseId=row.id;
                this.addForm.enterpriseName=row.name;
                this.addForm=Object.assign({},this.addForm);
            },
            changeContract(row){
                if(row){
                    this.dialogContractNo=false;
                    this.addForm.contractNo=row.contractNo;
                    this.addForm.projectContractId=row.id;
                    this.addForm.contractStartDate=row.contractStartDate;
                    this.addForm.contractEndDate=row.contractEndDate;
                    this.addForm.contractType=row.contractType=='长租'?1:2;
                    this.addForm=Object.assign({},this.addForm);
                }
            },
            openContractList(){
                debugger
                if (this.addForm.enterpriseId) {
                    this.dialogContractNo=true;
                    this.searchParam={};
                    this.searchParam.enterpriseId=this.addForm.enterpriseId;
                    //this.getListByUrl('core/coreProjectContractOriginal/contractlist');
                    this.getList();
                }else{
                    this.$message.error("请选择服务客户");
                    return;
                }
            },
            /*resetList(){
                this.searchParam={};
                this.searchParam.enterpriseId=this.addForm.enterpriseId;
                this.getList();
            },*/
            //保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }

                    if(this.imgs.length>0)//转换图片
                        this.addForm.original=JSON.stringify(this.imgs);
                    else{
                        this.$message.error("请上传合同原件");
                        return;
                    }
                    ajax.post('core/coreProjectContractOriginal/save', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.close();
                        }else{
                            this.$message.error(rs.msg);
                            return;
                        }
                    });
                });
            },
            changeCustomerType(){
                this.addForm.enterpriseId='';
                this.addForm.enterpriseName='';
                this.addForm.projectContractId='';
                this.addForm.contractNo='';
                this.addForm.contractStartDate='';
                this.addForm.contractEndDate='';
                this.addForm.contractType='';
                this.addForm.principal='';
                this.imgs=[];
            },
            changeEnterprise(){
                this.addForm.projectContractId='';
                this.addForm.contractNo='';
                this.addForm.contractStartDate='';
                this.addForm.contractEndDate='';
                this.addForm.contractType='';
                this.addForm.principal='';
                this.imgs=[];
            },
            changeOrganization(data){
                if(data && data.length==1){
                    this.organizationFlag= false;
                    this.addForm={organizationId:data[0].id};
                   // this.getEnterpriseList();
                }else{
                    this.organizationFlag= true;
                    this.organization=[];
                    this.addForm={};
                }
            }
        }
    }
</script>

