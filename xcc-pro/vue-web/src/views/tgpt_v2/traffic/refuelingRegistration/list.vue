<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择服务组织" type="one"
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade"  :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">加油时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">油费承担</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.oilBear" placeholder="" clearable>
                            <el-option label="公司承担油费" value="1"></el-option>
                            <el-option label="客户自行承担" value="2"></el-option>
                            <el-option label="其它" value="3"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">支付方式</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.paymentMethod" placeholder="" clearable>
                            <el-option label="现金" value="1"></el-option>
                            <el-option label="油卡" value="2"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">金额</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.amount" placeholder="" clearable>
                            <el-option label="<=100元" value="1"></el-option>
                            <el-option label="100元到300元" value="2"></el-option>
                            <el-option label="300元到500元" value="3"></el-option>
                            <el-option label=">=500元" value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">加油量</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.addOil" placeholder="" clearable>
                            <el-option label="<=10L" value="1"></el-option>
                            <el-option label="10L到30L" value="2"></el-option>
                            <el-option label="30L到50L" value="3"></el-option>
                            <el-option label=">=50L" value="4"></el-option>
                        </el-select>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>

        <div class="tool-box">
            <div class="operation">

                <el-button  v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="showImportBtn" @click="dialogFormShow()">导入</el-button>
                <el-button  v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>
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
        <div class="content" v-loading="listLoading">
            <el-tabs class="content-left" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="加油登记主页" name="1">
                    <div class="table-box">
                        <div class="table-content">
                            <el-table  :ref="getRefName" :max-height="tableHeight"  border :data="list" style="width: 100%">
                                <el-table-column label="操作" min-width="140">
                                    <template slot-scope="scope">
                                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                                        <el-button   type="text" @click="toRecord(scope.row.plate)">加油明细</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="plate" sortable label="车牌" min-width="100"></el-table-column>
                                <el-table-column prop="serviceRegionName" sortable label="服务组织" min-width="140"></el-table-column>
                                <el-table-column prop="oilBearText" sortable label="油费承担" min-width="100"></el-table-column>
                                <el-table-column prop="oilTimeText" sortable label="加油时间" min-width="140"></el-table-column>
                                <el-table-column prop="addOil" sortable label="加油量(L)" min-width="100"></el-table-column>
                                <el-table-column prop="fuelTypeText" sortable label="燃油类型" min-width="100"></el-table-column>
                                <el-table-column prop="oilUnitPrice" sortable label="单价(元)" min-width="80"></el-table-column>
                                <el-table-column prop="paymentMethodText" sortable label="支付方式" min-width="80"></el-table-column>
                                <el-table-column prop="thisMileage" sortable label="加油里程(km)" min-width="120"></el-table-column>
                                <el-table-column prop="amount" sortable label="金额(元)" min-width="120"></el-table-column>
                                <el-table-column prop="oilPeople" sortable label="加油人" min-width="120"></el-table-column>
                                <el-table-column prop="totalAmount" class-name="a_key" sortable label="累计金额(元)" min-width="120"></el-table-column>
                                <el-table-column prop="totalAddOil" class-name="a_key" sortable label="累计加油量(L)" min-width="120"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="加油明细记录" name="2">
                    <div class="table-box table-box-more">
                        <div class="table-content">
                            <el-table  :ref="getRefName" :max-height="tableHeight"  border :data="list" style="width: 100%">
                                <el-table-column label="操作" min-width="80">
                                    <template slot-scope="scope">
                                         <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="refuelingNo" sortable label="编号" min-width="160"></el-table-column>
                                <el-table-column prop="plate" sortable label="车牌" min-width="100"></el-table-column>
                                <el-table-column prop="serviceRegionName" sortable label="服务组织" min-width="140"></el-table-column>
                                <el-table-column prop="oilBearText" sortable label="油费承担" min-width="100"></el-table-column>
                                <el-table-column prop="oilTimeText" sortable label="加油时间" min-width="140"></el-table-column>
                                <el-table-column prop="addOil" sortable label="加油量(L)" min-width="100"></el-table-column>
                                <el-table-column prop="fuelTypeText" sortable label="燃油类型" min-width="100"></el-table-column>
                                <el-table-column prop="oilUnitPrice" sortable label="单价(元)" min-width="80"></el-table-column>
                                <el-table-column prop="paymentMethodText" sortable label="支付方式" min-width="80"></el-table-column>
                                <el-table-column prop="thisMileage" sortable label="加油里程(km)" min-width="120"></el-table-column>
                                <el-table-column prop="amount" sortable label="金额(元)" min-width="120"></el-table-column>
                                <el-table-column prop="oilPeople" sortable label="加油人" min-width="120"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog title="批量导入" class="import-box" :visible.sync="importVisible"
                   :append-to-body="true" width="600px">
            <el-form label-position="top" >
                <!--<el-form-item label="管理公司" required>
                    <tree-select v-model="exportOrganization" placeholder="请选择服务组织" type="one"
                                 url="admin/organization/tree?noManager=noManager" @change="changeExportOrganization"></tree-select>
                </el-form-item>-->
                <el-form-item prop="filePath" >
                    <UploadSubmit ref="uploadSubmit" :visible="importVisible"
                                  :url="'traffic/refuelingRegistration/import'"
                                   name="importfile" @load="getList">
                        <span class="info-text">
                            提示：请确保文件的格式与 "加油登记导入模板" 的格式一致。
                            <a href="static/excelTemplate/加油登记导入模板.xlsx">下载模板</a>
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
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'
    import TreeSelect from '@/components/TreeSelect/index'
    import UploadSubmit from '@/components/UploadSubmit'

    export default {
        name: 'refuelingRegistration',
        mixins: [tool],
        components: { ConfirmForm ,UploadSubmit,TreeSelect },
        data() {
            return {
                importVisible : false,
                importVisibleError : false,
                showAddBtn : this.getCurrentUserAuthority("traffic/refuelingRegistration/add"),
                showEditBtn : this.getCurrentUserAuthority("traffic/refuelingRegistration/edit"),
                showExportExcelBtn : this.getCurrentUserAuthority("traffic/refuelingRegistration/export"),
                showImportBtn : this.getCurrentUserAuthority("traffic/refuelingRegistration/import"),
                showSearch: false,
                activeName: "1",
                searchParam: {
                },
                organizationIds:[],
                contractDate:[],
                listUrl: 'traffic/refuelingRegistration/main/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var plate = this.$route.query.plate;
            if(plate){
                this.searchParam.plate = plate;
            }
            var regionId = this.$route.query.regionId;
            if(regionId){
                this.organizationIds = [regionId];
                this.searchParam.companyId = regionId;
            }
            var startTime = this.$route.query.startTime;
            var endTime = this.$route.query.endTime;
            if(startTime && endTime){
                this.contractDate = [startTime,endTime];
                this.activeName="2";
                this.listUrl = 'traffic/refuelingRegistration/record/list';
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params) {
                params=this.getParams(params);
            },
            resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false)
                this.organizationIds = [];
                this.contractDate = [];
                this.handleCurrentChange(1);
            },
            exportExcel() {
                var params=this.getParams(this.searchParam);
                var url = 'traffic/refuelingRegistration/main/export?';
                if(this.activeName == "2"){
                    url = 'traffic/refuelingRegistration/record/export?';
                }
                window.location = this.exportUrl(url + $.param(params));
            },
            handleClick(){
                if(this.activeName == "2"){
                    this.listUrl = 'traffic/refuelingRegistration/record/list';
                }else {
                    this.listUrl = 'traffic/refuelingRegistration/main/list';
                }
                this.list=[];
                this.handleCurrentChange(1);
            },
            changeOrganization(data){
                if(this.organizationIds && this.organizationIds.length==1){
                    this.$set(this.searchParam,'companyId',this.organizationIds[0])
                }else {
                    this.$set(this.searchParam,'companyId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            getParams(param){
                var params = param;
                switch (parseInt(params.addOil)) {
                    case 1:
                        delete params.startAddOil;
                        params.endAddOil=10;
                        break;
                    case 2:
                        params.startAddOil=10;
                        params.endAddOil=30;
                        break;
                    case 3:
                        params.startAddOil=30;
                        params.endAddOil=50;
                        break;
                    case 4:
                        params.startAddOil = 50;
                        delete params.endAddOil;
                        break;
                    default:
                         delete params.startAddOil;
                         delete params.endAddOil;
                }

                switch (parseInt(params.amount)) {
                    case 1:
                        delete params.startAmount;
                        params.endAmount=100;
                        break;
                    case 2:
                        params.startAmount=100;
                        params.endAmount=300;
                        break;
                    case 3:
                        params.startAmount=300;
                        params.endAmount=500;
                        break;
                    case 4:
                        params.startAmount = 500;
                        delete params.endAmount;
                        break;
                    default:
                        delete params.startAmount;
                        delete params.endAmount;
                }

                if (this.organizationIds && this.organizationIds.length>=1){
                    params.companyId = this.organizationIds[0];
                }else {
                    delete params.companyId;
                }
                if (this.contractDate && this.contractDate.length>1) {
                    params.startTime = this.contractDate[0]+" 00:00:00";
                    params.endTime = this.contractDate[1]+" 23:59:59";
                }else {
                    delete params.startTime;
                    delete params.endTime;
                }
                return params;
            },dialogFormShow(){
                this.importVisible = true;
            },
            toRecord(plate){
                this.searchParam = {
                    plate:plate
                };
               this.organizationIds = [];
                this.contractDate = [];
                this.activeName="2";
                this.handleClick();
            },

        }
    }
</script>

<style rel="stylesheet/scss"  lang="scss">
    .newList-panel .a_key {
        color: #245269;
    }
</style>
