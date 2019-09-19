<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">出售组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="organizationIds" placeholder="请选择所属组织" type="one" clearable
                                     url="admin/organization/tree" @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.originateId">子组织</el-checkbox>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="车牌" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.vehicleSellStatus" placeholder="全部" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option label="待确认" value="1"></el-option>
                            <el-option label="已出售" value="2"></el-option>
                            <el-option label="已作废" value="3"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input  v-model="searchParam.modelName" placeholder="请输入车型" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">出售时间</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="contractDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd" clearable>
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">出售人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.creater" placeholder="请输入姓名" clearable></el-input>
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
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showApprovalBtn && (scope.row.financialConfirmationCode == 1 &&  scope.row.vehicleSellStatusCode == 1)" type="text" @click="apply(scope.row.id)">财务确认</el-button>
                        <el-button v-show="showObsoleteBtn && scope.row.vehicleSellStatusCode != 3" type="text" @click="obsolete(scope.row.id)">作废</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="车牌号" prop="plate" sortable show-overflow-tooltip>
					<template slot-scope="scope">
						<a size="mini" @click="detail(scope.row)">{{scope.row.plate}}</a>
					</template>
				</el-table-column>
				<el-table-column min-width="140" label="车架号" prop="vin" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="车型" prop="modelName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="颜色" prop="colour" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="出售金额(元）" prop="vehicleSellMoney" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="出售人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="出售时间" prop="sellDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="出售组织" prop="originateName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="状态" prop="vehicleSellStatus" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="财务确认" prop="financialConfirmation" sortable show-overflow-tooltip></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'baseVehicleSellProcess',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                organizationFlag: true,
                showSearch: false,
                searchParam: {
                },
                organizationIds:[],
                originateId:[],
                contractDate:[],
                showApprovalBtn: this.getCurrentUserAuthority("baseVehicleSellProcess/approval"),
                showExportExcelBtn: this.getCurrentUserAuthority("baseVehicleSellProcess/excel"),
                showObsoleteBtn: this.getCurrentUserAuthority("baseVehicleSellProcess/obsolete"),
                listUrl: 'base/baseVehicleSellProcess'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            var startDate=this.$route.query.startDate;
            var endDate=this.$route.query.endDate;
            var vehicleSellStatus=this.$route.query.vehicleSellStatus;
            if(vehicleSellStatus){
                this.searchParam.vehicleSellStatus=vehicleSellStatus;
                this.searchParam=Object.assign({},this.searchParam);
            }
            if(startDate && endDate){
                this.contractDate.push(startDate,endDate);
            }
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }

        },
        methods: {
            getListBefore(params) {
                if (this.organizationIds && this.organizationIds.length>0){
                    params.originateId = this.organizationIds[0];
                    this.searchParam.originateId = this.organizationIds[0];
                }else{
                    params.originateId = '';
                    this.searchParam.originateId = '';
                }

                if (this.contractDate && this.contractDate.length>0) {
                    params.contractStartDate = this.contractDate[0];
                    params.contractEndDate = this.contractDate[1];
                    this.searchParam.contractStartDate = this.contractDate[0];
                    this.searchParam.contractEndDate = this.contractDate[1];
                }else{
                    params.contractStartDate = '';
                    params.contractEndDate = '';
                    this.searchParam.contractStartDate = '';
                    this.searchParam.contractEndDate = '';
                }

            },
            changeOrganization(data){

                if(this.organizationIds && this.organizationIds.length==1){
                    this.$set(this.searchParam,'originateId',this.organizationIds[0])
                }else {
                    this.$set(this.searchParam,'originateId','')
                    this.$set(this.searchParam,'organCascade',false)

                }
            },
            resetList(){
                this.searchParam = {};
                this.$set(this.searchParam,'organCascade',false)
                this.organizationIds = [];
                this.contractDate = [];
                this.handleCurrentChange(1);
            },

            apply(id) {
                debugger
                let $this = this;
                $this.$confirm('是否财务确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/baseVehicleSellProcess/financialConfirmation/"+id).then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage("已确认！","success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            obsolete(id) {
                let $this = this;
                $this.$confirm('是否确定作废?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get("base/baseVehicleSellProcess/obsolete/"+id).then((message)=>{
                        this.getList();
                        if(message.status == 0){
                            this.showMessage("已作废！","success");
                        }else{
                            this.showMessage(message.message,"error");
                        }
                    });
                }).catch(() => {});
            },
            exportExcel() {
                window.location = this.exportUrl("base/baseVehicleSellProcess/excel?" + $.param(this.searchParam));
            },
            detail(row){
                let url=this.$route.fullPath;
                if (url.indexOf('?') > -1){
                    let nUrl = url.split('?');
                    this.$router.push({path:nUrl[0]+"/detail/"+row.id});
                }else{
                    this.$router.push({path:url+"/detail/"+row.id});
                }
            },
        }
    }
</script>

