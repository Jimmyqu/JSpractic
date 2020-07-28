<template>
    <div class="app-container white-bg list-panel newList-panel" v-cloak>
        <!-- 查询 -->
        <div class="search-box">
            <div class="form-box">

                <div class="form-group">
                    <label class="control-label">时间范围： {{searchParam.startTime}} 至 {{searchParam.endTime}}</label>
                </div>

                <div class="form-group">
                    <label class="control-label">车牌</label>
                    <div class="input-group">
                        <el-input v-model="searchParam.plate" placeholder="请输入车牌号"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn-list">

            </div>
        </div>
        <!-- 按钮 -->
        <div class="tool-box">
            <!--v-show="exportBtnShow"-->
            <div class="operation">
                <el-button size="mini" type="primary" class="defaultSearchButton" @click="handleCurrentChange(1)">查询</el-button>
                <el-button size="mini" @click="resetList()">重置</el-button>
                <el-button size="mini"  @click="exportExcel()">导出</el-button>
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
        <!-- 表格 table -->
        <div class="table-box">
            <el-table :ref="getRefName" :max-height="tableHeight" v-loading="listLoading" :data="list" style="width: 100%" border>
                <el-table-column prop="plate" sortable label="车牌号" min-width="120">
                </el-table-column>
                <el-table-column prop="imei" sortable label="IMEI" min-width="120"></el-table-column>
                <template v-for="(recode,i) in tableHeader">
                    <!--<el-table-column v-if="recode.prop === 'plate'" :prop="recode.prop" sortable :label="recode.label" min-width="120" :key="i">
                        <template slot-scope="scope">
                            {{scope.row.plate}}
                        </template>
                    </el-table-column>-->
                    <el-table-column v-if="!recode.children && recode.prop !== 'plate'" :prop="recode.prop" sortable :label="recode.label" min-width="120" :key="i">
                    </el-table-column>
                    <template v-else-if="recode.children">
                        <el-table-column sortable :label="recode.label" min-width="120" :key="i">
                            <el-table-column v-for="(children,i) in recode.children" :prop="children.prop" sortable :label="children.label" min-width="120" :key="i"></el-table-column>
                        </el-table-column>
                    </template>
                </template>

            </el-table>
        </div>
    </div>
</template>

<script>
    import {tool} from '@/utils/common'
    import TreeSelect from '@/components/TreeSelect/index'
    import {startProcessAsync,number_format} from '@/utils/index'
    import $ from 'jquery-slim'
    import MoneyInput from '@/components/MoneyInput/index'
    import {deepClone} from "../../../../utils"

    export default {
        name: 'oilDetail',
        mixins: [tool],
        components: { TreeSelect ,MoneyInput},
        data: function () {
            return {
                exportBtnShow:this.getCurrentUserAuthority("mileageOil/oilExcel"),
                listUrl:"report/mileageOil/oilDetailList",
                dialogForm:{},
                searchParam: {},
                tableHeader:[]
            }
        },
        activated(){
            this.getList();
        },
        mounted: function () {
            var param = this.$route.query.param;
            this.searchParam=JSON.parse(param);
            let endTime = this.searchParam.endTime;
            var endDate=new Date(endTime);
            endDate.setDate(endDate.getDate()-1);
            this.searchParam.endTime = endDate.format('yyyy-MM-dd');
            this.tableHeader.push({label:'车牌',prop:'plate'});
            let startTime = this.searchParam.startTime;

            var startDate=new Date(startTime);
            let time = startDate.format('yyyy-MM-dd');
            while(time != endTime){
                this.tableHeader.push({label:time,prop:time});
                startDate.setDate(startDate.getDate()+1);
                time = startDate.format('yyyy-MM-dd');
            }

            if(!this.$store.state.isInit){
                this.$store.state.isInit = true;
                this.getList();
            }
        },
        methods: {
            getListBefore(param) {
                var endDate = new Date(param.endTime)
                endDate.setDate(endDate.getDate()+1);
                param.endTime = endDate.format('yyyy-MM-dd');
            },
            resetList(){
                this.searchParam.plate='';
                this.getList();
            },
            exportExcel(){
                window.location = this.exportUrl("report/mileageOil/oilExcel?" + $.param(this.getListParam()));
            },getListParam(){
                let param=deepClone(this.searchParam);
                var endDate = new Date(param.endTime)
                endDate.setDate(endDate.getDate()+1);
                param.endTime = endDate.format('yyyy-MM-dd');
                return param
            }
        }
    }
</script>

