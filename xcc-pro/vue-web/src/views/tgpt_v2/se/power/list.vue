<template>
    <div class="app-container white-bg list-panel" v-cloak>
        <div class="search-box" :class="{'hide-search':!showSearch}">
            <div class="form-box">
                <div class="form-group">
                    <label class="control-label">所属部门</label>
                    <div class="input-group">
                        <tree-select v-model="orgIds" placeholder="请选择" type="one"
                               @change="chooseOrgId"      url="admin/organization/tree"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.code" placeholder="车牌、IMEI" clearable />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group" style="width: 300px;">
                        <el-date-picker
                            v-model="createDate"
                            type="datetimerange"
                            @change="chooseTime"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">产品型号</label>
                    <div class="input-group">
                        <el-select v-model="searchParam.equipmentModal"  placeholder="不限">
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">
                <i class="el-icon-d-arrow-right" @click="showSearch=!showSearch"></i>
                <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="small" @click="resetList()">重置</el-button>
            </div>
        </div>
        <div class="tool-box">
            <el-button v-show="showAddBtn" type="warning" size="mini" @click="add()">新增</el-button>
            <el-button v-show="showExportExcelBtn" size="mini" @click="exportExcel()">导出数据</el-button>
        </div>

        <div class="table-box">
            <el-table v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column prop="createTime" label="产生时间" min-width="120"></el-table-column>
                <el-table-column prop="imei" label="IMEI" min-width="100" ></el-table-column>
                <el-table-column prop="plate" label="车牌" min-width="80"></el-table-column>
                <el-table-column prop="organization" label="所属部门" min-width="100" ></el-table-column>
                <el-table-column prop="modeName" label="车型" min-width="80"></el-table-column>
                <el-table-column prop="power" label="电池电量(%)" min-width="100" ></el-table-column>
                <el-table-column prop="networkSignal" label="通讯信号" min-width="80"></el-table-column>
                <el-table-column prop="phone" label="通讯卡号" min-width="100" ></el-table-column>
                <el-table-column prop="speed" label="速度(km/h)" min-width="80"></el-table-column>
                <el-table-column prop="direction" label="方向" min-width="100" ></el-table-column>
                <el-table-column prop="localtion" label="位置" min-width="100" ></el-table-column>
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
    import TreeSelect from '@/components/TreeSelect/index'
    import ajax from '@/utils/request'
    import {tool} from '@/utils/common'
	import {startProcessAsync} from '@/utils/index'
    import $ from 'jquery-slim'

    export default {
        name: 'power',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                createDate:[],
                orgIds: [],
                showSearch: false,
                searchParam: {},
                showEditBtn: true,
                showAddBtn: false,
                showExportExcelBtn: this.getCurrentUserAuthority('power/export'),
                options: [],
                listUrl: 'obd/obdAlarmPower/list'
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            this.getList();
            ajax.get('obd/obdAlarmPower/getEquipmentModal').then(rs => {
                if(rs && rs.length > 0){
                    this.options = rs;
                }
            });
        },
        methods: {
            getListBefore(params) {

            },

            /*选择时间*/
            chooseTime(){
                if(this.createDate && this.createDate.length > 0){
                    this.searchParam.startTime = this.createDate[0];
                    this.searchParam.endTime = this.createDate[1];
                }else{
                    this.searchParam.startTime = null;
                    this.searchParam.endTime = null;
                }
            },

            /*选择用户组织*/
            chooseOrgId(){
                if(this.orgIds && this.orgIds.length > 0){
                    this.searchParam.organizationId = this.orgIds[0];
                }else{
                    this.searchParam.organizationId = null;
                }
            },

            /*重置*/
            resetList(){
                this.orgIds = [];
                this.createDate = [];
                this.searchParam = {};
                this.getList();
                this.handleCurrentChange(1);
            },

            exportExcel() {
                var params= this.searchParam;
                if (this.orgIds && this.orgIds.length>=1){
                    params.organizationId = this.orgIds[0];
                }
                if(this.createDate && this.createDate.length > 1){
                    params.startTime = this.createDate[0];
                    params.endTime = this.createDate[1];
                }
                window.location = this.exportUrl("obd/obdAlarmPower/excel?" + $.param(this.searchParam));
            }
        }
    }
</script>

