<template>
    <div class="detail-panel">
        <div class="flex-panel detail-box">
            <div class="detail-item">
                <label class="control-label">车牌号</label>
                <div class="input-group">
                    <span>{{vehicleInfo.plate}}</span>
                </div>
            </div>
            <div class="detail-item">
                <label class="control-label">车架号</label>
                <div class="input-group">
                    <span>{{vehicleInfo.vin}}</span>
                </div>
            </div>
            <div class="detail-item">
                <label class="control-label">服务组织</label>
                <div class="input-group">
                    <span>{{vehicleInfo.organizationName}}</span>
                </div>
            </div>
        </div>
        <div class="table-box">
            <el-tabs v-model="searchParam.flag" @tab-click="tableClick()">
                <el-tab-pane label="有线设备" name="1"></el-tab-pane>
                <el-tab-pane label="无线设备" name="2"></el-tab-pane>
            </el-tabs>

            <el-table border :data="list" style="width: 100%">
                <el-table-column min-width="140" label="操作时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="设备SN" prop="sn" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="产品型号" prop="equipmentModal" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作类型" prop="type" sortable show-overflow-tooltip></el-table-column>
                <el-table-column v-if="searchParam.flag == '2'" min-width="140" label="安装位置" prop="location" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="200" label="操作说明" prop="summary" sortable show-overflow-tooltip></el-table-column>
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
        <!--<el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="有线设备" name="obd">

            </el-tab-pane>
           &lt;!&ndash; <el-tab-pane label="无线设备" name="gps">
                <div class="table-box">
                    <el-table border :data="list" style="width: 100%">
                        <el-table-column min-width="140" label="操作时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="设备SN" prop="sn" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="产品型号" prop="equipmentModal" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="安装位置" prop="location" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="操作类型" prop="type" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="140" label="操作人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column min-width="200" label="操作说明" prop="createTime" sortable show-overflow-tooltip></el-table-column>
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
            </el-tab-pane>&ndash;&gt;
        </el-tabs>-->


        <!--<div class="app-container white-bg list-panel" v-cloak>
            <div class="search-box" :class="{'hide-search':!showSearch}">
                <div class="form-box">
                    <div class="form-group">
                        <label class="control-label">IMEI</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.imei" clearable placeholder="请输入IMEI"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">设备号</label>
                        <div class="input-group">
                            <el-input v-model="searchParam.sn" clearable placeholder="请输入设备号"></el-input>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">库存状态</label>
                        <div class="input-group">
                            <el-select v-model="searchParam.stockStatus" clearable placeholder="请选择库存状态">
                                <el-option label="库存" :value="1"></el-option>
                                <el-option label="已出库" :value="2"></el-option>
                                <el-option label="已安装" :value="3"></el-option>
                                <el-option label="已激活" :value="4"></el-option>
                                <el-option label="已拆除" :value="5"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="search-btn-list">
                    <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                    <el-button type="primary" size="small" @click="getList()">查询</el-button>
                    <el-button size="small" @click="resetList()">重置</el-button>
                </div>
            </div>
            <div class="table-box">
                <el-table border :data="list" style="width: 100%">
                    <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="设备号(SN)" prop="sn" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column min-width="140" label="状态" prop="stockStatus" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-if="scope.row.stockStatus==1"><span>库存</span></template>
                            <template v-else-if="scope.row.stockStatus==2"><span>已出库</span></template>
                            <template v-else-if="scope.row.stockStatus==3"><span>已安装</span></template>
                            <template v-else-if="scope.row.stockStatus==4"><span>已激活</span></template>
                            <template v-else-if="scope.row.stockStatus==5"><span>已拆除</span></template>
                            <template v-else="scope.row.stockStatus==1"><span>/</span></template>
                        </template>
                    </el-table-column>
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
        </div>-->
    </div>

</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: "vehicleInstallManagementHistory",
        mixins: [tool],
        data() {
            return {
                show: true,
                showSearch: false,
                vehicleInfo: {},
                searchParam: {
                    id:this.$route.params.id,
                    equipmentType:1,
                    flag: "1",
                },
                activeName:"obd",
                id: this.$route.params.id,
                listUrl: 'base/vehicleInstall/history',
            }
        },
        methods: {
            handleClick(tab, event){
                if(this.activeName=="obd"){
                    this.listUrl='base/vehicleInstall/history';
                    this.searchParam.equipmentType=1;
                    this.getList();
                }
                if(this.activeName=="gps"){
                    this.listUrl='base/vehicleInstall/history';
                    this.searchParam.equipmentType=2;
                    this.getList();
                }
            },
            /*table页切换*/
            tableClick(){
                if(this.searchParam.flag == '1'){
                    this.searchParam.equipmentType = 1;
                }else {
                    this.searchParam.equipmentType = 2;
                }
                this.getList();
            },
        },
        mounted() {
            this.getList();
            ajax.get('base/vehicleInstall/vehicleinfo/' + this.id,).then(rs => {
                this.vehicleInfo = rs.data;
            });
        }

    }
</script>
