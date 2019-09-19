<template>
    <div class="form-panel">
        <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm" label-width="100px" v-cloak>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="招投标管理" name="1">
				<div class="flex-panel">

                    <el-form-item label="所属组织" prop="organizationId">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </el-form-item>
					<el-form-item label="招标编号" prop="bidNo">
						<el-input v-model="addForm.bidNo" :disabled="organizationFlag"  maxlength=50 placeholder="请输入" clearable></el-input>
					</el-form-item>
                    <el-form-item label="项目编号" prop="projectReviewId">
                        <el-input v-model="addForm.projectNo" readonly :disabled="organizationFlag" placeholder="请选择项目">
                            <el-button @click="openProjectList()" :disabled="organizationFlag" slot="append" icon="el-icon-search">
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="客户类型" prop="customerType">
                        <el-select v-model="addForm.customerType" disabled placeholder="请选择客户类型">
                            <el-option label="企业客户" :value="1" > </el-option>
                            <el-option label="个人客户" :value="2" > </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务客户" prop="enterpriseName">
                        <el-input v-model="addForm.enterpriseName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="合同编号" prop="projectContractId">
                        <el-select v-model="addForm.projectContractId" :disabled="organizationFlag" clearable placeholder="请选择合同编号">
                            <el-option v-for="item in contractList" :key="item.id" :label="item.contractNumber" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="招标负责人" prop="bidUserId">
                        <el-select v-model="addForm.bidUserId" :disabled="organizationFlag" clearable placeholder="招标负责人">
                            <el-option v-for="item in bidUserList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
					</el-form-item>
                    <el-form-item label="发布公布日期" prop="issueDate">
                        <el-date-picker type="date" v-model="addForm.issueDate" :disabled="organizationFlag" placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
                    </el-form-item>
					<el-form-item label="招标日期" prop="bidDate">
						<el-date-picker type="date" v-model="addForm.bidDate" :disabled="organizationFlag" placeholder="请选择" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
					</el-form-item>
					<el-form-item label="招标信息链接" prop="bidInfoLink">
						<el-input v-model="addForm.bidInfoLink" :disabled="organizationFlag"  maxlength=200 placeholder="请输入" clearable></el-input>
					</el-form-item>
                </div>
                </el-collapse-item>
                    <el-collapse-item title="条款信息" name="2">
                        <div class="flex-panel">
					<el-form-item label="项目介绍内容" prop="introduceContent" class="big">
						<el-input type="textarea" v-model="addForm.introduceContent" :disabled="organizationFlag" maxlength=2000 placeholder="请输入" :row="8" clearable></el-input>
					</el-form-item>
					<el-form-item label="违约责任" prop="breakResponsibility" class="big">
						<el-input type="textarea" v-model="addForm.breakResponsibility" :disabled="organizationFlag"  maxlength=2000 placeholder="请输入" :row="8" clearable></el-input>
					</el-form-item>
					<el-form-item label="评分标准" prop="gradeStandard" class="big">
						<el-input type="textarea" v-model="addForm.gradeStandard" :disabled="organizationFlag"  maxlength=2000 placeholder="请输入" :row="8" clearable></el-input>
					</el-form-item>
					<el-form-item label="其他要求" prop="otherRequirement" class="big">
						<el-input type="textarea" v-model="addForm.otherRequirement" :disabled="organizationFlag"  maxlength=2000 placeholder="请输入" :row="5" clearable></el-input>
					</el-form-item>
					<el-form-item label="招标文件" prop="bidFile">
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
        <el-dialog title="选择项目" :visible.sync="dialogProject" :append-to-body="true" width="70%" >
            <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>
                <div class="row form-horizontal search-box">
                    <div class="form-box">
                        <div class="form-group">
                            <label class="control-label">项目名称</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.projectName" placeholder="请输入项目名称" clearable />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">项目编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.projectNo" placeholder="请输入项目编号" clearable />
                            </div>
                        </div>
                        <!--<div class="form-group">
                            <label class="control-label">合同编号</label>
                            <div class="input-group">
                                <el-input  v-model="searchParam.contractNo" placeholder="请输入合同编号" clearable />
                            </div>
                        </div>-->
                    </div>
                    <div class="search-btn-list">
                        <el-button type="primary" class="defaultSearchButton" size="small" @click="handleCurrentChange(1)">查询</el-button>
                        <el-button size="small" @click="resetList()">重置</el-button>
                    </div>
                </div>
                <div class="row">
                    <el-table :data="list" style="width: 100%;" border max-height="250">
                        <el-table-column fixed="left" label="操作" min-width="50">
                            <template slot-scope="scope">
                                <el-button @click="changeProject(scope.row)" type="text" size="small">选择</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="projectName" label="项目名称"  min-width="200" ></el-table-column>
                        <el-table-column prop="projectNo" label="项目编号" min-width="250"></el-table-column>
                        <el-table-column prop="customerType" label="客户类型" min-width="120">
                            <template slot-scope="scope">
                                <template v-if="scope.row.customerType==1">企业客户</template>
                                <template v-if="scope.row.customerType==2">个人客户</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enterpriseName" label="服务客户" min-width="120"></el-table-column>
                        <el-table-column prop="projectLeader" label="项目负责人" min-width="120"></el-table-column>
                        <el-table-column prop="totalAmount" label="项目总金额" min-width="120"></el-table-column>
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
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelect from '@/components/CitySelect/index'
    import UploadPanel from '@/components/UploadPanel/index'
    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'

    export default {
        mixins: [tool, ruleTool],
        name: "coreProjectBidForm",
        components: {TreeSelect, CitySelect, MoneyInput,UploadPanel},
        data() {
            return {
                activeNames: ['2', '1'],
                organizationFlag: true,
                dialogProject: false,
                imgs:[],
                organization:[],
                bidUserList:[],
                contractList:[],
                addForm: {},
                //listUrl:'core/coreProjectBid/projectlist',
                rules:{
                    organizationId: [
                        { required: true, message: '请选择所在组织', trigger:'change'},
                    ],
                    bidNo: [
                        { required: true, message: '请输入招标编号', trigger:'blur'},
                    ],
                    bidUserId: [
                        { required: true, message: '请选择招标负责人', trigger:'change'},
                    ],
                    issueDate: [
                        { required: true, message: '请选择发布公布日期', trigger:'change'},
                    ],
                    bidDate: [
                         { required: true, message: '请选择招标日期', trigger:'change'},
                    ],
                    bidInfoLink: [
                        { required: true, message: '请输入招标信息链接', trigger:'blur'},
                    ],
                    introduceContent: [
                        { required: true, message: '请输入项目介绍', trigger:'blur'},
                    ],
                    breakResponsibility: [
                        { required: true, message: '请输入违约责任', trigger:'blur'},
                    ],
                    gradeStandard: [
                        { required: true, message: '请输入评分标准', trigger:'blur'},
                    ]
                }
            }
        },
        mounted() {
            this.open();
        },
        methods: {
            open() {
                this.addForm = {};
                if (this.$route.query.id) {
                    ajax.get('core/coreProjectBid/detail/' + this.$route.query.id).then(rs => {
                        if(rs.status==0 && rs.data){
                            this.organizationFlag=false;
                            this.organization.push(rs.data.organizationId);
                            this.addForm.organizationId=rs.data.organizationId;

                            if(rs.data.organizationId)
                                this.getBidUser(rs.data.organizationId);
                            if(rs.data.projectReviewId)
                                this.getContract(rs.data.projectReviewId);


                            //this.getEnterpriseList();
                            if(rs.data.bidFile)//转换图片
                                this.imgs=JSON.parse(rs.data.bidFile);
                        }
                        this.addForm = rs.data;
                    });
                }
            },
            getBidUser(organizationId){//获取招标负责人
                ajax.get('core/coreProjectBid/biduserlist?organizationId='+organizationId).then(rs => {
                    this.bidUserList = rs.data;
                });
            },
            getContract(id){//获取合同列表
                ajax.get('core/coreProjectBid/contractlist/'+id).then(rs => {
                    this.contractList = rs.data;
                    /*if(this.contractList && this.contractList.length>0){

                    }*/
                });
            },
            changeProject(row){
                if(row){
                    this.dialogProject=false;
                    //this.addForm.contractNo=row.contractNo;
                    this.addForm.projectReviewId=row.id;
                    this.addForm.projectNo=row.projectNo;
                    this.addForm.enterpriseName=row.enterpriseName;
                    this.addForm.customerType=row.customerType;
                    this.contractList=[];
                    this.addForm.projectContractId='';
                    this.addForm = Object.assign({},this.addForm);
                    this.getContract(row.id);
                }
            },
            openProjectList(){
                debugger
                if (this.addForm.organizationId) {
                    this.dialogProject=true;
                    this.searchParam.organizationId=this.addForm.organizationId;
                    this.getListByUrl('core/coreProjectBid/projectlist?organizationId='+this.searchParam.organizationId);
                }else{
                    this.$message.error("请选择所属组织");
                    return;
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

                    if(this.imgs.length>0)//转换图片
                        this.addForm.bidFile=JSON.stringify(this.imgs);
                    else{
                        this.$message.error("请上传招标文件");
                        return;
                    }

                    ajax.post('core/coreProjectBid/save', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
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
            changeOrganization(data){
                if(data && data.length==1){
                    this.organizationFlag= false;
                    this.addForm={organizationId:data[0].id};
                    this.getBidUser(this.addForm.organizationId);
                 //   this.getEnterpriseList();
                }else{
                    this.organizationFlag= true;
                    this.organization=[];
                    this.addForm={};
                }
            }
        }
    }
</script>

