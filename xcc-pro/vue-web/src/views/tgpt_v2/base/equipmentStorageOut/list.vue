<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentType" clearable placeholder="">
                            <el-option label="OBD" :value="1"></el-option>
                            <el-option label="GPS" :value="2"></el-option>
                            <el-option label="SIM" :value="3"></el-option>
                            <el-option label="无线设备" :value="4" ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentName" clearable placeholder="请选择产品型号">
                            <el-option v-for="item in equipmentModalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" clearable placeholder="请输入订单号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">IMEI/SIM卡</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.imei" clearable placeholder="请输入IMEI/SIM卡"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">设备出库</el-button>
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
            <p class="summary"><span>累计数量:</span><span>{{statistics.totalQuantity}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>累计金额:</span><span>{{statistics.totalAmount}}</span></p>
            <el-table  :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="toDetail(scope.row)">明细</el-button>
                       <!-- <el-button v-show="showEditBtn" type="text" @click="del(scope.row.id)">删除</el-button>-->
                    </template>
                </el-table-column>
				<el-table-column min-width="140" label="订单号" prop="code" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="产品类型" prop="equipmentType" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="产品型号" prop="equipmentName" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column min-width="100" label="数量" prop="quantity" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="管理公司" prop="organizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="收货地址" prop="address" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="收货人" prop="receiver" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="联系电话" prop="phone" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="操作人" prop="creater" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="出库时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
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
        name: 'baseEquipmentOutput',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                statistics:{},
                showEditBtn: this.getCurrentUserAuthority('baseEquipmentOutput/detail'),
                showAddBtn: this.getCurrentUserAuthority('baseEquipmentOutput/add'),
                showExportExcelBtn: this.getCurrentUserAuthority('baseEquipmentOutput/export'),
                equipmentModalList:[],
                listUrl: 'base/baseEquipmentOutput/list'
            }
        },
        activated(){
            this.getList();
            this.getStatistics();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
            this.getEquipmentModalList();
            this.getStatistics();
        },
        methods: {
            getListBefore(params) {

            },
            add(){
                this.$router.push({path:"/tgpt_v2/base/equipmentStorageOut/add"});
            },
            toDetail(row){
                debugger

                let url=this.$route.fullPath;
                if(row.equipmentType=="OBD" || row.equipmentType=="GPS" || row.equipmentType=="无线设备"){
                    if(~this.$route.fullPath.indexOf("/detail/")){
                        return;
                    }
                    this.$router.push({path:url+"/detail/"+row.id});
                } else if(row.equipmentType=="SIM"){
                    if(~this.$route.fullPath.indexOf("/detail2/")){
                        return;
                    }
                    this.$router.push({path:url+"/detail2/"+row.id});
                }

            },
            del(id){
                this.$confirm('你确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.get('base/baseEquipmentOutput/del/'+id).then(
                        res=>{
                            if(res.status==0){
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            }else{
                                this.$message({
                                    message: '删除失败',
                                    type: 'error'
                                });
                            }
                        }
                    );
                });
            },
            exportExcel() {
                window.location = this.exportUrl("base/baseEquipmentOutput/export?" + $.param(this.searchParam));
            },
            getEquipmentModalList(){
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equipmentModalList=res;
                });
            },
            getStatistics(){
                ajax.get('base/baseEquipmentOutput/statistics').then(res=>{
                    this.statistics=res;
                });
            }
        }
    }
</script>

