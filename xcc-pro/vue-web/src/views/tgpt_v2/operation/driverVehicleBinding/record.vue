<template>

    <div class="detail-panel">
        <el-collapse v-model="openCollapse">
            <el-collapse-item title="操作记录" name="1" >
                <div class="flex-panel detail-box">
                    <div class="detail-item">
                        <label class="control-label">司机姓名</label>
                        <div class="input-group">
                            <span>{{recordForm.name}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">司机手机号</label>
                        <div class="input-group">
                            <span>{{recordForm.phone}}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <label class="control-label">所属组织</label>
                        <div class="input-group">
                            <span>{{recordForm.organizationName}}</span>
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
                <el-table-column prop="typeText" sortable label="操作类型" min-width="150"></el-table-column>
                <el-table-column prop="creater" sortable label="操作人" min-width="150"></el-table-column>
                <el-table-column prop="createTime" sortable label="操作时间" min-width="150"></el-table-column>
                <el-table-column prop="plate" sortable label="车牌" min-width="150"></el-table-column>
                <el-table-column prop="vehicleModelInfoName" sortable label="车型" min-width="150"></el-table-column>
                <el-table-column prop="colorText" sortable label="颜色" min-width="150"></el-table-column>
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
        import $ from 'jquery-slim'

        export default {
            name: 'driverVehicleBindingRecord',
            mixins: [tool],
            data(){
                return{
                    openCollapse: ["1"],
                    recordForm:{},
                    listUrl: "operation_base/driverVehicleBinding/bindList?value="+this.$route.query.id,
                }

            },
            activated: function () {
                this.getList();
            },
            mounted: function () {
                this.initData();
                if(!this.$store.state.isInit){
                    this.$store.state.isInit = true;
                    this.getList();
                }
            },
            watch: {

            },
            methods: {
                initData(){
                    ajax.get('operation_base/driverVehicleBinding/driverInfo/' + this.$route.query.id,).then(rs => {
                        this.recordForm = rs.data;
                    });
                }
            }
        }
    </script>
