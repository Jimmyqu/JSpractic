<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">ETC卡号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.etcNum" placeholder="请输入ETC卡号" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
          <!--  <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>-->
            <div class="operation">
                <el-button type="primary" size="mini" @click="getList()">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="dialogFormShow()">导入</el-button>
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

            <el-table border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button v-show="showDeltn" type="text" @click="del(scope.row)">删除</el-button>
                        <el-button v-show="showRecharge" type="text" @click="recharge(scope.row)">充值</el-button>
                        <el-button  type="text" @click="toDetail(scope.row)">充值记录</el-button>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="ETC卡号" prop="etcNum" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="服务组织" prop="serviceRegionName" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="分配车辆" prop="plate" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="余额(元)" prop="balance" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作人" prop="updater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>

        <!--充值,消费对话框-->
        <el-dialog title="充值" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="addForm"  label-position="top" ref="addForm" label-width="100px" v-cloak>
                <el-form-item label="车牌" :label-width="'120px'">
                    <el-input v-model="addForm.plate" autocomplete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="当前余额(元)" :label-width="'120px'">
                    <el-input v-model="addForm.balance" autocomplete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="充值金额(元)" :label-width="'120px'">
                    <money-input v-model="addForm.money" :rules="[rules.money()]"  placeholder="请输入" clearable></money-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="'120px'">
                    <el-input v-model="addForm.remark" maxlength="50"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
               <!-- <el-form-item label="管理公司" required>
                    <tree-select v-model="exportOrganization" placeholder="请选择服务组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeExportOrganization"></tree-select>
                </el-form-item>-->
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit" :visible="importVisible"
                                  :url="'traffic/trafficVehicleEtc/import'"
                                  name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "ETC卡导入模板" 的格式一致。
                            <a href="static/excelTemplate/ETC卡导入模板.xls">下载模板</a>
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


</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import MoneyInput from '@/components/MoneyInput/index'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool ,ruleTool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'trafficVehicleEtc',
        mixins: [tool, ruleTool],
        components: {ConfirmForm ,UploadSubmit, TreeSelect, MoneyInput },
        data() {
            return {
                //this.getCurrentUserAuthority("traffic/refuelingRegistration/import")
                importVisible : false,
                importVisibleError : false,
                //exportOrganization : [],
                //companyId:'',
                showImportBtn : this.getCurrentUserAuthority("trafficVehicleEtc/import"),
                showEditBtn: true,
                showDeltn: this.getCurrentUserAuthority("trafficVehicleEtc/delete"),
                showRecharge: this.getCurrentUserAuthority("trafficVehicleEtc/recharge"),
                showAddBtn: true,
                showExportExcelBtn: true,
                addForm:{},
                searchParam: {
                },
                organizationIds:[],
                listUrl: 'traffic/trafficVehicleEtc',
                dialogFormVisible: false,
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.organizationIds=[];
                this.$set(this.searchParam,'organCascade',false)
                this.getList();
            },
            changeOrganization(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.$set(this.searchParam,'companyId',this.organizationIds[0])
                }else {
                    this.$set(this.searchParam,'companyId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
           /* getListBefore(params) {
                if (this.organizationIds && this.organizationIds.length>=1){
                    params.companyId = this.organizationIds[0];
                }else {
                    params.companyId ='';
                }
            },*/
            /*删除*/
            del(data){
                this.$confirm('确认删除?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    data.status = 0;
                    ajax.post('traffic/trafficVehicleEtc/', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getList();
                        }
                    });
                });
            },

            /*充值*/
            recharge(row){
                this.dialogFormVisible = true;
                this.addForm.etcId=row.id;
                this.addForm.balance=row.balance;
                this.addForm.plate=row.plate;
                this.addForm.money = 0;
            },
            exportExcel() {
                var params=this.searchParam;
                if (this.organizationIds && this.organizationIds.length>=1){
                    params.companyId = this.organizationIds[0];
                }else {
                    params.companyId ='';
                }
                window.location = this.exportUrl("traffic/trafficVehicleEtc/excel?" + $.param(params));
            },//保存提交
            submitForm: function (form) {
                var data = this.addForm;
                this.$refs[form].validate((valid) => {
                    if (!valid) {
                        this.$message.error('校验不通过，请检查输入项');
                        return;
                    }
                    ajax.post('traffic/trafficVehicleEtc/saveDetail', data).then(rs => {
                        if (rs.status == 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                        }
                    });
                });
            },
            dialogFormShow(){
                this.importVisible = true;
            },
           /* changeExportOrganization(){
                if(this.exportOrganization && this.exportOrganization.length==1){
                    this.companyId=this.exportOrganization[0];
                }else{
                    this.companyId = '';
                }
            }*/
        }
    }
</script>

