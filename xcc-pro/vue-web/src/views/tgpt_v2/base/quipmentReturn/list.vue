<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.modalId" clearable filterable placeholder="请选产品型号">
                            <el-option v-for="item in equModals" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>


                       <!-- <el-select v-model="searchParam.modalId" clearable placeholder="请选择产品型号">
                            <el-option
                                v-for="item in equModals"
                                :key="item.id"
                                :label="item.supplierId + ' '+ item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>-->
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供应商</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.supplier" clearable placeholder="请选择供应商">
                            <el-option
                                v-for="item in supplierList"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">退货原因</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.reason" clearable placeholder="请选择退货原因">
                            <el-option
                                v-for="item in reasonList"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.keyWord" clearable placeholder="IMEI、IMSI、订单号"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="returnAdd()">退货登记</el-button>
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showImportExcelBtn" size="mini" @click="importExcel()">导入退货设备</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column min-width="100" label="产品类型" prop="modalType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="产品型号" prop="modalName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="供应商" prop="supplier" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="原订单号" prop="code" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI/IMSI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="管理公司" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="退货原因" prop="reason" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="退货说明" prop="remark" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="退货登记人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="退货登记时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
        </div>

        <!-- 退货登记弹窗 -->
        <el-dialog title="退货登记" class="import-box" :visible.sync="editVisible" :append-to-body="true" width="440px" :close-on-click-modal="false">
            <div class="form-panel">
                <el-form :model="returnForm" :rules="rules" label-position="top" ref="returnForm">
                    <div class="flex-panel">
                        <el-form-item label="IMEI" prop="equipmentId" style="width: 400px;" :rules="rules.required('请选择')">
                            <el-select v-model="returnForm.equipmentId" filterable clearable placeholder="请选择">
                                <el-option v-for="item in imeiList" :key="item.id"
                                           :label="item.imei" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退货原因" prop="reason" style="width: 400px;" :rules="rules.required('请选择')">
                            <el-select v-model="returnForm.reason" clearable placeholder="请选择">
                                <el-option v-for="item in reasonList" :key="item.value"
                                           :label="item.text" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="退货说明" prop="remark" style="width: 400px;">
                            <el-input type="textarea" v-model="returnForm.remark" placeholder="退货说明在150字以内" maxlength="150" clearable></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('returnForm')">保存</el-button>
                <el-button @click="editVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible" :append-to-body="true" width="600px" :close-on-click-modal="false">
            <el-form label-position="top" >
                <el-form-item prop="filePath" v-show="fileUpload">
                    <UploadSubmit ref="uploadSubmit"
                                  :url="'base/baseEquipmentReturn/import'"
                                  name="file">
                        <span class="info-text">
                            提示：请确保文件的格式与 "退货导入模板" 的格式一致。
                            <a href="static/excelTemplate/退货导入模板.xls">下载模板</a>
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
    import ajax from '@/utils/request'
    import {tool,ruleTool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'quipmentReturn',
        mixins: [tool,ruleTool],
        components: { UploadSubmit },
        data() {
            return {
                showSearch: false,
                showAddBtn: true,
                showImportExcelBtn: true,
                listUrl: 'base/baseEquipmentReturn/selectEquipmentReturnList',
                /*产品型号*/
                equModals: [],
                /*供应商*/
                supplierList: [],
                /*退货原因*/
                reasonList: [],
                returnForm: {},
                /*IMEI*/
                imeiList: [],
                editVisible: false,
                fileUpload : true,
                importVisible : false,
                importVisibleError : false,
                importVisibleErrorId : "",
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquModalInfo();
            this.getSupplier();
            this.getReason();
        },
        methods: {
            //获取产品类型
            getEquModalInfo() {
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equModals=res;
                });

                /*ajax.get("base/baseEquipmentModal/type?type=1,2,3").then(
                    res => {
                        if (res.status == 0) {
                            this.equModals = res.data;
                        } else {
                            this.equModals = [];
                        }
                    }
                )*/
            },
            //获取供应商
            getSupplier() {
                ajax.post("base/baseEquipmentReturn/selectSupplier").then(
                    res => {
                        if (res.length > 0) {
                            this.supplierList = res;
                        } else {
                            this.supplierList = [];
                        }
                    }
                )
            },
            //获取退货原因
            getReason() {
                ajax.post("base/baseEquipmentReturn/selectReason").then(
                    res => {
                        if (res.length > 0) {
                            this.reasonList = res;
                        } else {
                            this.reasonList = [];
                        }
                    }
                )
            },
            //IMEI
            getImei() {
                ajax.post("base/baseEquipmentReturn/selectImei").then(
                    res => {
                        if (res.length > 0) {
                            this.imeiList = res;
                        } else {
                            this.imeiList = [];
                        }
                    }
                )
            },
            returnAdd() {
                this.editVisible = true;
                this.returnForm = {};
                this.getImei();

                this.$nextTick(_=>{
                    if(this.$refs["returnForm"]){
                        this.$refs["returnForm"].clearValidate();
                    }
                });
            },
            submitForm(returnForm) {
                var $this = this;
                $this.$refs[returnForm].validate((valid) => {
                    if (valid) {
                        var url = "base/baseEquipmentReturn/saveReturn";
                        ajax.post(url, $this.returnForm).then(res => {
                            if(res.status == 0){
                                $this.$message({message: res.msg,type: 'success'});
                                this.editVisible = false;
                                this.getList();
                            }else {
                                $this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            importExcel() {
                this.importVisibleErrorId = "";
                this.importVisible = true;
                this.$refs.uploadSubmit && this.$refs.uploadSubmit.init();
            }
        }
    }
</script>

