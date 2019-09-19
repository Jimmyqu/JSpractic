<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!--查询条件-->
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">车辆</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" autocomplete="off" type="text" placeholder="请输入车辆"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">车型</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.modelName" autocomplete="off" type="text" placeholder="请输入车型"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">所属组织</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.companyName" autocomplete="off" type="text" placeholder="请输入所属组织"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">服务客户</label>
                    <div class="input-group">

                        <el-input v-model="searchParam.serviceName" autocomplete="off" type="text" placeholder="请输入编号"></el-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">合同编号</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.contractNumber" autocomplete="off" type="text" placeholder="请输入合同编号"></el-input>
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
                <el-button type="small" @click="resetList();" size="mini">重置</el-button>
                <el-button class="btn btn-border btn-sm" @click="exportData()" v-show="exportShow">导出数据</el-button>
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
        <!--grid列表部分-->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width:100%;" border>
                <!--<el-table-column fixed="left" label="操作" min-width="100">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button @click="deleteDriverAndCarInfo(scope.row)" type="text" size="small">删除</el-button>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="driverName" sortable label="司机" min-width="100">
                    <template slot-scope="scope">
                        <a size="mini" @click="toDetail(scope.row)">{{scope.row.driverName}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="plate" sortable label="车辆" min-width="100"></el-table-column>
                <el-table-column prop="modelName" sortable show-overflow-tooltip label="车型" min-width="300"></el-table-column>
                <el-table-column prop="companyName" sortable label="所属组织" min-width="200"></el-table-column>
                <el-table-column prop="serviceName" sortable label="服务客户" min-width="200"></el-table-column>
                <el-table-column prop="contractNumber" sortable label="合同编号" min-width="200"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'driverAndCar',
        mixins: [tool],
        data() {
            return {
                showSearch: false,
                listUrl:"/base/driverAndVehicle/list",
                exportShow : this.getCurrentUserAuthority("driverAndVehicle/export"),
                detailShow : this.getCurrentUserAuthority("driverAndVehicle/detail"),
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
            exportData() {
                location.href = this.exportUrl("base/driverAndVehicle/export?" + $.param(this.searchParam));
            }
        }
    }
</script>

