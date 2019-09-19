<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">产品类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentType" placeholder="不限" clearable>
                            <el-option label="OBD" value="1"></el-option>
                            <el-option label="GPS" value="2"></el-option>
                            <el-option label="SIM" value="3"></el-option>
                            <el-option label="无线设备" value="4"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentId" clearable filterable placeholder="请选产品型号">
                            <el-option v-for="item in equipmenModels" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">订单号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" placeholder="请输入订单号" clearable></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">IMEI/SIM卡</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.imei" placeholder="请输入IMEI/SIM卡" clearable></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-arrow-right" @click="showSearch=!showSearch"></i>
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">设备入库</el-button>
                <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button v-show="showExportBtn" size="mini" @click="exportExcel()">导出</el-button>
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
                        <el-button v-show="showDetailBtn" type="text" @click="toDetail(scope.row)">明细</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="140" label="订单号" prop="code" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="100" label="产品类型" prop="equipmentType" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="产品型号" prop="equipmentName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="供应商" prop="supplierName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="数量" prop="quantity" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="入库人" prop="creater" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="150" label="入库时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>

    import ajax from '@/utils/request'
    import {tool, ruleTool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'equipmentStorageIn',
        mixins: [tool],
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showDetailBtn: this.getCurrentUserAuthority('equipmentStorageIn/detail'),
                showAddBtn: this.getCurrentUserAuthority('equipmentStorageIn/add'),
                equipmenModels:[],
                showExportBtn: this.getCurrentUserAuthority('equipmentStorageIn/export'),
                listUrl: 'base//baseEquipmentToStore/list'
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
            this.getEquipmenModels();
        },
        methods: {
            getEquipmenModels(){
                ajax.get('base/baseEquipmentOutput/equipmentModalList').then(res=>{
                    this.equipmenModels=res;
                });
                /*ajax.get('/base/baseEquipmentModal/equipmentModalSelect' ).then(rs => {
                    this.equipmenModels = rs;
                });*/
            },
            exportExcel() {
                window.location = this.exportUrl("base/baseEquipmentToStore/export?" + $.param(this.searchParam));
            },
            toDetail(row){
                let url=this.$route.fullPath;
                if(row.equipmentType=="SIM"){
                    if(~this.$route.fullPath.indexOf("/detailsim/")){
                        return;
                    }
                    this.$router.push({path:url+"/detailsim/"+row.id});
                }else{
                    if(~this.$route.fullPath.indexOf("/detailobd/")){
                        return;
                    }
                    this.$router.push({path:url+"/detailobd/"+row.id});
                }

            },
        }
    }
</script>

