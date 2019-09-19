<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button size="mini" v-show="exportShow" @click="exportData()">导出</el-button>
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
        <!-- 列表跟分页 -->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading":data="list" border style="width: 100%">
                <el-table-column prop="companyName" sortable label="所属组织" width="120"></el-table-column>
                <el-table-column prop="carUseMonth" sortable label="月份" width="120"></el-table-column>
                <!--<el-table-column prop="endDate" sortable label="结束日期" width="120"></el-table-column>-->
                <el-table-column prop="projectVehicleSettlementNo" sortable label="项目每月结算单" width="220"></el-table-column>
                <el-table-column prop="plate" sortable label="车辆" width="100"></el-table-column>
                <el-table-column prop="vehicleModel" sortable show-overflow-tooltip label="车型" width="140"></el-table-column>
                <el-table-column prop="actualDeliveryDate" sortable label="购入日期" width="120"></el-table-column>
                <el-table-column prop="month" sortable label="车龄（月）" width="100"></el-table-column>
                <el-table-column prop="unitPrice" sortable label="购置价" width="100"></el-table-column>
                <el-table-column prop="vehicleRental" sortable label="月租金" width="100"></el-table-column>
                <el-table-column prop="maintenanceCost" sortable label="保养" width="100"></el-table-column>
                <el-table-column prop="insuranceCost" sortable label="保险" width="100"></el-table-column>
                <el-table-column prop="depreciationCost" sortable label="折旧" width="100"></el-table-column>
                <el-table-column prop="profits" sortable label="利润" width="100"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import $ from 'jquery-slim'

    export default {
        name: 'trafficProfit',
        mixins: [tool],
        data(){
            return {
                /** table */
                listUrl:"/base/profit/list",
                /** 权限 */
                exportShow : this.getCurrentUserAuthority("profit/export"),
                detailShow : this.getCurrentUserAuthority("profit/detail"),
            }
        },

        activated(){
            this.getList();
        },
        mounted: function (){
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            //导出
            exportData() {
                window.location = this.exportUrl("base/profit/export?" + $.param(this.searchParam));
            },

            // 计算利润
            /*getProfits(){
                this.list.forEach(item => {
                    item['_profit'] = item.vehicleRental - (item.insuranceCost ? item.insuranceCost : 0)
                        - (item.maintenanceCost ? item.maintenanceCost : 0) - (item.depreciationCost ? item.depreciationCost : 0);
                });
            }*/
        }
    }
</script>

