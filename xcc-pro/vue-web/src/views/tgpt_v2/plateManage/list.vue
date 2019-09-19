<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">指标编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.indicatorNumber" placeholder="请输入指标编号查询" clearable></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">所在城市</label>
                    <div class="input-group">
                        <city-select-panel :value.sync="nearCity4" @change="changeCity()" clearable ref="citySelect"></city-select-panel>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group organ_wrap">
                        <tree-select v-model="companyIds" placeholder="请选择所属组织" type="one"
                                     url="admin/organization/tree?noManager=noManager"  @change="changeOrganization"></tree-select>
                        <el-checkbox v-model="searchParam.organCascade" :disabled="!searchParam.companyId">子组织</el-checkbox>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">指标类型</label>
                    <div class="input-group">
                        <el-select v-model="indicatorType" multiple collapse-tags placeholder="全部" clearable>
                            <el-option label="油车指标" value="1"></el-option>
                            <el-option label="油电指标" value="2"></el-option>
                            <el-option label="纯电指标" value="3"></el-option>
                            <el-option label="县际牌指标" value="4"></el-option>
                            <el-option label="市际牌指标" value="5"></el-option>
                        </el-select>
                    </div>
                </div>


                <div class="form-group">
                    <label class="control-label">到期日</label>
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
                    <label class="control-label">使用性质</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.natureType" placeholder="全部" clearable>
                            <el-option label="自用" value="1"></el-option>
                            <el-option label="出租" value="2"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌查询"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">指标所有人</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.holder" placeholder="请输入指标所有人查询"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">使用机构</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.useAgency" placeholder="请输入使用机构查询"></el-input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">状态</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.indicatorStatus" placeholder="全部" clearable>
                            <el-option label="使用中" value="1"></el-option>
                            <el-option label="空闲" value="2"></el-option>
                            <el-option label="已到期" value="3"></el-option>
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
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)" v-if="scope.row.indicatorStatus == '空闲'">编辑</el-button>
                        <el-button v-show="showUseBtn" type="text" @click="use(scope.row.id)" v-if="scope.row.indicatorStatus == '空闲'" :disabled="useDisable">使用</el-button>
                        <el-button v-show="showDisableBtn" type="text" @click="disable(scope.row.id)" v-if="scope.row.indicatorStatus == '使用中'" :disabled="disDisable">停用</el-button>
                    </template>
                </el-table-column>

                <el-table-column min-width="140" label="指标编号" prop="indicatorNumber" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a size="mini" @click="record(scope.row)">{{scope.row.indicatorNumber}}</a>
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属城市" prop="ownCity" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="指标类型" prop="indicatorType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="指标所有人" prop="holder" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="到期日" prop="expiryDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="使用性质" prop="natureType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="使用机构" prop="useAgency" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="起租日期" prop="rentDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="截止日期" prop="endDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="状态" prop="indicatorStatus" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="companyId" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="创建人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="160" label="创建时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>


            </el-table>

        </div>
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
        name: 'plateManage',
        mixins: [tool],
        components: { TreeSelect,ConfirmForm,CitySelectPanel },
        data() {
            return {
                showSearch: false,
                searchParam: {},
                useDisable:false,
                disDisable:false,
                showAddBtn: this.getCurrentUserAuthority("plate/add"),
                showEditBtn: this.getCurrentUserAuthority("plate/edit"),
                showExportExcelBtn: this.getCurrentUserAuthority("plate/excel"),
                showUseBtn:this.getCurrentUserAuthority("plate/use"),
                showDisableBtn:this.getCurrentUserAuthority("plate/disable"),
                listUrl: 'base/plate',
                expiryDate:"",
                companyIds:"",
                nearCity4:[],
                indicatorType:[]
            }
        },
        activated(){
            this.useDisable = false;
            this.disDisable = false;
            this.getList();
        },
        mounted() {
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
                /*if (this.companyIds && this.companyIds.length>0) {
                    params.companyId = this.companyIds[0];
                    this.searchParam.companyId = this.companyIds[0];
                }else{
                    params.companyId = '';
                    this.searchParam.companyId = '';
                }*/

                if(this.nearCity4 && this.nearCity4.length>0){
                    params.ownCity=this.nearCity4[1];
                    this.searchParam.ownCity=this.nearCity4[1];
                }else{
                    params.ownCity='';
                    this.searchParam.ownCity='';
                }
                if(this.indicatorType && this.indicatorType.length>0){
                    params.indicatorType=this.indicatorType.join(',');
                    this.searchParam.indicatorType=this.indicatorType.join(',');
                }else{
                    params.indicatorType='';
                    this.searchParam.indicatorType='';
                }
            },
            exportExcel() {
                window.location = this.exportUrl("base/plate/excel?" + $.param(this.searchParam));
            },
            changeOrganization(data){
                if(this.companyIds && this.companyIds.length==1){
                    this.searchParam.companyId=this.companyIds[0];
                }else{
                    this.searchParam.companyId = '';
                    this.$set(this.searchParam,'organCascade',false);
                }
            },
            resetList(){
                this.searchParam={};
                this.$set(this.searchParam,'organCascade',false);
                this.expiryDate=[];
                this.companyIds=[];
                this.nearCity4=[];
                this.indicatorType=[];
                this.handleCurrentChange(1);
            },
            changeCity(){
                if(this.nearCity4 && this.nearCity4.length>=2)
                    this.searchParam.ownCity=this.nearCity4[1];
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
            use(id) {
                this.useDisable = true;
                let url = this.$route.fullPath + '/use/' + id;
                this.$router.push({path:url});
            },
            disable(id) {
                this.disDisable = true;
                let url = this.$route.fullPath + '/disable/' + id;
                this.$router.push({path:url});
            },
            record(row) {
                this.$router.push({path:"/tgpt_v2/plateManage/detail/"+row.id});
            },
        }
    }
</script>

