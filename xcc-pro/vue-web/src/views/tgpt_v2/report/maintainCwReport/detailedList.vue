<template>
    <el-dialog title="保养记录" :visible.sync="driverShow" :append-to-body="true" width="70%" >
        <div class="wrapper wrapper-content  fadeInRight list-panel" v-cloak>

            <div class="row">
                <el-table :data="list" style="width: 100%;" border>
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

            <div class="left-row" style="padding-bottom: 20px" v-show="flag">
                <el-button type="primary" @click="confirmPublish()">确认发布</el-button>
                <el-button @click="cancel()">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    export default {
        name: "maintainCwDetailedList",
        mixins: [tool],
        components:{TreeSelect},
        data(){
            return {
                driverShow:false,
                flag:'',
                listUrl:'report/maintainCwReport/detailedList',
            }
        },
        methods:{
            open(startTime,endTime,key,organizationId){
                this.searchParam={
                    startTime:startTime,
                    endTime:endTime,
                    key:key,
                    organizationId:organizationId
                };
                this.list = []
                this.driverShow = true;
                this.handleCurrentChange(1);
            },
        },
        mounted(){

        }
    }
</script>
