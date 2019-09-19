<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="tool-box">
            <div class="operation">
                <p><span>{{recordForm.plate}}（{{recordForm.assetsTypeText}}）{{recordForm.modelInfoName}}，服务组织：{{recordForm.serviceOrganizationName}}</span></p>
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
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="编号" prop="miCode" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="记录时间" prop="createTime" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="本期保养日期" prop="miDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="本期保养里程" prop="miMileage" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="300" label="保养项目" prop="miOtherProject" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="本期费用" prop="miCost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="保养人" prop="miOperator" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="登记人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100" label="修改人" prop="updater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="150" label="修改时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>
            </el-table>
            
        </div>
    </div>
</template>

<script>
    import TreeSelect from '@/components/TreeSelect/index'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'

    export default {
        name: 'maintainCwRecord',
        mixins: [tool],
        components: { TreeSelect},
        data() {
            return {
                recordForm:{},
                listUrl: 'traffic/trafficVehicleMaintainCw/historyList'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.recordForm={
                plate:this.$route.query.plate,
                assetsTypeText:this.$route.query.assetsTypeText,
                serviceOrganizationName:this.$route.query.serviceOrganizationName,
                modelInfoName:this.$route.query.modelInfoName,
            };
            this.searchParam.id=this.$route.query.id;
            this.searchParam.serviceRegionId=this.$route.query.serviceRegionId;
            this.getList();
        },
        methods: {

        }
    }
</script>

