<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="tool-box">
            <div class="operation">
                <p><span>{{recordForm.plate}}（{{recordForm.assetsTypeText}}）{{recordForm.modelInfoName}}，所属部门：{{recordForm.organizationName}}</span></p>
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
                <el-table-column min-width="140" label="所属组织" prop="providerOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="服务组织" prop="serviceOrganizationName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="年检日期" prop="operateDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="检验结果" prop="result" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="检验合格有效期" prop="effectiveDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="检验单位" prop="department" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="年检费用" prop="cost" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="年检办理人" prop="operator" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="登记人" prop="creater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="修改人" prop="updater" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="修改时间" prop="updateTime" sortable show-overflow-tooltip></el-table-column>

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
        name: 'annualRecord',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                recordForm:{},
                listUrl: 'traffic/coreAnnualInspection/historyList'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.recordForm={
                id:this.$route.query.id,
                plate:this.$route.query.plate,
                assetsTypeText:this.$route.query.assetsTypeText,
                organizationName:this.$route.query.organizationName,
                modelInfoName:this.$route.query.modelInfoName,
            };
            this.searchParam.id=this.$route.query.id;
            this.getList();
        },
        methods: {

        }
    }
</script>

