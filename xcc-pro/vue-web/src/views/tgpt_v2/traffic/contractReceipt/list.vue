<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" placeholder="请输入合同编号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">承租人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.renterOrPhone" placeholder="请输入承租人/承租人手机号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">有无到期未收</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.existNotReceived" placeholder="请选择有无到期未收" clearable>
                            <el-option label="有" :value="1"></el-option>
                            <el-option label="无" :value="0"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organization" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.organizationId">子组织</el-checkbox>
                    </div>
                </div>

            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出</el-button>

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
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showUrgeBtn" v-if="scope.row.existNotReceived == 1 && scope.row.contractStatus != 70 " type="text" @click="urge(scope.row)">一键催收</el-button>
                        <el-button v-show="showDetailBtn" type="text"  @click="receiptDetail(scope.row.id)">收款明细</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="160" label="合同编号" prop="contractNumber" sortable show-overflow-tooltip>
                   <!-- <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.maintenanceNum}}</a>
                    </template>-->
                </el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="承租人" prop="renter" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="承租人手机号" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="合同状态" prop="contractStatusText" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="合同总金额(元)" prop="contractAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="到期应收金额(元)" prop="dueAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="已收金额(元)" prop="receivedAmount" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="120" label="有无到期未收" prop="existNotReceivedText" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>

        <el-dialog title="提示" :visible.sync="visible" custom-class="urge-dialog" :close-on-click-modal="false">
            <div class="content">
                <span>是否确认给客户</span>
                <el-input v-model="phone" maxlength="11" clearable ></el-input>
                <span>发送合同款逾期催收短信？</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="send">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'


    export default {
        name: 'contractReceipt',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                showUrgeBtn:this.getCurrentUserAuthority("traffic/trafficReceiptRegistration/urge"),
                showDetailBtn : this.getCurrentUserAuthority("traffic/trafficReceiptRegistration/detail"),
                showExportExcelBtn : this.getCurrentUserAuthority("traffic/trafficReceiptRegistration/export"),
                organization:[],
                searchParam: {
                },
                listUrl: 'traffic/trafficReceiptRegistration',
                visible:false,
                phone:'',
                contractId:''
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var contractNumber = this.$route.query.contractNumber;
            if(contractNumber)
                this.searchParam.contractNumber=contractNumber;
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false)
                this.organization=[];
                this.creatDate=[];
                this.getList();
            },
            exportExcel() {
                window.location = this.exportUrl("traffic/trafficReceiptRegistration/excel?" + $.param(this.searchParam));
            },
            changeOrganization(data){

                if(this.organization && this.organization.length==1){
                    this.$set(this.searchParam,'organizationId',this.organization[0])
                }else {
                    this.$set(this.searchParam,'organizationId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            receiptDetail(id){
                let url=this.$route.fullPath;
                this.$router.push({path:"/tgpt_v2/traffic/contractReceipt/detail/"+id});
            },
            urge(row){
                this.phone = row.phone;
                this.visible = true;
                this.contractId = row.id;
            },
            cancel(){
                this.visible = false;
            },
            send(){
                if(this.phone && this.phone != ''){
                    let url = "traffic/trafficReceiptRegistration/urge";
                    let data = {
                        contractId : this.contractId,
                        phone : this.phone
                    };
                    ajax.post(url, data) .then(res => {
                        if(res.status == 0){
                            this.$message({message: '催收成功！',type: 'success'});
                        }else {
                            this.$message.error(res.msg);
                        }
                        this.visible = false;
                    }).catch(_=>{

                    });
                }else{
                    this.$message.error("请输入手机号");
                   return;
                }
            }
        }
    }
</script>

<style lang="scss">
    .urge-dialog{
        width: 500px;
        .content{
            display: flex;
            align-items: center;
            padding: 10px 0;
            .el-input{
                width: 30%;
                margin: 0 10px;
            }
        }
    }
</style>
