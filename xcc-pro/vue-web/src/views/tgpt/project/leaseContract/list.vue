<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" clearable autocomplete="off"
                                  placeholder="请输入合同编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">供车单位</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.providerCompanyName" clearable autocomplete="off"
                                  placeholder="请输入供车单位"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同开始日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractStartDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同结束日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractEndDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同退出日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractOutDate"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同状态</label>
                    <div class="input-group">
                        <el-select placeholder="不限" clearable multiple collapse-tags v-model="contractStatus">
                            <el-option label="执行中" value="30"></el-option>
                            <el-option label="已到期" value="40"></el-option>
                            <el-option label="已续签" value="60"></el-option>
                            <el-option label="已退出" value="90"></el-option>
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

                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1);">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>

                <el-button  v-show="showExportBtn" size="mini" @click="exportData">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" border style="width: 100%" :data="list">
                <el-table-column prop="contractNumber" fixed="left" sortable label="合同编号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.contractNumber}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="providerCompanyName" sortable show-overflow-tooltip label="供车单位" min-width="120"></el-table-column>
                <el-table-column prop="contractStartDate" sortable label="合同开始日期" min-width="120"></el-table-column>
                <el-table-column prop="contractEndDate" sortable label="合同结束日期" min-width="120"></el-table-column>
                <el-table-column prop="contractAmount" sortable label="合同总金额(元)" min-width="120"></el-table-column>
                <el-table-column prop="contractStatusText" sortable label="状态" min-width="140"></el-table-column>
                <el-table-column prop="contractOutDate" sortable label="退出日期" min-width="100"></el-table-column>
            </el-table>
        </div>

        <ConfirmForm ref="confirmForm" @load="getList"></ConfirmForm>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'leaseContract',
        mixins: [tool],
        components: { ConfirmForm,TreeSelect },
        data(){
            return {
                listUrl: "/core/leaseContract/list",
                transmissionList:[],
                formData: {},
                modelForm:{},
                organization:[],
                showExportBtn:this.getCurrentUserAuthority("core/leaseContract/export"),
                showSearch: false,
                branchOffice: [],
                contractStartDate:[],
                contractEndDate:[],
                contractOutDate:[],
                contractStatus:[],
                commitDisabled:false,
                renewDisabled:false
            }
        },
        // 返回页面调用
        activated(){
            this.getList();
        },
        mounted: function () {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(params){
                if (this.contractStartDate && this.contractStartDate.length>0) {
                    params.contractStartDate1 = this.contractStartDate[0];
                    params.contractStartDate2 = this.contractStartDate[1];
                    this.searchParam.contractStartDate1 = this.contractStartDate[0];
                    this.searchParam.contractStartDate2 = this.contractStartDate[1];
                }else{
                    params.contractStartDate1 = '';
                    params.contractStartDate2 = '';
                    this.searchParam.contractStartDate1 = '';
                    this.searchParam.contractStartDate2 = '';
                }

                if (this.contractEndDate && this.contractEndDate.length>0) {
                    params.contractEndDate1 = this.contractEndDate[0];
                    params.contractEndDate2 = this.contractEndDate[1];
                    this.searchParam.contractEndDate1 = this.contractEndDate[0];
                    this.searchParam.contractEndDate2 = this.contractEndDate[1];
                }else{
                    params.contractEndDate1 = '';
                    params.contractEndDate2 = '';
                    this.searchParam.contractEndDate1 = '';
                    this.searchParam.contractEndDate2 = '';
                }
                if (this.contractOutDate && this.contractOutDate.length>0) {
                    params.contractOutStartDate = this.contractOutDate[0];
                    params.contractOutEndDate = this.contractOutDate[1];
                    this.searchParam.contractOutStartDate = this.contractOutDate[0];
                    this.searchParam.contractOutEndDate = this.contractOutDate[1];
                }

                if(this.contractStatus && this.contractStatus.length>0){
                    params.contractStatus=this.contractStatus.join(',');
                    this.searchParam.contractStatus=this.contractStatus.join(',');
                }else{
                    params.contractStatus=[];
                    this.searchParam.contractStatus='';
                }
            },
            exportData(){
                window.location.href=this.exportUrl("core/leaseContract/export?"+$.param(this.searchParam));
            },
            resetList(){
                this.searchParam={};
                this.contractStartDate=[];
                this.contractEndDate=[];
                this.contractStatus=[];
                this.contractOutDate=[];
                this.handleCurrentChange(1);
            }
        }
    }
</script>

