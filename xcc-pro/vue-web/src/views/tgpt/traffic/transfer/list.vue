<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box min">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" clearable type="text" placeholder="请输入订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.transferStatus" clearable>
                            <el-option
                                v-for="(value, key) in transferStatusMap"
                                :key="key"
                                :label="value"
                                :value="key">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">申请时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="transferDate"
                            @change="transferDateChange"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="warning" size="mini" @click="add()" v-show="addQx">新增</el-button>
                <el-button type="primary" class="defaultSearchButton" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button type="small" @click="resetList()" size="mini">重置</el-button>
                <el-button size="mini" @click="exportExcel()" v-show="exportQx">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%">
                <el-table-column fixed label="操作" min-width="120">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row.id)" type="text" size="small" v-if="scope.row.transferStatus == 10 || scope.row.transferStatus == 30" v-show="editQx">编辑</el-button>
                        <el-button @click="submitData(scope.row)" type="text" size="small" v-if="scope.row.transferStatus == 10" v-show="submitQx">提交</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="code" sortable fixed label="调拨申请单号" min-width="200">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="qut" sortable label="调拨车台数" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column prop="totalCost" sortable label="预计总费用(元)" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column prop="creater" sortable label="申请人" show-overflow-tooltip min-width="120"></el-table-column>
                <el-table-column prop="createTime" sortable label="申请时间" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column prop="transferStatusText" sortable label="状态" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column prop="creater" sortable label="创建人" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="createTime" sortable label="创建时间" show-overflow-tooltip min-width="140"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ConfirmForm from '@/views/tgpt/project/contract/confirm'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcess} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficTransfer',
        mixins: [tool],
        data(){
            return {
                showSearch:false,
                addQx: this.getCurrentUserAuthority("core/transfer/insert"),
                editQx: this.getCurrentUserAuthority("core/transfer/update"),
                exportQx: this.getCurrentUserAuthority("core/transfer/export"),
                submitQx: this.getCurrentUserAuthority("core/transfer/submit"),
                listUrl:"core/transfer/list",
                transferStatusMap: {},
                transferDate:[],
                formData:{}
            }
        },
        activated(){
            this.getList();
        },
        beforeMount: function() {
            this.init();
        },
        mounted: function() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            //页面初始化数据
            init() {
                //状态
                ajax.get("core/transfer/getTransferEnumData/transfer_status").then(result =>{
                    if(result.status == 0){
                        this.transferStatusMap = result.data;
                    }
                });
            },
            //新增
            openForm(id){
                this.$refs.form.open(id);
            },
            //提交审批
            submitData(row) {
                this.$confirm('确认提交审批?')
                    .then(_ => {
                        startProcess(row.id, "CLDPSQD", (result) => {
                                if(result.status == 0){
                                    this.showMessage("提交成功","success");
                                    this.getList();
                                }else{
                                    this.showMessage(result.message,"error");
                                }
                            }
                        );
                    })
                    .catch(_ => {
                    });
            },
            transferDateChange() {
                if(this.transferDate && this.transferDate.length>0){
                    let createDate = this.transferDate;
                    this.searchParam.startDate = createDate[0] + ' 00:00:00';
                    this.searchParam.endDate = createDate[1] + ' 23:59:59';
                }else{
                    this.searchParam.startDate="";
                    this.searchParam.endDate="";
                }
            },
            //导出
            exportExcel:function () {

                window.location.href = this.exportUrl("core/transfer/export?" + $.param(this.searchParam));
            },
            resetList(){
                this.transferDate=[];
                this.searchParam={};
                this.handleCurrentChange(1);
            }
        }

    }
</script>

