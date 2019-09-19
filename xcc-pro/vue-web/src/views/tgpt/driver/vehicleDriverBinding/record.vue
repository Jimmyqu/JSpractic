<template>

    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="操作记录" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">服务组织</label>
                        <div class="input-group">
                            <span>{{recordForm.companyName}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{recordForm.providerCompany}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车牌</label>
                        <div class="input-group">
                            <span>{{recordForm.plate}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车架号</label>
                        <div class="input-group">
                            <span>{{recordForm.vin}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">车型</label>
                        <div class="input-group">
                            <span>{{recordForm.modelName}}</span>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="app-container white-bg list-panel" v-cloak>
        <div class=" search-box" >

        </div>
        <div class="table-box">
            <el-table border :data="list" style="width: 100%">
                <el-table-column prop="driverName" sortable label="司机姓名" min-width="150"></el-table-column>
                <el-table-column prop="phone" sortable label="手机号" min-width="150"></el-table-column>
                <el-table-column prop="type" sortable label="操作类型" min-width="150"></el-table-column>
                <el-table-column prop="creater" sortable label="操作人" min-width="150"></el-table-column>
                <el-table-column prop="createTime" sortable label="操作时间" min-width="150"></el-table-column>
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
    </div>
</template>


<script>
        import ajax from '@/utils/request'
        import {tool} from '@/utils/common'

        export default {
            name: 'vehicleDriverBindingRecord',
            mixins: [tool],
            data(){
                return{
                    openCollapse: ["1"],
                    recordForm:{},
                    listUrl : "base/baseVehicleDriver/list?vehicleId="+this.$route.query.id,
                }

            },
            activated: function () {
                this.getList();
            },
            mounted: function () {
                this.getList();
                this.initData();
            },
            watch: {

            },
            methods: {
                initData(){
                    ajax.get('base/baseVehicleDriverBinding/detail/' + this.$route.query.id,).then(rs => {
                        this.recordForm = rs.data;
                    });
                }
            }
        }
    </script>
