<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="table-box">
            <el-table border :data="list" style="width: 100%">
                <el-table-column min-width="140" label="操作时间" prop="createTime" sortable></el-table-column>
                <el-table-column min-width="140" label="设备号SN" prop="sn" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="手机号" prop="phone" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作类型" prop="type" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作人" prop="name" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="操作说明" prop="summary" sortable show-overflow-tooltip></el-table-column>
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
    </div>
</template>

<script>
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
    import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'equipmentWorkStatusSimDetail',
        mixins: [tool],
        data() {
            return {
                showSearch: false,
                showExportExcelBtn: true,
                listUrl: 'base/equipmentWorkStatus/equipmentSimBindList',
                equipmentId: this.$route.params.id
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList(callback){
                const params = Object.assign({},this.searchParam);
                params.equipmentId = this.equipmentId;
                /*params.simId = this.simId;*/

                params.size = this.pageSize;
                params.current = this.page;
                this.getListBefore(params);
                ajax.get(this.listUrl, params).then(res => {
                    this.list = res.records;
                    this.listCount = res.total;
                    $.isFunction(callback) && callback(res);
                    this.getListAfter(callback);
                })
            }
        }
    }
</script>

