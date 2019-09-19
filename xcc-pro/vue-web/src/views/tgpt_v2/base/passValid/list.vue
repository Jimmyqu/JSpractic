<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">


                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeCompanyId" ></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId" >子组织</el-checkbox>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label">通行证到期日</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="expiryDate"
                            type="daterange"
                            @change="expiryDateChange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">处理状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.dealStatus" placeholder="全部" clearable>
                            <el-option label="未处理" :value="0"></el-option>
                            <el-option label="已处理" :value="1"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌查询" clearable></el-input>
                    </div>
                </div>

            </div>


            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>

        </div>


        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
<!--                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>-->
            </div>
            <div class="pagination">
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
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <a size="mini" v-show="showManageBtn" @click="deal(scope.row)" v-if="scope.row.dealStatus=='未处理'">处理</a>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceRegion" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="companyName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="modelName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车辆状态" prop="vehicleStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服役状态" prop="serviceStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="通行证到期日" prop="passValidDate" sortable show-overflow-tooltip></el-table-column>
             	<!--<el-table-column min-width="100" label="创建人" prop="creater" sortable show-overflow-tooltip></el-table-column>-->
                <el-table-column min-width="140" label="处理状态" prop="dealStatus" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="处理人" prop="dealName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="处理人电话" prop="dealPhone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="处理人部门" prop="dealDept" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="处理时间" prop="dealTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="160" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>

            </el-table>

        </div>

        <el-dialog title="提醒处理" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="dialogForm" ref="dialogForm" :rules="rules" >


                <el-form-item label="处理人姓名" prop="dealName">
                    <el-input v-model="dialogForm.dealName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="处理人电话" prop="dealPhone" >
                    <el-input v-model="dialogForm.dealPhone" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="核实人部门" prop="checkerDept" >
                    <div class="input-group">
                        <tree-select v-model="dealDept" placeholder="请选择部门" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </el-form-item>

                <el-form-item label="处理时间" prop="dealTime" >
                    <el-date-picker
                        v-model="dialogForm.dealTime"
                        type="datetime"
                        placeholder="日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="备注信息"  >
                    <el-input v-model="dialogForm.remark" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('dialogForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import CitySelectPanel from '@/components/CitySelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'passValid',
        mixins: [tool],
        components: { TreeSelect,ConfirmForm,CitySelectPanel },
        data() {
            return {
                showSearch: false,
                showManageBtn:this.getCurrentUserAuthority('passValid/deal'),
                searchParam: {},
                dialogFormVisible:false,
                dialogForm:{
                    dealName:'',
                    dealTime:''
                },
                dealDept:[],
                rules: {
                    dealName: [{required: true, message: '请输入处理人姓名', trigger: 'change'}],
                    dealTime: [{required: true, message: '请选择处理时间', trigger: 'change'}],
                    dealPhone: [{required: true, message: '请输入处理人电话', trigger: 'change'}],
                },
                showExportExcelBtn: this.getCurrentUserAuthority("plate/excel"),

                listUrl: 'base/passValid',
                expiryDate:[],
                companyIds:[],
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            let dealStatus=this.$route.query.dealStatus;
            if(dealStatus){
                this.searchParam.dealStatus=parseInt(dealStatus);
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                if (this.expiryDate && this.expiryDate.length>0) {
                    params.startTime = this.expiryDate[0];
                    params.endTime = this.expiryDate[1];
                    this.searchParam.startTime = this.expiryDate[0];
                    this.searchParam.endTime = this.expiryDate[1];
                }else{
                    params.startTime = '';
                    params.endTime = '';
                    this.searchParam.startTime = '';
                    this.searchParam.endTime = '';
                }
              /*  if (this.companyIds && this.companyIds.length>0) {
                    params.companyId = this.companyIds[0];
                    this.searchParam.companyId = this.companyIds[0];
                }else{
                    params.companyId = '';
                    this.searchParam.companyId = '';
                }*/

            },
            changeCompanyId(data){
                if(this.companyIds && this.companyIds.length==1)
                    this.searchParam.companyId=this.companyIds[0];
                else{
                    this.searchParam.companyId="";
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            changeOrganization(data){
                if(this.dealDept && this.dealDept.length==1){
                    this.dialogForm.dealDept = this.dealDept[0];
                }else{
                    this.dialogForm.dealDept = "";
                }
            },
            exportExcel() {
                window.location = this.exportUrl("base/plate/excel?" + $.param(this.searchParam));
            }
            ,resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.expiryDate=[];
                this.companyIds=[];
                this.handleCurrentChange(1);
            },
            expiryDateChange() {
                if(this.expiryDate && this.expiryDate.length>0){
                    let expiryDate = this.expiryDate;
                    this.searchParam.startTime = expiryDate[0] + ' 00:00:00';
                    this.searchParam.endTime = expiryDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startTime="";
                    this.searchParam.endTime="";
                }
            },
            deal(row){
                this.dialogFormVisible=true;
                this.dialogForm.id = row.id;
                this.dialogForm.dealTime = (new Date()).format('yyyy-MM-dd HH:mm:ss');
            },
            submitForm(form) {
                console.log(this.dialogForm);
                var data = this.dialogForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    ajax.post('base/passValid/deal', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.dialogForm.dealName = '';
                            this.getList();
                        } else {
                            this.$message.error(rs.msg);
                        }
                    });
                });
            }

        }
    }
</script>

