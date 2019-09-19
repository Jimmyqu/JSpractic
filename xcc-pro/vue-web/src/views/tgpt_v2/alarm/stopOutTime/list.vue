<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <div class="search-box" >
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">服务组织</label>
                    <div class="input-group">
                        <tree-select v-model="organization" placeholder="请选择服务组织" type="one" clearable
                                     url="admin/organization/tree?noManager=noManager" @change="changeOrganization"></tree-select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">日期</label>
                    <div class="input-group">
                        <el-date-picker
                            v-model="creatDate"
                            @change="creatDateChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">关键字</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.key" placeholder="车牌、IMEI号" clearable></el-input>
                    </div>
                </div>


            </div>
            <div class="search-btn-list">

            </div>
        </div>

        <!-- 按钮 -->
        <div class="tool-box">
            <div class="operation">
                <el-button type="primary" size="mini"    @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini" v-show="exportBtnShow" @click="exportExcel()">导出</el-button>
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
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading"border :data="list" style="width: 100%">
                <el-table-column min-width="140" label="车牌" prop="plate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="IMEI号" prop="imei" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="所属组织" prop="companyName" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="停车时间" prop="startDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="报警时间" prop="recordDate" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="停车地点" prop="address" sortable show-overflow-tooltip></el-table-column>
                <el-table-column min-width="140" label="超时停车设置名称" prop="name" sortable show-overflow-tooltip></el-table-column>

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
        name: 'stopOutTime',
        mixins: [tool],
        components: { TreeSelect },
        data() {
            return {
                exportBtnShow: this.getCurrentUserAuthority("obdStopOutTime/exportExcel"),
                showDetailBtn: true,
                organization:[],
                creatDate:[],
                searchParam: {
                },
                listUrl: 'obd/obdStopOutTime/list',
            }
        },
        activated(){
            this.getList();
        },
        mounted() {
            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            resetList(){
                this.searchParam={};
                this.organization=[];
                this.creatDate=[];
                this.getList();
            },
            getListBefore(params) {
                params=this.getParams(params);
            },
            exportExcel(){
                var params=this.getParams(this.searchParam);
                window.location = this.exportUrl("obd/obdStopOutTime/export?" + $.param(params));
            },getParams(param){
                var params = param;
                if(this.organization && this.organization.length==1){
                    params.organizationId = this.organization[0];
                }else {
                    delete params.organizationId;
                }

                if(this.creatDate && this.creatDate.length>0){
                    let creatDate = this.creatDate;
                    params.startTime = creatDate[0] + ' 00:00:00';
                    params.endTime = creatDate[1] + ' 23:59:59';
                }else{
                    params.startTime=null;
                    params.endTime=null;
                }
                return params;
            }

        }
    }
</script>

