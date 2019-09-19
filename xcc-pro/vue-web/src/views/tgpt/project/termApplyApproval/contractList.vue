<template>
    <el-dialog :visible.sync="show" title="选择项目合同" width="90%"
               :append-to-body="true">
        <div id="app" class="wrapper wrapper-content animated fadeInRight list-panel" v-cloak>
            <div class="row form-horizontal search-box">
                <div class="form-box">
                    <div class="form-group">
                        <label class="control-label">合同编号</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.contractNo" clearable autocomplete="off" placeholder="请输入项目合同编号"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">服务客户</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.enterpriseName" clearable autocomplete="off" placeholder="请输入服务客户"></el-input>
                        </div>
                    </div>

                </div>
                <div class="search-btn-list">
                    <el-button size="small" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                </div>
            </div>
            <div class="row">
                <el-table v-loading="listLoading" :data="list" style="width: 100%" border>
                    <el-table-column fixed label="操作" width="50">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="selectContract(scope.row)" type="text" size="small">
                                选择
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractNo" sortable label="项目合同编号" min-width="200"></el-table-column>
                    <el-table-column prop="enterpriseName" sortable label="服务客户" min-width="150"></el-table-column>
                    <el-table-column prop="contractStartDate" sortable label="协议开始日期" min-width="120"></el-table-column>
                    <el-table-column prop="contractEndDate" sortable label="协议结束日期" min-width="120"></el-table-column>
                    <el-table-column prop="contractStatusText" sortable label="项目合同状态" min-width="120"></el-table-column>
                    <el-table-column prop="settlementModelText" sortable label="结算方式" min-width="100"></el-table-column>
                    <el-table-column prop="paymentModelText" sortable label="付款方式" min-width="120"></el-table-column>
                    <el-table-column prop="paymentCycle" sortable label="付款周期（日）" min-width="120"></el-table-column>
                    <el-table-column prop="settlementDate" sortable label="结算日" min-width="100"></el-table-column>
                    <el-table-column prop="invoiceTaxRateDriver" sortable label="税金（司机）" min-width="120"></el-table-column>
                    <el-table-column prop="invoiceTaxRateVehicle" sortable label="税金（车）" min-width="120"></el-table-column>
                    <el-table-column prop="companyName" sortable show-tool-tip label="所属组织" min-width="150"></el-table-column>
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

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'

    export default {
        name: "confirm",
        mixins: [tool],
        data(){
            return {
                show:false,
                listUrl:"core/projectterms/contractlist",
            }
        },
        methods:{
            open(){
                this.show = true;
                this.getList();
            },
            selectContract(row){
                this.show = false;
                this.$emit('load',row);
            }
        },
        mounted(){

        }
    }
</script>
