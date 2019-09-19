<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">型号名称</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.name" placeholder="请输入型号名称"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">产品类型</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.type" placeholder="不限">
                            <el-option label="OBD" value="1"></el-option>
                            <el-option label="GPS" value="2"></el-option>
                            <el-option label="SIM" value="3"></el-option>
                            <el-option label="无线设备" value="4"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
            </div>
        </div>
        <div class="tool-box">
            <div class="operation">
                <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
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
                <el-table-column fixed="left" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button v-show="showEditBtn" type="text" @click="edit(scope.row.id)">编辑</el-button>
                        <el-button v-show="showDeleteBtn" type="text" @click="del(scope.row.id)">删除</el-button>
                        <el-button v-if="scope.row.autoUpdateCode == 1" v-show="showAutoBtn" type="text" @click="update(scope.row.id,2)">手动升级</el-button>
                        <el-button v-if="scope.row.autoUpdateCode == 2" v-show="showAutoBtn" type="text" @click="update(scope.row.id,1)">自动升级</el-button>
                    </template>
                </el-table-column>

				<el-table-column min-width="120" label="型号名称" prop="name" sortable show-overflow-tooltip>					<template slot-scope="scope">
						<a size="mini" @click="toDetail(scope.row)">{{scope.row.name}}</a>
					</template></el-table-column>
				<el-table-column min-width="100" label="类型" prop="type" sortable></el-table-column>
				<el-table-column min-width="180" label="供应商" prop="supplierName" show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="型号描述" prop="summary" sortable show-overflow-tooltip></el-table-column>
				<el-table-column min-width="140" label="升级方式" prop="autoUpdate" ></el-table-column>
                <el-table-column min-width="140" label="创建人" prop="creater" ></el-table-column>
                <el-table-column min-width="140" label="创建时间" prop="createTime" ></el-table-column>

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
        name: 'equipmentModal',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                showSearch: false,
                searchParam: {
                },
                showEditBtn: this.getCurrentUserAuthority('equipmentModal/edit'),
                showAddBtn: this.getCurrentUserAuthority('equipmentModal/add'),
                showExportExcelBtn: this.getCurrentUserAuthority('equipmentModal/export'),
                showDeleteBtn: this.getCurrentUserAuthority('equipmentModal/delete'),
                showAutoBtn: this.getCurrentUserAuthority('equipmentModal/upgrade'),
                listUrl: 'base//baseEquipmentModal'
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
        },
        methods: {
            getListBefore(params) {

            },
            exportExcel() {
                window.location = this.exportUrl("base//baseEquipmentModal//excel?" + $.param(this.searchParam));
            },
            update(id,type){
                let autoUpdate = "";
                let title = "";
                if(type == 1){
                    autoUpdate = "1";
                    title = "是否确认自动升级?";
                }else if(type == 2){
                    autoUpdate = "2";
                    title = "是否确认手动升级?";
                }
                let url = "base/baseEquipmentModal/update";
                let data = {
                    id : id,
                    autoUpdate : autoUpdate,
                };
                this.$confirm(title, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.post(url,data).then(res => {
                        console.log();
                        if(res.status == 0){
                            this.$message({message: '操作成功！',type: 'success'});
                            this.getList();
                        }else {
                            this.$message.error(res.message);
                        }
                    });
                }).catch(() => {});
            },
            del(id){
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax.delete('base/baseEquipmentModal/' + id).then(result => {
                        if(result.status == 0){
                            this.showMessage("删除成功","success");
                            this.getList();
                        }else{
                            this.showMessage(result.message,"error");
                        }
                    });
                }).catch(() => {});
            }
        }
    }
</script>

